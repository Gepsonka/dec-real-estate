// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC1155Marketplace is ERC1155Holder {
    using SafeMath for uint256;

    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerToken;
        bool active;
    }

    IERC1155 public nftContract;
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 tokenId, uint256 amount, uint256 pricePerToken);
    event ListingCancelled(uint256 indexed listingId);
    event TokensPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount);

    constructor(address _nftContract) {
        nftContract = IERC1155(_nftContract);
    }

    function createListing(uint256 _tokenId, uint256 _amount, uint256 _pricePerToken) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_pricePerToken > 0, "Price must be greater than 0");
    
        nftContract.safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

        listingCounter++;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            tokenId: _tokenId,
            amount: _amount,
            pricePerToken: _pricePerToken,
            active: true
        });

        emit ListingCreated(listingCounter, msg.sender, _tokenId, _amount, _pricePerToken);
    }

    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing is not active");
        require(listing.seller == msg.sender, "Only seller can cancel listing");

        listing.active = false;
        nftContract.safeTransferFrom(address(this), msg.sender, listing.tokenId, listing.amount, "");

        emit ListingCancelled(_listingId);
    }

    function purchaseTokens(uint256 _listingId, uint256 _amount) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing is not active");
        require(_amount > 0 && _amount <= listing.amount, "Invalid amount");

        uint256 totalPrice = listing.pricePerToken.mul(_amount);
        require(msg.value >= totalPrice, "Insufficient payment");

        listing.amount = listing.amount.sub(_amount);
        if (listing.amount == 0) {
            listing.active = false;
        }

        nftContract.safeTransferFrom(address(this), msg.sender, listing.tokenId, _amount, "");
        
        uint256 sellerProceeds = totalPrice;
        payable(listing.seller).transfer(sellerProceeds);

        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit TokensPurchased(_listingId, msg.sender, _amount);
    }


    function getListingById(uint256 _listingId) public view returns (Listing memory) {
        Listing storage listing = listings[_listingId];
        // require(listing.active, "Listing is not active");
        return listing;
    }

    function getAllActiveListings() external view returns (Listing[] memory) {
        Listing[] memory newListings = new Listing[](listingCounter);
        uint256 index = 0;
        for (uint256 i = 0; i < listingCounter; i++) {
            newListings[index] = listings[i];
            index++;
        }
        return newListings;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "hardhat/console.sol";

contract RealEstateToken is ERC1155, Ownable, ERC1155Pausable, ERC1155Burnable {
    uint256 private currentTokenId;

    struct Token {
        uint256 tokenId;
        uint256 supply;
    }
    /**
     * Represents a token that is on sale.
     * @param tokenId
     */
    struct TokenOnSale {
        Token token;
        address beingSoldBy;
        uint256 pricePerToken;
        uint256 amount;
    }

    /**
     * Used to keep track if the owner has the specific type of token.
     * The amount can be fetched from the balanceOf function.
     * @param tokenId Token ID
     */
    struct TokenWithOwner {
        address owner;
        uint256 tokenId;
    }

    event TokenCreated(uint256 indexed tokenId);

    error ItemNotFound(uint256 tokenId, address owner);

    mapping(uint256 => Token) private tokens;

    TokenWithOwner[] private tokenOwnership;

    TokenOnSale[] private tokensOnSale;

    constructor(
        address initialOwner
    )
        ERC1155("http://localhost:3000/api/realEstate/{id}")
        Ownable(initialOwner)
    {
        currentTokenId = 1;
    }

    function createToken(uint256 supply) public {
        _mint(msg.sender, currentTokenId, supply, "0x0");
        tokens[currentTokenId] = Token(currentTokenId, supply);

        tokenOwnership.push(TokenWithOwner(msg.sender, currentTokenId));

        emit TokenCreated(currentTokenId);

        currentTokenId++;
    }

    /** 
    * This is an inefficient way to put up tokens for sale.
    * This is a demo, IRL prod this should be rewritten because with tens
    * of thousands of real estates the gas will be high
    */
    function putTokenUpToSale(
        uint256 tokenId,
        uint256 pricePerToken,
        uint256 amount
    ) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "Account does not have enough tokens to sell");

        // Check if the user already has this token on sale, if it does modify
        for (uint256 i = 0; i < tokensOnSale.length; i++) {
            // No need to check enything else since we are sure the user has the tokens needed in the require statement
            if (tokensOnSale[i].token.tokenId == tokenId && tokensOnSale[i].beingSoldBy == msg.sender) {
                tokensOnSale[i].pricePerToken = pricePerToken;
                tokensOnSale[i].amount = amount;
                return;
            }
        }

        tokensOnSale.push(TokenOnSale(
            tokens[tokenId],
            msg.sender,
            pricePerToken,
            amount
        ));
    }

    function getAllTokensOnSale() public view returns (TokenOnSale[] memory) {
        return tokensOnSale;
    }

    function buyToken(
        uint256 tokenId,
        address payable from,
        uint256 amount
    ) public payable {
        require(balanceOf(from, tokenId) >= amount, "Account does not have the required amount of tokens");

        (TokenOnSale memory tokenOnSale, uint256 index) = getTokenOnSaleByIdAndAddress(tokenId, from);

        console.log("token saleprice: ", tokenOnSale.pricePerToken);
        console.log("amount: ", amount);
        console.log("msg.value: ", msg.value);

        require(tokenOnSale.beingSoldBy != msg.sender, "Cannot buy own tokens");
        require(tokenOnSale.amount > amount, "Account does not sell that much token.");
        require((tokenOnSale.pricePerToken * amount) <= msg.value, "Price and ether sent does not match.");

        (bool sent, ) = from.call{value: msg.value}("");
        
        require(sent, "Failed to send ether");

        safeTransferFrom(from, msg.sender, tokenId, amount, "");

        // token transfer already happened
        if (tokenOnSale.amount == amount) {
            deleteTokenOnSaleByIdAndAddress(tokenId, from);

            if (balanceOf(from, tokenId) == 0) {
                deleteTokenOwnership(tokenId, from);
            }
        } else {
            tokensOnSale[index].amount = tokensOnSale[index].amount - amount;
        }

        if (balanceOf(msg.sender, tokenId) == amount) {
            tokenOwnership.push(TokenWithOwner(msg.sender, tokenId));
        }

    }

    function getTokenOnSaleByIdAndAddress(uint256 tokenId, address owner) public view returns (TokenOnSale memory, uint256 index) {
        for (uint256 i = 0; i < tokensOnSale.length; i++) {
            if (tokensOnSale[i].token.tokenId == tokenId && tokensOnSale[i].beingSoldBy == owner) {
                return (tokensOnSale[i], i);
            }
        }

        revert ItemNotFound(tokenId, owner);
    }

    function deleteTokenOnSaleByIdAndAddress(uint256 tokenId, address owner) private returns (TokenOnSale memory) {
        for (uint256 i = 0; i < tokensOnSale.length; i++) {
            if (tokensOnSale[i].token.tokenId == tokenId && tokensOnSale[i].beingSoldBy == owner) {
                TokenOnSale memory tokenOnSale = tokensOnSale[i];
                tokensOnSale[i] = tokensOnSale[tokensOnSale.length - 1];
                tokensOnSale.pop();
                return tokenOnSale;
            }
        }

        revert ItemNotFound(tokenId, owner);
    }

    function deleteTokenOwnership(uint256 tokenId, address owner) private returns (TokenWithOwner memory) {
        for (uint256 i = 0; i < tokenOwnership.length; i++) {
            if (tokenOwnership[i].tokenId == tokenId && tokenOwnership[i].owner == owner) {
                TokenWithOwner memory tokenWithOwner = tokenOwnership[i];
                tokenOwnership[i] = tokenOwnership[tokenOwnership.length - 1];
                tokenOwnership.pop();

                return tokenWithOwner;
            }
        }

        revert ItemNotFound(tokenId, owner);
    }

    receive() external payable {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Pausable) {
        super._update(from, to, ids, values);
    }

    function getCurrentTokenId() public view returns (uint256) {
        return currentTokenId;
    }
}

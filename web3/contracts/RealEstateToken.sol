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
        Token token;
    }

    struct TokenBuyRequest {
        address buyer;
        uint256 amount;
        uint256 offeredPricePerToken; // never lower than min listing price
        TokenOnSale tokenOnSale;
    }

    event TokenCreated(address indexed createdBy, uint256 indexed tokenId);

    error ItemNotFound(uint256 tokenId, address owner);

    mapping(uint256 => Token) private tokens;

    TokenWithOwner[] private tokenOwnership;

    TokenOnSale[] private _tokensOnSale;

    TokenBuyRequest[] private _tokenBuyRequests;

    constructor(
        address initialOwner
    )
        ERC1155("http://localhost:3000/api/realEstate/{id}")
        Ownable(initialOwner)
    {
        currentTokenId = 1;
    }

    function getAllOwnedTokens() public view returns (TokenWithOwner[] memory) {
        uint256 count;
        for (uint256 i = 0; i < tokenOwnership.length; i++) {
            if (tokenOwnership[i].owner == msg.sender) {
                count++;
            }
        }

        TokenWithOwner[] memory tempTokenOwnership = new TokenWithOwner[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < tokenOwnership.length; i++) {
            if (tokenOwnership[i].owner == msg.sender) {
                tempTokenOwnership[index] = tokenOwnership[i];
                index++;
            }
        }

        return tempTokenOwnership;

    }

    function createToken(uint256 supply) public {
        _mint(msg.sender, currentTokenId, supply, "0x0");
        tokens[currentTokenId] = Token(currentTokenId, supply);

        tokenOwnership.push(TokenWithOwner(msg.sender, Token(currentTokenId, supply)));

        emit TokenCreated(msg.sender, currentTokenId);

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
        for (uint256 i = 0; i < _tokensOnSale.length; i++) {
            // No need to check enything else since we are sure the user has the tokens needed in the require statement
            if (_tokensOnSale[i].token.tokenId == tokenId && _tokensOnSale[i].beingSoldBy == msg.sender) {
                _tokensOnSale[i].pricePerToken = pricePerToken;
                _tokensOnSale[i].amount = amount;
                return;
            }
        }

        _tokensOnSale.push(TokenOnSale(
            tokens[tokenId],
            msg.sender,
            pricePerToken,
            amount
        ));
    }

    function getAllTokensOnSale() public view returns (TokenOnSale[] memory) {
        return _tokensOnSale;
    }

    function placeBuyRequest(uint256 tokenId, address from, uint256 amount) public payable {
        require(balanceOf(from, tokenId) >= amount, "Account does not have the required amount of tokens");

        (TokenOnSale memory tokenOnSale, uint256 index) = getTokenOnSaleByIdAndAddress(tokenId, from);

        console.log("token saleprice: ", tokenOnSale.pricePerToken);
        console.log("amount: ", amount);
        console.log("msg.value: ", msg.value);

        require(tokenOnSale.beingSoldBy != msg.sender, "Cannot buy own tokens");
        require(tokenOnSale.amount >= amount, "Account does not sell that much token.");
        require((tokenOnSale.pricePerToken * amount) <= msg.value, "Ethers sent must be greater or equal the listing price.");

        for (uint256 i = 0; i < _tokenBuyRequests.length; i++) {
            if (_tokenBuyRequests[i].buyer == msg.sender && _tokenBuyRequests[i].tokenOnSale.beingSoldBy == from && _tokenBuyRequests[i].tokenOnSale.token.tokenId == tokenId) {
                revert("ACCOUNT_ALREADY_HAS_REQUEST");
            }
        }


        _tokenBuyRequests.push(TokenBuyRequest(
            msg.sender,
            amount,
            msg.value / amount,
            tokenOnSale
        ));

    }

    function getAccountTokenBuyRequests() public view returns (TokenBuyRequest[] memory) {
        uint256 matchCount = 0;
        for (uint256 i = 0; i < _tokenBuyRequests.length; i++ ) {
            if (_tokenBuyRequests[i].tokenOnSale.beingSoldBy == msg.sender) {
                //tokenBuyRequests.push(_tokenBuyRequests[i]);
                matchCount++;
            }
        }

        TokenBuyRequest[] memory tokenBuyRequests = new TokenBuyRequest[](matchCount);
        uint256 index = 0;
        for (uint256 i = 0; i < _tokenBuyRequests.length; i++ ) {
            if (_tokenBuyRequests[i].tokenOnSale.beingSoldBy == msg.sender) {
                tokenBuyRequests[index] = _tokenBuyRequests[i];
                index++;
            }
        }

        return tokenBuyRequests;
    }

    /** 
    * There can be multiple buy requests for a token, the owner can decide which is the best and accept.
    * This approves one and all the other offers are deleted.
    * An account can only give one offer for a sale, currently cannot change it.
    */
    function approveBuyRequest(uint256 tokenId, address to) public {
        TokenBuyRequest memory tokenBuyRequest;



        for (uint256 i = 0; i < _tokenBuyRequests.length; i++) {
            if (_tokenBuyRequests[i].buyer == to && _tokenBuyRequests[i].tokenOnSale.beingSoldBy == msg.sender && _tokenBuyRequests[i].tokenOnSale.token.tokenId == tokenId) {
                tokenBuyRequest = _tokenBuyRequests[i];
                break;
            }

            if (i == _tokenBuyRequests.length - 1) {
                revert("Request does not exists!");
            }
        }

        safeTransferFrom(msg.sender, to, tokenId, tokenBuyRequest.amount, "");
        (bool success,) = msg.sender.call{value: tokenBuyRequest.amount * tokenBuyRequest.offeredPricePerToken}("");

        require(success, "Payment way unsuccessful to the seller.");
        

        for (uint256 i = 0; i < _tokenBuyRequests.length; i++) {
            if (_tokenBuyRequests[i].tokenOnSale.beingSoldBy == msg.sender && _tokenBuyRequests[i].tokenOnSale.token.tokenId == tokenId && _tokenBuyRequests[i].buyer != to) {
                // Send back the deposited ether to whom requests was declined
                (bool success, ) = _tokenBuyRequests[i].buyer.call{value: _tokenBuyRequests[i].amount * _tokenBuyRequests[i].offeredPricePerToken}("BUY_REQUEST_DECLINED_REFUND");
                
                
                // delete requests
                deleteBuyRequestByIndex(i);
            }
        }

    }

    function deleteBuyRequestByIndex(uint256 index) private returns (bool) {
        if (index >= _tokenBuyRequests.length ) {
            return false;
        }

        _tokenBuyRequests[index] = _tokenBuyRequests[_tokenBuyRequests.length - 1];
        _tokenBuyRequests.pop();

        return true;
    }

    function getTokenOnSaleByIdAndAddress(uint256 tokenId, address owner) public view returns (TokenOnSale memory, uint256 index) {
        for (uint256 i = 0; i < _tokensOnSale.length; i++) {
            if (_tokensOnSale[i].token.tokenId == tokenId && _tokensOnSale[i].beingSoldBy == owner) {
                return (_tokensOnSale[i], i);
            }
        }

        revert ItemNotFound(tokenId, owner);
    }

    function deleteTokenOnSaleByIdAndAddress(uint256 tokenId, address owner) private returns (TokenOnSale memory) {
        for (uint256 i = 0; i < _tokensOnSale.length; i++) {
            if (_tokensOnSale[i].token.tokenId == tokenId && _tokensOnSale[i].beingSoldBy == owner) {
                TokenOnSale memory tokenOnSale = _tokensOnSale[i];
                _tokensOnSale[i] = _tokensOnSale[_tokensOnSale.length - 1];
                _tokensOnSale.pop();
                return tokenOnSale;
            }
        }

        revert ItemNotFound(tokenId, owner);
    }

    function deleteTokenOwnership(uint256 tokenId, address owner) private returns (TokenWithOwner memory) {
        for (uint256 i = 0; i < tokenOwnership.length; i++) {
            if (tokenOwnership[i].token.tokenId == tokenId && tokenOwnership[i].owner == owner) {
                TokenWithOwner memory tokenWithOwner = tokenOwnership[i];
                tokenOwnership[i] = tokenOwnership[tokenOwnership.length - 1];
                tokenOwnership.pop();

                return tokenWithOwner;
            }
        }

        revert ItemNotFound(tokenId, owner);
    }

    receive() external payable {}

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

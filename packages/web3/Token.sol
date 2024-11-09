// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";



contract RealEstateToken is ERC1155Burnable, Ownable {
    uint256 public tokenIdCounter = 1;

    event TokenCreated(uint256 indexed tokenId, address indexed creatorAddress, uint256 amount, bytes data); // data is a json object of the real estate in hex format
    event TokenBurned(uint256 indexed tokenId ,address indexed burnerAddress );

    struct Token {
        address creatorAddress;
        uint256 amountCreated;
    }

    mapping (uint256 => Token) public tokens; // tokenId => Token

    constructor(address intialOwner)  ERC1155("{id}") Ownable(intialOwner) {
    }

    function createToken(address marketplaceContractAddress, uint256 amount, bytes memory data) public {
        _mint(msg.sender, tokenIdCounter, amount, data);
        setApprovalForAll(marketplaceContractAddress, true);
        Token memory newToken = Token({creatorAddress: msg.sender, amountCreated :amount});
        tokens[tokenIdCounter] = newToken;
        emit TokenCreated(tokenIdCounter, msg.sender, amount, data);
        tokenIdCounter++;
    }

    function burnToken(uint256 tokenId) public {
        require(tokens[tokenId].amountCreated == balanceOf(msg.sender, tokenId), "User must obtain all tokens from token to burn them.");

        _burn(msg.sender, tokenId, tokens[tokenId].amountCreated);
        emit TokenBurned(tokenId, msg.sender);
    }
}
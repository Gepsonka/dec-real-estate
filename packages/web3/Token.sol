// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract RealEstateToken is ERC1155, Ownable {
    uint256 public tokenIdCounter = 1;

    event TokenCreated(uint256 indexed tokenId, address indexed creatorAddress, uint256 amount, bytes data); // data is a json object of the real estate

    constructor(address intialOwner)  ERC1155("{id}") Ownable(intialOwner) {
    }

    function createToken(address marketplaceContractAddress, uint256 amount, bytes memory data) public {
        _mint(msg.sender, tokenIdCounter, amount, data);
        setApprovalForAll(marketplaceContractAddress, true);
        emit TokenCreated(tokenIdCounter, msg.sender, amount, data);
        tokenIdCounter++;
    }
}
const tokenContractMetadata = require("../artifacts/ERC1155Token_metadata.json");
const tokenMarketplaceMetadata = require("../artifacts/ERC1155Marketplace_metadata.json");


export const tokenContractAbi = tokenContractMetadata.output.abi;
export const tokenMarketplaceAbi = tokenContractMetadata.output.abi;
import tokenContractMetadata from "../artifacts/RealEstateToken_metadata.json" assert { type: "json" };
import tokenMarketplaceMetadata from "../artifacts/ERC1155Marketplace_metadata.json" assert { type: "json" };

export const tokenContractAbi = tokenContractMetadata.output.abi;
export const tokenMarketplaceAbi = tokenMarketplaceMetadata.output.abi;

export type RealEstateCardProps = {
  title: string;
  pricePerToken?: number;
  tokenSupply: number;
  tokensAvailable?: number;
  imageUrl?: string;
  onClick?: () => void;
  creator: string; // wallet address
};

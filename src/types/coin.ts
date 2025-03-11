export type CoinData = {
  title: string;
  ticker: string;
  replies: number;
  marketCap: string;
  lastTrade: string;
  description: string;
  source: string;
  imageSrc: string;
  isKingOfHill?: boolean;
  socials: {
    website?: string;
    twitter?: string;
    telegram?: string;
    pumpfun?: string;
  };
}; 
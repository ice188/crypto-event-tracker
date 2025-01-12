export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChangePercentage: number;
  high: number;
  low: number;
  image: string;
  totalVolume: number;
  marketCap: number;
  circulatingSupply: number;
  maxSupply: number;
}

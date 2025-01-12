function firebaseCryptoData(rawData) {
  const {
    id,
    name,
    symbol,
    current_price: currentPrice,
    price_change_percentage_24h: priceChangePercentage,
    high_24h: high,
    low_24h: low,
    image,
    total_volume: totalVolume,
    market_cap: marketCap,
    circulating_supply: circulatingSupply,
    max_supply: maxSupply,
  } = rawData;

  return {
    id,
    name,
    symbol,
    currentPrice,
    priceChangePercentage,
    high,
    low,
    image,
    totalVolume,
    marketCap,
    circulatingSupply,
    maxSupply,
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = { firebaseCryptoData };

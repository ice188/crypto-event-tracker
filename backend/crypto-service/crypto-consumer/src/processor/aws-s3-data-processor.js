function awsS3CryptoData(rawData) {
  const {
    id,
    name,
    current_price: currentPrice,
    total_volume: totalVolume,
  } = rawData;

  return {
    id,
    name,
    currentPrice,
    totalVolume,
  };
}

module.exports = { awsS3CryptoData };

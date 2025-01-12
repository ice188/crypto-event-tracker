const axios = require("axios");
const COINGECKO_URL = process.env.COINGECKO_API_URL;

async function fetchCryptoData() {
  const res = await axios.get(`${COINGECKO_URL}/coins/markets`, {
    params: {
      vs_currency: "USD",
    },
    headers: {
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,  
    },
  });
  return res.data;
}

module.exports = { fetchCryptoData };

const asyncHandler = require("express-async-handler");
const { getFromFirebase } = require("../config/firebase");

const getCryptos = asyncHandler(async (req, res) => {
    const cryptoIdsSnapshot = await getFromFirebase('crypto');
    const coins = Object.keys(cryptoIdsSnapshot).map(cryptoId => ({
      image: cryptoIdsSnapshot[cryptoId].image,
      name: cryptoIdsSnapshot[cryptoId].name,
      symbol: cryptoIdsSnapshot[cryptoId].symbol,
    }));
    res.json(coins);
  });

module.exports = { getCryptos };

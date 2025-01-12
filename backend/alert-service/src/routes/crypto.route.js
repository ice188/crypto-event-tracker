const express = require("express");
const { getCryptos } = require("../controllers/crypto.controller");

const router = express.Router();

router.get("/get-cryptos", getCryptos);

module.exports = router;

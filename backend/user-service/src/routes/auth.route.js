const express = require("express");
const { userAuth } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/", userAuth);

module.exports = router;

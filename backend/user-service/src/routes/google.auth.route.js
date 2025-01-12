const express = require("express");
const { getJWTtoken, getPayload } = require("../controllers/google.auth.controller");

const router = express.Router();

router.post("/create-session", getJWTtoken);
router.post("/get-payload", getPayload);

module.exports = router;

const express = require("express");
const router = express.Router();
const { startService } = require("../controller/notification.controller");

router.post("/start-alert", startService);

module.exports = router;

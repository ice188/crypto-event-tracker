const express = require("express");
const { addAlert, getAlerts, deleteAlert } = require("../controllers/alert.controller");

const router = express.Router();

router.post("/create-alert", addAlert);
router.post("/get-alerts", getAlerts);
router.post("/delete-alert", deleteAlert);

module.exports = router;

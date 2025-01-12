const asyncHandler = require("express-async-handler");
const { Alert } = require("../models/alert.model");

const addAlert = asyncHandler(async (req, res) => {
  const {
    user_id,
    alert_type,
    threshold_type,
    target_value,
    coin_name,
    coin_symbol,
    coin_image,
  } = req.body;

  let existingAlert = await Alert.findOne({
    where: {
      user_id,
      alert_type,
      threshold_type,
      target_value,
      coin_name,
      coin_symbol,
      coin_image,
    },
  });

  if (existingAlert) {
    return res.status(400).json({ message: "Alert exists" });
  }

  await Alert.create({
    user_id,
    alert_type,
    threshold_type,
    target_value,
    coin_name,
    coin_symbol,
    coin_image,
  });
});

const getAlerts = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  const alerts = await Alert.findAll({
    where: {
      user_id,
    },
  });
  res.json(alerts);
});

const deleteAlert = asyncHandler(async (req, res) => {
  const { alert_id } = req.body;

  const alert = await Alert.findOne({
    where: {
      id: alert_id,
    },
  });

  await alert.destroy();
  res.json({ message: "Alert deleted gracefully" });
});

module.exports = { addAlert, getAlerts, deleteAlert };

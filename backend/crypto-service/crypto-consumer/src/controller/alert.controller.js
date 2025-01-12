const { Alert } = require("../models/alert.model");

const evaluateAlerts = async (cryptoData) => {
  const { symbol, current_price } = cryptoData;

  const alerts = await Alert.findAll({ where: { coin_symbol : symbol } });

  const triggeredAlerts = alerts.filter((alert) => {
    if (
      alert.threshold_type === "above" &&
      current_price > alert.target_value
    ) { return true; }
    if (
      alert.threshold_type === "below" &&
      current_price < alert.target_value
    ) { return true; }
    return false;
  });

  return triggeredAlerts;
};

module.exports = { evaluateAlerts };

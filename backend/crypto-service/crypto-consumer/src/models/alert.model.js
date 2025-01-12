const { sequelize } = require("../config/orm");
const { DataTypes } = require("sequelize");

const Alert = sequelize.define("Alert", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User", 
      key: "id",
      onDelete: "CASCADE",
    },
  },
  alert_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  threshold_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  target_value: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  coin_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  coin_symbol: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  coin_image: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_triggered: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = { Alert };

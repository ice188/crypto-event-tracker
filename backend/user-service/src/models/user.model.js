const { sequelize } = require("../config/orm");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
  },
  oauth_provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['email', 'oauth_provider'], 
    },
  ],
});

module.exports = { User };

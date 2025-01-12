// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.POSTGRES_URL, {
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, 
//     },
//   },
//   logging: false,
// });

// module.exports = { sequelize };

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`
);

module.exports = { sequelize };
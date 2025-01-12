require("dotenv").config();
const { consumeCryptoData } = require("./consumer/crypto-data-consumer");
const { sequelize } = require("./config/orm");
const { connectRabbitMQ } = require("./config/rabbitmq");

async function main() {
  connectRabbitMQ();
  sequelize
    .sync()
    .then(() => {
      console.log("Database synced successfully!");
    })
    .catch((err) => {
      console.error("Failed to sync database:", err);
    });
  await consumeCryptoData();
}

main();

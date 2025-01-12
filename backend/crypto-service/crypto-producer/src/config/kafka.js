require("dotenv").config();
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "crypto-data-service",
  brokers: [process.env.KAFKA_BROKER],
});

module.exports = { kafka };

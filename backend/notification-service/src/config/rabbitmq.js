const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE = process.env.RABBITMQ_QUEUE;

let connection;
let channel;

const connectRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);
    console.log(`Connected to RabbitMQ at ${RABBITMQ_URL}`);
  }
  return channel;
};

const getChannel = async () => {
  if (!channel) {
    await connectRabbitMQ();
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel, QUEUE };

const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE = process.env.RABBITMQ_QUEUE;

let connection;
let channel;

const connectRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log(`Connected to RabbitMQ at ${RABBITMQ_URL}`);
  }
  return channel;
};

const publishToQueue = async (queue, message) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(`Message published to ${queue}`);
};

const consumeFromQueue = async (queue, onMessage) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queue);
  console.log(`Waiting for messages in queue: ${queue}`);
  channel.consume(queue, async (msg) => {
    if (msg) {
      await onMessage(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
};

module.exports = { connectRabbitMQ, publishToQueue, consumeFromQueue, QUEUE };

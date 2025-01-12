const { kafka } = require("../config/kafka");
const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");
}

async function sendMessage(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

module.exports = { connectProducer, sendMessage };

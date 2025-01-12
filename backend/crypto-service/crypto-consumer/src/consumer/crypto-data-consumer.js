const { kafka } = require("../config/kafka");
const { pushToFirebase } = require("../config/firebase");
const { firebaseCryptoData } = require("../processor/firebase-data-processor");
const { awsS3CryptoData } = require("../processor/aws-s3-data-processor");
const consumer = kafka.consumer({ groupId: "crypto-group" });
const { shouldStore } = require("../utils/daily");
const { storeDataInS3 } = require("../config/aws-s3");
const { evaluateAlerts } = require("../controller/alert.controller");
const { publishToQueue, QUEUE } = require("../config/rabbitmq")

async function consumeCryptoData() {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC_CRYPTO,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawData = JSON.parse(message.value.toString());

      // TODO: Add logic to send processed data to other services (alerts, dashboard, etc.)

      // stat in firebase
      const firebaseData = firebaseCryptoData(rawData);
      pushToFirebase(`crypto/${firebaseData.id}`, firebaseData);

      // daily price & volume in aws s3
      if (await shouldStore(rawData.id, new Date().toISOString())) {
        await storeDataInS3(awsS3CryptoData(rawData));
      }

      //compare and trigger satisfied alerts
      const triggeredAlerts = await evaluateAlerts(rawData);
      if (triggeredAlerts.length > 0) {
        for (const alert of triggeredAlerts) {
          await publishToQueue(QUEUE, alert);
        }
        console.log(`Published ${triggeredAlerts.length} alerts to RabbitMQ`);
      }
    },
  });
}
module.exports = { consumeCryptoData };

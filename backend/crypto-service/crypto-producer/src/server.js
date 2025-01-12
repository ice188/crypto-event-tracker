require("dotenv").config();
const { connectProducer, sendMessage } = require("./producer/crypto-data-producer");
const { fetchCryptoData } = require("./services/coingecko");

async function main() {
  await connectProducer();

  setInterval(async () => {
    console.log("Fetching crypto data...");
    const data = await fetchCryptoData();

    console.log("Sending data to Kafka...");
    for (const crypto of data) {
      await sendMessage(process.env.KAFKA_TOPIC_CRYPTO, crypto);
    }
    console.log("Crypto data published to topic");
  }, 10000); 
}

main();

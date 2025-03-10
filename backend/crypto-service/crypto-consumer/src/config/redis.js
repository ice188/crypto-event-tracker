const Redis = require("ioredis");
const redis = new Redis({
  host: "localhost",
  port: 6379,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

module.exports = { redis };

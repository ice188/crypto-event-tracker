const { redis } = require("../config/redis");
const REDIS_KEY_PREFIX = "lastStoredTimestamps:";

async function shouldStore(coinId, timestamp) {
  const redisKey = `${REDIS_KEY_PREFIX}${coinId}`;
  const lastStoredTimestamp = await redis.get(redisKey);
  const lastStoredDate = lastStoredTimestamp
    ? new Date(lastStoredTimestamp).toDateString()
    : null;
  const currentDate = new Date(timestamp).toDateString();
  if (lastStoredDate === currentDate) {
    console.log(`Data for coin ${coinId} already stored for today.`);
    return false;
  }

  await redis.set(redisKey, timestamp, "EX", 24 * 60 * 60);
  return true;
}

module.exports = { shouldStore };

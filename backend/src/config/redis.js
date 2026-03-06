/**
 * Redis Configuration
 * Handles Redis connection, caching utilities, and monitoring
 */

const { createClient } = require("redis");
const env = require("./env");
const logger = require("../utils/logger");

let redisClient;


/* =======================================================
   CONNECT REDIS
======================================================= */

async function connectRedis() {

  try {

    redisClient = createClient({
      url: env.REDIS_URL,

      socket: {
        reconnectStrategy: (retries) => {

          if (retries > 10) {
            logger.error("Redis reconnect attempts exceeded");
            return new Error("Redis reconnect failed");
          }

          return Math.min(retries * 100, 3000);
        }
      }

    });


    /* ---------- Redis Events ---------- */

    redisClient.on("connect", () => {
      logger.info("Redis connecting...");
    });

    redisClient.on("ready", () => {
      logger.info("Redis connected successfully");
    });

    redisClient.on("error", (err) => {
      logger.error(`Redis error: ${err.message}`);
    });

    redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });

    redisClient.on("end", () => {
      logger.warn("Redis connection closed");
    });


    await redisClient.connect();

    return redisClient;

  } catch (error) {

    logger.error(`Redis connection failed: ${error.message}`);

    /* Do NOT crash the server */
    return null;

  }

}


/* =======================================================
   GET REDIS CLIENT
======================================================= */

function getRedisClient() {

  if (!redisClient) {
    logger.warn("Redis client requested but not initialized");
    return null;
  }

  return redisClient;

}


/* =======================================================
   REDIS HEALTH CHECK
======================================================= */

async function checkRedisHealth() {

  try {

    if (!redisClient) {
      return { status: "not_connected" };
    }

    const pong = await redisClient.ping();

    return {
      status: pong === "PONG" ? "connected" : "unknown"
    };

  } catch (error) {

    return {
      status: "error",
      error: error.message
    };

  }

}


/* =======================================================
   CACHE UTILITIES
======================================================= */

async function setCache(key, value, ttl = 600) {

  try {

    if (!redisClient) return;

    await redisClient.setEx(
      key,
      ttl,
      JSON.stringify(value)
    );

  } catch (error) {

    logger.error(`Redis set cache error: ${error.message}`);

  }

}


async function getCache(key) {

  try {

    if (!redisClient) return null;

    const data = await redisClient.get(key);

    if (!data) return null;

    return JSON.parse(data);

  } catch (error) {

    logger.error(`Redis get cache error: ${error.message}`);
    return null;

  }

}


async function deleteCache(key) {

  try {

    if (!redisClient) return;

    await redisClient.del(key);

  } catch (error) {

    logger.error(`Redis delete cache error: ${error.message}`);

  }

}


/* =======================================================
   CLEAR CACHE BY PATTERN (SAFE)
======================================================= */

async function clearCache(pattern) {

  try {

    if (!redisClient) return;

    const scan = redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100
    });

    for await (const key of scan) {
      await redisClient.del(key);
    }

  } catch (error) {

    logger.error(`Redis clear cache error: ${error.message}`);

  }

}


/* =======================================================
   GRACEFUL DISCONNECT
======================================================= */

async function disconnectRedis() {

  try {

    if (redisClient) {

      await redisClient.quit();
      logger.info("Redis connection closed");

    }

  } catch (error) {

    logger.error(`Redis shutdown error: ${error.message}`);

  }

}


/* =======================================================
   EXPORTS
======================================================= */

module.exports = connectRedis;

module.exports.getRedisClient = getRedisClient;
module.exports.checkRedisHealth = checkRedisHealth;

module.exports.setCache = setCache;
module.exports.getCache = getCache;
module.exports.deleteCache = deleteCache;
module.exports.clearCache = clearCache;

module.exports.disconnectRedis = disconnectRedis;
const { getRedisClient } = require("../config/redis");
const logger = require("../utils/logger");

const CACHE_TTL = 60 * 5;
const PREFIX = "smart-salon";


/* ================= CACHE KEYS ================= */

const nearbySalonsKey = (lat, lng) =>
  `${PREFIX}:salons:nearby:${lat}:${lng}`;

const salonDetailsKey = (salonId) =>
  `${PREFIX}:salon:details:${salonId}`;

const salonServicesKey = (salonId) =>
  `${PREFIX}:salon:services:${salonId}`;


/* ================= NEARBY SALONS CACHE ================= */

async function getNearbySalonsCache(lat, lng) {

  try {

    const redis = getRedisClient();

    const key = nearbySalonsKey(lat, lng);

    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);

  } catch (error) {

    logger.error(`Redis nearby salons cache error: ${error.message}`);

    return null;

  }

}


async function setNearbySalonsCache(lat, lng, salons) {

  try {

    const redis = getRedisClient();

    const key = nearbySalonsKey(lat, lng);

    await redis.setEx(
      key,
      CACHE_TTL,
      JSON.stringify(salons)
    );

  } catch (error) {

    logger.error(`Redis set nearby salons cache error: ${error.message}`);

  }

}


/* ================= SALON DETAILS CACHE ================= */

async function getSalonDetailsCache(salonId) {

  try {

    const redis = getRedisClient();

    const key = salonDetailsKey(salonId);

    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);

  } catch (error) {

    logger.error(`Redis salon details cache error: ${error.message}`);

    return null;

  }

}


async function setSalonDetailsCache(salonId, salonData) {

  try {

    const redis = getRedisClient();

    const key = salonDetailsKey(salonId);

    await redis.setEx(
      key,
      CACHE_TTL,
      JSON.stringify(salonData)
    );

  } catch (error) {

    logger.error(`Redis set salon details cache error: ${error.message}`);

  }

}


/* ================= SALON SERVICES CACHE ================= */

async function getSalonServicesCache(salonId) {

  try {

    const redis = getRedisClient();

    const key = salonServicesKey(salonId);

    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data);

  } catch (error) {

    logger.error(`Redis salon services cache error: ${error.message}`);

    return null;

  }

}


async function setSalonServicesCache(salonId, services) {

  try {

    const redis = getRedisClient();

    const key = salonServicesKey(salonId);

    await redis.setEx(
      key,
      CACHE_TTL,
      JSON.stringify(services)
    );

  } catch (error) {

    logger.error(`Redis set salon services cache error: ${error.message}`);

  }

}


/* ================= CACHE INVALIDATION ================= */

async function clearSalonCache(salonId) {

  try {

    const redis = getRedisClient();

    const keys = [
      salonDetailsKey(salonId),
      salonServicesKey(salonId)
    ];

    await redis.del(keys);

  } catch (error) {

    logger.error(`Redis clear salon cache error: ${error.message}`);

  }

}


module.exports = {

  getNearbySalonsCache,
  setNearbySalonsCache,

  getSalonDetailsCache,
  setSalonDetailsCache,

  getSalonServicesCache,
  setSalonServicesCache,

  clearSalonCache

};
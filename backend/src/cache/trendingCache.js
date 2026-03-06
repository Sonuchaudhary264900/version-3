/**
 * Trending Cache System
 */

const { getRedisClient } = require("../config/redis");
const logger = require("../utils/logger");

const CACHE_TTL = 60 * 15;
const PREFIX = "smart-salon";


/* KEY GENERATORS */

const trendingKey = () => `${PREFIX}:salons:trending`;
const topRatedKey = () => `${PREFIX}:salons:top-rated`;
const mostBookedKey = () => `${PREFIX}:salons:most-booked`;
const trendingServicesKey = () => `${PREFIX}:services:trending`;
const trendingCityKey = (city) => `${PREFIX}:salons:trending:${city}`;


/* GETTERS */

async function getTrendingSalons() {
  try {

    const redis = getRedisClient();

    const cached = await redis.get(trendingKey());

    return cached ? JSON.parse(cached) : null;

  } catch (error) {

    logger.error(`Trending salons cache error: ${error.message}`);
    return null;

  }
}


async function getTopRatedSalons() {
  try {

    const redis = getRedisClient();

    const cached = await redis.get(topRatedKey());

    return cached ? JSON.parse(cached) : null;

  } catch (error) {

    logger.error(`Top rated salons cache error: ${error.message}`);
    return null;

  }
}


async function getMostBookedSalons() {
  try {

    const redis = getRedisClient();

    const cached = await redis.get(mostBookedKey());

    return cached ? JSON.parse(cached) : null;

  } catch (error) {

    logger.error(`Most booked salons cache error: ${error.message}`);
    return null;

  }
}


async function getTrendingServices() {
  try {

    const redis = getRedisClient();

    const cached = await redis.get(trendingServicesKey());

    return cached ? JSON.parse(cached) : null;

  } catch (error) {

    logger.error(`Trending services cache error: ${error.message}`);
    return null;

  }
}


async function getTrendingCitySalons(city) {
  try {

    const redis = getRedisClient();

    const cached = await redis.get(trendingCityKey(city));

    return cached ? JSON.parse(cached) : null;

  } catch (error) {

    logger.error(`Trending city salons cache error: ${error.message}`);
    return null;

  }
}


/* SETTERS */

async function setTrendingSalons(data) {

  const redis = getRedisClient();

  await redis.setEx(
    trendingKey(),
    CACHE_TTL,
    JSON.stringify(data)
  );

}


async function setTopRatedSalons(data) {

  const redis = getRedisClient();

  await redis.setEx(
    topRatedKey(),
    CACHE_TTL,
    JSON.stringify(data)
  );

}


async function setMostBookedSalons(data) {

  const redis = getRedisClient();

  await redis.setEx(
    mostBookedKey(),
    CACHE_TTL,
    JSON.stringify(data)
  );

}


async function setTrendingServices(data) {

  const redis = getRedisClient();

  await redis.setEx(
    trendingServicesKey(),
    CACHE_TTL,
    JSON.stringify(data)
  );

}


async function setTrendingCitySalons(city, data) {

  const redis = getRedisClient();

  await redis.setEx(
    trendingCityKey(city),
    CACHE_TTL,
    JSON.stringify(data)
  );

}


/* CACHE INVALIDATION */

async function clearTrendingCache() {

  try {

    const redis = getRedisClient();

    const keys = await redis.scanIterator({
      MATCH: `${PREFIX}:salons:*`
    });

    for await (const key of keys) {
      await redis.del(key);
    }

  } catch (error) {

    logger.error(`Trending cache clear error: ${error.message}`);

  }

}


module.exports = {

  getTrendingSalons,
  setTrendingSalons,

  getTopRatedSalons,
  setTopRatedSalons,

  getMostBookedSalons,
  setMostBookedSalons,

  getTrendingServices,
  setTrendingServices,

  getTrendingCitySalons,
  setTrendingCitySalons,

  clearTrendingCache

};
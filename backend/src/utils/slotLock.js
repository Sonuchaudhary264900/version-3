const redisClient = require("../config/redis");

const LOCK_TTL = 30; // seconds


const generateLockKey = (salonId, date, slotStart) => {
  return `lock:salon:${salonId}:${date}:${slotStart}`;
};


async function acquireSlotLock(salonId, date, slotStart) {

  const key = generateLockKey(salonId, date, slotStart);

  const result = await redisClient.set(
    key,
    "locked",
    {
      NX: true,
      EX: LOCK_TTL
    }
  );

  return result === "OK";
}


async function releaseSlotLock(salonId, date, slotStart) {

  const key = generateLockKey(salonId, date, slotStart);

  await redisClient.del(key);

}


async function isSlotLocked(salonId, date, slotStart) {

  const key = generateLockKey(salonId, date, slotStart);

  const lock = await redisClient.get(key);

  return !!lock;

}


module.exports = {
  acquireSlotLock,
  releaseSlotLock,
  isSlotLocked
};
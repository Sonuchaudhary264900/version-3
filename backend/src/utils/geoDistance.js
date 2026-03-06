/**
 * Geo Distance Utility
 * Handles location-based calculations
 */


/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};



/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {

  const R = 6371; // Earth radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance; // in km
};



/**
 * Check if salon is within radius
 */
const isWithinRadius = (
  userLat,
  userLng,
  salonLat,
  salonLng,
  radiusKm
) => {

  const distance = calculateDistance(
    userLat,
    userLng,
    salonLat,
    salonLng
  );

  return distance <= radiusKm;

};



/**
 * Add distance to salon objects
 */
const attachDistanceToSalons = (salons, userLat, userLng) => {

  return salons.map((salon) => {

    const salonLat = salon.location.coordinates[1];
    const salonLng = salon.location.coordinates[0];

    const distance = calculateDistance(
      userLat,
      userLng,
      salonLat,
      salonLng
    );

    return {
      ...salon._doc,
      distance: Number(distance.toFixed(2))
    };

  });

};



/**
 * Filter salons within radius
 */
const filterSalonsWithinRadius = (
  salons,
  userLat,
  userLng,
  radiusKm
) => {

  return salons.filter((salon) => {

    const salonLat = salon.location.coordinates[1];
    const salonLng = salon.location.coordinates[0];

    return isWithinRadius(
      userLat,
      userLng,
      salonLat,
      salonLng,
      radiusKm
    );

  });

};



/**
 * Sort salons by distance
 */
const sortSalonsByDistance = (
  salons,
  userLat,
  userLng
) => {

  const salonsWithDistance = attachDistanceToSalons(
    salons,
    userLat,
    userLng
  );

  return salonsWithDistance.sort(
    (a, b) => a.distance - b.distance
  );

};



/**
 * Get nearest salons
 */
const getNearestSalons = (
  salons,
  userLat,
  userLng,
  limit = 20
) => {

  const sorted = sortSalonsByDistance(
    salons,
    userLat,
    userLng
  );

  return sorted.slice(0, limit);

};



module.exports = {
  calculateDistance,
  isWithinRadius,
  attachDistanceToSalons,
  filterSalonsWithinRadius,
  sortSalonsByDistance,
  getNearestSalons
};
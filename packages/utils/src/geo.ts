import type { Location } from "@cultivator/types";

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistanceLabel(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function sortByDistance<T extends { location: Location }>(
  items: T[],
  userLocation: Location
): (T & { distance: number })[] {
  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        item.location.lat,
        item.location.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
}

export function isWithinRadius(
  dealerLocation: Location,
  userLocation: Location,
  radiusKm: number
): boolean {
  const distance = calculateDistance(
    dealerLocation.lat,
    dealerLocation.lng,
    userLocation.lat,
    userLocation.lng
  );
  return distance <= radiusKm;
}

export function isOpenNow(open: string, close: string): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [openHours, openMinutes] = open.split(":").map(Number);
  const [closeHours, closeMinutes] = close.split(":").map(Number);
  const openTime = openHours * 60 + openMinutes;
  const closeTime = closeHours * 60 + closeMinutes;

  return currentTime >= openTime && currentTime <= closeTime;
}

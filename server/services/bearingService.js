const EARTH_RADIUS_METERS = 6_371_008.8;

export const HEADING_MOVEMENT_TOLERANCE_METERS = 3;

function finiteCoordinate(point) {
  return point
    && Number.isFinite(Number(point.lat))
    && Number.isFinite(Number(point.lng));
}

export function normalizeHeading(value) {
  if (!Number.isFinite(value)) return null;
  return ((value % 360) + 360) % 360;
}

export function isValidHeading(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value < 360;
}

export function distanceBetweenMeters(previous, current) {
  if (!finiteCoordinate(previous) || !finiteCoordinate(current)) return null;
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(Number(current.lat) - Number(previous.lat));
  const longitudeDelta = toRadians(Number(current.lng) - Number(previous.lng));
  const latitude1 = toRadians(Number(previous.lat));
  const latitude2 = toRadians(Number(current.lat));
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2;
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function calculateBearing(previous, current, minimumDistanceMeters = HEADING_MOVEMENT_TOLERANCE_METERS) {
  const distance = distanceBetweenMeters(previous, current);
  if (distance === null || distance < minimumDistanceMeters) return null;

  const toRadians = (degrees) => degrees * Math.PI / 180;
  const toDegrees = (radians) => radians * 180 / Math.PI;
  const latitude1 = toRadians(Number(previous.lat));
  const latitude2 = toRadians(Number(current.lat));
  const longitudeDelta = toRadians(Number(current.lng) - Number(previous.lng));
  const y = Math.sin(longitudeDelta) * Math.cos(latitude2);
  const x = Math.cos(latitude1) * Math.sin(latitude2)
    - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitudeDelta);
  return normalizeHeading(toDegrees(Math.atan2(y, x)));
}

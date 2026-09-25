function distanceKm(a, b) {
  const toRadians = (value) => value * Math.PI / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function optimizeStops(stops) {
  const remaining = stops.slice(1).map((stop, index) => ({ ...stop, originalIndex: index + 1 }));
  const ordered = [{ ...stops[0], originalIndex: 0 }];
  while (remaining.length) {
    const current = ordered.at(-1);
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    remaining.forEach((candidate, index) => {
      const distance = distanceKm(current, candidate);
      if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
    });
    ordered.push(remaining.splice(nearestIndex, 1)[0]);
  }
  const distance = ordered.slice(1).reduce((total, stop, index) => total + distanceKm(ordered[index], stop), 0);
  return {
    algorithm: "nearest_neighbour_demo",
    orderedStops: ordered,
    distanceKm: Number(distance.toFixed(2)),
    durationMinutes: Math.round(distance / 50 * 60),
    limitations: "Straight-line distances only; no roads, traffic, capacity, or external routing provider.",
  };
}

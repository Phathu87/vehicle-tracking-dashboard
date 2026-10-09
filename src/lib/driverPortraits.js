// Only acquired assets are registered; arbitrary/new IDs retain initials.
export const integratedDriverIds = Object.freeze([
  'DRV-001', 'DRV-002', 'DRV-003', 'DRV-004', 'DRV-005',
  'DRV-006', 'DRV-007', 'DRV-008', 'DRV-009', 'DRV-010',
  'DRV-011', 'DRV-012', 'DRV-013', 'DRV-014', 'DRV-015',
  'DRV-016', 'DRV-017', 'DRV-019', 'DRV-024',
]);

export function resolveDriverPortrait(driverId) {
  return integratedDriverIds.includes(driverId) ? `/assets/drivers/${driverId}.webp` : null;
}

export function driverInitials(name) {
  return String(name || '').trim().split(/\s+/).filter(Boolean)
    .map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '?';
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDriverPortrait, driverInitials, integratedDriverIds } from '../lib/driverPortraits.js';

test('integrated portraits resolve by ID, including the DRV-015 amendment', () => {
  assert.equal(resolveDriverPortrait('DRV-001'), '/assets/drivers/DRV-001.webp');
  const driver = { id: 'DRV-015', name: 'Tshifhiwa Netshanda' };
  assert.equal(resolveDriverPortrait(driver.id), '/assets/drivers/DRV-015.webp');
  assert.deepEqual(driver, { id: 'DRV-015', name: 'Tshifhiwa Netshanda' });
  assert.equal(new Set(integratedDriverIds).size, 19);
});

test('unsupplied and unknown IDs retain safe initials', () => {
  for (const id of ['DRV-018', 'DRV-020', 'DRV-999', undefined, '../DRV-001']) {
    assert.equal(resolveDriverPortrait(id), null);
  }
  assert.equal(driverInitials('Tshifhiwa Netshanda'), 'TN');
  assert.equal(driverInitials('  Johan van der Merwe  '), 'JV');
  assert.equal(driverInitials(null), '?');
});

test('all Priority A drivers including the four closed gaps resolve portraits', () => {
  const priorityA = ['DRV-001', 'DRV-002', 'DRV-003', 'DRV-004', 'DRV-006',
    'DRV-007', 'DRV-008', 'DRV-011', 'DRV-012', 'DRV-013', 'DRV-014',
    'DRV-016', 'DRV-017', 'DRV-019', 'DRV-024'];
  for (const id of priorityA) assert.equal(resolveDriverPortrait(id), `/assets/drivers/${id}.webp`);
});

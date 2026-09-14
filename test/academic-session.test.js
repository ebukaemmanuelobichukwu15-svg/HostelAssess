const test = require('node:test');
const assert = require('node:assert/strict');
const { getNextAcademicSession } = require('../2-backend/utils/academicSession');

test('academic sessions advance by one consecutive year', () => {
  assert.equal(getNextAcademicSession('2026/2027'), '2027/2028');
});

test('invalid current academic sessions cannot be advanced', () => {
  assert.throws(() => getNextAcademicSession('2026/2028'), /Invalid current academic session/);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const validate = require('../2-backend/middleware/validate');
const { inviteIdSchema } = require('../2-backend/validators/adminSchemas');

test('bodyless DELETE requests are validated with an empty body', () => {
  const req = {
    body: undefined,
    params: { id: '507f1f77bcf86cd799439011' },
    query: {}
  };
  let nextError;

  validate(inviteIdSchema)(req, {}, (error) => { nextError = error; });

  assert.equal(nextError, undefined);
  assert.deepEqual(req.validated.body, {});
  assert.equal(req.validated.params.id, req.params.id);
});

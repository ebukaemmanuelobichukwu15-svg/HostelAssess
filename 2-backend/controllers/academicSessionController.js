const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getAcademicSessionSettings, getNextAcademicSession } = require('../utils/academicSession');
const { sendSuccess } = require('../utils/response');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getAcademicSessionSettings();
  return sendSuccess(res, { message: 'Academic session settings retrieved.', data: { settings } });
});

const schedule = asyncHandler(async (req, res) => {
  const settings = await getAcademicSessionSettings();
  const { session, startsAt } = req.validated.body;
  const expectedSession = getNextAcademicSession(settings.currentSession);
  if (session !== expectedSession) {
    throw new ApiError(400, `The next session after ${settings.currentSession} must be ${expectedSession}.`, 'INVALID_NEXT_SESSION');
  }
  const startDate = new Date(startsAt);
  if (startDate <= new Date()) throw new ApiError(400, 'The session start date must be in the future.', 'INVALID_SESSION_DATE');

  settings.scheduledSession = session;
  settings.scheduledStartAt = startDate;
  await settings.save();
  return sendSuccess(res, { message: `${session} will activate automatically on the scheduled date.`, data: { settings } });
});

const cancelSchedule = asyncHandler(async (_req, res) => {
  const settings = await getAcademicSessionSettings();
  settings.scheduledSession = null;
  settings.scheduledStartAt = null;
  await settings.save();
  return sendSuccess(res, { message: 'Scheduled academic session cancelled.', data: { settings } });
});

module.exports = { getSettings, schedule, cancelSchedule };

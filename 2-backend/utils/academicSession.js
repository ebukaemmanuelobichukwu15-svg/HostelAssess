const AcademicSession = require('../models/AcademicSession');
const env = require('../config/env');

async function getAcademicSessionSettings(now = new Date()) {
  let settings;
  try {
    settings = await AcademicSession.findOneAndUpdate(
      { key: 'institution' },
      { $setOnInsert: { currentSession: env.CURRENT_ACADEMIC_SESSION } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    settings = await AcademicSession.findOne({ key: 'institution' });
  }

  if (settings.scheduledSession && settings.scheduledStartAt && settings.scheduledStartAt <= now) {
    settings = await AcademicSession.findOneAndUpdate(
      {
        key: 'institution',
        scheduledSession: settings.scheduledSession,
        scheduledStartAt: { $lte: now }
      },
      {
        $set: { currentSession: settings.scheduledSession },
        $unset: { scheduledSession: 1, scheduledStartAt: 1 }
      },
      { new: true }
    ) || await AcademicSession.findOne({ key: 'institution' });
  }

  return settings;
}

function getNextAcademicSession(currentSession) {
  const [start, end] = currentSession.split('/').map(Number);
  if (!Number.isInteger(start) || end !== start + 1) throw new Error('Invalid current academic session.');
  return `${end}/${end + 1}`;
}

async function getCurrentAcademicSession(now) {
  return (await getAcademicSessionSettings(now)).currentSession;
}

module.exports = { getAcademicSessionSettings, getCurrentAcademicSession, getNextAcademicSession };

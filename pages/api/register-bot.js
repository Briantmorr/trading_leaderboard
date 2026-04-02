export default async function handler(_req, res) {
  return res.status(410).json({
    error: 'Deprecated endpoint',
    message:
      'register-bot is obsolete. The leaderboard now reads backend snapshot artifacts instead of registering one Alpaca account per bot.',
    replacement: 'GET /api/leaderboard/latest',
  });
}

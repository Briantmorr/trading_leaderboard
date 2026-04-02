export default async function handler(_req, res) {
  return res.status(410).json({
    error: 'Deprecated endpoint',
    message:
      'update-leaderboard is obsolete. Leaderboard state now comes from backend artifacts and snapshot APIs instead of Firebase mutation routes.',
    replacement: 'GET /api/leaderboard/latest',
  });
}

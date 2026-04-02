import { NextResponse } from 'next/server';
import { getLatestLeaderboardData } from '@/lib/leaderboard-data';

export async function GET() {
  const payload = await getLatestLeaderboardData();
  return NextResponse.json(payload);
}

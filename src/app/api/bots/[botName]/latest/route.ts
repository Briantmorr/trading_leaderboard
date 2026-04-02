import { NextResponse } from 'next/server';
import { getBotDetail } from '@/lib/leaderboard-data';

export async function GET(
  _request: Request,
  context: { params: Promise<{ botName: string }> },
) {
  const { botName } = await context.params;
  const payload = await getBotDetail(botName);

  if (!payload) {
    return NextResponse.json({ error: 'Bot not found in latest snapshot' }, { status: 404 });
  }

  return NextResponse.json(payload);
}

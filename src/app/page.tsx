import { getLatestLeaderboardData } from '@/lib/leaderboard-data';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateTime(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function rankBadge(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '#';
}

export default async function Home() {
  const { snapshot, artifactPath, fallback, backendRepoPath } = await getLatestLeaderboardData();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Alpaca Trading Prototype
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Shared-account leaderboard
              </h1>
              <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
                This frontend now renders the backend snapshot contract instead of Firebase bot records.
                Rankings come from the latest backend artifact when available, with an example snapshot as a
                local fallback.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300 sm:grid-cols-2">
              <div>
                <div className="text-slate-500">Source</div>
                <div className="font-medium text-slate-100">{snapshot.source}</div>
              </div>
              <div>
                <div className="text-slate-500">Generated</div>
                <div className="font-medium text-slate-100">{formatDateTime(snapshot.generated_at)}</div>
              </div>
              <div>
                <div className="text-slate-500">Run ID</div>
                <div className="break-all font-medium text-slate-100">{snapshot.run_id}</div>
              </div>
              <div>
                <div className="text-slate-500">Data path</div>
                <div className="font-medium text-slate-100">{fallback === 'artifact' ? 'backend artifact' : 'example snapshot'}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm text-slate-400">Bots in snapshot</div>
            <div className="mt-2 text-3xl font-semibold">{snapshot.bots.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm text-slate-400">Contract version</div>
            <div className="mt-2 text-3xl font-semibold">{snapshot.contract_version}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="text-sm text-slate-400">Backend repo bridge</div>
            <div className="mt-2 break-all text-sm font-medium text-slate-200">{backendRepoPath}</div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/30">
          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="text-xl font-semibold">Leaderboard snapshot</h2>
            <p className="mt-1 text-sm text-slate-400">
              Estimated per-bot values are rendered from the backend artifact contract. Shared-account paper mode should be labeled as estimated allocation.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Bot</th>
                  <th className="px-6 py-4 font-medium">Mode</th>
                  <th className="px-6 py-4 text-right font-medium">Equity</th>
                  <th className="px-6 py-4 text-right font-medium">Cash</th>
                  <th className="px-6 py-4 text-right font-medium">Trades</th>
                  <th className="px-6 py-4 font-medium">Halt</th>
                  <th className="px-6 py-4 font-medium">Warnings</th>
                  <th className="px-6 py-4 font-medium">Last equity point</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.bots.map((bot) => (
                  <tr key={`${bot.bot_name}-${bot.rank}`} className="border-t border-slate-800 align-top hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-semibold text-slate-100">
                      <span className="mr-2">{rankBadge(bot.rank)}</span>
                      {bot.rank}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{bot.bot_name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{bot.mode}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-300">{formatCurrency(bot.ending_equity)}</td>
                    <td className="px-6 py-4 text-right text-slate-200">{formatCurrency(bot.ending_cash)}</td>
                    <td className="px-6 py-4 text-right text-slate-200">{bot.trade_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bot.halted ? 'bg-rose-500/20 text-rose-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                        {bot.halted ? 'halted' : 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {bot.warnings.length === 0 ? (
                        <span className="text-slate-500">None</span>
                      ) : (
                        <ul className="space-y-2 text-xs text-amber-200">
                          {bot.warnings.map((warning) => (
                            <li key={warning} className="rounded-xl bg-amber-500/10 px-3 py-2">
                              {warning}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {bot.last_equity_point ? (
                        <div className="space-y-1">
                          <div>{formatDateTime(bot.last_equity_point.timestamp)}</div>
                          <div className="text-xs text-slate-500">{formatCurrency(bot.last_equity_point.equity)}</div>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">How dev data loading works</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. The frontend looks for the latest run inside the backend repo&apos;s <code className="rounded bg-slate-950 px-1.5 py-0.5">artifacts/</code> directory.</li>
              <li>2. If a current artifact exists, it reads <code className="rounded bg-slate-950 px-1.5 py-0.5">leaderboard_snapshot.json</code> and optional trade detail files from there.</li>
              <li>3. If no artifact exists yet, it falls back to <code className="rounded bg-slate-950 px-1.5 py-0.5">docs/examples.leaderboard_snapshot.json</code>.</li>
              <li>4. You can override the backend path with <code className="rounded bg-slate-950 px-1.5 py-0.5">BACKEND_REPO_PATH</code>.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Current backend bridge</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <div className="text-slate-500">Resolved backend repo</div>
                <div className="break-all font-medium text-slate-100">{backendRepoPath}</div>
              </div>
              <div>
                <div className="text-slate-500">Latest artifact</div>
                <div className="break-all font-medium text-slate-100">{artifactPath ?? 'No artifact found — using example snapshot'}</div>
              </div>
              <div>
                <div className="text-slate-500">API</div>
                <div className="font-medium text-slate-100">/api/leaderboard/latest and /api/bots/[botName]/latest</div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

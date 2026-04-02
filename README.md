# Trading Leaderboard

Next.js frontend for the Alpaca trading prototype leaderboard.

This repo used to be built around Firebase plus one Alpaca paper account per bot. That model is now deprecated.
The active frontend reads the backend snapshot/artifact contract produced by:
- `capstone_ai_trading_bots/artifacts/<run_id>/leaderboard_snapshot.json`
- optional drilldown files like `trade_log.json` and `paper_run.json`

## What changed

### Old model
- register each bot with its own Alpaca credentials
- push leaderboard state into Firebase
- subscribe to Firestore in the UI

### New model
- shared Alpaca paper account on the backend
- local attribution + artifact generation on the backend
- frontend reads backend snapshots as the source of truth

## Current pages and APIs

### UI
- `/` — server-rendered leaderboard against the latest backend snapshot

### Local API routes
- `GET /api/leaderboard/latest` — latest normalized leaderboard payload
- `GET /api/bots/:botName/latest` — latest detail payload for a bot in the current snapshot

### Deprecated routes
These now return `410 Gone` to make the migration explicit:
- `POST /api/register-bot`
- `POST /api/update-leaderboard`

## Dev data loading

The app resolves backend data in this order:

1. Latest backend artifact under `../capstone_ai_trading_bots/artifacts/`
2. Fallback example payload at `../capstone_ai_trading_bots/docs/examples.leaderboard_snapshot.json`

You can override the backend repo location with:

```bash
BACKEND_REPO_PATH=/absolute/or/relative/path/to/capstone_ai_trading_bots
```

## Running locally

```bash
npm install
npm run build
npm run dev
```

Then open <http://localhost:3000>.

## Backend integration notes

### Dev
For local development, generate backend artifacts first, then start this frontend.
The frontend will automatically read the latest artifact directory.

### Future production shape
The backend contract is already suitable for a lightweight API layer such as:
- `GET /api/leaderboard/latest`
- `GET /api/bots/:bot_name/latest`
- `GET /api/runs/:run_id`

In production, those routes can be backed by:
- a shared filesystem/volume,
- object storage,
- or a small service that exposes the latest artifact bundle.

## Shared-account caveat

Paper mode uses a shared Alpaca paper account with local order attribution.
Per-bot equity/cash/PnL should therefore be labeled as estimated shared-account allocation when sourced from paper reconciliation rather than broker-native account splits.

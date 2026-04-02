# Frontend Salvage Plan

Date: 2026-04-01
Status: in progress

## Goal

Salvage the useful shell of `trading_leaderboard` and replace the obsolete Firebase + per-bot registration model with a snapshot-driven frontend that targets the backend artifact contract documented in:
- `capstone_ai_trading_bots/docs/FRONTEND_CONTRACT.md`
- `capstone_ai_trading_bots/docs/examples.leaderboard_snapshot.json`

## Constraints

- Shared Alpaca account architecture means the old one-Alpaca-account-per-bot model is invalid.
- Preserve useful UI pieces only: Next.js app shell, Tailwind styling baseline, simple table/card layout.
- Prefer a working vertical slice over broad scaffolding.
- Keep a clean local/dev bridge to backend artifacts and example snapshots.

## Proposed approach

1. Remove Firebase from the render path.
2. Add typed helpers that:
   - read the latest backend artifact snapshot from the backend repo when available
   - fall back to the backend example snapshot when artifact output is missing
   - expose normalized leaderboard + drilldown data
3. Build a server-rendered homepage against the new contract:
   - rank
   - bot name
   - mode
   - equity / cash
   - trade count
   - halted state
   - warnings
   - last equity point / last update
4. Add local API routes for:
   - `GET /api/leaderboard/latest`
   - `GET /api/bots/[botName]/latest`
5. Deprecate legacy mutation routes:
   - `/api/register-bot`
   - `/api/update-leaderboard`
6. Update README with dev/prod data-source guidance.

## Risks

- Backend artifacts currently show only the runs that exist; multi-bot ranking depends on backend producing multi-bot snapshots.
- Bot drilldown is richer in `paper_run.json` than in backtest artifacts, so detail sections must degrade gracefully.
- The repo mixes `src/app` with `pages/api`; Next supports this, but routing should remain simple.

## First implementation step

Create a filesystem-backed data layer that discovers the latest backend artifact snapshot and normalizes it for both the page and API routes.

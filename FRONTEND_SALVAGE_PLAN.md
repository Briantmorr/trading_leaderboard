# Frontend Salvage Plan

Date: 2026-04-01
Status: vertical slice landed; cleanup pass in progress

## Goal

Salvage the useful shell of `trading_leaderboard` and replace the obsolete Firebase + per-bot registration model with a snapshot-driven frontend that targets the backend artifact contract documented in:
- `capstone_ai_trading_bots/docs/FRONTEND_CONTRACT.md`
- `capstone_ai_trading_bots/docs/examples.leaderboard_snapshot.json`

## What is already done

- Firebase is out of the active render path.
- The homepage renders against backend snapshot artifacts.
- Typed filesystem-backed helpers load the latest artifact or fall back to the backend example snapshot.
- Local API routes exist for latest leaderboard and bot detail payloads.
- Legacy mutation endpoints now return `410 Gone`.
- The repo no longer needs Firebase or the legacy Alpaca JS SDK as runtime dependencies.

## Constraints

- Shared Alpaca account architecture means the old one-Alpaca-account-per-bot model is invalid.
- Preserve useful UI pieces only: Next.js app shell, Tailwind styling baseline, simple table/card layout.
- Prefer a working vertical slice over broad scaffolding.
- Keep a clean local/dev bridge to backend artifacts and example snapshots.

## Active cleanup goals

1. Keep migration status obvious in docs and route behavior.
2. Remove leftover obsolete dependencies and assumptions where safe.
3. Preserve only the frontend surface that matches the backend artifact contract.
4. Avoid reintroducing Firebase as an intermediate truth layer.

## Remaining work

- add richer bot drilldown UI against `paper_run.json`
- decide whether legacy `pages/api/*` deprecation shims should eventually move entirely into App Router handlers
- define a production deployment path for backend artifact access
- improve error states when backend artifacts are missing or stale

## Risks

- Backend artifacts currently reflect only the runs that exist; multi-bot ranking quality depends on backend snapshot completeness.
- Bot drilldown is richer in `paper_run.json` than in backtest artifacts, so detail sections must degrade gracefully.
- The repo mixes `src/app` with `pages/api`; Next supports this, but the migration should eventually settle on one routing style.

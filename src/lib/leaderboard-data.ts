import { promises as fs } from 'fs';
import path from 'path';

export interface EquityPoint {
  timestamp: string;
  equity: number;
}

export interface BotSnapshot {
  rank: number;
  bot_name: string;
  mode: string;
  ending_equity: number;
  ending_cash: number;
  trade_count: number;
  halted: boolean;
  warnings: string[];
  last_equity_point?: EquityPoint;
}

export interface LeaderboardSnapshot {
  contract_version: string;
  generated_at: string;
  run_id: string;
  source: string;
  account: Record<string, unknown>;
  bots: BotSnapshot[];
}

export interface TradeLogEntry {
  timestamp: string;
  symbol: string;
  side: string;
  qty: number;
  price: number;
  fees?: number;
  metadata?: Record<string, unknown>;
}

export interface BotDetail {
  botName: string;
  snapshot: BotSnapshot | null;
  snapshotMeta: Pick<LeaderboardSnapshot, 'generated_at' | 'run_id' | 'source' | 'contract_version'>;
  recentTrades: TradeLogEntry[];
  paperRun: Record<string, unknown> | null;
  warnings: string[];
  dataSource: {
    backendRepoPath: string;
    artifactPath: string | null;
    fallback: 'artifact' | 'example';
  };
}

const DEFAULT_BACKEND_REPO_PATH = path.resolve(process.cwd(), '../capstone_ai_trading_bots');
const BACKEND_REPO_PATH = process.env.BACKEND_REPO_PATH
  ? path.resolve(process.cwd(), process.env.BACKEND_REPO_PATH)
  : DEFAULT_BACKEND_REPO_PATH;

const ARTIFACTS_DIR = path.join(BACKEND_REPO_PATH, 'artifacts');
const EXAMPLE_SNAPSHOT_PATH = path.join(BACKEND_REPO_PATH, 'docs', 'examples.leaderboard_snapshot.json');

async function fileExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(targetPath: string): Promise<T> {
  const raw = await fs.readFile(targetPath, 'utf8');
  return JSON.parse(raw) as T;
}

async function findLatestArtifactDir(): Promise<string | null> {
  if (!(await fileExists(ARTIFACTS_DIR))) {
    return null;
  }

  const entries = await fs.readdir(ARTIFACTS_DIR, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  if (directories.length === 0) {
    return null;
  }

  return path.join(ARTIFACTS_DIR, directories[directories.length - 1]);
}

async function loadSnapshotFromArtifactDir(artifactDir: string): Promise<LeaderboardSnapshot | null> {
  const snapshotPath = path.join(artifactDir, 'leaderboard_snapshot.json');
  if (!(await fileExists(snapshotPath))) {
    return null;
  }
  return readJsonFile<LeaderboardSnapshot>(snapshotPath);
}

export async function getLatestLeaderboardData(): Promise<{
  snapshot: LeaderboardSnapshot;
  artifactPath: string | null;
  fallback: 'artifact' | 'example';
  backendRepoPath: string;
}> {
  const latestArtifactDir = await findLatestArtifactDir();
  if (latestArtifactDir) {
    const artifactSnapshot = await loadSnapshotFromArtifactDir(latestArtifactDir);
    if (artifactSnapshot) {
      return {
        snapshot: artifactSnapshot,
        artifactPath: latestArtifactDir,
        fallback: 'artifact',
        backendRepoPath: BACKEND_REPO_PATH,
      };
    }
  }

  return {
    snapshot: await readJsonFile<LeaderboardSnapshot>(EXAMPLE_SNAPSHOT_PATH),
    artifactPath: null,
    fallback: 'example',
    backendRepoPath: BACKEND_REPO_PATH,
  };
}

export async function getBotDetail(botName: string): Promise<BotDetail | null> {
  const { snapshot, artifactPath, fallback, backendRepoPath } = await getLatestLeaderboardData();
  const bot = snapshot.bots.find((entry) => entry.bot_name === botName) ?? null;

  if (!bot) {
    return null;
  }

  let recentTrades: TradeLogEntry[] = [];
  let paperRun: Record<string, unknown> | null = null;

  if (artifactPath) {
    const tradeLogPath = path.join(artifactPath, 'trade_log.json');
    if (await fileExists(tradeLogPath)) {
      const tradeLog = await readJsonFile<TradeLogEntry[]>(tradeLogPath);
      recentTrades = tradeLog.slice(-10).reverse();
    }

    const paperRunPath = path.join(artifactPath, 'paper_run.json');
    if (await fileExists(paperRunPath)) {
      paperRun = await readJsonFile<Record<string, unknown>>(paperRunPath);
    }
  }

  return {
    botName,
    snapshot: bot,
    snapshotMeta: {
      generated_at: snapshot.generated_at,
      run_id: snapshot.run_id,
      source: snapshot.source,
      contract_version: snapshot.contract_version,
    },
    recentTrades,
    paperRun,
    warnings: bot.warnings,
    dataSource: {
      backendRepoPath,
      artifactPath,
      fallback,
    },
  };
}

'use client';

import { useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

// Firebase configuration loaded from .env.local
const firebaseConfig = {
    apiKey: "AIzaSyCK6Syo623VvTzK-3hFAA-uffK20w4XwwE",
    authDomain: "stock-trading-leaderboard.firebaseapp.com",
    projectId: "stock-trading-leaderboard",
    storageBucket: "stock-trading-leaderboard.firebasestorage.app",
    messagingSenderId: "17596831673",
    appId: "1:17596831673:web:78a6c5334eeee09ee04868"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// 3. Bot interface
interface Bot {
  bot_name: string;
  portfolio_value: number;
  timestamp: number; // e.g. 1740533078154
}

// 4. Format date as MM/DD/YY
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
}

// 5. Return a label with an emoji badge for top 3 ranks
function getRankLabel(rank: number): string {
  if (rank === 1) return '🥇 1';
  if (rank === 2) return '🥈 2';
  if (rank === 3) return '🥉 3';
  return `${rank}`;
}

export default function Home() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to the 'bots' collection
    const unsubscribe = onSnapshot(collection(db, 'bots'), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data()) as Bot[];

      // Sort by portfolio_value descending
      data.sort((a, b) => b.portfolio_value - a.portfolio_value);
      setBots(data);
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header: black background */}
      <header className="bg-black py-6 mb-8 text-white">
        <h1 className="text-4xl font-bold text-center">Trading Bots Leaderboard</h1>
        {lastUpdated && (
          <p className="text-center mt-2 text-sm text-gray-200">
            Last Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </header>

      {/* Table Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3 w-24 text-left font-medium">Rank</th>
                <th className="px-6 py-3 text-left font-medium">Bot Name</th>
                <th className="px-6 py-3 text-right font-medium">Portfolio Value</th>
                <th className="px-6 py-3 text-right font-medium">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot, index) => {
                const rank = index + 1; // 1-based rank
                // Highlight row if rank <= 3
                const highlight = rank <= 3 ? 'bg-yellow-50' : '';
                return (
                  <tr
                    key={bot.bot_name + rank}
                    className={`${highlight} border-b last:border-b-0 hover:bg-gray-50 transition`}
                  >
                    <td className="px-6 py-4 font-semibold">
                      {getRankLabel(rank)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {bot.bot_name}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ${bot.portfolio_value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {formatDate(bot.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
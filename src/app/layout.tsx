// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Stock Trading Leaderboard',
  description: 'Elegant, minimalist leaderboard for stock trading',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// pages/api/update-leaderboard.js

import admin from 'firebase-admin';
import Alpaca from '@alpacahq/alpaca-trade-api';

// Initialize Firebase Admin if not already initialized.
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  // Only allow POST requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Retrieve all bots from the 'bots' collection.
    const botsSnapshot = await db.collection('bots').get();
    const bots = botsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const results = [];

    for (const bot of bots) {
      try {
        // Create an Alpaca client for this bot using its stored API key and the common secret.
        const alpaca = new Alpaca({
          keyId: bot.alpaca_account_key,             // Bot's stored API key
          secretKey: bot.alpaca_account_secret, // Common Alpaca secret key from env
          paper: true,
        });

        // Fetch account details from Alpaca.
        const account = await alpaca.getAccount();
        console.log(account)
        const portfolioValue = parseFloat(account.portfolio_value);
        const cash = parseFloat(account.cash);

        console.log(
          `Updating bot ${bot.bot_name}: portfolio_value $${portfolioValue}, cash $${cash}`
        );

        await db.collection('bots').doc(bot.id).update({
          portfolio_value: portfolioValue,
          timestamp: Date.now(),
        });

        results.push({ bot: bot.bot_name, status: 'updated', portfolioValue});
      } catch (error) {
        console.error(`Error updating bot ${bot.bot_name}:`, error);
        results.push({ bot: bot.bot_name, status: 'failed', error: error.message });
      }
    }

    res.status(200).json({ message: 'Leaderboard updated successfully', results });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

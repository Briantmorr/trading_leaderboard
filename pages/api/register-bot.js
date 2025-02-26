// pages/api/register-bot.js
import admin from 'firebase-admin';
import path from 'path';

// Ensure you only initialize once
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);  
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bot_name, alpaca_account_key, alpaca_account_secret } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${process.env.TEAM_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!bot_name || !alpaca_account_key || !alpaca_account_secret) {
    return res.status(400).json({ error: 'Missing bot_name or alpaca_account_id or secret' });
  }

  try {
    const portfolio_value = 100000
    console.log('Attempting to write to Firestore:', { bot_name, alpaca_account_key });
    await db.collection('bots').doc(bot_name).set({
      bot_name,
      alpaca_account_key,
      alpaca_account_secret,
      timestamp: Date.now(),
      portfolio_value
    });
    console.log('Successfully registered bot:', bot_name);
    return res.status(200).json({ message: 'Bot registered successfully' });
  } catch (error) {
    console.error('Error registering bot:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

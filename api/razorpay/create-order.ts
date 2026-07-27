import { readDb } from '../_db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { amount, currency = 'INR', receipt, notes } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      // Call Razorpay API to create real order
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Razorpay expects amount in paise
          currency,
          receipt,
          notes
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Razorpay API error: ${errText}`);
      }

      const order = await response.json();
      return res.status(200).json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId
      });
    } else if (process.env.NODE_ENV === 'production') {
      return res.status(400).json({ success: false, error: 'Razorpay API credentials missing in production environment' });
    } else {
      // Fallback/offline mode for local testing
      return res.status(200).json({
        success: true,
        order_id: `order_local_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        key_id: keyId || 'rzp_test_dhara_demo',
        isTestMode: true
      });
    }
  } catch (error: any) {
    console.error('Create Razorpay order error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create payment order' });
  }
}

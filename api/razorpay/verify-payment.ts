import { readDb, writeDb } from '../_db.js';
import crypto from 'crypto';

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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      module,
      name,
      email,
      phone,
      amount,
      ticketType,
      organization,
      interest,
      specialNotes,
      sevaDomain,
      pan,
      isAnonymous
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let verified = false;

    if (keySecret && razorpay_signature && !razorpay_order_id.includes('local')) {
      // Verify signature using HmacSHA256
      const generated_signature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature === razorpay_signature) {
        verified = true;
      }
    } else {
      // For local test orders, we auto-verify
      verified = true;
    }

    if (!verified) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // Record the payment/submission in the database
    const db = await readDb();
    const timestamp = new Date().toISOString();
    let newEntry: any = null;
    let activityMessage = '';
    let activityType: 'nomination' | 'donation' | 'checkin' | 'volunteer' | 'system' = 'system';

    if (module === 'Event Registration') {
      const passCode = `DDA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      newEntry = {
        id: `del-${Date.now()}`,
        delegate_name: name || 'Anonymous',
        email: email || '',
        phone: phone || '',
        pass_tier: (ticketType || 'delegate').toLowerCase().replace('pass', '').trim(),
        ticket_count: 1,
        pass_code: passCode,
        checked_in: false,
        checkin_time: null,
        seat_zone: 'Zone B - Seva Row 10',
        payment_status: 'PAID',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: Number(amount),
        created_at: timestamp
      };
      db.delegates.push(newEntry);
      activityType = 'checkin';
      activityMessage = `New Delegate pass registered for "${name}" (Pass: ${passCode})`;
    } else {
      // Donation
      newEntry = {
        id: `don-${Date.now()}`,
        type: 'individual',
        name: name || 'Anonymous Donor',
        email: email || '',
        phone: phone || '',
        amount: Number(amount || 0),
        seva_domain: sevaDomain || 'General Fund',
        pan: pan || '',
        is_anonymous: Boolean(isAnonymous),
        receipt_sent: false,
        payment_status: 'success',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        created_at: timestamp
      };
      db.donations.push(newEntry);
      activityType = 'donation';
      activityMessage = `Donation of ₹${newEntry.amount.toLocaleString()} received from ${newEntry.is_anonymous ? 'Anonymous' : newEntry.name}`;
    }

    db.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: activityType,
      message: activityMessage,
      user: 'Razorpay Payment Gateway'
    });

    await writeDb(db);

    return res.status(200).json({
      success: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      details: {
        pass_code: newEntry.pass_code,
        receiptNo: module !== 'Event Registration' ? `REC-80G-${Date.now().toString().slice(-6)}` : undefined,
        amount: amount,
        donor_name: name,
        delegate_name: name
      }
    });
  } catch (error: any) {
    console.error('Verify Razorpay payment error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to verify payment' });
  }
}

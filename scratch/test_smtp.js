import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function checkSmtp() {
  console.log('--- SMTP Diagnostic Test ---');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    connectionTimeout: 5000, // 5 sec timeout
    greetingTimeout: 5000,
    socketTimeout: 5000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false }
  });

  try {
    const verified = await transporter.verify();
    console.log('Status: SUCCESS');
    console.log('Details:', verified);
  } catch (err) {
    console.log('Status: ERROR');
    console.log('Error Code:', err.code);
    console.log('Error Command:', err.command);
    console.log('Error Response:', err.response || err.message);
  }
  process.exit(0);
}

checkSmtp();

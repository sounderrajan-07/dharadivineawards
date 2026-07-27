import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON & URL-encoded request body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration for API endpoints
app.use((req: any, res: any, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Import API Handlers
import configHandler from './api/config.js';
import dbHandler from './api/db.js';
import submissionsHandler from './api/submissions.js';
import actionHandler from './api/action.js';
import eventsHandler from './api/events.js';
import galleryHandler from './api/gallery.js';
import newsHandler from './api/news.js';
import uploadHandler from './api/upload.js';
import createOrderHandler from './api/razorpay/create-order.js';
import verifyPaymentHandler from './api/razorpay/verify-payment.js';

// Route API endpoints
app.all('/api/config', (req: any, res: any) => configHandler(req, res));
app.all('/api/db', (req: any, res: any) => dbHandler(req, res));
app.all('/api/submissions', (req: any, res: any) => submissionsHandler(req, res));
app.all('/api/action', (req: any, res: any) => actionHandler(req, res));
app.all('/api/events', (req: any, res: any) => eventsHandler(req, res));
app.all('/api/gallery', (req: any, res: any) => galleryHandler(req, res));
app.all('/api/news', (req: any, res: any) => newsHandler(req, res));
app.all('/api/upload', (req: any, res: any) => uploadHandler(req, res));
app.all('/api/razorpay/create-order', (req: any, res: any) => createOrderHandler(req, res));
app.all('/api/razorpay/verify-payment', (req: any, res: any) => verifyPaymentHandler(req, res));

// Serve uploads and static assets from public/ and dist/
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Client-side SPA route fallback
app.use((req: any, res: any) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dhara Foundations Production VPS Server running on http://localhost:${PORT}`);
});

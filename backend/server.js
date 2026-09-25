// Dream Country Visas — API Server (contact form, auth, admin dashboard)
// Runs on port 3001; Vite dev server proxies /api/* here.
//
// No top-level await anywhere in this module or its imports below — Hostinger's
// Node hosting loads the entry file via require(), which throws
// ERR_REQUIRE_ASYNC_MODULE on an ESM graph that uses top-level await.
import 'dotenv/config'; // load .env from project root (process cwd) — must run before db.js reads DB_* env vars
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import './db.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

// Only these origins may call the API from a browser. Add production
// domains here (or via CORS_ORIGINS in .env) before going live elsewhere.
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://dreamcountryvisas.com',
  'https://www.dreamcountryvisas.com',
  'https://dreamcountryvisas.in',
  'https://www.dreamcountryvisas.in',
  'https://snow-partridge-646013.hostingersite.com', // temporary Hostinger test subdomain — remove once live on the real domain
];
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : DEFAULT_ORIGINS;

const app = express();
// Helmet's default CSP blocks third-party scripts — allow Google Analytics
// (hosts per Google's GA4 CSP guidance). Everything else keeps the defaults.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", 'https://*.googletagmanager.com'],
        connectSrc: [
          "'self'",
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
          'https://*.googletagmanager.com',
        ],
        imgSrc: ["'self'", 'data:', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
      },
    },
  })
);
app.use(express.json());

// CORS only applies to the API — the built frontend's own JS/CSS is fetched
// with `crossorigin` (Vite's default for module scripts), which sends an
// Origin header even for same-origin requests. Scoping this to /api avoids
// rejecting the site's own static assets when their origin isn't whitelisted.
const corsMiddleware = cors({
  origin(origin, callback) {
    // No Origin header (e.g. curl, server-to-server, Vite's own proxy) — allow.
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});

app.use('/api/contact', corsMiddleware, contactRoutes);
app.use('/api/auth', corsMiddleware, authRoutes);
app.use('/api/admin', corsMiddleware, adminRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Serve the built frontend (dist/) and fall back to index.html for
// React Router routes, without swallowing unmatched /api/* requests.
app.use(express.static(distPath));
app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ ok: false, error: 'Not allowed by CORS.' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ ok: false, error: 'Internal server error.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Dream Country Visas API running → http://localhost:${PORT}`)
);

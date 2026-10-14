import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';
import { isPublicReviewVisible } from '../../src/utils/programVisibility.js';

const router = Router();

// ── GET /api/reviews (Public: fetch approved reviews, phone numbers stripped for privacy) ──
router.get('/', async (req, res) => {
  try {
    const { country } = req.query;
    let query = 'SELECT id, country, program, client_name, rating, review_text, verified, helpful_count, status, created_at FROM reviews WHERE status = ?';
    const params = ['approved'];

    if (country && country !== 'all') {
      query += ' AND country = ?';
      params.push(country.toLowerCase());
    }

    query += ' ORDER BY created_at DESC, id DESC';
    const [storedRows] = await pool.query(query, params);
    // Hide unavailable programs publicly; preserve all records for admin moderation.
    const rows = storedRows.filter(isPublicReviewVisible);

    // Compute Amazon/Flipkart-style rating stats
    const total = rows.length;
    let sum = 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const r of rows) {
      const star = Math.max(1, Math.min(5, Number(r.rating) || 5));
      counts[star] = (counts[star] || 0) + 1;
      sum += star;
    }

    const avg = total > 0 ? (sum / total).toFixed(1) : '5.0';
    const percentages = {
      5: total > 0 ? Math.round((counts[5] / total) * 100) : 0,
      4: total > 0 ? Math.round((counts[4] / total) * 100) : 0,
      3: total > 0 ? Math.round((counts[3] / total) * 100) : 0,
      2: total > 0 ? Math.round((counts[2] / total) * 100) : 0,
      1: total > 0 ? Math.round((counts[1] / total) * 100) : 0,
    };

    res.json({
      ok: true,
      reviews: rows,
      stats: {
        averageRating: Number(avg),
        totalReviews: total,
        counts,
        percentages,
      },
    });
  } catch (err) {
    console.error('Failed to fetch reviews:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to load reviews.' });
  }
});

// ── POST /api/reviews (Public: submit review with Phone validation & Anti-Bot Rate Limiting) ──
router.post('/', async (req, res) => {
  try {
    const {
      country,
      program,
      client_name,
      client_location,
      phone_code,
      phone,
      rating,
      review_text,
      website_hp,
    } = req.body;

    // 1. Honeypot check (Bots fill this invisible field; real users never see it)
    if (website_hp) {
      return res.json({ ok: true, message: 'Review received.' });
    }

    // 2. Validate client name
    if (!client_name || client_name.trim().length < 2) {
      return res.status(400).json({ ok: false, error: 'Please enter your full name.' });
    }

    // 3. Validate review comments
    if (!review_text || review_text.trim().length < 8) {
      return res.status(400).json({ ok: false, error: 'Please provide at least a brief comment about your experience.' });
    }

    // 4. Validate phone number for bot/spam prevention & country digit rules
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const code = (phone_code || '+91').trim();

    const COUNTRY_SPECS = {
      '+91': { min: 10, max: 10, name: 'India: 10 digits starting with 6-9' },
      '+1': { min: 10, max: 10, name: 'US/Canada: 10 digits' },
      '+971': { min: 9, max: 9, name: 'UAE: 9 digits' },
      '+44': { min: 10, max: 13, name: 'UK: 10-13 digits' },
      '+49': { min: 10, max: 12, name: 'Germany: 10-12 digits' },
      '+81': { min: 10, max: 11, name: 'Japan: 10-11 digits' },
      '+64': { min: 8, max: 10, name: 'New Zealand: 8-10 digits' },
      '+27': { min: 9, max: 10, name: 'South Africa: 9-10 digits' },
      '+61': { min: 9, max: 9, name: 'Australia: 9 digits' },
      '+65': { min: 8, max: 8, name: 'Singapore: 8 digits' },
      '+60': { min: 9, max: 10, name: 'Malaysia: 9-10 digits' },
      '+966': { min: 9, max: 9, name: 'Saudi Arabia: 9 digits' },
      '+974': { min: 8, max: 8, name: 'Qatar: 8 digits' },
      '+33': { min: 9, max: 9, name: 'France: 9 digits' },
      '+39': { min: 9, max: 10, name: 'Italy: 9-10 digits' },
      '+34': { min: 9, max: 9, name: 'Spain: 9 digits' },
      '+351': { min: 9, max: 9, name: 'Portugal: 9 digits' },
      '+30': { min: 10, max: 10, name: 'Greece: 10 digits' },
      '+357': { min: 8, max: 8, name: 'Cyprus: 8 digits' },
      '+356': { min: 8, max: 8, name: 'Malta: 8 digits' },
      '+90': { min: 10, max: 10, name: 'Turkey: 10 digits' },
      '+86': { min: 11, max: 11, name: 'China: 11 digits' },
    };

    const spec = COUNTRY_SPECS[code] || { min: 7, max: 13, name: '7-13 digits' };

    if (!cleanPhone || cleanPhone.length < spec.min || cleanPhone.length > spec.max) {
      return res.status(400).json({
        ok: false,
        error: `Phone number for ${code} requires ${spec.name}. (Entered ${cleanPhone.length} digits)`,
      });
    }

    // Reject dummy/repetitive numbers (e.g. 9898989898, 1111111111)
    if (/^(\d)\1+$/.test(cleanPhone) || /(\d)\1{4,}/.test(cleanPhone) || /^(\d{2})\1{3,}$/.test(cleanPhone)) {
      return res.status(400).json({
        ok: false,
        error: 'Please enter a genuine, non-repeating phone number.',
      });
    }

    if (code === '+91' && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        ok: false,
        error: 'Valid Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.',
      });
    }
    if (code === '+1' && !/^[2-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        ok: false,
        error: 'Valid US/Canadian numbers must be 10 digits starting with 2-9.',
      });
    }

    const fullPhone = `${code}${cleanPhone}`;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // 5. Anti-Spam / Rate Limiting: Maximum 5 reviews per phone number
    const [existing] = await pool.query(
      'SELECT phone, review_count FROM review_rate_limits WHERE phone = ?',
      [fullPhone]
    );

    if (existing.length > 0 && Number(existing[0].review_count) >= 5) {
      return res.status(429).json({
        ok: false,
        error: 'This mobile number has reached the maximum allowed limit of 5 reviews.',
      });
    }

    // 6. Anti-Spam IP Rate-Limiting (max 10 reviews per hour from same IP)
    const [ipRecords] = await pool.query(
      'SELECT COUNT(*) as count FROM review_rate_limits WHERE ip = ? AND last_review_at > NOW() - INTERVAL 1 HOUR',
      [clientIp]
    );
    if (ipRecords[0]?.count >= 10) {
      return res.status(429).json({
        ok: false,
        error: 'Too many submissions from this network. Please try again later.',
      });
    }

    // 7. Format display name: e.g. "Ramesh, Dubai"
    const loc = (client_location || '').trim();
    const displayName = loc ? `${client_name.trim()}, ${loc}` : client_name.trim();

    const star = Math.max(1, Math.min(5, Number(rating) || 5));
    const targetCountry = (country || 'general').trim().toLowerCase();
    const targetProgram = (program || `${targetCountry.toUpperCase()} Program`).trim();

    // Secure verification payload stored in review_title (NOT shown to public)
    const secureMeta = JSON.stringify({
      phone: `${code} ${cleanPhone}`,
      location: loc,
      ip: clientIp,
    });

    const [result] = await pool.query(
      `INSERT INTO reviews (country, program, client_name, rating, review_title, review_text, verified, helpful_count, status)
       VALUES (?, ?, ?, ?, ?, ?, 1, 0, 'approved')`,
      [targetCountry, targetProgram, displayName, star, secureMeta, review_text.trim()]
    );

    // Update rate-limit tracker
    await pool.query(
      `INSERT INTO review_rate_limits (phone, ip, last_review_at, review_count)
       VALUES (?, ?, NOW(), 1)
       ON DUPLICATE KEY UPDATE last_review_at = NOW(), review_count = review_count + 1, ip = VALUES(ip)`,
      [fullPhone, clientIp]
    );

    res.json({
      ok: true,
      message: 'Verified review submitted successfully!',
      review: {
        id: result.insertId,
        country: targetCountry,
        program: targetProgram,
        client_name: displayName,
        rating: star,
        review_text: review_text.trim(),
        verified: 1,
        helpful_count: 0,
        status: 'approved',
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Failed to submit review:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to submit review.' });
  }
});

// ── POST /api/reviews/:id/helpful (Toggle vote / unvote) ──
router.post('/:id/helpful', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { action } = req.body || {};

    if (action === 'unvote') {
      await pool.query('UPDATE reviews SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = ?', [id]);
    } else {
      await pool.query('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?', [id]);
    }

    const [rows] = await pool.query('SELECT helpful_count FROM reviews WHERE id = ?', [id]);
    res.json({ ok: true, helpful_count: rows[0]?.helpful_count || 0 });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to update helpful count.' });
  }
});

// ── ADMIN ROUTES (Protected by requireAdmin) ──

// GET /api/reviews/admin/all — Fetch all reviews for Superadmin
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const { country, search } = req.query;
    let query = 'SELECT * FROM reviews WHERE 1=1';
    const params = [];

    if (country && country !== 'all') {
      query += ' AND country = ?';
      params.push(country.toLowerCase());
    }

    if (search && search.trim()) {
      query += ' AND (client_name LIKE ? OR review_title LIKE ? OR review_text LIKE ? OR program LIKE ?)';
      const q = `%${search.trim()}%`;
      params.push(q, q, q, q);
    }

    query += ' ORDER BY created_at DESC, id DESC';
    const [rows] = await pool.query(query, params);

    res.json({ ok: true, count: rows.length, reviews: rows });
  } catch (err) {
    console.error('Admin reviews fetch error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to load reviews for admin.' });
  }
});

// DELETE /api/reviews/admin/:id — Admin delete review
router.delete('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: 'Review not found.' });
    }
    res.json({ ok: true, message: 'Review successfully deleted.' });
  } catch (err) {
    console.error('Admin review delete error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to delete review.' });
  }
});

// PATCH /api/reviews/admin/:id/status — Admin toggle approved / hidden
router.patch('/admin/:id/status', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!['approved', 'hidden'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid status.' });
    }

    await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
    res.json({ ok: true, message: `Review status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to update review status.' });
  }
});

export default router;

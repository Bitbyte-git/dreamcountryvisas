import { Router } from 'express';
import { Resend } from 'resend';
import dns from 'dns';
import { pool, schema } from '../db.js';
import { contactLimiter } from '../middleware/rateLimit.js';

const dnsPromises = dns.promises;
const router = Router();

// Escapes user-supplied text before it's interpolated into the email HTML —
// without this, a submitted name/program containing HTML would be injected
// straight into the outbound email body.
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const rawTo = process.env.MAIL_TO_EMAIL || 'infisq.senthil@gmail.com';
const TO_EMAILS = rawTo.split(',').map((e) => e.trim()).filter(Boolean);
// Resend only sends from a domain verified in its dashboard. Until one is,
// its shared test sender works — but only delivers to the Resend account's
// own email address.
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'Dream Country Visas <onboarding@resend.dev>';

// Shown in the customer's confirmation email — keep in sync with CONTACT in src/data.js.
const COMPANY = {
  phone: '+91 8595968122',
  phoneLink: 'tel:+918595968122',
  whatsappLink: 'https://wa.me/918595968122',
  email: 'consult@dreamcountryvisas.com',
  hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
};

// Auto-reply to the person who filled in the form, so they know it arrived.
function customerConfirmationHtml(safe, siteUrl) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222">
      <div style="background:#0A1032;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:#C8A84B;margin:0;font-size:24px;letter-spacing:.5px">Dream Country Visas</h1>
        <p style="color:rgba(255,255,255,.75);margin:6px 0 0;font-size:13px">Your Trusted Immigration Partner</p>
      </div>
      <div style="background:#ffffff;padding:28px 24px;border:1px solid #eee;border-top:none">
        <p style="font-size:16px;margin:0 0 16px">Dear ${safe.salutation} ${safe.firstName} ${safe.lastName},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Thank you for contacting <strong>Dream Country Visas</strong>. We have received your enquiry
          and one of our immigration experts will get in touch with you within <strong>24 hours</strong>.
        </p>

        <div style="background:#f7f7fb;border-left:4px solid #C8A84B;border-radius:8px;padding:16px 18px;margin:20px 0">
          <p style="margin:0 0 10px;font-size:13px;color:#777;text-transform:uppercase;letter-spacing:.5px"><strong>Your enquiry</strong></p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:4px 0;color:#555;width:40%">Program</td><td style="padding:4px 0"><strong>${safe.program}</strong></td></tr>
            <tr><td style="padding:4px 0;color:#555">Phone</td><td style="padding:4px 0">${safe.phoneCode} ${safe.phone}</td></tr>
            <tr><td style="padding:4px 0;color:#555">Email</td><td style="padding:4px 0">${safe.email}</td></tr>
          </table>
        </div>

        <p style="font-size:15px;line-height:1.6;margin:0 0 20px">
          Need to speak with us sooner? Reach us directly:
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          <tr><td style="padding:5px 0">📞 <a href="${COMPANY.phoneLink}" style="color:#0A1032;text-decoration:none"><strong>${COMPANY.phone}</strong></a></td></tr>
          <tr><td style="padding:5px 0">💬 <a href="${COMPANY.whatsappLink}" style="color:#0A1032;text-decoration:none"><strong>Chat on WhatsApp</strong></a></td></tr>
          <tr><td style="padding:5px 0">✉️ <a href="mailto:${COMPANY.email}" style="color:#0A1032;text-decoration:none"><strong>${COMPANY.email}</strong></a></td></tr>
          <tr><td style="padding:5px 0;color:#555">🕘 ${COMPANY.hours}</td></tr>
        </table>

        <p style="font-size:15px;margin:0">Warm regards,<br><strong>Team Dream Country Visas</strong></p>
      </div>
      <div style="background:#0A1032;padding:16px 24px;border-radius:0 0 12px 12px;text-align:center">
        <a href="${siteUrl}" style="color:#C8A84B;font-size:13px;text-decoration:none">${siteUrl.replace(/^https?:\/\//, '')}</a>
        <p style="color:rgba(255,255,255,.55);font-size:11px;margin:8px 0 0;line-height:1.5">
          You received this email because you submitted an enquiry on our website.
          If this wasn't you, please ignore this message.
        </p>
      </div>
    </div>
  `;
}

// The site the form was filled on — both domains run this same app, so the
// browser's Origin header (always sent on the form's POST) tells them apart.
// Falls back to Referer, then Host. Stored without "www." so the admin sees
// just "dreamcountryvisas.com" or "dreamcountryvisas.in".
function submittingDomain(req) {
  const candidates = [req.get('origin'), req.get('referer')];
  for (const value of candidates) {
    if (!value) continue;
    try {
      return new URL(value).hostname.replace(/^www\./, '').slice(0, 100);
    } catch {
      // malformed header — try the next one
    }
  }
  return (req.hostname || '').replace(/^www\./, '').slice(0, 100) || null;
}

/**
 * Validates whether the email's domain actually has active mail exchange (MX) servers.
 * Only rejects when the DNS lookup positively confirms the domain has no mail
 * servers (ENOTFOUND / ENODATA) — any other failure (e.g. the DNS resolver
 * itself being unreachable) is a network/infra problem, not a fake email, so
 * it's allowed through rather than blocking a real customer.
 */
async function checkEmailDomainMX(email) {
  const domain = (email || '').split('@')[1];
  if (!domain) return false;

  try {
    const records = await dnsPromises.resolveMx(domain);
    return records && records.length > 0;
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      console.warn(`Domain "${domain}" has no mail servers — rejecting.`);
      return false;
    }
    console.warn(`DNS MX lookup for "${domain}" failed (${err.code || err.message}) — allowing through, treating as network issue, not a fake domain.`);
    return true;
  }
}

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Receives form data from the Contact / Consultation forms, saves it, and emails it.
router.post('/', contactLimiter, async (req, res) => {
  try {
    const d = req.body;

    if (!d.email || !d.phone) {
      return res.status(400).json({ ok: false, error: 'Email and phone number are required.' });
    }

    const hasMx = await checkEmailDomainMX(d.email);
    if (!hasMx) {
      console.warn(`⚠️ Blocked fake/inactive email domain: ${d.email}`);
      return res.status(400).json({
        ok: false,
        error: 'Please enter a valid, active email address with working mail servers.',
      });
    }

    const domain = submittingDomain(req);

    const columns = [
      'source', 'program', 'english_level', 'salutation', 'first_name', 'last_name',
      'phone_code', 'phone', 'email', 'nationality', 'residence', 'updates_opt_in',
    ];
    const values = [
      d.source || 'website',
      d.program || null,
      d.englishLevel || null,
      d.salutation || null,
      d.firstName || null,
      d.lastName || null,
      d.phoneCode || null,
      d.phone || null,
      d.email || null,
      d.nationality || null,
      d.residence || null,
      d.updates ? 1 : 0,
    ];
    if (schema.hasDomain) {
      columns.push('domain');
      values.push(domain);
    }

    await pool.query(
      `INSERT INTO submissions (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      values
    );

    // Everything below is escaped before going into the HTML email — raw
    // `d.*` values are user input and must never be interpolated directly.
    const safe = {
      program: escapeHtml(d.program) || '—',
      englishLevel: escapeHtml(d.englishLevel),
      salutation: escapeHtml(d.salutation),
      firstName: escapeHtml(d.firstName),
      lastName: escapeHtml(d.lastName),
      phoneCode: escapeHtml(d.phoneCode),
      phone: escapeHtml(d.phone) || '—',
      email: escapeHtml(d.email) || '—',
      nationality: escapeHtml(d.nationality) || '—',
      residence: escapeHtml(d.residence) || '—',
      domain: escapeHtml(domain) || '—',
    };

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0A1032;padding:24px;border-radius:12px 12px 0 0">
          <h2 style="color:#C8A84B;margin:0">New Consultation Request</h2>
          <p style="color:rgba(255,255,255,.7);margin:4px 0 0">Dream Country Visas</p>
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;border:1px solid #eee">

          <table style="width:100%;border-collapse:collapse">
            <tr><td colspan="2" style="padding:8px 0;font-size:14px;color:#555;border-bottom:1px solid #ddd"><strong style="color:#0A1032">Program of Interest</strong></td></tr>
            <tr><td colspan="2" style="padding:8px 0 16px;font-size:15px">${safe.program}</td></tr>

            ${safe.englishLevel ? `
            <tr><td colspan="2" style="padding:8px 0;font-size:14px;color:#555;border-bottom:1px solid #ddd"><strong style="color:#0A1032">English Level</strong></td></tr>
            <tr><td colspan="2" style="padding:8px 0 16px;font-size:15px">${safe.englishLevel}</td></tr>
            ` : ''}

            <tr>
              <td style="padding:8px 12px 8px 0;width:50%;font-size:14px">
                <div style="color:#555;margin-bottom:4px"><strong>Name</strong></div>
                <div style="font-size:15px">${safe.salutation} ${safe.firstName} ${safe.lastName}</div>
              </td>
              <td style="padding:8px 0;width:50%;font-size:14px">
                <div style="color:#555;margin-bottom:4px"><strong>Phone</strong></div>
                <div style="font-size:15px">${safe.phoneCode} ${safe.phone}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 12px 8px 0;width:50%;font-size:14px">
                <div style="color:#555;margin-bottom:4px"><strong>Email</strong></div>
                <div style="font-size:15px"><a href="mailto:${safe.email}" style="color:#0A1032">${safe.email}</a></div>
              </td>
              <td style="padding:16px 0 8px;width:50%;font-size:14px">
                <div style="color:#555;margin-bottom:4px"><strong>Nationality</strong></div>
                <div style="font-size:15px">${safe.nationality}</div>
              </td>
            </tr>

            <tr>
              <td colspan="2" style="padding:16px 0 8px;font-size:14px">
                <div style="color:#555;margin-bottom:4px"><strong>Currently Residing In</strong></div>
                <div style="font-size:15px">${safe.residence}</div>
              </td>
            </tr>

            <tr>
              <td colspan="2" style="padding:16px 0 8px;font-size:14px">
                <div style="color:#555;margin-bottom:4px"><strong>Submitted On Website</strong></div>
                <div style="font-size:15px">${safe.domain}</div>
              </td>
            </tr>

            <tr>
              <td colspan="2" style="padding:16px 0 0;font-size:13px;color:#888">
                Marketing consent: <strong>${d.updates ? 'Yes — keep me updated' : 'No'}</strong>
              </td>
            </tr>
          </table>

          <div style="margin-top:24px;padding:14px;background:#fff8e1;border-radius:8px;border-left:4px solid #C8A84B">
            <p style="margin:0;font-size:13px;color:#555">
              This enquiry was submitted via the Dream Country Visas website contact form.
              Please respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    `;

    // Strip any CR/LF from subject fields — defense in depth against
    // email-header injection via the API even though Resend's API
    // (not raw SMTP) already isn't vulnerable to it in the usual way.
    const stripNewlines = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ');

    const msg = {
      to: TO_EMAILS,
      from: FROM_EMAIL,
      replyTo: stripNewlines(d.email),
      subject: `New Enquiry – ${stripNewlines(d.salutation)} ${stripNewlines(d.firstName)} ${stripNewlines(d.lastName)} | ${stripNewlines(d.program) || 'General'}${domain ? ` [${stripNewlines(domain)}]` : ''}`,
      html,
    };

    // Resend returns API failures as { error } instead of throwing.
    const { error } = await resend.emails.send(msg);
    if (error) throw new Error(error.message);
    console.log(`✅ Saved + emailed enquiry for ${d.firstName} ${d.lastName} <${d.email}>`);

    // The enquiry is already saved and sent to the team, so a failed
    // confirmation must not turn the customer's submission into an error.
    const siteUrl = `https://${domain && domain.startsWith('dreamcountryvisas.') ? domain : 'dreamcountryvisas.com'}`;
    try {
      const confirmation = await resend.emails.send({
        to: [stripNewlines(d.email)],
        from: FROM_EMAIL,
        replyTo: COMPANY.email,
        subject: 'Thank you for contacting Dream Country Visas',
        html: customerConfirmationHtml(safe, siteUrl),
      });
      if (confirmation.error) throw new Error(confirmation.error.message);
    } catch (confirmErr) {
      console.warn(`⚠️ Confirmation email to ${d.email} failed: ${confirmErr.message}`);
    }

    res.json({ ok: true });

  } catch (err) {
    console.error('❌ Contact submission error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;

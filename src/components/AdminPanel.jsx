import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Icon } from './Icons.jsx';
import { getAdminToken, clearAdminToken } from '../utils/adminAuth.js';
import { CONTACT } from '../data.js';

const RANGES = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'custom', label: 'Custom' },
];

const CATEGORIES = [
  'All Categories',
  'Permanent Residency (PR)',
  'Real Estate',
  'Residency',
  'Citizenship',
  'Other Service',
];

// Mirrors how ConsultationModal/ContactPage build the "program" dropdown
// string, so a category can be recovered from it without a DB migration.
function deriveCategory(program) {
  if (!program) return 'Other Service';
  if (program.startsWith('Citizenship of ')) return 'Citizenship';
  if (program.startsWith('Residence in ')) return 'Residency';
  if (program.startsWith('Real Estate Investment')) return 'Real Estate';
  if (program.endsWith(' PR')) return 'Permanent Residency (PR)';
  return 'Other Service';
}

const CATEGORY_BADGE_CLASS = {
  Citizenship: 'cat-citizenship',
  Residency: 'cat-residency',
  'Real Estate': 'cat-realestate',
  'Permanent Residency (PR)': 'cat-pr',
  'Other Service': 'cat-other',
};

const WEBSITES = [
  { key: 'all', label: 'All Websites' },
  { key: '.com', label: 'dreamcountryvisas.com' },
  { key: '.in', label: 'dreamcountryvisas.in' },
];

// Short label for the site a submission came from. Rows saved before the
// domain was tracked have none.
function websiteLabel(domain) {
  if (!domain) return 'N/A';
  if (domain.endsWith('.in')) return '.in';
  if (domain.endsWith('.com')) return '.com';
  return domain; // e.g. localhost or a temporary test domain
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Blocks rendering of any dashboard content until a token is confirmed to
// exist — a straight <Navigate> during render, not a post-mount redirect,
// so a direct /admin visit while logged out never flashes real data.
export default function AdminPanel() {
  const token = getAdminToken();
  if (!token) return <Navigate to="/login" replace />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState('today');
  const [customFrom, setCustomFrom] = useState(todayISO());
  const [customTo, setCustomTo] = useState(todayISO());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [website, setWebsite] = useState('all');

  const logout = useCallback(() => {
    clearAdminToken();
    navigate('/login', { replace: true });
  }, [navigate]);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    setError('');

    const params = new URLSearchParams({ range });
    if (range === 'custom') {
      params.set('from', customFrom);
      params.set('to', customTo);
    }

    try {
      const res = await fetch(`/api/admin/submissions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const json = await res.json();
      if (json.ok) {
        setRows(json.submissions);
      } else {
        setError(json.error || 'Failed to load submissions.');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }, [range, customFrom, customTo, navigate, logout]);

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [load]);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (category !== 'All Categories' && deriveCategory(r.program) !== category) {
        return false;
      }
      if (website !== 'all' && websiteLabel(r.domain) !== website) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        r.salutation, r.first_name, r.last_name, r.email, r.phone, r.phone_code,
        r.program, r.english_level, r.nationality, r.residence, r.domain,
        r.source === 'chatbot' ? 'chatbot' : 'website',
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, search, category, website]);

  const stats = useMemo(() => {
    const counts = { Citizenship: 0, Residency: 0, 'Real Estate': 0, 'Permanent Residency (PR)': 0, 'Other Service': 0 };
    rows.forEach((r) => { counts[deriveCategory(r.program)] += 1; });
    return counts;
  }, [rows]);

  // Shared row shape for both exports — always reflects whatever's
  // currently visible (date range + search + category filters applied).
  const exportRows = () => visibleRows.map((r) => {
    const created = new Date(r.created_at);
    return {
      Date: created.toLocaleDateString(),
      Time: created.toLocaleTimeString(),
      Name: [r.salutation, r.first_name, r.last_name].filter(Boolean).join(' '),
      Phone: [r.phone_code, r.phone].filter(Boolean).join(' '),
      Email: r.email || '',
      Source: r.source === 'chatbot' ? 'Chatbot' : 'Website',
      Domain: r.domain || 'N/A',
      Category: deriveCategory(r.program),
      Program: r.program || '',
      'English Level': r.english_level || '',
      Nationality: r.nationality || '',
      Residence: r.residence || '',
    };
  });

  const exportFileName = (ext) => {
    const stamp = todayISO();
    const scope = range === 'custom' ? `${customFrom}_to_${customTo}` : range;
    return `dc-visas-submissions-${scope}-${stamp}.${ext}`;
  };

  const downloadExcel = () => {
    const data = exportRows();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = Object.keys(data[0] || {}).map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
    XLSX.writeFile(wb, exportFileName('xlsx'));
  };

  // Fetches an image and re-encodes it as a small PNG data URL via canvas —
  // works regardless of the source format (webp etc.) and of whatever
  // image formats this jsPDF build natively understands. Downscaled to
  // ~2x the printed size (not the full source resolution) so a 1536px
  // logo doesn't balloon the PDF into megabytes.
  const loadImageAsPngDataUrl = (src, maxDim = 300) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: canvas.toDataURL('image/png'), w, h });
      };
      img.onerror = reject;
      img.src = src;
    });

  const downloadPDF = async () => {
    const data = exportRows();
    const rangeLabel = RANGES.find((r) => r.key === range)?.label || range;
    const scopeLabel = range === 'custom' ? `${customFrom} to ${customTo}` : rangeLabel;
    const generatedAt = new Date().toLocaleString();

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const NAVY = [27, 42, 107];
    const NAVY_DARK = [20, 32, 90];
    const GOLD = [245, 179, 1];
    const MUTED = [107, 112, 128];
    const HEADER_H = 96;

    // Soft tinted header "card" — separates the header from the table
    // without a solid navy fill (the logo's white background would show
    // as an ugly box on a dark fill).
    doc.setFillColor(245, 247, 252);
    doc.rect(0, 0, pageWidth, HEADER_H, 'F');

    try {
      const logo = await loadImageAsPngDataUrl('/landing-img/DC-log.webp');
      const logoH = 42;
      const logoW = (logo.w / logo.h) * logoH;
      doc.addImage(logo.dataUrl, 'PNG', 28, (HEADER_H - logoH) / 2 - 6, logoW, logoH);
    } catch {
      // Logo failed to load (offline etc.) — header still prints fine without it.
    }

    doc.setFont('times', 'bold');
    doc.setTextColor(...NAVY);
    doc.setFontSize(20);
    doc.text('Contact Submissions', pageWidth - 28, 40, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    doc.text(`${scopeLabel}  ·  ${data.length} submission${data.length === 1 ? '' : 's'}  ·  Generated ${generatedAt}`, pageWidth - 28, 58, { align: 'right' });

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.6);
    doc.line(28, HEADER_H - 14, pageWidth - 28, HEADER_H - 14);

    autoTable(doc, {
      startY: HEADER_H + 16,
      margin: { left: 28, right: 28 },
      head: [Object.keys(data[0] || { Date: '', Time: '', Name: '', Phone: '', Email: '', Source: '', Domain: '', Category: '', Program: '', 'English Level': '', Nationality: '', Residence: '' })],
      body: data.map((row) => Object.values(row)),
      styles: { fontSize: 8.5, cellPadding: 6, textColor: [35, 38, 47], lineColor: [228, 231, 240], lineWidth: 0.5 },
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
      alternateRowStyles: { fillColor: [248, 249, 253] },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 50 },
        2: { cellWidth: 95 },
        3: { cellWidth: 72 },
        5: { cellWidth: 48, halign: 'center' },
        6: { cellWidth: 84 },
        7: { cellWidth: 80 },
        9: { cellWidth: 55, halign: 'center' },
        10: { cellWidth: 55 },
      },
      didDrawPage: () => {
        const h = doc.internal.pageSize.getHeight();
        doc.setDrawColor(...NAVY_DARK);
        doc.setLineWidth(0.75);
        doc.line(28, h - 46, pageWidth - 28, h - 46);

        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...NAVY);
        doc.text('Dream Country Visas', 28, h - 30);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(
          `Contact: ${CONTACT.phone}   ·   Email: ${CONTACT.email}   ·   WhatsApp: ${CONTACT.phone}   ·   dreamcountryvisas.com`,
          28, h - 17
        );
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${doc.internal.getNumberOfPages()}`, pageWidth - 28, h - 30, { align: 'right' });
      },
    });

    doc.save(exportFileName('pdf'));
  };

  return (
    <div className="admin-page" translate="no">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-title">
            <div className="admin-header-icon">
              <Icon name="passport" size={22} />
            </div>
            <div>
              <p className="admin-eyebrow">ADMIN DASHBOARD</p>
              <h1>Contact Submissions</h1>
              <p className="admin-header-sub">Every enquiry submitted through the site's contact and consultation forms.</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <Icon name="lock" size={14} /> Log Out
          </button>
        </div>

        <div className="admin-stats-row">
          {/* Each card doubles as a category filter for the table below */}
          <button
            type="button"
            className={`admin-stat-card ${category === 'All Categories' ? 'active' : ''}`}
            onClick={() => setCategory('All Categories')}
          >
            <span className="admin-stat-value">{rows.length}</span>
            <span className="admin-stat-label">Total in range</span>
          </button>
          {CATEGORIES.slice(1).map((c) => (
            <button
              type="button"
              className={`admin-stat-card ${CATEGORY_BADGE_CLASS[c]} ${category === c ? 'active' : ''}`}
              key={c}
              onClick={() => setCategory(c)}
            >
              <span className="admin-stat-value">{stats[c]}</span>
              <span className="admin-stat-label">{c}</span>
            </button>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-filters">
            {RANGES.map((r) => (
              <button
                key={r.key}
                className={`admin-filter-btn ${range === r.key ? 'active' : ''}`}
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </button>
            ))}

            {range === 'custom' && (
              <div className="admin-custom-range">
                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                <span>to</span>
                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                <button className="btn btn-primary admin-apply-btn" onClick={load}>Apply</button>
              </div>
            )}
          </div>

          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <Icon name="search" size={14} />
              <input
                type="text"
                placeholder="Search by name, email, phone, program…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
            </div>

            <select
              className="admin-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="admin-category-select"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              aria-label="Filter by website"
            >
              {WEBSITES.map((w) => (
                <option key={w.key} value={w.key}>{w.label}</option>
              ))}
            </select>

            <button
              type="button"
              className="admin-export-btn"
              onClick={downloadExcel}
              disabled={visibleRows.length === 0}
            >
              <Icon name="download" size={14} /> Download Excel
            </button>
            <button
              type="button"
              className="admin-export-btn"
              onClick={downloadPDF}
              disabled={visibleRows.length === 0}
            >
              <Icon name="download" size={14} /> Download PDF
            </button>
          </div>

          <p className="admin-count">
            {loading ? 'Loading…' : `${visibleRows.length} of ${rows.length} submission${rows.length === 1 ? '' : 's'}`}
          </p>

          {error && <p className="login-error">{error}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Website</th>
                  <th>Category</th>
                  <th>Program</th>
                  <th>English Level</th>
                  <th>Nationality</th>
                  <th>Residence</th>
                </tr>
              </thead>
              <tbody>
                {!loading && visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={13} className="admin-empty">No submissions match.</td>
                  </tr>
                )}
                {visibleRows.map((r, i) => {
                  const created = new Date(r.created_at);
                  const cat = deriveCategory(r.program);
                  const isChatbot = r.source === 'chatbot';
                  const site = websiteLabel(r.domain);
                  return (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td>{created.toLocaleDateString()}</td>
                      <td>{created.toLocaleTimeString()}</td>
                      <td>{[r.salutation, r.first_name, r.last_name].filter(Boolean).join(' ')}</td>
                      <td>{[r.phone_code, r.phone].filter(Boolean).join(' ')}</td>
                      <td>{r.email}</td>
                      <td>
                        <span className={`admin-source-badge ${isChatbot ? 'src-chatbot' : 'src-website'}`}>
                          {isChatbot ? '🤖 Chatbot' : '🌐 Website'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-domain-badge ${site === '.in' ? 'dom-in' : site === '.com' ? 'dom-com' : 'dom-other'}`}
                          title={r.domain || 'Submitted before website tracking was added'}
                        >
                          {site}
                        </span>
                      </td>
                      <td><span className={`admin-cat-badge ${CATEGORY_BADGE_CLASS[cat]}`}>{cat}</span></td>
                      <td>{r.program || 'N/A'}</td>
                      <td>{r.english_level || 'N/A'}</td>
                      <td>{r.nationality || 'N/A'}</td>
                      <td>{r.residence || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

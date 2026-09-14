import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import { getAdminToken, clearAdminToken } from '../utils/adminAuth.js';

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
      if (!q) return true;
      const haystack = [
        r.salutation, r.first_name, r.last_name, r.email, r.phone, r.phone_code,
        r.program, r.english_level, r.nationality, r.residence,
        r.source === 'chatbot' ? 'chatbot' : 'website',
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, search, category]);

  const stats = useMemo(() => {
    const counts = { Citizenship: 0, Residency: 0, 'Real Estate': 0, 'Permanent Residency (PR)': 0, 'Other Service': 0 };
    rows.forEach((r) => { counts[deriveCategory(r.program)] += 1; });
    return counts;
  }, [rows]);

  return (
    <div className="admin-page">
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
          <div className="admin-stat-card admin-stat-total">
            <span className="admin-stat-value">{rows.length}</span>
            <span className="admin-stat-label">Total in range</span>
          </div>
          {CATEGORIES.slice(1).map((c) => (
            <div className={`admin-stat-card ${CATEGORY_BADGE_CLASS[c]}`} key={c}>
              <span className="admin-stat-value">{stats[c]}</span>
              <span className="admin-stat-label">{c}</span>
            </div>
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
          </div>

          <p className="admin-count">
            {loading ? 'Loading…' : `${visibleRows.length} of ${rows.length} submission${rows.length === 1 ? '' : 's'}`}
          </p>

          {error && <p className="login-error">{error}</p>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Source</th>
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
                    <td colSpan={11} className="admin-empty">No submissions match.</td>
                  </tr>
                )}
                {visibleRows.map((r) => {
                  const created = new Date(r.created_at);
                  const cat = deriveCategory(r.program);
                  const isChatbot = r.source === 'chatbot';
                  return (
                    <tr key={r.id}>
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
                      <td><span className={`admin-cat-badge ${CATEGORY_BADGE_CLASS[cat]}`}>{cat}</span></td>
                      <td>{r.program || '—'}</td>
                      <td>{r.english_level || '—'}</td>
                      <td>{r.nationality || '—'}</td>
                      <td>{r.residence || '—'}</td>
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

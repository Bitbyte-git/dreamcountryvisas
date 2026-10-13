import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DC_PASSPORTS, PASSPORT_STATS_SUMMARY } from '../passportData.js';
import ConsultationModal from './ConsultationModal.jsx';

export const PASSPORT_INDEX_URLS = {
  com: 'https://dreamcountryvisas.com/passport-index',
  in: 'https://dreamcountryvisas.in/passport-index',
};

export default function PassportIndexPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // all | citizenship | residency | realestate | pr | work
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('rank'); // rank | ms | visafree
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedCountryForModal, setSelectedCountryForModal] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter & Sort Logic
  const filteredPassports = useMemo(() => {
    let list = [...DC_PASSPORTS];

    if (selectedCategory !== 'all') {
      list = list.filter((p) =>
        p.categories ? p.categories.includes(selectedCategory) : p.category === selectedCategory
      );
    }

    if (selectedCountry !== 'all') {
      list = list.filter((p) => p.id === selectedCountry);
    }

    if (selectedRegion !== 'all') {
      list = list.filter((p) => p.region.toLowerCase() === selectedRegion.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'rank') {
      list.sort((a, b) => a.globalRank - b.globalRank);
    } else if (sortBy === 'visafree') {
      list.sort((a, b) => b.visaFree - a.visaFree);
    } else if (sortBy === 'ms') {
      list.sort((a, b) => b.mobilityScore - a.mobilityScore);
    }

    return list;
  }, [selectedCategory, selectedCountry, selectedRegion, search, sortBy]);

  const openConsultation = (countryName = '') => {
    setSelectedCountryForModal(countryName);
    setShowConsultation(true);
  };

  return (
    <div className="pi-page">
      {/* High-Resolution Panoramic Hero Banner */}
      <section className="pi-hero">
        <div className="pi-hero-overlay" />
        <div className="pi-container-wide">
          <nav className="ov-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <em>Passport Index</em>
          </nav>

          <div className="pi-badge-wrap">
            <span className="pi-badge">
              Global Passport Power Rank 2026
            </span>
            <span className="pi-badge pi-badge-gold">
              <span>All Serviced Countries</span> ({PASSPORT_STATS_SUMMARY.totalPrograms})
            </span>
          </div>

          <h1>
            Official Passport <span>Power Rank</span> &amp; Mobility Index
          </h1>
          <p className="pi-hero-desc">
            Compare global visa-free mobility scores, government investment thresholds, and legal settlement pathways across all 
            countries officially represented by <strong>Dream Country Visas</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pi-metrics-grid">
            <div className="pi-metric-card">
              <span className="pi-metric-val">{PASSPORT_STATS_SUMMARY.totalPrograms}</span>
              <span className="pi-metric-lbl">Total Serviced Countries</span>
            </div>
            <div className="pi-metric-card">
              <span className="pi-metric-val">{PASSPORT_STATS_SUMMARY.highestScore}</span>
              <span className="pi-metric-lbl">Top Global Mobility Score</span>
            </div>
            <div className="pi-metric-card">
              <span className="pi-metric-val">#{PASSPORT_STATS_SUMMARY.medianRank}</span>
              <span className="pi-metric-lbl">Median Destination Rank</span>
            </div>
            <div className="pi-metric-card">
              <span className="pi-metric-val">100%</span>
              <span className="pi-metric-lbl">Authorized Govt Pathways</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wide Content Area */}
      <section className="pi-content pi-container-wide">
        {/* Controls / Filter Bar */}
        <div className="pi-filter-bar">
          <div className="pi-search-box">
            <input
              type="text"
              placeholder="Search by country or program (e.g. Malta, Portugal, Canada, Germany, UK)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="pi-search-clear" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>

          <div className="pi-filter-tabs">
            <button
              className={`pi-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span>All Destinations</span> <span className="pi-tab-count">({DC_PASSPORTS.length})</span>
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'citizenship' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('citizenship')}
            >
              <span>Citizenship (CBI)</span> <span className="pi-tab-count">({DC_PASSPORTS.filter((p) => (p.categories ? p.categories.includes('citizenship') : p.category === 'citizenship')).length})</span>
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'residency' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('residency')}
            >
              <span>Residency &amp; Golden Visa</span> <span className="pi-tab-count">({DC_PASSPORTS.filter((p) => (p.categories ? p.categories.includes('residency') : p.category === 'residency')).length})</span>
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'realestate' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('realestate')}
            >
              <span>Real Estate Investment</span> <span className="pi-tab-count">({DC_PASSPORTS.filter((p) => (p.categories ? p.categories.includes('realestate') : p.category === 'realestate')).length})</span>
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'pr' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('pr')}
            >
              <span>Permanent Residency (PR)</span> <span className="pi-tab-count">({DC_PASSPORTS.filter((p) => (p.categories ? p.categories.includes('pr') : p.category === 'pr')).length})</span>
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'work' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('work')}
            >
              <span>Work &amp; Business Visas</span> <span className="pi-tab-count">({DC_PASSPORTS.filter((p) => (p.categories ? p.categories.includes('work') : p.category === 'work')).length})</span>
            </button>
          </div>

          <div className="pi-filter-row-secondary">
            <div className="pi-select-wrap">
              <label>Select Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="all">All Serviced Countries</option>
                {[...DC_PASSPORTS]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="pi-select-wrap">
              <label>Region:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="all">All Continents</option>
                <option value="Europe">Europe</option>
                <option value="Caribbean">Caribbean</option>
                <option value="Oceania">Oceania</option>
                <option value="Americas">Americas</option>
                <option value="Middle East">Middle East</option>
                <option value="Asia">Asia</option>
              </select>
            </div>

            <div className="pi-select-wrap">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rank">Global Power Rank (Highest First)</option>
                <option value="ms">Mobility Score (MS)</option>
                <option value="visafree">Visa-Free Destinations (VF)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Wide List */}
        <div className="pi-main-layout">
          {/* Sticky Left Legal & Guidance Sidebar */}
          <aside className="pi-sidebar">
            <div className="pi-sidebar-card">
              <div className="pi-card-head">
                <h3>Global Mobility Standards</h3>
              </div>
              <p className="pi-card-sub">
                Official scores based on visa exemptions, electronic travel authorizations (eTA), and visas upon arrival.
              </p>

              <div className="pi-legend-box">
                <div className="pi-legend-item">
                  <span className="pi-legend-dot gold" />
                  <div>
                    <strong>Visa-Free (VF)</strong>
                    <small>Travel with zero consulate filing</small>
                  </div>
                </div>
                <div className="pi-legend-item">
                  <span className="pi-legend-dot taupe" />
                  <div>
                    <strong>Visa on Arrival (VOA) / eTA</strong>
                    <small>Instant port-of-entry authorization</small>
                  </div>
                </div>
                <div className="pi-legend-item">
                  <span className="pi-legend-dot red" />
                  <div>
                    <strong>Visa Required (VR)</strong>
                    <small>Advance consular visa necessary</small>
                  </div>
                </div>
              </div>

              <div className="pi-sidebar-cta">
                <h4>Confidential Case Assessment</h4>
                <p>
                  Speak with our government-licensed advisors to determine your family eligibility, investment options, and timeline.
                </p>
                <button
                  className="btn btn-gold pi-sidebar-btn"
                  onClick={() => openConsultation('General Passport Assessment')}
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          </aside>

          {/* Right Cards List */}
          <div className="pi-list-container">
            <div className="pi-list-header">
              <span><span>Showing</span> {filteredPassports.length} <span>Verified Dream Country Visas Destinations</span></span>
              <span className="pi-legend-summary">
                <span className="legend-vf">■ <span>Visa-Free</span></span>
                <span className="legend-voa">■ <span>Visa on Arrival</span></span>
                <span className="legend-vr">■ <span>Visa Required</span></span>
              </span>
            </div>

            {filteredPassports.length === 0 ? (
              <div className="pi-no-results">
                <h3>No destinations match your search</h3>
                <p>Try searching another country or clearing your filters.</p>
                <button
                  className="btn btn-gold"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                    setSelectedCountry('all');
                    setSelectedRegion('all');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="pi-cards-grid">
                {filteredPassports.map((passport) => {
                  const total = passport.visaFree + passport.visaOnArrival + passport.visaRequired;
                  const vfPct = ((passport.visaFree / total) * 100).toFixed(1);
                  const voaPct = ((passport.visaOnArrival / total) * 100).toFixed(1);
                  const vrPct = ((passport.visaRequired / total) * 100).toFixed(1);

                  return (
                    <article className="pi-card" key={passport.id}>
                      {/* Top Header Block: Passport Cover + Mobility Summary */}
                      <div className="pi-card-head-area">
                        <div className="pi-card-visual-col">
                          <div className="pi-passport-wrap">
                            <img
                              src={passport.coverImage}
                              alt={`${passport.name} Official Passport Cover`}
                              className="pi-passport-img"
                              loading="lazy"
                              onError={(e) => {
                                // fallback if specific scan not available
                                e.currentTarget.src = '/real-passports/malta.jpg';
                              }}
                            />
                            <span className="pi-rank-badge">
                              <span>Rank</span> #{passport.globalRank}
                            </span>
                          </div>
                        </div>

                        <div className="pi-card-header-details">
                          <div className="pi-card-top-row">
                            <div className="pi-title-col">
                              <span className="pi-category-tag">{passport.categoryLabel}</span>
                              <h2 className="pi-country-name">
                                {passport.flag} {passport.name}
                              </h2>
                              <span className="pi-program-tag">{passport.tag}</span>
                            </div>

                            <div className="pi-score-col">
                              <span className="pi-score-lbl">MOBILITY SCORE</span>
                              <span className="pi-score-val">{passport.mobilityScore}</span>
                            </div>
                          </div>

                          {/* Segmented Mobility Progress Bar */}
                          <div className="pi-bar-wrapper">
                            <div className="pi-progress-bar">
                              <div
                                className="pi-bar-segment vf"
                                style={{ width: `${vfPct}%` }}
                                title={`Visa-Free: ${passport.visaFree}`}
                              />
                              <div
                                className="pi-bar-segment voa"
                                style={{ width: `${voaPct}%` }}
                                title={`Visa on Arrival: ${passport.visaOnArrival}`}
                              />
                              <div
                                className="pi-bar-segment vr"
                                style={{ width: `${vrPct}%` }}
                                title={`Visa Required: ${passport.visaRequired}`}
                              />
                            </div>

                            <div className="pi-bar-numbers">
                              <span className="pi-num-vf">
                                <strong>{passport.visaFree}</strong> <span>Visa-Free</span>
                              </span>
                              <span className="pi-num-voa">
                                <strong>{passport.visaOnArrival}</strong> <span>Visa on Arrival / eTA</span>
                              </span>
                              <span className="pi-num-vr">
                                <strong>{passport.visaRequired}</strong> <span>Visa Required</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Full Width Structured Data Grid (3 key decision points) */}
                      <div className="pi-data-grid">
                        {passport.legalData.map((item, idx) => (
                          <div className="pi-data-item" key={idx}>
                            <span className="pi-data-label">{item.label}</span>
                            <span className="pi-data-value">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Full Width Bottom Action Row */}
                      <div className="pi-card-bottom-row">
                        <div className="pi-pricing-meta">
                          <div>
                            <span className="pi-meta-sub">Starting Cost</span>
                            <span className="pi-price-tag">{passport.price}</span>
                          </div>
                          <div className="pi-meta-divider" />
                          <div>
                            <span className="pi-meta-sub">Processing</span>
                            <span className="pi-time-tag">{passport.time}</span>
                          </div>
                        </div>

                        <div className="pi-actions-group">
                          <Link to={passport.pathwayLink} className="btn pi-explore-btn">
                            Explore Program →
                          </Link>

                          <button
                            className="btn btn-gold pi-apply-btn"
                            onClick={() => openConsultation(passport.name)}
                          >
                            Check Eligibility
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
        defaultProgram={selectedCountryForModal ? `${selectedCountryForModal} Program` : 'Passport Power Assessment'}
      />
    </div>
  );
}

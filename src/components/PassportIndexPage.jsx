import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DC_PASSPORTS, PASSPORT_STATS_SUMMARY } from '../passportData.js';
import ConsultationModal from './ConsultationModal.jsx';

export default function PassportIndexPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // all | citizenship | residency | pr | work
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('rank'); // rank | ms | visafree
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedCountryForModal, setSelectedCountryForModal] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter & Sort Logic
  const filteredPassports = useMemo(() => {
    let list = [...DC_PASSPORTS];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
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
  }, [selectedCategory, selectedRegion, search, sortBy]);

  const toggleCompare = (passportId) => {
    setCompareList((prev) => {
      if (prev.includes(passportId)) {
        return prev.filter((id) => id !== passportId);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 passports simultaneously.');
        return prev;
      }
      return [...prev, passportId];
    });
  };

  const openConsultation = (countryName = '') => {
    setSelectedCountryForModal(countryName);
    setShowConsultation(true);
  };

  const comparedItems = useMemo(() => {
    return DC_PASSPORTS.filter((p) => compareList.includes(p.id));
  }, [compareList]);

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
              All {PASSPORT_STATS_SUMMARY.totalPrograms} Verified Destinations
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
              All Destinations ({DC_PASSPORTS.length})
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'citizenship' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('citizenship')}
            >
              Citizenship (CBI) (5)
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'residency' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('residency')}
            >
              Residency &amp; Golden Visa (8)
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'pr' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('pr')}
            >
              Permanent Residency (PR) (2)
            </button>
            <button
              className={`pi-tab-btn ${selectedCategory === 'work' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('work')}
            >
              Work &amp; Skilled Migration (5)
            </button>
          </div>

          <div className="pi-filter-row-secondary">
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

            {compareList.length > 0 && (
              <button
                className="pi-compare-launch-btn"
                onClick={() => setShowCompareModal(true)}
              >
                Compare Selected ({compareList.length}/3)
              </button>
            )}
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
              <span>Showing {filteredPassports.length} Verified Dream Country Visas Destinations</span>
              <span className="pi-legend-summary">
                <span className="legend-vf">■ Visa-Free</span>
                <span className="legend-voa">■ Visa on Arrival</span>
                <span className="legend-vr">■ Visa Required</span>
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
                    setSelectedRegion('all');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="pi-cards-grid">
                {filteredPassports.map((passport) => {
                  const isCompared = compareList.includes(passport.id);
                  const total = passport.visaFree + passport.visaOnArrival + passport.visaRequired;
                  const vfPct = ((passport.visaFree / total) * 100).toFixed(1);
                  const voaPct = ((passport.visaOnArrival / total) * 100).toFixed(1);
                  const vrPct = ((passport.visaRequired / total) * 100).toFixed(1);

                  return (
                    <article className="pi-card" key={passport.id}>
                      {/* Top Header Block: Passport Cover + Mobility Summary (Balanced height, zero empty gap) */}
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
                              RANK #{passport.globalRank}
                            </span>
                          </div>
                          <div className="pi-passport-subbadge">
                            <span>{passport.region}</span>
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
                                <strong>{passport.visaFree}</strong> Visa-Free
                              </span>
                              <span className="pi-num-voa">
                                <strong>{passport.visaOnArrival}</strong> Visa on Arrival / eTA
                              </span>
                              <span className="pi-num-vr">
                                <strong>{passport.visaRequired}</strong> Visa Required
                              </span>
                            </div>
                          </div>

                          <p className="pi-card-summary">{passport.summary}</p>
                        </div>
                      </div>

                      {/* Full Width Structured Data Grid (3 columns across entire card) */}
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
                          <label className="pi-compare-checkbox">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => toggleCompare(passport.id)}
                            />
                            <span>Compare</span>
                          </label>

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

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="pi-modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="pi-compare-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pi-modal-head">
              <h2>Side-by-Side Comparison ({comparedItems.length} Passports)</h2>
              <button className="pi-modal-close" onClick={() => setShowCompareModal(false)}>
                ×
              </button>
            </div>

            <div className="pi-compare-table-wrap">
              <table className="pi-compare-table">
                <thead>
                  <tr>
                    <th>Immigration Feature</th>
                    {comparedItems.map((c) => (
                      <th key={c.id}>
                        <div className="pi-compare-head-item">
                          <img src={c.coverImage} alt={c.name} className="pi-compare-thumb" />
                          <span>{c.flag} {c.name}</span>
                          <small>Rank #{c.globalRank}</small>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Mobility Score (MS)</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id} className="pi-highlight-val"><strong>{c.mobilityScore}</strong></td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Visa-Free Destinations</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id}>{c.visaFree} Countries</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Visa on Arrival / eTA</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id}>{c.visaOnArrival} Countries</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Visa Required</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id}>{c.visaRequired} Countries</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Starting Investment</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id} className="pi-gold-text"><strong>{c.price}</strong></td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Processing Time</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id}>{c.time}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Program Category</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id}>{c.categoryLabel}</td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Action</strong></td>
                    {comparedItems.map((c) => (
                      <td key={c.id}>
                        <Link to={c.pathwayLink} className="btn pi-explore-btn btn-sm">
                          View Details
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pi-modal-footer">
              <button className="btn btn-secondary" onClick={() => setCompareList([])}>
                Clear All
              </button>
              <button
                className="btn btn-gold"
                onClick={() => {
                  setShowCompareModal(false);
                  openConsultation('Comparison Assessment');
                }}
              >
                Book Assessment on Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
        defaultProgram={selectedCountryForModal ? `${selectedCountryForModal} Program` : 'Passport Power Assessment'}
      />
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  COUNTRY_DIAL_CODES,
  CITIZENSHIP_MENU,
  RESIDENCY_MENU,
  REALESTATE_MENU,
  PR_MENU,
  OTHERSERVICES_MENU,
} from '../data.js';
import CustomSelect from './CustomSelect.jsx';
import { getPhoneSpecForCode, getPhoneValidationError } from '../utils/formValidation.js';

// ── FULL SERVICES & PROGRAMS (EXACTLY MATCHING CONTACT FORM) ──
export function buildProgramOptions() {
  const list = [];
  CITIZENSHIP_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(`Citizenship of ${i.name}`))
  );
  RESIDENCY_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(`Residence in ${i.name}`))
  );
  REALESTATE_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(`Real Estate Investment — ${i.name}`))
  );
  PR_MENU.groups.forEach((g) => g.items.forEach((i) => list.push(i.name)));
  OTHERSERVICES_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(i.name))
  );
  return list;
}

export const PROGRAM_SELECT_LABELS = buildProgramOptions();

export function detectCountryFromProgram(programName) {
  if (!programName) return 'all';
  const lower = programName.toLowerCase();
  if (lower.includes('uae') || lower.includes('dubai')) return 'uae';
  if (lower.includes('portugal')) return 'portugal';
  if (lower.includes('greece')) return 'greece';
  if (lower.includes('spain')) return 'spain';
  if (lower.includes('cyprus')) return 'cyprus';
  if (lower.includes('canada')) return 'canada';
  if (lower.includes('australia')) return 'australia';
  if (lower.includes('germany')) return 'germany';
  if (lower.includes('malta')) return 'malta';
  if (lower.includes('grenada')) return 'grenada';
  if (lower.includes('antigua')) return 'antigua-barbuda';
  if (lower.includes('st. kitts') || lower.includes('kitts')) return 'st-kitts-nevis';
  if (lower.includes('vanuatu')) return 'vanuatu';
  if (lower.includes('nauru')) return 'nauru';
  if (lower.includes('argentina')) return 'argentina';
  if (lower.includes('turkey')) return 'turkey';
  if (lower.includes('egypt')) return 'egypt';
  if (lower.includes('lucia')) return 'st-lucia';
  if (lower.includes('dominica')) return 'dominica';
  if (lower.includes('italy')) return 'italy';
  if (lower.includes('kingdom') || lower.includes('uk')) return 'uk';
  if (lower.includes('real estate')) return 'realestate';
  if (lower.includes('corporate') || lower.includes('tax') || lower.includes('advisory')) return 'corporate';
  return 'all';
}

const COUNTRY_NAMES = {
  argentina: 'Argentina',
  malta: 'Malta',
  grenada: 'Grenada',
  'antigua-barbuda': 'Antigua and Barbuda',
  'st-kitts-nevis': 'St. Kitts and Nevis',
  vanuatu: 'Vanuatu',
  nauru: 'Nauru',
  canada: 'Canada',
  australia: 'Australia',
  germany: 'Germany',
  uae: 'UAE / Dubai',
  portugal: 'Portugal',
  greece: 'Greece',
  spain: 'Spain',
  cyprus: 'Cyprus',
  realestate: 'Real Estate',
  corporate: 'Corporate Advisory',
};

function getInitials(name) {
  if (!name) return 'DC';
  const clean = name.split(',')[0].trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return 'Recently';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export default function ReviewsSection({ country = 'all', countryName = 'Dream Country Visas' }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 5.0,
    totalReviews: 0,
    counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filterStar, setFilterStar] = useState('all');
  const [sortBy, setSortBy] = useState('helpful');
  const [showModal, setShowModal] = useState(false);

  // Helpful vote toggle state with localStorage persistence
  const [helpfulClicked, setHelpfulClicked] = useState(() => {
    try {
      const saved = localStorage.getItem('dc_helpful_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Review Form State with Anti-Spam Phone & City/Country (Default India +91)
  const [formData, setFormData] = useState({
    client_name: '',
    client_location: '',
    phone_code: '+91',
    phone: '',
    rating: 5,
    country_choice: 'india',
    program: PROGRAM_SELECT_LABELS[0] || 'Citizenship of Antigua & Barbuda',
    review_text: '',
    website_hp: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Active phone specification for chosen country code
  const currentPhoneSpec = useMemo(
    () => getPhoneSpecForCode(formData.phone_code),
    [formData.phone_code]
  );

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?country=${encodeURIComponent(country)}`);
      const data = await res.json();
      if (data.ok) {
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle Helpful Vote Toggle (Like / Unlike)
  const handleHelpful = async (reviewId) => {
    const isVoted = Boolean(helpfulClicked[reviewId]);
    const nextVoted = !isVoted;
    const updated = { ...helpfulClicked, [reviewId]: nextVoted };
    setHelpfulClicked(updated);

    try {
      localStorage.setItem('dc_helpful_reviews', JSON.stringify(updated));
    } catch {}

    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, helpful_count: Math.max(0, (r.helpful_count || 0) + (nextVoted ? 1 : -1)) }
          : r
      )
    );

    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: nextVoted ? 'vote' : 'unvote' }),
      });
    } catch {
      // ignore
    }
  };

  // Handle New Review Submission with Phone Verification & Anti-Bot Protection
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.client_name.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }

    const phoneError = getPhoneValidationError(formData.phone, formData.phone_code);
    if (phoneError) {
      setSubmitError(phoneError);
      return;
    }

    if (!formData.review_text.trim()) {
      setSubmitError('Please write your review feedback comments.');
      return;
    }

    try {
      setSubmitting(true);
      const targetCountry = country === 'all' ? (formData.country_choice || 'uae') : country;
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: formData.client_name.trim(),
          client_location: formData.client_location.trim(),
          phone_code: formData.phone_code,
          phone: formData.phone.trim(),
          rating: formData.rating,
          review_text: formData.review_text.trim(),
          program: formData.program.trim(),
          country: targetCountry,
          website_hp: formData.website_hp,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitSuccess(true);
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        }
        setTimeout(() => {
          setShowModal(false);
          setSubmitSuccess(false);
          setFormData({
            client_name: '',
            client_location: '',
            phone_code: '+91',
            phone: '',
            rating: 5,
            country_choice: 'india',
            program: PROGRAM_SELECT_LABELS[0] || 'Citizenship of Antigua & Barbuda',
            review_text: '',
            website_hp: '',
          });
          fetchReviews();
        }, 1800);
      } else {
        setSubmitError(data.error || 'Failed to submit review.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered & Sorted reviews (Stars & Sort only)
  const displayedReviews = useMemo(() => {
    let list = [...reviews];

    if (filterStar !== 'all') {
      const s = Number(filterStar);
      list = list.filter((r) => Number(r.rating) === s);
    }

    if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
    } else if (sortBy === 'recent') {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return list;
  }, [reviews, filterStar, sortBy]);

  return (
    <section className="section dc-reviews-section" id="reviews">
      <div className="container">
        {/* Section Header */}
        <div className="dc-reviews-head">
          <p className="section-tag">VERIFIED CLIENT RATINGS</p>
          <h2 className="center">Client Reviews &amp; Experiences</h2>
          <p className="dc-reviews-sub">
            Authentic feedback from international investors and private clients who secured global citizenship, residency, and second passports with Dream Country Visas.
          </p>
        </div>

        {/* ── TWO-COLUMN REVIEWS HUB ── */}
        <div className="dc-reviews-hub-grid">
          {/* ── LEFT COLUMN: SCORECARD ── */}
          <aside className="dc-reviews-sidebar-scorecard">
            <div className="dc-amz-score-head">
              <h3 className="dc-amz-score-title">Customer reviews</h3>
              <div className="dc-amz-stars-row">
                <div className="dc-stars-display" aria-label={`${stats.averageRating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`dc-star-gold ${star <= Math.round(Number(stats.averageRating || 5)) ? 'filled' : 'empty'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="dc-amz-score-text">
                  {Number(stats.averageRating || 5.0).toFixed(1)} out of 5
                </span>
              </div>
              <div className="dc-amz-global-ratings">
                {stats.totalReviews || reviews.length} global ratings
              </div>
            </div>

            {/* 5-to-1 Star Breakdown Bars (Amazon Style) */}
            <div className="dc-amz-bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.counts[star] || 0;
                const pct = stats.percentages[star] || 0;
                return (
                  <div
                    className={`dc-amz-bar-row ${filterStar === String(star) ? 'active' : ''}`}
                    key={star}
                    onClick={() => setFilterStar(filterStar === String(star) ? 'all' : String(star))}
                    title={`Filter by ${star} star reviews`}
                  >
                    <span className="dc-amz-bar-star-label">{star} star</span>
                    <div className="dc-amz-progress-track">
                      <div className="dc-amz-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="dc-amz-bar-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>

            <div className="dc-sb-divider" />

            {/* Trust Badges (Zero Emojis, No Icons - Clean Luxury Cards) */}
            <div className="dc-sb-trust-list">
              <div className="dc-trust-item-card">
                <span className="dc-trust-label">Verified Client Reviews</span>
                <span className="dc-trust-sub">Official legal department verified</span>
              </div>
              <div className="dc-trust-item-card">
                <span className="dc-trust-label">Statutory Compliance</span>
                <span className="dc-trust-sub">Direct government immigration acts</span>
              </div>
              <div className="dc-trust-item-card">
                <span className="dc-trust-label">Private &amp; Confidential</span>
                <span className="dc-trust-sub">Protected under international NDA</span>
              </div>
            </div>

            {/* Write a Review Button */}
            <div className="dc-sb-cta-area">
              <button
                type="button"
                className="dc-sb-write-btn"
                onClick={() => setShowModal(true)}
              >
                Write a Review
              </button>
              <small className="dc-sb-cta-discreet">
                Share your journey to assist fellow investors
              </small>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: REVIEWS FEED & INTERNAL SCROLL PANE ── */}
          <div className="dc-reviews-main-panel">
            {/* Top Toolbar: Filter Pills, Search & Sort */}
            <div className="dc-reviews-toolbar">
              <div className="dc-rv-filter-pills">
                <button
                  type="button"
                  className={`dc-filter-pill ${filterStar === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStar('all')}
                >
                  All ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`dc-filter-pill ${filterStar === String(s) ? 'active' : ''}`}
                    onClick={() => setFilterStar(filterStar === String(s) ? 'all' : String(s))}
                  >
                    <span className="dc-pill-star">★</span> {s} Star ({stats.counts[s] || 0})
                  </button>
                ))}
              </div>

              {/* Sort Controls (Search removed as requested) */}
              <div className="dc-rv-sort-wrap">
                <span className="dc-rv-sort-label">Sort:</span>
                <select
                  className="dc-rv-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="helpful">Most Helpful</option>
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* ── REVIEWS FEED (Smooth scroll, natural continuation to FAQ) ── */}
            <div className="dc-reviews-scroll-pane" id="dc-reviews-feed">
              {loading ? (
                <div className="dc-reviews-loading">
                  Loading verified reviews...
                </div>
              ) : displayedReviews.length === 0 ? (
                <div className="dc-no-reviews">
                  <h3>No Client Reviews Yet</h3>
                  <p>Be the first verified international client to share your experience with Dream Country Visas.</p>
                  <button
                    type="button"
                    className="dc-sb-write-btn"
                    style={{ maxWidth: '220px', margin: '14px auto 0' }}
                    onClick={() => setShowModal(true)}
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                displayedReviews.map((item) => {
                  const countryTitle = COUNTRY_NAMES[item.country?.toLowerCase()] || item.country || 'Global';
                  return (
                    <article className="dc-review-card" key={item.id}>
                      {/* Header: User Info, Verified Badge & Rating */}
                      <div className="dc-rcard-header">
                        <div className="dc-rcard-user">
                          <div className="dc-user-avatar">
                            {getInitials(item.client_name)}
                          </div>
                          <div>
                            <div className="dc-user-name-row">
                              <strong className="dc-user-name">{item.client_name}</strong>
                            </div>
                            <div className="dc-rcard-meta">
                              <span className="dc-rcard-program">
                                {countryTitle} — {item.program || 'Investor Program'}
                              </span>
                              <span className="dc-dot-sep">•</span>
                              <span className="dc-rcard-date">{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars Rating (Prominent Size) */}
                        <div className="dc-rcard-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`dc-star ${s <= Number(item.rating) ? 'filled' : 'empty'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Direct Review Text (Zero Headline Needed) */}
                      <p className="dc-rcard-text">{item.review_text}</p>

                      {/* Footer */}
                      <div className="dc-rcard-footer">
                        <span className="dc-verified-purchase-note">
                          Statutory compliance verified
                        </span>

                        <button
                          type="button"
                          className={`dc-helpful-btn ${helpfulClicked[item.id] ? 'voted' : ''}`}
                          onClick={() => handleHelpful(item.id)}
                          title={helpfulClicked[item.id] ? 'Click to remove helpful vote' : 'Mark as helpful'}
                        >
                          Helpful ({item.helpful_count || 0})
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Bottom Counter Bar */}
            <div className="dc-reviews-pane-footer">
              <span>Showing {displayedReviews.length} of {reviews.length} verified reviews</span>
              <span className="dc-reviews-pane-scroll-hint">Verified client feedback</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFESSIONAL WRITE A REVIEW MODAL (FLAWLESS ALIGNMENT & LUXURY) ── */}
      {showModal && (
        <div className="dc-modal-overlay" onClick={() => !submitting && setShowModal(false)}>
          <div
            className="dc-modal-box dc-review-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="dc-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>

            {submitSuccess ? (
              <div className="dc-modal-success-state">
                <span className="dc-modal-pill">VERIFIED SUBMISSION</span>
                <h3>Thank You for Your Feedback</h3>
                <p>
                  Your review has been successfully submitted and verified. It is now published live on Dream Country Visas.
                </p>
              </div>
            ) : (
              <>
                <div className="dc-modal-head">
                  <span className="dc-modal-pill">CLIENT TESTIMONIAL</span>
                  <h3>Rate Your Experience</h3>
                  <p>
                    Share your genuine feedback with our legal advisors to help global applicants make informed immigration decisions.
                  </p>
                </div>

                {submitError && <div className="dc-modal-error-banner">{submitError}</div>}

                <form className="dc-review-form" onSubmit={handleSubmitReview}>
                  {/* Rating Selector (ONLY STAR ICON) */}
                  <div className="dc-form-field">
                    <label className="dc-field-label">Overall Rating *</label>
                    <div className="dc-star-selector-card">
                      <div className="dc-star-buttons-group">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating || formData.rating) >= star;
                          return (
                            <button
                              type="button"
                              key={star}
                              className={`dc-star-select-btn ${isFilled ? 'active' : ''}`}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setFormData({ ...formData, rating: star })}
                              aria-label={`${star} Star`}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>
                      <span className="dc-star-text-hint">
                        {formData.rating === 5 && '5.0 — Exceptional Experience'}
                        {formData.rating === 4 && '4.0 — Very Good'}
                        {formData.rating === 3 && '3.0 — Average'}
                        {formData.rating === 2 && '2.0 — Below Expectation'}
                        {formData.rating === 1 && '1.0 — Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Name and City / Country (e.g. Ramesh, Dubai) */}
                  <div className="dc-form-row-2col">
                    <div className="dc-form-field">
                      <label className="dc-field-label">Your Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        required
                        className="dc-input-lux"
                      />
                    </div>
                    <div className="dc-form-field">
                      <label className="dc-field-label">City / Country *</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, India"
                        value={formData.client_location}
                        onChange={(e) => setFormData({ ...formData, client_location: e.target.value })}
                        required
                        className="dc-input-lux"
                      />
                    </div>
                  </div>

                  {/* Clean Service & Pathway Dropdown (Contained inside popup) */}
                  <div className="dc-form-field">
                    <label className="dc-field-label">Service / Program Applied For *</label>
                    <CustomSelect
                      name="program"
                      value={formData.program}
                      onChange={(e) => {
                        const val = e.target.value;
                        const detected = detectCountryFromProgram(val);
                        setFormData((prev) => ({
                          ...prev,
                          program: val,
                          country_choice: detected,
                        }));
                      }}
                      options={PROGRAM_SELECT_LABELS}
                      placeholder="Select your program or service"
                      required
                      className="dc-modal-custom-select"
                    />
                  </div>

                  {/* Anti-Spam Phone Verification (Confidential - Default India +91) */}
                  <div className="dc-form-field">
                    <div className="dc-field-label-row">
                      <label className="dc-field-label">
                        Mobile Number (Anti-Spam Verification) *
                      </label>
                      <span className="dc-phone-spec-badge">
                        {currentPhoneSpec.label}
                      </span>
                    </div>
                    <div className="phone-input-group dc-modal-phone-group">
                      <CustomSelect
                        name="phone_code"
                        value={formData.phone_code}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          const newSpec = getPhoneSpecForCode(newCode);
                          setFormData((prev) => ({
                            ...prev,
                            phone_code: newCode,
                            phone: prev.phone ? prev.phone.replace(/\D/g, '').slice(0, newSpec.max) : '',
                          }));
                        }}
                        options={COUNTRY_DIAL_CODES}
                        isPhoneCode={true}
                        placeholder="+91"
                        ariaLabel="Country Dial Code"
                        className="dc-modal-phone-select"
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder={currentPhoneSpec.placeholder}
                        maxLength={currentPhoneSpec.max}
                        value={formData.phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, currentPhoneSpec.max);
                          setFormData((prev) => ({ ...prev, phone: digitsOnly }));
                        }}
                        required
                        className="phone-number-input dc-modal-phone-number"
                      />
                    </div>
                    <div className="dc-phone-helper-row">
                      <small className="dc-phone-confidential-hint">
                        🔒 Confidential — Never displayed publicly. Max 5 reviews per phone number.
                      </small>
                      <span className={`dc-phone-counter-badge ${formData.phone.length === currentPhoneSpec.max ? 'complete' : ''}`}>
                        {formData.phone.length} / {currentPhoneSpec.max} digits
                      </span>
                    </div>
                  </div>

                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="website_hp"
                    value={formData.website_hp}
                    onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Detailed Comments */}
                  <div className="dc-form-field">
                    <label className="dc-field-label">Detailed Comments &amp; Feedback *</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your legal consultation, timeline, and overall experience..."
                      value={formData.review_text}
                      onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                      required
                      className="dc-input-lux dc-textarea-lux"
                    />
                  </div>

                  <button
                    type="submit"
                    className="dc-modal-submit-btn-lux"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      background: '#1b2a6b',
                      color: '#f5b301',
                      border: '1px solid rgba(245, 179, 1, 0.4)',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.96rem',
                      cursor: 'pointer',
                      marginTop: '6px',
                      boxShadow: '0 4px 16px rgba(27, 42, 107, 0.25)',
                    }}
                  >
                    {submitting ? 'Verifying & Submitting...' : 'Submit Verified Review'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

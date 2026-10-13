import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { COUNTRIES } from './CitizenshipPage.jsx';
import { CITIZENSHIP_OVERVIEW_FAQ } from '../data.js';
import FAQ from '../components/FAQ.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';

export default function CitizenshipOverview() {
  const [showConsultation, setShowConsultation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ov-page">
      {/* Hero Header */}
      <div className="ov-hero">
        <div className="container">
          <nav className="ov-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <em>Citizenship by Investment</em>
          </nav>

          <p className="ov-tag">
            <Icon name="certificate" size={14} /> Official Government CBI Programs
          </p>

          <h1>
            Secure Second Citizenship & <span>Global Mobility</span>
          </h1>

          <p className="ov-hero-desc">
            Direct government-backed citizenship by investment programs offering visa-free travel to 180+ countries, lifetime family security, and tax optimization.
          </p>

          <div className="ov-trust-pills">
            <div className="ov-trust-pill">
              <Icon name="check" size={14} /> 100% Legal Government Pathways
            </div>
            <div className="ov-trust-pill">
              <Icon name="clock" size={14} /> Fast-Track from 2–3 Months
            </div>
            <div className="ov-trust-pill">
              <Icon name="globe" size={14} /> Visa-Free to 150+ to 180+ Countries
            </div>
            <div className="ov-trust-pill">
              <Icon name="lock" size={14} /> Dual Citizenship Allowed
            </div>
          </div>
        </div>
      </div>

      {/* Programs Showcase */}
      <div className="container">
        <div className="ov-section-header">
          <div>
            <h2>Explore Citizenship Programs</h2>
            <p>Compare investment options, timelines, and benefits across our verified destinations.</p>
          </div>
          <span className="ov-count-badge">
            {Object.keys(COUNTRIES).length} Programs Available
          </span>
        </div>

        <div className="ov-grid">
          {Object.entries(COUNTRIES).map(([slug, c]) => (
            <Link to={`/citizenship/${slug}`} className="ov-card" key={slug}>
              <div className="ov-card-media">
                <img src={c.banner} alt={c.name} loading="lazy" decoding="async" />
                <span className="ov-card-badge">
                  {slug === 'malta'
                    ? '⭐ EU Citizenship by Merit'
                    : slug === 'vanuatu'
                    ? '⚡ 2-3 Months Fast'
                    : slug === 'grenada'
                    ? '⭐ USA E-2 Treaty'
                    : slug === 'argentina'
                    ? '⚡ 2 Years Fast-Track'
                    : '⭐ Direct CBI'}
                </span>
                <span className="ov-card-price-pill">{c.price}</span>
              </div>

              <div className="ov-card-body">
                <p className="ov-card-tagline">{c.tagline}</p>
                <h3 className="ov-card-title">{c.name}</h3>
                <p className="ov-card-desc">
                  {c.overview ? c.overview.slice(0, 115) + '...' : 'Complete citizenship application support with pre-screened eligibility and fast processing.'}
                </p>

                <ul className="ov-card-highlights">
                  <li>
                    <Icon name="check" size={14} /> Visa-Free Access: {c.visaFree || '150+ Countries'}
                  </li>
                  <li>
                    <Icon name="check" size={14} /> Family: {c.family || 'Spouse, Children & Parents'}
                  </li>
                  <li>
                    <Icon name="check" size={14} /> Passport Processing: {c.time}
                  </li>
                </ul>

                <div className="ov-card-meta-row">
                  <span className="ov-card-meta-item">
                    <Icon name="clock" size={13} /> {c.time}
                  </span>
                  <span className="ov-card-meta-item">
                    <Icon name="passport" size={13} /> Lifetime Status
                  </span>
                </div>

                <span className="ov-card-btn">
                  View Program Details <Icon name="arrow" size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Choose Section */}
      <section className="ov-why-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <p className="section-tag">WHY DREAM COUNTRY VISAS</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--navy)' }}>
              Why Global Investors Choose Our Advisory
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              We ensure flawless documentation, strict legal compliance, and high approval rates for second citizenship.
            </p>
          </div>

          <div className="ov-why-grid">
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="certificate" size={20} /></div>
              <h4>Registered & Certified</h4>
              <p>Direct professional association with government-authorized units and legal counsels.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="lock" size={20} /></div>
              <h4>Pre-Screening Due Diligence</h4>
              <p>Zero-risk background check before application submission ensures maximum approval rates.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="support" size={20} /></div>
              <h4>Dedicated Case Manager</h4>
              <p>Personalized step-by-step guidance from initial consultation to passport handover.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="globe" size={20} /></div>
              <h4>100% Confidentiality</h4>
              <p>Enterprise-grade privacy protocols protecting your financial and personal data.</p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="ov-cta-banner">
            <div className="ov-cta-text">
              <h3>Need Help Selecting the Right Citizenship Program?</h3>
              <p>Our licensed immigration consultants analyze your timeline, budget, and family needs to recommend the ideal country pathway.</p>
            </div>
            <button
              onClick={() => setShowConsultation(true)}
              className="ov-cta-btn"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Book Consultation <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ items={CITIZENSHIP_OVERVIEW_FAQ} />

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </div>
  );
}
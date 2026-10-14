import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { RESIDENCY_OVERVIEW_FAQ } from '../data.js';
import FAQ from '../components/FAQ.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';
import { isProgramVisible } from '../utils/programVisibility.js';

export default function ResidencyOverview() {
  const [showConsultation, setShowConsultation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const residencyPrograms = [
    {
      name: 'Canada',
      sub: 'Startup Visa & Quebec Investor (QIIP)',
      badge: '🇨🇦 DIRECT PR',
      image: '/landing-img/re-canata.webp',
      price: 'from CAD 75,000',
      time: '12–16 Months',
      desc: 'Direct permanent residence for innovative founders, tech professionals, and qualified investors looking to relocate to North America.',
      highlights: [
        'Direct Canadian Permanent Residency for full family',
        'Free healthcare, subsidized education & social benefits',
        'Canadian citizenship eligibility after 3 years',
      ],
      link: '/residency/canada',
    },
    {
      name: 'Australia',
      sub: 'National Innovation Visa',
      badge: '🇦🇺 DIRECT PR',
      image: '/landing-img/re-australia.webp',
      price: 'from AUD 250,000',
      time: '6–12 Months',
      desc: 'Prestige pathway for exceptional talent, founders, and investors to obtain direct Australian permanent residency with expedited handling.',
      highlights: [
        'Direct Australian PR for main applicant and family',
        'Fast-track priority processing with dedicated case management',
        'Clear pathway to Australian passport in 4 years',
      ],
      link: '/residency/australia',
    },
    {
      name: 'New Zealand',
      sub: 'Active Investor Visa',
      badge: '🇳🇿 HIGH QUALITY OF LIFE',
      image: '/landing-img/re-new zealand.webp',
      price: 'from NZD 3M+',
      time: '6–12 Months',
      desc: 'Exclusive investor pathway providing immediate residence in one of the world’s most peaceful, transparent, and beautiful nations.',
      highlights: [
        'Immediate residence status with family inclusion',
        'Unmatched safety, stability, and lifestyle quality',
        'Direct pathway to permanent residency and citizenship',
      ],
      link: '/residency/new-zealand',
    },
    {
      name: 'Cyprus',
      sub: 'Work & Residence Permit for Non-EU Investors',
      badge: '🇨🇾 FAST-TRACK 2-3 MONTHS',
      image: '/landing-img/re-Cyprus.webp',
      price: 'from €300,000',
      time: '2–3 Months',
      desc: 'One of Europe’s fastest residency permits offering high lifestyle standards, attractive tax rates, and an English-speaking business environment.',
      highlights: [
        'Fast-track approval within 2 to 3 months',
        'Covers spouse and dependent children under 25',
        'Low tax regime with zero inheritance and wealth taxes',
      ],
      link: '/residency/cyprus',
    },
    {
      name: 'Malta',
      sub: 'Malta Permanent Residence Programme (MPRP)',
      badge: '🇲🇹 SCHENGEN RESIDENCE',
      image: '/landing-img/re-Malta.webp',
      price: 'from €150,000',
      time: '4–6 Months',
      desc: 'Permanent residency status in an English-speaking EU member nation with visa-free access across all 27 European Schengen nations.',
      highlights: [
        'Permanent residency status granted from day one',
        'Visa-free mobility throughout Europe’s Schengen Area',
        'Four generations included: applicant, spouse, children & parents',
      ],
      link: '/residency/malta',
    },
    {
      name: 'Portugal',
      sub: 'Golden Visa Investment Funds',
      badge: '🇵🇹 CITIZENSHIP IN 5 YEARS',
      image: '/landing-img/re-portugal.webp',
      price: 'from €250,000',
      time: '6–12 Months',
      desc: 'Europe’s most celebrated Golden Visa route offering EU residency with a minimal stay of only 7 days per year and citizenship in 5 years.',
      highlights: [
        'Only 7 days per year average stay requirement',
        'Full European Union citizenship eligibility after 5 years',
        'Regulated fund investments with strong capital security',
      ],
      link: '/residency/portugal',
    },
    {
      name: 'Latvia',
      sub: 'Business & Real Estate Golden Visa',
      badge: '🇱🇻 MOST AFFORDABLE EU',
      image: '/landing-img/re-Latvia.webp',
      price: 'from €50,000',
      time: '1–3 Months',
      desc: 'The most cost-effective route to European Union residency, providing fast approvals and unconstrained Schengen business mobility.',
      highlights: [
        'Lowest entry investment starting from just €50,000',
        'Approval turnaround in as little as 30 to 90 days',
        'Full family residence cards with European banking access',
      ],
      link: '/residency/latvia',
    },
    {
      name: 'Italy',
      sub: 'Investor Visa & Flat-Tax Regime',
      badge: '🇮🇹 ZERO MINIMUM STAY',
      image: '/landing-img/re-italy.webp',
      price: 'from €250,000',
      time: '3–4 Months',
      desc: 'Flexible Italian investor visa allowing high-net-worth individuals to access EU residency, with an optional €200,000 flat tax on global income.',
      highlights: [
        'No minimum physical stay requirement to maintain visa',
        'Special flat-tax regime on worldwide income for new residents',
        'Schengen mobility and pathway to Italian permanent residency',
      ],
      link: '/residency/italy',
    },
    {
      name: 'Spain',
      sub: 'Residency by Investment',
      badge: '🇪🇸 PRIME EU DESTINATION',
      image: '/landing-img/re-spain.webp',
      price: 'from €500,000',
      time: '2–3 Months',
      desc: 'Prestigious European residence pathway allowing you and your family to live, work, and study in Spain with full Schengen freedom.',
      highlights: [
        'Full work and business rights throughout Spain',
        'Unrestricted visa-free access to all Schengen countries',
        'Covers spouse, dependent children, and parents',
      ],
      link: '/residency/spain',
    },
  ].filter((program) => isProgramVisible(program.link));

  return (
    <div className="ov-page">
      {/* Hero Header */}
      <div className="ov-hero">
        <div className="container">
          <nav className="ov-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <em>Residency by Investment</em>
          </nav>

          <p className="ov-tag">
            <Icon name="certificate" size={14} /> Golden Visas & Global Residence Programs
          </p>

          <h1>
            Secure Global & European <span>Residency Rights</span>
          </h1>

          <p className="ov-hero-desc">
            Explore government-approved residency by investment pathways across Canada, Australia, New Zealand, and top European Golden Visa jurisdictions.
          </p>

          <div className="ov-trust-pills">
            <div className="ov-trust-pill">
              <Icon name="globe" size={14} /> Schengen Visa-Free Mobility
            </div>
            <div className="ov-trust-pill">
              <Icon name="check" size={14} /> Zero to Minimal Stay Requirements
            </div>
            <div className="ov-trust-pill">
              <Icon name="lock" size={14} /> Direct Pathway to Citizenship
            </div>
            <div className="ov-trust-pill">
              <Icon name="support" size={14} /> Four Generations Family Coverage
            </div>
          </div>
        </div>
      </div>

      {/* Programs Showcase */}
      <div className="container">
        <div className="ov-section-header">
          <div>
            <h2>Explore Residency Programs</h2>
            <p>Compare investment minimums, physical stay requirements, and citizenship timelines across countries.</p>
          </div>
          <span className="ov-count-badge">
            {residencyPrograms.length} Verified Destinations
          </span>
        </div>

        <div className="ov-grid">
          {residencyPrograms.map((c) => (
            <Link to={c.link} className="ov-card" key={c.name}>
              <div className="ov-card-media">
                <img src={c.image} alt={c.name} loading="lazy" decoding="async" />
                <span className="ov-card-badge">{c.badge}</span>
                <span className="ov-card-price-pill">{c.price}</span>
              </div>

              <div className="ov-card-body">
                <p className="ov-card-tagline">{c.sub}</p>
                <h3 className="ov-card-title">{c.name}</h3>
                <p className="ov-card-desc">{c.desc}</p>

                <ul className="ov-card-highlights">
                  {c.highlights.map((h, i) => (
                    <li key={i}>
                      <Icon name="check" size={14} /> {h}
                    </li>
                  ))}
                </ul>

                <div className="ov-card-meta-row">
                  <span className="ov-card-meta-item">
                    <Icon name="clock" size={13} /> {c.time}
                  </span>
                  <span className="ov-card-meta-item">
                    <Icon name="certificate" size={13} /> Renewable Permit
                  </span>
                </div>

                <span className="ov-card-btn">
                  View Program Requirements <Icon name="arrow" size={13} />
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
            <p className="section-tag">LEGAL EXCELLENCE</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--navy)' }}>
              Why Clients Choose DC Visas for Global Residency
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              We provide licensed, end-to-end support for qualifying funds, real estate verification, and government submissions.
            </p>
          </div>

          <div className="ov-why-grid">
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="certificate" size={20} /></div>
              <h4>Direct Legal Counsel</h4>
              <p>In-country immigration attorneys manage submissions directly with state authorities.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="lock" size={20} /></div>
              <h4>Fund & Asset Due Diligence</h4>
              <p>Independent screening of qualifying investment funds and escrow facilities.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="support" size={20} /></div>
              <h4>Family Inclusion Planning</h4>
              <p>Tailored structuring to ensure adult children, dependent parents, and spouses are covered.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="globe" size={20} /></div>
              <h4>Renewal & Citizenship Roadmap</h4>
              <p>Ongoing compliance monitoring and assistance when transitioning from residency to passport.</p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="ov-cta-banner">
            <div className="ov-cta-text">
              <h3>Compare EU & Global Residency Programs Side-by-Side</h3>
              <p>Schedule a confidential consultation with our senior advisors to find the most cost-effective program for your family.</p>
            </div>
            <button
              onClick={() => setShowConsultation(true)}
              className="ov-cta-btn"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Book Free Assessment <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ items={RESIDENCY_OVERVIEW_FAQ} />

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { PR_OVERVIEW_FAQ } from '../data.js';
import FAQ from '../components/FAQ.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';

export default function PROverview() {
  const [showConsultation, setShowConsultation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const prPrograms = [
    {
      slug: 'australia',
      name: 'Australia Permanent Residency',
      tagline: 'Subclass 189, 190 & 491 Pathways',
      badge: '🇦🇺 SKILLED MIGRATION',
      image: '/images/country-australia.webp',
      price: 'from AUD 6,135',
      time: '6–12 Months',
      desc: 'Points-tested skilled migration pathways for experienced professionals seeking high quality of life, excellent salaries, and permanent settlement.',
      highlights: [
        'Direct Permanent Residency with full work & study rights',
        'Free Medicare healthcare coverage & public schooling',
        'Eligible for Australian citizenship after 4 years',
      ],
      link: '/pr/australia',
    },
    {
      slug: 'canada',
      name: 'Canada Permanent Residency',
      tagline: 'Express Entry & Provincial Nominee Programs (PNP)',
      badge: '🇨🇦 EXPRESS ENTRY & PNP',
      image: '/images/country-canada.webp',
      price: 'from CAD 2,300',
      time: '6–8 Months',
      desc: 'Canada’s flagship economic immigration system providing fast, transparent pathways for skilled workers, tech talent, and graduates.',
      highlights: [
        'Permanent resident status for the principal applicant & family',
        'Universal free healthcare & world-class educational benefits',
        'Direct pathway to Canadian citizenship in just 3 years',
      ],
      link: '/pr/canada',
    },
  ];

  return (
    <div className="ov-page">
      {/* Hero Header */}
      <div className="ov-hero">
        <div className="container">
          <nav className="ov-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <em>Permanent Residency (PR)</em>
          </nav>

          <p className="ov-tag">
            <Icon name="globe" size={14} /> Skilled Migration & Settlement
          </p>

          <h1>
            Your Fast Pathway to <span>Permanent Residency</span>
          </h1>

          <p className="ov-hero-desc">
            Expert points assessment and end-to-end documentation for Australia and Canada PR pathways. Unlock permanent rights, universal healthcare, and global citizenship.
          </p>

          <div className="ov-trust-pills">
            <div className="ov-trust-pill">
              <Icon name="certificate" size={14} /> Registered MARA Agents
            </div>
            <div className="ov-trust-pill">
              <Icon name="check" size={14} /> 98%+ Case Approval Rate
            </div>
            <div className="ov-trust-pill">
              <Icon name="clock" size={14} /> Express Entry & EOI Optimization
            </div>
            <div className="ov-trust-pill">
              <Icon name="support" size={14} /> Free Points & Eligibility Check
            </div>
          </div>
        </div>
      </div>

      {/* Programs Showcase */}
      <div className="container">
        <div className="ov-section-header">
          <div>
            <h2>Explore PR Destinations</h2>
            <p>Select your preferred country to view points calculators, eligibility criteria, and step-by-step pathways.</p>
          </div>
          <span className="ov-count-badge">
            2 Premier PR Pathways Available
          </span>
        </div>

        <div className="ov-grid two-cols">
          {prPrograms.map((c) => (
            <Link to={c.link} className="ov-card" key={c.name}>
              <div className="ov-card-media">
                <img src={c.image} alt={c.name} loading="lazy" decoding="async" />
                <span className="ov-card-badge">{c.badge}</span>
                <span className="ov-card-price-pill">{c.price}</span>
              </div>

              <div className="ov-card-body">
                <p className="ov-card-tagline">{c.tagline}</p>
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
                    <Icon name="passport" size={13} /> Permanent Residency
                  </span>
                </div>

                <span className="ov-card-btn">
                  Check Eligibility & Apply <Icon name="arrow" size={13} />
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
            <p className="section-tag">OUR ADVANTAGE</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--navy)' }}>
              Why Skilled Professionals Trust Dream Country Visas
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
              We maximize your CRS and points score with precision profiling, document verification, and accredited advice.
            </p>
          </div>

          <div className="ov-why-grid">
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="certificate" size={20} /></div>
              <h4>MARA & Certified Advisory</h4>
              <p>Applications reviewed by licensed professionals following updated immigration laws.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="check" size={20} /></div>
              <h4>Points Maximization</h4>
              <p>Strategic guidance on IELTS/PTE, spouse points, and state nominations for higher rankings.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="support" size={20} /></div>
              <h4>End-to-End File Lodgement</h4>
              <p>Complete documentation from skills assessment body submission to final visa grant.</p>
            </div>
            <div className="ov-why-card">
              <div className="ov-why-icon"><Icon name="globe" size={20} /></div>
              <h4>Post-Landing Assistance</h4>
              <p>Guidance on initial accommodation, SIN/TFN registration, and settling into your new home.</p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="ov-cta-banner">
            <div className="ov-cta-text">
              <h3>Not Sure How Many Points You Score?</h3>
              <p>Get a comprehensive, zero-obligation points calculation and profile evaluation from our immigration specialists today.</p>
            </div>
            <button
              onClick={() => setShowConsultation(true)}
              className="ov-cta-btn"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Get Free Points Assessment <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ items={PR_OVERVIEW_FAQ} />

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </div>
  );
}
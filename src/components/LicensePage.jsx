import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import FAQ from './FAQ.jsx';

const GST_SLIDES = [
  {
    id: 1,
    image: '/landing-img/dreamcountry-visas-certificate-of-incorporation-1.webp',
    label: 'Page 1 — Main Certificate',
    title: 'Form GST REG-06 Registration Certificate',
    subtitle: 'Government of India · Goods & Services Tax',
    description:
      'Official GST Registration Certificate confirming Dreamcountry Visas Private Limited as a recognized corporate entity.',
    points: [
      'GSTIN: 06AAHCD4410F1Z4',
      'Legal Name: Dreamcountry Visas Private Limited',
      'Entity: Private Limited Company',
      'Location: DLF Corporate Greens, Tower-1, Sec 74A, Gurugram',
    ],
  },
  {
    id: 2,
    image: '/landing-img/dreamcountry-visas-certificate-of-incorporation-2.webp',
    label: 'Page 2 — Annexure A',
    title: 'Annexure A — Place of Business Details',
    subtitle: 'Jurisdictional Tax Compliance',
    description:
      'Official statutory annexure detailing authorized places of business and multi-office operations across Delhi NCR.',
    points: [
      'Jurisdiction: Haryana / Delhi Jurisdiction',
      'Constitution: Registered Private Limited Entity',
      'Full Statutory Tax Compliance Verified',
    ],
  },
  {
    id: 3,
    image: '/landing-img/dreamcountry-visas-certificate-of-incorporation-3.webp',
    label: 'Page 3 — Annexure B',
    title: 'Annexure B — Managing Directors',
    subtitle: 'Authorised Key Management Personnel',
    description:
      'Official government record of appointed managing directors responsible for governance and operations.',
    points: [
      'Director: Mohit Sharma (Delhi)',
      'Director: Usha Sharma (Haryana)',
      'Directorship recorded with Ministry & Tax Authorities',
    ],
  },
];

const LICENSE_FAQS = [
  {
    q: 'How can I verify Dream Country Visas incorporation with the Government?',
    a: 'You can verify our company on the official Ministry of Corporate Affairs (MCA) portal (www.mca.gov.in) using our CIN: U74999DL2019PTC355485.',
  },
  {
    q: 'What is the significance of the MARA accreditation for Australia visas?',
    a: 'MARA (Migration Agents Registration Authority) regulation guarantees that Australian migration advice meets strict legal standards, professional ethics, and client fund security.',
  },
  {
    q: 'Is Dream Country Visas GST compliant?',
    a: 'Yes, Dreamcountry Visas Private Limited is registered under the Goods and Services Tax Act with GSTIN: 06AAHCD4410F1Z4. All invoices and contracts are 100% GST-compliant.',
  },
  {
    q: 'Where are your physical registered offices located?',
    a: 'Head Office: Hemkunt Chambers, 310, 3rd Floor, Nehru Place, New Delhi 110019. Corporate Office: Office 507, DLF Corporate Greens, Tower-1, Sector 74A, Gurugram, Haryana 122004.',
  },
];

export default function LicensePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [modalImage, setModalImage] = useState(null);

  const totalSlides = GST_SLIDES.length;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keyboard navigation for carousel & modal close on Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalImage) {
        if (e.key === 'Escape') setModalImage(null);
      } else {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImage]);

  return (
    <div className="license-page">
      {/* Hero Section */}
      <section className="license-hero">
        <div className="container">
          <div className="license-hero-badge">
            <Icon name="certificate" size={16} />
            <span>OFFICIAL LICENSES &amp; ACCREDITATIONS</span>
          </div>
          <h1>Verified Credentials &amp; Legal Authorizations</h1>
          <p className="license-hero-desc">
            Government registrations, statutory tax filings, MARA compliance, and international partner mandates.
          </p>
          <div className="license-hero-badges">
            <div className="hero-trust-item">
              <Icon name="lock" size={16} />
              <span>Govt. Registered Entity</span>
            </div>
            <div className="hero-trust-item">
              <Icon name="star" size={16} />
              <span>MARA Compliant</span>
            </div>
            <div className="hero-trust-item">
              <Icon name="support" size={16} />
              <span>GST Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section license-mv-section">
        <div className="container">
          <div className="license-section-header">
            <p className="section-tag">OUR PURPOSE &amp; COMMITMENT</p>
            <h2>Mission &amp; Vision</h2>
            <p className="license-section-sub">
              Ethical, transparent, and results-driven immigration advisory.
            </p>
          </div>

          <div className="license-mv-grid">
            {/* Mission Card */}
            <div className="license-mv-card mission-card">
              <div className="mv-card-header">
                <div className="mv-icon-wrap">
                  <Icon name="target" size={28} />
                </div>
                <div>
                  <span className="mv-badge">CORE PURPOSE</span>
                  <h3>Our Mission</h3>
                </div>
              </div>
              <p className="mv-text">
                To offer <strong>genuine, ethical, and results-driven immigration services</strong> with complete transparency, verified documentation, and personalized strategies for seamless global relocation.
              </p>
              <ul className="mv-checklist">
                <li><Icon name="check" size={16} /> Honest &amp; Realistic Profile Evaluation</li>
                <li><Icon name="check" size={16} /> Strict Regulatory &amp; Embassy Compliance</li>
                <li><Icon name="check" size={16} /> End-to-End Document Preparation Support</li>
              </ul>
            </div>

            {/* Vision Card */}
            <div className="license-mv-card vision-card">
              <div className="mv-card-header">
                <div className="mv-icon-wrap">
                  <Icon name="globe" size={28} />
                </div>
                <div>
                  <span className="mv-badge">FUTURE HORIZON</span>
                  <h3>Our Vision</h3>
                </div>
              </div>
              <p className="mv-text">
                To be the <strong>most trusted global immigration and mobility consultancy</strong>, empowering individuals, professionals, and families to achieve their dream of living abroad.
              </p>
              <ul className="mv-checklist">
                <li><Icon name="check" size={16} /> Setting the Standard for Immigration Advisory</li>
                <li><Icon name="check" size={16} /> Direct Access to Global Residency &amp; CBI Programs</li>
                <li><Icon name="check" size={16} /> Delivering 99% Assurance in Application Success</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MARA Accreditation Section */}
      <section className="section license-detail-section mara-section">
        <div className="container">
          <div className="license-two-col">
            {/* Left: Image Card */}
            <div className="license-visual-col">
              <div
                className="license-card-frame mara-frame"
                onClick={() => setModalImage('/landing-img/MARA.webp')}
                title="Click to view high-resolution accreditation logo"
              >
                <div className="license-badge-overlay">
                  <span>AUSTRALIAN ACCREDITATION</span>
                </div>
                <div className="mara-img-container">
                  <img
                    src="/landing-img/MARA.webp"
                    alt="Migration Agents Registration Authority (MARA) Official Logo"
                    className="mara-logo-img"
                    loading="lazy"
                  />
                </div>
                <div className="license-preview-hint">
                  <Icon name="arrow" size={14} /> Click to expand image
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div className="license-info-col">
              <p className="section-tag left">OFFICIAL ACCREDITATION</p>
              <h2>Migration Agents Registration Authority (MARA)</h2>
              <div className="license-status-badge">
                <span className="status-dot green"></span>
                <span>Regulated Australian Migration Standards · MARN 0100178</span>
              </div>
              <p className="license-desc-lead">
                Officially regulated by the Migration Agents Registration Authority (OMARA) for Australian immigration services.
              </p>
              <p className="license-desc-body">
                We strictly follow the statutory MARA Code of Conduct, ensuring that all Australian PR, skilled migration, and work visa applications meet rigorous legal and professional standards.
              </p>

              <div className="license-highlights-grid">
                <div className="highlight-box">
                  <Icon name="lock" size={20} />
                  <div>
                    <h4>Code of Conduct</h4>
                    <p>Statutory protection of client interests and confidentiality.</p>
                  </div>
                </div>
                <div className="highlight-box">
                  <Icon name="certificate" size={20} />
                  <div>
                    <h4>Australian Law Mastery</h4>
                    <p>Current expertise in Department of Home Affairs regulations.</p>
                  </div>
                </div>
                <div className="highlight-box">
                  <Icon name="support" size={20} />
                  <div>
                    <h4>Client Protection</h4>
                    <p>Transparent fee structures and formal service agreements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry of Corporate Affairs (MCA) */}
      <section className="section license-detail-section mca-section alt-bg">
        <div className="container">
          <div className="license-two-col rev">
            {/* Left: Description */}
            <div className="license-info-col">
              <p className="section-tag left">GOVERNMENT OF INDIA</p>
              <h2>Ministry of Corporate Affairs Certificate of Incorporation</h2>
              <div className="license-status-badge">
                <span className="status-dot blue"></span>
                <span>Incorporated under the Companies Act, 2013</span>
              </div>
              <p className="license-desc-lead">
                Dreamcountry Visas Private Limited is an officially incorporated entity under the Ministry of Corporate Affairs, Government of India.
              </p>

              <div className="license-data-table">
                <div className="data-row">
                  <span className="data-key">Corporate Identity Number (CIN):</span>
                  <span className="data-val bold">U74999DL2019PTC355485</span>
                </div>
                <div className="data-row">
                  <span className="data-key">Company Name:</span>
                  <span className="data-val">DREAMCOUNTRY VISAS PRIVATE LIMITED</span>
                </div>
                <div className="data-row">
                  <span className="data-key">Incorporation Date:</span>
                  <span className="data-val">September 24, 2019</span>
                </div>
                <div className="data-row">
                  <span className="data-key">Permanent Account Number (PAN):</span>
                  <span className="data-val">AAHCD4410F</span>
                </div>
                <div className="data-row">
                  <span className="data-key">Tax Deduction Number (TAN):</span>
                  <span className="data-val">DELD22713F</span>
                </div>
                <div className="data-row">
                  <span className="data-key">Registrar Jurisdiction:</span>
                  <span className="data-val">ROC Delhi / Central Registration Centre</span>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="license-visual-col">
              <div
                className="license-card-frame cert-frame"
                onClick={() => setModalImage('/landing-img/dreamcountry-visas-gst-registration-certificate.png')}
                title="Click to view full Certificate of Incorporation"
              >
                <div className="license-badge-overlay">
                  <span>MCA CERTIFICATE · CIN: U74999DL2019PTC355485</span>
                </div>
                <div className="cert-doc-wrapper">
                  <img
                    src="/landing-img/dreamcountry-visas-gst-registration-certificate.png"
                    alt="Certificate of Incorporation - Ministry of Corporate Affairs"
                    className="doc-preview-img"
                    loading="lazy"
                  />
                </div>
                <div className="license-preview-hint">
                  <Icon name="arrow" size={14} /> Click to view full Certificate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GST Registration Certificate Carousel */}
      <section className="section license-detail-section gst-section">
        <div className="container">
          <div className="license-two-col">
            {/* Interactive Carousel */}
            <div className="license-visual-col">
              <div className="license-carousel-card">
                <div className="carousel-top-bar">
                  <div className="carousel-tag">
                    <Icon name="certificate" size={14} />
                    <span>{GST_SLIDES[activeSlide].label}</span>
                  </div>
                  <div className="carousel-slide-counter">
                    <strong>{activeSlide + 1}</strong> / {totalSlides}
                  </div>
                </div>

                <div
                  className="carousel-screen"
                  onClick={() => setModalImage(GST_SLIDES[activeSlide].image)}
                  title="Click to view high-resolution document"
                >
                  <img
                    src={GST_SLIDES[activeSlide].image}
                    alt={GST_SLIDES[activeSlide].title}
                    className="carousel-active-img"
                    key={GST_SLIDES[activeSlide].id}
                  />

                  <button
                    type="button"
                    className="carousel-btn prev-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    aria-label="Previous Certificate Page"
                  >
                    <Icon name="chevron-down" size={18} />
                  </button>

                  <button
                    type="button"
                    className="carousel-btn next-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    aria-label="Next Certificate Page"
                  >
                    <Icon name="chevron-down" size={18} />
                  </button>
                </div>

                <div className="carousel-nav-row">
                  <div className="carousel-dots">
                    {GST_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Go to ${slide.label}`}
                      >
                        <span>{idx + 1}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="carousel-expand-btn"
                    onClick={() => setModalImage(GST_SLIDES[activeSlide].image)}
                  >
                    <Icon name="arrow" size={14} /> View Page {activeSlide + 1} Full Size
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Details */}
            <div className="license-info-col">
              <p className="section-tag left">GOODS &amp; SERVICES TAX (GST)</p>
              <h2>Form GST REG-06 Registration Certificate</h2>
              <div className="license-status-badge">
                <span className="status-dot green"></span>
                <span>Active Taxpayer · GSTIN: 06AAHCD4410F1Z4</span>
              </div>

              <div className="active-slide-details-card">
                <h4>{GST_SLIDES[activeSlide].title}</h4>
                <p className="slide-desc-text">{GST_SLIDES[activeSlide].description}</p>
                <ul className="slide-points-list">
                  {GST_SLIDES[activeSlide].points.map((pt, i) => (
                    <li key={i}>
                      <Icon name="check" size={15} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="gst-statutory-notice">
                <Icon name="lock" size={18} />
                <p>
                  All invoices and advisory agreements are issued with official GST compliance for complete tax transparency and client protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Partner Appointment Certificate Section */}
      <section className="section license-detail-section partner-cert-section alt-bg">
        <div className="container">
          <div className="license-two-col rev">
            {/* Left: Description */}
            <div className="license-info-col">
              <p className="section-tag left">INTERNATIONAL AUTHORIZATION</p>
              <h2>Authorized Partner Certificate (Quebec Immigrant Investor)</h2>
              <div className="license-status-badge">
                <span className="status-dot green"></span>
                <span>Verified International Representative Appointment</span>
              </div>
              <p className="license-desc-lead">
                Formally appointed to promote and represent the Quebec Immigrant Investor Program and European mobility pathways.
              </p>
              <p className="license-desc-body">
                This official certification authorizes our firm to structure and submit qualifying investor residency applications with direct partner coordination.
              </p>

              <div className="license-highlights-grid">
                <div className="highlight-box">
                  <Icon name="certificate" size={20} />
                  <div>
                    <h4>Official Program Partner</h4>
                    <p>Direct accreditation to facilitate Quebec Immigrant Investor cases.</p>
                  </div>
                </div>
                <div className="highlight-box">
                  <Icon name="lock" size={20} />
                  <div>
                    <h4>Complete Confidentiality</h4>
                    <p>Secure client documentation and institutional privacy standards.</p>
                  </div>
                </div>
                <div className="highlight-box">
                  <Icon name="globe" size={20} />
                  <div>
                    <h4>Priority Processing</h4>
                    <p>Streamlined international coordination for due diligence review.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Document Visual */}
            <div className="license-visual-col">
              <div
                className="license-card-frame partner-frame"
                onClick={() => setModalImage('/landing-img/DC-certification.webp')}
                title="Click to view full Authorized Partner Certificate"
              >
                <div className="license-badge-overlay">
                  <span>PARTNER CERTIFICATE · IMMIGRANT INVESTOR</span>
                </div>
                <div className="cert-doc-wrapper partner-doc-wrap">
                  <img
                    src="/landing-img/DC-certification.webp"
                    alt="Authorized Partner Certificate - Quebec Immigrant Investor"
                    className="doc-preview-img partner-img"
                    loading="lazy"
                  />
                </div>
                <div className="license-preview-hint">
                  <Icon name="arrow" size={14} /> Click to view full certificate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Grid */}
      <section className="section trust-pillars-section">
        <div className="container">
          <div className="license-section-header">
            <p className="section-tag">WHY VERIFIED ADVISORY MATTERS</p>
            <h2>Our Regulatory Guarantees</h2>
            <p className="license-section-sub">
              Your immigration application is protected by verified government compliance.
            </p>
          </div>

          <div className="trust-pillars-grid">
            <div className="trust-pillar-card">
              <div className="trust-icon-wrap"><Icon name="certificate" size={24} /></div>
              <h4>100% Govt. Registered</h4>
              <p>Registered under the Ministry of Corporate Affairs and Tax Authorities.</p>
            </div>
            <div className="trust-pillar-card">
              <div className="trust-icon-wrap"><Icon name="lock" size={24} /></div>
              <h4>Direct Accountability</h4>
              <p>Contracts backed by authorized company directors with verified credentials.</p>
            </div>
            <div className="trust-pillar-card">
              <div className="trust-icon-wrap"><Icon name="support" size={24} /></div>
              <h4>Transparent Service</h4>
              <p>Clear scope of work with zero hidden charges or misleading claims.</p>
            </div>
            <div className="trust-pillar-card">
              <div className="trust-icon-wrap"><Icon name="star" size={24} /></div>
              <h4>Global Standards</h4>
              <p>Strict compliance across Citizenship, Residency, and PR pathways.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ items={LICENSE_FAQS} />

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="country-cta">
            <div>
              <h3>Have questions regarding our licenses or your visa profile?</h3>
              <p>Speak directly with our authorized immigration experts and directors.</p>
            </div>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-light">
                Book Consultation <Icon name="arrow" size={16} />
              </Link>
              <Link to="/" className="btn btn-ghost">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {modalImage && (
        <div
          className="license-modal-backdrop"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="license-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="license-modal-close"
              onClick={() => setModalImage(null)}
              aria-label="Close document preview"
            >
              &times;
            </button>
            <img src={modalImage} alt="Official Document High Resolution" className="license-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { CONTACT, PR_FAQ } from '../data.js';
import ConsultationModal from '../components/ConsultationModal';
import FAQ from '../components/FAQ.jsx';

const COUNTRIES = {
  australia: {
    name: 'Australia',
    tagline: 'Permanent Residency Visa — Pathways to a New Life',
    banner:  '/images/country-australia.webp',
    price: 'from AUD 6,135',
    time: '6-12 months',
    residency: 'Permanent Residency',
    family: 'Spouse & dependent children',
    overview:
      'Australia offers a safe, multicultural environment with world-class healthcare and education, a thriving economy with diverse job opportunities, and a welcoming, inclusive society — making it one of the most sought-after Permanent Residency destinations for skilled workers.',
    benefits: [
      'Live, work and study anywhere in Australia permanently',
      'Access to Australia’s healthcare system and social security benefits',
      'Path to Australian citizenship after fulfilling residency requirements',
      'Points-based system rewards age, skills, work experience & English proficiency',
    ],
    investments: [
      'Subclass 189 (Skilled Independent) — For skilled workers not sponsored by an employer, state or family member. Live and work anywhere in Australia permanently, no sponsorship required.',
      'Subclass 190 (Skilled Nominated) — For skilled workers nominated by an Australian state or territory. Requires living and working in the nominating state for a set period.',
      'Subclass 491 (Skilled Work Regional) — Provisional visa for workers nominated by a state or sponsored by an eligible family member in a designated regional area. Leads to PR after 3 years of meeting regional conditions.',
    ],
    process: [
      'Check eligibility — meet the points requirement and criteria for your chosen subclass',
      'Submit an Expression of Interest (EOI) through the SkillSelect system',
      'Receive an invitation to apply based on your EOI',
      'Apply for the visa within 60 days of receiving the invitation',
    ],
    fees: [
      'Visa application charges (after approval) — Primary applicant: AUD 6,135',
      'Visa application charges (after approval) — Secondary applicant: AUD 3,070',
      'Visa application charges (after approval) — Child (per child): AUD 1,540',
      'Subclass 189 & 190 processing — typically 6 to 12 months',
      'Subclass 491 processing — varies depending on regional sponsorship',
    ],
    documents: [
      'Valid passport',
      'Skills assessment from the relevant assessing authority',
      'English proficiency test results (IELTS / PTE)',
      'Proof of work experience & qualifications',
    ],
  },

  canada: {
    name: 'Canada',
    tagline: 'Permanent Residency Through Express Entry & PNP',
    banner: '/images/country-canada.webp',
    price: 'from CAD 2,300',
    time: '6-8 months',
    residency: 'Permanent Residency',
    family: 'Spouse & dependent children',
    overview:
      'Canada is one of the most popular PR destinations for skilled workers, offering multiple immigration pathways through the Express Entry system and Provincial Nominee Programs (PNP). Canada PR gives holders the right to live, work and study anywhere in the country, with a clear path to citizenship.',
    benefits: [
      'Live, work and study anywhere in Canada as a permanent resident',
      'Access to Canada’s public healthcare and social benefits',
      'Path to Canadian citizenship after meeting residency requirements',
      'Free to bring spouse and dependent children as part of the application',
    ],
    investments: [
      'Federal Skilled Worker Program (FSWP) — For skilled workers with foreign work experience, ranked through the Comprehensive Ranking System (CRS).',
      'Canadian Experience Class (CEC) — For candidates with skilled Canadian work experience.',
      'Provincial Nominee Program (PNP) — Nominated by a specific Canadian province based on its labour market needs, adds significant CRS points.',
    ],
    process: [
      'Create an Express Entry profile and get your CRS score assessed',
      'Improve your ranking through PNP nomination, French language skills or a job offer',
      'Receive an Invitation to Apply (ITA) in an Express Entry draw',
      'Submit your complete application with supporting documents',
      'Complete biometrics and medical examination',
      'Receive Confirmation of Permanent Residence (COPR)',
    ],
    fees: [
      'Processing fee — approx. CAD 850 per principal applicant',
      'Right of Permanent Residence fee — approx. CAD 515',
      'Biometrics & medical examination — additional costs apply',
    ],
    documents: [
      'Valid passport',
      'Educational Credential Assessment (ECA)',
      'Language test results (IELTS / CELPIP / TEF)',
      'Proof of funds & work experience letters',
    ],
  },

  germany: {
    name: 'Germany',
    tagline: 'The Germany Opportunity Card (Chancenkarte)',
    banner: '/images/country-germany.webp',
    price: 'EUR 100-150',
    time: '2-3 months',
    residency: 'Opportunity Card (points-based)',
    family: null,
    overview:
      'The Germany Opportunity Card is a points-based immigration program introduced by the German government to attract skilled professionals, entrepreneurs and talented individuals — giving a clear pathway to live and work in Germany while exploring long-term career and business opportunities.',
    benefits: [
      'Legal residence in Germany with work opportunities',
      'Access to German education and professional networks',
      'Transparent, points-based eligibility system',
      'Points earned for education, work experience & language skills',
    ],
    requirements: [
      'Minimum age 18 years, with a clean criminal record and valid passport',
      'Minimum qualifications as per visa category — recognized degrees preferred',
      'Relevant professional or entrepreneurial experience improves points',
      'Knowledge of German or English earns additional points',
      'Proof of funds to support your stay in Germany',
    ],
    process: [
      'Register on the official Germany Opportunity Card portal',
      'Prepare documents — passport, academic certificates, employment references, language certificates',
      'Complete the online application and pay the application fee',
      'Attend a visa interview at the German consulate (if required)',
      'Receive approval and visa stamping in your passport',
    ],
    fees: [
      'Official application fee — EUR 100 – 150',
      'In INR — approx. ₹8,500 – ₹13,500 (subject to exchange rate)',
      'Additional costs — document translation, notarization & language test fees',
    ],
    documents: [
      'Valid passport',
      'Academic certificates',
      'Employment reference letters',
      'Language proficiency certificate',
    ],
  },
};

export default function PRPage() {
  const { slug } = useParams();
  const country = COUNTRIES[slug];
  const [showConsultation, setShowConsultation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!country) {
    return (
      <div className="container country-notfound">
        <h2>Country not found</h2>
        <p>The PR program you are looking for is not available yet.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="country-page">
      <div
        className="country-banner"
        style={{ backgroundImage: `url(${country.banner})` }}
      >
        <div className="country-banner-overlay">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/">Home</Link> <span>›</span>
              <a href="/#services">Permanent Residency</a> <span>›</span>
              <em>{country.name}</em>
            </nav>
            <p className="country-tagline">— PERMANENT RESIDENCY</p>
            <h1>{country.name}</h1>
            <div className="country-meta">
              <span>{country.price}</span>
              <span>
                <Icon name="clock" size={14} /> {country.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container facts-row">
        {[
          { icon: 'certificate', label: 'Application Cost', value: country.price },
          { icon: 'clock', label: 'Processing Time', value: country.time },
          country.residency && {
            icon: 'passport',
            label: 'Residency Type',
            value: country.residency,
          },
          country.family && {
            icon: 'people',
            label: 'Family Eligibility',
            value: country.family,
          },
        ]
          .filter(Boolean)
          .map((f) => (
            <div className="fact-card" key={f.label}>
              <span className="fact-icon">
                <Icon name={f.icon} size={20} />
              </span>
              <span>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </span>
            </div>
          ))}
      </div>

      <div className="container country-body">
        <div className="country-main">
          <section className="country-section">
            <h2>{country.tagline}</h2>
            <p className="lead">{country.overview}</p>
          </section>

          <section className="country-section">
            <h2>Why Choose {country.name}?</h2>
            <div className="benefit-grid">
              {country.benefits.map((b) => (
                <div className="benefit-card" key={b}>
                  <span className="benefit-check">✓</span> {b}
                </div>
              ))}
            </div>
          </section>

          {country.requirements && (
            <section className="country-section">
              <h2>Eligibility &amp; Requirements</h2>
              <div className="req-box">
                <ul className="country-list">
                  {country.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

                    {country.investments && (
            <section className="country-section">
              <h2>Visa Routes</h2>
              <div className="invest-grid">
                {country.investments.map((i) => {
                  const parts = i.split(' — ');
                  return (
                    <div className="invest-card" key={i}>
                      <strong>{parts[0]}</strong>
                      <span>{parts.slice(1).join(' — ')}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="country-section">
            <h2>Application Process</h2>
            <ol className="process-list">
              {country.process.map((s, idx) => (
                <li className="process-step" key={s}>
                  <span className="step-num">{idx + 1}</span>
                  <p>{s}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="country-section">
            <h2>Cost &amp; Processing</h2>
            <div className="fees-table">
              {country.fees.map((f) => {
                const parts = f.split(' — ');
                return (
                  <div className="fees-row" key={f}>
                    <span>{parts[0]}</span>
                    <strong>
                      {parts.length > 1 ? parts.slice(1).join(' — ') : '—'}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="country-section">
            <h2>Documents Required</h2>
            <ul className="country-list">
              {country.documents.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>

          <div className="country-cta">
            <div>
              <h3>Ready to apply for {country.name} PR?</h3>
              <p>Get a free consultation with our immigration experts.</p>
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

        <aside className="country-sidebar">
          <div className="side-card navy">
            <h3>Start Your PR Journey</h3>
            <p>
              Talk to our experts and get a free eligibility assessment for{' '}
              {country.name}.
            </p>
                        <Link to="/contact" className="btn btn-light full">
              Book Consultation <Icon name="arrow" size={15} />
            </Link>
            <a
              href={CONTACT.whatsapp}
              className="btn btn-ghost full"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={16} /> WhatsApp Us
            </a>
          </div>

          <div className="side-card">
            <h4>Why Dream Country Visas?</h4>
            <ul className="side-list">
              <li>35+ years of experience</li>
              <li>9,000+ happy clients worldwide</li>
              <li>Expert PR & immigration guidance</li>
              <li>100% confidential process</li>
              <li>End-to-end documentation support</li>
            </ul>
          </div>

          <div className="side-card">
            <h4>Contact Info</h4>
            <ul className="side-contact">
              <li>
                <Icon name="phone" size={14} /> {CONTACT.phone}
              </li>
              <li>
                <Icon name="mail" size={14} /> {CONTACT.email}
              </li>
              <li>
                <Icon name="pin" size={14} /> {CONTACT.country}
              </li>
            </ul>
          </div>
                </aside>
      </div>

                        <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />

       <FAQ items={PR_FAQ[slug]} />
    </div>

    
  );
}
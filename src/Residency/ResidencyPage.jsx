import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { CONTACT, RESIDENCY_FAQ } from '../data.js';
import ConsultationModal from '../components/ConsultationModal.jsx';
import FAQ from '../components/FAQ.jsx';
import { isProgramVisible } from '../utils/programVisibility.js';

// =====================================================================
// ALL residency country pages live in this ONE file.
// URLs: /residency/canada, /residency/australia, /residency/new-zealand,
//       /residency/cyprus, /residency/malta, /residency/portugal,
//       /residency/latvia, /residency/italy, /residency/spain
// To add a new country: copy any object below, change the key (slug)
// and the content, then add its `link` in data.js RESIDENCY_MENU.
// Banner images: public/images/ (e.g. res-canada.png, 1920x1080)
// =====================================================================
const COUNTRIES = {
  canada: {
    name: 'Canada',
    tagline: 'Startup Visa & Quebec Immigrant Investor Program (QIIP)',
    banner: '/images/res-canada.webp',
    price: 'from CAD 75,000',
    time: '12-16 months',
    pr: 'Direct PR',
    family: 'Spouse & dependent children',
    overview:
      'Canada offers two premier investment immigration routes. The Startup Visa gives innovative entrepreneurs a direct pathway to permanent residency with access to mentorship, funding and Canadian markets — hugely popular with Indian founders. The Quebec Immigrant Investor Program (QIIP) suits high-net-worth individuals: a CAD 1.2M government-secured investment for 5 years, refundable at the end of the term.',
    benefits: [
      'Direct Canada PR for you and your family',
      'Free healthcare, education and social benefits',
      'Canadian citizenship eligibility after 3 years',
      'Access to mentorship and designated investors (Startup Visa)',
      'Startup Visa success rate around 80-85%',
      'QIIP investment is interest-free and refundable after 5 years',
    ],
    requirements: [
      'Language — minimum CLB 5 in English/French (IELTS, CELPIP, TEF)',
      'Innovative, scalable, job-creating business idea',
      'Letter of Support from a designated organization (VC fund, angel group or incubator)',
      'Proof of settlement funds as per IRCC guidelines',
      'QIIP — net worth CAD 2M+ legally obtained',
      'QIIP — 2 years business/management experience in last 5 years',
      'QIIP — genuine intent to reside in Quebec',
    ],
    investments: [
      'Venture Capital Fund route — CAD 200,000 minimum',
      'Angel Investor Group route — CAD 75,000 minimum',
      'Business Incubator route — no minimum investment',
      'QIIP — CAD 1.2M for 5 years (interest-free, refundable)',
    ],
    fees: [
      'IRCC application fee — CAD 1,540 (main applicant)',
      'Right of Permanent Residence fee — CAD 515',
      'Additional — language tests, medicals, police verification, translations',
      'QIIP processing — 18-24 months (separate stream)',
    ],
    process: [
      'Develop an innovative, scalable business plan',
      'Pitch and obtain a Letter of Support (1-3 months)',
      'Prepare documents — IELTS, business plan, proof of funds',
      'Submit application via the IRCC portal',
      'IRCC review of business viability & background (8-12 months)',
      'Receive PR and move to Canada with your family',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'IELTS / CELPIP / TEF results',
      'Business plan & Letter of Support',
      'Proof of settlement funds',
      'Police clearance & medical reports',
      'QIIP — net worth & business experience proof',
    ],
  },

  australia: {
    name: 'Australia',
    tagline: 'National Innovation Visa (Subclass 858)',
    banner: '/images/res-australia.webp',
    price: 'Talent-based',
    time: '3-6 months',
    pr: 'Direct PR',
    family: 'Spouse & dependent children',
    overview:
      'The National Innovation Visa (Subclass 858) is one of Australia’s fastest permanent residency pathways — built for internationally recognized talent in priority sectors like AI, clean energy, defence technology, MedTech and FinTech. Indian applicants with strong international achievements often receive approvals in just 3-6 months, with a success rate of around 70-80% for qualified profiles.',
    benefits: [
      'Fast-tracked permanent residency in 3-6 months',
      'No investment requirement — purely talent-based',
      'Family inclusion — spouse and dependent children',
      'Full work rights and Medicare (public healthcare) access',
      'Pathway to Australian citizenship',
      'Priority processing for in-demand sectors',
    ],
    requirements: [
      'Internationally recognized achievements in a priority sector',
      'Ability to meet the high-income threshold — AUD 167,500 (2025)',
      'Nominator with a national reputation in your field',
      'Expression of Interest (EOI) submitted first',
      'Health and character requirements',
    ],
    investments: [
      'National Innovation Visa (858) — no investment, 3-6 months, direct PR',
      'Business Innovation Visa — investment + business plan, 12-18 months',
      'Entrepreneur Visa — government funding / endorsement, 12-24 months',
      'Skilled Independent Visa — points-based, 6-12 months',
    ],
    fees: [
      'Visa application charge — as per Home Affairs schedule',
      'Health checks & police certificates — per applicant',
      'Migration consultant fees — optional but recommended',
    ],
    process: [
      'Submit an Expression of Interest (EOI)',
      'Secure a nominator with national reputation',
      'Receive an invitation to apply',
      'Lodge the visa application with evidence of achievements',
      'Health & character checks',
      'Direct grant of permanent residence',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Evidence of international achievements & recognition',
      'Nominator form (national reputation)',
      'Proof of income / high-income threshold ability',
      'Health and character certificates',
    ],
  },

  'new-zealand': {
    name: 'New Zealand',
    tagline: 'Active Investor Plus Visa (NZ Golden Visa)',
    banner: '/images/res-nz.webp',
    price: 'from NZD 3M',
    time: '12-18 months',
    pr: 'PR after 4 years',
    family: 'Spouse, children, parents (case-by-case)',
    overview:
      'The New Zealand Golden Visa — officially the Active Investor Plus Visa — is a prestigious residency-by-investment program for high-net-worth individuals. Invest a minimum of NZD 3 million over four years in approved funds, equities, bonds or startups, and secure residency in one of the world’s safest, most family-friendly countries.',
    benefits: [
      'Clear pathway to residency and PR in New Zealand',
      'Safe, multicultural, high quality of life for the family',
      'World-class education and healthcare access',
      'Invest in approved funds, equities, bonds or startups',
      'Global diversification in a stable economy',
      'Visa-free travel to multiple countries',
    ],
    requirements: [
      'Age up to 65 years',
      'Basic English proficiency',
      'Minimum NZD 3 million available for investment',
      'Spend 44-88 days per year in New Zealand (pathway-dependent)',
      'Investments kept active & compliant for 4 years',
      'Clean criminal record + valid health coverage',
    ],
    investments: [
      'Managed Funds — government-approved diversified portfolios',
      'Equities — shares in approved NZ companies',
      'Bonds — government or corporate bonds',
      'Startups & private companies — early-stage or growth businesses',
    ],
    fees: [
      'Application fee — NZD 3,310 per adult applicant',
      'Due diligence fees — charged per family member',
      'Legal / consultancy fees — vary by adviser',
    ],
    process: [
      'Consult a licensed NZ immigration adviser',
      'Prepare notarized & translated documents',
      'Submit Expression of Interest (EOI)',
      'Transfer funds into approved investments',
      'Due diligence checks → approval-in-principle',
      'Maintain compliance 4 years → permanent residency',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Proof of investment funds and source',
      'Health insurance / coverage proof',
      'Police clearance certificates',
    ],
  },

  cyprus: {
    name: 'Cyprus',
    tagline: 'Work & Residence Permit for Non-EU Investors',
    banner: '/images/res-cyprus.webp',
    price: 'from €300,000',
    time: '2-3 months',
    pr: 'PR pathway',
    family: 'Spouse & children',
    overview:
      'Cyprus offers non-EU investors one of the fastest and simplest routes to European residence — through investment in new residential property or company formation. Enjoy an EU member state with 12.5% corporate tax, 340 days of sunshine and a strategic location between Europe, Asia and Africa.',
    benefits: [
      'Fast processing — approvals in 2-3 months',
      'Low corporate tax (12.5%) and personal tax benefits',
      'Residence for spouse and dependent children',
      'Pathway to permanent residence and citizenship',
      'English widely spoken — easy for Indian families',
      'EU-standard healthcare and international schools',
    ],
    requirements: [
      'Investment in NEW residential property — minimum €300,000 + VAT',
      'OR company formation with active business operations',
      'Secure annual income from abroad — from €50,000 (plus increments for dependents)',
      'Clean criminal record for all applicants',
      'Health insurance covering Cyprus',
    ],
    investments: [
      'New residential property — from €300,000 + VAT',
      'Company formation route — active business with local operations',
    ],
    fees: [
      'Government application fees — per applicant',
      'VAT on new property — 5% (primary residence) or 19%',
      'Legal & due diligence fees — vary by case',
    ],
    process: [
      'Select the property or business route with our advisors',
      'Complete the investment and gather documents',
      'Submit the application to the Civil Registry & Migration Dept',
      'Fast-track review — approvals from 2 months',
      'Receive the residence permit and settle in Cyprus',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Property purchase or company documents',
      'Proof of stable income from abroad',
      'Clean criminal record certificate',
      'Health insurance policy',
    ],
  },

  malta: {
    name: 'Malta',
    tagline: 'Malta Permanent Residence Program (MPRP)',
    banner: '/images/res-malta.webp',
    price: 'from €100,000',
    time: '6-8 months',
    pr: 'Lifetime PR',
    family: 'Up to 4 generations',
    overview:
      'The Malta Permanent Residence Program (MPRP), run by the Residency Malta Agency, grants non-EU citizens the right to live indefinitely in Malta and travel visa-free across 27 Schengen countries. With the fast-track investment route, your PR card is typically approved within 6-8 months — and spouse, children, parents AND grandparents can all be included in one application.',
    benefits: [
      'Lifetime permanent residence in an EU country',
      'Visa-free travel across 27 Schengen countries',
      'Include spouse, children, parents & grandparents in one application',
      'No inheritance or wealth tax',
      'High-quality education and world-class healthcare',
      'Fast approval — typically 6-8 months',
    ],
    requirements: [
      'Age 18+; non-EU / non-EEA / non-Swiss citizen',
      'Clean criminal record for all applicants',
      'Minimum €500,000 in assets (incl. €150,000 financial assets)',
      'Audited proof of legitimate source of funds',
      'Valid health insurance covering Malta & EU + medical clearance',
      'Applications only via licensed agents (2025 rule)',
    ],
    investments: [
      'Government contribution — €68,000 – €98,000',
      'Property purchase — €300,000 – €350,000 (hold 5 years)',
      'OR property rental — €10,000 – €12,000 per year',
      'NGO donation — €2,000 (mandatory)',
    ],
    fees: [
      'Administrative fee — payable to Residency Malta Agency',
      'Enhanced 4-tier due diligence screening — per applicant',
      'Licensed agent fees — vary by provider',
    ],
    process: [
      'Engage a licensed MPRP agent',
      'Prepare documents & audited source-of-wealth proof',
      'Submit application + 4-tier due diligence screening',
      'Approval-in-principle from Residency Malta Agency',
      'Fulfil contribution + property + NGO donation',
      'Receive the lifetime PR card',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Proof of assets (€500,000 minimum)',
      'Audited source of funds documentation',
      'Health insurance covering Malta & EU',
      'Police clearance certificates',
    ],
  },

  portugal: {
    name: 'Portugal',
    tagline: 'Golden Visa — Residency by Investment',
    banner: '/images/res-portugal.webp',
    price: 'from €250,000',
    time: '6-12 months',
    pr: 'Citizenship in 5 years',
    family: 'Spouse, children & parents',
    overview:
      'The Portugal Golden Visa remains Europe’s most popular residency-by-investment program. Following the 2023-2025 reforms, most real estate routes are suspended — today’s eligible pathways are investment funds, capital transfer and job creation. Residency leads to Portuguese citizenship after just 5 years, with one of the lowest stay requirements in Europe.',
    benefits: [
      'Citizenship eligibility after only 5 years',
      'Minimal stay requirement to maintain residency',
      'Schengen visa-free travel across 26+ countries',
      'Family inclusion — spouse, children and dependent parents',
      'Access to EU education, healthcare and lifestyle',
      'Investment in a stable European economy',
    ],
    requirements: [
      'Minimum age 18 with clean criminal record',
      'Proof of legitimate source of funds',
      'Valid health insurance',
      'Note: most real estate routes suspended (2023-2025 reforms)',
      'Renew the Golden Visa every 2 years until citizenship',
      'Citizenship — 5 years residence + basic Portuguese language',
    ],
    investments: [
      'Investment funds (approved VC / funds) — €500,000',
      'Capital transfer to Portuguese company/bonds — €1,000,000',
      'Job creation (5 permanent jobs) — €350,000',
      'Job creation in low-density regions — €250,000',
    ],
    fees: [
      'Government processing fees — per applicant',
      'Legal / lawyer fees — vary by firm',
      'Due diligence & administrative charges',
    ],
    process: [
      'Choose the investment route (funds / capital / jobs)',
      'Hire a licensed Portuguese immigration lawyer',
      'Prepare notarized documents & proof of funds',
      'Submit the online application (AIMA/SEF portal)',
      'Biometrics & temporary residency approval',
      'Renew every 2 years → citizenship after 5 years',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Birth / marriage certificates',
      'Police clearance certificate',
      'Proof of investment & source of funds',
      'Health insurance documents',
    ],
  },

  latvia: {
    name: 'Latvia',
    tagline: 'Residence Permit by Investment — 2026 Update',
    banner: '/images/res-latvia.webp',
    price: 'from €50,000',
    time: '2-3 months',
    pr: 'PR after 5 years',
    family: 'Spouse & dependent children',
    overview:
      "Latvia's Immigration Law was updated in 2026, closing the long-running real estate and bank deposit Golden Visa routes as of 14 September 2026. Applications filed with the Office of Citizenship and Migration Affairs (OCMA) on or before 14 September 2026 are still processed under the previous rules. New applicants can now qualify through a company investment or a new fund investment route, with a 2-year initial permit for the company route.",
    benefits: [
      'One of the cheapest EU residency routes still available',
      'Residency for the whole family — spouse and children included',
      'Live, work and study in Latvia',
      'Visa-free travel across the Schengen Area',
      'Access to EU healthcare and education systems',
      'PR after 5 years, subject to meeting stay and tax requirements',
    ],
    requirements: [
      'Minimum 18 years; non-EU / non-EEA / non-Swiss nationals',
      'Clean criminal record and good health',
      'No outstanding tax liabilities worldwide',
      'Applications on or before 14 September 2026 processed under the previous rules',
      'From 15 September 2026, both surviving routes are closed to Russian and Belarusian citizens',
      'Health insurance of at least 1 year',
    ],
    investments: [
      'Company investment (small business) — €50,000 + €10,000 State fee, 2-year permit',
      'Company investment (50+ employees, €10M+ turnover) — €100,000 + €10,000 State fee, 2-year permit',
      'New Fund Investment Route — €150,000 held 5 years + €10,000 State fee (mechanics pending, deadline Dec 2027)',
    ],
    fees: [
      'State budget contribution — €10,000 per applicant on the company routes',
      'Processing fees — per application',
    ],
    process: [
      'Confirm which route applies — company investment or the new fund route',
      'Make the qualifying investment in Latvia',
      'Prepare and submit the documents',
      'Receive a temporary D-visa and travel to Latvia',
      'Receive the residence permit (2-year initial term, renewable)',
      'Meet stay and tax requirements → permanent residency after 5 years',
    ],
    documents: [
      'Application form + valid passport',
      'Proof of investment and source of funds',
      'Clean criminal record certificate',
      'Health insurance (1 year) + medical certificate',
      'Financial stability proof (bank statements)',
    ],
  },

  italy: {
    name: 'Italy',
    tagline: 'Investor Visa for Italy (Golden Visa)',
    banner: '/images/res-italy.webp',
    price: 'from €250,000',
    time: '3-4 months',
    pr: 'PR after 5 years',
    family: 'Spouse & family members',
    overview:
      'The Investor Visa for Italy grants a 2-year renewable residence permit for investments in Italian startups, companies or government bonds. With no minimum stay requirement, a special flat-tax regime for new residents, and the famous Italian lifestyle — it is one of Europe’s most flexible golden visas.',
    benefits: [
      'No minimum stay requirement',
      'Flat tax regime option for new residents (€200,000/year on foreign income)',
      'Schengen travel freedom',
      'Fast Nulla Osta approval — within 30 days',
      'Family members join under the family visa',
      'PR after 5 years, citizenship after 10',
    ],
    requirements: [
      'Minimum age 18 with clean criminal record',
      'Proof of investment funds and lawful source',
      'Obtain the Nulla Osta (certificate of no impediment) before applying',
      'Complete the investment within 3 months of entry',
      'Maintain the investment for the visa duration',
    ],
    investments: [
      'Innovative startup investment — €250,000',
      'Italian company shares — €500,000',
      'Philanthropic donation — €1,000,000',
      'Government bonds — €2,000,000',
    ],
    fees: [
      'Visa application fees — per applicant',
      'Residence permit fees — on arrival in Italy',
      'Legal / consultancy fees — vary by provider',
    ],
    process: [
      'Apply online for the Nulla Osta (approval in ~30 days)',
      'Apply for the investor visa at the consulate',
      'Enter Italy and apply for the residence permit',
      'Complete the investment within 3 months',
      '2-year permit → renew for 3 more years',
      'PR after 5 years of residence',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Proof of investment funds and source',
      'Nulla Osta (certificate of no impediment)',
      'Health insurance policy',
      'Clean criminal record certificate',
    ],
  },

  spain: {
    name: 'Spain',
    tagline: 'Golden Visa — Residency by Investment',
    banner: '/images/res-spain.webp',
    price: 'from €500,000',
    time: '2-3 months',
    pr: 'PR after 5 years',
    family: 'Spouse, children & parents',
    overview:
      'Spain’s Golden Visa offers residence through real estate and capital investment. Live, work and study anywhere in Spain with your family, enjoy Schengen visa-free mobility, and progress to permanent residence after 5 years — all in one of Europe’s most loved lifestyles.',
    benefits: [
      'Live, work and study anywhere in Spain',
      'Fast initial approval — 2-3 months',
      'Schengen visa-free travel',
      'Whole family in one application — spouse, children, dependent parents',
      'No minimum stay to renew the visa',
      'PR after 5 years, citizenship after 10',
    ],
    requirements: [
      'Minimum age 18 with clean criminal record',
      'Qualifying investment (property or capital)',
      'Proof of sufficient funds for the family',
      'Public or private health insurance in Spain',
      'No entry ban in Spain or Schengen',
    ],
    investments: [
      'Real estate investment — €500,000',
      'Spanish company shares / bank deposit — €1,000,000',
      'Government bonds — €2,000,000',
    ],
    fees: [
      'Property taxes — ITP / VAT depending on property type',
      'Government visa fees — per applicant',
      'Legal & notary fees — vary by case',
    ],
    process: [
      'Choose and complete the qualifying investment',
      'Gather documents & apostilles',
      'Submit the visa application (Spain or consulate)',
      'Approval in 2-3 months',
      'Receive the residence card — renewable',
      'PR after 5 years of residence',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Property purchase deeds / investment proof',
      'Proof of sufficient funds',
      'Health insurance policy',
      'Clean criminal record certificate',
    ],
  },
};

export default function ResidencyPage() {
  const { slug } = useParams();
  const country = COUNTRIES[slug];
  const [showConsultation, setShowConsultation] = useState(false);

  // Scroll to top whenever the country changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!isProgramVisible(`/residency/${slug}`)) {
    return <Navigate to="/residency" replace />;
  }

  if (!country) {
    return (
      <div className="container country-notfound">
        <h2>Country not found</h2>
        <p>The program you are looking for is not available yet.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="country-page res-page">
      {/* Hero — full-width image with navy gradient from the left */}
      <div
        className="res-hero"
        style={{ backgroundImage: `url(${country.banner})` }}
      >
        <div className="res-hero-overlay">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/">Home</Link> <span>›</span>
              <a href="/#destinations">Residency</a> <span>›</span>
              <em>{country.name}</em>
            </nav>
            <p className="res-kicker">RESIDENCY BY INVESTMENT</p>
            <h1>{country.name}</h1>
            <p className="res-tagline">{country.tagline}</p>
            <div className="res-chips">
              <span className="res-chip solid">{country.price}</span>
              <span className="res-chip">
                <Icon name="clock" size={14} /> {country.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info ribbon */}
      <div className="res-ribbon">
        <div className="container res-ribbon-inner">
          {[
            {
              icon: 'passport',
              label: 'Minimum Investment',
              value: country.price.replace('from ', ''),
            },
            { icon: 'clock', label: 'Processing Time', value: country.time },
            country.pr && {
              icon: 'certificate',
              label: 'PR Pathway',
              value: country.pr,
            },
            country.family && {
              icon: 'people',
              label: 'Family Inclusion',
              value: country.family,
            },
          ]
            .filter(Boolean)
            .map((f) => (
              <div className="res-ribbon-item" key={f.label}>
                <span className="res-ribbon-icon">
                  <Icon name={f.icon} size={18} />
                </span>
                <div>
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="container country-body">
        {/* LEFT — main content */}
        <div className="country-main">
          <section className="country-section">
            <h2 className="res-heading">
              <em>The Program</em>Program Overview
            </h2>
            <p className="lead">{country.overview}</p>
          </section>

          <section className="country-section">
            <h2 className="res-heading">
              <em>Why Choose {country.name}</em>Key Benefits
            </h2>
            <ul className="res-benefits">
              {country.benefits.map((b) => (
                <li key={b}>
                  <span className="res-check">✓</span> {b}
                </li>
              ))}
            </ul>
          </section>

          {country.requirements && (
            <section className="country-section">
              <h2 className="res-heading">
                <em>Who Qualifies</em>Eligibility &amp; Requirements
              </h2>
              <div className="res-req">
                {country.requirements.map((r) => (
                  <div className="res-req-item" key={r}>
                    <span>▸</span> {r}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="country-section">
            <h2 className="res-heading">
              <em>Routes &amp; Amounts</em>Investment Routes
            </h2>
            <div className="res-table">
              <div className="res-table-head">
                <span>Route</span>
                <span>Amount / Details</span>
              </div>
              {country.investments.map((i) => {
                const parts = i.split(' — ');
                return (
                  <div className="res-table-row" key={i}>
                    <span>{parts[0]}</span>
                    <strong>
                      {parts.length > 1 ? parts.slice(1).join(' — ') : '—'}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>

          {country.fees && (
            <section className="country-section">
              <h2 className="res-heading">
                <em>What It Costs</em>Fees &amp; Charges
              </h2>
              <div className="res-table">
                <div className="res-table-head">
                  <span>Item</span>
                  <span>Details</span>
                </div>
                {country.fees.map((f) => {
                  const parts = f.split(' — ');
                  return (
                    <div className="res-table-row" key={f}>
                      <span>{parts[0]}</span>
                      <strong>
                        {parts.length > 1 ? parts.slice(1).join(' — ') : '—'}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {country.process && (
            <section className="country-section">
              <h2 className="res-heading">
                <em>How It Works</em>Application Process
              </h2>
              <div className="res-steps">
                {country.process.map((s, idx) => (
                  <div className="res-step" key={s}>
                    <span className="res-step-chip">STEP {idx + 1}</span>
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="country-section">
            <h2 className="res-heading">
              <em>Paperwork</em>Documents Required
            </h2>
            <div className="res-req">
              {country.documents.map((d) => (
                <div className="res-req-item" key={d}>
                  <span>▸</span> {d}
                </div>
              ))}
            </div>
          </section>

          {/* CTA — soft panel with navy left border */}
          <div className="res-cta">
            <div>
              <h3>Start your {country.name} residency journey</h3>
              <p>Free eligibility assessment with our residency experts.</p>
            </div>
            <div className="cta-buttons">
                           <Link to="/contact" className="btn btn-primary">
                Book Consultation <Icon name="arrow" size={16} />
              </Link>
              <Link to="/" className="btn btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT — sticky sidebar */}
        <aside className="country-sidebar">
          <div className="side-card navy">
            <h3>Check Your Eligibility</h3>
            <p>
              Talk to our experts and get a free residency assessment for{' '}
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

          <div className="side-card blueline">
            <h4>Why Dream Country Visas?</h4>
            <ul className="side-list">
              <li>35+ years of experience</li>
              <li>9,000+ happy clients worldwide</li>
              <li>Residency programs in 50+ countries</li>
              <li>100% confidential process</li>
              <li>End-to-end documentation support</li>
            </ul>
          </div>

          <div className="side-card blueline">
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

       <FAQ items={RESIDENCY_FAQ[slug]} />
    </div>
  );
}

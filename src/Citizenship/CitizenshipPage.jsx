import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { CONTACT, CITIZENSHIP_FAQ } from '../data.js';
import ConsultationModal from '../components/ConsultationModal.jsx';
import FAQ from '../components/FAQ.jsx';


export const COUNTRIES = {
  'antigua-barbuda': {
    name: 'Antigua & Barbuda',
    tagline: 'Citizenship by Investment',
    banner: '/images/country-antigua.webp',
    price: 'from $230,000',
    time: 'from 8 months',
    visaFree: '150+',
    family: 'Spouse, children & parents',
    process: [
      'Free consultation and program selection with our experts',
      'Document preparation and preliminary due diligence check',
      'Application submission to the Citizenship by Investment Unit (CIU)',
      'Government approval in principle',
      'Complete the investment / contribution',
      'Receive citizenship certificate and passport',
    ],
    overview:
      'The Antigua & Barbuda Citizenship by Investment Program (CIP) grants full citizenship to investors and their families who make a significant contribution to the country’s economy. All applicants undergo thorough government due diligence and background checks before citizenship is granted.',
    benefits: [
      'Visa-free travel to 150+ countries',
      'Citizenship for the whole family, including dependents',
      'No tax on worldwide income, wealth or inheritance',
      'Lifetime citizenship, passed on to future generations',
    ],
    requirements: [
      'Minimum age of 18 years',
      'Choose ONE investment option: NDF contribution, real estate, business investment, or UWI Fund',
      'National Development Fund (NDF) — minimum $230,000 non-refundable contribution',
      'Approved real estate — minimum $300,000, held for at least 5 years',
      'Business investment — $1,500,000 as sole investor, or joint investment of $5,000,000 total (min 2 investors, $400,000 each)',
      'University of the West Indies (UWI) Fund — $260,000 for a family of 6 (includes processing fees)',
      'Pass government due diligence and background checks',
      'Government, due diligence and passport fees payable for each family member',
    ],
    investments: [
      'National Development Fund donation — from $230,000',
      'Approved real estate investment — from $300,000 (hold 5 years)',
      'Business investment — from $1,500,000 (sole) / $5,000,000 (joint)',
      'University of West Indies Fund (family of 6) — from $260,000',
    ],
    fees: [
      'Processing fee — $10,000 (individual) / $20,000 (family up to 4), +$10,000 per additional dependent',
      'Due diligence — $8,500 (main applicant) + $5,000 (spouse)',
      'Dependent fee — $2,000 (age 12-17) / $4,000 (age 18+)',
      'Benefactor fee — $5,000',
      'UWI Fund option — no separate processing fee ($260,000 is inclusive, family of 6)',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Police clearance certificates',
      'Proof of source of funds',
      'Medical certificates',
    ],
  },

  'st-kitts-nevis': {
    name: 'St. Kitts and Nevis',
    tagline: 'Citizenship by Investment — Since 1984',
    banner: '/images/country-stkitts.webp',
    price: 'from $250,000',
    time: 'from 4-6 months',
    visaFree: '150+',
    family: 'Spouse, children under 26, parents 55+',
    overview:
      'St. Kitts and Nevis Citizenship by Investment is the world’s first and oldest citizenship program, launched in 1984. For over 40 years it has been top-rated for stability, strict due diligence and consistent progress — attracting entrepreneurs and investors whose contribution directly develops the nation’s economy.',
    benefits: [
      'Lifetime citizenship — passed on to future generations by descent',
      'Include spouse, children under 26 and parents aged 55 or above',
      'Commonwealth member — benefits in the UK and other Commonwealth nations',
      'Well connected to North America and Europe',
      'No minimum stay required in the country',
      'Dual citizenship permitted',
    ],
    requirements: [
      'Minimum age of 18 years at the time of application',
      'Contribute via ONE of the three approved investment options',
      'Pass the country’s stringent background and due diligence checks',
      'Attend an interview — main applicant and dependents aged 16+',
    ],
    investments: [
      'Approved Public Benefit Project — minimum $250,000 (non-refundable)',
      'Sustainable Island State Contribution (SISC) — $250,000 (applicant + up to 3 dependents)',
      'Approved real estate development or condominium unit — from $325,000',
      'Private single-family dwelling — from $600,000',
    ],
    fees: [
      'SISC additional dependent (18+) — $50,000',
      'SISC additional dependent (under 18) — $25,000',
      'Application, due diligence and passport fees — payable per applicant',
    ],
    process: [
      'Complete and submit the application',
      'Attend the interview (main applicant and dependents 16+)',
      'Pay the application fees',
      'Complete the investment',
      'Receive citizenship approval and passport',
    ],
    documents: [
      'Valid passport copies for all applicants',
      'Police clearance certificates',
      'Proof of source of funds',
      'Birth and marriage certificates',
    ],
  },

  malta: {
    name: 'Malta',
    tagline: 'Malta Citizenship by Merit (MCBM)',
    banner: '/images/country-malta.webp',
    price: 'Strategic National Contribution',
    time: 'from 20+ months',
    visaFree: '180+',
    family: 'Spouse, children under 29 & dependent parents',
    urlCom: 'https://dreamcountryvisas.com/citizenship/malta',
    urlIn: 'https://dreamcountryvisas.in/citizenship/malta',
    overview:
      'The Malta Citizenship by Merit (MCBM) framework was introduced in July 2025 through Legal Notice 159 of 2025, amending the Maltese Citizenship Act, Cap. 188 (Subsidiary Legislation 188.06, Article 11A(1)). This prestigious, discretionary framework provides for naturalization in recognition of exceptional service or contribution to the national interest of the Republic of Malta, as well as continued engagement with Malta after naturalization. Each case is assessed individually on merit, credibility, due diligence, and alignment with Malta’s strategic national objectives.',
    benefits: [
      'Access to a powerful European passport with visa-free access to 180+ countries including the UK and USA',
      'Unrestricted European Union rights: live, work, study, and establish businesses across Malta, the EU, EEA, and Switzerland',
      'Dual and multiple citizenship permitted under Maltese law',
      'Malta is recognized as one of the world’s safest countries with strong political and economic stability',
      'Comprehensive family inclusion: spouse/civil partner, minor children, and dependent unmarried adult children up to age 29',
      'High Mediterranean quality of life, English-speaking European base, top-tier healthcare, and attractive business framework',
    ],
    requirements: [
      'Main applicant over 18 years old of outstanding character, clean criminal record, and good health with medical coverage',
      'Demonstrate exceptional service, achievement, or contribution deemed of strategic national value to Malta',
      'Establish and maintain legal residence in Malta during the application process (20+ months)',
      'Secure suitable residential accommodation in Malta (leased or purchased) and maintain genuine ties',
      'Pass multi-tiered due diligence, including international intelligence, law enforcement, and source of funds review',
      'Possess adequate knowledge of Maltese or English',
      'No previous visa refusal from countries with visa-free travel arrangements with Malta (unless subsequently resolved)',
    ],
    investments: [
      'A contribution deemed of strategic national value and importance (No fixed minimum investment threshold)',
      'Strategic initiatives aligned with long-term national objectives, including Malta Vision 2050',
      'Philanthropic support in sectors such as education, healthcare, sustainability, or scientific research',
      'Business ventures that create high-value employment and support technological innovation in Malta',
      'Environmental, water, clean energy, or circular economy infrastructure projects',
    ],
    fees: [
      'Strategic national contribution — evaluated based on merit and national benefit',
      'Due diligence & intelligence screening fees — payable per applicant and adult dependent',
      'Residence permit, biometric appointment, and Aġenzija Komunità Malta administrative fees',
      'Naturalization and passport issuance statutory fees',
    ],
    process: [
      'Step 1: Onboarding, pre-clearance screening, and strategic merit proposal formulation with our advisors',
      'Step 2: Residence application submission and securing suitable residential accommodation in Malta',
      'Step 3: Biometric appointment with Maltese immigration authorities in Malta',
      'Step 4: Submission of eligibility and project application to the Aġenzija Komunità Malta Evaluation Board',
      'Step 5: Rigorous government due diligence, background screening, and source of funds verification',
      'Step 6: Evaluation Board recommendation and discretionary Ministerial Decision',
      'Step 7: Government Approval in Principle issued',
      'Step 8: Final naturalization application assembly and legal document certification',
      'Step 9: Official Letter of Invitation issued by the Maltese Government',
      'Step 10: Oath of Allegiance in Malta, Certificate of Naturalization, and Maltese biometric passport issuance',
    ],
    documents: [
      'Certified copies of valid passports and national identification cards for all family members',
      'Detailed proposal substantiating the applicant’s merit, contribution, and alignment with Malta’s national interest',
      'Original police clearance certificates from country of origin, residence, and relevant jurisdictions',
      'Proof of legal residence and suitable accommodation in Malta (lease or purchase contract)',
      'Proof of financial capability, legitimate source of wealth, and audited banking documentation',
      'Medical examination certificates, clean bill of health, and international health insurance coverage',
      'Certified civil status records: birth certificates, marriage or civil partnership certificates (apostilled)',
    ],
  },

  vanuatu: {
    name: 'Vanuatu',
    tagline: 'Development Support Program (DSP)',
    banner: '/images/country-vanuatu.webp',
    price: 'from $130,000',
    time: '2-3 months',
    visaFree: '100+',
    family: 'Spouse, children under 25, parents',
    overview:
      'Vanuatu’s Citizenship by Investment — officially the Development Support Program (DSP) — is the Pacific’s only active CBI initiative and one of the fastest in the world. A contribution to the nation’s development fund grants full citizenship and passport in just 2–3 months.',
    benefits: [
      'Fastest CBI processing in the world — 2 to 3 months',
      'Visa-free travel to 100+ countries incl. Schengen, UK, Hong Kong, Singapore',
      'No income, wealth or inheritance taxes',
      'Dual citizenship allowed',
      'Include spouse, children under 18 (under 25 if studying) and dependent parents',
      'Safe, tax-friendly and business-ready jurisdiction',
    ],
    requirements: [
      'Minimum age of 18 years',
      'Clean criminal record',
      'Good health, verified through medical reports',
      'Proof of legitimate funds for the investment',
      'Apply through a government-licensed agent',
    ],
    investments: [
      'DSP donation — single applicant $130,000 – $150,000',
      'Family of four — $180,000 – $200,000',
    ],
    fees: [
      'Application fee — $2,500 – $5,000',
      'Passport issuance — $1,000 – $1,500',
      'Licensed agent / consultancy fees — varies by provider',
    ],
    process: [
      'Submit application through a licensed agent',
      'Government due diligence & verification',
      'Donation payment to the DSP Fund',
      'Approval & issuance of passport and citizenship certificate',
    ],
    documents: [
      'Passport and identification documents',
      'Birth / marriage certificates',
      'Police clearance certificate',
      'Proof of funds and financial capability',
      'Health certificate',
    ],
  },

  nauru: {
    name: 'Nauru',
    tagline: 'Exclusive Pacific Citizenship Program',
    banner: '/images/country-nauru.webp',
    price: 'from $75,000',
    time: '3-6 months',
    visaFree: 'Pacific nations',
    family: 'Spouse, children, parents & grandparents',
    overview:
      'Nauru offers one of the world’s most exclusive and low-profile Citizenship by Investment programs. Ideal for investors seeking privacy, affordability and global diversification, it grants citizenship through a direct contribution — at a cost lower than most Caribbean programs.',
    benefits: [
      'One of the most affordable CBI programs in the world',
      'Confidential & exclusive — fewer applicants, low profile',
      'Dual citizenship allowed',
      'Tax-friendly offshore environment',
      'Include spouse, dependent children, parents & grandparents',
    ],
    requirements: [
      'Minimum age of 18 years with clean criminal record',
      'Proof of legitimate source of funds and financial capability',
      'Valid health insurance — Nauru + international coverage',
      'Pass government due diligence checks',
      'Note: limited visa-free travel (South Pacific) — no Schengen / UK access',
    ],
    investments: [
      'Government donation — $75,000 – $100,000 (non-refundable)',
      'Approved real estate — varies by availability',
      'Business investment in key industries — negotiable',
    ],
    fees: [
      'Due diligence and processing fees — payable per application',
      'Applications handled case-by-case via licensed CBI advisors',
    ],
    process: [
      'Prepare KYC documents (2–4 weeks)',
      'Submit application via a licensed CBI advisor',
      'Government due diligence checks (2–3 months)',
      'Transfer the investment after pre-approval',
      'Citizenship approval within 3–6 months',
      'Passport issuance',
    ],
    documents: [
      'Valid passport',
      'Proof of funds & source of wealth',
      'Police clearance certificate',
      'Health insurance documents',
    ],
  },

  grenada: {
    name: 'Grenada',
    tagline: 'Citizenship by Investment & USA E-2 Treaty',
    banner: '/images/country-grenada.webp',
    price: 'from $235,000',
    time: 'from 6-9 months',
    visaFree: '145+',
    family: 'Spouse, children under 30, parents 55+ & siblings',
    urlCom: 'https://dreamcountryvisas.com/citizenship/grenada',
    urlIn: 'https://dreamcountryvisas.in/citizenship/grenada',
    overview:
      'Grenada’s Citizenship by Investment Program, established under Act No. 15 of 2013, is one of the most prestigious and versatile in the Caribbean. Grenada is the only Caribbean CBI nation with an active USA E-2 Investor Visa treaty, allowing citizens to establish and operate businesses in the United States. In addition, the Grenadian passport grants visa-free access to major commercial hubs including the UK, Schengen Area, China, and Singapore.',
    benefits: [
      'USA E-2 Investor Visa Treaty — live, work, and operate a business in the United States',
      'Visa-free access to 145+ countries, including the UK, Schengen Zone, China, and Singapore',
      'Zero residency or physical visit requirements before or after citizenship approval',
      'Generous family inclusion: spouse, children under 30, parents/grandparents 55+, and unmarried siblings without children',
      'Zero worldwide income, wealth, capital gains, or inheritance taxes',
      'Lifetime dual citizenship legally passed down to future generations',
    ],
    requirements: [
      'Minimum age of 18 years for the principal applicant',
      'Choose ONE approved investment pathway: National Transformation Fund (NTF) donation or government-approved Real Estate',
      'National Transformation Fund (NTF) contribution — minimum $235,000 for single applicant or family up to 4',
      'Approved Real Estate investment — minimum $270,000 (shared fractional ownership) or $350,000 (sole ownership), held for at least 5 years',
      'Clean criminal record and verifiable legal source of funds',
      'Pass multi-tier international due diligence and security vetting checks',
      'Mandatory interview for all applicants aged 17 and older',
    ],
    investments: [
      'National Transformation Fund (NTF) — from $235,000 (single applicant or family up to 4)',
      'Approved Real Estate (Fractional) — from $270,000 in government-designated luxury tourism projects',
      'Approved Real Estate (Full Ownership) — from $350,000 individual deed',
      'Additional dependents beyond family of 4 — $25,000 per parent/child ($75,000 per eligible sibling)',
    ],
    fees: [
      'Due diligence fee — $5,000 (main applicant) + $5,000 (spouse) + $5,000 (dependents aged 17+)',
      'Application fee — $1,500 per applicant',
      'Processing fee — $1,500 (main applicant) + $1,500 (dependents aged 17+) / $500 (dependents under 17)',
      'Interview fee — $1,000 per applicant aged 17+',
      'Government real estate fee — $50,000 (family up to 4 under real estate option)',
    ],
    process: [
      'Initial consultation, confidential pre-screening and agent engagement',
      'Document collection, legal translation, and government application assembly',
      'Submission to the Grenada Citizenship by Investment Committee (CBIC)',
      'Comprehensive background due diligence and virtual interview',
      'Government approval-in-principle issued',
      'Complete statutory investment (NTF contribution or real estate disbursement)',
      'Issuance of Naturalization Certificate and Grenadian Passport',
    ],
    documents: [
      'Certified copy of current passport and government-issued ID',
      'Original police clearance certificate from country of origin and residence',
      'Certified birth certificate and marriage certificate (if applicable)',
      'Bank statements, audited financial records and proof of source of funds',
      'Comprehensive medical examination and HIV test results (valid within 3 months)',
      'Professional and personal reference letters',
    ],
  },

  argentina: {
    name: 'Argentina',
    tagline: 'Fast-Track Residency & Citizenship by Investment',
    banner: '/images/country-argentina.webp',
    price: 'from $50,000',
    time: '2 years to citizenship',
    visaFree: '170+',
    family: 'Spouse, children under 18 & dependent parents',
    urlCom: 'https://dreamcountryvisas.com/citizenship/argentina',
    urlIn: 'https://dreamcountryvisas.in/citizenship/argentina',
    overview:
      'Argentina offers one of the most accessible and rapid routes to second citizenship in the world under National Law No. 346. Investors qualify through the Inversionista (Investor) visa or productive business venture pathway (Ley de Migraciones No. 25.871). Holding legal resident status for just 2 years qualifies the applicant to petition the Argentine Federal Court for full citizenship, granting a Tier-1 passport with visa-free access to Europe, the UK, Japan, and freedom of movement across South America.',
    benefits: [
      'World-class passport ranking with visa-free travel to 170+ countries including Schengen Area, the UK, Japan, and Singapore',
      'Fastest legal citizenship timeline in the Americas — eligible to apply for full naturalization after just 2 years',
      'Full MERCOSUR residency and free-movement rights across all South American member states',
      'Unrestricted right to live, establish businesses, and purchase real estate across Argentina',
      'Access to world-class public healthcare and top-ranked university education',
      'Dual citizenship fully recognized by Argentine federal law',
    ],
    requirements: [
      'Minimum age of 18 years with clean criminal records from country of birth and residence',
      'Commitment of productive investment or registered business capital (minimum ARS / USD equivalent typically from $50,000)',
      'Submission of an approved business plan or investment proposal validated by Argentine financial authorities',
      'Maintain continuous legal residency status for a minimum period of 2 years',
      'Demonstrate basic Spanish language proficiency and basic civic knowledge before the federal judge',
      'Proof of legitimate and verifiable source of investment capital and clean banking background',
    ],
    investments: [
      'Productive Business & Venture Capital Investment — from $50,000 registered capital into an Argentine enterprise',
      'Real Estate & Commercial Asset Acquisition — approved commercial development or hospitality ventures',
      'Capital Transfer / Central Bank registered investment bond or commercial trust',
    ],
    fees: [
      'Government migration processing & DNI fees — approx. $250 – $500 per applicant',
      'Commercial registration and notarization legal fees — approx. $2,500 – $5,000',
      'Federal court legal representation & naturalization filing fees — variable case by case',
      'Translation and legalization/Apostille fees per document',
    ],
    process: [
      'Preliminary profile review, business plan structuring, and document legalization',
      'Submission of investment proposal to Dirección Nacional de Migraciones (DNM)',
      'Approval of Investor Temporary Residence and issuance of National Identity Document (DNI)',
      'Implementation of the business investment within the national territory',
      'Fulfill 2-year continuous residency requirement',
      'File federal citizenship petition with the Argentine Federal Court (Juzgado Federal)',
      'Judicial oath of allegiance, grant of Argentine Citizenship, and passport issuance',
    ],
    documents: [
      'Valid passport with minimum 12 months validity',
      'Apostilled police clearance certificates from country of origin and any country resided in past 3 years',
      'Apostilled birth certificate and marriage certificate',
      'Approved commercial business plan / proof of investment capital transfer',
      'Proof of legal source of funds and bank reference letters',
      'Proof of Argentine residential address / domicile certificate',
    ],
  },
};

export default function CitizenshipPage() {
  const { slug } = useParams();
  const country = COUNTRIES[slug];
  const [showConsultation, setShowConsultation] = useState(false);

  // Scroll to top whenever the country changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
    <div className="country-page">
      {/* Banner */}
      <div
        className="country-banner"
        style={{ backgroundImage: `url(${country.banner})` }}
      >
        <div className="country-banner-overlay">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/">Home</Link> <span>›</span>
              <a href="/#services">Citizenship</a> <span>›</span>
              <em>{country.name}</em>
            </nav>
            <p className="country-tagline">{country.tagline}</p>
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

      {/* Quick facts — overlapping cards under the banner */}
      <div className="container facts-row">
        {[
          {
            icon: 'passport',
            label: 'Minimum Investment',
            value: country.price.replace('from ', ''),
          },
          { icon: 'clock', label: 'Processing Time', value: country.time },
          country.visaFree && {
            icon: 'globe',
            label: 'Visa-Free Countries',
            value: country.visaFree,
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
              <div>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </div>
            </div>
          ))}
      </div>

      <div className="container country-body">
        {/* LEFT — main content */}
        <div className="country-main">
        {/* Overview */}
        <section className="country-section">
          <h2>Program Overview</h2>
          <p className="lead">{country.overview}</p>
        </section>

        {/* Benefits — 2-column cards */}
        <section className="country-section">
          <h2>Key Benefits</h2>
          <div className="benefit-grid">
            {country.benefits.map((b) => (
              <div className="benefit-card" key={b}>
                <span className="benefit-check">✓</span> {b}
              </div>
            ))}
          </div>
        </section>

        {/* Requirements (optional — shows only if the country has it) */}
        {country.requirements && (
          <section className="country-section">
            <h2>Citizenship Requirements</h2>
            <div className="req-box">
              <ul className="country-list">
                {country.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Investment options — highlight cards */}
        <section className="country-section">
          <h2>Investment Options</h2>
          <div className="invest-grid">
            {country.investments.map((i) => {
              const parts = i.split(' — ');
              return (
                <div className="invest-card" key={i}>
                  <strong>{parts[0]}</strong>
                  {parts.length > 1 && <span>{parts.slice(1).join(' — ')}</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Fees (optional — shows only if the country has it) */}
        {country.fees && (
          <section className="country-section">
            <h2>Fees Schedule</h2>
            <div className="fees-table">
              {country.fees.map((f) => {
                const parts = f.split(' — ');
                return (
                  <div className="fees-row" key={f}>
                    <span>{parts[0]}</span>
                    <strong>{parts.length > 1 ? parts.slice(1).join(' — ') : '—'}</strong>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Application process — numbered timeline */}
        {country.process && (
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
        )}

        {/* Documents */}
        <section className="country-section">
          <h2>Documents Required</h2>
          <div className="req-box">
            <ul className="country-list">
              {country.documents.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA banner */}
        <div className="country-cta">
          <div>
            <h3>Ready to start your {country.name} journey?</h3>
            <p>Get a free consultation with our citizenship experts today.</p>
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

        {/* RIGHT — sticky sidebar */}
        <aside className="country-sidebar">
          <div className="side-card navy">
            <h3>Start Your Application</h3>
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
              <li>Programs across 50+ countries</li>
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

      <FAQ items={CITIZENSHIP_FAQ[slug]} />
    </div>
  );
}
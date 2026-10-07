// Per-route SEO metadata (title, description, keywords) sourced from the SEO plan.
// Keyed by the exact pathname used in App.jsx routes. Canonical URL is always
// derived as https://dreamcountryvisas.com<pathname> regardless of which
// domain (.com or .in) actually served the page, so both domains funnel
// ranking signal to the single canonical (.com) version.
const SEO_DATA = {
  '/': {
    title: 'Global Immigration Consultants | Dream Country Visas',
    description:
      'Explore global immigration, residency, citizenship and investment visa options with Dream Country Visas. Get expert guidance for your journey abroad.',
    keywords: 'Global Immigration Consultants, Immigration Consultants, Global Immigration Services',
  },
  '/about': {
    title: 'Immigration Consultants | About Dream Country Visas',
    description:
      'Learn about Dream Country Visas, our experienced immigration consultants, transparent approach and commitment to helping clients achieve global mobility goals.',
    keywords: 'Immigration Consultants, Immigration Consultancy, Trusted Immigration Consultants',
  },
  '/contact': {
    title: 'Contact Immigration Consultants | Dream Country Visas',
    description:
      'Contact Dream Country Visas for guidance on immigration, residency, citizenship, investor visas and global mobility programs. Book a consultation today.',
    keywords: 'Immigration Consultants, Immigration Consultation, Immigration Consultancy',
  },
  '/licenses': {
    title: 'Immigration Consultant Licenses & Credentials | Dream Country Visas',
    description:
      "View Dream Country Visas' professional registrations, licenses and credentials supporting our immigration and global mobility advisory services.",
    keywords: 'Immigration Consultant License, Immigration Consultant Credentials, Immigration Registration',
  },
  '/license': {
    title: 'Immigration Consultant Licenses & Credentials | Dream Country Visas',
    description:
      "View Dream Country Visas' professional registrations, licenses and credentials supporting our immigration and global mobility advisory services.",
    keywords: 'Immigration Consultant License, Immigration Consultant Credentials, Immigration Registration',
  },
  '/passport-index': {
    title: 'Global Passport Power Rank 2026 | Dream Country Visas',
    description:
      'Explore official passport power ranks, visa-free mobility scores and government citizenship & residency programs offered by Dream Country Visas.',
    keywords: 'Passport Index, Passport Power Rank, Citizenship by Investment, Visa-Free Travel, Global Mobility Score',
  },
  '/passports': {
    title: 'Global Passport Power Rank 2026 | Dream Country Visas',
    description:
      'Explore official passport power ranks, visa-free mobility scores and government citizenship & residency programs offered by Dream Country Visas.',
    keywords: 'Passport Index, Passport Power Rank, Citizenship by Investment, Visa-Free Travel, Global Mobility Score',
  },
  '/citizenship': {
    title: 'Citizenship by Investment Programs | Dream Country Visas',
    description:
      "Explore citizenship by investment programs, eligibility, investment options and family benefits with Dream Country Visas' global mobility advisors.",
    keywords: 'Citizenship by Investment, Citizenship by Investment Programs, CBI Programs, Second Citizenship',
  },
  '/citizenship/antigua-barbuda': {
    title: 'Antigua & Barbuda Citizenship by Investment',
    description:
      'Explore Antigua & Barbuda citizenship by investment, eligibility, investment options, family benefits and application requirements with expert guidance.',
    keywords:
      'Antigua & Barbuda Citizenship by Investment, Antigua Citizenship by Investment, Antigua CBI, Antigua Second Passport',
  },
  '/citizenship/st-kitts-nevis': {
    title: 'St. Kitts & Nevis Citizenship by Investment',
    description:
      'Explore St. Kitts & Nevis citizenship by investment, eligibility, investment options, family benefits and application requirements.',
    keywords: 'St Kitts & Nevis Citizenship by Investment, St Kitts Citizenship, St Kitts CBI',
  },
  '/citizenship/malta': {
    title: 'Malta Citizenship & Investment Options | Dream Country Visas',
    description:
      'Explore current Malta citizenship and residence pathways, eligibility and applicable requirements with guidance from global mobility advisors.',
    keywords: 'Malta Citizenship, Malta Immigration, Malta Residency',
  },
  '/citizenship/vanuatu': {
    title: 'Vanuatu Citizenship by Investment | Dream Country Visas',
    description:
      'Explore Vanuatu citizenship pathways, current eligibility requirements and investment-related options with guidance from global mobility advisors.',
    keywords: 'Vanuatu Citizenship by Investment, Vanuatu CBI, Vanuatu Citizenship Program',
  },
  '/citizenship/nauru': {
    title: 'Nauru Citizenship by Investment | Dream Country Visas',
    description:
      'Explore Nauru citizenship by investment, eligibility, contribution requirements and application process with guidance from global mobility advisors.',
    keywords: 'Nauru Citizenship by Investment, Nauru CBI, Nauru Investment Immigration',
  },
  '/residency': {
    title: 'Residency by Investment Programs | Dream Country Visas',
    description:
      'Explore residency by investment programs across Europe and other global destinations. Compare eligibility, investment routes and family options.',
    keywords: 'Residency by Investment, Golden Visa, Investment Residency',
  },
  '/residency/canada': {
    title: 'Canada Residency by Investment | Dream Country Visas',
    description:
      'Explore Canada residency pathways for investors, founders and qualified applicants, including eligibility, requirements and permanent residency options.',
    keywords: 'Canada Residency by Investment, Canada Startup Visa, Canada PR Pathway',
  },
  '/residency/australia': {
    title: 'Australia Residency & Investment Pathways | Dream Country Visas',
    description:
      'Explore Australian residency pathways for eligible investors, founders and highly skilled applicants, including requirements and PR options.',
    keywords: 'Australia Residency by Investment, Australia Investor Visa, Australia PR Pathway',
  },
  '/residency/new-zealand': {
    title: 'New Zealand Residency by Investment | Dream Country Visas',
    description:
      'Explore New Zealand investor residency options, eligibility, investment requirements, family benefits and pathways to permanent residence.',
    keywords: 'New Zealand Residency by Investment, New Zealand Residency, New Zealand PR',
  },
  '/residency/cyprus': {
    title: 'Cyprus Residency by Investment | Dream Country Visas',
    description:
      'Explore Cyprus residency by investment, eligibility, investment requirements, family benefits and application process with expert guidance.',
    keywords: 'Cyprus Residency by Investment, Cyprus Golden Visa, Cyprus Immigration',
  },
  '/residency/malta': {
    title: 'Malta Residency by Investment | Dream Country Visas',
    description:
      'Explore Malta permanent residency options, eligibility, investment requirements, family benefits and application process with expert guidance.',
    keywords: 'Malta Residency by Investment, Malta Golden Visa, Malta MPRP',
  },
  '/residency/portugal': {
    title: 'Portugal Residency by Investment | Dream Country Visas',
    description:
      'Explore Portugal residency by investment, eligibility, investment options, family benefits and the pathway toward long-term residence.',
    keywords: 'Portugal Residency by Investment, Portugal Golden Visa, Portugal Golden Visa Requirements',
  },
  '/residency/latvia': {
    title: 'Latvia Residency by Investment | Dream Country Visas',
    description:
      'Explore Latvia residency by investment, current eligibility, investment routes, family options and residence permit requirements.',
    keywords:
      'Latvia Residency by Investment, Latvia Golden Visa, Latvia Investor Visa, Latvia Residence Permit, Latvia Investment Immigration, Latvia Residency Program',
  },
  '/residency/italy': {
    title: 'Italy Residency by Investment | Dream Country Visas',
    description:
      'Explore Italy residency by investment, investor visa requirements, eligible investment routes and family benefits with expert guidance.',
    keywords:
      'Italy Residency by Investment, Italy Investor Visa, Italy Golden Visa, Italy Investor Visa Requirements, Italy Residency, Italy Immigration',
  },
  '/residency/spain': {
    title: 'Spain Residency & Immigration Options | Dream Country Visas',
    description:
      "Explore current Spain residency and immigration pathways, eligibility and requirements with guidance from Dream Country Visas' global mobility advisors.",
    keywords: 'Spain Residency, Spain Immigration, Spain Residence Permit',
  },
  '/realestate': {
    title: 'International Real Estate Investment | Dream Country Visas',
    description:
      'Explore international real estate investment opportunities connected with global mobility, residency programs and wealth diversification.',
    keywords: 'International Real Estate Investment, Global Real Estate Investment, Golden Visa Property',
  },
  '/realestate/dubai': {
    title: 'Dubai Real Estate Investment | Dream Country Visas',
    description:
      'Explore Dubai real estate investment opportunities, property options and potential residency benefits with guidance from global investment advisors.',
    keywords: 'Dubai Real Estate Investment, Dubai Property Investment, UAE Golden Visa Property',
  },
  '/realestate/greece': {
    title: 'Greece Real Estate Investment | Dream Country Visas',
    description:
      'Explore Greece real estate investment opportunities, property options and residency-related considerations with guidance from global mobility advisors.',
    keywords: 'Greece Real Estate Investment, Greece Property Investment, Greece Golden Visa',
  },
  '/realestate/latvia': {
    title: 'Latvia Real Estate Investment | Dream Country Visas',
    description:
      'Explore Latvia real estate investment opportunities and current residency-related options with guidance from Dream Country Visas.',
    keywords: 'Latvia Real Estate Investment, Latvia Property Investment, Latvia Golden Visa',
  },
  '/pr': {
    title: 'Permanent Residency Programs | Dream Country Visas',
    description:
      'Explore permanent residency pathways in Australia, Canada and other destinations. Compare eligibility, requirements and long-term settlement options.',
    keywords: 'Permanent Residency Programs, PR Visa, Immigration PR',
  },
  '/pr/australia': {
    title: 'Australia Permanent Residency (PR) | Dream Country Visas',
    description:
      'Explore Australia permanent residency pathways, eligibility requirements and options for skilled professionals, founders and qualified applicants.',
    keywords: 'Australia Permanent Residency, Australia PR, Australia Immigration',
  },
  '/pr/canada': {
    title: 'Canada Permanent Residency (PR) | Dream Country Visas',
    description:
      'Explore Canada permanent residency pathways, eligibility, application requirements and options for skilled professionals, families and investors.',
    keywords: 'Canada Permanent Residency, Canada PR, Canada Immigration',
  },
  '/other-services': {
    title: 'Immigration & Visa Services | Dream Country Visas',
    description:
      'Explore additional immigration and visa services from Dream Country Visas, with guidance for documentation, applications, compliance and global mobility.',
    keywords: 'Immigration Services, Visa Services, Immigration Support Services',
  },
  '/services/work-visas': {
    title: 'Work Visa & Employment Immigration Services',
    description:
      'Explore work visa and employment immigration options with guidance on eligibility, documentation and application requirements for your destination.',
    keywords: 'Work Visa, Work Permit, Employment Visa',
  },
  '/services/business-visas': {
    title: 'Business Visa Consultants | Dream Country Visas',
    description:
      'Explore business visa options for entrepreneurs, executives and business travellers, including eligibility, documentation and application guidance.',
    keywords: 'Business Visa, Business Immigration, Business Travel Visa',
  },
  '/services/study-visas': {
    title: 'Study Visa Consultants | Dream Country Visas',
    description:
      'Explore study visa options for international students, including eligibility, documentation, applications and guidance for studying abroad.',
    keywords: 'Study Visa Consultants, Student Visa, Study Abroad Visa',
  },
  '/services/investor-visas': {
    title: 'Investor Visa & Investment Immigration Services',
    description:
      'Explore investor visa and investment immigration options, including eligibility, investment requirements, family benefits and application guidance.',
    keywords: 'Investor Visa, Investment Immigration, Investment Visa',
  },
  '/services/family-spouse-visas': {
    title: 'Family & Spouse Visa Consultants | Dream Country Visas',
    description:
      'Get guidance on family and spouse visa applications, eligibility, documentation and requirements for joining family members abroad.',
    keywords: 'Family Visa, Spouse Visa, Partner Visa',
  },
  '/services/company-setup': {
    title: 'Company Setup Abroad | Business Immigration Services',
    description:
      'Explore company setup and business immigration options for entrepreneurs seeking to establish or expand businesses internationally.',
    keywords: 'Company Setup Abroad, Business Setup Abroad, Business Immigration',
  },
  '/services/digital-nomad-visas': {
    title: 'Digital Nomad Visa Consultants | Dream Country Visas',
    description:
      'Explore digital nomad visa options, eligibility, income requirements and application guidance for professionals working remotely abroad.',
    keywords: 'Digital Nomad Visa, Remote Work Visa, Digital Nomad Immigration',
  },
  '/policies/privacy-policy': {
    title: 'Privacy Policy | Dream Country Visas',
    description:
      'Read the Dream Country Visas privacy policy to understand how we collect, use, protect and manage personal information.',
    keywords: 'Dream Country Visas Privacy Policy, Data Protection, Website Privacy',
  },
  '/policies/terms-of-service': {
    title: 'Terms of Service | Dream Country Visas',
    description:
      'Review the terms and conditions governing use of the Dream Country Visas website, services, consultations and related information.',
    keywords: 'Dream Country Visas Terms of Service, Terms and Conditions, Immigration Consultancy Terms',
  },
  '/policies/refund-policy': {
    title: 'Refund Policy | Dream Country Visas',
    description:
      'Review the Dream Country Visas refund policy, including applicable terms, eligibility, service conditions and refund procedures.',
    keywords: 'Dream Country Visas Refund Policy, Refund Terms, Consultation Refund Policy',
  },
};

export default SEO_DATA;

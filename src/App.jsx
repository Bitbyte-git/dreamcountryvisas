import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Destinations from './components/Destinations.jsx';
import Services from './components/Services.jsx';
import Properties from './components/Properties.jsx';
import SuccessStory from './components/success_story.jsx';
import About from './components/About.jsx';
import Testimonials from './components/Testimonials.jsx';
import Team from './components/Team.jsx';
import FAQ from './components/FAQ.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CountryPage from './Citizenship/CitizenshipPage.jsx';
import CitizenshipOverview from './Citizenship/CitizenshipOverview.jsx';
import ResidencyPage from './Residency/ResidencyPage.jsx';
import RealEstatePage from './Real Estate/RealEstatePage.jsx';
import OtherservicePage from './OtherService/OtherservicePage.jsx';
import PRPage from './PR/PR_page.jsx';
import ConsultationModal from './components/ConsultationModal.jsx';
import PolicyPage from "./components/PolicyPage.jsx";
import ContactPage from './components/ContactPage.jsx';
import LicensePage from './components/LicensePage.jsx';
import PROverview from './PR/PROverview.jsx';
import RealEstateOverview from './Real Estate/RealEstateOverview.jsx';
import ResidencyOverview from './Residency/ResidencyOverview.jsx';
import OtherServiceOverview from './OtherService/OtherServiceOverview.jsx';
import LoginPage from './components/LoginPage.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AdminNavbar from './components/AdminNavbar.jsx';
import ChatBot from './components/ChatBot.jsx';


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Human-readable label from a URL slug, e.g. "united-arab-emirates" -> "United Arab Emirates"
function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const STATIC_PAGE_TITLES = {
  '/': 'Home',
  '/about': 'About Us',
  '/citizenship': 'Citizenship by Investment',
  '/residency': 'Residency by Investment',
  '/realestate': 'Real Estate Investment',
  '/other-services': 'Other Services',
  '/pr': 'Permanent Residency (PR)',
  '/licenses': 'Licenses & Accreditations',
  '/license': 'Licenses & Accreditations',
  '/contact': 'Contact Us',
  '/login': 'Admin Login',
  '/admin': 'Admin Dashboard',
};

const DYNAMIC_PAGE_PREFIXES = [
  { prefix: '/citizenship/', suffix: ' Citizenship by Investment' },
  { prefix: '/residency/', suffix: ' Residency' },
  { prefix: '/realestate/', suffix: ' Real Estate' },
  { prefix: '/pr/', suffix: ' PR' },
  { prefix: '/services/', suffix: '' },
  { prefix: '/policies/', suffix: '' },
];

function pageTitleForPath(pathname) {
  if (STATIC_PAGE_TITLES[pathname]) return STATIC_PAGE_TITLES[pathname];

  for (const { prefix, suffix } of DYNAMIC_PAGE_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      const slug = pathname.slice(prefix.length).replace(/\/$/, '');
      if (slug) return `${titleFromSlug(slug)}${suffix}`;
    }
  }
  return null;
}

// Keeps the browser tab title in sync with the current route.
function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pageTitleForPath(pathname);
    document.title = page ? `${page} | Dream Country Visas` : 'Dream Country Visas';
  }, [pathname]);

  return null;
}

// /login and /admin get their own minimal navbar and no footer —
// the rest of the site keeps the full marketing Navbar + Footer.
function Chrome({ children }) {
  const { pathname } = useLocation();
  const isAdminArea = pathname === '/login' || pathname.startsWith('/admin');

  return (
    <>
      {isAdminArea ? <AdminNavbar /> : <Navbar />}
      {children}
      {!isAdminArea && <Footer />}
      {!isAdminArea && <ChatBot />}
    </>
  );
}

function Home() {
  const [showAutoPopup, setShowAutoPopup] = useState(false);

  // Auto-open the consultation popup 7 seconds after landing on the
  // home page. Only runs once per visit to this page.
  useEffect(() => {
    const timer = setTimeout(() => setShowAutoPopup(true), 7000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <main>
      <Hero />
      <Destinations />
      <Services />
      <Properties />
      <SuccessStory />
      <Testimonials />
            <Team />
            <FAQ />
      <Contact />
      <ConsultationModal
        open={showAutoPopup}
        onClose={() => setShowAutoPopup(false)}
      />
    </main>
  );
}

export default function App() {
  return (
        <BrowserRouter>
      <ScrollToTop />
      <PageTitle />
      <Chrome>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/citizenship/:slug" element={<CountryPage />} />
          <Route path="/citizenship" element={<CitizenshipOverview />} />
          <Route path="/residency/:slug" element={<ResidencyPage />} />
          <Route path="/residency" element={<ResidencyOverview />} />
          <Route path="/realestate/:slug" element={<RealEstatePage />} />
          <Route path="/realestate" element={<RealEstateOverview />} />
          <Route path="/services/:slug" element={<OtherservicePage />} />
          <Route path="/other-services" element={<OtherServiceOverview />} />
          <Route path="/pr/:slug" element={<PRPage />} />
          <Route path="/pr" element={<PROverview />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="/licenses" element={<LicensePage />} />
          <Route path="/license" element={<LicensePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Chrome>
    </BrowserRouter>
  );
}
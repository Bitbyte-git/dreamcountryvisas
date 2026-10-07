import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  NAV_LINKS_LEFT,
  NAV_LINKS_RIGHT,
  CONTACT,
  CITIZENSHIP_MENU,
  REALESTATE_MENU,
  RESIDENCY_MENU,
  PR_MENU,
  OTHERSERVICES_MENU,
} from '../data.js';
import { Icon } from './Icons.jsx';
import MegaMenu from './MegaMenu.jsx';
import ConsultationModal from './ConsultationModal.jsx';
import LanguageSelector from './LanguageSelector.jsx';

// Map nav label -> mega menu data
const MENUS = {
  Citizenship: CITIZENSHIP_MENU,
  Residency: RESIDENCY_MENU,
  'Real Estate': REALESTATE_MENU,
  'Permanent Residency (PR)': PR_MENU,
  'Other Service': OTHERSERVICES_MENU,
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showConsultation, setShowConsultation] = useState(false);

  // Smoothly scroll to a section when already on the home page,
  // instead of relying on a plain hash-link (which jumps instantly).
  const handleHashClick = (href) => (e) => {
    setOpen(false);
    setOpenMenu(null);
    if (href.startsWith('/#') && window.location.pathname === '/') {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Closes the mobile menu + any open mega-menu — called whenever a
  // real navigation happens (clicking the label or any submenu item).
  const closeMenus = () => {
    setOpen(false);
    setOpenMenu(null);
  };

  // Shared renderer — plain links (Home, About Us, Media, Contact Us)
  // render as-is; links with a matching entry in MENUS get the hover
  // mega-menu attached and also navigate straight to the overview page.
  const renderLinks = (links) =>
    links.map((link) => {
      const isHashLink = link.href.startsWith('/#');
      const hasMenu = !!MENUS[link.label];

      return (
        <div
          className="nav-item"
          key={link.label}
          onMouseEnter={() => hasMenu && setOpenMenu(link.label)}
          onMouseLeave={() => hasMenu && setOpenMenu(null)}
        >
          {isHashLink ? (
            <a href={link.href} onClick={handleHashClick(link.href)}>
              {link.label}
              {link.dropdown && (
                <span
                  className="nav-chevron"
                  onClick={(e) => {
                    if (window.innerWidth <= 1024) {
                      e.preventDefault();
                      setOpenMenu(openMenu === link.label ? null : link.label);
                    }
                  }}
                >
                  <Icon name="chevron-down" size={11} />
                </span>
              )}
            </a>
          ) : (
            <Link to={link.href} onClick={closeMenus}>
              {link.label}
              {link.dropdown && (
                <span
                  className="nav-chevron"
                  onClick={(e) => {
                    if (window.innerWidth <= 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenu(openMenu === link.label ? null : link.label);
                    }
                  }}
                >
                  <Icon name="chevron-down" size={11} />
                </span>
              )}
            </Link>
          )}
          {hasMenu && (
            <MegaMenu
              data={MENUS[link.label]}
              overviewLink={link.href}
              open={openMenu === link.label}
              onNavigate={closeMenus}
            />
          )}
        </div>
      );
    });

  return (
    <header className="navbar">
      <div className="navbar-topbar">
        <div className="container navbar-topbar-inner">
          <span className="topbar-link topbar-callback">
            <Icon name="phone" size={13} /> Request a Callback
          </span>
          <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} className="topbar-link">
            <Icon name="phone" size={13} /> {CONTACT.phone}
          </a>
          <Link to="/passport-index" className="topbar-link topbar-passport-cta" title="Global Passport Power Rank 2026">
            <span className="topbar-passport-pill">
              <Icon name="passport" size={13} /> Passport Index
            </span>
          </Link>
          <Link to="/contact" className="topbar-link topbar-offices">
            <Icon name="globe" size={13} /> Our Offices
          </Link>
          <LanguageSelector />
          <Link to="/login" className="topbar-link topbar-login">
            <Icon name="lock" size={13} /> Login
          </Link>
        </div>
      </div>
      <div className="container navbar-inner">
        {/* Desktop — left of logo */}
        <nav className="nav-links">{renderLinks(NAV_LINKS_LEFT)}</nav>

        <a href="/" className="brand">
          <img src="/landing-img/DC-log.webp" alt="Dream Country Visas" />
        </a>

        {/* Desktop — right of logo */}
        <div className="nav-right">
          <nav className="nav-links-right">
            {renderLinks(NAV_LINKS_RIGHT)}
          </nav>

          <div className="nav-icons">

            <a
              href={CONTACT.whatsapp}
              className="nav-circle whatsapp"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <Icon name="whatsapp" size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/31293454/"
              className="nav-circle linkedin"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" size={16} />
            </a>
                       <button
              type="button"
              className="btn btn-primary nav-consult-btn"
              onClick={() => setShowConsultation(true)}
            >
              Book Consultation
            </button>
          </div>
        </div>

        {/* Mobile — combined hamburger panel (left + right items together) */}
        <nav className={`nav-links-mobile ${open ? 'open' : ''}`}>
          <div className="nav-item mobile-passport-menu-item">
            <Link
              to="/passport-index"
              onClick={closeMenus}
              className="mobile-passport-menu-link"
            >
              <span className="mobile-passport-title">
                <Icon name="passport" size={17} /> Passport Power Index
              </span>
              <span className="mobile-passport-badge">Rank 2026</span>
            </Link>
          </div>
          {renderLinks([...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT])}
        </nav>

        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </header>
  );
}
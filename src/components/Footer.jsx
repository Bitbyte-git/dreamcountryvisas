import { Link } from 'react-router-dom';
import {
  FOOTER,
  CONTACT,
  CITIZENSHIP_MENU,
  RESIDENCY_MENU,
  REALESTATE_MENU,
  PR_MENU,
} from '../data.js';
import { Icon } from './Icons.jsx';

// Flattens a mega-menu's groups into a simple {name, link} list for the
// footer columns, so it stays in sync with data.js automatically.
function flattenMenu(menu) {
  return menu.groups.flatMap((g) => g.items);
}

export default function Footer() {
  return (
    <footer className="footer footer-navy">
      <div className="footer-map-bg" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/landing-img/DC-log.webp" alt="Dream Country Visas" />
          <p className="footer-about-text">{FOOTER.about}</p>
          <div className="footer-socials">
            <a href="https://www.linkedin.com/company/31293454/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={15} /></a>
            <a href="#" aria-label="Facebook"><Icon name="facebook" size={15} /></a>
            <a href="#" aria-label="Instagram"><Icon name="instagram" size={15} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          {/* Column A: Residency & PR */}
          <div className="footer-links-col">
            <div className="footer-col footer-col-residency">
              <h5>Residency</h5>
              <ul>
                {flattenMenu(RESIDENCY_MENU).map((item) => (
                  <li key={item.link}>
                    <Link to={item.link}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col footer-col-pr">
              <h5>Permanent Residency (PR)</h5>
              <ul>
                {flattenMenu(PR_MENU).map((item) => (
                  <li key={item.link}>
                    <Link to={item.link}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column B: Citizenship & Real Estate */}
          <div className="footer-links-col">
            <div className="footer-col footer-col-citizenship">
              <h5>Citizenship</h5>
              <ul>
                {flattenMenu(CITIZENSHIP_MENU).map((item) => (
                  <li key={item.link}>
                    <Link to={item.link}>{item.name}</Link>
                  </li>
                ))}
                <li className="footer-licenses-item">
                  <Link to="/licenses" className="footer-licenses-link">
                    Licenses &amp; Accreditations
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-col footer-col-realestate">
              <h5>Real Estate</h5>
              <ul>
                {flattenMenu(REALESTATE_MENU).map((item) => (
                  <li key={item.link}>
                    <Link to={item.link}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-col footer-contact-col">
          <h5>Contact Info</h5>
          <ul className="footer-contact">
            <li><Icon name="phone" size={13} /> {CONTACT.phone}</li>
            <li><Icon name="mail" size={13} /> {CONTACT.email}</li>
            <li><Icon name="clock" size={13} /> {CONTACT.hours}</li>
            {CONTACT.offices.map((office) => (
              <li key={office.label}>
                <Icon name="pin" size={13} />
                <span><strong>{office.label}:</strong> {office.address}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-disclaimer-wrap">
          <p className="footer-disclaimer">
            Information made available on this website in any form is for
            information purposes only. It is not, and should not be taken as
            advice. You should not rely on, or take or fail to take any
            action based upon this information. Please do not disregard
            professional advice or delay in seeking advice because of
            something you have read on this website. Dream Country Visas
            professionals will be pleased to discuss any specific questions
            you have.
          </p>
        </div>
        <div className="container footer-bottom-inner">
          <p className="copyright footer-bottom-copyright">{FOOTER.copyright}</p>
          <Link to="/licenses" className="footer-company-number" title="View Official Licenses & Accreditations">{FOOTER.companyNumber}</Link>
          <div className="footer-legal-links">
            <Link to="/policies/privacy-policy">Privacy Policy</Link>
            <span>|</span>
            <Link to="/policies/terms-of-service">Terms and Conditions</Link>
            <span>|</span>
            <Link to="/policies/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
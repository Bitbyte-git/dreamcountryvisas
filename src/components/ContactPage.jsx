import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import ThankYouModal from '../components/ThankYouModal.jsx';
import CustomSelect from '../components/CustomSelect.jsx';
import {
  CONTACT,
  CONTACT_FEATURES,
  COUNTRY_DIAL_CODES,
  ALL_COUNTRIES_LIST,
  CITIZENSHIP_MENU,
  RESIDENCY_MENU,
  REALESTATE_MENU,
  PR_MENU,
  OTHERSERVICES_MENU,
  CONTACT_FAQ_ITEMS,
} from '../data.js';
import FAQ from '../components/FAQ.jsx';
import {
  validateForm,
  sanitizePhoneInput,
  submitContactForm,
  isValidPhone,
  isValidEmail,
  getPhoneSpecForCode,
} from '../utils/formValidation.js';

// Builds the "Program of interest" dropdown from every service category —
// same list used in the Consultation Modal.
function buildProgramOptions() {
  const list = [];
  CITIZENSHIP_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(`Citizenship of ${i.name}`))
  );
  RESIDENCY_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(`Residence in ${i.name}`))
  );
  REALESTATE_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(`Real Estate Investment — ${i.name}`))
  );
  PR_MENU.groups.forEach((g) => g.items.forEach((i) => list.push(i.name)));
  OTHERSERVICES_MENU.groups.forEach((g) =>
    g.items.forEach((i) => list.push(i.name))
  );
  return list;
}

const PROGRAM_OPTIONS = buildProgramOptions();

const COUNTRY_OPTIONS = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'United Arab Emirates', 'Germany', 'France', 'Italy', 'Spain',
  'Portugal', 'Malta', 'Cyprus', 'Latvia', 'Greece', 'Singapore',
  'New Zealand', 'South Africa', 'Nigeria', 'Saudi Arabia', 'Qatar',
  'Kuwait', 'Bahrain', 'Oman', 'Bangladesh', 'Pakistan', 'Sri Lanka',
  'Nepal', 'Philippines', 'Malaysia', 'Indonesia', 'China', 'Japan',
  'South Korea', 'Brazil', 'Mexico', 'Netherlands', 'Switzerland',
  'Sweden', 'Ireland', 'Poland', 'Turkey', 'Egypt', 'Kenya',
  'Other',
];

const ENGLISH_LEVELS = ['Competitive', 'Proficient', 'Superior'];

// Programs that require the extra "English Level" question.
const PR_PROGRAMS_NEEDING_ENGLISH = ['Australia PR', 'Canada PR'];

const EMPTY_FORM = {
  program: '',
  englishLevel: '',
  salutation: '',
  firstName: '',
  lastName: '',
  phoneCode: '+91',
  phone: '',
  email: '',
  nationality: '',
  residence: '',
  updates: false,
};

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const needsEnglishLevel = PR_PROGRAMS_NEEDING_ENGLISH.includes(form.program);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue =
      name === 'phone'
        ? sanitizePhoneInput(value, form.phoneCode)
        : type === 'checkbox'
        ? checked
        : value;

    setForm((prev) => {
      const next = { ...prev, [name]: finalValue };
      if (name === 'program' && !PR_PROGRAMS_NEEDING_ENGLISH.includes(finalValue)) {
        next.englishLevel = '';
      }
      if (name === 'phoneCode' && prev.phone) {
        next.phone = sanitizePhoneInput(prev.phone, finalValue);
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        if (name === 'phone' || name === 'phoneCode') {
          const currentCode = name === 'phoneCode' ? finalValue : prev.phoneCode;
          const currentPhone = name === 'phone' ? finalValue : prev.phone;
          if (isValidPhone(currentPhone, currentCode)) delete next.phone;
        } else if (name === 'email') {
          if (isValidEmail(finalValue)) delete next.email;
        } else if (finalValue) {
          delete next[name];
        }
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === 'phone') {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, phone: 'Please enter your phone number.' }));
      } else if (!isValidPhone(value, form.phoneCode)) {
        setErrors((prev) => ({ ...prev, phone: 'Please enter a valid phone number.' }));
      }
    } else if (name === 'email') {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, email: 'Please enter your e-mail address.' }));
      } else if (!isValidEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address.',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(form, needsEnglishLevel);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const allTouched = {};
      Object.keys(validation.errors).forEach((k) => (allTouched[k] = true));
      setTouched((prev) => ({ ...prev, ...allTouched }));
      return;
    }

    setIsSubmitting(true);
    await submitContactForm(form);
    setIsSubmitting(false);

    setSubmittedData({ ...form });
    setShowThankYou(true);
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="contact-page-premium">
      {/* Hero banner — dark navy, same style as country pages */}
      <div
        className="country-banner"
        style={{ backgroundImage: `url('/landing-img/contact-hero-bg.webp')` }}
      >
        <div className="country-banner-overlay">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/">Home</Link> <span>›</span>
              <em>Contact Us</em>
            </nav>
            <p className="country-tagline">GET IN TOUCH</p>
            <h1>Let's Start Your Journey Together</h1>
            <div className="country-meta">
              <span>
                <Icon name="phone" size={14} /> {CONTACT.phone}
              </span>
              <span>
                <Icon name="mail" size={14} /> {CONTACT.email}
              </span>
              <span>
                <Icon name="clock" size={14} /> {CONTACT.hours}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping quick-contact cards */}
      <div className="container facts-row">
        <a href={`tel:${CONTACT.phone}`} className="fact-card">
          <span className="fact-icon">
            <Icon name="phone" size={20} />
          </span>
          <div>
            <strong>Call Us</strong>
            <span>{CONTACT.phone}</span>
          </div>
        </a>
        <a href={`mailto:${CONTACT.email}`} className="fact-card">
          <span className="fact-icon">
            <Icon name="mail" size={20} />
          </span>
          <div>
            <strong>Email Us</strong>
            <span>{CONTACT.email}</span>
          </div>
        </a>
        
         <a href={CONTACT.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="fact-card"
        >
          <span className="fact-icon">
            <Icon name="whatsapp" size={20} />
          </span>
          <div>
            <strong>WhatsApp</strong>
            <span>Chat instantly</span>
          </div>
        </a>
        <div className="fact-card">
          <span className="fact-icon">
            <Icon name="clock" size={20} />
          </span>
          <div>
            <strong>Working Hours</strong>
            <span>{CONTACT.hours}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="section">
        <div className="container contact-premium-grid">
          {/* LEFT — offices + features */}
          <div className="contact-premium-left">
            <p className="section-tag left">OUR OFFICES</p>
            <h2>Visit Us in Person</h2>
            <p className="contact-premium-intro">
              Prefer a face-to-face conversation? Drop by either of our
              offices — our team is ready to walk you through your options.
            </p>

            <div className="office-cards">
              {CONTACT.offices.map((office) => (
                
                 <a href={office.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="office-card"
                  key={office.label}
                >
                  <span className="office-card-icon">
                    <Icon name="pin" size={20} />
                  </span>
                  <div>
                    <strong>{office.label}</strong>
                    <p>{office.address}</p>
                    <span className="office-card-link">
                      Get Directions <Icon name="arrow" size={12} />
                    </span>
                  </div>
                </a>
              ))}
            </div>

                       <div className="contact-premium-features">
              {CONTACT_FEATURES.map((f) => (
                <div className="feature" key={f.title}>
                  <span className="feature-icon">
                    <Icon name={f.icon} size={18} />
                  </span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-trust-strip">
              <div>
                <strong>25+</strong>
                <span>Years Experience</span>
              </div>
              <div>
                <strong>9,000+</strong>
                <span>Happy Clients</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Countries Covered</span>
              </div>
            </div>
          </div>

          {/* RIGHT — elevated form card */}
          <div className="contact-premium-form-wrap">
            <div className="contact-form-wide contact-premium-form">
              <span className="contact-premium-badge">
                <Icon name="mail" size={14} /> QUICK RESPONSE
              </span>
              <h3 className="contact-form-heading">Send Us a Message</h3>
              <p className="contact-premium-form-sub">
                Fill in the form below and our team will get back to you
                within 24 hours.
              </p>

                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className={`form-group ${errors.program ? 'has-error' : ''}`}>
                  <label className="field-label">Program of interest*</label>
                  <CustomSelect
                    name="program"
                    value={form.program}
                    onChange={update}
                    options={PROGRAM_OPTIONS}
                    placeholder="Please select program"
                    required
                  />
                  {errors.program && <span className="field-error-msg">{errors.program}</span>}
                </div>

                {needsEnglishLevel && (
                  <div className={`form-group ${errors.englishLevel ? 'has-error' : ''}`}>
                    <label className="field-label">What is your English level?*</label>
                    <CustomSelect
                      name="englishLevel"
                      value={form.englishLevel}
                      onChange={update}
                      options={ENGLISH_LEVELS}
                      placeholder="Please select English level"
                      required
                    />
                    {errors.englishLevel && (
                      <span className="field-error-msg">{errors.englishLevel}</span>
                    )}
                  </div>
                )}

                <div className="form-row-3">
                  <div className={`form-group col-salutation ${errors.salutation ? 'has-error' : ''}`}>
                    <label className="field-label">Salutation*</label>
                    <CustomSelect
                      name="salutation"
                      value={form.salutation}
                      onChange={update}
                      options={['Mr.', 'Ms.', 'Mrs.', 'Dr.']}
                      placeholder="Select"
                      required
                    />
                    {errors.salutation && (
                      <span className="field-error-msg">{errors.salutation}</span>
                    )}
                  </div>
                  <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                    <label className="field-label">First name*</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={update}
                      className={errors.firstName ? 'input-error' : ''}
                      required
                    />
                    {errors.firstName && (
                      <span className="field-error-msg">{errors.firstName}</span>
                    )}
                  </div>
                  <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                    <label className="field-label">Last name*</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={update}
                      className={errors.lastName ? 'input-error' : ''}
                      required
                    />
                    {errors.lastName && (
                      <span className="field-error-msg">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                    <label className="field-label">Phone Number*</label>
                    <div className="phone-input-group">
                      <CustomSelect
                        name="phoneCode"
                        value={form.phoneCode}
                        onChange={update}
                        options={COUNTRY_DIAL_CODES}
                        isPhoneCode={true}
                        placeholder="+91"
                        ariaLabel="Country Dial Code"
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        placeholder={getPhoneSpecForCode(form.phoneCode).placeholder}
                        maxLength={getPhoneSpecForCode(form.phoneCode).max}
                        value={form.phone}
                        onChange={update}
                        onBlur={handleBlur}
                        className={`phone-number-input ${errors.phone ? 'input-error' : ''}`}
                        required
                      />
                    </div>
                    {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                  </div>
                  <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label className="field-label">E-mail address*</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={update}
                      onBlur={handleBlur}
                      className={errors.email ? 'input-error' : ''}
                      required
                    />
                    {errors.email && <span className="field-error-msg">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className={`form-group ${errors.nationality ? 'has-error' : ''}`}>
                    <label className="field-label">Nationality*</label>
                    <CustomSelect
                      name="nationality"
                      value={form.nationality}
                      onChange={update}
                      options={ALL_COUNTRIES_LIST}
                      placeholder="Select nationality"
                      required
                    />
                    {errors.nationality && (
                      <span className="field-error-msg">{errors.nationality}</span>
                    )}
                  </div>
                  <div className={`form-group ${errors.residence ? 'has-error' : ''}`}>
                    <label className="field-label">Country of Residence*</label>
                    <CustomSelect
                      name="residence"
                      value={form.residence}
                      onChange={update}
                      options={ALL_COUNTRIES_LIST}
                      placeholder="Select residence"
                      required
                    />
                    {errors.residence && (
                      <span className="field-error-msg">{errors.residence}</span>
                    )}
                  </div>
                </div>

                  <label className="contact-checkbox">
                    <input
                      type="checkbox"
                      name="updates"
                      checked={form.updates}
                      onChange={update}
                    />
                    <span>
                      Please keep me updated and send me information and
                      news about Dream Country Visas, event invitations,
                      and publications via e-mail.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="btn btn-primary full form-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Submit'}
                  </button>
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="section">
        <div className="container">
          <div className="country-cta">
            <div>
              <h3>Prefer to talk right away?</h3>
              <p>Book a free consultation call with our expert team today.</p>
            </div>
            <div className="cta-buttons">
              <a href={CONTACT.whatsapp}
                className="btn btn-light"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={16} /> Chat on WhatsApp
              </a>
              <Link to="/" className="btn btn-ghost">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={CONTACT_FAQ_ITEMS} />

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        data={submittedData || {}}
      />
    </div>
  );
}
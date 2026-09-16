import { useState } from 'react';
import {
  CONTACT,
  COUNTRY_DIAL_CODES,
  ALL_COUNTRIES_LIST,
  CITIZENSHIP_MENU,
  RESIDENCY_MENU,
  REALESTATE_MENU,
  PR_MENU,
  OTHERSERVICES_MENU,
} from '../data.js';
import { Icon } from './Icons.jsx';
import ThankYouModal from './ThankYouModal.jsx';
import CustomSelect from './CustomSelect.jsx';
import {
  validateForm,
  sanitizePhoneInput,
  submitContactForm,
  isValidPhone,
  isValidEmail,
} from '../utils/formValidation.js';

// Builds the "Program of interest" dropdown from every service category,
// so it always stays in sync with data.js without manual duplication.
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

// Programs that require the extra "English Level" question.
const PR_PROGRAMS_NEEDING_ENGLISH = ['Australia PR', 'Canada PR'];

const ENGLISH_LEVELS = ['Competitive', 'Proficient', 'Superior'];

const INITIAL = {
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

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const needsEnglishLevel = PR_PROGRAMS_NEEDING_ENGLISH.includes(form.program);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue =
      name === 'phone'
        ? sanitizePhoneInput(value)
        : type === 'checkbox'
        ? checked
        : value;

    setForm((prev) => {
      const next = { ...prev, [name]: finalValue };
      if (name === 'program' && !PR_PROGRAMS_NEEDING_ENGLISH.includes(finalValue)) {
        next.englishLevel = '';
      }
      return next;
    });

    // Clear error dynamically as the user corrects it
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
    // Send form data to SendGrid backend API
    await submitContactForm(form);
    setIsSubmitting(false);

    setSubmittedData({ ...form });
    setShowThankYou(true);
    setForm(INITIAL);
    setErrors({});
    setTouched({});
  };

  return (
    <section className="section contact" id="contact">
      <div className="container contact-box contact-box-wide">
        <div className="contact-intro">
          <p className="section-tag left">CONTACT US</p>
          <h2>
            We&rsquo;re Here to Help You
            <br />
            Every Step of the Way
          </h2>
          <p>
            Speak to a certified consultant today. We guarantee full
            confidentiality and a response within 24 hours.
          </p>

          <ul className="contact-list">
            <li>
              <Icon name="phone" size={16} />{' '}
              <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a>
            </li>
            <li>
              <Icon name="mail" size={16} />{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <Icon name="clock" size={16} /> {CONTACT.hours}
            </li>
            {(CONTACT.offices || []).map((office) => (
              <li key={office.label}>
                <Icon name="pin" size={14} />{' '}
                <a href={office.mapLink} target="_blank" rel="noreferrer">
                  <strong>{office.label}:</strong> {office.address}
                </a>
              </li>
            ))}
          </ul>


          <div className="socials">
            <a href="https://www.linkedin.com/company/31293454/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={15} /></a>
            <a href="#" aria-label="Facebook"><Icon name="facebook" size={15} /></a>
            <a href="#" aria-label="Instagram"><Icon name="instagram" size={15} /></a>
            <a href="#" aria-label="YouTube"><Icon name="youtube" size={15} /></a>
          </div>

          <div className="mara-badge">
            <img src="/landing-img/MARA.webp" alt="MARA Registered" />
            <span>MARN 0100178</span>
          </div>
        </div>

        <form className="contact-form contact-form-wide" onSubmit={handleSubmit} noValidate>
          <h3 className="contact-form-heading">Contact Information</h3>

          <div className={`form-group ${errors.program ? 'has-error' : ''}`}>
            <label className="field-label">Program of interest*</label>
            <CustomSelect
              name="program"
              value={form.program}
              onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
                  options={COUNTRY_DIAL_CODES}
                  isPhoneCode={true}
                  placeholder="+91"
                  ariaLabel="Country Dial Code"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="81234 56789"
                  value={form.phone}
                  onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              onChange={handleChange}
            />
            <span>
              Please keep me updated and send me information and news about
              Dream Country Visas, event invitations, and publications via
              e-mail.
            </span>
          </label>

          <button
            type="submit"
            className="btn btn-primary form-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Request...' : 'Submit'}
          </button>
        </form>
      </div>

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        data={submittedData || {}}
      />
    </section>
  );
}
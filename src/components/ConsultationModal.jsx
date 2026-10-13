import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CITIZENSHIP_MENU,
  RESIDENCY_MENU,
  REALESTATE_MENU,
  PR_MENU,
  OTHERSERVICES_MENU,
  COUNTRY_DIAL_CODES,
  ALL_COUNTRIES_LIST,
} from '../data.js';
import ThankYouModal from './ThankYouModal.jsx';
import CustomSelect from './CustomSelect.jsx';
import {
  validateForm,
  sanitizePhoneInput,
  submitContactForm,
  isValidPhone,
  isValidEmail,
  getPhoneSpecForCode,
} from '../utils/formValidation.js';

// Builds the "Program of interest" dropdown from every service category.
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

const PR_PROGRAMS_NEEDING_ENGLISH = ['Australia PR', 'Canada PR'];

const ENGLISH_LEVELS = ['Competitive', 'Proficient', 'Superior'];

const EMPTY_MAIN_FORM = {
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

// ---------------------------------------------------------------
// Single consultation modal — the "Book Consultation" popup.
// Shows an extra "English Level" question only when the selected
// program is Australia PR or Canada PR.
// ---------------------------------------------------------------
export default function ConsultationModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_MAIN_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!open && !showThankYou) return null;

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
      // Reset englishLevel if the person switches away from a PR program
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
    setForm(EMPTY_MAIN_FORM);
    setErrors({});
    setTouched({});
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-title-row">
          <h3>Book Your Consultation</h3>
        </div>
        <p className="modal-sub">
          Tell us a bit about what you're looking for and our experts will
          reach out to you.
        </p>

        <form className="contact-form modal-form" onSubmit={handleSubmit} noValidate>
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
              Please keep me updated and send me information and news about
              Dream Country Visas via e-mail.
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

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => {
          setShowThankYou(false);
          onClose();
        }}
        data={submittedData || {}}
      />
    </div>,
    document.body
  );
}
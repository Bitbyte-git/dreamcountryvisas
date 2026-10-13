// Form validation and submission helpers for Dream Country Visas

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Known disposable and placeholder email domains to reject
const FAKE_EMAIL_DOMAINS = new Set([
  'example.com',
  'test.com',
  'test.org',
  'sample.com',
  'fake.com',
  'dummy.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
]);

/**
 * Checks for obvious dummy, repetitive, or sequential phone patterns
 */
function isDummyPhoneNumber(digits) {
  // All same digit e.g. 0000000000, 1111111111, 8888888888, 9999999999
  if (/^(\d)\1+$/.test(digits)) return true;

  // 5 or more repeated consecutive identical digits e.g. 88888
  if (/(\d)\1{4,}/.test(digits)) return true;

  // Repetitive 2-digit patterns e.g. 1212121212, 9898989898
  if (/^(\d{2})\1{3,}$/.test(digits)) return true;

  // Common sequential dummy numbers
  const sequentialPatterns = [
    '1234567890',
    '0123456789',
    '9876543210',
    '0987654321',
    '12345678',
    '87654321',
    '123456789',
    '987654321',
  ];
  if (sequentialPatterns.includes(digits)) return true;

  return false;
}

export const COUNTRY_PHONE_SPECS = {
  '+91': { min: 10, max: 10, label: '10 digits (India)', placeholder: 'e.g. 98765 43210 (10 digits)' },
  '+1': { min: 10, max: 10, label: '10 digits (US/Canada)', placeholder: 'e.g. 202 555 0199 (10 digits)' },
  '+971': { min: 9, max: 9, label: '9 digits (UAE)', placeholder: 'e.g. 50 123 4567 (9 digits)' },
  '+44': { min: 10, max: 13, label: '10-13 digits (UK)', placeholder: 'e.g. 7911 123456 (10-13 digits)' },
  '+61': { min: 9, max: 9, label: '9 digits (Australia)', placeholder: 'e.g. 412 345 678 (9 digits)' },
  '+49': { min: 10, max: 12, label: '10-12 digits (Germany)', placeholder: 'e.g. 151 23456789 (10-12 digits)' },
  '+81': { min: 10, max: 11, label: '10-11 digits (Japan)', placeholder: 'e.g. 90 1234 5678 (10-11 digits)' },
  '+64': { min: 8, max: 10, label: '8-10 digits (New Zealand)', placeholder: 'e.g. 21 123 4567 (8-10 digits)' },
  '+27': { min: 9, max: 10, label: '9-10 digits (South Africa)', placeholder: 'e.g. 82 123 4567 (9-10 digits)' },
  '+65': { min: 8, max: 8, label: '8 digits (Singapore)', placeholder: 'e.g. 8123 4567 (8 digits)' },
  '+60': { min: 9, max: 10, label: '9-10 digits (Malaysia)', placeholder: 'e.g. 12 345 6789' },
  '+966': { min: 9, max: 9, label: '9 digits (Saudi Arabia)', placeholder: 'e.g. 50 123 4567' },
  '+974': { min: 8, max: 8, label: '8 digits (Qatar)', placeholder: 'e.g. 3312 3456' },
  '+33': { min: 9, max: 9, label: '9 digits (France)', placeholder: 'e.g. 6 12 34 56 78' },
  '+39': { min: 9, max: 10, label: '9-10 digits (Italy)', placeholder: 'e.g. 312 345 6789' },
  '+34': { min: 9, max: 9, label: '9 digits (Spain)', placeholder: 'e.g. 612 345 678' },
  '+351': { min: 9, max: 9, label: '9 digits (Portugal)', placeholder: 'e.g. 912 345 678' },
  '+30': { min: 10, max: 10, label: '10 digits (Greece)', placeholder: 'e.g. 691 234 5678' },
  '+357': { min: 8, max: 8, label: '8 digits (Cyprus)', placeholder: 'e.g. 96 123456' },
  '+356': { min: 8, max: 8, label: '8 digits (Malta)', placeholder: 'e.g. 7912 3456' },
  '+90': { min: 10, max: 10, label: '10 digits (Turkey)', placeholder: 'e.g. 532 123 4567' },
  '+86': { min: 11, max: 11, label: '11 digits (China)', placeholder: 'e.g. 138 1234 5678' },
};

export function getPhoneSpecForCode(phoneCode) {
  const code = String(phoneCode || '+91').trim();
  return (
    COUNTRY_PHONE_SPECS[code] || {
      min: 7,
      max: 13,
      label: '7-13 digits',
      placeholder: 'e.g. 9876543210',
    }
  );
}

/**
 * Returns specific validation error message if phone is invalid.
 */
export function getPhoneValidationError(phone, phoneCode = '+91') {
  if (!phone || !String(phone).trim()) {
    return 'Please enter your mobile phone number.';
  }
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) {
    return 'Please enter numbers only for your mobile phone.';
  }
  if (isDummyPhoneNumber(digits)) {
    return 'Please enter a genuine, non-repeating phone number.';
  }
  const spec = getPhoneSpecForCode(phoneCode);
  if (digits.length < spec.min) {
    return `Phone number for ${phoneCode} requires at least ${spec.min} digits. (Entered ${digits.length})`;
  }
  if (digits.length > spec.max) {
    return `Phone number for ${phoneCode} cannot exceed ${spec.max} digits. (Entered ${digits.length})`;
  }
  const code = String(phoneCode).trim();
  if (code === '+91' && !/^[6-9]\d{9}$/.test(digits)) {
    return 'Valid Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.';
  }
  if (code === '+1' && !/^[2-9]\d{9}$/.test(digits)) {
    return 'Valid US/Canadian numbers must be 10 digits starting with 2-9.';
  }
  return '';
}

/**
 * Validates a telephone number with country-specific rules
 */
export function isValidPhone(phone, phoneCode = '+91') {
  return getPhoneValidationError(phone, phoneCode) === '';
}

/**
 * Validates an email address and rejects disposable/fake domains.
 */
export function isValidEmail(email) {
  if (!email) return false;
  const trimmed = String(email).trim().toLowerCase();
  if (!EMAIL_REGEX.test(trimmed)) return false;

  const domain = trimmed.split('@')[1];
  if (FAKE_EMAIL_DOMAINS.has(domain)) return false;

  return true;
}

/**
 * Sanitizes phone input in real time to only allow digits up to country max digits.
 */
export function sanitizePhoneInput(val, phoneCode = '+91') {
  const digits = String(val || '').replace(/\D/g, '');
  const spec = getPhoneSpecForCode(phoneCode);
  return digits.slice(0, spec.max);
}

/**
 * Validates the entire consultation / contact form.
 * Returns { isValid: boolean, errors: Record<string, string> }
 */
export function validateForm(form, needsEnglishLevel = false) {
  const errors = {};

  if (!form.program || !form.program.trim()) {
    errors.program = 'Please select a program of interest.';
  }

  if (needsEnglishLevel && (!form.englishLevel || !form.englishLevel.trim())) {
    errors.englishLevel = 'Please select your English proficiency level.';
  }

  if (!form.salutation || !form.salutation.trim()) {
    errors.salutation = 'Please select a salutation.';
  }

  if (!form.firstName || !form.firstName.trim()) {
    errors.firstName = 'Please enter your first name.';
  }

  if (!form.lastName || !form.lastName.trim()) {
    errors.lastName = 'Please enter your last name.';
  }

  if (!form.phone || !form.phone.trim()) {
    errors.phone = 'Please enter your phone number.';
  } else {
    const phoneErr = getPhoneValidationError(form.phone, form.phoneCode);
    if (phoneErr) {
      errors.phone = phoneErr;
    }
  }

  if (!form.email || !form.email.trim()) {
    errors.email = 'Please enter your e-mail address.';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!form.nationality || !form.nationality.trim()) {
    errors.nationality = 'Please select your nationality.';
  }

  if (!form.residence || !form.residence.trim()) {
    errors.residence = 'Please select your country of residence.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submits form data to the backend API endpoint (/api/contact).
 * Returns { success: boolean, error?: string }
 */
export async function submitContactForm(formData) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({ ok: true }));
      return { success: true, data: json };
    } else {
      const errJson = await res.json().catch(() => ({}));
      console.warn('API submission failed:', errJson);
      return { success: false, error: errJson.error || `Server responded with ${res.status}` };
    }
  } catch (err) {
    console.warn('Network / API error:', err);
    return { success: false, error: err.message || 'Network error' };
  }
}

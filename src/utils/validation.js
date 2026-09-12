const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\p{L}\p{M} .'-]+$/u;
const COMMON_PASSWORDS = new Set([
  '123456', '12345678', '123456789', '1234567890',
  'password', 'password1', 'password123', 'qwerty', 'qwerty123',
  'abcdef', 'abcdefgh', 'letmein', 'welcome', 'admin', 'admin123'
]);

export function validateEmail(email) {
  const value = email.trim();

  if (!value) return { valid: false, error: 'Email is required' };
  if (value.length > 254) return { valid: false, error: 'Email is too long' };
  if (!EMAIL_REGEX.test(value)) return { valid: false, error: 'Enter a valid email' };

  return { valid: true, error: '' };
}

export function getPasswordRequirements(password) {
  const value = password || '';
  const byteLength = new TextEncoder().encode(value).length;

  return [
    { label: '8+ characters', valid: value.length >= 8 },
    { label: '1 letter', valid: /[A-Za-z]/.test(value) },
    { label: '1 number', valid: /\d/.test(value) },
    { label: '1 symbol', valid: /[\p{P}\p{S}]/u.test(value) },
    { label: '72 bytes max', valid: byteLength <= 72 },
    { label: 'Not common', valid: !COMMON_PASSWORDS.has(value.toLowerCase()) },
  ];
}

// Used for SIGNUP only. Existing passwords are not judged by these rules during login.
export function validateSignupPassword(password) {
  if (!password) return { valid: false, error: 'Password is required' };

  const requirements = getPasswordRequirements(password);
  const failed = requirements.find((requirement) => !requirement.valid);

  if (failed) return { valid: false, error: failed.label };
  if (/^(.)\1+$/.test(password)) return { valid: false, error: 'Avoid repeated characters' };

  return { valid: true, error: '' };
}

// Login only checks that the user actually entered a password.
// It must NOT enforce signup-era password requirements on existing accounts.
export function validateLoginPassword(password) {
  if (!password) return { valid: false, error: 'Password is required' };
  return { valid: true, error: '' };
}

export function validatePassword(password) {
  return validateSignupPassword(password);
}

export function validateName(name) {
  const value = name.trim();

  if (!value) return { valid: false, error: 'Name is required' };
  if (value.length < 2) return { valid: false, error: 'Name is too short' };
  if (value.length > 80) return { valid: false, error: 'Name is too long' };
  if (!NAME_REGEX.test(value)) return { valid: false, error: 'Use letters and common name punctuation' };
  if (value.split(/\s+/).length > 6) return { valid: false, error: 'Name is too long' };

  return { valid: true, error: '' };
}

export function validateLoginForm(email, password) {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;

  const passwordValidation = validateLoginPassword(password);
  if (!passwordValidation.valid) return passwordValidation;

  return { valid: true, error: '' };
}

export function validateSignupForm(name, email, password) {
  const nameValidation = validateName(name);
  if (!nameValidation.valid) return nameValidation;

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;

  const passwordValidation = validateSignupPassword(password);
  if (!passwordValidation.valid) return passwordValidation;

  return { valid: true, error: '' };
}
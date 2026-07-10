// ========== EMAIL VALIDATION ==========
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true, error: '' };
}

// ========== PASSWORD VALIDATION ==========
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  
  return { valid: true, error: '' };
}

// ========== NAME VALIDATION ==========
export function validateName(name) {
  if (!name.trim()) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  return { valid: true, error: '' };
}

// ========== VALIDATE LOGIN FORM ==========
export function validateLoginForm(email, password) {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }
  
  return { valid: true, error: '' };
}

// ========== VALIDATE SIGNUP FORM ==========
export function validateSignupForm(name, email, password) {
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }
  
  return { valid: true, error: '' };
}
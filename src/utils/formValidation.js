// ============================================================================
// FORM VALIDATION UTILITY FOR MARKETING FORMS
// ============================================================================

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // Standard RFC 5322 compliant regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Allow international formatting (+, spaces, dashes, parentheses), min 7 digits
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return cleaned.length >= 7 && /^\+?[0-9]+$/.test(cleaned);
};

export const validateRequired = (val) => {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  return true;
};

/**
 * Validates Request Demo Form
 * Fields: fullName, clinicName, workEmail, phoneNumber, city, numberOfDoctors, preferredContactMethod, message
 */
export const validateDemoForm = (data) => {
  const errors = {};

  if (!validateRequired(data.fullName)) {
    errors.fullName = 'Full Name is required.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter a valid full name.';
  }

  if (!validateRequired(data.clinicName)) {
    errors.clinicName = 'Clinic or Practice Name is required.';
  }

  if (!validateRequired(data.workEmail)) {
    errors.workEmail = 'Work Email is required.';
  } else if (!validateEmail(data.workEmail)) {
    errors.workEmail = 'Please enter a valid email address (e.g. doctor@clinic.com).';
  }

  if (!validateRequired(data.phoneNumber)) {
    errors.phoneNumber = 'Phone Number is required for demo scheduling.';
  } else if (!validatePhone(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number with area code.';
  }

  if (!validateRequired(data.city)) {
    errors.city = 'City / Location is required.';
  }

  if (!validateRequired(data.numberOfDoctors)) {
    errors.numberOfDoctors = 'Please select the number of consulting doctors.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates Contact Form
 * Fields: name, email, phone, subject, message
 */
export const validateContactForm = (data) => {
  const errors = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Your name is required.';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email address is required.';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!validateRequired(data.subject)) {
    errors.subject = 'Subject is required.';
  }

  if (!validateRequired(data.message)) {
    errors.message = 'Please provide a message or inquiry details.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

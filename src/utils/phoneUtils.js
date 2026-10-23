/**
 * phoneUtils.js
 * Standard phone formatting, normalization, and validation utilities.
 * Default standard: Pakistan (+92) with format: +92 333 4199233 (exactly 10 digits after +92, first digit !== 0).
 */

export const COUNTRY_CODES = [
  { code: 'PK', dialCode: '+92', name: 'Pakistan', flag: '🇵🇰', digits: 10, placeholder: '333 4199233' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪', digits: 9, placeholder: '50 123 4567' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦', digits: 9, placeholder: '50 123 4567' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧', digits: 10, placeholder: '7911 123456' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸', digits: 10, placeholder: '202 555 0123' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦', digits: 10, placeholder: '416 555 0123' },
  { code: 'QA', dialCode: '+974', name: 'Qatar', flag: '🇶🇦', digits: 8, placeholder: '3312 3456' },
  { code: 'OM', dialCode: '+968', name: 'Oman', flag: '🇴🇲', digits: 8, placeholder: '9123 4567' },
  { code: 'KW', dialCode: '+965', name: 'Kuwait', flag: '🇰🇼', digits: 8, placeholder: '9123 4567' },
  { code: 'BH', dialCode: '+973', name: 'Bahrain', flag: '🇧🇭', digits: 8, placeholder: '3612 3456' },
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳', digits: 10, placeholder: '98765 43210' },
  { code: 'BD', dialCode: '+880', name: 'Bangladesh', flag: '🇧🇩', digits: 10, placeholder: '1712 345678' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺', digits: 9, placeholder: '412 345 678' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪', digits: 10, placeholder: '151 23456789' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷', digits: 9, placeholder: '612 345 678' },
];

/**
 * Finds country metadata by dialCode or code. Defaults to Pakistan (+92).
 */
export function getCountryByDialCode(dialCode) {
  if (!dialCode) return COUNTRY_CODES[0];
  const cleaned = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return COUNTRY_CODES.find((c) => c.dialCode === cleaned) || COUNTRY_CODES[0];
}

/**
 * Clean raw digits by stripping non-numeric characters.
 */
export function cleanDigits(str) {
  return String(str || '').replace(/\D/g, '');
}

/**
 * Parses any phone string into its country and national digits.
 * Automatically handles:
 * - "+92 333 4199233"
 * - "03334199233" (auto-rejects leading 0 for Pakistan)
 * - "+9203334199233" (auto-rejects leading 0 after +92)
 * - "3334199233"
 */
export function parsePhoneNumber(rawInput, preferredDialCode = '+92') {
  if (!rawInput) {
    const defaultCountry = getCountryByDialCode(preferredDialCode);
    return {
      country: defaultCountry,
      dialCode: defaultCountry.dialCode,
      nationalDigits: '',
      formatted: '',
      isValid: false,
    };
  }

  const str = String(rawInput).trim();
  let matchedCountry = null;

  // Try matching dial code at the beginning
  for (const c of COUNTRY_CODES) {
    if (str.startsWith(c.dialCode)) {
      matchedCountry = c;
      break;
    }
  }

  // If no dial code at beginning, check if preferred country
  if (!matchedCountry) {
    matchedCountry = getCountryByDialCode(preferredDialCode);
  }

  let rest = str;
  if (str.startsWith(matchedCountry.dialCode)) {
    rest = str.slice(matchedCountry.dialCode.length);
  }

  // Extract only digits from remaining string
  let nationalDigits = cleanDigits(rest);

  // Pakistan-specific rule:
  // The first digit after +92 must not be 0.
  // If the user enters 0 after +92 (or enters 0333...), automatically reject/remove it!
  if (matchedCountry.dialCode === '+92') {
    while (nationalDigits.startsWith('0')) {
      nationalDigits = nationalDigits.slice(1);
    }
    // Limit to exactly 10 digits maximum
    if (nationalDigits.length > 10) {
      nationalDigits = nationalDigits.slice(0, 10);
    }
  } else {
    // Other countries limit to their max digits
    if (nationalDigits.length > matchedCountry.digits) {
      nationalDigits = nationalDigits.slice(0, matchedCountry.digits);
    }
  }

  const formattedNational = formatNationalDigits(nationalDigits, matchedCountry.dialCode);
  const formattedFull = nationalDigits ? `${matchedCountry.dialCode} ${formattedNational}` : '';

  const maxDigits = matchedCountry.digits;
  const isValid = nationalDigits.length === maxDigits && (matchedCountry.dialCode !== '+92' || !nationalDigits.startsWith('0'));

  return {
    country: matchedCountry,
    dialCode: matchedCountry.dialCode,
    nationalDigits,
    formattedNational,
    formatted: formattedFull,
    isValid,
  };
}

/**
 * Formats national digits according to country convention.
 * For Pakistan (+92): "333 4199233" (3 digits, space, 7 digits).
 */
export function formatNationalDigits(digits, dialCode = '+92') {
  const clean = cleanDigits(digits);
  if (!clean) return '';

  if (dialCode === '+92') {
    // Exactly 10 digits: 3 + 7
    if (clean.length <= 3) {
      return clean;
    }
    return `${clean.slice(0, 3)} ${clean.slice(3, 10)}`;
  }

  if (dialCode === '+1') {
    // USA/Canada: 3 + 3 + 4
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 10)}`;
  }

  // Default grouping: 3 + 3 + remainder
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
}

/**
 * Normalizes any Pakistani phone number string to: +92 333 4199233
 */
export function normalizePakistaniPhone(raw) {
  if (!raw) return '';
  const parsed = parsePhoneNumber(raw, '+92');
  if (parsed.dialCode === '+92' && parsed.nationalDigits) {
    return parsed.formatted;
  }
  return raw;
}

/**
 * Validates a phone number value.
 * @param {string} value - Phone string, e.g. "+92 333 4199233"
 * @param {boolean} required - Whether phone is mandatory
 * @param {string} dialCode - Expected country dial code (default '+92')
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validatePhoneNumber(value, required = true, dialCode = '+92') {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    if (required) {
      return { isValid: false, error: 'Phone number is required.' };
    }
    return { isValid: true, error: null };
  }

  const parsed = parsePhoneNumber(trimmed, dialCode);
  const targetCountry = parsed.country;

  if (targetCountry.dialCode === '+92') {
    if (parsed.nationalDigits.length === 0) {
      return { isValid: !required, error: required ? 'Phone number is required.' : null };
    }
    if (parsed.nationalDigits.startsWith('0')) {
      return { isValid: false, error: 'Phone number cannot start with 0 after +92.' };
    }
    if (parsed.nationalDigits.length < 10) {
      return {
        isValid: false,
        error: `Incomplete number: exactly 10 digits required (${parsed.nationalDigits.length}/10 entered). Example: +92 333 4199233`,
      };
    }
    if (parsed.nationalDigits.length === 10) {
      return { isValid: true, error: null };
    }
    return { isValid: false, error: 'Phone number cannot exceed 10 digits after +92.' };
  }

  // For other countries:
  if (parsed.nationalDigits.length < targetCountry.digits) {
    return {
      isValid: false,
      error: `Incomplete number: ${targetCountry.digits} digits required for ${targetCountry.name} (${parsed.nationalDigits.length}/${targetCountry.digits} entered).`,
    };
  }

  return { isValid: true, error: null };
}

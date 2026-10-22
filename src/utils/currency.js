/**
 * Currency utility functions for MedPulse Clinic ERP
 * Standardized currency: PKR (Rs.)
 */

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }
  const num = Number(amount);
  return 'Rs. ' + num.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const parseCurrencyInput = (value) => {
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

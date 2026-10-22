import { format, parseISO, isValid, isToday, isSameDay } from 'date-fns';

export const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  if (!dateString) return '—';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isValid(date) ? format(date, formatStr) : dateString;
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '—';
  // If timeString is HH:mm
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return timeString;
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '—';
  try {
    const date = typeof dateTimeString === 'string' ? parseISO(dateTimeString) : dateTimeString;
    return isValid(date) ? format(date, 'dd MMM yyyy, hh:mm a') : dateTimeString;
  } catch {
    return dateTimeString;
  }
};

export const getTodayISOString = () => {
  return new Date().toISOString().split('T')[0];
};

export const isDateToday = (dateString) => {
  if (!dateString) return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isValid(date) ? isToday(date) : false;
  } catch {
    return false;
  }
};

export { isToday, isSameDay };

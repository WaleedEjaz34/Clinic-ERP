// LocalStorage persistence keys for MedPulse Website CMS
export const CMS_STORAGE_KEYS = {
  SETTINGS: 'medpulse_cms_settings_v1',
  HOMEPAGE_SECTIONS: 'medpulse_cms_homepage_sections_v1',
  PAGES: 'medpulse_cms_pages_v1',
  SERVICES: 'medpulse_cms_services_v1',
  DOCTOR_PROFILES: 'medpulse_cms_doctor_profiles_v1',
  APPOINTMENT_CONTACT: 'medpulse_cms_appointment_contact_v1',
  GALLERY: 'medpulse_cms_gallery_v1',
  TESTIMONIALS: 'medpulse_cms_testimonials_v1',
  BLOG_POSTS: 'medpulse_cms_blog_posts_v1',
  FAQS: 'medpulse_cms_faqs_v1',
  SEO: 'medpulse_cms_seo_v1',
  NAVIGATION: 'medpulse_cms_navigation_v1',
  MEDIA: 'medpulse_cms_media_v1',
  THEME: 'medpulse_cms_theme_v1',
};

export const loadCMSState = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    console.warn(`[CMS Storage] Failed to load key "${key}" from localStorage:`, error);
    return fallback;
  }
};

export const saveCMSState = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`[CMS Storage] Failed to save key "${key}" to localStorage:`, error);
  }
};

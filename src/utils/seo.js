import { useEffect } from 'react';

/**
 * Custom hook to update document title, meta description, and OpenGraph tags dynamically.
 * @param {Object} options
 * @param {string} options.title - Page title (will be suffixed with " — MedPulse Clinic ERP")
 * @param {string} options.description - Meta description
 * @param {string} [options.ogTitle] - Optional OpenGraph title
 * @param {string} [options.ogDescription] - Optional OpenGraph description
 */
export const useMarketingSEO = ({ title, description, ogTitle, ogDescription } = {}) => {
  useEffect(() => {
    // 1. Set Document Title
    const brandSuffix = 'MedPulse Clinic ERP';
    if (title) {
      document.title = title.includes(brandSuffix) ? title : `${title} — ${brandSuffix}`;
    } else {
      document.title = 'MedPulse Clinic ERP — One Platform for Smarter Clinic Management';
    }

    // 2. Set or create Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const defaultDesc =
      'MedPulse Clinic ERP is a clinic management software platform to manage patients, appointments, digital prescriptions, billing, payments, and clinic expenses in one organized workspace.';
    metaDesc.setAttribute('content', description || defaultDesc);

    // 3. Set OpenGraph Meta tags
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', ogTitle || title || 'MedPulse Clinic ERP');

    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescTag) {
      ogDescTag = document.createElement('meta');
      ogDescTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescTag);
    }
    ogDescTag.setAttribute('content', ogDescription || description || defaultDesc);

    // 4. Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [title, description, ogTitle, ogDescription]);
};

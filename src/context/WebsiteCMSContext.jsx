import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialCMSSettings,
  initialCMSHomepageSections,
  initialCMSPages,
  initialCMSServices,
  initialCMSDoctorProfiles,
  initialCMSAppointmentContact,
  initialCMSGallery,
  initialCMSTestimonials,
  initialCMSBlogPosts,
  initialCMSFAQs,
  initialCMSSEO,
  initialCMSNavigation,
  initialCMSMedia,
  initialCMSTheme,
  THEME_PRESETS,
} from '../data/cmsMockData';
import { CMS_STORAGE_KEYS, loadCMSState, saveCMSState } from '../utils/cmsStorage';
import { useClinic } from './ClinicContext';

const WebsiteCMSContext = createContext(null);

export const WebsiteCMSProvider = ({ children }) => {
  const { addToast, doctors: erpDoctors = [] } = useClinic() || {};

  // 1. General Website Settings
  const [settings, setSettings] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.SETTINGS, initialCMSSettings)
  );

  // 2. Homepage Sections Configuration
  const [homepageSections, setHomepageSections] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.HOMEPAGE_SECTIONS, initialCMSHomepageSections)
  );

  // 3. Pages Management
  const [pages, setPages] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.PAGES, initialCMSPages)
  );

  // 4. Services
  const [services, setServices] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.SERVICES, initialCMSServices)
  );

  // 5. Public Doctor Profiles
  const [doctorProfiles, setDoctorProfiles] = useState(() => {
    const saved = loadCMSState(CMS_STORAGE_KEYS.DOCTOR_PROFILES, initialCMSDoctorProfiles);
    // Sync any newly added ERP doctors that don't have a CMS profile yet
    if (erpDoctors && erpDoctors.length > 0) {
      const existingIds = new Set(saved.map((d) => d.doctorId));
      const missingProfiles = erpDoctors
        .filter((d) => !existingIds.has(d.id))
        .map((d, idx) => ({
          doctorId: d.id,
          publicDisplayName: d.name,
          publicBio: d.bio || `${d.name} is a consultant specialist at MedPulse Clinic.`,
          publicQualifications: d.qualifications || 'MBBS',
          specialization: d.specialization,
          yearsOfExperience: 8,
          languagesSpoken: ['English', 'Urdu'],
          displayOrder: saved.length + idx + 1,
          featuredDoctor: false,
          showOnWebsite: true,
          opdDays: 'Consultation by Appointment',
        }));
      return [...saved, ...missingProfiles];
    }
    return saved;
  });

  // 6. Appointment & Contact Settings
  const [appointmentContact, setAppointmentContact] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.APPOINTMENT_CONTACT, initialCMSAppointmentContact)
  );

  // 7. Gallery
  const [gallery, setGallery] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.GALLERY, initialCMSGallery)
  );

  // 8. Testimonials
  const [testimonials, setTestimonials] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.TESTIMONIALS, initialCMSTestimonials)
  );

  // 9. Blog Posts
  const [blogPosts, setBlogPosts] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.BLOG_POSTS, initialCMSBlogPosts)
  );

  // 10. FAQs
  const [faqs, setFaqs] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.FAQS, initialCMSFAQs)
  );

  // 11. SEO Configuration
  const [seo, setSeo] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.SEO, initialCMSSEO)
  );

  // 12. Navigation Menu
  const [navigation, setNavigation] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.NAVIGATION, initialCMSNavigation)
  );

  // 13. Media Library
  const [media, setMedia] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.MEDIA, initialCMSMedia)
  );

  // 14. Theme & Appearance
  const [theme, setTheme] = useState(() =>
    loadCMSState(CMS_STORAGE_KEYS.THEME, initialCMSTheme)
  );

  // 15. Shared Public Preview Control State
  const [previewViewport, setPreviewViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [showDraftsInPreview, setShowDraftsInPreview] = useState(true);
  const [activePreviewPage, setActivePreviewPage] = useState('home');

  // Shared Media Picker State
  const [mediaPickerState, setMediaPickerState] = useState({
    isOpen: false,
    onSelect: null,
    title: 'Select Media',
  });

  // Save changes to LocalStorage on state modifications
  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.HOMEPAGE_SECTIONS, homepageSections);
  }, [homepageSections]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.PAGES, pages);
  }, [pages]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.DOCTOR_PROFILES, doctorProfiles);
  }, [doctorProfiles]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.APPOINTMENT_CONTACT, appointmentContact);
  }, [appointmentContact]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.GALLERY, gallery);
  }, [gallery]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.TESTIMONIALS, testimonials);
  }, [testimonials]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.BLOG_POSTS, blogPosts);
  }, [blogPosts]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.FAQS, faqs);
  }, [faqs]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.SEO, seo);
  }, [seo]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.NAVIGATION, navigation);
  }, [navigation]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.MEDIA, media);
  }, [media]);

  useEffect(() => {
    saveCMSState(CMS_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Safe toast helper
  const notify = (type, title, message) => {
    if (addToast) {
      addToast(type, title, message);
    }
  };

  // =========================================================
  // CRUD ACTIONS
  // =========================================================

  // 1. Settings Actions
  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    notify('success', 'Website Settings Saved', 'General clinic website information updated.');
  };

  const resetSettings = () => {
    setSettings(initialCMSSettings);
    notify('info', 'Settings Reset', 'Website information restored to defaults.');
  };

  // 2. Homepage Sections Actions
  const updateHomepageSection = (sectionId, updates) => {
    setHomepageSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, ...updates } : sec))
    );
    notify('success', 'Section Updated', 'Homepage section configuration saved.');
  };

  const toggleSectionVisibility = (sectionId) => {
    setHomepageSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec
      )
    );
  };

  const moveSection = (sectionId, direction) => {
    setHomepageSections((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((s) => s.id === sectionId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === sorted.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const current = sorted[index];
      const target = sorted[targetIndex];

      const currentOrder = current.order;
      current.order = target.order;
      target.order = currentOrder;

      return [...sorted].sort((a, b) => a.order - b.order);
    });
  };

  const resetHomepageSections = () => {
    setHomepageSections(initialCMSHomepageSections);
    notify('info', 'Sections Reset', 'Homepage layout restored to default structure.');
  };

  // 3. Pages Actions
  const addPage = (newPage) => {
    const slug = (newPage.slug || newPage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    const pageWithId = {
      ...newPage,
      id: `page-${Date.now()}`,
      slug,
      lastUpdated: new Date().toISOString().split('T')[0],
      blocks: newPage.blocks || [
        { id: 'b-init-1', type: 'heading', level: 1, content: newPage.title },
        { id: 'b-init-2', type: 'paragraph', content: 'Enter your page content here.' },
      ],
    };
    setPages((prev) => [pageWithId, ...prev]);
    notify('success', 'Page Created', `Page "${newPage.title}" has been created.`);
    return pageWithId;
  };

  const updatePage = (pageId, updates) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    notify('success', 'Page Saved', 'Page modifications have been saved.');
  };

  const duplicatePage = (pageId) => {
    const target = pages.find((p) => p.id === pageId);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `page-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setPages((prev) => [duplicated, ...prev]);
    notify('success', 'Page Duplicated', `Duplicate created as "${duplicated.title}".`);
  };

  const deletePage = (pageId) => {
    const target = pages.find((p) => p.id === pageId);
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    notify('info', 'Page Deleted', `Page "${target?.title || pageId}" was removed.`);
  };

  const setPageStatus = (pageId, status) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, status } : p))
    );
    notify('success', 'Status Changed', `Page status set to ${status}.`);
  };

  // 4. Services Actions
  const addService = (newSrv) => {
    const slug = (newSrv.slug || newSrv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    const serviceWithId = {
      ...newSrv,
      id: `srv-${Date.now()}`,
      slug,
      displayOrder: services.length + 1,
      status: newSrv.status || 'Active',
      featuredOnHomepage: newSrv.featuredOnHomepage !== undefined ? newSrv.featuredOnHomepage : true,
    };
    setServices((prev) => [...prev, serviceWithId]);
    notify('success', 'Service Added', `Service "${newSrv.name}" created.`);
    return serviceWithId;
  };

  const updateService = (srvId, updates) => {
    setServices((prev) =>
      prev.map((s) => (s.id === srvId ? { ...s, ...updates } : s))
    );
    notify('success', 'Service Updated', 'Medical service details updated.');
  };

  const duplicateService = (srvId) => {
    const target = services.find((s) => s.id === srvId);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `srv-${Date.now()}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy`,
      displayOrder: services.length + 1,
    };
    setServices((prev) => [...prev, duplicated]);
    notify('success', 'Service Duplicated', `Duplicate created as "${duplicated.name}".`);
  };

  const deleteService = (srvId) => {
    const target = services.find((s) => s.id === srvId);
    setServices((prev) => prev.filter((s) => s.id !== srvId));
    notify('info', 'Service Removed', `Service "${target?.name || srvId}" was deleted.`);
  };

  const toggleServiceStatus = (srvId) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === srvId ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
      )
    );
  };

  const toggleServiceHomepage = (srvId) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === srvId ? { ...s, featuredOnHomepage: !s.featuredOnHomepage } : s
      )
    );
  };

  // 5. Public Doctor Profiles Actions
  const updateDoctorProfile = (doctorId, updates) => {
    setDoctorProfiles((prev) =>
      prev.map((doc) =>
        doc.doctorId === doctorId ? { ...doc, ...updates } : doc
      )
    );
    notify('success', 'Doctor Profile Updated', 'Public doctor website details saved.');
  };

  const toggleDoctorWebsiteVisibility = (doctorId) => {
    setDoctorProfiles((prev) =>
      prev.map((doc) =>
        doc.doctorId === doctorId ? { ...doc, showOnWebsite: !doc.showOnWebsite } : doc
      )
    );
  };

  const toggleDoctorFeatured = (doctorId) => {
    setDoctorProfiles((prev) =>
      prev.map((doc) =>
        doc.doctorId === doctorId ? { ...doc, featuredDoctor: !doc.featuredDoctor } : doc
      )
    );
  };

  // Combined doctors: merges ERP doctors with CMS public profile customization
  const publicDoctors = useMemo(() => {
    return doctorProfiles.map((cmsProfile) => {
      const erpDoc = erpDoctors.find((d) => d.id === cmsProfile.doctorId) || {};
      return {
        ...erpDoc,
        ...cmsProfile,
        id: cmsProfile.doctorId,
        name: cmsProfile.publicDisplayName || erpDoc.name,
        specialization: cmsProfile.specialization || erpDoc.specialization,
        avatar: erpDoc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        phone: erpDoc.phone,
        email: erpDoc.email,
        consultationFee: erpDoc.consultationFee,
        qualifications: cmsProfile.publicQualifications || erpDoc.qualifications,
        bio: cmsProfile.publicBio || erpDoc.bio,
      };
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [doctorProfiles, erpDoctors]);

  // 6. Appointment & Contact Settings Actions
  const updateAppointmentContact = (updates) => {
    setAppointmentContact((prev) => ({ ...prev, ...updates }));
    notify('success', 'Booking & Contact Settings Saved', 'Public booking text and contact settings updated.');
  };

  // 7. Gallery Actions
  const addGalleryItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `gal-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      visible: newItem.visible !== undefined ? newItem.visible : true,
    };
    setGallery((prev) => [itemWithId, ...prev]);
    notify('success', 'Image Added to Gallery', `"${newItem.title}" added to facility gallery.`);
  };

  const updateGalleryItem = (id, updates) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    notify('success', 'Gallery Item Updated', 'Image details saved.');
  };

  const deleteGalleryItem = (id) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
    notify('info', 'Image Removed', 'Gallery item deleted.');
  };

  const toggleGalleryVisibility = (id) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  // 8. Testimonials Actions
  const addTestimonial = (newTest) => {
    const testWithId = {
      ...newTest,
      id: `t-${Date.now()}`,
      displayDate: newTest.displayDate || new Date().toISOString().split('T')[0],
      status: newTest.status || 'Published',
      featured: newTest.featured || false,
      rating: Number(newTest.rating) || 5,
    };
    setTestimonials((prev) => [testWithId, ...prev]);
    notify('success', 'Testimonial Added', `Review by "${newTest.patientDisplayName}" recorded.`);
  };

  const updateTestimonial = (id, updates) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    notify('success', 'Testimonial Updated', 'Review details updated.');
  };

  const deleteTestimonial = (id) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    notify('info', 'Testimonial Deleted', 'Review removed from CMS.');
  };

  const toggleTestimonialFeatured = (id) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t))
    );
  };

  const toggleTestimonialStatus = (id) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Published' ? 'Draft' : 'Published' }
          : t
      )
    );
  };

  // 9. Blog Actions
  const addBlogPost = (newPost) => {
    const slug = (newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    const postWithId = {
      ...newPost,
      id: `post-${Date.now()}`,
      slug,
      publishDate: newPost.publishDate || new Date().toISOString().split('T')[0],
      status: newPost.status || 'Published',
      tags: Array.isArray(newPost.tags) ? newPost.tags : (newPost.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    };
    setBlogPosts((prev) => [postWithId, ...prev]);
    notify('success', 'Article Created', `Post "${newPost.title}" created.`);
    return postWithId;
  };

  const updateBlogPost = (id, updates) => {
    setBlogPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              tags: Array.isArray(updates.tags)
                ? updates.tags
                : updates.tags !== undefined
                ? (updates.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
                : p.tags,
            }
          : p
      )
    );
    notify('success', 'Article Saved', 'Health article changes saved.');
  };

  const duplicateBlogPost = (id) => {
    const target = blogPosts.find((p) => p.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `post-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      status: 'Draft',
      publishDate: new Date().toISOString().split('T')[0],
    };
    setBlogPosts((prev) => [duplicated, ...prev]);
    notify('success', 'Article Duplicated', `Duplicate created as "${duplicated.title}".`);
  };

  const deleteBlogPost = (id) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    notify('info', 'Article Deleted', 'Blog article removed.');
  };

  const setBlogPostStatus = (id, status) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    notify('success', 'Status Changed', `Article status set to ${status}.`);
  };

  // 10. FAQ Actions
  const addFAQ = (newFaq) => {
    const faqWithId = {
      ...newFaq,
      id: `faq-${Date.now()}`,
      displayOrder: faqs.length + 1,
      showOnHomepage: newFaq.showOnHomepage !== undefined ? newFaq.showOnHomepage : true,
      status: newFaq.status || 'Active',
    };
    setFaqs((prev) => [...prev, faqWithId]);
    notify('success', 'FAQ Added', 'New FAQ question created.');
  };

  const updateFAQ = (id, updates) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    notify('success', 'FAQ Updated', 'Question details updated.');
  };

  const deleteFAQ = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    notify('info', 'FAQ Deleted', 'Question removed.');
  };

  const moveFAQ = (id, direction) => {
    setFaqs((prev) => {
      const sorted = [...prev].sort((a, b) => a.displayOrder - b.displayOrder);
      const index = sorted.findIndex((f) => f.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === sorted.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const current = sorted[index];
      const target = sorted[targetIndex];

      const currentOrder = current.displayOrder;
      current.displayOrder = target.displayOrder;
      target.displayOrder = currentOrder;

      return [...sorted].sort((a, b) => a.displayOrder - b.displayOrder);
    });
  };

  const toggleFAQHomepage = (id) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, showOnHomepage: !f.showOnHomepage } : f))
    );
  };

  const toggleFAQStatus = (id) => {
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' }
          : f
      )
    );
  };

  // 11. SEO Actions
  const updateSEO = (updates) => {
    setSeo((prev) => ({ ...prev, ...updates }));
    notify('success', 'SEO Settings Saved', 'Website global metadata updated.');
  };

  // 12. Navigation Actions
  const addNavItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `nav-${Date.now()}`,
      order: navigation.length + 1,
      enabled: newItem.enabled !== undefined ? newItem.enabled : true,
      target: newItem.target || '_self',
    };
    setNavigation((prev) => [...prev, itemWithId]);
    notify('success', 'Menu Item Added', `"${newItem.label}" added to navigation.`);
  };

  const updateNavItem = (id, updates) => {
    setNavigation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    notify('success', 'Menu Item Updated', 'Navigation item changes saved.');
  };

  const deleteNavItem = (id) => {
    setNavigation((prev) => prev.filter((item) => item.id !== id));
    notify('info', 'Menu Item Deleted', 'Navigation item removed.');
  };

  const moveNavItem = (id, direction) => {
    setNavigation((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((n) => n.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === sorted.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const current = sorted[index];
      const target = sorted[targetIndex];

      const currentOrder = current.order;
      current.order = target.order;
      target.order = currentOrder;

      return [...sorted].sort((a, b) => a.order - b.order);
    });
  };

  const toggleNavItem = (id) => {
    setNavigation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  // 13. Media Library Actions
  const addMediaItem = (newMedia) => {
    const mediaWithId = {
      ...newMedia,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: newMedia.fileSize || '350 KB',
      dimensions: newMedia.dimensions || '1200 × 800',
    };
    setMedia((prev) => [mediaWithId, ...prev]);
    notify('success', 'Media File Added', `File "${newMedia.fileName || newMedia.title}" saved to library.`);
    return mediaWithId;
  };

  const updateMediaItem = (id, updates) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    notify('success', 'Media Updated', 'File metadata updated.');
  };

  const deleteMediaItem = (id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    notify('info', 'File Removed', 'Media file deleted from library.');
  };

  // 14. Theme & Appearance Actions
  const applyThemePreset = (presetName) => {
    const preset = THEME_PRESETS[presetName];
    if (preset) {
      setTheme((prev) => ({
        ...prev,
        ...preset,
        preset: presetName,
      }));
      notify('success', 'Theme Applied', `Switched theme preset to "${presetName}".`);
    }
  };

  const updateTheme = (updates) => {
    setTheme((prev) => ({ ...prev, ...updates }));
    notify('success', 'Theme Settings Saved', 'Visual style configurations updated.');
  };

  const resetTheme = () => {
    setTheme(initialCMSTheme);
    notify('info', 'Theme Reset', 'Website appearance restored to Medical Blue defaults.');
  };

  // 15. Shared Media Picker Trigger
  const openMediaPicker = (onSelectCallback, title = 'Select Image from Media Library') => {
    setMediaPickerState({
      isOpen: true,
      onSelect: onSelectCallback,
      title,
    });
  };

  const closeMediaPicker = () => {
    setMediaPickerState((prev) => ({ ...prev, isOpen: false, onSelect: null }));
  };

  // Computed CMS Dashboard Statistics
  const dashboardStats = useMemo(() => {
    const totalPages = pages.length;
    const publishedPages = pages.filter((p) => p.status === 'Published').length;
    const draftPages = pages.filter((p) => p.status === 'Draft').length;
    const activeServices = services.filter((s) => s.status === 'Active').length;
    const publishedBlogPosts = blogPosts.filter((b) => b.status === 'Published').length;
    const mediaFilesCount = media.length;

    const recentlyUpdatedPages = [...pages]
      .sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''))
      .slice(0, 4);

    const draftPagesList = pages.filter((p) => p.status === 'Draft').slice(0, 4);
    const recentServices = [...services].slice(0, 4);
    const recentBlogPosts = [...blogPosts].slice(0, 4);

    return {
      totalPages,
      publishedPages,
      draftPages,
      activeServices,
      publishedBlogPosts,
      mediaFilesCount,
      recentlyUpdatedPages,
      draftPagesList,
      recentServices,
      recentBlogPosts,
    };
  }, [pages, services, blogPosts, media]);

  const value = {
    // 1. Settings
    settings,
    updateSettings,
    resetSettings,

    // 2. Homepage Sections
    homepageSections,
    updateHomepageSection,
    toggleSectionVisibility,
    moveSection,
    resetHomepageSections,

    // 3. Pages
    pages,
    addPage,
    updatePage,
    duplicatePage,
    deletePage,
    setPageStatus,

    // 4. Services
    services,
    addService,
    updateService,
    duplicateService,
    deleteService,
    toggleServiceStatus,
    toggleServiceHomepage,

    // 5. Doctor Profiles
    doctorProfiles,
    publicDoctors,
    updateDoctorProfile,
    toggleDoctorWebsiteVisibility,
    toggleDoctorFeatured,

    // 6. Appointment & Contact
    appointmentContact,
    updateAppointmentContact,

    // 7. Gallery
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleGalleryVisibility,

    // 8. Testimonials
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialFeatured,
    toggleTestimonialStatus,

    // 9. Blog Posts
    blogPosts,
    addBlogPost,
    updateBlogPost,
    duplicateBlogPost,
    deleteBlogPost,
    setBlogPostStatus,

    // 10. FAQs
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    moveFAQ,
    toggleFAQHomepage,
    toggleFAQStatus,

    // 11. SEO
    seo,
    updateSEO,

    // 12. Navigation
    navigation,
    addNavItem,
    updateNavItem,
    deleteNavItem,
    moveNavItem,
    toggleNavItem,

    // 13. Media Library
    media,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,

    // 14. Theme
    theme,
    applyThemePreset,
    updateTheme,
    resetTheme,

    // 15. Preview Controls
    previewViewport,
    setPreviewViewport,
    showDraftsInPreview,
    setShowDraftsInPreview,
    activePreviewPage,
    setActivePreviewPage,

    // Media Picker Modal
    mediaPickerState,
    openMediaPicker,
    closeMediaPicker,

    // Stats
    dashboardStats,
  };

  return (
    <WebsiteCMSContext.Provider value={value}>
      {children}
    </WebsiteCMSContext.Provider>
  );
};

export const useWebsiteCMS = () => {
  const context = useContext(WebsiteCMSContext);
  if (!context) {
    throw new Error('useWebsiteCMS must be used within a WebsiteCMSProvider');
  }
  return context;
};

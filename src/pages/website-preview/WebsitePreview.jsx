import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  CheckCircle,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  Stethoscope,
  Heart,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  X,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';

export const WebsitePreview = () => {
  const navigate = useNavigate();
  const {
    settings,
    homepageSections,
    pages,
    services,
    publicDoctors,
    appointmentContact,
    gallery,
    testimonials,
    blogPosts,
    faqs,
    navigation,
    theme,
    previewViewport,
    setPreviewViewport,
    showDraftsInPreview,
    setShowDraftsInPreview,
  } = useWebsiteCMS();

  // Active public page/view state
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'about' | 'services' | 'doctors' | 'contact' | 'blog' | 'faqs' | 'page:[slug]'
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Contact form simulation inside preview
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ accordion state inside preview
  const [openFaqId, setOpenFaqId] = useState(null);

  // Filtered lists based on draft toggle
  const visiblePages = useMemo(() => {
    return pages.filter((p) => showDraftsInPreview || p.status === 'Published');
  }, [pages, showDraftsInPreview]);

  const visibleServices = useMemo(() => {
    return services.filter((s) => showDraftsInPreview || s.status === 'Active');
  }, [services, showDraftsInPreview]);

  const visibleDoctors = useMemo(() => {
    return publicDoctors.filter((d) => d.showOnWebsite);
  }, [publicDoctors]);

  const visibleTestimonials = useMemo(() => {
    return testimonials.filter((t) => showDraftsInPreview || t.status === 'Published');
  }, [testimonials, showDraftsInPreview]);

  const visibleBlogPosts = useMemo(() => {
    return blogPosts.filter((b) => showDraftsInPreview || b.status === 'Published');
  }, [blogPosts, showDraftsInPreview]);

  const visibleFAQs = useMemo(() => {
    return faqs.filter((f) => showDraftsInPreview || f.status === 'Active');
  }, [faqs, showDraftsInPreview]);

  const visibleGallery = useMemo(() => {
    return gallery.filter((g) => showDraftsInPreview || g.visible);
  }, [gallery, showDraftsInPreview]);

  // Sorted homepage sections
  const sortedSections = useMemo(() => {
    return [...homepageSections]
      .filter((sec) => sec.enabled)
      .sort((a, b) => a.order - b.order);
  }, [homepageSections]);

  // Sorted navigation menu links
  const headerNav = useMemo(() => {
    return [...navigation]
      .filter((n) => n.enabled && !n.parentId)
      .sort((a, b) => a.order - b.order);
  }, [navigation]);

  const handleNavClick = (path) => {
    if (path === '/' || path === '/home') setCurrentView('home');
    else if (path === '/about' || path === '/about-us') setCurrentView('about');
    else if (path === '/services') setCurrentView('services');
    else if (path === '/doctors') setCurrentView('doctors');
    else if (path === '/contact' || path === '/contact-us') setCurrentView('contact');
    else if (path === '/blog' || path === '/news') setCurrentView('blog');
    else if (path === '/faqs') setCurrentView('faqs');
    else if (path.startsWith('/')) {
      const slug = path.replace(/^\//, '');
      const matchedPage = pages.find((p) => p.slug === slug);
      if (matchedPage) setCurrentView(`page:${slug}`);
      else setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setContactSubmitted(true);
  };

  // Viewport container width styling
  const getViewportWidthClass = () => {
    switch (previewViewport) {
      case 'mobile':
        return 'max-w-[390px] min-h-[750px] shadow-2xl rounded-[36px] border-[10px] border-slate-900 mx-auto overflow-hidden my-6';
      case 'tablet':
        return 'max-w-[768px] min-h-[850px] shadow-2xl rounded-[28px] border-[8px] border-slate-800 mx-auto overflow-hidden my-6';
      default:
        return 'w-full shadow-sm';
    }
  };

  const buttonRoundingClass =
    theme.buttonStyle === 'rounded-full'
      ? 'rounded-full'
      : theme.buttonStyle === 'rounded-md'
      ? 'rounded-md'
      : 'rounded-xl';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 flex flex-col font-sans select-none">
      {/* Top Fixed Control Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5 sticky top-0 z-50 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Return & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/website-cms')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CMS</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black tracking-tight text-slate-200">
              {settings.clinicName || 'MedPulse'} Public Website Preview
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono">
              Live Mockup
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setPreviewViewport('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewViewport === 'desktop'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (Full Screen)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setPreviewViewport('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewViewport === 'tablet'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setPreviewViewport('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewViewport === 'mobile'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Draft Toggle & Active View Dropdown */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showDraftsInPreview}
              onChange={(e) => setShowDraftsInPreview(e.target.checked)}
              className="w-4 h-4 rounded-sm text-brand-500 focus:ring-brand-500"
            />
            <span className="hidden sm:inline">Include Drafts</span>
          </label>

          <select
            value={currentView}
            onChange={(e) => setCurrentView(e.target.value)}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="home">Page: Homepage</option>
            <option value="about">Page: About Clinic</option>
            <option value="services">Page: Medical Services</option>
            <option value="doctors">Page: Our Doctors</option>
            <option value="contact">Page: Contact & Booking</option>
            <option value="blog">Page: Health Blog</option>
            <option value="faqs">Page: FAQs</option>
            {visiblePages
              .filter(
                (p) =>
                  !['home', 'about-us', 'services', 'doctors', 'contact', 'blog', 'faqs'].includes(
                    p.slug
                  )
              )
              .map((p) => (
                <option key={p.id} value={`page:${p.slug}`}>
                  Page: {p.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Website Frame Wrapper */}
      <div className="flex-1 bg-slate-900/40 p-0 sm:p-2 overflow-y-auto">
        <div
          className={`${getViewportWidthClass()} bg-white transition-all duration-300 relative`}
          style={{
            backgroundColor: theme.backgroundColor || '#f8fafc',
            fontFamily: theme.bodyFont || 'Inter, sans-serif',
          }}
        >
          {/* ========================================================= */}
          {/* 1. PUBLIC WEBSITE HEADER */}
          {/* ========================================================= */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
            {/* Top Info Strip */}
            <div
              className="py-1.5 px-4 text-white text-[11px] flex items-center justify-between gap-3"
              style={{ backgroundColor: theme.secondaryColor || '#0f172a' }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-brand-300" />
                  <span>{settings.openingDays || 'Mon - Sat'}: {settings.openingTime || '08:00 AM'} - {settings.closingTime || '09:00 PM'}</span>
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-300" />
                  <span className="truncate max-w-xs">{settings.clinicAddress || 'Healthcare Blvd'}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-1 font-bold hover:text-brand-300 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>{settings.contactPhone || '+1 (555) 234-5678'}</span>
                </a>
              </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              {/* Brand Logo */}
              <div
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                {settings.clinicLogo ? (
                  <img
                    src={settings.clinicLogo}
                    alt={settings.clinicName}
                    className="w-9 h-9 rounded-xl object-contain border border-slate-200"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-xs"
                    style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                  >
                    +
                  </div>
                )}
                <div>
                  <h1
                    className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    {settings.clinicName || 'MedPulse Clinic'}
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                    {settings.clinicTagline || 'Advanced Healthcare Solutions'}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {headerNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* CTA Action Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('contact')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer ${buttonRoundingClass}`}
                  style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </header>

          {/* ========================================================= */}
          {/* 2. DYNAMIC PAGE CONTENT ROUTING */}
          {/* ========================================================= */}
          <main className="min-h-[500px]">
            {/* VIEW 1: HOMEPAGE (renders all enabled sections in CMS order) */}
            {currentView === 'home' && (
              <div className="space-y-12 sm:space-y-16 pb-16">
                {sortedSections.map((sec) => {
                  const c = sec.content || sec || {};

                  /* 1. Hero Section */
                  if (sec.id === 'hero') {
                    const bg = c.backgroundImage || c.bgImage || sec.bgImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80';
                    const headline = c.headline || c.title || sec.title || 'Advanced Medical Care for You and Your Family';
                    const subheadline = c.subheadline || c.subtitle || sec.subtitle || c.description || sec.description || 'Consult with Top Specialist Physicians with Same-Day OPD Bookings';
                    const badgeText = c.badgeText || sec.badgeText || 'Welcome to MedPulse';
                    const primaryBtnText = c.primaryBtnText || sec.primaryBtnText || 'Book an Appointment';
                    const primaryBtnLink = c.primaryBtnLink || sec.primaryBtnLink || '/contact';
                    const secondaryBtnText = c.secondaryBtnText || sec.secondaryBtnText || 'Explore Services';
                    const secondaryBtnLink = c.secondaryBtnLink || sec.secondaryBtnLink || '/services';
                    const overlayStyle = c.overlay === 'dark' || c.overlayOpacity
                      ? 'rgba(15, 23, 42, 0.82)'
                      : c.overlay === 'blue'
                      ? 'rgba(2, 44, 94, 0.82)'
                      : 'rgba(15, 23, 42, 0.65)';

                    return (
                      <section
                        key={sec.id}
                        className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24"
                        style={{
                          backgroundImage: `url(${bg})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: overlayStyle }}
                        />

                        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                            style={{
                              backgroundColor: `${theme.accentColor || '#14b8a6'}33`,
                              color: theme.accentColor || '#14b8a6',
                            }}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{badgeText}</span>
                          </span>

                          <h2
                            className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            {headline}
                          </h2>

                          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
                            {subheadline}
                          </p>

                          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                            <button
                              onClick={() => handleNavClick(primaryBtnLink)}
                              className={`px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ${buttonRoundingClass}`}
                              style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                            >
                              {primaryBtnText}
                            </button>
                            <button
                              onClick={() => handleNavClick(secondaryBtnLink)}
                              className={`px-5 py-2.5 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer ${buttonRoundingClass}`}
                            >
                              {secondaryBtnText}
                            </button>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  /* 2. Highlights / Stats Section */
                  if (sec.id === 'stats') {
                    const statsList = c.items || sec.items || [];
                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-10">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                          {statsList.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div
                                className="text-2xl sm:text-3xl font-black"
                                style={{
                                  color: theme.primaryColor || '#0284c7',
                                  fontFamily: theme.headingFont || 'Outfit, sans-serif',
                                }}
                              >
                                {item.value}
                              </div>
                              <div className="text-xs font-bold text-slate-600">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  /* 3. About Clinic Section */
                  if (sec.id === 'about') {
                    const aboutTitle = c.heading || c.title || sec.heading || sec.title || 'Compassionate Care, Precision Diagnostics';
                    const aboutDesc = c.description || sec.description || settings.aboutClinic;
                    const aboutImg = c.image || c.imageUrl || sec.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';

                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                              About Our Facility
                            </span>
                            <h3
                              className="text-xl sm:text-3xl font-black text-slate-900 leading-tight"
                              style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                            >
                              {aboutTitle}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {aboutDesc}
                            </p>
                            <div className="pt-2">
                              <button
                                onClick={() => setCurrentView('about')}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                              >
                                <span>Read Full Clinical Accreditation</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-16/10">
                            <img
                              src={aboutImg}
                              alt="Clinic Facility"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </section>
                    );
                  }

                  /* 4. Services Overview */
                  if (sec.id === 'services') {
                    const srvTitle = c.heading || c.title || sec.heading || 'Comprehensive Clinical Specialties';
                    const srvSub = c.subheading || c.subtitle || sec.subheading || 'Expert outpatient healthcare designed around your personal health needs';
                    const featuredServices = visibleServices.filter((s) => s.featuredOnHomepage).slice(0, 6);

                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 py-6">
                        <div className="text-center space-y-2 mb-8">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                            Comprehensive Care
                          </span>
                          <h3
                            className="text-xl sm:text-3xl font-black text-slate-900"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            {srvTitle}
                          </h3>
                          <p className="text-xs text-slate-500 max-w-xl mx-auto">
                            {srvSub}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {featuredServices.map((srv) => (
                            <div
                              key={srv.id}
                              onClick={() => setSelectedService(srv)}
                              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group"
                            >
                              <div>
                                <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 mb-3">
                                  <img
                                    src={srv.imageUrl}
                                    alt={srv.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                  {srv.category}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-brand-600 transition-colors">
                                  {srv.name}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                  {srv.shortDescription}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                                <span className="font-bold text-slate-700">
                                  Fee: {srv.consultationFee ? `$${srv.consultationFee}` : 'Inquire'}
                                </span>
                                <span className="text-brand-600 font-bold flex items-center gap-0.5">
                                  <span>Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="text-center pt-6">
                          <button
                            onClick={() => setCurrentView('services')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            <span>View All {visibleServices.length} Medical Services</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </section>
                    );
                  }

                  /* 5. Doctors Section */
                  if (sec.id === 'doctors') {
                    const docTitle = c.heading || c.title || sec.heading || 'Meet Our Consulting Doctors';
                    const featuredDocs = visibleDoctors.filter((d) => d.featuredDoctor).slice(0, 4);

                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 py-6">
                        <div className="text-center space-y-2 mb-8">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                            Our Medical Specialists
                          </span>
                          <h3
                            className="text-xl sm:text-3xl font-black text-slate-900"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            {docTitle}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                          {featuredDocs.map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() => setSelectedDoctor(doc)}
                              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden cursor-pointer group text-center p-4"
                            >
                              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-slate-100 border-2 border-slate-200 mb-3">
                                <img
                                  src={doc.avatar}
                                  alt={doc.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                {doc.publicDisplayName || doc.name}
                              </h4>
                              <p className="text-xs font-bold text-brand-600 mt-0.5">
                                {doc.specialization}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {doc.publicQualifications || 'MBBS, FCPS'}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-2">
                                {doc.publicBio || doc.bio}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  /* 6. Why Choose Us Section */
                  if (sec.id === 'why-us') {
                    const whyTitle = c.heading || c.title || sec.heading || 'Why Patients Choose MedPulse';
                    const whyFeatures = c.features || (c.highlights ? c.highlights.map(h => ({ title: h, description: 'Dedicated patient-first clinical delivery.' })) : [
                      { title: 'Experienced Specialists', description: 'Compassionate medical care from board-certified consultants.' },
                      { title: 'Digital Health Records', description: 'Immediate electronic prescription delivery and tracking.' },
                      { title: 'Modern Facilities', description: 'Clean, sterile, wheelchair-accessible patient consultation suites.' },
                    ]);

                    return (
                      <section key={sec.id} className="bg-slate-50 py-12 border-y border-slate-200/80">
                        <div className="max-w-6xl mx-auto px-4">
                          <div className="text-center space-y-2 mb-8">
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                              Excellence & Trust
                            </span>
                            <h3
                              className="text-xl sm:text-3xl font-black text-slate-900"
                              style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                            >
                              {whyTitle}
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {whyFeatures.map((f, i) => (
                              <div
                                key={i}
                                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2"
                              >
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                                  style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                                >
                                  {i + 1}
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    );
                  }

                  /* 7. Appointment CTA Banner */
                  if (sec.id === 'cta') {
                    const ctaTitle = c.headline || c.heading || sec.heading || 'Need Immediate Consultation?';
                    const ctaSub = c.subheadline || c.description || sec.description || 'Schedule an appointment online with our experienced specialist doctors.';
                    const ctaBtn = c.buttonText || c.btnText || sec.btnText || 'Schedule OPD Visit Now';

                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 py-6">
                        <div
                          className="rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl"
                          style={{
                            background: `linear-gradient(135deg, ${theme.secondaryColor || '#0f172a'} 0%, ${theme.primaryColor || '#0284c7'} 100%)`,
                          }}
                        >
                          <h3
                            className="text-xl sm:text-3xl font-black max-w-2xl mx-auto leading-tight"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            {ctaTitle}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
                            {ctaSub}
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => setCurrentView('contact')}
                              className={`px-6 py-3 text-xs sm:text-sm font-bold bg-white text-slate-900 shadow-md hover:bg-slate-100 transition-transform hover:scale-105 active:scale-95 cursor-pointer ${buttonRoundingClass}`}
                            >
                              {ctaBtn}
                            </button>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  /* 8. Testimonials Section */
                  if (sec.id === 'testimonials') {
                    const testTitle = c.title || c.heading || sec.heading || 'What Our Patients Say';
                    const featuredTestimonials = visibleTestimonials.filter((t) => t.featured).slice(0, 3);

                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 py-8">
                        <div className="text-center space-y-2 mb-8">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                            Patient Stories
                          </span>
                          <h3
                            className="text-xl sm:text-3xl font-black text-slate-900"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            {testTitle}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {featuredTestimonials.map((t) => (
                            <div
                              key={t.id}
                              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-3">
                                  {[...Array(t.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                  ))}
                                </div>
                                <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                                  "{t.testimonialText}"
                                </p>
                              </div>
                              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                  {t.patientDisplayName.charAt(0)}
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900">
                                    {t.patientDisplayName}
                                  </h5>
                                  <p className="text-[10px] text-slate-400">
                                    {t.roleOrTreatment || 'Verified Patient'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  /* 9. Gallery Section */
                  if (sec.id === 'gallery') {
                    const previewGallery = visibleGallery.slice(0, 4);
                    return (
                      <section key={sec.id} className="max-w-6xl mx-auto px-4 py-6">
                        <div className="text-center space-y-2 mb-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                            Our Clinic Facility
                          </span>
                          <h3
                            className="text-xl sm:text-3xl font-black text-slate-900"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            Modern Diagnostic & Care Suites
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                          {previewGallery.map((item) => (
                            <div
                              key={item.id}
                              className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xs border border-slate-200 bg-slate-100 group"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.altText || item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  /* 10. FAQs Section */
                  if (sec.id === 'faqs') {
                    const homeFaqs = visibleFAQs.filter((f) => f.showOnHomepage).slice(0, 5);
                    return (
                      <section key={sec.id} className="max-w-4xl mx-auto px-4 py-8">
                        <div className="text-center space-y-2 mb-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                            Clear Answers
                          </span>
                          <h3
                            className="text-xl sm:text-3xl font-black text-slate-900"
                            style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                          >
                            Frequently Asked Questions
                          </h3>
                        </div>

                        <div className="space-y-2.5">
                          {homeFaqs.map((faq) => {
                            const isOpen = openFaqId === faq.id;
                            return (
                              <div
                                key={faq.id}
                                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-600 cursor-pointer"
                                >
                                  <span>{faq.question}</span>
                                  {isOpen ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                                {isOpen && (
                                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                                    {faq.answer}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  }

                  return null;
                })}
              </div>
            )}

            {/* VIEW 2: ABOUT CLINIC PAGE */}
            {currentView === 'about' && (
              <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Trusted Healthcare
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-black text-slate-900"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    About {settings.clinicName || 'MedPulse Clinic'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {settings.aboutClinic || settings.shortDescription}
                  </p>
                </div>

                <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-21/9 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80"
                    alt="Clinic Facility"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                    <ShieldCheck className="w-6 h-6 text-brand-600" />
                    <h4 className="text-sm font-bold text-slate-900">Certified Specialists</h4>
                    <p className="text-xs text-slate-500">
                      Licensed consultants with decades of combined clinical experience in OPD care.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                    <Heart className="w-6 h-6 text-rose-500" />
                    <h4 className="text-sm font-bold text-slate-900">Compassionate Service</h4>
                    <p className="text-xs text-slate-500">
                      Patient-first philosophy focused on preventative health, reassurance, and thorough follow-ups.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    <h4 className="text-sm font-bold text-slate-900">Modern Diagnostics</h4>
                    <p className="text-xs text-slate-500">
                      Rapid diagnostic turnaround and digital prescriptions synchronized with the clinic ERP.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: SERVICES DIRECTORY */}
            {currentView === 'services' && (
              <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Clinical Departments
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-black text-slate-900"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    Our Medical Services & Specialties
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                    Browse outpatient medical services available at our clinic.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleServices.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 mb-3">
                          <img
                            src={srv.imageUrl}
                            alt={srv.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {srv.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-brand-600 transition-colors">
                          {srv.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 mt-1">
                          {srv.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                        <span className="font-bold text-slate-700">
                          Fee: {srv.consultationFee ? `$${srv.consultationFee}` : 'Inquire'}
                        </span>
                        <span className="text-brand-600 font-bold flex items-center gap-0.5">
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 4: DOCTORS DIRECTORY */}
            {currentView === 'doctors' && (
              <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Consulting Staff
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-black text-slate-900"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    Medical Specialists & Consultants
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                    Meet the doctors providing clinical care at our clinic.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group text-center"
                    >
                      <div>
                        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-slate-100 border-2 border-slate-200 mb-3">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {doc.publicDisplayName || doc.name}
                        </h3>
                        <p className="text-xs font-bold text-brand-600 mt-0.5">
                          {doc.specialization}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {doc.publicQualifications || 'MBBS, FCPS'} • {doc.yearsOfExperience || 8}+ Years Exp
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                          {doc.publicBio || doc.bio}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Fee: ${doc.consultationFee || 50}
                        </span>
                        <span className="text-brand-600 font-bold flex items-center gap-0.5">
                          <span>View Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 5: CONTACT & BOOKING PAGE */}
            {currentView === 'contact' && (
              <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Get in Touch
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-black text-slate-900"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    {appointmentContact.contactHeading || 'Contact & Appointment Booking'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                    {appointmentContact.contactDescription || 'Have questions or wish to book a visit? Submit your inquiry below.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Contact Info (5 cols) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
                    <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                      Clinic Information
                    </h3>

                    <div className="space-y-4 text-xs">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Clinic Address</span>
                          <span className="text-slate-500">{settings.clinicAddress || 'Healthcare Blvd'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Phone Line</span>
                          <span className="text-slate-500">{settings.contactPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Email Address</span>
                          <span className="text-slate-500">{settings.contactEmail}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Working Hours</span>
                          <span className="text-slate-500">{settings.openingDays}: {settings.openingTime} - {settings.closingTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                      <span className="font-bold block text-slate-800 mb-1">Booking Instructions:</span>
                      {appointmentContact.bookingInstructions || 'For same-day consultations, please call reception directly.'}
                    </div>
                  </div>

                  {/* Interactive Public Contact Form Preview (7 cols) */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                    <h3 className="text-sm font-black text-slate-900">
                      Send an Inquiry or Appointment Request
                    </h3>

                    {contactSubmitted ? (
                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                        <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                        <h4 className="text-sm font-bold text-emerald-900">
                          {appointmentContact.contactFormSuccessMessage || 'Thank you! Your message has been received.'}
                        </h4>
                        <p className="text-xs text-emerald-700">
                          (Simulation: In this frontend demo, your message is validated locally.)
                        </p>
                        <button
                          onClick={() => {
                            setContactSubmitted(false);
                            setContactForm({ name: '', email: '', phone: '', message: '' });
                          }}
                          className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-xs"
                        >
                          Send Another Message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Your Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={contactForm.name}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, name: e.target.value }))
                              }
                              placeholder="Full Name"
                              required
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Email Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={contactForm.email}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, email: e.target.value }))
                              }
                              placeholder="name@example.com"
                              required
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Phone / WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Message or Symptoms <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={4}
                            value={contactForm.message}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, message: e.target.value }))
                            }
                            placeholder="Describe how we can assist you..."
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-brand-500/20"
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2.5 text-white text-xs font-bold shadow-md transition-all cursor-pointer ${buttonRoundingClass}`}
                          style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                        >
                          Submit Message to Clinic
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 6: BLOG & HEALTH ARTICLES */}
            {currentView === 'blog' && (
              <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Health Education
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-black text-slate-900"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    Clinical Articles & Patient Guides
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                    Evidence-based medical advice and health tips written by our clinic team.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleBlogPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-16/10 bg-slate-100 overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                              {post.category}
                            </span>
                            <span>•</span>
                            <span>{post.publishDate}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between text-xs text-brand-600 font-bold">
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 7: FAQS FULL PAGE */}
            {currentView === 'faqs' && (
              <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Patient Support
                  </span>
                  <h2
                    className="text-2xl sm:text-4xl font-black text-slate-900"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {visibleFAQs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-600 cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 8: CUSTOM CMS PAGE (Block Render) */}
            {currentView.startsWith('page:') && (
              <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
                {(() => {
                  const slug = currentView.replace(/^page:/, '');
                  const page = pages.find((p) => p.slug === slug);
                  if (!page) {
                    return (
                      <div className="text-center py-12 text-slate-500">
                        Page not found. <button onClick={() => setCurrentView('home')} className="text-brand-600 font-bold">Return Home</button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                        <h2
                          className="text-2xl sm:text-4xl font-black text-slate-900"
                          style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                        >
                          {page.title}
                        </h2>
                        {page.shortDescription && (
                          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                            {page.shortDescription}
                          </p>
                        )}
                      </div>

                      {/* Render Blocks */}
                      <div className="space-y-4">
                        {(page.blocks || []).map((b, idx) => {
                          if (b.type === 'heading') {
                            return (
                              <h3
                                key={b.id || idx}
                                className="text-lg sm:text-xl font-bold text-slate-900 pt-2"
                                style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                              >
                                {b.content}
                              </h3>
                            );
                          }
                          if (b.type === 'paragraph') {
                            return (
                              <p key={b.id || idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                {b.content}
                              </p>
                            );
                          }
                          if (b.type === 'bullet_list') {
                            return (
                              <ul key={b.id || idx} className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                                {(b.items || []).map((item, itemIdx) => (
                                  <li key={itemIdx}>{item}</li>
                                ))}
                              </ul>
                            );
                          }
                          if (b.type === 'image') {
                            return (
                              <div key={b.id || idx} className="rounded-2xl overflow-hidden border border-slate-200">
                                <img src={b.url} alt={b.altText || ''} className="w-full h-auto" />
                                {b.caption && (
                                  <p className="p-2 text-[11px] text-slate-500 text-center bg-slate-50">
                                    {b.caption}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          if (b.type === 'info_card') {
                            return (
                              <div
                                key={b.id || idx}
                                className="p-4 rounded-xl border border-brand-200 bg-brand-50/60 text-xs text-brand-900 space-y-1"
                              >
                                <h4 className="font-bold">{b.title}</h4>
                                <p>{b.description}</p>
                              </div>
                            );
                          }
                          if (b.type === 'cta') {
                            return (
                              <div
                                key={b.id || idx}
                                className="p-6 rounded-2xl text-center text-white space-y-3"
                                style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                              >
                                <h4 className="text-base font-bold">{b.title}</h4>
                                <button
                                  onClick={() => handleNavClick(b.buttonLink || '/contact')}
                                  className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold"
                                >
                                  {b.buttonText || 'Contact Us'}
                                </button>
                              </div>
                            );
                          }
                          if (b.type === 'divider') {
                            return <hr key={b.id || idx} className="border-slate-200 my-4" />;
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </main>

          {/* ========================================================= */}
          {/* 3. PUBLIC WEBSITE FOOTER */}
          {/* ========================================================= */}
          <footer
            className="text-slate-300 text-xs pt-12 pb-8 border-t border-slate-800"
            style={{ backgroundColor: theme.secondaryColor || '#0f172a' }}
          >
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Col 1: Clinic Identity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: theme.primaryColor || '#0284c7' }}
                  >
                    +
                  </div>
                  <span
                    className="text-base font-bold text-white tracking-tight"
                    style={{ fontFamily: theme.headingFont || 'Outfit, sans-serif' }}
                  >
                    {settings.clinicName || 'MedPulse Clinic'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {settings.footerDescription || settings.shortDescription}
                </p>
                <div className="text-[11px] text-slate-400">
                  Emergency Call: <strong className="text-white">{settings.emergencyContact || settings.contactPhone}</strong>
                </div>
              </div>

              {/* Col 2: Quick Links */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Quick Navigation
                </h4>
                <div className="flex flex-col space-y-1.5 text-[11px]">
                  <button onClick={() => setCurrentView('home')} className="text-left hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                  <button onClick={() => setCurrentView('about')} className="text-left hover:text-white transition-colors cursor-pointer">
                    About Our Clinic
                  </button>
                  <button onClick={() => setCurrentView('services')} className="text-left hover:text-white transition-colors cursor-pointer">
                    Clinical Services
                  </button>
                  <button onClick={() => setCurrentView('doctors')} className="text-left hover:text-white transition-colors cursor-pointer">
                    Doctors & Specialists
                  </button>
                  <button onClick={() => setCurrentView('blog')} className="text-left hover:text-white transition-colors cursor-pointer">
                    Health Articles
                  </button>
                </div>
              </div>

              {/* Col 3: Medical Services */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Departments
                </h4>
                <div className="flex flex-col space-y-1.5 text-[11px] text-slate-400">
                  {visibleServices.slice(0, 5).map((s) => (
                    <span key={s.id} onClick={() => setSelectedService(s)} className="hover:text-white cursor-pointer truncate">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Col 4: Contact & Timings */}
              <div className="space-y-2 text-[11px] text-slate-400">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Clinic Hours
                </h4>
                <p>
                  {settings.openingDays || 'Mon - Sat'}: {settings.openingTime || '08:00 AM'} - {settings.closingTime || '09:00 PM'}
                </p>
                <p className="pt-1">
                  {settings.clinicAddress || 'Healthcare Blvd'}
                </p>
                <p>Email: {settings.contactEmail}</p>
                <p>Tel: {settings.contactPhone}</p>
              </div>
            </div>

            {/* Bottom Copyright Strip */}
            <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
              <p>{settings.copyrightText || `© ${new Date().getFullYear()} MedPulse Clinic. All rights reserved.`}</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView('page:privacy-policy')} className="hover:text-slate-300">
                  Privacy Policy
                </button>
                <button onClick={() => setCurrentView('page:terms-conditions')} className="hover:text-slate-300">
                  Terms & Conditions
                </button>
              </div>
            </div>
          </footer>

          {/* ========================================================= */}
          {/* 4. MODALS FOR SERVICE / DOCTOR / BLOG DETAILS IN PREVIEW */}
          {/* ========================================================= */}
          {/* Service Detail Modal */}
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-xs font-bold">
                    {selectedService.category}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedService.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedService.fullDescription || selectedService.shortDescription}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-100">
                    <span className="text-slate-700">
                      Consultation: {selectedService.consultationFee ? `$${selectedService.consultationFee}` : 'Standard'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        setCurrentView('contact');
                      }}
                      className="px-3.5 py-1.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
                    >
                      Book for this Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Detail Modal */}
          {selectedDoctor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-5 space-y-4 text-center">
                <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-slate-100 border-2 border-slate-200">
                  <img
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDoctor.publicDisplayName || selectedDoctor.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-600">
                    {selectedDoctor.specialization}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedDoctor.publicQualifications || 'MBBS, FCPS'}
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedDoctor.publicBio || selectedDoctor.bio}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">
                    Fee: ${selectedDoctor.consultationFee || 50}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoctor(null);
                        setCurrentView('contact');
                      }}
                      className="px-3.5 py-1.5 bg-brand-600 text-white rounded-xl font-bold"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Post Detail Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-700 text-xs font-bold">
                    {selectedPost.category}
                  </span>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedPost.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>By {selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.publishDate}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime || '4 min'}</span>
                  </div>
                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={selectedPost.featuredImage}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-brand-500 pl-4 py-1">
                    {selectedPost.excerpt}
                  </p>
                  <div className="space-y-3 pt-2">
                    {(selectedPost.blocks || []).map((b, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {b.content}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

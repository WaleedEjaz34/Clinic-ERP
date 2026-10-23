import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe,
  LayoutDashboard,
  Settings,
  PanelsTopLeft,
  FileText,
  Briefcase,
  Stethoscope,
  CalendarCheck,
  Image as ImageIcon,
  MessageSquareQuote,
  Newspaper,
  HelpCircle,
  Search,
  Menu as MenuIcon,
  FolderOpen,
  Palette,
  ExternalLink,
  Eye,
  Sliders,
} from 'lucide-react';
import { MediaPickerModal } from '../../components/cms/MediaPickerModal';

const CMS_NAV_ITEMS = [
  { id: 'overview', name: 'Overview', path: '/website-cms', icon: LayoutDashboard, exact: true },
  { id: 'settings', name: 'Website Settings', path: '/website-cms/settings', icon: Settings },
  { id: 'homepage', name: 'Homepage Builder', path: '/website-cms/homepage', icon: PanelsTopLeft },
  { id: 'pages', name: 'Pages', path: '/website-cms/pages', icon: FileText },
  { id: 'services', name: 'Services', path: '/website-cms/services', icon: Briefcase },
  { id: 'doctors', name: 'Doctor Profiles', path: '/website-cms/doctors', icon: Stethoscope },
  { id: 'contact', name: 'Appointments & Contact', path: '/website-cms/contact', icon: CalendarCheck },
  { id: 'gallery', name: 'Gallery', path: '/website-cms/gallery', icon: ImageIcon },
  { id: 'testimonials', name: 'Testimonials', path: '/website-cms/testimonials', icon: MessageSquareQuote },
  { id: 'blog', name: 'Blog & News', path: '/website-cms/blog', icon: Newspaper },
  { id: 'faqs', name: 'FAQs', path: '/website-cms/faqs', icon: HelpCircle },
  { id: 'seo', name: 'SEO Settings', path: '/website-cms/seo', icon: Search },
  { id: 'navigation', name: 'Navigation Menu', path: '/website-cms/navigation', icon: MenuIcon },
  { id: 'media', name: 'Media Library', path: '/website-cms/media', icon: FolderOpen },
  { id: 'theme', name: 'Theme & Appearance', path: '/website-cms/theme', icon: Palette },
];

export const WebsiteCMSLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Top Banner with Public Website Preview Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400 flex-shrink-0">
            <Globe className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                MedPulse Website CMS
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                Frontend CMS
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-tight mt-0.5">
              Control public clinic website content, doctors, services, blogs, and appearance with live preview synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => navigate('/website-preview')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            title="Open Live Public Website Preview"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Website</span>
            <ExternalLink className="w-3 h-3 text-brand-200" />
          </button>
        </div>
      </div>

      {/* Secondary Horizontal Submodule Bar (Clean, scrollable with icons) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {CMS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Submodule View Content */}
      <div className="pt-1">
        <Outlet />
      </div>

      {/* Global Shared Media Picker Modal */}
      <MediaPickerModal />
    </div>
  );
};

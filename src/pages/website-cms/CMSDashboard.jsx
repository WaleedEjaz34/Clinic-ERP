import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Briefcase,
  Newspaper,
  FolderOpen,
  ArrowRight,
  Plus,
  PanelsTopLeft,
  Stethoscope,
  Eye,
  Sparkles,
  UploadCloud,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';
import { formatDate } from '../../utils/date';

export const CMSDashboard = () => {
  const navigate = useNavigate();
  const { dashboardStats, pages, services, blogPosts, settings } = useWebsiteCMS();

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <CMSPageHeader
        title="CMS Overview & Dashboard"
        subtitle="Manage public clinic website content, monitor published vs draft records, and trigger instant updates."
        actions={
          <button
            onClick={() => navigate('/website-preview')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-brand-400" />
            <span>Launch Live Preview</span>
          </button>
        }
      />

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Pages */}
        <div
          onClick={() => navigate('/website-cms/pages')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-brand-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Pages
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 tabular-nums">
            {dashboardStats.totalPages}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block truncate">
            Configured routes
          </span>
        </div>

        {/* Published Pages */}
        <div
          onClick={() => navigate('/website-cms/pages?status=Published')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-emerald-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Published
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-700 tabular-nums">
            {dashboardStats.publishedPages}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block truncate">
            Live on website
          </span>
        </div>

        {/* Draft Pages */}
        <div
          onClick={() => navigate('/website-cms/pages?status=Draft')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              Draft Pages
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-700 tabular-nums">
            {dashboardStats.draftPages}
          </div>
          <span className="text-[10px] text-amber-600 font-medium block truncate">
            In progress / hidden
          </span>
        </div>

        {/* Active Services */}
        <div
          onClick={() => navigate('/website-cms/services')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-brand-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-brand-700 tracking-wider">
              Active Services
            </span>
            <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-brand-700 tabular-nums">
            {dashboardStats.activeServices}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block truncate">
            Medical specialties
          </span>
        </div>

        {/* Published Blog Posts */}
        <div
          onClick={() => navigate('/website-cms/blog')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-indigo-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
              Blog Posts
            </span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Newspaper className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-indigo-700 tabular-nums">
            {dashboardStats.publishedBlogPosts}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block truncate">
            Health education
          </span>
        </div>

        {/* Media Files */}
        <div
          onClick={() => navigate('/website-cms/media')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-purple-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
              Media Files
            </span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-purple-700 tabular-nums">
            {dashboardStats.mediaFilesCount}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block truncate">
            Images & assets
          </span>
        </div>
      </div>

      {/* 2. Quick Actions Grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              CMS Quick Actions
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Direct shortcuts to common site tasks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <button
            onClick={() => navigate('/website-cms/homepage')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <PanelsTopLeft className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Edit Homepage
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sections & hero</span>
          </button>

          <button
            onClick={() => navigate('/website-cms/pages?action=new')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Create New Page
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Modular blocks</span>
          </button>

          <button
            onClick={() => navigate('/website-cms/services?action=new')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Add Service
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Clinical specialty</span>
          </button>

          <button
            onClick={() => navigate('/website-cms/doctors')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-teal-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Doctor Profiles
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Public credentials</span>
          </button>

          <button
            onClick={() => navigate('/website-cms/blog?action=new')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Newspaper className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Write Blog Post
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Health insights</span>
          </button>

          <button
            onClick={() => navigate('/website-cms/media')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Upload Media
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Library assets</span>
          </button>

          <button
            onClick={() => navigate('/website-preview')}
            className="p-3 bg-slate-50 hover:bg-brand-50/70 border border-slate-200 hover:border-brand-300 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Eye className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-800 group-hover:text-brand-700 block leading-tight">
              Preview Website
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Live local preview</span>
          </button>
        </div>
      </div>

      {/* 3. Content Overview: Recently Updated & Drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Recently Updated Pages */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recently Updated Pages
              </h3>
            </div>
            <button
              onClick={() => navigate('/website-cms/pages')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {dashboardStats.recentlyUpdatedPages.map((page) => (
              <div
                key={page.id}
                onClick={() => navigate('/website-cms/pages')}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs">{page.title}</span>
                    <ContentStatusBadge status={page.status} />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">/{page.slug}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(page.lastUpdated)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Draft Content Pending Publication */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Draft Content
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200/80">
              {dashboardStats.draftPages} Pages in Draft
            </span>
          </div>

          {dashboardStats.draftPagesList.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">All pages are published</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                New draft pages will be listed here for review before going live.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboardStats.draftPagesList.map((page) => (
                <div
                  key={page.id}
                  onClick={() => navigate('/website-cms/pages')}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{page.title}</span>
                    <span className="text-[11px] text-amber-600 font-medium">Draft — Not visible on live site</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/website-cms/pages');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-50 rounded-lg border border-brand-200 transition-colors"
                  >
                    Edit Draft
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Services & Recent Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Services */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Medical Services on Website
              </h3>
            </div>
            <button
              onClick={() => navigate('/website-cms/services')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Services</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {dashboardStats.recentServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => navigate('/website-cms/services')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{srv.name}</span>
                    <span className="text-[10px] text-slate-500">{srv.category} • Fee: Rs. {srv.consultationFee}</span>
                  </div>
                </div>
                <ContentStatusBadge status={srv.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recent Health Articles
              </h3>
            </div>
            <button
              onClick={() => navigate('/website-cms/blog')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Blog</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {dashboardStats.recentBlogPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate('/website-cms/blog')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 text-xs block truncate max-w-xs">
                      {post.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {post.author} • {formatDate(post.publishDate)}
                    </span>
                  </div>
                </div>
                <ContentStatusBadge status={post.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  Power,
  Eye,
  Star,
  Check,
  Clock,
  Coins,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/currency';

export const ServicesManager = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    services,
    addService,
    updateService,
    duplicateService,
    deleteService,
    toggleServiceStatus,
    toggleServiceHomepage,
    openMediaPicker,
  } = useWebsiteCMS();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(
    searchParams.get('action') === 'new'
  );
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Consultation',
    shortDescription: '',
    fullDescription: '',
    image: '',
    icon: 'Stethoscope',
    consultationFee: 2500,
    estimatedDuration: '25 mins',
    displayOrder: 1,
    featuredOnHomepage: true,
    status: 'Active',
  });

  const categories = ['ALL', 'Consultation', 'Specialist Clinic', 'Diagnostic & OPD', 'Laboratory', 'Preventive Care'];

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Consultation',
      shortDescription: '',
      fullDescription: '',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
      icon: 'Stethoscope',
      consultationFee: 2500,
      estimatedDuration: '25 mins',
      displayOrder: services.length + 1,
      featuredOnHomepage: true,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({ ...srv });
    setIsModalOpen(true);
  };

  const handleNameChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: (!editingService || !prev.slug)
        ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : prev.slug,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (srv) => {
    if (window.confirm(`Are you sure you want to remove service "${srv.name}"?`)) {
      deleteService(srv.id);
    }
  };

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const match =
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [services, categoryFilter, statusFilter, search]);

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Medical Services Management"
        subtitle="Configure clinical specialties, consultation tariffs, duration guidelines, and featured homepage services."
        breadcrumbs={[{ label: 'Services' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Medical Service</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service name, category, or description..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none"
            >
              <option value="ALL">All Statuses ({services.length})</option>
              <option value="Active">Active ({services.filter((s) => s.status === 'Active').length})</option>
              <option value="Inactive">Inactive ({services.filter((s) => s.status === 'Inactive').length})</option>
            </select>

            {(search || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="text-xs text-brand-600 hover:underline font-bold px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-600" />
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">
              Public Clinical Services
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold font-mono text-[10px]">
              {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'}
            </span>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">No services match the criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px]">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Fee & Duration</th>
                  <th className="py-3 px-3 text-center">Homepage</th>
                  <th className="py-3 px-3 text-center">Order</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Image & Service Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0 shadow-2xs"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {srv.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            /{srv.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {srv.category}
                      </span>
                    </td>

                    {/* Fee & Duration */}
                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">
                          {formatCurrency(srv.consultationFee)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {srv.estimatedDuration}
                        </span>
                      </div>
                    </td>

                    {/* Featured on Homepage */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleServiceHomepage(srv.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          srv.featuredOnHomepage
                            ? 'text-amber-600 bg-amber-50 border-amber-200'
                            : 'text-slate-300 bg-slate-50 border-slate-200'
                        }`}
                        title={srv.featuredOnHomepage ? 'Featured on Homepage' : 'Not on Homepage'}
                      >
                        <Star className={`w-3.5 h-3.5 ${srv.featuredOnHomepage ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Order */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                      {srv.displayOrder}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <ContentStatusBadge status={srv.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateService(srv.id)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate Service"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleServiceStatus(srv.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            srv.status === 'Active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={srv.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(srv)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingService ? `Edit Service — ${editingService.name}` : 'Add Medical Service'}
          subtitle="Define clinical specialty details, tariff, duration, and promotional imagery."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Consultant Pediatrics & Child OPD"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    }))
                  }
                  placeholder="pediatrics"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Specialist Clinic">Specialist Clinic</option>
                  <option value="Diagnostic & OPD">Diagnostic & OPD</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Preventive Care">Preventive Care</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Consultation Fee (PKR)
                </label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consultationFee: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedDuration: e.target.value,
                    }))
                  }
                  placeholder="e.g. 25 mins"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image: e.target.value }))
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) =>
                        setFormData((prev) => ({ ...prev, image: url }))
                      )
                    }
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-slate-800"
                  >
                    Pick
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description (Homepage summary)
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullDescription: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredHomepage"
                  checked={formData.featuredOnHomepage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredOnHomepage: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                />
                <label htmlFor="featuredHomepage" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature on Homepage Section
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Service
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

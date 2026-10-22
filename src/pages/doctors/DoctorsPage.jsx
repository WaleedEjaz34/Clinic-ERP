import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Power,
  Clock,
  Calendar,
  Mail,
  Phone,
  DollarSign,
  UserCheck,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatCurrency } from '../../utils/currency';
import { formatTime } from '../../utils/date';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DoctorsPage = () => {
  const { doctors, addDoctor, updateDoctor, toggleDoctorStatus, appointments, patients } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    email: '',
    consultationFee: 2500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { startTime: '09:00', endTime: '15:00' },
    status: 'Active',
    avatar: '',
    qualifications: '',
    bio: '',
  });

  // Unique specializations for filter dropdown
  const specializations = useMemo(() => {
    const specs = new Set(doctors.map((d) => d.specialization));
    return Array.from(specs);
  }, [doctors]);

  // Filtered dataset
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.phone.includes(q) ||
        doc.id.toLowerCase().includes(q);

      const matchSpec = selectedSpec === 'ALL' || doc.specialization === selectedSpec;
      const matchStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

      return matchSearch && matchSpec && matchStatus;
    });
  }, [doctors, search, selectedSpec, selectedStatus]);

  const hasActiveFilters = search !== '' || selectedSpec !== 'ALL' || selectedStatus !== 'ALL';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSpec('ALL');
    setSelectedStatus('ALL');
  };

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      phone: '',
      email: '',
      consultationFee: 2500,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { startTime: '09:00', endTime: '15:00' },
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      qualifications: 'MBBS, FCPS',
      bio: 'Experienced clinical practitioner committed to exceptional patient-centered care.',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      phone: doc.phone,
      email: doc.email,
      consultationFee: doc.consultationFee,
      availableDays: doc.availableDays || [],
      workingHours: doc.workingHours || { startTime: '09:00', endTime: '15:00' },
      status: doc.status,
      avatar: doc.avatar,
      qualifications: doc.qualifications || '',
      bio: doc.bio || '',
    });
    setIsAddEditOpen(true);
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization || !formData.phone) return;

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, formData);
    } else {
      addDoctor(formData);
    }
    setIsAddEditOpen(false);
  };

  const handleOpenDetail = (doc) => {
    setViewingDoctor(doc);
    setIsDetailOpen(true);
  };

  // Doctor detail metrics
  const doctorStats = useMemo(() => {
    if (!viewingDoctor) return { totalAppointments: 0, patientsTreated: 0, history: [] };
    const docAppointments = appointments.filter((a) => a.doctorId === viewingDoctor.id);
    const uniquePatients = new Set(docAppointments.map((a) => a.patientId));
    return {
      totalAppointments: docAppointments.length,
      patientsTreated: uniquePatients.size,
      history: docAppointments,
    };
  }, [viewingDoctor, appointments]);

  const toggleDay = (day) => {
    setFormData((prev) => {
      const current = prev.availableDays || [];
      if (current.includes(day)) {
        return { ...prev, availableDays: current.filter((d) => d !== day) };
      } else {
        return { ...prev, availableDays: [...current, day] };
      }
    });
  };

  const columns = [
    {
      key: 'id',
      label: 'Doctor ID',
      width: '100px',
      render: (val) => <span className="font-mono text-xs text-slate-500 font-semibold">{val}</span>,
    },
    {
      key: 'name',
      label: 'Doctor',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={val}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0"
          />
          <div>
            <span
              onClick={() => handleOpenDetail(row)}
              className="font-bold text-slate-900 block leading-tight hover:text-brand-600 transition-colors cursor-pointer"
            >
              {val}
            </span>
            <span className="text-[11px] text-brand-600 font-semibold">{row.specialization}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact Details',
      render: (val, row) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{val}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'consultationFee',
      label: 'Consultation Fee',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(val)}</span>,
    },
    {
      key: 'availableDays',
      label: 'Available Schedule',
      sortable: false,
      render: (val = [], row) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800">
            {val.length === 7 ? 'Daily' : `${val.length} Days/wk`}
          </span>
          <p className="text-[11px] text-slate-500">
            {formatTime(row.workingHours?.startTime)} – {formatTime(row.workingHours?.endTime)}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenDetail(row)}
            className="p-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 rounded-lg transition-colors shadow-2xs"
            title="View Doctor Profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Edit Doctor Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleDoctorStatus(row.id)}
            className={`p-1.5 rounded-lg border transition-colors shadow-2xs ${
              row.status === 'Active'
                ? 'text-slate-400 bg-slate-50 border-slate-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={row.status === 'Active' ? 'Deactivate Doctor' : 'Activate Doctor'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors Management"
        subtitle="Configure attending physicians, consultation fees, and OPD availability schedules."
        breadcrumbs={[{ label: 'Doctors' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 hover:shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Doctor</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search doctor by name, specialization, phone, or ID..."
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredDoctors.length}
      >
        <div className="min-w-[190px]">
          <SearchableSelect
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter specialization..."
          >
            <option value="ALL">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </SearchableSelect>
        </div>

        <div className="min-w-[140px]">
          <SearchableSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter status..."
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </SearchableSelect>
        </div>
      </FilterBar>

      {/* Responsive Data Table */}
      <DataTable
        columns={columns}
        data={filteredDoctors}
        keyField="id"
        emptyMessage="No doctors found matching the search criteria."
      />

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingDoctor ? `Edit Doctor — ${editingDoctor.name}` : 'Register New Doctor'}
        subtitle="Specify clinical credentials, OPD hours, and consultation charges."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Salman Khan"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialization *
              </label>
              <SearchableSelect
                required
                allowCustom={true}
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Select or enter specialization..."
                searchPlaceholder="Search or type custom specialty..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                options={specializations.map((s) => ({ value: s, label: s }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@medpulse.pk"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consultation Fee (PKR) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <SearchableSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search status..."
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </SearchableSelect>
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              OPD Working Hours
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.workingHours.startTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHours: { ...formData.workingHours, startTime: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.workingHours.endTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workingHours: { ...formData.workingHours, endTime: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Available Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const isSelected = formData.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 font-semibold shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qualifications & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qualifications & Degrees
              </label>
              <input
                type="text"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="MBBS, FCPS, MRCP"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profile Avatar URL
              </label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/20 transition-all min-h-[44px]"
            >
              {editingDoctor ? 'Update Doctor Record' : 'Save & Register Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Doctor Detail Modal (Section 6) */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Doctor Profile & Clinical Performance"
        maxWidth="max-w-3xl"
      >
        {viewingDoctor && (
          <div className="space-y-6">
            {/* Header profile info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={viewingDoctor.avatar}
                alt={viewingDoctor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{viewingDoctor.name}</h3>
                  <StatusBadge status={viewingDoctor.status} />
                </div>
                <p className="text-xs font-semibold text-brand-600">{viewingDoctor.specialization}</p>
                <p className="text-xs text-slate-500 mt-1">{viewingDoctor.qualifications}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</span>
                <p className="text-lg font-black text-slate-900">
                  {formatCurrency(viewingDoctor.consultationFee)}
                </p>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Bookings</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{doctorStats.totalAppointments}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Patients Treated</span>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">{doctorStats.patientsTreated}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Working Days</span>
                <p className="text-xl font-bold text-brand-600 mt-0.5">
                  {viewingDoctor.availableDays?.length || 0} Days/Wk
                </p>
              </div>
            </div>

            {/* Availability Schedule & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p><strong>Phone:</strong> {viewingDoctor.phone}</p>
                  <p><strong>Email:</strong> {viewingDoctor.email}</p>
                  <p><strong>Doctor ID:</strong> {viewingDoctor.id}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  OPD Schedule & Timing
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>
                    <strong>Working Hours:</strong>{' '}
                    {formatTime(viewingDoctor.workingHours?.startTime)} –{' '}
                    {formatTime(viewingDoctor.workingHours?.endTime)}
                  </p>
                  <p>
                    <strong>Available Days:</strong>{' '}
                    {viewingDoctor.availableDays?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor Appointments / Consultation History */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Consultation History & Patients
              </h4>
              {doctorStats.history.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No appointments recorded for this doctor.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {doctorStats.history.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-900">{apt.patientName}</span>
                        <p className="text-slate-500 text-[11px]">
                          {apt.date} at {formatTime(apt.time)} • {apt.visitType}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

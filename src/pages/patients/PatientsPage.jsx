import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Eye,
  Edit2,
  Power,
  Phone,
  Calendar,
  AlertTriangle,
  Receipt,
  CreditCard,
  FileText,
  Clock,
  MapPin,
  Heart,
  PlusCircle,
  FilePlus,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Tabs } from '../../components/common/Tabs';
import { formatCurrency } from '../../utils/currency';
import { formatDate, formatTime } from '../../utils/date';

export const PatientsPage = () => {
  const navigate = useNavigate();
  const {
    patients,
    addPatient,
    updatePatient,
    togglePatientStatus,
    appointments,
    prescriptions,
    bills,
    payments,
    openDocument,
    addToast,
  } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Notes state for Patient Detail
  const [newNoteText, setNewNoteText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '1995-01-01',
    age: 31,
    gender: 'Male',
    address: '',
    emergencyContact: '',
    registrationDate: new Date().toISOString().split('T')[0],
    bloodGroup: 'B+',
    notes: '',
    status: 'Active',
    outstandingBalance: 0,
  });

  // Duplicate phone warning check in frontend
  const duplicatePhoneDetected = useMemo(() => {
    if (!formData.phone || formData.phone.length < 7) return false;
    return patients.some((p) => {
      if (editingPatient && p.id === editingPatient.id) return false;
      return p.phone.replace(/\D/g, '') === formData.phone.replace(/\D/g, '');
    });
  }, [formData.phone, patients, editingPatient]);

  // Calculate age from DOB
  const handleDobChange = (dobString) => {
    let age = 30;
    if (dobString) {
      const birth = new Date(dobString);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
    }
    setFormData((prev) => ({ ...prev, dob: dobString, age: Math.max(0, age) }));
  };

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        pat.name.toLowerCase().includes(q) ||
        pat.phone.includes(q) ||
        pat.id.toLowerCase().includes(q) ||
        (pat.address && pat.address.toLowerCase().includes(q));

      const matchGender = selectedGender === 'ALL' || pat.gender === selectedGender;
      const matchStatus = selectedStatus === 'ALL' || pat.status === selectedStatus;

      return matchSearch && matchGender && matchStatus;
    });
  }, [patients, search, selectedGender, selectedStatus]);

  const hasActiveFilters = search !== '' || selectedGender !== 'ALL' || selectedStatus !== 'ALL';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGender('ALL');
    setSelectedStatus('ALL');
  };

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      phone: '',
      dob: '1995-01-01',
      age: 31,
      gender: 'Male',
      address: '',
      emergencyContact: '',
      registrationDate: new Date().toISOString().split('T')[0],
      bloodGroup: 'B+',
      notes: '',
      status: 'Active',
      outstandingBalance: 0,
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (pat) => {
    setEditingPatient(pat);
    setFormData({
      name: pat.name,
      phone: pat.phone,
      dob: pat.dob || '1995-01-01',
      age: pat.age || 30,
      gender: pat.gender || 'Male',
      address: pat.address || '',
      emergencyContact: pat.emergencyContact || '',
      registrationDate: pat.registrationDate || new Date().toISOString().split('T')[0],
      bloodGroup: pat.bloodGroup || 'B+',
      notes: pat.notes || '',
      status: pat.status || 'Active',
      outstandingBalance: pat.outstandingBalance || 0,
    });
    setIsAddEditOpen(true);
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
    } else {
      addPatient(formData);
    }
    setIsAddEditOpen(false);
  };

  const handleOpenDetail = (pat) => {
    setViewingPatient(pat);
    setActiveTab('overview');
    setIsDetailOpen(true);
  };

  // Associated clinical & financial records for viewing patient
  const patientRecords = useMemo(() => {
    if (!viewingPatient) return { apts: [], rxs: [], bills: [], pays: [] };
    const pApts = appointments.filter((a) => a.patientId === viewingPatient.id);
    const pRxs = prescriptions.filter((r) => r.patientId === viewingPatient.id);
    const pBills = bills.filter((b) => b.patientId === viewingPatient.id);
    const pPays = payments.filter((p) => p.patientId === viewingPatient.id);
    return {
      apts: pApts,
      rxs: pRxs,
      bills: pBills,
      pays: pPays,
      totalBilled: pBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0),
      totalPaid: pPays.reduce((acc, p) => acc + (p.amount || 0), 0),
    };
  }, [viewingPatient, appointments, prescriptions, bills, payments]);

  const handleAddPatientNote = () => {
    if (!newNoteText.trim() || !viewingPatient) return;
    const updatedNotes = viewingPatient.notes
      ? `${viewingPatient.notes}\n• [${formatDate(new Date())}] ${newNoteText.trim()}`
      : `• [${formatDate(new Date())}] ${newNoteText.trim()}`;

    updatePatient(viewingPatient.id, { notes: updatedNotes });
    setViewingPatient((prev) => ({ ...prev, notes: updatedNotes }));
    setNewNoteText('');
    addToast('success', 'Note Added', 'Clinical note appended to patient file.');
  };

  const columns = [
    {
      key: 'id',
      label: 'Patient ID',
      width: '110px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-600">{val}</span>,
    },
    {
      key: 'name',
      label: 'Patient Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600/15 via-brand-500/10 to-teal-500/20 text-brand-700 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-brand-200/60 shadow-2xs">
            {val.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <span
              onClick={() => handleOpenDetail(row)}
              className="font-bold text-slate-900 block leading-tight hover:text-brand-600 transition-colors cursor-pointer"
            >
              {val}
            </span>
            <span className="text-[11px] text-slate-500">
              {row.age} yrs • {row.gender} • Blood {row.bloodGroup || '—'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone & Emergency',
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 font-mono">{val}</span>
          {row.emergencyContact && (
            <p className="text-[11px] text-slate-500 truncate max-w-[180px] mt-0.5">
              ICE: {row.emergencyContact}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'registrationDate',
      label: 'Registered',
      render: (val) => <span className="text-xs text-slate-600 font-medium">{formatDate(val)}</span>,
    },
    {
      key: 'outstandingBalance',
      label: 'Balance Due',
      align: 'right',
      render: (val) => (
        <span
          className={`font-bold tabular-nums ${
            val > 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {formatCurrency(val)}
        </span>
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
            title="Open Patient 360 View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Edit Patient Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => togglePatientStatus(row.id)}
            className={`p-1.5 rounded-lg border transition-colors shadow-2xs ${
              row.status === 'Active'
                ? 'text-slate-400 bg-slate-50 border-slate-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={row.status === 'Active' ? 'Deactivate Patient' : 'Activate Patient'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Detail Modal Tabs Configuration (8 Tabs)
  const detailTabs = [
    { id: 'overview', label: '1. Overview' },
    { id: 'appointments', label: '2. Appointments', badge: patientRecords.apts.length },
    { id: 'history', label: '3. Visit History' },
    { id: 'prescriptions', label: '4. Prescriptions', badge: patientRecords.rxs.length },
    { id: 'bills', label: '5. Bills', badge: patientRecords.bills.length },
    { id: 'payments', label: '6. Payments', badge: patientRecords.pays.length },
    { id: 'balance', label: '7. Outstanding Balance' },
    { id: 'notes', label: '8. Notes' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Patients Management"
        subtitle="Manage permanent medical records, contact profiles, visit histories, and billing accounts."
        breadcrumbs={[{ label: 'Patients' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 hover:shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register Patient</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, phone, patient ID (PAT-...), or address..."
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredPatients.length}
      >
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </FilterBar>

      {/* Patients Data Table */}
      <DataTable
        columns={columns}
        data={filteredPatients}
        keyField="id"
        emptyMessage="No patient records found matching the specified filters."
      />

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingPatient ? `Edit Patient — ${editingPatient.name}` : 'Register New Patient'}
        subtitle="Permanent clinic record registration with demographic and emergency data."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSavePatient} className="space-y-4">
          {duplicatePhoneDetected && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Warning:</strong> A patient with this phone number is already registered in the system. Check for duplicate records.
              </span>
            </div>
          )}

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
                placeholder="e.g. Muhammad Asif"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Phone Number *
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
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleDobChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact (ICE)
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="+92 300 0000000 (Spouse/Brother)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House, Street, Sector, City"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical & Allergy Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Known drug allergies, chronic conditions (HTN, Diabetes)..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all"
            >
              {editingPatient ? 'Update Patient Record' : 'Register Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Patient Detail 8-Tab 360-degree Modal (Section 7) */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={viewingPatient ? `Patient 360° Profile — ${viewingPatient.name} (${viewingPatient.id})` : 'Patient Profile'}
        maxWidth="max-w-4xl"
      >
        {viewingPatient && (
          <div className="space-y-5">
            {/* Quick Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{viewingPatient.name}</h3>
                  <StatusBadge status={viewingPatient.status} />
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  ID: <span className="font-mono font-bold">{viewingPatient.id}</span> • {viewingPatient.age} yrs • {viewingPatient.gender} • Blood Group: <span className="font-bold text-rose-600">{viewingPatient.bloodGroup}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  📞 {viewingPatient.phone} | 📍 {viewingPatient.address || 'Islamabad, Pakistan'}
                </p>
              </div>

              {/* Contextual actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    navigate('/appointments');
                  }}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    navigate('/payments');
                  }}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Collect Payment
                </button>
              </div>
            </div>

            {/* 8 Tabs Header */}
            <Tabs
              tabs={detailTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Visits</span>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{patientRecords.apts.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Invoiced</span>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(patientRecords.totalBilled)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Paid</span>
                    <p className="text-xl font-bold text-emerald-600 mt-0.5">{formatCurrency(patientRecords.totalPaid)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Outstanding Balance</span>
                    <p className={`text-xl font-bold mt-0.5 ${viewingPatient.outstandingBalance > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatCurrency(viewingPatient.outstandingBalance)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider">Demographic Profile</h4>
                    <p><strong>Emergency Contact:</strong> {viewingPatient.emergencyContact || 'None'}</p>
                    <p><strong>Registration Date:</strong> {formatDate(viewingPatient.registrationDate)}</p>
                    <p><strong>Date of Birth:</strong> {viewingPatient.dob} ({viewingPatient.age} years old)</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider">Clinical Background</h4>
                    <p className="text-slate-600 leading-relaxed">{viewingPatient.notes || 'No baseline notes recorded.'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Appointments */}
            {activeTab === 'appointments' && (
              <div>
                {patientRecords.apts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No appointments on record for this patient.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {patientRecords.apts.map((apt) => (
                      <div key={apt.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                        <div>
                          <span className="font-bold text-slate-900">{apt.id} • {apt.doctorName}</span>
                          <p className="text-slate-500">{apt.date} at {formatTime(apt.time)} ({apt.visitType})</p>
                          <p className="text-slate-600 italic mt-0.5">{apt.reason}</p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Visit History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Chronological timeline of OPD clinic encounters:</p>
                <div className="border-l-2 border-brand-500 pl-4 space-y-4 ml-2">
                  {patientRecords.apts.map((apt, idx) => (
                    <div key={idx} className="relative text-xs">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-brand-50" />
                      <span className="font-bold text-slate-900">{formatDate(apt.date)}</span>
                      <p className="text-slate-700 font-medium">{apt.doctorName} — {apt.visitType}</p>
                      <p className="text-slate-500">{apt.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Prescriptions */}
            {activeTab === 'prescriptions' && (
              <div>
                {patientRecords.rxs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No prescriptions generated yet.</p>
                ) : (
                  <div className="space-y-3">
                    {patientRecords.rxs.map((rx) => (
                      <div key={rx.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{rx.id}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600">{formatDate(rx.prescriptionDate)}</span>
                          </div>
                          <p className="font-semibold text-brand-700 mt-1">{rx.diagnosis}</p>
                          <p className="text-slate-500 mt-0.5">By {rx.doctorName} • {rx.medicines?.length || 0} Medicines</p>
                        </div>
                        <button
                          onClick={() => openDocument('prescription', rx)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium text-slate-700"
                        >
                          View & Print
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Bills */}
            {activeTab === 'bills' && (
              <div>
                {patientRecords.bills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No bills on record.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {patientRecords.bills.map((b) => (
                      <div key={b.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <span className="font-bold text-slate-900">{b.billNumber}</span>
                          <span className="text-slate-400 ml-2">{formatDate(b.billDate)}</span>
                          <p className="text-slate-500">Doctor: {b.doctorName}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{formatCurrency(b.totalAmount)}</span>
                          <StatusBadge status={b.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 6: Payments */}
            {activeTab === 'payments' && (
              <div>
                {patientRecords.pays.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No payment receipts recorded.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {patientRecords.pays.map((p) => (
                      <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <span className="font-bold text-slate-900">{p.receiptNumber}</span>
                          <span className="text-slate-400 ml-2">{formatDate(p.paymentDate)} via {p.paymentMethod}</span>
                          <p className="text-slate-500">Bill: {p.billNumber}</p>
                        </div>
                        <span className="font-bold text-emerald-600 text-sm">{formatCurrency(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 7: Outstanding Balance */}
            {activeTab === 'balance' && (
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500">Current Outstanding Balance</span>
                    <h3 className="text-2xl font-black text-rose-600 mt-1">
                      {formatCurrency(viewingPatient.outstandingBalance)}
                    </h3>
                  </div>
                  {viewingPatient.outstandingBalance > 0 && (
                    <button
                      onClick={() => {
                        setIsDetailOpen(false);
                        navigate('/payments');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Collect Outstanding Balance
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The outstanding balance reflects all unpaid and partially paid bills for this patient. Payments collected in the Payment Collection module immediately reduce this balance and update financial accounts.
                </p>
              </div>
            )}

            {/* Tab 8: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Append Doctor / Receptionist Note
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Type clinical progress note, allergic incident, or reception reminder..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPatientNote();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddPatientNote}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Existing Medical & Administrative Notes
                  </h4>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {viewingPatient.notes || 'No notes currently recorded.'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

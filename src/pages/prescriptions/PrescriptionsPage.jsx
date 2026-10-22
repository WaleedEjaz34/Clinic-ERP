import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Eye,
  Edit2,
  Stethoscope,
  Calendar,
  User,
  FlaskConical,
  Pill,
  Save,
  Check,
  Search,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatDate } from '../../utils/date';
import { generatePrescriptionPDF } from '../../services/documentService';
import { commonMedicines } from '../../data/mockMedicines';

export const PrescriptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    prescriptions,
    doctors,
    patients,
    appointments,
    addPrescription,
    updatePrescription,
    openDocument,
  } = useClinic();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');

  // Consultation / Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRx, setEditingRx] = useState(null);

  // Prescription Form State
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    complaint: '',
    diagnosis: '',
    doctorNotes: '',
    followUpDate: '',
    status: 'Finalized',
    medicines: [
      {
        id: '1',
        name: 'Panadol (Paracetamol)',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily)',
        duration: '5 Days',
        instructions: 'Take after meals',
      },
    ],
    tests: [
      {
        id: '1',
        name: 'Complete Blood Picture (CBC)',
        instructions: 'Baseline infection marker',
      },
    ],
  });

  // Check if opened from an appointment navigation (e.g. from Appointment "Start Consultation")
  useEffect(() => {
    if (location.state?.fromAppointment) {
      const apt = location.state.fromAppointment;
      setEditingRx(null);
      setFormData({
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId: apt.id,
        prescriptionDate: apt.date || new Date().toISOString().split('T')[0],
        complaint: apt.reason || '',
        diagnosis: '',
        doctorNotes: apt.notes || '',
        followUpDate: '',
        status: 'Finalized',
        medicines: [
          {
            id: '1',
            name: '',
            dosage: '1 Tab',
            frequency: '1-0-1 (Twice daily)',
            duration: '7 Days',
            instructions: 'Take after food',
          },
        ],
        tests: [],
      });
      setIsEditorOpen(true);
      // clear router state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filtered prescriptions
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((rx) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        rx.id.toLowerCase().includes(q) ||
        rx.patientName.toLowerCase().includes(q) ||
        rx.doctorName.toLowerCase().includes(q) ||
        (rx.diagnosis && rx.diagnosis.toLowerCase().includes(q));

      const matchDoc = selectedDoctor === 'ALL' || rx.doctorId === selectedDoctor;
      return matchSearch && matchDoc;
    });
  }, [prescriptions, search, selectedDoctor]);

  const handleOpenNew = () => {
    setEditingRx(null);
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      appointmentId: '',
      prescriptionDate: new Date().toISOString().split('T')[0],
      complaint: '',
      diagnosis: '',
      doctorNotes: '',
      followUpDate: '',
      status: 'Finalized',
      medicines: [
        {
          id: '1',
          name: '',
          dosage: '500 mg',
          frequency: '1-0-1',
          duration: '5 Days',
          instructions: 'After meals',
        },
      ],
      tests: [],
    });
    setIsEditorOpen(true);
  };

  // React to Sub-Tab navigation
  useEffect(() => {
    const action = searchParams.get('action');
    const tab = searchParams.get('tab');

    if (action === 'new') {
      handleOpenNew();
    } else if (action === 'print') {
      if (prescriptions.length > 0) {
        const rx = prescriptions[0];
        const p = patients.find((pat) => pat.id === rx.patientId);
        const d = doctors.find((doc) => doc.id === rx.doctorId);
        openDocument(generatePrescriptionPDF(rx, p, d));
      }
    } else if (tab === 'history') {
      setSearch('');
      setSelectedDoctor('ALL');
    }
  }, [searchParams, prescriptions, patients, doctors]);

  const handleOpenEdit = (rx) => {
    setEditingRx(rx);
    setFormData({
      patientId: rx.patientId,
      doctorId: rx.doctorId,
      appointmentId: rx.appointmentId || '',
      prescriptionDate: rx.prescriptionDate,
      complaint: rx.complaint || '',
      diagnosis: rx.diagnosis || '',
      doctorNotes: rx.doctorNotes || '',
      followUpDate: rx.followUpDate || '',
      status: rx.status || 'Finalized',
      medicines: rx.medicines && rx.medicines.length > 0 ? rx.medicines : [],
      tests: rx.tests && rx.tests.length > 0 ? rx.tests : [],
    });
    setIsEditorOpen(true);
  };

  // Medicine Rows Management
  const addMedicineRow = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          id: String(Date.now()),
          name: '',
          dosage: '1 Tab',
          frequency: '1-0-1',
          duration: '5 Days',
          instructions: 'Take after meals',
        },
      ],
    }));
  };

  const updateMedicineRow = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.medicines];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, medicines: updated };
    });
  };

  const removeMedicineRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, idx) => idx !== index),
    }));
  };

  // Tests Rows Management
  const addTestRow = () => {
    setFormData((prev) => ({
      ...prev,
      tests: [
        ...prev.tests,
        {
          id: String(Date.now()),
          name: '',
          instructions: 'Fasting sample required',
        },
      ],
    }));
  };

  const updateTestRow = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.tests];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tests: updated };
    });
  };

  const removeTestRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      tests: prev.tests.filter((_, idx) => idx !== index),
    }));
  };

  const handleSavePrescription = (isDraft = false) => {
    if (!formData.patientId || !formData.doctorId) return;

    const payload = {
      ...formData,
      status: isDraft ? 'Draft' : 'Finalized',
    };

    if (editingRx) {
      updatePrescription(editingRx.id, payload);
    } else {
      addPrescription(payload);
    }
    setIsEditorOpen(false);
  };

  const columns = [
    {
      key: 'id',
      label: 'Prescription ID',
      width: '120px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-700">{val}</span>,
    },
    {
      key: 'prescriptionDate',
      label: 'Date',
      render: (val) => <span className="text-slate-600">{formatDate(val)}</span>,
    },
    {
      key: 'patientName',
      label: 'Patient',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600/15 via-brand-500/10 to-teal-500/20 text-brand-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 border border-brand-200/60 shadow-2xs">
            {val.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">{val}</span>
            <span className="text-[11px] text-slate-500 font-mono">{row.patientId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
          <Stethoscope className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'diagnosis',
      label: 'Clinical Diagnosis',
      render: (val) => (
        <span className="font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full text-[11px] max-w-xs truncate block border border-teal-200/90 shadow-2xs">
          {val || 'General Consultation'}
        </span>
      ),
    },
    {
      key: 'followUpDate',
      label: 'Follow-up Date',
      render: (val) => (val ? <span className="text-brand-600 font-semibold">{formatDate(val)}</span> : <span className="text-slate-400">—</span>),
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
            onClick={() => openDocument('prescription', row)}
            className="p-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 rounded-lg transition-colors shadow-2xs"
            title="View & Print Document"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => generatePrescriptionPDF(row)}
            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition-colors shadow-2xs"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Edit Prescription"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Consultations & Prescriptions"
        subtitle="Clinical diagnostic workspace for doctors to write prescriptions, lab investigations, and dietary guidance."
        breadcrumbs={[{ label: 'Prescriptions' }]}
        actions={
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 hover:shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Prescription</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search prescription ID, patient, doctor, or diagnosis..."
        hasActiveFilters={search !== '' || selectedDoctor !== 'ALL'}
        onResetFilters={() => {
          setSearch('');
          setSelectedDoctor('ALL');
        }}
        totalResults={filteredPrescriptions.length}
      >
        <div className="min-w-[190px]">
          <SearchableSelect
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter by attending doctor..."
          >
            <option value="ALL">All Attending Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </SearchableSelect>
        </div>
      </FilterBar>


      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPrescriptions}
        keyField="id"
        emptyMessage="No clinical prescriptions recorded matching criteria."
      />

      {/* Consultation & Prescription Editor Modal (Section 9) */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          if (searchParams.get('action')) setSearchParams({});
        }}
        title={editingRx ? `Edit Prescription — ${editingRx.id}` : 'Doctor Clinical Consultation & Prescription'}
        subtitle="Electronic medical record editor with medications, dosages, investigations, and follow-up plan."
        maxWidth="max-w-4xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSavePrescription(false);
          }}
          className="space-y-5"
        >
          {/* Top Row: Patient, Doctor, Appointment, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Patient *
              </label>
              <SearchableSelect
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                searchPlaceholder="Search patient name or ID..."
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </SearchableSelect>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Attending Doctor *
              </label>
              <SearchableSelect
                required
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                searchPlaceholder="Search doctor or specialty..."
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </SearchableSelect>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Appointment Reference
              </label>
              <SearchableSelect
                allowCustom={true}
                value={formData.appointmentId}
                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                placeholder="Select appointment or Walk-in"
                searchPlaceholder="Search appointment ID or patient..."
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                options={[
                  { value: 'Walk-in', label: 'Walk-in Consultation' },
                  ...appointments.map((apt) => ({
                    value: apt.id,
                    label: `${apt.id} — ${apt.patientName}`,
                    sublabel: `${apt.doctorName} • ${apt.date} (${apt.time})`,
                  })),
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.prescriptionDate}
                onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              />
            </div>
          </div>

          {/* Clinical Symptoms & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chief Complaints & Symptoms
              </label>
              <textarea
                rows={2}
                value={formData.complaint}
                onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                placeholder="e.g. Severe headache, fever, nausea for past 3 days..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Diagnosis *
              </label>
              <textarea
                rows={2}
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Acute Viral Bronchitis, Essential Hypertension..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          {/* Multi-Row Medicines Builder (Rx) */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-serif font-black text-brand-600">℞</span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Prescribed Medicines
                </h4>
              </div>
              <button
                type="button"
                onClick={addMedicineRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.medicines.map((med, idx) => (
                <div
                  key={med.id || idx}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="col-span-12 sm:col-span-3">
                    <SearchableSelect
                      allowCustom={true}
                      value={med.name}
                      onChange={(e) => {
                        const chosenVal = e.target.value;
                        updateMedicineRow(idx, 'name', chosenVal);
                        const matched = commonMedicines.find(
                          (m) => m.name.toLowerCase() === chosenVal.toLowerCase()
                        );
                        if (matched) {
                          if (!med.dosage) updateMedicineRow(idx, 'dosage', matched.dosage);
                          if (!med.frequency) updateMedicineRow(idx, 'frequency', matched.frequency);
                          if (!med.duration) updateMedicineRow(idx, 'duration', matched.duration);
                          if (!med.instructions) updateMedicineRow(idx, 'instructions', matched.instructions);
                        }
                      }}
                      placeholder="Select or type medicine..."
                      searchPlaceholder="Search 25+ medicines..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs font-semibold bg-white"
                      options={commonMedicines.map((m) => ({
                        value: m.name,
                        label: m.name,
                        sublabel: `${m.category} • ${m.dosage}`,
                      }))}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Dosage (500mg)"
                      value={med.dosage}
                      onChange={(e) => updateMedicineRow(idx, 'dosage', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Freq (1-0-1)"
                      value={med.frequency}
                      onChange={(e) => updateMedicineRow(idx, 'frequency', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Duration (7 days)"
                      value={med.duration}
                      onChange={(e) => updateMedicineRow(idx, 'duration', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>

                  <div className="col-span-5 sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Instructions (after meals)"
                      value={med.instructions}
                      onChange={(e) => updateMedicineRow(idx, 'instructions', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Investigations & Tests Builder */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Advised Lab Investigations & Diagnostic Tests
              </h4>
              <button
                type="button"
                onClick={addTestRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Investigation</span>
              </button>
            </div>

            {formData.tests.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No diagnostic lab tests advised.</p>
            ) : (
              <div className="space-y-2">
                {formData.tests.map((test, idx) => (
                  <div
                    key={test.id || idx}
                    className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Test Name (e.g. Serum Creatinine)"
                        value={test.name}
                        onChange={(e) => updateTestRow(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white font-medium"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Clinical instructions (e.g. 12hr fasting)"
                        value={test.instructions}
                        onChange={(e) => updateTestRow(idx, 'instructions', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeTestRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Doctor Notes & Follow up date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary & General Clinical Advice
              </label>
              <textarea
                rows={2}
                value={formData.doctorNotes}
                onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
                placeholder="e.g. Low sodium diet, 30 min daily brisk walk, return if fever persists..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Next Follow-up Review Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSavePrescription(true)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Save as Draft
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save & Finalize Prescription</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

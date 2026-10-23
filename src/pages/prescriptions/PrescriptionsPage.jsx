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
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  CheckSquare,
  Square,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
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
    medicines: masterMedicines = [],
    tests: masterTests = [],
  } = useClinic();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');

  // Consultation / Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRx, setEditingRx] = useState(null);

  // Multi-Test Bulk Selector Modal
  const [isBulkTestModalOpen, setIsBulkTestModalOpen] = useState(false);
  const [bulkTestSearch, setBulkTestSearch] = useState('');
  const [bulkTestCategory, setBulkTestCategory] = useState('ALL');

  // Active medicines & tests from master
  const activeMedicines = useMemo(() => {
    return (masterMedicines || []).filter((m) => m.status === 'Active');
  }, [masterMedicines]);

  const activeTests = useMemo(() => {
    return (masterTests || []).filter((t) => t.status === 'Active');
  }, [masterTests]);

  // Unique categories of tests
  const testCategories = useMemo(() => {
    const set = new Set();
    activeTests.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [activeTests]);

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
        dosageForm: 'Tablet',
        frequency: '1-1-1 (Thrice daily)',
        duration: '5 Days',
        instructions: 'Take after meals for fever or pain relief with water',
      },
    ],
    tests: [
      {
        id: '1',
        name: 'Complete Blood Count (CBC) with ESR (CBC)',
        instructions: 'No fasting required. Maintain normal hydration. Water permitted.',
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
            dosage: '500 mg',
            dosageForm: 'Tablet',
            frequency: '1-0-1 (Twice daily)',
            duration: '5 Days',
            instructions: 'Take after meals with water',
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

    // Initial default medicine from master if available
    const initialMed = activeMedicines[0] || {
      name: 'Panadol',
      genericName: 'Paracetamol',
      dosage: '500 mg',
      dosageForm: 'Tablet',
      frequency: '1-1-1 (Thrice daily)',
      duration: '5 Days',
      instructions: 'Take after meals with water',
    };

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
          name: initialMed.genericName ? `${initialMed.name} (${initialMed.genericName})` : initialMed.name,
          dosage: initialMed.dosage,
          dosageForm: initialMed.dosageForm || 'Tablet',
          frequency: initialMed.frequency,
          duration: initialMed.duration,
          instructions: initialMed.instructions,
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

  // ==========================================
  // MEDICINE ROWS MANAGEMENT
  // ==========================================
  const addMedicineRow = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          id: String(Date.now()),
          name: '',
          dosage: '500 mg',
          dosageForm: 'Tablet',
          frequency: '1-0-1 (Twice daily)',
          duration: '5 Days',
          instructions: 'Take after meals with water',
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

  const handleMedicineSelect = (index, selectedValue) => {
    if (!selectedValue) return;

    // Look up in activeMedicines
    const matched = activeMedicines.find(
      (m) =>
        m.id === selectedValue ||
        m.name.toLowerCase() === selectedValue.toLowerCase() ||
        `${m.name} (${m.genericName})`.toLowerCase() === selectedValue.toLowerCase() ||
        `${m.name} - ${m.genericName}`.toLowerCase() === selectedValue.toLowerCase()
    );

    if (matched) {
      const displayName = matched.genericName
        ? `${matched.name} (${matched.genericName})`
        : matched.name;

      setFormData((prev) => {
        const updated = [...prev.medicines];
        updated[index] = {
          ...updated[index],
          name: displayName,
          dosage: matched.dosage || updated[index].dosage || '',
          dosageForm: matched.dosageForm || 'Tablet',
          frequency: matched.frequency || updated[index].frequency || '1-0-1 (Twice daily)',
          duration: matched.duration || updated[index].duration || '5 Days',
          instructions: matched.instructions || updated[index].instructions || '',
          category: matched.category || '',
          autoFilled: true,
        };
        return { ...prev, medicines: updated };
      });
    } else {
      updateMedicineRow(index, 'name', selectedValue);
    }
  };

  const removeMedicineRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, idx) => idx !== index),
    }));
  };

  // ==========================================
  // TESTS ROWS & MULTI-SELECT MANAGEMENT
  // ==========================================
  const addTestRow = () => {
    setFormData((prev) => ({
      ...prev,
      tests: [
        ...prev.tests,
        {
          id: String(Date.now()),
          name: '',
          instructions: 'No special preparation required.',
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

  const handleSingleTestSelect = (index, selectedValue) => {
    if (!selectedValue) return;

    const matched = activeTests.find(
      (t) =>
        t.id === selectedValue ||
        t.name.toLowerCase() === selectedValue.toLowerCase() ||
        `${t.name} (${t.shortCode})`.toLowerCase() === selectedValue.toLowerCase() ||
        t.shortCode?.toLowerCase() === selectedValue.toLowerCase()
    );

    if (matched) {
      const displayName = matched.shortCode
        ? `${matched.name} (${matched.shortCode})`
        : matched.name;

      setFormData((prev) => {
        const updated = [...prev.tests];
        updated[index] = {
          ...updated[index],
          name: displayName,
          instructions: matched.instructions || updated[index].instructions || '',
          notes: matched.notes || '',
          category: matched.category || '',
          shortCode: matched.shortCode || '',
          autoFilled: true,
        };
        return { ...prev, tests: updated };
      });
    } else {
      updateTestRow(index, 'name', selectedValue);
    }
  };

  const isTestSelected = (masterTest) => {
    return formData.tests.some(
      (t) =>
        t.id === masterTest.id ||
        t.name.toLowerCase() === masterTest.name.toLowerCase() ||
        (masterTest.shortCode && t.name.includes(`(${masterTest.shortCode})`)) ||
        t.name.toLowerCase().startsWith(masterTest.name.toLowerCase())
    );
  };

  const toggleDiagnosticTest = (masterTest) => {
    const existingIndex = formData.tests.findIndex(
      (t) =>
        t.id === masterTest.id ||
        t.name.toLowerCase() === masterTest.name.toLowerCase() ||
        (masterTest.shortCode && t.name.includes(`(${masterTest.shortCode})`)) ||
        t.name.toLowerCase().startsWith(masterTest.name.toLowerCase())
    );

    if (existingIndex >= 0) {
      // Remove it
      setFormData((prev) => ({
        ...prev,
        tests: prev.tests.filter((_, idx) => idx !== existingIndex),
      }));
    } else {
      // Add with auto-filled defaults
      const displayName = masterTest.shortCode
        ? `${masterTest.name} (${masterTest.shortCode})`
        : masterTest.name;

      setFormData((prev) => ({
        ...prev,
        tests: [
          ...prev.tests,
          {
            id: masterTest.id || String(Date.now()),
            name: displayName,
            instructions: masterTest.instructions || 'No special preparation required.',
            notes: masterTest.notes || '',
            category: masterTest.category || '',
            shortCode: masterTest.shortCode || '',
            autoFilled: true,
          },
        ],
      }));
    }
  };

  // Filtered tests for the bulk selector modal
  const filteredBulkTests = useMemo(() => {
    return activeTests.filter((t) => {
      const q = bulkTestSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.shortCode && t.shortCode.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.instructions && t.instructions.toLowerCase().includes(q));

      const matchCategory = bulkTestCategory === 'ALL' || t.category === bulkTestCategory;
      return matchSearch && matchCategory;
    });
  }, [activeTests, bulkTestSearch, bulkTestCategory]);

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
      key: 'medicines',
      label: 'Prescribed Items',
      render: (_, row) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold border border-teal-200/60">
            <Pill className="w-3 h-3" />
            {row.medicines?.length || 0} Meds
          </span>
          {row.tests?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
              <FlaskConical className="w-3 h-3" />
              {row.tests.length} Tests
            </span>
          )}
        </div>
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
            className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors shadow-2xs"
            title="Edit Consultation"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Clinical Prescriptions"
        subtitle="Manage digital consultations, medical notes, prescribed formulas, and lab investigations."
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/prescriptions/medicines')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-300 hover:border-teal-300 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            title="Manage Predefined Medicines Master"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Medicines</span>
            <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] rounded-full font-bold">
              {activeMedicines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prescriptions/tests')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-300 hover:border-indigo-300 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            title="Manage Predefined Diagnostic Tests Master"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Tests</span>
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[10px] rounded-full font-bold">
              {activeTests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-brand-500/25 transition-all hover:shadow-glow active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Prescription</span>
          </button>
        </div>
      </PageHeader>

      {/* Module Navigation Sub-Tabs Banner */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/prescriptions')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white text-brand-700 font-bold rounded-xl shadow-xs border border-brand-200/80 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Prescription Records</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-50 text-brand-700 font-extrabold">
              {prescriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prescriptions/medicines')}
            className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Medicines Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {masterMedicines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prescriptions/tests')}
            className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span>Diagnostic Tests Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {masterTests.length}
            </span>
          </button>
        </div>

        <span className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pr-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Predefined masters connected directly with Rx creation
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Rx ID, patient name, doctor, or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <SearchableSelect
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
              searchPlaceholder="Filter doctor..."
            >
              <option value="ALL">All Attending Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialization})
                </option>
              ))}
            </SearchableSelect>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredPrescriptions}
        emptyMessage="No prescriptions match your search criteria."
      />

      {/* ========================================================= */}
      {/* CONSULTATION & PRESCRIPTION CREATION MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingRx ? `Edit Prescription #${editingRx.id}` : 'Create Clinical Digital Prescription'}
        size="xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSavePrescription(false);
          }}
          className="space-y-5"
        >
          {/* Header Metadata: Patient, Doctor, Appointment Ref, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Patient *
              </label>
              <SearchableSelect
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium"
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
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium"
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
                placeholder="Walk-in Consultation"
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
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: PRESCRIBED MEDICINES BUILDER (AUTO-POPULATED) */}
          {/* ========================================================= */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif font-black text-brand-600">℞</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Prescribed Medicines
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Select from Medicine Master to auto-fill dosage, dosage form, frequency, duration & instructions.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/prescriptions/medicines')}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50/70 hover:bg-teal-100/70 px-2.5 py-1 rounded-lg transition-colors border border-teal-200/60"
                  title="Open Medicine Master in full screen"
                >
                  <Pill className="w-3 h-3 text-teal-600" />
                  <span>Medicine Master</span>
                </button>
                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-lg shadow-2xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Medicine</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.medicines.map((med, idx) => (
                <div
                  key={med.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-3 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>Medicine #{idx + 1}</span>
                      </span>
                      {med.dosageForm && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-800 border border-teal-200">
                          {med.dosageForm}
                        </span>
                      )}
                      <span className="text-[10px] text-teal-700 font-medium hidden sm:inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Defaults auto-filled (freely editable)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMedicineRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Searchable Medicine Selector from Master */}
                  <div className="w-full">
                    <SearchableSelect
                      allowCustom={true}
                      value={med.name}
                      onChange={(e) => handleMedicineSelect(idx, e.target.value)}
                      placeholder="Search and select medicine from master catalog..."
                      searchPlaceholder="Search 25+ medicines by brand, generic formula, strength..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white shadow-2xs"
                      options={activeMedicines.map((m) => ({
                        value: m.genericName ? `${m.name} (${m.genericName})` : m.name,
                        label: m.genericName ? `${m.name} (${m.genericName})` : m.name,
                        sublabel: `${m.dosageForm} • ${m.dosage} • ${m.frequency} • ${m.instructions}`,
                      }))}
                    />
                  </div>

                  {/* Pre-filled Editable Clinical Parameters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Strength / Dosage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 500 mg"
                        value={med.dosage}
                        onChange={(e) => updateMedicineRow(idx, 'dosage', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Frequency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1-0-1 (Twice daily)"
                        value={med.frequency}
                        onChange={(e) => updateMedicineRow(idx, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium text-brand-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Days"
                        value={med.duration}
                        onChange={(e) => updateMedicineRow(idx, 'duration', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Dosage Form
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tablet, Syrup"
                        value={med.dosageForm || 'Tablet'}
                        onChange={(e) => updateMedicineRow(idx, 'dosageForm', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Administration Instructions (Auto-filled from master, customizable)
                    </label>
                    <input
                      type="text"
                      placeholder="Instructions (e.g. Take after meals with plenty of water)"
                      value={med.instructions}
                      onChange={(e) => updateMedicineRow(idx, 'instructions', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: ADVISED DIAGNOSTIC & LAB INVESTIGATIONS */}
          {/* ========================================================= */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Advised Lab Investigations & Diagnostic Tests
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Select single or multiple diagnostic tests. Preparation instructions and clinical notes pre-fill automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkTestModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition-colors shadow-2xs"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Multi-Select Tests</span>
                </button>
                <button
                  type="button"
                  onClick={addTestRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Investigation</span>
                </button>
              </div>
            </div>

            {/* Quick-Select Diagnostic Chips Bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>Quick-Add Common Diagnostic Tests:</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to toggle on/off</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeTests.slice(0, 10).map((t) => {
                  const selected = isTestSelected(t);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleDiagnosticTest(t)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-500'
                          : 'bg-white text-slate-700 border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                      title={t.instructions}
                    >
                      {selected ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                      <span>{t.shortCode || t.name}</span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                          selected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {t.category.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configured Investigation Rows */}
            {formData.tests.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center">
                <FlaskConical className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500 font-medium">No diagnostic investigations selected.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click any quick test chip above, choose "Multi-Select Tests", or click "Add Investigation".
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {formData.tests.map((test, idx) => (
                  <div
                    key={test.id || idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Investigation #{idx + 1}</span>
                        {test.category && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-semibold">
                            {test.category}
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTestRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Searchable Select from Diagnostic Test Master */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Investigation Name (Search Master)
                        </label>
                        <SearchableSelect
                          allowCustom={true}
                          value={test.name}
                          onChange={(e) => handleSingleTestSelect(idx, e.target.value)}
                          placeholder="Select test from master catalog or type custom..."
                          searchPlaceholder="Search 20+ tests by name or code (e.g. CBC, FBS, LFT)..."
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 bg-white"
                          options={activeTests.map((t) => ({
                            value: t.shortCode ? `${t.name} (${t.shortCode})` : t.name,
                            label: t.shortCode ? `${t.name} (${t.shortCode})` : t.name,
                            sublabel: `${t.category} • Prep: ${t.instructions}`,
                          }))}
                        />
                      </div>

                      {/* Pre-filled Preparation Instructions */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Patient Preparation Guidelines (Auto-filled, editable)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 10-12 hours overnight fasting required"
                          value={test.instructions}
                          onChange={(e) => updateTestRow(idx, 'instructions', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-medium text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Advice & Follow-Up */}
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSavePrescription(true)}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              Save as Draft
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="flex-1 sm:flex-initial px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save & Finalize Prescription</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MULTI-SELECT DIAGNOSTIC TESTS PICKER MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isBulkTestModalOpen}
        onClose={() => setIsBulkTestModalOpen(false)}
        title="Multi-Select Diagnostic Tests from Master Catalog"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Select one or multiple diagnostic tests to advise in this prescription. Preparation instructions and clinical notes will pre-fill automatically.
          </p>

          {/* Search & Category Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tests by name or code (CBC, FBS, HbA1c)..."
                value={bulkTestSearch}
                onChange={(e) => setBulkTestSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <SearchableSelect
                value={bulkTestCategory}
                onChange={(e) => setBulkTestCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
              >
                <option value="ALL">All Categories</option>
                {testCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SearchableSelect>
            </div>
          </div>

          {/* Interactive Checkbox List */}
          <div className="max-h-80 overflow-y-auto space-y-2 border border-slate-200 rounded-2xl p-2 bg-slate-50/50">
            {filteredBulkTests.length === 0 ? (
              <p className="p-4 text-center text-xs text-slate-400">
                No diagnostic tests match your search.
              </p>
            ) : (
              filteredBulkTests.map((t) => {
                const selected = isTestSelected(t);
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleDiagnosticTest(t)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      selected
                        ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-400/50 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 text-indigo-600 flex-shrink-0">
                      {selected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{t.name}</span>
                        {t.shortCode && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
                            {t.shortCode}
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        <strong className="text-slate-700">Prep:</strong> {t.instructions}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-600 font-medium">
              Currently selected: <strong className="text-indigo-700">{formData.tests.length} tests</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsBulkTestModalOpen(false)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Done Selecting
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

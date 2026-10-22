import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Printer,
  Download,
  CreditCard,
  Calculator,
  Calendar,
  User,
  Stethoscope,
  Tag,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generateBillPDF } from '../../services/documentService';

export const BillsPage = () => {
  const navigate = useNavigate();
  const {
    bills,
    patients,
    doctors,
    appointments,
    addBill,
    updateBill,
    openDocument,
  } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    billDate: new Date().toISOString().split('T')[0],
    consultationFee: 2500,
    procedureCharges: 0,
    testCharges: 0,
    otherCharges: 0,
    discount: 0,
    notes: '',
  });

  // Calculate live totals for the modal form
  const formCalculations = useMemo(() => {
    const con = Number(formData.consultationFee) || 0;
    const proc = Number(formData.procedureCharges) || 0;
    const test = Number(formData.testCharges) || 0;
    const other = Number(formData.otherCharges) || 0;
    const disc = Number(formData.discount) || 0;

    const subtotal = con + proc + test + other;
    const total = Math.max(0, subtotal - disc);
    const paid = editingBill ? editingBill.paidAmount : 0;
    const balanceDue = Math.max(0, total - paid);

    let status = 'Unpaid';
    if (paid >= total && total > 0) status = 'Paid';
    else if (paid > 0) status = 'Partially Paid';

    return { subtotal, total, paid, balanceDue, status };
  }, [formData, editingBill]);

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.billNumber.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.patientId.toLowerCase().includes(q) ||
        b.doctorName.toLowerCase().includes(q);

      const matchStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [bills, search, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingBill(null);
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      appointmentId: '',
      billDate: new Date().toISOString().split('T')[0],
      consultationFee: 2500,
      procedureCharges: 0,
      testCharges: 0,
      otherCharges: 0,
      discount: 0,
      notes: '',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      patientId: bill.patientId,
      doctorId: bill.doctorId,
      appointmentId: bill.appointmentId || '',
      billDate: bill.billDate,
      consultationFee: bill.consultationFee,
      procedureCharges: bill.procedureCharges || 0,
      testCharges: bill.testCharges || 0,
      otherCharges: bill.otherCharges || 0,
      discount: bill.discount || 0,
      notes: bill.notes || '',
    });
    setIsAddEditOpen(true);
  };

  const handleSaveBill = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId) return;

    if (editingBill) {
      updateBill(editingBill.id, formData);
    } else {
      addBill(formData);
    }
    setIsAddEditOpen(false);
  };

  const columns = [
    {
      key: 'billNumber',
      label: 'Invoice #',
      width: '130px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-800">{val}</span>,
    },
    {
      key: 'billDate',
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
      key: 'totalAmount',
      label: 'Total Amount',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(val)}</span>,
    },
    {
      key: 'paidAmount',
      label: 'Paid Amount',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-emerald-700 tabular-nums">{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'balanceDue',
      label: 'Balance Due',
      align: 'right',
      render: (val) => (
        <span className={`font-bold tabular-nums ${val > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
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
          {row.balanceDue > 0 && (
            <button
              onClick={() => navigate('/payments', { state: { targetBill: row } })}
              className="px-2.5 py-1 text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100/90 rounded-lg transition-colors flex items-center gap-1 border border-teal-200/90 shadow-2xs"
              title="Collect Payment for this Bill"
            >
              <CreditCard className="w-3 h-3 text-teal-700" />
              <span>Collect</span>
            </button>
          )}

          <button
            onClick={() => openDocument('bill', row)}
            className="p-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 rounded-lg transition-colors shadow-2xs"
            title="View & Print Invoice"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => generateBillPDF(row)}
            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition-colors shadow-2xs"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Edit Bill Charges"
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
        title="Patient Billing & Invoices"
        subtitle="Manage itemized clinic charges, consultation tariffs, patient copayments, and outstanding balances."
        breadcrumbs={[{ label: 'Patient Bills' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 hover:shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Patient Bill</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search bill number, patient name, doctor, or ID..."
        hasActiveFilters={search !== '' || selectedStatus !== 'ALL'}
        onResetFilters={() => {
          setSearch('');
          setSelectedStatus('ALL');
        }}
        totalResults={filteredBills.length}
      >
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Paid">Paid</option>
        </select>
      </FilterBar>

      {/* Bills Data Table */}
      <DataTable
        columns={columns}
        data={filteredBills}
        keyField="id"
        emptyMessage="No billing records found matching criteria."
      />

      {/* Create / Edit Bill Modal (Section 10) */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingBill ? `Edit Invoice — ${editingBill.billNumber}` : 'Generate Patient Bill'}
        subtitle="Itemized charges, discounts, and real-time balance calculations."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveBill} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient *
              </label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attending Doctor *
              </label>
              <select
                required
                value={formData.doctorId}
                onChange={(e) => {
                  const doc = doctors.find((d) => d.id === e.target.value);
                  setFormData({
                    ...formData,
                    doctorId: e.target.value,
                    consultationFee: doc ? doc.consultationFee : formData.consultationFee,
                  });
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — Rs. {d.consultationFee}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Appointment Reference (Optional)
              </label>
              <input
                type="text"
                value={formData.appointmentId}
                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                placeholder="e.g. APT-2001"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billing Date
              </label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Itemized Charges Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Itemized Clinical Charges (PKR)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Procedure Charges
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.procedureCharges}
                  onChange={(e) => setFormData({ ...formData, procedureCharges: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Diagnostic Tests
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.testCharges}
                  onChange={(e) => setFormData({ ...formData, testCharges: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Other Services
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.otherCharges}
                  onChange={(e) => setFormData({ ...formData, otherCharges: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Discount (PKR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full sm:w-48 px-2.5 py-1.5 border border-slate-200 rounded text-xs text-rose-600 font-bold bg-white"
              />
            </div>
          </div>

          {/* Real-time Calculation Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Invoice Amount</span>
              <p className="text-2xl font-black text-white">{formatCurrency(formCalculations.total)}</p>
              <p className="text-[11px] text-slate-400">
                Subtotal: {formatCurrency(formCalculations.subtotal)} | Discount: - {formatCurrency(formData.discount)}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Balance Due Now</span>
              <p className="text-xl font-bold text-amber-400">{formatCurrency(formCalculations.balanceDue)}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                Status: {formCalculations.status}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billing Remarks & Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Corporate discount applied, insurance pre-authorization..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
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
              {editingBill ? 'Save Invoice Updates' : 'Generate Bill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

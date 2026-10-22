import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  Receipt,
  Wallet,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generatePaymentReceiptPDF } from '../../services/documentService';

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Card', 'Other'];

export const PaymentsPage = () => {
  const location = useLocation();
  const {
    payments,
    bills,
    patients,
    accounts,
    collectPayment,
    openDocument,
  } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');

  // Modals state
  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    billId: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    accountId: accounts[0]?.id || '',
    referenceNumber: '',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  // Check if opened from another module with a pre-selected bill (e.g. from BillsPage or Patient 360)
  useEffect(() => {
    if (location.state?.targetBill) {
      const b = location.state.targetBill;
      setFormData({
        patientId: b.patientId,
        billId: b.id,
        amount: b.balanceDue,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        accountId: accounts[0]?.id || '',
        referenceNumber: `REC-${Date.now().toString().slice(-4)}`,
        notes: `Settlement for invoice ${b.billNumber}`,
      });
      setIsCollectOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, accounts]);

  // Available bills for selected patient (unpaid or partially paid)
  const availableBills = useMemo(() => {
    if (!formData.patientId) return [];
    return bills.filter(
      (b) => b.patientId === formData.patientId && b.balanceDue > 0
    );
  }, [bills, formData.patientId]);

  // Selected bill object
  const selectedBillObj = useMemo(() => {
    return bills.find((b) => b.id === formData.billId);
  }, [bills, formData.billId]);

  // When patient changes, select the first available unpaid bill and prefill balance
  const handlePatientSelect = (pId) => {
    const pBills = bills.filter((b) => b.patientId === pId && b.balanceDue > 0);
    const firstBill = pBills[0];
    setFormData((prev) => ({
      ...prev,
      patientId: pId,
      billId: firstBill ? firstBill.id : '',
      amount: firstBill ? firstBill.balanceDue : 0,
    }));
  };

  // When bill changes, prefill amount with balanceDue
  const handleBillSelect = (bId) => {
    const target = bills.find((b) => b.id === bId);
    setFormData((prev) => ({
      ...prev,
      billId: bId,
      amount: target ? target.balanceDue : 0,
    }));
  };

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.patientName.toLowerCase().includes(q) ||
        p.billNumber.toLowerCase().includes(q) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q));

      const matchMethod = selectedMethod === 'ALL' || p.paymentMethod === selectedMethod;
      return matchSearch && matchMethod;
    });
  }, [payments, search, selectedMethod]);

  const handleOpenCollect = () => {
    setFormError('');
    // find a patient who has an unpaid bill
    const unpaidBill = bills.find((b) => b.balanceDue > 0);
    const initialPatientId = unpaidBill ? unpaidBill.patientId : (patients[0]?.id || '');
    const initialBillId = unpaidBill ? unpaidBill.id : '';
    const initialAmount = unpaidBill ? unpaidBill.balanceDue : 0;

    setFormData({
      patientId: initialPatientId,
      billId: initialBillId,
      amount: initialAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      accountId: accounts[0]?.id || '',
      referenceNumber: `CASH-${Date.now().toString().slice(-4)}`,
      notes: 'Counter payment collection',
    });
    setIsCollectOpen(true);
  };

  const handleSubmitCollection = (e) => {
    e.preventDefault();
    setFormError('');

    const res = collectPayment(formData);
    if (res.success) {
      setIsCollectOpen(false);
      // Auto-preview official receipt
      openDocument('receipt', res.payment);
    } else {
      setFormError(res.error || 'Payment failed');
    }
  };

  const columns = [
    {
      key: 'receiptNumber',
      label: 'Receipt #',
      width: '130px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-800">{val}</span>,
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      render: (val) => <span className="text-slate-600">{formatDate(val)}</span>,
    },
    {
      key: 'patientName',
      label: 'Patient',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
            {val ? val.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">{val}</span>
            <span className="text-[11px] text-slate-500 font-mono">{row.patientId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'billNumber',
      label: 'Settled Bill',
      render: (val) => <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/50">{val}</span>,
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      render: (val) => {
        const isCash = val === 'Cash';
        const isBank = val === 'Bank Transfer';
        const isCard = val === 'Card';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
            isCash ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
            isBank ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' :
            isCard ? 'bg-cyan-50 text-cyan-700 border-cyan-200/60' :
            'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isCash ? 'bg-emerald-500' : isBank ? 'bg-indigo-500' : isCard ? 'bg-cyan-500' : 'bg-slate-400'
            }`} />
            {val}
          </span>
        );
      },
    },
    {
      key: 'accountName',
      label: 'Deposited Account',
      render: (val) => <span className="text-xs text-slate-600 font-medium truncate max-w-xs block">{val}</span>,
    },
    {
      key: 'amount',
      label: 'Amount Paid',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-emerald-600 font-mono text-sm">{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openDocument('receipt', row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Print Official Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => generatePaymentReceiptPDF(row)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Download PDF Receipt"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setViewingPayment(row);
              setIsDetailOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="View Receipt Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payment Collection"
        subtitle="Record cash, POS card swipes, and bank receipts against patient invoices with automatic account ledger synchronization."
        breadcrumbs={[{ label: 'Payments' }]}
        actions={
          <button
            onClick={handleOpenCollect}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold shadow-clinical-emerald hover:shadow-glow-teal transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Collect Payment</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search receipt number, patient name, bill number, or reference..."
        hasActiveFilters={search !== '' || selectedMethod !== 'ALL'}
        onResetFilters={() => {
          setSearch('');
          setSelectedMethod('ALL');
        }}
        totalResults={filteredPayments.length}
      >
        <div className="min-w-[180px]">
          <SearchableSelect
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter payment method..."
          >
            <option value="ALL">All Payment Methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SearchableSelect>
        </div>
      </FilterBar>

      {/* Payments Data Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        keyField="id"
        emptyMessage="No payment transaction receipts found."
      />

      {/* Collect Payment Form Modal (Section 11) */}
      <Modal
        isOpen={isCollectOpen}
        onClose={() => setIsCollectOpen(false)}
        title="Collect Patient Payment"
        subtitle="Select patient & outstanding invoice to process payment and update cashbook."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitCollection} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <SearchableSelect
              required
              value={formData.patientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              searchPlaceholder="Search patient name, ID, or balance..."
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — Outstanding: {formatCurrency(p.outstandingBalance)}
                </option>
              ))}
            </SearchableSelect>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Unpaid / Partially Paid Bill *
            </label>
            {availableBills.length === 0 ? (
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                This patient currently has no unpaid bills with an outstanding balance.
              </p>
            ) : (
              <SearchableSelect
                required
                value={formData.billId}
                onChange={(e) => handleBillSelect(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                searchPlaceholder="Search invoice # or amount..."
              >
                {availableBills.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.billNumber} — Total: {formatCurrency(b.totalAmount)} | Balance Due: {formatCurrency(b.balanceDue)}
                  </option>
                ))}
              </SearchableSelect>
            )}
          </div>

          {/* Selected Bill Financial Breakdown Card */}
          {selectedBillObj && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Invoice</span>
                <p className="font-bold text-slate-900 mt-0.5">{formatCurrency(selectedBillObj.totalAmount)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Already Paid</span>
                <p className="font-bold text-emerald-600 mt-0.5">{formatCurrency(selectedBillObj.paidAmount)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Remaining Due</span>
                <p className="font-bold text-rose-600 mt-0.5">{formatCurrency(selectedBillObj.balanceDue)}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Amount (PKR) *
              </label>
              <input
                type="number"
                required
                min="1"
                max={selectedBillObj ? selectedBillObj.balanceDue : undefined}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method *
              </label>
              <SearchableSelect
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search payment method..."
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deposit to Account *
              </label>
              <SearchableSelect
                required
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search receiving account..."
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (Bal: {formatCurrency(a.currentBalance)})
                  </option>
                ))}
              </SearchableSelect>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reference / Transaction ID
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              placeholder="e.g. POS Auth 9941, Raast Trx Ref, Cheque #"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt Remarks
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Received at cashier desk..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCollectOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedBillObj || selectedBillObj.balanceDue <= 0}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <FileCheck className="w-4 h-4" />
              <span>Confirm & Generate Receipt</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Payment Details Modal (Section 11) */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={viewingPayment ? `Receipt Details — ${viewingPayment.receiptNumber}` : 'Payment Details'}
        maxWidth="max-w-md"
      >
        {viewingPayment && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Payment Received</span>
              <h3 className="text-2xl font-black text-emerald-900 mt-0.5">
                {formatCurrency(viewingPayment.amount)}
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                Via <strong className="uppercase">{viewingPayment.paymentMethod}</strong> on {formatDate(viewingPayment.paymentDate)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <p><strong>Patient:</strong> {viewingPayment.patientName} ({viewingPayment.patientId})</p>
              <p><strong>Against Bill:</strong> {viewingPayment.billNumber}</p>
              <p><strong>Deposited To:</strong> {viewingPayment.accountName}</p>
              <p><strong>Reference #:</strong> {viewingPayment.referenceNumber || 'None'}</p>
              <p><strong>Received By:</strong> {viewingPayment.receivedBy || 'Accounts Desk'}</p>
              {viewingPayment.notes && <p><strong>Notes:</strong> {viewingPayment.notes}</p>}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  openDocument('receipt', viewingPayment);
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

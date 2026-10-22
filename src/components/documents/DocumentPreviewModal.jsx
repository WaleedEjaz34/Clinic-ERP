import React from 'react';
import { Printer, Download, X, Building2, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import {
  generatePrescriptionPDF,
  generateBillPDF,
  generatePaymentReceiptPDF,
  generateExpenseVoucherPDF,
} from '../../services/documentService';

export const DocumentPreviewModal = () => {
  const { documentModal, closeDocument } = useClinic();
  const { isOpen, type, data } = documentModal;

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (type === 'prescription') {
      generatePrescriptionPDF(data);
    } else if (type === 'bill') {
      generateBillPDF(data);
    } else if (type === 'receipt') {
      generatePaymentReceiptPDF(data);
    } else if (type === 'voucher') {
      generateExpenseVoucherPDF(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity no-print"
        onClick={closeDocument}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6">
        <div
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Print & Download Action Controls */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 no-print flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Official Document Preview:
              </span>
              <span className="text-sm font-semibold text-slate-900 capitalize">
                {type === 'voucher' ? 'Expense Voucher' : type === 'bill' ? 'Patient Bill' : type === 'receipt' ? 'Payment Receipt' : 'Prescription'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={closeDocument}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Sheet */}
          <div className="p-8 overflow-y-auto flex-1 bg-white print:p-0 text-slate-800">
            {/* Clinic Standard Letterhead */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                      +
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        MedPulse Executive Healthcare
                      </h2>
                      <p className="text-xs text-brand-700 font-semibold uppercase tracking-wider">
                        Outpatient Department & Diagnostic Center
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Plot 14-B, Executive Sector F-8 Markaz, Islamabad, Pakistan
                  </p>
                  <p className="text-xs text-slate-500">
                    UAN / Phone: +92 51 2289001 | Reg: PMDC / PHC ISB-88392-C
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-wider">
                    {type === 'voucher'
                      ? 'Expense Voucher'
                      : type === 'bill'
                      ? 'Patient Invoice'
                      : type === 'receipt'
                      ? 'Payment Receipt'
                      : 'Medical Prescription'}
                  </span>
                  <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                    <div>
                      <strong>Document Ref:</strong> {data.billNumber || data.receiptNumber || data.id || data.reference}
                    </div>
                    <div>
                      <strong>Issue Date:</strong> {formatDate(data.prescriptionDate || data.billDate || data.paymentDate || data.expenseDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Specific Body */}
            {type === 'prescription' && <PrescriptionBody rx={data} />}
            {type === 'bill' && <BillBody bill={data} />}
            {type === 'receipt' && <ReceiptBody payment={data} />}
            {type === 'voucher' && <VoucherBody expense={data} />}

            {/* Standard Footer */}
            <div className="mt-12 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
              <p>This is a computer-verified medical document issued by MedPulse ERP System. Valid without manual alteration.</p>
              <p className="mt-0.5">For verification or appointments, contact support@medpulse.pk or call +92 51 2289001.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Prescription Document Body
const PrescriptionBody = ({ rx }) => {
  return (
    <div className="space-y-6">
      {/* Patient & Doctor Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patient Details</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{rx.patientName}</p>
          <p className="text-slate-600">ID: {rx.patientId}</p>
          <p className="text-slate-600">Appointment Ref: {rx.appointmentId || 'Walk-in'}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consulting Physician</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{rx.doctorName}</p>
          <p className="text-slate-600">MedPulse Senior Consultant</p>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rx.complaint && (
          <div className="p-3.5 border border-slate-200 rounded-lg bg-white">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Chief Complaints</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rx.complaint}</p>
          </div>
        )}
        {rx.diagnosis && (
          <div className="p-3.5 border border-teal-200 rounded-lg bg-teal-50/50">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wide">Diagnosis</h4>
            <p className="text-xs font-semibold text-teal-900 mt-1 leading-relaxed">{rx.diagnosis}</p>
          </div>
        )}
      </div>

      {/* Rx Medicines Table */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-serif font-black text-brand-700">℞</span>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Prescribed Medication</h4>
        </div>

        <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 text-left w-10">#</th>
              <th className="py-2.5 px-3 text-left">Medicine</th>
              <th className="py-2.5 px-3 text-left">Dosage</th>
              <th className="py-2.5 px-3 text-left">Frequency</th>
              <th className="py-2.5 px-3 text-left">Duration</th>
              <th className="py-2.5 px-3 text-left">Instructions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rx.medicines && rx.medicines.length > 0 ? (
              rx.medicines.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                  <td className="py-2.5 px-3">{m.dosage}</td>
                  <td className="py-2.5 px-3 font-medium text-brand-700">{m.frequency}</td>
                  <td className="py-2.5 px-3">{m.duration}</td>
                  <td className="py-2.5 px-3 text-slate-600">{m.instructions || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-slate-400">
                  No oral medications prescribed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Advised Tests */}
      {rx.tests && rx.tests.length > 0 && (
        <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/60">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
            Advised Lab Investigations & Diagnostic Tests
          </h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
            {rx.tests.map((t, idx) => (
              <li key={idx}>
                <span className="font-semibold text-slate-900">{t.name}</span>
                {t.instructions && <span className="text-slate-500 italic ml-2">— {t.instructions}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Doctor Notes & Follow up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
        <div>
          {rx.doctorNotes && (
            <div>
              <span className="font-bold text-slate-800">Dietary & Clinical Instructions:</span>
              <p className="text-slate-600 mt-1 leading-relaxed">{rx.doctorNotes}</p>
            </div>
          )}
          {rx.followUpDate && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-lg text-brand-800 font-medium">
              <span>Next Follow-up Review:</span>
              <strong>{formatDate(rx.followUpDate)}</strong>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-end mt-8 sm:mt-0">
          <div className="w-48 border-t border-slate-400 pt-2 text-center text-xs text-slate-600">
            <p className="font-bold text-slate-900">{rx.doctorName}</p>
            <p className="text-[11px] text-slate-500">Authorized Physician Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Bill Document Body
const BillBody = ({ bill }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Billed To</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{bill.patientName}</p>
          <p className="text-slate-600">Patient ID: {bill.patientId}</p>
          <p className="text-slate-600">Invoice Ref: {bill.billNumber}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consulting Doctor</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{bill.doctorName}</p>
          <p className="text-slate-600">Appointment Ref: {bill.appointmentId || 'OPD Walk-in'}</p>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-900 text-white font-semibold">
          <tr>
            <th className="py-2.5 px-4 text-left w-12">#</th>
            <th className="py-2.5 px-4 text-left">Service Item / Description</th>
            <th className="py-2.5 px-4 text-right w-36">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {bill.items && bill.items.length > 0 ? (
            bill.items.map((it, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-medium text-slate-500">{idx + 1}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{it.description}</td>
                <td className="py-3 px-4 text-right font-medium">{formatCurrency(it.amount)}</td>
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4 font-semibold text-slate-800">Doctor Consultation Fee</td>
                <td className="py-3 px-4 text-right">{formatCurrency(bill.consultationFee)}</td>
              </tr>
              {bill.procedureCharges > 0 && (
                <tr>
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Medical / Procedure Charges</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(bill.procedureCharges)}</td>
                </tr>
              )}
              {bill.testCharges > 0 && (
                <tr>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Diagnostic Tests / Lab Services</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(bill.testCharges)}</td>
                </tr>
              )}
              {bill.otherCharges > 0 && (
                <tr>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Other Clinic Charges</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(bill.otherCharges)}</td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>

      {/* Calculations & Totals */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="text-xs text-slate-500 max-w-sm">
          {bill.notes && (
            <p className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Billing Note:</strong> {bill.notes}
            </p>
          )}
        </div>

        <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          {bill.discount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Special Discount:</span>
              <span className="font-semibold text-emerald-600">- {formatCurrency(bill.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-2">
            <span>Total Bill:</span>
            <span>{formatCurrency(bill.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Paid Amount:</span>
            <span>{formatCurrency(bill.paidAmount)}</span>
          </div>
          <div className="flex justify-between text-rose-700 font-bold text-sm border-t border-slate-200 pt-2">
            <span>Balance Due:</span>
            <span>{formatCurrency(bill.balanceDue)}</span>
          </div>
          <div className="pt-2 text-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                bill.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : bill.status === 'Partially Paid'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              Status: {bill.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end pt-8 text-xs text-slate-500">
        <div className="border-t border-slate-300 w-40 text-center pt-1">
          Patient Signature
        </div>
        <div className="border-t border-slate-300 w-44 text-center pt-1">
          Cashier / Accounts Officer
        </div>
      </div>
    </div>
  );
};

// Sub-component: Payment Receipt Body
const ReceiptBody = ({ payment }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200 text-center">
        <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">
          Amount Received
        </span>
        <h3 className="text-3xl font-extrabold text-teal-900 mt-1">
          {formatCurrency(payment.amount)}
        </h3>
        <p className="text-xs text-teal-700 mt-1">
          Paid via <strong className="uppercase">{payment.paymentMethod}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-slate-400">Transaction Info</p>
          <p><strong>Receipt Number:</strong> {payment.receiptNumber}</p>
          <p><strong>Payment Date:</strong> {formatDate(payment.paymentDate)}</p>
          <p><strong>Ref / Trx ID:</strong> {payment.referenceNumber || 'N/A'}</p>
          <p><strong>Deposited To:</strong> {payment.accountName}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-slate-400">Patient & Bill</p>
          <p><strong>Patient Name:</strong> {payment.patientName}</p>
          <p><strong>Patient ID:</strong> {payment.patientId}</p>
          <p><strong>Against Bill:</strong> {payment.billNumber}</p>
          <p><strong>Processed By:</strong> {payment.receivedBy || 'Accounts Counter'}</p>
        </div>
      </div>

      {payment.notes && (
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
          <strong>Receipt Remarks:</strong> {payment.notes}
        </div>
      )}

      <div className="flex justify-end pt-8">
        <div className="border-t border-slate-400 w-48 text-center pt-1 text-xs text-slate-500">
          Authorized Cashier Stamp & Signature
        </div>
      </div>
    </div>
  );
};

// Sub-component: Expense Voucher Body
const VoucherBody = ({ expense }) => {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
            Total Disbursed Sum
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-0.5">
            {formatCurrency(expense.amount)}
          </h3>
        </div>
        <div className="text-right text-xs text-slate-600">
          <p><strong>Disbursement Date:</strong> {formatDate(expense.expenseDate)}</p>
          <p><strong>Account Debited:</strong> {expense.accountName}</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
        <p><strong>Expense Category:</strong> {expense.categoryName}</p>
        <p><strong>Reference / Voucher Number:</strong> {expense.reference || expense.id}</p>
        <p><strong>Particulars / Description:</strong> {expense.description}</p>
        {expense.attachmentName && (
          <p><strong>Attached Invoice/Receipt:</strong> {expense.attachmentName}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-10 text-xs text-slate-500 text-center">
        <div className="border-t border-slate-300 pt-1">Prepared By</div>
        <div className="border-t border-slate-300 pt-1">Verified By</div>
        <div className="border-t border-slate-300 pt-1 font-bold text-slate-800">
          {expense.authorizedBy || 'Medical Director'}
        </div>
      </div>
    </div>
  );
};

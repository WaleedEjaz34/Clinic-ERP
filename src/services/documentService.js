import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatTime } from '../utils/date';
import { formatCurrency } from '../utils/currency';

const CLINIC_INFO = {
  name: 'MedPulse Executive Healthcare Clinic',
  address: 'Plot 14-B, Executive Sector F-8 Markaz, Islamabad, Pakistan',
  phone: '+92 51 2289001 / +92 300 8472910',
  email: 'info@medpulse.pk',
  regNo: 'PMDC / PHC Reg: ISB-88392-C',
};

// ==========================================
// 1. PRESCRIPTION PDF GENERATOR
// ==========================================
export const generatePrescriptionPDF = (rx) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(CLINIC_INFO.name, 14, 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`${CLINIC_INFO.address} | Phone: ${CLINIC_INFO.phone}`, 14, 20);
  doc.text(`${CLINIC_INFO.email} | ${CLINIC_INFO.regNo}`, 14, 26);

  // Subheader: Document Title & Metadata
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 36, 182, 24, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 36, 182, 24, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL PRESCRIPTION', 18, 44);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prescription #: ${rx.id}`, 18, 51);
  doc.text(`Date: ${formatDate(rx.prescriptionDate)}`, 18, 56);

  doc.setFont('helvetica', 'bold');
  doc.text(`Doctor: ${rx.doctorName}`, 110, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patient: ${rx.patientName} (${rx.patientId})`, 110, 51);
  doc.text(`Appointment Ref: ${rx.appointmentId || 'Walk-in'}`, 110, 56);

  // Clinical Details
  let currentY = 66;

  if (rx.complaint) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('Chief Complaints / Symptoms:', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(rx.complaint, 14, currentY + 5, { maxWidth: 182 });
    currentY += 14;
  }

  if (rx.diagnosis) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('Clinical Diagnosis:', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 118, 110); // teal-700
    doc.text(rx.diagnosis, 14, currentY + 5, { maxWidth: 182 });
    currentY += 15;
  }

  // Medicines Table (Rx)
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Rx - Prescribed Medicines', 14, currentY);
  currentY += 3;

  const tableBody = (rx.medicines || []).map((m, idx) => [
    idx + 1,
    m.name,
    m.dosage,
    m.frequency,
    m.duration,
    m.instructions || '—',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Medicine Name', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
    body: tableBody.length > 0 ? tableBody : [['-', 'No oral medications prescribed', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [14, 142, 233], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // Investigations & Tests
  if (rx.tests && rx.tests.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Advised Diagnostic Tests / Investigations:', 14, currentY);
    currentY += 5;

    rx.tests.forEach((t) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`• ${t.name}`, 18, currentY);
      if (t.instructions) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`  (${t.instructions})`, 18 + doc.getTextWidth(`• ${t.name} `), currentY);
      }
      currentY += 5.5;
    });
    currentY += 4;
  }

  // Doctor Notes & Follow up
  if (rx.doctorNotes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Doctor Dietary & General Advice:', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(rx.doctorNotes, 14, currentY + 5, { maxWidth: 182 });
    currentY += 14;
  }

  if (rx.followUpDate) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 112, 199);
    doc.text(`Next Follow-up Review: ${formatDate(rx.followUpDate)}`, 14, currentY);
  }

  // Signature Block at Bottom
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.line(140, 265, 195, 265);
  doc.text('Authorized Doctor Signature', 142, 271);
  doc.text(rx.doctorName, 142, 276);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('This is an official computerized prescription generated by MedPulse Clinic ERP.', 14, 285);

  doc.save(`Prescription_${rx.id}_${rx.patientName.replace(/\s+/g, '_')}.pdf`);
};

// ==========================================
// 2. PATIENT BILL PDF GENERATOR
// ==========================================
export const generateBillPDF = (bill) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(CLINIC_INFO.name, 14, 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`${CLINIC_INFO.address} | Phone: ${CLINIC_INFO.phone}`, 14, 20);
  doc.text(`NTN: 8847291-3 | ${CLINIC_INFO.regNo}`, 14, 26);

  // Bill Title box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 36, 182, 26, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 36, 182, 26, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INVOICE / BILL', 18, 44);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Bill Number: ${bill.billNumber}`, 18, 51);
  doc.text(`Date of Invoice: ${formatDate(bill.billDate)}`, 18, 57);

  doc.setFont('helvetica', 'bold');
  doc.text(`Patient Name: ${bill.patientName} (${bill.patientId})`, 110, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`Attending Doctor: ${bill.doctorName}`, 110, 51);
  doc.text(`Appointment Ref: ${bill.appointmentId || 'Walk-in Visit'}`, 110, 57);

  // Status Watermark or Stamp
  const statusColor = bill.status === 'Paid' ? [16, 185, 129] : bill.status === 'Partially Paid' ? [245, 158, 11] : [239, 68, 68];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`[ ${bill.status.toUpperCase()} ]`, 160, 44);

  // Itemized Services
  const items = (bill.items && bill.items.length > 0)
    ? bill.items.map((it, idx) => [idx + 1, it.description, formatCurrency(it.amount)])
    : [
        [1, 'Consultation Fee', formatCurrency(bill.consultationFee)],
        bill.procedureCharges > 0 && [2, 'Medical / Procedure Charges', formatCurrency(bill.procedureCharges)],
        bill.testCharges > 0 && [3, 'Diagnostic Tests / Lab Services', formatCurrency(bill.testCharges)],
        bill.otherCharges > 0 && [4, 'Other Clinic Services', formatCurrency(bill.otherCharges)],
      ].filter(Boolean);

  autoTable(doc, {
    startY: 68,
    head: [['#', 'Service Description', 'Amount (PKR)']],
    body: items,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 125 },
      2: { cellWidth: 42, halign: 'right' }
    }
  });

  let totalsY = doc.lastAutoTable.finalY + 6;

  // Totals Breakdown box
  doc.setFillColor(248, 250, 252);
  doc.rect(110, totalsY, 86, 42, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(110, totalsY, 86, 42, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text('Discount Applied:', 114, totalsY + 8);
  doc.text(`- ${formatCurrency(bill.discount)}`, 190, totalsY + 8, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Total Invoice Amount:', 114, totalsY + 16);
  doc.text(formatCurrency(bill.totalAmount), 190, totalsY + 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // green
  doc.text('Amount Received (Paid):', 114, totalsY + 24);
  doc.text(formatCurrency(bill.paidAmount), 190, totalsY + 24, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38); // red
  doc.text('Outstanding Balance Due:', 114, totalsY + 34);
  doc.text(formatCurrency(bill.balanceDue), 190, totalsY + 34, { align: 'right' });

  // Notes & Payment instructions
  if (bill.notes) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Notes: ${bill.notes}`, 14, totalsY + 10, { maxWidth: 90 });
  }

  // Signatures
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.line(14, 250, 60, 250);
  doc.text('Patient / Attendant Signature', 14, 256);

  doc.line(140, 250, 195, 250);
  doc.text('Authorized Cashier / Accounts', 140, 256);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for choosing MedPulse Clinic. Computer-generated official invoice.', 14, 285);

  doc.save(`Invoice_${bill.billNumber}_${bill.patientName.replace(/\s+/g, '_')}.pdf`);
};

// ==========================================
// 3. PAYMENT RECEIPT PDF GENERATOR
// ==========================================
export const generatePaymentReceiptPDF = (payment) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(13, 148, 136); // teal-600
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(CLINIC_INFO.name, 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`OFFICIAL CASH & DIGITAL PAYMENT RECEIPT`, 14, 19);
  doc.text(`${CLINIC_INFO.address} | Phone: ${CLINIC_INFO.phone}`, 14, 25);

  // Receipt details card
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 38, 182, 38, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 38, 182, 38, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt #: ${payment.receiptNumber}`, 20, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Date: ${formatDate(payment.paymentDate)}`, 20, 56);
  doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 64);
  doc.text(`Reference / Transaction ID: ${payment.referenceNumber || 'N/A'}`, 20, 71);

  doc.setFont('helvetica', 'bold');
  doc.text(`Received From: ${payment.patientName} (${payment.patientId})`, 110, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`Against Bill: ${payment.billNumber}`, 110, 56);
  doc.text(`Deposited Account: ${payment.accountName}`, 110, 64);
  doc.text(`Received By: ${payment.receivedBy || 'Accounts Desk'}`, 110, 71);

  // Big Amount Display Box
  doc.setFillColor(240, 253, 250); // teal-50
  doc.rect(14, 84, 182, 30, 'F');
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.5);
  doc.rect(14, 84, 182, 30, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT RECEIVED:', 20, 95);

  doc.setFontSize(18);
  doc.setTextColor(13, 148, 136);
  doc.text(formatCurrency(payment.amount), 20, 107);

  if (payment.notes) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Remarks / Notes: ${payment.notes}`, 14, 126);
  }

  // Signature Block
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.line(140, 180, 195, 180);
  doc.text('Authorized Signature / Cashier Stamp', 140, 186);
  doc.text(payment.receivedBy || 'MedPulse Accounts', 140, 191);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Payment received with thanks. Retain this computerized receipt for insurance/tax claims.', 14, 210);

  doc.save(`Receipt_${payment.receiptNumber}.pdf`);
};

// ==========================================
// 4. EXPENSE VOUCHER PDF GENERATOR
// ==========================================
export const generateExpenseVoucherPDF = (expense) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(71, 85, 105); // slate-600
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(CLINIC_INFO.name, 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('INTERNAL PAYMENT / EXPENSE DISBURSEMENT VOUCHER', 14, 19);
  doc.text(`${CLINIC_INFO.address}`, 14, 25);

  // Voucher box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 38, 182, 36, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 38, 182, 36, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Voucher ID: ${expense.id}`, 20, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date of Expense: ${formatDate(expense.expenseDate)}`, 20, 56);
  doc.text(`Category: ${expense.categoryName}`, 20, 64);

  doc.setFont('helvetica', 'bold');
  doc.text(`Disbursed From: ${expense.accountName}`, 110, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reference #: ${expense.reference || '—'}`, 110, 56);
  doc.text(`Authorized By: ${expense.authorizedBy || 'Medical Director'}`, 110, 64);

  // Expense Description
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Particulars / Expense Description:', 14, 86);

  doc.setFillColor(255, 255, 255);
  doc.rect(14, 91, 182, 28, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 91, 182, 28, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(expense.description || 'No description provided', 18, 100, { maxWidth: 174 });

  // Amount Block
  doc.setFillColor(254, 242, 242); // red-50
  doc.rect(14, 126, 182, 25, 'F');
  doc.setDrawColor(239, 68, 68);
  doc.rect(14, 126, 182, 25, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DISBURSED AMOUNT:', 20, 137);

  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(formatCurrency(expense.amount), 20, 146);

  if (expense.attachmentName) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Supporting Attachment: ${expense.attachmentName}`, 14, 160);
  }

  // Signatures
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);

  doc.line(14, 210, 60, 210);
  doc.text('Prepared By (Accounts)', 14, 216);

  doc.line(80, 210, 130, 210);
  doc.text('Receiver Signature / Thumb', 80, 216);

  doc.line(145, 210, 195, 210);
  doc.text('Approved By (Director)', 145, 216);
  doc.text(expense.authorizedBy || 'Medical Director', 145, 221);

  doc.save(`Voucher_${expense.reference || expense.id}.pdf`);
};

// ==========================================
// 5. DAILY CLINIC ACTIVITY REPORT PDF GENERATOR
// ==========================================
export const generateDailyActivityReportPDF = ({
  rows = [],
  grandTotals = {},
  dateRangeLabel = 'Today',
  clinicInfo = CLINIC_INFO,
}) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Clinic Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(clinicInfo.name, 14, 10);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`${clinicInfo.address} | Phone: ${clinicInfo.phone} | ${clinicInfo.regNo}`, 14, 16);
  doc.text('CONFIDENTIAL CLINICAL & FINANCIAL EXECUTIVE SUMMARY', 14, 21);

  // Subheader: Report Metadata
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(14, 29, 269, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 29, 269, 14, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DAILY CLINIC ACTIVITY & OPERATIONAL SUMMARY REPORT', 18, 36);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Active Filter: ${dateRangeLabel}`, 18, 41);
  doc.text(`Report Period: ${rows.length} ${rows.length === 1 ? 'Date Recorded' : 'Dates Recorded'}`, 150, 36);
  doc.text(`Generated At: ${formatDate(new Date(), 'dd MMM yyyy, hh:mm a')}`, 150, 41);

  // Table Body
  const tableHead = [
    [
      'Date',
      'New Patients',
      'Total Apts',
      'Completed',
      'Consultations',
      'Rx',
      'Total Billing',
      'Total Collection',
      'Outstanding',
      'Expenses',
      'Net Income',
    ],
  ];

  const tableBody = rows.map((r) => [
    formatDate(r.date, 'dd MMM yyyy'),
    r.newPatients,
    r.totalAppointments,
    r.completedAppointments,
    r.consultations,
    r.prescriptions,
    formatCurrency(r.totalBilling),
    formatCurrency(r.totalCollection),
    formatCurrency(r.outstanding),
    formatCurrency(r.expenses),
    formatCurrency(r.netIncome),
  ]);

  const tableFoot = [
    [
      'Grand Total',
      grandTotals.newPatients || 0,
      grandTotals.totalAppointments || 0,
      grandTotals.completedAppointments || 0,
      grandTotals.consultations || 0,
      grandTotals.prescriptions || 0,
      formatCurrency(grandTotals.totalBilling || 0),
      formatCurrency(grandTotals.totalCollection || 0),
      formatCurrency(grandTotals.outstanding || 0),
      formatCurrency(grandTotals.expenses || 0),
      formatCurrency(grandTotals.netIncome || 0),
    ],
  ];

  autoTable(doc, {
    startY: 46,
    head: tableHead,
    body: tableBody,
    foot: tableFoot,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'right', fontStyle: 'bold' },
      7: { halign: 'right', fontStyle: 'bold' },
      8: { halign: 'right', textColor: [180, 83, 9] },
      9: { halign: 'right' },
      10: { halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      // Net Income column coloring in footer
      if (data.section === 'body' && data.column.index === 10) {
        const rawRow = rows[data.row.index];
        if (rawRow && rawRow.netIncome < 0) {
          data.cell.styles.textColor = [220, 38, 38];
        } else if (rawRow && rawRow.netIncome > 0) {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
      if (data.section === 'foot' && data.column.index === 10) {
        if (grandTotals.netIncome < 0) {
          data.cell.styles.textColor = [220, 38, 38];
        } else {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
    },
  });

  // Footer Signatures
  const finalY = doc.lastAutoTable?.finalY || 160;
  if (finalY < 185) {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.line(18, finalY + 18, 65, finalY + 18);
    doc.text('Prepared By (Accounts Officer)', 18, finalY + 22);

    doc.line(125, finalY + 18, 175, finalY + 18);
    doc.text('Verified By (Operations Manager)', 125, finalY + 22);

    doc.line(230, finalY + 18, 280, finalY + 18);
    doc.text('Approved By (Medical Director)', 230, finalY + 22);
  }

  doc.save(`Daily_Clinic_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ==========================================
// 6. MANAGEMENT FINANCIAL SUMMARY REPORT PDF
// ==========================================
export const generateFinancialSummaryReportPDF = (rows, grandTotals, meta = {}) => {
  const { startDate, endDate, accountName = 'All Accounts' } = meta;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  // Clinic Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(CLINIC_INFO.name, 14, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(CLINIC_INFO.address, 14, 18);
  doc.text(`Phone: ${CLINIC_INFO.phone}  |  ${CLINIC_INFO.email}`, 14, 23);

  // Document Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 212, 191); // teal-400
  doc.text('MANAGEMENT FINANCIAL SUMMARY', 210 - 14, 12, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Period: ${startDate ? formatDate(startDate, 'dd MMM yyyy') : 'All'} to ${endDate ? formatDate(endDate, 'dd MMM yyyy') : 'All'}`,
    210 - 14,
    18,
    { align: 'right' }
  );
  doc.text(`Account: ${accountName}`, 210 - 14, 23, { align: 'right' });
  doc.text(`Generated: ${formatDate(new Date(), 'dd MMM yyyy, hh:mm a')}`, 210 - 14, 28, { align: 'right' });

  // Executive KPI summary boxes
  const cardY = 42;
  const cardWidth = 58;
  const cardHeight = 18;

  // Box 1: Total Income
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(204, 251, 241); // teal-100
  doc.roundedRect(14, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text('TOTAL INCOME / COLLECTION', 17, cardY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(grandTotals.income || 0), 17, cardY + 14);

  // Box 2: Total Expenses
  doc.setFillColor(255, 241, 242); // rose-50
  doc.setDrawColor(255, 228, 230); // rose-100
  doc.roundedRect(14 + cardWidth + 4, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text('TOTAL EXPENSES', 14 + cardWidth + 7, cardY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(grandTotals.expenses || 0), 14 + cardWidth + 7, cardY + 14);

  // Box 3: Net Income
  const isNetProfit = (grandTotals.netIncome || 0) >= 0;
  doc.setFillColor(isNetProfit ? 240 : 255, isNetProfit ? 253 : 241, isNetProfit ? 244 : 242);
  doc.setDrawColor(isNetProfit ? 187 : 254, isNetProfit ? 247 : 202, isNetProfit ? 208 : 202);
  doc.roundedRect(14 + (cardWidth + 4) * 2, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isNetProfit ? 22 : 225, isNetProfit ? 101 : 29, isNetProfit ? 52 : 72);
  doc.text('NET INCOME (INCOME - EXPENSES)', 14 + (cardWidth + 4) * 2 + 3, cardY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isNetProfit ? 22 : 225, isNetProfit ? 101 : 29, isNetProfit ? 52 : 72);
  doc.text(`${isNetProfit ? '+' : ''}${formatCurrency(grandTotals.netIncome || 0)}`, 14 + (cardWidth + 4) * 2 + 3, cardY + 14);

  // Table Body
  const tableHead = [
    ['Date', 'Total Income / Collection', 'Total Expenses', 'Net Income'],
  ];

  const tableBody = rows.map((r) => [
    formatDate(r.date, 'dd MMM yyyy (EEEE)'),
    formatCurrency(r.income),
    formatCurrency(r.expenses),
    `${r.netIncome >= 0 ? '+' : ''}${formatCurrency(r.netIncome)}`,
  ]);

  const tableFoot = [
    [
      `Grand Total (${rows.length} ${rows.length === 1 ? 'Date' : 'Dates'})`,
      formatCurrency(grandTotals.income || 0),
      formatCurrency(grandTotals.expenses || 0),
      `${grandTotals.netIncome >= 0 ? '+' : ''}${formatCurrency(grandTotals.netIncome || 0)}`,
    ],
  ];

  autoTable(doc, {
    startY: cardY + cardHeight + 8,
    head: tableHead,
    body: tableBody,
    foot: tableFoot,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', cellWidth: 62 },
      1: { halign: 'right', fontStyle: 'bold', textColor: [13, 148, 136] },
      2: { halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] },
      3: { halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const rawRow = rows[data.row.index];
        if (rawRow && rawRow.netIncome < 0) {
          data.cell.styles.textColor = [220, 38, 38];
        } else if (rawRow && rawRow.netIncome > 0) {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
      if (data.section === 'foot' && data.column.index === 3) {
        if (grandTotals.netIncome < 0) {
          data.cell.styles.textColor = [220, 38, 38];
        } else {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
    },
  });

  // Footer Signatures
  const finalY = doc.lastAutoTable?.finalY || 180;
  if (finalY < 250) {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.line(14, finalY + 22, 60, finalY + 22);
    doc.text('Prepared By (Accounts Officer)', 14, finalY + 26);

    doc.line(80, finalY + 22, 130, finalY + 22);
    doc.text('Verified By (Finance Manager)', 80, finalY + 26);

    doc.line(150, finalY + 22, 196, finalY + 22);
    doc.text('Approved By (Managing Director)', 150, finalY + 26);
  }

  doc.save(`Financial_Summary_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ==========================================
// 7. OUTSTANDING PATIENT BALANCE REPORT PDF
// ==========================================
export const generateOutstandingBalancesReportPDF = (rows, grandTotals, meta = {}) => {
  const { dateRangeText = 'All Time', patientFilter = 'All Patients', statusFilter = 'Outstanding (> 0)' } = meta;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 36, 'F');

  // Clinic Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(CLINIC_INFO.name, 14, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(CLINIC_INFO.address, 14, 18);
  doc.text(`Phone: ${CLINIC_INFO.phone}  |  ${CLINIC_INFO.email}`, 14, 23);

  // Document Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 63, 94); // rose-500
  doc.text('OUTSTANDING PATIENT BALANCE REPORT', 297 - 14, 12, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Period: ${dateRangeText}  |  Patient Filter: ${patientFilter}`, 297 - 14, 18, { align: 'right' });
  doc.text(`Status: ${statusFilter}  |  Records: ${rows.length}`, 297 - 14, 23, { align: 'right' });
  doc.text(`Generated: ${formatDate(new Date(), 'dd MMM yyyy, hh:mm a')}`, 297 - 14, 28, { align: 'right' });

  // Executive KPI summary boxes
  const cardY = 42;
  const cardWidth = 86;
  const cardHeight = 16;

  // Box 1: Total Billing
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL BILLING AMOUNT', 18, cardY + 5.5);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(grandTotals.totalBilling || 0), 18, cardY + 12.5);

  // Box 2: Total Paid
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(204, 251, 241);
  doc.roundedRect(14 + cardWidth + 5, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('TOTAL PAID / SETTLED', 14 + cardWidth + 9, cardY + 5.5);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(formatCurrency(grandTotals.totalPaid || 0), 14 + cardWidth + 9, cardY + 12.5);

  // Box 3: Total Outstanding Balance
  doc.setFillColor(255, 241, 242); // rose-50
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(14 + (cardWidth + 5) * 2, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text('TOTAL OUTSTANDING BALANCE DUE', 14 + (cardWidth + 5) * 2 + 4, cardY + 5.5);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text(formatCurrency(grandTotals.outstandingBalance || 0), 14 + (cardWidth + 5) * 2 + 4, cardY + 12.5);

  // Table Body
  const tableHead = [
    [
      'Patient ID',
      'Patient Name',
      'Phone',
      'Billing Date',
      'Total Billing',
      'Total Paid',
      'Outstanding Balance (Billing - Paid)',
    ],
  ];

  const tableBody = rows.map((r) => [
    r.patientId,
    r.patientName,
    r.phone || '—',
    formatDate(r.billDate, 'dd MMM yyyy'),
    formatCurrency(r.totalBilling),
    formatCurrency(r.totalPaid),
    formatCurrency(r.outstandingBalance),
  ]);

  const tableFoot = [
    [
      `Grand Total (${rows.length} ${rows.length === 1 ? 'Patient' : 'Patients'})`,
      '—',
      '—',
      '—',
      formatCurrency(grandTotals.totalBilling || 0),
      formatCurrency(grandTotals.totalPaid || 0),
      formatCurrency(grandTotals.outstandingBalance || 0),
    ],
  ];

  autoTable(doc, {
    startY: cardY + cardHeight + 8,
    head: tableHead,
    body: tableBody,
    foot: tableFoot,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', cellWidth: 32 },
      1: { halign: 'left', fontStyle: 'bold', cellWidth: 50 },
      2: { halign: 'left', cellWidth: 38 },
      3: { halign: 'center', cellWidth: 32 },
      4: { halign: 'right', fontStyle: 'bold', cellWidth: 38 },
      5: { halign: 'right', fontStyle: 'bold', textColor: [13, 148, 136], cellWidth: 38 },
      6: { halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        data.cell.styles.textColor = [225, 29, 72];
      }
      if (data.section === 'foot' && data.column.index === 6) {
        data.cell.styles.textColor = [225, 29, 72];
      }
    },
  });

  // Footer Signatures
  const finalY = doc.lastAutoTable?.finalY || 160;
  if (finalY < 185) {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.line(18, finalY + 18, 70, finalY + 18);
    doc.text('Prepared By (Billing / Credit Officer)', 18, finalY + 22);

    doc.line(125, finalY + 18, 180, finalY + 18);
    doc.text('Verified By (Accounts Manager)', 125, finalY + 22);

    doc.line(230, finalY + 18, 280, finalY + 18);
    doc.text('Approved By (Managing Director)', 230, finalY + 22);
  }

  doc.save(`Outstanding_Patient_Balances_${new Date().toISOString().split('T')[0]}.pdf`);
};

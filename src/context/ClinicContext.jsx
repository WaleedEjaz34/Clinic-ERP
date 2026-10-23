import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialDoctors } from '../data/mockDoctors';
import { initialPatients } from '../data/mockPatients';
import { initialAppointments } from '../data/mockAppointments';
import { initialPrescriptions } from '../data/mockPrescriptions';
import { initialBills } from '../data/mockBills';
import { initialPayments } from '../data/mockPayments';
import { initialAccounts } from '../data/mockAccounts';
import { initialCategories } from '../data/mockCategories';
import { initialExpenses } from '../data/mockExpenses';
import { initialUsers, defaultRolePermissions } from '../data/mockUsers';
import { initialNotifications } from '../data/mockNotifications';
import { initialMedicines } from '../data/mockMedicines';
import { initialTests } from '../data/mockTests';

const ClinicContext = createContext(null);

const STORAGE_KEYS = {
  DOCTORS: 'medpulse_doctors_v1',
  PATIENTS: 'medpulse_patients_v1',
  APPOINTMENTS: 'medpulse_appointments_v1',
  PRESCRIPTIONS: 'medpulse_prescriptions_v1',
  BILLS: 'medpulse_bills_v1',
  PAYMENTS: 'medpulse_payments_v1',
  ACCOUNTS: 'medpulse_accounts_v1',
  CATEGORIES: 'medpulse_categories_v1',
  EXPENSES: 'medpulse_expenses_v1',
  USERS: 'medpulse_users_v1',
  CURRENT_USER: 'medpulse_current_user_v1',
  NOTIFICATIONS: 'medpulse_notifications_v1',
  MEDICINES: 'medpulse_medicines_master_v1',
  TESTS: 'medpulse_tests_master_v1',
};

const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('LocalStorage parse error for ' + key, e);
    return fallback;
  }
};

export const ClinicProvider = ({ children }) => {
  // Master states
  const [doctors, setDoctors] = useState(() => getStored(STORAGE_KEYS.DOCTORS, initialDoctors));
  const [patients, setPatients] = useState(() => getStored(STORAGE_KEYS.PATIENTS, initialPatients));
  const [appointments, setAppointments] = useState(() => getStored(STORAGE_KEYS.APPOINTMENTS, initialAppointments));
  const [prescriptions, setPrescriptions] = useState(() => getStored(STORAGE_KEYS.PRESCRIPTIONS, initialPrescriptions));
  const [bills, setBills] = useState(() => getStored(STORAGE_KEYS.BILLS, initialBills));
  const [payments, setPayments] = useState(() => getStored(STORAGE_KEYS.PAYMENTS, initialPayments));
  const [accounts, setAccounts] = useState(() => getStored(STORAGE_KEYS.ACCOUNTS, initialAccounts));
  const [categories, setCategories] = useState(() => getStored(STORAGE_KEYS.CATEGORIES, initialCategories));
  const [expenses, setExpenses] = useState(() => getStored(STORAGE_KEYS.EXPENSES, initialExpenses));
  const [users, setUsers] = useState(() => getStored(STORAGE_KEYS.USERS, initialUsers));
  const [notifications, setNotifications] = useState(() => getStored(STORAGE_KEYS.NOTIFICATIONS, initialNotifications));
  const [medicines, setMedicines] = useState(() => getStored(STORAGE_KEYS.MEDICINES, initialMedicines));
  const [tests, setTests] = useState(() => getStored(STORAGE_KEYS.TESTS, initialTests));
  
  // Current user & role simulation
  const [currentUser, setCurrentUser] = useState(() => getStored(STORAGE_KEYS.CURRENT_USER, initialUsers[0]));

  // Toast notification system
  const [toasts, setToasts] = useState([]);
  
  // Active document preview modal (Prescription, Bill, Receipt, Voucher)
  const [documentModal, setDocumentModal] = useState({
    isOpen: false,
    type: null, // 'prescription' | 'bill' | 'receipt' | 'voucher'
    data: null,
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    } catch (err) {
      console.error('Failed to sync to LocalStorage', err);
    }
  }, [doctors, patients, appointments, prescriptions, bills, payments, accounts, categories, expenses, users, currentUser, notifications, medicines, tests]);

  // Toast helpers
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Document modal helpers
  const openDocument = (type, data) => {
    setDocumentModal({ isOpen: true, type, data });
  };

  const closeDocument = () => {
    setDocumentModal({ isOpen: false, type: null, data: null });
  };

  // Switch role simulator
  const switchRole = (roleName) => {
    const match = users.find((u) => u.role === roleName) || {
      id: `USR-${roleName.toUpperCase()}`,
      name: `${roleName} Staff`,
      email: `${roleName.toLowerCase()}@medpulse.pk`,
      phone: '+92 300 0000000',
      role: roleName,
      status: 'Active',
      permissions: defaultRolePermissions[roleName] || defaultRolePermissions.Admin,
    };
    setCurrentUser(match);
    addToast('info', 'Role Switched', `Active role set to ${roleName}`);
  };

  // Reset to factory defaults
  const resetAllData = () => {
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setPrescriptions(initialPrescriptions);
    setBills(initialBills);
    setPayments(initialPayments);
    setAccounts(initialAccounts);
    setCategories(initialCategories);
    setExpenses(initialExpenses);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setNotifications(initialNotifications);
    setMedicines(initialMedicines);
    setTests(initialTests);
    localStorage.clear();
    addToast('success', 'Reset Complete', 'All demo records restored to initial values.');
  };

  // ==========================================
  // NOTIFICATIONS SYSTEM
  // ==========================================
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markNotificationAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Alerts Cleared', 'All pending notifications marked as read.');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    addToast('info', 'Notification Removed', 'Notification removed from activity log.');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('info', 'Notifications Cleared', 'All notification records cleared.');
  };

  const addNotification = ({ title, message, type = 'system', link = '/', actionText = 'View' }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timeAgo: 'Just now',
      read: false,
      link,
      actionText,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // ==========================================
  // PATIENT CRUD & ACTIONS
  // ==========================================
  const addPatient = (patientData) => {
    const newId = `PAT-${1000 + patients.length + 1}`;
    const newPatient = {
      ...patientData,
      id: newId,
      outstandingBalance: Number(patientData.outstandingBalance) || 0,
      registrationDate: patientData.registrationDate || new Date().toISOString().split('T')[0],
      status: patientData.status || 'Active',
    };
    setPatients((prev) => [newPatient, ...prev]);
    addNotification({
      title: 'New Patient Registered',
      message: `${newPatient.name} (MR #${newId}) registered with contact ${newPatient.phone || 'N/A'}.`,
      type: 'patient',
      link: '/patients',
      actionText: 'View Patient',
    });
    addToast('success', 'Patient Registered', `${newPatient.name} (ID: ${newId}) registered successfully.`);
    return newPatient;
  };

  const updatePatient = (id, updatedData) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    addToast('success', 'Patient Updated', 'Patient record updated successfully.');
  };

  const togglePatientStatus = (id) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
      )
    );
    addToast('info', 'Status Changed', 'Patient status updated.');
  };

  // ==========================================
  // DOCTOR CRUD & ACTIONS
  // ==========================================
  const addDoctor = (docData) => {
    const newId = `DOC-${100 + doctors.length + 1}`;
    const newDoc = {
      ...docData,
      id: newId,
      status: docData.status || 'Active',
      consultationFee: Number(docData.consultationFee) || 2000,
      avatar: docData.avatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    };
    setDoctors((prev) => [newDoc, ...prev]);
    addToast('success', 'Doctor Added', `${newDoc.name} has been added to doctors.`);
    return newDoc;
  };

  const updateDoctor = (id, updatedData) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedData } : d))
    );
    addToast('success', 'Doctor Updated', 'Doctor profile updated successfully.');
  };

  const toggleDoctorStatus = (id) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
      )
    );
    addToast('info', 'Status Changed', 'Doctor availability status updated.');
  };

  // ==========================================
  // APPOINTMENT CRUD & ACTIONS
  // ==========================================
  const checkAppointmentConflict = (doctorId, date, time, excludeId = null) => {
    return appointments.some((apt) => {
      if (excludeId && apt.id === excludeId) return false;
      return (
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.time === time &&
        apt.status !== 'Cancelled' &&
        apt.status !== 'No Show'
      );
    });
  };

  const addAppointment = (aptData) => {
    if (checkAppointmentConflict(aptData.doctorId, aptData.date, aptData.time)) {
      addToast('error', 'Booking Conflict', 'This doctor already has an active appointment at this date & time.');
      return { success: false, error: 'Conflict detected' };
    }

    const patient = patients.find((p) => p.id === aptData.patientId);
    const doctor = doctors.find((d) => d.id === aptData.doctorId);

    const newId = `APT-${2000 + appointments.length + 1}`;
    const newApt = {
      ...aptData,
      id: newId,
      patientName: patient ? patient.name : 'Unknown Patient',
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      status: aptData.status || 'Scheduled',
    };

    setAppointments((prev) => [newApt, ...prev]);
    addNotification({
      title: 'Appointment Scheduled',
      message: `${newApt.patientName} scheduled with ${newApt.doctorName} on ${newApt.date} at ${newApt.time}.`,
      type: 'appointment',
      link: '/appointments',
      actionText: 'View Appointment',
    });
    addToast('success', 'Appointment Scheduled', `Appointment ${newId} confirmed for ${newApt.patientName}.`);
    return { success: true, appointment: newApt };
  };

  const updateAppointment = (id, updatedData) => {
    if (updatedData.doctorId && updatedData.date && updatedData.time) {
      if (checkAppointmentConflict(updatedData.doctorId, updatedData.date, updatedData.time, id)) {
        addToast('error', 'Booking Conflict', 'The doctor is already booked at this new time slot.');
        return { success: false, error: 'Conflict detected' };
      }
    }

    const patient = updatedData.patientId ? patients.find((p) => p.id === updatedData.patientId) : null;
    const doctor = updatedData.doctorId ? doctors.find((d) => d.id === updatedData.doctorId) : null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          return {
            ...apt,
            ...updatedData,
            patientName: patient ? patient.name : apt.patientName,
            doctorName: doctor ? doctor.name : apt.doctorName,
          };
        }
        return apt;
      })
    );
    addToast('success', 'Appointment Updated', 'Appointment details updated.');
    return { success: true };
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    addToast('info', 'Status Updated', `Appointment marked as "${newStatus}".`);
  };

  // ==========================================
  // PRESCRIPTION CRUD
  // ==========================================
  const addPrescription = (rxData) => {
    const patient = patients.find((p) => p.id === rxData.patientId);
    const doctor = doctors.find((d) => d.id === rxData.doctorId);

    const newId = `RX-${5000 + prescriptions.length + 1}`;
    const newRx = {
      ...rxData,
      id: newId,
      patientName: patient ? patient.name : rxData.patientName || 'Unknown Patient',
      doctorName: doctor ? doctor.name : rxData.doctorName || 'Unknown Doctor',
      prescriptionDate: rxData.prescriptionDate || new Date().toISOString().split('T')[0],
      status: rxData.status || 'Finalized',
    };

    setPrescriptions((prev) => [newRx, ...prev]);

    // If prescription was linked to an appointment, auto-mark appointment as Completed
    if (rxData.appointmentId) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === rxData.appointmentId ? { ...apt, status: 'Completed' } : apt))
      );
    }

    addNotification({
      title: 'Prescription Finalized',
      message: `Prescription #${newId} finalized for ${newRx.patientName} by ${newRx.doctorName}.`,
      type: 'prescription',
      link: '/prescriptions',
      actionText: 'View Rx',
    });
    addToast('success', 'Prescription Saved', `Prescription ${newId} created for ${newRx.patientName}.`);
    return newRx;
  };

  const updatePrescription = (id, updatedData) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, ...updatedData } : rx))
    );
    addToast('success', 'Prescription Updated', 'Prescription details updated.');
  };

  // ==========================================
  // MEDICINES MASTER CRUD
  // ==========================================
  const addMedicine = (medData) => {
    const newId = medData.id || `MED-${String(medicines.length + 1).padStart(2, '0')}`;
    const newMed = {
      ...medData,
      id: newId,
      name: medData.name?.trim() || 'Unnamed Medicine',
      genericName: medData.genericName?.trim() || '',
      dosage: medData.dosage?.trim() || '',
      dosageForm: medData.dosageForm || 'Tablet',
      frequency: medData.frequency || '1-0-1 (Twice daily)',
      duration: medData.duration || '5 Days',
      instructions: medData.instructions || '',
      category: medData.category || 'General Medicine',
      status: medData.status || 'Active',
    };

    setMedicines((prev) => [newMed, ...prev]);
    addToast('success', 'Medicine Added', `${newMed.name} (${newMed.dosage}) added to master catalog.`);
    return newMed;
  };

  const updateMedicine = (id, updatedData) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedData } : med))
    );
    addToast('success', 'Medicine Updated', 'Medicine master details updated.');
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
    addToast('info', 'Medicine Removed', 'Medicine removed from master catalog.');
  };

  const toggleMedicineStatus = (id) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const nextStatus = med.status === 'Active' ? 'Inactive' : 'Active';
          addToast('info', 'Status Changed', `${med.name} marked as ${nextStatus}.`);
          return { ...med, status: nextStatus };
        }
        return med;
      })
    );
  };

  // ==========================================
  // DIAGNOSTIC TESTS MASTER CRUD
  // ==========================================
  const addTest = (testData) => {
    const newId = testData.id || `TEST-${String(tests.length + 1).padStart(2, '0')}`;
    const newTest = {
      ...testData,
      id: newId,
      name: testData.name?.trim() || 'Unnamed Test',
      category: testData.category || 'General Diagnostics',
      shortCode: testData.shortCode?.trim() || '',
      instructions: testData.instructions || '',
      notes: testData.notes || '',
      sampleType: testData.sampleType || 'Diagnostic Specimen',
      standardPrice: Number(testData.standardPrice) || 0,
      status: testData.status || 'Active',
    };

    setTests((prev) => [newTest, ...prev]);
    addToast('success', 'Test Added', `${newTest.name} added to lab test master.`);
    return newTest;
  };

  const updateTest = (id, updatedData) => {
    setTests((prev) =>
      prev.map((test) => (test.id === id ? { ...test, ...updatedData } : test))
    );
    addToast('success', 'Test Updated', 'Diagnostic test master details updated.');
  };

  const deleteTest = (id) => {
    setTests((prev) => prev.filter((test) => test.id !== id));
    addToast('info', 'Test Removed', 'Test removed from lab master.');
  };

  const toggleTestStatus = (id) => {
    setTests((prev) =>
      prev.map((test) => {
        if (test.id === id) {
          const nextStatus = test.status === 'Active' ? 'Inactive' : 'Active';
          addToast('info', 'Status Changed', `${test.name} marked as ${nextStatus}.`);
          return { ...test, status: nextStatus };
        }
        return test;
      })
    );
  };

  // ==========================================
  // BILLING & INVOICING CRUD
  // ==========================================
  const addBill = (billData) => {
    const patient = patients.find((p) => p.id === billData.patientId);
    const doctor = doctors.find((d) => d.id === billData.doctorId);

    const conFee = Number(billData.consultationFee) || 0;
    const procCharges = Number(billData.procedureCharges) || 0;
    const testCharges = Number(billData.testCharges) || 0;
    const otherCharges = Number(billData.otherCharges) || 0;
    const discount = Number(billData.discount) || 0;

    const totalAmount = Math.max(0, conFee + procCharges + testCharges + otherCharges - discount);
    const paidAmount = Number(billData.paidAmount) || 0;
    const balanceDue = Math.max(0, totalAmount - paidAmount);

    let status = 'Unpaid';
    if (paidAmount >= totalAmount && totalAmount > 0) {
      status = 'Paid';
    } else if (paidAmount > 0) {
      status = 'Partially Paid';
    }

    const newBillNum = `BIL-2026-${String(bills.length + 1).padStart(3, '0')}`;
    const newBill = {
      ...billData,
      id: `BIL-${3000 + bills.length + 1}`,
      billNumber: newBillNum,
      patientName: patient ? patient.name : 'Unknown Patient',
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      billDate: billData.billDate || new Date().toISOString().split('T')[0],
      consultationFee: conFee,
      procedureCharges: procCharges,
      testCharges: testCharges,
      otherCharges: otherCharges,
      discount,
      totalAmount,
      paidAmount,
      balanceDue,
      status,
      items: billData.items || [
        conFee > 0 && { description: 'Doctor Consultation Fee', amount: conFee },
        procCharges > 0 && { description: 'Clinical Procedures', amount: procCharges },
        testCharges > 0 && { description: 'Diagnostic Tests / Labs', amount: testCharges },
        otherCharges > 0 && { description: 'Other Services', amount: otherCharges },
      ].filter(Boolean),
    };

    setBills((prev) => [newBill, ...prev]);

    // Update patient outstanding balance
    if (patient && balanceDue > 0) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patient.id
            ? { ...p, outstandingBalance: (p.outstandingBalance || 0) + balanceDue }
            : p
        )
      );
    }

    addNotification({
      title: 'New Bill Generated',
      message: `Bill #${newBillNum} generated for ${newBill.patientName} for Rs. ${totalAmount.toLocaleString()} (${status}).`,
      type: 'billing',
      link: '/bills',
      actionText: 'View Bill',
    });
    addToast('success', 'Bill Generated', `Bill ${newBillNum} generated for ${newBill.patientName}.`);
    return newBill;
  };

  const updateBill = (id, billData) => {
    const existing = bills.find((b) => b.id === id);
    if (!existing) return;

    const conFee = Number(billData.consultationFee) || 0;
    const procCharges = Number(billData.procedureCharges) || 0;
    const testCharges = Number(billData.testCharges) || 0;
    const otherCharges = Number(billData.otherCharges) || 0;
    const discount = Number(billData.discount) || 0;

    const totalAmount = Math.max(0, conFee + procCharges + testCharges + otherCharges - discount);
    const paidAmount = existing.paidAmount; // preserve historical paid
    const balanceDue = Math.max(0, totalAmount - paidAmount);

    let status = 'Unpaid';
    if (paidAmount >= totalAmount && totalAmount > 0) {
      status = 'Paid';
    } else if (paidAmount > 0) {
      status = 'Partially Paid';
    }

    // Adjust patient outstanding balance difference
    const diff = balanceDue - existing.balanceDue;
    if (diff !== 0 && existing.patientId) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === existing.patientId
            ? { ...p, outstandingBalance: Math.max(0, (p.outstandingBalance || 0) + diff) }
            : p
        )
      );
    }

    setBills((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              ...billData,
              consultationFee: conFee,
              procedureCharges: procCharges,
              testCharges: testCharges,
              otherCharges: otherCharges,
              discount,
              totalAmount,
              balanceDue,
              status,
            }
          : b
      )
    );
    addToast('success', 'Bill Updated', `Bill ${existing.billNumber} recalculation applied.`);
  };

  // ==========================================
  // PAYMENT COLLECTION & TRANSACTION FLOW
  // ==========================================
  const collectPayment = (paymentData) => {
    const amount = Number(paymentData.amount) || 0;
    if (amount <= 0) {
      addToast('error', 'Invalid Amount', 'Payment amount must be greater than zero.');
      return { success: false, error: 'Invalid amount' };
    }

    const bill = bills.find((b) => b.id === paymentData.billId);
    if (!bill) {
      addToast('error', 'Bill Not Found', 'Please select a valid bill.');
      return { success: false, error: 'Bill not found' };
    }

    if (amount > bill.balanceDue) {
      addToast('error', 'Amount Exceeds Due', `Payment of Rs. ${amount} exceeds the outstanding balance of Rs. ${bill.balanceDue}.`);
      return { success: false, error: 'Exceeds balance' };
    }

    const account = accounts.find((a) => a.id === paymentData.accountId);
    if (!account) {
      addToast('error', 'Account Required', 'Please select a receiving cash or bank account.');
      return { success: false, error: 'Account required' };
    }

    const patient = patients.find((p) => p.id === paymentData.patientId);

    const newReceiptNum = `RCP-2026-${String(payments.length + 1).padStart(3, '0')}`;
    const newPayment = {
      ...paymentData,
      id: `PAY-${4000 + payments.length + 1}`,
      receiptNumber: newReceiptNum,
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      amount,
      patientName: patient ? patient.name : bill.patientName,
      billNumber: bill.billNumber,
      accountName: account.name,
      receivedBy: currentUser.name,
    };

    // 1. Add payment to records
    setPayments((prev) => [newPayment, ...prev]);

    // 2. Update target bill's paidAmount, balanceDue, and status
    const newPaidAmount = bill.paidAmount + amount;
    const newBalanceDue = Math.max(0, bill.totalAmount - newPaidAmount);
    const newStatus = newBalanceDue === 0 ? 'Paid' : 'Partially Paid';

    setBills((prev) =>
      prev.map((b) =>
        b.id === bill.id
          ? { ...b, paidAmount: newPaidAmount, balanceDue: newBalanceDue, status: newStatus }
          : b
      )
    );

    // 3. Update patient's outstanding balance
    if (patient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patient.id
            ? { ...p, outstandingBalance: Math.max(0, (p.outstandingBalance || 0) - amount) }
            : p
        )
      );
    }

    // 4. Increase Cash/Bank account currentBalance
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === account.id
          ? { ...a, currentBalance: (a.currentBalance || 0) + amount }
          : a
      )
    );

    addNotification({
      title: 'Payment Received',
      message: `Rs. ${amount.toLocaleString()} received via ${newPayment.paymentMethod || 'Cash'} for Bill #${bill.billNumber} (${newPayment.patientName}).`,
      type: 'payment',
      link: '/payments',
      actionText: 'View Receipt',
    });
    addToast('success', 'Payment Collected', `Receipt ${newReceiptNum} generated. Rs. ${amount} deposited to ${account.name}.`);
    return { success: true, payment: newPayment };
  };

  // ==========================================
  // EXPENSES CRUD & ACCOUNT BALANCE DEDUCTIONS
  // ==========================================
  const addExpense = (expenseData) => {
    const amount = Number(expenseData.amount) || 0;
    if (amount <= 0) {
      addToast('error', 'Invalid Amount', 'Expense amount must be greater than zero.');
      return { success: false, error: 'Invalid amount' };
    }

    const account = accounts.find((a) => a.id === expenseData.accountId);
    if (!account) {
      addToast('error', 'Account Required', 'Please select a valid payment account.');
      return { success: false, error: 'Account required' };
    }

    // Prevent negative balance if account does not have sufficient funds
    if (account.currentBalance < amount) {
      addToast('error', 'Insufficient Funds', `Account ${account.name} has only Rs. ${account.currentBalance}. Cannot deduct Rs. ${amount}.`);
      return { success: false, error: 'Insufficient funds' };
    }

    const category = categories.find((c) => c.id === expenseData.categoryId);

    const newId = `EXP-${6000 + expenses.length + 1}`;
    const newExpense = {
      ...expenseData,
      id: newId,
      amount,
      categoryName: category ? category.name : 'General Expense',
      accountName: account.name,
      expenseDate: expenseData.expenseDate || new Date().toISOString().split('T')[0],
      reference: expenseData.reference || `VOUCH-2026-${String(expenses.length + 1).padStart(3, '0')}`,
      authorizedBy: expenseData.authorizedBy || currentUser.name,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // Deduct from account balance
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === account.id ? { ...a, currentBalance: a.currentBalance - amount } : a
      )
    );

    addNotification({
      title: 'Expense Recorded',
      message: `Rs. ${amount.toLocaleString()} disbursed for ${newExpense.title} (${newExpense.categoryName}) from ${account.name}.`,
      type: 'expense',
      link: '/expenses',
      actionText: 'View Expense',
    });
    addToast('success', 'Expense Recorded', `Expense of Rs. ${amount} deducted from ${account.name}.`);
    return { success: true, expense: newExpense };
  };

  const updateExpense = (id, updatedData) => {
    const existing = expenses.find((e) => e.id === id);
    if (!existing) return { success: false };

    const newAmount = Number(updatedData.amount) || 0;
    const oldAmount = existing.amount;
    const oldAccountId = existing.accountId;
    const newAccountId = updatedData.accountId || oldAccountId;

    // Check account funds if amount increased or changed account
    const targetAccount = accounts.find((a) => a.id === newAccountId);
    if (!targetAccount) return { success: false };

    // Reverse old expense first, then deduct new
    setAccounts((prev) =>
      prev.map((a) => {
        let bal = a.currentBalance;
        if (a.id === oldAccountId) {
          bal += oldAmount; // restore
        }
        if (a.id === newAccountId) {
          bal -= newAmount; // deduct
        }
        return { ...a, currentBalance: bal };
      })
    );

    const category = categories.find((c) => c.id === updatedData.categoryId);

    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...updatedData,
              amount: newAmount,
              categoryName: category ? category.name : e.categoryName,
              accountName: targetAccount.name,
            }
          : e
      )
    );

    addToast('success', 'Expense Updated', 'Expense voucher and account balance updated.');
    return { success: true };
  };

  const deleteExpense = (id) => {
    const existing = expenses.find((e) => e.id === id);
    if (!existing) return;

    // Restore amount to account
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === existing.accountId
          ? { ...a, currentBalance: a.currentBalance + existing.amount }
          : a
      )
    );

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addToast('info', 'Expense Deleted', `Rs. ${existing.amount} restored to ${existing.accountName}.`);
  };

  // ==========================================
  // ACCOUNTS CRUD
  // ==========================================
  const addAccount = (accData) => {
    const newId = `ACC-${String(accounts.length + 1).padStart(2, '0')}`;
    const newAcc = {
      ...accData,
      id: newId,
      openingBalance: Number(accData.openingBalance) || 0,
      currentBalance: Number(accData.openingBalance) || 0,
      status: accData.status || 'Active',
    };
    setAccounts((prev) => [...prev, newAcc]);
    addToast('success', 'Account Added', `Account ${newAcc.name} created.`);
    return newAcc;
  };

  const updateAccount = (id, updatedData) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
    );
    addToast('success', 'Account Updated', 'Account details saved.');
  };

  const toggleAccountStatus = (id) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a
      )
    );
    addToast('info', 'Status Toggled', 'Account status modified.');
  };

  // ==========================================
  // CHART OF ACCOUNTS (COA)
  // ==========================================
  const addCategory = (catData) => {
    const count = categories.filter((c) => c.type === catData.type).length + 1;
    const prefix = catData.type === 'Income' ? 'INC' : 'EXP';
    const newId = `CAT-${prefix}-${String(count).padStart(2, '0')}`;
    const code = catData.code || `${prefix}-${catData.type === 'Income' ? '4' : '5'}${String(count).padStart(3, '0')}`;

    const newCat = {
      ...catData,
      id: newId,
      code,
      status: catData.status || 'Active',
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Category Created', `Category ${newCat.name} added.`);
    return newCat;
  };

  const updateCategory = (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    addToast('success', 'Category Updated', 'Category details saved.');
  };

  const toggleCategoryStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
      )
    );
    addToast('info', 'Status Changed', 'Category active status updated.');
  };

  // ==========================================
  // USERS & ROLES
  // ==========================================
  const addUser = (userData) => {
    const newId = `USR-${100 + users.length + 1}`;
    const rolePermissions = defaultRolePermissions[userData.role] || defaultRolePermissions.Receptionist;
    const newUser = {
      ...userData,
      id: newId,
      status: userData.status || 'Active',
      lastLogin: 'Never',
      permissions: userData.permissions || rolePermissions,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newUser]);
    addToast('success', 'User Created', `User ${newUser.name} created with role ${newUser.role}.`);
    return newUser;
  };

  const updateUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updatedData }));
    }
    addToast('success', 'User Updated', 'User information saved.');
  };

  const deleteUser = (id) => {
    if (currentUser.id === id) {
      addToast('error', 'Action Blocked', 'You cannot delete the currently active user.');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast('info', 'User Removed', 'User has been deleted.');
  };

  const updateUserPermissions = (roleName, moduleName, permissionKey, isGranted) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.role === roleName) {
          const currentModulePerms = u.permissions?.[moduleName] || [];
          let updatedModulePerms;
          if (isGranted) {
            updatedModulePerms = Array.from(new Set([...currentModulePerms, permissionKey]));
          } else {
            updatedModulePerms = currentModulePerms.filter((p) => p !== permissionKey);
          }
          return {
            ...u,
            permissions: {
              ...u.permissions,
              [moduleName]: updatedModulePerms,
            },
          };
        }
        return u;
      })
    );
    addToast('success', 'Permission Updated', `${roleName} permission for ${moduleName} updated.`);
  };

  return (
    <ClinicContext.Provider
      value={{
        // Data states
        doctors,
        patients,
        appointments,
        prescriptions,
        bills,
        payments,
        accounts,
        categories,
        expenses,
        users,
        currentUser,

        // Actions & CRUD
        addPatient,
        updatePatient,
        togglePatientStatus,

        addDoctor,
        updateDoctor,
        toggleDoctorStatus,

        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        checkAppointmentConflict,

        addPrescription,
        updatePrescription,

        // Medicines Master
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        toggleMedicineStatus,

        // Tests Master
        tests,
        addTest,
        updateTest,
        deleteTest,
        toggleTestStatus,

        addBill,
        updateBill,

        collectPayment,

        addExpense,
        updateExpense,
        deleteExpense,

        addAccount,
        updateAccount,
        toggleAccountStatus,

        addCategory,
        updateCategory,
        toggleCategoryStatus,

        addUser,
        updateUser,
        deleteUser,
        updateUserPermissions,

        // User / Simulator
        switchRole,
        resetAllData,

        // Toast system
        toasts,
        addToast,
        removeToast,

        // Notifications system
        notifications,
        unreadNotifCount,
        markNotificationAsRead,
        markNotificationAsUnread,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,

        // Document preview system
        documentModal,
        openDocument,
        closeDocument,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

const todayStr = new Date().toISOString().split('T')[0];

export const initialPrescriptions = [
  {
    id: 'RX-5001',
    prescriptionDate: todayStr,
    appointmentId: 'APT-2004',
    patientId: 'PAT-1004',
    patientName: 'Zainab Bibi',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Tariq Mahmood',
    complaint: 'Generalized fatigue, persistent polydipsia, and numbness in both feet.',
    diagnosis: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy & Stage 1 HTN',
    doctorNotes: 'Maintain strict low glycemic diet. Walk 30 minutes daily. Monitor fasting glucose twice weekly.',
    followUpDate: '2026-11-20',
    medicines: [
      {
        id: 'MED-1',
        name: 'Glucophage (Metformin)',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily)',
        duration: '30 Days',
        instructions: 'Take immediately with or after meals'
      },
      {
        id: 'MED-2',
        name: 'Concor (Bisoprolol)',
        dosage: '2.5 mg',
        frequency: '1-0-0 (Morning)',
        duration: '30 Days',
        instructions: 'Take early morning on empty stomach'
      },
      {
        id: 'MED-3',
        name: 'Neurobion Forte',
        dosage: '1 Tab',
        frequency: '0-0-1 (Night)',
        duration: '15 Days',
        instructions: 'Take after dinner'
      }
    ],
    tests: [
      {
        id: 'TEST-1',
        name: 'HbA1c & Fasting Lipid Profile',
        instructions: 'Requires 10-12 hours overnight fasting'
      },
      {
        id: 'TEST-2',
        name: 'Urine Microalbumin / Creatinine Ratio',
        instructions: 'First morning urine sample'
      }
    ],
    status: 'Finalized'
  },
  {
    id: 'RX-5002',
    prescriptionDate: '2026-10-18',
    appointmentId: 'APT-2007',
    patientId: 'PAT-1002',
    patientName: 'Fatima Zahra',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Ayesha Siddiqui',
    complaint: 'Erythema and mild flaking on cheeks following aesthetic treatment.',
    diagnosis: 'Post-inflammatory Erythema & Contact Dermatitis',
    doctorNotes: 'Avoid direct sunlight. Discontinue AHA/BHA serums until cleared.',
    followUpDate: '2026-11-02',
    medicines: [
      {
        id: 'MED-1',
        name: 'Fucicort Cream',
        dosage: 'Thin layer',
        frequency: '1-0-1 (Twice daily)',
        duration: '7 Days',
        instructions: 'Apply gently on affected areas only'
      },
      {
        id: 'MED-2',
        name: 'Physiogel Calming Relief A.I. Cream',
        dosage: 'As required',
        frequency: 'PRN (As needed)',
        duration: '30 Days',
        instructions: 'Liberal moisturizer application'
      },
      {
        id: 'MED-3',
        name: 'Suncoat SPF 60+ Gel',
        dosage: '2 Finger lengths',
        frequency: 'Morning & Noon',
        duration: 'Continuous',
        instructions: 'Reapply every 3 hours outdoors'
      }
    ],
    tests: [],
    status: 'Finalized'
  },
  {
    id: 'RX-5003',
    prescriptionDate: '2026-10-15',
    appointmentId: 'APT-2006',
    patientId: 'PAT-1001',
    patientName: 'Muhammad Rizwan',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Tariq Mahmood',
    complaint: 'Episodic palpitations after heavy meals and moderate exertion.',
    diagnosis: 'Essential Hypertension & Sinus Tachycardia',
    doctorNotes: 'Sodium restriction to < 2g per day. Maintain BP diary.',
    followUpDate: '2026-10-29',
    medicines: [
      {
        id: 'MED-1',
        name: 'Exforge (Amlodipine/Valsartan)',
        dosage: '5/80 mg',
        frequency: '1-0-0 (Morning)',
        duration: '30 Days',
        instructions: 'Take consistently at 9:00 AM'
      },
      {
        id: 'MED-2',
        name: 'Ascard (Aspirin)',
        dosage: '75 mg',
        frequency: '0-0-1 (Night)',
        duration: '30 Days',
        instructions: 'Take after evening meal'
      }
    ],
    tests: [
      {
        id: 'TEST-1',
        name: '12-Lead Electrocardiogram (ECG)',
        instructions: 'Baseline cardiac rhythm evaluation'
      }
    ],
    status: 'Finalized'
  }
];

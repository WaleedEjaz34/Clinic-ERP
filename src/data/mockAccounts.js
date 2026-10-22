export const initialAccounts = [
  {
    id: 'ACC-01',
    name: 'Main Cash Register',
    type: 'Cash',
    bankName: '',
    accountNumber: 'CASH-ISB-01',
    openingBalance: 50000,
    currentBalance: 51500, // Opening + 1500 cash payment - 0 expenses
    status: 'Active',
    description: 'Physical reception cash drawer for daily OPD patient collections and minor petty cash.',
  },
  {
    id: 'ACC-02',
    name: 'Meezan Bank - Operational A/C',
    type: 'Bank',
    bankName: 'Meezan Bank Limited',
    accountNumber: 'PK72MEZN00010009847281',
    openingBalance: 450000,
    currentBalance: 443500, // 450000 + 6000 card - 12500 clinic utility/expenses
    status: 'Active',
    description: 'Primary digital POS merchant settlements and operational bank transactions.',
  },
  {
    id: 'ACC-03',
    name: 'HBL Islamic Clinic Collection',
    type: 'Bank',
    bankName: 'Habib Bank Limited (Islamic)',
    accountNumber: 'PK34HABB00234509182301',
    openingBalance: 320000,
    currentBalance: 323500, // 320000 + 3500 IBFT
    status: 'Active',
    description: 'Online patient transfers, Raast QR receipts, and corporate medical reimbursements.',
  },
  {
    id: 'ACC-04',
    name: 'Petty Cash - Pharmacy/Emergency',
    type: 'Cash',
    bankName: '',
    accountNumber: 'CASH-EMG-02',
    openingBalance: 15000,
    currentBalance: 12200,
    status: 'Active',
    description: 'Emergency emergency-room supplies and immediate consumable replacements.',
  }
];

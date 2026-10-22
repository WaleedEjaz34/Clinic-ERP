import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { DoctorsPage } from '../pages/doctors/DoctorsPage';
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage';
import { PatientsPage } from '../pages/patients/PatientsPage';
import { PrescriptionsPage } from '../pages/prescriptions/PrescriptionsPage';
import { BillsPage } from '../pages/bills/BillsPage';
import { PaymentsPage } from '../pages/payments/PaymentsPage';
import { ExpensesPage } from '../pages/expenses/ExpensesPage';
import { AccountsPage } from '../pages/accounts/AccountsPage';
import { ChartOfAccountsPage } from '../pages/chart-of-accounts/ChartOfAccountsPage';
import { UsersPage } from '../pages/users/UsersPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
      {
        path: 'patients',
        element: <PatientsPage />,
      },
      {
        path: 'prescriptions',
        element: <PrescriptionsPage />,
      },
      {
        path: 'bills',
        element: <BillsPage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'chart-of-accounts',
        element: <ChartOfAccountsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

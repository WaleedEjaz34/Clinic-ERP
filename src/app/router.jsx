import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { DoctorsPage } from '../pages/doctors/DoctorsPage';
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage';
import { PatientsPage } from '../pages/patients/PatientsPage';
import { PrescriptionsPage } from '../pages/prescriptions/PrescriptionsPage';
import { MedicinesPage } from '../pages/prescriptions/MedicinesPage';
import { TestsPage } from '../pages/prescriptions/TestsPage';
import { BillsPage } from '../pages/bills/BillsPage';
import { PaymentsPage } from '../pages/payments/PaymentsPage';
import { ExpensesPage } from '../pages/expenses/ExpensesPage';
import { AccountsPage } from '../pages/accounts/AccountsPage';
import { ChartOfAccountsPage } from '../pages/chart-of-accounts/ChartOfAccountsPage';
import { UsersPage } from '../pages/users/UsersPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { DailyActivityReportPage } from '../pages/reports/DailyActivityReportPage';
import { FinancialSummaryReportPage } from '../pages/reports/FinancialSummaryReportPage';
import { OutstandingBalancesReportPage } from '../pages/reports/OutstandingBalancesReportPage';
import { ActivityLogPage } from '../pages/activity/ActivityLogPage';
import { RouteErrorBoundary } from '../components/common/RouteErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
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
        path: 'prescriptions/medicines',
        element: <MedicinesPage />,
      },
      {
        path: 'prescriptions/tests',
        element: <TestsPage />,
      },
      {
        path: 'medicines',
        element: <Navigate to="/prescriptions/medicines" replace />,
      },
      {
        path: 'tests',
        element: <Navigate to="/prescriptions/tests" replace />,
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
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'reports/daily-summary',
        element: <DailyActivityReportPage />,
      },
      {
        path: 'daily-summary',
        element: <DailyActivityReportPage />,
      },
      {
        path: 'reports/financial-summary',
        element: <FinancialSummaryReportPage />,
      },
      {
        path: 'financial-summary',
        element: <FinancialSummaryReportPage />,
      },
      {
        path: 'reports/financial',
        element: <Navigate to="/reports/financial-summary" replace />,
      },
      {
        path: 'reports/outstanding-balances',
        element: <OutstandingBalancesReportPage />,
      },
      {
        path: 'reports/outstanding',
        element: <OutstandingBalancesReportPage />,
      },
      {
        path: 'outstanding-balances',
        element: <OutstandingBalancesReportPage />,
      },
      {
        path: 'reports',
        element: <Navigate to="/reports/financial-summary" replace />,
      },
      {
        path: 'activity-log',
        element: <ActivityLogPage />,
      },
      {
        path: 'activity',
        element: <ActivityLogPage />,
      },
      {
        path: 'reports/activity-log',
        element: <ActivityLogPage />,
      },
      {
        path: 'settings/activity-log',
        element: <ActivityLogPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

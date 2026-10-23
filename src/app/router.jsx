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
import { DoctorPerformanceReportPage } from '../pages/reports/DoctorPerformanceReportPage';
import { ActivityLogPage } from '../pages/activity/ActivityLogPage';
import { RouteErrorBoundary } from '../components/common/RouteErrorBoundary';

// Website CMS Module Pages
import { WebsiteCMSLayout } from '../pages/website-cms/WebsiteCMSLayout';
import { CMSDashboard } from '../pages/website-cms/CMSDashboard';
import { WebsiteSettings } from '../pages/website-cms/WebsiteSettings';
import { HomepageBuilder } from '../pages/website-cms/HomepageBuilder';
import { PagesManager } from '../pages/website-cms/PagesManager';
import { ServicesManager } from '../pages/website-cms/ServicesManager';
import { DoctorProfiles } from '../pages/website-cms/DoctorProfiles';
import { ContactSettings } from '../pages/website-cms/ContactSettings';
import { GalleryManager } from '../pages/website-cms/GalleryManager';
import { TestimonialsManager } from '../pages/website-cms/TestimonialsManager';
import { BlogManager } from '../pages/website-cms/BlogManager';
import { FAQManager } from '../pages/website-cms/FAQManager';
import { SEOSettings } from '../pages/website-cms/SEOSettings';
import { NavigationBuilder } from '../pages/website-cms/NavigationBuilder';
import { MediaLibrary } from '../pages/website-cms/MediaLibrary';
import { ThemeSettings } from '../pages/website-cms/ThemeSettings';

// Public Website Preview
import { WebsitePreview } from '../pages/website-preview/WebsitePreview';

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
        path: 'reports/doctor-performance',
        element: <DoctorPerformanceReportPage />,
      },
      {
        path: 'reports/doctor-summary',
        element: <DoctorPerformanceReportPage />,
      },
      {
        path: 'doctor-performance',
        element: <DoctorPerformanceReportPage />,
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
        path: 'website-cms',
        element: <WebsiteCMSLayout />,
        children: [
          {
            index: true,
            element: <CMSDashboard />,
          },
          {
            path: 'settings',
            element: <WebsiteSettings />,
          },
          {
            path: 'homepage',
            element: <HomepageBuilder />,
          },
          {
            path: 'pages',
            element: <PagesManager />,
          },
          {
            path: 'services',
            element: <ServicesManager />,
          },
          {
            path: 'doctors',
            element: <DoctorProfiles />,
          },
          {
            path: 'contact',
            element: <ContactSettings />,
          },
          {
            path: 'gallery',
            element: <GalleryManager />,
          },
          {
            path: 'testimonials',
            element: <TestimonialsManager />,
          },
          {
            path: 'blog',
            element: <BlogManager />,
          },
          {
            path: 'faqs',
            element: <FAQManager />,
          },
          {
            path: 'seo',
            element: <SEOSettings />,
          },
          {
            path: 'navigation',
            element: <NavigationBuilder />,
          },
          {
            path: 'media',
            element: <MediaLibrary />,
          },
          {
            path: 'theme',
            element: <ThemeSettings />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/website-preview',
    element: <WebsitePreview />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/preview',
    element: <Navigate to="/website-preview" replace />,
  },
]);

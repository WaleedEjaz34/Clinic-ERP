import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../common/ToastContainer';
import { DocumentPreviewModal } from '../documents/DocumentPreviewModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area - Full Screen Responsive Container with clearance for mobile bottom nav */}
      <main className="flex-1 px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-24 md:pb-8 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Sticky Mobile Bottom Navigation & Action Bar */}
      <MobileBottomNav />

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <DocumentPreviewModal />
    </div>
  );
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/ToastContainer';
import { DocumentPreviewModal } from '../documents/DocumentPreviewModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area - Full Screen Responsive Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 w-full">
        <Outlet />
      </main>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <DocumentPreviewModal />
    </div>
  );
};

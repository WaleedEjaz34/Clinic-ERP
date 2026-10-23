import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  Printer,
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  Download,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Receipt,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

const SETTING_TABS = [
  { id: 'clinic', label: 'Clinic Settings', icon: Building2 },
  { id: 'printing', label: 'Printing Settings', icon: Printer },
  { id: 'system', label: 'System Configurations', icon: Sliders },
];

const CURRENCIES = [
  { value: 'PKR', label: 'PKR (Pakistani Rupee)', symbol: 'Rs.' },
  { value: 'USD', label: 'USD (US Dollar)', symbol: '$' },
  { value: 'EUR', label: 'EUR (Euro)', symbol: '€' },
  { value: 'GBP', label: 'GBP (British Pound)', symbol: '£' },
  { value: 'AED', label: 'AED (UAE Dirham)', symbol: 'AED' },
  { value: 'SAR', label: 'SAR (Saudi Riyal)', symbol: 'SAR' },
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 23/10/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 10/23/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO 8601)' },
];

const PRINT_LAYOUTS = [
  { value: 'a4', label: 'A4 Standard (Full Sheet)' },
  { value: 'a5', label: 'A5 Compact (Half Sheet)' },
  { value: 'thermal80', label: '80mm Thermal POS Receipt' },
  { value: 'thermal58', label: '58mm Mobile Thermal Receipt' },
];

export const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const currentTab = SETTING_TABS.some((tab) => tab.id === rawTab) ? rawTab : 'clinic';

  useEffect(() => {
    if (rawTab === 'roles') {
      setSearchParams({ tab: 'clinic' }, { replace: true });
    }
  }, [rawTab, setSearchParams]);

  const {
    currentUser,
    resetAllData,
    patients,
    doctors,
    appointments,
    prescriptions,
    bills,
    payments,
    expenses,
    accounts,
    categories,
    addToast,
  } = useClinic();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Clinic Settings Form
  const [clinicSettings, setClinicSettings] = useState({
    name: 'MedPulse Specialty Clinic & Diagnostic Centre',
    tagline: 'Advanced Multi-Specialty Ambulatory Care',
    phone: '+92 (051) 843-2210',
    emergencyPhone: '+92 300 5550199',
    email: 'info@medpulse.pk',
    address: 'Plot 42, Executive Medical Enclave, Sector F-8/3',
    city: 'Islamabad, Pakistan',
    taxNumber: 'NTN-8821940-2',
    currency: 'PKR',
    consultationDuration: '20',
    operatingHours: 'Monday - Saturday: 08:30 AM - 09:30 PM (Sunday Emergency Only)',
  });

  // Printing Settings Form
  const [printingSettings, setPrintingSettings] = useState({
    defaultLayout: 'a4',
    showHospitalHeader: true,
    showDoctorSignature: true,
    autoPrintReceipt: true,
    prescriptionFooterNote: 'Prescription valid for 15 days from consultation date. Not valid without doctor signature.',
    invoiceTerms: 'Payment due upon service issuance. Goods/medicines once opened cannot be returned.',
  });

  // System Configurations Form
  const [systemConfig, setSystemConfig] = useState({
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    timezone: 'Asia/Karachi (UTC+05:00)',
    enableAuditLog: true,
    autoBackupFrequency: 'Daily',
  });

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleSave = (sectionName) => {
    setSaveSuccessMsg(`${sectionName} saved successfully.`);
    addToast({
      title: 'Settings Saved',
      message: `${sectionName} configuration has been updated.`,
      type: 'success',
    });
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      clinic: clinicSettings,
      printing: printingSettings,
      system: systemConfig,
      data: {
        patients,
        doctors,
        appointments,
        prescriptions,
        bills,
        payments,
        expenses,
        accounts,
        categories,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Clinic_ERP_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      title: 'Backup Generated',
      message: 'Full clinic database export JSON downloaded successfully.',
      type: 'success',
    });
  };

  const handleConfirmReset = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
    addToast({
      title: 'Demo Data Restored',
      message: 'Clinic ERP records successfully reset to factory demo state.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clinic Settings & Configurations"
        subtitle="Manage clinic profile, document printing parameters, and system backups."
        breadcrumbs={[{ label: 'Settings' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Database</span>
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        }
      />

      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Container with Sidebar Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Navigation Sidebar (Horizontal on mobile, vertical on desktop) */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-200/90 bg-slate-50/60 p-2.5 sm:p-3">
          <div className="hidden md:block px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Configuration Sections
          </div>
          <div className="flex md:flex-col overflow-x-auto no-scrollbar gap-1.5">
            {SETTING_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`whitespace-nowrap flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-xs border border-brand-200/80 ring-1 ring-brand-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:block pt-6 px-3">
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-[11px] text-brand-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-brand-700">
                <UserCheck className="w-3.5 h-3.5" />
                Active Session
              </span>
              <p className="text-slate-600">
                Logged in as <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.role})
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="md:col-span-9 p-4 sm:p-6 lg:p-8">
          {/* TAB 1: Clinic Settings */}
          {currentTab === 'clinic' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">Clinic Profile & Identity</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  General details displayed across invoices, patient receipts, and prescription headers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinic / Hospital Legal Name *
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.name}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinic Tagline / Header Description
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.tagline}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Telephone *
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.phone}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Helpline
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.emergencyPhone}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={clinicSettings.email}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tax / Healthcare Commission NTN
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.taxNumber}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinic Physical Address & City
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.address}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs mb-2"
                  />
                  <input
                    type="text"
                    value={clinicSettings.city}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Currency
                  </label>
                  <SearchableSelect
                    value={clinicSettings.currency}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                    searchPlaceholder="Search currency..."
                    options={CURRENCIES}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Consultation Slot (Minutes)
                  </label>
                  <SearchableSelect
                    value={clinicSettings.consultationDuration}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, consultationDuration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    searchPlaceholder="Search slot duration..."
                  >
                    <option value="15">15 Minutes per Slot</option>
                    <option value="20">20 Minutes per Slot</option>
                    <option value="30">30 Minutes per Slot</option>
                    <option value="45">45 Minutes per Slot</option>
                  </SearchableSelect>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Schedule & OPD Hours
                  </label>
                  <input
                    type="text"
                    value={clinicSettings.operatingHours}
                    onChange={(e) => setClinicSettings({ ...clinicSettings, operatingHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Clinic Profile Settings')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Printing Settings */}
          {currentTab === 'printing' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">Printing & Document Templates</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize headers, footers, and format configurations for PDF and thermal receipt printouts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Printing Output Format
                  </label>
                  <SearchableSelect
                    value={printingSettings.defaultLayout}
                    onChange={(e) => setPrintingSettings({ ...printingSettings, defaultLayout: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                    searchPlaceholder="Search print layout..."
                    options={PRINT_LAYOUTS}
                  />
                </div>

                <div className="space-y-2.5 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={printingSettings.showHospitalHeader}
                      onChange={(e) => setPrintingSettings({ ...printingSettings, showHospitalHeader: e.target.checked })}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Include Official Hospital Header & Logo on all clinical documents
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={printingSettings.showDoctorSignature}
                      onChange={(e) => setPrintingSettings({ ...printingSettings, showDoctorSignature: e.target.checked })}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Include Attending Doctor Digital Signature / Stamp Box on Prescriptions
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={printingSettings.autoPrintReceipt}
                      onChange={(e) => setPrintingSettings({ ...printingSettings, autoPrintReceipt: e.target.checked })}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Automatically open Print Preview Dialog immediately after recording a payment
                    </span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prescription (Rx) Footer Instructions & Legal Disclaimer
                  </label>
                  <textarea
                    rows={2}
                    value={printingSettings.prescriptionFooterNote}
                    onChange={(e) => setPrintingSettings({ ...printingSettings, prescriptionFooterNote: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Invoice & Payment Receipt Terms & Conditions
                  </label>
                  <textarea
                    rows={2}
                    value={printingSettings.invoiceTerms}
                    onChange={(e) => setPrintingSettings({ ...printingSettings, invoiceTerms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('Printing Settings')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Printing Setup</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: System Configurations */}
          {currentTab === 'system' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">System Configurations & Data Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Localization, audit options, database metrics, and backup restores.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date Display Format
                  </label>
                  <SearchableSelect
                    value={systemConfig.dateFormat}
                    onChange={(e) => setSystemConfig({ ...systemConfig, dateFormat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    searchPlaceholder="Search date format..."
                    options={DATE_FORMATS}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Timezone
                  </label>
                  <SearchableSelect
                    value={systemConfig.timezone}
                    onChange={(e) => setSystemConfig({ ...systemConfig, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    searchPlaceholder="Search timezone..."
                  >
                    <option value="Asia/Karachi (UTC+05:00)">Asia/Karachi (UTC+05:00)</option>
                    <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (UTC+04:00)</option>
                    <option value="Asia/Riyadh (UTC+03:00)">Asia/Riyadh (UTC+03:00)</option>
                    <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                    <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                  </SearchableSelect>
                </div>
              </div>

              {/* Database Metrics Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Local ERP Database Statistics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Patients</span>
                    <span className="text-base font-bold text-slate-900">{patients.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Doctors</span>
                    <span className="text-base font-bold text-slate-900">{doctors.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Appointments</span>
                    <span className="text-base font-bold text-slate-900">{appointments.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Prescriptions</span>
                    <span className="text-base font-bold text-slate-900">{prescriptions.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSave('System Configurations')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save System Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Restore Default Demo Records"
        message="Are you sure you want to restore the initial demo state? All newly created patients, appointments, bills, and payments will be reset to factory sample data."
        confirmText="Reset Records"
        type="danger"
      />
    </div>
  );
};

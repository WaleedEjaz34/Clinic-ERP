import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Users,
  FileText,
  Receipt,
  CreditCard,
  TrendingDown,
  Landmark,
  Layers,
  ShieldCheck,
  Activity,
  RotateCcw,
  Menu,
  X,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Bell,
  Check,
  CheckCheck,
  ArrowRight,
  UserCheck,
  LogOut,
  Settings,
  Sliders,
  Printer,
  Clock,
  History,
  FilePlus,
  UserPlus,
  CalendarDays,
  Coins,
  Building2,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { SearchableSelect } from '../common/SearchableSelect';

const MAIN_NAV_ITEMS = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/',
    exact: true,
    icon: LayoutDashboard,
    summary: 'Real-time overview of clinic operations, appointments, patients, and revenue.',
    subTabs: [
      { id: 'overview', name: 'Overview', path: '/', icon: LayoutDashboard },
    ],
    subItems: [
      { name: 'Overview', path: '/', icon: LayoutDashboard, description: 'Real-time clinic operations, queues, and financial summary' },
    ],
  },
  {
    id: 'patients',
    name: 'Patients',
    path: '/patients',
    icon: Users,
    subPaths: ['/patients'],
    summary: 'Patient directory, electronic medical charts, profiles, and visit histories.',
    subTabs: [
      { id: 'list', name: 'Patient List', path: '/patients', icon: Users },
    ],
    subItems: [
      { name: 'Patient List', path: '/patients', icon: Users, description: 'Browse, search, and manage all registered patients and records' },
    ],
  },
  {
    id: 'appointments',
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar,
    subPaths: ['/appointments'],
    summary: 'Patient appointments, calendar scheduling grid, and doctor rosters.',
    subTabs: [
      { id: 'list', name: 'Appointments List', path: '/appointments', icon: Calendar },
      { id: 'calendar', name: 'Appointment Calendar', path: '/appointments?view=calendar', icon: CalendarDays },
      { id: 'schedule', name: 'Doctor Schedule', path: '/doctors?from=appointments', icon: Stethoscope },
    ],
    subItems: [
      { name: 'Appointments List', path: '/appointments', icon: Calendar, description: 'Daily OPD queue, consultations, and patient bookings' },
      { name: 'Appointment Calendar', path: '/appointments?view=calendar', icon: CalendarDays, description: 'Visual monthly and weekly scheduling grid' },
      { name: 'Doctor Schedule', path: '/doctors?from=appointments', icon: Stethoscope, description: 'Attending doctors, duty schedules, and consulting hours' },
    ],
  },
  {
    id: 'prescriptions',
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: FileText,
    subPaths: ['/prescriptions'],
    summary: 'Clinical prescription records, digital Rx notes, and medication histories.',
    subTabs: [
      { id: 'list', name: 'Prescription List', path: '/prescriptions', icon: FileText },
    ],
    subItems: [
      { name: 'Prescription List', path: '/prescriptions', icon: FileText, description: 'Browse and filter digital prescriptions and clinical notes' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    path: '/bills',
    icon: Receipt,
    subPaths: ['/bills', '/payments', '/expenses'],
    summary: 'Patient billing, fee collections, operational expenses, and financial summaries.',
    subTabs: [
      { id: 'bills', name: 'Patient Bills', path: '/bills', icon: Receipt },
      { id: 'payments', name: 'Payment Collection', path: '/payments', icon: CreditCard },
      { id: 'expenses', name: 'Expenses', path: '/expenses', icon: TrendingDown },
      { id: 'summary', name: 'Income & Expense Summary', path: '/bills?tab=summary', icon: Coins },
    ],
    subItems: [
      { name: 'Patient Bills', path: '/bills', icon: Receipt, description: 'Itemized consultation charges, procedures, and dues' },
      { name: 'Payment Collection', path: '/payments', icon: CreditCard, description: 'Collect patient dues, receipts, and deposit history' },
      { name: 'Expenses', path: '/expenses', icon: TrendingDown, description: 'Disbursements, clinic operating costs, and vouchers' },
      { name: 'Income & Expense Summary', path: '/bills?tab=summary', icon: Coins, description: 'Financial income vs expense summary and P&L tracker' },
    ],
  },
  {
    id: 'accounts',
    name: 'Accounts',
    path: '/accounts',
    icon: Landmark,
    subPaths: ['/accounts', '/chart-of-accounts'],
    summary: 'Chart of accounts, cash drawers, bank accounts, and transaction ledgers.',
    subTabs: [
      { id: 'coa', name: 'Chart of Accounts', path: '/chart-of-accounts', icon: Layers },
      { id: 'cash', name: 'Cash Accounts', path: '/accounts?type=Cash', icon: Landmark },
      { id: 'bank', name: 'Bank Accounts', path: '/accounts?type=Bank', icon: CreditCard },
      { id: 'ledgers', name: 'Account Transactions & Ledgers', path: '/accounts?tab=ledgers', icon: FileText },
    ],
    subItems: [
      { name: 'Chart of Accounts', path: '/chart-of-accounts', icon: Layers, description: 'Financial income and expense classification' },
      { name: 'Cash Accounts', path: '/accounts?type=Cash', icon: Landmark, description: 'Physical cash counters and register balances' },
      { name: 'Bank Accounts', path: '/accounts?type=Bank', icon: CreditCard, description: 'Commercial clinic bank accounts and statements' },
      { name: 'Account Transactions & Ledgers', path: '/accounts?tab=ledgers', icon: FileText, description: 'Ledger journal entries and audit trails' },
    ],
  },
  {
    id: 'users',
    name: 'Users',
    path: '/users',
    icon: ShieldCheck,
    subPaths: ['/users', '/doctors'],
    summary: 'Doctor profiles, clinic staff accounts, and role-based permissions.',
    subTabs: [
      { id: 'doctors', name: 'Doctors', path: '/doctors', icon: Stethoscope },
      { id: 'staff', name: 'Staff & User Management', path: '/users', icon: Users },
      { id: 'roles', name: 'Roles & Permissions', path: '/settings?tab=roles', icon: ShieldCheck },
    ],
    subItems: [
      { name: 'Doctors', path: '/doctors', icon: Stethoscope, description: 'Doctor profiles, consultation fees, and schedules' },
      { name: 'Staff & User Management', path: '/users', icon: Users, description: 'Receptionists, accountants, and staff profiles' },
      { name: 'Roles & Permissions', path: '/settings?tab=roles', icon: ShieldCheck, description: 'Role privileges, module access, and credentials' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    subPaths: ['/settings'],
    summary: 'Clinic profile, permissions, printing layouts, and system configurations.',
    subTabs: [
      { id: 'clinic', name: 'Clinic Settings', path: '/settings?tab=clinic', icon: Building2 },
      { id: 'roles', name: 'Roles & Permissions', path: '/settings?tab=roles', icon: ShieldCheck },
      { id: 'printing', name: 'Printing Settings', path: '/settings?tab=printing', icon: Printer },
      { id: 'system', name: 'System Configurations', path: '/settings?tab=system', icon: Sliders },
    ],
    subItems: [
      { name: 'Clinic Settings', path: '/settings?tab=clinic', icon: Building2, description: 'Clinic legal name, address, phone, and OPD hours' },
      { name: 'Roles & Permissions', path: '/settings?tab=roles', icon: ShieldCheck, description: 'System role matrix and simulation controls' },
      { name: 'Printing Settings', path: '/settings?tab=printing', icon: Printer, description: 'A4, thermal formats, logo headers, and Rx footers' },
      { name: 'System Configurations', path: '/settings?tab=system', icon: Sliders, description: 'Date formats, timezones, and database backup/reset' },
    ],
  },
];

const getNotifIcon = (type) => {
  switch (type) {
    case 'patient': return Users;
    case 'appointment': return Calendar;
    case 'prescription': return FileText;
    case 'billing': return Receipt;
    case 'payment': return CreditCard;
    case 'expense': return TrendingDown;
    default: return Bell;
  }
};

const getNotifStyle = (type) => {
  switch (type) {
    case 'patient':
      return { bg: 'bg-blue-50', border: 'border-blue-200/80', text: 'text-blue-600' };
    case 'appointment':
      return { bg: 'bg-amber-50', border: 'border-amber-200/80', text: 'text-amber-600' };
    case 'prescription':
      return { bg: 'bg-indigo-50', border: 'border-indigo-200/80', text: 'text-indigo-600' };
    case 'billing':
      return { bg: 'bg-purple-50', border: 'border-purple-200/80', text: 'text-purple-600' };
    case 'payment':
      return { bg: 'bg-emerald-50', border: 'border-emerald-200/80', text: 'text-emerald-600' };
    case 'expense':
      return { bg: 'bg-rose-50', border: 'border-rose-200/80', text: 'text-rose-600' };
    default:
      return { bg: 'bg-slate-50', border: 'border-slate-200/80', text: 'text-slate-600' };
  }
};

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    switchRole,
    patients,
    doctors,
    bills,
    resetAllData,
    addToast,
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useClinic();

  // Mobile menu drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Dropdown states
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState({});
  const dropdownTimeoutRef = useRef(null);

  const handleNavMouseEnter = (id) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdownId(id);
  };

  const handleNavMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 180);
  };

  const toggleMobileSection = (id) => {
    setExpandedMobileSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isNavActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    if (location.pathname === item.path) return true;
    if (item.subPaths && item.subPaths.some((p) => location.pathname.startsWith(p))) return true;
    if (location.pathname.startsWith(item.path) && item.path !== '/') return true;
    return false;
  };

  const getActiveModule = () => {
    const p = location.pathname;
    const search = location.search;
    const params = new URLSearchParams(search);

    if (p === '/') return MAIN_NAV_ITEMS.find((m) => m.id === 'dashboard');
    if (p.startsWith('/patients')) return MAIN_NAV_ITEMS.find((m) => m.id === 'patients');
    if (p.startsWith('/appointments')) return MAIN_NAV_ITEMS.find((m) => m.id === 'appointments');
    if (p.startsWith('/prescriptions')) return MAIN_NAV_ITEMS.find((m) => m.id === 'prescriptions');
    if (p.startsWith('/bills') || p.startsWith('/payments') || p.startsWith('/expenses')) {
      return MAIN_NAV_ITEMS.find((m) => m.id === 'finance');
    }
    if (p.startsWith('/accounts') || p.startsWith('/chart-of-accounts')) {
      return MAIN_NAV_ITEMS.find((m) => m.id === 'accounts');
    }
    if (p.startsWith('/doctors')) {
      if (params.get('from') === 'appointments') {
        return MAIN_NAV_ITEMS.find((m) => m.id === 'appointments');
      }
      return MAIN_NAV_ITEMS.find((m) => m.id === 'users');
    }
    if (p.startsWith('/users')) return MAIN_NAV_ITEMS.find((m) => m.id === 'users');
    if (p.startsWith('/settings')) return MAIN_NAV_ITEMS.find((m) => m.id === 'settings');
    return MAIN_NAV_ITEMS[0];
  };

  const activeModule = getActiveModule();

  const checkIsSubTabActive = (modId, subTab) => {
    const currentPath = location.pathname;
    const search = location.search;
    const params = new URLSearchParams(search);

    if (modId === 'dashboard') {
      return subTab.id === 'overview';
    }

    if (modId === 'patients') {
      return subTab.id === 'list';
    }

    if (modId === 'appointments') {
      const view = params.get('view');
      if (currentPath.startsWith('/doctors') && subTab.id === 'schedule') return true;
      if (view === 'calendar' && subTab.id === 'calendar') return true;
      if ((!view || view === 'list') && !currentPath.startsWith('/doctors') && subTab.id === 'list') return true;
      return false;
    }

    if (modId === 'prescriptions') {
      return subTab.id === 'list';
    }

    if (modId === 'finance') {
      if (currentPath.startsWith('/bills')) {
        if (params.get('tab') === 'summary' && subTab.id === 'summary') return true;
        if (!params.get('tab') && subTab.id === 'bills') return true;
      }
      if (currentPath.startsWith('/payments') && subTab.id === 'payments') return true;
      if (currentPath.startsWith('/expenses') && subTab.id === 'expenses') return true;
      return false;
    }

    if (modId === 'accounts') {
      if (currentPath.startsWith('/chart-of-accounts') && subTab.id === 'coa') return true;
      if (currentPath.startsWith('/accounts')) {
        if (params.get('type') === 'Cash' && subTab.id === 'cash') return true;
        if (params.get('type') === 'Bank' && subTab.id === 'bank') return true;
        if (params.get('tab') === 'ledgers' && subTab.id === 'ledgers') return true;
        if (!params.get('type') && !params.get('tab') && subTab.id === 'cash') return true;
      }
      return false;
    }

    if (modId === 'users') {
      if (currentPath.startsWith('/doctors') && subTab.id === 'doctors') return true;
      if (currentPath.startsWith('/users') && subTab.id === 'staff') return true;
      if (currentPath.startsWith('/settings') && params.get('tab') === 'roles' && subTab.id === 'roles') return true;
      return false;
    }

    if (modId === 'settings') {
      const currentTab = params.get('tab') || 'clinic';
      return subTab.id === currentTab;
    }

    return false;
  };

  useEffect(() => {
    setActiveDropdownId(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Search Results filtering
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { patients: [], doctors: [], bills: [] };
    const q = searchQuery.toLowerCase().trim();

    const matchedPatients = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q)
    ).slice(0, 4);

    const matchedDoctors = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedBills = bills.filter(
      (b) =>
        b.billNumber.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      patients: matchedPatients,
      doctors: matchedDoctors,
      bills: matchedBills,
    };
  }, [searchQuery, patients, doctors, bills]);

  const hasResults =
    searchResults.patients.length > 0 ||
    searchResults.doctors.length > 0 ||
    searchResults.bills.length > 0;

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close all menus when route changes
  useEffect(() => {
    setShowRoleMenu(false);
    setShowNotifMenu(false);
    setShowQuickMenu(false);
    setShowProfileMenu(false);
    setIsSearchOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const roles = ['Admin', 'Doctor', 'Receptionist', 'Accountant'];

  const handleLogout = () => {
    addToast('info', 'Session Ended', 'Logged out of current clinic session (simulation).');
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default records?')) {
      resetAllData();
      addToast('success', 'Data Restored', 'Demo records have been restored to defaults.');
    }
  };

  return (
    <header className={`sticky top-0 ${mobileOpen ? 'z-[100]' : 'z-40'} w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm select-none no-print`}>
      {/* ================= PRIMARY TOPBAR ROW ================= */}
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 w-full">
        {/* Left: Brand Identity & Mobile Hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Open Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* MedPulse Brand Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            title="MedPulse Clinic ERP"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-glow transition-all flex-shrink-0">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                  MedPulse<span className="text-brand-600">.</span>ERP
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Clinic Management
              </span>
            </div>
          </NavLink>
        </div>

        {/* Center: Live Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div ref={searchRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search patients, doctors, invoices... (Ctrl+K)"
                className="w-full pl-9 pr-14 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-inner"
              />
              <div className="absolute right-2.5 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
                    Ctrl K
                  </kbd>
                )}
              </div>
            </div>

            {/* Quick Search Autocomplete Results Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-modal p-2 z-50 max-h-96 overflow-y-auto animate-in fade-in-50 zoom-in-95">
                {!hasResults ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching patients, doctors, or bills found for "{searchQuery}".
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.patients.length > 0 && (
                      <div>
                        <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Patients
                        </div>
                        {searchResults.patients.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigate('/patients');
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs transition-colors"
                          >
                            <div>
                              <span className="font-semibold text-slate-900">{p.name}</span>
                              <span className="ml-2 text-[11px] text-slate-400">{p.id}</span>
                              <p className="text-[11px] text-slate-500">{p.phone}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                              Patient
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.doctors.length > 0 && (
                      <div>
                        <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-2">
                          Doctors
                        </div>
                        {searchResults.doctors.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => {
                              navigate('/doctors');
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs transition-colors"
                          >
                            <div>
                              <span className="font-semibold text-slate-900">{d.name}</span>
                              <p className="text-[11px] text-slate-500">{d.specialization}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-medium">
                              Doctor
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.bills.length > 0 && (
                      <div>
                        <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-2">
                          Invoices
                        </div>
                        {searchResults.bills.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => {
                              navigate('/bills');
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs transition-colors"
                          >
                            <div>
                              <span className="font-semibold text-slate-900">{b.billNumber}</span>
                              <p className="text-[11px] text-slate-500">{b.patientName} — Rs. {b.totalAmount}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Controls: Quick Add, Role Switcher, Reset Demo, Alerts, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Mobile search toggle button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
            title="Search clinical records"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick "+ New Action" Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowQuickMenu(!showQuickMenu);
                setShowRoleMenu(false);
                setShowNotifMenu(false);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-brand-500/25 transition-all hover:shadow-glow active:scale-95"
              title="Quick Create Action"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-200" />
            </button>

            {showQuickMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-modal py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    navigate('/patients');
                    setShowQuickMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                >
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Register Patient</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/appointments');
                    setShowQuickMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/prescriptions');
                    setShowQuickMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Create Prescription</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/bills');
                    setShowQuickMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                >
                  <Receipt className="w-4 h-4 text-amber-600" />
                  <span>Generate Bill</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/payments');
                    setShowQuickMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                >
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>Collect Payment</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/expenses');
                    setShowQuickMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                >
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>Record Expense</span>
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
                setShowQuickMenu(false);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
              title="Clinic Alerts & Notifications"
              aria-label="Clinic Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs animate-in zoom-in-75">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-slate-300 rounded-full" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-[440px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 animate-in fade-in zoom-in-95 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Clinic Alerts</span>
                    {unreadNotifCount > 0 ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                        {unreadNotifCount} new
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-medium">
                        All read
                      </span>
                    )}
                  </div>

                  {unreadNotifCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[11px] text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1 hover:underline transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Fixed max-height list with vertical scrolling */}
                <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto divide-y divide-slate-100 p-1.5">
                  {notifications.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <Bell className="w-7 h-7 text-slate-300 mx-auto mb-1.5 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-700">No Alerts Pending</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">All activity logs will appear here in real time.</p>
                    </div>
                  ) : (
                    notifications.slice(0, 15).map((n) => {
                      const IconComp = getNotifIcon(n.type);
                      const style = getNotifStyle(n.type);
                      return (
                        <div
                          key={n.id}
                          className={`p-3 transition-colors rounded-xl flex items-start gap-3 hover:bg-slate-50/90 relative group ${
                            !n.read ? 'bg-brand-50/35' : 'bg-transparent'
                          }`}
                        >
                          {/* Type Icon Badge */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border shadow-2xs ${style.bg} ${style.border}`}
                          >
                            <IconComp className={`w-4 h-4 ${style.text}`} />
                          </div>

                          {/* Title & Message */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <p className={`text-xs font-bold leading-tight ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0 ml-1">
                                {n.timeAgo || n.timestamp}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-snug break-words">
                              {n.message}
                            </p>

                            {/* Action & Individual Mark as Read */}
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/70">
                              {n.link ? (
                                <button
                                  onClick={() => {
                                    if (!n.read) markNotificationAsRead(n.id);
                                    setShowNotifMenu(false);
                                    navigate(n.link);
                                  }}
                                  className="text-[11px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 hover:underline"
                                >
                                  <span>{n.actionText || 'Open'}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              ) : (
                                <span />
                              )}

                              {!n.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationAsRead(n.id);
                                  }}
                                  className="text-[10px] text-slate-500 hover:text-brand-700 font-bold px-2 py-0.5 rounded-md hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1 shadow-2xs"
                                  title="Mark this notification as read"
                                >
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  <span>Mark read</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Unread indicator dot */}
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-3 right-3 flex-shrink-0 ring-2 ring-white" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pinned Bottom Action: View All Notifications */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      navigate('/notifications');
                    }}
                    className="w-full py-2.5 px-3 bg-white hover:bg-brand-50/80 border border-slate-200/90 hover:border-brand-300 rounded-xl text-xs font-bold text-slate-800 hover:text-brand-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs group"
                  >
                    <span>View All Notifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowRoleMenu(false);
                setShowQuickMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-600 font-medium">{currentUser.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-modal py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-600 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded text-[10px] font-semibold border border-brand-100">
                    {currentUser.role} Account
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Clinic & System Settings</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings?tab=roles');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Roles & Permissions</span>
                </button>
                <button
                  onClick={() => {
                    handleResetData();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2 sm:hidden"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Reset Demo Records</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Simulate Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2.5 bg-slate-50/90 border-t border-b border-slate-200 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, doctors, bills..."
              className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Autocomplete items on mobile if search active */}
          {searchQuery.trim() && (
            <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-dropdown p-2 max-h-60 overflow-y-auto">
              {!hasResults ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No records match "{searchQuery}"
                </div>
              ) : (
                <>
                  {searchResults.patients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate('/patients');
                        setMobileSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg text-xs"
                    >
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      <span className="ml-2 text-[10px] text-slate-400 font-mono">{p.id}</span>
                      <p className="text-[11px] text-slate-500">{p.phone}</p>
                    </div>
                  ))}
                  {searchResults.doctors.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        navigate('/doctors');
                        setMobileSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg text-xs border-t border-slate-100"
                    >
                      <p className="font-semibold text-slate-900">{d.name}</p>
                      <p className="text-[11px] text-slate-500">{d.specialization}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= REVISED HORIZONTAL MAIN MENU (8 ITEMS) ================= */}
      {/* Horizontal Main Menu: Dashboard | Patients | Appointments | Prescriptions | Finance | Accounts | Users | Settings */}
      <nav className="hidden md:block border-t border-slate-200/90 bg-slate-50/90 backdrop-blur-xs shadow-2xs relative z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = isNavActive(item);
              const isDropdownOpen = activeDropdownId === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="relative flex items-center"
                  onMouseEnter={() => handleNavMouseEnter(item.id)}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <div
                    className={`flex items-center rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-brand-700 font-bold shadow-xs border border-brand-200/90 ring-1 ring-brand-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        setActiveDropdownId(null);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer select-none"
                    >
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                          isActive ? 'text-brand-600' : 'text-slate-500'
                        }`}
                      />
                      <span>{item.name}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                      }}
                      className={`pr-2 py-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer ${
                        isDropdownOpen ? 'rotate-180 text-brand-600' : ''
                      }`}
                      title={`View ${item.name} options`}
                    >
                      <ChevronDown className="w-3 h-3 transition-transform duration-150" />
                    </button>
                  </div>

                  {/* Dropdown Flyout Card */}
                  {isDropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                      onMouseEnter={() => handleNavMouseEnter(item.id)}
                      onMouseLeave={handleNavMouseLeave}
                    >
                      {/* Summary Banner */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/60">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      {/* Sub-items */}
                      <div className="space-y-1">
                        {item.subItems.map((sub, sIdx) => {
                          const SubIcon = sub.icon || Icon;
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                navigate(sub.path);
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/70 transition-all flex items-start gap-2.5 group cursor-pointer"
                            >
                              <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-700 text-slate-500 transition-colors mt-0.5 flex-shrink-0">
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold text-slate-800 group-hover:text-brand-700 transition-colors block text-xs">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                                  {sub.description}
                                </span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 transition-colors mt-1 flex-shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ================= TIER 2: PERSISTENT SUB-TAB BAR ================= */}
      {/* Dedicated visible Sub-Tabs Bar for active module */}
      {activeModule && activeModule.subTabs && (
        <div className="w-full bg-white border-t border-b border-slate-200/90 shadow-2xs z-30">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 py-1.5 overflow-x-auto no-scrollbar">
              {/* Left: Horizontal Sub-Tabs (No duplicate module name label) */}
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
                {activeModule.subTabs.map((subTab) => {
                  const isTabActive = checkIsSubTabActive(activeModule.id, subTab);
                  const SubIcon = subTab.icon;

                  return (
                    <button
                      key={subTab.id}
                      type="button"
                      onClick={() => navigate(subTab.path)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer select-none ${
                        isTabActive
                          ? 'bg-brand-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium border border-transparent'
                      }`}
                    >
                      {SubIcon && (
                        <SubIcon
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isTabActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                      )}
                      <span>{subTab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Module Description / Scope */}
              <div className="hidden lg:flex items-center text-[11px] text-slate-400 whitespace-nowrap pl-4 border-l border-slate-200">
                <span className="truncate max-w-sm">{activeModule.summary}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      {mobileOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] h-full bg-white z-[110] shadow-2xl flex flex-col md:hidden">
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight block leading-tight">
                    MedPulse<span className="text-brand-600">.</span>ERP
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Clinic Management
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Shortcuts in Drawer */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => { navigate('/patients'); setMobileOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-brand-300 text-[10px] font-semibold text-slate-700 shadow-2xs"
                >
                  <Users className="w-4 h-4 text-brand-600 mb-1" />
                  <span>Patient</span>
                </button>
                <button
                  onClick={() => { navigate('/appointments'); setMobileOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-[10px] font-semibold text-slate-700 shadow-2xs"
                >
                  <Calendar className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>Appoint.</span>
                </button>
                <button
                  onClick={() => { navigate('/prescriptions'); setMobileOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-[10px] font-semibold text-slate-700 shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-indigo-600 mb-1" />
                  <span>Rx</span>
                </button>
                <button
                  onClick={() => { navigate('/bills'); setMobileOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-300 text-[10px] font-semibold text-slate-700 shadow-2xs"
                >
                  <Receipt className="w-4 h-4 text-amber-600 mb-1" />
                  <span>Bill</span>
                </button>
                <button
                  onClick={() => { navigate('/payments'); setMobileOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-teal-300 text-[10px] font-semibold text-slate-700 shadow-2xs"
                >
                  <CreditCard className="w-4 h-4 text-teal-600 mb-1" />
                  <span>Payment</span>
                </button>
                <button
                  onClick={() => { navigate('/expenses'); setMobileOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-[10px] font-semibold text-slate-700 shadow-2xs"
                >
                  <TrendingDown className="w-4 h-4 text-rose-600 mb-1" />
                  <span>Expense</span>
                </button>
              </div>
            </div>

            {/* Revised 8-Section Navigation in Mobile Drawer */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Main Menu Modules
              </span>
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = isNavActive(item);
                const Icon = item.icon;
                const isExpanded = expandedMobileSections[item.id];

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all ${
                      isActive
                        ? 'bg-brand-50/50 border-brand-200'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between p-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(item.path);
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                      >
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className={`text-xs block leading-tight ${
                              isActive ? 'font-bold text-brand-900' : 'font-semibold text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {item.summary.split('.')[0]}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-150 ${
                            isExpanded ? 'rotate-180 text-brand-600' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sub-items accordion */}
                    {isExpanded && (
                      <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-slate-100 bg-slate-50/50">
                        {item.subItems.map((sub, sIdx) => {
                          const SubIcon = sub.icon || Icon;
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                navigate(sub.path);
                                setMobileOpen(false);
                              }}
                              className="w-full text-left p-1.5 rounded-lg hover:bg-white text-xs font-medium text-slate-700 flex items-center gap-2 transition-colors"
                            >
                              <SubIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer with Role Switcher & User Profile */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2.5 flex-shrink-0">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white border border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold text-brand-600 uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Role Switch Selector */}
              <div className="flex items-center justify-between px-1 gap-2">
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">Switch Role:</span>
                <div className="w-40">
                  <SearchableSelect
                    value={currentUser.role}
                    onChange={(e) => switchRole(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                    searchPlaceholder="Search role..."
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </SearchableSelect>
                </div>
              </div>

              <button
                onClick={() => {
                  handleResetData();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
};

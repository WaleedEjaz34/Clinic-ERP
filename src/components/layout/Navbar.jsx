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
  Bell,
  Check,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const NAV_GROUPS = [
  {
    title: 'Clinical Operations',
    shortTitle: 'Clinical',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Patients', path: '/patients', icon: Users },
      { name: 'Appointments', path: '/appointments', icon: Calendar },
      { name: 'Doctors', path: '/doctors', icon: Stethoscope },
      { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
    ],
  },
  {
    title: 'Financial & Billing',
    shortTitle: 'Financial',
    items: [
      { name: 'Patient Bills', path: '/bills', icon: Receipt },
      { name: 'Payments', path: '/payments', icon: CreditCard },
      { name: 'Expenses', path: '/expenses', icon: TrendingDown },
      { name: 'Cash & Bank', path: '/accounts', icon: Landmark },
      { name: 'Chart of Accounts', path: '/chart-of-accounts', icon: Layers },
    ],
  },
  {
    title: 'Administration',
    shortTitle: 'Admin',
    items: [
      { name: 'Users & Roles', path: '/users', icon: ShieldCheck },
    ],
  },
];

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
  } = useClinic();

  // Mobile menu drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Dropdown states
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

          {/* Role Switcher Pill (Interactive Simulator - hidden on mobile, available in drawer) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowQuickMenu(false);
                setShowNotifMenu(false);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
              title="Switch Simulated Role"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden lg:inline text-slate-500">Role:</span>
              <strong className="text-slate-900">{currentUser.role}</strong>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-200 shadow-modal py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Switch Active Role:
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <span className={currentUser.role === r ? 'font-bold text-brand-700' : ''}>
                      {r}
                    </span>
                    {currentUser.role === r && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Records Button */}
          <button
            onClick={handleResetData}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl text-xs font-medium transition-colors"
            title="Reset local changes and restore demo records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
                setShowQuickMenu(false);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-modal p-3 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Clinic Alerts</span>
                  <span
                    onClick={() => {
                      addToast('info', 'Alerts Cleared', 'All pending notifications marked as read.');
                      setShowNotifMenu(false);
                    }}
                    className="text-[10px] text-brand-600 font-semibold cursor-pointer hover:underline"
                  >
                    Mark all read
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                    <p className="font-semibold text-amber-900">Patient Waiting in OPD</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Fatima Zahra checked in for Dr. Ayesha Siddiqui.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                    <p className="font-semibold text-emerald-900">Payment Deposited</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Rs. 1,500 cash payment received from Muhammad Rizwan.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="font-semibold text-slate-800">Appointment Scheduled</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ahmed Hassan booked with Dr. Farhan Qureshi.
                    </p>
                  </div>
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
                    navigate('/users');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>User & Permission Settings</span>
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

      {/* ================= SECONDARY DESKTOP/TABLET NAVBAR (NAV TABS) ================= */}
      <nav className="hidden md:block border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
            {NAV_GROUPS.map((group, groupIdx) => (
              <React.Fragment key={group.title}>
                {groupIdx > 0 && (
                  <div className="h-5 w-px bg-slate-200 mx-2 flex-shrink-0" />
                )}

                <div className="flex items-center gap-1 flex-shrink-0">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                          isActive
                            ? 'bg-white text-brand-700 font-bold shadow-xs border border-brand-200/90 ring-1 ring-brand-500/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                              isActive ? 'text-brand-600' : 'text-slate-500'
                            }`}
                          />
                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

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

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              {NAV_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {group.title}
                  </h4>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 font-bold shadow-xs border border-brand-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
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
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-medium text-slate-500">Switch Role:</span>
                <select
                  value={currentUser.role}
                  onChange={(e) => switchRole(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
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

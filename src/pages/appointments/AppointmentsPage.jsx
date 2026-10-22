import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Clock,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  RotateCcw,
  CalendarCheck,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
} from 'date-fns';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatDate, formatTime } from '../../utils/date';

const VISIT_TYPES = ['New', 'Follow-up', 'Routine', 'Emergency'];
const STATUSES = ['Scheduled', 'Checked-In', 'Waiting', 'In Consultation', 'Completed', 'Cancelled', 'No Show'];

export const AppointmentsPage = () => {
  const navigate = useNavigate();
  const {
    appointments,
    doctors,
    patients,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    checkAppointmentConflict,
  } = useClinic();

  const [searchParams, setSearchParams] = useSearchParams();

  // Mode: 'list' | 'calendar'
  const [viewMode, setViewMode] = useState('list');
  // Calendar View sub-mode: 'month' | 'week' | 'day'
  const [calendarMode, setCalendarMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedVisitType, setSelectedVisitType] = useState('ALL');

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingApt, setViewingApt] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    visitType: 'New',
    reason: '',
    notes: '',
    status: 'Scheduled',
  });

  const [bookingConflictMsg, setBookingConflictMsg] = useState('');

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        apt.patientName.toLowerCase().includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q) ||
        apt.reason.toLowerCase().includes(q);

      const matchDoc = selectedDoctor === 'ALL' || apt.doctorId === selectedDoctor;
      const matchStatus = selectedStatus === 'ALL' || apt.status === selectedStatus;
      const matchType = selectedVisitType === 'ALL' || apt.visitType === selectedVisitType;

      return matchSearch && matchDoc && matchStatus && matchType;
    });
  }, [appointments, search, selectedDoctor, selectedStatus, selectedVisitType]);

  const hasActiveFilters =
    search !== '' || selectedDoctor !== 'ALL' || selectedStatus !== 'ALL' || selectedVisitType !== 'ALL';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDoctor('ALL');
    setSelectedStatus('ALL');
    setSelectedVisitType('ALL');
  };

  // Open booking modal
  const handleOpenBook = (defaultDate = null) => {
    setEditingApt(null);
    setBookingConflictMsg('');
    setFormData({
      patientId: patients[0]?.id || '',
      doctorId: doctors[0]?.id || '',
      date: defaultDate || new Date().toISOString().split('T')[0],
      time: '10:00',
      visitType: 'New',
      reason: '',
      notes: '',
      status: 'Scheduled',
    });
    setIsBookModalOpen(true);
  };

  // React to Sub-Tab navigation
  useEffect(() => {
    const view = searchParams.get('view');
    const action = searchParams.get('action');
    const filter = searchParams.get('filter');

    if (view === 'calendar') {
      setViewMode('calendar');
    } else if (view === 'list') {
      setViewMode('list');
    }

    if (action === 'new') {
      handleOpenBook();
    }

    if (filter === 'status') {
      setSelectedStatus('Waiting');
    }
  }, [searchParams]);

  const handleOpenEdit = (apt) => {
    setEditingApt(apt);
    setBookingConflictMsg('');
    setFormData({
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      date: apt.date,
      time: apt.time,
      visitType: apt.visitType,
      reason: apt.reason,
      notes: apt.notes || '',
      status: apt.status,
    });
    setIsBookModalOpen(true);
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    setBookingConflictMsg('');

    if (editingApt) {
      const res = updateAppointment(editingApt.id, formData);
      if (res.success) {
        setIsBookModalOpen(false);
      } else {
        setBookingConflictMsg(res.error || 'Conflict detected');
      }
    } else {
      const res = addAppointment(formData);
      if (res.success) {
        setIsBookModalOpen(false);
      } else {
        setBookingConflictMsg(res.error || 'Conflict detected');
      }
    }
  };

  // Start Consultation shortcut (navigates to prescriptions with prefilled params)
  const handleStartConsultation = (apt) => {
    updateAppointmentStatus(apt.id, 'In Consultation');
    navigate('/prescriptions', { state: { fromAppointment: apt } });
  };

  // Calendar Navigation
  const handlePrevDate = () => {
    if (calendarMode === 'month') setCurrentDate((d) => subMonths(d, 1));
    else if (calendarMode === 'week') setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subDays(d, 1));
  };

  const handleNextDate = () => {
    if (calendarMode === 'month') setCurrentDate((d) => addMonths(d, 1));
    else if (calendarMode === 'week') setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addDays(d, 1));
  };

  const handleTodayDate = () => {
    setCurrentDate(new Date());
  };

  // Days for month calendar
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Days for week calendar
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const columns = [
    {
      key: 'id',
      label: 'Appointment ID',
      width: '110px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-600">{val}</span>,
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 block">{formatDate(val)}</span>
          <span className="text-[11px] text-brand-600 font-semibold">{formatTime(row.time)}</span>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Patient',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600/15 via-brand-500/10 to-teal-500/20 text-brand-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 border border-brand-200/60 shadow-2xs">
            {val.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">{val}</span>
            <span className="text-[11px] text-slate-500 font-mono">{row.patientId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
          <Stethoscope className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'visitType',
      label: 'Visit Type',
      render: (val) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
          {val}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Chief Complaint',
      render: (val) => <span className="text-slate-600 max-w-xs truncate block text-xs">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Quick status cycle buttons */}
          {row.status === 'Scheduled' && (
            <button
              onClick={() => updateAppointmentStatus(row.id, 'Checked-In')}
              className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-lg transition-colors shadow-2xs"
              title="Check-In Patient"
            >
              Check-In
            </button>
          )}
          {row.status === 'Checked-In' && (
            <button
              onClick={() => updateAppointmentStatus(row.id, 'Waiting')}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg transition-colors shadow-2xs"
              title="Mark as Waiting"
            >
              Waiting
            </button>
          )}
          {(row.status === 'Waiting' || row.status === 'Checked-In') && (
            <button
              onClick={() => handleStartConsultation(row)}
              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              title="Start Consultation"
            >
              <Play className="w-3 h-3 fill-emerald-600" />
              <span>Consult</span>
            </button>
          )}

          <button
            onClick={() => {
              setViewingApt(row);
              setIsDetailModalOpen(true);
            }}
            className="p-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 rounded-lg transition-colors shadow-2xs"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Edit / Reschedule"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Appointments & Scheduling"
        subtitle="Manage daily OPD patient slots, waiting queues, and consultation calendars."
        breadcrumbs={[{ label: 'Appointments' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-brand-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-brand-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>
            </div>

            <button
              onClick={() => handleOpenBook()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 hover:shadow-glow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Book Appointment</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search appointment ID, patient, doctor, or complaint..."
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredAppointments.length}
      >
        <div className="min-w-[170px]">
          <SearchableSelect
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter by doctor..."
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </SearchableSelect>
        </div>

        <div className="min-w-[150px]">
          <SearchableSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter by status..."
          >
            <option value="ALL">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </SearchableSelect>
        </div>

        <div className="min-w-[150px]">
          <SearchableSelect
            value={selectedVisitType}
            onChange={(e) => setSelectedVisitType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter visit type..."
          >
            <option value="ALL">All Visit Types</option>
            {VISIT_TYPES.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </SearchableSelect>
        </div>
      </FilterBar>

      {/* View Switch: List View vs Calendar View */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          keyField="id"
          emptyMessage="No scheduled appointments found matching the current filters."
        />
      ) : (
        /* Calendar View (Section 8) */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          {/* Calendar Header with Sub-modes & Date Navigator */}
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevDate}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleTodayDate}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700"
              >
                Today
              </button>
              <button
                onClick={handleNextDate}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="ml-2 text-sm font-bold text-slate-900">
                {calendarMode === 'month'
                  ? format(currentDate, 'MMMM yyyy')
                  : calendarMode === 'week'
                  ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd MMM')} – ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'dd MMM yyyy')}`
                  : format(currentDate, 'EEEE, dd MMMM yyyy')}
              </span>
            </div>

            {/* Sub-modes Month / Week / Day */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCalendarMode('month')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  calendarMode === 'month' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarMode('week')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  calendarMode === 'week' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarMode('day')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  calendarMode === 'day' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Month Calendar Grid */}
          {calendarMode === 'month' && (
            <div className="overflow-x-auto">
              <div className="min-w-[640px] sm:min-w-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
                {calendarDays.map((day, idx) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const dayApts = appointments.filter((a) => a.date === dayStr);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={idx}
                      className={`min-h-[110px] p-1.5 flex flex-col justify-between transition-colors hover:bg-slate-50/80 cursor-pointer ${
                        !isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white text-slate-800'
                      }`}
                      onClick={() => handleOpenBook(dayStr)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isToday ? 'bg-brand-600 text-white' : ''
                          }`}
                        >
                          {format(day, 'd')}
                        </span>
                        {dayApts.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {dayApts.length} apts
                          </span>
                        )}
                      </div>

                      {/* Day appointment pills */}
                      <div className="space-y-1 flex-1 overflow-y-auto max-h-24">
                        {dayApts.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingApt(apt);
                              setIsDetailModalOpen(true);
                            }}
                            className={`p-1 rounded text-[10px] leading-tight truncate border font-medium ${
                              apt.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : apt.status === 'Waiting' || apt.status === 'Checked-In'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : apt.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                            title={`${apt.time} - ${apt.patientName} (${apt.doctorName})`}
                          >
                            <strong>{apt.time}</strong> {apt.patientName}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Week View */}
          {calendarMode === 'week' && (
            <div className="overflow-x-auto">
              <div className="min-w-[640px] sm:min-w-0 grid grid-cols-7 divide-x divide-slate-200">
              {weekDays.map((day, idx) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const dayApts = appointments.filter((a) => a.date === dayStr);
                const isToday = isSameDay(day, new Date());

                return (
                  <div key={idx} className="min-h-[350px] p-2 flex flex-col">
                    <div className="text-center pb-2 border-b border-slate-100 mb-2">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">
                        {format(day, 'EEE')}
                      </span>
                      <span
                        className={`text-sm font-bold inline-block px-2 py-0.5 rounded-full ${
                          isToday ? 'bg-brand-600 text-white' : 'text-slate-800'
                        }`}
                      >
                        {format(day, 'dd MMM')}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {dayApts.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => {
                            setViewingApt(apt);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-300 transition-colors cursor-pointer text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-brand-600">{apt.time}</span>
                            <StatusBadge status={apt.status} />
                          </div>
                          <p className="font-bold text-slate-900 truncate">{apt.patientName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{apt.doctorName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* Day View */}
          {calendarMode === 'day' && (
            <div className="p-6">
              <div className="max-w-xl mx-auto space-y-3">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Timeline for {format(currentDate, 'EEEE, dd MMMM yyyy')}
                </h4>
                {appointments.filter((a) => a.date === format(currentDate, 'yyyy-MM-dd')).length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-8 text-center">
                    No appointments scheduled for this day. Click 'Book Appointment' to schedule one.
                  </p>
                ) : (
                  appointments
                    .filter((a) => a.date === format(currentDate, 'yyyy-MM-dd'))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-base font-black text-brand-700">{apt.time}</span>
                          <h5 className="text-sm font-bold text-slate-900 mt-0.5">{apt.patientName}</h5>
                          <p className="text-slate-600">With {apt.doctorName} • Visit: {apt.visitType}</p>
                          <p className="text-slate-500 italic mt-0.5">{apt.reason}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={apt.status} />
                          <button
                            onClick={() => {
                              setViewingApt(apt);
                              setIsDetailModalOpen(true);
                            }}
                            className="text-xs font-semibold text-brand-600 hover:underline"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Book / Edit Appointment Modal (Section 8) */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          if (searchParams.get('action')) setSearchParams({});
        }}
        title={editingApt ? `Edit Appointment — ${editingApt.id}` : 'Book Patient Appointment'}
        subtitle="Schedule an OPD clinical visit with real-time doctor availability check."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4">
          {bookingConflictMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>
                <strong>Scheduling Conflict:</strong> {bookingConflictMsg}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <SearchableSelect
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              searchPlaceholder="Search patient name, ID, or phone..."
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) — {p.phone}
                </option>
              ))}
            </SearchableSelect>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Attending Doctor *
            </label>
            <SearchableSelect
              required
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              searchPlaceholder="Search doctor or specialization..."
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} (Rs. {d.consultationFee})
                </option>
              ))}
            </SearchableSelect>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Appointment Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visit Type
              </label>
              <SearchableSelect
                value={formData.visitType}
                onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search visit type..."
              >
                {VISIT_TYPES.map((vt) => (
                  <option key={vt} value={vt}>
                    {vt}
                  </option>
                ))}
              </SearchableSelect>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <SearchableSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search status..."
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </SearchableSelect>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chief Reason / Complaint *
            </label>
            <input
              type="text"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g. Persistent fever, rash, follow-up on lab results..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Reception Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Special instructions or vitals taken at desk..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all"
            >
              {editingApt ? 'Save Changes' : 'Confirm Slot Booking'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Appointment Detail Modal (Section 8) */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={viewingApt ? `Appointment Details — ${viewingApt.id}` : 'Appointment'}
        maxWidth="max-w-md"
      >
        {viewingApt && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {viewingApt.date} at {formatTime(viewingApt.time)}
                </span>
                <StatusBadge status={viewingApt.status} />
              </div>
              <p><strong>Patient:</strong> {viewingApt.patientName} ({viewingApt.patientId})</p>
              <p><strong>Doctor:</strong> {viewingApt.doctorName}</p>
              <p><strong>Visit Type:</strong> {viewingApt.visitType}</p>
              <p><strong>Reason:</strong> {viewingApt.reason}</p>
              {viewingApt.notes && <p><strong>Notes:</strong> {viewingApt.notes}</p>}
            </div>

            {/* Quick Status Modifiers */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Update Appointment Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateAppointmentStatus(viewingApt.id, st);
                      setViewingApt((prev) => ({ ...prev, status: st }));
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      viewingApt.status === st
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => handleStartConsultation(viewingApt)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Clinical Consultation</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

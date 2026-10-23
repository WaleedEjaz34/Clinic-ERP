import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  Lock,
  Mail,
  Phone,
  Check,
  Sliders,
  Shield,
  Key,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { defaultRolePermissions } from '../../data/mockUsers';

const ROLES = ['Admin', 'Doctor', 'Receptionist', 'Accountant'];

const MODULES = [
  { key: 'dashboard', label: 'Dashboard Overview' },
  { key: 'patients', label: 'Patients Management' },
  { key: 'doctors', label: 'Doctors Management' },
  { key: 'appointments', label: 'Appointments & Scheduling' },
  { key: 'prescriptions', label: 'Prescriptions & Consultations' },
  { key: 'bills', label: 'Patient Bills & Invoicing' },
  { key: 'payments', label: 'Payment Collection' },
  { key: 'expenses', label: 'Expense Management' },
  { key: 'accounts', label: 'Cash & Bank Accounts' },
  { key: 'coa', label: 'Chart of Accounts' },
  { key: 'users', label: 'User Management & Roles' },
];

const PERMISSIONS = ['view', 'create', 'edit', 'delete', 'print'];

export const UsersPage = () => {
  const {
    users,
    doctors,
    addUser,
    updateUser,
    deleteUser,
    updateUserPermissions,
    currentUser,
  } = useClinic();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('view');
  const roleParam = searchParams.get('role');

  // Active view: 'users' listing vs 'matrix' permission matrix
  const isMatrixView = tabParam === 'permissions' || tabParam === 'matrix' || tabParam === 'roles';
  const activeView = isMatrixView ? 'matrix' : 'users';

  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState(() => {
    return roleParam && ROLES.includes(roleParam) ? roleParam : 'Doctor';
  });

  useEffect(() => {
    if (roleParam && ROLES.includes(roleParam)) {
      setSelectedRoleForMatrix(roleParam);
    }
  }, [roleParam]);

  const handleViewChange = (view) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (view === 'matrix') {
        next.set('tab', 'permissions');
      } else {
        next.delete('tab');
        next.delete('view');
        next.delete('role');
      }
      return next;
    });
  };

  const handleSelectRoleForMatrix = (role) => {
    setSelectedRoleForMatrix(role);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'permissions');
      next.set('role', role);
      return next;
    });
  };

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Receptionist',
    password: '',
    confirmPassword: '',
    assignedDoctorId: '',
    status: 'Active',
  });

  const [formError, setFormError] = useState('');

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchRole = selectedRole === 'ALL' || u.role === selectedRole;
      return matchSearch && matchRole;
    });
  }, [users, search, selectedRole]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Receptionist',
      password: '',
      confirmPassword: '',
      assignedDoctorId: '',
      status: 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormError('');
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      password: '••••••••',
      confirmPassword: '••••••••',
      assignedDoctorId: u.assignedDoctorId || '',
      status: u.status,
    });
    setIsAddEditOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsAddEditOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteUser(deletingId);
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'User ID',
      width: '100px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-700">{val}</span>,
    },
    {
      key: 'name',
      label: 'Staff Member',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={val}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs"
          />
          <div>
            <span className="font-bold text-slate-900 block leading-tight">{val}</span>
            <span className="text-[11px] text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Assigned Role',
      render: (val) => {
        const isAdmin = val === 'Admin';
        const isDoctor = val === 'Doctor';
        const isAccountant = val === 'Accountant';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
              isAdmin
                ? 'bg-purple-50 text-purple-700 border-purple-200/60'
                : isDoctor
                ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                : isAccountant
                ? 'bg-teal-50 text-teal-700 border-teal-200/60'
                : 'bg-amber-50 text-amber-700 border-amber-200/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAdmin
                  ? 'bg-purple-500'
                  : isDoctor
                  ? 'bg-blue-500'
                  : isAccountant
                  ? 'bg-teal-500'
                  : 'bg-amber-500'
              }`}
            />
            {val}
          </span>
        );
      },
    },
    {
      key: 'phone',
      label: 'Phone Number',
      render: (val) => <span className="text-slate-600 font-mono text-xs">{val}</span>,
    },
    {
      key: 'assignedDoctorId',
      label: 'Linked Clinician',
      render: (val) => {
        if (!val) return <span className="text-slate-400 italic text-xs">None</span>;
        const doc = doctors.find((d) => d.id === val);
        return <span className="font-semibold text-brand-700 text-xs">{doc ? doc.name : val}</span>;
      },
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
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row.id);
              setIsDeleteOpen(true);
            }}
            disabled={currentUser.id === row.id}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={currentUser.id === row.id ? 'Cannot delete current logged user' : 'Delete User'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Management & Role Permissions"
        subtitle="Manage clinic staff login accounts, security credentials, and granular module access control matrices."
        breadcrumbs={[{ label: 'Users' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => handleViewChange('users')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Staff Accounts</span>
              </button>
              <button
                onClick={() => handleViewChange('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'matrix' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Permissions Matrix</span>
              </button>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-clinical-navy hover:shadow-glow transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create User</span>
            </button>
          </div>
        }
      />

      {activeView === 'users' ? (
        <>
          {/* Filter Bar */}
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search staff name, email, phone, or ID..."
            hasActiveFilters={search !== '' || selectedRole !== 'ALL'}
            onResetFilters={() => {
              setSearch('');
              setSelectedRole('ALL');
            }}
            totalResults={filteredUsers.length}
          >
            <div className="min-w-[150px]">
              <SearchableSelect
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
                searchPlaceholder="Filter role..."
              >
                <option value="ALL">All Roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SearchableSelect>
            </div>
          </FilterBar>

          {/* Users Table */}
          <DataTable
            columns={columns}
            data={filteredUsers}
            keyField="id"
            emptyMessage="No staff users found matching criteria."
          />
        </>
      ) : (
        /* Granular Role & Permissions Matrix View (Section 15) */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated permission presets and interactive toggles for View, Create, Edit, Delete, and Print actions.
              </p>
            </div>

            {/* Role Selector Tabs (Mobile Scrollable) */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => handleSelectRoleForMatrix(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedRoleForMatrix === role
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* ================= MOBILE RBAC PERMISSION CARDS (md:hidden) ================= */}
          <div className="md:hidden space-y-3">
            {MODULES.map((mod) => {
              const representativeUser = users.find((u) => u.role === selectedRoleForMatrix);
              const currentPerms = representativeUser?.permissions?.[mod.key] || [];

              return (
                <div
                  key={mod.key}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{mod.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {currentPerms.length} granted
                    </span>
                  </div>

                  {/* Toggleable Permission Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSIONS.map((perm) => {
                      const isGranted = currentPerms.includes(perm);
                      return (
                        <button
                          key={perm}
                          type="button"
                          onClick={() =>
                            updateUserPermissions(
                              selectedRoleForMatrix,
                              mod.key,
                              perm,
                              !isGranted
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                            isGranted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-bold'
                              : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Check className={`w-3 h-3 ${isGranted ? 'text-emerald-600 stroke-[3]' : 'opacity-0'}`} />
                          <span className="capitalize">{perm === 'print' ? 'Print' : perm}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= DESKTOP MATRIX TABLE (hidden md:block) ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-64">System Module</th>
                  {PERMISSIONS.map((p) => (
                    <th key={p} className="py-3 px-4 text-center capitalize w-28">
                      {p === 'print' ? 'Print / Export' : p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MODULES.map((mod) => {
                  const representativeUser = users.find((u) => u.role === selectedRoleForMatrix);
                  const currentPerms = representativeUser?.permissions?.[mod.key] || [];

                  return (
                    <tr key={mod.key} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{mod.label}</td>
                      {PERMISSIONS.map((perm) => {
                        const isGranted = currentPerms.includes(perm);
                        return (
                          <td key={perm} className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                updateUserPermissions(
                                  selectedRoleForMatrix,
                                  mod.key,
                                  perm,
                                  !isGranted
                                )
                              }
                              className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors border ${
                                isGranted
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-slate-100 text-slate-300 border-slate-200 hover:border-slate-300'
                              }`}
                              title={`${isGranted ? 'Revoke' : 'Grant'} ${perm} on ${mod.label}`}
                            >
                              <Check className={`w-3.5 h-3.5 ${isGranted ? 'stroke-[3]' : 'opacity-0'}`} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              Changes made to the matrix immediately apply to all users assigned to the <strong>{selectedRoleForMatrix}</strong> role.
            </span>
            <span className="font-semibold text-brand-600 text-[11px]">Frontend Simulation</span>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal (Section 15) */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingUser ? `Edit User — ${editingUser.name}` : 'Create Staff User Account'}
        subtitle="Configure role, authentication credentials, and clinical doctor associations."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Asma Khan"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@medpulse.pk"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role *
              </label>
              <SearchableSelect
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                searchPlaceholder="Search role..."
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </SearchableSelect>
            </div>
          </div>

          {/* Linked Doctor if Doctor role */}
          {formData.role === 'Doctor' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link to Attending Doctor Profile
              </label>
              <SearchableSelect
                value={formData.assignedDoctorId}
                onChange={(e) => setFormData({ ...formData, assignedDoctorId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                placeholder="Select Doctor Profile"
                searchPlaceholder="Search doctor or specialty..."
              >
                <option value="">Select Doctor Profile</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </SearchableSelect>
            </div>
          )}

          {/* Password fields */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/20 transition-all min-h-[44px]"
            >
              {editingUser ? 'Update Staff User' : 'Save Staff User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Revoke Staff Account"
        message="Are you sure you want to remove this staff user from the clinic management system? They will immediately lose access to clinic modules."
        confirmText="Revoke User"
        type="danger"
      />
    </div>
  );
};

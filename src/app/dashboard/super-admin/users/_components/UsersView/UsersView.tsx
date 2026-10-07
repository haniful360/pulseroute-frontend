'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  Plus,
  Search,
  ChevronRight,
  ShieldAlert,
  X,
  Loader2,
  Trash2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import { TColumn } from '@/types/custom-table.types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  getAllUsersAction, 
  updateUserStatusAction, 
  deleteUserAction, 
  createUserAction 
} from '@/services/user/user.service';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  rawRole: string;
  region: string;
  contactNumber: string;
  status: 'Active' | 'Suspended' | 'Pending';
  rawStatus: string;
  joined: string;
}

export default function UsersView() {
  const [usersList, setUsersList] = useState<UserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // Invite / Create User Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'USER' | 'DRIVER' | 'SUPER_ADMIN'>('DRIVER');
  const [newContact, setNewContact] = useState('');
  const [newPassword, setNewPassword] = useState('Pulse@2025');

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAction({ limit: 100 });
      if (res.success && res.data) {
        const list = Array.isArray((res.data as any).data) ? (res.data as any).data : res.data;
        if (Array.isArray(list)) {
          const mapped: UserRow[] = list.map((u: any) => ({
            id: u.id,
            name: u.name || 'PulseRoute User',
            email: u.email || 'N/A',
            role: u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'DRIVER' ? 'Paramedic Driver' : 'Patient',
            rawRole: u.role,
            region: u.patient?.address || u.contactNumber || 'Dhaka Metro',
            contactNumber: u.contactNumber || u.patient?.emergencyContactNumber || '+8801700000000',
            status: u.status === 'ACTIVE' ? 'Active' : u.status === 'BLOCKED' || u.status === 'SUSPENDED' ? 'Suspended' : 'Pending',
            rawStatus: u.status,
            joined: new Date(u.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }));
          setUsersList(mapped);
        }
      } else if (!res.success) {
        toast.error(res.message || 'Failed to load user accounts');
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Network error: Unable to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: UserRow) => {
    const nextStatus = user.status === 'Active' ? 'BLOCKED' : 'ACTIVE';
    try {
      const res = await updateUserStatusAction(user.id, { status: nextStatus as any });
      if (res.success) {
        toast.success(`User ${user.name} status updated to ${nextStatus === 'ACTIVE' ? 'Active' : 'Suspended'}`);
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  status: nextStatus === 'ACTIVE' ? 'Active' : 'Suspended',
                  rawStatus: nextStatus,
                }
              : u
          )
        );
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => prev ? {
            ...prev,
            status: nextStatus === 'ACTIVE' ? 'Active' : 'Suspended',
            rawStatus: nextStatus,
          } : null);
        }
      } else {
        toast.error(res.message || 'Failed to update user status');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action soft-deletes their account.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteUserAction(id);
      if (res.success) {
        toast.success('User deleted successfully.');
        setSelectedUser(null);
        await fetchUsers();
      } else {
        toast.error(res.message || 'Failed to delete user');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Name and Email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createUserAction({
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        password: newPassword.trim() || 'Pulse@2025',
        role: newRole,
        contactNumber: newContact.trim() || undefined,
        status: 'ACTIVE',
      });

      if (res.success) {
        toast.success(`User ${newName} invited successfully.`);
        setIsInviteOpen(false);
        setNewName('');
        setNewEmail('');
        setNewContact('');
        await fetchUsers();
      } else {
        toast.error(res.message || 'Failed to create user.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = ['All', 'Active', 'Suspended', 'Pending'];

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.region.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'All' || user.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, usersList]);

  // Dynamic Metrics
  const totalUsers = usersList.length;
  const totalParamedics = usersList.filter((u) => u.rawRole === 'DRIVER').length;
  const totalPatients = usersList.filter((u) => u.rawRole === 'USER').length;
  const totalSuspended = usersList.filter((u) => u.status === 'Suspended' || u.status === 'Pending').length;

  const columns: TColumn<UserRow>[] = [
    {
      header: 'Name & Email',
      cell: (user: UserRow) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#E63946]">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{user.name}</div>
            <div className="text-[10px] text-slate-500">
              {user.email} • Joined {user.joined}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (user: UserRow) => (
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
            user.rawRole === 'SUPER_ADMIN'
              ? 'border border-purple-200 bg-purple-50 text-purple-700'
              : user.rawRole === 'DRIVER'
              ? 'border border-red-200 bg-red-50 text-[#E63946]'
              : 'border border-slate-200 bg-slate-100 text-slate-700',
          )}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: 'Region / Contact',
      cell: (user: UserRow) => (
        <div className="text-xs font-medium text-[#334155]">
          <div>{user.region}</div>
          <div className="text-[10px] text-slate-400">{user.contactNumber}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (user: UserRow) => (
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
            user.status === 'Active'
              ? 'bg-emerald-50 text-emerald-600'
              : user.status === 'Suspended'
              ? 'bg-red-50 text-[#E63946]'
              : 'bg-amber-50 text-amber-600',
          )}
        >
          {user.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (user: UserRow) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(user)}
            className={cn(
              'h-7 cursor-pointer rounded-lg px-2 text-[10px] font-bold',
              user.status === 'Active'
                ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700',
            )}
          >
            {user.status === 'Active' ? 'Suspend' : 'Activate'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUser(user)}
            className="h-8 cursor-pointer rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            View
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold tracking-wider text-[#E63946] uppercase">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            User & Paramedic Management
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage roles, view account statuses, and register personnel across emergency regions.
          </p>
        </div>
        <Button 
          variant="danger" 
          className="rounded-2xl px-5 py-3 text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 w-fit cursor-pointer"
          onClick={() => setIsInviteOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Total Users</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{totalUsers}</div>
            )}
            <div className="text-xs font-bold text-emerald-600">
              Active platform accounts
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Paramedic Drivers</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{totalParamedics}</div>
            )}
            <div className="text-xs font-medium text-slate-500">
              Licensed emergency crew
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Patients & Desks</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{totalPatients}</div>
            )}
            <div className="text-xs font-medium text-slate-500">
              Registered booking accounts
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Flagged / Suspended</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{totalSuspended}</div>
            )}
            <div className="text-xs font-medium text-[#E63946]">
              Audit or restricted
            </div>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Header Area */}
        <div className="border-b border-slate-100 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">User Directory</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {loading ? 'Fetching active accounts...' : `Showing ${filteredUsers.length} of ${usersList.length} registered accounts`}
              </p>
            </div>
            
            {/* Tab Filter */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer",
                    activeTab === tab 
                      ? "bg-white text-slate-900 shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab === 'All' ? `All (${usersList.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full max-w-md">
            <InputField 
              placeholder="Search by name, email, role, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* CustomTable */}
        {loading ? (
          <div className="custom-scrollbar overflow-x-auto border-t border-slate-100">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="border-b border-slate-200 bg-slate-50/90">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-nowrap text-slate-600"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32 bg-slate-200" />
                          <Skeleton className="h-3 w-44 bg-slate-200" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-24 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-y-1">
                      <Skeleton className="h-4 w-28 bg-slate-200" />
                      <Skeleton className="h-3 w-20 bg-slate-200" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-7 w-16 rounded-lg bg-slate-200" />
                        <Skeleton className="h-7 w-12 rounded-lg bg-slate-200" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={filteredUsers}
            emptyTitle="No Users Found"
            emptyDescription="No platform accounts matched your filter or search query."
            emptyIcon={Users}
          />
        )}
      </div>

      {/* Invite User Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Invite & Create User</h3>
                <p className="text-xs text-slate-500">Provision an active account in PulseRoute network</p>
              </div>
              <button 
                onClick={() => setIsInviteOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <InputField
                  label="Full Name *"
                  placeholder="e.g. Dr. Nazmul Huda"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div>
                <InputField
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. nazmul@hospital.org"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">User Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E63946]/20"
                  >
                    <option value="DRIVER">Paramedic Driver</option>
                    <option value="USER">Patient / Caller</option>
                    <option value="SUPER_ADMIN">System Admin</option>
                  </select>
                </div>

                <div>
                  <InputField
                    label="Contact Number"
                    placeholder="+880 1712..."
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <InputField
                  label="Initial Password"
                  type="password"
                  placeholder="Pulse@2025"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default initial password can be changed by user upon first login.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-xl px-4 text-xs font-bold cursor-pointer"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="danger" 
                  disabled={isSubmitting}
                  className="rounded-xl px-5 text-xs font-bold bg-[#E63946] text-white cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    'Provision User'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {selectedUser.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">System Role:</span>
                <span className="font-bold text-slate-900">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Account Status:</span>
                <span className={cn(
                  "font-bold",
                  selectedUser.status === 'Active' ? "text-emerald-600" : "text-[#E63946]"
                )}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Contact Phone:</span>
                <span className="font-bold text-slate-900">{selectedUser.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Region:</span>
                <span className="font-bold text-slate-900">{selectedUser.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Account Created:</span>
                <span className="font-bold text-slate-900">{selectedUser.joined}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                className="rounded-xl px-4 text-xs font-bold cursor-pointer"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className={cn(
                    "rounded-xl px-3 text-xs font-bold cursor-pointer",
                    selectedUser.status === 'Active' ? "text-amber-600 border-amber-200 hover:bg-amber-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  )}
                  onClick={() => handleToggleStatus(selectedUser)}
                >
                  {selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                </Button>
                <Button 
                  variant="danger"
                  disabled={isDeleting}
                  className="rounded-xl px-3 text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

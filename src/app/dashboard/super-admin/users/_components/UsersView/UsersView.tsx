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
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAllUsersAction, updateUserStatusAction } from '@/services/user.service';

interface UserRow {
  id: string;
  name: string;
  role: string;
  region: string;
  status: 'Active' | 'Suspended' | 'Pending';
  rawStatus: string;
  joined: string;
}

const fallbackUsers: UserRow[] = [
  { id: 'USR-201', name: 'Rahim Uddin', role: 'Paramedic', region: 'Dhanmondi', status: 'Active', rawStatus: 'ACTIVE', joined: 'Sep 12, 2026' },
  { id: 'USR-188', name: 'Kamal Hossain', role: 'Driver', region: 'Gulshan', status: 'Active', rawStatus: 'ACTIVE', joined: 'Aug 28, 2026' },
  { id: 'USR-164', name: 'Square Hospital Desk', role: 'Triage Officer', region: 'Panthapath', status: 'Active', rawStatus: 'ACTIVE', joined: 'Jul 15, 2026' },
  { id: 'USR-142', name: 'Arif Hasan', role: 'Driver', region: 'Mirpur', status: 'Suspended', rawStatus: 'SUSPENDED', joined: 'Jun 02, 2026' },
  { id: 'USR-138', name: 'Nusrat Jahan', role: 'Paramedic', region: 'Uttara', status: 'Active', rawStatus: 'ACTIVE', joined: 'May 18, 2026' },
];

export default function UsersView() {
  const [usersList, setUsersList] = useState<UserRow[]>(fallbackUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await getAllUsersAction();
        if (res.success && res.data) {
          const list = Array.isArray((res.data as any).data) ? (res.data as any).data : res.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: UserRow[] = list.map((u: any) => ({
              id: u.id,
              name: u.name || 'PulseRoute User',
              role: u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'DRIVER' ? 'Paramedic Driver' : 'Patient',
              region: u.patient?.address || u.phone || 'Dhaka',
              status: u.status === 'ACTIVE' ? 'Active' : u.status === 'SUSPENDED' ? 'Suspended' : 'Pending',
              rawStatus: u.status,
              joined: new Date(u.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            }));
            setUsersList(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: UserRow) => {
    const nextStatus = user.rawStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await updateUserStatusAction(user.id, { status: nextStatus as any });
      if (res.success) {
        toast.success(`User ${user.name} status updated to ${nextStatus}`);
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
      } else {
        toast.error(res.message || 'Failed to update user status');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating status');
    }
  };

  const tabs = ['All', 'Active', 'Suspended', 'Pending'];

  const filteredUsers = useMemo(() => {
    return usersList.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.region.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'All' || user.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, usersList]);

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
            Manage roles, view statuses, and track personnel across regions.
          </p>
        </div>
        <Button variant="danger" className="rounded-2xl px-5 py-3 text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Stat Cards */}
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
            <div className="text-2xl font-black text-[#0b132b]">2,486</div>
            <div className="text-xs font-bold text-emerald-600">
              +124 this month
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Paramedics</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-[#0b132b]">318</div>
            <div className="text-xs font-medium text-slate-500">
              284 active
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Triage Desks</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-[#0b132b]">42</div>
            <div className="text-xs font-medium text-slate-500">
              Across 18 hospitals
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Pending KYC</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black text-[#0b132b]">42</div>
            <div className="text-xs font-medium text-[#E63946]">
              Needs review
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
              <p className="text-xs font-medium text-slate-500 mt-1">Showing {filteredUsers.length} of {usersList.length} users</p>
            </div>
            
            {/* Tab Filter */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-white text-slate-900 shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab === 'All' ? 'All (2,486)' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full max-w-md">
            <InputField 
              placeholder="Search by name, role, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-[10px] tracking-wider text-[#64748b] uppercase border-b border-slate-100">
              <tr>
                <th className="px-5 py-4 font-bold">Name</th>
                <th className="px-5 py-4 font-bold">Role</th>
                <th className="px-5 py-4 font-bold">Region</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-50 text-[#E63946] flex items-center justify-center text-xs font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.id} • Joined {user.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium">
                      {user.region}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                        user.status === 'Active' ? "bg-emerald-50 text-emerald-600" :
                        user.status === 'Suspended' ? "bg-red-50 text-[#E63946]" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          className={cn(
                            "h-7 text-[10px] font-bold rounded-lg px-2",
                            user.status === 'Active'
                              ? "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                              : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          )}
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs">
                          View
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500 text-sm">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

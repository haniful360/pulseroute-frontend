'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  Plus,
  Search,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const mockUsers = [
  { id: 'USR-201', name: 'Rahim Uddin', role: 'Paramedic', region: 'Dhanmondi', status: 'Active', joined: 'Sep 12, 2026' },
  { id: 'USR-188', name: 'Kamal Hossain', role: 'Driver', region: 'Gulshan', status: 'Active', joined: 'Aug 28, 2026' },
  { id: 'USR-164', name: 'Square Hospital Desk', role: 'Triage Officer', region: 'Panthapath', status: 'Active', joined: 'Jul 15, 2026' },
  { id: 'USR-142', name: 'Arif Hasan', role: 'Driver', region: 'Mirpur', status: 'Suspended', joined: 'Jun 02, 2026' },
  { id: 'USR-138', name: 'Nusrat Jahan', role: 'Paramedic', region: 'Uttara', status: 'Active', joined: 'May 18, 2026' },
  { id: 'USR-125', name: 'Fahim Rahman', role: 'Dispatch Coordinator', region: 'Banani', status: 'Active', joined: 'Apr 22, 2026' },
  { id: 'USR-112', name: 'Evercare Dispatch', role: 'Triage Officer', region: 'Bashundhara', status: 'Pending', joined: 'Sep 20, 2026' },
  { id: 'USR-098', name: 'Shakib Al Hasan', role: 'Driver', region: 'Mohammadpur', status: 'Active', joined: 'Mar 08, 2026' },
];

export default function UsersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Active', 'Suspended', 'Pending'];

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.region.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'All' || user.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

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
              <p className="text-xs font-medium text-slate-500 mt-1">Showing {filteredUsers.length} of {mockUsers.length} users</p>
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search by name, role, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-[#E63946]"
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
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs">
                        View
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
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

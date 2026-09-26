'use client';

import { useState } from 'react';
import { Megaphone, Radio, Send, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const pastBroadcasts = [
  { id: 1, title: 'Dhaka flood route advisory', message: 'Avoid Mirpur-10 to Farmgate corridor due to waterlogging. Use alternate routes via Mohakhali flyover.', time: '2 hrs ago', readRate: '96%', priority: 'Urgent', recipients: 58 },
  { id: 2, title: 'Eid ul-Adha surge protocol', message: 'All available ICU and AC units report for extended shift coverage from Sep 25-28.', time: 'Yesterday', readRate: '92%', priority: 'Normal', recipients: 62 },
  { id: 3, title: 'New hospital partner — Evercare', message: 'Evercare Hospital (Bashundhara) is now live on the dispatch network. Updated pickup zones deployed.', time: '3 days ago', readRate: '89%', priority: 'Normal', recipients: 55 },
  { id: 4, title: 'Vehicle inspection deadline', message: 'All fleet operators must complete Q3 vehicle safety inspection by September 30th.', time: '5 days ago', readRate: '94%', priority: 'Normal', recipients: 60 },
  { id: 5, title: 'Critical: Oxygen supply shortage', message: 'Temporary oxygen cylinder shortage at DMCH. Reroute critical patients to Square Hospital or United.', time: '1 week ago', readRate: '98%', priority: 'Urgent', recipients: 62 },
];

export default function AnnouncementsView() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('All Online Drivers');
  const [priority, setPriority] = useState('Normal');
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    if (!title || !message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setTitle('');
      setMessage('');
    }, 3000);
  };

  const audienceOptions = ['All Online Drivers', 'ICU Fleet Only', 'Dhaka Metro Zone'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Fleet Announcements & Emergency Broadcasts
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Dispatch fleet-wide notifications and emergency advisories.
          </p>
        </div>
        <Button variant="danger" className="shrink-0 gap-2 rounded-2xl bg-[#E63946] px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95">
          <Megaphone className="h-4 w-4" />
          New Broadcast
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Online recipients</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">62</div>
                <div className="text-xs font-medium text-slate-500 mb-1">Drivers currently online</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Sent this month</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">28</div>
                <div className="text-xs font-medium text-emerald-600 mb-1">+6 vs August</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Read rate</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-[#0b132b]">94%</div>
                <div className="text-xs font-medium text-slate-500 mb-1">Across fleet</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Compose Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900">Compose Broadcast</h2>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Draft saved
            </span>
          </div>

          {isSent ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-emerald-50 border border-emerald-100 h-[400px]">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Broadcast Sent!</h3>
              <p className="text-sm text-slate-600">Your message has been delivered to {audience}.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Broadcast Title</label>
                <Input 
                  placeholder="e.g., Emergency route advisory..." 
                  className="rounded-xl border-slate-200 h-11"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Target Audience</label>
                <div className="flex flex-wrap gap-2">
                  {audienceOptions.map(opt => (
                    <div 
                      key={opt}
                      onClick={() => setAudience(opt)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-bold cursor-pointer transition-all",
                        audience === opt 
                          ? "border-[#E63946] bg-red-50 text-[#E63946]" 
                          : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                      )}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Message Body</label>
                <textarea 
                  placeholder="Type your broadcast message here..."
                  className="w-full min-h-32 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E63946]/20 focus:border-[#E63946] transition-all resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Priority Level</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setPriority('Normal')}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2",
                      priority === 'Normal'
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Normal Priority
                  </button>
                  <button 
                    onClick={() => setPriority('Urgent')}
                    className={cn(
                      "flex-1 rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2",
                      priority === 'Urgent'
                        ? "border-[#E63946] bg-red-50 text-[#E63946]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Megaphone className="h-4 w-4" />
                    Urgent Alert
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button 
                  variant="danger" 
                  className="flex-1 rounded-2xl bg-[#E63946] px-5 py-3 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95 h-auto"
                  onClick={handleSend}
                  disabled={!title || !message}
                >
                  <Send className="h-4 w-4 mr-2" /> Send Broadcast
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 h-auto"
                >
                  Save Draft
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Past Broadcasts */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-[600px] lg:h-auto">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Recent Broadcasts</h3>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
              {pastBroadcasts.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {pastBroadcasts.map(broadcast => (
              <div key={broadcast.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{broadcast.title}</h4>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {broadcast.message}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    {broadcast.time} • {broadcast.recipients} recipients
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {broadcast.readRate}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      broadcast.priority === 'Urgent' ? "bg-red-50 text-[#E63946]" : "bg-slate-100 text-slate-600"
                    )}>
                      {broadcast.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatData {
  icon: string;
  color: string;
  iconColor: string;
  label: string;
  value: string | number;
  meta: [string, string][];
  metaColor: string;
}

interface RegistrationData {
  initials: string;
  name: string;
  email: string;
  course: string;
  batch: string;
  date: string;
  status: string;
}

const defaultStats: StatData[] = [
  {
    icon: 'ti-users',
    color: 'rgba(99,102,241,0.15)',
    iconColor: '#ffffff',
    label: 'Total students',
    value: '1,200',
    meta: [['Applied this month', '320'], ['Growth', '↗ 22%']],
    metaColor: 'green',
  },
  {
    icon: 'ti-books',
    color: 'rgba(29,158,117,0.15)',
    iconColor: '#5DCAA5',
    label: 'Active courses',
    value: '24',
    meta: [['Batches running', '8'], ['New this month', '↗ 4']],
    metaColor: 'green',
  },
  {
    icon: 'ti-currency-dollar',
    color: 'rgba(186,117,23,0.15)',
    iconColor: '#FAC775',
    label: 'Monthly revenue',
    value: '$89.4k',
    meta: [['vs last month', '↗ 18%'], ['Increase', '+$14k']],
    metaColor: 'green',
  },
  {
    icon: 'ti-checklist',
    color: 'rgba(226,75,74,0.15)',
    iconColor: '#ffffff ',
    label: 'Pending tasks',
    value: '12',
    meta: [['vs last week', '↘ −3'], ['Overdue', '2']],
    metaColor: 'amber',
  },
];

const shortcuts = [
  { href: '/admin/managecourses', icon: 'ti-books', color: 'rgba(29,158,117,0.15)', iconColor: '#999999', label: 'Courses', value: '24 active' },
  { href: '/admin/manageblogs',   icon: 'ti-article', color: 'rgba(99,102,241,0.15)', iconColor: '#ffffff', label: 'Blogs', value: '38 published' },
  { href: '/admin/managetestimonial', icon: 'ti-star', color: 'rgba(186,117,23,0.15)', iconColor: '#ffffff', label: 'Testimonials', value: '14 pending' },
];

const defaultRegistrations: RegistrationData[] = [
  { initials: 'JD', name: 'John Doe', email: 'john@example.com', course: 'React Mastery', batch: 'Batch 3', date: 'Oct 24', status: 'Active' },
  { initials: 'JS', name: 'Jane Smith', email: 'jane@example.com', course: 'Advanced Node', batch: 'Batch 1', date: 'Oct 23', status: 'Pending' },
  { initials: 'AK', name: 'Arjun Kumar', email: 'arjun@example.com', course: 'UI/UX Design', batch: 'Batch 2', date: 'Oct 22', status: 'Active' },
];

const statusStyles: Record<string, string> = {
  Active:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Pending: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  Dropped: 'bg-red-500/10    text-red-400    border border-red-500/20',
};

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(defaultStats as StatData[]);
  const [recentRegistrations, setRecentRegistrations] = useState(defaultRegistrations as RegistrationData[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [contactInfo, setContactInfo] = useState([] as any[]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // TODO: Replace with your actual backend endpoint
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const data = await response.json();
        if (data.stats) setDashboardStats(data.stats);
        if (data.registrations) setRecentRegistrations(data.registrations);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(()=>{
    const fetchContactInfo = async () => {
      try{
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/contact/get-all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if(!res.ok) throw new Error('Failed to fetch contact info');
        const data = await res.json();
        setContactInfo(data);
        console.log('Contact info:', data);
      }catch(err:any){
        console.error('Contact API error:', err);
        setError(err.message);
      }
    };
    fetchContactInfo();

  },[])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">

      {/* Stat cards */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-base-100 font-medium mb-3">Overview</p>
        {error && <p className="text-xs text-error mb-3">Warning: Could not load live data. ({error})</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboardStats.map((s) => (
            <div key={s.label} className="bg-brand-gradient rounded-2xl border border-white/[0.08] p-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg"
                style={{ background: s.color, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} aria-hidden="true" />
              </div>
              <p className="text-[11px] text-base-content mb-1">{s.label}</p>
              <p className="text-2xl font-medium text-base-content mb-2 leading-none">{s.value}</p>
              <div className="border-t border-white/[0.08] pt-2 space-y-1">
                {s.meta.map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-base-content">{k}</span>
                    <span className="text-base-content">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-base-100/80 font-medium mb-3">Quick access</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shortcuts.map((s) => (
            <Link key={s.href} href={s.href}
              className="bg-brand-gradient rounded-2xl border border-white/[0.08] rounded-xl p-3 flex items-center gap-3 hover:bg-[#222840] transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ background: s.color, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-white/40">{s.label}</p>
                <p className="text-sm font-medium text-slate-100">{s.value}</p>
              </div>
              <i className="ti ti-chevron-right ml-auto text-white/20 text-sm" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-base-content rounded-2xl border border-base-100 lg:col-span-2 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b bg-brand-gradient border-white/[0.08]">
            <span className="text-sm font-medium text-slate-100">Recent registrations</span>
            <button className="text-[11px] text-indigo-400/80">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-base-100/80 font-medium border-b border-base-100/10">
                  <th className="text-left px-4 py-2.5 border-b border-white/[0.06]">Student</th>
                  <th className="text-left px-4 py-2.5 border-b border-white/[0.06]">Course</th>
                  <th className="text-left px-4 py-2.5 border-b border-white/[0.06]">Batch</th>
                  <th className="text-left px-4 py-2.5 border-b border-white/[0.06]">Date</th>
                  {/* <th className="text-left px-4 py-2.5 border-b border-white/[0.06]">Status</th> */}
                </tr>
              </thead>
              <tbody>
                {contactInfo.map((r) => (
                  <tr key={r.email} className="border-b border-white/[0.05] last:border-none hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-base-300 flex items-center justify-center text-[10px] font-medium flex-shrink-0">
                          {r.initials}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-base-300">{r.fullName
}</p>
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-base-300">{r.course}</td>
                    <td className="px-4 py-2.5 text-xs text-base-300">{r.batch}</td>
                    <td className="px-4 py-2.5 text-xs text-base-300">{r.createdAt}</td>
                    {/* <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusStyles[r.status] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                        {r.status}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-brand-content rounded-2xl border border-base-100 ">
          <div className="px-4 py-3 border-b border-white/[0.08] bg-brand-gradient  rounded-t-2xl">
            <span className="text-sm font-medium text-slate-100 ">Quick actions</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              { icon: 'ti-plus', label: 'New course', primary: true },
              { icon: 'ti-speakerphone', label: 'Announcement', primary: false },
              { icon: 'ti-file-analytics', label: 'Generate report', primary: false },
              { icon: 'ti-users-plus', label: 'Add batch', primary: false },
            ].map((a) => (
              <button key={a.label}
                className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-colors
                  ${a.primary
                    ? 'bg-indigo-500/20 text-base-300 hover:bg-indigo-500/30'
                    : 'text-base-100/50 border border-white/[0.08] hover:bg-white/[0.05] hover:text-base-100/75'
                  }`}>
                <i className={`ti ${a.icon} text-[15px]`} aria-hidden="true" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
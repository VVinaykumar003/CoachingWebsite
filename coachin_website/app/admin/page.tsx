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
  fullName: string;
  email: string;
  course: string;
  batch: string;
  createdAt: string;
  status: string;
}

interface ShortcutConfig {
  href: string;
  icon: string;
  color: string;
  iconColor: string;
  label: string;
  key: string;
}

const shortcutConfig: ShortcutConfig[] = [
  { key: 'courses',      href: '/admin/managecourses',     icon: 'ti-books',   color: 'rgba(29,158,117,0.15)',  iconColor: '#999999', label: 'Courses' },
  { key: 'blogs',        href: '/admin/manageblogs',       icon: 'ti-article', color: 'rgba(99,102,241,0.15)',  iconColor: '#ffffff', label: 'Blogs' },
  { key: 'testimonials', href: '/admin/managetestimonial', icon: 'ti-star',    color: 'rgba(186,117,23,0.15)',  iconColor: '#ffffff', label: 'Testimonials' },
];

const quickActions = [
  { icon: 'ti-plus', label: 'New course', primary: true },
  { icon: 'ti-speakerphone', label: 'Announcement', primary: false },
  { icon: 'ti-file-analytics', label: 'Generate report', primary: false },
  { icon: 'ti-users-plus', label: 'Add batch', primary: false },
];

const statusStyles: Record<string, string> = {
  Active:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Pending: 'bg-amber-500/10  text-amber-400  border border-amber-500/20',
  Dropped: 'bg-red-500/10    text-red-400    border border-red-500/20',
};

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<StatData[]>([]);
  const [shortcutValues, setShortcutValues] = useState<Record<string, string>>({});
  const [recentRegistrations, setRecentRegistrations] = useState<RegistrationData[]>([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const token = localStorage.getItem('adminToken');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const data = await response.json();

        setDashboardStats(Array.isArray(data?.stats) ? data.stats : []);
        setShortcutValues(
          typeof data?.shortcutCounts === 'object' && data?.shortcutCounts !== null
            ? data.shortcutCounts
            : {}
        );
      } catch (err: any) {
        console.error(err);
        setStatsError(err.message || 'Something went wrong');
        setDashboardStats([]);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setContactLoading(true);
      setContactError(null);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/contact/get-all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch contact info');
        const data = await res.json();

        setRecentRegistrations(Array.isArray(data) ? data : Array.isArray(data?.registrations) ? data.registrations : []);
      } catch (err: any) {
        console.error('Contact API error:', err);
        setContactError(err.message || 'Something went wrong');
        setRecentRegistrations([]);
      } finally {
        setContactLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <div className="space-y-6 p-1">

      {/* Stat cards
      <div>
        <p className="text-[11px] uppercase tracking-widest text-base-100 font-medium mb-3">Overview</p>
        {statsError && (
          <p className="text-xs text-error mb-3">Warning: Could not load live data. ({statsError})</p>
        )}

        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-brand-gradient rounded-2xl border border-white/[0.08] p-4 animate-pulse">
                <div className="w-9 h-9 rounded-lg bg-white/10 mb-3" />
                <div className="h-2.5 w-20 bg-white/10 rounded mb-2" />
                <div className="h-6 w-16 bg-white/10 rounded mb-3" />
                <div className="h-8 w-full bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : dashboardStats.length === 0 ? (
          <div className="bg-brand-gradient rounded-2xl border border-white/[0.08] p-6 text-center">
            <p className="text-xs text-base-100/60">No overview data available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dashboardStats.map((s) => (
              <div key={s.label} className="bg-brand-gradient rounded-2xl border border-white/[0.08] p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg"
                  style={{ background: s.color, color: s.iconColor }}>
                  <i className={`ti ${s.icon}`} aria-hidden="true" />
                </div>
                <p className="text-[11px] text-base-content mb-1">{s.label}</p>
                <p className="text-2xl font-medium text-base-content mb-2 leading-none">{s.value}</p>
                {s.meta?.length > 0 && (
                  <div className="border-t border-white/[0.08] pt-2 space-y-1">
                    {s.meta.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px]">
                        <span className="text-base-content">{k}</span>
                        <span className="text-base-content">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Shortcuts */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-base-100/80 font-medium mb-3">Quick access</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shortcutConfig.map((s) => (
            <Link key={s.href} href={s.href}
              className="bg-brand-gradient rounded-2xl border border-white/[0.08] rounded-xl p-3 flex items-center gap-3 hover:bg-[#222840] transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ background: s.color, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-white/40">{s.label}</p>
                <p className="text-sm font-medium text-slate-100">
                  {statsLoading ? '—' : (shortcutValues[s.key] ?? 'Click to view')}
                </p>
              </div>
              <i className="ti ti-chevron-right ml-auto text-white/20 text-sm" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                  <th className="text-left px-4 py-2.5 border-b border-white/[0.06]">Status</th>
                </tr>
              </thead>
              <tbody>
                {contactLoading ? (
                  [0, 1, 2].map((i) => (
                    <tr key={i} className="border-b border-white/[0.05] last:border-none">
                      <td className="px-4 py-2.5" colSpan={5}>
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : contactError ? (
                  <tr>
                    <td className="px-4 py-4 text-xs text-error" colSpan={5}>
                      Could not load registrations. ({contactError})
                    </td>
                  </tr>
                ) : recentRegistrations.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-xs text-base-300/60 text-center" colSpan={5}>
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  recentRegistrations.map((r) => (
                    <tr key={r.email} className="border-b border-white/[0.05] last:border-none hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-base-300 flex items-center justify-center text-[10px] font-medium flex-shrink-0">
                            {r.initials || r.fullName?.slice(0, 2)?.toUpperCase() || '--'}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-base-300">{r.fullName || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-base-300">{r.course || '—'}</td>
                      <td className="px-4 py-2.5 text-xs text-base-300">{r.batch || '—'}</td>
                      <td className="px-4 py-2.5 text-xs text-base-300">{r.createdAt || '—'}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusStyles[r.status] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                          {r.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="bg-brand-content rounded-2xl border border-base-100 ">
          <div className="px-4 py-3 border-b border-white/[0.08] bg-brand-gradient  rounded-t-2xl">
            <span className="text-sm font-medium text-slate-100 ">Quick actions</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {quickActions.map((a) => (
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
        </div> */}
      </div>

    </div>
  );
}
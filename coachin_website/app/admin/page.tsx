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
  _id?: string;
  initials?: string;
  fullName?: string;
  email?: string;
  whatsapp?: string;
  course?: string;
  batch?: string;
  message?: string;
  createdAt?: string;
  status?: string;
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
  { key: 'courses',      href: '/admin/managecourses',     icon: 'ti-books',   color: 'rgba(29,158,117,0.15)',  iconColor: '#5DCAA5', label: 'Courses' },
  { key: 'blogs',        href: '/admin/manageblogs',       icon: 'ti-article', color: 'rgba(99,102,241,0.15)',  iconColor: '#818CF8', label: 'Blogs' },
  { key: 'testimonials', href: '/admin/managetestimonial', icon: 'ti-star',    color: 'rgba(186,117,23,0.15)',  iconColor: '#FAC775', label: 'Testimonials' },
];

const quickActions = [
  { 
    href: '/admin/managecourses', 
    icon: 'ti-books', 
    label: 'Manage Courses', 
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' 
  },
  { 
    href: '/admin/manageblogs', 
    icon: 'ti-article', 
    label: 'Write New Blog', 
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' 
  },
  { 
    href: '/admin/managebatches', 
    icon: 'ti-layout-grid', 
    label: 'Manage Batches', 
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' 
  },
  { 
    href: '/admin/managestudent', 
    icon: 'ti-address-book', 
    label: 'Student Enquiries', 
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/25' 
  },
];

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
        const response = await fetch('/api/admin/dashboard', {
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

      {/* Overview Stat Cards */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-base-100/70 font-semibold mb-3">Overview</p>
        {statsError && (
          <p className="text-xs text-error mb-3">Notice: ({statsError})</p>
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
            <p className="text-xs text-white/60">No overview data available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dashboardStats.map((s) => (
              <div key={s.label} className="bg-brand-gradient rounded-2xl border border-white/[0.08] p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg"
                  style={{ background: s.color, color: s.iconColor }}>
                  <i className={`ti ${s.icon}`} aria-hidden="true" />
                </div>
                <p className="text-[11px] text-white/70 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white mb-2 leading-none">{s.value}</p>
                {s.meta?.length > 0 && (
                  <div className="border-t border-white/[0.08] pt-2 space-y-1">
                    {s.meta.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px]">
                        <span className="text-white/60">{k}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-base-100/70 font-semibold mb-3">Quick access</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shortcutConfig.map((s) => (
            <Link 
              key={s.href} 
              href={s.href}
              className="group bg-brand-gradient rounded-2xl border border-white/[0.08] hover:border-white/25 p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all !text-white hover:!text-white"
              style={{ color: '#ffffff' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ background: s.color, color: s.iconColor }}>
                <i className={`ti ${s.icon}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] text-white/70 group-hover:text-white/90 transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</p>
                <p className="text-sm font-semibold !text-white group-hover:!text-white" style={{ color: '#ffffff' }}>
                  {statsLoading ? '—' : (shortcutValues[s.key] ?? 'Click to manage')}
                </p>
              </div>
              <i className="ti ti-chevron-right ml-auto text-white/30 group-hover:text-white group-hover:translate-x-0.5 text-sm transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent enquiries */}
        <div className="bg-base-content rounded-2xl border border-white/[0.08] lg:col-span-2 overflow-hidden shadow-level-1">
          <div className="flex justify-between items-center px-4 py-3 border-b bg-brand-gradient border-white/[0.08]">
            <span className="text-sm font-semibold text-white">Recent Student Enquiries</span>
            <Link href="/admin/managestudent" className="text-[11px] text-indigo-300 hover:text-white transition-colors">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-base-100/70 font-medium border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="text-left px-4 py-2.5">Student</th>
                  <th className="text-left px-4 py-2.5">Course</th>
                  <th className="text-left px-4 py-2.5">WhatsApp</th>
                  <th className="text-left px-4 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {contactLoading ? (
                  [0, 1, 2].map((i) => (
                    <tr key={i} className="border-b border-white/[0.05] last:border-none">
                      <td className="px-4 py-3" colSpan={4}>
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : contactError ? (
                  <tr>
                    <td className="px-4 py-6 text-xs text-error text-center" colSpan={4}>
                      Could not load enquiries. ({contactError})
                    </td>
                  </tr>
                ) : recentRegistrations.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-xs text-base-300/60 text-center" colSpan={4}>
                      No enquiries yet.
                    </td>
                  </tr>
                ) : (
                  recentRegistrations.slice(0, 5).map((r, i) => (
                    <tr key={r._id || r.email || i} className="border-b border-white/[0.05] last:border-none hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {r.fullName?.slice(0, 2)?.toUpperCase() || 'ST'}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-base-100">{r.fullName || 'Anonymous'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                          {r.course || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.whatsapp ? (
                          <a
                            href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <i className="ti ti-brand-whatsapp text-sm" />
                            {r.whatsapp}
                          </a>
                        ) : (
                          <span className="text-xs text-base-100/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-base-100/60 whitespace-nowrap">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Recent'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="bg-base-content rounded-2xl border border-white/[0.08] overflow-hidden shadow-level-1 flex flex-col">
          <div className="px-4 py-3 border-b border-white/[0.08] bg-brand-gradient">
            <span className="text-sm font-semibold text-white">Quick Actions</span>
          </div>
          <div className="p-3 flex flex-col gap-2 flex-1 justify-center">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="group flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/25 !text-white hover:!text-white transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
                style={{ color: '#ffffff' }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border shrink-0 ${a.badgeColor} transition-transform group-hover:scale-105`}>
                  <i className={`ti ${a.icon}`} aria-hidden="true" />
                </div>
                <span 
                  className="text-xs font-semibold !text-white group-hover:!text-white transition-colors"
                  style={{ color: '#ffffff' }}
                >
                  {a.label}
                </span>
                <i className="ti ti-chevron-right ml-auto text-xs text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
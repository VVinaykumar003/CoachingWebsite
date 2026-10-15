"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useRouter();
  
  // Forgot Password States
  const [newPassword, setNewPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Set the token as a cookie so the server-side middleware can read it
        document.cookie = `adminToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // Expires in 7 days
        localStorage.setItem("adminToken", data.token);
        navigate.push("/admin");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateMessage(null);

    try {
      const res = await fetch("/api/admin/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password.');
      
      setUpdateMessage(data.message || 'Password updated successfully!');
      setNewPassword('');
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update password.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 relative overflow-hidden font-sans py-12 px-4 sm:px-6">
      
      {/* Ambient background decoration */}
      <div className="absolute top-[-8%] left-[-6%] w-96 h-96 bg-indigo-400/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-6%] w-96 h-96 bg-cyan-400/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-[0_20px_50px_rgba(26,35,126,0.08)]">
          
          {/* Header */}
          <div className="text-center mb-7">
            <img
              src="/kunal_logo_ee1.png"
              alt="Eunoia Education"
              className="h-16 mx-auto mb-4 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A237E] tracking-tight">Admin Portal</h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">Sign in to manage courses, blogs, and student enrolments securely.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* Admin ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. ADM-2026" 
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/15 transition-all shadow-xs" 
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl pl-10 pr-11 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/15 transition-all shadow-xs" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="flex justify-end mt-2">
                <label 
                  htmlFor="forgot_password_modal" 
                  className="text-xs font-semibold text-[#1A237E] hover:text-[#00BCD4] cursor-pointer transition-colors" 
                >
                  Forgot password?
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-brand-gradient shadow-[0_4px_16px_rgba(26,35,126,0.25)] hover:shadow-[0_6px_22px_rgba(26,35,126,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <input type="checkbox" id="forgot_password_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box bg-white rounded-3xl border border-slate-200 shadow-2xl p-7 sm:p-8 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#1A237E]">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enter your admin ID and new password below.</p>
            </div>
            <label 
              htmlFor="forgot_password_modal" 
              className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-slate-700" 
              onClick={() => { setUpdateMessage(null); setUpdateError(null); setNewPassword(''); }}
            >
              ✕
            </label>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {updateMessage && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{updateMessage}</span>
              </div>
            )}
            {updateError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{updateError}</span>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin ID
              </label>
              <input 
                type="text" 
                placeholder="Enter Admin ID" 
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/15 transition-all shadow-xs" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/15 transition-all shadow-xs" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-brand-gradient shadow-[0_4px_16px_rgba(26,35,126,0.25)] hover:shadow-[0_6px_22px_rgba(26,35,126,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-60" 
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Updating…</span>
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
"use client"
import React, { useState } from 'react';

const LeadMagnet = () => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    setSuccess(true);

    const message = `Hello Kunal Sir, my name is ${name.trim()} (${whatsapp.trim()}). I would like to get the free Formula Sheet & Demo Lecture PDF for JEE/NEET Physics.`;
    const waUrl = `https://wa.me/918770459007?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl py-4 md:py-6 font-sans">
      <div className="bg-brand-gradient rounded-3xl p-6 md:p-8 text-center shadow-2xl border border-white/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 w-full">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover"><defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" fillOpacity="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#p)" /></svg>
        </div>
        
        <div className="relative z-10 text-left md:w-1/2">
          <div className="badge badge-warning font-bold mb-4 shadow-sm text-xs">Free Resource</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Master JEE & NEET Physics</h2>
          <p className="text-white/90 text-lg mb-0 leading-relaxed">
            Not ready to enroll yet? Get our exclusive <strong>Formula Sheet & Demo Lecture PDF</strong> straight to your WhatsApp.
          </p>
        </div>

        <div className="relative z-10 md:w-1/2 w-full bg-white rounded-2xl p-6 shadow-xl text-left">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-slate-700">Your Name</span></label>
              <input 
                type="text" 
                placeholder="e.g. Rahul" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-slate-50 focus:bg-white text-slate-800 border-slate-300 focus:border-[#1A237E] transition-colors" 
                required 
              />
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-bold text-slate-700">WhatsApp Number</span></label>
              <input 
                type="tel" 
                placeholder="+91 98765 43210" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="input input-bordered w-full bg-slate-50 focus:bg-white text-slate-800 border-slate-300 focus:border-[#1A237E] transition-colors" 
                required 
              />
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <span>✓</span> Connecting you to WhatsApp... Check your new tab to send your request!
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn text-white w-full lg:text-base shadow-md hover:-translate-y-1 transition-all border-none bg-brand-gradient shadow-brand-glow font-bold"
            >
              {isSubmitting ? 'Opening WhatsApp...' : 'Send to My WhatsApp 🚀'}
            </button>
            <p className="text-xs text-center text-slate-500 mt-1 font-medium">We respect your privacy. Instant access on WhatsApp.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadMagnet;
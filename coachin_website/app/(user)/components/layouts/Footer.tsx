"use client";
import React from 'react';
import Link from 'next/link';
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-brand-gradient text-neutral-content pt-10 pb-16 md:pb-6 font-sans">
      <div className="container mx-auto px-4">
        <div className="footer grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-2">
          {/* Branding Column */}
          <aside className="max-w-xs">
            <Image src="/kunal_logo_ee1.png" 
            width={200}
            height={120}
            alt="Eunoia Education Logo" className="h-20 w-auto mb-2 bg-white rounded-2xl"
             loading='lazy'
            />
            <p className="text-neutral-content/80 text-base">
              <span className="font-bold text-lg block mb-1">Eunoia Education</span>
              <span className="italic text-sm">&quot; Empowering Students Voice in Education.&quot;</span>
            </p>
            {/* Social Icons */}
            <div className="flex gap-2 mt-4">
              <a href=" https://youtube.com/@theeunoiaeducation?si=ww24QGtiUsl4pt5_" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-circle" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
              </a>
              <a href=" https://www.instagram.com/eunoia_raipur?igsh=MWs5bXQyOWwzd2QxYQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-circle" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="https://www.facebook.com/share/18dnYJnGiC/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-circle" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>

            
          </aside>
          
          {/* Courses Column */}
          <nav>
            <h6 className="footer-title opacity-100 text-[#00BCD4] font-extrabold tracking-wide">Courses</h6>
            <Link href="/courses" className="link link-hover text-white/80 hover:text-white transition-colors">Physics (Class 11 & 12)</Link>
            <Link href="/courses" className="link link-hover text-white/80 hover:text-white transition-colors">NEET Prep</Link>
            <Link href="/courses" className="link link-hover text-white/80 hover:text-white transition-colors">JEE Mains/Advanced</Link>
          </nav>

          {/* Student Corner Column */}
          <nav>
            <h6 className="footer-title opacity-100 text-[#00BCD4] font-extrabold tracking-wide">Student Corner</h6>
            <Link href="/features" className="link link-hover text-white/80 hover:text-white transition-colors">Success Stories</Link>
            {/* <Link href="/features" className="link link-hover text-white/80 hover:text-white transition-colors">Student Results</Link> */}
            <Link href="/blogs" className="link link-hover text-white/80 hover:text-white transition-colors">Study Blog</Link>
            {/* <Link href="/courses" className="link link-hover text-white/80 hover:text-white transition-colors">Free Resources</Link> */}
          </nav>

          {/* Support Column */}
          <nav>
            <h6 className="footer-title opacity-100 text-[#00BCD4] font-extrabold tracking-wide">Support</h6>
            <Link href="/contact" className="link link-hover text-white/80 hover:text-white transition-colors">Contact Us</Link>
            <Link href="/contact" className="link link-hover text-white/80 hover:text-white transition-colors">FAQ</Link>
            <Link href="/about" className="link link-hover text-white/80 hover:text-white transition-colors">Terms & Rules</Link>
            {/* <a href="#" className="link link-hover text-white/80 hover:text-white transition-colors">Refund Policy</a> */}
          </nav>

          {/* Contact Details Column */}
          <nav>
            <h6 className="footer-title opacity-100 text-[#00BCD4] font-extrabold tracking-wide">Reach Us</h6>
            {/* <p className="text-white/80 text-sm leading-relaxed"><strong className="text-white">Founder:</strong> Kunal Madaria<br/>(Physics & Chemistry Expert)</p> */}
            <p className="text-white/80 text-sm leading-relaxed">
              New Rajendra Nagar, behind SBI Bank,<br/>Near RDA Building, Raipur, CG [492001]
            </p>
            <a href="tel:+919669238000" className="link link-hover text-white/80 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap text-sm">
              <span className="shrink-0 text-base">📞</span>
              <span>9669238000</span>
            </a>
            <a href="mailto:kunal@eunoiaeducation.in" className="link link-hover text-white/80 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap text-sm">
              <span className="shrink-0 text-base">✉️</span>
              <span>kunal@eunoiaeducation.in</span>
            </a>
          </nav>

          {/* Newsletter Column */}
          {/* <form className="w-full max-w-xs" onSubmit={(e) => e.preventDefault()}>
            <h6 className="footer-title text-white font-bold">Newsletter</h6>
            <p className="text-sm text-white/80 mb-4">Get free notes and exam updates in your inbox.</p>
            <div className="join w-full">
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered join-item w-full focus:outline-primary"
                required
              />
              <button className="btn btn-primary join-item">Subscribe</button>
            </div>
          </form> */}
        </div>


        
        <div className="flex flex-col md:flex-row justify-between items-center pt-3 pb-20 md:pb-2 gap-4 text-sm text-neutral-content/70">
        {/* Download the App */}
            <div className="mt-2">
              <h6 className="text-white font-bold text-base mb-2.5">
                Download the App
              </h6>
              <div className="flex flex-wrap gap-16 items-center">
                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=co.diy14.msubn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-black hover:bg-neutral-900 text-white px-4 py-3 rounded-lg border border-white/20 transition-all shadow-sm hover:scale-[1.02] active:scale-95"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512" aria-hidden="true">
                    <path fill="#4285F4" d="M35.6 14.7C28.2 22.6 24 34.7 24 49.3v413.4c0 14.6 4.2 26.7 11.6 34.6l1.9 1.7 232.5-232.5v-5.6L37.5 13l-1.9 1.7z" />
                    <path fill="#FFBB00" d="M346.9 337.8l-76.9-76.9v-5.6l76.9-76.9 1.8 1 91 51.7c26 14.7 26 38.8 0 53.6l-91 51.7-1.8 1.4z" />
                    <path fill="#EA4335" d="M270 258.1L35.6 492.5c8.6 9.1 22.8 10.2 38.9 1.1l272.4-155.8-76.9-79.7z" />
                    <path fill="#34A853" d="M270 253.9l76.9-79.7L74.5 18.4C58.4 9.3 44.2 10.4 35.6 19.5L270 253.9z" />
                  </svg>
                  <span className="flex flex-col text-left">
                    <span className="text-[8px] uppercase tracking-wider font-medium text-white/70 leading-none">
                      GET IT ON
                    </span>
                    <span className="text-xs font-semibold text-white leading-tight mt-0.5">
                      Google Play
                    </span>
                  </span>
                </a>

                {/* App Store */}
                <a
                  href="https://lorseh.on-app.in/app/home?orgCode=lorseh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-black hover:bg-neutral-900 text-white px-3 py-2 rounded-lg border border-white/20 transition-all shadow-sm hover:scale-[1.02] active:scale-95"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 170 170" aria-hidden="true">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.42-5.72-8.78-10.15-18.44-13.3-28.98-3.15-10.54-4.73-20.73-4.73-30.56 0-14.28 3.55-26.06 10.66-35.34 7.11-9.28 16.03-14.04 26.76-14.28 5.43 0 11.05 1.54 16.85 4.61 5.8 3.08 9.77 4.67 11.91 4.79 1.74 0 6.02-1.68 12.84-5.04 6.82-3.36 12.86-4.85 18.12-4.48 13.59.76 24.34 5.72 32.25 14.88-11.85 7.17-17.66 16.85-17.44 29.04.22 10.11 4.13 18.59 11.73 25.43 7.6 6.85 16.85 10.65 27.76 11.41-2.39 7.39-5.43 14.78-9.12 22.18zM119.22 31.84c0-7.39 2.61-14.24 7.83-20.55 5.22-6.3 11.85-10.54 19.89-12.72.33 1.09.49 2.17.49 3.26 0 7.39-2.72 14.4-8.15 21.03-5.43 6.63-12.06 10.76-19.89 12.39-.11-1.09-.17-2.28-.17-3.41z" />
                  </svg>
                  <span className="flex flex-col text-left">
                    <span className="text-[8px] uppercase tracking-wider font-medium text-white/70 leading-none">
                      DOWNLOAD ON THE
                    </span>
                    <span className="text-xs font-semibold text-white leading-tight mt-0.5">
                      App Store
                    </span>
                  </span>
                </a>
              </div>
            </div>
      </div>
        {/* Bottom Bar */}
        <div className="divider border-base-300 my-0"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-3 pb-28 md:pb-12 gap-4 text-sm text-neutral-content/70">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <p>© {new Date().getFullYear()} Eunoia Education. All rights reserved.</p>
            <span className="hidden md:inline-block opacity-50">|</span> 
            <hr className="border-neutral-content/20 w-12 md:hidden my-1"/>
            <Link href="/login" className="hover:text-neutral-content transition-colors font-medium cursor-pointer">Log in</Link>
          </div>
          <p className="text-center md:text-right">Powered by: <a href="https://www.zager.in/" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-content hover:text-primary transition-colors ml-1">Zager</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

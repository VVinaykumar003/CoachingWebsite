"use client";
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import {useRouter} from 'next/navigation';
// import {blogAPI } from '../api/api';

const Blog = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await fetch("/api/blogs/get-all").then(res => res.json());
       
        setBlogPosts(Array.isArray(data) ? data : data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Dynamically extract categories from the fetched posts
  const categories = ['All', ...new Set(blogPosts.map(post => post.category || 'Article'))];

  // Filter posts based on selected category
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => (post.category || 'Article') === activeCategory);

  // Reusable card render function
  const renderCard = (post: any) => (
    <div 
      key={post._id || post.id} 
      onClick={() => router.push(`/blogs/${post._id || post.id}`)}
      className="card bg-white w-full rounded-2xl shadow-[0_4px_20px_-4px_rgba(26,35,126,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(26,35,126,0.12)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 group flex flex-col cursor-pointer overflow-hidden"
    >
      <figure className="h-48 w-full relative overflow-hidden bg-slate-100">
        <img 
          src={post.coverImage || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop"} 
          alt={post.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
          loading="lazy"
        />
        {post.badge && (
          <div className={`absolute top-3.5 right-3.5 badge badge-success text-white ${post.badgeColor} shadow-sm font-semibold text-xs`}>{post.badge}</div>
        )}
      </figure>
      
      <div className="card-body p-5 sm:p-6 flex flex-col grow bg-white">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-bold text-[#1A237E] bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{post.category || 'Article'}</span>
          <span className="text-xs text-slate-400 font-medium">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
        <h2 className="card-title text-lg font-bold text-[#1A237E] leading-snug mb-2 group-hover:text-[#00BCD4] transition-colors line-clamp-2">{post.title}</h2>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4 grow">
          {post.content || "Read the full post to discover more insights and tips for your exam preparation."}
        </p>
        <div className="card-actions mt-auto w-full pt-2">
          <button className="btn btn-sm bg-brand-gradient text-white border-none w-full shadow-sm hover:shadow-md hover:brightness-110 transition-all font-semibold rounded-xl">Read More</button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="pt-10 lg:pt-8 pb-16 min-h-screen font-sans bg-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#1A237E] bg-indigo-50 border border-indigo-100 mb-3">
            Articles & Guidance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A237E] mb-3 tracking-tight">Our Blog</h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Fuel your learning journey with our latest study tips, exam updates, and deep-dive conceptual breakdowns.</p>
        </div>

        {/* Filter / Category Scroll */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 custom-scrollbar justify-start md:justify-center">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat 
                  ? 'bg-brand-gradient text-white border-transparent shadow-md' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#1A237E]/40 hover:text-[#1A237E] hover:bg-slate-50 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-16"><span className="loading loading-spinner loading-lg text-primary"></span></div>}

        {!loading && (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left mb-12">
              {filteredPosts.map(renderCard)}
            </div>

            {/* Newsletter Interstitial */}
            {filteredPosts.length > 0 && (
              <div className="rounded-3xl p-8 md:p-12 mb-10 text-center shadow-xl bg-brand-gradient text-white relative overflow-hidden flex flex-col items-center justify-center border border-white/10">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover"><defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" fillOpacity="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#p)" /></svg>
                </div>
                <div className="relative z-10 w-full max-w-2xl">
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-cyan-200 border border-white/20 mb-3 uppercase tracking-wider">
                    Free Knowledge Weekly
                  </span>
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">Get Exam Tips in your Inbox</h3>
                  <p className="text-slate-200 mb-8 text-base md:text-lg max-w-xl mx-auto leading-relaxed">Join 10,000+ students receiving weekly study hacks, formula sheets, and strategy breakdowns.</p>
                  {newsletterSubscribed ? (
                    <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-6 py-4 rounded-full font-semibold text-sm max-w-lg mx-auto shadow-lg backdrop-blur-sm">
                      ✓ Thank you for subscribing! Check your inbox for weekly study hacks and exam tips.
                    </div>
                  ) : (
                    <form className="join w-full justify-center shadow-xl rounded-full" onSubmit={handleNewsletterSubmit}>
                      <input 
                        type="email" 
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email address..." 
                        className="input input-bordered join-item w-full max-w-sm text-slate-800 placeholder-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-white text-sm" 
                        required 
                      />
                      <button type="submit" className="btn join-item border-none bg-gradient-to-r from-[#00BCD4] to-[#26C6DA] text-[#0F172A] font-bold hover:brightness-105 transition-all px-6">Subscribe</button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Empty State Fallback */}
            {filteredPosts.length === 0 && (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto my-8 shadow-xs">
                <p className="text-base text-slate-600 font-medium">No posts found for this category yet. Check back soon!</p>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
};

export default Blog;
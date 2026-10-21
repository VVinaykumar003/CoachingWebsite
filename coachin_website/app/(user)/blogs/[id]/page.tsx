"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';


const BlogPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Scroll to top whenever the URL ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const selectedFeaturedPost = id ? blogPosts.find(p => (p._id === id || p.id === id)) : null;

  return (
    <main className="pt-8 lg:pt-10 pb-16 min-h-screen font-sans bg-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-7xl text-left">
        
        {loading && <div className="text-center py-16"><span className="loading loading-spinner loading-lg text-primary"></span></div>}

        {!loading && selectedFeaturedPost ? (
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Full Article View */}
            <article className="lg:w-2/3 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(26,35,126,0.06)]">
              <button 
                className="btn btn-sm btn-ghost mb-6 pl-0 hover:bg-transparent text-slate-600 hover:text-[#1A237E] flex items-center gap-1.5 font-semibold transition-colors"
                onClick={() => router.push('/blogs')}
              >
                &larr; Back to all posts
              </button>
              <img 
                src={selectedFeaturedPost.coverImage || "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1200&auto=format&fit=crop"} 
                alt={selectedFeaturedPost.title} 
                className="w-full rounded-2xl mb-8 object-cover max-h-[500px] shadow-sm" 
                loading="lazy"
              />
              <div className="flex gap-3 items-center mb-6">
                <span className="text-xs font-bold text-[#1A237E] bg-indigo-50 border border-indigo-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedFeaturedPost.category || 'Article'}
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  {new Date(selectedFeaturedPost.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A237E] leading-tight mb-8">
                {selectedFeaturedPost.title}
              </h1>
              <div className="prose max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
                {selectedFeaturedPost.content || "No content available."}
              </div>
            </article>

            {/* Sidebar with other posts */}
            <aside className="lg:w-1/3 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(26,35,126,0.06)]">
                <h3 className="text-xl font-bold text-[#1A237E] border-b border-slate-100 pb-4 mb-4">Read More</h3>
                <div className="flex flex-col gap-4 custom-scrollbar overflow-y-auto max-h-[700px] pr-1">
                  {blogPosts.filter(p => (p._id || p.id) !== (selectedFeaturedPost._id || selectedFeaturedPost.id)).map(post => (
                    <div 
                      key={post._id || post.id} 
                      className="bg-slate-50 hover:bg-white rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-row overflow-hidden h-28 border border-slate-200/80 group" 
                      onClick={() => router.push(`/blogs/${post._id || post.id}`)}
                    >
                      <img 
                        src={post.coverImage || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop"} 
                        className="w-1/3 object-cover group-hover:scale-105 transition-transform duration-300" 
                        alt={post.title}
                        loading="lazy"
                      />
                      <div className="p-3.5 w-2/3 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-[#1A237E] uppercase tracking-wider mb-1">{post.category || 'Article'}</span>
                        <h4 className="font-bold text-sm text-[#1A237E] group-hover:text-[#00BCD4] transition-colors leading-snug line-clamp-2">{post.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : !loading && !selectedFeaturedPost ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto shadow-xs">
            <h2 className="text-3xl font-bold text-[#1A237E] mb-3">Post Not Found</h2>
            <p className="text-slate-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <button className="btn bg-brand-gradient text-white border-none font-semibold px-6 shadow-md hover:brightness-110" onClick={() => router.push('/blogs')}>Go Back to Blog</button>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default BlogPage;

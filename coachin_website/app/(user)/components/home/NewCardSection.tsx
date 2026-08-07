"use client"
import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';
// import { courseAPI } from '../../api/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_WIDTH = 300;
const CARD_GAP = 24; // matches gap-6

const NewCardSection = () => {

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await fetch('/api/course/get-all').then(res => res.json());
        console.log("Fetched courses from backend:", data);
        setCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
  }, [courses, updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = (CARD_WIDTH + CARD_GAP) * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (

    <div className="container mx-auto px-4 max-w-7xl font-sans mt-2">
      <div className="flex flex-col gap-6 bg-gradient-to-r from-[#1A237E] to-[#121a71] rounded-3xl p-6 lg:p-8 shadow-xl">

        {/* Top: Heading + Button, centered */}
        <div className="w-full flex flex-col items-center text-center text-white px-4 py-6 max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl text-white font-extrabold mb-2 leading-tight">Our Courses</h3>
          <p className="text-base md:text-lg opacity-90 mb-6 leading-tight">
            Structured programs designed for deep conceptual clarity and competitive exam success.
          </p>
          <a href="/courses" className="btn btn-warning shadow-lg hover:scale-105 transition-transform">
            Explore All
          </a>
        </div>

        {/* Bottom: Course Carousel */}
        <div className="relative w-full bg-white/5 rounded-2xl p-4 md:p-6">
          {loading && (
            <div className="w-full py-12 flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}

          {!loading && (
            <>
              {/* Left Arrow */}
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll courses left"
                className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-sm bg-white/95 hover:bg-white text-[#1A237E] border-none shadow-lg disabled:opacity-0 disabled:pointer-events-none transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll courses right"
                className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-sm bg-white/95 hover:bg-white text-[#1A237E] border-none shadow-lg disabled:opacity-0 disabled:pointer-events-none transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Edge fades so cards don't look clipped at the container bounds */}
              {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[#12174f] to-transparent rounded-l-2xl" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[#12174f] to-transparent rounded-r-2xl" /> */}

              <div
                ref={trackRef}
                onScroll={updateScrollButtons}
                className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-1"
              >
                {courses.map((course) => {
                  const courseId = course._id || course.id;

                  return (
                    <div
                      key={courseId}
                      className="w-[300px] shrink-0 snap-start flex flex-col h-[480px] bg-base-content rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 font-sans overflow-hidden"
                    >
                      {/* Image */}
                      <div className="w-full aspect-video shrink-0 border-b border-base-200 overflow-hidden bg-base-200/50">
                        <img
                          src={course.thumbnail || course.image || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop'}
                          alt={course.courseName || course.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-base-100 text-[16px] leading-tight line-clamp-2">
                          {course.courseName || course.title}
                        </h3>

                        <p className="text-xs text-base-100/70 mt-1.5">
                          {course.instructor || "Kunal Sir"} &middot; {course.category || "All Levels"}
                        </p>

                        <p className="text-sm text-base-100/80 mt-2.5 line-clamp-3">
                          {course.description || "Master the concepts with this comprehensive course. Includes live sessions, weekly reports, and doubt solving."}
                        </p>

                        <ul className="space-y-1.5 text-xs text-base-100/70 font-medium mt-3">
                          <li className="flex items-start gap-2">
                            <span className="shrink-0 text-primary">✓</span>
                            <span>Live hybrid classes & recordings</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="shrink-0 text-primary">✓</span>
                            <span>Weekly WhatsApp progress reports</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="shrink-0 text-primary">✓</span>
                            <span>Personal mentorship</span>
                          </li>
                        </ul>

                        <a
                          href={course.redirectLink || course.externalLink || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto btn border-none bg-brand-gradient text-white w-full shadow-brand-glow hover:shadow-[0_0_20px_rgba(0,188,212,0.7)] min-h-10 h-10"
                        >
                          Enroll Now
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewCardSection
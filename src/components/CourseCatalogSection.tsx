import React, { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import type { SharedCourse } from '../types/course';

export default function CourseCatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { courses, loading, error, refetch } = useCourses({
    category: selectedCategory,
    enableRealtime: true, // Auto-refreshes when courses are published in Course Creator
  });

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.overview && course.overview.toLowerCase().includes(q)) ||
      (course.category && course.category.toLowerCase().includes(q))
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              Supabase Cloud Sync
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Real-time Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Available Courses</h2>
          <p className="text-sm text-slate-500">Live synchronized with ILA Course Creator backend</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="Computer Science & AI">Computer Science & AI</option>
            <option value="Business & Leadership">Business & Leadership</option>
            <option value="German Language">German Language</option>
            <option value="Healthcare & Clinical Sciences">Healthcare</option>
            <option value="Finance & Quantitative Economics">Finance</option>
          </select>

          {/* Manual Refresh */}
          <button
            onClick={() => refetch()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 text-slate-500 animate-pulse">
          Loading courses from Supabase cloud...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm mb-6">
          <strong>Error connecting to Supabase:</strong> {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500">No courses found matching your criteria.</p>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course: SharedCourse) => (
          <article
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {course.category || 'General'}
                </span>
                {course.studied_by && (
                  <span className="text-xs text-slate-400 font-medium">
                    For: {course.studied_by}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                {course.title || course.course_name}
              </h3>
              {course.subtitle && (
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {course.subtitle}
                </p>
              )}

              {/* Overview */}
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {course.overview || 'Comprehensive structured academic curriculum.'}
              </p>
            </div>

            {/* Footer Metadata & Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {course.total_chapters || course.chapters?.length || 0} Modules
              </span>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-registration-flow', { detail: { courseName: course.title || course.course_name } }));
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition cursor-pointer shadow-xs"
              >
                Enroll / View
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

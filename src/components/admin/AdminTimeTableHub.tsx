import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Play, Radio, Search, Filter, 
  CheckCircle2, BookOpen, Layers, ChevronLeft, ChevronRight, 
  ExternalLink, Sparkles, RefreshCw
} from 'lucide-react';
import { 
  getGlobalCourses, getGlobalBatches, getGlobalPaths,
  GlobalCourse, GlobalBatch, GlobalPath 
} from '../../lib/db';

interface LiveClassItem {
  id: string;
  batchId: string;
  batchName: string;
  courseId?: string;
  courseName: string;
  pathName: string;
  pathMethod: string;
  staff: string;
  date: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  status: 'Live' | 'Upcoming' | 'Completed';
  studentsCount: string;
  remarks?: string;
}

const AdminTimeTableHub: React.FC = () => {
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [batches, setBatches] = useState<GlobalBatch[]>([]);
  const [paths, setPaths] = useState<GlobalPath[]>([]);
  
  // Date and Filter State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Completed'>('All');
  const [courseFilter, setCourseFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  // Load Real Database Data
  const loadDbData = () => {
    setCourses(getGlobalCourses());
    setBatches(getGlobalBatches());
    setPaths(getGlobalPaths());
  };

  useEffect(() => {
    loadDbData();
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    window.addEventListener('ilas-courses-changed', loadDbData);
    window.addEventListener('ilas-batches-changed', loadDbData);
    window.addEventListener('ilas-paths-changed', loadDbData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('ilas-courses-changed', loadDbData);
      window.removeEventListener('ilas-batches-changed', loadDbData);
      window.removeEventListener('ilas-paths-changed', loadDbData);
    };
  }, []);

  // Quick Date Navigation
  const setDateToday = () => setSelectedDate(new Date().toISOString().split('T')[0]);
  const setDateOffset = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Helper to determine Live / Upcoming / Completed status based on time slot string (e.g. "09:00 - 11:00")
  const calculateSlotStatus = (timeSlot: string): 'Live' | 'Upcoming' | 'Completed' => {
    if (!isToday) {
      const targetDate = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);
      if (targetDate < today) return 'Completed';
      return 'Upcoming';
    }

    try {
      const parts = timeSlot.split('-').map(s => s.trim().replace(/[^0-9:]/g, ''));
      if (parts.length < 2) return 'Upcoming';

      const [startH, startM] = parts[0].split(':').map(Number);
      const [endH, endM] = parts[1].split(':').map(Number);

      const now = new Date();
      const startTime = new Date();
      startTime.setHours(startH || 9, startM || 0, 0, 0);

      const endTime = new Date();
      endTime.setHours(endH || 11, endM || 0, 0, 0);

      if (now >= startTime && now <= endTime) return 'Live';
      if (now < startTime) return 'Upcoming';
      return 'Completed';
    } catch {
      return 'Upcoming';
    }
  };

  // Convert Minimal DB Batches & Courses into Time Table Class Items
  const classItems: LiveClassItem[] = [];

  batches.forEach((batch) => {
    const matchedCourse = courses.find(c => c.id === batch.linkedCourseId || c.name === batch.linkedCourseName) || 
                          courses.find(c => c.batchId === batch.id);
    const matchedPath = paths.find(p => p.id === batch.linkedPathId || p.name === batch.linkedPathName);

    const timingSlots = batch.timings && batch.timings.length > 0 ? batch.timings : ['09:00 - 11:00'];

    timingSlots.forEach((slot, idx) => {
      const [start = '09:00', end = '11:00'] = slot.split('-').map(s => s.trim());
      const status = calculateSlotStatus(slot);

      classItems.push({
        id: `${batch.id}-slot-${idx}`,
        batchId: batch.id,
        batchName: batch.name,
        courseId: matchedCourse?.id,
        courseName: matchedCourse?.name || batch.linkedCourseName || 'General Program',
        pathName: matchedPath?.name || batch.linkedPathName || matchedCourse?.pathName || 'Intelli-Coach Path',
        pathMethod: matchedPath?.methods || matchedCourse?.methods || 'AI + Adaptive Tutoring',
        staff: matchedCourse?.staff || 'Nadeem - ID 091',
        date: selectedDate,
        timeSlot: slot,
        startTime: start,
        endTime: end,
        status: status,
        studentsCount: matchedCourse?.students || '30',
        remarks: batch.remarks
      });
    });
  });

  // Calculate Metrics from Current DB Data
  const liveCount = classItems.filter(c => c.status === 'Live').length;
  const upcomingCount = classItems.filter(c => c.status === 'Upcoming').length;
  const completedCount = classItems.filter(c => c.status === 'Completed').length;
  const totalBatchesCount = batches.length;
  const totalStudentsTally = classItems.reduce((acc, c) => acc + (parseInt(c.studentsCount) || 0), 0);

  // Filtered Class List
  const filteredClasses = classItems.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (courseFilter !== 'All' && item.courseName !== courseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCourse = item.courseName.toLowerCase().includes(q);
      const matchBatch = item.batchName.toLowerCase().includes(q);
      const matchStaff = item.staff.toLowerCase().includes(q);
      const matchPath = item.pathName.toLowerCase().includes(q);
      if (!matchCourse && !matchBatch && !matchStaff && !matchPath) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 p-4 md:p-6 w-full flex flex-col gap-5 bg-slate-50 font-sans min-h-screen">
      
      {/* Top Header Bar */}
      <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
              Admin Education Hub
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>LIVE CLOCK: {currentTime}</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Class Time Table & Live Schedule</h2>
          <p className="text-xs text-slate-500">Live running classes, batch cohorts, and date-wise schedules from current database.</p>
        </div>

        <button 
          onClick={loadDbData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync DB</span>
        </button>
      </div>

      {/* Date Selector Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setDateOffset(-1)}
              className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => setDateOffset(1)}
              className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={setDateToday}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isToday 
                ? 'bg-brand-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📅 Today (Live)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course, batch, staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Minimal KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">Live Now</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="text-2xl font-extrabold text-red-700">{liveCount}</div>
          <div className="text-[11px] text-slate-400">Ongoing sessions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">Upcoming</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{upcomingCount}</div>
          <div className="text-[11px] text-slate-400">Scheduled slots</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Total Batches</span>
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-700">{totalBatchesCount}</div>
          <div className="text-[11px] text-slate-400">Configured in DB</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Total Students</span>
            <Users className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{totalStudentsTally}</div>
          <div className="text-[11px] text-slate-400">Enrolled capacity</div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Live', 'Upcoming', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'Live' && '🔴 '}
              {st === 'Upcoming' && '⏳ '}
              {st === 'Completed' && '✅ '}
              {st} {st === 'All' ? `(${classItems.length})` : `(${classItems.filter(c => c.status === st).length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Course:</span>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-medium bg-slate-50 focus:outline-none cursor-pointer"
          >
            <option value="All">All Courses ({courses.length})</option>
            {courses.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Time Table List (From Current DB Batches) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Time Slot</th>
                <th className="px-4 py-3">Live Status</th>
                <th className="px-4 py-3">Course Name</th>
                <th className="px-4 py-3">Batch Name</th>
                <th className="px-4 py-3">Education Path</th>
                <th className="px-4 py-3">Assigned Staff</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3 text-right">Classroom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredClasses.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50 transition-colors ${
                    item.status === 'Live' ? 'bg-red-50/20' : ''
                  }`}
                >
                  
                  {/* Time Slot */}
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{item.timeSlot}</span>
                    </div>
                  </td>

                  {/* Live Status Badge */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'Live' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                      item.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {item.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                      {item.status === 'Upcoming' && <Clock className="w-3 h-3" />}
                      {item.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                      <span>{item.status === 'Live' ? 'LIVE NOW' : item.status}</span>
                    </span>
                  </td>

                  {/* Course Name */}
                  <td className="px-4 py-3.5 font-bold text-brand-900">
                    {item.courseName}
                  </td>

                  {/* Batch Name */}
                  <td className="px-4 py-3.5">
                    <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      {item.batchName}
                    </span>
                  </td>

                  {/* Education Path */}
                  <td className="px-4 py-3.5 text-slate-600">
                    <div>{item.pathName}</div>
                    <span className="text-[10px] text-slate-400">{item.pathMethod}</span>
                  </td>

                  {/* Assigned Staff */}
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    {item.staff}
                  </td>

                  {/* Students */}
                  <td className="px-4 py-3.5 text-slate-600">
                    <span className="font-bold text-slate-900">{item.studentsCount}</span> Enrolled
                  </td>

                  {/* Action Link */}
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-language-trainer'))}
                      className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-lg border border-brand-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Launch Room</span>
                    </button>
                  </td>

                </tr>
              ))}

              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    No batches or classes configured in the database matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminTimeTableHub;

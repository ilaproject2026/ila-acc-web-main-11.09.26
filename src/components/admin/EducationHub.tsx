import React, { useState, useRef, useEffect } from 'react';
import LibraryAndClassRoom from './LibraryAndClassRoom';
import ServicesAndBatches from './ServicesAndBatches';
import CourseCreator from './CourseCreator';
import AICourseCreator from './AICourseCreator';
import AdminTimeTableHub from './AdminTimeTableHub';
import AutomatedCommTriggersHub from '../education/AutomatedCommTriggersHub';
import HODWorkStudyHub from './HODWorkStudyHub';
import {
  BookOpen, Calendar, PlusCircle, Sparkles, Users, UserCheck,
  CheckSquare, Clock, Database, UserPlus, HelpCircle, Award,
  Layers, ArrowRight, Activity, Search, ChevronLeft, ChevronRight,
  LayoutGrid, List, SlidersHorizontal, Radio, MessageSquare, Zap, Briefcase, Megaphone
} from 'lucide-react';
import { getInquiries, getStaffRegistry, getAttendanceLogs, getGlobalCourses } from '../../lib/db';
import { HubSocialPromoView } from './common/HubSocialPromoView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';

const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('HOD DB');
  const [isWrapMode, setIsWrapMode] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const navContainerRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { id: 'HOD DB', label: 'HOD DB', icon: Database },
    { id: 'SERVICES & BATCHES', label: 'Path & Batch', icon: Calendar },
    { id: 'COURSE CREATE', label: 'Course Creator', icon: PlusCircle },
    { id: 'LIBRARY & CLASS ROOM', label: 'Library & Classroom', icon: BookOpen },

    // { id: 'HOD WORK & STUDY', label: 'HOD Work & Study', icon: Briefcase },
    { id: 'COMMUNICATION TRIGGERS', label: 'Comm Triggers', icon: Radio },
    { id: 'SOCIAL MEDIA PROMO', label: 'Social Promo', icon: Megaphone },
    { id: 'INTAKE TRACKING', label: 'Intake Desk', icon: Users },
    // { id: 'TIME TABLE', label: 'Time Table', icon: Clock }, /* Hidden per request */
    // { id: 'STUDENT ROSTER', label: 'Academic Roster', icon: UserCheck }, /* Hidden per request */
    // { id: 'AI COURSE CREATOR', label: 'AI Creator', icon: Sparkles }, /* Hidden per request */
    { id: 'TASK DELEGATION', label: 'Task Delegation', icon: CheckSquare },
    { id: 'STAFF & ATTENDANCE', label: 'Staff Attendance', icon: Users },
    { id: 'STUDENT ATTN', label: 'Student Attendance', icon: UserCheck },
    { id: 'EXAM REST', label: 'Exams & Results', icon: Award }
  ];

  // Check scroll boundaries
  const updateScrollButtons = () => {
    if (navContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  // Auto-scroll active tab into view
  useEffect(() => {
    const activeBtn = document.getElementById(`nav-tab-${activeTab.replace(/\s+/g, '-')}`);
    if (activeBtn && navContainerRef.current && !isWrapMode) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setTimeout(updateScrollButtons, 300);
  }, [activeTab, isWrapMode]);

  // Smooth scroll left / right
  const scrollNav = (direction: 'left' | 'right') => {
    if (navContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      navContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 350);
    }
  };

  // Handle wheel horizontal scrolling
  const handleNavWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (navContainerRef.current && !isWrapMode && e.deltaY !== 0) {
      e.preventDefault();
      navContainerRef.current.scrollLeft += e.deltaY * 0.8;
      updateScrollButtons();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'HOD WORK & STUDY':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <HODWorkStudyHub />
          </div>
        );
      case 'COMMUNICATION TRIGGERS':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <AutomatedCommTriggersHub onNavigateToCourseCatalog={() => setActiveTab('LIBRARY & CLASS ROOM')} />
          </div>
        );
      case 'SOCIAL MEDIA PROMO':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <HubSocialPromoView departmentName="Education" />
          </div>
        );
      case 'INTAKE TRACKING':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <HubIntakeTrackingView departmentName="Education" departmentTitle="All Courses Hub / Classroom Intake Desk" />
          </div>
        );
      /* Hidden per request:
      case 'TIME TABLE':
        return <AdminTimeTableHub />;
      */
      case 'LIBRARY & CLASS ROOM':
        return <LibraryAndClassRoom onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'SERVICES & BATCHES':
        return <ServicesAndBatches />;
      case 'COURSE CREATE':
      case 'COURSE CREATOR':
        return <CourseCreator onNavigateTab={(tab) => setActiveTab(tab)} />;
      /* Hidden per request:
      case 'AI COURSE CREATOR':
        return <AICourseCreator onNavigateTab={(tab) => setActiveTab(tab)} />;
      */
      case 'HOD DB':
        const courses = getGlobalCourses();
        const staffList = getStaffRegistry();
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in">
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200">Executive HOD Console</span>
                <h2 className="text-xl font-black text-slate-900 mt-1.5">Head of Department Master Database</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time oversight of courses, active batches, academic faculty, and classroom allocation.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('LIBRARY & CLASS ROOM')} className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <BookOpen className="w-4 h-4" /> Open Classroom
                </button>
                <button onClick={() => setActiveTab('COURSE CREATE')} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <PlusCircle className="w-4 h-4" /> Create Course
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Curriculum</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{courses.length} Courses</div>
                <p className="text-xs text-slate-500 mt-0.5">Managed across all CEFR and tech pathways.</p>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Faculty & Tutors</span>
                <div className="text-2xl font-black text-brand-600 mt-1">{staffList.length} Active Staff</div>
                <p className="text-xs text-slate-500 mt-0.5">Senior instructors and AI bot co-tutors.</p>
              </div>
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Classroom Utilization</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">94.8%</div>
                <p className="text-xs text-slate-500 mt-0.5">Real-time studio streaming & attendance sync.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Curriculum Inventory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b">
                    <tr>
                      <th className="p-2.5">Course Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Chapters</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Faculty</th>
                      <th className="p-2.5">Fee</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">{c.top_title || 'Education'}</span></td>
                        <td className="p-2.5 text-slate-600">{c.chapter} Chapters</td>
                        <td className="p-2.5 text-slate-600">{c.duration}</td>
                        <td className="p-2.5 text-slate-600">{c.staff}</td>
                        <td className="p-2.5 font-bold text-slate-900">{c.fee}</td>
                        <td className="p-2.5 text-right">
                          <button onClick={() => setActiveTab('LIBRARY & CLASS ROOM')} className="text-brand-600 hover:text-brand-700 font-bold mr-3 cursor-pointer">Classroom →</button>
                          <button onClick={() => setActiveTab('COURSE CREATE')} className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      /* Hidden per request:
      case 'STUDENT ROSTER':
        const enrolledStudents = getInquiries().filter(i => i.category === 'Education');
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Academic Classroom Access & Passes
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1.5">Academic Student Roster</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enrolled students, active digital classroom credentials, and batch assignments.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('LIBRARY & CLASS ROOM')} className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <BookOpen className="w-4 h-4" /> Open Classroom Stream
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Enrolled Academic Candidates & Class Passes ({enrolledStudents.length})</h3>
              <div className="space-y-2.5">
                {enrolledStudents.map(inq => (
                  <div key={inq.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{inq.name} ({inq.email})</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Course: <span className="font-semibold text-brand-700">{inq.course}</span> • Counselor: <span className="font-semibold text-slate-700">{inq.assignedStaffName || 'Academic Team'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {inq.paymentStatus || 'Paid'}
                      </span>
                      <button onClick={() => setActiveTab('LIBRARY & CLASS ROOM')} className="px-2.5 py-1 bg-brand-600 text-white rounded-lg text-[11px] font-bold cursor-pointer hover:bg-brand-500">
                        Launch Class →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      */
      case 'TASK DELEGATION':
      case 'STAFF & ATTENDANCE':
      case 'STUDENT ATTN':
      case 'EXAM REST':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">Education Hub Operation</span>
                <h2 className="text-xl font-black text-slate-900 mt-1.5">{activeTab} Console</h2>
                <p className="text-xs text-slate-500 mt-0.5">Synchronized with master academic database, cloud records, and attendance logs.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveTab('LIBRARY & CLASS ROOM')} className="px-3.5 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-brand-500">
                  Classroom View →
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Academic Attendance Rate</div>
                <div className="text-2xl font-black text-emerald-600">96.4%</div>
                <div className="text-slate-500">Synchronized with daily biometric + online portals</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Certificates Issued</div>
                <div className="text-2xl font-black text-indigo-600">328 Goethe / Telc / Tech</div>
                <div className="text-slate-500">Verified QR Digital Credentials</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Pending Evaluations</div>
                <div className="text-2xl font-black text-amber-600">12 Mocks</div>
                <div className="text-slate-500">Queued for AI + Mentor review</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white rounded-2xl shadow-xs border border-slate-200 p-8 m-4">
            <h2 className="text-lg font-bold text-slate-700 mb-1">{activeTab}</h2>
            <p className="text-xs text-center max-w-md">
              This module is currently under development. The complete functional components for this section will be integrated here shortly.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-12rem)] bg-slate-50 relative rounded-2xl border border-slate-200 shadow-xs">

      {/* =========================================================================
          EDUCATION HUB SUB-NAVBAR: FULLY RESPONSIVE, SCROLLABLE & WRAP-ENABLED
      ========================================================================= */}
      <div className="bg-slate-900 border-b border-slate-800/90 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between px-2 py-1.5 md:px-3 md:py-2 gap-2 relative">

          {/* Left Scroll Arrow Button */}
          {!isWrapMode && (
            <button
              onClick={() => scrollNav('left')}
              disabled={!canScrollLeft}
              className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer hidden sm:flex items-center justify-center ${!canScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-100 shadow-xs bg-slate-800/80'
                }`}
              title="Scroll Menu Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Items Container (Scrollable or Wrapped) */}
          <div
            ref={navContainerRef}
            onScroll={updateScrollButtons}
            onWheel={handleNavWheel}
            className={`w-full flex items-center gap-1.5 py-0.5 transition-all ${isWrapMode
                ? 'flex-wrap overflow-visible'
                : 'overflow-x-auto scroll-smooth no-scrollbar'
              }`}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'COURSE CREATE' && activeTab === 'COURSE CREATOR');
              const tabDomId = `nav-tab-${item.id.replace(/\s+/g, '-')}`;

              return (
                <button
                  id={tabDomId}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 cursor-pointer ${isActive
                      ? 'bg-brand-600 text-white shadow-xs font-black ring-1 ring-brand-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 bg-slate-800/40'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span className="uppercase tracking-wider text-[11px] font-black">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow Button */}
          {!isWrapMode && (
            <button
              onClick={() => scrollNav('right')}
              disabled={!canScrollRight}
              className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer hidden sm:flex items-center justify-center ${!canScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-100 shadow-xs bg-slate-800/80'
                }`}
              title="Scroll Menu Right to View All Tabs"
            >
              <ChevronRight className="w-4 h-4 text-amber-300 animate-pulse" />
            </button>
          )}

          {/* Wrap / Expand All Tabs Toggle Button */}
          <button
            onClick={() => setIsWrapMode(!isWrapMode)}
            className={`p-1.5 px-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 border ${isWrapMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                : 'text-slate-300 hover:text-white bg-slate-800/80 border-slate-700 hover:bg-slate-700'
              }`}
            title={isWrapMode ? 'Switch to Single-Row Slider' : 'Expand All 12 Menu Tabs'}
          >
            {isWrapMode ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />}
            <span className="text-[10px] hidden md:inline">{isWrapMode ? 'Compact' : 'All Tabs'}</span>
          </button>

        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 w-full bg-slate-50 overflow-y-auto no-scrollbar relative">
        <div className="w-full h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EducationHub;
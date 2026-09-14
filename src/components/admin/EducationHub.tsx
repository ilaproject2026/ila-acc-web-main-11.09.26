import React, { useState, useRef, useEffect } from 'react';
import LibraryAndClassRoom from './LibraryAndClassRoom';
import ServicesAndBatches from './ServicesAndBatches';
import CourseCreator from './CourseCreator';
import AICourseCreator from './AICourseCreator';
import AdminTimeTableHub from './AdminTimeTableHub';
import AutomatedCommTriggersHub from '../education/AutomatedCommTriggersHub';
import HODWorkStudyHub from './HODWorkStudyHub';
import StudentPathStudio from './education/StudentPathStudio';
import {
  BookOpen, Calendar, PlusCircle, Sparkles, Users, UserCheck,
  CheckSquare, Clock, Database, UserPlus, HelpCircle, Award,
  Layers, ArrowRight, Activity, Search, ChevronLeft, ChevronRight,
  LayoutGrid, List, SlidersHorizontal, Radio, MessageSquare, Zap, Briefcase, Megaphone, Compass,
  Link2, Video, Copy, Check, ExternalLink, BrainCircuit, X
} from 'lucide-react';
import { 
  getInquiries, getStaffRegistry, getAttendanceLogs, getGlobalCourses, 
  getGlobalBatches, allotStudentBatchOrPath, setActiveStudent, 
  Inquiry, GlobalBatch 
} from '../../lib/db';
import RegistrationFlow from '../common/RegistrationFlow';
import { HubSocialPromoView } from './common/HubSocialPromoView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';

const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('HOD DB');
  const [isWrapMode, setIsWrapMode] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  
  // Live Inquiries & Allotment States
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>([]);
  const [allotModalStudent, setAllotModalStudent] = useState<Inquiry | null>(null);
  const [allotPath, setAllotPath] = useState<string>('Intelli-Coach AI Trainer™');
  const [allotBatch, setAllotBatch] = useState<string>('Self-Paced AI (No Batch)');
  const [allotClassLink, setAllotClassLink] = useState<string>('');
  const [allotVideoLink, setAllotVideoLink] = useState<string>('');
  const [isAllotAi, setIsAllotAi] = useState<boolean>(true);
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [showDirectEnrollModal, setShowDirectEnrollModal] = useState<boolean>(false);
  const [availableBatches, setAvailableBatches] = useState<string[]>([
    'Morning Cohort (09:00 AM – 11:00 AM IST)',
    'Afternoon Fast-Track (02:00 PM – 04:00 PM IST)',
    'Evening Professional (06:30 PM – 08:30 PM IST)',
    'Weekend Intensive (10:00 AM – 02:00 PM IST)'
  ]);

  const navContainerRef = useRef<HTMLDivElement>(null);

  // Sync inquiries list with reactive DB events
  const reloadInquiries = () => {
    setInquiriesList(getInquiries());
  };

  useEffect(() => {
    reloadInquiries();
    try {
      const dbBatches = getGlobalBatches();
      if (dbBatches && dbBatches.length > 0) {
        const bNames = dbBatches.map(b => `${b.name} (${b.timings?.join(', ') || 'Scheduled'})`);
        setAvailableBatches(prev => [...bNames, ...prev.filter(p => !bNames.some(b => b.includes(p.split(' ')[0])))]);
      }
    } catch {}

    window.addEventListener('ilas-inquiries-changed', reloadInquiries);
    window.addEventListener('ilas-student-allotment-changed', reloadInquiries);
    return () => {
      window.removeEventListener('ilas-inquiries-changed', reloadInquiries);
      window.removeEventListener('ilas-student-allotment-changed', reloadInquiries);
    };
  }, []);

  const navigationItems = [
    { id: 'HOD DB', label: 'HOD DB', icon: Database },
    { id: 'ADMIN LIBRARY', label: 'Admin Library', icon: BookOpen },
    { id: 'STUDENT PATHS', label: 'Student Paths', icon: Compass },
    { id: 'COURSE CREATE', label: 'Course Creator', icon: PlusCircle },
    { id: 'AI COURSE CREATOR', label: 'AI Creator', icon: Sparkles },
    { id: 'COMMUNICATION TRIGGERS', label: 'Comm Triggers', icon: Radio },
    { id: 'SOCIAL MEDIA PROMO', label: 'Social Promo', icon: Megaphone },
    { id: 'INTAKE TRACKING', label: 'Intake Desk', icon: Users },
    { id: 'TIME TABLE', label: 'Time Table', icon: Clock },
    { id: 'STUDENT ROSTER', label: 'Academic Roster', icon: UserCheck },
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
      case 'ADMIN LIBRARY':
      case 'LIBRARY & CLASS ROOM':
        return <LibraryAndClassRoom onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'STUDENT PATH':
      case 'STUDENT PATHS':
        return (
          <div className="p-3 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <StudentPathStudio />
          </div>
        );
      case 'HOD WORK & STUDY':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <HODWorkStudyHub />
          </div>
        );
      case 'COMMUNICATION TRIGGERS':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in">
            <AutomatedCommTriggersHub onNavigateToCourseCatalog={() => setActiveTab('ADMIN LIBRARY')} />
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
      case 'TIME TABLE':
        return <AdminTimeTableHub />;
      case 'SERVICES & BATCHES':
      case 'COURSE CREATE':
      case 'COURSE CREATOR':
        return <LibraryAndClassRoom onNavigateTab={(tab) => {
          setActiveTab(tab);
        }} initialSubView="COURSE_CREATOR" />;
      case 'AI COURSE CREATOR':
        return <AICourseCreator onNavigateTab={(tab) => setActiveTab(tab)} />;
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
                <button onClick={() => setActiveTab('ADMIN LIBRARY')} className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <BookOpen className="w-4 h-4" /> Open Admin Library
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
      case 'STUDENT ROSTER':
        const enrolledStudents = inquiriesList.length > 0 
          ? inquiriesList.filter(i => i.category === 'Education' || i.course?.toLowerCase().includes('german') || i.course?.toLowerCase().includes('ielts'))
          : getInquiries().filter(i => i.category === 'Education');

        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Academic Classroom Access & Passes
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1.5">Academic Student Roster &amp; Batch Allotment</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enrolled students, active digital classroom credentials, batch assignments, and shared VClass/video links.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setShowDirectEnrollModal(true)} 
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Enroll New Student (Direct)
                </button>
                <button 
                  onClick={() => setActiveTab('LIBRARY & CLASS ROOM')} 
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Open Classroom Stream
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">
                  Enrolled Students &amp; Live Allotments ({enrolledStudents.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Note: AI method students do not have batches (Self-Paced 24/7 AI mode). Live human training requires batch assignment.
                </span>
              </div>

              <div className="space-y-3">
                {enrolledStudents.map(inq => {
                  const isAi = (inq.path?.includes('AI') || inq.isAiMethod) ?? false;
                  const vclass = inq.classLink || (isAi ? 'http://localhost:5175/#student-portal' : 'https://meet.google.com/ila-vclass-live');
                  const vidLink = inq.videoLink || `http://localhost:5175/#student-portal?tab=materials`;

                  return (
                    <div key={inq.id} className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                      {/* Student Info */}
                      <div className="space-y-1.5 flex-1 min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{inq.name}</span>
                          <span className="font-mono text-[11px] text-slate-500">({inq.email})</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {inq.paymentStatus || 'Paid'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Course: <strong className="text-brand-700">{inq.course}</strong></span>
                          <span>Phone: <strong>{inq.phone}</strong></span>
                        </div>
                      </div>

                      {/* Path & Batch Details */}
                      <div className="flex flex-wrap items-center gap-2 lg:min-w-[320px]">
                        <div className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 ${
                          isAi ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isAi ? <BrainCircuit className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                          <span>{inq.path || (isAi ? 'Intelli-Coach AI Trainer™' : 'Human Training Live')}</span>
                        </div>

                        <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          isAi ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {isAi ? '⚡ Self-Paced AI (No Batch)' : (inq.batch || 'Pending Batch Allotment')}
                        </div>
                      </div>

                      {/* Links and Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Copy VClass Link */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(vclass);
                            setCopiedBadge(`vclass-${inq.id}`);
                            setTimeout(() => setCopiedBadge(null), 2000);
                          }}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-brand-400 text-slate-700 hover:text-brand-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title={`Copy Live VClass Link: ${vclass}`}
                        >
                          <Link2 className="w-3 h-3 text-indigo-600" />
                          <span>{copiedBadge === `vclass-${inq.id}` ? 'VClass Copied!' : 'Copy VClass'}</span>
                        </button>

                        {/* Copy Video Link */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(vidLink);
                            setCopiedBadge(`vid-${inq.id}`);
                            setTimeout(() => setCopiedBadge(null), 2000);
                          }}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title={`Copy Path Video Link: ${vidLink}`}
                        >
                          <Video className="w-3 h-3 text-emerald-600" />
                          <span>{copiedBadge === `vid-${inq.id}` ? 'Video Copied!' : 'Copy Video'}</span>
                        </button>

                        {/* Allot Batch/Path Modal Trigger */}
                        <button 
                          onClick={() => {
                            const studentAi = (inq.path?.includes('AI') || inq.isAiMethod) ?? false;
                            setAllotModalStudent(inq);
                            setAllotPath(inq.path || 'Intelli-Coach AI Trainer™');
                            setAllotBatch(studentAi ? 'Self-Paced AI (No Batch)' : (inq.batch || availableBatches[0]));
                            setIsAllotAi(studentAi);
                            setAllotClassLink(vclass);
                            setAllotVideoLink(vidLink);
                          }}
                          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>Allot Batch / Path &amp; Links</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {/* Direct Portal Launch */}
                        <button 
                          onClick={() => {
                            setActiveStudent(inq.email);
                            localStorage.setItem('ilas_auth_role', 'student');
                            localStorage.setItem('ilas_user_name', inq.name);
                            window.location.hash = '#student-dashboard';
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                          title="Preview Student Portal for this candidate"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
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
                <button onClick={() => setActiveTab('ADMIN LIBRARY')} className="px-3.5 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-brand-500 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Admin Library →
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
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
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

      {/* ALLOT BATCH / PATH & CLASS LINKS MODAL */}
      {allotModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-slate-200 relative my-6">
            <button 
              onClick={() => setAllotModalStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">Allot Student to Batch &amp; Learning Path</h3>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong className="text-slate-800">{allotModalStudent.name}</strong> ({allotModalStudent.email}) • Course: <strong className="text-brand-700">{allotModalStudent.course}</strong>
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              allotStudentBatchOrPath(allotModalStudent.id, {
                path: allotPath,
                batch: isAllotAi ? 'Self-Paced AI (No Batch)' : allotBatch,
                classLink: allotClassLink,
                videoLink: allotVideoLink,
                isAiMethod: isAllotAi
              });
              setAllotModalStudent(null);
            }} className="mt-5 space-y-4 text-xs">

              {/* Path Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Learning Path / Modality
                </label>
                <select
                  value={allotPath}
                  onChange={(e) => {
                    const newPath = e.target.value;
                    const isAi = newPath.includes('AI');
                    setAllotPath(newPath);
                    setIsAllotAi(isAi);
                    if (isAi) {
                      setAllotBatch('Self-Paced AI (No Batch)');
                      setAllotClassLink('http://localhost:5175/#student-portal');
                    } else {
                      setAllotBatch(availableBatches[0]);
                      setAllotClassLink(`https://meet.google.com/ila-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-800 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="Intelli-Coach AI Trainer™">Intelli-Coach AI Trainer™ (Self-Paced 24/7 AI — No Batches)</option>
                  <option value="Video + AI Training">Video + AI Training (Module Streams + AI Tutor — No Batches)</option>
                  <option value="Human Training Live">Human Training Live (Interactive Cohorts with Certified Instructor)</option>
                </select>
              </div>

              {/* Batch Allotment (Conditioned on AI vs Cohort) */}
              {isAllotAi ? (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-900 leading-relaxed font-medium">
                  <div className="flex items-center gap-2 font-bold mb-0.5">
                    <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    <span>AI Method Active: Batches Not Required</span>
                  </div>
                  The AI method does not have batches. Students learn on-demand 24/7 with the Intelli-Coach AI trainer.
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Allot to Batch (Live Human Training)
                  </label>
                  <select
                    value={allotBatch}
                    onChange={(e) => setAllotBatch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {availableBatches.map((b, idx) => (
                      <option key={idx} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Live Virtual Classroom (VClass) Link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Live Virtual Classroom (VClass) Link
                  </label>
                  <button
                    type="button"
                    onClick={() => setAllotClassLink(`https://meet.google.com/ila-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`)}
                    className="text-[10px] font-bold text-brand-600 hover:underline cursor-pointer"
                  >
                    Auto-Generate Google Meet
                  </button>
                </div>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={allotClassLink}
                    onChange={(e) => setAllotClassLink(e.target.value)}
                    placeholder="https://meet.google.com/xyz-ilas-edu"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">This link is shared directly on the student portal for one-click access.</p>
              </div>

              {/* Path Video Lecture Stream Link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Path Video Lectures Link
                  </label>
                  <button
                    type="button"
                    onClick={() => setAllotVideoLink(`http://localhost:5175/#student-portal?tab=materials`)}
                    className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Auto-Assign Course Video Hub
                  </button>
                </div>
                <div className="relative">
                  <Video className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={allotVideoLink}
                    onChange={(e) => setAllotVideoLink(e.target.value)}
                    placeholder="http://localhost:5175/#student-portal?tab=materials"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAllotModalStudent(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all cursor-pointer"
                >
                  Save &amp; Push to Student Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT REGISTRATION MODAL */}
      {showDirectEnrollModal && (
        <RegistrationFlow
          isOpen={showDirectEnrollModal}
          onClose={() => setShowDirectEnrollModal(false)}
        />
      )}
    </div>
  );
};

export default EducationHub;
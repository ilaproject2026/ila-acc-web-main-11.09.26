import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  BrainCircuit, 
  MessageCircle, 
  PhoneCall, 
  Info, 
  Target, 
  Zap, 
  Briefcase,
  Clock,
  Layers,
  Calendar,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  FileText,
  Download,
  Image as ImageIcon,
  Video as VideoIcon,
  FileUp,
  ExternalLink
} from 'lucide-react';
import { ILAWithYouLogo } from '../components/common/Hero';
import { 
  getGlobalCourses, getGlobalPaths, getGlobalBatches, 
  GlobalCourse, GlobalPath, GlobalBatch, CourseMaterialItem 
} from '../lib/db';

interface CoursePageProps {
  courseTitle?: string;
  category?: string;
}

interface CoursePathTileProps {
  title: string;
  desc: string;
  methods?: string;
  startingDate?: string;
  icon: React.ElementType;
  colorClass: string;
  borderClass: string;
  isSelected?: boolean;
  batches: GlobalBatch[];
  activeCourseBatchId?: string;
  onEnroll: (batchName?: string, slot?: string) => void;
}

const IlasSlideshow = ({ courseTitle: _courseTitle }: { courseTitle: string }) => {
  const slides = [
    {
      q: "How do I apply for my German student/job seeker visa?",
      a: "I'll guide you through compiling your visa application portfolio. We will check your enrollment letter, block your bank account, and verify insurance, ensuring 99.99% document accuracy."
    },
    {
      q: "Where can I find student accommodation & part-time jobs?",
      a: "Our advanced matching engine searches local German student residences and links you with verified part-time/Ausbildung roles to help fully cover your monthly living expenses."
    },
    {
      q: "What is the most suitable course and career roadmap for me?",
      a: "Based on your technical profile and ambitions, I construct a personalized, certification-ready study pathway paired directly with enterprise-level project tasks."
    },
    {
      q: "How do I book tickets, open a blocked bank account, and get local German pickup?",
      a: "I provide interactive, step-by-step checklists for booking cost-effective flights, starting your blocked account, and coordinating your physical pickup when arriving at the airport."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 min-h-[350px] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-xs font-bold uppercase tracking-widest text-slate-500">Ilas Terminal</span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-brand-50 text-brand-900 p-4 rounded-2xl rounded-br-sm text-sm ml-auto max-w-[85%] border border-brand-100 font-semibold animate-in fade-in slide-in-from-right-4 duration-300">
            {slides[currentIndex].q}
          </div>
          <div className="bg-slate-50 text-slate-700 p-4 rounded-2xl rounded-bl-sm text-sm mr-auto max-w-[90%] border border-slate-200 leading-relaxed animate-in fade-in slide-in-from-left-4 duration-300">
            {slides[currentIndex].a}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-brand-600' : 'w-2 bg-slate-200'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Tutorial</span>
      </div>
    </div>
  );
};

const CoursePathTile = ({ 
  title, 
  desc, 
  methods, 
  startingDate, 
  icon: Icon, 
  colorClass, 
  borderClass, 
  isSelected, 
  batches,
  activeCourseBatchId,
  onEnroll 
}: CoursePathTileProps) => {
  const defaultBatchId = batches.find(b => b.id === activeCourseBatchId)?.id || (batches.length > 0 ? batches[0].id : '');
  const [selectedBatchId, setSelectedBatchId] = useState(defaultBatchId);
  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const slots = selectedBatch?.timings || [];
  const [selectedSlot, setSelectedSlot] = useState(slots.length > 0 ? slots[0] : '');

  // Reset slot when batch changes
  useEffect(() => {
    const newSlots = batches.find(b => b.id === selectedBatchId)?.timings || [];
    setSelectedSlot(newSlots.length > 0 ? newSlots[0] : '');
  }, [selectedBatchId, batches]);

  return (
    <div className={`bg-white rounded-3xl p-8 border-2 ${isSelected ? 'border-brand-600 ring-2 ring-brand-200 shadow-xl' : borderClass} shadow-lg hover:shadow-2xl transition-all flex flex-col h-full relative group`}>
      <div className="absolute top-4 right-4 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
        <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-700">
          {isSelected ? 'Selected Path' : 'Ilas With You'}
        </span>
      </div>
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClass}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      
      {methods && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold mb-3 w-fit">
          <Layers className="w-3.5 h-3.5" />
          <span>Method: {methods}</span>
        </div>
      )}

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{desc}</p>
      
      {startingDate && (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>Intake Starting: <strong className="text-slate-800">{startingDate}</strong></span>
        </div>
      )}

      {/* Batch & Slot Selection */}
      {batches.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 flex-grow">
          <div className="mb-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Batch Selection</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none bg-white"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name} {b.remarks ? `(${b.remarks})` : ''}</option>
              ))}
            </select>
          </div>
          
          {slots.length > 0 ? (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Available Time Slots</label>
              <div className="flex flex-wrap gap-1.5">
                {slots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedSlot === slot 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    ⏰ {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : (
             <div className="text-xs text-slate-400 italic">Flexible Timings</div>
          )}
        </div>
      )}

      {batches.length === 0 && (
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex-grow">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Adaptive Pace</div>
          <div className="text-sm font-black text-brand-600 italic">"Speed for Speed, Slow for Slow"</div>
        </div>
      )}
      
      <div className="flex flex-col gap-3 mt-auto">
        <button onClick={() => onEnroll(selectedBatch?.name, selectedSlot)} className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
          Enroll for this Path
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-language-trainer'))} className="w-full py-3 bg-white border-2 border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
          <Play className="w-4 h-4" />
          Watch Course Demo
        </button>
      </div>
    </div>
  );
};

export default function CoursePage({ courseTitle: initialTitle = "German Language A1–C2", category: initialCategory = "Language & Proficiency" }: CoursePageProps) {
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [paths, setPaths] = useState<GlobalPath[]>([]);
  const [batches, setBatches] = useState<GlobalBatch[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string>('');

  useEffect(() => {
    const loadAllData = () => {
      const cList = getGlobalCourses();
      const pList = getGlobalPaths();
      const bList = getGlobalBatches();
      setCourses(cList);
      setPaths(pList);
      setBatches(bList);

      // Resolve initial active course
      if (cList.length > 0) {
        const hash = window.location.hash;
        let matched = cList.find(c => hash.includes(c.id));
        if (!matched && initialTitle) {
          matched = cList.find(c => 
            c.name.toLowerCase().includes(initialTitle.toLowerCase()) || 
            initialTitle.toLowerCase().includes(c.name.toLowerCase())
          );
        }
        setActiveCourseId(matched ? matched.id : cList[0].id);
      }
    };

    loadAllData();
    window.addEventListener('ilas-courses-changed', loadAllData);
    window.addEventListener('ilas-paths-changed', loadAllData);
    window.addEventListener('ilas-batches-changed', loadAllData);
    return () => {
      window.removeEventListener('ilas-courses-changed', loadAllData);
      window.removeEventListener('ilas-paths-changed', loadAllData);
    };
  }, [initialTitle]);

  // Active course resolution
  const activeCourse: GlobalCourse | undefined = courses.find(c => c.id === activeCourseId) || courses[0];

  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<'all' | 'chapters' | 'images' | 'video' | 'promo'>('all');

  // Sub-Navigation Courses (show_in_sub_nav !== false)
  const subNavCourses = courses.filter(c => c.show_in_sub_nav !== false);

  // Job-Related / Non Sub-Nav Certifications
  const jobRelatedCourses = courses.filter(c => c.show_in_sub_nav === false);

  const defaultMaterials: CourseMaterialItem[] = [
    { id: 'm1', title: `${activeCourse?.name || initialTitle} Complete Chapter Notes & Lecture Handouts`, type: 'chapters', fileName: `${activeCourse?.name?.replace(/\s+/g, '_') || 'Course'}_Handout_Vol1.pdf`, size: '4.8 MB', format: 'PDF', description: 'Comprehensive grammar rules, vocabulary banks, and daily practice worksheets.' },
    { id: 'm2', title: 'Official CEFR International Certification Syllabus Guide', type: 'chapters', fileName: 'CEFR_Certification_Roadmap.pdf', size: '2.1 MB', format: 'PDF', description: 'Standardized assessment rubric and examination structure breakdown.' },
    { id: 'm3', title: 'Visual Grammar & Architecture Structural Diagram', type: 'images', fileName: 'Grammar_Syntax_Architecture.png', size: '1.4 MB', format: 'PNG', description: 'High-resolution infographic cheat sheet for quick reference during revision.' },
    { id: 'm4', title: 'Top 500 High-Frequency Practical Vocabulary Flashcards', type: 'images', fileName: 'Vocabulary_Flashcards_Deck.png', size: '3.2 MB', format: 'PNG', description: 'Visual retention cards designed for fast cognitive recall.' },
    { id: 'm5', title: 'Intelli-Coach AI Adaptive Live Simulation (Classroom Preview)', type: 'video', fileName: 'AI_Tutor_Demo_Class.mp4', size: '24.5 MB', format: 'MP4', description: 'Interactive demonstration of real-time pronunciation corrections and grading.' },
    { id: 'm6', title: 'German Job Seeker & Ausbildung Placement Blueprint', type: 'promo', fileName: 'Ausbildung_Placement_Kit.pdf', size: '5.6 MB', format: 'PDF', description: 'Direct career roadmap linking language proficiency with European employers.' },
    { id: 'm7', title: 'Visa Readiness Checklist & Blocked Account Setup Guide', type: 'promo', fileName: 'Visa_Readiness_Toolkit.pdf', size: '1.9 MB', format: 'PDF', description: 'Step-by-step checklist to ensure 99.9% embassy document approval accuracy.' }
  ];

  const currentMaterials = (activeCourse?.materialItems && activeCourse.materialItems.length > 0)
    ? activeCourse.materialItems
    : defaultMaterials;

  const filteredMaterials = selectedMaterialCategory === 'all'
    ? currentMaterials
    : currentMaterials.filter(m => m.type === selectedMaterialCategory);

  // Connected Paths for the active course
  const connectedPaths = paths.filter(p => 
    p.linkedCourseId === activeCourse?.id || 
    p.id === activeCourse?.pathId
  );

  // If no explicitly linked path, show general paths
  const displayPaths = connectedPaths.length > 0 ? connectedPaths : paths;

  // Connected Batches for the active course & path
  const connectedBatches = batches.filter(b => 
    b.linkedCourseId === activeCourse?.id || 
    b.linkedPathId === activeCourse?.pathId || 
    b.id === activeCourse?.batchId
  );

  const displayBatches = connectedBatches.length > 0 ? connectedBatches : batches;

  const openRegistration = (extraInfo?: string, batch?: string, slot?: string) => {
    const courseNameParam = encodeURIComponent(activeCourse?.name || initialTitle);
    const batchParam = batch ? `&batch=${encodeURIComponent(batch)}` : '';
    const slotParam = slot ? `&slot=${encodeURIComponent(slot)}` : '';
    window.location.hash = `#applications?course=${courseNameParam}&info=${encodeURIComponent(extraInfo || '')}${batchParam}${slotParam}`;
  };

  const handleSelectCourse = (course: GlobalCourse) => {
    setActiveCourseId(course.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen pb-20">
      
      {/* 1. Hero Section with Top Title & Course Branding */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[440px] lg:min-h-[500px] shadow-2xl flex flex-col justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <div className="max-w-4xl">
            {/* Top Title Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 backdrop-blur-md border border-brand-400/30 text-brand-300">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-xs font-black tracking-wider uppercase">
                  {activeCourse?.top_title || activeCourse?.category || initialCategory}
                </span>
              </span>
              {activeCourse?.duration && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-accent-400" />
                  {activeCourse.duration}
                </span>
              )}
              {activeCourse?.chapter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                  {activeCourse.chapter} Chapters
                </span>
              )}
            </div>
            
            {/* Course Title & Subtitle */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight text-white leading-tight">
              {activeCourse?.name || initialTitle}
            </h1>

            {activeCourse?.subtitle && (
              <p className="text-lg md:text-xl text-brand-200 font-semibold mb-4">
                {activeCourse.subtitle}
              </p>
            )}
            
            <p className="text-sm md:text-base text-slate-300 max-w-3xl mb-8 leading-relaxed font-normal">
              Experience our revolutionary 24/7 Intelli-Coach AI Trainer™ system combined with expert curriculum frameworks. Designed specifically for {activeCourse?.name || initialTitle} mastery.
            </p>

            {/* Course CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a href="#path-selection" className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2">
                <span>View Education Paths</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button onClick={() => openRegistration('Direct Fast-Track')} className="px-6 py-3 bg-accent-400 hover:bg-accent-500 text-slate-950 rounded-xl font-extrabold text-sm transition-all shadow-md cursor-pointer">
                Enroll Now ({activeCourse?.fee || '$199'})
              </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-language-trainer'))} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer">
                <Play className="w-4 h-4" />
                <span>Course Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sub-Navigation Bar (Courses with show_in_sub_nav = true) */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 shadow-xs mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-2 shrink-0 hidden md:inline">
                Sub Nav:
              </span>
              {subNavCourses.map((c) => {
                const isActive = c.id === activeCourse?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCourse(c)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-brand-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.top_title && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full hidden sm:inline ${
                        isActive ? 'bg-brand-700 text-brand-100' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {c.top_title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick jump to Job Certifications */}
            {jobRelatedCourses.length > 0 && (
              <a 
                href="#job-related-certifications"
                className="shrink-0 text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Job Certifications</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {jobRelatedCourses.length}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section 1: Connected Path Selection (Path → Education Path) */}
        <section id="path-selection" className="scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-100">
              <Layers className="w-3.5 h-3.5" />
              <span>Education Path Connection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
              Select Your Education Path for {activeCourse?.name}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Choose the verified learning path configured for this program. Each path is mapped to specific coaching methods and personalized milestones.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPaths.map((p, idx) => {
              const isConfigured = activeCourse?.pathId === p.id;
              const icons = [BrainCircuit, Play, MessageCircle, Layers];
              const IconComp = icons[idx % icons.length];
              const colorClasses = [
                'bg-brand-600',
                'bg-indigo-600',
                'bg-emerald-600',
                'bg-amber-600'
              ];
              const borderClasses = [
                'border-brand-200',
                'border-indigo-200',
                'border-emerald-200',
                'border-amber-200'
              ];

              return (
                <CoursePathTile 
                  key={p.id}
                  title={p.name}
                  desc={p.remarks || "Comprehensive structured pathway designed for thorough curriculum mastery."}
                  methods={p.methods}
                  startingDate={p.starting}
                  icon={IconComp}
                  colorClass={colorClasses[idx % colorClasses.length]}
                  borderClass={borderClasses[idx % borderClasses.length]}
                  isSelected={isConfigured}
                  batches={batches.filter(b => b.linkedPathId === p.id)}
                  activeCourseBatchId={activeCourse?.batchId}
                  onEnroll={(batchName, slot) => openRegistration(`Path: ${p.name}`, batchName, slot)}
                />
              );
            })}
          </div>
        </section>


        {/* Section 3: Dynamic Syllabus & Module Breakdowns and Course Specifications */}
        <section id="course-details" className="space-y-8">
          
          {/* Syllabus & Module Breakdowns Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-sm">
            <h4 className="text-sm font-black uppercase tracking-wider text-indigo-700 mb-5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> 
              <span>SYLLABUS & MODULE BREAKDOWNS</span>
            </h4>
            <div className="whitespace-pre-line text-slate-700 text-sm leading-relaxed p-5 bg-slate-50 rounded-2xl border border-slate-100 font-mono">
              {activeCourse?.courseStructure || `
                Module 1: Foundational Architecture & Core Terminologies
                Module 2: Applied Case Studies & Practical Problem-Solving
                Module 3: Advanced Real-World Simulation Labs
                Module 4: Official European Certification & Exam Prep`
              }
            </div>
          </div>

          {/* Course Specifications Card */}
          <div id={`${activeCourse?.id || 'course'}-specifications`} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-black uppercase tracking-wider text-brand-600 mb-5 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> 
              <span>COURSE SPECIFICATIONS</span>
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-100 hover:border-brand-300 transition-all cursor-pointer group">
                <div className="font-black text-slate-900 group-hover:text-brand-700 text-base mb-1.5 flex items-center justify-between">
                  <span>Chapters</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeCourse?.chapter ? `${activeCourse.chapter} Chapters included` : '12 Chapters included'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-100 hover:border-brand-300 transition-all cursor-pointer group">
                <div className="font-black text-slate-900 group-hover:text-brand-700 text-base mb-1.5 flex items-center justify-between">
                  <span>Duration</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeCourse?.duration || '12 Weeks'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-100 hover:border-brand-300 transition-all cursor-pointer group">
                <div className="font-black text-slate-900 group-hover:text-brand-700 text-base mb-1.5 flex items-center justify-between">
                  <span>Course Fee</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold text-brand-700">
                  {activeCourse?.fee || '$199'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-100 hover:border-brand-300 transition-all cursor-pointer group">
                <div className="font-black text-slate-900 group-hover:text-brand-700 text-base mb-1.5 flex items-center justify-between">
                  <span>Staff Assigned</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeCourse?.staff || 'Nadeem - ID 091'}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Section 4: Connected Course Assets & Study Materials */}
        <section id="course-materials" className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-200 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-100">
                <FileText className="w-3.5 h-3.5" />
                <span>Course Assets & Downloads</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Study Materials & Verified Digital Assets
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Connected to <strong className="text-slate-800">{activeCourse?.name}</strong>. Free to access and download with your course enrollment.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentMaterials.length} Resources Available
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedMaterialCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMaterialCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Resources ({currentMaterials.length})
            </button>
            <button
              onClick={() => setSelectedMaterialCategory('chapters')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedMaterialCategory === 'chapters'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Chapter Notes ({currentMaterials.filter(m => m.type === 'chapters').length})</span>
            </button>
            <button
              onClick={() => setSelectedMaterialCategory('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedMaterialCategory === 'video'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Video Demonstrations ({currentMaterials.filter(m => m.type === 'video').length})</span>
            </button>
            <button
              onClick={() => setSelectedMaterialCategory('images')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedMaterialCategory === 'images'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Infographics & Charts ({currentMaterials.filter(m => m.type === 'images').length})</span>
            </button>
            <button
              onClick={() => setSelectedMaterialCategory('promo')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedMaterialCategory === 'promo'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Career & Visa Toolkits ({currentMaterials.filter(m => m.type === 'promo').length})</span>
            </button>
          </div>

          {/* Material Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      item.type === 'chapters' ? 'bg-indigo-100 text-indigo-800' :
                      item.type === 'video' ? 'bg-amber-100 text-amber-800' :
                      item.type === 'images' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-brand-100 text-brand-800'
                    }`}>
                      {item.format || item.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {item.size || '3.5 MB'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm mb-2 group-hover:text-brand-700 leading-snug">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/60 mt-auto flex gap-2">
                  {item.type === 'video' ? (
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-language-trainer'))}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Demo Preview</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`📥 Download Started:\n"${item.title}"\nFile: ${item.fileName || 'handout.pdf'} (${item.size || '3.5 MB'})`)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resource</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Job-Related Certifications (Courses where show_in_sub_nav = false) */}
        {jobRelatedCourses.length > 0 && (
          <section id="job-related-certifications" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-200/80 px-3 py-1 rounded-full border border-slate-300">
                    EU Direct Placement Sprints
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Dual-Study &amp; Job Ready
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
                  Job-Related Certifications &amp; <span className="text-purple-700">Fast-Track Programs</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1.5 font-medium">
                  High-demand career courses and specialized vocational tracks for direct European employability and industry mastery.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {jobRelatedCourses.map((jc, idx) => {
                const paletteStyles = [
                  {
                    bg: 'bg-gradient-to-br from-indigo-100/90 via-white to-blue-50/80 text-slate-900',
                    border: 'border-indigo-200/90 hover:border-indigo-500/80',
                    badge: 'bg-indigo-700 text-white font-black',
                    titleColor: 'text-slate-950',
                    titleHover: 'group-hover:text-indigo-800',
                    featureBg: 'bg-white/95 border-indigo-200 text-indigo-950',
                    matrixBg: 'bg-white/90 border-indigo-100',
                    btnSecondary: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200 font-black',
                    btnPrimary: 'bg-slate-950 hover:bg-indigo-950 text-white font-black shadow-md'
                  },
                  {
                    bg: 'bg-gradient-to-br from-emerald-100/90 via-white to-teal-50/80 text-slate-900',
                    border: 'border-emerald-200/90 hover:border-emerald-500/80',
                    badge: 'bg-emerald-700 text-white font-black',
                    titleColor: 'text-slate-950',
                    titleHover: 'group-hover:text-emerald-800',
                    featureBg: 'bg-white/95 border-emerald-200 text-emerald-950',
                    matrixBg: 'bg-white/90 border-emerald-100',
                    btnSecondary: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200 font-black',
                    btnPrimary: 'bg-slate-950 hover:bg-emerald-950 text-white font-black shadow-md'
                  },
                  {
                    bg: 'bg-gradient-to-br from-amber-100/90 via-white to-yellow-50/80 text-slate-900',
                    border: 'border-amber-200/90 hover:border-amber-500/80',
                    badge: 'bg-amber-500 text-slate-950 font-black',
                    titleColor: 'text-slate-950',
                    titleHover: 'group-hover:text-amber-900',
                    featureBg: 'bg-white/95 border-amber-200 text-amber-950',
                    matrixBg: 'bg-white/90 border-amber-100',
                    btnSecondary: 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200 font-black',
                    btnPrimary: 'bg-slate-950 hover:bg-amber-950 text-white font-black shadow-md'
                  },
                  {
                    bg: 'bg-gradient-to-br from-purple-100/90 via-white to-violet-50/80 text-slate-900',
                    border: 'border-purple-200/90 hover:border-purple-500/80',
                    badge: 'bg-purple-700 text-white font-black',
                    titleColor: 'text-slate-950',
                    titleHover: 'group-hover:text-purple-800',
                    featureBg: 'bg-white/95 border-purple-200 text-purple-950',
                    matrixBg: 'bg-white/90 border-purple-100',
                    btnSecondary: 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200 font-black',
                    btnPrimary: 'bg-slate-950 hover:bg-purple-950 text-white font-black shadow-md'
                  },
                  {
                    bg: 'bg-gradient-to-br from-rose-100/90 via-white to-pink-50/80 text-slate-900',
                    border: 'border-rose-200/90 hover:border-rose-500/80',
                    badge: 'bg-rose-600 text-white font-black',
                    titleColor: 'text-slate-950',
                    titleHover: 'group-hover:text-rose-800',
                    featureBg: 'bg-white/95 border-rose-200 text-rose-950',
                    matrixBg: 'bg-white/90 border-rose-100',
                    btnSecondary: 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200 font-black',
                    btnPrimary: 'bg-slate-950 hover:bg-rose-950 text-white font-black shadow-md'
                  },
                  {
                    bg: 'bg-gradient-to-br from-sky-100/90 via-white to-cyan-50/80 text-slate-900',
                    border: 'border-sky-200/90 hover:border-sky-500/80',
                    badge: 'bg-sky-700 text-white font-black',
                    titleColor: 'text-slate-950',
                    titleHover: 'group-hover:text-sky-800',
                    featureBg: 'bg-white/95 border-sky-200 text-sky-950',
                    matrixBg: 'bg-white/90 border-sky-100',
                    btnSecondary: 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200 font-black',
                    btnPrimary: 'bg-slate-950 hover:bg-sky-950 text-white font-black shadow-md'
                  }
                ];
                const theme = paletteStyles[idx % paletteStyles.length];

                return (
                  <div 
                    key={jc.id} 
                    className={`${theme.bg} rounded-3xl p-6 sm:p-7 border ${theme.border} shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                  >
                    {/* Decorative Watermark / Glow */}
                    <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/60 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none font-black text-4xl tracking-tighter text-slate-900">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${theme.badge} px-3 py-1 rounded-lg shadow-2xs`}>
                          {jc.top_title || 'Career Sprint'}
                        </span>
                        <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                          {jc.fee}
                        </span>
                      </div>
                      
                      <h4 className={`text-xl font-black ${theme.titleColor} ${theme.titleHover} transition-colors mb-2.5 tracking-tight leading-snug`}>
                        {jc.name}
                      </h4>

                      {jc.subtitle && (
                        <p className="text-xs sm:text-[13px] text-slate-700 mb-4 line-clamp-2 leading-relaxed font-medium">
                          {jc.subtitle}
                        </p>
                      )}

                      <div className={`flex items-center gap-2 mb-4 text-[11px] font-bold ${theme.featureBg} py-2 px-3 rounded-xl border shadow-2xs`}>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Direct EU Enterprise Integration</span>
                      </div>

                      <div className={`grid grid-cols-2 gap-2 text-center text-xs p-3 ${theme.matrixBg} rounded-2xl border mb-4 shadow-2xs backdrop-blur-xs`}>
                        <div className="border-r border-slate-200/80 pr-1">
                          <span className="text-slate-500 text-[9px] font-black uppercase tracking-wider block">Duration</span>
                          <strong className="text-xs font-black text-slate-950 mt-0.5 block">{jc.duration}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[9px] font-black uppercase tracking-wider block">Curriculum</span>
                          <strong className="text-xs font-black text-slate-950 mt-0.5 block">{jc.chapter} Modules</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3.5 border-t border-slate-200/80 relative z-10 mt-2">
                      <button 
                        onClick={() => handleSelectCourse(jc)}
                        className={`flex-1 py-2.5 ${theme.btnSecondary} font-black text-xs rounded-xl transition-all cursor-pointer border shadow-2xs`}
                      >
                        View Syllabus
                      </button>
                      <button 
                        onClick={() => {
                          setActiveCourseId(jc.id);
                          openRegistration(`Job Program: ${jc.name}`);
                        }}
                        className={`flex-1 py-2.5 ${theme.btnPrimary} font-black text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1`}
                      >
                        <span>Enroll Now</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 5: Advantages & Work While You Study Integration */}
        <section id="methods" className="bg-slate-900 rounded-3xl p-8 lg:p-14 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black mb-8 text-center">3 Advanced Learning Methods</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-brand-500/30">
                <BrainCircuit className="w-8 h-8 text-brand-400 mb-4" />
                <h4 className="text-lg font-bold mb-2 text-brand-400">Adaptive Pace</h4>
                <p className="text-xs font-bold text-accent-400 mb-2 italic">"Speed for Speed, Slow for Slow"</p>
                <p className="text-slate-300 leading-relaxed text-xs">
                  The curriculum automatically adapts to your personal learning velocity for optimal retention.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-brand-500/30">
                <Target className="w-8 h-8 text-emerald-400 mb-4" />
                <h4 className="text-lg font-bold mb-2 text-emerald-400">Expert Framework</h4>
                <p className="text-xs font-bold text-accent-400 mb-2 italic">"Trained Intelli-Coach Framework"</p>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Industry-grade modules blended with intelligent digital tools for recognized international certification.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-brand-500/30">
                <Zap className="w-8 h-8 text-amber-400 mb-4" />
                <h4 className="text-lg font-bold mb-2 text-amber-400">24/7 Continuous Support</h4>
                <p className="text-xs font-bold text-accent-400 mb-2 italic">"Mentoring with Ilas With You"</p>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Instant query resolution and unlimited conversation practice with your companion.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-amber-500/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Briefcase className="w-10 h-10 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-1 text-amber-400">Work While You Study - Register for Jobs</h4>
                  <p className="text-xs font-semibold text-white mb-2 italic">"Start earning stipends while you complete your certification"</p>
                  <p className="text-slate-300 leading-relaxed text-xs max-w-2xl">
                    Connect your study program to part-time European job pathways and earn stipends from day one.
                  </p>
                </div>
              </div>
              <a href="#work-while-you-study-page" className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md whitespace-nowrap">
                Register for Jobs
              </a>
            </div>
          </div>
        </section>

        {/* Section 6: Ilas With You Companion Integration */}
        <section id="ilas-with-you" className="mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-brand-50 rounded-3xl p-8 lg:p-12 border border-indigo-100 shadow-xl flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="mb-4 inline-block">
                <ILAWithYouLogo light={false} size="lg" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                Personalized Support for {activeCourse?.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Ilas With You tracks your syllabus completion, provides instant mock evaluations, and connects your learning directly to international career placements.
              </p>
              <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200 flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-indigo-600">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dedicated Live Consultant Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Included free with your program enrollment to help with visa and job mapping.</p>
                </div>
              </div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-portal-login'))}
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <span>Register / Access Lifetime Companion Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <IlasSlideshow courseTitle={activeCourse?.name || initialTitle} />
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Star, BrainCircuit, Play, ArrowRight, Zap, MessageCircle, 
  Crown, Briefcase, GraduationCap, Gift, Code, 
  Layers, BookOpen, Search, CheckCircle2, LayoutGrid, List,
  Filter, Sparkles, Clock, Award, ChevronRight, ChevronLeft, Eye, ShieldCheck,
  Building2, Users, FileText, ExternalLink, Bot, Video, Flame,
  Globe, Headphones, UserCheck, MapPin, Laptop, MessageSquare, Compass,
  Stethoscope, Languages, Target, Mic, Volume2, Send, HelpCircle, Radio
} from 'lucide-react';
import { 
  getGlobalCourses, getGlobalPaths, getGlobalCategories,
  GlobalCourse, GlobalPath, GlobalCategory 
} from '../lib/db';

const careerBenefitSlides = [
  {
    id: "work-while-study",
    icon: Briefcase,
    title: "Work While You Study",
    subtitle: "Junior Consultant & Enterprise Stipend Track",
    badge: "Verified Monthly Stipend",
    desc: "Gain real-world European work experience as an active Junior Consultant with a verified monthly stipend while studying German or Tech certifications.",
    highlights: ["€500–€1,200 Monthly Stipend", "Live Corporate Projects", "Flexible Shift Alignment"],
    link: "#learn-while-earn",
    cta: "Explore Work While Study",
    badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/30"
  },
  {
    id: "reward-plan",
    icon: Gift,
    title: "Reward Plans",
    subtitle: "Performance Cashback & Peer Referral Credits",
    badge: "Module Cashback Rewards",
    desc: "Earn cash rewards upon passing every official CEFR or tech assessment, with additional milestone referral bonuses credited directly.",
    highlights: ["100% Exam Fee Cashback", "Peer Milestone Credits", "Certification Subsidies"],
    link: "#rewards",
    cta: "Explore Reward Plans",
    badgeBg: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30"
  },
  {
    id: "job-hunting",
    icon: Search,
    title: "Job Hunting",
    subtitle: "Direct Recruitment Pipeline to 500+ German Employers",
    badge: "Direct EU Placement",
    desc: "Direct employer interviews, German DIN-standard CV formatting, and dedicated visa filing sponsorship for healthcare, engineering, and IT graduates.",
    highlights: ["500+ Partner Enterprises", "DIN-Standard Portfolio", "Visa & Relocation Support"],
    link: "#jobs-page",
    cta: "Access Career Network",
    badgeBg: "bg-blue-400/20 text-blue-300 border-blue-400/30"
  },
  {
    id: "study-abroad",
    icon: GraduationCap,
    title: "Study in Abroad",
    subtitle: "€0 Tuition Fees Across Public German Universities",
    badge: "100% Free Tuition",
    desc: "Step-by-step admission advisory, APS document verification, blocked account setup, and university placement across top tuition-free German public universities.",
    highlights: ["€0 Tuition German Universities", "APS Certification Guidance", "Blocked Account Advisory"],
    link: "#study-abroad",
    cta: "Explore Study in Abroad",
    badgeBg: "bg-purple-400/20 text-purple-300 border-purple-400/30"
  }
];

const jobMagazineThemes = [
  {
    // Indigo / Cobalt Breeze
    bg: 'bg-gradient-to-br from-indigo-100/90 via-white to-blue-50/80 text-slate-900',
    border: 'border-indigo-200/90 hover:border-indigo-500/80',
    cardShadow: 'hover:shadow-[0_12px_32px_rgba(99,102,241,0.18)]',
    categoryBadge: 'bg-indigo-700 text-white font-black',
    subCategoryTag: 'text-indigo-950 bg-white/95 border-indigo-200 shadow-2xs',
    sprintBadge: 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-black',
    titleColor: 'text-slate-950',
    titleHover: 'group-hover:text-indigo-800',
    subtextColor: 'text-slate-700',
    featureBg: 'bg-white/95 border-indigo-200 text-indigo-950',
    matrixBg: 'bg-white/90 border-indigo-100',
    matrixLabel: 'text-slate-500',
    matrixVal: 'text-slate-950',
    tuitionVal: 'text-emerald-700',
    facultyText: 'text-indigo-950',
    facultyIcon: 'text-indigo-600',
    demoBtn: 'bg-indigo-50 hover:bg-indigo-100/90 text-indigo-900 border-indigo-200',
    demoIcon: 'text-indigo-700',
    specsBtn: 'bg-slate-950 hover:bg-indigo-950 text-white',
    watermarkText: 'INDIGO'
  },
  {
    // Emerald / Mint Meadow
    bg: 'bg-gradient-to-br from-emerald-100/90 via-white to-teal-50/80 text-slate-900',
    border: 'border-emerald-200/90 hover:border-emerald-500/80',
    cardShadow: 'hover:shadow-[0_12px_32px_rgba(16,185,129,0.18)]',
    categoryBadge: 'bg-emerald-700 text-white font-black',
    subCategoryTag: 'text-emerald-950 bg-white/95 border-emerald-200 shadow-2xs',
    sprintBadge: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black',
    titleColor: 'text-slate-950',
    titleHover: 'group-hover:text-emerald-800',
    subtextColor: 'text-slate-700',
    featureBg: 'bg-white/95 border-emerald-200 text-emerald-950',
    matrixBg: 'bg-white/90 border-emerald-100',
    matrixLabel: 'text-slate-500',
    matrixVal: 'text-slate-950',
    tuitionVal: 'text-emerald-700',
    facultyText: 'text-emerald-950',
    facultyIcon: 'text-emerald-600',
    demoBtn: 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border-emerald-200',
    demoIcon: 'text-emerald-700',
    specsBtn: 'bg-slate-950 hover:bg-emerald-950 text-white',
    watermarkText: 'EMERALD'
  },
  {
    // Amber / Honey Gold
    bg: 'bg-gradient-to-br from-amber-100/90 via-white to-yellow-50/80 text-slate-900',
    border: 'border-amber-200/90 hover:border-amber-500/80',
    cardShadow: 'hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)]',
    categoryBadge: 'bg-amber-500 text-slate-950 font-black',
    subCategoryTag: 'text-amber-950 bg-white/95 border-amber-200 shadow-2xs',
    sprintBadge: 'bg-amber-100 text-amber-950 border border-amber-300 font-black',
    titleColor: 'text-slate-950',
    titleHover: 'group-hover:text-amber-900',
    subtextColor: 'text-slate-700',
    featureBg: 'bg-white/95 border-amber-200 text-amber-950',
    matrixBg: 'bg-white/90 border-amber-100',
    matrixLabel: 'text-slate-500',
    matrixVal: 'text-slate-950',
    tuitionVal: 'text-emerald-700',
    facultyText: 'text-amber-950',
    facultyIcon: 'text-amber-600',
    demoBtn: 'bg-amber-50 hover:bg-amber-100/90 text-amber-950 border-amber-200',
    demoIcon: 'text-amber-700',
    specsBtn: 'bg-slate-950 hover:bg-amber-950 text-white',
    watermarkText: 'AMBER'
  },
  {
    // Purple / Royal Lavender
    bg: 'bg-gradient-to-br from-purple-100/90 via-white to-violet-50/80 text-slate-900',
    border: 'border-purple-200/90 hover:border-purple-500/80',
    cardShadow: 'hover:shadow-[0_12px_32px_rgba(168,85,247,0.18)]',
    categoryBadge: 'bg-purple-700 text-white font-black',
    subCategoryTag: 'text-purple-950 bg-white/95 border-purple-200 shadow-2xs',
    sprintBadge: 'bg-purple-100 text-purple-900 border border-purple-300 font-black',
    titleColor: 'text-slate-950',
    titleHover: 'group-hover:text-purple-800',
    subtextColor: 'text-slate-700',
    featureBg: 'bg-white/95 border-purple-200 text-purple-950',
    matrixBg: 'bg-white/90 border-purple-100',
    matrixLabel: 'text-slate-500',
    matrixVal: 'text-slate-950',
    tuitionVal: 'text-emerald-700',
    facultyText: 'text-purple-950',
    facultyIcon: 'text-purple-600',
    demoBtn: 'bg-purple-50 hover:bg-purple-100/90 text-purple-900 border-purple-200',
    demoIcon: 'text-purple-700',
    specsBtn: 'bg-slate-950 hover:bg-purple-950 text-white',
    watermarkText: 'PURPLE'
  },
  {
    // Rose / Coral Bloom
    bg: 'bg-gradient-to-br from-rose-100/90 via-white to-pink-50/80 text-slate-900',
    border: 'border-rose-200/90 hover:border-rose-500/80',
    cardShadow: 'hover:shadow-[0_12px_32px_rgba(244,63,94,0.18)]',
    categoryBadge: 'bg-rose-600 text-white font-black',
    subCategoryTag: 'text-rose-950 bg-white/95 border-rose-200 shadow-2xs',
    sprintBadge: 'bg-rose-100 text-rose-900 border border-rose-300 font-black',
    titleColor: 'text-slate-950',
    titleHover: 'group-hover:text-rose-800',
    subtextColor: 'text-slate-700',
    featureBg: 'bg-white/95 border-rose-200 text-rose-950',
    matrixBg: 'bg-white/90 border-rose-100',
    matrixLabel: 'text-slate-500',
    matrixVal: 'text-slate-950',
    tuitionVal: 'text-emerald-700',
    facultyText: 'text-rose-950',
    facultyIcon: 'text-rose-600',
    demoBtn: 'bg-rose-50 hover:bg-rose-100/90 text-rose-900 border-rose-200',
    demoIcon: 'text-rose-700',
    specsBtn: 'bg-slate-950 hover:bg-rose-950 text-white',
    watermarkText: 'ROSE'
  },
  {
    // Sky / Azure Coast
    bg: 'bg-gradient-to-br from-sky-100/90 via-white to-cyan-50/80 text-slate-900',
    border: 'border-sky-200/90 hover:border-sky-500/80',
    cardShadow: 'hover:shadow-[0_12px_32px_rgba(6,182,212,0.18)]',
    categoryBadge: 'bg-sky-700 text-white font-black',
    subCategoryTag: 'text-sky-950 bg-white/95 border-sky-200 shadow-2xs',
    sprintBadge: 'bg-sky-100 text-sky-900 border border-sky-300 font-black',
    titleColor: 'text-slate-950',
    titleHover: 'group-hover:text-sky-800',
    subtextColor: 'text-slate-700',
    featureBg: 'bg-white/95 border-sky-200 text-sky-950',
    matrixBg: 'bg-white/90 border-sky-100',
    matrixLabel: 'text-slate-500',
    matrixVal: 'text-slate-950',
    tuitionVal: 'text-emerald-700',
    facultyText: 'text-sky-950',
    facultyIcon: 'text-sky-600',
    demoBtn: 'bg-sky-50 hover:bg-sky-100/90 text-sky-900 border-sky-200',
    demoIcon: 'text-sky-700',
    specsBtn: 'bg-slate-950 hover:bg-sky-950 text-white',
    watermarkText: 'SKY'
  }
];

const promoTeachingMethods = [
  {
    id: 'intelli-coach',
    name: 'IntelliCoach AI™',
    tagline: 'Autonomous 24/7 AI Coach',
    desc: 'Real-time accent, German translation & interactive speech tuning',
    icon: BrainCircuit,
    badgeBg: 'bg-gradient-to-tr from-indigo-600 to-violet-500',
    glowColor: 'bg-indigo-500/30',
    hoverText: 'group-hover:text-indigo-300',
    accentText: 'text-indigo-400',
    targetSectionId: 'method-intellicoach'
  },
  {
    id: 'video-ai',
    name: 'Video + AI™',
    tagline: 'Interactive Q&A Stream',
    desc: 'Smart answering engine & synchronized video breakdown',
    icon: Video,
    badgeBg: 'bg-gradient-to-tr from-rose-500 to-pink-500',
    glowColor: 'bg-rose-500/30',
    hoverText: 'group-hover:text-rose-300',
    accentText: 'text-rose-400',
    targetSectionId: 'method-video-ai'
  },
  {
    id: 'slide-ai',
    name: 'Slide + AI™',
    tagline: 'Visual Knowledge Decks',
    desc: 'Adaptive multimodal notes, formula maps & flashcards',
    icon: Layers,
    badgeBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400',
    glowColor: 'bg-amber-500/30',
    hoverText: 'group-hover:text-amber-300',
    accentText: 'text-amber-400',
    targetSectionId: 'method-slide-ai'
  },
  {
    id: 'human-tutors',
    name: 'Human Tutors',
    tagline: 'Certified Native Faculty',
    desc: '1-to-1 & group mastery with Goethe/Telc examiners',
    icon: Users,
    badgeBg: 'bg-gradient-to-tr from-emerald-500 to-teal-400',
    glowColor: 'bg-emerald-500/30',
    hoverText: 'group-hover:text-emerald-300',
    accentText: 'text-emerald-400',
    targetSectionId: 'method-human-tutors'
  },
  {
    id: 'camp-classes',
    name: 'Camp Classes',
    tagline: 'Immersive Mega-Camps',
    desc: 'Intensive physical sprints, group labs & rapid certification bootcamps',
    icon: Flame,
    badgeBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
    glowColor: 'bg-cyan-500/30',
    hoverText: 'group-hover:text-cyan-300',
    accentText: 'text-cyan-400',
    targetSectionId: 'method-camps-onsite'
  },
  {
    id: 'onsite-classes',
    name: 'On-Site Spot Classes',
    tagline: 'Institutional & Campus Delivery',
    desc: 'Direct execution at universities, colleges & corporate campuses',
    icon: Building2,
    badgeBg: 'bg-gradient-to-tr from-purple-600 to-fuchsia-500',
    glowColor: 'bg-purple-500/30',
    hoverText: 'group-hover:text-purple-300',
    accentText: 'text-purple-400',
    targetSectionId: 'method-camps-onsite'
  }
];

type SubNavBlockId = 'teaching-paths' | 'german' | 'ielts' | 'software-tech' | 'medical' | 'job-related';

interface SubNavBlockItem {
  id: SubNavBlockId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accentBorder: string;
  accentHoverBorder: string;
  accentText: string;
  accentGlow: string;
  iconBg: string;
  activeBg: string;
  activeRing: string;
}

const SUB_NAV_BLOCKS: SubNavBlockItem[] = [
  {
    id: 'teaching-paths',
    title: 'Teaching Paths',
    subtitle: '6 Learning Methodologies',
    icon: BrainCircuit,
    accentBorder: 'border-indigo-200/90',
    accentHoverBorder: 'hover:border-indigo-400',
    accentText: 'text-indigo-600',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(99,102,241,0.20)]',
    iconBg: 'bg-indigo-50 text-indigo-600',
    activeBg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900',
    activeRing: 'ring-indigo-500/70'
  },
  {
    id: 'german',
    title: 'German Language',
    subtitle: 'A1–C2 & Clinical German',
    icon: Languages,
    accentBorder: 'border-blue-200/90',
    accentHoverBorder: 'hover:border-blue-500',
    accentText: 'text-blue-600',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(37,99,235,0.22)]',
    iconBg: 'bg-blue-50 text-blue-600',
    activeBg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
    activeRing: 'ring-blue-500/70'
  },
  {
    id: 'ielts',
    title: 'IELTS / English',
    subtitle: 'Band 8.0+ Exam Prep',
    icon: Award,
    accentBorder: 'border-amber-200/90',
    accentHoverBorder: 'hover:border-amber-500',
    accentText: 'text-amber-600',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.20)]',
    iconBg: 'bg-amber-50 text-amber-600',
    activeBg: 'bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900',
    activeRing: 'ring-amber-500/70'
  },
  {
    id: 'software-tech',
    title: 'Software Tests & Tech',
    subtitle: 'SAP, Odoo & Cloud Systems',
    icon: Code,
    accentBorder: 'border-cyan-200/90',
    accentHoverBorder: 'hover:border-cyan-500',
    accentText: 'text-cyan-600',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.20)]',
    iconBg: 'bg-cyan-50 text-cyan-600',
    activeBg: 'bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900',
    activeRing: 'ring-cyan-500/70'
  },
  {
    id: 'medical',
    title: 'Medical & Specialized',
    subtitle: 'DemTest, FSP & Clinical',
    icon: Stethoscope,
    accentBorder: 'border-emerald-200/90',
    accentHoverBorder: 'hover:border-emerald-500',
    accentText: 'text-emerald-600',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.20)]',
    iconBg: 'bg-emerald-50 text-emerald-600',
    activeBg: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900',
    activeRing: 'ring-emerald-500/70'
  },
  {
    id: 'job-related',
    title: 'Job-Related Courses',
    subtitle: 'Career Placements & Sprints',
    icon: Briefcase,
    accentBorder: 'border-purple-200/90',
    accentHoverBorder: 'hover:border-purple-500',
    accentText: 'text-purple-600',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.20)]',
    iconBg: 'bg-purple-50 text-purple-600',
    activeBg: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900',
    activeRing: 'ring-purple-500/70'
  }
];

interface SpecializationTrack {
  id: string;
  label: string;
  badge: string;
  icon: React.ElementType;
  desc: string;
  highlights: string[];
}

export default function EducationPage() {
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [paths, setPaths] = useState<GlobalPath[]>([]);
  const [categories, setCategories] = useState<GlobalCategory[]>([]);
  
  // Single-Frame Active Tab State
  const [activeTab, setActiveTab] = useState<SubNavBlockId>('german');

  // Target Specialization Track State
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('general');

  // Career Benefits Interactive Slider State
  const [careerSlideIdx, setCareerSlideIdx] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Filtering, View & Pagination States for Catalog / Job-Related Section
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'line'>('grid');
  const [jobCoursesPage, setJobCoursesPage] = useState(1);

  // Carousel ref for top promo banner & invisible continuous edge-hover scroll
  const methodsScrollRef = useRef<HTMLDivElement>(null);
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(0);

  const startEdgeScroll = (speed: number) => {
    scrollSpeedRef.current = speed;
    if (!scrollAnimRef.current) {
      const step = () => {
        if (methodsScrollRef.current && scrollSpeedRef.current !== 0) {
          methodsScrollRef.current.scrollLeft += scrollSpeedRef.current;
          scrollAnimRef.current = requestAnimationFrame(step);
        } else {
          scrollAnimRef.current = null;
        }
      };
      scrollAnimRef.current = requestAnimationFrame(step);
    }
  };

  const stopEdgeScroll = () => {
    scrollSpeedRef.current = 0;
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
  };

  const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!methodsScrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const width = rect.width;
    const edgeThreshold = 150; // trigger zone within 150px from edge

    if (mouseX < edgeThreshold) {
      const intensity = (edgeThreshold - mouseX) / edgeThreshold;
      const speed = -(2.5 + intensity * 8);
      startEdgeScroll(speed);
    } else if (mouseX > width - edgeThreshold) {
      const intensity = (mouseX - (width - edgeThreshold)) / edgeThreshold;
      const speed = 2.5 + intensity * 8;
      startEdgeScroll(speed);
    } else {
      stopEdgeScroll();
    }
  };

  const loadData = () => {
    const courseData = getGlobalCourses();
    const pathData = getGlobalPaths();
    const catData = getGlobalCategories();
    setCourses(courseData);
    setPaths(pathData);
    setCategories(catData);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-courses-changed', loadData);
    window.addEventListener('ilas-paths-changed', loadData);
    window.addEventListener('ilas-categories-changed', loadData);
    return () => {
      window.removeEventListener('ilas-courses-changed', loadData);
      window.removeEventListener('ilas-paths-changed', loadData);
      window.removeEventListener('ilas-categories-changed', loadData);
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
      }
    };
  }, []);

  // Career Benefits Auto-Slide Interval
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCareerSlideIdx((prev) => (prev + 1) % careerBenefitSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  const navigateTo = (url: string) => { 
    window.location.hash = url; 
  };

  const openCourseDemo = (courseName?: string) => { 
    window.dispatchEvent(new CustomEvent('open-language-trainer', { detail: { course: courseName } })); 
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleTabClick = (tabId: SubNavBlockId) => {
    setActiveTab(tabId);
    if (tabId === 'teaching-paths') {
      scrollTo('method-intellicoach');
    } else {
      if (frameContainerRef.current) {
        const y = frameContainerRef.current.getBoundingClientRect().top + window.pageYOffset - 110;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Map Active Tab to the Corresponding Course Record
  const getActiveCourseForTab = (): GlobalCourse => {
    if (courses.length === 0) {
      return {
        id: '1',
        name: 'German Language Mastery A1–C2',
        top_title: 'German Language & Proficiency',
        subtitle: 'Goethe & Telc Standard Certification Pathways with Clinical & Technical German',
        chapter: '24',
        duration: '16 Weeks',
        methods: 'IntelliCoach AI + Native Tutors',
        fee: '$199',
        staff: 'Nadeem - ID 091 (Senior German Specialist)',
        category: 'Education & Languages',
        subCategory: 'German Language (A1–C2)',
        displayPosition: 1,
        materials: 'Digital Library & Handouts',
        students: '180',
        courseStructure: 'Module 1: CEFR A1 Fundamentals, Phonetics & Survival Vocabulary\nModule 2: CEFR A2 Daily Conversational & Workplace Dialogues\nModule 3: CEFR B1 Complex Sentence Structure & Business German\nModule 4: CEFR B2 Professional, Clinical & Technical Certification Mastery\nModule 5: Official Goethe / Telc Mock Simulations & Live Oral Prep'
      };
    }

    if (activeTab === 'german') {
      return courses.find(c => c.name.toLowerCase().includes('german') || c.subCategory?.toLowerCase().includes('german')) || courses[0];
    }
    if (activeTab === 'ielts') {
      return courses.find(c => c.name.toLowerCase().includes('ielts') || c.subCategory?.toLowerCase().includes('ielts')) || courses[1] || courses[0];
    }
    if (activeTab === 'software-tech') {
      return courses.find(c => c.name.toLowerCase().includes('software') || c.name.toLowerCase().includes('sap') || c.category?.toLowerCase().includes('software') || c.category?.toLowerCase().includes('erp')) || courses[2] || courses[0];
    }
    if (activeTab === 'medical') {
      return courses.find(c => c.name.toLowerCase().includes('medical') || c.category?.toLowerCase().includes('healthcare') || c.subCategory?.toLowerCase().includes('fsp')) || courses[5] || courses[3] || courses[0];
    }
    if (activeTab === 'job-related') {
      return courses.find(c => c.name.toLowerCase().includes('social') || c.category?.toLowerCase().includes('growth') || c.category?.toLowerCase().includes('marketing')) || courses[4] || courses[0];
    }
    return courses[0];
  };

  const activeCourse = getActiveCourseForTab();

  // Dynamically adapt underlying teaching paths / curriculum based on activeCourse AND selectedSpecialization
  const displayPathItems = useMemo(() => {
    // 1. Try to find backend paths that match the selected specialization and activeCourse
    const specializationKeywords: Record<string, string[]> = {
      medical: ['medical', 'doctor', 'fsp', 'clinical', 'health', 'hospital'],
      engineers: ['engineer', 'tech', 'din', 'vdi', 'technical', 'industrial'],
      'it-software': ['it', 'software', 'cloud', 'architecture', 'sap', 'developer', 'code'],
      business: ['business', 'management', 'corporate', 'executive', 'trade'],
      general: ['general', 'standard', 'cefr', 'foundation', 'speaking']
    };

    const targetKws = specializationKeywords[selectedSpecialization] || specializationKeywords.general;

    const matchedBySpecialization = paths.filter(p => {
      const matchesCourse = 
        p.linkedCourseId === activeCourse.id || 
        p.id === activeCourse.pathId || 
        p.linkedCourseName === activeCourse.name ||
        (activeCourse.name && p.linkedCourseName && activeCourse.name.toLowerCase().includes(p.linkedCourseName.toLowerCase()));
      
      const pText = `${p.name} ${p.methods || ''} ${p.remarks || ''}`.toLowerCase();
      const matchesSpec = targetKws.some(kw => pText.includes(kw));
      const isTestOrLegacy = /^(path\s*\d+|test\s*p\d+|test\s*path|test\b|dummy)/i.test((p.name || '').trim());
      return matchesCourse && matchesSpec && !isTestOrLegacy;
    });

    if (matchedBySpecialization.length > 0) {
      return matchedBySpecialization.sort((a, b) => (a.position || 99) - (b.position || 99));
    }

    // 2. If no direct keyword match, construct specialized curriculum tracks tailored dynamically to the selected specialization
    const specializationModulesMap: Record<string, Array<{ id: string; name: string; methods: string; starting: string; ending: string; remarks: string }>> = {
      medical: [
        { id: `med-1-${activeCourse.id}`, name: 'Fachsprachprüfung (FSP) Intensive Clinical Protocol', methods: 'IntelliCoach AI + Chief Physician Simulator', starting: 'Immediate Entry', ending: '12 Weeks', remarks: 'Doctor-Patient anamnesis dialogues, emergency triage terminology & hospital chart defense' },
        { id: `med-2-${activeCourse.id}`, name: 'Patient Anamnesis & Ward Communication Mastery', methods: 'Native Medical Examiner Sessions', starting: 'Bi-Weekly', ending: '8 Weeks', remarks: 'Physical examination documentation, Approbation exam simulation & pharmacology vocabulary' },
        { id: `med-3-${activeCourse.id}`, name: 'German Approbation & Clinical Licensing Defense', methods: 'Simulated Board Examination + AI Tutor', starting: 'Flexible', ending: 'Self-Paced', remarks: 'Official state medical board oral defense preparation with mock examiner scoring' }
      ],
      engineers: [
        { id: `eng-1-${activeCourse.id}`, name: 'DIN / VDI Technical Standards & Industrial Documentation', methods: 'IntelliCoach AI + Engineering Specialist', starting: 'Immediate Entry', ending: '12 Weeks', remarks: 'Technical specification writing, industrial safety protocols & blueprint reviews' },
        { id: `eng-2-${activeCourse.id}`, name: 'Automotive & Mechanical Systems Communication', methods: 'Interactive AI Simulator + Tech Faculty', starting: 'Bi-Weekly', ending: '10 Weeks', remarks: 'Manufacturing floor reporting, ISO compliance terminology & project defense' },
        { id: `eng-3-${activeCourse.id}`, name: 'Corporate Engineering Project Defense & Tech Sprint', methods: 'Live Enterprise Panel Simulations', starting: 'Flexible', ending: 'Self-Paced', remarks: 'Technical negotiations with German engineering leads & C-level tech briefings' }
      ],
      'it-software': [
        { id: `it-1-${activeCourse.id}`, name: 'Agile & Scrum Workplace German for Software Engineers', methods: 'IntelliCoach AI + Cloud Architect', starting: 'Immediate Entry', ending: '8 Weeks', remarks: 'Sprint planning dialogues, code review defense & DevOps vocabulary in German' },
        { id: `it-2-${activeCourse.id}`, name: 'Enterprise Architecture & Cloud Systems Communication', methods: 'AI Architecture Coach', starting: 'Bi-Weekly', ending: '10 Weeks', remarks: 'System design presentations, cybersecurity compliance & technical client negotiations' },
        { id: `it-3-${activeCourse.id}`, name: 'European Tech Interview & Live Whiteboard Defense', methods: 'Simulated Hiring Panel', starting: 'Flexible', ending: 'Self-Paced', remarks: 'Direct placement interview coaching with German tech recruitment leads' }
      ],
      business: [
        { id: `biz-1-${activeCourse.id}`, name: 'Cross-Border Contract Negotiations & Boardroom German', methods: 'IntelliCoach AI + C-Level Executive Coach', starting: 'Immediate Entry', ending: '10 Weeks', remarks: 'Executive negotiations, legal contract terminology & commercial German' },
        { id: `biz-2-${activeCourse.id}`, name: 'Dual-Study Enterprise Placement & Workplace Etiquette', methods: 'Corporate Mentorship Network', starting: 'Bi-Weekly', ending: '8 Weeks', remarks: 'Corporate email syntax, formal German hierarchy protocols & business reporting' },
        { id: `biz-3-${activeCourse.id}`, name: 'International Trade & European Market Expansion Sprint', methods: 'Executive Masterclasses', starting: 'Flexible', ending: 'Self-Paced', remarks: 'DACH market strategy, supply chain dialogues & financial presentations' }
      ],
      general: [
        { id: `gen-1-${activeCourse.id}`, name: 'CEFR Official Standard Speaking & Phonetics Mastery', methods: 'IntelliCoach AI + Native German Examiner', starting: 'Immediate Entry', ending: '16 Weeks', remarks: 'A1–C2 progressive fluency, real-time accent tuning & daily conversational scenarios' },
        { id: `gen-2-${activeCourse.id}`, name: 'Grammar Syntax & Complex Sentence Construction', methods: 'Visual Knowledge Decks + AI Drills', starting: 'Flexible Entry', ending: '12 Weeks', remarks: 'Subjunctive mood, passive voice & idiomatic European phrasing with instant error analysis' },
        { id: `gen-3-${activeCourse.id}`, name: 'Official Goethe-Institut & Telc Examination Preparation', methods: 'Simulated Mock Exams + Scoring Engine', starting: 'Bi-Weekly', ending: '6 Weeks', remarks: 'Proctored mock simulations matching official Goethe / Telc grading rubrics' }
      ]
    };

    return specializationModulesMap[selectedSpecialization] || specializationModulesMap.general;
  }, [activeCourse, paths, selectedSpecialization]);

  // Dynamically derive specialization tracks from backend database & target domain categories
  const dynamicSpecializationTracks = useMemo<SpecializationTrack[]>(() => {
    // 1. Standard Domain Specialization Categories
    const baseTracks: SpecializationTrack[] = [
      { 
        id: 'general', 
        label: 'General / Standard', 
        badge: 'Universal CEFR', 
        icon: Compass, 
        desc: activeCourse.subtitle || 'Official CEFR Standard Certification & Universal Academic Pathway',
        highlights: ['CEFR Official Syllabus', 'Speaking & Grammar Mastery', 'Global Certification']
      },
      { 
        id: 'medical', 
        label: 'Healthcare / Doctors', 
        badge: 'Clinical / FSP', 
        icon: Stethoscope, 
        desc: 'Fachsprachprüfung (FSP), Patient Anamnesis & German Hospital Doctor Communication',
        highlights: ['Medical Fachsprache', 'Doctor-Patient Case Studies', 'Approbation Support']
      },
      { 
        id: 'engineers', 
        label: 'Engineers', 
        badge: 'DIN / Tech', 
        icon: Building2, 
        desc: 'Technical German (DIN/VDI Standards), Technical Documentation & Project Defense',
        highlights: ['Technical Terminology', 'Engineering Blueprints', 'Corporate Team Defense']
      },
      { 
        id: 'it-software', 
        label: 'IT & Software', 
        badge: 'Enterprise Tech', 
        icon: Laptop, 
        desc: 'Enterprise Architecture, Tech Interview Defense & Agile Workplace Communication',
        highlights: ['Agile German Dialogues', 'Cloud & Architecture Terms', 'EU Tech Placement']
      },
      { 
        id: 'business', 
        label: 'Business & Management', 
        badge: 'Corporate Fluency', 
        icon: Briefcase, 
        desc: 'Commercial Negotiations, Dual-Study Placement & Cross-Border Corporate Fluency',
        highlights: ['Contract Negotiations', 'Executive Presentations', 'Corporate German']
      }
    ];

    // 2. Query valid non-legacy backend paths for this course
    const coursePaths = paths.filter(p => {
      const matchesCourse = 
        p.linkedCourseId === activeCourse.id || 
        p.id === activeCourse.pathId || 
        p.linkedCourseName === activeCourse.name ||
        (activeCourse.name && p.linkedCourseName && activeCourse.name.toLowerCase().includes(p.linkedCourseName.toLowerCase()));
      
      // Exclude legacy or test placeholder paths
      const isTestOrLegacy = /^(path\s*\d+|test\s*p\d+|test\s*path|test\b|dummy)/i.test((p.name || '').trim());
      return matchesCourse && !isTestOrLegacy;
    });

    if (coursePaths.length > 0) {
      const customPathTracks: SpecializationTrack[] = coursePaths.map((p, idx) => ({
        id: `custom-path-${p.id || idx}`,
        label: p.name.replace(/^(Path\s*\d+|Test\s*P\d+|Test)\s*[-–:]*\s*/i, '').trim() || p.name,
        badge: p.methods ? p.methods.split('[')[0].trim().slice(0, 16) : 'Custom Track',
        icon: Compass,
        desc: p.remarks || p.methods || `Specialized pathway: ${p.name}`,
        highlights: [
          p.methods || 'Adaptive Tutoring', 
          p.starting ? `Starts: ${p.starting}` : 'Flexible Entry', 
          p.ending ? `Duration: ${p.ending}` : 'Self-Paced'
        ]
      }));

      return [
        ...baseTracks,
        ...customPathTracks.filter(cpt => !baseTracks.some(bt => bt.label.toLowerCase() === cpt.label.toLowerCase()))
      ];
    }

    return baseTracks;
  }, [activeCourse, paths]);

  // Filtered Job-Related & Catalog Block Courses
  const allAvailableCategories = Array.from(new Set([
    ...categories.map(c => c.name),
    ...courses.map(c => c.category).filter(Boolean) as string[]
  ]));

  const availableSubCategories = Array.from(new Set([
    ...(selectedCategory === 'All' 
      ? categories.flatMap(c => c.subCategories || []) 
      : (categories.find(c => c.name === selectedCategory)?.subCategories || [])),
    ...(courses
      .filter(c => selectedCategory === 'All' || c.category === selectedCategory)
      .map(c => c.subCategory)
      .filter(Boolean) as string[])
  ]));

  const filteredBlockCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || course.subCategory === selectedSubCategory;
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.subtitle && course.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.category && course.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.subCategory && course.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.top_title && course.top_title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  // Magazine Grid Pagination (Max 9 blocks per page - 3 rows of 3)
  const COURSES_PER_PAGE = 9;
  const totalJobPages = Math.ceil(filteredBlockCourses.length / COURSES_PER_PAGE) || 1;
  const paginatedCourses = filteredBlockCourses.slice(
    (jobCoursesPage - 1) * COURSES_PER_PAGE,
    jobCoursesPage * COURSES_PER_PAGE
  );

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      
      {/* 1. HERO HEADER WITH COMPACT PROMO BANNER & INVISIBLE HOVER-SCROLL */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-12 px-4 sm:px-6 rounded-b-[3rem] shadow-2xl mb-6">
        {/* Ambient background lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

        <div className="container-max mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-white/10 shadow-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Global Education Hub
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            All Courses &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-300">Global Certifications</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl mb-7 max-w-3xl mx-auto leading-relaxed font-normal">
            Adaptive sequential pathways, official European certifications, and direct career placements.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button 
              onClick={() => navigateTo('#applications?tab=Education')} 
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 font-black rounded-xl text-sm md:text-base transition-all shadow-lg hover:shadow-brand-500/30 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Enroll in a Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleTabClick('job-related')} 
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm md:text-base transition-all border border-white/20 cursor-pointer backdrop-blur-md active:scale-95 flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>Browse Job Courses Catalog ({courses.length})</span>
            </button>
          </div>

          {/* COMPACT PROMO BANNER (All 6 Core Methods with Invisible Edge Hover-Scroll) */}
          <div className="relative pt-6 border-t border-white/10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-4 px-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Multi-Modal Teaching Methodologies
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
                Hover left / right edges to slide • Click any method for blueprint
              </span>
            </div>

            {/* Banner Container with Active Edge Hover Detection */}
            <div 
              className="relative group/banner px-1 select-none"
              onMouseMove={handleBannerMouseMove}
              onMouseLeave={stopEdgeScroll}
            >
              {/* Invisible Left Edge Hover Trigger (Active Smooth Scrolling) */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-32 sm:w-44 z-30 pointer-events-auto bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent rounded-l-2xl cursor-w-resize transition-opacity opacity-70 group-hover/banner:opacity-100"
                onMouseEnter={() => startEdgeScroll(-16)}
                onMouseLeave={stopEdgeScroll}
                aria-label="Scroll banner left"
              />

              {/* Invisible Right Edge Hover Trigger (Active Smooth Scrolling) */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-32 sm:w-44 z-30 pointer-events-auto bg-gradient-to-l from-slate-950/80 via-slate-950/30 to-transparent rounded-r-2xl cursor-e-resize transition-opacity opacity-70 group-hover/banner:opacity-100"
                onMouseEnter={() => startEdgeScroll(16)}
                onMouseLeave={stopEdgeScroll}
                aria-label="Scroll banner right"
              />

              {/* Scrollable Track */}
              <div 
                ref={methodsScrollRef}
                className="flex items-start gap-4 sm:gap-6 overflow-x-auto hide-scrollbar py-2 px-6 sm:px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {promoTeachingMethods.map((method) => {
                  const MethodIcon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => scrollTo(method.targetSectionId)}
                      className="group relative flex-shrink-0 w-[220px] sm:w-[240px] md:w-[250px] flex flex-col items-center text-center cursor-pointer select-none transition-all duration-300 py-2 px-2"
                    >
                      {/* Ambient Atmospheric Hover Glow Bloom */}
                      <div 
                        className={`absolute -inset-4 rounded-3xl ${method.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none`} 
                        />

                      {/* Floating Brand Logo Badge */}
                      <div className="relative mb-3.5">
                        <div 
                          className={`w-14 h-14 rounded-2xl ${method.badgeBg} flex items-center justify-center text-white shadow-xl group-hover:scale-115 group-hover:-rotate-3 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] transition-all duration-300 ease-out`}
                        >
                          <MethodIcon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        
                        {/* Floating Micro Indicator Pulse */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${method.badgeBg}`} />
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${method.badgeBg} ring-2 ring-slate-950`} />
                        </span>
                      </div>

                      {/* Brand Typography (Enlarged & Floating) */}
                      <div className="relative z-10 space-y-1 w-full">
                        <h3 
                          className={`text-base sm:text-lg font-black text-white ${method.hoverText} transition-all duration-300 tracking-tight group-hover:scale-105`}
                        >
                          {method.name}
                        </h3>
                        
                        <div className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${method.accentText} group-hover:brightness-125 transition-all`}>
                          {method.tagline}
                        </div>

                        <p className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-snug max-w-[210px] mx-auto pt-0.5 font-medium line-clamp-2">
                          {method.desc}
                        </p>

                        {/* Interactive Micro Action Cue on Hover */}
                        <div className="pt-2 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${method.accentText} underline underline-offset-2`}>
                            <span>View Full Blueprint</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2 & 3. UNIFIED BORDERLESS SINGLE-FRAME CONTAINER (SUB-NAV INTEGRATED DIRECTLY WITHOUT SHARP DIVISIONS) */}
      <div ref={frameContainerRef} className="container-max mx-auto px-4 sm:px-6 pb-20">

        {/* ========================================================================= */}
        {/* COURSE SPECIALTY / INTRODUCTION BANNER ABOVE COURSE LISTS                 */}
        {/* Concise, high-impact introductory banner (3-4 lines maximum)              */}
        {/* ========================================================================= */}
        <div className="mb-6 rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Text Narrative (3-4 lines maximum) */}
            <div className="space-y-2 max-w-4xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Dual-Engine Learning • AI + Native Faculty</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Guaranteed Rapid Fluency
                </span>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                Accelerate Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">IntelliCoach AI™</span> &amp; Specialized Human Tutors
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Learn with our 100% AI-powered <strong>IntelliCoach™</strong> for 24/7 real-time accent tuning and interactive speech simulations, paired with specialized native human tutors for quick, easy progression. Master German, IELTS, or Software Tech with us to unlock instant <strong>work-while-study</strong> options, tuition-free public university degrees, and verified career placements across Germany and Europe.
              </p>

              {/* 4 Compact Value Feature Pills */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-indigo-200">
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>100% AI IntelliCoach™</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-emerald-200">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Specialized Human Tutors</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-amber-200">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick &amp; Easy Progression</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-cyan-200">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Work-Study &amp; EU Placement</span>
                </span>
              </div>
            </div>

            {/* Right-hand CTA button */}
            <div className="shrink-0 flex sm:flex-row lg:flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('method-intellicoach');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.dispatchEvent(new CustomEvent('open-language-trainer'));
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4 text-slate-950" />
                <span>Try IntelliCoach Demo</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('#applications?tab=Education')}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* BORDERLESS INTEGRATED SUB-NAV TAB BAR (No dividing borders, center-aligned typography, watermark design) */}
          <div className="bg-slate-50/70 p-3 sm:p-5 pb-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
              {SUB_NAV_BLOCKS.map((block) => {
                const BlockIcon = block.icon;
                const isActive = activeTab === block.id;

                return (
                  <button
                    key={block.id}
                    onClick={() => handleTabClick(block.id)}
                    className={`group relative p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[96px] sm:min-h-[108px] overflow-hidden ${
                      isActive 
                        ? `${block.activeBg} text-white border-transparent shadow-xl ring-2 ${block.activeRing} scale-[1.02] z-10` 
                        : `bg-white ${block.accentBorder} ${block.accentHoverBorder} ${block.accentGlow} text-slate-800 hover:bg-slate-50 shadow-xs hover:scale-[1.01]`
                    }`}
                  >
                    {/* Subtle Background Watermark Brand Icon with Smooth Scale-Up Hover */}
                    <div className="absolute -bottom-4 -right-4 pointer-events-none transition-all duration-500 ease-out transform group-hover:scale-130 group-hover:-rotate-12 select-none">
                      <BlockIcon className={`w-24 h-24 sm:w-28 sm:h-28 transition-colors duration-500 ${
                        isActive 
                          ? 'text-white/10 group-hover:text-white/20' 
                          : 'text-slate-900/[0.04] group-hover:text-slate-900/[0.08]'
                      }`} />
                    </div>

                    {/* Central High-Impact Bold Typography (No small icons above) */}
                    <div className="relative z-10 space-y-0.5 w-full flex flex-col items-center justify-center">
                      <div className={`font-black text-sm sm:text-base md:text-lg leading-tight tracking-tight text-center transition-colors line-clamp-2 px-1 ${
                        isActive ? 'text-white' : `text-slate-900 group-hover:${block.accentText}`
                      }`}>
                        {block.title}
                      </div>
                      <div className={`text-[11px] text-center font-medium leading-tight ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {block.subtitle}
                      </div>
                    </div>

                    {/* Active Glowing Bottom Indicator Line */}
                    {isActive && (
                      <div className="absolute -bottom-0.5 left-4 right-4 h-1 bg-gradient-to-r from-white/70 via-white to-white/70 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SINGLE-FRAME INTERACTIVE CONTENT BODY */}
          <div className="p-6 sm:p-10">
            {activeTab === 'teaching-paths' ? (
              /* TEACHING METHODOLOGIES BLUEPRINT HUB */
              <div className="animate-in fade-in duration-300">
                <div className="max-w-3xl mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      6 Core Pedagogical Delivery Paths
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      AI &amp; Live Methodology Blueprints
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Multi-Modal Teaching Methodologies</h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Comprehensive adaptive framework combining 24/7 autonomous AI coaching, native examiner tutoring, and campus bootcamps.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promoTeachingMethods.map((method) => {
                    const MethodIcon = method.icon;
                    return (
                      <div 
                        key={method.id}
                        onClick={() => scrollTo(method.targetSectionId)}
                        className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-xl ${method.badgeBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                              <MethodIcon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                              {method.tagline}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                            {method.name}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {method.desc}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-indigo-600">
                          <span>Explore Detailed Blueprint</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : activeTab === 'job-related' ? (
              /* MAGAZINE-STYLE JOB-RELATED PROGRAMS & CAREER SPRINTS (MAX 9 PER VIEW WITH PAGINATION) */
              <div className="animate-in fade-in duration-300">
                {/* Magazine Section Header */}
                <div className="max-w-3xl mb-8">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      Editorial Career Issue • Placement Tracks
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      EU Direct Sprints
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Dual-Study &amp; Job Ready
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Job-Related Programs &amp; <span className="text-purple-700">Career Sprints</span>
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                    Actionable, industry-certified vocational blueprints designed for rapid European enterprise placements and immediate hiring defense.
                  </p>
                </div>

                {/* Magazine Filters & Layout Bar */}
                <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-2xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-purple-600" /> Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => { 
                        setSelectedCategory(e.target.value); 
                        setSelectedSubCategory('All'); 
                        setJobCoursesPage(1); 
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-800 outline-none focus:border-purple-500"
                    >
                      <option value="All">All Categories ({allAvailableCategories.length})</option>
                      {allAvailableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-purple-600" /> Sub-Category
                    </label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => { 
                        setSelectedSubCategory(e.target.value); 
                        setJobCoursesPage(1); 
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-800 outline-none focus:border-purple-500"
                    >
                      <option value="All">All Sub-Categories ({availableSubCategories.length})</option>
                      {availableSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Search className="w-3.5 h-3.5 text-slate-400" /> Search Sprints
                    </label>
                    <input
                      type="text"
                      placeholder="Title, keyword, skill..."
                      value={searchQuery}
                      onChange={(e) => { 
                        setSearchQuery(e.target.value); 
                        setJobCoursesPage(1); 
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Magazine View</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                          viewMode === 'grid' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" /> Grid (3×3)
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('line')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                          viewMode === 'line' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <List className="w-3.5 h-3.5" /> Line
                      </button>
                    </div>
                  </div>
                </div>

                {/* Magazine Grid Layout (Max 9 items per page) */}
                {paginatedCourses.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                    <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-base font-black text-slate-800">No programs match your current filter</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try selecting 'All Categories' or resetting your search query.</p>
                    <button
                      onClick={() => { setSelectedCategory('All'); setSelectedSubCategory('All'); setSearchQuery(''); setJobCoursesPage(1); }}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-800"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                    {paginatedCourses.map((course, idx) => {
                      const theme = jobMagazineThemes[idx % jobMagazineThemes.length];
                      return (
                        <div 
                          key={course.id}
                          className={`${theme.bg} rounded-3xl p-6 sm:p-7 border ${theme.border} ${theme.cardShadow} hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xs`}
                        >
                          {/* Decorative Subtle Magazine Watermark / Gradient Glow */}
                          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/60 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none font-black text-4xl tracking-tighter text-slate-900">
                            {String(idx + 1 + ((jobCoursesPage - 1) * COURSES_PER_PAGE)).padStart(2, '0')}
                          </div>

                          {/* Top Magazine Hierarchy Strip */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-black uppercase tracking-wider ${theme.categoryBadge} px-3 py-1 rounded-lg shadow-2xs`}>
                                  {course.category || 'Career Track'}
                                </span>
                                {course.subCategory && (
                                  <span className={`text-[10px] font-bold ${theme.subCategoryTag} px-2.5 py-1 rounded-lg border`}>
                                    {course.subCategory}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${theme.sprintBadge} px-2.5 py-0.5 rounded shadow-2xs`}>
                                Sprint Ed.
                              </span>
                            </div>

                            {/* Editorial Magazine Title with High-Contrast Typography */}
                            <h3 className={`font-black text-xl ${theme.titleColor} ${theme.titleHover} transition-colors leading-snug line-clamp-2 mb-2.5 tracking-tight`}>
                              {course.name}
                            </h3>

                            {/* High-Contrast Executive Excerpt */}
                            <p className={`text-xs sm:text-[13px] ${theme.subtextColor} font-medium line-clamp-2 leading-relaxed mb-4`}>
                              {course.subtitle || 'Direct corporate certification with verified European enterprise recruitment alignment.'}
                            </p>

                            {/* High-Contrast Magazine Feature Highlight */}
                            <div className={`flex items-center gap-2 mb-4 text-[11px] font-bold ${theme.featureBg} py-2 px-3 rounded-xl border shadow-2xs`}>
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate">Direct European Placement &amp; Dual-Study Track</span>
                            </div>

                            {/* High-Contrast 3-Box Stats Matrix */}
                            <div className={`grid grid-cols-3 gap-2 p-3 ${theme.matrixBg} rounded-2xl border mb-4 text-center shadow-2xs backdrop-blur-xs`}>
                              <div className="border-r border-slate-200/80 pr-1">
                                <div className={`text-[9px] font-black uppercase tracking-wider ${theme.matrixLabel}`}>Duration</div>
                                <div className={`text-xs font-black ${theme.matrixVal} mt-0.5 truncate`}>{course.duration || '8 Weeks'}</div>
                              </div>
                              <div className="border-r border-slate-200/80 pr-1">
                                <div className={`text-[9px] font-black uppercase tracking-wider ${theme.matrixLabel}`}>Curriculum</div>
                                <div className={`text-xs font-black ${theme.matrixVal} mt-0.5 truncate`}>{course.chapter ? `${course.chapter} Units` : '12 Modules'}</div>
                              </div>
                              <div>
                                <div className={`text-[9px] font-black uppercase tracking-wider ${theme.matrixLabel}`}>Tuition</div>
                                <div className={`text-xs font-black ${theme.tuitionVal} mt-0.5 truncate`}>{course.fee || '$199'}</div>
                              </div>
                            </div>

                            {/* Assigned Faculty Footnote */}
                            <div className={`flex items-center gap-2 text-xs font-bold ${theme.facultyText} px-0.5 mb-2 truncate`}>
                              <Sparkles className={`w-3.5 h-3.5 ${theme.facultyIcon} shrink-0`} />
                              <span className="truncate">Faculty: {course.staff || 'Certified Industry Practitioner'}</span>
                            </div>
                          </div>

                          {/* Magazine Action Strip with High-Contrast Buttons */}
                          <div className="pt-3.5 border-t border-slate-200/80 flex items-center gap-2 mt-2 relative z-10">
                            <button
                              onClick={() => openCourseDemo(course.name)}
                              className={`flex-1 py-2.5 px-3 ${theme.demoBtn} font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs border`}
                            >
                              <Play className={`w-3.5 h-3.5 ${theme.demoIcon}`} />
                              <span>Demo Session</span>
                            </button>
                            <button
                              onClick={() => navigateTo(`#course-${course.id}`)}
                              className={`flex-1 py-2.5 px-3 ${theme.specsBtn} font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md`}
                            >
                              <span>Curriculum</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Line View / Editorial Strips */
                  <div className="space-y-3.5">
                    {paginatedCourses.map((course, idx) => {
                      const theme = jobMagazineThemes[idx % jobMagazineThemes.length];
                      return (
                        <div 
                          key={course.id}
                          className={`${theme.bg} rounded-2xl p-5 sm:p-6 border ${theme.border} hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-xs relative overflow-hidden`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-[10px] font-black uppercase ${theme.categoryBadge} px-2.5 py-0.5 rounded-md`}>
                                {course.category || 'Career Track'}
                              </span>
                              {course.subCategory && (
                                <span className={`text-[10px] font-bold ${theme.subCategoryTag} px-2 py-0.5 rounded-md border`}>
                                  {course.subCategory}
                                </span>
                              )}
                              <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                                {course.fee}
                              </span>
                            </div>
                            <h3 className={`font-black text-lg ${theme.titleColor} ${theme.titleHover} transition-colors truncate`}>
                              {course.name}
                            </h3>
                            <p className={`text-xs ${theme.subtextColor} font-medium line-clamp-1 mt-0.5`}>
                              {course.subtitle || 'Direct corporate certification with verified European enterprise recruitment alignment.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-6 shrink-0 text-xs font-black text-slate-900 bg-white/95 px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                            <div>⏱️ {course.duration || '8 Weeks'}</div>
                            <div>📚 {course.chapter ? `${course.chapter} Units` : '12 Modules'}</div>
                            <div className="text-emerald-700 font-black text-sm">{course.fee}</div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => openCourseDemo(course.name)}
                              className={`px-4 py-2.5 ${theme.demoBtn} font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border shadow-2xs`}
                            >
                              <Play className={`w-3.5 h-3.5 ${theme.demoIcon}`} /> Demo
                            </button>
                            <button
                              onClick={() => navigateTo(`#course-${course.id}`)}
                              className={`px-5 py-2.5 ${theme.specsBtn} font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md`}
                            >
                              Curriculum <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Structured Pagination Bar (Max 9 items per page) */}
                {totalJobPages > 1 && (
                  <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-slate-500">
                      Showing <span className="text-slate-900 font-black">{((jobCoursesPage - 1) * COURSES_PER_PAGE) + 1}</span>–
                      <span className="text-slate-900 font-black">{Math.min(jobCoursesPage * COURSES_PER_PAGE, filteredBlockCourses.length)}</span> of{' '}
                      <span className="text-slate-900 font-black">{filteredBlockCourses.length}</span> career programs
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={jobCoursesPage <= 1}
                        onClick={() => {
                          setJobCoursesPage(p => Math.max(p - 1, 1));
                          frameContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                          jobCoursesPage <= 1
                            ? 'opacity-40 pointer-events-none bg-slate-100 border-slate-200 text-slate-400'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalJobPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              setJobCoursesPage(pageNum);
                              frameContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center border ${
                              jobCoursesPage === pageNum
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={jobCoursesPage >= totalJobPages}
                        onClick={() => {
                          setJobCoursesPage(p => Math.min(p + 1, totalJobPages));
                          frameContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                          jobCoursesPage >= totalJobPages
                            ? 'opacity-40 pointer-events-none bg-slate-100 border-slate-200 text-slate-400'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* UNIFIED SINGLE-FRAME COURSE CANVAS (For German, IELTS, Tech, and Medical) */
              <div className="animate-in fade-in duration-300">
                
                {/* Single-Frame Course Header Banner */}
                <div className="text-center max-w-4xl mx-auto mb-8">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-[11px] font-black tracking-widest text-brand-700 uppercase bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200 shadow-2xs">
                      {activeCourse.top_title || activeCourse.category || 'Specialized Track'}
                    </span>
                    {activeCourse.subCategory && (
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {activeCourse.subCategory}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 mb-2">
                    {activeCourse.name}
                  </h2>
                  <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
                    {activeCourse.subtitle || 'Comprehensive enterprise-level education & certification framework.'}
                  </p>
                </div>

                {/* 1 & 2. UNIFIED LIGHT-GRAY CONTAINER: SELECT YOUR SPECIALIZATION & PROMOTIONAL BENEFITS SLIDER */}
                <div className="bg-slate-100/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
                  
                  {/* TOP SECTION: SELECT YOUR SPECIALIZATION (DYNAMIC BACKEND TRACKS) */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-brand-700" />
                        <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                          Select Your Specialization
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Curriculum and delivery paths adapt dynamically based on your chosen discipline
                      </span>
                    </div>

                    {/* Clean Themed Typography Specialization Selector */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      {dynamicSpecializationTracks.map((track) => {
                        const TrackIcon = track.icon;
                        const isSelected = selectedSpecialization === track.id;

                        return (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => setSelectedSpecialization(track.id)}
                            className={`group px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                              isSelected
                                ? 'bg-white text-slate-950 font-black border-slate-300 shadow-sm ring-1 ring-slate-900/10'
                                : 'bg-transparent text-slate-600 font-semibold border-transparent hover:text-slate-950 hover:bg-white/60'
                            }`}
                          >
                            <TrackIcon className={`w-4 h-4 transition-colors shrink-0 ${
                              isSelected ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-700'
                            }`} />
                            <span className="tracking-tight whitespace-nowrap">{track.label}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 ml-0.5 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Specialization Live Adaptation Feedback */}
                    <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        <strong className="font-bold text-slate-900">
                          {dynamicSpecializationTracks.find(t => t.id === selectedSpecialization)?.label || 'Track'}:
                        </strong>{' '}
                        {dynamicSpecializationTracks.find(t => t.id === selectedSpecialization)?.desc}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM SECTION: CURRICULUM MODULES & PROMOTIONAL BENEFITS SLIDER */}
                  <div className="grid lg:grid-cols-12 gap-6 items-stretch pt-4 border-t border-slate-200/80">
                    
                    {/* Specialized Curriculum Modules Column (Adapts to Selected Specialization) */}
                    <div className="lg:col-span-6 flex flex-col justify-between gap-2.5">
                      <div>
                        <div className="flex items-center justify-between px-1 mb-2">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-brand-600" />
                            Specialized Curriculum Modules
                          </span>
                          <span className="text-[10px] text-brand-700 font-bold bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                            {dynamicSpecializationTracks.find(t => t.id === selectedSpecialization)?.badge || 'Adaptive Plan'}
                          </span>
                        </div>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 rounded-2xl">
                          {displayPathItems.map((pathItem, pIdx) => {
                            const isActive = pIdx === 0 || pathItem.id === activeCourse.pathId;
                            const rawTitle = pathItem.name || activeCourse.methods || '';
                            
                            // Sanitize any legacy / test prefixes or placeholders
                            let cleanPathTitle = rawTitle.replace(/^(Path\s*\d+|Test\s*P\d+|Test\s*Path|Test|P\d+)\s*[-–:]*\s*/i, '').trim();
                            if (!cleanPathTitle || /^(Path\s*\d+|Test\s*P\d+|Test\s*Path|Test|P\d+)$/i.test(cleanPathTitle)) {
                              cleanPathTitle = 'Specialized Foundation Module';
                            }

                            const pathMethod = pathItem.methods || 'IntelliCoach AI + Expert Native Faculty';
                            
                            return (
                              <div 
                                key={pathItem.id || pIdx} 
                                className={`bg-white p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-all ${
                                  isActive ? 'border-2 border-brand-500 bg-brand-50/10' : 'border-slate-200 hover:border-brand-300'
                                }`}
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    isActive ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    <BrainCircuit className="w-5 h-5" />
                                  </div>
                                  <div className="truncate">
                                    <div className="font-bold text-slate-900 text-sm sm:text-base truncate">{cleanPathTitle}</div>
                                    <div className="text-[11px] text-slate-500 truncate">{pathMethod}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                  <button 
                                    onClick={() => scrollTo(`specs-${activeCourse.id}`)} 
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" /> Details
                                  </button>
                                  <button 
                                    onClick={() => openCourseDemo(activeCourse.name)} 
                                    className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                  >
                                    <Play className="w-3.5 h-3.5" /> Demo
                                  </button>
                                  <button 
                                    onClick={() => navigateTo(`#applications?course=${encodeURIComponent(activeCourse.name)}&path=${encodeURIComponent(cleanPathTitle)}`)} 
                                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs"
                                  >
                                    Enroll
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Promotional Slider for Career & Study Benefits */}
                    <div 
                      className="lg:col-span-6 bg-slate-900 rounded-3xl text-white shadow-xl border border-slate-800 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[380px]"
                      onMouseEnter={() => setIsSlidePaused(true)}
                      onMouseLeave={() => setIsSlidePaused(false)}
                    >
                      {/* Ambient Backlight for active slide */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Slider Header & Navigation Controls */}
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                              Career &amp; Study Advantage
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setCareerSlideIdx((prev) => (prev - 1 + careerBenefitSlides.length) % careerBenefitSlides.length)}
                              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Previous Advantage"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 px-1">
                              {careerSlideIdx + 1} / {careerBenefitSlides.length}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCareerSlideIdx((prev) => (prev + 1) % careerBenefitSlides.length)}
                              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Next Advantage"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Active Slide Content */}
                        {(() => {
                          const currentSlide = careerBenefitSlides[careerSlideIdx];
                          const SlideIcon = currentSlide.icon;

                          return (
                            <div key={currentSlide.id} className="animate-in fade-in duration-300">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
                                    <SlideIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                                      {currentSlide.title}
                                    </h3>
                                    <div className="text-xs text-slate-400 font-medium">
                                      {currentSlide.subtitle}
                                    </div>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${currentSlide.badgeBg}`}>
                                  {currentSlide.badge}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 mb-4 font-normal">
                                {currentSlide.desc}
                              </p>

                              {/* Highlights */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
                                {currentSlide.highlights.map((h, i) => (
                                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-[11px] font-bold text-amber-300 leading-snug">{h}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Slider Footer: Direct Clickable Link & Interactive Indicator Dots */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4 mt-auto">
                        {/* Slide Indicator Dots */}
                        <div className="flex items-center gap-1.5">
                          {careerBenefitSlides.map((slide, idx) => (
                            <button
                              key={slide.id}
                              type="button"
                              onClick={() => setCareerSlideIdx(idx)}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                careerSlideIdx === idx 
                                  ? 'w-6 bg-amber-400' 
                                  : 'w-2 bg-white/20 hover:bg-white/40'
                              }`}
                              title={slide.title}
                            />
                          ))}
                        </div>

                        {/* Direct Clickable CTA */}
                        <button
                          onClick={() => navigateTo(careerBenefitSlides[careerSlideIdx].link)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{careerBenefitSlides[careerSlideIdx].cta}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Dynamic Syllabus & Module Progression Breakdown */}
                {activeCourse.courseStructure && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200/80 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-black uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-600" /> Syllabus &amp; Module Progression
                      </h4>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                        {activeCourse.chapter || 'Full'} Chapters
                      </span>
                    </div>
                    <div className="whitespace-pre-line text-slate-700 text-sm leading-relaxed p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm">
                      {activeCourse.courseStructure}
                    </div>
                  </div>
                )}

                {/* Course Specifications & Overview Breakdown */}
                <div id={`specs-${activeCourse.id}`} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-brand-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-brand-600" /> Course Specifications &amp; Overview
                    </h4>
                    <button 
                      onClick={() => navigateTo(`#course-${activeCourse.id}`)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Standalone Specs Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chapters &amp; Units</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">{activeCourse.chapter} Chapters</div>
                      <div className="text-xs text-slate-500 mt-1">Full curriculum handouts included</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Course Duration</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">{activeCourse.duration}</div>
                      <div className="text-xs text-slate-500 mt-1">Flexible pacing available</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Course Fee</div>
                      <div className="text-lg font-black text-emerald-600 mt-0.5">{activeCourse.fee}</div>
                      <div className="text-xs text-slate-500 mt-1">Includes certification vouchers</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Faculty</div>
                      <div className="text-sm font-black text-slate-900 mt-0.5 truncate">{activeCourse.staff || 'Certified Instructor'}</div>
                      <div className="text-xs text-slate-500 mt-1">Verified academic practitioner</div>
                    </div>
                  </div>
                </div>

                {/* ILA Companion Promotion Footer */}
                <div className="bg-slate-950 p-7 sm:p-9 rounded-3xl text-white border-2 border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div>
                    <div className="text-amber-400 font-black uppercase text-xs mb-1.5 flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-400" /> Royal Lifetime Mentorship
                    </div>
                    <h3 className="text-2xl font-black text-amber-100">ILA Companion AI &amp; Counselor</h3>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                      Continuous career mentorship, visa filing advisory, and personalized German enterprise match throughout your journey.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigateTo('#applications?type=counseling')}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 shrink-0 cursor-pointer"
                  >
                    Activate Lifetime Companion
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

        {/* 5. COMPREHENSIVE TEACHING METHODOLOGY IN-DEPTH FRAMEWORKS (STRICT ORDER) */}
        <section className="border-t-2 border-slate-200/80 pt-20 space-y-16">
          
          {/* Main Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-black uppercase tracking-widest mb-4 border border-brand-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Complete Delivery Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              In-Depth Teaching <span className="text-brand-600">Methodology Blueprints</span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg mt-3 leading-relaxed">
              Explore how each instructional model is engineered to guarantee European fluency, clinical accuracy, and direct job integration.
            </p>
          </div>

          {/* SECTION 1: INTELLICOACH AI™ */}
          <div 
            id="method-intellicoach" 
            className="scroll-mt-28 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-500/20 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] shrink-0">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-indigo-400">Section 1 • Autonomous Digital Learning</div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">IntelliCoach AI™</h3>
                    <div className="text-xs sm:text-sm text-indigo-200 font-medium">24/7 Human-Like Conversational Intelligence &amp; Multilingual German Training</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                    24/7 Autonomous Availability
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full">
                    European CEFR Aligned
                  </span>
                </div>
              </div>

              {/* RICH PICTORIAL MOCKUP: INTELLICOACH AI™ ACTIVE SIMULATOR & TWO-WAY VOICE/CHAT PANEL */}
              <div className="bg-slate-950/90 rounded-3xl border border-indigo-500/40 p-5 sm:p-7 shadow-2xl backdrop-blur-xl mb-10 overflow-hidden relative">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3.5 mb-5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                      Live AI Virtual Screen &amp; Voice Interaction Simulator
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                    Latency: &lt;120ms • 24/7 Autonomous Stream
                  </span>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: AI Virtual Avatar & Live Phonetic Meter */}
                  <div className="lg:col-span-5 bg-gradient-to-b from-indigo-950/60 to-slate-900/80 rounded-2xl p-5 border border-indigo-500/30 flex flex-col items-center text-center justify-between min-h-[320px]">
                    <div className="w-full flex items-center justify-between text-[11px] font-bold text-indigo-300">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 text-emerald-400" /> Live Audio Feed
                      </span>
                      <span className="text-emerald-400">German CEFR C2 Calibrated</span>
                    </div>

                    {/* Futuristic Pulsing AI Avatar */}
                    <div className="relative my-4">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-500 to-purple-500 p-1 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.6)] animate-pulse">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-indigo-400">
                          <BrainCircuit className="w-12 h-12 text-indigo-300 animate-bounce" />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
                        Listening Active
                      </div>
                    </div>

                    {/* Phonetic & Accent Analysis Bar */}
                    <div className="w-full bg-white/5 rounded-xl p-3 border border-white/10 text-left space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium">Pronunciation &amp; Umlauts (ä, ö, ü)</span>
                        <span className="text-emerald-400 font-black">98.4% Accuracy</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-400 rounded-full w-[98%]" />
                      </div>
                      <div className="text-[10px] text-indigo-200 font-mono flex items-center justify-between pt-0.5">
                        <span>Pitch Contour: Normal</span>
                        <span>Tempo: 1.1x Fluent</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Two-Way Conversation Dialogue Stream */}
                  <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[320px] bg-slate-900/90 rounded-2xl p-5 border border-indigo-500/20">
                    <div className="space-y-3.5">
                      
                      {/* Student Voice Prompt Bubble */}
                      <div className="flex items-start gap-2.5 justify-end">
                        <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs max-w-md shadow-md text-xs sm:text-sm">
                          <div className="flex items-center justify-between gap-2 text-[10px] text-indigo-200 font-bold mb-1">
                            <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Voice Input (Doctor Track)</span>
                            <span>Just now</span>
                          </div>
                          "Wie leite ich das Anamnesegespräch bei akuten Brustschmerzen im Krankenhaus professionell ein?"
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                          YOU
                        </div>
                      </div>

                      {/* AI Real-Time Structured Response Bubble */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <div className="bg-slate-800 text-slate-100 p-3.5 rounded-2xl rounded-tl-xs max-w-lg shadow-md border border-slate-700 text-xs sm:text-sm space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold">
                            <span className="flex items-center gap-1"><Volume2 className="w-3 h-3 text-emerald-400" /> IntelliCoach AI (Audio Playback Active)</span>
                            <span>German Medical FSP Protocol</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed">
                            "Guten Tag! Verwenden Sie folgenden Standarddialog: <strong className="text-emerald-300">‚Guten Tag, Herr Müller. Ich bin der Stationsarzt. Seit wann bestehen diese stechenden Schmerzen in der Brust?‘</strong>"
                          </p>
                          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-[11px] text-indigo-200 font-mono">
                            💡 <strong>Phonetic Tip:</strong> Betonung auf <em>‚tho-ra-kal‘</em> • Höfliche Distanz mit Konjunktiv II wahren.
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Interactive Prompt Pills */}
                    <div className="pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap mt-3">
                      <span className="text-[10px] font-bold text-slate-400">Quick Simulation Prompts:</span>
                      <button 
                        onClick={() => openCourseDemo('FSP Medical Simulation')}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30 transition-all cursor-pointer"
                      >
                        🩺 Hospital Anamnesis
                      </button>
                      <button 
                        onClick={() => openCourseDemo('Telc B2 Oral Exam')}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30 transition-all cursor-pointer"
                      >
                        🎙️ Telc B2 Oral Simulation
                      </button>
                      <button 
                        onClick={() => openCourseDemo('Engineering DIN Defense')}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30 transition-all cursor-pointer"
                      >
                        ⚙️ DIN / VDI Tech Defense
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Detailed Content Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">24/7 Availability &amp; Dynamic Pacing</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Zero waiting queues. Instant doubt solving day or night with intelligent pacing that speeds up for fast learners and provides patient remedial drills for complex topics ("Speed for Speed, Slow for Slow").
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Human-Like Interactive Depth</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Conversational voice engines analyze speech phonetics, pronunciation accuracy, German umlauts (ä, ö, ü), and pitch contour in real time, delivering instant feedback like an elite native speech coach.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Industrial &amp; Workplace Education</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Curricula directly customized for real-world employment—including Engineering, IT Cloud, Medical Licensing (DemTest/FSP), and Trade vocations aligned with European industrial standards.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Multilingual Translation &amp; Grammar</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Seamless cross-language translation explaining grammatical case laws (Nominativ, Akkusativ, Dativ, Genitiv), verb placement rules (Kausalsätze, Nebensätze), and contextual colloquialisms.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Integrated 'Ila's With You' Companion</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Includes dedicated visa pathway checklists, blocked bank account verification, relocation mentorship, and verified work-while-learn job recommendations with monthly stipend pathways.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Long-Term Educational Partnership</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Lifetime learning continuity. Alumni receive automated knowledge base upgrades, annual certification refreshes, and direct European enterprise recruitment matching.
                  </p>
                </div>

              </div>

              {/* Interactive CTA Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-indigo-500/20 bg-indigo-950/40 -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-6 sm:p-8 rounded-b-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-indigo-200">
                    IntelliCoach AI is online and ready for simulation sessions.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => openCourseDemo('IntelliCoach AI')} 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-indigo-500/40 cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Speak with IntelliCoach (AI Live Session)</span>
                  </button>
                  <button 
                    onClick={() => navigateTo('#ilas-with-you')} 
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-white/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Ila's With You Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: VIDEO + AI™ */}
          <div 
            id="method-video-ai" 
            className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] shrink-0">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-rose-600">Section 2 • Smart Visual Streaming</div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">Video + AI™ Interactive Streams</h3>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">Real-Time In-Stream Answering &amp; Synchronized Multilingual Video Lectures</div>
                </div>
              </div>

              <button 
                onClick={() => openCourseDemo('Video + AI Stream')}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all border border-rose-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Watch Video + AI Demo</span>
              </button>
            </div>

            {/* RICH PICTORIAL MOCKUP: VIDEO + AI™ PLAYBACK SCREEN & LIVE DOUBT-SOLVING SIDE-PANEL */}
            <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 border border-rose-500/30 shadow-2xl mb-8 overflow-hidden text-white">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3.5 mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                    Synchronized Video Player &amp; In-Stream AI Voice Assistant
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  Lecture 04 • Complex Sentence Inversion (Weil vs Denn)
                </span>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left: Video Playback Screen Interface (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                  {/* Video Viewport Stage */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col justify-between p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded">
                        1080p HD Live Lecture
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                        04:18 / 18:30
                      </span>
                    </div>

                    {/* In-Video Lesson Chalkboard Graphics */}
                    <div className="text-center my-auto p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                      <div className="text-[11px] font-black uppercase tracking-widest text-rose-400 mb-1">
                        Grammatik Regel #04 • Kausalsatz
                      </div>
                      <div className="text-base sm:text-lg font-black text-white font-mono">
                        "Ich lerne Deutsch, <span className="text-amber-400 underline decoration-rose-500 underline-offset-4 font-extrabold">weil</span> ich in Deutschland arbeiten <span className="text-rose-400 font-extrabold bg-rose-500/20 px-1 rounded">möchte</span>."
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Rule: 'Weil' forces the conjugated modal verb to the very end.
                      </div>
                    </div>

                    {/* Subtitle Bar */}
                    <div className="text-center bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                      🎙️ "...daher steht das konjugierte Verb immer an der letzten Position des Nebensatzes."
                    </div>
                  </div>

                  {/* Video Scrubber & Playback Controls */}
                  <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs font-bold transition-all">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-300">1.25x Speed</span>
                    </div>

                    {/* Timeline Scrubber with Timestamp markers */}
                    <div className="flex-1 mx-2 relative flex items-center">
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-[24%]" />
                      </div>
                      <div className="absolute left-[24%] w-3 h-3 rounded-full bg-white shadow-md -translate-x-1/2" />
                    </div>

                    <button 
                      onClick={() => openCourseDemo('Video + AI Stream')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-all"
                    >
                      Ask AI at 04:18
                    </button>
                  </div>
                </div>

                {/* Right: Integrated AI Doubt-Solving Side-Panel (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-5 border border-rose-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                        <HelpCircle className="w-4 h-4 text-rose-400" />
                        <span>Instant Doubt Assistant</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Voice AI Connected
                      </span>
                    </div>

                    {/* Live Synchronized Doubt Exchange */}
                    <div className="space-y-3 text-xs">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 flex items-center justify-between mb-1">
                          <span className="text-rose-400 font-bold">🎙️ Voice Query (at 04:12)</span>
                          <span>Auto-Transcribed</span>
                        </div>
                        <p className="text-slate-200">
                          "Why did 'möchte' jump to the end instead of staying at position 2?"
                        </p>
                      </div>

                      <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-500/30 space-y-1.5">
                        <div className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>AI Instant Grammar Resolution:</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          Because <strong className="text-rose-300">'weil'</strong> is a subordinating conjunction (Kausale Subjunktion). Unlike <strong className="text-amber-300">'denn'</strong> (which keeps normal position 2), 'weil' sends the finite verb to the sentence coda.
                        </p>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-rose-500/20">
                          📌 <strong>Bookmark created:</strong> Review at timestamp 04:12 before oral test.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voice / Text Ask Input */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm">
                      <Mic className="w-4 h-4" />
                    </button>
                    <input 
                      type="text" 
                      placeholder="Ask any doubt about this lecture..." 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-rose-500"
                    />
                    <button className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 cursor-pointer">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                <h4 className="font-black text-slate-900 text-base mb-2">In-Stream Real-Time Q&amp;A</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pause any video at any timestamp and ask context-aware questions. The AI references the exact slide frame and lecture transcript to deliver pinpoint explanations instantly.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                <h4 className="font-black text-slate-900 text-base mb-2">Synchronized Word Transcripts</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Full transcript synchronization with real-time word highlighting. Click any foreign phrase or technical term inside the subtitles for instant phonetic breakdown and grammar context.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                <h4 className="font-black text-slate-900 text-base mb-2">AI Bookmarks &amp; Rapid Recaps</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Automatically extracts core milestone summaries and generates 3-minute rapid review audio recaps for busy professionals revising for Goethe or IELTS certifications.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: SMART SLIDE + AI™ */}
          <div 
            id="method-slide-ai" 
            className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-100 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-[0_0_25px_rgba(245,158,11,0.4)] shrink-0">
                  <Layers className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-600">Section 3 • Visual Knowledge Intelligence</div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">Smart Slide + AI™</h3>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">Multimodal Visual Knowledge Decks, Formula Maps &amp; Adaptive Flashcards</div>
                </div>
              </div>

            {/* RICH PICTORIAL MOCKUP: SMART SLIDE + AI™ VISUAL KNOWLEDGE DECK & AI MICRO-DRILL ENGINE */}
            <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-2xl mb-8 overflow-hidden text-white">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3.5 mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Interactive Smart Slide Deck &amp; Adaptive AI Micro-Drill Engine
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  Slide 08 / 24 • Wechselpräpositionen (Dual-Case Prepositions)
                </span>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left: Smart Slide Visual Presentation Deck (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                  
                  {/* Slide Canvas Body */}
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 flex-1 flex flex-col justify-between">
                    
                    {/* Slide Top Metadata */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                          Grammar Matrix A2–B1
                        </span>
                        <span className="text-xs font-bold text-slate-200">Wechselpräpositionen Decision Tree</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">9 Prepositions: an, auf, in, neben...</span>
                    </div>

                    {/* Visual Comparison Matrix Diagram */}
                    <div className="grid grid-cols-2 gap-4 my-5">
                      {/* Akkusativ Column */}
                      <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-rose-300 font-black text-xs mb-1.5">
                            <span>🏃 AKKUSATIV</span>
                            <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-200 font-mono">Wohin?</span>
                          </div>
                          <div className="text-[11px] text-slate-300 font-semibold mb-2">Dynamic Movement / Change of Place</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2.5 border border-rose-500/20 text-[11px] font-mono text-slate-100">
                          "Ich lege das Buch <br />
                          <span className="text-rose-400 font-bold bg-rose-500/20 px-1 rounded">auf den Tisch</span>."
                          <div className="text-[9px] text-rose-300/80 mt-1">der Tisch ➔ den Tisch</div>
                        </div>
                      </div>

                      {/* Dativ Column */}
                      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-indigo-300 font-black text-xs mb-1.5">
                            <span>📍 DATIV</span>
                            <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 font-mono">Wo?</span>
                          </div>
                          <div className="text-[11px] text-slate-300 font-semibold mb-2">Static Location / Fixed Position</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2.5 border border-indigo-500/20 text-[11px] font-mono text-slate-100">
                          "Das Buch liegt <br />
                          <span className="text-indigo-400 font-bold bg-indigo-500/20 px-1 rounded">auf dem Tisch</span>."
                          <div className="text-[9px] text-indigo-300/80 mt-1">der Tisch ➔ dem Tisch</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Micro-Drill Banner inside Slide */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-xs">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-amber-200 font-medium text-[11px]">
                          <strong>Micro-Drill Prompt:</strong> Wohin stellst du das Glas? (auf + das / dem?)
                        </span>
                      </div>
                      <button 
                        onClick={() => openCourseDemo('Smart Slide + AI Deck')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0"
                      >
                        Solve Drill
                      </button>
                    </div>

                  </div>

                  {/* Slide Navigation Controls */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] font-bold flex items-center gap-1">
                        <ChevronLeft className="w-3.5 h-3.5" /> Prev
                      </button>
                      <button className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] font-bold flex items-center gap-1">
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <span>Card 08 of 24</span>
                      <span className="text-amber-400">• High-Yield Concept</span>
                    </div>
                    <button 
                      onClick={() => openCourseDemo('Anki Smart Flashcards')}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Export to Anki / PDF
                    </button>
                  </div>

                </div>

                {/* Right: Text-Based AI Co-Pilot & Micro-Drill Assistant (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-5 border border-amber-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <Bot className="w-4 h-4 text-amber-400" />
                        <span>AI Micro-Drill &amp; Rule Evaluator</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Adaptive Spaced Learning
                      </span>
                    </div>

                    {/* Active AI Dialogue & Drill Evaluation */}
                    <div className="space-y-3 text-xs">
                      
                      {/* Student Text Input */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 flex items-center justify-between mb-1">
                          <span className="text-amber-400 font-bold">📝 Student Response (Drill #08)</span>
                          <span className="text-emerald-400 font-mono font-bold">100% Score</span>
                        </div>
                        <p className="text-slate-200 font-mono text-[11px]">
                          "Ich stelle das Glas <strong className="text-rose-400">auf den Tisch</strong>, weil es eine Richtungsbewegung (Wohin) ist."
                        </p>
                      </div>

                      {/* AI Structured Evaluation */}
                      <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/30 space-y-2">
                        <div className="text-[10px] text-amber-300 font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>AI Rule Verification: Ausgezeichnet!</span>
                          </span>
                          <span className="text-slate-400">CEFR B1 Check</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          Correct! <strong>'Stellen'</strong> is a transitive action verb requiring <strong>Akkusativ</strong> (Wohin). If the glass were already standing there, you would use <em>'Das Glas steht auf dem Tisch (Dativ)'</em>.
                        </p>
                        <div className="p-2 rounded-lg bg-black/40 border border-amber-500/20 text-[10px] text-amber-200 font-mono">
                          🧠 <strong>Memory Mnemonic:</strong> Position (Hängen, Liegen, Stehen, Sitzen) = <em>DATIV</em>. Action (Hängen, Legen, Stellen, Setzen) = <em>AKKUSATIV</em>.
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Micro-Drill Interaction Input */}
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Type answer or ask rule question..." 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-500"
                      />
                      <button className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 cursor-pointer shadow-md">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
                      <button 
                        onClick={() => openCourseDemo('Generate 5 Drills')}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 shrink-0 cursor-pointer"
                      >
                        ⚡ 5-Question Drill
                      </button>
                      <button 
                        onClick={() => openCourseDemo('Medical Slide Case')}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 shrink-0 cursor-pointer"
                      >
                        🩺 Medical Case Slide
                      </button>
                      <button 
                        onClick={() => openCourseDemo('Tech VDI Formula')}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 shrink-0 cursor-pointer"
                      >
                        ⚙️ Tech Formula Map
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                <h4 className="font-black text-slate-900 text-base mb-2">Cognitive Visual Decks</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  High-retention visual slide decks loaded with intuitive infographics, comparison matrices, and step-by-step grammatical decision trees designed for cognitive ease.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                <h4 className="font-black text-slate-900 text-base mb-2">Automated AI Flashcards</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Transforms module highlights into interactive smart flashcards using the Ebbinghaus forgetting curve algorithm to reinforce vocabulary and technical definitions just before memory decays.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                <h4 className="font-black text-slate-900 text-base mb-2">Exportable Revision Sheets</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  One-click generation of printable PDF cheatsheets, formula summaries, and German exam checklists for on-the-go revision without digital fatigue.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: HIGHLY SKILLED HUMAN TUTORS & LIVE FACULTY */}
          <div 
            id="method-human-tutors" 
            className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] shrink-0">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-600">Section 4 • Native Academic Faculty</div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">Highly Skilled Human Tutors &amp; Live Faculty</h3>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">1-to-1 &amp; 1-to-Group Traditional &amp; Expert Training with Native European Educators</div>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Goethe &amp; Telc Certified Faculty
              </span>
            </div>

            {/* RICH PICTORIAL MOCKUP: LIVE FACULTY 1-ON-1 CLASSROOM & DIGITAL PERFORMANCE TRACKING */}
            <div className="bg-slate-950 rounded-3xl p-5 sm:p-7 border border-emerald-500/30 shadow-2xl mb-8 overflow-hidden text-white">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3.5 mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    Live 1-to-1 &amp; Group Masterclass Cockpit with Native Faculty
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Goethe &amp; Telc Certified Native Examiners
                </span>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left: Live Classroom Video Stream & Digital Whiteboard (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    {/* Live Stream Viewport */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/* Main Instructor Video Tile */}
                      <div className="col-span-2 relative aspect-video bg-gradient-to-br from-slate-800 to-indigo-950 rounded-xl overflow-hidden border border-emerald-500/40 p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
                            Senior Faculty • LIVE
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div className="text-center my-auto">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 mx-auto flex items-center justify-center font-black text-sm">
                            JM
                          </div>
                          <div className="text-xs font-black text-white mt-1">Dr. Johannes Meier</div>
                          <div className="text-[10px] text-emerald-300 font-medium">Head of Goethe Examiner Board (Munich)</div>
                        </div>
                        <div className="text-[9px] text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md self-start">
                          🎙️ Active Microphone (HD 60fps)
                        </div>
                      </div>

                      {/* Student Video Tile 1 */}
                      <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 p-2.5 flex flex-col justify-between">
                        <span className="text-[8px] font-bold text-slate-300 bg-black/60 px-1.5 py-0.5 rounded self-start">
                          Dr. Ananya (FSP)
                        </span>
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white mx-auto flex items-center justify-center text-[10px] font-bold">
                          AN
                        </div>
                        <div className="text-[8px] text-emerald-400 font-bold text-center">Speaking Active</div>
                      </div>
                    </div>

                    {/* Shared Live Digital Whiteboard */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
                      <div className="text-[10px] text-slate-400 font-bold mb-1 flex items-center justify-between">
                        <span>Live Whiteboard Live Correction:</span>
                        <span className="text-emerald-400">Synced Real-Time</span>
                      </div>
                      <div className="text-slate-200">
                        <span className="text-slate-500 line-through">"Seit wann Sie haben Schmerzen?"</span> <br />
                        <span className="text-emerald-400 font-bold">➔ "Seit wann haben Sie diese Schmerzen?" (Inversion rule)</span>
                      </div>
                    </div>
                  </div>

                  {/* Classroom Status Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Class Session 08 / 12 • 45 Mins Remaining</span>
                    <button 
                      onClick={() => openCourseDemo('Live Masterclass')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Join Live Simulation
                    </button>
                  </div>
                </div>

                {/* Right: Digital Performance Tracking & Mentorship Cockpit (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>Examiner Digital Audit</span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        CEFR Ready
                      </span>
                    </div>

                    {/* Performance Metrics Box */}
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400 font-bold">Oral Fluency</div>
                          <div className="text-base font-black text-emerald-400 mt-0.5">94 / 100</div>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400 font-bold">Grammar Accuracy</div>
                          <div className="text-base font-black text-emerald-400 mt-0.5">96 / 100</div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <div className="text-[10px] text-emerald-400 font-bold">
                          Faculty Mentor Note:
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          "Excellent command of clinical vocabulary. Spontaneous dialogue was fluid. Ready for official Goethe B2 and medical Approbation exam registration."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 1-on-1 Booking CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button 
                      onClick={() => navigateTo('#applications?tab=Mentorship')}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md text-center cursor-pointer"
                    >
                      Book 1-on-1 Certified Examiner Slot
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h4 className="font-black text-slate-900 text-base mb-2">1-to-1 Intensive Mentorship</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Dedicated private sessions with certified native German examiners to target individual pronunciation weaknesses, hone spontaneous debate skills, and ace mock oral interviews.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h4 className="font-black text-slate-900 text-base mb-2">Interactive Masterclasses</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Collaborative group workshops with structured peer dialogues, workplace simulations, case study presentations, and live Q&amp;A reviews directly led by senior university lecturers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h4 className="font-black text-slate-900 text-base mb-2">Qualitative Essay Audits</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Detailed human evaluation of written homework and essays with line-by-line annotations, syntax restructuring tips, and official exam scoring rubrics.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: CAMP CLASSES & ON-SITE SPOT CLASSES */}
          <div 
            id="method-camps-onsite" 
            className="scroll-mt-28 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
                    <Flame className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-cyan-400">Section 5 • Immersive Physical &amp; Campus Execution</div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Camp Classes &amp; On-Site Spot Classes</h3>
                    <div className="text-xs sm:text-sm text-cyan-200 font-medium">Public Mega-Camps, Institutional Campus Bookings &amp; Direct Execution</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
                    Mega-Camp Immersion
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
                    On-Site University Delivery
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Public Mega-Camp Immersion</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    High-intensity multi-day residential language and skill bootcamps. Total immersion in German conversational environments designed for rapid breakthroughs before flight departure.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Institutional Campus Bookings</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Customized training programs deployed directly onto university and engineering college campuses, aligning entire student cohorts with international global job prerequisites.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">Direct On-Site Spot Classes</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Physical faculty deployment with certified courseware kits, live proctored examination desks, and structured modular execution hosted directly at partner institutions.
                  </p>
                </div>
              </div>

              {/* Institutional Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-cyan-500/20 bg-slate-950/40 -mx-8 -mb-8 sm:-mx-12 sm:-mb-12 p-6 sm:p-8 rounded-b-3xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs sm:text-sm font-bold text-cyan-200">
                    Are you a school, university, or enterprise institution? Book an on-site training program today.
                  </span>
                </div>
                <button 
                  onClick={() => navigateTo('#applications?tab=Corporate')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-cyan-500/40 cursor-pointer flex items-center gap-2"
                >
                  <span>Book Mega-Camp / Campus Training</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </section>

      </div>
  );
}
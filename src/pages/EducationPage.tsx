import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Star, BrainCircuit, Play, ArrowRight, Zap, MessageCircle,
  Crown, Briefcase, GraduationCap, Gift, Code,
  Layers, BookOpen, Search, CheckCircle2, LayoutGrid, List,
  Filter, Sparkles, Clock, Award, ChevronRight, ChevronLeft, Eye, ShieldCheck,
  Building2, Users, FileText, ExternalLink, Bot, Video, Flame,
  Globe, Headphones, UserCheck, MapPin, Laptop, MessageSquare, Compass,
  Stethoscope, Languages, Target, Mic, Volume2, Send, HelpCircle, Radio,
  FolderPlus, Tag
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

export interface RealTimeLearningPathConfig {
  id: string;
  code: string;
  name: string;
  badge: string;
  specialty: string;
  desc: string;
  methods: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  borderActive: string;
  badgeBg: string;
  accentColor: string;
  features: string[];
  targetSectionId: string;
  demoName: string;
  fee: string;
  stagePricing: Record<string, string>;
}

export const realTimeLearningPaths: RealTimeLearningPathConfig[] = [
  {
    id: 'intelli-coach-ai',
    code: 'PTH-AI-101',
    name: 'IntelliCoach AI Adaptive Path',
    badge: '24/7 Autonomous AI Engine',
    specialty: 'Acoustic Phonetics, Real-time Accent Coach & Instant CEFR Level Jumps',
    desc: 'Self-paced 24/7 AI doubt-solving, acoustic accent tuning, and dynamic oral mock examiner simulations with zero scheduled batch constraints.',
    methods: 'IntelliCoach AI (Adaptive Speech + Diagnostic Pacing)',
    icon: BrainCircuit,
    color: 'from-indigo-600 to-violet-600',
    gradient: 'from-indigo-600 via-blue-600 to-violet-700',
    borderActive: 'border-indigo-500 ring-2 ring-indigo-400/40 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/20',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: 'text-indigo-600',
    features: [
      '24/7 Acoustic Phonetics & Speech Analyzer',
      'Autonomous CEFR Benchmark Diagnostic Jumps',
      'Unlimited Goethe / Telc Oral Simulations',
      'Dynamic Syllabus Pacing with Zero Wait Time'
    ],
    targetSectionId: 'method-intellicoach',
    demoName: 'IntelliCoach AI Speech Trainer',
    fee: '$799',
    stagePricing: {
      'A1': '$129',
      'A2': '$149',
      'B1': '$179',
      'B2': '$219',
      'C1': '$269',
      'C2': '$319',
      'A1-C2 Package': '$799'
    }
  },
  {
    id: 'video-ai',
    code: 'PTH-VID-102',
    name: 'Video + AI',
    badge: 'Smart Blended Stream',
    specialty: 'High-Definition Video Labs + Timestamp Synchronized AI Answering Stream',
    desc: 'Interactive pre-recorded masterclasses with an embedded AI answering copilot that responds instantly to student queries at any video timestamp.',
    methods: 'Video Masterclass + Interactive AI Answering Stream',
    icon: Video,
    color: 'from-rose-600 to-pink-600',
    gradient: 'from-rose-600 via-pink-600 to-red-600',
    borderActive: 'border-rose-500 ring-2 ring-rose-400/40 bg-gradient-to-br from-rose-50/40 via-white to-pink-50/20',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    accentColor: 'text-rose-600',
    features: [
      'High-Definition European Faculty Masterclasses',
      'Timestamp Synchronized AI Doubt Solver',
      'Interactive Grammar Practice Workbooks',
      'Official Goethe Assessment Drills'
    ],
    targetSectionId: 'method-video-ai',
    demoName: 'Interactive Video Lab Stream',
    fee: '$699',
    stagePricing: {
      'A1': '$99',
      'A2': '$119',
      'B1': '$149',
      'B2': '$189',
      'C1': '$229',
      'C2': '$279',
      'A1-C2 Package': '$699'
    }
  },
  {
    id: 'slide-ai',
    code: 'PTH-SLD-103',
    name: 'Slide + AI',
    badge: 'Visual Knowledge Decks',
    specialty: 'Synchronized Book & Slide Architecture + Automated AI Micro-Drills',
    desc: 'Designed for visual and analytical learners: side-by-side synchronized slides, grammatical formula cheat-sheets, vocabulary mindmaps, and instant micro-drills.',
    methods: 'Smart Slide Decks + Formula Maps & AI Micro-Drill Sync',
    icon: Layers,
    color: 'from-amber-600 to-yellow-600',
    gradient: 'from-amber-600 via-orange-600 to-yellow-600',
    borderActive: 'border-amber-500 ring-2 ring-amber-400/40 bg-gradient-to-br from-amber-50/40 via-white to-yellow-50/20',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    accentColor: 'text-amber-600',
    features: [
      'Side-by-Side Synchronized Slide & Book View',
      'Visual Grammar Formula Maps & Mindmaps',
      'Digital Flashcard Recall Vault',
      'Instant Automated Knowledge Check Drills'
    ],
    targetSectionId: 'method-slide-ai',
    demoName: 'Smart Slide + AI Deck',
    fee: '$649',
    stagePricing: {
      'A1': '$89',
      'A2': '$109',
      'B1': '$139',
      'B2': '$179',
      'C1': '$219',
      'C2': '$259',
      'A1-C2 Package': '$649'
    }
  },
  {
    id: '1-to-1-online',
    code: 'PTH-1TO1-104',
    name: '1-to-1 Online',
    badge: 'Private VIP Mentorship',
    specialty: 'Dedicated 1-on-1 Native Faculty Coaching & Tailored Oral Interview Defense',
    desc: 'Maximized individualized focus with certified native German faculty. Bespoke curriculum pacing, specialized hospital or tech vocabulary, and rigorous mock exams.',
    methods: 'Live 1-on-1 Dialogue & Tailored Oral Exam Defense',
    icon: UserCheck,
    color: 'from-emerald-600 to-teal-600',
    gradient: 'from-emerald-600 via-teal-600 to-green-700',
    borderActive: 'border-emerald-500 ring-2 ring-emerald-400/40 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'text-emerald-600',
    features: [
      'Dedicated Certified Native European Examiner',
      '100% Customized Speed & Sector Vocabulary',
      'Direct Visa & Employer Interview Defense',
      'Flexible Personalized Schedule Alignment'
    ],
    targetSectionId: 'method-human-tutors',
    demoName: '1-to-1 Native Mentor Consultation',
    fee: '$1,299',
    stagePricing: {
      'A1': '$219',
      'A2': '$249',
      'B1': '$299',
      'B2': '$349',
      'C1': '$419',
      'C2': '$499',
      'A1-C2 Package': '$1,299'
    }
  },
  {
    id: '1-to-group-online',
    code: 'PTH-GRP-105',
    name: '1-to-Group Online',
    badge: 'Interactive Live Cohort',
    specialty: 'Live Interactive Virtual Classrooms, Peer Debates & Native Faculty Moderation',
    desc: 'Thrive in a high-energy, collaborative virtual classroom. Practice real-world dialogues, group project presentations, and debate sessions under native teacher guidance.',
    methods: 'Interactive Live Virtual Cohorts (Small Group)',
    icon: Users,
    color: 'from-blue-600 to-indigo-600',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-600',
    borderActive: 'border-blue-500 ring-2 ring-blue-400/40 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/20',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: 'text-blue-600',
    features: [
      'Interactive Small-Group Virtual Classrooms',
      'Collaborative Peer Debates & Group Speaking',
      'Structured Morning, Evening & Weekend Batches',
      'Certified Native European Faculty Mentorship'
    ],
    targetSectionId: 'method-human-tutors',
    demoName: 'Group Live Classroom Simulation',
    fee: '$899',
    stagePricing: {
      'A1': '$149',
      'A2': '$179',
      'B1': '$219',
      'B2': '$269',
      'C1': '$329',
      'C2': '$399',
      'A1-C2 Package': '$899'
    }
  },
  {
    id: 'camp-classes',
    code: 'PTH-CMP-106',
    name: 'Camp Classes',
    badge: 'Physical Mega-Camp',
    specialty: 'High-Intensity Immersive Physical Camps & Rapid Certification Sprints',
    desc: 'Accelerate language proficiency through physical immersion bootcamps. Features intensive weekend or 3-week physical sprints, interactive workshops, and in-person faculty feedback.',
    methods: 'Physical Mega-Camp (Full Immersion Sprint)',
    icon: Flame,
    color: 'from-cyan-600 to-blue-600',
    gradient: 'from-cyan-600 via-blue-600 to-teal-600',
    borderActive: 'border-cyan-500 ring-2 ring-cyan-400/40 bg-gradient-to-br from-cyan-50/40 via-white to-blue-50/20',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    accentColor: 'text-cyan-600',
    features: [
      'Total Physical Language Immersion Environment',
      'Rapid Multi-Stage Certification Bootcamps',
      'Hands-On Practical Clinical & Technical Labs',
      'Direct In-Person Faculty Guidance & Drills'
    ],
    targetSectionId: 'method-camps-onsite',
    demoName: 'Mega-Camp Immersion Walkthrough',
    fee: '$999',
    stagePricing: {
      'A1': '$169',
      'A2': '$199',
      'B1': '$239',
      'B2': '$289',
      'C1': '$349',
      'C2': '$429',
      'A1-C2 Package': '$999'
    }
  },
  {
    id: 'spot-classes',
    code: 'PTH-SPT-107',
    name: 'Spot Classes',
    badge: 'On-Site Campus Delivery',
    specialty: 'Direct In-Person Instruction at Partner Universities & Corporate Campuses',
    desc: 'Brings elite language education directly onto college campuses and corporate partner offices. Seamlessly integrated with university schedules and degree requirements.',
    methods: 'On-Site Institutional & Corporate Spot Delivery',
    icon: Building2,
    color: 'from-purple-600 to-fuchsia-600',
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
    borderActive: 'border-purple-500 ring-2 ring-purple-400/40 bg-gradient-to-br from-purple-50/40 via-white to-fuchsia-50/20',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    accentColor: 'text-purple-600',
    features: [
      'Direct On-Campus Academic Delivery',
      'University Credit & Exam Center Integration',
      'Corporate Shift & Department Scheduling',
      'In-Person Mock Test & Paper Review Centers'
    ],
    targetSectionId: 'method-camps-onsite',
    demoName: 'Campus On-Site Delivery Preview',
    fee: '$949',
    stagePricing: {
      'A1': '$159',
      'A2': '$189',
      'B1': '$229',
      'B2': '$279',
      'C1': '$339',
      'C2': '$409',
      'A1-C2 Package': '$949'
    }
  }
];

export const formatLearningPathFromBackend = (
  dbPath: GlobalPath,
  index: number = 0
): RealTimeLearningPathConfig => {
  const normName = (dbPath.name || '').toLowerCase();
  const matchedPreset = realTimeLearningPaths.find(
    preset => preset.name.toLowerCase() === normName ||
              (dbPath.code && preset.code.toLowerCase() === dbPath.code.toLowerCase()) ||
              (dbPath.id && preset.id.toLowerCase() === dbPath.id.toLowerCase())
  );

  const fallbackIcons = [BrainCircuit, Video, BookOpen, UserCheck, Users, Flame, Building2, Layers];
  const icon = matchedPreset?.icon || fallbackIcons[index % fallbackIcons.length];

  const defaultPricing: Record<string, string> = {
    'A1': '$129',
    'A2': '$149',
    'B1': '$179',
    'B2': '$219',
    'C1': '$269',
    'C2': '$319',
    'A1-C2 Package': '$799'
  };

  const deliveryMethod = dbPath.methods || matchedPreset?.methods || 'Live AI Adaptive';

  return {
    id: dbPath.id,
    code: dbPath.code || `PTH-${101 + index}`,
    name: dbPath.name, // EXACT primary path title from backend
    badge: deliveryMethod,
    specialty: dbPath.remarks || matchedPreset?.specialty || `${dbPath.name} delivered via ${deliveryMethod} with structured milestone scoring.`,
    desc: dbPath.remarks || matchedPreset?.desc || `Comprehensive curriculum designed for accelerated mastery, led by certified faculty and smart diagnostic tools.`,
    methods: deliveryMethod, // EXACT Training Method from backend
    icon,
    color: matchedPreset?.color || 'from-indigo-600 to-blue-600',
    gradient: matchedPreset?.gradient || 'from-indigo-600 via-blue-600 to-violet-700',
    borderActive: matchedPreset?.borderActive || 'border-brand-500 ring-2 ring-brand-400/40 bg-gradient-to-br from-brand-50/40 via-white to-blue-50/20',
    badgeBg: matchedPreset?.badgeBg || 'bg-brand-50 text-brand-700 border-brand-200',
    accentColor: matchedPreset?.accentColor || 'text-brand-600',
    features: matchedPreset?.features || [
      deliveryMethod,
      'Official CEFR Diagnostic Benchmarks',
      'Milestone Feedback & Mock Scoring',
      'Direct Certificate & Placement Ready'
    ],
    targetSectionId: matchedPreset?.targetSectionId || 'curriculum-framework',
    demoName: `${dbPath.name} - ${deliveryMethod} Preview`,
    fee: dbPath.fee || matchedPreset?.fee || '$799',
    stagePricing: (dbPath.stagePricing && Object.keys(dbPath.stagePricing).length > 0) ? dbPath.stagePricing : (matchedPreset?.stagePricing || defaultPricing)
  };
};

type SubNavBlockId = 'german' | 'ielts' | 'software-tech' | 'medical' | 'job-related';

const getCategoryVisuals = (catName: string) => {
  const lower = (catName || '').toLowerCase();
  if (lower.includes('lang') || lower.includes('german') || lower.includes('foreign') || lower.includes('edu')) {
    return {
      icon: Languages,
      tagline: 'Foreign Languages & CEFR',
      activeBg: 'bg-gradient-to-br from-blue-50/95 via-sky-50/80 to-indigo-50/50 border-2 border-blue-500 shadow-md ring-2 ring-blue-400/30',
      activeRing: 'ring-blue-400/50',
      accentText: 'text-blue-600',
      activeText: 'text-blue-950',
      activeTagline: 'text-blue-700 font-bold',
      accentBorder: 'border-blue-200/90',
      accentHoverBorder: 'hover:border-blue-500',
      accentGlow: 'hover:shadow-[0_8px_30px_rgba(37,99,235,0.18)]',
      iconBg: 'bg-blue-50 text-blue-600',
      bottomLine: 'from-blue-600 via-indigo-600 to-blue-600'
    };
  }
  if (lower.includes('soft') || lower.includes('it') || lower.includes('tech') || lower.includes('code')) {
    return {
      icon: Code,
      tagline: 'Full-Stack, Cloud & DevOps',
      activeBg: 'bg-gradient-to-br from-cyan-50/95 via-sky-50/80 to-blue-50/50 border-2 border-cyan-500 shadow-md ring-2 ring-cyan-400/30',
      activeRing: 'ring-cyan-400/50',
      accentText: 'text-cyan-600',
      activeText: 'text-cyan-950',
      activeTagline: 'text-cyan-700 font-bold',
      accentBorder: 'border-cyan-200/90',
      accentHoverBorder: 'hover:border-cyan-500',
      accentGlow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)]',
      iconBg: 'bg-cyan-50 text-cyan-600',
      bottomLine: 'from-cyan-600 via-sky-600 to-blue-600'
    };
  }
  if (lower.includes('sap') || lower.includes('enterprise') || lower.includes('erp')) {
    return {
      icon: Layers,
      tagline: 'SAP S/4HANA & ERP',
      activeBg: 'bg-gradient-to-br from-indigo-50/95 via-violet-50/80 to-purple-50/50 border-2 border-indigo-500 shadow-md ring-2 ring-indigo-400/30',
      activeRing: 'ring-indigo-400/50',
      accentText: 'text-indigo-600',
      activeText: 'text-indigo-950',
      activeTagline: 'text-indigo-700 font-bold',
      accentBorder: 'border-indigo-200/90',
      accentHoverBorder: 'hover:border-indigo-400',
      accentGlow: 'hover:shadow-[0_8px_30px_rgba(99,102,241,0.18)]',
      iconBg: 'bg-indigo-50 text-indigo-600',
      bottomLine: 'from-indigo-600 via-purple-600 to-indigo-600'
    };
  }
  if (lower.includes('market') || lower.includes('growth') || lower.includes('digital')) {
    return {
      icon: Zap,
      tagline: 'Performance & Growth',
      activeBg: 'bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-yellow-50/50 border-2 border-amber-500 shadow-md ring-2 ring-amber-400/30',
      activeRing: 'ring-amber-400/50',
      accentText: 'text-amber-600',
      activeText: 'text-amber-950',
      activeTagline: 'text-amber-700 font-bold',
      accentBorder: 'border-amber-200/90',
      accentHoverBorder: 'hover:border-amber-500',
      accentGlow: 'hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)]',
      iconBg: 'bg-amber-50 text-amber-600',
      bottomLine: 'from-amber-500 via-orange-500 to-amber-600'
    };
  }
  if (lower.includes('health') || lower.includes('clinic') || lower.includes('med')) {
    return {
      icon: Stethoscope,
      tagline: 'FSP, KP & Medical Clinical',
      activeBg: 'bg-gradient-to-br from-emerald-50/95 via-teal-50/80 to-green-50/50 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-400/30',
      activeRing: 'ring-emerald-400/50',
      accentText: 'text-emerald-600',
      activeText: 'text-emerald-950',
      activeTagline: 'text-emerald-700 font-bold',
      accentBorder: 'border-emerald-200/90',
      accentHoverBorder: 'hover:border-emerald-500',
      accentGlow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]',
      iconBg: 'bg-emerald-50 text-emerald-600',
      bottomLine: 'from-emerald-600 via-teal-600 to-green-600'
    };
  }
  return {
    icon: Briefcase,
    tagline: 'Career Placements & Sprints',
    activeBg: 'bg-gradient-to-br from-purple-50/95 via-fuchsia-50/80 to-indigo-50/50 border-2 border-purple-500 shadow-md ring-2 ring-purple-400/30',
    activeRing: 'ring-purple-400/50',
    accentText: 'text-purple-600',
    activeText: 'text-purple-950',
    activeTagline: 'text-purple-700 font-bold',
    accentBorder: 'border-purple-200/90',
    accentHoverBorder: 'hover:border-purple-500',
    accentGlow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.18)]',
    iconBg: 'bg-purple-50 text-purple-600',
    bottomLine: 'from-purple-600 via-fuchsia-600 to-indigo-600'
  };
};

const getSubCategoryProductVisuals = (subName: string, categoryName: string, index: number) => {
  const lower = (subName || '').toLowerCase();

  if (lower.includes('german') && !lower.includes('medical')) {
    return {
      flag: '🇩🇪',
      badge: 'Official CEFR',
      icon: Languages,
      highlight: 'Goethe & Telc Certified • Dual AI + Live Faculty',
      accentColor: 'border-amber-500/80',
      activeRing: 'ring-amber-500/30',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      activeGradient: 'from-amber-50/80 via-white to-amber-50/30',
      barGradient: 'from-slate-950 via-amber-500 to-red-600',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100/70',
      pillText: 'A1–C2 Track',
    };
  }
  if (lower.includes('ielts') || lower.includes('toefl') || lower.includes('pte')) {
    return {
      flag: '🇬🇧',
      badge: 'Band 8.0+ Target',
      icon: GraduationCap,
      highlight: 'Cambridge English & Academic Scoring Protocol',
      accentColor: 'border-blue-500/80',
      activeRing: 'ring-blue-500/30',
      badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      activeGradient: 'from-blue-50/80 via-white to-sky-50/30',
      barGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100/70',
      pillText: 'Academic / General',
    };
  }
  if (lower.includes('french')) {
    return {
      flag: '🇫🇷',
      badge: 'DELF / DALF',
      icon: BookOpen,
      highlight: 'Official European Standard French Certification',
      accentColor: 'border-indigo-500/80',
      activeRing: 'ring-indigo-500/30',
      badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      activeGradient: 'from-indigo-50/80 via-white to-blue-50/30',
      barGradient: 'from-blue-600 via-white to-rose-600',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100/70',
      pillText: 'DELF Diplôme',
    };
  }
  if (lower.includes('spanish')) {
    return {
      flag: '🇪🇸',
      badge: 'DELE Official',
      icon: Globe,
      highlight: 'Instituto Cervantes Certified Language Syllabus',
      accentColor: 'border-orange-500/80',
      activeRing: 'ring-orange-500/30',
      badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
      activeGradient: 'from-orange-50/80 via-white to-amber-50/30',
      barGradient: 'from-red-600 via-amber-500 to-red-600',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100/70',
      pillText: 'DELE Spanish',
    };
  }
  if (lower.includes('medical') || lower.includes('fsp') || lower.includes('kenntnis') || lower.includes('nursing')) {
    return {
      flag: '🩺',
      badge: 'Hospital Approbation',
      icon: Stethoscope,
      highlight: 'Clinical Fachsprachprüfung & Anamnese Defense',
      accentColor: 'border-teal-500/80',
      activeRing: 'ring-teal-500/30',
      badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
      activeGradient: 'from-teal-50/80 via-white to-emerald-50/30',
      barGradient: 'from-teal-600 via-emerald-500 to-teal-600',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100/70',
      pillText: 'Clinical FSP',
    };
  }
  if (lower.includes('full-stack') || lower.includes('react') || lower.includes('web')) {
    return {
      flag: '💻',
      badge: 'React 19 & Node',
      icon: Laptop,
      highlight: 'Full-Stack Microservices & Cloud CI/CD Architecture',
      accentColor: 'border-cyan-500/80',
      activeRing: 'ring-cyan-500/30',
      badgeBg: 'bg-cyan-50 text-cyan-900 border-cyan-200',
      activeGradient: 'from-cyan-50/80 via-white to-blue-50/30',
      barGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-100/70',
      pillText: 'Full-Stack Track',
    };
  }
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('devops')) {
    return {
      flag: '☁️',
      badge: 'AWS & Kubernetes',
      icon: Layers,
      highlight: 'Docker Containers, Terraform & Production CI/CD',
      accentColor: 'border-sky-500/80',
      activeRing: 'ring-sky-500/30',
      badgeBg: 'bg-sky-50 text-sky-900 border-sky-200',
      activeGradient: 'from-sky-50/80 via-white to-indigo-50/30',
      barGradient: 'from-sky-500 via-blue-500 to-indigo-600',
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-100/70',
      pillText: 'DevOps / AWS',
    };
  }
  if (lower.includes('ai') || lower.includes('python') || lower.includes('data')) {
    return {
      flag: '🤖',
      badge: 'GenAI & Python',
      icon: BrainCircuit,
      highlight: 'LLM Fine-Tuning, Autonomous Agents & PyTorch',
      accentColor: 'border-violet-500/80',
      activeRing: 'ring-violet-500/30',
      badgeBg: 'bg-violet-50 text-violet-900 border-violet-200',
      activeGradient: 'from-violet-50/80 via-white to-purple-50/30',
      barGradient: 'from-violet-600 via-purple-600 to-indigo-600',
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100/70',
      pillText: 'AI Engineering',
    };
  }
  if (lower.includes('cyber') || lower.includes('security')) {
    return {
      flag: '🛡️',
      badge: 'SOC & ISO 27001',
      icon: ShieldCheck,
      highlight: 'Network Threat Defense & Ethical Hacking Protocols',
      accentColor: 'border-emerald-500/80',
      activeRing: 'ring-emerald-500/30',
      badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      activeGradient: 'from-emerald-50/80 via-white to-teal-50/30',
      barGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100/70',
      pillText: 'Cyber Defense',
    };
  }
  if (lower.includes('sap')) {
    return {
      flag: '💼',
      badge: 'Enterprise SAP',
      icon: Building2,
      highlight: 'S/4HANA Business Workflows & Enterprise Configuration',
      accentColor: 'border-blue-600/80',
      activeRing: 'ring-blue-600/30',
      badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      activeGradient: 'from-blue-50/80 via-white to-slate-50/30',
      barGradient: 'from-blue-700 via-indigo-700 to-slate-800',
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-100/70',
      pillText: 'SAP S/4HANA',
    };
  }
  if (lower.includes('marketing') || lower.includes('ads') || lower.includes('seo') || lower.includes('growth')) {
    return {
      flag: '📈',
      badge: 'Performance & Growth',
      icon: Target,
      highlight: 'High-ROI Meta/Google Scaling & Automation Funnels',
      accentColor: 'border-rose-500/80',
      activeRing: 'ring-rose-500/30',
      badgeBg: 'bg-rose-50 text-rose-900 border-rose-200',
      activeGradient: 'from-rose-50/80 via-white to-pink-50/30',
      barGradient: 'from-rose-500 via-pink-600 to-amber-500',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100/70',
      pillText: 'Digital Growth',
    };
  }

  // Fallback dynamic curated palette
  const fallbacks = [
    { flag: '⚡', badge: 'Certified Program', icon: Sparkles, highlight: 'Industry Aligned Curriculum & Placement Prep', accentColor: 'border-indigo-500/80', activeRing: 'ring-indigo-500/30', badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200', activeGradient: 'from-indigo-50/80 via-white to-blue-50/30', barGradient: 'from-indigo-600 to-blue-600', iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100/70', pillText: 'Pro Track' },
    { flag: '🌟', badge: 'Verified Module', icon: Award, highlight: 'Accelerated Practical Framework & Mentorship', accentColor: 'border-teal-500/80', activeRing: 'ring-teal-500/30', badgeBg: 'bg-teal-50 text-teal-900 border-teal-200', activeGradient: 'from-teal-50/80 via-white to-emerald-50/30', barGradient: 'from-teal-600 to-emerald-600', iconColor: 'text-teal-600', iconBg: 'bg-teal-100/70', pillText: 'Standard Track' },
    { flag: '🎯', badge: 'Executive Track', icon: Briefcase, highlight: 'Vocational Competency & Global Certification', accentColor: 'border-amber-500/80', activeRing: 'ring-amber-500/30', badgeBg: 'bg-amber-50 text-amber-900 border-amber-200', activeGradient: 'from-amber-50/80 via-white to-orange-50/30', barGradient: 'from-amber-600 to-orange-600', iconColor: 'text-amber-600', iconBg: 'bg-amber-100/70', pillText: 'Career Track' }
  ];
  return fallbacks[index % fallbacks.length];
};

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
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('General / Standard');

  // Category & Sub-Category Selection States (Synchronized with Navigation & Database)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Language & Education');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<string>('German Language');

  // Stage of Education Selection State (A1, A2, B1, B2, C1, C2, Combined Package)
  const [selectedStage, setSelectedStage] = useState<string>('A1');
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
  const subCategorySectionRef = useRef<HTMLDivElement>(null);
  const specializationSectionRef = useRef<HTMLDivElement>(null);
  const learningPathSectionRef = useRef<HTMLDivElement>(null);
  const stageSelectionRef = useRef<HTMLDivElement>(null);
  const [selectedPathId, setSelectedPathId] = useState<string>('intelli-coach-ai');
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
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('ilas-courses-changed', loadData);
      window.removeEventListener('ilas-paths-changed', loadData);
      window.removeEventListener('ilas-categories-changed', loadData);
      window.removeEventListener('storage', loadData);
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
      }
    };
  }, []);

  // Synchronize category, subCategory, specialization & stage from URL hash query params
  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash;
      if (!hash.includes('?')) return;
      const queryString = hash.split('?')[1];
      const params = new URLSearchParams(queryString);

      const catParam = params.get('category');
      const subCatParam = params.get('subCategory');
      const specParam = params.get('specialization');
      const stageParam = params.get('stage');

      if (catParam) {
        setSelectedCategoryFilter(catParam);
        const lower = catParam.toLowerCase();
        if (lower.includes('lang') || lower.includes('german')) setActiveTab('german');
        else if (lower.includes('ielts') || lower.includes('eng')) setActiveTab('ielts');
        else if (lower.includes('soft') || lower.includes('it') || lower.includes('sap')) setActiveTab('software-tech');
        else if (lower.includes('health') || lower.includes('clinic')) setActiveTab('medical');
        else setActiveTab('job-related');

        if (!subCatParam) {
          scrollToSubCategory();
        }
      }
      if (subCatParam) {
        setSelectedSubCategoryFilter(subCatParam);
        scrollToSpecialization();
      }
      if (specParam) {
        setSelectedSpecialization(specParam);
      }
      if (stageParam) {
        setSelectedStage(stageParam);
      }
    };

    parseHashParams();
    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
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

  const activeCategory = useMemo<GlobalCategory>(() => {
    return categories.find(c => c.name.toLowerCase() === selectedCategoryFilter.toLowerCase()) || categories[0] || {
      id: 'cat-1',
      name: 'Language & Education',
      code: 'EDU-LANG',
      position: 1,
      showInNav: true,
      description: 'Foreign language certifications, CEFR tracks, and academic testing pathways.',
      subCategories: ['German Language (A1–C2)', 'IELTS / TOEFL / PTE', 'French Language', 'Spanish Language', 'Medical German & FSP'],
      specializations: ['General / Standard', 'Healthcare / Doctors', 'Engineers', 'IT & Software', 'Business & Management'],
      stages: ['A1 (Beginner)', 'A2 (Elementary)', 'B1 (Intermediate)', 'B2 (Upper Int.)', 'C1 (Advanced)', 'C2 (Mastery)', 'A1-C2 Combined Package']
    };
  }, [categories, selectedCategoryFilter]);

  const currentSubCategories = useMemo<string[]>(() => {
    if (activeCategory?.subCategories && activeCategory.subCategories.length > 0) {
      return activeCategory.subCategories;
    }
    return ['German Language (A1–C2)', 'IELTS / TOEFL / PTE', 'French Language', 'Spanish Language'];
  }, [activeCategory]);

  const scrollToSubCategory = () => {
    setTimeout(() => {
      const el = subCategorySectionRef.current || document.getElementById('subcategory-product-selection-section');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const scrollToSpecialization = () => {
    setTimeout(() => {
      const el = specializationSectionRef.current || document.getElementById('specialization-selection-section');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const scrollToLearningPath = () => {
    setTimeout(() => {
      const el = learningPathSectionRef.current || document.getElementById('learning-path-selection-block');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const scrollToStageSelection = () => {
    setTimeout(() => {
      const el = stageSelectionRef.current || document.getElementById('stage-selection-area');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleCategoryClick = (cat: GlobalCategory) => {
    setSelectedCategoryFilter(cat.name);
    if (cat.subCategories && cat.subCategories.length > 0) {
      setSelectedSubCategoryFilter(cat.subCategories[0]);
    }
    const lower = cat.name.toLowerCase();
    if (lower.includes('lang') || lower.includes('german')) setActiveTab('german');
    else if (lower.includes('ielts') || lower.includes('eng')) setActiveTab('ielts');
    else if (lower.includes('soft') || lower.includes('it') || lower.includes('sap')) setActiveTab('software-tech');
    else if (lower.includes('health') || lower.includes('clinic')) setActiveTab('medical');
    else setActiveTab('job-related');

    scrollToSubCategory();
  };

  const handleSubCategoryClick = (subCat: string) => {
    setSelectedSubCategoryFilter(subCat);
    scrollToSpecialization();
  };

  const handleSpecializationSelect = (trackLabel: string) => {
    setSelectedSpecialization(trackLabel);
    scrollToLearningPath();
  };

  const handleLearningPathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
    scrollToStageSelection();
  };

  // Map Active Tab & Selected Filters to the Corresponding Course Record
  const getActiveCourseForTab = (): GlobalCourse => {
    if (courses.length === 0) {
      return {
        id: '1',
        name: selectedSubCategoryFilter || 'German Language Mastery A1–C2',
        top_title: activeCategory.name || 'Language & Education',
        subtitle: 'Comprehensive foreign language and certification pathways with verified clinical and technical frameworks.',
        chapter: '24',
        duration: '16 Weeks',
        methods: 'IntelliCoach AI + Native Tutors',
        fee: '$799',
        staff: 'Senior Specialist Faculty',
        category: activeCategory.name || 'Language & Education',
        subCategory: selectedSubCategoryFilter || 'German Language',
        displayPosition: 1,
        materials: 'Digital Library & Handouts',
        students: '180',
        courseStructure: 'Module 1: Level Fundamentals, Phonetics & Core Vocabulary\nModule 2: Applied Workplace Dialogues & Syntax Mastery\nModule 3: Complex Interactive Projects & Professional Fluency\nModule 4: Industry & Official Mock Certification Preparation'
      };
    }

    if (selectedSubCategoryFilter && selectedSubCategoryFilter !== 'All') {
      const matched = courses.find(c =>
        (c.subCategory && c.subCategory.toLowerCase().includes(selectedSubCategoryFilter.toLowerCase())) ||
        (c.name && c.name.toLowerCase().includes(selectedSubCategoryFilter.toLowerCase()))
      );
      if (matched) return matched;
    }

    if (selectedCategoryFilter && selectedCategoryFilter !== 'All') {
      const matched = courses.find(c =>
        c.category && c.category.toLowerCase() === selectedCategoryFilter.toLowerCase()
      );
      if (matched) return matched;
    }

    if (activeTab === 'german') {
      return courses.find(c => c.name.toLowerCase().includes('german') || c.subCategory?.toLowerCase().includes('german')) || courses[0];
    }
    if (activeTab === 'ielts') {
      return courses.find(c => c.name.toLowerCase().includes('ielts') || c.subCategory?.toLowerCase().includes('ielts')) || courses[1] || courses[0];
    }
    if (activeTab === 'software-tech') {
      return courses.find(c => c.name.toLowerCase().includes('software') || c.name.toLowerCase().includes('sap') || c.category?.toLowerCase().includes('software') || c.category?.toLowerCase().includes('sap')) || courses[2] || courses[0];
    }
    if (activeTab === 'medical') {
      return courses.find(c => c.name.toLowerCase().includes('medical') || c.category?.toLowerCase().includes('health') || c.subCategory?.toLowerCase().includes('fsp')) || courses[5] || courses[3] || courses[0];
    }
    if (activeTab === 'job-related') {
      return courses.find(c => c.category?.toLowerCase().includes('job') || c.name.toLowerCase().includes('social') || c.category?.toLowerCase().includes('growth')) || courses[4] || courses[0];
    }
    return courses[0];
  };

  const activeCourse = getActiveCourseForTab();

  // Stage of Education Options & Stage Pricing Calculator
  const isLanguageOrMedical = useMemo(() => {
    const cat = (selectedCategoryFilter || activeCourse.category || '').toLowerCase();
    const sub = (selectedSubCategoryFilter || activeCourse.subCategory || '').toLowerCase();
    return cat.includes('lang') || cat.includes('german') || cat.includes('health') || cat.includes('clinic') ||
      sub.includes('german') || sub.includes('ielts') || sub.includes('french') || sub.includes('spanish') || sub.includes('fsp') ||
      activeTab === 'german' || activeTab === 'ielts' || activeTab === 'medical';
  }, [selectedCategoryFilter, selectedSubCategoryFilter, activeCourse, activeTab]);

  const stageOptions = useMemo(() => {
    if (activeCategory?.stages && activeCategory.stages.length > 0) {
      return activeCategory.stages.map((stg) => {
        const isPkg = stg.toLowerCase().includes('package') || stg.toLowerCase().includes('track') || stg.toLowerCase().includes('combined');
        let defaultPrice = '$179';
        const stgLower = stg.toLowerCase();
        if (stgLower.includes('a1')) defaultPrice = '$129';
        else if (stgLower.includes('a2')) defaultPrice = '$149';
        else if (stgLower.includes('b1')) defaultPrice = '$179';
        else if (stgLower.includes('b2')) defaultPrice = '$219';
        else if (stgLower.includes('c1')) defaultPrice = '$269';
        else if (stgLower.includes('c2')) defaultPrice = '$319';
        else if (stgLower.includes('foundation')) defaultPrice = '$199';
        else if (stgLower.includes('intermediate')) defaultPrice = '$299';
        else if (stgLower.includes('advanced')) defaultPrice = '$399';
        else if (isPkg) defaultPrice = '$799';

        return {
          id: stg,
          label: stg.replace(/\(.*?\)/g, '').trim(),
          fullLabel: stg,
          defaultPrice,
          desc: isPkg ? 'All Modules & Certifications' : `${stg} Level Module`
        };
      });
    }

    if (isLanguageOrMedical) {
      return [
        { id: 'A1', label: 'Stage A1', fullLabel: 'A1 Beginner', defaultPrice: '$129', desc: 'Phonetics & Survival Vocabulary' },
        { id: 'A2', label: 'Stage A2', fullLabel: 'A2 Elementary', defaultPrice: '$149', desc: 'Daily Conversational & Workplace' },
        { id: 'B1', label: 'Stage B1', fullLabel: 'B1 Intermediate', defaultPrice: '$179', desc: 'Complex Syntax & Business German' },
        { id: 'B2', label: 'Stage B2', fullLabel: 'B2 Upper-Int', defaultPrice: '$219', desc: 'Clinical & Professional Fluency' },
        { id: 'C1', label: 'Stage C1', fullLabel: 'C1 Advanced', defaultPrice: '$269', desc: 'Academic Defense & Approbation' },
        { id: 'C2', label: 'Stage C2', fullLabel: 'C2 Mastery', defaultPrice: '$319', desc: 'Native-Level Examination Prep' },
        { id: 'A1-C2 Package', label: 'A1–C2 Package', fullLabel: 'A1–C2 Full Track', defaultPrice: '$799', desc: 'All 6 Levels + Goethe/Telc Mock Prep (Save 31%)' }
      ];
    } else {
      return [
        { id: 'Foundation', label: 'Foundation', fullLabel: 'Foundation Level', defaultPrice: '$199', desc: 'Core Principles & Fundamentals' },
        { id: 'Intermediate', label: 'Intermediate', fullLabel: 'Intermediate Level', defaultPrice: '$299', desc: 'Applied Workflows & Implementation' },
        { id: 'Advanced', label: 'Advanced', fullLabel: 'Advanced Level', defaultPrice: '$399', desc: 'Enterprise Architecture & Systems' },
        { id: 'Full Professional Track', label: 'Full Track', fullLabel: 'Full Professional Track', defaultPrice: '$699', desc: 'Complete Track & Industry Certifications' }
      ];
    }
  }, [activeCategory, isLanguageOrMedical]);

  const getExactStagePrice = (pathItem: GlobalPath, stageId: string): string => {
    if (pathItem.stagePricing && pathItem.stagePricing[stageId]) {
      return pathItem.stagePricing[stageId];
    }
    const found = stageOptions.find(s => s.id === stageId);
    if (found) return found.defaultPrice;
    return pathItem.fee || '$199';
  };

  // Dynamically adapt underlying teaching paths / curriculum based on activeCourse, database paths, and specialization
  const displayPathItems = useMemo(() => {
    const validPaths = paths.filter(p => !/^(path\s*\d+|test\s*p\d+|test\s*path|test\b|dummy)/i.test((p.name || '').trim()));

    // 1. Try to find backend paths matching activeCourse, category, or subCategory
    const matchedByCourse = validPaths.filter(p => {
      const matchesCourse =
        p.linkedCourseId === activeCourse.id ||
        p.id === activeCourse.pathId ||
        p.linkedCourseName === activeCourse.name ||
        (activeCourse.name && p.linkedCourseName && activeCourse.name.toLowerCase().includes(p.linkedCourseName.toLowerCase())) ||
        (p.category && selectedCategoryFilter && p.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
      return matchesCourse;
    });

    // Match specialization
    const specNorm = selectedSpecialization.toLowerCase();
    const matchedBySpec = matchedByCourse.filter(p => {
      if (p.specializations && p.specializations.length > 0) {
        return p.specializations.some(s => s.toLowerCase().includes(specNorm) || specNorm.includes(s.toLowerCase()));
      }
      return true;
    });

    if (matchedBySpec.length > 0) {
      return matchedBySpec.sort((a, b) => (a.position || 99) - (b.position || 99));
    }
    if (matchedByCourse.length > 0) {
      return matchedByCourse.sort((a, b) => (a.position || 99) - (b.position || 99));
    }
    if (validPaths.length > 0) {
      return validPaths.slice(0, 3).sort((a, b) => (a.position || 99) - (b.position || 99));
    }

    // Default rich fallback paths
    return [
      {
        id: `path-1-${activeCourse.id}`,
        name: `${activeCourse.name} - Accelerated Intensive Pathway`,
        code: 'PTH-INT-101',
        methods: 'Hybrid (Live Classes + IntelliCoach AI)',
        starting: 'Immediate Entry',
        ending: '16 Weeks',
        remarks: 'Live native instructor classes, milestone mock scoring & guaranteed exam defense',
        fee: '$799',
        stagePricing: {
          'A1': '$129',
          'A2': '$149',
          'B1': '$179',
          'B2': '$219',
          'C1': '$269',
          'C2': '$319',
          'A1-C2 Package': '$799',
          'Foundation': '$199',
          'Intermediate': '$299',
          'Advanced': '$399',
          'Full Professional Track': '$699'
        }
      },
      {
        id: `path-2-${activeCourse.id}`,
        name: `${activeCourse.name} - 24/7 IntelliCoach AI Autonomous Track`,
        code: 'PTH-AI-202',
        methods: 'IntelliCoach AI (24/7 Self-Paced)',
        starting: 'Immediate Entry',
        ending: 'Self-Paced',
        remarks: 'Phonetics acoustic engine, adaptive syntax drills & unlimited AI mock examiner scoring',
        fee: '$599',
        stagePricing: {
          'A1': '$99',
          'A2': '$119',
          'B1': '$149',
          'B2': '$179',
          'C1': '$219',
          'C2': '$259',
          'A1-C2 Package': '$599',
          'Foundation': '$149',
          'Intermediate': '$229',
          'Advanced': '$299',
          'Full Professional Track': '$549'
        }
      }
    ];
  }, [activeCourse, paths, selectedCategoryFilter, selectedSpecialization]);

  // Dynamically derive specialization tracks from backend database & target domain categories
  const dynamicSpecializationTracks = useMemo<SpecializationTrack[]>(() => {
    // 1. If activeCategory has specializations array, map them to SpecializationTrack objects
    if (activeCategory?.specializations && activeCategory.specializations.length > 0) {
      return activeCategory.specializations.map((spec, idx) => {
        let icon = Compass;
        const lower = spec.toLowerCase();
        if (lower.includes('health') || lower.includes('doctor') || lower.includes('med') || lower.includes('clinic')) icon = Stethoscope;
        else if (lower.includes('engineer') || lower.includes('civil') || lower.includes('mech')) icon = Building2;
        else if (lower.includes('it') || lower.includes('soft') || lower.includes('tech') || lower.includes('sap') || lower.includes('dev')) icon = Laptop;
        else if (lower.includes('business') || lower.includes('finance') || lower.includes('manage') || lower.includes('growth')) icon = Briefcase;

        return {
          id: `spec-${idx}`,
          label: spec,
          badge: `${spec.split('/')[0].trim()} Track`,
          icon,
          desc: `Custom curriculum and vocational alignment for ${spec}.`,
          highlights: ['Domain Curriculum', 'Workplace Syntax & Vocabulary', 'Industry Placement Ready']
        };
      });
    }

    // 2. Standard Domain Specialization Categories
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

    return baseTracks;
  }, [activeCategory, activeCourse]);

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

  // Dynamically derive active learning paths from backend database (real-time reactive)
  const syncedRealTimePaths = useMemo<RealTimeLearningPathConfig[]>(() => {
    const validDbPaths = paths.filter(p => p.name && !/^(path\s*\d+|test\s*p\d+|test\s*path|test\b|dummy)/i.test(p.name.trim()));
    if (validDbPaths.length > 0) {
      return validDbPaths.map((p, idx) => formatLearningPathFromBackend(p, idx));
    }
    return realTimeLearningPaths;
  }, [paths]);

  // Streamlined Real-Time Selected Path & Active Stage Pricing
  const selectedRealTimePath = useMemo<RealTimeLearningPathConfig>(() => {
    return syncedRealTimePaths.find(p => p.id === selectedPathId || p.code === selectedPathId || p.name.toLowerCase() === (selectedPathId || '').toLowerCase()) || syncedRealTimePaths[0] || realTimeLearningPaths[0];
  }, [syncedRealTimePaths, selectedPathId]);

  const activePathCurrentPrice = useMemo(() => {
    if (selectedRealTimePath.stagePricing && selectedRealTimePath.stagePricing[selectedStage]) {
      return selectedRealTimePath.stagePricing[selectedStage];
    }
    const found = stageOptions.find(s => s.id === selectedStage);
    if (found) return found.defaultPrice;
    return selectedRealTimePath.fee || '$799';
  }, [selectedRealTimePath, selectedStage, stageOptions]);

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
              onClick={() => {
                const jobCat = categories.find(c => c.isJobRelated || c.name.toLowerCase().includes('job')) || categories[categories.length - 1];
                if (jobCat) handleCategoryClick(jobCat);
              }}
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

          {/* PRIMARY CATEGORIES NAVIGATION BAR (Clean dynamic categories from backend - No 'Teaching Path') */}
          <div className="bg-slate-50/70 p-3 sm:p-5 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
              {(categories.length > 0 ? categories : [
                { id: 'cat-1', name: 'Language & Education', code: 'EDU-LANG' },
                { id: 'cat-2', name: 'Software & IT Training', code: 'TECH-SW' },
                { id: 'cat-3', name: 'Enterprise Software Training (SAP)', code: 'ERP-SAP' },
                { id: 'cat-4', name: 'Digital Marketing & Growth', code: 'MKT-GROWTH' },
                { id: 'cat-5', name: 'Health & Clinical', code: 'MED-CARE' },
                { id: 'cat-6', name: 'Other Job-Related Courses', code: 'JOB-REL' }
              ]).map((cat) => {
                const visuals = getCategoryVisuals(cat.name);
                const CatIcon = visuals.icon;
                const isCatActive = selectedCategoryFilter.toLowerCase() === cat.name.toLowerCase();

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat as GlobalCategory)}
                    className={`group relative p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[96px] sm:min-h-[108px] overflow-hidden ${isCatActive
                        ? `${visuals.activeBg} ${visuals.activeRing} scale-[1.02] z-10`
                        : `bg-white ${visuals.accentBorder} ${visuals.accentHoverBorder} ${visuals.accentGlow} text-slate-800 hover:bg-slate-50 shadow-xs hover:scale-[1.01]`
                      }`}
                  >
                    {/* Subtle Background Brand Watermark Icon */}
                    <div className="absolute -bottom-4 -right-4 pointer-events-none transition-all duration-500 ease-out transform group-hover:scale-130 group-hover:-rotate-12 select-none">
                      <CatIcon className={`w-24 h-24 sm:w-28 sm:h-28 transition-colors duration-500 ${isCatActive
                          ? 'text-brand-700/10 group-hover:text-brand-700/20'
                          : 'text-slate-900/[0.04] group-hover:text-slate-900/[0.08]'
                        }`} />
                    </div>

                    {/* Central High-Impact Bold Typography */}
                    <div className="relative z-10 space-y-1 w-full flex flex-col items-center justify-center px-1">
                      <div className={`font-black text-sm sm:text-base md:text-lg leading-snug tracking-tight text-center transition-colors line-clamp-2 ${isCatActive ? (visuals.activeText || 'text-slate-900') : `text-slate-900 group-hover:${visuals.accentText}`
                        }`}>
                        {cat.name}
                      </div>
                      <div className={`text-[10px] sm:text-[11px] text-center font-bold leading-tight ${isCatActive ? (visuals.activeTagline || 'text-slate-600') : 'text-slate-500'
                        }`}>
                        {visuals.tagline}
                      </div>
                    </div>

                    {/* Active Glowing Bottom Indicator Line */}
                    {isCatActive && (
                      <div className={`absolute -bottom-0.5 left-4 right-4 h-1 bg-gradient-to-r ${visuals.bottomLine || 'from-brand-600 via-indigo-600 to-brand-600'} rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* SECONDARY INTERACTIVE BLOCKS (SUB-CATEGORIES / PRODUCT MODEL BLOCKS) */}
            <div
              id="subcategory-product-selection-section"
              ref={subCategorySectionRef}
              className="mt-4 pt-5 pb-5 px-3.5 sm:px-5 border-t border-slate-200/80 bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/60 rounded-2xl sm:rounded-3xl scroll-mt-24 shadow-xs"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand-600/10 text-brand-700 flex items-center justify-center font-bold text-xs">
                      <Tag className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>{activeCategory.name}</span>
                      <span className="text-slate-400 font-normal">/</span>
                      <span className="text-brand-700">Select Course</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium sm:pl-9">
                    Choose a course below to unlock its specialization tracks, curriculum pathways &amp; schedules
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{currentSubCategories.length} Courses Available</span>
                  </span>
                </div>
              </div>

              {/* Product Model Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
                {currentSubCategories.map((sub, sIdx) => {
                  const isSubActive = selectedSubCategoryFilter.toLowerCase() === sub.toLowerCase();
                  const productCode = activeCategory?.subCategoryCodes?.[sub] || activeCategory?.subCategoryProducts?.find(p => p.name === sub)?.code || `PRD-${sIdx + 1}`;
                  const visuals = getSubCategoryProductVisuals(sub, activeCategory.name, sIdx);
                  const CardIcon = visuals.icon;

                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSubCategoryClick(sub)}
                      className={`group relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[128px] overflow-hidden ${
                        isSubActive
                          ? `bg-white ${visuals.accentColor} ${visuals.activeRing} ring-2 shadow-lg scale-[1.02] z-10`
                          : 'bg-white/95 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Top Accent Gradient Line for Active Item */}
                      {isSubActive && (
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${visuals.barGradient}`} />
                      )}

                      {/* Header Row: Product Code + Flag / Level Badge */}
                      <div className="flex items-center justify-between gap-1 mb-2.5 w-full">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                          {productCode}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${visuals.badgeBg}`}>
                            <span>{visuals.flag}</span>
                            <span>{visuals.badge}</span>
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Icon & Product Title */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 mt-0.5 ${
                            isSubActive ? 'bg-slate-900 text-white shadow-xs' : `${visuals.iconBg} ${visuals.iconColor}`
                          }`}>
                            <CardIcon className="w-4 h-4" />
                          </div>
                          <h4 className={`font-black text-sm sm:text-[15px] leading-snug tracking-tight transition-colors ${
                            isSubActive ? 'text-slate-950' : 'text-slate-800 group-hover:text-brand-700'
                          }`}>
                            {sub}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight pl-10 font-normal">
                          {visuals.highlight}
                        </p>
                      </div>

                      {/* Bottom Status / Selection Footer */}
                      <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-bold transition-colors ${
                        isSubActive
                          ? 'border-slate-100 text-brand-700'
                          : 'border-slate-100 text-slate-400 group-hover:text-brand-600'
                      }`}>
                        {isSubActive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-black">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active Selection</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span>Select Course</span>
                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400 font-medium">
                          #{sIdx + 1}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SINGLE-FRAME INTERACTIVE CONTENT BODY */}
          <div className="p-6 sm:p-10">
            {/* UNIFIED SINGLE-FRAME COURSE CANVAS (Dynamic for all categories & tracks) */}
            <div className="animate-in fade-in duration-300">

              {/* Single-Frame Course Header Banner */}
              <div className="text-center max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[11px] font-black tracking-widest text-brand-700 uppercase bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200 shadow-2xs">
                    {activeCategory.name || activeCourse.category || 'Specialized Track'}
                  </span>
                  {selectedSubCategoryFilter && (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {selectedSubCategoryFilter}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 mb-2">
                  {selectedSubCategoryFilter || activeCourse.name}
                </h2>
                <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
                  {activeCourse.subtitle || activeCategory.description || 'Comprehensive enterprise-level education & certification framework.'}
                </p>
              </div>

              {/* 1 & 2. UNIFIED LIGHT-GRAY CONTAINER: SELECT YOUR SPECIALIZATION & PROMOTIONAL BENEFITS SLIDER */}
              <div className="bg-slate-100/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">

                {/* SPECIALIZATION TRACK SELECTOR - CLEAN AIRY CARDS WITH VIBRANT GRADIENT TYPOGRAPHY & WATERMARK */}
                <div id="specialization-selection-section" ref={specializationSectionRef} className="mb-8 scroll-mt-28">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-brand-700" />
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Specialization Track Selection
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Curriculum and delivery paths adapt dynamically based on your chosen discipline
                    </span>
                  </div>

                  {/* Specialization Selector - Clean Layouts, Zero Heavy Box Colors, Vibrant Gradient Typography & Watermark */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {dynamicSpecializationTracks.map((track, tIdx) => {
                      const TrackIcon = track.icon;
                      const isSelected = selectedSpecialization === track.id || selectedSpecialization === track.label;

                      const specStyleConfigs = [
                        {
                          gradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700',
                          activeBorder: 'border-2 border-blue-500 ring-2 ring-blue-400/30 bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 shadow-md shadow-blue-500/10',
                          watermarkColor: 'text-blue-600/10 group-hover:text-blue-600/20',
                          accentBadge: 'bg-blue-50 text-blue-700 border-blue-200',
                          dotColor: 'bg-blue-600'
                        },
                        {
                          gradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700',
                          activeBorder: 'border-2 border-emerald-500 ring-2 ring-emerald-400/30 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 shadow-md shadow-emerald-500/10',
                          watermarkColor: 'text-emerald-600/10 group-hover:text-emerald-600/20',
                          accentBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          dotColor: 'bg-emerald-600'
                        },
                        {
                          gradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-red-600',
                          activeBorder: 'border-2 border-amber-500 ring-2 ring-amber-400/30 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 shadow-md shadow-amber-500/10',
                          watermarkColor: 'text-amber-600/10 group-hover:text-amber-600/20',
                          accentBadge: 'bg-amber-50 text-amber-700 border-amber-200',
                          dotColor: 'bg-amber-600'
                        },
                        {
                          gradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700',
                          activeBorder: 'border-2 border-violet-500 ring-2 ring-violet-400/30 bg-gradient-to-br from-violet-50/60 via-white to-purple-50/40 shadow-md shadow-violet-500/10',
                          watermarkColor: 'text-violet-600/10 group-hover:text-violet-600/20',
                          accentBadge: 'bg-violet-50 text-violet-700 border-violet-200',
                          dotColor: 'bg-violet-600'
                        },
                        {
                          gradientText: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-700',
                          activeBorder: 'border-2 border-rose-500 ring-2 ring-rose-400/30 bg-gradient-to-br from-rose-50/60 via-white to-pink-50/40 shadow-md shadow-rose-500/10',
                          watermarkColor: 'text-rose-600/10 group-hover:text-rose-600/20',
                          accentBadge: 'bg-rose-50 text-rose-700 border-rose-200',
                          dotColor: 'bg-rose-600'
                        },
                      ];
                      const styleConfig = specStyleConfigs[tIdx % specStyleConfigs.length];

                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => handleSpecializationSelect(track.label)}
                          className={`group relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[118px] border overflow-hidden ${
                            isSelected
                              ? `${styleConfig.activeBorder} scale-[1.02]`
                              : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:scale-[1.01]'
                          }`}
                        >
                          {/* Subtle Watermark Icon in background - No wasted icon space */}
                          <div className="absolute -bottom-2 -right-2 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-125 select-none">
                            <TrackIcon className={`w-20 h-20 transition-colors duration-300 ${isSelected ? styleConfig.watermarkColor : 'text-slate-900/[0.04] group-hover:text-slate-900/[0.07]'}`} />
                          </div>

                          {/* Top badge and active indicator */}
                          <div className="relative z-10 flex items-center justify-between gap-1.5">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${styleConfig.accentBadge}`}>
                              {track.badge}
                            </span>
                            {isSelected ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-800 bg-white/95 px-2 py-0.5 rounded-full shadow-2xs border border-slate-200">
                                <span className={`w-2 h-2 rounded-full ${styleConfig.dotColor} animate-pulse`} />
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold">Track {tIdx + 1}</span>
                            )}
                          </div>

                          {/* High-visibility Vibrant Gradient Typography */}
                          <div className="relative z-10 mt-2.5">
                            <div className={`font-black text-base sm:text-lg md:text-xl tracking-tight leading-snug ${styleConfig.gradientText}`}>
                              {track.label}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                              {track.desc || 'Specialized vocational framework'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Specialization Feedback */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-700">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      <strong className="font-bold text-slate-900">
                        Active Track: {selectedSpecialization}
                      </strong>{' '}
                      &bull; {dynamicSpecializationTracks.find(t => t.id === selectedSpecialization || t.label === selectedSpecialization)?.desc || 'Universal professional learning path.'}
                    </span>
                  </div>
                </div>

                {/* BOTTOM SECTION: CURRICULUM MODULES & PROMOTIONAL BENEFITS SLIDER */}
                <div className="grid lg:grid-cols-12 gap-6 items-stretch pt-4 border-t border-slate-200/80">

                  {/* Streamlined Real-Time Learning Path Column */}
                  <div id="learning-path-selection-block" ref={learningPathSectionRef} className="lg:col-span-6 flex flex-col justify-between gap-3.5 scroll-mt-28">
                    <div>
                      {/* Available Learning Path Dropdown Header */}
                      <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-brand-600" />
                          Available Learning Path &amp; Modality
                        </span>
                        <span className="text-[10px] text-brand-700 font-bold bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                          7 Real-Time Modalities
                        </span>
                      </div>

                      {/* Streamlined Dropdown for Real-Time Paths */}
                      <div className="bg-white border-2 border-brand-500/40 p-3 rounded-2xl shadow-xs mb-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRealTimePath.id}
                            onChange={(e) => handleLearningPathSelect(e.target.value)}
                            className="w-full text-xs sm:text-sm font-black text-slate-900 bg-slate-50 hover:bg-white border-2 border-slate-300 focus:border-brand-500 rounded-xl px-3 py-2.5 outline-none transition-all cursor-pointer shadow-2xs"
                          >
                            {syncedRealTimePaths.map((p) => (
                              <option key={p.id} value={p.id} className="font-bold py-1.5 text-slate-900">
                                {p.name} — {p.methods} ({p.fee})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quick Selection Buttons with Soft Accent Shading & Downward Navigation Hook */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 scrollbar-none">
                          {syncedRealTimePaths.map((p) => {
                            const isPActive = selectedRealTimePath.id === p.id;
                            const PathChipIcon = p.icon;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => handleLearningPathSelect(p.id)}
                                className={`text-[10px] font-bold whitespace-nowrap px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex flex-col items-start gap-0.5 shrink-0 ${
                                  isPActive
                                    ? 'bg-gradient-to-br from-brand-50 via-indigo-50/70 to-white text-brand-950 border-2 border-brand-500 shadow-xs ring-2 ring-brand-300/40'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <PathChipIcon className={`w-3 h-3 ${isPActive ? 'text-brand-600' : 'text-slate-500'}`} />
                                  <span className="font-black truncate max-w-[150px]">{p.name}</span>
                                </div>
                                <span className={`text-[9px] font-semibold truncate max-w-[150px] ${isPActive ? 'text-brand-700' : 'text-slate-500'}`}>
                                  ↳ {p.methods}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* PROMINENT PROMOTIONAL HEADER (Selected Path Title & Key Features right above content block) */}
                      <div className="mb-3.5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-950 text-white p-4 sm:p-5 shadow-md border border-brand-500/30">
                        <div className="absolute top-0 right-0 w-44 h-44 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-2.5">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-black uppercase tracking-wider border border-brand-400/30">
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              Active Learning Path
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-bold border border-white/15">
                              <Radio className="w-2.5 h-2.5 text-brand-400 animate-pulse" />
                              Method: <strong className="text-white ml-0.5">{selectedRealTimePath.methods}</strong>
                            </span>
                          </div>

                          {/* Large Prominent Title */}
                          <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                              {selectedRealTimePath.name}
                            </h3>
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/15">
                              {selectedRealTimePath.code}
                            </span>
                          </div>

                          {/* Key Promotional Features Highlight: 24/7 intelligent pacing, dynamic diagrams, instant explanations */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10 transition-colors">
                              <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-[11px] font-black text-white truncate">24/7 Intelligent Pacing</div>
                                <div className="text-[9px] text-slate-400 truncate">Self-adaptive rhythm</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10 transition-colors">
                              <BrainCircuit className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-[11px] font-black text-white truncate">Dynamic Diagrams</div>
                                <div className="text-[9px] text-slate-400 truncate">Interactive concept maps</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/10 transition-colors">
                              <Bot className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-[11px] font-black text-white truncate">Instant Explanations</div>
                                <div className="text-[9px] text-slate-400 truncate">Deep phonetic feedback</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ENGAGING PROMOTIONAL SHOWCASE VIEW (Highlights the specialty of each class model) */}
                      <div className="bg-white p-5 rounded-2xl border-2 border-brand-500/20 shadow-sm flex flex-col gap-3.5 transition-all">
                        {/* Title & Live Pricing Header */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 text-brand-600 shadow-2xs">
                              {(() => {
                                const ActiveIcon = selectedRealTimePath.icon;
                                return <ActiveIcon className="w-6 h-6" />;
                              })()}
                            </div>
                            <div className="truncate">
                              {/* Primary Path Title dynamically populated from backend */}
                              <div className="font-black text-slate-900 text-base sm:text-lg truncate">
                                {selectedRealTimePath.name}
                              </div>
                              {/* Corresponding Training Method displayed as clean sub-title directly beneath */}
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700 border border-slate-200">
                                  {selectedRealTimePath.code}
                                </span>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-brand-50 text-brand-700 border-brand-200 flex items-center gap-1 shadow-2xs">
                                  <Radio className="w-2.5 h-2.5 text-brand-600 animate-pulse" />
                                  <span className="font-normal text-slate-500">Method:</span>
                                  <strong className="text-brand-900">{selectedRealTimePath.methods}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Stage Pricing Highlight Badge */}
                          <div className="text-right shrink-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Stage Fee:</div>
                            <div className="text-lg sm:text-xl font-black text-emerald-600">{activePathCurrentPrice}</div>
                          </div>
                        </div>

                        {/* Specialty Promotional Highlight Card */}
                        <div className="bg-gradient-to-r from-amber-500/10 via-brand-50/30 to-indigo-50/20 border border-amber-200/80 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Class Specialty:</span>
                            <span className="font-bold normal-case text-slate-800">{selectedRealTimePath.specialty}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selectedRealTimePath.desc}
                          </p>
                        </div>

                        {/* 4 Feature Badges Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedRealTimePath.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50/90 border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* DYNAMIC LEVEL / STAGE SELECTION & ENROLLMENT AREA */}
                        <div id="stage-selection-area" ref={stageSelectionRef} className="scroll-mt-32 space-y-3 pt-2 border-t border-slate-100">
                          {/* Header */}
                          <div className="flex items-center justify-between gap-2 px-0.5">
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
                              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                Pick Desired Level / Stage:
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Instant Live Pricing
                            </span>
                          </div>

                          {/* Dynamic Level Option Buttons (A1, A2, B1, etc.) */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2">
                            {Object.entries(selectedRealTimePath.stagePricing).map(([lvlId, lvlPrice]) => {
                              const isLevelActive = selectedStage.toLowerCase() === lvlId.toLowerCase();
                              const isPkg = lvlId.toLowerCase().includes('package') || lvlId.toLowerCase().includes('track') || lvlId.toLowerCase().includes('combined') || lvlId.toLowerCase().includes('full');
                              return (
                                <button
                                  key={lvlId}
                                  type="button"
                                  onClick={() => setSelectedStage(lvlId)}
                                  className={`p-2.5 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border min-h-[58px] ${
                                    isLevelActive
                                      ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white text-emerald-950 border-2 border-emerald-500 shadow-sm ring-2 ring-emerald-300/40 scale-[1.02] z-10'
                                      : isPkg
                                        ? 'bg-gradient-to-r from-amber-50 to-orange-50/50 hover:bg-amber-100/60 text-amber-900 border-amber-300/80 shadow-2xs'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs hover:border-slate-300'
                                  }`}
                                >
                                  <span className="text-xs font-black leading-tight line-clamp-1">{lvlId}</span>
                                  <span className={`text-[11px] font-mono mt-0.5 ${isLevelActive ? 'text-emerald-700 font-black' : isPkg ? 'text-amber-800 font-bold' : 'text-slate-500 font-semibold'}`}>
                                    {lvlPrice}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Alternative Dropdown & Live Fee */}
                          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2 flex-1">
                              <label className="text-[11px] font-black uppercase text-slate-600 shrink-0">
                                Active Level:
                              </label>
                              <select
                                value={selectedStage}
                                onChange={(e) => setSelectedStage(e.target.value)}
                                className="w-full sm:w-auto flex-1 text-xs font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer shadow-2xs"
                              >
                                {Object.entries(selectedRealTimePath.stagePricing).map(([lvlId, lvlPrice]) => (
                                  <option key={lvlId} value={lvlId} className="font-bold py-1">
                                    {lvlId} — {lvlPrice}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <span className="text-[10px] font-bold text-slate-500">Live Fee:</span>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                                {activePathCurrentPrice}
                              </span>
                            </div>
                          </div>

                          {/* Promotional Savings Strip */}
                          <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700">Selected Level: <strong className="text-brand-700">{selectedStage}</strong></span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-600">Rate: <strong className="text-emerald-700">{activePathCurrentPrice}</strong></span>
                            </div>
                            {!selectedStage.toLowerCase().includes('package') && !selectedStage.toLowerCase().includes('full') && (
                              <button
                                type="button"
                                onClick={() => setSelectedStage('A1-C2 Package')}
                                className="text-[11px] text-amber-900 font-black bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-md border border-amber-300 transition-all cursor-pointer shadow-2xs"
                              >
                                Upgrade to Complete Track: {selectedRealTimePath.fee} (Save 31%)
                              </button>
                            )}
                            {(selectedStage.toLowerCase().includes('package') || selectedStage.toLowerCase().includes('full')) && (
                              <span className="text-[11px] text-emerald-900 font-black bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                                🎯 Complete Track: Includes All Stages &amp; Global Certification
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Demo, Blueprint & Prominent Direct Enrollment CTA */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => scrollTo(selectedRealTimePath.targetSectionId)}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              >
                                <BookOpen className="w-3.5 h-3.5" /> Blueprint
                              </button>
                              <button
                                type="button"
                                onClick={() => openCourseDemo(selectedRealTimePath.demoName)}
                                className="px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                              >
                                <Play className="w-3.5 h-3.5" /> Try Demo
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => navigateTo(`#applications?tab=Education&course=${encodeURIComponent(activeCourse.name)}&path=${encodeURIComponent(selectedRealTimePath.name)}&stage=${encodeURIComponent(selectedStage)}&price=${encodeURIComponent(activePathCurrentPrice)}&specialization=${encodeURIComponent(selectedSpecialization)}&category=${encodeURIComponent(selectedCategoryFilter)}`)}
                              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black rounded-xl cursor-pointer transition-all shadow-md hover:shadow-brand-500/25 flex items-center gap-2 active:scale-95"
                            >
                              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                              <span>Enroll Now in {selectedStage} ({activePathCurrentPrice})</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
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
                            className={`h-2 rounded-full transition-all cursor-pointer ${careerSlideIdx === idx
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

            {/* MAGAZINE-STYLE JOB-RELATED PROGRAMS & CAREER SPRINTS (When Job Category is selected) */}
            {(activeCategory?.isJobRelated || selectedCategoryFilter.toLowerCase().includes('job')) && (
              <div className="mt-12 pt-10 border-t-2 border-slate-200/80 animate-in fade-in duration-300">
                {/* Magazine Section Header */}
                <div className="max-w-3xl mb-8">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      Editorial Career Issue &bull; Placement Tracks
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
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${viewMode === 'grid' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" /> Grid (3×3)
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('line')}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${viewMode === 'line' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
                          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/60 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none font-black text-4xl tracking-tighter text-slate-900">
                            {String(idx + 1 + ((jobCoursesPage - 1) * COURSES_PER_PAGE)).padStart(2, '0')}
                          </div>

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

                            <h3 className={`font-black text-xl ${theme.titleColor} ${theme.titleHover} transition-colors leading-snug line-clamp-2 mb-2.5 tracking-tight`}>
                              {course.name}
                            </h3>

                            <p className={`text-xs sm:text-[13px] ${theme.subtextColor} font-medium line-clamp-2 leading-relaxed mb-4`}>
                              {course.subtitle || 'Direct corporate certification with verified European enterprise recruitment alignment.'}
                            </p>

                            <div className={`flex items-center gap-2 mb-4 text-[11px] font-bold ${theme.featureBg} py-2 px-3 rounded-xl border shadow-2xs`}>
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate">Direct European Placement &amp; Dual-Study Track</span>
                            </div>

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

                            <div className={`flex items-center gap-2 text-xs font-bold ${theme.facultyText} px-0.5 mb-2 truncate`}>
                              <Sparkles className={`w-3.5 h-3.5 ${theme.facultyIcon} shrink-0`} />
                              <span className="truncate">Faculty: {course.staff || 'Certified Industry Practitioner'}</span>
                            </div>
                          </div>

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
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${jobCoursesPage <= 1
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
                            className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center border ${jobCoursesPage === pageNum
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${jobCoursesPage >= totalJobPages
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
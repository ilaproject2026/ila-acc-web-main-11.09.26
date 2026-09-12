import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Heart, 
  MessageCircle, Settings, MonitorPlay, Hand, SkipBack, SkipForward, 
  Menu, X, Share2, Command, Search, Image as ImageIcon, Music, 
  Video, FileText, Sparkles, BookOpen, Layers, CheckCircle2, 
  Clock, Users, Mic, MicOff, Send, Camera, Eye, HelpCircle, 
  ChevronRight, ArrowRight, ExternalLink, Bookmark, ShieldCheck, 
  Terminal, Sliders, Globe, Zap, Check, Copy, RefreshCw, PlusCircle,
  User, UserPlus, Radio, Award, AlertCircle, Lock, LayoutGrid, List,
  Filter, ChevronDown, BarChart2, Cpu, Presentation, Trophy, MapPin,
  Link as LinkIcon, Calendar, CheckSquare
} from 'lucide-react';
import { 
  getGlobalCourses, setGlobalCourses, GlobalCourse, EnrolledStudent, 
  getGlobalCategories, GlobalCategory, CourseDeliveryFormat, generateSecureCourseLink 
} from '../../lib/db';
import CreateCourseAndPathModal from './CreateCourseAndPathModal';

interface LibraryAndClassRoomProps {
  onNavigateTab?: (tabName: string) => void;
}

interface ChapterItem {
  id: string;
  number: number | string;
  title: string;
  type: 'intro' | 'text' | 'video' | 'picture' | 'song';
  duration: string;
  status: 'Complete' | 'In Progress' | 'Locked';
  description: string;
  mediaUrl?: string;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor' | 'ai';
  text: string;
  time: string;
  badge?: string;
  isVoice?: boolean;
}

interface SubtitleItem {
  id: string;
  title: string;
  timestamp: string;
  seconds: number;
  status: 'Complete' | 'In Progress' | 'Locked';
  topic: string;
  notes: string;
  keyRules?: string;
  practicePrompt?: string;
}

const LibraryAndClassRoom: React.FC<LibraryAndClassRoomProps> = ({ onNavigateTab }) => {
  // 1. Courses State from Course Creator / DB
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [availableCategories, setAvailableCategories] = useState<GlobalCategory[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string>('1');
  const [librarySectionTab, setLibrarySectionTab] = useState<'ALL' | 'INTELLI_COACH' | 'VIDEO_AI' | 'TUTOR'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [courseViewMode, setCourseViewMode] = useState<'GRID' | 'LIST'>('GRID');

  // 1b. 5 Delivery Formats State & Modal Trigger (Phase A & B)
  const [activeDeliveryPath, setActiveDeliveryPath] = useState<CourseDeliveryFormat>('SLIDE_AI');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [showBookDrawer, setShowBookDrawer] = useState<boolean>(false);
  const [campTab, setCampTab] = useState<'Online' | 'Offline'>('Online');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const lessonSlides = [
    {
      id: 'sl-1',
      title: 'Slide 1: Core Linguistic Taxonomy & Phonetics',
      rule: 'Phonetic articulation of German vowels, umlauts (ä, ö, ü) & diphthongs (ei, eu, au).',
      examples: ['das Mädchen [dɪˈmaːtçən]', 'die Übung [ˈyːbʊŋ]', 'Deutschland [ˈdɔʏtʃlant]'],
      whiteboardNotes: 'Vowel height adjustments: Umlaut transformation changes grammatical meaning and acoustic register.',
      bookReference: 'Refer to Official Study Handbook Chapter 1, Section 1.4: "Acoustic Foundations".'
    },
    {
      id: 'sl-2',
      title: 'Slide 2: Verb Conjugation & Syntax Matrix',
      rule: 'Regular and irregular verb endings in Präsens (sein, haben, werden, arbeiten).',
      examples: ['ich bin / du bist / er ist', 'wir arbeiten / ihr arbeitet / sie arbeiten'],
      whiteboardNotes: 'V2 Word Order Rule: In declarative German main clauses, the conjugated verb ALWAYS occupies position 2.',
      bookReference: 'Refer to CEFR Grammar Guide Chapter 2, Page 18: "V2 Sentence Structure Rules".'
    },
    {
      id: 'sl-3',
      title: 'Slide 3: Situational Dialogue in Clinical / Professional Context',
      rule: 'Patient intake anamnesis and formal boardroom addressing (Sie vs. du).',
      examples: ['"Guten Tag, Herr Weber. Welche Beschwerden haben Sie heute?"', '"Ich habe seit gestern starke Kopfschmerzen."'],
      whiteboardNotes: 'Formal address requires capitalized Sie and corresponding third-person plural verb inflections.',
      bookReference: 'Refer to Professional Handout Chapter 3: "Clinical & Technical Workplace Communication".'
    },
    {
      id: 'sl-4',
      title: 'Slide 4: Milestone Summary & Practice Synthesis',
      rule: 'Autonomous speech rehearsal drill and active pronunciation verification.',
      examples: ['Audio benchmark: 94% native phonetic alignment threshold required.'],
      whiteboardNotes: 'Practice answering prompt aloud. Telemetry system evaluates real-time formant frequency.',
      bookReference: 'Refer to Self-Study Practice Drills Chapter 4, Exercises A–D.'
    }
  ];
  
  // 2. Playback & Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(2700); // 45:00
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [captionLang, setCaptionLang] = useState<string>('English');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(142);
  const [animateHeart, setAnimateHeart] = useState<boolean>(false);

  // 2b. Automated Video Recording & Test Approval State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const [showRecordingSavedToast, setShowRecordingSavedToast] = useState<boolean>(false);
  const [showLiveTelemetryHUD, setShowLiveTelemetryHUD] = useState<boolean>(true);

  // 3. Selection State inside Classroom
  const [selectedItemId, setSelectedItemId] = useState<string>('intro');
  const [selectedItemType, setSelectedItemType] = useState<'intro' | 'text' | 'video' | 'picture' | 'song'>('intro');
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string>('s1');

  // 4. Modals State
  const [showGoogleLensModal, setShowGoogleLensModal] = useState<boolean>(false);
  const [lensScanState, setLensScanState] = useState<'IDLE' | 'SCANNING' | 'SCANNED'>('IDLE');
  const [showCommandModal, setShowCommandModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [showCreateCoursePathModal, setShowCreateCoursePathModal] = useState<boolean>(false);
  
  // 5. Doubt by Text & Voice State
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [isTutorPaused, setIsTutorPaused] = useState<boolean>(false);
  const [hasRaisedHand, setHasRaisedHand] = useState<boolean>(false);
  const [doubtQueueCount, setDoubtQueueCount] = useState<number>(2);

  // 5b. AI Class Interactive Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState<boolean>(false);

  // 6. Right Panel Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'tutor',
      text: 'Herzlich Willkommen! Today we are mastering core CEFR syntax, situational dialogues, and practical communication.',
      time: '14:02',
      badge: 'Faculty Lead'
    },
    {
      id: 'c2',
      sender: 'ai',
      text: 'Intelli-Coach AI is active in the background. Ask any question via text or touch the microphone icon.',
      time: '14:05',
      badge: 'AI Co-Tutor'
    },
    {
      id: 'c3',
      sender: 'student',
      text: 'Could you clarify the difference between Accusative and Dative prepositions in business conversations?',
      time: '14:10'
    },
    {
      id: 'c4',
      sender: 'tutor',
      text: 'Great question! Remember: "An, auf, in, über, unter, vor, hinter" take Accusative for movement/destination (Wohin?) and Dative for static location (Wo?).',
      time: '14:12',
      badge: 'Faculty Lead'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Playback timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration, playbackSpeed]);

  // Video recording timer simulation
  useEffect(() => {
    let recTimer: any;
    if (isRecording && !isRecordingPaused) {
      recTimer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording, isRecordingPaused]);

  // Load courses and categories dynamically from DB / Course Creator
  useEffect(() => {
    const loadCourses = () => {
      const dbCourses = getGlobalCourses();
      setCourses(dbCourses);
      
      const storedCourseId = localStorage.getItem('ilas_active_library_course_id');
      const storedSectionTab = localStorage.getItem('ilas_active_library_section_tab');

      if (storedSectionTab === 'Intelli Coach Classes') {
        setLibrarySectionTab('INTELLI_COACH');
        localStorage.removeItem('ilas_active_library_section_tab');
      } else if (storedSectionTab === 'Video + AI Answering Classes') {
        setLibrarySectionTab('VIDEO_AI');
        localStorage.removeItem('ilas_active_library_section_tab');
      }

      if (storedCourseId && dbCourses.find(c => c.id === storedCourseId)) {
        setActiveCourseId(storedCourseId);
        localStorage.removeItem('ilas_active_library_course_id');
      } else if (dbCourses.length > 0 && !dbCourses.find(c => c.id === activeCourseId)) {
        setActiveCourseId(dbCourses[0].id);
      }
    };
    const loadCategories = () => {
      setAvailableCategories(getGlobalCategories());
    };

    loadCourses();
    loadCategories();

    const handleCustomNav = (e: any) => {
      if (e.detail?.courseId) {
        setActiveCourseId(e.detail.courseId);
      }
    };

    window.addEventListener('ilas-courses-changed', loadCourses);
    window.addEventListener('ilas-categories-changed', loadCategories);
    window.addEventListener('ilas-navigate-tab', handleCustomNav);

    return () => {
      window.removeEventListener('ilas-courses-changed', loadCourses);
      window.removeEventListener('ilas-categories-changed', loadCategories);
      window.removeEventListener('ilas-navigate-tab', handleCustomNav);
    };
  }, [activeCourseId]);

  // Active course object
  const activeCourse: GlobalCourse = courses.find(c => c.id === activeCourseId) || courses[0] || {
    id: '1',
    name: 'German Language A1–C2',
    top_title: 'German Language & Proficiency',
    subtitle: 'Goethe & Telc Standard Certification Pathways with Clinical & Technical German',
    chapter: '24',
    duration: '16 Weeks',
    staff: 'Nadeem - ID 091 (Senior German Specialist)',
    fee: '$199',
    methods: 'Intelli-Coach AI Path',
    libraryType: 'TUTOR',
    category: 'German Language',
    materials: 'Digital Library & Workbooks'
  };
  const isAICourse = activeCourse.libraryType === 'AI' || activeCourse.name.toLowerCase().includes('ielts') || activeCourse.name.toLowerCase().includes('social');

  // Dynamic secure course access link tied to this database entry (Phase B)
  const secureCourseLink = activeCourse.secureAccessLink || generateSecureCourseLink(activeCourse.id, activeCourse.secureAccessCode);

  const handleCopySecureLink = () => {
    navigator.clipboard.writeText(secureCourseLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Strict Layout Rule: left-side chat history sidebar must remain hidden in Slide + AI and Video + AI views
  const isChatSidebarHidden = activeDeliveryPath === 'SLIDE_AI' || activeDeliveryPath === 'VIDEO_AI';

  // Enrolled students list for the active course
  const enrolledStudents: EnrolledStudent[] = activeCourse.enrolledStudentsList || [
    { id: 's1', name: 'Ananya Sharma', email: 'ananya.sharma@gmail.com', status: 'In Class', joinedAt: '09:00 AM', attendanceScore: 98 },
    { id: 's2', name: 'Lukas Meyer', email: 'lukas.m@tum.de', status: 'Present', joinedAt: '09:05 AM', attendanceScore: 95 },
    { id: 's3', name: 'Priya Kapoor', email: 'priya.k99@gmail.com', status: 'In Class', joinedAt: '09:01 AM', attendanceScore: 92 },
    { id: 's4', name: 'Stefan Weber', email: 'stefan.weber@charite.de', status: 'Invited', joinedAt: 'Pending', attendanceScore: 88 }
  ];

  // Get Book / Curriculum Name according to Active Course
  const getBookName = (courseName: string) => {
    if (courseName.includes('German')) return 'Studio d A1–B2 / Goethe Standard';
    if (courseName.includes('IELTS')) return 'Cambridge IELTS Academic Strategy Book';
    if (courseName.includes('Software')) return 'Full-Stack Architecture & Cloud DevOps Manual';
    if (courseName.includes('SAP')) return 'SAP S/4HANA Enterprise ERP Processes Handbook';
    if (courseName.includes('Social') || courseName.includes('Marketing')) return 'Digital Growth Engineering & Campaigns Guide';
    if (courseName.includes('Medical')) return 'Clinical German & FSP Communication Manual';
    return `${courseName} - Academic Resource Handbook`;
  };

  // Dynamic chapter and content items
  const getChapterItems = (): ChapterItem[] => {
    if (activeCourse.aiPayload?.customChapters && activeCourse.aiPayload.customChapters.length > 0) {
      return activeCourse.aiPayload.customChapters.map((c, i) => ({
        id: c.id,
        number: i + 1,
        title: c.title,
        type: c.type,
        duration: c.duration,
        description: `AI Synthetic Module: ${c.title}`,
        status: (c.status === 'Completed' ? 'Complete' : c.status === 'Ready' ? 'In Progress' : 'In Progress') as any
      }));
    }

    const isGerman = activeCourse.name.includes('German');
    const isTech = activeCourse.name.includes('Software');
    const isSAP = activeCourse.name.includes('SAP');
    const isIELTS = activeCourse.name.includes('IELTS');

    const contentTitles = isGerman ? [
      'Phonetics, Alphabets & Survival Phrases',
      'Daily Introductions, Numbers & Time',
      'Nominative & Accusative Architecture',
      'Workplace Conversations & Emails',
      'Modal Verbs & Professional Etiquette',
      'Dative Case & Directional Prepositions',
      'Past Tense (Perfekt) & Fluency',
      'Clinical & Technical Terminology',
      'Subjunctive II (Konjunktiv II)',
      'Complex Conjunctions (weil, obwohl)',
      'Goethe & Telc Exam Simulation',
      'Final Clinical/Technical Interview'
    ] : isTech ? [
      'React 19 & Next.js Architecture',
      'TypeScript Strict Type Safety',
      'Tailwind CSS Design Systems',
      'State Management & Hooks Optimization',
      'Node.js & Express Microservices',
      'PostgreSQL Schemas & Queries',
      'JWT Auth & OAuth Security',
      'Docker Containerization & Builds',
      'CI/CD GitHub Actions Pipelines',
      'Cloud Deployment on AWS/Vercel',
      'AI Pair Programming & Code Review',
      'Capstone Project & Tech Interview'
    ] : isSAP ? [
      'ERP & S/4HANA Architecture',
      'Master Data Management',
      'General Ledger & Invoicing (FI)',
      'Accounts Payable & Receivable',
      'Procurement Cycle (MM)',
      'Sales Order Management (SD)',
      'Cost Center Accounting (CO)',
      'Integration Between FI, MM, SD',
      'Month-End Closing Procedures',
      'SAP Standard Reports & Queries',
      'Enterprise Business Case Study',
      'Certification Assessment & Mock'
    ] : isIELTS ? [
      'Speaking: Fluency & Coherence',
      'Speaking Part 2: 2-Min Monologue',
      'Writing Task 1: Graph & Chart Data',
      'Writing Task 2: High-Band Essays',
      'Lexical Resource & Collocations',
      'Grammatical Range & Structure',
      'Reading: Skimming & Scanning',
      'Reading: True/False/Not Given',
      'Listening: Section 1-4 Note Taking',
      'Listening: Multi-Accent Decoding',
      'Cambridge Mock Under Timed Pressure',
      '1-on-1 Speaking Evaluation'
    ] : [
      'Foundations & Terminology',
      'Structural Architecture & Workflows',
      'Best Practice & Compliance',
      'Interactive Problem Solving',
      'Intermediate Applied Techniques',
      'Enterprise Case Studies',
      'Real-world Simulations',
      'Quality Assurance & Optimization',
      'Advanced Integration',
      'Industry Standards Analysis',
      'Comprehensive Mock Assessment',
      'Final Certification Review'
    ];

    const items: ChapterItem[] = [
      {
        id: 'intro',
        number: '1',
        title: '1. Intro: Overview & Roadmap',
        type: 'intro',
        duration: '15m',
        status: 'Complete',
        description: 'Complete course curriculum overview, learning goals, CEFR benchmarks, and prerequisites.'
      }
    ];

    contentTitles.forEach((title, idx) => {
      const num = idx + 1;
      items.push({
        id: `content-${num}`,
        number: `C${num}`,
        title: `Content ${num}: ${title}`,
        type: 'text',
        duration: '45m',
        status: num <= 3 ? 'Complete' : num === 4 ? 'In Progress' : 'Locked',
        description: `Detailed deep-dive module covering ${title.toLowerCase()} with exercises and tutor annotations.`
      });
    });

    items.push({
      id: 'media-videos',
      number: '🎬',
      title: 'Videos: HD Masterclasses',
      type: 'video',
      duration: '3.5h',
      status: 'In Progress',
      description: 'High-definition studio lectures, live screen shares, and simulated Native Tutor walkthroughs.'
    });

    items.push({
      id: 'media-pictures',
      number: '🖼️',
      title: 'Pictures: Visual Flashcards',
      type: 'picture',
      duration: '48 cards',
      status: 'Complete',
      description: 'High-resolution grammar architecture charts, vocabulary flashcard decks, and workflow diagrams.'
    });

    items.push({
      id: 'media-songs',
      number: '🎵',
      title: 'Songs: Pronunciation Audio',
      type: 'song',
      duration: '22 tracks',
      status: 'Complete',
      description: 'Phonetic rhythm songs, multi-accent listening comprehension dialogues, and audio pronunciation drills.'
    });

    return items;
  };

  const chapterItems = getChapterItems();
  const selectedItem = chapterItems.find(item => item.id === selectedItemId) || chapterItems[0];

  // Dynamic Subtitles mapped to selected chapter / course
  const getSubtitles = (): SubtitleItem[] => {
    if (activeCourse.aiPayload?.customChapters && activeCourse.aiPayload.customChapters.length > 0) {
      const activeCustomChap = activeCourse.aiPayload.customChapters.find(c => c.id === selectedItemId) || activeCourse.aiPayload.customChapters[0];
      if (activeCustomChap && activeCustomChap.subtitles && activeCustomChap.subtitles.length > 0) {
        return activeCustomChap.subtitles.map(s => ({
          id: s.id,
          title: s.title,
          timestamp: s.timestamp,
          seconds: s.seconds,
          status: (s.status === 'Complete' ? 'Complete' : s.status === 'Ready' ? 'In Progress' : 'In Progress') as any,
          topic: s.topic,
          notes: s.notes,
          keyRules: s.keyRules,
          practicePrompt: s.practicePrompt
        }));
      }
    }

    const isGerman = activeCourse.name.includes('German');
    const isTech = activeCourse.name.includes('Software');
    const isSAP = activeCourse.name.includes('SAP');
    const isIELTS = activeCourse.name.includes('IELTS');

    if (selectedItemId === 'intro') {
      return [
        { 
          id: 's1', 
          title: '1.1 Curriculum Blueprint & Benchmarks', 
          timestamp: '00:00', 
          seconds: 0, 
          status: 'Complete',
          topic: `Introduction to ${activeCourse.name}`,
          notes: `Welcome to the official ${activeCourse.name} master cohort. In this introductory session, we establish the academic roadmap, daily practice routines, and milestone objectives.`,
          keyRules: `• Goal: Master all core units within ${activeCourse.duration}.\n• Target Benchmark: Official Certification & Enterprise Placement.`,
          practicePrompt: `Review the syllabus items in the left sidebar and confirm your study schedule with the faculty.`
        },
        { 
          id: 's2', 
          title: '1.2 Core Prerequisites & Study Tools', 
          timestamp: '08:15', 
          seconds: 495, 
          status: 'Complete',
          topic: `Prerequisites, Digital Workbooks & AI Tools`,
          notes: `Setup your digital workspace: load your vocabulary workbook, access acoustic recording labs, and test microphone permissions for interactive voice drills.`,
          keyRules: `• Digital Portal Access: Synced with your student email pass.\n• Practice Frequency: 30 minutes daily voice + grammar rehearsal.`,
          practicePrompt: `Click on 'Pictures' or 'Songs' in the left menu to verify your multimedia flashcards.`
        },
        { 
          id: 's3', 
          title: '1.3 Live Whiteboard Demonstration', 
          timestamp: '18:40', 
          seconds: 1120, 
          status: 'In Progress',
          topic: `Interactive Whiteboard Diagnostic Test`,
          notes: `Faculty and AI tutor demonstrate live problem solving, sentence structuring, and situational roleplay drills on the main canvas.`,
          keyRules: `• Standard Grammar Order: Subject + Verb + Object / Temporal + Causal + Modal + Local (TeKaMoLo).\n• Always verify case declension before speaking.`,
          practicePrompt: `Type a sample question in the Live Chat to test AI and Faculty response scoring.`
        },
        { 
          id: 's4', 
          title: '1.4 Summary & Baseline Quiz', 
          timestamp: '32:10', 
          seconds: 1930, 
          status: 'In Progress',
          topic: `Baseline Assessment & Milestone Roadmap`,
          notes: `A quick 5-question baseline evaluation to gauge your starting proficiency and personalize upcoming lesson recommendations.`,
          keyRules: `• Passing threshold for milestone badges: 80%+ on weekly module quizzes.`,
          practicePrompt: `Use the AI Command Palette (/quiz-me) from the control bar below to test your recall.`
        }
      ];
    }

    if (isGerman) {
      return [
        { 
          id: 's1', 
          title: '1.1 Phonetics & Pronunciation Rules', 
          timestamp: '00:00', 
          seconds: 0, 
          status: 'Complete',
          topic: `German Phonetic Foundations & Vowel Length`,
          notes: `Understanding long vs. short vowels, diphthongs (ei, eu, au), and the distinct pronunciation of the German 'ch' (ich-Laut vs. ach-Laut).`,
          keyRules: `• Vowel + Double Consonant = Short vowel (z.B. Bitte, Wasser).\n• Vowel + 'h' = Long vowel (z.B. Gehen, Wohnen).\n• 'ch' after a, o, u, au = Throat sound [x] (z.B. Buch, Sprache).`,
          practicePrompt: `Speak into the microphone: "Guten Tag, ich lerne Deutsch in der Akademie."`
        },
        { 
          id: 's2', 
          title: '1.2 Nominative vs. Accusative Case', 
          timestamp: '11:20', 
          seconds: 680, 
          status: 'In Progress',
          topic: `Direct Object Transformation & Article Declension`,
          notes: `In the Accusative case, only the masculine article changes (der -> den, ein -> einen). Feminine, neuter, and plural remain identical to Nominative.`,
          keyRules: `• Masculine: der Mann -> den Mann (einen Mann / keinen Mann)\n• Feminine: die Frau -> die Frau (eine Frau / keine Frau)\n• Neuter: das Kind -> das Kind (ein Kind / kein Kind)`,
          practicePrompt: `Transform: "Der Kaffee ist gut." -> "Ich trinke ______ (der Kaffee)."`
        },
        { 
          id: 's3', 
          title: '1.3 Practical Sentence Drills', 
          timestamp: '23:45', 
          seconds: 1425, 
          status: 'In Progress',
          topic: `Verb Conjugation in Position 2 & Time Expressions`,
          notes: `In standard German declarative sentences, the conjugated verb ALWAYS occupies Position 2, regardless of whether the sentence starts with the subject or a time adverb.`,
          keyRules: `• Structure: [Heute] (Pos 1) + [lerne] (Pos 2) + [ich] + [Deutsch].`,
          practicePrompt: `Re-arrange: "am Wochenende / wir / fahren / nach Berlin".`
        },
        { 
          id: 's4', 
          title: '1.4 Situational Dialogue & Quiz', 
          timestamp: '36:10', 
          seconds: 2170, 
          status: 'Locked',
          topic: `Everyday Conversation: At the Café & Workplace`,
          notes: `Ordering food, asking for bills, scheduling appointments, and formal greeting etiquette with Sie vs. du.`,
          keyRules: `• Polite Formula: "Ich hätte gerne..." / "Könnten Sie bitte..."`,
          practicePrompt: `Respond to the tutor: "Was möchten Sie trinken?"`
        }
      ];
    }

    if (isTech) {
      return [
        { 
          id: 's1', 
          title: '1.1 System Architecture & Clean Code', 
          timestamp: '00:00', 
          seconds: 0, 
          status: 'Complete',
          topic: `Modern Modular Architecture & Dependency Inversion`,
          notes: `Establishing strict component separation, typed REST interfaces, decoupled state models, and scalable file structures.`,
          keyRules: `• Separation of Concerns: UI components strictly decoupled from data-fetching services.\n• Strict TypeScript interfaces for all payload schemas.`,
          practicePrompt: `Design the interface schema for a multi-tenant user profile.`
        },
        { 
          id: 's2', 
          title: '1.2 State Management & Performance', 
          timestamp: '14:30', 
          seconds: 870, 
          status: 'In Progress',
          topic: `React Hooks, Memoization & Reactivity`,
          notes: `Preventing unnecessary re-renders with useMemo/useCallback, optimizing virtual DOM reconciliation, and managing global stores.`,
          keyRules: `• Dependency array hygiene: include all referenced variables in effect hooks.\n• Use immutable state updates.`,
          practicePrompt: `Optimize a slow table re-render using lightweight memoization.`
        },
        { 
          id: 's3', 
          title: '1.3 Microservices & Database Queries', 
          timestamp: '26:15', 
          seconds: 1575, 
          status: 'In Progress',
          topic: `PostgreSQL Indexing, Transactions & Express APIs`,
          notes: `Designing relational schemas with foreign key constraints, indexing frequently filtered columns, and handling ACID transactions safely.`,
          keyRules: `• Always index foreign keys and search query columns.\n• Wrap multi-step mutations in BEGIN...COMMIT blocks.`,
          practicePrompt: `Write an indexed SQL query for fetching all active enrollments.`
        },
        { 
          id: 's4', 
          title: '1.4 Deployment CI/CD & Security Audits', 
          timestamp: '39:00', 
          seconds: 2340, 
          status: 'Locked',
          topic: `Docker Multi-stage Builds & Automated Testing`,
          notes: `Writing GitHub Actions workflows, running static lint and build validations, and deploying containerized microservices.`,
          keyRules: `• Never commit secrets: load via environment variables (.env).\n• Multi-stage Docker builds reduce image size by up to 75%.`,
          practicePrompt: `Review container build steps in the terminal simulation.`
        }
      ];
    }

    return [
      { 
        id: 's1', 
        title: '1.1 Core Principles & Terminology', 
        timestamp: '00:00', 
        seconds: 0, 
        status: 'Complete',
        topic: `${selectedItem.title} - Fundamentals`,
        notes: `Deep-dive exploration into core industry terminology, foundational principles, and required framework understanding for ${activeCourse.name}.`,
        keyRules: `• Master foundational concepts before advancing to enterprise scenarios.`,
        practicePrompt: `Summarize 3 core principles covered in this lecture.`
      },
      { 
        id: 's2', 
        title: '1.2 Practical Implementation Workflows', 
        timestamp: '13:10', 
        seconds: 790, 
        status: 'In Progress',
        topic: `Applied Problem Solving & Step-by-Step Walkthrough`,
        notes: `Step-by-step guidance through real-world business scenarios, standard operating procedures, and common troubleshooting tips.`,
        keyRules: `• Follow standard procedural checklists for verification.`,
        practicePrompt: `Follow the step-by-step drill displayed on the whiteboard canvas.`
      },
      { 
        id: 's3', 
        title: '1.3 Enterprise Simulation & Best Practices', 
        timestamp: '25:50', 
        seconds: 1550, 
        status: 'In Progress',
        topic: `Live Enterprise Case Study & Diagnostics`,
        notes: `Reviewing enterprise case studies, audit compliance, and best-practice performance benchmarks with the instructor.`,
        keyRules: `• Document all operational steps for audit compliance.`,
        practicePrompt: `Identify potential bottlenecks in the presented case study.`
      },
      { 
        id: 's4', 
        title: '1.4 Module Review & Knowledge Check', 
        timestamp: '38:30', 
        seconds: 2310, 
        status: 'Locked',
        topic: `Takeaway Summary & Mastery Assessment`,
        notes: `Comprehensive wrap-up quiz and key takeaway review to reinforce learning outcomes and unlock the next chapter module.`,
        keyRules: `• 80% passing score unlocks subsequent content modules.`,
        practicePrompt: `Complete the interactive knowledge check questions.`
      }
    ];
  };

  const subtitles = getSubtitles();
  const selectedSubtitle = subtitles.find(s => s.id === selectedSubtitleId) || subtitles[0];

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timeline scrub
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(Math.round(pos * totalDuration));
  };

  // Integrated Chat Submit
  const handleSendChat = (e?: React.FormEvent, customMsg?: string, isVoice: boolean = false) => {
    if (e) e.preventDefault();
    const textToSend = customMsg || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: 'student',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customMsg) setChatInput('');

    if (!isAICourse) {
      setDoubtQueueCount(prev => prev + 1);
    }

    setTimeout(() => {
      let replyText = `Thanks for asking about "${userMsg.text}". In ${activeCourse.name}, this is covered thoroughly in Module 3. Check the flashcards in the left list!`;
      
      if (isAICourse) {
        replyText = `⚡ [Intelli-Coach AI Solution]:\n• Core Rule: In ${selectedSubtitle.topic}, standard protocols apply.\n• Application: Follow case endings & word order.\n• Tip: Check Sub-title ${selectedSubtitle.title} to rewatch the breakdown!`;
      } else {
        replyText = `👨‍🏫 [Faculty ${activeCourse.staff}]: Great question regarding ${selectedSubtitle.title}! I've noted this on the main whiteboard for everyone.`;
      }

      const replyMsg: ChatMessage = {
        id: `c-reply-${Date.now()}`,
        sender: isAICourse ? 'ai' : 'tutor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: isAICourse ? 'Intelli-Coach AI' : 'Faculty Lead'
      };
      setChatMessages(prev => [...prev, replyMsg]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  // Voice Recording Toggle
  const toggleVoiceRecording = () => {
    if (!isVoiceListening) {
      setIsVoiceListening(true);
      setTimeout(() => {
        setIsVoiceListening(false);
        const voiceQuestion = `How do I pronounce the umlaut 'ä' and 'ö' in fluent conversation?`;
        handleSendChat(undefined, `🎙️ [Voice Input]: "${voiceQuestion}"`, true);
      }, 2500);
    } else {
      setIsVoiceListening(false);
    }
  };

  // Heart appreciation
  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 800);
  };

  // Copy share demo link
  const handleShareDemo = () => {
    const demoUrl = `${window.location.origin}/#classroom?course=${encodeURIComponent(activeCourse.name)}&demo=true`;
    navigator.clipboard.writeText(demoUrl).catch(() => {});
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  // Switch Active Course
  const selectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setSelectedItemId('intro');
    setSelectedItemType('intro');
    setSelectedSubtitleId('s1');
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Update Course Approval Status
  const handleUpdateApproval = (status: 'Approved' | 'Requires Refinement' | 'Pending Review') => {
    const updated = courses.map(c => c.id === activeCourse.id ? { ...c, testApprovalStatus: status } : c);
    setCourses(updated);
    setGlobalCourses(updated);
    window.dispatchEvent(new CustomEvent('ilas-courses-changed'));
    alert(`Course "${activeCourse.name}" test approval status updated to: ${status}`);
  };

  // Video Recording Controls
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsRecordingPaused(false);
      setRecordingSeconds(0);
    } else if (isRecording && isRecordingPaused) {
      setIsRecordingPaused(false);
    } else {
      setIsRecordingPaused(true);
    }
  };

  const stopAndSaveRecording = () => {
    setIsRecording(false);
    setIsRecordingPaused(false);
    const recordedTimestamp = new Date().toLocaleString();
    const mockRecUrl = `https://ilas.storage/recordings/rec-${activeCourse.id}-${Date.now()}.mp4`;
    
    const updated = courses.map(c => c.id === activeCourse.id ? { 
      ...c, 
      recordedSessionUrl: mockRecUrl,
      recordedSessionDate: recordedTimestamp,
      testApprovalStatus: c.testApprovalStatus || 'Pending Review'
    } : c);
    setCourses(updated);
    setGlobalCourses(updated);
    window.dispatchEvent(new CustomEvent('ilas-courses-changed'));
    
    setShowRecordingSavedToast(true);
    setTimeout(() => setShowRecordingSavedToast(false), 4000);
  };

  const handleDownloadRecording = () => {
    alert(`Downloading verified class session recording for "${activeCourse.name}" (MP4 Full-HD)...`);
  };

  // Extract Categories Dynamically for Dropdown Filter
  const categoriesList = [
    'All Categories',
    ...Array.from(new Set([
      ...availableCategories.map(c => c.name),
      ...courses.map(c => c.category).filter(Boolean) as string[]
    ]))
  ];

  // Filtered Courses for List / Grid and Sidebar
  const filteredCourses = courses.filter(c => {
    const isIntelliCoach = c.aiLibrarySection === 'Intelli Coach Classes' || (c.libraryType === 'AI' && !c.name.includes('Video') && !c.aiLibrarySection);
    const isVideoAI = c.aiLibrarySection === 'Video + AI Answering Classes' || (c.libraryType === 'AI' && c.name.includes('Video')) || c.name.includes('IELTS') || c.name.includes('Social');
    const isTutor = c.libraryType === 'TUTOR' || (!c.libraryType && !c.aiLibrarySection);

    // 1. Dual Library Sub-Navigation Filter
    if (librarySectionTab === 'INTELLI_COACH' && !isIntelliCoach) return false;
    if (librarySectionTab === 'VIDEO_AI' && !isVideoAI) return false;
    if (librarySectionTab === 'TUTOR' && !isTutor) return false;

    // 2. Category Dropdown Filter
    if (selectedCategory !== 'All Categories') {
      const cat = (c.category || '').toLowerCase();
      const subCat = (c.subCategory || '').toLowerCase();
      const name = c.name.toLowerCase();
      const sel = selectedCategory.toLowerCase();
      
      const isMatch = cat.includes(sel) || sel.includes(cat) || subCat.includes(sel) || sel.includes(subCat) || name.includes(sel) || sel.includes(name);
      if (!isMatch) return false;
    }

    return true;
  });

  const intelliCoachCount = courses.filter(c => c.aiLibrarySection === 'Intelli Coach Classes' || (c.libraryType === 'AI' && !c.name.includes('Video') && !c.aiLibrarySection)).length;
  const videoAICount = courses.filter(c => c.aiLibrarySection === 'Video + AI Answering Classes' || (c.libraryType === 'AI' && c.name.includes('Video')) || c.name.includes('IELTS') || c.name.includes('Social')).length;
  const tutorCount = courses.filter(c => c.libraryType === 'TUTOR' || (!c.libraryType && !c.aiLibrarySection)).length;

  return (
    <div className="w-full max-w-full flex flex-col gap-5 p-2 md:p-3 bg-slate-50 min-h-full font-sans text-slate-900 animate-in fade-in">
      
      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs">Live Classroom Demo Link Copied!</div>
            <div className="text-[10px] text-slate-400">Share with students or corporate candidates to join.</div>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. DYNAMIC SECURE ACCESS LINK BANNER & QUICK CREATE TRIGGER (PHASE A & B)
      ========================================================================= */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
            <LinkIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Unique Secure Course Link
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Code: {activeCourse.secureAccessCode || 'SEC-ACTIVE'}</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 truncate mt-0.5">
              {secureCourseLink}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleCopySecureLink}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedLink 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Secure Link'}</span>
          </button>

          <button
            onClick={() => window.open(secureCourseLink, '_blank')}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch Student View</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ring-2 ring-amber-400/30"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span>Create Course & Path</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. DELIVERY FORMAT SELECTOR BAR (ALL 5 DELIVERY PATHS)
      ========================================================================= */}
      <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 px-2 py-1">
            Active Delivery Path:
          </span>

          {/* 1. Slide + AI */}
          <button
            onClick={() => setActiveDeliveryPath('SLIDE_AI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeDeliveryPath === 'SLIDE_AI'
                ? 'bg-indigo-600 text-white shadow-xs font-black ring-1 ring-indigo-400'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Slide + AI</span>
            <span className="text-[9px] px-1 py-0.2 bg-white/20 rounded-full">Chat Hidden</span>
          </button>

          {/* 2. Video + AI */}
          <button
            onClick={() => setActiveDeliveryPath('VIDEO_AI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeDeliveryPath === 'VIDEO_AI'
                ? 'bg-purple-600 text-white shadow-xs font-black ring-1 ring-purple-400'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Video + AI</span>
            <span className="text-[9px] px-1 py-0.2 bg-white/20 rounded-full">Chat Hidden</span>
          </button>

          {/* 3. IntelliCoach */}
          <button
            onClick={() => setActiveDeliveryPath('INTELLI_COACH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeDeliveryPath === 'INTELLI_COACH'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black ring-1 ring-amber-300'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>IntelliCoach AI</span>
            <span className="text-[9px] px-1 py-0.2 bg-white/20 rounded-full">Interactive Book</span>
          </button>

          {/* 4. 1-to-1 Coaching */}
          <button
            onClick={() => setActiveDeliveryPath('ONE_ON_ONE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeDeliveryPath === 'ONE_ON_ONE'
                ? 'bg-emerald-600 text-white shadow-xs font-black ring-1 ring-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1-to-1 Coaching</span>
          </button>

          {/* 5. Camps & Sports */}
          <button
            onClick={() => setActiveDeliveryPath('CAMPS_SPORTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeDeliveryPath === 'CAMPS_SPORTS'
                ? 'bg-rose-600 text-white shadow-xs font-black ring-1 ring-rose-400'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Camps & Sports</span>
            <span className="text-[9px] px-1 py-0.2 bg-white/20 rounded-full">{campTab}</span>
          </button>
        </div>

        {/* Strict Layout Rule Indicator */}
        {isChatSidebarHidden && (
          <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 font-bold shrink-0 hidden md:inline">
            ✨ Strict Layout Rule Active: Left chat history sidebar hidden for maximized focus
          </span>
        )}
      </div>

      {/* Main 3-Column Classroom Layout (Maximized Canvas, Layout Isolation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: SLEEK MINIMALIST CHAPTER LIST (lg:col-span-3 xl:col-span-3)
        ========================================================================= */}
        <aside className="lg:col-span-3 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          
          {/* Header with Active Course and Library Tagging */}
          <div className="p-3.5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                isAICourse 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-brand-50 text-brand-800 border-brand-200'
              }`}>
                {isAICourse ? '⚡ AI Library' : '🎓 Tutorial Library'}
              </span>
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-600" /> {activeCourse.duration}
              </span>
            </div>
            
            <div>
              <h2 className="text-sm font-black text-slate-900 truncate" title={activeCourse.name}>
                {activeCourse.name}
              </h2>
              <p className="text-[10px] text-brand-700 font-semibold truncate" title={getBookName(activeCourse.name)}>
                📖 {getBookName(activeCourse.name)}
              </p>
            </div>
          </div>

          {/* Sleek Minimalist Vertical Chapter List */}
          <div className="p-2 flex flex-col max-h-[600px] overflow-y-auto divide-y divide-slate-100">
            {chapterItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setSelectedItemType(item.type);
                    setSelectedSubtitleId('s1');
                  }}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-between gap-2 text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50/90 text-brand-900 font-bold border-l-3 border-brand-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[11px] shrink-0 ${
                      item.type === 'video' ? 'text-indigo-600' :
                      item.type === 'picture' ? 'text-pink-600' :
                      item.type === 'song' ? 'text-purple-600' :
                      'text-brand-600'
                    }`}>
                      {item.type === 'video' ? <Video className="w-3.5 h-3.5" /> :
                       item.type === 'picture' ? <ImageIcon className="w-3.5 h-3.5" /> :
                       item.type === 'song' ? <Music className="w-3.5 h-3.5" /> :
                       item.type === 'intro' ? <BookOpen className="w-3.5 h-3.5" /> :
                       <FileText className="w-3.5 h-3.5" />}
                    </span>

                    <span className="truncate text-xs">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">{item.duration}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'Complete' ? 'bg-emerald-500' :
                      item.status === 'In Progress' ? 'bg-indigo-500 animate-pulse' :
                      'bg-slate-300'
                    }`} title={item.status} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Quick Links */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Curriculum Studio</span>
            <button
              onClick={() => onNavigateTab?.('COURSE CREATE')}
              className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-0.5 cursor-pointer"
            >
              Course Creator <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </aside>


        {/* =========================================================================
            CENTER COLUMN: DYNAMIC DELIVERY PATH CANVAS (SLIDE+AI, VIDEO+AI, INTELLICOACH, 1-ON-1, CAMPS)
        ========================================================================= */}
        <main className={`${isChatSidebarHidden ? 'lg:col-span-9 xl:col-span-9' : 'lg:col-span-6 xl:col-span-6'} flex flex-col gap-4`}>
          
          {activeDeliveryPath === 'SLIDE_AI' ? (
            /* =========================================================================
                SLIDE + AI DELIVERY PATH (Strict Layout Rule: Left Chat Sidebar Hidden)
            ========================================================================= */
            <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 flex flex-col text-white">
              {/* Slide Header Toolbar */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-indigo-900/40 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-xs font-black text-white">{activeCourse.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
                    Slide + AI Studio
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBookDrawer(!showBookDrawer)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      showBookDrawer ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{showBookDrawer ? 'Hide Study Book' : 'Study Book Reference'}</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-300 px-2.5 py-1 bg-white/10 rounded-lg">
                    Slide {slideIndex + 1} / {lessonSlides.length}
                  </span>
                </div>
              </div>

              {/* Main Slide Presentation Canvas */}
              <div className="p-6 md:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between min-h-[440px] space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider">
                      Curriculum Concept Slide Deck
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">CEFR Target: {activeCourse.top_title || 'Level A1–B2'}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                    {lessonSlides[slideIndex].title}
                  </h3>

                  {/* Rule Highlight Callout */}
                  <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 space-y-1">
                    <div className="text-[10px] font-black uppercase text-amber-300">Grammar & Syntax Rule</div>
                    <p className="text-sm font-semibold text-indigo-100">{lessonSlides[slideIndex].rule}</p>
                  </div>

                  {/* Audio Drill & Phonetic Examples */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400">Audio Drill & Phonetic Articulation:</div>
                    <div className="flex flex-wrap gap-2">
                      {lessonSlides[slideIndex].examples.map((ex, exIdx) => (
                        <div key={exIdx} className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-mono flex items-center gap-2">
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Whiteboard Notes */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Whiteboard Synthesis Notes:</div>
                    <div>{lessonSlides[slideIndex].whiteboardNotes}</div>
                  </div>
                </div>

                {/* Book Reference Drawer when open */}
                {showBookDrawer && (
                  <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs space-y-1 animate-in fade-in">
                    <div className="font-black text-amber-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Official Study Book Notes & Chapter Lexicon
                    </div>
                    <p className="text-xs text-amber-100 leading-relaxed">
                      {lessonSlides[slideIndex].bookReference}
                    </p>
                  </div>
                )}

                {/* Slide Navigation Footer Bar */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-4 flex-wrap gap-2">
                  <button
                    onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
                    disabled={slideIndex === 0}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    ← Previous Slide
                  </button>

                  <div className="flex items-center gap-1.5">
                    {lessonSlides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setSlideIndex(dotIdx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          slideIndex === dotIdx ? 'bg-amber-400 scale-125' : 'bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setSlideIndex(prev => Math.min(lessonSlides.length - 1, prev + 1))}
                    disabled={slideIndex === lessonSlides.length - 1}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-xs font-bold text-white transition-all cursor-pointer shadow-md"
                  >
                    Next Slide →
                  </button>
                </div>
              </div>
            </div>
          ) : activeDeliveryPath === 'ONE_ON_ONE' ? (
            /* =========================================================================
                1-TO-1 COACHING SESSION DELIVERY PATH
            ========================================================================= */
            <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 flex flex-col text-white p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-black text-white">1-to-1 Private Coaching Session Studio</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  Lead Instructor: {activeCourse.staff}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center min-h-[220px] text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-black text-sm text-white">Private Audio/Video Coaching Room</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Direct 1-on-1 coaching for oral FSP medical defense, job interview rehearsal, and thesis defense.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert(`Starting 1-to-1 coaching room for ${activeCourse.name}...`)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                  >
                    Launch 1-to-1 Live Room
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="font-black text-amber-300 text-[11px] uppercase tracking-wider">
                    Today's Session Roadmap:
                  </div>
                  <ul className="space-y-2 text-slate-300 text-[11px]">
                    <li className="flex items-center gap-1.5 text-emerald-400">
                      ✓ <span>10m: Pronunciation diagnostics & accent acoustic tuning</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-400">
                      ✓ <span>20m: Simulated Doctor-Patient anamnesis dialogue</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-slate-300">
                      • <span>15m: Technical review & customized homework drills</span>
                    </li>
                  </ul>
                  <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                    Next Scheduled Session: Tomorrow at 10:00 AM CET with {activeCourse.staff}.
                  </div>
                </div>
              </div>
            </div>
          ) : activeDeliveryPath === 'CAMPS_SPORTS' ? (
            /* =========================================================================
                CAMPS & SPORTS CLASSES DELIVERY PATH (Online Drills vs Offline Stadium)
            ========================================================================= */
            <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 flex flex-col text-white p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-black text-white">Camps & Athletic Training Studio</h3>
                </div>
                
                {/* Sub-categorization into Online and Offline modes */}
                <div className="flex items-center bg-black/50 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setCampTab('Online')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      campTab === 'Online' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Online Mode (Drills)
                  </button>
                  <button
                    onClick={() => setCampTab('Offline')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      campTab === 'Offline' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Offline Mode (Stadium Venue)
                  </button>
                </div>
              </div>

              {campTab === 'Online' ? (
                <div className="p-5 rounded-2xl bg-black border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-rose-300">Online Live Conditioning & Tactical Stream</div>
                  <p className="text-xs text-slate-300">High-intensity functional conditioning routines and live tactical positioning drills streamed in Full-HD.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-black">Warm-up Drill</span>
                      <div className="font-bold text-white mt-1">15 Mins Cardio & Agility</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-black">Tactical Strategy</span>
                      <div className="font-bold text-white mt-1">Movement Analysis</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-black">Cooldown</span>
                      <div className="font-bold text-white mt-1">Mobility Routine</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-black border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-300">Offline Stadium & Venue Allocation</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">Biometric Gate: Active</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-bold text-white">{activeCourse.campVenue || 'ILA Sports Complex & Arena (Pitch 4)'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-6">
                      Check-in Requirement: Digital QR Pass or Biometric RFID Card scan at Stadium Entrance Gate A.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
                VIDEO + AI / INTELLICOACH VIDEO SCREEN (Canvas View)
            ========================================================================= */
            <div 
              ref={playerContainerRef}
              className="w-full bg-black rounded-2xl overflow-hidden shadow-xl border border-zinc-800 flex flex-col relative text-white"
            >
            
            {/* Top Stream Status Overlay & Testing Controls */}
            <div className="px-4 py-2.5 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex flex-wrap items-center justify-between gap-2 z-20">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
                </span>

                <span className="text-xs font-bold text-zinc-200 truncate max-w-[220px]">
                  {activeCourse.name}
                </span>

                {/* Library Category Badge */}
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                  activeCourse.aiLibrarySection === 'Video + AI Answering Classes'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-700/50'
                    : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
                }`}>
                  {activeCourse.aiLibrarySection || 'Intelli Coach Class'}
                </span>
              </div>

              {/* Top Right: Recording Controls & Test Approval Status */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Automated Video Recording Pill */}
                {isRecording ? (
                  <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/60 px-2.5 py-1 rounded-xl text-[10px] font-black text-red-300 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>REC {formatTime(recordingSeconds)}</span>
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className="ml-1 text-white hover:text-red-200 cursor-pointer"
                      title={isRecordingPaused ? 'Resume Recording' : 'Pause Recording'}
                    >
                      {isRecordingPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={stopAndSaveRecording}
                      className="ml-1 bg-red-600 hover:bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] cursor-pointer"
                      title="Save & Store Video"
                    >
                      Stop
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-white border border-red-500/40 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Start Rec</span>
                  </button>
                )}

                {/* Test Approval Status Action */}
                <div className="relative group">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer border ${
                    activeCourse.testApprovalStatus === 'Approved'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                      : activeCourse.testApprovalStatus === 'Requires Refinement'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-600/50'
                      : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{activeCourse.testApprovalStatus || 'Pending Review'}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </span>

                  {/* Dropdown for Admin Approval Actions */}
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl p-1.5 shadow-2xl z-30 min-w-[170px] space-y-1 animate-in fade-in">
                    <button
                      type="button"
                      onClick={() => handleUpdateApproval('Approved')}
                      className="px-2.5 py-1.5 text-left text-[11px] font-bold text-emerald-400 hover:bg-emerald-950/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Class
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateApproval('Requires Refinement')}
                      className="px-2.5 py-1.5 text-left text-[11px] font-bold text-rose-400 hover:bg-rose-950/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5" /> Request Refinements
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateApproval('Pending Review')}
                      className="px-2.5 py-1.5 text-left text-[11px] font-bold text-amber-400 hover:bg-amber-950/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" /> Reset to Pending
                    </button>
                  </div>
                </div>

                {/* Strategy Telemetry HUD Toggle */}
                <button
                  type="button"
                  onClick={() => setShowLiveTelemetryHUD(!showLiveTelemetryHUD)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    showLiveTelemetryHUD 
                      ? 'bg-indigo-600/40 text-indigo-300 border-indigo-500/50' 
                      : 'bg-white/10 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                  title="Toggle Real-Time Strategy Telemetry HUD"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Seamless Visual Canvas Area with DYNAMIC SUBTITLE CONTENT */}
            <div className="aspect-[16/9.2] w-full flex flex-col justify-between relative bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-5 md:p-6 overflow-hidden">
              
              {/* Dynamic Content Display (Directly on Canvas Background) */}
              {selectedItemType === 'video' ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 my-auto z-10 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-xl backdrop-blur-md">
                    <Video className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedSubtitle.topic}</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedSubtitle.notes}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-105"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    {isPlaying ? 'Pause Video' : `Stream ${selectedSubtitle.title}`}
                  </button>
                </div>
              ) : selectedItemType === 'picture' ? (
                <div className="flex flex-col items-center justify-center text-center space-y-3 my-auto z-10 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-sm text-pink-200">{selectedSubtitle.topic} - Visual Mind Map</h4>
                  <div className="text-xs text-zinc-300 font-mono space-y-1 text-center">
                    <div>📌 Topic: {activeCourse.name} Architecture Map</div>
                    <div>📊 CEFR Target: A1 to B2 / Enterprise Standard Certification</div>
                  </div>
                  <button 
                    onClick={() => setShowGoogleLensModal(true)}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> Scan with Google Lens AI
                  </button>
                </div>
              ) : selectedItemType === 'song' ? (
                <div className="flex flex-col items-center justify-center text-center space-y-3.5 my-auto z-10 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-xl">
                    <Music className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-purple-200">{selectedSubtitle.topic}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedSubtitle.notes}</p>
                  </div>
                  <div className="flex items-center gap-1.5 h-6">
                    {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85].map((h, i) => (
                      <span 
                        key={i} 
                        style={{ height: `${isPlaying ? h : 25}%` }} 
                        className={`w-1.5 bg-purple-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    {isPlaying ? 'Pause Audio' : 'Play Track'}
                  </button>
                </div>
              ) : (
                /* Dynamic Interactive Lecture Canvas based on CLICKED SUB-TITLE */
                <div className="w-full flex-1 flex flex-col justify-between z-10 text-left space-y-2.5">
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {selectedSubtitle.title}
                      </span>
                      <span className="text-zinc-400 font-mono text-[10px]">{selectedSubtitle.timestamp} • {activeCourse.staff}</span>
                    </div>

                    <h3 className="text-base md:text-lg font-black text-white">{selectedSubtitle.topic}</h3>
                    
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {selectedSubtitle.notes}
                    </p>

                    {selectedSubtitle.keyRules && (
                      <div className="p-2.5 bg-brand-950/40 rounded-xl border border-brand-500/20 text-xs space-y-1">
                        <div className="font-bold text-amber-300 flex items-center gap-1">
                          📌 Lesson Rules & Grammar Focus:
                        </div>
                        <div className="text-[11px] text-zinc-300 font-mono leading-relaxed whitespace-pre-line">
                          {selectedSubtitle.keyRules}
                        </div>
                      </div>
                    )}

                    {selectedSubtitle.practicePrompt && (
                      <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-xs space-y-1">
                        <div className="font-bold text-emerald-300 flex items-center gap-1">
                          💡 Interactive Whiteboard Drill:
                        </div>
                        <div className="text-[11px] text-emerald-200">
                          {selectedSubtitle.practicePrompt}
                        </div>
                      </div>
                    )}
                    {/* AI Generated Interactive Sample Exercise / Quiz if available */}
                    {activeCourse.aiPayload?.sampleExercise && (
                      <div className="p-3.5 bg-indigo-950/60 rounded-xl border border-indigo-500/40 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                            AI Autonomous Whiteboard Quiz:
                          </span>
                          <span className="text-[10px] text-indigo-300 font-mono">Live Interactive Drill</span>
                        </div>
                        <div className="text-white font-semibold">
                          {activeCourse.aiPayload.sampleExercise.question}
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {activeCourse.aiPayload.sampleExercise.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizAnswer === opt;
                            const isCorrect = opt === activeCourse.aiPayload?.sampleExercise?.correctAnswer;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  setSelectedQuizAnswer(opt);
                                  setShowQuizFeedback(true);
                                }}
                                className={`p-2 rounded-lg text-xs font-bold text-left transition-all border cursor-pointer ${
                                  showQuizFeedback && isSelected
                                    ? isCorrect 
                                      ? 'bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-300'
                                      : 'bg-red-600/90 text-white border-red-400 ring-2 ring-red-300'
                                    : 'bg-zinc-900/80 text-zinc-200 border-zinc-700 hover:bg-zinc-800 hover:border-indigo-400'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {showQuizFeedback && selectedQuizAnswer && (
                          <div className={`p-2 rounded-lg text-[11px] font-bold ${
                            selectedQuizAnswer === activeCourse.aiPayload.sampleExercise.correctAnswer
                              ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                              : 'bg-red-900/60 text-red-200 border border-red-500/40'
                          }`}>
                            {selectedQuizAnswer === activeCourse.aiPayload.sampleExercise.correctAnswer
                              ? `✓ Correct! ${activeCourse.aiPayload.sampleExercise.explanation}`
                              : `✗ Incorrect. ${activeCourse.aiPayload.sampleExercise.explanation}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {showCaptions && (
                    <div className="text-center text-xs text-amber-300 font-medium py-1 bg-black/40 rounded-lg">
                      💬 [{captionLang} CC]: "Streaming {selectedSubtitle.title} • Follow the lesson drills on screen."
                    </div>
                  )}
                </div>
              )}

              <div className="absolute inset-0 bg-radial from-brand-600/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* =========================================================================
                CLEAN, SINGLE-LINE BOTTOM CONTROLS BAR UNDER VIDEO
            ========================================================================= */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-2 z-20">
              
              {/* Scrubbable Timeline Progress Bar */}
              <div 
                onClick={handleTimelineClick}
                className="w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer transition-all relative group"
              >
                <div 
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                  className="h-full bg-gradient-to-r from-brand-500 to-amber-400 rounded-full relative"
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover:scale-100 transition-transform"></span>
                </div>
              </div>

              {/* Single Line Controls Row */}
              <div className="flex items-center justify-between gap-3 text-xs">
                
                {/* Left: Play/Pause, Time, Volume Bar with Hover Slider */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-xl bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <span className="font-mono text-xs font-bold text-zinc-300">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                  </span>

                  {/* Volume with Upward Popover / Slider */}
                  <div 
                    className="relative flex items-center"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 text-zinc-300 hover:text-white cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {showVolumeSlider && (
                      <div className="absolute bottom-full left-0 mb-2 p-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-30 flex items-center gap-2 animate-in fade-in">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(Number(e.target.value));
                            setIsMuted(false);
                          }}
                          className="w-20 h-1 bg-white/30 accent-brand-500 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-zinc-400 w-6">{volume}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Clean Icons Only (Share, Google Lens, Command, Profile, Heart, CC, Fullscreen) */}
                <div className="flex items-center gap-2">
                  
                  {/* Share Icon Only */}
                  <button
                    onClick={handleShareDemo}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white transition-all cursor-pointer"
                    title="Share Live Demo Link"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                  </button>

                  {/* Google Lens Icon Only */}
                  <button
                    onClick={() => setShowGoogleLensModal(true)}
                    className="p-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white transition-all border border-indigo-500/30 cursor-pointer"
                    title="Google Lens AI Visual Scan"
                  >
                    <Camera className="w-4 h-4 text-indigo-400" />
                  </button>

                  {/* Command Icon Only */}
                  <button
                    onClick={() => setShowCommandModal(true)}
                    className="p-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white transition-all border border-purple-500/30 cursor-pointer"
                    title="AI Command Palette"
                  >
                    <Command className="w-4 h-4 text-purple-400" />
                  </button>

                  {/* Profile Picture / Settings Icon */}
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="flex items-center gap-1.5 p-1.5 pr-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white transition-all border border-white/10 cursor-pointer"
                    title="Profile & Playback Settings"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center font-black text-[10px]">
                      {activeCourse.staff.charAt(0)}
                    </div>
                    <Settings className="w-3.5 h-3.5 text-zinc-300" />
                  </button>

                  {/* Heart Appreciation / Like Button with Counter */}
                  <button
                    onClick={handleHeartClick}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-red-400'
                    } ${animateHeart ? 'scale-110' : ''}`}
                    title="Appreciation / Like Class"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-[11px] font-bold font-mono">{likeCount}</span>
                  </button>

                  {/* CC (Closed Captions) */}
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                      showCaptions 
                        ? 'bg-amber-400 text-slate-950 border-amber-400' 
                        : 'bg-white/5 text-zinc-400 border-white/20 hover:text-white'
                    }`}
                    title="Toggle Closed Captions"
                  >
                    CC
                  </button>

                  {/* Full Screen */}
                  <button
                    onClick={toggleFullScreen}
                    className="p-2 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Full Screen Mode"
                  >
                    {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>

                </div>

              </div>

            </div>

          </div>
          )}

        </main>


        {/* =========================================================================
            RIGHT COLUMN: TUTOR / CHAT / CHAPTER SUB-TITLES (lg:col-span-3 xl:col-span-3)
            Strict Layout Rule: left/right chat sidebar must remain hidden in Slide+AI and Video+AI views
        ========================================================================= */}
        {!isChatSidebarHidden && (
        <aside className="lg:col-span-3 xl:col-span-3 flex flex-col gap-3.5">
          
          {/* 1. Live Tutor Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className={`p-3 text-white flex items-center justify-between transition-colors ${
              isAICourse 
                ? 'bg-gradient-to-r from-indigo-900 to-indigo-800' 
                : 'bg-gradient-to-r from-slate-900 to-brand-950'
            }`}>
              <div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-400 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {isAICourse ? 'AI Adaptive Engine' : 'Live Faculty Lead'}
                </div>
                <div className="text-xs font-black mt-0.5 truncate">
                  {isAICourse ? 'Intelli-Coach AI Bot' : activeCourse.staff}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!isAICourse ? (
                  <>
                    <button
                      onClick={() => setIsTutorPaused(!isTutorPaused)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        isTutorPaused ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      title="Touch to Pause Live Tutor Video"
                    >
                      {isTutorPaused ? 'Resume' : 'Touch to Pause'}
                    </button>

                    <button
                      onClick={() => setHasRaisedHand(!hasRaisedHand)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        hasRaisedHand ? 'bg-yellow-400 text-slate-950' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      title="Raise Hand to Ask Question"
                    >
                      <Hand className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="text-[9px] font-bold bg-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                    24/7 AI Tutor
                  </span>
                )}
              </div>
            </div>

            {/* Doubt Queue Status */}
            {!isAICourse && (
              <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" /> Doubt Queue: {doubtQueueCount} Pending
                </span>
                <button 
                  onClick={() => setDoubtQueueCount(0)}
                  className="text-[9px] font-black text-amber-700 hover:text-amber-950 cursor-pointer"
                >
                  Clear Queue
                </button>
              </div>
            )}
          </div>

          {/* 2. Interactive Live Chat & Doubt Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 flex flex-col h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-brand-600" /> Live Chat & Doubts
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'student';
                return (
                  <div 
                    key={msg.id}
                    className={`p-2 rounded-xl max-w-[92%] flex flex-col gap-0.5 ${
                      isUser 
                        ? 'bg-brand-900 text-white ml-auto rounded-br-none' 
                        : msg.sender === 'ai'
                        ? 'bg-indigo-50 border border-indigo-100 text-indigo-950 mr-auto rounded-bl-none'
                        : 'bg-slate-100 border border-slate-200 text-slate-900 mr-auto rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[9px] opacity-80">
                      <span className="font-bold">
                        {isUser ? 'You' : msg.badge || 'Tutor'}
                      </span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line text-[11px]">
                      {msg.text}
                    </p>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Integrated Chat Input with Voice Button */}
            <form onSubmit={handleSendChat} className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <button 
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                  isVoiceListening 
                    ? 'bg-red-500 text-white animate-bounce shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={isVoiceListening ? 'Listening...' : 'Voice-to-Text / Voice Doubt'}
              >
                {isVoiceListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-600" />}
              </button>

              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask doubt or type message..."
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-brand-500"
              />

              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="p-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg cursor-pointer transition-all shrink-0"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* 3. Chapter Sub-titles (CLICKABLE TO LOAD DYNAMIC TOPICS INTO CANVAS) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Chapter Sub-titles
              </span>
              <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                Click to load topic
              </span>
            </div>

            <div className="space-y-1">
              {subtitles.map((sub) => {
                const isSubActive = selectedSubtitleId === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubtitleId(sub.id);
                      setCurrentTime(sub.seconds);
                    }}
                    className={`p-2 rounded-lg border flex items-center justify-between gap-1.5 text-xs transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-brand-50 border-brand-500 font-bold shadow-2xs ring-1 ring-brand-500/20'
                        : sub.status === 'Complete'
                        ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[9px] text-slate-400">{sub.timestamp}</span>
                      <span className={`truncate text-[11px] ${isSubActive ? 'text-brand-950 font-black' : 'text-slate-800'}`}>
                        {sub.title}
                      </span>
                    </div>

                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isSubActive ? 'bg-brand-600 text-white' :
                      sub.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' :
                      sub.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isSubActive ? 'Viewing' : sub.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </aside>
        )}

      </div>


      {/* =========================================================================
          BOTTOM SECTION: DUAL LIBRARY DIRECTORY & AI CLASS EXECUTION CATALOG
      ========================================================================= */}
      <section className="w-full bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-5">
        
        {/* Streamlined Toolbar: Dual Library Sub-Navigation Tabs + Category Dropdown on Left, View Switcher on Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          {/* Left Controls: Dual Library Sub-Navigation Tabs & Category Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* 1. Category Dropdown Filter */}
            <div className="relative flex items-center">
              <div className="absolute left-2.5 text-slate-400 pointer-events-none">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-8 pr-8 py-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer transition-colors appearance-none shadow-2xs"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 text-slate-400 pointer-events-none">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Top Sub-Navigation Tabs for Dual Library Navigation */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold flex-wrap">
              
              {/* All Classes */}
              <button
                onClick={() => setLibrarySectionTab('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  librarySectionTab === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All Classes</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  librarySectionTab === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                }`}>{courses.length}</span>
              </button>

              {/* Intelli Coach Classes */}
              <button
                onClick={() => setLibrarySectionTab('INTELLI_COACH')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  librarySectionTab === 'INTELLI_COACH'
                    ? 'bg-indigo-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Intelli Coach Classes</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  librarySectionTab === 'INTELLI_COACH' ? 'bg-white text-indigo-900' : 'bg-slate-200 text-slate-700'
                }`}>{intelliCoachCount}</span>
              </button>

              {/* Video + AI Answering Classes */}
              <button
                onClick={() => setLibrarySectionTab('VIDEO_AI')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  librarySectionTab === 'VIDEO_AI'
                    ? 'bg-purple-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video + AI Answering</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  librarySectionTab === 'VIDEO_AI' ? 'bg-white text-purple-900' : 'bg-slate-200 text-slate-700'
                }`}>{videoAICount}</span>
              </button>

              {/* Faculty Tutorials */}
              <button
                onClick={() => setLibrarySectionTab('TUTOR')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  librarySectionTab === 'TUTOR'
                    ? 'bg-brand-900 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Faculty Tutorials</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  librarySectionTab === 'TUTOR' ? 'bg-white text-brand-900' : 'bg-slate-200 text-slate-700'
                }`}>{tutorCount}</span>
              </button>
            </div>
            
            <span className="text-xs text-slate-400 hidden xl:inline">
              Showing {filteredCourses.length} classes
            </span>
          </div>

          {/* Right: View Toggle (Grid vs List) + Creator Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* View Mode Switcher (Grid vs List) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setCourseViewMode('GRID')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  courseViewMode === 'GRID' 
                    ? 'bg-white text-brand-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View (Block Cards)"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setCourseViewMode('LIST')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  courseViewMode === 'LIST' 
                    ? 'bg-white text-brand-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View (Table Rows)"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={() => setShowCreateCoursePathModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-black rounded-2xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ring-1 ring-white/20"
              title="Create Course & Path: Bridge directly to Course Creator Engine Hub"
            >
              <PlusCircle className="w-3.5 h-3.5" /> <span>Create Course & Path</span>
            </button>

            <button
              onClick={() => onNavigateTab?.('AI COURSE CREATOR')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">AI Coach Creator</span>
            </button>
          </div>
        </div>

        {/* 1. GRID VIEW MODE */}
        {courseViewMode === 'GRID' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in">
            {filteredCourses.map((course) => {
              const isCurrentlyActive = course.id === activeCourseId;
              const isCourseAI = course.libraryType === 'AI' || course.name.includes('IELTS') || course.name.includes('Social');
              const isVideoAI = course.aiLibrarySection === 'Video + AI Answering Classes' || (course.libraryType === 'AI' && course.name.includes('Video'));

              return (
                <div
                  key={course.id}
                  onClick={() => selectCourse(course.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group shadow-xs ${
                    isCurrentlyActive
                      ? 'border-2 border-brand-600 bg-brand-50/40 shadow-md ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 hover:border-brand-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Badges & Approval Status */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border truncate max-w-[140px] ${
                        isVideoAI
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : isCourseAI 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : 'bg-brand-50 text-brand-700 border-brand-100'
                      }`}>
                        {course.aiLibrarySection || (isCourseAI ? 'Intelli Coach' : 'Faculty Tutorial')}
                      </span>

                      {/* Approval Status Badge */}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                        course.testApprovalStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : course.testApprovalStatus === 'Requires Refinement'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {course.testApprovalStatus || 'Pending'}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isCurrentlyActive 
                          ? 'bg-brand-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-brand-700 group-hover:bg-brand-100'
                      }`}>
                        {course.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-black line-clamp-1 transition-colors ${
                          isCurrentlyActive ? 'text-brand-900' : 'text-slate-900 group-hover:text-brand-600'
                        }`}>
                          {course.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {course.subtitle || 'Comprehensive certification pathway.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Course Metadata Specs & AI START CLASS BUTTON */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2 text-[10px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Chapters:</span>
                      <span className="font-bold text-slate-900">{course.chapter} Modules</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Duration:</span>
                      <span className="font-bold text-slate-900">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Fee:</span>
                      <span className="font-black text-brand-700">{course.fee}</span>
                    </div>

                    {/* Prominent AI Start Class Execution Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCourse(course.id);
                          setIsPlaying(true);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                          isCurrentlyActive && isPlaying
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isCurrentlyActive && isPlaying ? '● Active Test Class' : 'AI START CLASS'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 2. LIST VIEW MODE */}
        {courseViewMode === 'LIST' && (
          <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            {filteredCourses.map((course) => {
              const isCurrentlyActive = course.id === activeCourseId;
              const isCourseAI = course.libraryType === 'AI' || course.name.includes('IELTS') || course.name.includes('Social');
              const isVideoAI = course.aiLibrarySection === 'Video + AI Answering Classes' || (course.libraryType === 'AI' && course.name.includes('Video'));

              return (
                <div
                  key={course.id}
                  onClick={() => selectCourse(course.id)}
                  className={`p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer ${
                    isCurrentlyActive
                      ? 'bg-brand-50/80 border-l-4 border-brand-600 font-medium'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isCurrentlyActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-brand-700'
                    }`}>
                      {course.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-black truncate ${
                          isCurrentlyActive ? 'text-brand-900' : 'text-slate-900'
                        }`}>
                          {course.name}
                        </h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isVideoAI
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : isCourseAI 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                            : 'bg-brand-50 text-brand-700 border-brand-100'
                        }`}>
                          {course.aiLibrarySection || (isCourseAI ? 'Intelli Coach' : 'Faculty Tutorial')}
                        </span>
                        
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                          course.testApprovalStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : course.testApprovalStatus === 'Requires Refinement'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {course.testApprovalStatus || 'Pending'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{course.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0">
                    <div className="text-[11px] text-slate-500 font-mono hidden md:block">
                      {course.chapter} Chapters • {course.duration}
                    </div>
                    <div className="text-xs font-black text-brand-700">
                      {course.fee}
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectCourse(course.id);
                        setIsPlaying(true);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                        isCurrentlyActive && isPlaying
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isCurrentlyActive && isPlaying ? 'In Test' : 'AI Start Class'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* =========================================================================
          MODALS: GOOGLE LENS, COMMAND PALETTE & SETTINGS
      ========================================================================= */}

      {/* 1. Google Lens AI Visual Scan Modal */}
      {showGoogleLensModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Google Lens AI Visual Scan</h3>
                  <span className="text-[10px] text-slate-400">Scan textbook notes, slides & blackboard formulas</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowGoogleLensModal(false);
                  setLensScanState('IDLE');
                }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {lensScanState === 'IDLE' ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50">
                  <Camera className="w-10 h-10 text-indigo-500 mx-auto mb-2 animate-bounce" />
                  <div className="font-bold text-xs text-slate-800">Click to Snap Photo or Upload Note Page</div>
                  <p className="text-[10px] text-slate-500 mt-1">Supports German/English text, handwritten notes, and code flowcharts.</p>
                </div>

                <button 
                  onClick={() => {
                    setLensScanState('SCANNING');
                    setTimeout(() => setLensScanState('SCANNED'), 1500);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  ⚡ Simulate Snapshot & OCR Scan
                </button>
              </div>
            ) : lensScanState === 'SCANNING' ? (
              <div className="p-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <div className="font-black text-sm text-slate-900">Scanning Document with Google Lens AI...</div>
                <p className="text-xs text-slate-500">Detecting German syntax, clinical vocabulary, and structural layout.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2">
                  <div className="font-black text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> OCR Text & AI Explanation Extracted:
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 bg-white p-3 rounded-xl border border-emerald-100">
                    "Die Patientin klagt über akute Kopfschmerzen seit gestern Abend."
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>Translation:</strong> "The female patient complains of acute headaches since yesterday evening."<br />
                    <strong>Grammar Note:</strong> 'über' takes Accusative here ('akute Kopfschmerzen').
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      handleSendChat(undefined, `📷 [Google Lens Scan]: Die Patientin klagt über akute Kopfschmerzen.`);
                      setShowGoogleLensModal(false);
                      setLensScanState('IDLE');
                    }}
                    className="flex-1 py-2.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Send to Classroom Chat
                  </button>
                  <button 
                    onClick={() => setLensScanState('IDLE')}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. AI Command Palette Modal */}
      {showCommandModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Command className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">AI Command Palette</h3>
                  <span className="text-[10px] text-slate-400">Execute instant classroom AI actions</span>
                </div>
              </div>
              <button onClick={() => setShowCommandModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { cmd: '/explain', title: 'Deep Rule Explanation', desc: 'Breakdown active chapter with examples and edge cases.' },
                { cmd: '/quiz-me', title: 'Generate 3 Quick Mock Questions', desc: 'Interactive self-assessment for this module.' },
                { cmd: '/translate-de', title: 'Bilingual Vocabulary Breakdown', desc: 'German-to-English vocabulary flash table.' },
                { cmd: '/summarize', title: '5-Bullet Summary', desc: 'Instant key takeaway summary for note-taking.' }
              ].map((c) => (
                <div
                  key={c.cmd}
                  onClick={() => {
                    handleSendChat(undefined, `${c.cmd} for ${selectedSubtitle.topic}`);
                    setShowCommandModal(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-black text-purple-900 flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono">{c.cmd}</span>
                      <span>{c.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Profile & Playback Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Classroom & Profile Settings</h3>
                  <span className="text-[10px] text-slate-400">Configure playback speed, subtitles & audio dialect</span>
                </div>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Speed */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Playback Speed</label>
                <div className="grid grid-cols-5 gap-2">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                        playbackSpeed === s 
                          ? 'bg-brand-900 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle Language */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Subtitle / Closed Caption Language</label>
                <select 
                  value={captionLang}
                  onChange={(e) => setCaptionLang(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none"
                >
                  <option value="English">English (Default)</option>
                  <option value="German">German (Deutsch B2)</option>
                  <option value="French">French (Français)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                </select>
              </div>

              {/* Tutor Accent */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">AI Tutor Voice & Accent</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none">
                  <option>Berlin Standard Hochdeutsch (Native DE)</option>
                  <option>British Oxford RP (Cambridge IELTS)</option>
                  <option>US Silicon Valley Tech Accent</option>
                </select>
              </div>

              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-white font-black rounded-xl cursor-pointer"
              >
                Save & Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course & Path Modal Bridge */}
      <CreateCourseAndPathModal 
        isOpen={showCreateCoursePathModal}
        onClose={() => setShowCreateCoursePathModal(false)}
        onLaunchEngineHub={(params) => {
          setShowCreateCoursePathModal(false);
          onNavigateTab?.('ENGINE HUB');
        }}
        onSavedToLibrary={() => {
          setShowCreateCoursePathModal(false);
          const dbCourses = getGlobalCourses();
          setCourses(dbCourses);
        }}
      />

    </div>
  );
};

export default LibraryAndClassRoom;
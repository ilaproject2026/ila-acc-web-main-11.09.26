import React, { useState, useEffect } from 'react';
import { 
  Save, Edit, RefreshCw, Trash2, Send, CheckSquare, Search, 
  Book, Video, Image as ImageIcon, Headphones, Music, BookOpen, 
  Sparkles, CheckCircle2, Play, ArrowRight, Shield, Zap, 
  Sliders, Layers, Award, Activity, Brain, Target, Compass,
  SlidersHorizontal, Check, AlertCircle, PlusCircle, FileText,
  Volume2, Cpu, BarChart2, Eye, UserCheck, Clock, Video as VideoIcon,
  CheckCircle, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  getGlobalCourses, setGlobalCourses, getGlobalCategories, 
  GlobalCourse, GlobalCategory, AICoursePayload,
  TeachingStrategy, StudentAnalyzingStrategy,
  DEFAULT_TEACHING_STRATEGIES, DEFAULT_STUDENT_ANALYZING_STRATEGIES,
  getGlobalTeachingStrategies, setGlobalTeachingStrategies,
  getGlobalStudentAnalyzingStrategies, setGlobalStudentAnalyzingStrategies
} from '../../lib/db';

interface AICourseCreatorProps {
  onNavigateTab?: (tabName: string) => void;
}

const AICourseCreator: React.FC<AICourseCreatorProps> = ({ onNavigateTab }) => {
  // 1. Basic Course Configuration
  const [courseName, setCourseName] = useState('Kids German Basics (AI Generated)');
  const [category, setCategory] = useState('German Language');
  const [subCategory, setSubCategory] = useState('German Language (A1–C2)');
  const [numChapters, setNumChapters] = useState(15);
  const [duration, setDuration] = useState('45 Mins/Day');
  const [displayPosition, setDisplayPosition] = useState<number>(1);
  const [targetLibraryCategory, setTargetLibraryCategory] = useState<'Intelli Coach Classes' | 'Video + AI Answering Classes'>('Intelli Coach Classes');

  // 2. Primary Large Text Box for Comprehensive Instructions
  const [primaryInstructionPrompt, setPrimaryInstructionPrompt] = useState(
    `Generate an autonomous, multimodal, and adaptive AI coaching curriculum for "${courseName}". Focus on immersive situational dialogues, interactive whiteboard syntax deconstruction, and real-time pronunciation acoustic tuning. The AI tutor must continuously evaluate learner comprehension and adapt pacing dynamically.`
  );

  // 3. Modular Block Boxes for Condition Inputs
  const [grammarComplexity, setGrammarComplexity] = useState('A1–A2 Foundational Syntax');
  const [vocabRange, setVocabRange] = useState('Top 500 Daily Conversational & Practical Phrases');
  const [clipDurationBounds, setClipDurationBounds] = useState('3–5 Mins Micro-Units');
  const [exerciseFrequency, setExerciseFrequency] = useState('Every 3 Mins + End of Module');
  const [accentPreference, setAccentPreference] = useState('Standard German (Hochdeutsch)');
  const [passScoreThreshold, setPassScoreThreshold] = useState('85% Mastery Requirement');

  // 4. Multimedia Channels Selection
  const [selectedMedia, setSelectedMedia] = useState<string[]>([
    'BOOKS', 'ONLINE MATERIALS', 'VIDEOS', 'IMAGES', 'AUDIOS', 'SONGS'
  ]);

  // 5. 10 Teaching Strategies Module State
  const [teachingStrategies, setTeachingStrategies] = useState<TeachingStrategy[]>([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(['ts-1', 'ts-2', 'ts-3']);
  const [strategySearchQuery, setStrategySearchQuery] = useState('');
  const [showAddCustomStrategy, setShowAddCustomStrategy] = useState(false);
  const [newStratName, setNewStratName] = useState('');
  const [newStratCategory, setNewStratCategory] = useState('Custom Methodology');
  const [newStratTagline, setNewStratTagline] = useState('');
  const [newStratDesc, setNewStratDesc] = useState('');
  const [newStratPacing, setNewStratPacing] = useState('Adaptive Pacing');

  // 6. 10 Student Analyzing Strategies Module State
  const [analyzingStrategies, setAnalyzingStrategies] = useState<StudentAnalyzingStrategy[]>([]);
  const [analyzingSearchQuery, setAnalyzingSearchQuery] = useState('');
  const [activeStrategyTab, setActiveStrategyTab] = useState<'TEACHING' | 'ANALYZING'>('TEACHING');

  // 7. Categories & Processing State
  const [availableCategories, setAvailableCategories] = useState<GlobalCategory[]>([]);
  const [processingState, setProcessingState] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED'>('IDLE');
  const [generatedPayload, setGeneratedPayload] = useState<AICoursePayload | null>(null);

  // Load initial data
  useEffect(() => {
    setAvailableCategories(getGlobalCategories());
    setTeachingStrategies(getGlobalTeachingStrategies());
    setAnalyzingStrategies(getGlobalStudentAnalyzingStrategies());
  }, []);

  const toggleMedia = (mediaType: string) => {
    setSelectedMedia(prev => 
      prev.includes(mediaType) 
        ? prev.filter(m => m !== mediaType) 
        : [...prev, mediaType]
    );
  };

  const toggleTeachingStrategy = (id: string) => {
    setSelectedStrategyIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const toggleAnalyzingStrategy = (id: string) => {
    setAnalyzingStrategies(prev => 
      prev.map(item => item.id === id ? { ...item, active: !item.active } : item)
    );
  };

  const handleUpdateAnalyzingRule = (id: string, field: 'threshold' | 'customRule' | 'adaptationAction', value: string) => {
    setAnalyzingStrategies(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const handleAddCustomTeachingStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStratName.trim()) return;

    const newStrat: TeachingStrategy = {
      id: `ts-${Date.now()}`,
      name: newStratName.trim(),
      category: newStratCategory.trim() || 'Custom Methodology',
      tagline: newStratTagline.trim() || 'Custom Administrator Defined Methodology',
      description: newStratDesc.trim() || 'Custom educational pacing and pedagogical approach.',
      pacingModel: newStratPacing.trim() || 'Adaptive',
      targetLearner: 'Specialized Cohort',
      defaultActive: true
    };

    const updated = [...teachingStrategies, newStrat];
    setTeachingStrategies(updated);
    setGlobalTeachingStrategies(updated);
    setSelectedStrategyIds(prev => [...prev, newStrat.id]);
    setNewStratName('');
    setNewStratTagline('');
    setNewStratDesc('');
    setShowAddCustomStrategy(false);
  };

  // Generate AI Course Payload
  const handleGenerateAICourse = () => {
    setProcessingState('PROCESSING');
    
    setTimeout(() => {
      const activeTeaching = teachingStrategies.filter(s => selectedStrategyIds.includes(s.id));
      const activeAnalyzing = analyzingStrategies.filter(s => s.active);

      const payload: AICoursePayload = {
        curriculumOverview: `Automated AI multimodal curriculum for "${courseName}" incorporating ${numChapters} chapters, ${activeTeaching.length} Teaching Strategies (${activeTeaching.map(t => t.name).join(', ')}), and ${activeAnalyzing.length} Real-Time Student Analyzing Strategies.`,
        sourceLibraries: [
          'Goethe CEFR Standard Digital Repository', 
          'Open German Educational Corpus', 
          'Studio d Multimedia Archive', 
          'Intelli-Coach Neural Speech Synthesis'
        ],
        strategiesApplied: activeTeaching.map(t => `${t.name}: ${t.tagline}`),
        studentAnalyzingRules: activeAnalyzing,
        multimediaConditions: {
          primaryInstructionPrompt,
          grammarComplexity,
          vocabRange,
          clipDurationBounds,
          exerciseFrequency,
          accentPreference,
          passScoreThreshold
        },
        aiLibraryCategory: targetLibraryCategory,
        aiTutorPersona: targetLibraryCategory === 'Intelli Coach Classes' 
          ? 'Intelli-Coach AI (Autonomous Digital Tutor)' 
          : 'Video + AI Interactive Co-Tutor',
        testApprovalStatus: 'Pending Review',
        generatedWhiteboardNotes: `• Core Target: ${courseName} (CEFR Aligned)\n• Active Strategy: ${activeTeaching.length > 0 ? activeTeaching[0].name : 'Adaptive Pacing'}\n• Grammar Focus: ${grammarComplexity}\n• Vocabulary Boundary: ${vocabRange}\n• Rule: Verb occupies Position 2 in German declarative main clauses (V2 Word Order).\n• Interactive drill: Practice greeting forms (Guten Morgen vs. Schönen Tag).`,
        sampleExercise: {
          question: 'Which greeting is formally used in German professional meetings before 11:00 AM?',
          options: ['Guten Abend', 'Guten Morgen', 'Gute Nacht', 'Tschüss'],
          correctAnswer: 'Guten Morgen',
          explanation: '"Guten Morgen" is the formal greeting for morning hours until midday in professional German.'
        },
        customChapters: [
          {
            id: 'intro',
            title: '1. Intro: Welcome & AI Calibration',
            type: 'intro',
            duration: '05:00',
            status: 'Completed',
            subtitles: [
              {
                id: 's1',
                title: '1.1 Autonomous AI Instructor Welcome',
                timestamp: '00:00',
                seconds: 0,
                status: 'Complete',
                topic: `${courseName} - Interactive Orientation`,
                notes: `Welcome to the AI classroom. The system adapts content in real-time based on your comprehension velocity (${passScoreThreshold}).`,
                keyRules: `• Active voice responses enhance pronunciation acoustic score.`,
                practicePrompt: `Repeat the greeting aloud after the AI tutor.`
              },
              {
                id: 's2',
                title: '1.2 Learning Objectives & Flashcard Drills',
                timestamp: '03:15',
                seconds: 195,
                status: 'Ready',
                topic: `Core Terminology & Strategy Breakdown`,
                notes: `Reviewing vocabulary decks, song mnemonics, and adaptive grammar rules.`,
                keyRules: `• Master core nouns with definite articles (der/die/das).`,
                practicePrompt: `Complete the matching exercise on the interactive whiteboard.`
              }
            ]
          },
          {
            id: 'c1',
            title: '2. Alphabet, Phonetics & Survival Greetings',
            type: 'video',
            duration: '12:00',
            status: 'Ready',
            subtitles: [
              {
                id: 's3',
                title: '2.1 Vowel Sounds & Umlauts (ä, ö, ü)',
                timestamp: '00:00',
                seconds: 0,
                status: 'Ready',
                topic: `Phonetics & Audio Waveform Calibration`,
                notes: `Precision audio waveforms demonstrating mouth shape for German Umlauts.`,
                keyRules: `• Umlauts shift pronunciation significantly.`,
                practicePrompt: `Record your audio pronunciation for AI score evaluation.`
              }
            ]
          },
          {
            id: 'c2',
            title: '3. Numbers, Time & Daily Routine Songs',
            type: 'song',
            duration: '08:30',
            status: 'Ready'
          },
          {
            id: 'c3',
            title: '4. Essential Food, Animals & Picture Cards',
            type: 'picture',
            duration: '15:00',
            status: 'Ready'
          }
        ]
      };

      setGeneratedPayload(payload);
      setProcessingState('COMPLETED');
    }, 1200);
  };

  // Save to Library and immediately Launch Test Classroom
  const handleSaveToLibrary = (shouldLaunchTest: boolean = false) => {
    const existingCourses = getGlobalCourses();
    const activeTeaching = teachingStrategies.filter(s => selectedStrategyIds.includes(s.id));
    const activeAnalyzing = analyzingStrategies.filter(s => s.active);
    
    const newAICourse: GlobalCourse = {
      id: `ai-${Date.now()}`,
      name: courseName.trim(),
      top_title: targetLibraryCategory === 'Intelli Coach Classes' ? 'Intelli Coach AI Class' : 'Video + AI Answering Class',
      subtitle: `AI Curriculum: ${numChapters} Modules • ${activeTeaching.length} Teaching Strategies • ${activeAnalyzing.length} Student Analyzers`,
      show_in_sub_nav: true,
      displayPosition: displayPosition || 1,
      viewType: 'Both',
      aiLibrarySection: targetLibraryCategory,
      teachingStrategies: activeTeaching.map(t => t.name),
      studentAnalyzingStrategies: activeAnalyzing,
      multimediaConditions: {
        primaryInstructionPrompt,
        grammarComplexity,
        vocabRange,
        clipDurationBounds,
        exerciseFrequency,
        accentPreference,
        passScoreThreshold
      },
      testApprovalStatus: 'Pending Review',
      staff: targetLibraryCategory === 'Intelli Coach Classes' 
        ? 'Intelli-Coach AI (Autonomous Digital Tutor)' 
        : 'Video + AI Interactive Co-Tutor',
      chapter: numChapters.toString(),
      duration: duration,
      methods: targetLibraryCategory === 'Intelli Coach Classes' 
        ? 'Intelli-Coach AI Adaptive Path [Real-time AI Pacing]' 
        : 'Video + AI Answering Stream [Interactive Q&A Engine]',
      materials: `AI Curated Media (${selectedMedia.join(', ')})`,
      fee: '$0 (Test & Simulation)',
      students: '1 (Active Live Simulator)',
      category: category,
      subCategory: subCategory,
      libraryType: 'AI',
      courseStructure: `Chapter 1: AI Orientation & Vocabulary Builder\nChapter 2: Interactive Video Lecture & Pronunciation Lab\nChapter 3: Whiteboard Exercises & Rapid Quizzes\nChapter 4: Real-time Student Analytics & Remedial Drills`,
      aiPayload: generatedPayload || undefined,
      enrolledStudentsList: [
        { id: 's-admin', name: 'Super Admin (Live Tester)', email: 'admin@ilas.global', status: 'In Class', joinedAt: 'Just Now', attendanceScore: 100 }
      ]
    };

    // Save into central courses DB
    const updatedCourses = [newAICourse, ...existingCourses.filter(c => c.id !== newAICourse.id)];
    setGlobalCourses(updatedCourses);
    
    // Store active course ID for immediate test classroom loading
    localStorage.setItem('ilas_active_library_course_id', newAICourse.id);
    localStorage.setItem('ilas_active_library_section_tab', targetLibraryCategory);

    // Dispatch events
    window.dispatchEvent(new CustomEvent('ilas-courses-changed'));

    if (shouldLaunchTest) {
      // Navigate to Library & Classroom tab
      if (onNavigateTab) {
        onNavigateTab('LIBRARY & CLASS ROOM');
      } else {
        window.dispatchEvent(new CustomEvent('ilas-navigate-tab', { detail: { tab: 'LIBRARY & CLASS ROOM', courseId: newAICourse.id } }));
      }
    } else {
      alert(`AI Coaching Class "${newAICourse.name}" successfully saved into "${targetLibraryCategory}" library!`);
    }
  };

  const filteredTeachingStrategies = teachingStrategies.filter(s => 
    s.name.toLowerCase().includes(strategySearchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(strategySearchQuery.toLowerCase()) ||
    s.tagline.toLowerCase().includes(strategySearchQuery.toLowerCase())
  );

  const filteredAnalyzingStrategies = analyzingStrategies.filter(s => 
    s.name.toLowerCase().includes(analyzingSearchQuery.toLowerCase()) ||
    s.targetMetric.toLowerCase().includes(analyzingSearchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(analyzingSearchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 animate-in fade-in font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-brand-900 text-white p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 border border-indigo-700/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" /> Autonomous AI Coach & Strategy Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">AI Coach Creator & Strategic Algorithm Unit</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Configure 10 Teaching Strategies and 10 Real-Time Student Analyzing Strategies. Generate AI-powered curricula with multimodal search conditions and automatically save into <strong>Intelli Coach Classes</strong> or <strong>Video + AI Answering Classes</strong> with instant video recording and test classroom execution.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab ? onNavigateTab('LIBRARY & CLASS ROOM') : window.dispatchEvent(new CustomEvent('ilas-navigate-tab', { detail: { tab: 'LIBRARY & CLASS ROOM' } }))}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-amber-300" /> Open AI Library
          </button>
        </div>
      </div>

      {/* Target Library Section & Core Metadata */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" /> 1. Target Library Category & Course Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Select the target library storage category and configure core course identification.</p>
          </div>

          {/* Dual Library Saving Tabs Selector */}
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setTargetLibraryCategory('Intelli Coach Classes')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                targetLibraryCategory === 'Intelli Coach Classes'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Intelli Coach Classes
            </button>
            <button
              type="button"
              onClick={() => setTargetLibraryCategory('Video + AI Answering Classes')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                targetLibraryCategory === 'Video + AI Answering Classes'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" /> Video + AI Answering Classes
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">COURSE NAME *</label>
            <input 
              type="text" 
              className="border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50" 
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Kids German Basics" 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">PRIMARY CATEGORY</label>
            <select
              className="border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const found = availableCategories.find(c => c.name === e.target.value);
                if (found && found.subCategories.length > 0) {
                  setSubCategory(found.subCategories[0]);
                }
              }}
            >
              {availableCategories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              <option value="Education & Languages">Education & Languages</option>
              <option value="Software & IT Training">Software & IT Training</option>
              <option value="Enterprise ERP & SAP">Enterprise ERP & SAP</option>
              <option value="Healthcare & Clinical Practice">Healthcare & Clinical Practice</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">SUB-CATEGORY</label>
            <select
              className="border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="German Language (A1–C2)">German Language (A1–C2)</option>
              <option value="IELTS / TOEFL / PTE">IELTS / TOEFL / PTE</option>
              <option value="Full-Stack Web Dev (React/Node)">Full-Stack Web Dev (React/Node)</option>
              <option value="SAP FICO (Financials)">SAP FICO (Financials)</option>
              <option value="Fachsprachprüfung (FSP)">Fachsprachprüfung (FSP)</option>
              <option value="AI & Robotics Engineering">AI & Robotics Engineering</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">MAIN PAGE POSITION (1, 2, 3...)</label>
            <input 
              type="number" 
              min={1}
              max={99}
              className="border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" 
              value={displayPosition}
              onChange={(e) => setDisplayPosition(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">NO. OF CHAPTERS</label>
            <input 
              type="number" 
              min={1}
              max={50}
              className="border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" 
              value={numChapters}
              onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">CLASS DURATION</label>
            <input 
              type="text" 
              className="border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 45 Mins/Day" 
            />
          </div>

          <div className="flex flex-col gap-1 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700">AI TUTOR ARCHITECTURE</label>
            <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 text-xs font-bold text-indigo-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                {targetLibraryCategory === 'Intelli Coach Classes' ? 'Intelli-Coach AI (Autonomous Digital Tutor)' : 'Video + AI Interactive Co-Tutor'}
              </span>
              <span className="text-[10px] bg-indigo-200/80 text-indigo-950 px-2 py-0.5 rounded-full font-black uppercase">
                {targetLibraryCategory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multimedia Search Parameters & Condition Inputs */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> 2. Multimedia Search Parameters & Condition Inputs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Define holistic natural language instructions and modular parameter constraints for AI class synthesis.</p>
        </div>

        {/* Primary Large Text Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" /> Primary Comprehensive Instruction Prompt
          </label>
          <textarea
            rows={4}
            className="w-full border border-slate-300 rounded-2xl p-3.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/60 leading-relaxed shadow-inner"
            value={primaryInstructionPrompt}
            onChange={(e) => setPrimaryInstructionPrompt(e.target.value)}
            placeholder="Enter full pedagogical directives, tone of delivery, target outcome, and multi-concept synthesis guidelines..."
          />
          <p className="text-[11px] text-slate-400">The primary instruction prompt provides overarching behavioral bounds to the generative synthesis engine.</p>
        </div>

        {/* Modular Block Boxes */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-500" /> Modular Parameter Block Boxes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            
            {/* Box 1: Grammar Complexity */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase flex items-center justify-between">
                <span>Grammar &amp; Syntax Level</span>
                <span className="text-indigo-600 font-bold">Rule Bounds</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 bg-white"
                value={grammarComplexity}
                onChange={(e) => setGrammarComplexity(e.target.value)}
              >
                <option value="A1–A2 Foundational Syntax">A1–A2 Foundational Syntax (Survival & Daily)</option>
                <option value="B1 Intermediate Fluency">B1 Intermediate Fluency (Workplace & Emails)</option>
                <option value="B2 Professional & Technical">B2 Professional & Technical (Clinical/Engineering)</option>
                <option value="C1–C2 Executive Mastery">C1–C2 Executive Mastery (Boardroom/C-Suite)</option>
              </select>
            </div>

            {/* Box 2: Vocabulary Focus */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase flex items-center justify-between">
                <span>Vocabulary Focus Range</span>
                <span className="text-indigo-600 font-bold">Lexical Deck</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 bg-white"
                value={vocabRange}
                onChange={(e) => setVocabRange(e.target.value)}
              >
                <option value="Top 500 Daily Conversational & Practical Phrases">Top 500 Daily Conversational</option>
                <option value="Clinical & Healthcare Terminology (FSP Focus)">Clinical & Healthcare (FSP)</option>
                <option value="Enterprise ERP, SAP & Finance Lexicon">Enterprise ERP, SAP & Finance</option>
                <option value="Modern Software Architecture & Cloud Coding">Software Architecture & Cloud</option>
              </select>
            </div>

            {/* Box 3: Video Clip Pacing */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase flex items-center justify-between">
                <span>Video Clip Duration Bounds</span>
                <span className="text-indigo-600 font-bold">Pacing</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 bg-white"
                value={clipDurationBounds}
                onChange={(e) => setClipDurationBounds(e.target.value)}
              >
                <option value="3–5 Mins Micro-Units">3–5 Mins Micro-Units (Rapid Retention)</option>
                <option value="8–10 Mins Standard Modules">8–10 Mins Standard Modules</option>
                <option value="15+ Mins Deep-Dive Lectures">15+ Mins Deep-Dive Lectures</option>
              </select>
            </div>

            {/* Box 4: Exercise Frequency */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase flex items-center justify-between">
                <span>Interactive Drill Frequency</span>
                <span className="text-indigo-600 font-bold">Interactions</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 bg-white"
                value={exerciseFrequency}
                onChange={(e) => setExerciseFrequency(e.target.value)}
              >
                <option value="Every 3 Mins + End of Module">Every 3 Mins + End of Module</option>
                <option value="Dynamic Trigger on Comprehension Dip">Dynamic Trigger on Error Spike</option>
                <option value="Comprehensive End-of-Chapter Exam">Comprehensive End-of-Chapter Exam</option>
              </select>
            </div>

            {/* Box 5: Audio Accent */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase flex items-center justify-between">
                <span>Audio Accent &amp; Voice Synthesis</span>
                <span className="text-indigo-600 font-bold">Acoustics</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 bg-white"
                value={accentPreference}
                onChange={(e) => setAccentPreference(e.target.value)}
              >
                <option value="Standard German (Hochdeutsch)">Standard German (Hochdeutsch)</option>
                <option value="Cambridge British English">Cambridge British English</option>
                <option value="North American Neutral">North American Neutral</option>
                <option value="International Standard English">International Standard English</option>
              </select>
            </div>

            {/* Box 6: Pass Score Threshold */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5">
              <label className="text-[11px] font-black text-slate-600 uppercase flex items-center justify-between">
                <span>Mastery Pass-Score Threshold</span>
                <span className="text-indigo-600 font-bold">Scoring</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 bg-white"
                value={passScoreThreshold}
                onChange={(e) => setPassScoreThreshold(e.target.value)}
              >
                <option value="80% Standard Competency">80% Standard Competency</option>
                <option value="85% Mastery Requirement">85% Mastery Requirement (Recommended)</option>
                <option value="90% Elite Certification Mark">90% Elite Certification Mark</option>
              </select>
            </div>

          </div>
        </div>

        {/* Media Channels Checklist */}
        <div className="bg-indigo-50/60 p-4 md:p-5 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Active Multimodal Media Channels
            </h3>
            <span className="text-[10px] text-indigo-700 font-black bg-indigo-100 px-2.5 py-0.5 rounded-full">
              {selectedMedia.length} Channels Active
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'BOOKS', label: 'Books / Text Lessons', icon: Book },
              { id: 'ONLINE MATERIALS', label: 'Online Repositories', icon: BookOpen },
              { id: 'VIDEOS', label: 'Curated Video Clips', icon: Video },
              { id: 'IMAGES', label: 'Flashcards & Visuals', icon: ImageIcon },
              { id: 'AUDIOS', label: 'Synthesized Audios', icon: Headphones },
              { id: 'SONGS', label: 'Educational Songs', icon: Music },
            ].map(item => {
              const Icon = item.icon;
              const isChecked = selectedMedia.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleMedia(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    isChecked 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isChecked ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strategic Algorithm Unit: 10 Teaching Strategies & 10 Student Analyzing Strategies */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" /> 3. Strategic Algorithm Unit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage 10 Teaching Methodologies and 10 Real-time Student Analyzing Strategies for adaptive AI execution.</p>
          </div>

          {/* Strategy Tabs Toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStrategyTab('TEACHING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStrategyTab === 'TEACHING'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600" /> 10 Teaching Strategies ({selectedStrategyIds.length} Active)
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategyTab('ANALYZING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStrategyTab === 'ANALYZING'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-brand-600" /> 10 Student Analyzing Strategies ({analyzingStrategies.filter(s => s.active).length} Active)
            </button>
          </div>
        </div>

        {/* TAB 1: 10 TEACHING STRATEGIES */}
        {activeStrategyTab === 'TEACHING' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  placeholder="Filter teaching strategies (e.g. Fast, Kids, Clinical, Math)..."
                  value={strategySearchQuery}
                  onChange={(e) => setStrategySearchQuery(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddCustomStrategy(!showAddCustomStrategy)}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" /> {showAddCustomStrategy ? 'Close Custom Strategy Form' : '+ Add Custom Teaching Strategy'}
              </button>
            </div>

            {/* Add Custom Strategy Form */}
            {showAddCustomStrategy && (
              <form onSubmit={handleAddCustomTeachingStrategy} className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3 animate-in slide-in-from-top-2">
                <div className="font-black text-xs text-indigo-950 uppercase">Define Custom Teaching Methodology</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Strategy Title (e.g., Polyglot FastTrack)"
                    value={newStratName}
                    onChange={(e) => setNewStratName(e.target.value)}
                    className="border border-slate-300 rounded-xl p-2 text-xs font-bold bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Category / Domain (e.g., Executive Speed)"
                    value={newStratCategory}
                    onChange={(e) => setNewStratCategory(e.target.value)}
                    className="border border-slate-300 rounded-xl p-2 text-xs font-medium bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Pacing Model (e.g., 2x Speed, Micro-Cycles)"
                    value={newStratPacing}
                    onChange={(e) => setNewStratPacing(e.target.value)}
                    className="border border-slate-300 rounded-xl p-2 text-xs font-medium bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Short Tagline Summary"
                  value={newStratTagline}
                  onChange={(e) => setNewStratTagline(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2 text-xs font-medium bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="Full description of pedagogical rules and execution parameters..."
                  value={newStratDesc}
                  onChange={(e) => setNewStratDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2 text-xs font-medium bg-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomStrategy(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save &amp; Select Strategy
                  </button>
                </div>
              </form>
            )}

            {/* 10 Strategies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTeachingStrategies.map((strat, sIdx) => {
                const isSelected = selectedStrategyIds.includes(strat.id);
                return (
                  <div
                    key={strat.id}
                    onClick={() => toggleTeachingStrategy(strat.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {sIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">{strat.name}</h4>
                            <span className="text-[10px] text-indigo-700 font-bold uppercase">{strat.category}</span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[11px] font-bold text-slate-700 mt-2 mb-1">{strat.tagline}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{strat.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                      <span className="text-slate-500 font-bold">Pacing: <strong className="text-slate-800">{strat.pacingModel}</strong></span>
                      <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 font-bold">
                        {strat.targetLearner}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 10 STUDENT ANALYZING STRATEGIES */}
        {activeStrategyTab === 'ANALYZING' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  placeholder="Filter student analyzing strategies (e.g. Catch-up, Accuracy, Attendance)..."
                  value={analyzingSearchQuery}
                  onChange={(e) => setAnalyzingSearchQuery(e.target.value)}
                />
              </div>

              <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-Time Telemetry &amp; Adaptive Intervention Loop
              </div>
            </div>

            {/* 10 Analyzing Rules List */}
            <div className="space-y-3">
              {filteredAnalyzingStrategies.map((rule, rIdx) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    rule.active
                      ? 'bg-slate-50/90 border-slate-300 shadow-xs'
                      : 'bg-white/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAnalyzingStrategy(rule.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${
                          rule.active ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {rule.active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{rIdx + 1}. {rule.name}</span>
                          <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md border border-brand-200">
                            Metric: {rule.targetMetric}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{rule.description}</p>
                      </div>
                    </div>

                    {/* Parameters Controls */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Target Threshold</span>
                        <input
                          type="text"
                          value={rule.threshold}
                          onChange={(e) => handleUpdateAnalyzingRule(rule.id, 'threshold', e.target.value)}
                          className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 bg-white w-36"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Adaptive Intervention</span>
                        <input
                          type="text"
                          value={rule.adaptationAction}
                          onChange={(e) => handleUpdateAnalyzingRule(rule.id, 'adaptationAction', e.target.value)}
                          className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 bg-white w-64"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synthesis Trigger Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={handleGenerateAICourse}
            disabled={processingState === 'PROCESSING' || !courseName.trim()}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all flex items-center gap-2.5 cursor-pointer ${
              processingState === 'PROCESSING' 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-indigo-200'
            }`}
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${processingState === 'PROCESSING' ? 'animate-spin' : ''}`} />
            {processingState === 'PROCESSING' ? 'SYNTHESIZING AI MULTIMODAL CURRICULUM...' : 'GENERATE AI COACHING CURRICULUM'}
          </button>
        </div>
      </div>

      {/* Generated Results & Dual Library Save Section */}
      {processingState === 'COMPLETED' && generatedPayload && (
        <div className="bg-white rounded-3xl shadow-sm border-2 border-indigo-300 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  ✓ Payload Ready
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase">
                  ⚡ {targetLibraryCategory}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  Position #{displayPosition}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1.5">{courseName}</h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-relaxed">{generatedPayload.curriculumOverview}</p>
            </div>

            {/* Direct Connect to Library & Test Class */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button 
                onClick={() => handleSaveToLibrary(false)}
                className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save to {targetLibraryCategory}
              </button>

              <button 
                onClick={() => handleSaveToLibrary(true)}
                className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> AI START CLASS &amp; TEST RUN →
              </button>
            </div>
          </div>

          {/* Strategy Summary Pill Badges */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
            <div className="text-[11px] font-black text-indigo-950 uppercase tracking-wider">
              Active Pedagogical Strategy Bindings ({selectedStrategyIds.length} Teaching • {analyzingStrategies.filter(s => s.active).length} Analyzing)
            </div>
            <div className="flex flex-wrap gap-2">
              {teachingStrategies.filter(s => selectedStrategyIds.includes(s.id)).map(s => (
                <span key={s.id} className="px-2.5 py-1 rounded-xl bg-white border border-indigo-200 text-indigo-900 text-[11px] font-bold shadow-2xs">
                  🎓 {s.name} ({s.pacingModel})
                </span>
              ))}
              {analyzingStrategies.filter(s => s.active).slice(0, 4).map(s => (
                <span key={s.id} className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-900 text-[11px] font-bold shadow-2xs">
                  📊 {s.name} ({s.threshold})
                </span>
              ))}
            </div>
          </div>

          {/* Media Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs"><Book className="w-4 h-4"/> Text Lessons</div>
              <div className="text-base font-black text-slate-900">{numChapters} Modules</div>
              <span className="text-[10px] text-slate-400">{grammarComplexity}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs"><Video className="w-4 h-4"/> Video Clips</div>
              <div className="text-base font-black text-slate-900">8 Curated Clips</div>
              <span className="text-[10px] text-slate-400">{clipDurationBounds}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-pink-700 font-bold text-xs"><ImageIcon className="w-4 h-4"/> Flashcards</div>
              <div className="text-base font-black text-slate-900">45 Visual Cards</div>
              <span className="text-[10px] text-slate-400">{vocabRange}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs"><Headphones className="w-4 h-4"/> Audio Waves</div>
              <div className="text-base font-black text-slate-900">{accentPreference}</div>
              <span className="text-[10px] text-slate-400">Waveform calibration</span>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs"><Music className="w-4 h-4"/> Songs &amp; Melodies</div>
              <div className="text-base font-black text-amber-950">4 Mnemonics</div>
              <span className="text-[10px] text-amber-700">Rhythm memory</span>
            </div>
          </div>

          {/* Whiteboard Notes Preview */}
          <div className="bg-slate-900 text-white p-4 md:p-5 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Synthesized Whiteboard Canvas Notes:
              </span>
              <span className="text-[10px] text-indigo-300">Live AI Synthesis</span>
            </div>
            <pre className="whitespace-pre-wrap text-slate-300 text-xs font-sans leading-relaxed">
              {generatedPayload.generatedWhiteboardNotes}
            </pre>
          </div>

          {/* Interactive Test Question */}
          {generatedPayload.sampleExercise && (
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2 text-xs">
              <div className="font-bold text-indigo-950">Sample Interactive Whiteboard Question:</div>
              <p className="font-semibold text-slate-800">{generatedPayload.sampleExercise.question}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {generatedPayload.sampleExercise.options.map((opt, oIdx) => (
                  <div key={oIdx} className="p-2 bg-white rounded-xl border border-slate-200 font-bold text-slate-700 text-center">
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 font-medium">
              Saved into <strong>{targetLibraryCategory}</strong> • Ready to test in live classroom.
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleGenerateAICourse}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Synthesize
              </button>

              <button 
                onClick={() => handleSaveToLibrary(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> AI START CLASS →
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AICourseCreator;
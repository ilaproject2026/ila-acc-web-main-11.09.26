import React, { useState } from 'react';
import { 
  BrainCircuit, Presentation, Video, Users, Flame, 
  Play, Pause, ChevronLeft, ChevronRight, BookOpen, Volume2, 
  Mic, MicOff, Camera, CameraOff, Monitor, MessageSquare, 
  PhoneOff, Hand, Maximize2, Sparkles, CheckCircle2, 
  Calendar, Clock, MapPin, QrCode, ShieldCheck, Search,
  Sliders, Award, Send, X, ExternalLink, ArrowRight, Layers,
  Compass, Laptop, Smartphone, FileText, Check, Activity, Info
} from 'lucide-react';
import { getGlobalCourses, GlobalCourse } from '../../../lib/db';

export type StudentModality = 
  | 'INTELLI_COACH' 
  | 'SLIDE_AI' 
  | 'VIDEO_AI' 
  | 'LIVE_MEET' 
  | 'SPORTS_CAMP';

interface StudentPathStudioProps {
  initialModality?: StudentModality;
  isModal?: boolean;
  onClose?: () => void;
  selectedCourseId?: string;
}

export const StudentPathStudio: React.FC<StudentPathStudioProps> = ({
  initialModality = 'INTELLI_COACH',
  isModal = false,
  onClose,
  selectedCourseId
}) => {
  const [activeModality, setActiveModality] = useState<StudentModality>(initialModality);
  const courses = getGlobalCourses();
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0] || {
    id: '1',
    name: 'German Language A1–B2 Master Track',
    category: 'Language Proficiency',
    duration: '6 Months',
    totalChapters: 48
  };

  // ================= MODALITY 1: INTELLICOURSE / INTELLICOACH STATE =================
  const [coachTopic, setCoachTopic] = useState('CEFR A1: Nominative & Accusative Cases');
  const [coachChat, setCoachChat] = useState<{ sender: 'ai' | 'student'; text: string; time: string }[]>([
    { sender: 'ai', text: 'Guten Tag! I am your IntelliCoach AI. Today we are practicing sentence construction in German. Ask me any grammar doubt or type "test me".', time: '10:00 AM' },
    { sender: 'student', text: 'Could you explain why "den Hund" is used instead of "der Hund"?', time: '10:02 AM' },
    { sender: 'ai', text: 'Ausgezeichnet! In "Ich sehe den Hund", the dog is the direct object (Akkusativ). Masculine "der" changes to "den", while feminine "die" and neuter "das" remain unchanged.', time: '10:02 AM' }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleSendCoachChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!coachInput.trim()) return;

    const userMsg = { sender: 'student' as const, text: coachInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setCoachChat(prev => [...prev, userMsg]);
    const promptText = coachInput;
    setCoachInput('');

    setTimeout(() => {
      setCoachChat(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `IntelliCoach Feedback on "${promptText.slice(0, 30)}...": Structure verified according to CEFR standard. Retention score: 94%. Next milestone unlocked!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  // ================= MODALITY 2: SLIDE + AI (NO EXTRANEOUS CHAT SIDEBAR) STATE =================
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = [
    {
      title: 'Slide 1: Sentence Architecture (Verb in Position 2)',
      bulletPoints: [
        'Fundamental German syntax rule: The conjugated verb always sits in Position 2 in declarative sentences.',
        'Position 1 may hold the subject, time adverbial ("Heute"), or place adverbial ("Hier").',
        'Inversion rule: If an adverb starts the sentence, the subject immediately follows the verb.'
      ],
      diagram: 'Heute (Pos 1) + lerne (Pos 2) + ich (Subjekt) + Deutsch (Objekt).',
      bookChapter: 'Chapter 3: Syntax Foundation',
      bookText: `Grammar Handbook §3.1:\n\nGerman is a V2 language. Unlike English, where "Today I learn" keeps S-V order, German requires verb fronting:\n\n1. "Ich lerne heute Deutsch." (Normal order)\n2. "Heute lerne ich Deutsch." (Inverted order)\n\nNote: Subordinating conjunctions (weil, dass, obwohl) trigger verb-final clause rules, discussed in Chapter 5.`
    },
    {
      title: 'Slide 2: Dual Prepositions (Wechselpräpositionen)',
      bulletPoints: [
        '9 prepositions take either Dative (Position/Location: "Wo?") or Accusative (Movement/Direction: "Wohin?").',
        'Prepositions: an, auf, hinter, in, neben, über, unter, vor, zwischen.',
        'Movement into an area: in + das Zimmer = ins Zimmer (Accusative). Static inside: in + dem Zimmer = im Zimmer (Dative).'
      ],
      diagram: 'Wohin? -> Akkusativ (Action) | Wo? -> Dativ (Resting State)',
      bookChapter: 'Chapter 4: Prepositions & Space',
      bookText: `Handbook §4.4:\n\nRule of Thumb:\n• Action towards a target (dynamisch) = Accusative.\n• Remaining in place (statisch) = Dative.\n\nExample:\n"Ich lege das Buch auf den Tisch." (Akk)\n"Das Buch liegt auf dem Tisch." (Dat)`
    },
    {
      title: 'Slide 3: Modal Verbs in Subordinate Clauses',
      bulletPoints: [
        'Modal verbs (können, müssen, wollen, sollen, dürfen, möchten).',
        'In main clauses: Modal is in Position 2; infinitive moves to the end.',
        'In subordinate clauses with "weil": the modal verb moves to the absolute end after the infinitive.'
      ],
      diagram: '... weil ich morgen früh aufstehen [muss].',
      bookChapter: 'Chapter 5: Complex Clause Connectors',
      bookText: `Handbook §5.2:\n\nWhen multiple verbs appear at the end of a subordinate clause:\n1. Non-conjugated infinitive comes first.\n2. Conjugated modal verb comes last.\n\nExample:\n"Er sagt, dass er die Hausaufgaben heute machen will."`
    }
  ];

  // ================= MODALITY 3: VIDEO + AI (BOOK VIEW + VIDEO + INDEX) STATE =================
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState('14:25 / 45:00');
  const [activeVideoChapter, setActiveVideoChapter] = useState(1);
  const videoChapters = [
    { id: 1, title: '01. Phonetics & Vowel Elongation', time: '00:00 - 12:40', notes: 'Mastering umlauts (ä, ö, ü) and diphthongs (ei, eu, au).' },
    { id: 2, title: '02. Conversational Café Drill', time: '12:40 - 28:15', notes: 'Ordering bread, paying the bill, polite formal Sie vs du.' },
    { id: 3, title: '03. Workplace Introductions', time: '28:15 - 45:00', notes: 'Professional pitch, declaring degree and previous experience.' }
  ];

  // ================= MODALITY 4: 1-TO-1 & 1-TO-GROUP GOOGLE MEET-STYLE STATE =================
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(true);
  const [sessionType, setSessionType] = useState<'1-to-1' | '1-to-Group'>('1-to-Group');
  const [meetMessages, setMeetMessages] = useState<{ sender: string; text: string; time: string; isHost?: boolean }[]>([
    { sender: 'Dr. Klaus Mueller (Instructor)', text: 'Welcome everyone! Today we are conducting live pronunciation audits for Batch GER-2026.', time: '10:01', isHost: true },
    { sender: 'Rahul Verma (Student)', text: 'Can we also review slide 4 before the mock drill?', time: '10:02' },
    { sender: 'Amina Shaikh (Student)', text: 'Audio is loud and crystal clear from my side!', time: '10:03' }
  ]);
  const [meetInput, setMeetInput] = useState('');

  const handleSendMeetMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetInput.trim()) return;
    setMeetMessages(prev => [...prev, { sender: 'You (Admin Preview)', text: meetInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMeetInput('');
  };

  // ================= MODALITY 5: SPORTS & CAMP CLASSES (ONLINE & OFFLINE) STATE =================
  const [campMode, setCampMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');

  return (
    <div className={`w-full bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col ${isModal ? 'max-h-[92vh] max-w-7xl mx-auto' : 'min-h-[85vh]'}`}>
      
      {/* 1. TOP HEADER & MODALITY NAVIGATOR */}
      <header className="bg-slate-950/90 border-b border-slate-800/90 px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-brand-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Student Learning Sandbox
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Admin Preview
              </span>
            </div>
            <h2 className="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Student Path Master Console</span>
              <span className="text-slate-400 text-xs font-normal hidden sm:inline">— {activeCourse.name}</span>
            </h2>
          </div>
        </div>

        {/* 5 Modality Switch Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveModality('INTELLI_COACH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeModality === 'INTELLI_COACH'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-300" />
            <span>IntelliCoach</span>
          </button>

          <button
            onClick={() => setActiveModality('SLIDE_AI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeModality === 'SLIDE_AI'
                ? 'bg-purple-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Side book view + slide screen (no extraneous chat sidebar)"
          >
            <Presentation className="w-3.5 h-3.5 text-purple-300" />
            <span>Slide + AI</span>
          </button>

          <button
            onClick={() => setActiveModality('VIDEO_AI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeModality === 'VIDEO_AI'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-300" />
            <span>Video + AI</span>
          </button>

          <button
            onClick={() => setActiveModality('LIVE_MEET')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeModality === 'LIVE_MEET'
                ? 'bg-blue-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-300" />
            <span>1-to-1 / Group</span>
          </button>

          <button
            onClick={() => setActiveModality('SPORTS_CAMP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeModality === 'SPORTS_CAMP'
                ? 'bg-amber-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Sports &amp; Camp</span>
          </button>
        </div>

        {/* Modal Close Button if opened in modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Close Student Path Preview"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>


      {/* 2. DYNAMIC WORKSPACE FOR SELECTED MODALITY */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950/60">

        {/* =========================================================================
            MODALITY 1: INTELLICOURSE / INTELLICOACH
        ========================================================================= */}
        {activeModality === 'INTELLI_COACH' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-300">
            
            {/* Left Column: Adaptive Syllabus & CEFR Mastery Milestones */}
            <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">CEFR AI Path Engine</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                  Adaptive 94%
                </span>
              </div>

              {/* CEFR Level Ladder */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400">Target Milestones:</div>
                <div className="grid grid-cols-6 gap-1.5 text-center">
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl, idx) => (
                    <div 
                      key={lvl}
                      className={`p-2 rounded-xl text-xs font-black border transition-all ${
                        idx <= 1 
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' 
                          : idx === 2 
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse' 
                          : 'bg-slate-800/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      {lvl}
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Selectors */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400">Active Curriculum Drill:</div>
                {[
                  'CEFR A1: Nominative & Accusative Cases',
                  'CEFR A2: Dative Prepositions & Locational Markers',
                  'CEFR B1: Subordinate Clauses with Weil, Dass, Obwohl',
                  'CEFR B2: Professional Workplace Dialogue & Email Writing'
                ].map((top) => (
                  <button
                    key={top}
                    onClick={() => setCoachTopic(top)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      coachTopic === top
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{top}</span>
                    {coachTopic === top && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Speech & Pronunciation Analyzer Simulator */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-200 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-brand-400" /> AI Speech Verification
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Accent Accuracy: 96%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 w-[96%]"></div>
                </div>
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isVoiceActive
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-400" />}
                  <span>{isVoiceActive ? 'Listening... Speak German now' : 'Test Speech Pronunciation'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive IntelliCoach Dialogue Workspace */}
            <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col h-[560px]">
              
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>IntelliCoach AI Tutor Session</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{coachTopic}</p>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl font-mono">
                  Engine: ILAS Neural-CEFR v3
                </span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {coachChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-indigo-600 text-white ml-auto rounded-br-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 mr-auto rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[9px] opacity-75 mb-1">
                      <span className="font-bold">{msg.sender === 'student' ? 'Student (You)' : 'IntelliCoach AI'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendCoachChat} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/40">
                <input
                  type="text"
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  placeholder="Ask a grammar question, test a sentence, or request a drill..."
                  className="flex-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!coachInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>
        )}


        {/* =========================================================================
            MODALITY 2: SLIDE + AI (SIDE BOOK VIEW + SLIDE SCREEN, NO EXTRA CHAT SIDEBAR)
        ========================================================================= */}
        {activeModality === 'SLIDE_AI' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-300">
            
            {/* Left Column: Side Book View (Grammar Handbook & Textbook Chapter) */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between h-[580px]">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-black uppercase text-purple-300 tracking-wider">Side Book Reference View</span>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                    CEFR Verified Text
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{slides[currentSlideIndex].bookChapter}</h4>
                  <span className="text-[10px] text-slate-400">Official Curriculum Manual · Section {currentSlideIndex + 1}</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {slides[currentSlideIndex].bookText}
                </div>
              </div>

              {/* Book Chapter Selector Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Synchronized with Slide #{currentSlideIndex + 1}</span>
                <span className="font-mono text-purple-400 text-[11px]">Clean View · Zero Distraction</span>
              </div>
            </div>

            {/* Right Column: Slide Presentation Screen (Clean presentation viewer without extraneous chat sidebar) */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between h-[580px] shadow-2xl relative overflow-hidden">
              
              {/* Top Slide Metadata Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 z-10">
                <div className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-300">Slide Deck: Module 0{currentSlideIndex + 1}</span>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-800 px-2.5 py-1 rounded-xl text-slate-300">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>

              {/* Slide Screen Content Area */}
              <div className="my-auto py-6 px-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl border border-purple-900/30 p-6 space-y-5 shadow-inner">
                <h3 className="text-lg md:text-xl font-black text-purple-200">
                  {slides[currentSlideIndex].title}
                </h3>

                <ul className="space-y-3 text-xs md:text-sm text-slate-300">
                  {slides[currentSlideIndex].bulletPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Visual Architecture Pill */}
                <div className="p-3.5 bg-purple-950/50 border border-purple-500/40 rounded-xl text-xs font-mono text-purple-300 font-bold">
                  💡 Formula: {slides[currentSlideIndex].diagram}
                </div>
              </div>

              {/* Bottom Slide Navigation Bar */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 z-10">
                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Slide</span>
                </button>

                <div className="flex items-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === idx ? 'bg-purple-500 w-6' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}


        {/* =========================================================================
            MODALITY 3: VIDEO + AI (SIDE BOOK VIEW + VIDEO PLAYER + INDEX)
        ========================================================================= */}
        {activeModality === 'VIDEO_AI' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-300">
            
            {/* Left Column (3 cols): Side Book Reference View */}
            <div className="lg:col-span-3 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col gap-3 h-[580px] overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">Side Book Reader</span>
              </div>
              <div className="text-xs font-bold text-white">Course Syllabus &amp; Study Notes</div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-2">
                <p className="font-bold text-emerald-400">Section 2: Practical Conversational Drills</p>
                <p>Learn natural German phrases used in everyday shopping and restaurant conversations. Pay close attention to modal polite requests:</p>
                <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-200 font-mono text-[10px]">
                  "Ich möchte bitte eine Tasse Kaffee."<br />
                  "Darf ich die Speisekarte haben?"
                </div>
                <p>Notice how "möchte" and "darf" require the infinitive "haben" at the end of the question.</p>
              </div>
            </div>

            {/* Center Column (6 cols): Full Featured Video Player */}
            <div className="lg:col-span-6 bg-black rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl h-[580px]">
              
              {/* Top Video Header */}
              <div className="p-3.5 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between text-xs z-10">
                <span className="font-bold text-slate-200 truncate">{activeCourse.name} - Chapter {activeVideoChapter}</span>
                <span className="text-[10px] bg-red-600/90 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  HD Stream
                </span>
              </div>

              {/* Video Simulated Stage */}
              <div className="relative flex-1 flex items-center justify-center bg-zinc-950 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
                
                <div className="text-center space-y-3 z-10">
                  <div 
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-xl shadow-emerald-500/30 transition-transform group-hover:scale-105"
                  >
                    {videoPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    {videoPlaying ? 'Video is currently playing...' : 'Click to start video playback'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{videoTime}</div>
                </div>
              </div>

              {/* Video Controls Bar */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[35%]"></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setVideoPlaying(!videoPlaying)} className="text-white hover:text-emerald-400 cursor-pointer">
                      {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <Volume2 className="w-4 h-4 hover:text-white cursor-pointer" />
                    <span className="font-mono text-[10px] text-slate-400">14:25 / 45:00</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">1.0x</span>
                    <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded">1080p</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (3 cols): Chapter Index & Interactive AI Answering */}
            <div className="lg:col-span-3 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between h-[580px]">
              <div className="space-y-3 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Video Chapter Index</span>
                  <span className="text-[10px] text-emerald-400 font-mono">3 Chapters</span>
                </div>

                <div className="space-y-2">
                  {videoChapters.map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => setActiveVideoChapter(ch.id)}
                      className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        activeVideoChapter === ch.id
                          ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate">{ch.title}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{ch.time}</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{ch.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Answering Retrieval Box */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Video Question Matcher
                </div>
                <input
                  type="text"
                  placeholder="Ask any question about this timestamp..."
                  className="w-full bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

          </div>
        )}


        {/* =========================================================================
            MODALITY 4: 1-TO-1 & 1-TO-GROUP GOOGLE MEET-STYLE INTERFACE
        ========================================================================= */}
        {activeModality === 'LIVE_MEET' && (
          <div className="flex flex-col h-[580px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden animate-in fade-in duration-300">
            
            {/* Top Meet Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-white">Google Meet Live Classroom</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                  Room: GER-LIVE-AUDIT-2026
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSessionType(sessionType === '1-to-1' ? '1-to-Group' : '1-to-1')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  Mode: <span className="text-blue-400 font-black">{sessionType}</span>
                </button>
              </div>
            </div>

            {/* Main Center Video Area + Optional Right Chat Side Panel */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Participant Video Grid */}
              <div className="flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 overflow-y-auto">
                
                {/* Tile 1: Instructor / Host */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden min-h-[200px]">
                  <div className="text-center space-y-2 z-10">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-xl">
                      KM
                    </div>
                    <div className="text-xs font-bold text-white">Dr. Klaus Mueller</div>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full">
                      Lead Faculty · Frankfurt
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 text-[10px] font-bold bg-slate-950/80 px-2 py-0.5 rounded-md text-slate-200">
                    Faculty Stage (1080p)
                  </div>
                </div>

                {/* Tile 2: Student (You / Admin Preview) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden min-h-[200px]">
                  <div className="text-center space-y-2 z-10">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-xl">
                      SP
                    </div>
                    <div className="text-xs font-bold text-white">Student Participant (Admin Preview)</div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      Active Microphone
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 text-[10px] font-bold bg-slate-950/80 px-2 py-0.5 rounded-md text-slate-200">
                    You
                  </div>
                </div>

                {/* Additional Group Tiles if '1-to-Group' */}
                {sessionType === '1-to-Group' && (
                  <>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden min-h-[200px]">
                      <div className="text-center space-y-2 z-10">
                        <div className="w-14 h-14 rounded-full bg-purple-600 text-white font-bold text-base flex items-center justify-center mx-auto">
                          RV
                        </div>
                        <div className="text-xs font-bold text-white">Rahul Verma</div>
                        <span className="text-[10px] text-slate-400">Munich Tech Prep</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden min-h-[200px]">
                      <div className="text-center space-y-2 z-10">
                        <div className="w-14 h-14 rounded-full bg-amber-600 text-white font-bold text-base flex items-center justify-center mx-auto">
                          AS
                        </div>
                        <div className="text-xs font-bold text-white">Amina Shaikh</div>
                        <span className="text-[10px] text-slate-400">Goethe B2 Candidate</span>
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Right Side Chat Panel (Google Meet style) */}
              {isChatPanelOpen && (
                <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> In-call Messages
                    </span>
                    <button onClick={() => setIsChatPanelOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    {meetMessages.map((m, idx) => (
                      <div key={idx} className="text-xs space-y-0.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={`font-bold ${m.isHost ? 'text-indigo-400' : 'text-blue-400'}`}>{m.sender}</span>
                          <span className="text-slate-500 font-mono">{m.time}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMeetMsg} className="p-2.5 border-t border-slate-800 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={meetInput}
                      onChange={(e) => setMeetInput(e.target.value)}
                      placeholder="Send a message to everyone..."
                      className="flex-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button type="submit" disabled={!meetInput.trim()} className="p-2 bg-blue-600 text-white rounded-xl cursor-pointer">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Controls Bar (Google Meet Style) */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
                }`}
                title={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsCamOn(!isCamOn)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isCamOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
                }`}
                title={isCamOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCamOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Present your screen"
              >
                <Monitor className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  handRaised ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Raise or lower your hand"
              >
                <Hand className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsChatPanelOpen(!isChatPanelOpen)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isChatPanelOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Toggle side chat panel"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={() => alert('Leaving mock classroom call...')}
                className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                title="Leave call"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave Call</span>
              </button>
            </div>

          </div>
        )}


        {/* =========================================================================
            MODALITY 5: SPORTS & CAMP CLASSES (ONLINE & OFFLINE MODES)
        ========================================================================= */}
        {activeModality === 'SPORTS_CAMP' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            
            {/* Mode Switcher Banner */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 p-4 rounded-2xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Sports, Fitness &amp; Student Camp Modality</h3>
                  <p className="text-xs text-slate-400">Switch between Virtual Online Live Drills and Physical On-Campus Camp grounds.</p>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setCampMode('ONLINE')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    campMode === 'ONLINE'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Online Mode (Live Stream &amp; Drills)</span>
                </button>

                <button
                  onClick={() => setCampMode('OFFLINE')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    campMode === 'OFFLINE'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Offline Mode (On-Campus Ground)</span>
                </button>
              </div>
            </div>

            {/* Content for ONLINE mode */}
            {campMode === 'ONLINE' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> Live Movement &amp; Fitness Stream
                    </span>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                      STREAM ACTIVE
                    </span>
                  </div>

                  <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-center p-6 relative overflow-hidden">
                    <div className="space-y-2 z-10">
                      <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                        <Flame className="w-7 h-7" />
                      </div>
                      <div className="text-sm font-black text-white">Daily European Orientation Warm-Up &amp; Agility</div>
                      <div className="text-xs text-slate-400">Coach Marco Reus · 45 mins Endurance &amp; Team Building</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Calories Burned</div>
                      <div className="text-lg font-black text-amber-400">320 kcal</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Heart Rate Sim</div>
                      <div className="text-lg font-black text-emerald-400">128 bpm</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Movement Accuracy</div>
                      <div className="text-lg font-black text-indigo-400">92% AI Score</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Online Session Schedule
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-white">07:00 AM - Mobility &amp; Breathing</div>
                      <div className="text-[11px] text-slate-400">Focus on posture and vocal resonance for German speech.</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-white">05:30 PM - Team Football Strategy</div>
                      <div className="text-[11px] text-slate-400">German sports terminology and cultural team dynamics.</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Content for OFFLINE mode */}
            {campMode === 'OFFLINE' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Physical Campus Camp Grounds &amp; Turf Allocation
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                      Ground Ready · Turf #3
                    </span>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>ILA Academy Sports Arena, Campus Ground</span>
                      <span className="text-emerald-400">Weather: 24°C Sunny</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Physical orientation sports session including football, badminton, and team bonding relays designed to prepare students for German university campus life.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Assigned Head Coach</div>
                        <div className="font-black text-white text-xs mt-0.5">Capt. Rajesh Pillai</div>
                        <div className="text-[10px] text-emerald-400">Certified UEFA-B Grassroots</div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Registered Batch Size</div>
                        <div className="font-black text-white text-xs mt-0.5">28 Candidates</div>
                        <div className="text-[10px] text-indigo-400">All medical waivers signed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offline QR Pass Generator */}
                <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between items-center text-center space-y-4">
                  <div className="w-full">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                      Student Gate Pass QR
                    </h4>
                  </div>

                  <div className="p-4 bg-white rounded-2xl shadow-xl">
                    <QrCode className="w-28 h-28 text-slate-950" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-black text-white">PASS ID: #CAMP-2026-X79</div>
                    <div className="text-[10px] text-slate-400">Valid for Entry at Campus Sports Complex Gate 2</div>
                  </div>

                  <button
                    onClick={() => alert('Printing physical gate pass badge...')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Print Entry Pass Badge
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default StudentPathStudio;

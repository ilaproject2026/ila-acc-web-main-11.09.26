import { useState, useEffect } from 'react';
import { 
  FileText, Bot, Mic, MicOff, Send, Lock, Unlock, PlayCircle, Book, 
  CheckCircle, Clock, BrainCircuit, Hand, Users, Video, Link2, Copy, 
  Check, ExternalLink, Sparkles, Volume2, Pause, Play, Download, X,
  ChevronRight, RefreshCw, AlertCircle, Laptop
} from 'lucide-react';
import { 
  getActiveStudent, getInquiries, setActiveStudent, 
  updateStudentTopicProgress, Inquiry 
} from '../lib/db';
import { APP_BASE_URL, sanitizeAppUrl } from '../lib/config';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'classroom' | 'library'>('classroom');
  const [currentStudent, setCurrentStudent] = useState<Inquiry | null>(null);
  const [allStudents, setAllStudents] = useState<Inquiry[]>([]);

  // Dual Mode State
  const [classMode, setClassMode] = useState<'ai' | 'tutor'>('ai');
  const [activeStrategy, setActiveStrategy] = useState('Strategy 4: Standard Academic Pace');
  const [handRaised, setHandRaised] = useState(false);
  
  // Syllabus & Progress State
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(['A1']);
  const [activeTopic, setActiveTopic] = useState('Greetings & Introductions');
  const [topicsCompleted, setTopicsCompleted] = useState<string[]>([]);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string; type: 'normal' | 'doubt' | 'ai' }[]>([
    { 
      sender: 'Intelli-Coach AI', 
      text: 'Guten Tag! I am your 24/7 Intelli-Coach companion. Today we are exploring sentence structures & German vocabulary. Ask me any question or type "Test me" for a quick quiz!', 
      time: '10:00 AM',
      type: 'ai' 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Voice Input State (Web Speech Recognition)
  const [isListening, setIsListening] = useState(false);

  // Modals & Links State
  const [copiedLink, setCopiedLink] = useState<'vclass' | 'video' | null>(null);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<{ title: string; type: 'video' | 'pdf' | 'audio'; content?: string } | null>(null);

  // 1. Load active student and inquiries
  const loadStudentData = () => {
    const active = getActiveStudent();
    setCurrentStudent(active);
    const inqs = getInquiries().filter(i => 
      i.category === 'Education' || 
      i.course?.toLowerCase().includes('german') || 
      i.course?.toLowerCase().includes('ielts')
    );
    setAllStudents(inqs);

    if (active) {
      if (active.completedTopics && active.completedTopics.length > 0) {
        setTopicsCompleted(active.completedTopics);
      }
      // If student is enrolled in AI, default to AI mode, else tutor mode
      if (active.isAiMethod || active.path?.includes('AI')) {
        setClassMode('ai');
      } else {
        setClassMode('tutor');
      }
    }
  };

  useEffect(() => {
    loadStudentData();
    window.addEventListener('ilas-active-student-changed', loadStudentData);
    window.addEventListener('ilas-student-allotment-changed', loadStudentData);
    window.addEventListener('ilas-inquiries-changed', loadStudentData);
    return () => {
      window.removeEventListener('ilas-active-student-changed', loadStudentData);
      window.removeEventListener('ilas-student-allotment-changed', loadStudentData);
      window.removeEventListener('ilas-inquiries-changed', loadStudentData);
    };
  }, []);

  // 2. Timer Countdown
  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 3. Mark topic completed & unlock next level
  const handleCompleteTopic = (topic: string) => {
    if (!topicsCompleted.includes(topic)) {
      const updated = [...topicsCompleted, topic];
      setTopicsCompleted(updated);
      if (currentStudent) {
        updateStudentTopicProgress(currentStudent.id, topic);
      }

      // Unlock next level if 3 or more topics completed
      if (updated.length >= 3 && !unlockedLevels.includes('A2')) {
        setUnlockedLevels(prev => [...prev, 'A2']);
      }
      if (updated.length >= 6 && !unlockedLevels.includes('B1')) {
        setUnlockedLevels(prev => [...prev, 'B1']);
      }
    }
  };

  // 4. Voice Input (Web Speech Recognition)
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is supported in modern browsers like Google Chrome and Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE'; // German or English
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // 5. Intelligent AI Chat Response Engine
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { 
      sender: currentStudent?.name || 'You', 
      text: userText, 
      time: timeNow, 
      type: handRaised ? ('doubt' as const) : ('normal' as const) 
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setHandRaised(false);

    if (classMode === 'ai') {
      setIsAiResponding(true);

      setTimeout(() => {
        setIsAiResponding(false);
        let aiReply = '';
        const lower = userText.toLowerCase();

        if (lower.includes('test') || lower.includes('quiz') || lower.includes('exam')) {
          aiReply = `🎯 German Interactive Quiz (${activeStrategy}):\nFill in the blank: "Ich fahre morgen mit ____ (der/dem) Zug nach Berlin."\n\nHint: The preposition "mit" always governs the Dativ case!`;
        } else if (lower.includes('dem') || lower.includes('zug')) {
          aiReply = `🎉 Ausgezeichnet! Correct! "Mit dem Zug" is accurate because "der Zug" (masculine) becomes "dem Zug" in the Dative case. +10 points added to your CEFR fluency record!`;
        } else if (lower.includes('der') || lower.includes('die') || lower.includes('das') || lower.includes('article') || lower.includes('gender')) {
          aiReply = `📚 Grammar Rule Guide:\n• Masculine: der Mann -> den Mann (Akk) -> dem Mann (Dat)\n• Feminine: die Frau -> die Frau (Akk) -> der Frau (Dat)\n• Neuter: das Kind -> das Kind (Akk) -> dem Kind (Dat)\n• Plural: die Kinder -> die Kinder (Akk) -> den Kindern (Dat)`;
        } else if (lower.includes('hello') || lower.includes('hallo') || lower.includes('guten tag')) {
          aiReply = `Guten Tag ${currentStudent?.name || 'Student'}! Wie geht es Ihnen heute? Are you ready to practice our topic: "${activeTopic}"?`;
        } else if (lower.includes('strategy') || lower.includes('pace')) {
          aiReply = `Your learning session is currently optimized under: "${activeStrategy}". Vocabulary repetition intervals and question complexity have dynamically synchronized.`;
        } else {
          aiReply = `Intelli-Coach Feedback: Excellent inquiry on "${userText}". In German grammar, remember the verb always stays in Position 2 in declarative sentences. Would you like a practice sentence or situational dialogue?`;
        }

        setChatMessages(prev => [
          ...prev, 
          { 
            sender: 'Intelli-Coach AI', 
            text: aiReply, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            type: 'ai' 
          }
        ]);
      }, 1000);
    } else {
      // Tutor Mode auto-instructor answer simulation
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev, 
          { 
            sender: 'Herr Müller (Faculty Lead)', 
            text: `Danke für die Frage! I see your query regarding "${userText}". Let's review this live together on screen. Check our shared slide.`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            type: 'normal' 
          }
        ]);
      }, 1200);
    }
  };

  const copyToClipboard = (text: string, type: 'vclass' | 'video') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Resolved dynamic values
  const isAiMethod = currentStudent?.isAiMethod || currentStudent?.path?.includes('AI') || classMode === 'ai';
  const assignedVClassLink = sanitizeAppUrl(
    currentStudent?.classLink,
    isAiMethod ? `${APP_BASE_URL}/#student-portal` : 'https://meet.google.com/ila-vclass-live'
  );
  const assignedVideoLink = sanitizeAppUrl(
    currentStudent?.videoLink,
    `${APP_BASE_URL}/#student-portal?tab=materials`
  );
  const assignedBatch = currentStudent?.batch || (isAiMethod ? 'Self-Paced AI (No Batch Needed)' : 'Morning Cohort (09:00 AM – 11:00 AM IST)');

  const courseSyllabus = [
    { 
      level: 'A1', 
      title: 'A1 Foundational German', 
      topics: ['Greetings & Introductions', 'Numbers 1–100 & Time', 'Basic Verbs & Conjugations', 'At the Bakery & Supermarket', 'Directions in City'] 
    },
    { 
      level: 'A2', 
      title: 'A2 Elementary German', 
      topics: ['Past Tense (Perfekt & Präteritum)', 'Modal Verbs in Action', 'Subordinate Clauses (weil, dass)', 'Health & Doctor Visit'] 
    },
    { 
      level: 'B1', 
      title: 'B1 Intermediate German', 
      topics: ['Workplace & Email Syntax', 'Subjunctive II (Konjunktiv II)', 'Debate & Opinion Formulation'] 
    }
  ];

  return (
    <div className="pt-16 bg-slate-100 min-h-screen pb-20 font-sans">
      
      {/* 1. TOP HEADER & STUDENT CONTEXT BAR */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2.5 py-0.5 rounded-full">
                Student Learning Portal
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Enrolled Session
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Welcome back, {currentStudent?.name || 'Enrolled Student'}!</span>
            </h1>

            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-medium">
              <span>Course: <strong className="text-brand-300">{currentStudent?.course || 'German Language A1–C2'}</strong></span>
              <span>•</span>
              <span>Path: <strong className="text-indigo-300">{currentStudent?.path || (isAiMethod ? 'Intelli-Coach AI Trainer™' : 'Human Training Live')}</strong></span>
              <span>•</span>
              <span>Batch: <strong className="text-emerald-300">{assignedBatch}</strong></span>
            </div>
          </div>

          {/* Quick Enrolled Student Switcher & Dual Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {allStudents.length > 1 && (
              <select
                value={currentStudent?.email || ''}
                onChange={(e) => {
                  setActiveStudent(e.target.value);
                  loadStudentData();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer outline-none focus:border-brand-500"
                title="Switch Active Enrolled Student Profile"
              >
                {allStudents.map(s => (
                  <option key={s.id} value={s.email}>Candidate: {s.name} ({s.course})</option>
                ))}
              </select>
            )}

            <button 
              onClick={() => setClassMode('ai')} 
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                classMode === 'ai' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-300" />
              <span>Intelli-Coach AI Mode</span>
            </button>

            <button 
              onClick={() => setClassMode('tutor')} 
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                classMode === 'tutor' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span>Human Tutor Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SHARED VCLASS & PATH VIDEO LINKS BANNER */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Left: VClass Link */}
          <div className="flex-1 bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                <Link2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Live Virtual Classroom (VClass) Access:</span>
              </div>
              <p className="text-[11px] font-mono text-indigo-700 truncate mt-0.5">
                {assignedVClassLink}
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard(assignedVClassLink, 'vclass')}
                className="px-2.5 py-1.5 bg-white text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy VClass Meeting Link"
              >
                {copiedLink === 'vclass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'vclass' ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={assignedVClassLink}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Join Live Classroom</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Path Video Stream */}
          <div className="flex-1 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Path Curriculum Video Lecture Stream:</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-700 truncate mt-0.5">
                {assignedVideoLink}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard(assignedVideoLink, 'video')}
                className="px-2.5 py-1.5 bg-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy Video Lecture Stream Link"
              >
                {copiedLink === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'video' ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setPreviewVideoOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Watch Path Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar: Course Topics & Library Navigation */}
          <div className="lg:w-1/4 space-y-4">
            
            {/* Syllabus Progression Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">Course Syllabus</h3>
                <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                  {topicsCompleted.length} Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                  <span>Overall Mastery</span>
                  <span className="text-brand-700">{Math.min(100, Math.round((topicsCompleted.length / 10) * 100))}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.round((topicsCompleted.length / 10) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Levels & Topics */}
              <div className="space-y-3">
                {courseSyllabus.map((lvl) => {
                  const isUnlocked = unlockedLevels.includes(lvl.level);
                  return (
                    <div key={lvl.level} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className={`p-2.5 text-xs font-extrabold flex items-center justify-between ${
                        isUnlocked ? 'bg-slate-50 text-slate-900' : 'bg-slate-100/70 text-slate-400'
                      }`}>
                        <span className="flex items-center gap-1.5">
                          <span>{lvl.title}</span>
                        </span>
                        {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-brand-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                      </div>

                      {isUnlocked && (
                        <div className="p-1.5 bg-white space-y-0.5">
                          {lvl.topics.map(topic => {
                            const isCurrent = activeTopic === topic;
                            const isDone = topicsCompleted.includes(topic);
                            return (
                              <button
                                key={topic}
                                onClick={() => setActiveTopic(topic)}
                                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                  isCurrent 
                                    ? 'bg-brand-50 text-brand-800 font-bold' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <span className="truncate pr-2">{topic}</span>
                                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Material Library Quick Launcher */}
            <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white p-5 rounded-2xl border border-brand-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-brand-400" />
                <h4 className="font-extrabold text-sm">Material &amp; Recordings</h4>
              </div>
              <p className="text-xs text-brand-200 leading-relaxed">
                Review verified session recordings, grammar cheat sheets, and downloadable CEFR exercises.
              </p>
              <button 
                onClick={() => setActiveTab(activeTab === 'classroom' ? 'library' : 'classroom')}
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>{activeTab === 'classroom' ? 'Open Material Library' : 'Return to Active Class'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Main Panel: Classroom Stream or Material Library */}
          <div className="lg:w-3/4">
            
            {activeTab === 'classroom' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[740px]">
                
                {/* Classroom Header Bar */}
                <div className={`${classMode === 'ai' ? 'bg-slate-950' : 'bg-emerald-950'} text-white p-3.5 md:p-4 flex flex-col md:flex-row items-center justify-between gap-3 transition-colors border-b border-slate-800`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10">
                      {classMode === 'ai' ? <BrainCircuit className="w-5 h-5 text-indigo-400" /> : <Video className="w-5 h-5 text-emerald-400" />}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sm md:text-base flex items-center gap-2 text-white">
                        <span>{classMode === 'ai' ? 'Intelli-Coach AI Dynamic Coaching' : 'Live Human Tutor Session'}:</span>
                        <span className="text-amber-300">{activeTopic}</span>
                      </h2>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{classMode === 'ai' ? 'Adaptive Continuous Learning Active' : 'Live Interactive Classroom Session'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Strategy Selector for AI Mode */}
                    {classMode === 'ai' && (
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <select 
                          value={activeStrategy}
                          onChange={(e) => {
                            setActiveStrategy(e.target.value);
                            setChatMessages(prev => [...prev, {
                              sender: 'Intelli-Coach AI',
                              text: `Strategy updated to: ${e.target.value}. Learning pace and grammatical complexity have adjusted immediately!`,
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              type: 'ai'
                            }]);
                          }}
                          className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="Strategy 1: Absolute Beginner (Slow Pace)">Strategy 1: Beginner</option>
                          <option value="Strategy 2: Cautious Learner">Strategy 2: Cautious</option>
                          <option value="Strategy 3: Repetitive Memorizer">Strategy 3: Repetitive</option>
                          <option value="Strategy 4: Standard Academic Pace">Strategy 4: Standard Academic</option>
                          <option value="Strategy 7: Fast-Track Certification">Strategy 7: Fast-Track</option>
                          <option value="Strategy 10: Native Immersion">Strategy 10: Native Immersion</option>
                        </select>
                      </div>
                    )}

                    {/* Timer with Pause/Resume */}
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl font-mono text-xs text-slate-300 border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatTime(timeLeft)}</span>
                      <button 
                        onClick={() => setIsTimerRunning(!isTimerRunning)} 
                        className="text-slate-400 hover:text-white cursor-pointer ml-1"
                        title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                      >
                        {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Central Workspace: Video Stream (Left) + Chat Panel (Right) */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* Left: Video / Virtual Class Screen */}
                  <div className="flex-1 flex flex-col bg-slate-950 relative border-r border-slate-800">
                    
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                      {classMode === 'ai' ? (
                        <>
                          <img 
                            src="https://images.unsplash.com/photo-1590650153855-8946779d750c?auto=format&fit=crop&q=80&w=1000" 
                            className="opacity-30 object-cover w-full h-full absolute inset-0" 
                            alt="AI Coaching Stream" 
                          />
                          <div className="relative z-10 text-center px-6 max-w-md">
                            <div className="w-20 h-20 bg-indigo-600/30 rounded-3xl border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-lg shadow-indigo-500/20">
                              <Bot className="w-10 h-10 text-indigo-400 animate-pulse" />
                            </div>
                            <h3 className="text-white font-extrabold text-lg tracking-tight">Intelli-Coach AI Active Stream</h3>
                            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                              Analyzing comprehension &amp; synthesizing CEFR level answers. Topic: <strong>{activeTopic}</strong>.
                            </p>
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setChatInput('Test me on this topic with a quick quiz question!');
                                  handleSendMessage();
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                              >
                                🎯 Test My German
                              </button>
                              <button
                                onClick={() => setPreviewVideoOpen(true)}
                                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <PlayCircle className="w-3.5 h-3.5" /> Watch Lesson Video
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img 
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" 
                            className="opacity-60 object-cover w-full h-full absolute inset-0" 
                            alt="Faculty Tutor" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6 z-10">
                            <div className="flex justify-between items-center">
                              <span className="px-3 py-1 bg-emerald-500/30 text-emerald-300 font-mono text-xs rounded-full border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                <span>Tutor Room GER-2026</span>
                              </span>
                              <span className="px-3 py-1 bg-black/60 text-white font-bold text-xs rounded-full backdrop-blur-md">
                                Instructor: Herr Klaus Müller
                              </span>
                            </div>

                            <div className="text-center space-y-3">
                              <p className="text-white text-sm font-semibold max-w-sm mx-auto">
                                Virtual Classroom session is ongoing for your batch: <span className="text-emerald-300 font-bold">{assignedBatch}</span>.
                              </p>
                              <a
                                href={assignedVClassLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
                              >
                                <Video className="w-4 h-4" />
                                <span>Join Live Virtual Classroom (VClass)</span>
                              </a>
                            </div>

                            <div className="text-[11px] text-slate-400 text-right">
                              Link: {assignedVClassLink}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Student Camera PIP Simulator */}
                      <div className="absolute bottom-4 left-4 w-32 h-24 bg-slate-900 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col items-center justify-center text-slate-400 z-20">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300">{currentStudent?.name || 'You'}</span>
                        <span className="text-[9px] text-emerald-400">Audio Ready</span>
                      </div>
                    </div>

                    {/* Bottom Video Controls Bar */}
                    <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <button 
                        onClick={() => handleCompleteTopic(activeTopic)}
                        className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          topicsCompleted.includes(activeTopic)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{topicsCompleted.includes(activeTopic) ? 'Topic Completed' : 'Mark Topic Finished'}</span>
                      </button>

                      {classMode === 'tutor' && (
                        <button 
                          onClick={() => {
                            setHandRaised(!handRaised);
                            if (!handRaised) {
                              setChatMessages(prev => [...prev, {
                                sender: currentStudent?.name || 'You',
                                text: '✋ Raised hand with a doubt! Looking for clarification.',
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                type: 'doubt'
                              }]);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            handRaised 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Hand className="w-4 h-4" />
                          <span>{handRaised ? 'Hand Raised (Tutor Notified)' : 'Raise Hand for Doubt'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Live Interactive Chat Panel */}
                  <div className="w-full md:w-80 flex flex-col bg-white border-t md:border-t-0 border-slate-200">
                    
                    {/* Chat Header */}
                    <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          classMode === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {classMode === 'ai' ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">
                            {classMode === 'ai' ? 'Intelli-Coach AI Chat' : 'Class Discussion'}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {classMode === 'ai' ? 'Ask doubts & translation' : 'Live cohort chat'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
                      {chatMessages.map((msg, idx) => {
                        const isMe = msg.sender === (currentStudent?.name || 'You');
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-2xl text-xs shadow-2xs max-w-[90%] ${
                              isMe 
                                ? 'ml-auto bg-brand-600 text-white rounded-br-sm' 
                                : msg.type === 'doubt'
                                  ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-bl-sm'
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[10px] font-bold">
                              <span>{msg.sender}</span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="whitespace-pre-line leading-relaxed font-medium">{msg.text}</p>
                          </div>
                        );
                      })}

                      {isAiResponding && (
                        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs flex items-center gap-2 animate-pulse">
                          <Bot className="w-3.5 h-3.5" />
                          <span>Intelli-Coach AI is thinking...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-3 border-t border-slate-200 bg-white">
                      <div className="flex items-center gap-1.5">
                        {/* Voice Mic Button */}
                        <button 
                          onClick={handleToggleVoice}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isListening 
                              ? 'bg-red-500 text-white animate-bounce' 
                              : 'bg-slate-100 text-slate-500 hover:text-brand-600 hover:bg-slate-200'
                          }`}
                          title="Voice Input (Speak in German or English)"
                        >
                          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </button>

                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder={isListening ? "Listening... speak now" : "Ask doubt or type 'Test me'..."} 
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-100 focus:bg-white text-xs outline-none focus:ring-2 focus:ring-brand-500 border border-slate-200"
                        />

                        <button 
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim()}
                          className={`p-2 rounded-xl text-white transition-all cursor-pointer ${
                            chatInput.trim() ? 'bg-brand-600 hover:bg-brand-500 shadow-sm' : 'bg-slate-300 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Material Library Tab */}
            {activeTab === 'library' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Book className="w-5 h-5 text-brand-600" />
                      <span>Material Library &amp; Auto-Recordings</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Curriculum handbooks, auto-recorded lecture streams, and vocabulary sheets synced to your path.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('classroom')} 
                    className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-500 transition-colors cursor-pointer self-start"
                  >
                    Return to Classroom →
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: 'A1_Grammar_Master_Handbook.pdf', type: 'pdf' as const, size: '2.4 MB', desc: 'Syntax rules, case declensions, and sentence order' },
                    { title: 'Essential_German_Vocabulary_A1_A2.pdf', type: 'pdf' as const, size: '3.1 MB', desc: 'Top 1000 high-frequency German word bank' },
                    { title: 'Lecture_Recording_Sentence_Structure.mp4', type: 'video' as const, size: '85 MB', desc: 'Recorded human tutor lecture with interactive notes' },
                    { title: 'Oral_Phonetics_Pronunciation_Drill.audio', type: 'audio' as const, size: '14 MB', desc: 'Audio phonetics drill for umlauts and diphthongs' },
                    { title: 'CEFR_A1_Practice_Mock_Exam.pdf', type: 'pdf' as const, size: '1.8 MB', desc: 'Complete simulation exam with Goethe/telc rubric' }
                  ].map((res, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/50 hover:bg-white"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          {res.type === 'video' ? <PlayCircle className="w-5 h-5" /> : res.type === 'audio' ? <Volume2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs mb-1 truncate" title={res.title}>{res.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{res.desc}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">{res.size}</span>
                        <button
                          onClick={() => setPreviewResource(res)}
                          className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. PATH VIDEO PLAYER MODAL */}
      {previewVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-6 text-white border border-slate-800 shadow-2xl relative my-6">
            <button 
              onClick={() => setPreviewVideoOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Curriculum Lecture Stream
              </span>
            </div>
            
            <h3 className="text-xl font-black">{currentStudent?.course || 'German Language A1–C2'} Video Stream</h3>
            <p className="text-xs text-slate-400 mt-0.5">Stream Link: <span className="font-mono text-emerald-400">{assignedVideoLink}</span></p>

            {/* Video Player Display Container */}
            <div className="mt-4 aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover opacity-50" 
                alt="Lecture preview" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-6">
                <PlayCircle className="w-16 h-16 text-emerald-400 mb-2 cursor-pointer hover:scale-110 transition-transform" />
                <h4 className="text-base font-bold">Module 1: Complete Syntax &amp; Conversational Dialogues</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  Full HD lecture recording with embedded subtitle captions and synchronized syllabus index.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(assignedVideoLink, 'video')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === 'video' ? 'Link Copied!' : 'Copy Stream Link'}</span>
                </button>
              </div>
              <button
                onClick={() => setPreviewVideoOpen(false)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Video Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. RESOURCE PREVIEW MODAL */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-900 border border-slate-200 shadow-2xl relative my-6">
            <button 
              onClick={() => setPreviewResource(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{previewResource.title}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{previewResource.type} Academic Material</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2 text-slate-700 font-medium max-h-60 overflow-y-auto font-mono">
              <p>§ Official ILA Global Academic Material</p>
              <p>Course: {currentStudent?.course || 'German Language'}</p>
              <p>Candidate Pass: {currentStudent?.name || 'Enrolled Student'}</p>
              <p>----------------------------------------</p>
              <p>• Chapter Overview: Essential vocabulary banks &amp; grammatical declensions.</p>
              <p>• CEFR Guideline: Standardized framework for A1–C2 fluency validation.</p>
              <p>• Practice Exercise: Translate situational dialogues from English into German.</p>
              <p>• Live Class Sync: Reviewed in your assigned batch ({assignedBatch}).</p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  alert(`Downloading ${previewResource.title} to your local device.`);
                  setPreviewResource(null);
                }}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resource</span>
              </button>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

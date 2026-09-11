import { useState, useEffect } from 'react'
import { Monitor, FileText, Bot, Mic, Send, Lock, Unlock, PlayCircle, Book, CheckCircle, Clock, BrainCircuit, Hand, Users, Video } from 'lucide-react'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('classroom')
  const [unlockedLevels] = useState(['A1'])
  const [activeTopic, setActiveTopic] = useState('Greetings')
  const [topicsCompleted, setTopicsCompleted] = useState<string[]>([])
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours (120 mins)
  const [isInteractionTime, setIsInteractionTime] = useState(true);

  // Dual Mode State
  const [classMode, setClassMode] = useState<'ai' | 'tutor'>('ai');
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string, type: 'normal' | 'doubt'}[]>([
    { sender: 'AI', text: 'Guten Tag! We are studying Greetings. How can I help you today?', type: 'normal' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCompleteTopic = (topic: string) => {
    if (!topicsCompleted.includes(topic)) {
      setTopicsCompleted([...topicsCompleted, topic]);
    }
  };

  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    const newMessage = { sender: 'You', text: chatInput, type: handRaised ? 'doubt' : 'normal' as any };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
    setHandRaised(false);

    if (classMode === 'ai') {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'Intelli-Coach AI', 
          text: 'Evaluating your response... Your active learning strategy is being updated to fit your comprehension pace. Good job!', 
          type: 'normal' 
        }]);
      }, 1500);
    }
  };

  const courseSyllabus = [
    { level: 'A1', topics: ['Greetings', 'Numbers 1-100', 'Basic Verbs', 'At the Bakery'] },
    { level: 'A2', topics: ['Past Tense', 'Directions', 'Shopping', 'Health'] },
    { level: 'IELTS', topics: ['Listening Module 1', 'Reading Basics'] },
  ];

  const enrolledCourses = [
    { name: 'German Language A1', progress: 45, type: 'both' },
    { name: 'IELTS Band 8.0 Masterclass', progress: 12, type: 'ai' }
  ];

  return (
    <div className="pt-20 bg-slate-50 min-h-screen pb-20">
      <div className="bg-brand-900 text-white py-8 mb-8">
        <div className="container-max px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student Training Portal</h1>
            <p className="text-brand-100">Welcome back! Access your live classes, AI tutor, and local library.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setClassMode('ai')} 
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${classMode === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <BrainCircuit className="w-4 h-4" /> Inteli Coach AI Mode
            </button>
            <button 
              onClick={() => setClassMode('tutor')} 
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${classMode === 'tutor' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Users className="w-4 h-4" /> Human Tutor Mode
            </button>
          </div>
        </div>
      </div>

      <div className="container-max px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Dropdown Sidebar with Lock Logic */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 px-2">Your Courses & Topics</h3>
              <div className="space-y-4">
                {courseSyllabus.map((course) => {
                  const isUnlocked = unlockedLevels.includes(course.level);
                  return (
                    <div key={course.level} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className={`p-3 font-bold flex items-center justify-between ${isUnlocked ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-500'}`}>
                        <span>Level {course.level}</span>
                        {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      {isUnlocked && (
                        <div className="bg-white p-2">
                          {course.topics.map(topic => (
                            <button
                              key={topic}
                              onClick={() => setActiveTopic(topic)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${activeTopic === topic ? 'bg-brand-100 text-brand-800 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                              <span>{topic}</span>
                              {topicsCompleted.includes(topic) && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
              <h3 className="font-bold text-brand-900 mb-2">Local Material Library</h3>
              <p className="text-sm text-brand-700 mb-4">View materials alongside your class, auto-saved.</p>
              <button onClick={() => setActiveTab('library')} className="w-full py-2.5 bg-brand-700 text-white rounded-lg font-bold hover:bg-brand-800 transition-colors">
                Open Library
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {activeTab === 'classroom' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[700px]">
                
                {/* Header with Countdown Clock & Strategy Selector */}
                <div className={`${classMode === 'ai' ? 'bg-slate-900' : 'bg-emerald-900'} text-white p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors`}>
                  <div className="flex items-center gap-4">
                    <h2 className="font-bold flex items-center gap-2">
                      {classMode === 'ai' ? <Bot className="w-5 h-5 text-brand-400" /> : <Video className="w-5 h-5 text-emerald-400" />}
                      {classMode === 'ai' ? 'Live AI Class' : 'Live Human Tutor Session'}: {activeTopic}
                    </h2>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Strategy Selection UI for AI Class */}
                    {classMode === 'ai' && (
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-brand-400" />
                        <select 
                          onChange={(e) => alert(`Intelli-Coach AI synchronized to: ${e.target.value}. Your learning pace, vocabulary complexity, and module durations will automatically adjust to fit this strategy.`)}
                          className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white cursor-pointer focus:border-brand-500 focus:outline-none"
                        >
                          <option value="Strategy 1: Absolute Beginner (Slow Pace)">Strategy 1: Beginner</option>
                          <option value="Strategy 2: Cautious Learner">Strategy 2: Cautious</option>
                          <option value="Strategy 3: Repetitive Memorizer">Strategy 3: Repetitive</option>
                          <option value="Strategy 4: Standard Academic Pace" defaultValue="true">Strategy 4: Standard (Default)</option>
                          <option value="Strategy 5: Visual First Learning">Strategy 5: Visual</option>
                          <option value="Strategy 6: Audio-Interactive Focus">Strategy 6: Audio</option>
                          <option value="Strategy 7: Fast-Track Certification">Strategy 7: Fast-Track</option>
                          <option value="Strategy 8: Exam-Prep Intensive">Strategy 8: Exam-Prep</option>
                          <option value="Strategy 9: Advanced Accelerated">Strategy 9: Advanced</option>
                          <option value="Strategy 10: Native Level Immersion">Strategy 10: Native Pace</option>
                        </select>
                      </div>
                    )}

                    {classMode === 'tutor' && (
                      <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                        🔴 Auto-Recording ON (Syncing to Library)
                      </span>
                    )}

                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full font-mono text-sm">
                      <Clock className="w-4 h-4 text-slate-300" />
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Panel: Video Screen & Interaction */}
                  <div className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50 relative">
                    
                    {/* Main Video Stream */}
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                       {classMode === 'ai' ? (
                         <>
                          {/* Simulated Animated AI Avatar Stream */}
                          <img src="https://images.unsplash.com/photo-1590650153855-8946779d750c?auto=format&fit=crop&q=80&w=800" className="opacity-50 object-cover w-full h-full absolute inset-0" alt="Video stream background" />
                          <div className="relative z-10 text-center">
                              <Bot className="w-20 h-20 text-indigo-400 mx-auto mb-4" />
                              <p className="text-white font-medium text-lg tracking-wide">[ Interactive 2-Hour Continuous AI Coaching ]</p>
                              <p className="text-indigo-300 text-sm mt-2">Evaluating comprehension & dynamically altering active learning strategy...</p>
                          </div>
                         </>
                       ) : (
                         <>
                          {/* Human Tutor Video Stream */}
                          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" className="opacity-80 object-cover w-full h-full absolute inset-0" alt="Human Tutor Video" />
                          <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 rounded-full text-xs text-white font-bold backdrop-blur-md">
                            Instructor: Herr Müller
                          </div>
                         </>
                       )}
                       
                       {/* Student Cam PIP */}
                       <div className="absolute bottom-4 left-4 w-40 h-28 bg-slate-800 rounded-lg border-2 border-slate-600 shadow-xl overflow-hidden flex items-center justify-center">
                          <Mic className="w-6 h-6 text-slate-500" />
                          <span className="text-xs text-slate-500 absolute bottom-1 right-2">You</span>
                       </div>
                    </div>

                    <div className="p-4 bg-white flex justify-between items-center border-t border-slate-200">
                      <button 
                        onClick={() => handleCompleteTopic(activeTopic)}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Topic Finished
                      </button>
                      
                      {classMode === 'tutor' && (
                        <button 
                          onClick={() => setHandRaised(!handRaised)}
                          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${handRaised ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                          <Hand className="w-4 h-4" /> {handRaised ? 'Hand Raised (Notifying Tutor)' : 'Raise Hand for Doubt'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Panel: Chat Interaction */}
                  <div className="w-80 flex flex-col bg-white">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${classMode === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {classMode === 'ai' ? <Bot className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Interactive Chat</h4>
                          <p className="text-xs text-slate-500">{classMode === 'ai' ? 'Continuous AI Conversation' : 'Live Class Discussion'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl text-sm shadow-sm border max-w-[85%] ${
                          msg.sender === 'You' 
                            ? 'ml-auto bg-brand-600 text-white border-brand-700 rounded-tr-sm' 
                            : 'bg-white text-slate-800 border-slate-200 rounded-tl-sm'
                        } ${msg.type === 'doubt' ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 text-blue-900' : ''}`}>
                          {msg.type === 'doubt' && <span className="text-[10px] font-black uppercase text-blue-600 block mb-1">Doubt Highlighted</span>}
                          <span className="font-bold text-[10px] block opacity-70 mb-0.5">{msg.sender}</span>
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-slate-100 bg-white">
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-brand-600 bg-slate-100 rounded-lg">
                          <Mic className="w-4 h-4" />
                        </button>
                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={!isInteractionTime} 
                          placeholder={handRaised ? "Type your doubt here..." : "Type a message..."} 
                          className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${handRaised ? 'bg-blue-50 text-blue-900 placeholder-blue-300 focus:ring-blue-500' : 'bg-slate-100 focus:ring-brand-500'}`} 
                        />
                        <button onClick={handleSendMessage} disabled={!isInteractionTime} className={`p-2 text-white rounded-lg disabled:opacity-50 ${handRaised ? 'bg-blue-600' : 'bg-brand-600'}`}>
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Book className="w-6 h-6 text-brand-600" />
                      Local Material & Auto-Recordings Library
                    </h2>
                    <button onClick={() => setActiveTab('classroom')} className="text-brand-600 font-bold hover:underline">
                      Return to Class
                    </button>
                  </div>
                  
                  <p className="text-slate-600 mb-8">
                    Auto-recorded Human Tutor materials and open-source references populated by AI based on your active syllabus. All materials are securely saved to your local link for re-access.
                  </p>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {['A1_Grammar_Rules.pdf', 'Vocabulary_List_AutoGenerated.pdf', 'Lesson_Recording_12Oct.mp4', 'Tutor_Session_Recording_14Oct.mp4', 'Kinder_Songs_Visuals.zip'].map((book, i) => (
                      <a key={i} href="#" className="p-4 border border-slate-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all group block">
                        <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center mb-3">
                          {book.endsWith('mp4') ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-brand-700 truncate" title={book}>{book}</h4>
                        <p className="text-xs text-slate-500">Auto-saved via class sync</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

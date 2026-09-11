import { useState, useEffect } from 'react';
import { 
  Bot, 
  User, 
  AlertCircle, 
  PhoneCall, 
  Search, 
  ShieldAlert, 
  Activity, 
  FileText, 
  CheckCircle, 
  Clock
} from 'lucide-react';
import { getInquiries } from '../../lib/db';

interface ActivityLog {
  id: string;
  studentName: string;
  queryTopic: string;
  assessmentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  flagged: boolean;
  timestamp: string;
}

interface StaffCounselingLog {
  id: string;
  counselorName: string;
  studentName: string;
  topic: string;
  tokensUsed: number;
  timestamp: string;
}

export default function IlasActivityHub() {
  const [activeSubTab, setActiveSubTab] = useState<'companion' | 'analyzer' | 'tracker'>('companion');
  
  // Companion States
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('All');

  // Analyzer States
  const [meetingNotes, setMeetingNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAiAnalysisResult] = useState<{
    sentiment: 'Positive' | 'Hesitant' | '';
    objections: string;
    nextStep: string;
  } | null>(null);

  // Tracker States
  const [counselingLogs] = useState<StaffCounselingLog[]>([
    { id: 'LOG-302-A', counselorName: 'Anjali Menon', studentName: 'Rohan Kurian', topic: 'German Ausbildung Stipend', tokensUsed: 1420, timestamp: '2026-08-18 10:45 CET' },
    { id: 'LOG-302-B', counselorName: 'Markus Vance', studentName: 'Meera Pillai', topic: 'Heidelberg Hospital Contract Prep', tokensUsed: 2100, timestamp: '2026-08-18 11:20 CET' },
    { id: 'LOG-302-C', counselorName: 'Anjali Menon', studentName: 'Aron Joseph', topic: 'German B2 fast-track coaching cost', tokensUsed: 980, timestamp: '2026-08-18 12:10 CET' },
    { id: 'LOG-302-D', counselorName: 'Dr. Evelyn Brand', studentName: 'Fiona Sunny', topic: 'Nursing B1 curriculum integration with medical German', tokensUsed: 3100, timestamp: '2026-08-18 14:15 CET' }
  ]);

  // Load inquiries and make up mock AI activity logs based on them
  useEffect(() => {
    const inquiries = getInquiries();
    const mockLogs: ActivityLog[] = inquiries.map((inq, idx) => {
      const topics = [
        'German Ausbildung Eligibility & Visa Timeline',
        'Study Abroad Private vs Public University Costs',
        'IELTS Prep & fast-track B1 German certification',
        'Opportunity Card chances & employment criteria',
        'Software Engineering internship opportunities'
      ];
      const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
      const urgencies: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];

      return {
        id: `ACT-${100 + idx}`,
        studentName: inq.name,
        queryTopic: topics[idx % topics.length],
        assessmentLevel: levels[idx % levels.length],
        urgency: urgencies[idx % urgencies.length],
        flagged: idx % 3 === 0, // mock some as flagged initially
        timestamp: new Date(Date.now() - idx * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });

    // Default logs if no inquiries
    if (mockLogs.length === 0) {
      setLogs([
        {
          id: 'ACT-001',
          studentName: 'Rahul Sharma',
          queryTopic: 'Medical Residency & FSP Exam Requirements',
          assessmentLevel: 'Advanced',
          urgency: 'Critical',
          flagged: true,
          timestamp: '10:42 AM'
        },
        {
          id: 'ACT-002',
          studentName: 'Aisha Rahman',
          queryTopic: 'TU Munich Masters in Informatics Admission',
          assessmentLevel: 'Intermediate',
          urgency: 'High',
          flagged: false,
          timestamp: '11:15 AM'
        },
        {
          id: 'ACT-003',
          studentName: 'Manuel Jose',
          queryTopic: 'Chancenkarte Visa & English-only Jobs',
          assessmentLevel: 'Beginner',
          urgency: 'Medium',
          flagged: false,
          timestamp: '11:30 AM'
        }
      ]);
    } else {
      setLogs(mockLogs);
    }
  }, []);

  const handleToggleFlag = (id: string) => {
    setLogs(prev => prev.map(log => 
      log.id === id ? { ...log, flagged: !log.flagged } : log
    ));
  };

  const handleAnalyzeMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingNotes.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      // Analyze mock keyword response based on the meeting notes
      const text = meetingNotes.toLowerCase();
      let sentiment: 'Positive' | 'Hesitant' = 'Positive';
      let objections = 'None explicit.';
      let nextStep = 'Proceed to draft onboarding contract.';

      if (text.includes('cost') || text.includes('expensive') || text.includes('stipend') || text.includes('pay')) {
        sentiment = 'Hesitant';
        objections = 'Concerned about initial fast-track language coaching cost and Ausbildung stipend limits.';
        nextStep = 'Send the customized Ausbildung Stipend Breakdown PDF with direct hospital stipend details.';
      } else if (text.includes('difficult') || text.includes('fail') || text.includes('exam') || text.includes('german')) {
        sentiment = 'Hesitant';
        objections = 'Worried about German B2 exam pass rates and learning speed.';
        nextStep = 'Schedule a consultation with Dr. Evelyn Brand to explain the companion tutoring system.';
      }

      setAiAnalysisResult({
        sentiment,
        objections,
        nextStep
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.queryTopic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterUrgency === 'All' || log.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
      
      {/* Header section with Hub Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-600 animate-pulse" />
            ILA Intelligent Activity Tower
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Gemini-powered monitors: Companion interactions, Field meeting summarizer, and Counselor counseling usage logs.
          </p>
        </div>

        {/* Sub-tab selection buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 self-start lg:self-auto">
          <button
            onClick={() => setActiveSubTab('companion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeSubTab === 'companion'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🤖 Live AI Companion
          </button>
          <button
            onClick={() => setActiveSubTab('analyzer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeSubTab === 'analyzer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎙️ Field Meeting Analyzer
          </button>
          <button
            onClick={() => setActiveSubTab('tracker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeSubTab === 'tracker'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📈 AI Usage Tracker
          </button>
        </div>
      </div>

      {/* COMPANION CHAT MONITOR */}
      {activeSubTab === 'companion' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Search bar specifically for Companion */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Live Chats Filter:</span>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search student or topic..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500 w-48 font-semibold bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <select 
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white font-bold text-slate-700 outline-none"
              >
                <option value="All">All Urgency</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Statistics Widgets */}
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Active AI Chats</span>
                <span className="text-xl font-black text-slate-900">{logs.length}</span>
              </div>
            </div>
            <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-700 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Critical Urgency</span>
                <span className="text-xl font-black text-slate-900">{logs.filter(l => l.urgency === 'Critical').length}</span>
              </div>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Intervention Flags</span>
                <span className="text-xl font-black text-slate-900">{logs.filter(l => l.flagged).length}</span>
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                    <th className="p-3">Time</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">AI Consultation Topic</th>
                    <th className="p-3">Assessed Skill Level</th>
                    <th className="p-3">Urgency Rating</th>
                    <th className="p-3 text-right">Human Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">No active AI sessions found matching filters.</td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-400 font-medium">{log.timestamp}</td>
                        <td className="p-3 font-extrabold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {log.studentName}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{log.queryTopic}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.assessmentLevel === 'Advanced' ? 'bg-indigo-100 text-indigo-800' :
                            log.assessmentLevel === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {log.assessmentLevel}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.urgency === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' :
                            log.urgency === 'High' ? 'bg-red-100 text-red-800' :
                            log.urgency === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {log.urgency}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleFlag(log.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                              log.flagged 
                                ? 'bg-amber-500 border-amber-500 text-white shadow-sm' 
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                            }`}
                          >
                            {log.flagged ? (
                              <span className="flex items-center gap-1 shrink-0">
                                <PhoneCall className="w-3 h-3" /> Flagged (Assigned)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 shrink-0">
                                <AlertCircle className="w-3 h-3" /> Flag Intervention
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FIELD MEETING ANALYZER */}
      {activeSubTab === 'analyzer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-brand-600" /> Field Meeting Analyzer
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Input field conversation logs or rough counselor meeting notes. Our AI analyzes and identifies the client's core concerns, objections, and suggests actionable next steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <form onSubmit={handleAnalyzeMeeting} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500"> Rough Notes / Transcripts </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Paste details, e.g.: Rohan is very interested in the German Ausbildung Pathway but feels B2 fast-track German learning is too difficult. He's concerned about fail rates and the initial language coaching cost..."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Activity className="w-4 h-4 animate-spin shrink-0" style={{ animationDuration: isAnalyzing ? '1s' : '0s', opacity: isAnalyzing ? 1 : 0 }} />
                {isAnalyzing ? 'Running Gemini analysis...' : '🚀 Run Intelligent Analysis'}
              </button>
            </form>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center min-h-[250px] relative">
              {analysisResult ? (
                <div className="space-y-4 text-xs font-semibold animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Analysis Output</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                      analysisResult.sentiment === 'Positive'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                    }`}>
                      Sentiment: {analysisResult.sentiment}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Key Objections Detected</h4>
                    <p className="bg-white p-3 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-semibold">
                      {analysisResult.objections}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Suggested Next Step</h4>
                    <p className="p-3 bg-emerald-950 text-emerald-100 rounded-xl leading-relaxed font-black flex items-center gap-1.5 border border-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {analysisResult.nextStep}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 max-w-sm mx-auto">
                  <Bot className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Waiting for rough notes submission...</p>
                  <p className="text-[11px] text-slate-400 font-medium">Analyze meeting notes on the left to see sentiment reports and exact actions here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI USAGE TRACKER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-brand-600" /> Staff Counseling AI Logs
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Maintains high audit parameters: Tracks how active advisors utilize our neural coaching layer to consult prospective students.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Counselor / Staff Name</th>
                    <th className="p-4">Student Candidate</th>
                    <th className="p-4">Counseling Subject</th>
                    <th className="p-4 text-right">AI Context (Tokens Used)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                  {counselingLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-400 font-medium whitespace-nowrap flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {log.timestamp}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">{log.counselorName}</td>
                      <td className="p-4 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {log.studentName}
                      </td>
                      <td className="p-4 text-slate-500">{log.topic}</td>
                      <td className="p-4 text-right font-mono font-bold text-brand-600">
                        {log.tokensUsed.toLocaleString()} tkn
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

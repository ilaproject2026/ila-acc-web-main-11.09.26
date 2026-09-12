import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Globe, ExternalLink, RefreshCw, Save, BookOpen, 
  Layers, Search, CheckCircle2, SlidersHorizontal, ArrowRight, 
  Cpu, Presentation, MonitorPlay, Users, Trophy, Code, Info,
  AlertCircle, Check, Copy, ArrowUpRight
} from 'lucide-react';
import { 
  CourseDeliveryFormat, GlobalCourse, getGlobalCourses, 
  setGlobalCourses, generateUniqueCode, generateSecureCourseLink 
} from '../../lib/db';

interface EngineHubWorkspaceProps {
  initialCourseName?: string;
  initialCategory?: string;
  initialTrack?: string;
  initialFormats?: CourseDeliveryFormat[];
  initialCampMode?: 'Online' | 'Offline';
  onNavigateToLibrary?: (courseId?: string) => void;
}

export const EngineHubWorkspace: React.FC<EngineHubWorkspaceProps> = ({
  initialCourseName = 'German Language B2 Intensive',
  initialCategory = 'German Language',
  initialTrack = 'German Language A1–C2 Standard',
  initialFormats = ['SLIDE_AI', 'VIDEO_AI', 'INTELLI_COACH', 'ONE_ON_ONE', 'CAMPS_SPORTS'],
  initialCampMode = 'Online',
  onNavigateToLibrary
}) => {
  // Engine URL configuration
  const [engineUrl, setEngineUrl] = useState(() => {
    return localStorage.getItem('ilas_engine_hub_url') || 'https://enginehub.ila.academy';
  });

  // Query & Parameters
  const [searchQuery, setSearchQuery] = useState(initialCourseName);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTrack, setActiveTrack] = useState(initialTrack);
  const [activeFormats, setActiveFormats] = useState<CourseDeliveryFormat[]>(initialFormats);
  const [campMode, setCampMode] = useState<'Online' | 'Offline'>(initialCampMode);

  // Sync / Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'CURRICULUM' | 'SETTINGS'>('WORKSPACE');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Structured Modules State (generated or edited in the Engine Hub)
  const [modules, setModules] = useState([
    {
      id: 'm1',
      title: 'Module 1: Immersion & Acoustic Tuning',
      topics: ['Phonetics & Intonation Lab', 'Survival Scenarios A1/B1', 'Real-time Accent Scoring'],
      duration: '3 Weeks',
      hasAudio: true,
      hasSlides: true
    },
    {
      id: 'm2',
      title: 'Module 2: Advanced Syntax & Technical Dialogues',
      topics: ['Clinical & Technical Anamnese', 'Agile Standup Dialogues', 'Grammar Matrix Drills'],
      duration: '4 Weeks',
      hasAudio: true,
      hasSlides: true
    },
    {
      id: 'm3',
      title: 'Module 3: Situational Speech & Case Defense',
      topics: ['Cross-Border Negotiations', 'Live Boardroom Simulations', 'Case Study Defense'],
      duration: '3 Weeks',
      hasAudio: true,
      hasSlides: true
    },
    {
      id: 'm4',
      title: 'Module 4: Exam & Capstone Certification Protocol',
      topics: ['Official Goethe / Telc Mock Exam', 'Oral Panel Defense', 'Verified QR Credential Prep'],
      duration: '2 Weeks',
      hasAudio: true,
      hasSlides: true
    }
  ]);

  // Update parameters when props change
  useEffect(() => {
    if (initialCourseName) setSearchQuery(initialCourseName);
    if (initialCategory) setActiveCategory(initialCategory);
    if (initialTrack) setActiveTrack(initialTrack);
    if (initialFormats) setActiveFormats(initialFormats);
    if (initialCampMode) setCampMode(initialCampMode);
  }, [initialCourseName, initialCategory, initialTrack, initialFormats, initialCampMode]);

  const constructFullEngineUrl = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.href : '';
    const params = new URLSearchParams({
      courseName: searchQuery.trim(),
      category: activeCategory,
      track: activeTrack,
      formats: activeFormats.join(','),
      campMode: campMode,
      returnUrl: returnUrl,
      embed: 'true',
      source: 'ila-academy-admin'
    });
    return `${engineUrl.trim()}${engineUrl.includes('?') ? '&' : '?'}${params.toString()}`;
  };

  const handleTriggerAIGeneration = () => {
    if (!searchQuery.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setModules([
        {
          id: 'm1',
          title: `Module 1: Foundational Immersion for ${searchQuery}`,
          topics: ['Acoustic Speech Tuning', 'Domain-Specific Lexicon', 'Adaptive Flashcard Drills'],
          duration: '3 Weeks',
          hasAudio: true,
          hasSlides: true
        },
        {
          id: 'm2',
          title: `Module 2: Core Practical Competencies & Case Studies`,
          topics: ['Interactive Workplace Dialogues', 'Scenario Roleplays', 'Whiteboard Syntax Matrix'],
          duration: '4 Weeks',
          hasAudio: true,
          hasSlides: true
        },
        {
          id: 'm3',
          title: `Module 3: Advanced Applied Track for ${activeTrack}`,
          topics: ['Clinical/Technical Documentation', 'Real-world Negotiations', 'AI Telemetry Tuning'],
          duration: '3 Weeks',
          hasAudio: true,
          hasSlides: true
        },
        {
          id: 'm4',
          title: `Module 4: Certification, Capstone & Assessment Defense`,
          topics: ['Standardized Mock Simulation', 'Board Examination Panel', 'QR Credential Release'],
          duration: '2 Weeks',
          hasAudio: true,
          hasSlides: true
        }
      ]);
    }, 1200);
  };

  const handlePushToLibrary = () => {
    if (!searchQuery.trim()) {
      alert('Please specify a Course Name before pushing to Library.');
      return;
    }

    const courseId = `course-${Math.random().toString(36).substring(2, 9)}`;
    const accessCode = generateUniqueCode('SEC', searchQuery);
    const secureLink = generateSecureCourseLink(courseId, accessCode);

    const structuredText = modules.map(m => `${m.title}\n${m.topics.map(t => `  • ${t}`).join('\n')}`).join('\n\n');

    const newCourse: GlobalCourse = {
      id: courseId,
      name: searchQuery.trim(),
      top_title: activeCategory,
      subtitle: `${activeTrack} • Multimodal Delivery Path`,
      show_in_sub_nav: true,
      displayPosition: 1,
      viewType: 'Main View',
      staff: 'AI Academy Lead + Senior Faculty',
      chapter: String(modules.length * 4),
      duration: '12 Weeks',
      methods: `${activeTrack} [Engine Hub Bridge]`,
      materials: 'Digital Slides, Video Modules, IntelliCoach Book & Practice Drills',
      fee: '$249',
      students: '0',
      category: activeCategory,
      subCategory: activeTrack,
      libraryType: 'AI',
      deliveryFormats: activeFormats,
      campMode: activeFormats.includes('CAMPS_SPORTS') ? campMode : 'Online',
      campVenue: campMode === 'Offline' ? 'ILA Sports Complex & Arena' : undefined,
      secureAccessCode: accessCode,
      secureAccessLink: secureLink,
      engineHubSyncStatus: 'Synced',
      engineHubUrl: engineUrl.trim(),
      testApprovalStatus: 'Approved',
      courseStructure: structuredText
    };

    const existing = getGlobalCourses();
    const updated = [newCourse, ...existing];
    setGlobalCourses(updated);

    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 4000);

    if (onNavigateToLibrary) {
      setTimeout(() => onNavigateToLibrary(newCourse.id), 1200);
    }
  };

  const fullEngineUrl = constructFullEngineUrl();

  return (
    <div className="w-full flex flex-col gap-4 p-3 md:p-6 bg-slate-50 min-h-full font-sans animate-in fade-in">
      
      {/* Toast Notification */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs">Course Pushed & Published to Library!</div>
            <div className="text-[10px] text-slate-400">Propagated across all 5 delivery paths with unique secure access link.</div>
          </div>
        </div>
      )}

      {/* Header Banner & Bridge Control Hub */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
              <Globe className="w-3 h-3" /> External Engine Hub Space
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Bridge Connected via URL
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1.5">Course Creator Engine Hub Workspace</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interconnected separate application workspace. Generates structured curriculum and pushes directly into ILA Library.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.open(fullEngineUrl, '_blank', 'noopener,noreferrer')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Open external Engine Hub URL directly in a full browser tab"
          >
            <ArrowUpRight className="w-4 h-4 text-slate-600" />
            <span>Open External Tab</span>
          </button>

          <button
            onClick={handlePushToLibrary}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-200" />
            <span>Push / Save to Library</span>
          </button>

          {onNavigateToLibrary && (
            <button
              onClick={() => onNavigateToLibrary()}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Library</span>
            </button>
          )}
        </div>
      </div>

      {/* PARAMETER PASSING & AUTO-SEARCH BOX (As required by Technical Spec) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 md:p-5 rounded-3xl border border-indigo-900/50 shadow-lg text-white space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-indigo-800/40 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              Automatic Parameter Passing & Query Relay
            </span>
            <h3 className="text-sm font-black text-white">Course Search & Generation Prompt</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <span>Target Track: <strong className="text-white">{activeTrack}</strong></span>
            <span>•</span>
            <span>Category: <strong className="text-white">{activeCategory}</strong></span>
          </div>
        </div>

        {/* Pre-filled Input Box with Instant Regeneration Trigger */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or generate course curriculum in Course Creator Engine Hub..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
            />
          </div>

          <button
            onClick={handleTriggerAIGeneration}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Refining Curriculum...' : 'Generate Curriculum'}</span>
          </button>
        </div>

        {/* Delivery Formats Indicators */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
          <span className="text-slate-400">Target Delivery Paths:</span>
          {activeFormats.map(fmt => (
            <span key={fmt} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-indigo-200 font-bold text-[10px]">
              {fmt === 'SLIDE_AI' ? 'Slide + AI' :
               fmt === 'VIDEO_AI' ? 'Video + AI' :
               fmt === 'INTELLI_COACH' ? 'IntelliCoach AI' :
               fmt === 'ONE_ON_ONE' ? '1-to-1 Coaching' :
               `Camps & Sports (${campMode})`}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-Tabs for Workspace Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('WORKSPACE')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'WORKSPACE'
              ? 'bg-indigo-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Interactive Engine Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('CURRICULUM')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'CURRICULUM'
              ? 'bg-indigo-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Structured Curriculum ({modules.length} Modules)</span>
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'SETTINGS'
              ? 'bg-indigo-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>URL & Bridge Settings</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE ENGINE CANVAS (Dedicated Embedded Workspace / Fallback Simulator) */}
      {activeTab === 'WORKSPACE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Main Embedded Frame or Visual Interactive Simulator */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs px-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] text-slate-300 truncate">
                  {fullEngineUrl}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIframeError(!iframeError)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Toggle Live / Simulator View
                </button>
              </div>
            </div>

            {/* Embedded Live Workspace with Fallback UI */}
            <div className="w-full min-h-[500px] flex flex-col bg-slate-950 text-slate-100 relative">
              {!iframeError ? (
                <div className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-black">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base">Course Creator Studio Engine</h4>
                        <p className="text-xs text-zinc-400">Connected to: {searchQuery}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
                      State Synced
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-indigo-400">Active Curriculum Core</span>
                      <div className="text-lg font-black text-white">{searchQuery}</div>
                      <p className="text-xs text-zinc-400">Structured for CEFR & Enterprise Professional Readiness.</p>
                      <div className="pt-2 flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">4 Modules</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">16 Chapters</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">12 Weeks</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-amber-400">Autonomous AI Tutor Settings</span>
                      <div className="text-sm font-bold text-white">IntelliCoach AI Real-Time Pacing</div>
                      <p className="text-xs text-zinc-400">Dynamic pronunciation acoustic tuning and adaptive comprehension check-points.</p>
                      <div className="pt-2 flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                          Mastery Score: 85%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                          Multimodal Audio/Video
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Modules Preview */}
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-300">Generated Lesson Milestones</span>
                      <span className="text-[11px] text-zinc-500">Ready for push to Library</span>
                    </div>

                    <div className="space-y-2">
                      {modules.map((mod, idx) => (
                        <div key={mod.id} className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-lg bg-indigo-600/20 text-indigo-400 font-black flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-zinc-200 truncate">{mod.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 shrink-0">{mod.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action inside Workspace */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <span className="text-xs text-zinc-400">
                      Auto-saves to local cache and synchronizes via URL API.
                    </span>
                    <button
                      onClick={handlePushToLibrary}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Push Directly to Library
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  src={fullEngineUrl}
                  title="Course Creator External App"
                  className="w-full h-[600px] border-none"
                  onLoad={() => setIframeLoaded(true)}
                />
              )}
            </div>
          </div>

          {/* Right Column: Bridge Telemetry & Quick Parameter Controls */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Bridge Status Card */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bridge Telemetry</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Query Parameter:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">{searchQuery}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Category Relay:</span>
                  <span className="font-bold text-indigo-700">{activeCategory}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Target Track:</span>
                  <span className="font-bold text-slate-900">{activeTrack}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Endpoint:</span>
                  <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">{engineUrl}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handlePushToLibrary}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Push & Propagate to Library
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-3xl border border-indigo-100 shadow-xs space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Publishing Protocols</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Publishing from Engine Hub instantly creates the unique secure enrollment link, registers access tokens, and enables all 5 delivery formats (Slide+AI, Video+AI, IntelliCoach, 1-on-1, and Camps & Sports).
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: STRUCTURED CURRICULUM EDITOR */}
      {activeTab === 'CURRICULUM' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Curriculum Structure & Module Editor</h3>
              <p className="text-xs text-slate-500">Edit or expand curriculum topics before pushing to the Library.</p>
            </div>
            <button
              onClick={handlePushToLibrary}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save to Library
            </button>
          </div>

          <div className="space-y-3">
            {modules.map((mod, idx) => (
              <div key={mod.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input 
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const updated = modules.map(m => m.id === mod.id ? { ...m, title: e.target.value } : m);
                        setModules(updated);
                      }}
                      className="font-black text-slate-900 text-sm bg-transparent border-b border-transparent focus:border-indigo-500 outline-none px-1"
                    />
                  </div>
                  <input 
                    type="text"
                    value={mod.duration}
                    onChange={(e) => {
                      const updated = modules.map(m => m.id === mod.id ? { ...m, duration: e.target.value } : m);
                      setModules(updated);
                    }}
                    className="text-xs font-mono text-slate-500 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-right w-24"
                  />
                </div>

                <div className="space-y-1.5 pl-8 text-xs">
                  <div className="font-bold text-slate-500 text-[11px]">Sub-topics / Lesson Units:</div>
                  {mod.topics.map((top, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <input 
                        type="text"
                        value={top}
                        onChange={(e) => {
                          const newTopics = [...mod.topics];
                          newTopics[tIdx] = e.target.value;
                          const updated = modules.map(m => m.id === mod.id ? { ...m, topics: newTopics } : m);
                          setModules(updated);
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: URL & BRIDGE CONFIGURATION */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 md:p-6 space-y-4 max-w-3xl">
          <div>
            <h3 className="text-base font-black text-slate-900">Engine Hub Interconnection URL Configuration</h3>
            <p className="text-xs text-slate-500">Configure the endpoint of your separate Course Creator application.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Course Creator Engine Base URL</label>
              <input 
                type="url"
                value={engineUrl}
                onChange={(e) => {
                  setEngineUrl(e.target.value);
                  localStorage.setItem('ilas_engine_hub_url', e.target.value.trim());
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEngineUrl('https://enginehub.ila.academy');
                  localStorage.setItem('ilas_engine_hub_url', 'https://enginehub.ila.academy');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
              >
                Production Preset (https://enginehub.ila.academy)
              </button>
              <button
                onClick={() => {
                  setEngineUrl('http://localhost:3000/creator');
                  localStorage.setItem('ilas_engine_hub_url', 'http://localhost:3000/creator');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
              >
                Local Dev Preset (http://localhost:3000/creator)
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 space-y-1">
              <div className="font-black text-xs">How URL Parameter Passing Works:</div>
              <p className="text-[11px] leading-relaxed text-indigo-800">
                When clicking "Create Course & Path" or launching the workspace, query parameters 
                (<code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">courseName</code>, 
                <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">category</code>, 
                <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">track</code>, 
                <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">formats</code>) 
                are automatically appended to the base URL.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default EngineHubWorkspace;

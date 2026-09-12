import React, { useState } from 'react';
import { 
  X, Sparkles, ExternalLink, Globe, Layers, CheckCircle2, 
  ArrowRight, BookOpen, MonitorPlay, Presentation, Users, Trophy, 
  ShieldCheck, HelpCircle, Link as LinkIcon, AlertCircle
} from 'lucide-react';
import { CourseDeliveryFormat, GlobalCourse, setGlobalCourses, getGlobalCourses, generateUniqueCode, generateSecureCourseLink } from '../../lib/db';

interface CreateCourseAndPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchEngineHub: (params: {
    courseName: string;
    category: string;
    targetTrack: string;
    deliveryFormats: CourseDeliveryFormat[];
    campMode?: 'Online' | 'Offline';
    engineHubUrl: string;
  }) => void;
  onSavedToLibrary?: (newCourse: GlobalCourse) => void;
}

export const CreateCourseAndPathModal: React.FC<CreateCourseAndPathModalProps> = ({
  isOpen,
  onClose,
  onLaunchEngineHub,
  onSavedToLibrary
}) => {
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('German Language');
  const [customCategory, setCustomCategory] = useState('');
  const [targetTrack, setTargetTrack] = useState('German Language A1–C2 Standard');
  const [campMode, setCampMode] = useState<'Online' | 'Offline'>('Online');
  const [selectedDeliveryFormats, setSelectedDeliveryFormats] = useState<CourseDeliveryFormat[]>([
    'SLIDE_AI', 'VIDEO_AI', 'INTELLI_COACH', 'ONE_ON_ONE', 'CAMPS_SPORTS'
  ]);
  const [engineHubUrl, setEngineHubUrl] = useState(() => {
    return localStorage.getItem('ilas_engine_hub_url') || 'https://enginehub.ila.academy';
  });
  const [showAdvancedUrl, setShowAdvancedUrl] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleFormat = (fmt: CourseDeliveryFormat) => {
    if (selectedDeliveryFormats.includes(fmt)) {
      if (selectedDeliveryFormats.length === 1) return; // Keep at least one
      setSelectedDeliveryFormats(selectedDeliveryFormats.filter(f => f !== fmt));
    } else {
      setSelectedDeliveryFormats([...selectedDeliveryFormats, fmt]);
    }
  };

  const getEffectiveCategory = () => {
    return category === 'Custom' ? (customCategory.trim() || 'General Curriculum') : category;
  };

  const handleLaunchInWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      setErrorMsg('Please enter a valid Course Name to bridge with the Engine Hub.');
      return;
    }
    setErrorMsg(null);
    localStorage.setItem('ilas_engine_hub_url', engineHubUrl.trim());

    onLaunchEngineHub({
      courseName: courseName.trim(),
      category: getEffectiveCategory(),
      targetTrack: targetTrack.trim(),
      deliveryFormats: selectedDeliveryFormats,
      campMode: selectedDeliveryFormats.includes('CAMPS_SPORTS') ? campMode : undefined,
      engineHubUrl: engineHubUrl.trim()
    });
    onClose();
  };

  const handleOpenExternalWindow = () => {
    if (!courseName.trim()) {
      setErrorMsg('Please enter a Course Name first.');
      return;
    }
    localStorage.setItem('ilas_engine_hub_url', engineHubUrl.trim());
    const finalCat = getEffectiveCategory();
    const returnUrl = typeof window !== 'undefined' ? window.location.href : 'https://ilas.global/#master-hub';
    const params = new URLSearchParams({
      courseName: courseName.trim(),
      category: finalCat,
      track: targetTrack.trim(),
      formats: selectedDeliveryFormats.join(','),
      campMode: campMode,
      returnUrl: returnUrl,
      source: 'ila-academy-admin'
    });

    const fullUrl = `${engineHubUrl.trim()}${engineHubUrl.includes('?') ? '&' : '?'}${params.toString()}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirectSaveToLibrary = () => {
    if (!courseName.trim()) {
      setErrorMsg('Please enter a Course Name.');
      return;
    }

    const courseId = `course-${Math.random().toString(36).substring(2, 9)}`;
    const accessCode = generateUniqueCode('SEC', courseName);
    const secureLink = generateSecureCourseLink(courseId, accessCode);
    const finalCat = getEffectiveCategory();

    const newCourse: GlobalCourse = {
      id: courseId,
      name: courseName.trim(),
      top_title: finalCat,
      subtitle: `${targetTrack} • Multi-Path Adaptive Curriculum`,
      show_in_sub_nav: true,
      displayPosition: 1,
      viewType: 'Main View',
      staff: 'AI Academy Lead + Senior Faculty',
      chapter: '16',
      duration: '12 Weeks',
      methods: `${targetTrack} [AI + Interactive Multimodal Studio]`,
      materials: 'Digital Slides, Video Modules, IntelliCoach Book & Practice Drills',
      fee: '$249',
      students: '0',
      category: finalCat,
      subCategory: targetTrack,
      libraryType: 'AI',
      deliveryFormats: selectedDeliveryFormats,
      campMode: selectedDeliveryFormats.includes('CAMPS_SPORTS') ? campMode : 'Online',
      campVenue: campMode === 'Offline' ? 'ILA Sports Complex & Arena' : undefined,
      secureAccessCode: accessCode,
      secureAccessLink: secureLink,
      engineHubSyncStatus: 'Synced',
      engineHubUrl: engineHubUrl.trim(),
      testApprovalStatus: 'Approved',
      courseStructure: `Module 1: Foundational Theory & Audio-Visual Immersion\nModule 2: Core Syntax, Grammar & Practice Drills\nModule 3: Situational Dialogues & AI Speech Tuning\nModule 4: Milestone Assessment & Capstone Defense`
    };

    const existing = getGlobalCourses();
    const updated = [newCourse, ...existing];
    setGlobalCourses(updated);

    if (onSavedToLibrary) {
      onSavedToLibrary(newCourse);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Engine Hub Bridge
                </span>
                <span className="text-[10px] text-slate-300">Phase A Unified Creator</span>
              </div>
              <h3 className="text-lg font-black tracking-tight">Create Course & Path</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleLaunchInWorkspace} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Course Name */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 text-xs flex items-center justify-between">
              <span>Course Name / Title <span className="text-rose-500">*</span></span>
              <span className="text-[11px] font-medium text-slate-400">Pre-fills search in Course Creator Engine Hub</span>
            </label>
            <input 
              type="text"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., German Language B2 Clinical Fast-Track, SAP S/4HANA Finance, Youth Athletics Camp"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Category & Target Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Course Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-200 outline-none"
              >
                <option value="German Language">German Language (CEFR A1–C2)</option>
                <option value="English Proficiency">English Proficiency (IELTS / PTE)</option>
                <option value="Technology & Software">Technology & Cloud Software</option>
                <option value="Healthcare & Nursing">Healthcare & Clinical Practice</option>
                <option value="Business & Management">Business & Executive Management</option>
                <option value="Camps & Sports">Camps & Athletic Training</option>
                <option value="Study Abroad Pathway">Study Abroad University Pathway</option>
                <option value="Custom">Custom Category...</option>
              </select>

              {category === 'Custom' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="w-full mt-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Target Track / Pathway</label>
              <input 
                type="text"
                value={targetTrack}
                onChange={(e) => setTargetTrack(e.target.value)}
                placeholder="e.g., A1–C2 Certified Standard, SAP Consultant Track"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </div>

          {/* Delivery Formats Selector (All 5 formats specified in requirements) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 text-xs">
                Delivery Formats & Student Pathways ({selectedDeliveryFormats.length} Active)
              </label>
              <span className="text-[10px] text-slate-500">Auto-propagates to all selected modes on publish</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              
              {/* 1. Slide + AI */}
              <button
                type="button"
                onClick={() => toggleFormat('SLIDE_AI')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selectedDeliveryFormats.includes('SLIDE_AI')
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500/30'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Presentation className="w-4 h-4 text-indigo-600" />
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedDeliveryFormats.includes('SLIDE_AI') ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>✓</span>
                </div>
                <div>
                  <div className="font-black text-[11px]">Slide + AI</div>
                  <div className="text-[9px] text-slate-500">Slides, Book ref, Index (Chat sidebar hidden)</div>
                </div>
              </button>

              {/* 2. Video + AI */}
              <button
                type="button"
                onClick={() => toggleFormat('VIDEO_AI')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selectedDeliveryFormats.includes('VIDEO_AI')
                    ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-1 ring-purple-500/30'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <MonitorPlay className="w-4 h-4 text-purple-600" />
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedDeliveryFormats.includes('VIDEO_AI') ? 'bg-purple-600 text-white' : 'bg-slate-200'}`}>✓</span>
                </div>
                <div>
                  <div className="font-black text-[11px]">Video + AI</div>
                  <div className="text-[9px] text-slate-500">Video screen, study book & index</div>
                </div>
              </button>

              {/* 3. IntelliCoach */}
              <button
                type="button"
                onClick={() => toggleFormat('INTELLI_COACH')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selectedDeliveryFormats.includes('INTELLI_COACH')
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-500/30'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedDeliveryFormats.includes('INTELLI_COACH') ? 'bg-amber-600 text-white' : 'bg-slate-200'}`}>✓</span>
                </div>
                <div>
                  <div className="font-black text-[11px]">IntelliCoach AI</div>
                  <div className="text-[9px] text-slate-500">Interactive study book & AI chat</div>
                </div>
              </button>

              {/* 4. 1-to-1 Coaching */}
              <button
                type="button"
                onClick={() => toggleFormat('ONE_ON_ONE')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selectedDeliveryFormats.includes('ONE_ON_ONE')
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedDeliveryFormats.includes('ONE_ON_ONE') ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>✓</span>
                </div>
                <div>
                  <div className="font-black text-[11px]">1-to-1 Coaching</div>
                  <div className="text-[9px] text-slate-500">Private instructor live video stream</div>
                </div>
              </button>

              {/* 5. Camps & Sports */}
              <button
                type="button"
                onClick={() => toggleFormat('CAMPS_SPORTS')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  selectedDeliveryFormats.includes('CAMPS_SPORTS')
                    ? 'border-rose-600 bg-rose-50/70 text-rose-950 ring-1 ring-rose-500/30'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Trophy className="w-4 h-4 text-rose-600" />
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedDeliveryFormats.includes('CAMPS_SPORTS') ? 'bg-rose-600 text-white' : 'bg-slate-200'}`}>✓</span>
                </div>
                <div>
                  <div className="font-black text-[11px]">Camps & Sports</div>
                  <div className="text-[9px] text-slate-500">Online Drills / Offline Venue Classes</div>
                </div>
              </button>

              {/* Camp Mode Selection when active */}
              {selectedDeliveryFormats.includes('CAMPS_SPORTS') && (
                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between gap-1">
                  <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Camp Mode:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCampMode('Online')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${campMode === 'Online' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 border'}`}
                    >
                      Online
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampMode('Offline')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold ${campMode === 'Offline' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 border'}`}
                    >
                      Offline Venue
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Engine Hub External App Interconnection Space / Settings */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-slate-800">Engine Hub App Interconnection URL</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedUrl(!showAdvancedUrl)}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                {showAdvancedUrl ? 'Hide URL Config' : 'Configure URL'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={engineHubUrl}
                onChange={(e) => setEngineHubUrl(e.target.value)}
                placeholder="https://enginehub.ila.academy"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono text-[11px] text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={handleOpenExternalWindow}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                title="Open in new window directly"
              >
                <ExternalLink className="w-3 h-3" /> External
              </button>
            </div>

            {showAdvancedUrl && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEngineHubUrl('https://enginehub.ila.academy')}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                >
                  Preset: Production Cloud
                </button>
                <button
                  type="button"
                  onClick={() => setEngineHubUrl('http://localhost:3000/creator')}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                >
                  Preset: Localhost:3000
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons: 3 Options (Workspace, External, or Direct Publish) */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch Engine Hub Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleDirectSaveToLibrary}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Save & Push to Library</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
export default CreateCourseAndPathModal;

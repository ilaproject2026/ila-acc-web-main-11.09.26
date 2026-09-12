import { useState, useEffect } from 'react';
import { 
  X, Type, Check, RotateCcw, Sliders, 
  ZoomIn, ZoomOut, Sparkles, BookOpen, 
  Eye, CheckCircle2, Lock, Trash2, Plus, 
  ShieldCheck, AlertCircle, Bookmark, Palette, 
  ChevronRight, RefreshCw, Layers, Sun, Moon,
  Compass, Laptop, Monitor, FileText, CheckSquare
} from 'lucide-react';
import { 
  AVAILABLE_FONTS, 
  FONT_PRESETS, 
  COLOR_THEMES,
  ColorThemeMode,
  SYSTEM_DEFAULT_THEME,
  DEFAULT_FONT_SETTINGS, 
  FontSettings, 
  ThemeProfile
} from '../../../lib/fontManager';
import { useThemeTypography } from '../../../context/ThemeTypographyContext';

interface FontSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FontSettingsModal({ isOpen, onClose }: FontSettingsModalProps) {
  const {
    settings,
    profiles,
    activeProfile,
    activeThemeId,
    isSettingsModified,
    setFontFamily,
    setFontSizeScale,
    setFontWeightMode,
    setLetterSpacing,
    setLineHeightScale,
    setColorTheme,
    saveNewProfile,
    updateActiveProfile,
    deleteProfile,
    activateProfile,
    resetDefault,
    applyPreset
  } = useThemeTypography();

  // Active section tab in customizer
  const [activeSection, setActiveSection] = useState<'typography' | 'themes' | 'presets' | 'profiles'>('typography');

  // New Theme Save Dialog State
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Preview tab
  const [previewTab, setPreviewTab] = useState<'intake_card' | 'data_table' | 'text_sample'>('intake_card');

  useEffect(() => {
    if (isOpen) {
      setShowSaveDialog(false);
      setSaveSuccessMsg(null);
    }
  }, [isOpen]);

  const handleInitiateSave = () => {
    const customCount = profiles.filter(p => !p.isSystemDefault).length;
    setNewThemeName(`Custom Theme ${customCount + 1}`);
    setShowSaveDialog(true);
  };

  const handleConfirmSaveCustomTheme = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const created = saveNewProfile(newThemeName);
    setShowSaveDialog(false);
    setSaveSuccessMsg(`Saved as "${created.name}" profile!`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleUpdateActiveTheme = () => {
    if (activeProfile.isSystemDefault) {
      handleInitiateSave();
      return;
    }
    updateActiveProfile();
    setSaveSuccessMsg(`Updated "${activeProfile.name}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleDeleteProfile = (profile: ThemeProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile.isSystemDefault) {
      alert('System Default is locked and cannot be deleted.');
      return;
    }
    if (confirm(`Delete custom theme profile "${profile.name}"?`)) {
      deleteProfile(profile.id);
      setSaveSuccessMsg(`Deleted "${profile.name}".`);
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    }
  };

  const handleResetToDefault = () => {
    resetDefault();
    setSaveSuccessMsg('↺ Reset to Protected System Default (Standard Light)');
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  if (!isOpen) return null;

  const activeFont = AVAILABLE_FONTS.find(f => f.id === settings.fontFamily) || AVAILABLE_FONTS[0];

  // =========================================================
  // DYNAMIC THEME-MATCHED HIGHLIGHT ENGINE
  // Accurately themes active borders, glow rings, pills & badges
  // according to the user's currently active ColorThemeMode
  // =========================================================
  const getThemeHighlight = (colorTheme: ColorThemeMode = 'standard-light') => {
    switch (colorTheme) {
      case 'dark':
        return {
          activeCard: 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/40 text-white shadow-md shadow-indigo-950/40',
          activePill: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs',
          badge: 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/80',
          accentText: 'text-indigo-400',
          accentBg: 'bg-indigo-600',
          accentHover: 'hover:bg-indigo-500',
          ring: 'ring-indigo-500/30',
          activeBorder: 'border-indigo-500',
          checkBg: 'bg-indigo-600 text-white',
          sliderAccent: 'accent-indigo-500',
          subtleBg: 'bg-slate-900/90',
          tabActive: 'bg-slate-900 text-indigo-400 font-black shadow-xs ring-1 ring-slate-700',
          previewBg: 'bg-slate-900 border-slate-700 text-slate-100',
          previewCard: 'bg-slate-800/90 border-slate-700 text-slate-200',
          previewTag: 'bg-indigo-950 text-indigo-300 border-indigo-800',
          previewSub: 'text-slate-400',
          previewTextCard: 'bg-slate-800/80 border-slate-700 text-slate-300'
        };
      case 'warm-paper':
        return {
          activeCard: 'bg-[#fefce8] border-amber-600 ring-2 ring-amber-600/35 text-amber-950 shadow-md shadow-amber-900/10',
          activePill: 'bg-amber-700 hover:bg-amber-600 text-white shadow-xs',
          badge: 'bg-amber-100 text-amber-900 border border-amber-300',
          accentText: 'text-amber-800',
          accentBg: 'bg-amber-700',
          accentHover: 'hover:bg-amber-600',
          ring: 'ring-amber-600/30',
          activeBorder: 'border-amber-600',
          checkBg: 'bg-amber-700 text-white',
          sliderAccent: 'accent-amber-700',
          subtleBg: 'bg-[#fefce8]/70',
          tabActive: 'bg-[#fefce8] text-amber-900 font-black shadow-xs ring-1 ring-amber-300',
          previewBg: 'bg-[#fbf9f5] border-[#e7e0d4] text-[#292524]',
          previewCard: 'bg-white border-[#e7e0d4] text-[#57534e]',
          previewTag: 'bg-amber-100 text-amber-900 border-amber-300',
          previewSub: 'text-amber-800/70',
          previewTextCard: 'bg-[#fefce8]/60 border-amber-200/80 text-amber-950'
        };
      case 'high-contrast':
        return {
          activeCard: 'bg-black text-white border-2 border-black ring-2 ring-black shadow-md',
          activePill: 'bg-black text-white shadow-xs',
          badge: 'bg-black text-white border border-black',
          accentText: 'text-black font-black',
          accentBg: 'bg-black',
          accentHover: 'hover:bg-neutral-800',
          ring: 'ring-black/40',
          activeBorder: 'border-black',
          checkBg: 'bg-black text-white border border-white',
          sliderAccent: 'accent-black',
          subtleBg: 'bg-neutral-100',
          tabActive: 'bg-black text-white font-black shadow-xs',
          previewBg: 'bg-white border-2 border-black text-black',
          previewCard: 'bg-white border-2 border-black text-black',
          previewTag: 'bg-black text-white border-black',
          previewSub: 'text-black',
          previewTextCard: 'bg-white border-2 border-black text-black'
        };
      case 'nordic-slate':
        return {
          activeCard: 'bg-[#e2e8f0]/85 border-slate-700 ring-2 ring-slate-700/35 text-slate-950 shadow-md',
          activePill: 'bg-[#102a43] hover:bg-[#1a3d5e] text-white shadow-xs',
          badge: 'bg-slate-200 text-slate-900 border border-slate-400',
          accentText: 'text-[#102a43]',
          accentBg: 'bg-[#102a43]',
          accentHover: 'hover:bg-[#1f4a70]',
          ring: 'ring-slate-700/30',
          activeBorder: 'border-slate-700',
          checkBg: 'bg-[#102a43] text-white',
          sliderAccent: 'accent-slate-700',
          subtleBg: 'bg-[#e2e8f0]/60',
          tabActive: 'bg-white text-[#102a43] font-black shadow-xs ring-1 ring-slate-400',
          previewBg: 'bg-[#f0f4f8] border-[#d9e2ec] text-[#102a43]',
          previewCard: 'bg-white border-[#d9e2ec] text-[#334e68]',
          previewTag: 'bg-slate-200 text-slate-900 border-slate-300',
          previewSub: 'text-slate-500',
          previewTextCard: 'bg-slate-100/70 border-slate-200 text-slate-800'
        };
      case 'standard-light':
      default:
        return {
          activeCard: 'bg-brand-50/90 border-brand-600 ring-2 ring-brand-600/30 text-slate-950 shadow-md shadow-brand-600/10',
          activePill: 'bg-brand-600 hover:bg-brand-500 text-white shadow-xs',
          badge: 'bg-brand-100 text-brand-800 border border-brand-200',
          accentText: 'text-brand-700',
          accentBg: 'bg-brand-600',
          accentHover: 'hover:bg-brand-500',
          ring: 'ring-brand-600/30',
          activeBorder: 'border-brand-600',
          checkBg: 'bg-brand-600 text-white',
          sliderAccent: 'accent-brand-600',
          subtleBg: 'bg-brand-50/50',
          tabActive: 'bg-white text-brand-700 font-black shadow-xs ring-1 ring-slate-200',
          previewBg: 'bg-white border-slate-200 text-slate-900',
          previewCard: 'bg-slate-50/90 border-slate-200 text-slate-800',
          previewTag: 'bg-brand-50 text-brand-700 border-brand-200',
          previewSub: 'text-slate-500',
          previewTextCard: 'bg-brand-50/40 border-brand-100/80 text-brand-950'
        };
    }
  };

  const th = getThemeHighlight(settings.colorTheme);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300 font-bold shadow-inner">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">Global Theme & Font Customizer</h3>
                <span className="text-[10px] uppercase font-mono font-bold bg-brand-500/20 text-brand-300 px-2.5 py-0.5 rounded-full border border-brand-400/30">
                  Universal Cross-Module Engine
                </span>
                {isSettingsModified && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Overrides Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time universal typography and themes synchronized across Front Office, Course Creator, & Hubs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccessMsg && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-400/30 animate-in fade-in flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {saveSuccessMsg}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION SEGMENTED BAR WITH CURRENT THEME HIGHLIGHT */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveSection('typography')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'typography'
                  ? th.tabActive
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography & Fonts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('themes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'themes'
                  ? th.tabActive
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color Themes</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${th.badge}`}>
                {COLOR_THEMES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('presets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'presets'
                  ? th.tabActive
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Reading Presets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('profiles')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'profiles'
                  ? th.tabActive
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Theme Profiles</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-mono font-bold">
                {profiles.length}
              </span>
            </button>
          </div>

          {/* Current Selection Indicators */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
              <span className="text-slate-400 text-[11px]">Font:</span>
              <span className="font-bold text-slate-800">{activeFont.name}</span>
              <span className={`font-mono font-bold ${th.accentText}`}>({settings.fontSizeScale}%)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
              <span className="text-slate-400 text-[11px]">Theme:</span>
              <span className={`font-bold ${th.accentText}`}>
                {COLOR_THEMES.find(t => t.id === settings.colorTheme)?.name || 'Standard Light'}
              </span>
            </div>
          </div>
        </div>

        {/* MODAL MAIN CONTENT (2-COLUMN BALANCED WORKSPACE) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* LEFT COLUMN: ACTIVE CONTROL SECTION (7 cols) */}
          <div className="lg:col-span-7 space-y-5 overflow-y-auto pr-1">

            {/* SECTION 1: TYPOGRAPHY & FONTS */}
            {activeSection === 'typography' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Font Family Selection */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <BookOpen className={`w-4 h-4 ${th.accentText}`} />
                      Select Font Family
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Click to instantly preview & apply</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AVAILABLE_FONTS.map((font) => {
                      const isSelected = settings.fontFamily === font.id;
                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => setFontFamily(font.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                            isSelected
                              ? th.activeCard
                              : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-bold tracking-tight text-slate-900" style={{ fontFamily: font.cssValue }}>
                                {font.name}
                              </span>
                              {isSelected ? (
                                <span className={`w-5 h-5 rounded-full ${th.checkBg} flex items-center justify-center text-xs shadow-xs font-bold`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100">
                                  {font.id === 'Inter' ? 'Default' : font.category.split(' ')[0]}
                                </span>
                              )}
                            </div>
                            <div className="text-base text-slate-900 font-medium mt-1 tracking-wide" style={{ fontFamily: font.cssValue }}>
                              Ag 123
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-sans">
                            {font.recommendedFor}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Size Scaling */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sliders className={`w-3.5 h-3.5 ${th.accentText}`} /> Text Size Scaling (Pure Typography)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full ${th.activePill}`}>
                        {settings.fontSizeScale}%
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({Math.round((settings.fontSizeScale / 100) * 16)}px base)
                      </span>
                    </div>
                  </div>

                  {/* Slider with + / - buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFontSizeScale(Math.max(85, settings.fontSizeScale - 2))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Decrease font scale"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="85"
                      max="125"
                      step="1"
                      value={settings.fontSizeScale}
                      onChange={(e) => setFontSizeScale(parseInt(e.target.value))}
                      className={`flex-1 ${th.sliderAccent} cursor-pointer h-2 bg-slate-200 rounded-lg`}
                    />
                    <button
                      type="button"
                      onClick={() => setFontSizeScale(Math.min(125, settings.fontSizeScale + 2))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Increase font scale"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Scale Steps */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                    {[
                      { label: '90% Compact', value: 90 },
                      { label: '95% Dense', value: 95 },
                      { label: '100% Standard', value: 100 },
                      { label: '105% Comfort', value: 105 },
                      { label: '110% Large', value: 110 },
                      { label: '115% XL', value: 115 }
                    ].map((step) => (
                      <button
                        key={step.value}
                        type="button"
                        onClick={() => setFontSizeScale(step.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          settings.fontSizeScale === step.value
                            ? th.activePill
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight & Contrast */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${th.accentText}`} /> Font Weight & Stroke Contrast
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'light', label: 'Light (300)', desc: 'Crisp & Refined' },
                      { id: 'normal', label: 'Regular (400)', desc: 'Standard Default' },
                      { id: 'medium', label: 'Medium (500)', desc: 'High Clarity' },
                      { id: 'bold', label: 'SemiBold (600)', desc: 'Strong Contrast' }
                    ].map((w) => {
                      const isSelected = settings.fontWeightMode === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setFontWeightMode(w.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? `${th.accentBg} ${th.activeBorder} text-white shadow-xs font-bold`
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xs font-bold">{w.label}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {w.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Spacing & Line Height */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-600">Letter Spacing</label>
                    <div className="flex gap-1.5">
                      {(['tight', 'normal', 'wide'] as const).map((space) => (
                        <button
                          key={space}
                          type="button"
                          onClick={() => setLetterSpacing(space)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                            settings.letterSpacing === space
                              ? th.activePill
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {space}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-600">Line Height Spacing</label>
                    <div className="flex gap-1.5">
                      {(['compact', 'comfortable', 'relaxed'] as const).map((lh) => (
                        <button
                          key={lh}
                          type="button"
                          onClick={() => setLineHeightScale(lh)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                            settings.lineHeightScale === lh
                              ? th.activePill
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {lh}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: COLOR THEMES */}
            {activeSection === 'themes' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Universal System Color Themes</h4>
                    <p className="text-xs text-slate-500">Propagates automatically to all cards, tables, and buttons.</p>
                  </div>
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${th.badge}`}>
                    Active: {COLOR_THEMES.find(t => t.id === settings.colorTheme)?.name || 'Standard Light'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COLOR_THEMES.map((theme) => {
                    const isSelected = (settings.colorTheme || 'standard-light') === theme.id;
                    const itemHighlight = getThemeHighlight(theme.id);
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setColorTheme(theme.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                          isSelected
                            ? itemHighlight.activeCard
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black">{theme.name}</span>
                            {isSelected ? (
                              <span className={`w-5 h-5 rounded-full ${itemHighlight.checkBg} flex items-center justify-center text-xs shadow-xs font-bold`}>
                                ✓
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">Palette</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {theme.description}
                          </p>
                        </div>

                        {/* Theme Visual Preview Swatch Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className={`h-3.5 w-28 rounded-full border shadow-2xs ${theme.badgeClass}`}></div>
                          <span className={`text-[10px] font-bold ${itemHighlight.accentText}`}>
                            {isSelected ? '● Active Applied' : 'Apply Theme →'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: READING PRESETS */}
            {activeSection === 'presets' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Curated Reading & Workflow Presets</h4>
                    <p className="text-xs text-slate-500">1-click optimized combinations for prolonged work and fast scanning.</p>
                  </div>
                  <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Apply
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FONT_PRESETS.map((preset) => {
                    const isActive = 
                      settings.fontFamily === preset.settings.fontFamily &&
                      settings.fontSizeScale === preset.settings.fontSizeScale &&
                      settings.fontWeightMode === preset.settings.fontWeightMode &&
                      settings.colorTheme === preset.settings.colorTheme;
                    
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyPreset(preset.settings)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isActive 
                            ? th.activeCard
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">{preset.name}</span>
                            {isActive ? (
                              <span className={`w-5 h-5 rounded-full ${th.checkBg} flex items-center justify-center text-xs font-bold`}>
                                ✓
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">Preset</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            {preset.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">{preset.settings.fontFamily} · {preset.settings.fontSizeScale}%</span>
                          <span className={`font-bold ${isActive ? th.accentText : 'text-slate-400'}`}>
                            {isActive ? '● Current Active' : 'Apply Preset →'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 4: THEME PROFILES */}
            {activeSection === 'profiles' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Custom Theme Profiles</h4>
                    <p className="text-xs text-slate-500">Save, switch, and manage custom typography & color configurations.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleInitiateSave}
                    className={`px-3.5 py-1.5 rounded-xl ${th.accentBg} ${th.accentHover} text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Save Current as New Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profiles.map((profile) => {
                    const isActive = activeThemeId === profile.id;
                    const profileTheme = getThemeHighlight(profile.settings.colorTheme);
                    return (
                      <div
                        key={profile.id}
                        onClick={() => activateProfile(profile.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                          isActive
                            ? th.activeCard
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {profile.isSystemDefault ? (
                                <div className="p-1.5 rounded-xl bg-amber-100 text-amber-800" title="Protected System Base Theme">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className={`p-1.5 rounded-xl ${th.badge}`}>
                                  <Bookmark className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div>
                                <span className="text-xs sm:text-sm font-black text-slate-900 block truncate">
                                  {profile.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  {profile.createdAt}
                                </span>
                              </div>
                            </div>

                            {profile.isSystemDefault ? (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                                Locked Default
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteProfile(profile, e)}
                                className="text-slate-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                                title={`Delete ${profile.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="mt-3 text-xs text-slate-500 font-sans space-y-1">
                            <div className="flex justify-between">
                              <span>Font:</span>
                              <strong className="text-slate-800">{profile.settings.fontFamily}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Scale & Weight:</span>
                              <strong className="text-slate-800">{profile.settings.fontSizeScale}% · {profile.settings.fontWeightMode}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Theme:</span>
                              <strong className="text-slate-800 uppercase">{profile.settings.colorTheme || 'standard-light'}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          {isActive ? (
                            <span className={`font-black flex items-center gap-1 ${th.accentText}`}>
                              <Check className="w-3.5 h-3.5" /> Active Profile
                            </span>
                          ) : (
                            <span className={`text-slate-400 group-hover:${th.accentText} font-bold`}>
                              Click to Activate →
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: PERSISTENT LIVE UI PREVIEW ACCURATELY THEMING WITH ACTIVE COLOR PALETTE (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200/90">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye className={`w-4 h-4 ${th.accentText}`} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Real-Time UI Preview
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewTab('intake_card')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    previewTab === 'intake_card' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Intake Card
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('data_table')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    previewTab === 'data_table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Data Table
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('text_sample')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    previewTab === 'text_sample' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Typography
                </button>
              </div>
            </div>

            {/* Preview Card Canvas dynamically adopting the chosen colorTheme */}
            <div 
              className={`flex-1 min-h-[360px] p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-300 ${th.previewBg}`}
              style={{ fontFamily: activeFont.cssValue }}
            >
              {previewTab === 'intake_card' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${th.previewTag}`}>
                      Intake Lead #ILA-904
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Case
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black leading-tight">
                      German Language B1 & Fast-Track Ausbildung
                    </h4>
                    <p className={`text-xs font-medium mt-1 ${th.previewSub}`}>
                      Enrolled: Academic Counseling & Library Sync
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${th.previewCard}`}>
                    <div className="flex justify-between">
                      <span className="opacity-70">Curriculum Lead:</span>
                      <span className="font-bold">Sarah Jenkins (Education HOD)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Classroom Delivery:</span>
                      <span className="font-bold">Hybrid Studio + Onsite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Theme Propagation:</span>
                      <span className={`font-bold ${th.accentText}`}>Live Synced</span>
                    </div>
                  </div>

                  <div className={`text-xs leading-relaxed p-3 rounded-xl border ${th.previewTextCard}`}>
                    "All course blueprints, video lecture tracks, and student registration forms adapt to selected font sizing, weight, and theme colors smoothly."
                  </div>
                </div>
              )}

              {previewTab === 'data_table' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold">Live Result Output Table:</div>
                  <div className={`rounded-xl border overflow-hidden shadow-2xs ${th.previewCard}`}>
                    <div className="px-3 py-2 border-b flex justify-between text-[10px] font-black uppercase opacity-70">
                      <span>Curriculum Track</span>
                      <span>Delivery</span>
                      <span>Tuition</span>
                    </div>
                    <div className="divide-y divide-slate-100/30">
                      <div className="px-3 py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold">German Ausbildung A2</div>
                          <div className={`text-[10px] ${th.previewSub}`}>Library & Classroom Hub</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Live Studio
                        </span>
                        <span className="font-mono font-bold">€950</span>
                      </div>
                      <div className="px-3 py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold">Study Abroad Master Track</div>
                          <div className={`text-[10px] ${th.previewSub}`}>Services & Batches Linked</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Enrolled
                        </span>
                        <span className="font-mono font-bold">€1,450</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'text_sample' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-black">
                    Universal Typography Specimen
                  </h3>
                  <p className={`text-xs leading-relaxed ${th.previewSub}`}>
                    ABCDEFGHIJKLM NOPQRSTUVWXYZ<br />
                    abcdefghijklm nopqrstuvwxyz<br />
                    0123456789 (!@#$%^&*.,?)
                  </p>
                  <div className="font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-xl space-y-1 shadow-inner">
                    <div>Font: {activeFont.name} ({activeFont.category})</div>
                    <div>Scale: {settings.fontSizeScale}% | Weight: {settings.fontWeightMode}</div>
                    <div>Theme: {settings.colorTheme || 'standard-light'}</div>
                  </div>
                </div>
              )}

              {/* Preview Footer Metrics */}
              <div className="pt-3 mt-3 border-t border-slate-200/40 flex flex-wrap items-center justify-between text-[11px] gap-2">
                <span>Font: <strong className="font-bold">{activeFont.name}</strong></span>
                <span>Scale: <strong className={`font-mono ${th.accentText}`}>{settings.fontSizeScale}%</strong></span>
                <span>Theme: <strong className={`uppercase ${th.accentText}`}>{settings.colorTheme || 'Standard Light'}</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER ACTION BAR THEMED */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Reverts current overrides back to the system-locked Default theme"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset to Default</span>
            </button>

            {!activeProfile.isSystemDefault && isSettingsModified && (
              <button
                type="button"
                onClick={handleUpdateActiveTheme}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${th.badge}`}
              >
                <span>Update "{activeProfile.name}"</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleInitiateSave}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save as New Profile</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-xl ${th.accentBg} ${th.accentHover} text-white text-xs font-black shadow-lg hover:shadow-xl flex items-center gap-2 transition-all cursor-pointer`}
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>

      {/* SAVE NEW THEME PROFILE DIALOG */}
      {showSaveDialog && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowSaveDialog(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-w-md w-full space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl ${th.badge} flex items-center justify-center font-bold`}>
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Save Custom Theme Profile</h4>
                  <p className="text-[11px] text-slate-500">System default will stay protected.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSaveCustomTheme} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Profile Name:</label>
                <input
                  type="text"
                  required
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="e.g. My Workspace Theme, High Contrast..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:${th.activeBorder} focus:ring-2 focus:${th.ring} text-xs font-bold text-slate-900 outline-none`}
                  autoFocus
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Snapshot summary:</div>
                <div className="flex justify-between text-slate-500">
                  <span>Font: <strong>{activeFont.name}</strong></span>
                  <span>Scale: <strong>{settings.fontSizeScale}%</strong></span>
                  <span>Theme: <strong className="uppercase">{settings.colorTheme || 'standard-light'}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-black ${th.accentBg} ${th.accentHover} text-white shadow-md cursor-pointer`}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  X, Type, Check, RotateCcw, Sliders, 
  ZoomIn, ZoomOut, Sparkles, BookOpen, 
  Eye, CheckCircle2, Lock, Trash2, Plus, 
  ShieldCheck, AlertCircle, Bookmark, Palette, 
  ChevronRight, RefreshCw, Layers, Sun, Moon,
  Compass, Laptop
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
    setNewThemeName(`Theme ${customCount + 1}`);
    setShowSaveDialog(true);
  };

  const handleConfirmSaveCustomTheme = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const created = saveNewProfile(newThemeName);
    setShowSaveDialog(false);
    setSaveSuccessMsg(`Saved as "${created.name}" profile!`);
    setTimeout(() => setSaveSuccessMsg(null), 2000);
  };

  const handleUpdateActiveTheme = () => {
    if (activeProfile.isSystemDefault) {
      handleInitiateSave();
      return;
    }
    updateActiveProfile();
    setSaveSuccessMsg(`Updated "${activeProfile.name}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 2000);
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
      setTimeout(() => setSaveSuccessMsg(null), 2000);
    }
  };

  const handleResetToDefault = () => {
    resetDefault();
    setSaveSuccessMsg('↺ Reset to Protected System Default (Standard Light)');
    setTimeout(() => setSaveSuccessMsg(null), 2200);
  };

  if (!isOpen) return null;

  const activeFont = AVAILABLE_FONTS.find(f => f.id === settings.fontFamily) || AVAILABLE_FONTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black tracking-tight text-white">Global Theme & Font Customizer</h3>
                <span className="text-[10px] uppercase font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  Universal Cross-Module Engine
                </span>
                {isSettingsModified && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 animate-pulse">
                    ● Modified from Profile
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Synchronized across all engines: Course Creator, Tie-up Creator, Library, Delivery Path & Front Office.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessMsg && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-400/30 animate-in fade-in">
                {saveSuccessMsg}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* 1. UNIVERSAL COLOR THEME SELECTION BAR */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Color Theme (Universal Across All Modules)
              </label>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Active: <strong className="text-indigo-600">{COLOR_THEMES.find(t => t.id === settings.colorTheme)?.name || 'Standard Light'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = (settings.colorTheme || 'standard-light') === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setColorTheme(theme.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/30 text-indigo-950 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{theme.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {theme.description}
                      </p>
                    </div>
                    <div className={`mt-2 h-2 rounded-full border ${theme.badgeClass}`}></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. THEME PROFILES MANAGER BAR */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Custom Theme Profiles
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  (Protected System Default + Custom Presets)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInitiateSave}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Save as New Theme</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  title="Revert all changes to secure factory Default theme"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>

            {/* Profiles Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {profiles.map((profile) => {
                const isActive = activeThemeId === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => activateProfile(profile.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isActive
                        ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/30 text-indigo-950 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {profile.isSystemDefault ? (
                          <div className="p-1 rounded-lg bg-amber-100 text-amber-700" title="Protected System Base Theme">
                            <Lock className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-lg bg-indigo-100 text-indigo-700">
                            <Bookmark className="w-3 h-3" />
                          </div>
                        )}
                        <span className="text-xs font-black truncate">{profile.name}</span>
                      </div>

                      {/* Default Protected Badge or Delete Button */}
                      {profile.isSystemDefault ? (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Locked
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProfile(profile, e)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title={`Delete ${profile.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-2 font-sans flex items-center justify-between">
                      <span className="truncate">
                        {profile.settings.fontFamily} · {profile.settings.fontSizeScale}%
                      </span>
                      {isActive && (
                        <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. QUICK READING PRESETS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Reading Comfort Presets
              </label>
              <span className="text-[10px] text-slate-400">1-Click presets for prolonged shift comfort</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-indigo-50/90 border-indigo-500 shadow-xs ring-1 ring-indigo-500 text-indigo-900' 
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold truncate flex items-center justify-between">
                        <span>{preset.name}</span>
                        {isActive && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {preset.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. MAIN TYPOGRAPHY & LIVE PREVIEW CONTROLS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: CONTROLS (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* FONT FAMILY SELECTOR */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Select Font Family
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_FONTS.map((font) => {
                    const isSelected = settings.fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setFontFamily(font.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-600/30 text-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                        }`}
                        style={{ fontFamily: font.cssValue }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold tracking-tight">{font.name}</span>
                          {isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{font.id === 'Inter' ? 'Default' : font.id.slice(0, 3)}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-sans">
                          {font.recommendedFor}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TRUE TEXT SIZE SCALING */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Text Size Scaling (Pure Typography — No Zoom)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                      {settings.fontSizeScale}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({Math.round((settings.fontSizeScale / 100) * 16)}px base)
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFontSizeScale(Math.max(85, settings.fontSizeScale - 2))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Decrease size"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="85"
                    max="125"
                    step="1"
                    value={settings.fontSizeScale}
                    onChange={(e) => setFontSizeScale(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFontSizeScale(Math.min(125, settings.fontSizeScale + 2))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Increase size"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick step buttons */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  {[
                    { label: '90% Compact', value: 90 },
                    { label: '95% Condensed', value: 95 },
                    { label: '100% Standard', value: 100 },
                    { label: '105% Comfort', value: 105 },
                    { label: '110% Large', value: 110 },
                    { label: '115% XL', value: 115 }
                  ].map((step) => (
                    <button
                      key={step.value}
                      type="button"
                      onClick={() => setFontSizeScale(step.value)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        settings.fontSizeScale === step.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FONT WEIGHT & CONTRAST */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Font Weight & Visual Clarity
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
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold">{w.label}</div>
                        <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {w.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SPACING & LINE HEIGHT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Letter Spacing</label>
                  <div className="flex gap-1.5">
                    {(['tight', 'normal', 'wide'] as const).map((space) => (
                      <button
                        key={space}
                        type="button"
                        onClick={() => setLetterSpacing(space)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                          settings.letterSpacing === space
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {space}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Line Spacing</label>
                  <div className="flex gap-1.5">
                    {(['compact', 'comfortable', 'relaxed'] as const).map((lh) => (
                      <button
                        key={lh}
                        type="button"
                        onClick={() => setLineHeightScale(lh)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                          settings.lineHeightScale === lh
                            ? 'bg-indigo-600 text-white'
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

            {/* RIGHT COLUMN: REAL-TIME PREVIEW PANEL (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Live UI Preview
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('intake_card')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                      previewTab === 'intake_card' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Intake Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('data_table')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                      previewTab === 'data_table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Result Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('text_sample')}
                    className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                      previewTab === 'text_sample' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Typography
                  </button>
                </div>
              </div>

              {/* Preview Container */}
              <div 
                className="flex-1 min-h-[380px] p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 border-2 border-indigo-200/70 shadow-inner flex flex-col justify-between"
                style={{ fontFamily: activeFont.cssValue }}
              >
                {previewTab === 'intake_card' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                        Course Creator · Intake #TK-904
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Active Curriculum
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        German Language B1 & Fast-Track Ausbildung
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Delivered via Library & Classroom + Delivery Path Sync
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2 shadow-xs">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Curriculum Lead:</span>
                        <span className="font-bold text-slate-800">Sarah Jenkins (Education HOD)</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Active Delivery Path:</span>
                        <span className="font-bold text-slate-800">Hybrid Classroom + Studio</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Theme Synchronization:</span>
                        <span className="font-bold text-indigo-600">Universal Root Propagation</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200">
                      "All course chapters, interactive lecture demo videos, and vocabulary flashcards inherit font sizes and theme colors cleanly."
                    </div>
                  </div>
                )}

                {previewTab === 'data_table' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700">Live Result Output Table Sample:</div>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200 flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Course / Path</span>
                        <span>Mode</span>
                        <span>Fee</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <div className="px-3 py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-slate-900">German Ausbildung A2</div>
                            <div className="text-[10px] text-slate-400">Library & Classroom Studio</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            Live Path
                          </span>
                          <span className="font-mono font-bold text-slate-800">€950</span>
                        </div>
                        <div className="px-3 py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-slate-900">Study Abroad Master's Track</div>
                            <div className="text-[10px] text-slate-400">Services & Batches Linked</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Enrolled
                          </span>
                          <span className="font-mono font-bold text-slate-800">€1,450</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === 'text_sample' && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-slate-900">
                      Universal Engine Typography Preview
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This sample verifies text rendering fidelity across all engines: Course Creator, Tie-up Creator, Library, Delivery Path, and CRM Lead Desks.
                    </p>
                    <div className="font-mono text-xs bg-slate-900 text-emerald-400 p-3 rounded-xl">
                      Theme: {settings.colorTheme || 'standard-light'} | Scale: {settings.fontSizeScale}% | Font: {activeFont.name}
                    </div>
                  </div>
                )}

                {/* Footer preview info */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Font: <strong className="text-slate-800">{activeFont.name}</strong></span>
                  <span>Scale: <strong className="text-indigo-600">{settings.fontSizeScale}%</strong></span>
                  <span>Theme: <strong className="text-slate-800 uppercase">{settings.colorTheme || 'Standard Light'}</strong></span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2 rounded-xl border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Reverts current overrides back to the secure system-locked Default theme"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset to Default (Locked)</span>
            </button>

            {!activeProfile.isSystemDefault && isSettingsModified && (
              <button
                type="button"
                onClick={handleUpdateActiveTheme}
                className="px-3.5 py-2 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Update "{activeProfile.name}"</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInitiateSave}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save as New Theme</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg hover:shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>

      {/* SAVE NEW THEME PROFILE MODAL / DIALOG */}
      {showSaveDialog && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowSaveDialog(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-w-md w-full space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Save Custom Theme Profile</h4>
                  <p className="text-[11px] text-slate-500">Protected system default will remain intact.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSaveCustomTheme} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Theme Profile Name:</label>
                <input
                  type="text"
                  required
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="e.g. Theme 1, Theme 2, High Legibility..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-xs font-bold text-slate-900 outline-none"
                  autoFocus
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Summary of settings to be saved:</div>
                <div className="flex justify-between text-slate-500">
                  <span>Font: <strong>{activeFont.name}</strong></span>
                  <span>Scale: <strong>{settings.fontSizeScale}%</strong></span>
                  <span>Theme: <strong>{settings.colorTheme || 'standard-light'}</strong></span>
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
                  className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer"
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

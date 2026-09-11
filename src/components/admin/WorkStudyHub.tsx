import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Search, Filter, CheckCircle2, 
  Award, GraduationCap, TrendingUp, Users, Clock, 
  Globe2, Sparkles, ArrowRight, ShieldCheck, ChevronRight, 
  Edit3, Trash2, X, Check, DollarSign, Calendar, Flame,
  FileText, Building2, UserCheck, Star, Play, Megaphone,
  Share2, RefreshCw, Send, Layers, HelpCircle, Eye, Tag, Radio
} from 'lucide-react';
import { 
  WorkStudyPackage,
  WorkStudyCandidate,
  WorkStudyProgram,
  getWorkStudyPackages,
  saveWorkStudyPackage,
  deleteWorkStudyPackage,
  resetDefaultWorkStudyPackages,
  promoteJobDescriptionToMarketing,
  getWorkStudyPrograms,
  saveWorkStudyProgram,
  deleteWorkStudyProgram,
  getWorkStudyCandidates,
  updateWorkStudyCandidateStage,
  getHODWorkStudyStats,
  JDPromotionPayload
} from '../../lib/db';
import { HubAutoTriggerView } from './common/HubAutoTriggerView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';

export const WorkStudyHub: React.FC = () => {
  // Hub Main Sub-Navigation: 'packages' (CRUD) | 'hod' | 'promote_jd' | 'auto_trigger' | 'intake_tracking'
  const [hubTab, setHubTab] = useState<'packages' | 'hod' | 'promote_jd' | 'auto_trigger' | 'intake_tracking'>('packages');

  // ================= 1. DYNAMIC PACKAGES (CRUD) STATE =================
  const [packages, setPackages] = useState<WorkStudyPackage[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [packageSearch, setPackageSearch] = useState('');
  
  // Package Modal (Create / Edit)
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<WorkStudyPackage | null>(null);

  // Form fields for package
  const [pkgCategory, setPkgCategory] = useState<WorkStudyPackage['category']>('work-in-india');
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgBadge, setPkgBadge] = useState('Operations');
  const [pkgStipend, setPkgStipend] = useState('₹15,000 - ₹25,000 / mo');
  const [pkgTrainingDuration, setPkgTrainingDuration] = useState('6 Months Initial Training Session');
  const [pkgInternshipDuration, setPkgInternshipDuration] = useState('6 Months Corporate Pilot');
  const [pkgCertification, setPkgCertification] = useState('1-Year Verified Corporate Certificate');
  const [pkgRolesInput, setPkgRolesInput] = useState('');
  const [pkgStreamsInput, setPkgStreamsInput] = useState('');
  const [pkgActionText, setPkgActionText] = useState('Apply Now');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgTerms, setPkgTerms] = useState('');
  const [pkgStatus, setPkgStatus] = useState<WorkStudyPackage['status']>('Active');

  // ================= 2. HOD CONSOLE STATE =================
  const [programs, setPrograms] = useState<WorkStudyProgram[]>([]);
  const [candidates, setCandidates] = useState<WorkStudyCandidate[]>([]);
  const [hodStats, setHodStats] = useState(getHODWorkStudyStats());
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  // ================= 3. PROMOTE JD / MARKETING STUDIO STATE =================
  const [selectedPkgForPromo, setSelectedPkgForPromo] = useState<string>('');
  const [promoChannels, setPromoChannels] = useState<JDPromotionPayload['channels']>([
    'WhatsApp', 'Meta Ads', 'LinkedIn', 'Email Funnel'
  ]);
  const [promoCustomMessage, setPromoCustomMessage] = useState('');
  const [promoTargetRegion, setPromoTargetRegion] = useState('All India & European Placement Channels');
  const [promoResult, setPromoResult] = useState<{ campaignId: string; message: string } | null>(null);

  // Toast feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadAllData = () => {
    setPackages(getWorkStudyPackages());
    setPrograms(getWorkStudyPrograms());
    setCandidates(getWorkStudyCandidates());
    setHodStats(getHODWorkStudyStats());
  };

  useEffect(() => {
    loadAllData();

    const handlePkgsChanged = () => loadAllData();
    const handleCandChanged = () => loadAllData();
    const handleProgsChanged = () => loadAllData();

    window.addEventListener('ilas-work-study-packages-changed', handlePkgsChanged);
    window.addEventListener('ilas-work-study-candidates-changed', handleCandChanged);
    window.addEventListener('ilas-work-study-programs-changed', handleProgsChanged);

    return () => {
      window.removeEventListener('ilas-work-study-packages-changed', handlePkgsChanged);
      window.removeEventListener('ilas-work-study-candidates-changed', handleCandChanged);
      window.removeEventListener('ilas-work-study-programs-changed', handleProgsChanged);
    };
  }, []);

  // Pre-select first package for promotion on load
  useEffect(() => {
    if (packages.length > 0 && !selectedPkgForPromo) {
      setSelectedPkgForPromo(packages[0].id);
    }
  }, [packages, selectedPkgForPromo]);

  // Open Create/Edit Package Modal
  const handleOpenPkgModal = (pkg?: WorkStudyPackage) => {
    if (pkg) {
      setEditingPkg(pkg);
      setPkgCategory(pkg.category);
      setPkgTitle(pkg.title);
      setPkgBadge(pkg.badge || 'Featured');
      setPkgStipend(pkg.stipend);
      setPkgTrainingDuration(pkg.trainingDuration || '6 Months Initial Training Session');
      setPkgInternshipDuration(pkg.internshipDuration || '6 Months Corporate Pilot');
      setPkgCertification(pkg.certification || '1-Year Verified Corporate Certificate');
      setPkgRolesInput(pkg.roles.join('\n'));
      setPkgStreamsInput(pkg.streams.join('\n'));
      setPkgActionText(pkg.actionText || 'Apply Now');
      setPkgDescription(pkg.description);
      setPkgTerms(pkg.termsAndConditions || '');
      setPkgStatus(pkg.status);
    } else {
      setEditingPkg(null);
      setPkgCategory('work-in-india');
      setPkgTitle('');
      setPkgBadge('Operations');
      setPkgStipend('₹15,000 - ₹25,000 / mo');
      setPkgTrainingDuration('6 Months Initial Training Session');
      setPkgInternshipDuration('6 Months Corporate Pilot');
      setPkgCertification('1-Year Verified Corporate Certificate');
      setPkgRolesInput([
        '6 Months Initial Training Session',
        'Stipend: 15k to 25k during training',
        'Post-Training: Real-time onboarding & permanent employment opportunities.',
        'Assigned Domain Accounting & Auditing',
        'Vendor & Corporate Operations'
      ].join('\n'));
      setPkgStreamsInput([
        'Track Alpha - Core Specialization',
        'Track Beta - Advanced Applied Systems'
      ].join('\n'));
      setPkgActionText('Apply Now');
      setPkgDescription('Comprehensive Work & Study track with structured stipend milestones and live corporate certifications.');
      setPkgTerms('Eligibility: Graduate or final-year diploma. Minimum 85% attendance during 6-month training session.');
      setPkgStatus('Active');
    }
    setShowPkgModal(true);
  };

  // Save Package Handler
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle) {
      alert('Please provide a package title.');
      return;
    }

    const categoryLabels: Record<WorkStudyPackage['category'], string> = {
      'work-in-india': 'Work & Study in India',
      'work-in-abroad': 'Work & Study in Abroad',
      'german-projects': 'German Onboarding Projects',
      'reward-study-platform': 'Reward & Study Platform'
    };

    const rolesArray = pkgRolesInput.split('\n').map(r => r.trim()).filter(Boolean);
    const streamsArray = pkgStreamsInput.split('\n').map(s => s.trim()).filter(Boolean);

    const packageToSave: WorkStudyPackage = {
      id: editingPkg ? editingPkg.id : `WSP-PKG-${Date.now().toString().slice(-5)}`,
      category: pkgCategory,
      categoryLabel: categoryLabels[pkgCategory],
      title: pkgTitle,
      badge: pkgBadge,
      stipend: pkgStipend,
      trainingDuration: pkgTrainingDuration,
      internshipDuration: pkgInternshipDuration,
      certification: pkgCertification,
      roles: rolesArray.length > 0 ? rolesArray : [
        '6 Months Initial Training Session',
        'Stipend: 15k to 25k during training',
        'Post-Training: Real-time onboarding & permanent employment opportunities.'
      ],
      streams: streamsArray.length > 0 ? streamsArray : ['General Track'],
      actionText: pkgActionText || 'Apply Now',
      description: pkgDescription,
      termsAndConditions: pkgTerms,
      status: pkgStatus,
      createdAt: editingPkg ? editingPkg.createdAt : new Date().toISOString().split('T')[0]
    };

    saveWorkStudyPackage(packageToSave);
    setShowPkgModal(false);
    setFeedback(`✅ Package "${packageToSave.title}" successfully ${editingPkg ? 'updated' : 'created'}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Delete Package
  const handleDeletePackage = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the package "${title}"?`)) {
      deleteWorkStudyPackage(id);
      setFeedback(`Package "${title}" removed from active inventory.`);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all Work & Study packages to verified default seeds?')) {
      resetDefaultWorkStudyPackages();
      setFeedback('All default Work & Study packages restored.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Promote JD Handler
  const handlePromoteJD = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.id === selectedPkgForPromo);
    if (!pkg) {
      alert('Please select a package to promote.');
      return;
    }
    if (promoChannels.length === 0) {
      alert('Please select at least one marketing channel.');
      return;
    }

    const payload: JDPromotionPayload = {
      packageId: pkg.id,
      jobTitle: pkg.title,
      domainOrCategory: pkg.categoryLabel,
      stipend: pkg.stipend,
      channels: promoChannels,
      customMessage: promoCustomMessage,
      targetRegion: promoTargetRegion
    };

    const res = promoteJobDescriptionToMarketing(payload);
    setPromoResult(res);
    setFeedback(`🚀 Job Description "${pkg.title}" broadcasted directly to ${promoChannels.join(', ')}! Campaign ID: ${res.campaignId}`);
    setTimeout(() => setFeedback(null), 6000);
  };

  // Candidate stage promotion
  const handlePromoteCandidate = (candidateId: string, currentStage: WorkStudyCandidate['stage']) => {
    const stages: WorkStudyCandidate['stage'][] = [
      'Intake Assessment',
      'AI & Skill Training',
      'Active Internship / Pilot',
      'German Sponsor Match',
      'Graduated & Relocated'
    ];

    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const newProgress = Math.min(100, (currentIndex + 2) * 20);
      updateWorkStudyCandidateStage(candidateId, nextStage, newProgress);
      setFeedback(`Candidate promoted to ${nextStage}!`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter(p => {
    const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchesSearch = 
      p.title.toLowerCase().includes(packageSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(packageSearch.toLowerCase()) ||
      p.roles.some(r => r.toLowerCase().includes(packageSearch.toLowerCase())) ||
      p.stipend.toLowerCase().includes(packageSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered candidates
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      cand.email.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      cand.phone.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      cand.programTitle.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      cand.corporateProject.toLowerCase().includes(candidateSearch.toLowerCase());

    const matchesStage = selectedStage === 'All' || cand.stage === selectedStage;
    const matchesDomain = selectedDomain === 'All' || cand.domain === selectedDomain;

    return matchesSearch && matchesStage && matchesDomain;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Work &amp; Study Master Hub
              </span>
              <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                Dynamic Package CRUD • HOD Console • Marketing Studio Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Work and Study Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Create and manage dynamic Work &amp; Study packages across India, Abroad, German Projects, and Reward Platforms. Oversee candidate intake pipelines via the HOD Sub-Console, and trigger instant 1-click Job Description broadcasts to Marketing Studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenPkgModal()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              Create New Package
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs font-bold transition-all cursor-pointer"
              title="Reset Default Seed Packages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. THREE CORE SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setHubTab('packages')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hubTab === 'packages'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Package Management (CRUD)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black">
            {packages.length}
          </span>
        </button>

        <button
          onClick={() => setHubTab('hod')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hubTab === 'hod'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>HOD Console &amp; Candidates</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-black">
            {candidates.length} Candidates
          </span>
        </button>

        <button
          onClick={() => setHubTab('promote_jd')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hubTab === 'promote_jd'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Promote JD (Marketing Studio)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black">
            Broadcast
          </span>
        </button>

        <button
          onClick={() => setHubTab('auto_trigger')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hubTab === 'auto_trigger'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Auto-Trigger (Follow-up)</span>
        </button>

        <button
          onClick={() => setHubTab('intake_tracking')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            hubTab === 'intake_tracking'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-brand-400" />
          <span>Intake Tracking</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: DYNAMIC PACKAGE MANAGEMENT (CRUD) */}
      {/* ========================================================================= */}
      {hubTab === 'packages' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'All', label: 'All Packages' },
                { id: 'work-in-india', label: '🇮🇳 India Corporate' },
                { id: 'work-in-abroad', label: '🌍 Abroad Services' },
                { id: 'german-projects', label: '🇩🇪 German Projects' },
                { id: 'reward-study-platform', label: '🏆 Reward & Earning' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search packages, roles, stipend..."
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <div 
                key={pkg.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {pkg.categoryLabel}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {pkg.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-snug">{pkg.title}</h3>
                    <div className="text-xs font-black text-emerald-600 mt-1">{pkg.stipend}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Sub-features / Roles Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Configured Features &amp; Roles:</div>
                    {pkg.roles.slice(0, 4).map((r, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{r}</span>
                      </div>
                    ))}
                    {pkg.roles.length > 4 && (
                      <div className="text-[11px] font-bold text-slate-400 pl-5">
                        +{pkg.roles.length - 4} more sub-features
                      </div>
                    )}
                  </div>

                  {/* Selectable Streams Preview */}
                  {pkg.streams && pkg.streams.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Selectable Streams ({pkg.streams.length}):</div>
                      <div className="flex flex-wrap gap-1">
                        {pkg.streams.map((st, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {pkg.promotedToMarketing && (
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[10px] font-bold text-amber-800 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Megaphone className="w-3.5 h-3.5 text-amber-600" /> Promoted to Marketing Studio</span>
                      <span>{pkg.marketingCampaignId}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenPkgModal(pkg)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="Edit Package"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPkgForPromo(pkg.id);
                      setHubTab('promote_jd');
                    }}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/60 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Promote JD</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: HOD CONSOLE & CANDIDATES SUB-NAVIGATION */}
      {/* ========================================================================= */}
      {hubTab === 'hod' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Metric Cockpit */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Programs</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{hodStats.activePrograms} / {hodStats.totalPrograms}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">Dual track active</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Candidates</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">{hodStats.totalCandidates}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Enrolled across streams</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Interns / Pilots</span>
              <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">{hodStats.activeInterns}</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">Receiving monthly stipends</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">German Relocation Matched</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{hodStats.germanMatched}</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">Employer sponsorship secured</div>
            </div>
          </div>

          {/* Candidate Table & Filter */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidates by name, email, project..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="All">All Stages</option>
                  <option value="Intake Assessment">Intake Assessment</option>
                  <option value="AI & Skill Training">AI &amp; Skill Training</option>
                  <option value="Active Internship / Pilot">Active Corporate Pilot</option>
                  <option value="German Sponsor Match">German Sponsor Matched</option>
                  <option value="Graduated & Relocated">Graduated &amp; Relocated</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Program &amp; Domain</th>
                    <th className="py-3 px-4">Current Stage</th>
                    <th className="py-3 px-4">Stipend</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredCandidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500">{c.email} • {c.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{c.programTitle}</div>
                        <div className="text-[11px] text-slate-500">{c.corporateProject}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {c.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {c.currentStipend}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${c.progressPct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{c.progressPct}%</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handlePromoteCandidate(c.id, c.stage)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Promote Stage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PROMOTE JD TRIGGER & MARKETING STUDIO INTEGRATION */}
      {/* ========================================================================= */}
      {hubTab === 'promote_jd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Left Config Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full mb-2">
                <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                Marketing Studio &amp; Analytics Sync
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Promote Job Description (JD Broadcast Trigger)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Push newly created or updated Work &amp; Study positions directly into active Meta Ads, LinkedIn campaigns, WhatsApp broadcast funnels, and public intake contact lists.
              </p>
            </div>

            <form onSubmit={handlePromoteJD} className="space-y-4">
              {/* Select Package */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Work &amp; Study Package / JD
                </label>
                <select
                  value={selectedPkgForPromo}
                  onChange={(e) => setSelectedPkgForPromo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                >
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.categoryLabel.toUpperCase()}] {p.title} ({p.stipend})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Marketing Channels */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Target Broadcast Channels (Multi-Select)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['WhatsApp', 'Meta Ads', 'LinkedIn', 'Email Funnel', 'Public Contact Lists'] as JDPromotionPayload['channels'][number][]).map(ch => {
                    const isSelected = promoChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => {
                          if (isSelected) {
                            setPromoChannels(promoChannels.filter(c => c !== ch));
                          } else {
                            setPromoChannels([...promoChannels, ch]);
                          }
                        }}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-slate-900 text-amber-300 border-amber-400/40 shadow-xs' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{ch}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Region */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Geography &amp; Candidate Funnel
                </label>
                <input
                  type="text"
                  value={promoTargetRegion}
                  onChange={(e) => setPromoTargetRegion(e.target.value)}
                  placeholder="e.g. All India & DACH Relocation Channels"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Custom Ad Copy / Pitch Message */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Custom Pitch / Broadcast Copy (Optional)
                </label>
                <textarea
                  rows={3}
                  value={promoCustomMessage}
                  onChange={(e) => setPromoCustomMessage(e.target.value)}
                  placeholder="e.g. Hiring 25 Junior Consultants for German Corporate Dual Training. 6 Months Initial Training + ₹15k–₹25k Monthly Stipend. Apply now!"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              {/* Trigger Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-slate-950 text-slate-950 hover:text-white font-black text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 fill-current text-slate-950" />
                <span>Publish &amp; Broadcast JD to Marketing Studio</span>
              </button>
            </form>
          </div>

          {/* Right Live Broadcast Preview */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Campaign Telemetry</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  Marketing Studio Connected
                </span>
              </div>

              {/* Selected package preview */}
              {(() => {
                const pkg = packages.find(p => p.id === selectedPkgForPromo);
                if (!pkg) return null;
                return (
                  <div className="bg-slate-800/80 rounded-2xl border border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold border-b border-white/10 pb-2">
                      <span>{pkg.categoryLabel}</span>
                      <span>Stipend: {pkg.stipend}</span>
                    </div>

                    <h4 className="font-black text-white text-base leading-snug">{pkg.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {promoCustomMessage || pkg.description}
                    </p>

                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1.5 text-[11px]">
                      <div className="text-slate-400 font-bold uppercase text-[9px]">Verified Package Highlights:</div>
                      {pkg.roles.slice(0, 3).map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-200">
                          <Check className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Channels: <strong className="text-white">{promoChannels.join(', ')}</strong></span>
                      <span className="text-emerald-400 font-bold">100% Ready</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {promoResult && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl space-y-1 animate-in fade-in">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Broadcast Successful!
                </div>
                <div className="text-[11px] text-slate-300">
                  Logged into Marketing Analytics dashboard as Campaign ID: <strong className="text-white font-mono">{promoResult.campaignId}</strong>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: AUTO-TRIGGER FOLLOW-UP */}
      {/* ========================================================================= */}
      {hubTab === 'auto_trigger' && (
        <div className="animate-in fade-in">
          <HubAutoTriggerView 
            departmentName="Work While You Study" 
            defaultEventTypes={[
              { key: 'incomplete_enrollment', label: 'Incomplete Assessment / Drop-off' },
              { key: 'pending_payment', label: 'Pending Stipend Sign-off' },
              { key: 'document_pending', label: 'Missing ID / Student Proof' },
              { key: 'profile_dropoff', label: 'Corporate Pilot Inactive' }
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: INTAKE TRACKING DESK */}
      {/* ========================================================================= */}
      {hubTab === 'intake_tracking' && (
        <div className="animate-in fade-in">
          <HubIntakeTrackingView 
            departmentName="Work While You Study" 
            departmentTitle="Work and Study Hub / Candidate Intake Pipeline"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PACKAGE CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {showPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 max-h-[92vh] overflow-y-auto space-y-5">
            
            <button
              onClick={() => setShowPkgModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Work &amp; Study Dynamic Package Builder
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {editingPkg ? 'Edit Work & Study Package' : 'Create New Work & Study Package'}
              </h3>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Hub Category
                  </label>
                  <select
                    value={pkgCategory}
                    onChange={(e) => setPkgCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="work-in-india">Work &amp; Study in India (Corporate Pilots)</option>
                    <option value="work-in-abroad">Work &amp; Study in Abroad (European Student Tasks)</option>
                    <option value="german-projects">German Onboarding Projects</option>
                    <option value="reward-study-platform">Reward &amp; Earning Platforms</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgBadge}
                    onChange={(e) => setPkgBadge(e.target.value)}
                    placeholder="e.g. Operations, Tech & AI, Global Logistics"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Package / Domain Title
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgTitle}
                    onChange={(e) => setPkgTitle(e.target.value)}
                    placeholder="e.g. Office Admin & Accounts"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Stipend Tier
                  </label>
                  <input
                    type="text"
                    required
                    value={pkgStipend}
                    onChange={(e) => setPkgStipend(e.target.value)}
                    placeholder="e.g. ₹15,000 - ₹25,000 / mo"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Sub-Features / Roles (One per line) */}
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Features &amp; Sub-Roles List (One item per line)
                </label>
                <textarea
                  rows={5}
                  required
                  value={pkgRolesInput}
                  onChange={(e) => setPkgRolesInput(e.target.value)}
                  placeholder="6 Months Initial Training Session&#10;Stipend: 15k to 25k during training&#10;Post-Training: Real-time onboarding & permanent employment opportunities.&#10;AI-Assisted Accounting & Tally Automation&#10;Billing & Financial Auditing"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
                />
                <span className="text-[10px] text-slate-400">
                  Tip: The first 3 lines will be highlighted as the key milestone training parameters on the card.
                </span>
              </div>

              {/* Selectable Streams for Candidate Dropdown (One per line) */}
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Selectable Streams for Frontend Dropdown (One stream per line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={pkgStreamsInput}
                  onChange={(e) => setPkgStreamsInput(e.target.value)}
                  placeholder="General Office Administration&#10;AI-Assisted Accounting & Tally Prime&#10;Billing, Invoicing & GST Auditing"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
                />
              </div>

              {/* Description & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Card Description
                  </label>
                  <textarea
                    rows={2}
                    value={pkgDescription}
                    onChange={(e) => setPkgDescription(e.target.value)}
                    placeholder="Short summary for the card showcase..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Terms &amp; Conditions (Modal Copy)
                  </label>
                  <textarea
                    rows={2}
                    value={pkgTerms}
                    onChange={(e) => setPkgTerms(e.target.value)}
                    placeholder="Eligibility rules, minimum attendance, stipend terms..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPkgModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
                >
                  {editingPkg ? 'Update Package' : 'Create Package'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default WorkStudyHub;

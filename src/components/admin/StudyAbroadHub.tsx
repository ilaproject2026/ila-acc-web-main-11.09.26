import React, { useState, useEffect } from 'react';
import {
  Plane, Globe, Building2, BookOpen, Plus,
  Search, Filter, CheckCircle2, ShieldCheck,
  Lock, Unlock, Eye, Edit3, Trash2, X, Check,
  Sparkles, Award, Users, Radio, Megaphone,
  FileText, ArrowRight, Star, RefreshCw, Clock, UserCheck
} from 'lucide-react';
import {
  CountryItem,
  CollegeItem,
  AbroadCourseItem,
  AbroadApplicationItem,
  DocumentChecklistItem,
  ConsultantATSTask,
  getAbroadCountries,
  saveAbroadCountry,
  deleteAbroadCountry,
  getAbroadColleges,
  saveAbroadCollege,
  deleteAbroadCollege,
  getAbroadCourses,
  saveAbroadCourse,
  deleteAbroadCourse,
  getAbroadApplications,
  saveAbroadApplication,
  toggleCollegePrivacyReveal,
  matchStudentAbroadProfile,
  getDocumentChecklists,
  saveDocumentChecklist,
  deleteDocumentChecklist,
  getConsultantATSTasks,
  saveConsultantATSTask,
  updateConsultantATSTaskStage,
  addConsultantNote
} from '../../lib/db';
import { HubHODView } from './common/HubHODView';
import { HubAutoTriggerView } from './common/HubAutoTriggerView';
import { HubSocialPromoView } from './common/HubSocialPromoView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';
import { HubSubNavBar, HubNavItem } from './common/HubSubNavBar';

export const StudyAbroadHub: React.FC = () => {
  // Main Sub-Nav Tab
  const [activeTab, setActiveTab] = useState<
    'directory' | 'applications' | 'consultant_ats' | 'checklists' | 'hod' | 'auto_trigger' | 'social_promo' | 'intake_tracking'
  >('directory');

  // Directory Sub-selection: 'countries' | 'colleges' | 'courses'
  const [dirSection, setDirSection] = useState<'countries' | 'colleges' | 'courses'>('colleges');

  // Data States
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [colleges, setColleges] = useState<CollegeItem[]>([]);
  const [courses, setCourses] = useState<AbroadCourseItem[]>([]);
  const [applications, setApplications] = useState<AbroadApplicationItem[]>([]);
  const [atsTasks, setAtsTasks] = useState<ConsultantATSTask[]>([]);
  const [checklists, setChecklists] = useState<DocumentChecklistItem[]>([]);

  // ATS Filter & Detail States
  const [atsStageFilter, setAtsStageFilter] = useState<string>('All');
  const [atsSearchTerm, setAtsSearchTerm] = useState<string>('');
  const [selectedAtsTask, setSelectedAtsTask] = useState<ConsultantATSTask | null>(null);
  const [consultantNoteText, setConsultantNoteText] = useState<string>('');
  const [consultantFollowUpDate, setConsultantFollowUpDate] = useState<string>('');
  const [consultantAuthor, setConsultantAuthor] = useState<string>('Sarah Müller (Senior Consultant)');

  // Checklist CRUD States
  const [chkCountryFilter, setChkCountryFilter] = useState<string>('All');
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);
  const [editingChecklist, setEditingChecklist] = useState<DocumentChecklistItem | null>(null);
  const [chkCountry, setChkCountry] = useState<string>('Germany');
  const [chkTrack, setChkTrack] = useState<string>('All');
  const [chkDocName, setChkDocName] = useState<string>('');
  const [chkIsRequired, setChkIsRequired] = useState<boolean>(true);
  const [chkFormats, setChkFormats] = useState<string>('PDF, JPG, PNG');
  const [chkMaxSize, setChkMaxSize] = useState<number>(5);
  const [chkDescription, setChkDescription] = useState<string>('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');

  // Modal States
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryItem | null>(null);

  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState<CollegeItem | null>(null);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AbroadCourseItem | null>(null);

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchingApp, setMatchingApp] = useState<AbroadApplicationItem | null>(null);
  const [matchResults, setMatchResults] = useState<any[]>([]);

  // Country Form Fields
  const [cName, setCName] = useState('');
  const [cCode, setCCode] = useState('DE');
  const [cFlag, setCFlag] = useState('🇩🇪');
  const [cVisaType, setCVisaType] = useState('National Student Visa (APS / 16b)');
  const [cCurrency, setCCurrency] = useState('EUR (€)');
  const [cAvgTuition, setCAvgTuition] = useState('€0 - €3,000 / yr');
  const [cLivingCost, setCLivingCost] = useState('€934 / mo Blocked Account');
  const [cDescription, setCDescription] = useState('');

  // College Form Fields
  const [colCountryId, setColCountryId] = useState('country-de');
  const [colName, setColName] = useState('');
  const [colCity, setColCity] = useState('');
  const [colRanking, setColRanking] = useState('QS Top 100');
  const [colType, setColType] = useState<CollegeItem['type']>('Public');
  const [colCriteria, setColCriteria] = useState('');
  const [colTermsInput, setColTermsInput] = useState('');
  const [colEmail, setColEmail] = useState('');

  // Course Form Fields
  const [crsCountryId, setCrsCountryId] = useState('country-de');
  const [crsCollegeId, setCrsCollegeId] = useState('');
  const [crsName, setCrsName] = useState('');
  const [crsDegree, setCrsDegree] = useState<AbroadCourseItem['degree']>('Masters');
  const [crsDuration, setCrsDuration] = useState('2 Years');
  const [crsLanguage, setCrsLanguage] = useState<AbroadCourseItem['language']>('English');
  const [crsTuition, setCrsTuition] = useState('€0 (Semester fee €150)');
  const [crsMinCGPA, setCrsMinCGPA] = useState<number>(7.0);
  const [crsMinIELTS, setCrsMinIELTS] = useState<number>(6.5);
  const [crsMinGerman, setCrsMinGerman] = useState<AbroadCourseItem['minGermanLevel']>('None');
  const [crsIntakeInput, setCrsIntakeInput] = useState('Winter (Oct), Summer (Apr)');
  const [crsDesc, setCrsDesc] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAllData = () => {
    setCountries(getAbroadCountries());
    setColleges(getAbroadColleges());
    setCourses(getAbroadCourses());
    setApplications(getAbroadApplications());
    setAtsTasks(getConsultantATSTasks());
    setChecklists(getDocumentChecklists());
  };

  useEffect(() => {
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener('ilas-abroad-countries-changed', handleUpdate);
    window.addEventListener('ilas-abroad-colleges-changed', handleUpdate);
    window.addEventListener('ilas-abroad-courses-changed', handleUpdate);
    window.addEventListener('ilas-abroad-applications-changed', handleUpdate);
    window.addEventListener('ilas-ats-tasks-changed', handleUpdate);
    window.addEventListener('ilas-abroad-checklists-changed', handleUpdate);

    return () => {
      window.removeEventListener('ilas-abroad-countries-changed', handleUpdate);
      window.removeEventListener('ilas-abroad-colleges-changed', handleUpdate);
      window.removeEventListener('ilas-abroad-courses-changed', handleUpdate);
      window.removeEventListener('ilas-abroad-applications-changed', handleUpdate);
      window.removeEventListener('ilas-ats-tasks-changed', handleUpdate);
      window.removeEventListener('ilas-abroad-checklists-changed', handleUpdate);
    };
  }, []);

  // Handlers for Consultant ATS
  const handleStageChange = (taskId: string, stage: ConsultantATSTask['stage']) => {
    const updated = updateConsultantATSTaskStage(taskId, stage, consultantAuthor);
    if (updated) {
      setSelectedAtsTask(updated);
      showToast(`Task stage advanced to "${stage}".`);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAtsTask || !consultantNoteText.trim()) return;

    const updated = addConsultantNote(
      selectedAtsTask.id,
      consultantAuthor,
      consultantNoteText.trim(),
      consultantFollowUpDate || undefined
    );

    if (updated) {
      setSelectedAtsTask(updated);
      setConsultantNoteText('');
      setConsultantFollowUpDate('');
      showToast('Consultant follow-up note logged.');
    }
  };

  const handleToggleDocVerification = (taskId: string, checklistId: string) => {
    const task = atsTasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedDocs = task.uploadedDocuments.map(d =>
      d.checklistId === checklistId ? { ...d, verified: !d.verified } : d
    );

    const updatedTask: ConsultantATSTask = {
      ...task,
      uploadedDocuments: updatedDocs,
      hybridLogs: [
        {
          id: `hlog-${Date.now()}`,
          actor: 'HUMAN_CONSULTANT',
          action: 'Document Verification Toggled',
          details: `Document verification updated by ${consultantAuthor}.`,
          timestamp: new Date().toLocaleString()
        },
        ...task.hybridLogs
      ]
    };

    saveConsultantATSTask(updatedTask);
    setSelectedAtsTask(updatedTask);
    showToast('Document verification status updated.');
  };

  // Handlers for Checklist CRUD
  const handleOpenChecklistModal = (chk?: DocumentChecklistItem) => {
    if (chk) {
      setEditingChecklist(chk);
      setChkCountry(chk.country);
      setChkTrack(chk.courseTrack);
      setChkDocName(chk.docName);
      setChkIsRequired(chk.isRequired);
      setChkFormats(chk.acceptedFormats);
      setChkMaxSize(chk.maxSizeMB);
      setChkDescription(chk.description);
    } else {
      setEditingChecklist(null);
      setChkCountry('Germany');
      setChkTrack('All');
      setChkDocName('');
      setChkIsRequired(true);
      setChkFormats('PDF, JPG, PNG');
      setChkMaxSize(5);
      setChkDescription('');
    }
    setShowChecklistModal(true);
  };

  const handleSaveChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chkDocName.trim()) return;

    const newItem: DocumentChecklistItem = {
      id: editingChecklist ? editingChecklist.id : `chk-${Date.now()}`,
      country: chkCountry,
      courseTrack: chkTrack,
      docName: chkDocName.trim(),
      isRequired: chkIsRequired,
      acceptedFormats: chkFormats,
      maxSizeMB: chkMaxSize,
      description: chkDescription.trim()
    };

    saveDocumentChecklist(newItem);
    setShowChecklistModal(false);
    showToast(`Document requirement "${chkDocName}" saved.`);
  };

  const handleDeleteChecklist = (id: string) => {
    if (confirm('Delete this document requirement?')) {
      deleteDocumentChecklist(id);
      showToast('Document requirement removed.');
    }
  };

  // Handlers for Country
  const handleOpenCountryModal = (country?: CountryItem) => {
    if (country) {
      setEditingCountry(country);
      setCName(country.name);
      setCCode(country.code);
      setCFlag(country.flag);
      setCVisaType(country.visaType);
      setCCurrency(country.currency);
      setCAvgTuition(country.avgTuition);
      setCLivingCost(country.livingCost);
      setCDescription(country.description);
    } else {
      setEditingCountry(null);
      setCName('');
      setCCode('DE');
      setCFlag('🇩🇪');
      setCVisaType('National Student Visa');
      setCCurrency('EUR (€)');
      setCAvgTuition('€0 - €3,000 / yr');
      setCLivingCost('€934 / mo');
      setCDescription('');
    }
    setShowCountryModal(true);
  };

  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName) return;
    const countryObj: CountryItem = {
      id: editingCountry ? editingCountry.id : 'country-' + cCode.toLowerCase() + '-' + Date.now(),
      name: cName,
      code: cCode,
      flag: cFlag || '🌐',
      visaType: cVisaType,
      currency: cCurrency,
      avgTuition: cAvgTuition,
      livingCost: cLivingCost,
      description: cDescription,
      status: 'Active'
    };
    saveAbroadCountry(countryObj);
    setShowCountryModal(false);
    showToast(`Country "${cName}" saved.`);
  };

  const handleDeleteCountry = (id: string) => {
    if (confirm('Delete this country and associated entries?')) {
      deleteAbroadCountry(id);
      showToast('Country removed.');
    }
  };

  // Handlers for College
  const handleOpenCollegeModal = (col?: CollegeItem) => {
    if (col) {
      setEditingCollege(col);
      setColCountryId(col.countryId);
      setColName(col.name);
      setColCity(col.city);
      setColRanking(col.ranking);
      setColType(col.type);
      setColCriteria(col.admissionCriteria);
      setColTermsInput(col.terms ? col.terms.join('\n') : '');
      setColEmail(col.contactEmail);
    } else {
      setEditingCollege(null);
      setColCountryId(countries[0]?.id || 'country-de');
      setColName('');
      setColCity('');
      setColRanking('Top Ranked');
      setColType('Public');
      setColCriteria('Min 7.0 CGPA, APS Certificate, IELTS 6.5');
      setColTermsInput('Uni-Assist VPD Required\nWinter Intake Available\n€0 Tuition Fee');
      setColEmail('admissions@university.eu');
    }
    setShowCollegeModal(true);
  };

  const handleSaveCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName) return;
    const termsArr = colTermsInput.split('\n').map(t => t.trim()).filter(Boolean);
    const colObj: CollegeItem = {
      id: editingCollege ? editingCollege.id : 'col-' + Date.now(),
      countryId: colCountryId,
      name: colName,
      city: colCity,
      ranking: colRanking,
      type: colType,
      admissionCriteria: colCriteria,
      terms: termsArr,
      contactEmail: colEmail,
      status: 'Partnered'
    };
    saveAbroadCollege(colObj);
    setShowCollegeModal(false);
    showToast(`Institution "${colName}" saved.`);
  };

  const handleDeleteCollege = (id: string) => {
    if (confirm('Delete this college?')) {
      deleteAbroadCollege(id);
      showToast('College removed.');
    }
  };

  // Handlers for Course
  const handleOpenCourseModal = (crs?: AbroadCourseItem) => {
    if (crs) {
      setEditingCourse(crs);
      setCrsCountryId(crs.countryId);
      setCrsCollegeId(crs.collegeId);
      setCrsName(crs.courseName);
      setCrsDegree(crs.degree);
      setCrsDuration(crs.duration);
      setCrsLanguage(crs.language);
      setCrsTuition(crs.tuitionPerYear);
      setCrsMinCGPA(crs.minCGPA);
      setCrsMinIELTS(crs.minIELTS);
      setCrsMinGerman(crs.minGermanLevel);
      setCrsIntakeInput(crs.intakeSeason.join(', '));
      setCrsDesc(crs.description);
    } else {
      setEditingCourse(null);
      setCrsCountryId(countries[0]?.id || 'country-de');
      setCrsCollegeId(colleges[0]?.id || '');
      setCrsName('');
      setCrsDegree('Masters');
      setCrsDuration('2 Years');
      setCrsLanguage('English');
      setCrsTuition('€0 (Semester fee only)');
      setCrsMinCGPA(7.0);
      setCrsMinIELTS(6.5);
      setCrsMinGerman('None');
      setCrsIntakeInput('Winter (Oct), Summer (Apr)');
      setCrsDesc('Master degree curriculum focused on research and corporate internship.');
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsName) return;
    const selectedCollege = colleges.find(c => c.id === crsCollegeId);
    const intakeArr = crsIntakeInput.split(',').map(s => s.trim()).filter(Boolean);

    const crsObj: AbroadCourseItem = {
      id: editingCourse ? editingCourse.id : 'crs-' + Date.now(),
      countryId: crsCountryId,
      collegeId: crsCollegeId || (colleges[0]?.id || ''),
      collegeName: selectedCollege ? selectedCollege.name : 'Partner University',
      courseName: crsName,
      degree: crsDegree,
      duration: crsDuration,
      language: crsLanguage,
      tuitionPerYear: crsTuition,
      minCGPA: Number(crsMinCGPA) || 6.5,
      minIELTS: Number(crsMinIELTS) || 6.0,
      minGermanLevel: crsMinGerman,
      intakeSeason: intakeArr.length > 0 ? intakeArr : ['Winter'],
      description: crsDesc,
      isFeatured: true
    };
    saveAbroadCourse(crsObj);
    setShowCourseModal(false);
    showToast(`Course "${crsName}" saved.`);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Delete this course?')) {
      deleteAbroadCourse(id);
      showToast('Course removed.');
    }
  };

  // Privacy Reveal Toggle Handler
  const handleToggleReveal = (appId: string, currentVal: boolean) => {
    toggleCollegePrivacyReveal(appId, !currentVal);
    showToast(!currentVal ? 'University details revealed to candidate & approved!' : 'University details masked for privacy.');
  };

  // Profile Matcher Handler
  const handleRunMatch = (app: AbroadApplicationItem) => {
    setMatchingApp(app);
    const matches = matchStudentAbroadProfile(
      app.targetCountryId,
      app.targetDegree,
      app.cgpa,
      app.ieltsScore,
      app.germanLevel
    );
    setMatchResults(matches);
    setShowMatchModal(true);
  };

  const navItems: HubNavItem[] = [
    { id: 'directory', label: 'Countries & Colleges', icon: Building2, badge: colleges.length },
    { id: 'applications', label: 'Applications & Privacy', icon: ShieldCheck, badge: applications.length },
    { id: 'consultant_ats', label: 'Consultant ATS & AI', icon: Sparkles, badge: atsTasks.length },
    { id: 'checklists', label: 'Document Checklists', icon: FileText, badge: checklists.length },
    { id: 'hod', label: 'HOD Console', icon: Award },
    { id: 'auto_trigger', label: 'Comm Triggers', icon: Radio },
    { id: 'social_promo', label: 'Social Promo', icon: Megaphone },
    { id: 'intake_tracking', label: 'Intake Desk', icon: Users },
  ];

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-12rem)] bg-slate-50 relative rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. SUB-NAVBAR: FULLY RESPONSIVE, SCROLLABLE & WRAP-ENABLED */}
      <HubSubNavBar
        items={navItems}
        activeTab={activeTab}
        onTabChange={(id:any) => setActiveTab(id as any)}
        activeColorClass="bg-blue-600"
      />

      {/* Dynamic Content Area */}
      <div className="flex-1 w-full bg-slate-50 overflow-y-auto no-scrollbar relative p-4 md:p-6 space-y-6">

        {/* EXECUTIVE HEADER BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-900/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">
                  <Plane className="w-3.5 h-3.5" />
                  Study Abroad Hub
                </span>
                <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                  Country-College CRUD • Student Privacy Shield • AI Match Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Study Abroad Hub &amp; Global Placement
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Manage international university contracts, tuition terms, and admission criteria. Evaluate student profiles with privacy protection (masking college identities until admin approval).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenCollegeModal()}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add College
              </button>
              <button
                onClick={() => handleOpenCourseModal()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-300" /> + Add Course
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-TAB 1: DIRECTORY (COUNTRIES, COLLEGES, COURSES) */}
        {/* ========================================================================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6 animate-in fade-in">

            {/* Section Switcher (Countries / Colleges / Courses) */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDirSection('colleges')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dirSection === 'colleges' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Colleges &amp; Universities ({colleges.length})
                </button>
                <button
                  onClick={() => setDirSection('courses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dirSection === 'courses' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Courses &amp; Degree Programs ({courses.length})
                </button>
                <button
                  onClick={() => setDirSection('countries')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${dirSection === 'countries' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Countries ({countries.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {dirSection === 'colleges' && (
                  <button
                    onClick={() => handleOpenCollegeModal()}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New College
                  </button>
                )}
                {dirSection === 'courses' && (
                  <button
                    onClick={() => handleOpenCourseModal()}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Course
                  </button>
                )}
                {dirSection === 'countries' && (
                  <button
                    onClick={() => handleOpenCountryModal()}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Country
                  </button>
                )}
              </div>
            </div>

            {/* 1. COLLEGES VIEW */}
            {dirSection === 'colleges' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colleges.map(col => {
                  const country = countries.find(c => c.id === col.countryId);
                  const colCourses = courses.filter(crs => crs.collegeId === col.id);
                  return (
                    <div key={col.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                              {country ? `${country.flag} ${country.name}` : 'Europe'}
                            </span>
                            <h3 className="font-bold text-slate-900 text-sm mt-1">{col.name}</h3>
                            <div className="text-[11px] text-slate-500">{col.city} • <span className="font-semibold text-slate-700">{col.ranking}</span></div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 shrink-0">
                            {col.type}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                          <div className="font-bold text-slate-700 text-[11px]">Admission Criteria:</div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{col.admissionCriteria}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Matching Terms:</div>
                          <div className="flex flex-wrap gap-1">
                            {col.terms?.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                                ✓ {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-indigo-600 font-bold text-[11px]">
                          {colCourses.length} Active Courses
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenCollegeModal(col)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCollege(col.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. COURSES VIEW */}
            {dirSection === 'courses' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(crs => {
                  const country = countries.find(c => c.id === crs.countryId);
                  return (
                    <div key={crs.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                              {crs.degree} • {crs.duration}
                            </span>
                            <h3 className="font-bold text-slate-900 text-sm mt-1">{crs.courseName}</h3>
                            <div className="text-[11px] text-slate-500 font-medium">{crs.collegeName}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 shrink-0">
                            {crs.language}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-center p-2.5 bg-slate-50 rounded-xl text-[10px]">
                          <div>
                            <div className="text-slate-400 font-bold">MIN CGPA</div>
                            <div className="font-black text-slate-900">{crs.minCGPA}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 font-bold">MIN IELTS</div>
                            <div className="font-black text-slate-900">{crs.minIELTS}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 font-bold">GERMAN</div>
                            <div className="font-black text-slate-900">{crs.minGermanLevel}</div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-bold text-emerald-900">
                          Tuition: {crs.tuitionPerYear}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">Intakes: {crs.intakeSeason?.join(', ')}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleOpenCourseModal(crs)} className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteCourse(crs.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-lg cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. COUNTRIES VIEW */}
            {dirSection === 'countries' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {countries.map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{c.flag}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{c.name} ({c.code})</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
                      <div className="text-[11px] text-slate-700 font-semibold space-y-0.5 pt-1 border-t">
                        <div>Visa: <span className="text-slate-900">{c.visaType}</span></div>
                        <div>Tuition: <span className="text-emerald-700 font-bold">{c.avgTuition}</span></div>
                        <div>Living: <span className="text-slate-900">{c.livingCost}</span></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-end gap-1">
                      <button onClick={() => handleOpenCountryModal(c)} className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteCountry(c.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-lg cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 2: APPLICATIONS & PRIVACY MATCHING ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Student Privacy &amp; University Matching Gate
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Study Abroad Applications &amp; Dossiers</h3>
                  <p className="text-xs text-slate-500">
                    Privacy Rule: Student sees matched degree &amp; curriculum criteria only. University names remain masked until admin grants approval.
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-bold">
                  {applications.length} Total Applicants
                </div>
              </div>

              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:bg-slate-100/70 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{app.studentName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                            Target: {app.targetCountryName} ({app.targetDegree})
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${app.status === 'College Approved' ? 'bg-emerald-100 text-emerald-800' :
                              app.status === 'Matched' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {app.studentEmail} • {app.studentPhone} • Field: <strong className="text-slate-700">{app.preferredField}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRunMatch(app)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> AI Profile Match
                        </button>

                        <button
                          onClick={() => handleToggleReveal(app.id, app.isCollegeRevealed)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${app.isCollegeRevealed
                              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                            }`}
                          title={app.isCollegeRevealed ? 'Hide College Name' : 'Approve and Reveal College Name to Student'}
                        >
                          {app.isCollegeRevealed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-300" />}
                          {app.isCollegeRevealed ? 'College Revealed ✓' : 'Reveal College (Admin Gate)'}
                        </button>
                      </div>
                    </div>

                    {/* Profile Parameters & Matching Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] p-3 bg-white rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block font-bold">ACADEMIC CGPA</span>
                        <strong className="text-slate-900 text-xs">{app.cgpa} / 10.0</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">IELTS / TOEFL</span>
                        <strong className="text-slate-900 text-xs">{app.ieltsScore} Band</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">GERMAN PROFICIENCY</span>
                        <strong className="text-indigo-700 text-xs">{app.germanLevel}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">MATCHED UNIVERSITY</span>
                        <strong className={app.isCollegeRevealed ? 'text-emerald-700 text-xs' : 'text-slate-400 font-mono text-xs'}>
                          {app.isCollegeRevealed ? app.assignedCollegeName : '🔒 [Protected / Hidden]'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">MATCH FIT SCORE</span>
                        <strong className="text-emerald-600 text-xs">{app.matchScore || 85}% Compatible</strong>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB: CONSULTANT ATS (APPLICATION TRACKING SYSTEM & HYBRID AI LOGS) */}
        {/* ========================================================================= */}
        {activeTab === 'consultant_ats' && (
          <div className="space-y-6 animate-in fade-in">

            {/* Header Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">TOTAL ATS LEADS</span>
                <div className="text-2xl font-black text-slate-900">{atsTasks.length}</div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Auto-Bound to Accounts
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">DOC VERIFICATION</span>
                <div className="text-2xl font-black text-amber-600">
                  {atsTasks.filter(t => t.stage === 'Document Verification' || t.stage === 'Lead / Intake').length}
                </div>
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> Transcripts Pending Review
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">UNIVERSITY REVIEW</span>
                <div className="text-2xl font-black text-blue-600">
                  {atsTasks.filter(t => t.stage === 'University Review' || t.stage === 'Interview Scheduled').length}
                </div>
                <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3" /> Uni-Assist &amp; Direct Dossiers
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">ENROLLED / VISA</span>
                <div className="text-2xl font-black text-emerald-600">
                  {atsTasks.filter(t => t.stage === 'Enrolled' || t.stage === 'Visa Preparation').length}
                </div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" /> APS &amp; Embassy Clearances
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {['All', 'Lead / Intake', 'Document Verification', 'University Review', 'Interview Scheduled', 'Visa Preparation', 'Enrolled'].map(stg => (
                  <button
                    key={stg}
                    onClick={() => setAtsStageFilter(stg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${atsStageFilter === stg
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search candidate, email, course..."
                  value={atsSearchTerm}
                  onChange={(e) => setAtsSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {atsTasks
                .filter(task => {
                  const matchStage = atsStageFilter === 'All' || task.stage === atsStageFilter;
                  const matchSearch = atsSearchTerm === '' ||
                    task.studentName.toLowerCase().includes(atsSearchTerm.toLowerCase()) ||
                    task.studentEmail.toLowerCase().includes(atsSearchTerm.toLowerCase()) ||
                    task.targetCourse.toLowerCase().includes(atsSearchTerm.toLowerCase());
                  return matchStage && matchSearch;
                })
                .map((task) => {
                  const verifiedDocsCount = task.uploadedDocuments.filter(d => d.verified).length;
                  const totalDocsCount = task.uploadedDocuments.length;

                  return (
                    <div
                      key={task.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {task.id}
                          </span>
                          <h3 className="font-black text-slate-900 text-base">{task.studentName}</h3>
                          <span className="text-xs text-slate-500 font-medium">({task.studentEmail} • {task.studentPhone})</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-black">
                            {task.matchScore}% Match
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          <span>🎯 <strong>Course:</strong> {task.targetCourse} ({task.targetCountry})</span>
                          <span>👤 <strong>Consultant:</strong> {task.assignedConsultant}</span>
                          <span>📄 <strong>Transcripts:</strong> {verifiedDocsCount}/{totalDocsCount} Verified</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${task.stage === 'Enrolled' ? 'bg-emerald-100 text-emerald-800' :
                            task.stage === 'Visa Preparation' ? 'bg-indigo-100 text-indigo-800' :
                              task.stage === 'University Review' ? 'bg-blue-100 text-blue-800' :
                                task.stage === 'Document Verification' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-700'
                          }`}>
                          {task.stage}
                        </span>

                        <button
                          onClick={() => setSelectedAtsTask(task)}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> View Dossier &amp; AI Logs
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB: STANDARD PROCEDURE CHECKLIST (CRUD) */}
        {/* ========================================================================= */}
        {activeTab === 'checklists' && (
          <div className="space-y-6 animate-in fade-in">

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Standard Procedure Document Checklists</h2>
                <p className="text-xs text-slate-500">Define required transcripts and certificates per target destination country and course track.</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={chkCountryFilter}
                  onChange={(e) => setChkCountryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs font-bold outline-none"
                >
                  <option value="All">All Countries</option>
                  <option value="Germany">Germany</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>

                <button
                  onClick={() => handleOpenChecklistModal()}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Requirement
                </button>
              </div>
            </div>

            {/* Checklist Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                  <tr>
                    <th className="p-3.5">Country / Flag</th>
                    <th className="p-3.5">Course Track</th>
                    <th className="p-3.5">Document Name &amp; Description</th>
                    <th className="p-3.5">Mandatory</th>
                    <th className="p-3.5">Formats / Max Size</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checklists
                    .filter(c => chkCountryFilter === 'All' || c.country.toLowerCase() === chkCountryFilter.toLowerCase())
                    .map((chk) => (
                      <tr key={chk.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          {chk.country === 'Germany' ? '🇩🇪 Germany' :
                            chk.country === 'United Kingdom' ? '🇬🇧 United Kingdom' :
                              chk.country === 'Canada' ? '🇨🇦 Canada' :
                                chk.country === 'Australia' ? '🇦🇺 Australia' : '🌍 ' + chk.country}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-[10px]">
                            {chk.courseTrack}
                          </span>
                        </td>
                        <td className="p-3.5 space-y-0.5">
                          <div className="font-bold text-slate-900">{chk.docName}</div>
                          <div className="text-[11px] text-slate-500">{chk.description}</div>
                        </td>
                        <td className="p-3.5">
                          {chk.isRequired ? (
                            <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-black text-[10px]">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold text-[10px]">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {chk.acceptedFormats} • Max {chk.maxSizeMB}MB
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenChecklistModal(chk)}
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit Requirement"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteChecklist(chk.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Requirement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 3: HOD CONSOLE */}
        {/* ========================================================================= */}
        {activeTab === 'hod' && (
          <HubHODView
            departmentName="Study Abroad & University Placement"
            departmentTagline="International University Agreements, APS Document Clearance Pipelines & Visa Embassy Roster"
            defaultAgendas={[
              { id: 'ab-1', title: 'Expand TU9 & UAS Direct Admission Pathways for Winter 2026', targetDate: '2026-09-30', priority: 'High', status: 'In Progress' },
              { id: 'ab-2', title: 'APS Fast-Track Verification Queue Liaison in New Delhi', targetDate: '2026-10-10', priority: 'Critical', status: 'In Progress' },
              { id: 'ab-3', title: 'Integrate Sperrkonto (Blocked Account €11,900) Auto-Sync API', targetDate: '2026-11-15', priority: 'Medium', status: 'Pending Review' }
            ]}
          />
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 4: AUTO-TRIGGER FOLLOW-UP */}
        {/* ========================================================================= */}
        {activeTab === 'auto_trigger' && (
          <HubAutoTriggerView
            departmentName="Study Abroad"
            defaultEventTypes={[
              { key: 'document_pending', label: 'Missing APS / SOP / Transcripts' },
              { key: 'incomplete_enrollment', label: 'Incomplete University Application' },
              { key: 'pending_payment', label: 'Blocked Account Setup Pending' },
              { key: 'profile_dropoff', label: 'Visa Embassy Mock Exam Idle' }
            ]}
          />
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 5: SOCIAL MEDIA PROMO */}
        {/* ========================================================================= */}
        {activeTab === 'social_promo' && (
          <HubSocialPromoView departmentName="Study Abroad" />
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 6: INTAKE TRACKING */}
        {/* ========================================================================= */}
        {activeTab === 'intake_tracking' && (
          <HubIntakeTrackingView
            departmentName="Study Abroad"
            departmentTitle="Study Abroad Hub / Walk-in & Online Intake Desk"
          />
        )}

      </div>

      {/* ========================================================================= */}
      {/* MATCH SIMULATOR MODAL */}
      {/* ========================================================================= */}
      {showMatchModal && matchingApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Profile Compatibility Engine
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  University Matching for {matchingApp.studentName}
                </h3>
              </div>
              <button onClick={() => setShowMatchModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
              <div>Student Profile: <strong className="text-slate-900">{matchingApp.cgpa} CGPA • IELTS {matchingApp.ieltsScore} • German {matchingApp.germanLevel}</strong></div>
              <div>Target: <strong className="text-indigo-700">{matchingApp.targetCountryName} ({matchingApp.targetDegree})</strong></div>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-slate-900 text-xs">Top Compatible European Programs:</div>
              {matchResults.map((match, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{match.course.courseName}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{match.college?.name} ({match.college?.city})</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 shrink-0">
                      {match.score}% Fit
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] p-2 bg-slate-50 rounded-xl text-slate-600">
                    <div>Min CGPA: <strong>{match.course.minCGPA}</strong> {matchingApp.cgpa >= match.course.minCGPA ? '✓' : '⚠️'}</div>
                    <div>Min IELTS: <strong>{match.course.minIELTS}</strong> {matchingApp.ieltsScore >= match.course.minIELTS ? '✓' : '⚠️'}</div>
                    <div>Tuition: <strong>{match.course.tuitionPerYear}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowMatchModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT COLLEGE MODAL */}
      {/* ========================================================================= */}
      {showCollegeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Institution Registry
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {editingCollege ? 'Edit College / University' : 'Add Partner University'}
              </h3>
            </div>

            <form onSubmit={handleSaveCollege} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country</label>
                  <select
                    value={colCountryId}
                    onChange={(e) => setColCountryId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Institution Type</label>
                  <select
                    value={colType}
                    onChange={(e) => setColType(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="Public">Public University (€0 Tuition)</option>
                    <option value="University of Applied Sciences">University of Applied Sciences (UAS)</option>
                    <option value="Technical University">Technical University (TU9)</option>
                    <option value="Private">Private University</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical University of Munich (TUM)"
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Campus Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Munich"
                    value={colCity}
                    onChange={(e) => setColCity(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ranking / Tier</label>
                  <input
                    type="text"
                    placeholder="QS Top 50 Global"
                    value={colRanking}
                    onChange={(e) => setColRanking(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admission Criteria</label>
                <input
                  type="text"
                  placeholder="Min 7.5 CGPA, APS Certificate, B2 English"
                  value={colCriteria}
                  onChange={(e) => setColCriteria(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admission Terms &amp; Checklist (One per line)</label>
                <textarea
                  rows={3}
                  value={colTermsInput}
                  onChange={(e) => setColTermsInput(e.target.value)}
                  placeholder="APS Certificate Required&#10;Uni-Assist VPD Mandatory&#10;Winter & Summer Intakes"
                  className="w-full p-2.5 border rounded-xl outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCollegeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl cursor-pointer"
                >
                  {editingCollege ? 'Update College' : 'Add College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT COURSE MODAL */}
      {/* ========================================================================= */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Degree Program Catalog
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {editingCourse ? 'Edit Degree Program' : 'Add Study Abroad Course'}
              </h3>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country</label>
                  <select
                    value={crsCountryId}
                    onChange={(e) => setCrsCountryId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">University</label>
                  <select
                    value={crsCollegeId}
                    onChange={(e) => setCrsCollegeId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    {colleges.filter(c => c.countryId === crsCountryId).map(col => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course / Degree Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc. Computer Science & AI Systems"
                  value={crsName}
                  onChange={(e) => setCrsName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Degree</label>
                  <select
                    value={crsDegree}
                    onChange={(e) => setCrsDegree(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="Masters">Masters (M.Sc / M.Eng)</option>
                    <option value="Bachelors">Bachelors (B.Sc / B.Eng)</option>
                    <option value="Ausbildung">Ausbildung (Paid Dual)</option>
                    <option value="Diploma">Diploma / Cert</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={crsDuration}
                    onChange={(e) => setCrsDuration(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medium</label>
                  <select
                    value={crsLanguage}
                    onChange={(e) => setCrsLanguage(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="English">English</option>
                    <option value="German">German</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={crsMinCGPA}
                    onChange={(e) => setCrsMinCGPA(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min IELTS</label>
                  <input
                    type="number"
                    step="0.5"
                    value={crsMinIELTS}
                    onChange={(e) => setCrsMinIELTS(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min German</label>
                  <select
                    value={crsMinGerman}
                    onChange={(e) => setCrsMinGerman(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="None">None</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tuition Fee Structure</label>
                <input
                  type="text"
                  placeholder="€0 (Semester fee €152 only)"
                  value={crsTuition}
                  onChange={(e) => setCrsTuition(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl cursor-pointer"
                >
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT COUNTRY MODAL */}
      {/* ========================================================================= */}
      {showCountryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 border-b pb-2">
              {editingCountry ? 'Edit Country' : 'Add Country Profile'}
            </h3>
            <form onSubmit={handleSaveCountry} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Flag Emoji</label>
                  <input
                    type="text"
                    value={cFlag}
                    onChange={(e) => setCFlag(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Visa Type</label>
                <input
                  type="text"
                  value={cVisaType}
                  onChange={(e) => setCVisaType(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Avg Tuition</label>
                  <input
                    type="text"
                    value={cAvgTuition}
                    onChange={(e) => setCAvgTuition(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Living Cost</label>
                  <input
                    type="text"
                    value={cLivingCost}
                    onChange={(e) => setCLivingCost(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={cDescription}
                  onChange={(e) => setCDescription(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowCountryModal(false)} className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-xl cursor-pointer">Save Country</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONSULTANT ATS DOSSIER & HYBRID AI ACTIVITY MODAL */}
      {/* ========================================================================= */}
      {selectedAtsTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">

            {/* Header */}
            <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    ATS Lead ID: {selectedAtsTask.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Account: {selectedAtsTask.studentAccountId}
                  </span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    {selectedAtsTask.matchScore}% Match Fit
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">{selectedAtsTask.studentName}</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedAtsTask.studentEmail} • {selectedAtsTask.studentPhone} • Target: <strong className="text-brand-700">{selectedAtsTask.targetCourse} ({selectedAtsTask.targetCountry})</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Application Stage</label>
                  <select
                    value={selectedAtsTask.stage}
                    onChange={(e) => handleStageChange(selectedAtsTask.id, e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 font-black text-xs text-slate-800 bg-slate-50 outline-none focus:border-brand-500"
                  >
                    <option value="Lead / Intake">Lead / Intake</option>
                    <option value="Document Verification">Document Verification</option>
                    <option value="University Review">University Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Visa Preparation">Visa Preparation</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Closed / Dropped">Closed / Dropped</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedAtsTask(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Body: 2 Columns */}
            <div className="grid lg:grid-cols-12 gap-6">

              {/* Left Column: Documents & Follow-Up Notes */}
              <div className="lg:col-span-6 space-y-6">

                {/* Uploaded Documents Dossier */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-brand-600" /> Uploaded Transcripts &amp; Files ({selectedAtsTask.uploadedDocuments.length})
                    </h3>
                    <span className="text-[10px] text-slate-500">Click to Toggle Verification</span>
                  </div>

                  {selectedAtsTask.uploadedDocuments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No documents attached yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedAtsTask.uploadedDocuments.map((doc, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-800">{doc.docName}</h4>
                            <p className="text-[11px] text-slate-500 font-mono">{doc.fileName} ({doc.fileSize})</p>
                            <span className="text-[10px] text-slate-400 block">Uploaded: {doc.uploadedAt}</span>
                          </div>

                          <button
                            onClick={() => handleToggleDocVerification(selectedAtsTask.id, doc.checklistId)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 ${doc.verified
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                              }`}
                          >
                            {doc.verified ? <><Check className="w-3 h-3" /> Verified</> : <><Clock className="w-3 h-3" /> Verify</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Log Consultant Follow-Up Note */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" /> Log Consultant Follow-Up
                  </h3>

                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter call notes, interview evaluation, or student guidance..."
                      value={consultantNoteText}
                      onChange={(e) => setConsultantNoteText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-brand-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Author</label>
                        <input
                          type="text"
                          value={consultantAuthor}
                          onChange={(e) => setConsultantAuthor(e.target.value)}
                          className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Next Follow-Up</label>
                        <input
                          type="date"
                          value={consultantFollowUpDate}
                          onChange={(e) => setConsultantFollowUpDate(e.target.value)}
                          className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Save Follow-Up Note
                    </button>
                  </form>

                  {/* Notes History */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Consultant History</span>
                    {selectedAtsTask.consultantNotes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                          <span>{note.author}</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{note.note}</p>
                        {note.nextFollowUpDate && (
                          <span className="inline-block text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Next Follow-up: {note.nextFollowUpDate}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Dual Hybrid AI (ILA) & Consultant Audit Timeline */}
              <div className="lg:col-span-6 bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-400" /> Hybrid AI (ILA) Dual-Audit Stream
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Simultaneous tracking of automated AI scans/triggers &amp; manual consultant actions.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {selectedAtsTask.hybridLogs.map((log) => {
                    const isAI = log.actor === 'ILA_AI';

                    return (
                      <div
                        key={log.id}
                        className={`p-3.5 rounded-2xl border transition-all ${isAI
                            ? 'bg-brand-950/40 border-brand-800/60'
                            : 'bg-slate-950/80 border-slate-800'
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {isAI ? (
                              <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[10px] font-black flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" /> ILA AI Engine
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1">
                                <UserCheck className="w-3 h-3 text-emerald-400" /> Consultant Action
                              </span>
                            )}
                            <span className="text-xs font-bold text-white">{log.action}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {log.details}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="border-t pt-3 flex justify-end">
              <button
                onClick={() => setSelectedAtsTask(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT DOCUMENT CHECKLIST MODAL */}
      {/* ========================================================================= */}
      {showChecklistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Standard Procedure Requirements
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {editingChecklist ? 'Edit Document Requirement' : 'Add Document Requirement'}
              </h3>
            </div>

            <form onSubmit={handleSaveChecklist} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Country</label>
                  <select
                    value={chkCountry}
                    onChange={(e) => setChkCountry(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="Germany">Germany</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="All">All Countries</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Track</label>
                  <select
                    value={chkTrack}
                    onChange={(e) => setChkTrack(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="All">All Tracks</option>
                    <option value="STEM &amp; Engineering">STEM &amp; Engineering</option>
                    <option value="Business &amp; Management">Business &amp; Management</option>
                    <option value="Ausbildung">Ausbildung</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APS Certificate / Blocked Account Proof"
                  value={chkDocName}
                  onChange={(e) => setChkDocName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Accepted Formats</label>
                  <input
                    type="text"
                    value={chkFormats}
                    onChange={(e) => setChkFormats(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Size (MB)</label>
                  <input
                    type="number"
                    value={chkMaxSize}
                    onChange={(e) => setChkMaxSize(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instructions / Description</label>
                <textarea
                  rows={2}
                  value={chkDescription}
                  onChange={(e) => setChkDescription(e.target.value)}
                  placeholder="Specify validity, seal requirements, or language translation guidelines..."
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="reqToggle"
                  checked={chkIsRequired}
                  onChange={(e) => setChkIsRequired(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <label htmlFor="reqToggle" className="font-bold text-slate-800 cursor-pointer">
                  Mandatory Submission for Application
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowChecklistModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudyAbroadHub;

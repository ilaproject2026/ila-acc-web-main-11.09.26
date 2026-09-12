import { useState, useEffect } from 'react';
import { 
  Shield, Users, BarChart2, 
  Building, UserPlus, Maximize2, Minimize2, Activity, Settings, LogOut, Globe, Lock, Unlock, Award, Briefcase, GraduationCap, Plane, FileText, Key, ShieldCheck, DollarSign, Megaphone, Ticket, Building2, Trophy, Bot, Gift,
  Type
} from 'lucide-react';
import { getInquiries, getVisitorLogs, getVisitorStats, Inquiry } from '../lib/db';
import { useThemeTypography } from '../context/ThemeTypographyContext';
import FinanceCommissionHub from '../components/admin/FinanceCommissionHub';
import HRConsultantHub from '../components/admin/HRConsultantHub';
import MarketingStudioHub from '../components/admin/MarketingStudioHub';
import IlasActivityHub from '../components/admin/IlasActivityHub';
import RewardPlanHub from '../components/admin/RewardPlanHub';
import SettingsHub from '../components/admin/SettingsHub';
import ExecutiveOverviewHub from '../components/admin/ExecutiveOverviewHub';
import GMConsole from '../components/admin/GMConsole';
import ITAdminConsole from '../components/admin/ITAdminConsole';
import EducationHub from '../components/admin/EducationHub'; // Integrated Education Hub
import ITMarketingAnalyticsDashboard from '../components/admin/ITMarketingAnalyticsDashboard';
import ContentCreationTool from '../components/admin/ContentCreationTool';
import DepartmentApprovalsTab from '../components/admin/DepartmentApprovalsTab';
import DepartmentUpdatesTab from '../components/admin/DepartmentUpdatesTab';
import CentralInquiriesHub from '../components/admin/frontoffice/CentralInquiriesHub';
import WalkinIntakeDesk from '../components/admin/frontoffice/WalkinIntakeDesk';
import OnlineEnquiryFunnel from '../components/admin/frontoffice/OnlineEnquiryFunnel';
import DepartmentInquiryView from '../components/admin/frontoffice/DepartmentInquiryView';
import FontSettingsModal from '../components/admin/frontoffice/FontSettingsModal';
import WorkStudyHub from '../components/admin/WorkStudyHub';
import StudyAbroadHub from '../components/admin/StudyAbroadHub';
import JobCareerHub from '../components/admin/JobCareerHub';

interface VisitorStatType {
  totalVisitors: number;
  totalTime: number;
  topCourses: [string, number][];
}

export default function AdminPortal() {
  const { settings, setColorTheme, activeProfile } = useThemeTypography();
  const isDark = settings.colorTheme === 'dark';

  const [role, setRole] = useState<string>('Super Admin');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [franchiseName, setFranchiseName] = useState('');
  const [franchiseEmail, setFranchiseEmail] = useState('');
  const [franchiseRegion, setFranchiseRegion] = useState('Germany / EU');
  const [franchiseCreatedList, setFranchiseCreatedList] = useState<any[]>([]);

  // Biometric / Authorization State for Level 1 Edits
  const [isAuthorizedToEdit, setIsAuthorizedToEdit] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState('');

  // Front Office Font & Custom Theme Profiles Modal State
  const [showFontSettingsModal, setShowFontSettingsModal] = useState(false);

  // Allowed Tabs Config
  const allowedTabs: Record<string, string[]> = {
    'Super Admin': ['all_inquiries', 'walkin_intake', 'online_enquiry', 'super_admin_hub', 'overview', 'gm', 'rewards', 'education', 'study_abroad', 'visa', 'work_while_you_study', 'jobs', 'leads', 'analytics', 'marketing_analytics', 'sales', 'hr', 'finance', 'marketing', 'activity', 'it_admin', 'settings'],
    'CEO': ['all_inquiries', 'walkin_intake', 'online_enquiry', 'overview', 'gm', 'rewards', 'education', 'study_abroad', 'visa', 'work_while_you_study', 'jobs', 'leads', 'analytics', 'marketing_analytics', 'sales', 'hr', 'finance', 'marketing', 'activity', 'it_admin', 'settings'],
    'General Manager': ['all_inquiries', 'walkin_intake', 'online_enquiry', 'gm', 'overview', 'rewards', 'education', 'study_abroad', 'visa', 'work_while_you_study', 'jobs', 'leads', 'analytics', 'marketing_analytics', 'sales', 'hr', 'finance', 'marketing', 'activity', 'it_admin', 'settings'],
    'Tech Admin': ['super_admin_hub', 'overview', 'gm', 'marketing_analytics', 'activity', 'it_admin', 'settings'],
    'Finance Officer': ['all_inquiries', 'sales', 'finance', 'rewards'],
    'HR Manager': ['all_inquiries', 'hr', 'work_while_you_study'],
    'Marketing Exec': ['online_enquiry', 'marketing', 'marketing_analytics', 'rewards'],
    'Academic Counselor': ['all_inquiries', 'walkin_intake', 'online_enquiry', 'education', 'leads', 'activity']
  };

  const defaultTabs: Record<string, any> = {
    'Super Admin': 'all_inquiries',
    'CEO': 'overview',
    'General Manager': 'all_inquiries',
    'Tech Admin': 'super_admin_hub',
    'Finance Officer': 'sales',
    'HR Manager': 'hr',
    'Marketing Exec': 'marketing',
    'Academic Counselor': 'all_inquiries'
  };

  const [activeTab, setActiveTab] = useState<any>('all_inquiries');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Education' | 'Study Abroad' | 'Visa' | 'Jobs'>('All');

  useEffect(() => {
    const handleRoleUpdate = () => {
      const storedRole = localStorage.getItem('ilas_team_role') || 'Super Admin';
      setRole(storedRole);
      const allowed = allowedTabs[storedRole] || allowedTabs['Super Admin'];
      if (!allowed.includes(activeTab)) {
        setActiveTab(defaultTabs[storedRole] || 'super_admin_hub');
      }
    };

    handleRoleUpdate();
    window.addEventListener('ilas-team-role-changed', handleRoleUpdate);
    return () => window.removeEventListener('ilas-team-role-changed', handleRoleUpdate);
  }, [activeTab]);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<VisitorStatType>({ totalVisitors: 0, totalTime: 0, topCourses: [] });

  const loadData = () => {
    setInquiries(getInquiries());
    setVisitorLogs(getVisitorLogs());
    setStats(getVisitorStats());
    const savedFranchises = JSON.parse(localStorage.getItem('ilas_franchises') || '[]');
    setFranchiseCreatedList(savedFranchises);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-inquiries-changed', loadData);
    window.addEventListener('ilas-visitor-logs-changed', loadData);
    return () => {
      window.removeEventListener('ilas-inquiries-changed', loadData);
      window.removeEventListener('ilas-visitor-logs-changed', loadData);
    };
  }, []);

  const toggleFullScreenWorkspace = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  const handleCreateFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!franchiseName || !franchiseEmail) return;
    const newFranchise = {
      id: 'FRANCHISE-' + Math.floor(1000 + Math.random() * 9000),
      name: franchiseName,
      email: franchiseEmail,
      region: franchiseRegion,
      token: 'ILA-FRN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [...franchiseCreatedList, newFranchise];
    setFranchiseCreatedList(updated);
    localStorage.setItem('ilas_franchises', JSON.stringify(updated));
    setFranchiseName('');
    setFranchiseEmail('');
    setShowFranchiseModal(false);
    alert(`Franchise / Partner account created successfully for ${newFranchise.name}!`);
  };

  const handleAuthorizeAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode === '7890' || authCode === 'ILA2026') {
      setIsAuthorizedToEdit(true);
      setShowAuthModal(false);
      setAuthCode('');
      alert('Biometric / Security Authorization Successful! Edit mode unlocked.');
    } else {
      alert('Invalid Authorization Code/Fingerprint token.');
    }
  };

  const filteredInquiries = activeCategoryFilter === 'All' 
    ? inquiries 
    : inquiries.filter(item => item.category === activeCategoryFilter);

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. TOP STATUS BAR (Security & Branding) */}
      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b px-6 py-3 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-xs transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm">ILA</div>
          <div>
            <span className="font-black tracking-tight text-sm block">ENTERPRISE COMMAND CENTER</span>
            <span className="text-[10px] text-slate-500 font-bold">Active Role: <span className="text-brand-600 uppercase">{role}</span></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 rounded text-[10px] font-black ${isAuthorizedToEdit ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {isAuthorizedToEdit ? '🔓 Unlocked (Auth Active)' : '🔒 Locked (View Only)'}
          </span>

          {!isAuthorizedToEdit ? (
            <button onClick={() => setShowAuthModal(true)} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer">
              <Lock className="w-3.5 h-3.5" /> Auth Gate
            </button>
          ) : (
            <button onClick={() => setIsAuthorizedToEdit(false)} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer">
              <Unlock className="w-3.5 h-3.5" /> Lock Edit
            </button>
          )}

          <button onClick={() => setColorTheme(isDark ? 'standard-light' : 'dark')} className={`p-2 rounded-xl border cursor-pointer ${isDark ? 'hover:bg-slate-800 border-slate-700 text-yellow-400' : 'hover:bg-slate-100 border-slate-200 text-slate-600'}`} title="Toggle Dark Mode">
            {isDark ? '☀️' : '🌙'}
          </button>

          <button onClick={toggleFullScreenWorkspace} className={`p-2 rounded-xl border cursor-pointer ${isDark ? 'hover:bg-slate-800 border-slate-700' : 'hover:bg-slate-100 border-slate-200'}`} title="Full View">
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button onClick={() => setShowFranchiseModal(true)} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
            <UserPlus className="w-3.5 h-3.5" /> + Franchise
          </button>

          <button onClick={() => { window.location.hash = '#home'; }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 border border-slate-200 cursor-pointer">
            <Globe className="w-3.5 h-3.5" /> Website
          </button>

          <button onClick={() => { window.location.hash = '#home'; setTimeout(() => { window.dispatchEvent(new CustomEvent('open-portal-login')); }, 200); }} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-1 border border-red-200/50 cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="container-max px-6 py-8 space-y-8">
        
        {/* 2. CATEGORIZED ENTERPRISE NAVIGATION DASHBOARD (PRO-CLEAN CARDS) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Front Office & Intake Group */}
          <div className="bg-gradient-to-b from-white to-slate-50 p-4 rounded-3xl border-2 border-brand-200/80 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-[10px] font-black text-brand-700 uppercase tracking-widest flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-brand-600" /> Front Office & Intake
              </h4>
              <span className="text-[9px] bg-brand-100 text-brand-800 font-bold px-1.5 py-0.2 rounded">Core</span>
            </div>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('all_inquiries')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'all_inquiries' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'}`}>
                🏢 All Inquiries Master
              </button>
              <button onClick={() => setActiveTab('walkin_intake')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'walkin_intake' ? 'bg-brand-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'}`}>
                🚶 Walk-in Reception Desk
              </button>
              <button onClick={() => setActiveTab('online_enquiry')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'online_enquiry' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'}`}>
                🌐 Online Enquiry Funnel
              </button>
            </div>

            {/* Dedicated Font Settings Customization Control */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                id="front-office-font-settings-btn"
                onClick={() => setShowFontSettingsModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-200/90 transition-all cursor-pointer shadow-xs group"
                title="Configure Front Office & Global Portal Font Family, Weight & Scale"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span>Font Settings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200">
                    {activeProfile.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {settings.fontFamily}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Core Operations Group */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Core Operations</h4>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('super_admin_hub')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'super_admin_hub' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                👑 Super Admin Master
              </button>
              <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <BarChart2 className="w-3.5 h-3.5" /> Master Executive Overview
              </button>
              <button onClick={() => setActiveTab('gm')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'gm' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Settings className="w-3.5 h-3.5" /> GM Console
              </button>
            </div>
          </div>

          {/* Department Suite Group */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Departments</h4>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('hr')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'hr' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Users className="w-3.5 h-3.5" /> HR Suite
              </button>
              <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'finance' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <DollarSign className="w-3.5 h-3.5" /> Finance & Accounts Hub
              </button>
              <button onClick={() => setActiveTab('marketing')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'marketing' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Megaphone className="w-3.5 h-3.5" /> Marketing Studio
              </button>
              <button onClick={() => setActiveTab('marketing_analytics')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'marketing_analytics' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <BarChart2 className="w-3.5 h-3.5" /> Marketing Analyst
              </button>
              <button onClick={() => setActiveTab('rewards')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'rewards' ? 'bg-amber-500 text-slate-950 font-black' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Gift className="w-3.5 h-3.5 text-amber-500" /> Reward Plan & Referrals
              </button>
            </div>
          </div>

          {/* Product Execution Group */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Products & Execution</h4>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('education')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'education' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <GraduationCap className="w-3.5 h-3.5" /> All Courses Hub
              </button>
              <button onClick={() => setActiveTab('work_while_you_study')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'work_while_you_study' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Briefcase className="w-3.5 h-3.5" /> Work and Study Hub
              </button>
              <button onClick={() => setActiveTab('study_abroad')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'study_abroad' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Plane className="w-3.5 h-3.5" /> Study Abroad Hub
              </button>
              <button onClick={() => setActiveTab('visa')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'visa' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <FileText className="w-3.5 h-3.5" /> Visa and Service Hub
              </button>
              <button onClick={() => setActiveTab('jobs')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'jobs' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Award className="w-3.5 h-3.5" /> Job and Career Hub
              </button>
            </div>
          </div>

          {/* System & Tools Group */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">System & Tools</h4>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('all_inquiries')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'all_inquiries' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Users className="w-3.5 h-3.5" /> Inquiries & Leads CRM
              </button>
              <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'sales' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <DollarSign className="w-3.5 h-3.5" /> Sales & POS
              </button>
              <button onClick={() => setActiveTab('it_admin')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'it_admin' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <ShieldCheck className="w-3.5 h-3.5" /> IT & Security
              </button>
              <button onClick={() => setActiveTab('activity')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'activity' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Activity className="w-3.5 h-3.5" /> ILAS System Monitor
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-amber-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                <Settings className="w-3.5 h-3.5" /> Settings & Staff
              </button>
            </div>
          </div>

        </div>

        {/* 3. DYNAMIC CONTENT AREA */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm min-h-[500px]">
          
          {/* FRONT OFFICE & INTAKE TABS */}
          {activeTab === 'all_inquiries' && (
            <CentralInquiriesHub onNavigateDepartment={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'walkin_intake' && (
            <WalkinIntakeDesk onNavigateDepartment={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'online_enquiry' && (
            <OnlineEnquiryFunnel onNavigateDepartment={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'super_admin_hub' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-3 py-1 rounded-full">Master Control Center</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">Super Admin Master Dashboard</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">System Authority: <span className="text-emerald-600 font-extrabold">Active (All Permissions)</span></span>
                  <span className="text-[10px] text-slate-400">Manage accounts, franchise tokens & global database overrides.</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black"><Users className="w-5 h-5" /></div>
                  <h3 className="font-black text-slate-900 text-sm">Staff & Role Directory</h3>
                  <p className="text-xs text-slate-500">Manage all registered system users, reset passwords, and assign departmental roles.</p>
                  <button onClick={() => setActiveTab('settings')} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">Manage Registry ⚙️</button>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                  <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center font-black"><Building className="w-5 h-5" /></div>
                  <h3 className="font-black text-slate-900 text-sm">Franchise & Partner Network</h3>
                  <p className="text-xs text-slate-500">Create regional partner accounts, issue security tokens, and view active partner territories.</p>
                  <button onClick={() => setShowFranchiseModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-xs">+ Create Franchise</button>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black"><Key className="w-5 h-5" /></div>
                  <h3 className="font-black text-slate-900 text-sm">Security & Biometric Gate</h3>
                  <p className="text-xs text-slate-500">Configure override PINs, biometric authentication tokens, and system-wide security lockdowns.</p>
                  <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer">Configure Auth Gate 🔒</button>
                </div>
              </div>
              <DepartmentApprovalsTab departmentName="Super Admin Hub" />
              <DepartmentUpdatesTab departmentName="Super Admin Hub" />
              <ContentCreationTool departmentName="Super Admin" />
            </div>
          )}

          {activeTab === 'overview' && <><ExecutiveOverviewHub /><ContentCreationTool departmentName="Executive Overview" /></>}
          {activeTab === 'gm' && <><GMConsole /><ContentCreationTool departmentName="General Manager" /></>}
          {activeTab === 'hr' && <><HRConsultantHub /><ContentCreationTool departmentName="HR Department" /></>}
          {activeTab === 'finance' && <><FinanceCommissionHub /><ContentCreationTool departmentName="Finance Hub" /></>}
          {activeTab === 'marketing' && <><MarketingStudioHub /><ContentCreationTool departmentName="Marketing Studio" /></>}

          {/* ALL COURSES HUB */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <EducationHub />
              <DepartmentInquiryView 
                departmentName="Education" 
                title="All Courses Hub Candidate Intake Desk" 
                subtitle="Track walk-in intakes, language batches, and classroom enrollment passes."
              />
              <ContentCreationTool departmentName="All Courses Hub" />
            </div>
          )}

          {/* STUDY ABROAD HUB */}
          {activeTab === 'study_abroad' && (
            <div className="space-y-6 animate-in fade-in">
              <StudyAbroadHub />
              <ContentCreationTool departmentName="Study Abroad Hub" />
              <DepartmentApprovalsTab departmentName="Study Abroad Hub" />
              <DepartmentUpdatesTab departmentName="Study Abroad Hub" />
            </div>
          )}

          {/* VISA AND SERVICE HUB */}
          {activeTab === 'visa' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded">Department Hub</span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">Visa and Service Hub & Immigration Compliance</h2>
                </div>
                <span className="text-xs font-bold text-slate-500">Embassy Paperwork, Blocked Accounts & Verification</span>
              </div>

              <DepartmentInquiryView 
                departmentName="Visa" 
                title="Visa and Service Hub Candidate Pipeline" 
                subtitle="Embassy appointment queues, blocked account (€11,900) proofs, and APS clearance."
              />

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 bg-slate-50 border rounded-2xl space-y-2">
                  <div className="font-black text-slate-900">🛂 Consulate Slot Queue</div>
                  <p className="text-slate-500">Track VFS appointment schedules and document verification status.</p>
                  <button disabled={!isAuthorizedToEdit} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold disabled:opacity-50 cursor-pointer">Manage Slots</button>
                </div>
                <div className="p-5 bg-slate-50 border rounded-2xl space-y-2">
                  <div className="font-black text-slate-900">⚖️ Regulatory Checklists</div>
                  <p className="text-slate-500">Update German immigration rules and financial proof guidelines.</p>
                  <button disabled={!isAuthorizedToEdit} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold disabled:opacity-50 cursor-pointer">Update Rules</button>
                </div>
              </div>
              <ContentCreationTool departmentName="Visa and Service Hub" />
              <DepartmentApprovalsTab departmentName="Visa and Service Hub" />
              <DepartmentUpdatesTab departmentName="Visa and Service Hub" />
            </div>
          )}

          {/* WORK AND STUDY HUB */}
          {activeTab === 'work_while_you_study' && (
            <div className="space-y-6 animate-in fade-in">
              <WorkStudyHub />
              <ContentCreationTool departmentName="Work and Study Hub" />
              <DepartmentApprovalsTab departmentName="Work and Study Hub" />
              <DepartmentUpdatesTab departmentName="Work and Study Hub" />
            </div>
          )}

          {/* JOB AND CAREER HUB */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 animate-in fade-in">
              <JobCareerHub />
              <ContentCreationTool departmentName="Job and Career Hub" />
              <DepartmentApprovalsTab departmentName="Job and Career Hub" />
              <DepartmentUpdatesTab departmentName="Job and Career Hub" />
            </div>
          )}

          {/* REWARDS PLAN HUB (Core Operations & Accounts-Marketing Synergy) */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <RewardPlanHub />
              <ContentCreationTool departmentName="Reward Plan & Commission Engine" />
              <DepartmentApprovalsTab departmentName="Rewards & Commissions" />
              <DepartmentUpdatesTab departmentName="Rewards & Commissions" />
            </div>
          )}

          {activeTab === 'sales' && <div><div className="text-xs font-bold text-slate-600 mb-4">Sales & POS Hub Management</div><ContentCreationTool departmentName="Sales Hub" /><DepartmentApprovalsTab departmentName="Sales" /><DepartmentUpdatesTab departmentName="Sales" /></div>}
          {activeTab === 'activity' && <><IlasActivityHub /><ContentCreationTool departmentName="ILAS Companion & Monitor" /><DepartmentUpdatesTab departmentName="ILAS Companion" /></>}
          {activeTab === 'it_admin' && <><ITAdminConsole /><ContentCreationTool departmentName="IT & Security" /><DepartmentApprovalsTab departmentName="IT" /><DepartmentUpdatesTab departmentName="IT" /></>}
          {activeTab === 'marketing_analytics' && <><ITMarketingAnalyticsDashboard /><ContentCreationTool departmentName="Marketing Analyst" /><DepartmentApprovalsTab departmentName="Marketing Analyst" /><DepartmentUpdatesTab departmentName="Marketing Analyst" /></>}
          {activeTab === 'settings' && <><SettingsHub /><ContentCreationTool departmentName="Settings" /><DepartmentUpdatesTab departmentName="Settings" /></>}

        </div>
      </div>

      {/* BIOMETRIC MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2"><Shield className="w-5 h-5 text-brand-600" /> Biometric / Auth Gate</h3>
            <p className="text-xs text-slate-500">Enter authorization code or scan fingerprint token to unlock editing rights.</p>
            <form onSubmit={handleAuthorizeAction} className="space-y-4 text-xs">
              <input type="password" required placeholder="Enter Auth PIN (e.g. 7890)" value={authCode} onChange={(e) => setAuthCode(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl font-bold tracking-widest text-center outline-none" />
              <button type="submit" className="w-full py-3 bg-slate-900 text-white font-black rounded-xl cursor-pointer">Authorize & Unlock 🔓</button>
            </form>
            <button onClick={() => setShowAuthModal(false)} className="w-full py-2 bg-slate-100 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* FRANCHISE MODAL */}
      {showFranchiseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Create New Franchise / Partner Account</h3>
            <form onSubmit={handleCreateFranchise} className="space-y-4 text-xs">
              <input type="text" required placeholder="Partner Name" value={franchiseName} onChange={(e) => setFranchiseName(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="email" required placeholder="Email" value={franchiseEmail} onChange={(e) => setFranchiseEmail(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-black rounded-xl cursor-pointer">Generate Partner Token</button>
            </form>
            <button onClick={() => setShowFranchiseModal(false)} className="w-full py-2 bg-slate-100 rounded-xl font-bold cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* FRONT OFFICE GLOBAL FONT SETTINGS MODAL */}
      <FontSettingsModal 
        isOpen={showFontSettingsModal} 
        onClose={() => setShowFontSettingsModal(false)} 
      />

    </div>
  );
}
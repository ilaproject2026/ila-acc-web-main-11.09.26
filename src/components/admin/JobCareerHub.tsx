import React, { useState, useEffect } from 'react';
import { 
  Award, Briefcase, Building2, Plus, Search, 
  Filter, CheckCircle2, Star, Sparkles, Send, 
  FileText, Users, Radio, Megaphone, Check, 
  Trash2, Edit3, X, ArrowRight, TrendingUp,
  MapPin, DollarSign, Clock, ShieldCheck
} from 'lucide-react';
import { 
  PartnerCompanyItem, 
  JobListingItem, 
  CandidateResumeItem,
  getPartnerCompanies, 
  savePartnerCompany, 
  deletePartnerCompany,
  getJobListings, 
  saveJobListing, 
  deleteJobListing,
  getCandidateResumes, 
  saveCandidateResume,
  parseAndMatchResume
} from '../../lib/db';
import { HubHODView } from './common/HubHODView';
import { HubAutoTriggerView } from './common/HubAutoTriggerView';
import { HubSocialPromoView } from './common/HubSocialPromoView';
import { HubIntakeTrackingView } from './common/HubIntakeTrackingView';

export const JobCareerHub: React.FC = () => {
  // Main Sub-Nav Tab: 'jobs_crud' | 'resume_matcher' | 'companies' | 'hod' | 'auto_trigger' | 'social_promo' | 'intake_tracking'
  const [activeTab, setActiveTab] = useState<
    'jobs_crud' | 'resume_matcher' | 'companies' | 'hod' | 'auto_trigger' | 'social_promo' | 'intake_tracking'
  >('jobs_crud');

  const [companies, setCompanies] = useState<PartnerCompanyItem[]>([]);
  const [jobs, setJobs] = useState<JobListingItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateResumeItem[]>([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('All');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListingItem | null>(null);

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<PartnerCompanyItem | null>(null);

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResumeItem | null>(null);
  const [matchResults, setMatchResults] = useState<any[]>([]);

  // Job Form Fields
  const [jobCompanyId, setJobCompanyId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDomain, setJobDomain] = useState<JobListingItem['domain']>('Software & IT');
  const [jobCountry, setJobCountry] = useState<JobListingItem['country']>('Germany');
  const [jobCity, setJobCity] = useState('Munich');
  const [jobSalary, setJobSalary] = useState('€65,000 - €80,000 / yr');
  const [jobContract, setJobContract] = useState<JobListingItem['contractType']>('Full-Time Permanent');
  const [jobBlueCard, setJobBlueCard] = useState(true);
  const [jobSkillsInput, setJobSkillsInput] = useState('Kubernetes, Docker, Go, AWS, CI/CD');
  const [jobExperience, setJobExperience] = useState('3+ Years');
  const [jobGerman, setJobGerman] = useState<JobListingItem['minGermanLevel']>('None');
  const [jobOpenings, setJobOpenings] = useState(2);
  const [jobDesc, setJobDesc] = useState('');

  // Company Form Fields
  const [compName, setCompName] = useState('');
  const [compLogo, setCompLogo] = useState('🏢');
  const [compIndustry, setCompIndustry] = useState('Industrial Automation');
  const [compLocation, setCompLocation] = useState('Munich, Germany');
  const [compCountry, setCompCountry] = useState('Germany');
  const [compTier, setCompTier] = useState<PartnerCompanyItem['hiringTier']>('Strategic Partner');
  const [compWebsite, setCompWebsite] = useState('https://');
  const [compContact, setCompContact] = useState('');

  // Candidate Resume Form Fields
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candCountry, setCandCountry] = useState('Germany');
  const [candField, setCandField] = useState('Software & IT');
  const [candExp, setCandExp] = useState(3);
  const [candDegree, setCandDegree] = useState('B.Tech Computer Science');
  const [candSkillsInput, setCandSkillsInput] = useState('Kubernetes, Docker, Go, AWS, React');
  const [candGerman, setCandGerman] = useState<CandidateResumeItem['germanLevel']>('A1');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAllData = () => {
    setCompanies(getPartnerCompanies());
    setJobs(getJobListings());
    setCandidates(getCandidateResumes());
  };

  useEffect(() => {
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener('ilas-partner-companies-changed', handleUpdate);
    window.addEventListener('ilas-job-listings-changed', handleUpdate);
    window.addEventListener('ilas-candidate-resumes-changed', handleUpdate);

    return () => {
      window.removeEventListener('ilas-partner-companies-changed', handleUpdate);
      window.removeEventListener('ilas-job-listings-changed', handleUpdate);
      window.removeEventListener('ilas-candidate-resumes-changed', handleUpdate);
    };
  }, []);

  // Handlers for Jobs
  const handleOpenJobModal = (job?: JobListingItem) => {
    if (job) {
      setEditingJob(job);
      setJobCompanyId(job.companyId);
      setJobTitle(job.title);
      setJobDomain(job.domain);
      setJobCountry(job.country);
      setJobCity(job.city);
      setJobSalary(job.salaryRange);
      setJobContract(job.contractType);
      setJobBlueCard(job.blueCardEligible);
      setJobSkillsInput(job.requiredSkills.join(', '));
      setJobExperience(job.minExperience);
      setJobGerman(job.minGermanLevel);
      setJobOpenings(job.openings);
      setJobDesc(job.description);
    } else {
      setEditingJob(null);
      setJobCompanyId(companies[0]?.id || 'comp-siemens');
      setJobTitle('');
      setJobDomain('Software & IT');
      setJobCountry('Germany');
      setJobCity('Munich');
      setJobSalary('€65,000 - €80,000 / yr');
      setJobContract('Full-Time Permanent');
      setJobBlueCard(true);
      setJobSkillsInput('Kubernetes, Docker, Go, AWS, CI/CD');
      setJobExperience('3+ Years');
      setJobGerman('None');
      setJobOpenings(2);
      setJobDesc('Lead corporate engineering tasks with direct European Blue Card sponsorship.');
    }
    setShowJobModal(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;
    const selectedComp = companies.find(c => c.id === jobCompanyId);
    const skillsArr = jobSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const jobObj: JobListingItem = {
      id: editingJob ? editingJob.id : 'job-' + Date.now(),
      companyId: jobCompanyId || (companies[0]?.id || 'comp-siemens'),
      companyName: selectedComp ? selectedComp.name : 'Partner Enterprise',
      title: jobTitle,
      domain: jobDomain,
      country: jobCountry,
      city: jobCity,
      salaryRange: jobSalary,
      contractType: jobContract,
      blueCardEligible: jobBlueCard,
      requiredSkills: skillsArr,
      minExperience: jobExperience,
      minGermanLevel: jobGerman,
      openings: Number(jobOpenings) || 1,
      description: jobDesc,
      postedDate: editingJob ? editingJob.postedDate : new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    saveJobListing(jobObj);
    setShowJobModal(false);
    showToast(`Job listing "${jobTitle}" saved.`);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Delete this job opening?')) {
      deleteJobListing(id);
      showToast('Job opening removed.');
    }
  };

  // Handlers for Candidate Resume Matching
  const handleOpenResumeModal = () => {
    setCandName('');
    setCandEmail('');
    setCandPhone('');
    setCandCountry('Germany');
    setCandField('Software & IT');
    setCandExp(3);
    setCandDegree('B.Tech Computer Science');
    setCandSkillsInput('Kubernetes, Docker, Go, AWS, React');
    setCandGerman('A1');
    setShowResumeModal(true);
  };

  const handleSaveResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail) return;
    const skillsArr = candSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const candObj: CandidateResumeItem = {
      id: 'cand-' + Date.now(),
      candidateName: candName,
      email: candEmail,
      phone: candPhone || '+91 98450 00000',
      targetCountry: candCountry,
      field: candField,
      yearsOfExperience: Number(candExp) || 2,
      highestDegree: candDegree,
      primarySkills: skillsArr,
      germanLevel: candGerman,
      englishLevel: 'Fluent',
      resumeFileName: `${candName.replace(/\s+/g, '_')}_Resume.pdf`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    saveCandidateResume(candObj);
    setShowResumeModal(false);
    showToast(`Candidate resume for ${candName} parsed.`);
  };

  const handleMatchCandidate = (cand: CandidateResumeItem) => {
    setSelectedCandidate(cand);
    const matches = parseAndMatchResume(cand);
    setMatchResults(matches);
    setShowMatchModal(true);
  };

  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        j.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchDomain = selectedDomainFilter === 'All' || j.domain === selectedDomainFilter;
    const matchCountry = selectedCountryFilter === 'All' || j.country === selectedCountryFilter;
    return matchSearch && matchDomain && matchCountry;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. EXECUTIVE BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" />
                Job and Career Hub Placement Engine
              </span>
              <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                Partner Employer CRUD • Live Resume Parser • Blue Card Sponsorships
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Job and Career Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Connect certified Indian talent directly with German &amp; European employers. Manage partner corporate job listings, parse incoming candidate resumes, and trigger automated placement interviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenJobModal()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Post New Job Opening
            </button>
            <button
              onClick={handleOpenResumeModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-300" /> + Upload &amp; Parse Resume
            </button>
          </div>
        </div>
      </div>

      {/* 2. UNIVERSAL SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('jobs_crud')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'jobs_crud'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4 text-brand-400" />
          <span>Live Job Database (CRUD)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-black">
            {jobs.length} Openings
          </span>
        </button>

        <button
          onClick={() => setActiveTab('resume_matcher')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'resume_matcher'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Resume Parser &amp; Dynamic Match</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black">
            {candidates.length} Resumes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'companies'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Partner Companies ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hod')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'hod'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>HOD Console (Job &amp; Career)</span>
        </button>

        <button
          onClick={() => setActiveTab('auto_trigger')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'auto_trigger'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-purple-400" />
          <span>Auto-Trigger (Follow-up)</span>
        </button>

        <button
          onClick={() => setActiveTab('social_promo')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'social_promo'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Social Media Promo</span>
        </button>

        <button
          onClick={() => setActiveTab('intake_tracking')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'intake_tracking'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Intake Desk</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: LIVE JOB DATABASE (CRUD) */}
      {/* ========================================================================= */}
      {activeTab === 'jobs_crud' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search jobs by title, company, skills (e.g. Kubernetes, Nursing, C++)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs outline-none bg-slate-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedDomainFilter}
                onChange={(e) => setSelectedDomainFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none"
              >
                <option value="All">All Domains</option>
                <option value="Software & IT">Software &amp; IT</option>
                <option value="Engineering">Engineering</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Business & Finance">Business &amp; Finance</option>
              </select>

              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none"
              >
                <option value="All">All Locations</option>
                <option value="Germany">Germany 🇩🇪</option>
                <option value="Austria">Austria 🇦🇹</option>
                <option value="Switzerland">Switzerland 🇨🇭</option>
                <option value="Netherlands">Netherlands 🇳🇱</option>
              </select>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {job.domain}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{job.title}</h3>
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" /> {job.companyName} • <MapPin className="w-3 h-3 text-slate-400" /> {job.city}, {job.country}
                      </div>
                    </div>
                    {job.blueCardEligible && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 shrink-0" title="European Blue Card Sponsorship eligible">
                        Blue Card ✓
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="font-black text-emerald-700 text-xs">{job.salaryRange}</div>
                    <div className="text-[11px] text-slate-600">{job.contractType} • Min Exp: <strong>{job.minExperience}</strong></div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-bold">
                    German: <strong className="text-indigo-700">{job.minGermanLevel}</strong> • {job.openings} Seats
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenJobModal(job)} className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-lg cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: RESUME PARSER & DYNAMIC JOB MATCH */}
      {/* ========================================================================= */}
      {activeTab === 'resume_matcher' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  AI Placement &amp; CV Intelligence
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Candidate Resumes &amp; Dynamic European Job Matcher</h3>
                <p className="text-xs text-slate-500">
                  Parses candidate skill vectors, years of experience, and German CEFR level against live partner listings.
                </p>
              </div>

              <button
                onClick={handleOpenResumeModal}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Parse New Candidate CV
              </button>
            </div>

            <div className="space-y-3">
              {candidates.map((cand) => (
                <div key={cand.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{cand.candidateName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                          {cand.field} • {cand.yearsOfExperience} Yrs Exp
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-emerald-100 text-emerald-800">
                          {cand.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {cand.email} • {cand.phone} • Target: <strong className="text-slate-700">{cand.targetCountry}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMatchCandidate(cand)}
                      className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Match Against Live Jobs
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cand.primarySkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-[10px] font-semibold">
                        {sk}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-md text-[10px] font-bold">
                      German Level: {cand.germanLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PARTNER COMPANIES */}
      {activeTab === 'companies' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {companies.map(comp => (
              <div key={comp.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{comp.logo}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {comp.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{comp.name}</h3>
                  <p className="text-xs text-slate-500">{comp.industry} • {comp.location}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                  Contact: <strong className="text-slate-800">{comp.contactPerson}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: HOD CONSOLE */}
      {activeTab === 'hod' && (
        <HubHODView 
          departmentName="Job & Career Placement"
          departmentTagline="European Hiring Consortium, Fast-Track Corporate Pipelines & Placement Drives"
        />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: AUTO-TRIGGER FOLLOW-UP */}
      {activeTab === 'auto_trigger' && (
        <HubAutoTriggerView 
          departmentName="Jobs" 
          defaultEventTypes={[
            { key: 'profile_dropoff', label: 'Candidate Resume Inactive' },
            { key: 'document_pending', label: 'Missing German Europass CV' },
            { key: 'incomplete_enrollment', label: 'Technical Screening Pending' },
            { key: 'pending_payment', label: 'Offer Letter Acceptance Follow-up' }
          ]}
        />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 6: SOCIAL MEDIA PROMO */}
      {activeTab === 'social_promo' && (
        <HubSocialPromoView departmentName="Jobs" />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 7: INTAKE TRACKING */}
      {activeTab === 'intake_tracking' && (
        <HubIntakeTrackingView 
          departmentName="Jobs" 
          departmentTitle="Job and Career Hub Candidates & Placements Intake Desk" 
        />
      )}

      {/* MATCH MODAL */}
      {showMatchModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Automated Match Engine
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Job Compatibility for {selectedCandidate.candidateName}
                </h3>
              </div>
              <button onClick={() => setShowMatchModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {matchResults.map((m, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{m.job.title}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{m.job.companyName} • {m.job.city}, {m.job.country}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800">
                      {m.matchScore}% Match
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg">
                    Matched Skills: {m.matchedSkills.join(', ') || 'Domain Match'}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        showToast(`Interview schedule request triggered for ${selectedCandidate.candidateName} with ${m.job.companyName}!`);
                        setShowMatchModal(false);
                      }}
                      className="px-3 py-1.5 bg-brand-600 text-white rounded-xl font-bold cursor-pointer hover:bg-brand-500"
                    >
                      Schedule Technical Interview 🚀
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE JOB MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 border-b pb-2">
              {editingJob ? 'Edit Job Opening' : 'Post Partner Company Job Opening'}
            </h3>

            <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company</label>
                  <select
                    value={jobCompanyId}
                    onChange={(e) => setJobCompanyId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domain</label>
                  <select
                    value={jobDomain}
                    onChange={(e) => setJobDomain(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    <option value="Software & IT">Software &amp; IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Business & Finance">Business &amp; Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior DevOps & Cloud Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={jobCity}
                    onChange={(e) => setJobCity(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={jobSkillsInput}
                  onChange={(e) => setJobSkillsInput(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowJobModal(false)} className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-xl cursor-pointer">Save Opening</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD RESUME MODAL */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 border-b pb-2">Parse Candidate Resume</h3>
            <form onSubmit={handleSaveResume} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Field</label>
                  <select
                    value={candField}
                    onChange={(e) => setCandField(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    <option value="Software & IT">Software &amp; IT</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={candSkillsInput}
                  onChange={(e) => setCandSkillsInput(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowResumeModal(false)} className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-xl cursor-pointer">Parse &amp; Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobCareerHub;

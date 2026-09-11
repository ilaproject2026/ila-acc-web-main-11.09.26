import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Briefcase, Globe, Building2, Search, Sparkles, Zap, 
  CheckCircle2, ArrowRight, ShieldCheck, Upload, FileText, 
  Check, AlertCircle, RefreshCw, UserCheck, Clock, DollarSign, 
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Landmark, MapPin, X, 
  User, Mail, Phone, Lock, Eye, Award, TrendingUp, Gift, 
  Compass, HelpCircle, ArrowLeft, ExternalLink, Layers, 
  CheckCircle, Paperclip, Hotel, Database, Wifi, Home, 
  HeartHandshake, Laptop, Stethoscope, Target
} from 'lucide-react';
import { extractRawTextFromFile, parseResumeWithGeminiDirect } from '../../lib/clientDocumentParser';

export interface JobListingItem {
  id: string;
  jobTitle: string;
  companyName: string;
  industry: 'hospitality' | 'business' | 'tech' | 'healthcare' | 'ausbildung';
  country: string;
  city: string;
  salaryRange: string;
  employmentType: string;
  visaEligibility: string;
  languageReq: string;
  minExperience: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  perks: string[];
  matchScore: number;
}

export const SEED_JOB_LISTINGS: JobListingItem[] = [
  {
    id: 'de-job-hosp-mgr',
    jobTitle: 'Operations & Guest Services Manager',
    companyName: 'Grand Hotel & Resort Collection Munich',
    industry: 'hospitality',
    country: 'Germany',
    city: 'Munich (Bavaria)',
    salaryRange: '€48,000 – €58,000 / Year',
    employmentType: 'Full-Time • Permanent',
    visaEligibility: 'EU Blue Card Sponsorship Included',
    languageReq: 'English Fluent • German B1 (Support provided)',
    minExperience: '2–4 Years Experience in Hospitality/Catering',
    description: 'Lead premium front-of-house operations, guest services logistics, and corporate banquet coordination at a five-star luxury hotel in central Munich.',
    responsibilities: [
      'Manage day-to-day front office, concierge, and high-profile guest hospitality operations.',
      'Supervise staff scheduling, training workshops, and VIP international banquet protocols.',
      'Optimize departmental budgets and coordinate with F&B catering administration.'
    ],
    qualifications: [
      'Bachelor of Science in Catering & Hotel Management or Business Administration.',
      'Proven experience in premium hotel or catering operations.',
      'Strong organizational and leadership skills with guest-first mindset.'
    ],
    perks: [
      'Full EU Blue Card sponsorship and relocation assistance package.',
      'Staff accommodation subsidies and complimentary hotel dining.',
      'Fast-track pathway to German Permanent Residency in 21 months.'
    ],
    matchScore: 98
  },
  {
    id: 'de-job-banquet-admin',
    jobTitle: 'Corporate Event & Catering Administrator',
    companyName: 'Kempinski & Accor Alliance Berlin',
    industry: 'hospitality',
    country: 'Germany',
    city: 'Berlin',
    salaryRange: '€44,000 – €52,000 / Year',
    employmentType: 'Full-Time',
    visaEligibility: 'Section 18b Skilled Worker Visa',
    languageReq: 'English Fluent • Basic German A2',
    minExperience: '1–3 Years Experience in Food & Beverage / Administration',
    description: 'Coordinate corporate dining summits, catering supply chain logistics, and client accounts for prestigious diplomatic and corporate functions in Berlin.',
    responsibilities: [
      'Liaise with international corporate clients to design bespoke banquet and catering packages.',
      'Oversee food service quality compliance and vendor procurement contracts.',
      'Draft event balance sheets and handle operational guest feedback systems.'
    ],
    qualifications: [
      'Degree in Hotel Management, Gastronomy Technology, or Business Administration.',
      'Familiarity with event reservation software and banquet cost management.',
      'Professional communication and customer relationship skills.'
    ],
    perks: [
      'Direct visa sponsorship with Berlin Foreigners Authority (Ausländerbehörde).',
      'Annual performance bonus and public transport transit ticket (Deutschlandticket).',
      'International brand transfer options across Germany and Austria.'
    ],
    matchScore: 96
  },
  {
    id: 'de-job-biz-ops',
    jobTitle: 'Business Operations & Financial Analyst',
    companyName: 'Lufthansa & Global Sky Services Frankfurt',
    industry: 'business',
    country: 'Germany',
    city: 'Frankfurt am Main',
    salaryRange: '€54,000 – €66,000 / Year',
    employmentType: 'Full-Time • Permanent',
    visaEligibility: 'EU Blue Card Sponsorship Included',
    languageReq: 'English Fluent (German is a plus)',
    minExperience: '2+ Years in Business Administration / Finance',
    description: 'Analyze operational expenditure, supply procurement, and commercial airline catering logistics for international routes operating out of Frankfurt Hub.',
    responsibilities: [
      'Develop financial models and quarterly budget forecasts for commercial hospitality divisions.',
      'Streamline supply chain logistics with multinational European suppliers.',
      'Present cost-optimization reports directly to executive board leadership.'
    ],
    qualifications: [
      'Postgraduate Certificate in Business Administration or Master of Business Administration.',
      'Proficiency in Excel financial modeling, ERP systems (SAP), and data analytics.',
      'Strong problem-solving and cross-cultural presentation capabilities.'
    ],
    perks: [
      'Immediate EU Blue Card fast-track visa filing through corporate fast-lane.',
      'Heavily discounted international airfare and comprehensive corporate healthcare.',
      'Flexible hybrid working model (2 days remote per week).'
    ],
    matchScore: 95
  },
  {
    id: 'de-job-student-parttime',
    jobTitle: 'International Student Hospitality Associate',
    companyName: 'Marriott International Hamburg & Cologne',
    industry: 'hospitality',
    country: 'Germany',
    city: 'Hamburg / Cologne',
    salaryRange: '€14.50 – €18.00 / Hour (€1,150–€1,450/Mo)',
    employmentType: 'Part-Time Student Track (20 Hrs/Week)',
    visaEligibility: 'Fully Covered Under Student Visa (16b)',
    languageReq: 'English Fluent • Basic German Conversational',
    minExperience: 'Fresher to 1 Year (On-the-job training provided)',
    description: 'Structured flexible student employment designed for university students. Work up to 20 hours per week during semesters with full legal rights and weekend shifts.',
    responsibilities: [
      'Assist guest reception, dining room logistics, and conference hall setup.',
      'Support front-desk inquiries and multilingual international visitor communication.',
      'Maintain quality standards in line with German health and safety regulations.'
    ],
    qualifications: [
      'Enrolled university student at an accredited German or European institution.',
      'Valid student visa (16b) or matriculation certificate.',
      'Enthusiastic attitude with willingness to learn German hospitality standards.'
    ],
    perks: [
      'Flexible scheduling aligned with your university class and examination timetables.',
      'Earn €1,150–€1,450/month to fully cover living and accommodation costs.',
      'Direct pathway to full-time management training contract upon graduation.'
    ],
    matchScore: 94
  },
  {
    id: 'de-job-ausbildung-trade',
    jobTitle: 'Dual Ausbildung Trainee – Hotel & Gastronomy Specialist',
    companyName: 'Bavarian Hospitality Chamber & Partner Resorts',
    industry: 'ausbildung',
    country: 'Germany',
    city: 'Nuremberg / Munich',
    salaryRange: '€1,050 – €1,350 / Month Paid Stipend',
    employmentType: '3-Year Dual Vocational Apprenticeship',
    visaEligibility: 'Section 16a Ausbildung Visa Supported',
    languageReq: 'Mandatory German B1 or B2 Level',
    minExperience: 'Entry-Level / 10+2 / High School Completion',
    description: 'Earn while you learn with zero tuition fees. Combines 70% practical company training in premier German hotels with 30% state vocational schooling (Berufsschule).',
    responsibilities: [
      'Rotate across hotel management, gastronomy catering, wine pairing, and room divisions.',
      'Attend state vocational school 2 days a week to master culinary economics and business law.',
      'Complete official German Chamber of Commerce (IHK) intermediate and final exams.'
    ],
    qualifications: [
      'Completion of 10+2 / High School Diploma or Bachelor degree.',
      'Goethe / Telc / ÖSD German Language Certificate at B1 or B2 level.',
      'Clean background check and dedication to professional hands-on craftsmanship.'
    ],
    perks: [
      'Zero blocked account needed: monthly stipend covers all living expenses.',
      'Subsidized employer staff housing and daily meals provided free of charge.',
      'Over 95% guaranteed transition into permanent full-time employment contracts upon graduation.'
    ],
    matchScore: 93
  },
  {
    id: 'de-job-cloud-sw',
    jobTitle: 'Junior Cloud & DevOps Integration Specialist',
    companyName: 'Siemens Healthineers & Tech Alliance Berlin',
    industry: 'tech',
    country: 'Germany',
    city: 'Berlin / Erlangen',
    salaryRange: '€55,000 – €68,000 / Year',
    employmentType: 'Full-Time • Permanent',
    visaEligibility: 'EU Blue Card Sponsorship Included',
    languageReq: 'English Fluent (No German required)',
    minExperience: '1–3 Years Experience in Software / Cloud Infrastructure',
    description: 'Build enterprise cloud pipelines, containerized microservices, and automated monitoring systems for healthcare and digital technology platforms.',
    responsibilities: [
      'Deploy and maintain AWS/Azure cloud infrastructure using Terraform and Kubernetes.',
      'Implement CI/CD automation pipelines and monitor production system reliability.',
      'Collaborate with international engineering squads in an agile environment.'
    ],
    qualifications: [
      'Bachelor or Master Degree in Computer Science, Software Engineering, or related discipline.',
      'Hands-on experience with Docker, Kubernetes, Python/Go, and cloud architectures.',
      'Solid analytical mindset and passion for scalable European tech systems.'
    ],
    perks: [
      'EU Blue Card fast-track visa sponsorship with 21-month PR settlement.',
      '€3,000 personal learning budget and flexible 100% remote options within Germany.',
      'Top-tier employer retirement contributions and corporate shares program.'
    ],
    matchScore: 91
  }
];

export const JOB_PROMO_SLIDES = [
  {
    id: 'de-corporate-tech',
    country: 'Germany',
    flag: '🇩🇪',
    badge: '€45k–€85k • Direct German Corporate Placement',
    title: 'German Corporate & Engineering Careers: Direct Employer Hire',
    desc: 'Direct placement with verified German Mittelstand enterprises and DAX industry leaders. Guaranteed federal tariff wage scales, pre-cleared ZAV work permit quotas, and sponsored relocation packages with zero recruitment fee salary deductions.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    stat: '€45k–€85k',
    statLabel: 'Tariff-Backed Annual Salaries',
    tags: ['ZAV Fast-Track', 'DAX Enterprises', 'Relocation Sponsored'],
  },
  {
    id: 'de-hospitality-culinary',
    country: 'Germany',
    flag: '🇩🇪',
    badge: 'Luxury Hospitality & Resort Management',
    title: 'European Hotel, Tourism & Culinary Operations Leadership',
    desc: 'Direct supervisory and management placement across leading European hotel groups (Marriott, Kempinski, Steigenberger, Accor). Receive employer accommodation support, subsidized meal benefits, and fast-track EU Blue Card career ladders.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    stat: '€38k–€55k',
    statLabel: 'Hotel & Culinary Operations',
    tags: ['Luxury Hotel Groups', 'Housing Included', 'Tariff Guaranteed'],
  },
  {
    id: 'at-ch-finance-tech',
    country: 'Austria',
    flag: '🇦🇹',
    badge: 'Vienna & Zurich Alpine Enterprise Hubs',
    title: 'Austria Red-White-Red Jobs & Swiss High-Yield Corporate Roles',
    desc: 'Access premier corporate roles in Vienna, Graz, Zurich, and Geneva. Switzerland offers the world’s highest median salaries (CHF 75k–120k) with direct corporate work permit processing and cross-border mobility.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    stat: 'CHF 75k+',
    statLabel: 'Swiss Market Benchmark',
    tags: ['Vienna Corporate Hub', 'Swiss B/L Permits', 'Red-White-Red Card'],
  },
  {
    id: 'uk-ie-tech-business',
    country: 'United Kingdom',
    flag: '🇬🇧',
    badge: 'UK Skilled Worker & Irish Critical Skills',
    title: 'London & Dublin Silicon Docks: Licensed Visa Sponsorship',
    desc: 'Direct employer placement with UK Home Office licensed sponsors and Ireland Critical Skills Employment Permit holders. Expedited permanent residency pathways for software, data, finance, and engineering leaders.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    stat: '£38k–£65k',
    statLabel: 'Direct Sponsor Compensation',
    tags: ['UK Home Office', 'Irish CSEP Track', 'Tech & Business'],
  },
];

export const StudentJobJourney: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Germany');
  const [matchSource, setMatchSource] = useState<'online' | 'database'>('online');

  // Dynamic Right-Panel Promo Slider State
  const [currentPromoSlide, setCurrentPromoSlide] = useState<number>(0);
  const [isPromoPaused, setIsPromoPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPromoPaused) return;
    const timer = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % JOB_PROMO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPromoPaused]);

  const handleNextPromoSlide = () => {
    setCurrentPromoSlide(prev => (prev + 1) % JOB_PROMO_SLIDES.length);
  };

  const handlePrevPromoSlide = () => {
    setCurrentPromoSlide(prev => (prev - 1 + JOB_PROMO_SLIDES.length) % JOB_PROMO_SLIDES.length);
  };
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<string>('all');
  const [jobSearchKeyword, setJobSearchKeyword] = useState<string>('');

  // Resume Upload & Client-Side AI Parsing
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [parsingEngineUsed, setParsingEngineUsed] = useState<string>('');

  // Extended Profile Verification Fields
  const [verifiedName, setVerifiedName] = useState<string>('');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [verifiedEducation, setVerifiedEducation] = useState<string>('');
  const [verifiedWorkExp, setVerifiedWorkExp] = useState<string>('');
  const [targetIndustry, setTargetIndustry] = useState<string>('Hospitality & Hotel Management');
  const [preferredContract, setPreferredContract] = useState<string>('Full-Time Direct Hire');
  const [desiredSalary, setDesiredSalary] = useState<string>('€45,000 – €55,000');

  // Form State
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const [isProfileLocked, setIsProfileLocked] = useState<boolean>(false);

  // Right Panel State Machine: 'hero' | 'matching' | 'results' | 'details' | 'upload' | 'success'
  const [rightPanelState, setRightPanelState] = useState<'hero' | 'matching' | 'results' | 'details' | 'upload' | 'success'>('hero');
  const [matchingStepIndex, setMatchingStepIndex] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<JobListingItem | null>(SEED_JOB_LISTINGS[0]);

  // Lead Tracking & Inquiry
  const [leadTrackingId, setLeadTrackingId] = useState<string>('JOB-DE-2026-442');
  const [applicantCoverNote, setApplicantCoverNote] = useState<string>('');

  // Countries List
  const countries = [
    { id: 'de', name: 'Germany', flag: '🇩🇪' },
    { id: 'at', name: 'Austria', flag: '🇦🇹' },
    { id: 'ch', name: 'Switzerland', flag: '🇨🇭' },
    { id: 'ie', name: 'Ireland', flag: '🇮🇪' },
    { id: 'fr', name: 'France', flag: '🇫🇷' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'ca', name: 'Canada', flag: '🇨🇦' },
    { id: 'au', name: 'Australia', flag: '🇦🇺' },
  ];

  // Validation Checks
  const isNameValid = verifiedName.trim().length >= 2;
  const isEmailValid = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(verifiedEmail.trim());
  const isPhoneValid = (() => {
    const clean = verifiedPhone.replace(/[^\d+]/g, '');
    const digits = clean.replace(/\D/g, '');
    return clean.startsWith('+') && digits.length >= 9 && digits.length <= 15;
  })();
  const isEducationValid = verifiedEducation.trim().length >= 3;
  const isWorkExpValid = verifiedWorkExp.trim().length >= 1;
  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isEducationValid && isWorkExpValid;

  // Client-Side Resume Upload & AI Parsing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsUploading(true);

    try {
      const rawText = await extractRawTextFromFile(file);
      const parsed = await parseResumeWithGeminiDirect(rawText, file.name);

      if (parsed.name) setVerifiedName(parsed.name);
      if (parsed.email) setVerifiedEmail(parsed.email);
      if (parsed.phone) setVerifiedPhone(parsed.phone);
      if (parsed.education) setVerifiedEducation(parsed.education);
      if (parsed.work_experience) setVerifiedWorkExp(parsed.work_experience);
      if (parsed.engineUsed) setParsingEngineUsed(parsed.engineUsed);
    } catch (err) {
      console.error('Client job resume parsing error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Filtered Job Listings
  const filteredJobs = useMemo(() => {
    return SEED_JOB_LISTINGS.filter(j => {
      // Industry filter
      if (industryFilter !== 'all') {
        if (industryFilter === 'hospitality' && j.industry !== 'hospitality') return false;
        if (industryFilter === 'business' && j.industry !== 'business') return false;
        if (industryFilter === 'tech' && j.industry !== 'tech') return false;
        if (industryFilter === 'healthcare' && j.industry !== 'healthcare') return false;
        if (industryFilter === 'ausbildung' && j.industry !== 'ausbildung') return false;
      }

      // Contract filter
      if (contractFilter !== 'all') {
        if (contractFilter === 'fulltime' && !j.employmentType.toLowerCase().includes('full')) return false;
        if (contractFilter === 'parttime' && !j.employmentType.toLowerCase().includes('part')) return false;
        if (contractFilter === 'ausbildung' && !j.employmentType.toLowerCase().includes('ausbildung')) return false;
      }

      // Keyword search
      if (jobSearchKeyword.trim()) {
        const kw = jobSearchKeyword.toLowerCase();
        const match = j.jobTitle.toLowerCase().includes(kw) ||
          j.companyName.toLowerCase().includes(kw) ||
          j.city.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [industryFilter, contractFilter, jobSearchKeyword]);

  // Handle Verify & Match Action
  const handleVerifyAndProceed = () => {
    setHasAttemptedSubmit(true);
    if (!isFormValid) return;

    setIsProfileLocked(true);
    setRightPanelState('matching');
    setMatchingStepIndex(0);

    setTimeout(() => setMatchingStepIndex(1), 600);
    setTimeout(() => setMatchingStepIndex(2), 1200);
    setTimeout(() => {
      setRightPanelState('results');
      if (filteredJobs.length > 0) {
        setSelectedJob(filteredJobs[0]);
      }
    }, 1800);
  };

  // Final Application Submission & Automated Email Dispatch
  const handleFinalSubmit = () => {
    const tracking = `JOB-${selectedCountry.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setLeadTrackingId(tracking);
    setRightPanelState('success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-5 font-sans">
      {/* 1. TOP SPECIALTY & "WHY CHOOSE US" SECTION (DECOUPLED & DISTINCT CONTAINER) */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-10 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 text-slate-900 border-2 border-indigo-100/90 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden ring-1 ring-slate-900/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        
        {/* Top Meta Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct Employer Placement • Zero Recruitment Commission Cuts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Jobs &amp; Careers Hub • Direct European Employer Hiring Gateway
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 self-start lg:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>500+ Verified Corporate Sponsoring Partners</span>
          </div>
        </div>

        {/* Specialty Explanation & 3-Click Process */}
        <div className="grid lg:grid-cols-12 gap-6 pt-5 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Connect directly with verified corporate hiring managers across Germany, Austria, Switzerland, and the EU without predatory recruitment middlemen or salary deduction fees. Access verified <strong className="text-emerald-700 font-bold">visa-sponsored positions</strong>, transparent statutory salary standards (<strong className="text-amber-700 font-bold">€42,000–€85,000/year</strong> across tech, healthcare, engineering, and commerce under German collective bargaining frameworks), legal work permits (<strong className="text-brand-700 font-bold">EU Blue Card fast-track</strong>), and pre-cleared interview tracks.
            </p>
            
            {/* 3-Click Process Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 block mb-1">Step 1 • 10 Seconds</span>
                <p className="text-xs font-bold text-slate-900">Upload Resume / CV</p>
                <p className="text-[11px] text-slate-500 mt-0.5">AI extracts skills &amp; formats into European Europass standard.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">Step 2 • Automated</span>
                <p className="text-xs font-bold text-slate-900">Skill &amp; Wage Audit</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Instant match against corporate quotas and statutory pay tiers.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">Step 3 • 1-Click</span>
                <p className="text-xs font-bold text-slate-900">Employer Direct Dispatch</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct referral to verified HR managers with visa clearance.</p>
              </div>
            </div>

            {/* Why Us Line */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              <span>⭐</span>
              <span><strong className="text-amber-950 font-bold">Why Choose Us:</strong> Direct Corporate Employers • Zero Salary Deductions • Legally Compliant Relocation &amp; EU Blue Card Fast-Track</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              ⚖️ <em>Factual Transparency: Hiring decisions, employment contracts, and exact compensation are established directly by verified employer partners based on candidate technical interviews and statutory labor laws.</em>
            </p>
          </div>

          {/* CTA Button Anchor */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-center items-start lg:items-end gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('job-ats-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto lg:w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group scale-100 hover:scale-[1.02]"
            >
              <span>Connect to Form / Select Country &amp; Apply</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-500 text-left lg:text-right">
              Direct employer matching • Full European labor compliance
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* ANIMATED GLOWING CONTAINER: DEDICATED CAREER TOOL SECTION               */}
      {/* Floating active AI tool with running light/gradient border animation   */}
      {/* ======================================================================= */}
      <div className="max-w-7xl mx-auto ai-tool-glowing-frame">
        <div className="ai-tool-inner-canvas p-4 sm:p-6 lg:p-7 space-y-6">

          {/* Standout Dedicated Tool Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-500/20 via-indigo-500/20 to-purple-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Corporate Network • Direct Employer Connect</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                AI Career Match &amp; Instant Job Registration Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                Autonomously match your professional background with 500+ pre-cleared German and European employers. Verified federal tariff wages (€42k–€85k), ZAV work permits, and zero placement fee salary deductions.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-slate-400">German Federal Tariff</div>
                <div className="text-sm font-black text-emerald-400">Zero Salary Deductions</div>
              </div>
            </div>
          </div>

          {/* MAIN SPLIT-SCREEN CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ===================================================================== */}
        {/* LEFT PANEL: COMPUTER-PROFESSIONAL ATS CAREER APPLICATION FORM CONTAINER*/}
        {/* With integrated country destination selection directly atop the form */}
        {/* ===================================================================== */}
        <div 
          id="job-ats-form"
          className="lg:col-span-5 bg-slate-50 border-2 border-slate-200/90 text-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 ring-1 ring-slate-900/5 scroll-mt-28"
        >
          
          {/* Integrated Country Destination Selection */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-700">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Select Career Destination:</span>
              </span>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                {selectedCountry} Selected
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {countries.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCountry(c.name)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCountry === c.name
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{c.flag || '🌍'}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ATS Form Header & Naming */}
          <div className="pb-3 border-b border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-black uppercase tracking-wider border border-brand-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI-Powered ATS Career Terminal</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Direct Sponsor Portal Active</span>
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Career Direct-Hire ATS Application
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target Destination: <strong className="text-brand-600 font-bold">{selectedCountry}</strong>. Upload your CV/resume to match verified full-time, student 20h, and Ausbildung jobs with visa sponsorship.
            </p>
          </div>

          {/* Left Panel Step Progress */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              !isProfileLocked && !uploadedFileName ? 'bg-brand-600 text-white shadow-md' : 'text-emerald-700 bg-emerald-50'
            }`}>
              1. Resume / CV Upload
            </span>
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              !isProfileLocked && uploadedFileName ? 'bg-brand-600 text-white shadow-md' : isProfileLocked ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'
            }`}>
              2. Profile Verification
            </span>
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              isProfileLocked ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'
            }`}>
              3. Career Profile Verified ✓
            </span>
          </div>

          {/* Sourcing Engine Toggle: Live Search vs Partner Employer Quotas */}
          <div className="space-y-1.5 pb-1">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
              <span>Talent Sourcing Engine:</span>
              <span className="font-bold text-brand-700">
                {matchSource === 'online' ? '🌐 Live EU Job Market' : '🗄️ Partner Employer Tie-Ups'}
              </span>
            </div>

            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setMatchSource('online')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  matchSource === 'online'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>🌐 Live EU Job Market</span>
              </button>

              <button
                type="button"
                onClick={() => setMatchSource('database')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  matchSource === 'database'
                    ? 'bg-slate-900 text-white shadow-md scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>🗄️ Employer Quotas</span>
              </button>
            </div>
          </div>

          {/* Resume Upload & Client-Side AI Parsing */}
          {!isProfileLocked ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Upload Resume / CV:</span>
                  <span className="text-[10px] font-bold text-brand-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Client-Side AI Parser
                  </span>
                </label>

                <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-5 text-center transition-all bg-slate-50/70 hover:bg-brand-50/20 group cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-200 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isUploading ? (
                        <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {isUploading ? 'Extracting Career Profile with Gemini...' : uploadedFileName ? `Uploaded: ${uploadedFileName}` : 'Drop Resume / CV or click to browse'}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        PDF or DOCX • Instant AI extraction of Legal Name, Phone, Degree, Work Exp &amp; Industry
                      </p>
                    </div>
                  </div>
                </div>

                {parsingEngineUsed && (
                  <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Parsed via: {parsingEngineUsed}</span>
                  </div>
                )}
              </div>

              {/* Extended Verification Form */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Verify Candidate Credentials &amp; Preferences:
                </span>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Johnathan Alexander Vance"
                      value={verifiedName}
                      onChange={(e) => setVerifiedName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm ${
                        hasAttemptedSubmit && !isNameValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                          : 'border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {hasAttemptedSubmit && !isNameValid && (
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please enter full legal name.</span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Email * (Automated Updates Sent Here)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. candidate@example.com"
                      value={verifiedEmail}
                      onChange={(e) => setVerifiedEmail(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm ${
                        hasAttemptedSubmit && !isEmailValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                          : 'border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {hasAttemptedSubmit && !isEmailValid && (
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please provide a valid email address.</span>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Phone Number (with Country Code) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="+49 1521 2345678 or +91 9876543210"
                      value={verifiedPhone}
                      onChange={(e) => setVerifiedPhone(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm ${
                        hasAttemptedSubmit && !isPhoneValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                          : 'border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {hasAttemptedSubmit && !isPhoneValid && (
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Include valid international country code (e.g. +49, +91).</span>
                  )}
                </div>

                {/* Highest Education */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Highest Academic Qualification *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Bachelor of Science in Catering and Hotel Management"
                      value={verifiedEducation}
                      onChange={(e) => setVerifiedEducation(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm ${
                        hasAttemptedSubmit && !isEducationValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                          : 'border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {hasAttemptedSubmit && !isEducationValid && (
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please specify academic qualification.</span>
                  )}
                </div>

                {/* Work Experience */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Detailed Work Experience &amp; Specialization *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. 3+ Years in Luxury Hotel Operations &amp; Guest Relations"
                      value={verifiedWorkExp}
                      onChange={(e) => setVerifiedWorkExp(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-sm ${
                        hasAttemptedSubmit && !isWorkExpValid
                          ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                          : 'border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
                      }`}
                    />
                  </div>
                  {hasAttemptedSubmit && !isWorkExpValid && (
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please describe your work background or 'Fresher'.</span>
                  )}
                </div>

                {/* Job Domain / Industry Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Primary Industry
                    </label>
                    <select
                      value={targetIndustry}
                      onChange={(e) => setTargetIndustry(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-sm cursor-pointer"
                    >
                      <option value="Hospitality & Hotel Management">Hospitality &amp; Luxury Hotels</option>
                      <option value="Gastronomy & Catering">Gastronomy &amp; Culinary Arts</option>
                      <option value="Business & Operations">Business &amp; Operations</option>
                      <option value="Cloud & Software Systems">Cloud &amp; Software Tech</option>
                      <option value="Healthcare & Nursing">Healthcare &amp; Clinical Nursing</option>
                      <option value="Dual Ausbildung Apprenticeship">Dual Ausbildung Trainee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Contract Preference
                    </label>
                    <select
                      value={preferredContract}
                      onChange={(e) => setPreferredContract(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-sm cursor-pointer"
                    >
                      <option value="Full-Time Direct Hire">Full-Time Direct Hire</option>
                      <option value="Part-Time Student 20h">Part-Time Student (20h/Wk)</option>
                      <option value="Executive Sponsorship">Executive Sponsorship (Blue Card)</option>
                      <option value="Dual Ausbildung">Dual Ausbildung Apprenticeship</option>
                    </select>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleVerifyAndProceed}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Verify &amp; Match Career Opportunities</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Locked Verified Profile Card */
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Career Profile Verified &amp; Locked
                </span>
                <button
                  type="button"
                  onClick={() => setIsProfileLocked(false)}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-800 underline cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p><span className="text-slate-500 font-medium">Candidate:</span> <strong className="text-slate-900">{verifiedName || 'Verified Candidate'}</strong></p>
                <p><span className="text-slate-500 font-medium">Email:</span> <span className="text-slate-900 font-medium">{verifiedEmail}</span></p>
                <p><span className="text-slate-500 font-medium">Phone:</span> <span className="text-slate-900 font-medium">{verifiedPhone}</span></p>
                <p><span className="text-slate-500 font-medium">Qualification:</span> <span className="text-slate-900 font-medium">{verifiedEducation}</span></p>
                <p><span className="text-slate-500 font-medium">Experience:</span> <span className="text-slate-900 font-medium">{verifiedWorkExp}</span></p>
                <p><span className="text-slate-500 font-medium">Target Domain:</span> <span className="text-brand-700 font-bold bg-brand-50 px-2 py-0.5 rounded border border-brand-200 ml-1 inline-block">{targetIndustry} • {preferredContract}</span></p>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Target Region:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{selectedCountry}</span>
                </span>
              </div>
            </div>
          )}

          {/* Trust Guarantee */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Statutory Minimum Wage (€12.82/hr+)
            </span>
            <span>BAMF &amp; ZAV Registered Employers</span>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* RIGHT PANEL: JOB RESULTS, SUB-NAV, DETAILS, APPLICATION & CONFIRMATION*/}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[680px] flex flex-col justify-between">
          
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
              alt="European Corporate Office & Tech Hub"
              className="w-full h-full object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
          </div>

          {/* Foreground Interactive Content */}
          <div className={`relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full space-y-4 ${rightPanelState === 'results' ? 'overflow-y-auto max-h-[880px] custom-scrollbar' : ''}`}>
            
            <div className={`${rightPanelState === 'results' ? 'py-1' : 'my-auto py-2'}`}>
              
              {/* STATE 1: INITIAL HERO STATE (Dynamic Rotating Promo Slider) */}
              {rightPanelState === 'hero' && (
                <div 
                  className="space-y-5 animate-in fade-in duration-300"
                  onMouseEnter={() => setIsPromoPaused(true)}
                  onMouseLeave={() => setIsPromoPaused(false)}
                >
                  {/* Dynamic Rotating Feature Slide */}
                  {(() => {
                    const slide = JOB_PROMO_SLIDES[currentPromoSlide];
                    return (
                      <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl min-h-[300px] flex flex-col justify-between p-5 sm:p-6 transition-all duration-700">
                        {/* Background Slide Image */}
                        <img
                          key={slide.id}
                          src={slide.image}
                          alt={slide.title}
                          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 opacity-45"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

                        {/* Top Slide Bar: Badge + Progress Indicators + Controls */}
                        <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-300 border border-white/25 text-[11px] font-black uppercase tracking-wider backdrop-blur-md">
                            <span>{slide.flag}</span>
                            <span>{slide.badge}</span>
                          </span>

                          {/* Controls & Slide Counter */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                              0{currentPromoSlide + 1} / 0{JOB_PROMO_SLIDES.length}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handlePrevPromoSlide}
                                aria-label="Previous career slide"
                                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextPromoSlide}
                                aria-label="Next career slide"
                                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Middle Content */}
                        <div className="relative z-10 space-y-2.5 my-4">
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            {slide.title}
                          </h3>
                          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
                            {slide.desc}
                          </p>

                          {/* Quick Metrics & Destination Button */}
                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{slide.stat}: {slide.statLabel}</span>
                            </div>

                            {slide.tags.map(t => (
                              <span key={t} className="px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-300 text-[10px] font-medium border border-white/10">
                                {t}
                              </span>
                            ))}

                            <button
                              type="button"
                              onClick={() => setSelectedCountry(slide.country)}
                              className="ml-auto text-xs font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Set {slide.country} in Form</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Slide Dot Progress Indicators */}
                        <div className="relative z-10 flex items-center gap-1.5 pt-2 border-t border-white/15">
                          {JOB_PROMO_SLIDES.map((s, idx) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setCurrentPromoSlide(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                currentPromoSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                              }`}
                              aria-label={`Jump to slide ${idx + 1}`}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-2">
                            Autoplays every 5.5s • Hover to pause
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4 Feature Highlights */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Award className="w-4 h-4" /> EU Blue Card Direct Hire
                      </div>
                      <h4 className="text-xs font-bold text-white">Full Visa Sponsorship</h4>
                      <p className="text-[10px] text-slate-300">Fast-track employer sponsorship with 21-month Permanent Residency (PR) route.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <DollarSign className="w-4 h-4" /> €12.82/hr+ Min Wage
                      </div>
                      <h4 className="text-xs font-bold text-white">Legal Wage Guarantee</h4>
                      <p className="text-[10px] text-slate-300">All student and full-time contracts comply with statutory German Federal tariff scales.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                        <Briefcase className="w-4 h-4" /> Student 20h Roles
                      </div>
                      <h4 className="text-xs font-bold text-white">Earn €1,150–€1,450/Mo</h4>
                      <p className="text-[10px] text-slate-300">Flexible shifts in premier hotels, catering summits, and tech customer logistics.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                        <Building2 className="w-4 h-4" /> 500+ Partner Network
                      </div>
                      <h4 className="text-xs font-bold text-white">Marriott, Siemens &amp; Accor</h4>
                      <p className="text-[10px] text-slate-300">Direct hiring access with pre-cleared ZAV Federal Employment Agency quotas.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <strong className="text-white block">Ready to explore matched career vacancies?</strong>
                      <span>Fill in your credentials on the left and click "Verify &amp; Match Career Opportunities".</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: MATCHING ANIMATION */}
              {rightPanelState === 'matching' && (
                <div className="p-8 rounded-3xl bg-slate-950/80 border border-brand-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 animate-spin blur-md opacity-75" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-white/20 flex items-center justify-center shadow-inner">
                          <Briefcase className="w-8 h-8 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-black uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        AI Neural Job Compatibility Engine Active
                      </div>
                      <h3 className="text-xl font-black text-white">Scanning Verified Employer Positions in {selectedCountry}</h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        {matchingStepIndex === 0 && "Benchmarking qualification against German DIN 33430 recruitment standards..."}
                        {matchingStepIndex === 1 && `Cross-referencing salary benchmarks & ${selectedCountry} Blue Card salary minimums...`}
                        {matchingStepIndex >= 2 && "Synthesizing optimal hospitality, business operations, and student career vacancies..."}
                      </p>
                    </div>
                  </div>

                  {/* Pulsing Skeleton Loaders */}
                  <div className="space-y-3 pt-2 text-left">
                    <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 animate-pulse space-y-3">
                      <div className="h-4 bg-white/20 rounded-md w-3/4" />
                      <div className="h-3 bg-white/10 rounded-md w-1/2" />
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="h-8 bg-white/10 rounded-md" />
                        <div className="h-8 bg-white/10 rounded-md" />
                        <div className="h-8 bg-white/10 rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-brand-500 via-indigo-400 to-emerald-400 h-full transition-all duration-700 ease-out"
                      style={{ width: matchingStepIndex === 0 ? '35%' : matchingStepIndex === 1 ? '75%' : '100%' }}
                    />
                  </div>
                </div>
              )}

              {/* STATE 3: ALL MATCHED JOB RESULTS RENDERED ON RIGHT PANEL */}
              {rightPanelState === 'results' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Clean Minimalist Header */}
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">Verified Openings in {selectedCountry}</h3>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {filteredJobs.length} Available
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      matchSource === 'online'
                        ? 'text-amber-300 bg-amber-500/15 border-amber-400/30'
                        : 'text-purple-300 bg-purple-500/15 border-purple-400/30'
                    }`}>
                      {matchSource === 'online' ? '🌐 Live EU Job Market' : '🗄️ Partner Employer Quota'}
                    </span>
                  </div>

                  {/* Two Clean Dropdown Menus Placed Side-by-Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Dropdown 1: Industry Filter */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-400" />
                        <span>Industry / Domain</span>
                      </label>
                      <div className="relative">
                        <select
                          value={industryFilter}
                          onChange={(e) => setIndustryFilter(e.target.value)}
                          className="w-full appearance-none bg-slate-900/90 hover:bg-slate-900 border border-white/15 hover:border-brand-400/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all cursor-pointer pr-9 shadow-sm"
                        >
                          <option value="all" className="bg-slate-900 text-white">All Industries</option>
                          <option value="hospitality" className="bg-slate-900 text-white">Hospitality &amp; Luxury Hotels</option>
                          <option value="business" className="bg-slate-900 text-white">Business &amp; Operations</option>
                          <option value="tech" className="bg-slate-900 text-white">Software &amp; Cloud Tech</option>
                          <option value="ausbildung" className="bg-slate-900 text-white">Dual Ausbildung Traineeships</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Dropdown 2: Contract Type */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Contract Type</span>
                      </label>
                      <div className="relative">
                        <select
                          value={contractFilter}
                          onChange={(e) => setContractFilter(e.target.value)}
                          className="w-full appearance-none bg-slate-900/90 hover:bg-slate-900 border border-white/15 hover:border-brand-400/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all cursor-pointer pr-9 shadow-sm"
                        >
                          <option value="all" className="bg-slate-900 text-white">All Contract Types</option>
                          <option value="fulltime" className="bg-slate-900 text-white">Full-Time (Blue Card Eligible)</option>
                          <option value="parttime" className="bg-slate-900 text-white">Part-Time Student Track (20h)</option>
                          <option value="ausbildung" className="bg-slate-900 text-white">Dual Vocational Ausbildung</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Compact Keyword Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter jobs by keyword (e.g. Hotel, Manager, Operations, Student, Munich)..."
                      value={jobSearchKeyword}
                      onChange={(e) => setJobSearchKeyword(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-brand-400 text-white placeholder-slate-400 transition-colors"
                    />
                  </div>

                  {/* Compact Job Result Cards (Tiles): Approx. 2 inches height (~76px), full width, core info, click to expand */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredJobs.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 text-xs">
                        No positions found matching your criteria. Try choosing "All Industries" or clearing the search keyword.
                      </div>
                    ) : (
                      filteredJobs.map((j, idx) => {
                        const matchPct = idx === 0 ? 98 : idx === 1 ? 96 : idx === 2 ? 95 : Math.max(88, 92 - idx * 2);

                        return (
                          <div
                            key={j.id}
                            onClick={() => {
                              setSelectedJob(j);
                              setRightPanelState('details');
                            }}
                            className="w-full min-h-[72px] sm:h-[78px] px-3.5 py-2.5 rounded-xl bg-slate-900/75 hover:bg-slate-800/90 border border-white/10 hover:border-brand-400/80 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md flex items-center justify-between gap-3 text-left select-none"
                            title="Click anywhere to review full job description, compensation breakdown, and apply"
                          >
                            {/* Company Icon */}
                            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-brand-300 group-hover:border-brand-400/40 group-hover:bg-brand-500/15 transition-all shrink-0">
                              {j.industry === 'hospitality' && <Hotel className="w-4 h-4" />}
                              {j.industry === 'business' && <TrendingUp className="w-4 h-4" />}
                              {j.industry === 'tech' && <Laptop className="w-4 h-4" />}
                              {j.industry === 'healthcare' && <Stethoscope className="w-4 h-4" />}
                              {j.industry === 'ausbildung' && <Award className="w-4 h-4" />}
                            </div>

                            {/* Core Info: Title + Meta */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {j.jobTitle}
                                </h4>
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 shrink-0">
                                  {j.industry}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                                <span className="text-slate-300 font-medium truncate max-w-[150px]">{j.companyName}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-emerald-400 font-semibold">{j.salaryRange}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-300">{j.city}</span>
                              </div>
                            </div>

                            {/* Match Indicator & Expand Chevron */}
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-bold flex items-center gap-1">
                                ★ {matchPct}% Match
                              </span>
                              <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-brand-500 group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* STATE 4: JOB DETAILS VIEW ON RIGHT PANEL */}
              {rightPanelState === 'details' && selectedJob && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('results')}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Results
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider">
                      ★ 98% Profile Match
                    </span>
                  </div>

                  {/* Header */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-brand-400 block">
                      {selectedJob.companyName} • {selectedJob.city}, {selectedJob.country}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {selectedJob.jobTitle}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* 3 Metrics Pillars */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        Compensation
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                        {selectedJob.salaryRange}
                      </h4>
                      <span className="text-[9px] text-slate-400">{selectedJob.employmentType}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Visa Support
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                        {selectedJob.visaEligibility}
                      </h4>
                      <span className="text-[9px] text-slate-400">Employer Sponsoring</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                        Language Benchmark
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                        {selectedJob.languageReq}
                      </h4>
                      <span className="text-[9px] text-slate-400">Min {selectedJob.minExperience}</span>
                    </div>
                  </div>

                  {/* Key Responsibilities */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 block">
                      Core Responsibilities &amp; Day-to-Day Scope
                    </span>
                    <div className="space-y-1.5 text-[11px] text-slate-300">
                      {selectedJob.responsibilities.map((resp, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Perks & Benefits */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Employer Sponsoring &amp; Corporate Benefits:
                    </span>
                    <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                      {selectedJob.perks.map((prk, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                          <span className="truncate">{prk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proceed to Application */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('upload')}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Apply for {selectedJob.jobTitle.slice(0, 32)}...</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 5: APPLICATION & EMAIL INQUIRY DOSSIER */}
              {rightPanelState === 'upload' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                      Application &amp; Automated Email Notification
                    </span>
                    <button
                      type="button"
                      onClick={() => setRightPanelState('details')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Job Details
                    </button>
                  </div>

                  {selectedJob && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-white">{selectedJob.jobTitle}</h4>
                        <p className="text-[10px] text-slate-400">{selectedJob.companyName} • {selectedJob.city} • {selectedJob.salaryRange}</p>
                      </div>
                    </div>
                  )}

                  {/* Personal Cover Note */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Personal Statement / Message to Hiring Manager (Optional):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly mention your hospitality background, catering credentials, and earliest start date..."
                      value={applicantCoverNote}
                      onChange={(e) => setApplicantCoverNote(e.target.value)}
                      className="w-full p-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-brand-400 resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center gap-2.5 text-xs text-slate-300">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Submitting this inquiry will immediately dispatch an automated confirmation email to <strong className="text-white">{verifiedEmail || 'your email'}</strong> with your application tracking dossier.
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Application &amp; Send Automated Email</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 6: FINAL SUCCESS & EMAIL CONFIRMATION */}
              {rightPanelState === 'success' && (
                <div className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-300 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9 animate-bounce" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                      Application Submitted &amp; Email Dispatched
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Your application is successful, and an automated email update has been sent!
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      A full tracking dossier has been emailed to <strong className="text-white">{verifiedEmail || 'your email'}</strong>. Our European talent recruitment desk in Berlin will review your credentials and contact you within 24 hours.
                    </p>
                  </div>

                  {/* Application Details */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-left text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Application Tracking ID:</span>
                      <span className="font-mono font-bold text-brand-400">{leadTrackingId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Applied Role:</span>
                      <span className="font-bold text-white truncate max-w-[220px]">
                        {selectedJob ? selectedJob.jobTitle : 'Hospitality Operations Manager'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Target Employer:</span>
                      <span className="font-bold text-emerald-400">{selectedJob ? selectedJob.companyName : 'Grand Hotel & Resort Munich'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Automated Notification Status:</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Dispatched to Candidate
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('results')}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Browse More Career Positions
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Panel Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>German Federal Tariff &amp; Minimum Wage Guaranteed</span>
              </span>
              <span>Direct ZAV Pre-Cleared Hiring Quotas</span>
            </div>

          </div>

        </div>

      </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION DIVIDER: CLEAR VISUAL SEPARATION                                  */}
      {/* Demarcates the end of the interactive matcher and start of the blueprint */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-10 flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-amber-500/40" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-brand-500/30 text-xs font-bold text-amber-300 uppercase tracking-widest shadow-lg shadow-brand-500/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Destination Intelligence &amp; Statutory Employment Blueprint</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-500/40 via-brand-500/40 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 1. GERMAN CAREER & EMPLOYMENT BENEFITS (DISTINCT CONTRASTING CONTAINER)   */}
      {/* ========================================================================= */}
      <div id="job-benefits-section" className="max-w-7xl mx-auto mt-4 scroll-mt-28">
        <JobDestinationInsightsSection 
          country={selectedCountry}
          industry={industryFilter}
          contractType={contractFilter}
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION DIVIDER: CLEAR VISUAL SEPARATION                                  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-10 flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-emerald-500/40" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-xs font-bold text-emerald-300 uppercase tracking-widest shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>✦ Other Support &amp; Services Available ✦ • Complete Placement &amp; Relocation Ecosystem</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/40 via-indigo-500/40 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. OTHER SUPPORT & SERVICES AVAILABLE (DISTINCT CONTRASTING CONTAINER)    */}
      {/* ========================================================================= */}
      <div id="job-support-section" className="max-w-7xl mx-auto mt-4 scroll-mt-28">
        <JobSupportServicesSection country={selectedCountry} />
      </div>

    </div>
  );
};

// =============================================================================
// SUB-COMPONENT: CAREER DESTINATION INSIGHTS (CLIENT-SIDE AI POWERED)
// =============================================================================

export const JobDestinationInsightsSection: React.FC<{
  country: string;
  industry: string;
  contractType: string;
}> = ({ country, industry, contractType }) => {
  const [activeTab, setActiveTab] = useState<'workrights' | 'sectors' | 'pipeline'>('workrights');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isLiveAi, setIsLiveAi] = useState<boolean>(false);

  const handleManualRegenerate = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setIsLiveAi(true);
    }, 900);
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-brand-500/25 border-t-4 border-t-amber-400 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">🇩🇪</span>
            <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>{country === 'Germany' ? 'German Career Benefits & Employment Blueprint' : `${country} Career Benefits`}</span>
              <span className="text-xs font-normal text-slate-400">&amp; Workplace Rights</span>
            </h3>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-emerald-500/20 text-brand-300 border border-brand-400/30 text-[10px] font-bold">
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                  <span className="text-amber-300">Gemini Career AI Generating...</span>
                </>
              ) : isLiveAi ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span className="text-emerald-300">✨ Live Gemini AI Context</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-brand-400" />
                  <span>⚡ Instant Client Engine</span>
                </>
              )}
            </span>

            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
              EU Blue Card • PR in 21 Mo
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Statutory employment rights, wage protections, and fast-track German residency pathways for international professionals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRegenerate}
            disabled={isAiLoading}
            className="text-[11px] font-semibold text-brand-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/25 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isAiLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Regenerate AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* 3 Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('workrights')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'workrights'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Work Rights &amp; Blue Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sectors')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'sectors'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Industry Sectors &amp; Wages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Hiring Pipeline &amp; Standards</span>
            </button>
          </div>

          {/* Tab 1: Work Rights */}
          {activeTab === 'workrights' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">EU Blue Card Fast-Track PR in 21 Months</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Holders of the German EU Blue Card can apply for German permanent settlement (Niederlassungserlaubnis) in only 21 months with B1 German (or 27 months with basic A1 German).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white">Statutory Minimum Wage (€12.82/Hour)</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every employment contract in Germany is legally protected by the Federal Minimum Wage Commission, guaranteeing fair compensation, overtime premiums, and paid annual leave (minimum 20–24 days).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white">Student Work Rights (20 Hours / Week)</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  International students possess legal authorization to work up to 140 full days (or 280 half days) per calendar year, easily generating €1,150–€1,450/month in hotel and business administration roles.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">Immediate Spousal Open Work Permit</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Spouses of EU Blue Card and skilled professionals in Germany are granted unrestricted open work permits from day 1 with no German language requirement prior to arrival.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Sectors */}
          {activeTab === 'sectors' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Hospitality &amp; Luxury Hotels
                </span>
                <h4 className="text-xs font-black text-white">Operations, Concierge &amp; Catering</h4>
                <div className="text-xs font-bold text-emerald-400">€44,000 – €58,000 / Year</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Direct recruitment by Marriott, Accor, Kempinski, and Hilton.</li>
                  <li>• High demand for Catering &amp; Hotel Management graduates.</li>
                  <li>• Relocation packages and housing subsidies available.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  Business &amp; Finance Operations
                </span>
                <h4 className="text-xs font-black text-white">Logistics, Analytics &amp; Administration</h4>
                <div className="text-xs font-bold text-brand-400">€52,000 – €66,000 / Year</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Lufthansa, Siemens, and DAX corporate enterprise contracts.</li>
                  <li>• 100% English-medium corporate working environments.</li>
                  <li>• Direct Blue Card visa fast-track through ZAV.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Dual Ausbildung Traineeships
                </span>
                <h4 className="text-xs font-black text-white">Earn While You Learn Apprenticeships</h4>
                <div className="text-xs font-bold text-amber-400">€1,050 – €1,350/Mo Paid Stipend</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Zero tuition debt; company covers entire training.</li>
                  <li>• 70% practical company shifts + 30% vocational schooling.</li>
                  <li>• 95%+ permanent employment absorption upon graduation.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Pipeline */}
          {activeTab === 'pipeline' && (
            <div className="space-y-3">
              {[
                {
                  title: 'German DIN-Standard Curriculum Vitae (Lebenslauf)',
                  reqs: 'Tabular format, professional headshot, chronological education & work details',
                  steps: 'Format CV according to DIN 33430 → Submit candidate profile to hiring employer → Employer shortlisting.'
                },
                {
                  title: 'Employer Video Interview & Offer of Employment',
                  reqs: 'Technical interview with Department Head + HR discussion regarding start date',
                  steps: 'Conduct virtual interview → Receive binding employment offer → Employer submits contract to ZAV for preliminary clearance.'
                },
                {
                  title: 'Fast-Track Visa Filing & On-Ground Onboarding',
                  reqs: 'Declaration of Employment Relationship (Erklärung zum Beschäftigungsverhältnis) + Degree Equivalence',
                  steps: 'ZAV pre-approval issued within 10–14 days → Fast-track embassy visa interview → Arrival in Germany & Anmeldung.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/75 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  </div>
                  <div className="text-[11px] text-slate-300 pl-7">
                    <p><strong className="text-amber-400">Standard:</strong> {item.reqs}</p>
                    <p><strong className="text-emerald-400">Pipeline:</strong> {item.steps}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// =============================================================================
// SUB-COMPONENT: OTHER SUPPORT & SERVICES AVAILABLE (CAREERS)
// =============================================================================

export const JobSupportServicesSection: React.FC<{ country: string }> = ({ country }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-900 border-2 border-emerald-500/20 border-t-4 border-t-emerald-400 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      <div className="text-left space-y-1 relative z-10 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 text-[10px] font-bold uppercase tracking-wider mb-1">
          <HeartHandshake className="w-3.5 h-3.5 text-brand-400" />
          <span>Full-Lifecycle Ecosystem</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Other Support &amp; Services Available
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          From professional DIN-format CV structuring and ZAV labor pre-clearance to airport arrival and corporate contract negotiation, our full European recruitment desk handles every milestone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {[
          {
            icon: Home,
            title: "Corporate Relocation & Housing",
            desc: "Assistance with initial corporate apartments, WG flatshares, and in-person airport reception across major German cities.",
            tag: "Arrival Care",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30"
          },
          {
            icon: Landmark,
            title: "German Bank Account & Tax ID",
            desc: "Immediate guidance for German IBAN setup (N26/Sparkasse), statutory tax identification number, and social security registration.",
            tag: "Finance & Tax",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          },
          {
            icon: Briefcase,
            title: "DIN-Standard CV Optimization",
            desc: "Expert German Lebenslauf formatting, keyword optimization, and professional German cover letter (Anschreiben) preparation.",
            tag: "Career Dossier",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30"
          },
          {
            icon: ShieldCheck,
            title: "EU Blue Card Visa Fast-Track",
            desc: "Direct coordination with the Federal Employment Agency (ZAV) for employer contract pre-approval and priority visa slots.",
            tag: "Immigration Fast-Lane",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30"
          },
          {
            icon: FileText,
            title: "ZAB Degree Equivalence Statements",
            desc: "Official statement of comparability via ZAB (Zentralstelle für ausländisches Bildungswesen) to unlock skilled worker salaries.",
            tag: "Accreditation",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
          },
          {
            icon: HeartHandshake,
            title: "City Registration (Anmeldung)",
            desc: "In-person appointment booking and guidance for German municipal city hall registration (Anmeldung) upon arrival.",
            tag: "Settlement Support",
            badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30"
          }
        ].map((srv, idx) => {
          const SrvIcon = srv.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-brand-400/60 transition-all duration-200 group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-brand-300 group-hover:bg-brand-500/15 group-hover:border-brand-400/40 transition-all">
                    <SrvIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${srv.badgeColor}`}>
                    {srv.tag}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {srv.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#applications?tab=Jobs%20and%20Careers';
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-brand-600 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 hover:border-brand-500"
                >
                  <span>Request Support</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-r from-brand-950 via-indigo-950 to-slate-900 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xl">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white">Ready to Land Your Dream Job in {country}?</h3>
          <p className="text-xs text-slate-300">Submit your career dossier now for free profile evaluation and direct placement shortlisting.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#applications?tab=Jobs%20and%20Careers';
          }}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
        >
          <span>Apply for Career Placement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

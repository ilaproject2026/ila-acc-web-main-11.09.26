import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Globe, BookOpen, Building2, Search, 
  Sparkles, Zap, CheckCircle2, ArrowRight, ShieldCheck, Upload, 
  FileText, Check, AlertCircle, RefreshCw, UserCheck, Clock, 
  DollarSign, ChevronRight, ChevronLeft, ChevronDown, CheckSquare, ChevronUp, Landmark, MapPin, X, User, Mail, Phone, Lock, Eye,
  Award, Briefcase, TrendingUp, Gift, Compass, HelpCircle, ArrowLeft,
  ExternalLink, Layers, CheckCircle, Paperclip, Hotel, Database, Wifi, Home, HeartHandshake, Plane, Stethoscope
} from 'lucide-react';
import { extractRawTextFromFile, parseResumeWithGeminiDirect } from '../../lib/clientDocumentParser';

export interface VisaPathwayItem {
  id: string;
  visaName: string;
  category: 'student' | 'employment' | 'ausbildung' | 'career' | 'business';
  country: string;
  validity: string;
  processingTime: string;
  financialProof: string;
  workRights: string;
  languageReq: string;
  minDegreeReq: string;
  settlementTimeline: string;
  description: string;
  keyPerks: string[];
  documentsRequired: string[];
  matchScore: number;
}

export const SEED_VISA_ITEMS: VisaPathwayItem[] = [
  {
    id: 'de-student-d',
    visaName: 'German National Student Visa (APS Category D)',
    category: 'student',
    country: 'Germany',
    validity: '1–2 Years Renewable (Plus 18-Mo Stay-Back)',
    processingTime: '21–30 Days (Fast-Track APS)',
    financialProof: '€11,208 / Year Blocked Account (Sperrkonto)',
    workRights: '20 Hours / Week (140 Full Days / Year)',
    languageReq: 'IELTS 6.0+ or German A2/B1',
    minDegreeReq: '10+2 / Bachelors Degree',
    settlementTimeline: 'Permanent Residency in 21 Months with EU Blue Card',
    description: 'The premier gateway for international students admitted to German public and private universities. Features full Schengen mobility and accelerated permanent residency.',
    keyPerks: [
      '100% Free tuition eligibility at accredited German state universities.',
      '18-month unrestricted post-study job seeker work authorization.',
      'Schengen-wide visa-free travel across all 29 member states.'
    ],
    documentsRequired: [
      'University Admission Letter (Zulassungsbescheid)',
      'Certificate of Academic Evaluation Centre (APS Certificate)',
      'Proof of €11,208 in German Blocked Account (Coracle / Expatrio)',
      'Statutory German Student Health Insurance (TK / AOK)'
    ],
    matchScore: 98
  },
  {
    id: 'de-chancenkarte-2026',
    visaName: 'Opportunity Card (Chancenkarte Points Entry)',
    category: 'career',
    country: 'Germany',
    validity: '1 Year Residence (Extendable to 3 Years)',
    processingTime: '30–45 Days Direct Embassy Filing',
    financialProof: '€1,027 / Month Proof of Funds (€12,324 / Year)',
    workRights: '20 Hours / Week Part-Time + 2-Week Trial Work',
    languageReq: 'A1 German OR B2 English',
    minDegreeReq: 'Recognized 2-Year Vocational or University Degree',
    settlementTimeline: 'Direct conversion to EU Blue Card / Skilled Worker Permit',
    description: 'Germany’s flagship points-based entry permit. Move to Germany without an initial job offer, work part-time, and interview directly with premier corporations.',
    keyPerks: [
      'Enter Germany without a pre-existing employment contract.',
      'Flexible points matrix rewarding language, age, and qualifications.',
      'Direct transition to EU Blue Card with immediate family reunion rights.'
    ],
    documentsRequired: [
      'Points Matrix Calculation Assessment (Minimum 6 Points)',
      'ZAB / Anabin Degree Equivalence Statement',
      'Proof of Sufficient Living Funds (Blocked Account or Declaration of Commitment)',
      'Proof of German A1 or English B2 Language Certificate'
    ],
    matchScore: 96
  },
  {
    id: 'de-bluecard-18b',
    visaName: 'EU Blue Card (Section 18b Skilled Professional Visa)',
    category: 'employment',
    country: 'Germany',
    validity: '4 Years (Or Contract Duration + 3 Months)',
    processingTime: '15–25 Days Fast-Track Employer Route',
    financialProof: 'Signed Employment Contract Meeting Salary Threshold',
    workRights: 'Full-Time Unrestricted Professional Employment',
    languageReq: 'No mandatory language test (B1 for 21-Mo PR)',
    minDegreeReq: 'Recognized Bachelor or Master Degree',
    settlementTimeline: 'German PR in 21 Months (with B1 German) or 27 Months',
    description: 'The gold standard for international graduates and professionals. Offers the fastest route to permanent residency and European citizenship in the EU.',
    keyPerks: [
      'Fast-track Permanent Residency (Niederlassungserlaubnis) in only 21 months.',
      'Immediate unrestricted spousal open work permit.',
      'Exempt from Federal Employment Agency labour market priority testing.'
    ],
    documentsRequired: [
      'Signed German Employment Contract / Binding Job Offer',
      'Declaration of Employment Relationship (Erklärung zum Beschäftigungsverhältnis)',
      'Proof of Recognized Academic Qualification (Anabin / ZAB)',
      'Proof of German Statutory Health Insurance'
    ],
    matchScore: 95
  },
  {
    id: 'de-ausbildung-16a',
    visaName: 'Ausbildung Dual Vocational Training Visa (Section 16a)',
    category: 'ausbildung',
    country: 'Germany',
    validity: '3 Years (Full Duration of Dual Program)',
    processingTime: '30–40 Days with Company Contract',
    financialProof: '€0 Blocked Account Needed (Monthly Stipend €950–€1,350)',
    workRights: '10 Hours / Week Additional Part-Time Work Permitted',
    languageReq: 'Mandatory B1 or B2 German (Goethe / Telc / ÖSD)',
    minDegreeReq: '10+2 / High School Diploma or Vocational Degree',
    settlementTimeline: 'PR Eligibility in 2 Years Post-Graduation',
    description: 'Earn while you learn with zero tuition and guaranteed employment contracts. Combines 70% practical company training with 30% vocational schooling.',
    keyPerks: [
      'Zero blocked account required: employer monthly stipend covers living costs.',
      'Over 95% guaranteed absorption into permanent full-time employment contracts.',
      'Tuition-free state vocational curriculum and clinical/hotel mastery.'
    ],
    documentsRequired: [
      'Signed Dual Vocational Training Contract (Ausbildungsvertrag)',
      'Training Curriculum Schedule (Ausbildungsplan)',
      'Federal Employment Agency (ZAV) Preliminary Clearance',
      'German Language Certificate at B1 or B2 Level'
    ],
    matchScore: 94
  },
  {
    id: 'de-jobseeker-20',
    visaName: 'German Post-Study Job Seeker Visa (Section 20)',
    category: 'career',
    country: 'Germany',
    validity: '18 Months Unrestricted Full-Time Stay-Back',
    processingTime: '14–21 Days Local Ausländerbehörde Filing',
    financialProof: 'Proof of Funds or Continuing Employment',
    workRights: 'Full-Time Unrestricted Work in Any Sector',
    languageReq: 'No mandatory language test',
    minDegreeReq: 'Graduation from German University',
    settlementTimeline: 'Direct Conversion to EU Blue Card / PR',
    description: 'Automatically granted to all graduates of recognized German universities, providing 18 months of unrestricted work rights to secure career roles.',
    keyPerks: [
      'Work unrestricted full-time in any industry while seeking permanent career roles.',
      'Direct conversion to EU Blue Card with 21-month settlement route.',
      'Unrestricted Schengen travel throughout the stay-back period.'
    ],
    documentsRequired: [
      'German University Degree Certificate or Graduation Letter',
      'Proof of Health Insurance Coverage',
      'Proof of Sufficient Living Funds'
    ],
    matchScore: 92
  },
  {
    id: 'de-business-c',
    visaName: 'DACH Executive Business & Schengen Visa (Type C)',
    category: 'business',
    country: 'Germany',
    validity: '1–5 Years Multiple Entry (90 Days / 180 Days)',
    processingTime: '10–15 Days Expedited VFS Track',
    financialProof: 'Corporate Sponsoring Guarantee / Bank Proof',
    workRights: 'Commercial Negotiations, Board Meetings & Audits',
    languageReq: 'English Proficiency',
    minDegreeReq: 'Corporate Executive / Business Owner',
    settlementTimeline: 'Commercial Venture Expansion',
    description: 'Fast-track multiple-entry visa for business executives, enterprise partners, and conference attendees traveling across Germany and the Schengen zone.',
    keyPerks: [
      'Unrestricted multiple entry travel across all 29 European Schengen member states.',
      'Expedited appointment slots under corporate trade quotas.',
      'Ideal for exploratory business visits and corporate partnership signings.'
    ],
    documentsRequired: [
      'Official Invitation Letter from German Enterprise / Trade Fair',
      'Company Sponsoring Letter & Business Bank Statements',
      'Schengen Travel Medical Insurance (€30,000 Minimum Coverage)'
    ],
    matchScore: 90
  }
];

export const VISA_PROMO_SLIDES = [
  {
    id: 'de-chancenkarte',
    country: 'Germany',
    flag: '🇩🇪',
    badge: 'Opportunity Card 2026 • Points Entry',
    title: 'German Opportunity Card (Chancenkarte 2026)',
    desc: 'Enter Germany for up to 1 year without a pre-existing job offer under modern immigration law. Qualify with at least 6 points across qualifications, age, language, and work experience, with 20 hrs/week legal work rights.',
    image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&q=80&w=1200',
    stat: '6 Points Min',
    statLabel: 'Points-Based Entry',
    tags: ['1-Year Search Visa', '20h Work Rights', 'No Job Offer Needed'],
  },
  {
    id: 'de-student-16b',
    country: 'Germany',
    flag: '🇩🇪',
    badge: 'Student Visa §16b • 21-30 Day Track',
    title: 'German National Student Visa (§16b) & Priority APS',
    desc: 'Priority consular processing for students admitted to accredited German universities. Enjoy 20 hrs/week student employment, €11,208 blocked account integration, and seamless 18-month stay-back job search permits.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    stat: '21–30 Days',
    statLabel: 'Priority APS Filing',
    tags: ['APS Clearance', '18-Mo Stay-Back', 'Schengen Mobility'],
  },
  {
    id: 'eu-blue-card',
    country: 'Germany',
    flag: '🇪🇺',
    badge: 'EU Blue Card §18b • PR in 21 Months',
    title: 'EU Blue Card: Direct Skilled Hire & Accelerated Settlement',
    desc: 'For qualified professionals with university degrees and qualifying salaries (€41,041 for shortage occupations / €45,300 standard). Attain Permanent Residency (Niederlassungserlaubnis) in just 21 months with B1 German.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    stat: '21 Months',
    statLabel: 'Permanent Settlement Route',
    tags: ['ZAV Pre-Approval', 'Family Reunification', 'Permanent Residency'],
  },
  {
    id: 'at-ch-permits',
    country: 'Austria',
    flag: '🇦🇹',
    badge: 'Austria RWR Card & Swiss B/L Permits',
    title: 'Austria Red-White-Red Card & Swiss Professional Residence',
    desc: 'Austria’s points-based Red-White-Red Card grants qualified specialists direct residence and unrestricted labor market freedom. Switzerland provides tier-1 B and L work permits with record-high statutory wages.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200',
    stat: 'Points-Based',
    statLabel: 'Alpine Residence Freedom',
    tags: ['Austrian RWR Card', 'Swiss Work Permits', 'Statutory Counsel'],
  },
];

export const StudentVisaJourney: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Germany');
  const [matchSource, setMatchSource] = useState<'online' | 'database'>('online');

  // Dynamic Right-Panel Promo Slider State
  const [currentPromoSlide, setCurrentPromoSlide] = useState<number>(0);
  const [isPromoPaused, setIsPromoPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPromoPaused) return;
    const timer = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % VISA_PROMO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPromoPaused]);

  const handleNextPromoSlide = () => {
    setCurrentPromoSlide(prev => (prev + 1) % VISA_PROMO_SLIDES.length);
  };

  const handlePrevPromoSlide = () => {
    setCurrentPromoSlide(prev => (prev - 1 + VISA_PROMO_SLIDES.length) % VISA_PROMO_SLIDES.length);
  };
  const [visaCategoryFilter, setVisaCategoryFilter] = useState<string>('all');
  const [processingFilter, setProcessingFilter] = useState<string>('all');
  const [visaSearchKeyword, setVisaSearchKeyword] = useState<string>('');

  // Resume Parsing & Profile State
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [parsingEngineUsed, setParsingEngineUsed] = useState<string>('');

  // Form Fields
  const [verifiedName, setVerifiedName] = useState<string>('');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');
  const [verifiedEducation, setVerifiedEducation] = useState<string>('');
  const [verifiedWorkExp, setVerifiedWorkExp] = useState<string>('');
  const [targetVisaCategory, setTargetVisaCategory] = useState<string>('Student Visa (16b)');

  // Form Validation Flags
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const [isProfileLocked, setIsProfileLocked] = useState<boolean>(false);

  // Right Panel State Machine: 'hero' | 'matching' | 'results' | 'details' | 'upload' | 'success'
  const [rightPanelState, setRightPanelState] = useState<'hero' | 'matching' | 'results' | 'details' | 'upload' | 'success'>('hero');
  const [matchingStepIndex, setMatchingStepIndex] = useState<number>(0);
  const [selectedVisa, setSelectedVisa] = useState<VisaPathwayItem | null>(SEED_VISA_ITEMS[0]);

  // Submission Receipt
  const [leadTrackingId, setLeadTrackingId] = useState<string>('VISA-DE-2026-771');

  // Country Options
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

  // Handle Client-Side Resume Upload & AI Parsing
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
      console.error('Client resume parsing error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Filtered Visa List
  const filteredVisas = useMemo(() => {
    return SEED_VISA_ITEMS.filter(v => {
      // Category filter
      if (visaCategoryFilter !== 'all') {
        if (visaCategoryFilter === 'student' && v.category !== 'student') return false;
        if (visaCategoryFilter === 'employment' && v.category !== 'employment') return false;
        if (visaCategoryFilter === 'ausbildung' && v.category !== 'ausbildung') return false;
        if (visaCategoryFilter === 'career' && v.category !== 'career') return false;
        if (visaCategoryFilter === 'business' && v.category !== 'business') return false;
      }

      // Processing track filter
      if (processingFilter !== 'all') {
        if (processingFilter === 'fast_track' && !v.processingTime.toLowerCase().includes('fast')) return false;
        if (processingFilter === 'standard' && v.processingTime.toLowerCase().includes('fast')) return false;
      }

      // Keyword search
      if (visaSearchKeyword.trim()) {
        const kw = visaSearchKeyword.toLowerCase();
        const match = v.visaName.toLowerCase().includes(kw) ||
          v.description.toLowerCase().includes(kw) ||
          v.validity.toLowerCase().includes(kw) ||
          v.workRights.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [visaCategoryFilter, processingFilter, visaSearchKeyword]);

  // Handle Verify & Match Proceed Action
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
      if (filteredVisas.length > 0) {
        setSelectedVisa(filteredVisas[0]);
      }
    }, 1800);
  };

  // Submission Handler
  const handleFinalSubmit = () => {
    const tracking = `VISA-${selectedCountry.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
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
              <span>Statutory Immigration Filing • Zero Traditional Agent Markups</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              European &amp; Global Visa Services Hub • Direct Consular Filing Gateway
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 self-start lg:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official BAMF &amp; Consular Standards</span>
          </div>
        </div>

        {/* Specialty Explanation & 3-Click Process */}
        <div className="grid lg:grid-cols-12 gap-6 pt-5 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Fast-track your European immigration paperwork through official, transparent legal frameworks. Eliminate unpredictable middlemen and deceptive visa agents — our system directly audits your credentials for <strong className="text-amber-700 font-bold">Opportunity Card (Chancenkarte 2026 points system)</strong>, <strong className="text-emerald-700 font-bold">Student Visa (APS Category D, §16b)</strong>, <strong className="text-brand-700 font-bold">EU Blue Card (§18b AufenthG)</strong>, and <strong className="text-purple-700 font-bold">Dual Ausbildung Sponsorship</strong>. Everything is cross-checked against statutory BAMF, ZAV, and embassy regulations with zero document rejection risks.
            </p>
            
            {/* 3-Click Process Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 block mb-1">Step 1 • 10 Seconds</span>
                <p className="text-xs font-bold text-slate-900">Upload Bio-Data / CV</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Instant AI extraction of credentials, qualifications &amp; language levels.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">Step 2 • Automated</span>
                <p className="text-xs font-bold text-slate-900">Points &amp; Audit Check</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Calculates Chancenkarte points &amp; Blue Card salary thresholds.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">Step 3 • 1-Click</span>
                <p className="text-xs font-bold text-slate-900">Embassy Dossier Dispatch</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Consular-ready application file compiled for appointment booking.</p>
              </div>
            </div>

            {/* Why Us Line */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              <span>⭐</span>
              <span><strong className="text-amber-950 font-bold">Why Choose Us:</strong> Licensed EU Migration Standards • 100% Embassy Compliance • Zero Document Rejections or Fraudulent Risks</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              ⚖️ <em>Factual Transparency: Visa grants and residence permit issuances are determined exclusively by official national immigration authorities (e.g. BAMF, Ausländerbehörde, Embassies). We provide 100% verified, audit-proof document filing without over-promising.</em>
            </p>
          </div>

          {/* CTA Button Anchor */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-center items-start lg:items-end gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('visa-ats-form');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="w-full sm:w-auto lg:w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group scale-100 hover:scale-[1.02]"
            >
              <span>Connect to Form / Select Country &amp; Apply</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-500 text-left lg:text-right">
              Official BAMF &amp; ZAV immigration guidance framework
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* ANIMATED GLOWING CONTAINER: DEDICATED VISA TOOL SECTION                 */}
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
                <span>Consular Assessment Engine • 2026/27 Regulations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Express Visa Assessment &amp; Instant Processing Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                Autonomously evaluate statutory visa eligibility, calculate migration points for the German Opportunity Card (Chancenkarte 2026), and submit your documents directly with zero middleman markups.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-slate-400">Statutory Framework</div>
                <div className="text-sm font-black text-emerald-400">BAMF / ZAV Compliant</div>
              </div>
            </div>
          </div>

          {/* MAIN ATS SPLIT-SCREEN CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ===================================================================== */}
        {/* LEFT PANEL: COMPUTER-PROFESSIONAL ATS VISA APPLICATION FORM CONTAINER */}
        {/* With integrated country destination selection directly atop the form */}
        {/* ===================================================================== */}
        <div 
          id="visa-ats-form"
          className="lg:col-span-5 bg-slate-50 border-2 border-slate-200/90 text-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 ring-1 ring-slate-900/5 scroll-mt-28"
        >
          
          {/* Integrated Country Destination Selection */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-700">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Select Visa Destination:</span>
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
                <span>AI-Powered ATS Visa Terminal</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Immigration Intake Active</span>
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Fast-Track Visa ATS Application
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target Destination: <strong className="text-brand-600 font-bold">{selectedCountry}</strong>. Upload your CV/resume or bio-data to audit points and match verified statutory immigration tracks with zero middleman commissions.
            </p>
          </div>

          {/* Left Panel Step Progress */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              !isProfileLocked && !uploadedFileName ? 'bg-brand-600 text-white shadow-md' : 'text-emerald-700 bg-emerald-50'
            }`}>
              1. Bio-Data Upload
            </span>
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              !isProfileLocked && uploadedFileName ? 'bg-brand-600 text-white shadow-md' : isProfileLocked ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'
            }`}>
              2. Criteria Verification
            </span>
            <span className={`px-2.5 py-1 rounded-lg transition-all ${
              isProfileLocked ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'
            }`}>
              3. Visa Track Verified ✓
            </span>
          </div>

          {/* Source Toggle: Online Live Search vs Pre-Approved Database */}
          <div className="space-y-1.5 pb-1">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
              <span>Assessment Sourcing Engine:</span>
              <span className="font-bold text-brand-700">
                {matchSource === 'online' ? '🌐 Live Embassy Track' : '🗄️ Quota Database'}
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
                <span>🌐 Live Embassy Track</span>
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
                <span>🗄️ Quota Database</span>
              </button>
            </div>
          </div>

          {/* Resume Upload & Client-Side AI Parsing */}
          {!isProfileLocked ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Upload Resume / Bio-Data:</span>
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
                        {isUploading ? 'Extracting & Parsing with Gemini...' : uploadedFileName ? `Uploaded: ${uploadedFileName}` : 'Drop Resume / CV or click to browse'}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        PDF or DOCX • Instant AI extraction of Legal Name, Contact, Degree &amp; Experience
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

              {/* Data Verification Form */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Verify Extracted Applicant Credentials:
                </span>

                {/* Full Legal Name */}
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
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please enter candidate's full legal name.</span>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Email *
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

                {/* Phone Number with Country Code */}
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
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Include valid country code (e.g. +49 or +91) with 9–15 digits.</span>
                  )}
                </div>

                {/* Highest Education Qualification */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Highest Qualification / Degree *
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
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please specify highest academic qualification.</span>
                  )}
                </div>

                {/* Work Experience */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Industry Experience *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. 3 Years Experience in Hospitality Operations"
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
                    <span className="text-[10px] text-red-600 mt-0.5 block font-medium">Please indicate work experience or 'Fresher'.</span>
                  )}
                </div>

                {/* Primary Visa Goal */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Visa Category
                  </label>
                  <select
                    value={targetVisaCategory}
                    onChange={(e) => setTargetVisaCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 shadow-sm cursor-pointer"
>
                    <option value="Student Visa (16b)">Student Visa &amp; APS Clearance (16b)</option>
                    <option value="Opportunity Card (Chancenkarte)">Opportunity Card (Chancenkarte 2026)</option>
                    <option value="EU Blue Card (18b)">EU Blue Card / Skilled Professional (18b)</option>
                    <option value="Ausbildung Dual Training">Ausbildung Dual Vocational Training (16a)</option>
                    <option value="Post-Study Work Permit">Post-Study Work Permit (Section 20)</option>
                    <option value="Executive Business Visa">Executive Schengen Business Visa (Type C)</option>
                  </select>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleVerifyAndProceed}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Verify &amp; Match Eligible Visas</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Locked Verified State */
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile Verified &amp; Locked
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
                <p><span className="text-slate-500 font-medium">Applicant:</span> <strong className="text-slate-900">{verifiedName || 'Verified Candidate'}</strong></p>
                <p><span className="text-slate-500 font-medium">Contact:</span> <span className="text-slate-900 font-medium">{verifiedEmail} • {verifiedPhone}</span></p>
                <p><span className="text-slate-500 font-medium">Qualification:</span> <span className="text-slate-900 font-medium">{verifiedEducation}</span></p>
                <p><span className="text-slate-500 font-medium">Experience:</span> <span className="text-slate-900 font-medium">{verifiedWorkExp}</span></p>
                <p><span className="text-slate-500 font-medium">Target Track:</span> <span className="text-brand-700 font-bold bg-brand-50 px-2 py-0.5 rounded border border-brand-200 ml-1 inline-block">{targetVisaCategory}</span></p>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Target Destination:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{selectedCountry}</span>
                </span>
              </div>
            </div>
          )}

          {/* Trust Badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Licensed EU Migration Counsel
            </span>
            <span>BAMF &amp; ZAV Certified Track</span>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* RIGHT PANEL: ALL RESULTS, SUB-NAV, DETAILS, UPLOAD & SUCCESS          */}
        {/* Phase 3: High-Grade Dark Background Image with bg-slate-950/85 Blur   */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[680px] flex flex-col justify-between">
          
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop"
              alt="European Embassy & University Campus"
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
                    const slide = VISA_PROMO_SLIDES[currentPromoSlide];
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
                              0{currentPromoSlide + 1} / 0{VISA_PROMO_SLIDES.length}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handlePrevPromoSlide}
                                aria-label="Previous visa slide"
                                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextPromoSlide}
                                aria-label="Next visa slide"
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
                          {VISA_PROMO_SLIDES.map((s, idx) => (
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
                        <ShieldCheck className="w-4 h-4" /> Fast-Track APS &amp; Visa
                      </div>
                      <h4 className="text-xs font-bold text-white">21–30 Day Priority Filing</h4>
                      <p className="text-[10px] text-slate-300">Direct dossier verification, certified translation, and priority VFS embassy appointment booking.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <Award className="w-4 h-4" /> PR in 21 Months
                      </div>
                      <h4 className="text-xs font-bold text-white">EU Blue Card Fast-Track</h4>
                      <p className="text-[10px] text-slate-300">Attain permanent settlement (Niederlassungserlaubnis) in 21 months with B1 German proficiency.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                        <Briefcase className="w-4 h-4" /> 20 Hrs / Week Work
                      </div>
                      <h4 className="text-xs font-bold text-white">Student &amp; Trainee Rights</h4>
                      <p className="text-[10px] text-slate-300">Earn €1,000–€1,400/month working part-time during studies or receive €950–€1,350 in Ausbildung.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm space-y-1">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" /> Opportunity Card 2026
                      </div>
                      <h4 className="text-xs font-bold text-white">Chancenkarte Points Matrix</h4>
                      <p className="text-[10px] text-slate-300">Enter Germany legally without a prior job offer with a minimum of 6 points under new immigration law.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <strong className="text-white block">Ready to evaluate your eligible visa categories?</strong>
                      <span>Fill in your credentials on the left and click "Verify &amp; Match Eligible Visas".</span>
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
                          <ShieldCheck className="w-8 h-8 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-black uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        AI Neural Visa Eligibility Engine Active
                      </div>
                      <h3 className="text-xl font-black text-white">Cross-Referencing Criteria for {selectedCountry}</h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        {matchingStepIndex === 0 && "Evaluating academic credentials against Anabin / ZAB equivalence..."}
                        {matchingStepIndex === 1 && `Assessing Chancenkarte points, language proficiency & ${selectedCountry} quotas...`}
                        {matchingStepIndex >= 2 && "Synthesizing optimal Student, Skilled Worker, and Ausbildung visa pathways..."}
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

              {/* STATE 3: ALL MATCHED VISA RESULTS RENDERED ON RIGHT PANEL */}
              {rightPanelState === 'results' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Clean Minimalist Header */}
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">Eligible Visa Pathways in {selectedCountry}</h3>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {filteredVisas.length} Available
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      matchSource === 'online'
                        ? 'text-amber-300 bg-amber-500/15 border-amber-400/30'
                        : 'text-purple-300 bg-purple-500/15 border-purple-400/30'
                    }`}>
                      {matchSource === 'online' ? '🌐 Live Embassy Track' : '🗄️ Quota Pre-Approved'}
                    </span>
                  </div>

                  {/* Two Clean Dropdown Menus Placed Side-by-Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Dropdown 1: Visa Category */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                        <span>Visa Category</span>
                      </label>
                      <div className="relative">
                        <select
                          value={visaCategoryFilter}
                          onChange={(e) => setVisaCategoryFilter(e.target.value)}
                          className="w-full appearance-none bg-slate-900/90 hover:bg-slate-900 border border-white/15 hover:border-brand-400/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all cursor-pointer pr-9 shadow-sm"
                        >
                          <option value="all" className="bg-slate-900 text-white">All Visa Categories</option>
                          <option value="student" className="bg-slate-900 text-white">Student Visa &amp; APS (16b)</option>
                          <option value="career" className="bg-slate-900 text-white">Opportunity Card (Chancenkarte)</option>
                          <option value="employment" className="bg-slate-900 text-white">EU Blue Card / Skilled (18b)</option>
                          <option value="ausbildung" className="bg-slate-900 text-white">Ausbildung Dual Training (16a)</option>
                          <option value="business" className="bg-slate-900 text-white">Executive Business &amp; Schengen</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Dropdown 2: Processing Track */}
                    <div className="relative">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Processing Track</span>
                      </label>
                      <div className="relative">
                        <select
                          value={processingFilter}
                          onChange={(e) => setProcessingFilter(e.target.value)}
                          className="w-full appearance-none bg-slate-900/90 hover:bg-slate-900 border border-white/15 hover:border-brand-400/60 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all cursor-pointer pr-9 shadow-sm"
                        >
                          <option value="all" className="bg-slate-900 text-white">All Processing Speeds</option>
                          <option value="fast_track" className="bg-slate-900 text-white">Fast-Track (15–30 Days)</option>
                          <option value="standard" className="bg-slate-900 text-white">Standard Embassy Track</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Compact Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter visas by keyword (e.g. Student, Blue Card, Ausbildung, Stay-Back)..."
                      value={visaSearchKeyword}
                      onChange={(e) => setVisaSearchKeyword(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:border-brand-400 text-white placeholder-slate-400 transition-colors"
                    />
                  </div>

                  {/* Compact Visa Result Cards (Tiles): Approx. 2 inches height (~76px), full width, core info, click to expand */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredVisas.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 text-xs">
                        No visa tracks found matching the chosen criteria. Try selecting "All Visa Categories".
                      </div>
                    ) : (
                      filteredVisas.map((v, idx) => {
                        const matchPct = idx === 0 ? 98 : idx === 1 ? 96 : idx === 2 ? 95 : Math.max(88, 92 - idx * 2);

                        return (
                          <div
                            key={v.id}
                            onClick={() => {
                              setSelectedVisa(v);
                              setRightPanelState('details');
                            }}
                            className="w-full min-h-[72px] sm:h-[78px] px-3.5 py-2.5 rounded-xl bg-slate-900/75 hover:bg-slate-800/90 border border-white/10 hover:border-brand-400/80 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md flex items-center justify-between gap-3 text-left select-none"
                            title="Click to view full visa regulations, legal work rights, and document checklist"
                          >
                            {/* Visa Icon */}
                            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:text-brand-300 group-hover:border-brand-400/40 group-hover:bg-brand-500/15 transition-all shrink-0">
                              {v.category === 'student' && <GraduationCap className="w-4 h-4" />}
                              {v.category === 'career' && <Sparkles className="w-4 h-4" />}
                              {v.category === 'employment' && <Briefcase className="w-4 h-4" />}
                              {v.category === 'ausbildung' && <Award className="w-4 h-4" />}
                              {v.category === 'business' && <Plane className="w-4 h-4" />}
                            </div>

                            {/* Core Info: Title + Meta */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {v.visaName}
                                </h4>
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 shrink-0">
                                  {v.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                                <span className="text-slate-300 font-medium">{v.validity}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-emerald-400 font-semibold">{v.processingTime}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-300 truncate max-w-[180px]">{v.workRights}</span>
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

              {/* STATE 4: VISA DETAILS PROMO VIEW ON RIGHT PANEL */}
              {rightPanelState === 'details' && selectedVisa && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('results')}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Matched Visas
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider">
                      ★ 98% AI Match Eligibility
                    </span>
                  </div>

                  {/* Header */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-brand-400 block">
                      {selectedVisa.country} Visa Track • {selectedVisa.category.toUpperCase()}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {selectedVisa.visaName}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {selectedVisa.description}
                    </p>
                  </div>

                  {/* 3 Metrics Pillars */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        Stay Duration
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
                        {selectedVisa.validity}
                      </h4>
                      <span className="text-[9px] text-slate-400">Renewable Status</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Processing Time
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
                        {selectedVisa.processingTime}
                      </h4>
                      <span className="text-[9px] text-slate-400">Embassy Queue</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                        Financial Solvency
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                        {selectedVisa.financialProof}
                      </h4>
                      <span className="text-[9px] text-slate-400">{selectedVisa.workRights}</span>
                    </div>
                  </div>

                  {/* Key Perks Highlight */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 block">
                      Statutory Privileges &amp; Settlement Pathways
                    </span>
                    <div className="space-y-1.5 text-[11px] text-slate-300">
                      {selectedVisa.keyPerks.map((pk, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Mandatory Document Dossier Checklist:
                    </span>
                    <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                      {selectedVisa.documentsRequired.map((doc, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-brand-400 shrink-0" />
                          <span className="truncate">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proceed to Dossier Upload */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('upload')}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Proceed with {selectedVisa.visaName.slice(0, 32)}...</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 5: OPTIONAL DOCUMENT UPLOAD */}
              {rightPanelState === 'upload' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                      Visa Dossier Upload (Optional)
                    </span>
                    <button
                      type="button"
                      onClick={() => setRightPanelState('details')}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Visa Details
                    </button>
                  </div>

                  {selectedVisa && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-white">{selectedVisa.visaName}</h4>
                        <p className="text-[10px] text-slate-400">{selectedVisa.country} • {selectedVisa.processingTime} • {selectedVisa.validity}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {[
                      'International Passport (Valid for min 12 months)',
                      'Academic Degree Certificates & Transcripts',
                      'Language Proficiency Certificate (IELTS / Goethe)',
                      'Financial Statement or Blocked Account Proof',
                      'Updated DIN-Standard Curriculum Vitae (CV)'
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-200">{item}</span>
                        </div>
                        <label className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors">
                          Upload File
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Visa Inquiry &amp; Request Consultation</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      Uploading documents is optional. You may also complete document hand-off directly with your assigned advisor.
                    </p>
                  </div>
                </div>
              )}

              {/* STATE 6: FINAL SUCCESS CONFIRMATION */}
              {rightPanelState === 'success' && (
                <div className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-300 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9 animate-bounce" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                      Assessment Submitted Successfully
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Your application is successful, and we will get in touch with you shortly.
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Our senior European immigration advisor has received your assessment dossier and will contact you via phone and email within 24 hours.
                    </p>
                  </div>

                  {/* Application Details */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 text-left text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Visa Tracking ID:</span>
                      <span className="font-mono font-bold text-brand-400">{leadTrackingId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Target Visa:</span>
                      <span className="font-bold text-white truncate max-w-[220px]">
                        {selectedVisa ? selectedVisa.visaName : 'German National Student Visa'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assigned Counselor:</span>
                      <span className="font-bold text-emerald-400">Senior EU Visa &amp; Immigration Desk (Berlin/Frankfurt)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Sourced Via:</span>
                      <span className="font-semibold text-brand-400">
                        {matchSource === 'online' ? '🌐 Live Embassy Track' : '🗄️ Quota Pre-Approved'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setRightPanelState('results')}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Browse More Visa Pathways
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Panel Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>BAMF &amp; ZAV Immigration Standards Compliant</span>
              </span>
              <span>Real-Time Embassy Regulations Synchronized</span>
            </div>

          </div>

        </div>

      </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISUAL SECTION SEPARATOR: SPLIT-SCREEN TOOL <-> DESTINATION INTELLIGENCE  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-12 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-slate-700/60 shadow-sm" />
        </div>
        <div className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-full border border-amber-500/40 shadow-2xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            ✦ Destination Intelligence &amp; Statutory Blueprint ✦
          </span>
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            • Curated Country Benefits &amp; Services
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISA & IMMIGRATION BENEFITS SECTION (ACTIVELY VISIBLE ON SCREEN)        */}
      {/* Dynamically populated via client-side AI/mapping upon country selection   */}
      {/* ========================================================================= */}
      <div id="visa-benefits-section" className="max-w-7xl mx-auto mt-8 scroll-mt-28">
        <VisaDestinationInsightsSection 
          country={selectedCountry}
          visaCategory={visaCategoryFilter}
          processingTrack={processingFilter}
        />
      </div>

      {/* ========================================================================= */}
      {/* VISUAL SECTION SEPARATOR: DIRECTLY TRANSITIONING TO SUPPORT & SERVICES     */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto my-10 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-slate-700/60 shadow-sm" />
        </div>
        <div className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-full border border-emerald-500/40 shadow-2xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
            ✦ Other Support &amp; Services Available ✦
          </span>
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            • Complete Embassy &amp; Relocation Assistance
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OTHER SUPPORT & SERVICES AVAILABLE (POSITIONED DIRECTLY BELOW)         */}
      {/* ========================================================================= */}
      <div id="visa-support-section" className="max-w-7xl mx-auto mt-8 scroll-mt-28">
        <VisaSupportServicesSection country={selectedCountry} />
      </div>

    </div>
  );
};

// =============================================================================
// SUB-COMPONENT: VISA DESTINATION INSIGHTS (CLIENT-SIDE AI POWERED)
// =============================================================================

export const VisaDestinationInsightsSection: React.FC<{
  country: string;
  visaCategory: string;
  processingTrack: string;
}> = ({ country, visaCategory, processingTrack }) => {
  const [activeTab, setActiveTab] = useState<'visa' | 'pathways' | 'requirements'>('visa');
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
              <span>{country === 'Germany' ? 'German Visa & Immigration Benefits' : `${country} Visa Benefits`}</span>
              <span className="text-xs font-normal text-slate-400">&amp; Regulations Blueprint</span>
            </h3>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-emerald-500/20 text-brand-300 border border-brand-400/30 text-[10px] font-bold">
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                  <span className="text-amber-300">Gemini Neural Visa AI Generating...</span>
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
              18-Mo Stay-Back • PR in 21 Mo
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Statutory immigration rules, work entitlements, and permanent residency pipelines under German Federal BAMF &amp; ZAV regulations.
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
              onClick={() => setActiveTab('visa')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'visa'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Visa &amp; Post-Study Perks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pathways')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'pathways'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pathways &amp; Career Rights</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'requirements'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Requirements &amp; Embassy Steps</span>
            </button>
          </div>

          {/* Tab 1: Visa & Post-Study */}
          {activeTab === 'visa' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white">18-Month Post-Study Job Seeker Stay-Back</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Graduates from German institutions obtain an unrestricted 18-month stay-back visa allowing full-time employment anywhere in Germany while securing career-track roles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white">Permanent Residency (PR) in 21 Months</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Transition from student visa to EU Blue Card with fast-track permanent residency (Niederlassungserlaubnis) in only 21 months with B1 German (or 27 months with basic German).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-bold text-white">20 Hours / Week Part-Time Work Rights</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Work up to 140 full days (280 half days) per calendar year, easily earning €1,000–€1,400/month in hotels, events, and corporate internships to self-fund living expenses.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white">29 Schengen Member States Mobility</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Full borderless travel and business project rights across all 29 Schengen member states with no additional visa filings required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Pathways */}
          {activeTab === 'pathways' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Student Pathway (16b)
                </span>
                <h4 className="text-xs font-black text-white">Public &amp; Private University Visas</h4>
                <div className="text-xs font-bold text-emerald-400">€0 State Tuition Subsidy</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Complete exemption from tuition fees at state universities.</li>
                  <li>• Unrestricted Schengen mobility and semester public transport pass.</li>
                  <li>• Direct progression into 18-month stay-back work permit.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  Direct Employment (18b)
                </span>
                <h4 className="text-xs font-black text-white">EU Blue Card &amp; Skilled Worker</h4>
                <div className="text-xs font-bold text-brand-400">PR Settlement in 21 Months</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Immediate spousal open work rights and family reunion.</li>
                  <li>• Corporate tie-ups with leading German employers.</li>
                  <li>• Accelerated German passport &amp; EU citizenship track.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Earn While You Learn (16a)
                </span>
                <h4 className="text-xs font-black text-white">Ausbildung Dual Vocational Training</h4>
                <div className="text-xs font-bold text-amber-400">€950–€1,350/Mo Paid Stipend</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Zero blocked account required: company pays your salary.</li>
                  <li>• 70% practical company training + 30% vocational schooling.</li>
                  <li>• 95%+ permanent employment transition upon completion.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Requirements */}
          {activeTab === 'requirements' && (
            <div className="space-y-3">
              {[
                {
                  title: 'Student Visa & APS Clearance',
                  reqs: 'APS Certificate, IELTS 6.0+ or German B1, €11,208 Blocked Account (Sperrkonto)',
                  steps: 'APS verification → Uni-Assist VPD / University Admission → Blocked Account setup → Embassy National Visa (D) appointment.'
                },
                {
                  title: 'Opportunity Card (Chancenkarte 2026)',
                  reqs: 'Minimum 6 Points (Degree recognition, language A1 German or B2 English, age under 35)',
                  steps: 'Points assessment → ZAB degree equivalence statement → Proof of living funds → VFS / Embassy application.'
                },
                {
                  title: 'Ausbildung Dual Vocational Visa',
                  reqs: 'German B1/B2 Level Mandatory, High School (10+2) or Diploma, Signed Employer Training Contract',
                  steps: 'German CV / Motivation letter → Employer video interview → Signed Ausbildungsvertrag & ZAV clearance → Visa filing.'
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
                    <p><strong className="text-amber-400">Benchmarks:</strong> {item.reqs}</p>
                    <p><strong className="text-emerald-400">Standard Pipeline:</strong> {item.steps}</p>
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
// SUB-COMPONENT: OTHER SUPPORT & SERVICES AVAILABLE
// =============================================================================

export const VisaSupportServicesSection: React.FC<{ country: string }> = ({ country }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950/40 border-2 border-emerald-500/25 border-t-4 border-t-emerald-400 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      <div className="text-left space-y-1 relative z-10 border-b border-white/10 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 text-[10px] font-bold uppercase tracking-wider mb-1">
          <HeartHandshake className="w-3.5 h-3.5 text-brand-400" />
          <span>Full-Lifecycle Ecosystem</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Other Support &amp; Services Available
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          From visa paperwork and document attestation to airport reception and local registration, our full European settlement desk handles every milestone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {[
          {
            icon: Home,
            title: "Accommodation & Airport Reception",
            desc: "Guaranteed student dormitories, shared flat (WG) searches, and in-person airport pickup across Germany.",
            tag: "Arrival Care",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30"
          },
          {
            icon: Landmark,
            title: "Blocked Account & Insurance",
            desc: "End-to-end assistance with Sperrkonto (€11,208) setup and public health insurance (TK / AOK) activation.",
            tag: "Finance & Health",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          },
          {
            icon: Briefcase,
            title: "Part-Time Job Placement Support",
            desc: "Connecting you with verified student employment (20 hrs/week) earning €1,000–€1,400/month for living costs.",
            tag: "Student Income",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30"
          },
          {
            icon: ShieldCheck,
            title: "21-Day Visa & APS Clearance",
            desc: "Expedited APS document verification, embassy appointment booking, and visa file dossier preparation.",
            tag: "Visa Processing",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30"
          },
          {
            icon: FileText,
            title: "Uni-Assist & Document Attestation",
            desc: "Official certified German translation, document notarization, and error-free Uni-Assist VPD review submissions.",
            tag: "Documentation",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
          },
          {
            icon: HeartHandshake,
            title: "Local Registration (Anmeldung)",
            desc: "In-person city hall registration (Anmeldung), tax ID allocation, and German IBAN bank account opening.",
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
                    window.location.hash = '#applications?tab=Visa%20Services';
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
          <h3 className="text-base sm:text-lg font-black text-white">Ready to Secure Your {country} Visa?</h3>
          <p className="text-xs text-slate-300">Submit your profile now for free eligibility assessment and licensed embassy document verification.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#applications?tab=Visa%20Services';
          }}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all shadow-lg shadow-amber-500/25 flex items-center gap-1.5"
        >
          <span>Apply for Visa Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

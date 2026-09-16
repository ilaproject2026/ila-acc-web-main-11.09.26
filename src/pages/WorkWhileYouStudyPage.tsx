import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Crown, 
  Gift, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Award, 
  Home, 
  Users, 
  BarChart3, 
  Code, 
  SunMedium, 
  Plane, 
  FileText, 
  Laptop, 
  Megaphone, 
  Trophy, 
  Star, 
  Check, 
  TrendingUp, 
  Zap, 
  Building2, 
  BadgePercent,
  Compass,
  X,
  ChevronDown
} from 'lucide-react';
import { getWorkStudyPackages, WorkStudyPackage } from '../lib/db';
import WorkStudyCourseModal, { WorkStudySelectionData } from '../components/common/WorkStudyCourseModal';

const jobCategories = [
  {
    category: "Office Admin & Accounts",
    icon: BarChart3,
    roles: [
      "6 Months Initial Training Session",
      "Stipend: 15k to 25k during training",
      "Post-Training: Real-time onboarding & permanent employment opportunities.",
      "AI-Assisted Accounting & Tally",
      "Billing, Invoicing & Financial Auditing",
      "Office Administration & HR Operations",
      "Vendor & Supply Chain Management"
    ],
    streams: [
      "General Office Administration",
      "AI-Assisted Accounting & Tally Prime",
      "Billing, Invoicing & GST Auditing",
      "Vendor & Operations Management"
    ],
    stipend: "₹15,000 - ₹25,000 / mo",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    badge: "Operations",
    terms: "Eligibility: 10+2 / Graduate. Minimum 85% attendance required during the 6-month training session. Monthly stipend disbursed post evaluation. Direct onboarding & permanent placement transition on successful pilot completion."
  },
  {
    category: "Software, SEO & Social AI",
    icon: Code,
    roles: [
      "6 Months Initial Training Session",
      "Stipend: 15k to 25k during training",
      "Post-Training: Real-time onboarding & permanent employment opportunities.",
      "AI-Powered Full-Stack Web Development",
      "High-Level SEO & Organic Traffic Sprints",
      "Digital Client Campaign Automations",
      "Social Media Ad Funnels & Growth"
    ],
    streams: [
      "Full-Stack Web Dev (React & Python/Node)",
      "AI Engineering & Intelligent Automations",
      "Enterprise SEO & Organic Growth",
      "Social Media Ad Funnels & Growth"
    ],
    stipend: "₹18,000 - ₹35,000 / mo",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    badge: "Tech & AI",
    terms: "Eligibility: IT/CS degree, Diploma, or demonstrable programming proficiency. Bi-weekly code reviews and milestone check-ins mandatory. Direct pathway for German Opportunity Card sponsorship provided."
  },
  {
    category: "Import, Export & Trade",
    icon: Globe2,
    roles: [
      "6 Months Initial Training Session",
      "Stipend: 15k to 25k during training",
      "Post-Training: Real-time onboarding & permanent employment opportunities.",
      "European & Asian Supplier Sourcing",
      "Customs Documentation & Clearance",
      "International Logistics Operations",
      "B2B Client Trade Coordination"
    ],
    streams: [
      "European & Global Sourcing Specialist",
      "Customs Documentation & Cross-Border Compliance",
      "International Air & Sea Freight Logistics",
      "B2B Commercial Accounts & Invoicing"
    ],
    stipend: "₹16,000 - ₹28,000 / mo",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badge: "Global Logistics",
    terms: "Eligibility: Commerce, Logistics, or Business graduates preferred. Training covers German Zoll (Customs) protocols, Incoterms 2020, and international trade finance. Verified 1-year experience certificate issued."
  },
  {
    category: "Engineering & Technical Services",
    icon: SunMedium,
    roles: [
      "6 Months Initial Training Session",
      "Stipend: 15k to 25k during training",
      "Post-Training: Real-time onboarding & permanent employment opportunities.",
      "Solar Rooftop Grid & Inverters",
      "EV & Auto Diagnostic Systems",
      "HVAC & Industrial Assembly Kits",
      "Technical Audits & Safety Checks"
    ],
    streams: [
      "Solar Photovoltaic & Inverter Systems",
      "Electric Vehicle (EV) Diagnostics & Powertrain",
      "Industrial HVAC & Automation Diagnostics",
      "Technical Safety Audits & Blueprint Review"
    ],
    stipend: "₹15,000 - ₹30,000 / mo",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    badge: "Engineering",
    terms: "Eligibility: Diploma or B.Tech in Mechanical, Electrical, Automobile, or Renewable Energy. Safety gear and field tools provided. DIN/VDI German technical standards certification prepared."
  }
];

const studyAbroadServices = [
  {
    id: 'pickup',
    title: 'Pick-up Services',
    subtitle: 'Airport Arrival & Transit Welcome Support',
    icon: Plane,
    badge: 'On-Ground Transit',
    payout: '€50 – €100 / arrival',
    desc: 'Receive newly arriving Indian and international students at German & EU airports (Frankfurt, Munich, Berlin, Hamburg). Assist with train connections, luggage transfer, and direct check-in at accommodation.',
    highlights: [
      'Pre-scheduled airport reception booking on your student portal',
      'Direct coordination with arrival flights and local train transit',
      'Immediate cash payout upon verified student check-in',
      'Meet fellow international students and expand your local network'
    ],
    actionText: 'Register as Transit Coordinator'
  },
  {
    id: 'student-services',
    title: 'Student Services',
    subtitle: 'WG Flats, City Hall & Local Onboarding',
    icon: Home,
    badge: 'Accommodation & Setup',
    payout: '€80 – €200 / student',
    desc: 'Help incoming students navigate the challenging European accommodation market. Guide them in securing WG (Wohngemeinschaft) rooms, local SIM cards, public transport passes, and city hall registration (Anmeldung).',
    highlights: [
      'Verified flatshare and apartment room matching database',
      'Local city registration (Anmeldung) appointment assistance',
      'German bank account setup (Sparkasse, Deutsche Bank, N26)',
      'Public statutory health insurance activation support'
    ],
    actionText: 'Register as Student Onboarding Lead'
  },
  {
    id: 'documentation',
    title: 'Documentation Services',
    subtitle: 'Certified Translations, Notary & Visa Extensions',
    icon: FileText,
    badge: 'Bureaucracy & Legal',
    payout: '€60 – €180 / dossier',
    desc: 'Provide critical document review and bureaucratic facilitation. Assist enrolled candidates with German university matriculation files, certified sworn translations, APS documentation, and Ausländerbehörde residence permit extensions.',
    highlights: [
      'Assistance with German Ausländerbehörde residence permit paperwork',
      'University matriculation and semester ticket documentation',
      'Blocked account (Sperrkonto) release and verification files',
      'German translation proofreading and notary validation'
    ],
    actionText: 'Register as Documentation Advisor'
  },
  {
    id: 'it-roles',
    title: 'IT-Based Part-Time Roles',
    subtitle: 'Remote Web Development, AI Data & Cloud Tasks',
    icon: Laptop,
    badge: 'Remote Tech Income',
    payout: '€15 – €28 / hour (Up to 20 hrs/week)',
    desc: 'Put your computer science and software skills to work while studying. Participate in remote web development, AI workflow scripting, database automation, and IT troubleshooting for European clients.',
    highlights: [
      'Flexible 20 hours/week legal student working limit in Germany',
      'Projects in React, TypeScript, Python AI, and Cloud deployments',
      'Direct reference letter and European project portfolio proof',
      'Fast-track qualification for post-study German EU Blue Card'
    ],
    actionText: 'Apply for IT Part-Time Role'
  },
  {
    id: 'marketing-roles',
    title: 'Marketing-Based Part-Time Roles',
    subtitle: 'Campus Ambassadors, Social AI & Student Outreach',
    icon: Megaphone,
    badge: 'Outreach & Growth',
    payout: '€14 – €25 / hour + Performance Bonuses',
    desc: 'Lead international student outreach, organize campus networking meetups, run social media growth funnels, and represent ILA Global programs at top universities across Germany and Europe.',
    highlights: [
      'University campus ambassador leadership certifications',
      'Social media content creation and student testimonial reels',
      'Organize career workshops and German language practice sessions',
      'Generous performance incentives and travel allowances'
    ],
    actionText: 'Apply for Marketing Role'
  }
];

const germanProjects = [
  {
    title: "Solar & Renewable Technical Pilots",
    category: "CleanTech & Electrical",
    icon: SunMedium,
    location: "India Pre-Flight ➔ Munich/Stuttgart",
    desc: "Master photovoltaic inverter installations, commercial solar sizing, and EV charging station diagnostics with provided company toolkits.",
    careerPathway: "Direct German Sponsor Visa / Opportunity Card",
    skills: ["PV Inverters", "EV Chargers", "Grid Safety", "DIN Standards"],
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Cross-Border Sourcing & Logistics",
    category: "International Trade",
    icon: Globe2,
    location: "India Pre-Flight ➔ Hamburg/Frankfurt",
    desc: "Coordinate export-import compliance, European B2B supplier audits, and freight documentation for cross-border engineering parts.",
    careerPathway: "German Supply Chain Coordinator / Trade Manager",
    skills: ["Incoterms 2024", "Customs Tariffs", "B2B Negotiations", "Audit Files"],
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "AI & Full-Stack Application Funnels",
    category: "Software & AI Tech",
    icon: Cpu,
    location: "Remote / Hybrid ➔ Berlin/Düsseldorf",
    desc: "Build modern web applications, AI conversational tools, and automated backend databases for active corporate enterprise clients.",
    careerPathway: "German EU Blue Card Full-Stack Engineer",
    skills: ["React & Node.js", "AI Agentic Workflows", "PostgreSQL", "Cloud DevOps"],
    color: "from-indigo-500 to-blue-600"
  },
  {
    title: "Healthcare Clinical Operations & Admin",
    category: "Medical & Hospital Services",
    icon: ShieldCheck,
    location: "India Pre-Flight ➔ Cologne/Bonn",
    desc: "Work on medical documentation, hospital workflow systems, patient coordination files, and clinical German terminology prep.",
    careerPathway: "German Hospital Nurse / Medical Specialist Recognition",
    skills: ["Fachsprache German", "Patient Care Admin", "Hospital ERP", "Defizitbescheid Prep"],
    color: "from-rose-500 to-pink-600"
  }
];

const rewardPlatformItems = [
  {
    icon: Trophy,
    title: "Milestone Points & Cashbacks",
    highlight: "Earn as You Progress",
    desc: "Accumulate points for completing assignments, passing German language modules (A1-B2), and submitting project audits. Redeem points for direct monthly stipends.",
    badge: "Cashable Points"
  },
  {
    icon: Gift,
    title: "Gift Packages & Premium Tech",
    highlight: "Performance Bonuses",
    desc: "Top performers in corporate pilots receive premium developer laptops, study kits, certified German reference books, and hardware toolkits.",
    badge: "Tech Gifts"
  },
  {
    icon: Globe2,
    title: "European Educational Tour Packages",
    highlight: "Fully Sponsored Trips",
    desc: "Outstanding interns and student coordinators qualify for all-expense-paid European industry visit tours, visiting partner companies in Germany, Austria, and Switzerland.",
    badge: "EU Tour Packages"
  },
  {
    icon: TrendingUp,
    title: "Salary Incentives & Fast-Track Hikes",
    highlight: "₹15,000 to ₹45,000+",
    desc: "Structured quarterly performance appraisal where your hourly or monthly stipend steps up as you deliver live client deliverables and pass higher language levels.",
    badge: "Salary Boosts"
  },
  {
    icon: Crown,
    title: "Freelancer & Marketing Head Pathways",
    highlight: "Official Leadership Title",
    desc: "Graduate from Junior Intern to Certified Freelance Consultant or Regional Marketing Head with executive revenue share and verified credentials.",
    badge: "Certified Leader"
  },
  {
    icon: BadgePercent,
    title: "Course Fee Subsidies (Up to 50% Off)",
    highlight: "Self-Funding Education",
    desc: "Offset your German Language (A1-C1) or IELTS coaching fees completely through work-and-study pilot credits.",
    badge: "50% Fee Waiver"
  }
];

type BlockTabType = 'work-in-india' | 'work-in-abroad' | 'german-projects' | 'reward-study-platform';

export default function WorkWhileYouStudyPage() {
  const [activeTab, setActiveTab] = useState<BlockTabType>('work-in-india');
  const [selectedAbroadService, setSelectedAbroadService] = useState('pickup');
  const [promoCourseSelection, setPromoCourseSelection] = useState('German A1-B2 + Tech Work-While-Learn');
  const [promoPlanDuration, setPromoPlanDuration] = useState('6-Month Integrated Pilot');

  // Stream / Course selections per domain category
  const [selectedStreams, setSelectedStreams] = useState<Record<string, string>>({
    'Office Admin & Accounts': 'General Office Administration',
    'Software, SEO & Social AI': 'Full-Stack Web Dev (React & Python/Node)',
    'Import, Export & Trade': 'European & Global Sourcing Specialist',
    'Engineering & Technical Services': 'Solar Photovoltaic & Inverter Systems'
  });

  // Terms & Conditions Modal State
  const [termsModalPackage, setTermsModalPackage] = useState<any | null>(null);

  // Dynamic packages from DB / Store
  const [dynamicPackages, setDynamicPackages] = useState<WorkStudyPackage[]>([]);

  useEffect(() => {
    const loadPkgs = () => {
      setDynamicPackages(getWorkStudyPackages());
    };
    loadPkgs();
    window.addEventListener('ilas-work-study-packages-changed', loadPkgs);
    return () => window.removeEventListener('ilas-work-study-packages-changed', loadPkgs);
  }, []);

  // Filter only HR-Approved packages for public display
  const approvedDynamicPackages = dynamicPackages.filter(
    p => p.approvalStatus === 'Approved' || (!p.approvalStatus && p.status === 'Active')
  );

  const indiaDynamicPackages = approvedDynamicPackages.filter(
    p => p.category === 'work-in-india' && !jobCategories.some(c => c.category === p.title)
  );

  const germanDynamicPackages = approvedDynamicPackages.filter(
    p => p.category === 'german-projects' && !germanProjects.some(g => g.title === p.title)
  );

  const rewardDynamicPackages = approvedDynamicPackages.filter(
    p => p.category === 'reward-study-platform' && !rewardPlatformItems.some(r => r.title === p.title)
  );

  // Handle URL Hash Changes for Direct Deep-Linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('work-in-india')) {
        setActiveTab('work-in-india');
      } else if (hash.includes('work-in-abroad') || hash.includes('study-abroad-pathways')) {
        setActiveTab('work-in-abroad');
      } else if (hash.includes('german-projects')) {
        setActiveTab('german-projects');
      } else if (hash.includes('reward-study-platform') || hash.includes('reward-and-study')) {
        setActiveTab('reward-study-platform');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (url: string) => { 
    window.location.hash = url; 
  };

  // Pre-Application Course Selection Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [modalInitialCourse, setModalInitialCourse] = useState<string | undefined>(undefined);
  const [modalInitialTrack, setModalInitialTrack] = useState<string | undefined>(undefined);
  const [modalInitialDomain, setModalInitialDomain] = useState<string | undefined>(undefined);

  const handleOpenCourseModal = (course?: string, track?: string, domain?: string) => {
    setModalInitialCourse(course);
    setModalInitialTrack(track);
    setModalInitialDomain(domain);
    setIsCourseModalOpen(true);
  };

  const handleCourseSelectionConfirmed = (data: WorkStudySelectionData) => {
    setIsCourseModalOpen(false);
    const params = new URLSearchParams({
      service: 'work-while-you-study',
      course: data.course,
      category: data.category,
      track: data.track,
      domain: data.domain
    });
    window.location.hash = `#applications?${params.toString()}`;
  };

  const handleTabSwitch = (tab: BlockTabType) => {
    setActiveTab(tab);
    // Smooth scroll to the content showcase container
    const container = document.getElementById('modular-showcase-container');
    if (container) {
      const y = container.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeAbroad = studyAbroadServices.find(s => s.id === selectedAbroadService) || studyAbroadServices[0];
  const AbroadIcon = activeAbroad.icon;

  const activeTabLabel = 
    activeTab === 'work-in-india' ? 'Work & Study in India' :
    activeTab === 'work-in-abroad' ? 'Work & Study in Abroad' :
    activeTab === 'german-projects' ? 'German Onboarding Projects' :
    'Reward & Study / Earning Platforms';

  return (
    <div className="pt-20 bg-slate-100 min-h-screen">
      
      {/* ================= 1. REORDERED & VIBRANT TOP PROMO MESSAGE BLOCK (VERY TOP) ================= */}
      <div className="container-max px-4 sm:px-6 pt-4 mb-4">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white p-5 sm:p-7 shadow-2xl shadow-orange-500/25 border-2 border-amber-300/40 transform transition-all duration-300 hover:shadow-orange-500/35">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/4 w-60 h-60 bg-rose-400/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3 rounded-2xl bg-white text-slate-950 shrink-0 shadow-xl shadow-slate-950/20 animate-pulse">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950/40 text-amber-200 border border-amber-300/40 px-3 py-0.5 rounded-full backdrop-blur-md">
                    Career Maxim Alert
                  </span>
                  <span className="text-[10px] font-black text-amber-100 flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                    Verified Global Experience
                  </span>
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-white leading-snug tracking-tight drop-shadow-md">
                  “Do not waste your time just studying—gather international experience, explore earning platforms, and earn while you learn.”
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleOpenCourseModal()}
                className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white text-xs font-black transition-all shadow-xl shadow-slate-950/30 flex items-center gap-1.5 cursor-pointer hover:scale-105 border border-amber-400/30"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleTabSwitch('reward-study-platform')}
                className="px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black border border-white/30 transition-all cursor-pointer backdrop-blur-md"
              >
                Reward Platform
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MASTER PATHWAY HUB (LIGHT NAV + DARK EXPLANATION PANEL) ================= */}
      <div id="modular-showcase-container" className="container-max px-4 sm:px-6 mb-8">
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden">
          
          {/* Top Category Section - LIGHT SECTION */}
          <div className="bg-slate-100/90 p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-center justify-between px-1 mb-3.5">
              <span className="text-xs font-black uppercase tracking-widest text-brand-700 flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-600" /> Interactive Pathway Navigator
              </span>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
                Select a pathway below to view details, earnings &amp; active opportunities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
              {[
                { 
                  id: 'work-in-india' as BlockTabType, 
                  number: '01',
                  label: 'Work & Study in India', 
                  sublabel: 'Domestic Corporate Pilots',
                  stipend: 'Stipend: ₹15k – ₹35k/mo',
                  icon: Building2 
                },
                { 
                  id: 'work-in-abroad' as BlockTabType, 
                  number: '02',
                  label: 'Work & Study in Abroad', 
                  sublabel: 'European Student Roles',
                  stipend: 'Euro €900 – €1,400/mo',
                  icon: Globe2 
                },
                { 
                  id: 'german-projects' as BlockTabType, 
                  number: '03',
                  label: 'German Onboarding Projects', 
                  sublabel: 'Active International Pilots',
                  stipend: '100% Sponsor Match',
                  icon: Briefcase 
                },
                { 
                  id: 'reward-study-platform' as BlockTabType, 
                  label: 'Reward & Study Platform', 
                  sublabel: 'Earning & Tuition Grants',
                  stipend: 'Up to 50% Course Subsidy',
                  icon: Trophy 
                }
              ].map(tab => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSwitch(tab.id)}
                    className={`relative p-4 rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3.5 border-2 group ${
                      isSelected 
                        ? 'bg-white text-slate-900 border-brand-600 shadow-xl shadow-brand-600/15 ring-4 ring-brand-500/20 scale-[1.02]' 
                        : 'bg-white/80 hover:bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Active dock notch indicator pointing down to the dark explanation panel */}
                    {isSelected && (
                      <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-brand-600 z-30" />
                    )}

                    {/* Left Icon - Positioned at the Left End */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' 
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Word / Text Content - Made Bigger & Bolder */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          isSelected ? 'text-brand-700' : 'text-slate-400'
                        }`}>
                          Pathway {tab.number}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                            Active
                          </span>
                        )}
                      </div>

                      {/* Large prominent pathway name */}
                      <div className={`text-base sm:text-lg font-black leading-tight tracking-tight mb-1 ${
                        isSelected ? 'text-slate-950' : 'text-slate-800'
                      }`}>
                        {tab.label}
                      </div>

                      <div className="text-xs font-semibold text-slate-500 leading-snug">
                        {tab.sublabel}
                      </div>

                      {/* Simple bottom stipend mention */}
                      <div className={`text-[11px] font-bold mt-2 pt-1.5 border-t border-slate-100 ${
                        isSelected ? 'text-brand-700 font-extrabold' : 'text-slate-400'
                      }`}>
                        {tab.stipend}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attached Explanation Panel - DARK SECTION */}
          <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden transition-all duration-300 border-t-2 border-brand-500/30">
            {/* Ambient electric glowing backdrops */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {activeTab === 'work-in-india' && (
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
                <div className="space-y-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black tracking-widest text-brand-300 uppercase bg-brand-500/20 px-3.5 py-1 rounded-full border border-brand-400/40 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-400" />
                      Pathway 1 of 4 • Domestic Corporate Pilots
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1-Year Certificate Guaranteed
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                    Work &amp; Study in India
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                    Gain live corporate experience while preparing for German language certification or international universities. Earn monthly stipends with 100% verified 1-year corporate certificates approved for German embassy &amp; opportunity card files.
                  </p>
                  
                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 font-bold" /> 6 Months Structured Training
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 font-bold" /> ₹15,000 – ₹25,000 Training Stipend
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 font-bold" /> Real-time Permanent Onboarding
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-4 shrink-0">
                  <div className="bg-slate-900/95 text-white p-5 sm:p-6 rounded-2xl border border-slate-700/80 text-center min-w-[230px] w-full sm:w-auto shadow-2xl">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Candidate Stipend</span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 mb-1">₹15,000 – ₹35,000</div>
                    <span className="text-xs text-slate-300 font-medium">Monthly + Experience Letter</span>
                  </div>
                  <button
                    onClick={() => handleOpenCourseModal(undefined, 'Student Sub-Track', 'IT & Automation')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-xl shadow-amber-400/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <span>Apply for India Pathway</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'work-in-abroad' && (
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
                <div className="space-y-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black tracking-widest text-emerald-300 uppercase bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                      Pathway 2 of 4 • European Student Roles &amp; Earnings
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 20h/Week Legal Compliance
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                    Work &amp; Study in Abroad
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                    Earn in Euro while completing your university degrees across Germany and Europe. Pick up on-ground support tasks, assist arriving scholars, or take on remote IT &amp; Marketing roles up to 20 hours/week.
                  </p>
                  
                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Direct German Bank Payout (N26/Sparkasse)
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Zero University Class Interruption
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" /> Verified Student Housing Support
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-4 shrink-0">
                  <div className="bg-slate-900/95 text-white p-5 sm:p-6 rounded-2xl border border-slate-700/80 text-center min-w-[230px] w-full sm:w-auto shadow-2xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Euro Earning Rate</span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 mb-1">€50 – €250+</div>
                    <span className="text-xs text-slate-300 font-medium">Per Task / Up to €1,400/mo</span>
                  </div>
                  <button
                    onClick={() => handleOpenCourseModal(activeAbroad.title, 'Abroad Placement Track', 'European Student Roles')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <span>Apply for Abroad Roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'german-projects' && (
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
                <div className="space-y-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black tracking-widest text-indigo-300 uppercase bg-indigo-500/20 px-3.5 py-1 rounded-full border border-indigo-400/40 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      Pathway 3 of 4 • Active International Pilots
                    </span>
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Direct Employer Sponsorship
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                    German Onboarding Projects
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                    Execute live technical, commercial, and clinical projects locally with our supply chains to qualify for direct German business sponsorships, Opportunity Cards, and EU Blue Card relocation.
                  </p>
                  
                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> 100% Sponsor Match Pathway
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> Live Production Project Deliverables
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> B1/B2 Fast-Track Linguistic Coaching
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-4 shrink-0">
                  <div className="bg-slate-900/95 text-white p-5 sm:p-6 rounded-2xl border border-slate-700/80 text-center min-w-[230px] w-full sm:w-auto shadow-2xl">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Career Pathway</span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 mb-1">100% Sponsor Match</div>
                    <span className="text-xs text-slate-300 font-medium">Opportunity Card &amp; Blue Card</span>
                  </div>
                  <button
                    onClick={() => handleOpenCourseModal(undefined, 'Job-Seeker Sub-Track', 'German Onboarding')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <span>Apply for Project Pilot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'reward-study-platform' && (
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
                <div className="space-y-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black tracking-widest text-amber-300 uppercase bg-amber-500/20 px-3.5 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Pathway 4 of 4 • Incentives, Certifications &amp; Rewards
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Tuition Fee Offset System
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                    Reward &amp; Study / Earning Platforms
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                    Turn your study time into tangible wealth. Earn points, gadget packages, fully paid European tour packages, and verified Freelance Consultant or Marketing Head certifications.
                  </p>
                  
                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 font-bold" /> Up to 50% Course Fee Concession
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 font-bold" /> European Travel Incentive Package
                    </span>
                    <span className="text-xs font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 font-bold" /> Verified Consultant Certifications
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-4 shrink-0">
                  <div className="bg-slate-900/95 text-white p-5 sm:p-6 rounded-2xl border border-slate-700/80 text-center min-w-[230px] w-full sm:w-auto shadow-2xl">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Fee Subsidy</span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 mb-1">Up to 50% Off</div>
                    <span className="text-xs text-slate-300 font-medium">German &amp; IELTS Courses</span>
                  </div>
                  <button
                    onClick={() => handleOpenCourseModal(promoCourseSelection, 'Student Sub-Track', 'Reward & Study')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-xl shadow-amber-400/25 transition-all flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <span>Enroll in Custom Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section Divider / Step 2 Ribbon connecting into the Services Catalog */}
          <div className="bg-slate-900 px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Step 2: Explore Available Streams &amp; Active Programs for {activeTabLabel} Below</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Select any stream below and click Apply Now to choose your course
            </span>
          </div>

        </div>
      </div>


      {/* ================= 3. ACTIVE PATHWAY COURSES & SERVICES CATALOG ================= */}
      <div className="container-max px-4 sm:px-6 space-y-10 pb-20">
        
        {/* Dynamic Section Render Area */}
        <div className="transition-all duration-300">
          
          {/* ================= BLOCK 1: WORK & STUDY IN INDIA ================= */}
          {activeTab === 'work-in-india' && (
            <div className="space-y-8 animate-in fade-in duration-300">

              {/* 4 Corporate Domain Cards (Fixed responsive height, streamlined features & stream selection) */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {jobCategories.map((item, idx) => {
                  const Icon = item.icon;
                  const currentStream = selectedStreams[item.category] || item.streams[0];

                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-500 transition-all flex flex-col justify-between group h-full"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-brand-100">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="font-black text-lg text-slate-900 mb-1 leading-snug">{item.category}</h3>
                        <div className="text-xs font-black text-brand-700 mb-3">{item.stipend}</div>

                        {/* Enhanced Feature List with 3 Key Training Highlights + Domain Roles */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100 mb-4">
                          {item.roles.map((r, rIdx) => {
                            const isMandatoryMilestone = rIdx < 3;
                            return (
                              <div key={rIdx} className={`flex items-start gap-2 text-xs ${isMandatoryMilestone ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                                <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isMandatoryMilestone ? 'text-amber-500 stroke-[2.5]' : 'text-emerald-600'}`} />
                                <span className="leading-tight">{r}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2.5">
                        {/* Dropdown Menu exactly above Apply Now button */}
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                            Select Stream / Course:
                          </label>
                          <div className="relative">
                            <select 
                              value={currentStream}
                              onChange={(e) => setSelectedStreams({ ...selectedStreams, [item.category]: e.target.value })}
                              className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 pr-7 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer transition-all appearance-none"
                            >
                              {item.streams.map((st, sIdx) => (
                                <option key={sIdx} value={st}>{st}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Apply Now Button - Triggers Smart Course Selection */}
                        <button 
                          onClick={() => handleOpenCourseModal(currentStream, 'Student Sub-Track', item.category)} 
                          className="w-full py-2.5 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-101"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Terms & Conditions Inline Link Trigger */}
                        <div className="text-center pt-0.5">
                          <button
                            type="button"
                            onClick={() => setTermsModalPackage(item)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-brand-700 underline underline-offset-2 transition-colors cursor-pointer inline-block"
                          >
                            Terms &amp; Conditions
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Dynamically Approved Work in India Packages */}
                {indiaDynamicPackages.map((pkg) => {
                  const currentStream = selectedStreams[pkg.title] || (pkg.streams && pkg.streams[0]) || 'General Track';
                  return (
                    <div 
                      key={pkg.id} 
                      className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between group h-full relative"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-100">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                            {pkg.badge}
                          </span>
                        </div>

                        <h3 className="font-black text-lg text-slate-900 mb-1 leading-snug">{pkg.title}</h3>
                        <div className="text-xs font-black text-emerald-700 mb-3">{pkg.stipend}</div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100 mb-4">
                          {pkg.roles.map((r, rIdx) => (
                            <div key={rIdx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                              <span className="leading-tight">{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2.5">
                        {pkg.streams && pkg.streams.length > 0 && (
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                              Select Stream / Course:
                            </label>
                            <div className="relative">
                              <select 
                                value={currentStream}
                                onChange={(e) => setSelectedStreams({ ...selectedStreams, [pkg.title]: e.target.value })}
                                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 pr-7 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-all appearance-none"
                              >
                                {pkg.streams.map((st, sIdx) => (
                                  <option key={sIdx} value={st}>{st}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => handleOpenCourseModal(currentStream, 'Student Sub-Track', pkg.title)} 
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-101"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 1-Year Certificate Detailed Banner */}
              <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-500/30">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Building2 className="w-4 h-4" /> Comprehensive Corporate Internship Letters
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    1-Year Verified Corporate Certificate for Embassy & Employer Files
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                    Every candidate enrolled in 'Work & Study in India' receives official project audits, verified client recommendation letters, and full visa sponsorship support for German Opportunity Cards and EU Blue Cards.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCourseModal(undefined, 'Student Sub-Track', 'IT & Automation')}
                  className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-lg hover:scale-102 transition-all shrink-0"
                >
                  Apply for Work & Study in India →
                </button>
              </div>

            </div>
          )}

          {/* ================= BLOCK 2: WORK & STUDY IN ABROAD ================= */}
          {activeTab === 'work-in-abroad' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Interactive Service Switcher & Details Container */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8">
                
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                  Select International Service Track or Part-Time Role:
                </label>

                {/* 5 Service Tabs */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                  {studyAbroadServices.map((svc) => {
                    const SvcIcon = svc.icon;
                    const isSelected = selectedAbroadService === svc.id;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => setSelectedAbroadService(svc.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 scale-102 ring-2 ring-emerald-300' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <SvcIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {svc.id === 'pickup' ? '1' : svc.id === 'student-services' ? '2' : svc.id === 'documentation' ? '3' : svc.id === 'it-roles' ? '4' : '5'}
                          </span>
                        </div>
                        <div className="font-black text-xs leading-snug">{svc.title}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Detail Card for Selected Service */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <AbroadIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          {activeAbroad.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                          {activeAbroad.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-emerald-700">{activeAbroad.subtitle}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {activeAbroad.desc}
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Core Deliverables & Highlights:</span>
                      {activeAbroad.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Earning Potential</span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 mb-1">
                        {activeAbroad.payout}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Verified Euro payouts deposited directly to your German N26/Sparkasse student account.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleOpenCourseModal(activeAbroad.title, 'Abroad Placement Track', 'European Student Roles')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>{activeAbroad.actionText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-[11px] text-center text-slate-500">
                        Fully complies with 20h/week German student visa legal regulations.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= BLOCK 3: GERMAN ONBOARDING PROJECTS ================= */}
          {activeTab === 'german-projects' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* 4 Active Projects Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {germanProjects.map((project, idx) => {
                  const Icon = project.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-indigo-100">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                            {project.category}
                          </span>
                        </div>

                        <h3 className="font-black text-xl text-slate-900 mb-1 leading-snug">{project.title}</h3>
                        <div className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
                          <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{project.location}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                          {project.desc}
                        </p>

                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
                          <div className="text-[10px] font-black uppercase text-indigo-700 mb-1">Career & Selection Pathway:</div>
                          <div className="text-xs font-bold text-slate-900">{project.careerPathway}</div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.skills.map((s, sIdx) => (
                            <span key={sIdx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleOpenCourseModal(project.title, 'Job-Seeker Sub-Track', project.category)} 
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Apply for Project Pilot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Dynamically Approved German Projects */}
                {germanDynamicPackages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-indigo-100">
                          <Globe2 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                          {pkg.badge}
                        </span>
                      </div>

                      <h3 className="font-black text-xl text-slate-900 mb-1 leading-snug">{pkg.title}</h3>
                      <div className="text-xs font-bold text-indigo-600 mb-3 flex items-center gap-1.5">
                        <Globe2 className="w-3.5 h-3.5" />
                        <span>Germany • {pkg.stipend}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
                        {pkg.description}
                      </p>

                      <div className="space-y-1.5 mb-6 pt-2 border-t border-slate-100">
                        {pkg.roles.slice(0, 3).map((r, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                            <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenCourseModal(pkg.title, 'Job-Seeker Sub-Track', pkg.badge)} 
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Apply for Project Pilot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Selection Pathway Matrix */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    Selection Pathway to International Careers
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    How Candidates Are Evaluated for Direct German Relocation
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                    Candidates who complete pilot milestones, maintain 85%+ client satisfaction, and attain German B1/B2 are directly presented to our German consortium partners for contract sponsorship and visa dispatch.
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('#jobs-page')}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-lg transition-all shrink-0"
                >
                  View German Sponsor Vacancies →
                </button>
              </div>

            </div>
          )}

          {/* ================= BLOCK 4: REWARD & STUDY / EARNING PLATFORMS ================= */}
          {activeTab === 'reward-study-platform' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Reward Platform 6 Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewardPlatformItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-100">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="font-black text-lg text-slate-900 mb-1 leading-snug">{item.title}</h3>
                        <div className="text-xs font-black text-amber-700 mb-2">{item.highlight}</div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-700 uppercase">Active Program Tier</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                      </div>
                    </div>
                  );
                })}

                {/* Dynamically Approved Reward Earning Packages */}
                {rewardDynamicPackages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-100">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          {pkg.badge}
                        </span>
                      </div>

                      <h3 className="font-black text-lg text-slate-900 mb-1 leading-snug">{pkg.title}</h3>
                      <div className="text-xs font-black text-amber-700 mb-2">{pkg.stipend}</div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">{pkg.description}</p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 mb-4">
                        {pkg.roles.slice(0, 3).map((r, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                            <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                            <span className="leading-tight">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenCourseModal(pkg.title, 'Student Sub-Track', 'Reward & Study')} 
                      className="w-full py-2.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Explore Incentive Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Promotional Courses & Work-While-Learn Plan Calculator */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-4 h-4" /> Promotional Courses & Work-While-Learn Calculator
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      Customize Your Work & Study Plan
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                      Select your target education program and desired work-and-study duration to instantly view qualifying fee concessions, reward points, and corporate stipend eligibility.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1.5">
                          Select Target Course:
                        </label>
                        <select
                          value={promoCourseSelection}
                          onChange={(e) => setPromoCourseSelection(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-400"
                        >
                          <option value="German A1-B2 + Tech Work-While-Learn">German A1-B2 + Tech Work-While-Learn</option>
                          <option value="German Medical & Healthcare + Hospital Pilot">German Medical + Hospital Pilot</option>
                          <option value="Solar & CleanTech Business Toolkit + German Prep">Solar Business Toolkit + German Prep</option>
                          <option value="IELTS International + Cross-Border Logistics">IELTS International + Cross-Border Logistics</option>
                          <option value="Full-Stack AI Coding + Remote EU IT Role">Full-Stack AI Coding + Remote EU IT Role</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-300 uppercase mb-1.5">
                          Work-While-Learn Duration:
                        </label>
                        <select
                          value={promoPlanDuration}
                          onChange={(e) => setPromoPlanDuration(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-400"
                        >
                          <option value="3-Month Foundation Pilot">3-Month Foundation Pilot (₹45,000 Stipend)</option>
                          <option value="6-Month Integrated Pilot">6-Month Integrated Pilot (₹1,20,000 Stipend)</option>
                          <option value="1-Year Full Certification">1-Year Full Certification (₹3,00,000+ Stipend & Tour)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Plan Summary</span>
                      <h4 className="text-lg font-black text-white mt-1 leading-snug">{promoCourseSelection}</h4>
                      <div className="text-xs text-slate-300 mt-0.5">{promoPlanDuration}</div>

                      <div className="mt-4 pt-3 border-t border-white/15 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-200">
                          <span>Course Fee Discount:</span>
                          <span className="font-bold text-emerald-400">Up to 50% Off</span>
                        </div>
                        <div className="flex justify-between text-slate-200">
                          <span>Experience Letter:</span>
                          <span className="font-bold text-amber-300">1-Year Verified Corporate Letter</span>
                        </div>
                        <div className="flex justify-between text-slate-200">
                          <span>Reward Tier:</span>
                          <span className="font-bold text-amber-300">Eligible for EU Tour & Tech Kit</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenCourseModal(promoCourseSelection, 'Student Sub-Track', 'IT & Automation')}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Enroll in Custom Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* ================= 4. ROYAL ILAS COMPANION AI TEASER ================= */}
        <section className="bg-slate-950 p-8 sm:p-10 rounded-3xl text-white border-2 border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-amber-400 font-black uppercase text-xs mb-2 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" /> Royal Lifetime Mentorship
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-100">Ilas With You Consultant AI</h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl font-medium">
              24/7 AI Career Mentor: Market task analysis, automated case study assistance, and corporate communication help throughout your work-and-study journey.
            </p>
          </div>
          <button 
            onClick={() => navigateTo('#ilas-companion')} 
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm whitespace-nowrap cursor-pointer shadow-lg hover:scale-102 transition-all shrink-0"
          >
            Access Ilas Companion Now →
          </button>
        </section>

      </div>

      {/* ================= TERMS & CONDITIONS COMPACT MODAL ================= */}
      {termsModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-4">
            
            <button 
              onClick={() => setTermsModalPackage(null)} 
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Verified Program Terms
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-snug mt-0.5">
                  {termsModalPackage.category || termsModalPackage.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed pt-1">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-black text-slate-900 text-xs">Training &amp; Stipend Structure:</div>
                <div className="space-y-1 text-[11px]">
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <strong>Initial Session:</strong> 6 Months structured training session with industry mentors.
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <strong>Monthly Stipend:</strong> ₹15,000 to ₹25,000 / month based on milestone performance reviews.
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <strong>Post-Training:</strong> Real-time onboarding &amp; permanent employment opportunities with domestic and European partner syndicates.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-black text-slate-900 text-xs">Candidate Eligibility &amp; Compliance:</div>
                <p className="text-slate-600 text-[11px]">
                  {termsModalPackage.terms || termsModalPackage.termsAndConditions || 'Candidates must maintain minimum 85% attendance across all technical and soft skill modules. 1-Year Verified Corporate Certificate is officially endorsed for German Opportunity Card and EU Blue Card embassy files.'}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-[11px] font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>Includes official corporate project portfolio, mentor recommendation letters, and Embassy visa sponsorship documentation.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setTermsModalPackage(null)} 
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
              >
                Understood &amp; Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pre-Application Course Selection Modal */}
      <WorkStudyCourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onConfirm={handleCourseSelectionConfirmed}
        initialCourse={modalInitialCourse}
        initialTrack={modalInitialTrack}
        initialDomain={modalInitialDomain}
      />

    </div>
  );
}
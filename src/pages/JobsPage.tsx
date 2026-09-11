import { StudentJobJourney } from '../components/jobs/StudentJobJourney';
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Laptop, 
  Sparkles, 
  Gift, 
  Award, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Crown, 
  Bell, 
  Mail, 
  CheckCircle2, 
  GraduationCap, 
  Target, 
  TrendingUp 
} from 'lucide-react';

// Safe localStorage helper to prevent any missing db import crashes
const safeSaveInquiry = (data: any) => {
  try {
    const existing = JSON.parse(localStorage.getItem('ilas_inquiries') || '[]');
    const newEntry = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
    existing.push(newEntry);
    localStorage.setItem('ilas_inquiries', JSON.stringify(existing));
    return newEntry;
  } catch (err) {
    console.error('Storage save error:', err);
    return data;
  }
};

const jobBrochureStories = [
  {
    id: 'free-placement',
    tag: '100% Free Placement',
    badge: '€0 Placement Route',
    title: 'Unlock €0 Free European Placement via Work While You Study',
    subtitle: 'Zero Upfront Fees • Sponsored Corporate Relocation',
    desc: 'Work on live business and technical pilots in India for 6 months. Qualifying project performers transition directly into our European partner companies with complete visa and placement sponsorship.',
    targetSection: 'free-placement-service',
    statNumber: '€0',
    statLabel: 'Fee via Incubation',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=1600'
  },
  {
    id: 'reward-visa',
    tag: 'Reward Club & Points',
    badge: 'Points to Job',
    title: 'Refer 3 Candidates & Claim Complete Placement Waiver',
    subtitle: 'Peer Recommendations Unlock 100% Free Fast-Track Placement',
    desc: 'Earn continuous cashback reward points for friend referrals and module clearances. Redeem points for complete fee waivers on 6, 12, and 18-week European placement packages.',
    targetSection: 'packages',
    statNumber: '100%',
    statLabel: 'Placement Fee Waiver',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=85&w=1600'
  },
  {
    id: 'executive-business',
    tag: 'Executive Specialization',
    badge: 'Business Candidate Path',
    title: 'Executive Business Package with Ilas AI Placement Mentor',
    subtitle: 'Direct C-Suite Partner Introductions & Compensation Architecture',
    desc: 'Tailored for corporate managers, C-suite executives, and business leaders. Combined with 24/7 Ilas AI Placement Companion to craft executive dossiers and board networking.',
    targetSection: 'business-executive',
    statNumber: 'C-Suite',
    statLabel: 'Executive Network',
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=85&w=1600'
  },
  {
    id: 'services-overview',
    tag: 'End-to-End Suite',
    badge: 'Professional Placement',
    title: 'Resume Architecture, ATS Tuning & Local Market Intel',
    subtitle: 'Full Support from Initial CV Audit to Final Employment Contract',
    desc: 'Get high-impact Europass CV and Cover Letter tuning, proprietary AI profile matching, continuous upskilling certifications, and salary negotiation backing.',
    targetSection: 'services',
    statNumber: '500+',
    statLabel: 'Verified Partner Network',
    bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=85&w=1600'
  }
];

const jobListings = [
  {
    id: 1,
    title: "Registered Nurse / Healthcare Specialist",
    location: "Frankfurt / Munich, Germany",
    type: "Full-Time • Hospital Sponsorship",
    category: "Healthcare",
    salary: "€38,000 - €52,000 / yr",
    match: "98% Match"
  },
  {
    id: 2,
    title: "Full-Stack Software Engineer (React / Python)",
    location: "Berlin, Germany (Hybrid)",
    type: "Full-Time • Blue Card Eligible",
    category: "IT & Tech",
    salary: "€55,000 - €78,000 / yr",
    match: "95% Match"
  },
  {
    id: 3,
    title: "Solar & Electrical Systems Technician",
    location: "Stuttgart, Germany",
    type: "Full-Time • Relocation Package",
    category: "Engineering",
    salary: "€42,000 - €58,000 / yr",
    match: "92% Match"
  },
  {
    id: 4,
    title: "International Trade & Logistics Coordinator",
    location: "Hamburg, Germany",
    type: "Full-Time • Work Visa Sponsored",
    category: "Commerce",
    salary: "€40,000 - €54,000 / yr",
    match: "90% Match"
  }
];

const services = [
  {
    icon: Search,
    title: "Strategic Job Search",
    description: "Aggressive application strategy across our exclusive partner network and global portals.",
    details: ["Partner Network Access", "Live Portal Tracking", "Multi-Portal Management"]
  },
  {
    icon: FileText,
    title: "Resume & ATS Architecture",
    description: "High-impact Europass CV and Cover Letter creation optimized for European ATS systems.",
    details: ["AI Keyword Tuning", "German/EU Standard", "ATS V12 Optimization"]
  },
  {
    icon: Target,
    title: "AI Profile Matching",
    description: "Proprietary algorithms that match your skills with specific job descriptions.",
    details: ["Skill Gap Analysis", "Compatibility Scoring", "Smart Recommendations"]
  },
  {
    icon: MapPin,
    title: "Local Market Intel",
    description: "Hyper-local job finding and status updates on regional European employment demands.",
    details: ["Nearby Opportunities", "Commute Analysis", "Local Market Reports"]
  },
  {
    icon: TrendingUp,
    title: "Continuous Upskilling",
    description: "Automated recommendations for professional training based on target job requirements.",
    details: ["Skill Pathing", "Certification Advice", "Training Discounts"]
  },
  {
    icon: ShieldCheck,
    title: "End-to-End Support",
    description: "Complete commitment from profile audit to embassy visa and offer negotiation.",
    details: ["Regular Status Updates", "Interview Prep", "Offer Negotiation"]
  }
];

const packages = [
  {
    name: "Fast-Track Placement",
    duration: "6 Weeks",
    freeHeadline: "€0 FREE WITH REWARDS",
    freeOption: "Refer 3 Candidates or use Reward Points to get this 100% Free",
    freeLink: "#rewards",
    description: "Intensive career support designed for quick market entry with focused application bursts.",
    features: [
      "Personalized European Career Roadmap",
      "50+ Strategic Direct Applications",
      "Europass AI Resume & Cover Letter Tuning",
      "Basic Live Interview Coaching Session",
      "Live Portal Tracking Access with Alerts"
    ],
    color: "bg-white",
    border: "border-slate-300",
    accent: "text-brand-600",
    badgeBg: "bg-slate-900 text-amber-300 border border-amber-500/40"
  },
  {
    name: "Professional Growth",
    duration: "12 Weeks",
    freeHeadline: "€0 FREE VIA Work While You Study",
    freeOption: "Join as Junior Consultant & Complete Pilot to get this 100% Free",
    freeLink: "#learn-while-earn",
    description: "Comprehensive mid-term strategy offering a deep dive into multiple European industry sectors.",
    features: [
      "Advanced European Market Placement Strategy",
      "150+ Direct Employer Applications",
      "Premium ATS Portfolio & Recommendation Letter",
      "3 Live Mock Technical/HR Interview Sessions",
      "Weekly Strategic Review with Placement Lead",
      "Direct German Recruiter Introductions"
    ],
    color: "bg-slate-900",
    border: "border-amber-400",
    accent: "text-amber-400",
    highlight: true,
    badgeBg: "bg-amber-400/20 text-amber-300 border border-amber-400/40"
  },
  {
    name: "Elite Career Mastery",
    duration: "18 Weeks",
    freeHeadline: "€0 FREE FOR PILOT PERFORMERS",
    freeOption: "Free for Validated Local Business Performers & Executive Referrals",
    freeLink: "#learn-while-earn",
    description: "Full-scale career transition management with absolute commitment to European placement success.",
    features: [
      "Direct German Corporate Sponsorship Focus",
      "Unlimited Strategic Employer Applications",
      "Executive Personal Brand & Portfolio Building",
      "Unlimited 1-on-1 Mock Interview Coaching",
      "Salary Negotiation & Employment Contract Audit",
      "Priority Ilas With You 24/7 AI Mentorship"
    ],
    color: "bg-white",
    border: "border-slate-300",
    accent: "text-brand-700",
    badgeBg: "bg-slate-900 text-amber-300 border border-amber-500/40"
  }
];

export default function JobsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('job-matcher');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('Germany');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % jobBrochureStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (url: string) => { 
    window.location.hash = url; 
  };

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentStory = jobBrochureStories[currentSlide];

  return (
    <div className="pt-20 bg-slate-100 min-h-screen">

      {/* 1. Photogenic Hero Section */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-20 px-6 rounded-b-[3rem] shadow-2xl mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=1600')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="container-max mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-400" /> European Corporate Career Gateway
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            Work in Germany &amp; Europe with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Ilas With You</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Direct employer placement, verified work visa sponsorship, and AI-powered profile matching across Germany, Austria, Switzerland, and the UK.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollTo('job-matcher')} 
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl text-sm transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              Split-Screen Job Matcher <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollTo('job-matcher')} 
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-400" /> Upload Resume / CV
            </button>
          </div>
        </div>
      </section>

      {/* ================= 1. SUB-NAVIGATION ================= */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 mb-6 shadow-xs">
        <div className="container-max mx-auto px-4 flex justify-center items-center gap-4 sm:gap-8 flex-wrap">
          {[
            { id: 'job-matcher', label: '⚡ AI Job Matcher & ATS' },
            { id: 'job-benefits-section', label: '🌟 Career & Work Rights' },
            { id: 'job-support-section', label: '🤝 Other Support Services' },
            { id: 'free-placement-service', label: '🎁 Free Placement (€0)' },
            { id: 'packages', label: '💼 Packages & Rates' },
            { id: 'business-executive', label: '👔 Executive Path' },
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={`text-xs sm:text-sm font-bold pb-1 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected 
                    ? 'text-brand-600 border-b-2 border-brand-600' 
                    : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-max px-4 sm:px-6 space-y-16 pb-20">
        
        {/* ================= 2. TOP SPLIT INTAKE: SEARCH & VERTICAL CARDS (LEFT) + HIGH-VISIBILITY BROCHURE (RIGHT) ================= */}
        {/* ================= 2. JOBS & CAREERS JOURNEY (SPLIT-SCREEN AI MATCHER & RESULTS) ================= */}
        <section id="job-matcher" className="scroll-mt-32">
          <StudentJobJourney />
        </section>

        {/* ================= 3. 100% FREE PLACEMENT PACKAGE EXPLANATION ================= */}
        <section id="free-placement-service" className="scroll-mt-28 space-y-4 border-t border-slate-200 pt-12">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10 rounded-3xl text-white shadow-2xl border-2 border-amber-400/50">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-white/10 px-3.5 py-1 rounded-full border border-amber-400/20 inline-flex items-center gap-1.5 mb-3">
                  <Gift className="w-3.5 h-3.5 text-amber-400" /> 100% Free Placement Package
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white leading-tight">
                  Get Your Free European Placement Service If You're Working on Our Onboarding Projects
                </h3>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5">
                  You never have to pay out-of-pocket placement package fees. Join our venture as a <strong>Junior Consultant</strong>, work on live administration, marketing, or technical service pilots for 6 months, earn ₹10,000 to ₹30,000 monthly stipend, and cross 1 year with us to receive <strong>100% Free Placement + German Business Sponsorship</strong>!
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs font-semibold text-amber-200">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Free Placement Package</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Visa & Education Offers</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Lifetime Reward Points</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/10 p-6 rounded-2xl border border-white/15 backdrop-blur-md text-center">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Reward Club Advantage</span>
                <h4 className="text-xl font-black text-white mt-1 mb-2">Join Junior Consultant</h4>
                <p className="text-xs text-slate-300 mb-5">
                  Reward club will get you Join Junior Consultant, earn ₹10k–₹30k/mo stipend while validating your German sponsor project, and get free visa service.
                </p>
                <button 
                  onClick={() => navigateTo('#learn-while-earn')} 
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Apply to Work While You Study <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-black uppercase">
                  <Award className="w-4 h-4" /> Reward Program Cashback
                </div>
                <h4 className="text-base font-bold text-white mb-2">Refer Candidates & Claim Free Placement</h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Earn continuous cashback reward points for peer recommendations and module clearances. Redeem your points to waive 100% of placement package costs.
                </p>
              </div>
              <button 
                onClick={() => navigateTo('#rewards')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
              >
                Explore Reward Plan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-black uppercase">
                  <GraduationCap className="w-4 h-4" /> Education & Visa Integration
                </div>
                <h4 className="text-base font-bold text-white mb-2">German (A1-B2) & Technical Certification</h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Fast-track your European hiring probability with certified Goethe German and specialized tech modules with exclusive scholarship discounts.
                </p>
              </div>
              <button 
                onClick={() => navigateTo('#education')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
              >
                View Education Programs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ================= 4. PLACEMENT PACKAGES & RATES ================= */}
        <section id="packages" className="scroll-mt-28 border-t border-slate-200 pt-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest text-indigo-700 uppercase bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              European Placement Packages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-2">Placement Packages & Rates</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Choose your direct package or unlock <strong className="text-brand-600">100% Free €0 Placement</strong> through our partner incubation tracks.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index} 
                className={`${pkg.color} ${pkg.border} p-8 sm:p-10 rounded-3xl border-2 flex flex-col justify-between relative shadow-lg hover:shadow-2xl transition-all ${
                  pkg.highlight ? 'ring-4 ring-amber-400/30' : ''
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}
                
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-black uppercase tracking-wider ${pkg.accent}`}>{pkg.duration} Track</span>
                    </div>
                    <h3 className={`text-2xl sm:text-3xl font-black ${pkg.color === 'bg-slate-900' ? 'text-white' : 'text-slate-900'}`}>
                      {pkg.name}
                    </h3>
                  </div>

                  <div 
                    onClick={() => navigateTo(pkg.freeLink)}
                    className={`p-4 rounded-2xl mb-6 cursor-pointer hover:scale-[1.02] transition-all ${pkg.badgeBg}`}
                  >
                    <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-400" /> {pkg.freeHeadline}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white leading-snug flex items-center justify-between">
                      <span>{pkg.freeOption}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-amber-400 ml-2" />
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-medium ${pkg.color === 'bg-slate-900' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {pkg.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.color === 'bg-slate-900' ? 'text-amber-400' : 'text-brand-600'}`} />
                        <span className={pkg.color === 'bg-slate-900' ? 'text-slate-200' : 'text-slate-700'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => navigateTo(`#applications?tab=Jobs - Package: ${pkg.name} (${pkg.duration})`)}
                    className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                      pkg.highlight 
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                        : pkg.color === 'bg-slate-900'
                        ? 'bg-white hover:bg-slate-100 text-slate-950'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Apply For This Package <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigateTo(pkg.freeLink)}
                    className="w-full py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                  >
                    Check How to Get it for €0 Free →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5. EXECUTIVE BUSINESS CANDIDATE PATH ================= */}
        <section id="business-executive" className="scroll-mt-28 border-t border-slate-200 pt-12">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 border border-amber-500/30">
                  <Crown className="w-4 h-4" /> Executive Specialization & Ilas With You Companion
                </div>
                <h3 className="text-2xl sm:text-4xl font-black mb-3 text-amber-100">
                  Executive Business Package with <span className="text-amber-400">Ilas AI Placement Mentor</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
                  Tailored for corporate managers, C-suite executives, and business leaders. Combined with <strong>24/7 Ilas AI Placement Companion</strong> to craft executive dossiers, direct German board networking, European compensation negotiations, and real-time embassy clearance assistance.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-xs text-amber-400 mb-1">Executive C-Suite Network</h4>
                    <p className="text-[11px] text-slate-300">Direct partner introductions to German corporate executive boards.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-xs text-amber-400 mb-1">Ilas AI Brand Architecture</h4>
                    <p className="text-[11px] text-slate-300">AI-engineered leadership portfolio, ATS v12 tuning, and interview simulation.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => navigateTo('#applications?tab=Jobs - Business Candidate Package')}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    Enroll Executive Business Path <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigateTo('#ilas-companion')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs sm:text-sm transition-all border border-white/20 cursor-pointer flex items-center gap-2"
                  >
                    Access Ilas Companion Now →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 rounded-2xl text-center backdrop-blur-md">
                <Crown className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h4 className="font-black text-lg text-white mb-1">Lifetime Mentorship</h4>
                <p className="text-xs text-slate-300 mb-4">Permanent career support across all EU territories.</p>
                <div className="text-xs font-bold text-emerald-400">✓ Dedicated C-Suite Account Lead</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. LIVE APPLICATION TRACKER ================= */}
        <section id="candidate-tracking" className="scroll-mt-28 border-t border-slate-200 pt-12">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-brand-500/30">
                  <Bell className="w-3 h-3" /> Real-Time Candidate Hub
                </span>
                <h2 className="text-xl sm:text-2xl font-black mb-2">
                  Live Application Tracker & Instant Email Alerts
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Login to track every employer application, interview schedule, and recruiter response in real-time. Automated email alerts keep you updated on every progress step.
                </p>

                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Live status tracking on portal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant email status notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Direct recruiter message history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Europass ATS resume scoring</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-[10px]">
                      LIVE
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Application Pipeline</h4>
                      <p className="text-[9px] text-slate-400">European Employer API Active</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Connected
                  </span>
                </div>

                <div className="space-y-2 mb-3 text-xs">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">Hospital Network Frankfurt</p>
                      <p className="text-[9px] text-slate-400">Interview Scheduled</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">Passed ATS</span>
                  </div>

                  <div className="p-2 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">Berlin Software Group</p>
                      <p className="text-[9px] text-slate-400">Dossier Under Review</p>
                    </div>
                    <span className="text-amber-400 font-bold text-[10px]">In Review</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigateTo('#applications?tab=Jobs - Portal Login')}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Laptop className="w-3.5 h-3.5" /> Login to Candidate Portal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 7. PLACEMENT SERVICES ================= */}
        <section id="services" className="scroll-mt-28 border-t border-slate-200 pt-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-black tracking-widest text-brand-700 uppercase bg-brand-50 px-3 py-0.5 rounded-full border border-brand-200">
              End-to-End Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">Professional Placement Services</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Everything needed to transition into international corporate careers.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3 text-brand-600 border border-brand-100">
                      <ServiceIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {service.description}
                    </p>
                    <ul className="space-y-1 mb-4">
                      {service.details.map((detail, dIndex) => (
                        <li key={dIndex} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => navigateTo(`#applications?tab=Jobs - Service: ${encodeURIComponent(service.title)}`)}
                    className="w-full py-2 bg-slate-50 hover:bg-brand-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Apply for this Service →
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
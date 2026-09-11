import { StudentVisaJourney } from '../components/visa/StudentVisaJourney';
import { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Briefcase, 
  Globe, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  FileText, 
  Crown, 
  Gift, 
  HeartHandshake, 
  Baby, 
  Stethoscope,
  Plane
} from 'lucide-react';

const visaCategories = [
  {
    id: 'student-visa',
    icon: GraduationCap,
    title: 'Student Visa & APS',
    badge: '€0 Tuition Path',
    tag: 'Education',
    subtitle: 'University Enrollment & Fast-Track Documentation',
    description: 'Complete end-to-end processing for university admissions, Sperrkonto (Blocked Account) setup, health insurance, and embassy visa file clearance.',
    requirements: ['University Admission Letter', 'Proof of Blocked Account', 'Language Certificate (A1-B2/IELTS)', 'APS Certificate'],
    benefits: ['Pathway to Permanent Residency (PR)', 'Legal 20 hrs/week Work Permit', '18-Month Post-Study Job Visa']
  },
  {
    id: 'opportunity-card',
    icon: Sparkles,
    title: 'Opportunity Card (Chancenkarte)',
    badge: 'Points-Based 2024-2026',
    tag: 'Career Entry',
    subtitle: 'Points-Based Fast-Track into the German Job Market',
    description: 'Enter Germany with or without a prior job offer. We calculate your points, verify degrees with ZAB, and structure your visa dossier for rapid clearance.',
    requirements: ['Points Matrix Calculation (Min 6 Pts)', 'Language (A1 German / B2 English)', 'Recognized Degree / Trade Certificate', 'Proof of Living Funds'],
    benefits: ['1-Year Legal Stay to Find Jobs', 'Work up to 20 hrs/week while searching', 'Direct conversion to EU Blue Card']
  },
  {
    id: 'nursing-healthcare',
    icon: Stethoscope,
    title: 'Healthcare & Nursing Visa (18a/18b)',
    badge: 'Direct Hospital Contract',
    tag: 'Clinical',
    subtitle: 'Fast-Track Clinical Recognition & Employment',
    description: 'Dedicated immigration track for registered nurses and healthcare practitioners with employer sponsorship and Defizitbescheid processing.',
    requirements: ['Nursing Degree / Diploma', 'B1/B2 German Certificate', 'Defizitbescheid Document', 'Employer Offer Letter'],
    benefits: ['Direct Hospital Employment', 'Subsidized Relocation & Flights', 'Family Reunion Authorization']
  },
  {
    id: 'au-pair-program',
    icon: Baby,
    title: 'Au Pair & Social Care (FSJ)',
    badge: 'Childcare & Stay',
    tag: 'Cultural Exchange',
    subtitle: 'Live with German Host Families & Master the Language',
    description: 'Experience German culture firsthand by assisting host families with childcare. Receive free accommodation, food, monthly pocket money, and language study support.',
    requirements: ['Age between 18 - 26 Years', 'Basic German (A1 Goethe/Telc)', 'Clean Police Clearance Record', 'Valid Passport & Medical Health'],
    benefits: ['Free Board, Private Room & Meals', 'Guaranteed Monthly Pocket Money', 'Easy Visa Approval Route']
  },
  {
    id: 'job-seeker-visa',
    icon: Search,
    title: 'Job Seeker & Blue Card',
    badge: 'Skilled Work Entry',
    tag: 'Employment',
    subtitle: 'Direct Gateway for Engineers, IT & Business Executives',
    description: 'Designed for qualified graduates and seasoned corporate professionals to attend in-person interviews and transition to full European work permits.',
    requirements: ['Anabin Recognized Degree', 'German/EU Standard CV', 'Proof of Accommodation', 'Health Insurance Cover'],
    benefits: ['Direct Interview Access', 'Immediate EU Blue Card Status', 'PR Qualification in 21-27 Months']
  },
  {
    id: 'schengen-business',
    icon: Globe,
    title: 'Schengen & Business Visa',
    badge: '27+ European States',
    tag: 'Short-Stay',
    subtitle: 'Corporate Meetings, Tourism & Trade Fairs',
    description: 'Seamless travel authorization across all 27 Schengen member states for leisure, family reunions, exploratory visits, or corporate trade summits.',
    requirements: ['Passport with 6-Month Validity', 'Round-trip Flight & Hotel Bookings', 'Travel Insurance (€30,000 cover)', 'Financial Bank Statements'],
    benefits: ['Access to 27 European Countries', 'Expedited Embassy Appointments', 'Comprehensive Itinerary Support']
  }
];

const benefitItems = [
  { icon: ShieldCheck, title: "100% Embassy Compliant", highlight: "AI Document Audit", desc: "eliminating common visa rejection errors.", link: "#applications?tab=Visa" },
  { icon: Gift, title: "Reward Ecosystem", highlight: "Cashback Perks", desc: "per visa milestone & referral rewards.", link: "#rewards" },
  { icon: Search, title: "Integrated Job Hunting", highlight: "Direct Placement", desc: "with European employer networks.", link: "#jobs" },
  { icon: Briefcase, title: "Work While You Study", highlight: "Junior Consultant", desc: "stipend during your intake process.", link: "#learn-while-earn" }
];

export default function VisaPage() {
  const [selectedVisaId, setSelectedVisaId] = useState(visaCategories[0].id);

  const navigateTo = (url: string) => { 
    window.location.hash = url; 
  };

  const selectedVisa = visaCategories.find(v => v.id === selectedVisaId) || visaCategories[0];
  const SelectedIcon = selectedVisa.icon;

  const [activeNav, setActiveNav] = useState('visa-matcher');

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      
      {/* 1. Compact Photogenic Hero Section */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-20 px-6 rounded-b-[3rem] shadow-2xl mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000&auto=format&fit=crop')] opacity-15 bg-cover bg-center mix-blend-overlay" />
        <div className="container-max mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-white/15">
            <Cpu className="w-4 h-4 text-amber-400" /> AI-Powered Global Visa Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            Fast-Track European Visas with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Ilas With You</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional AI-trained automation for Student, Opportunity Card, Healthcare, Au Pair, and Skilled Employment Visas with 100% embassy compliance.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollTo('visa-matcher')} 
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl text-sm transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              Start AI Visa Assessment <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollTo('visa-matcher')} 
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-emerald-400" /> Upload Resume / Bio-Data
            </button>
          </div>
        </div>
      </section>

      {/* 2. Sleek Modular Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 mb-8 transition-all duration-300">
        <div className="container-max mx-auto px-6 flex justify-start md:justify-center gap-8 overflow-x-auto hide-scrollbar">
          {[
            { id: 'visa-matcher', label: '⚡ AI Visa Matcher & ATS' },
            { id: 'visa-benefits-section', label: '🌟 Benefits of European Visas' },
            { id: 'visa-support-section', label: '🤝 Other Support & Services Available' },
            { id: 'visa-categories-section', label: '🛂 Visa Categories Guide' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={`text-base font-bold pb-2 transition-all cursor-pointer whitespace-nowrap ${
                activeNav === tab.id 
                  ? 'text-brand-600 border-b-2 border-brand-600' 
                  : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Visa Showcase Section */}
      <div className="container-max mx-auto px-6 space-y-24 pb-20">
        
        {/* ================================================================= */}
        {/* CORE ARCHITECTURE: SPLIT-SCREEN VISA MATCHER & IMMIGRATION HUB   */}
        {/* ================================================================= */}
        <section id="visa-matcher" className="scroll-mt-32">
          <StudentVisaJourney />
        </section>
        
        {/* Visa Category Grid Selection */}
        <section id="visa-categories-section" className="scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black tracking-widest text-brand-700 uppercase bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
              Immigration Pathways
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-2">Select Your Visa Category</h2>
            <p className="text-slate-600 text-base">Select a specialized pathway to review requirements, processing steps, and benefits.</p>
          </div>

          {/* 6 High-Impact Visual Category Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {visaCategories.map((visa) => {
              const Icon = visa.icon;
              const isSelected = selectedVisaId === visa.id;
              return (
                <div 
                  key={visa.id} 
                  onClick={() => {
                    setSelectedVisaId(visa.id);
                    scrollTo('visa-details-section');
                  }}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between cursor-pointer group shadow-sm ${
                    isSelected 
                      ? 'border-2 border-brand-600 bg-brand-50/20 shadow-md ring-2 ring-brand-500/20' 
                      : 'bg-white border-slate-200 hover:border-brand-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                        isSelected ? 'bg-brand-600 text-white border-brand-600' : 'bg-brand-50 text-brand-600 border-brand-100'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                        {visa.badge}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold transition-colors ${isSelected ? 'text-brand-700 font-black' : 'text-slate-900 group-hover:text-brand-600'}`}>
                      {visa.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                      {visa.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mt-6 pt-3 border-t border-slate-100">
                    <span>{isSelected ? '✓ Viewing Details' : visa.tag}</span>
                    <span className="text-brand-600 group-hover:translate-x-0.5 transition-transform flex items-center">Explore →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Visa Details & Requirements Panel */}
          <div id="visa-details-section" className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <SelectedIcon className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{selectedVisa.tag} Pathway</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedVisa.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => navigateTo(`#applications?tab=Visa - ${selectedVisa.title}`)} 
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-2"
              >
                Apply for {selectedVisa.title} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-4xl">
              {selectedVisa.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Requirements */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" /> Mandatory Requirements
                </h4>
                <ul className="space-y-3">
                  {selectedVisa.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <h4 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Key Pathway Benefits
                </h4>
                <ul className="space-y-3">
                  {selectedVisa.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Guaranteed Benefits & Fast-Track Architecture */}
        <section>
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left: Guaranteed Benefits */}
            <div className="lg:col-span-6 bg-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black mb-6 border-b border-slate-800 pb-3">Guaranteed Visa Architecture</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {benefitItems.map((b) => {
                    const BenefitIcon = b.icon;
                    return (
                      <div 
                        key={b.title} 
                        onClick={() => navigateTo(b.link)} 
                        className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                          <BenefitIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">{b.title}</h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            <span className="text-amber-400 font-bold">{b.highlight}</span> {b.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <button 
                  onClick={() => navigateTo('#applications?tab=Visa')} 
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-all shadow-md"
                >
                  Start Dossier Preparation →
                </button>
              </div>
            </div>

            {/* Right: Quick Document Upload Box */}
            <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">AI Document Review</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 mb-2">Preliminary Eligibility Assessment</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Upload your passport, academic transcripts, or CV. Our automated evaluation engine checks your points and visa qualification probabilities instantly.
                </p>

                <div 
                  onClick={() => navigateTo('#applications?tab=Visa')}
                  className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-3 bg-slate-50 hover:border-brand-500 hover:bg-brand-50/20 transition-all cursor-pointer group mb-6"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 shadow-sm transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900 text-sm">Upload Credentials for Review</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">PDF, JPG, DOCX (Max 25MB)</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigateTo('#applications?tab=Visa')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                Submit Documents for Evaluation <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* 4. Royal Ilas Companion Showcase */}
        <section className="bg-slate-950 p-8 sm:p-10 rounded-3xl text-white border-2 border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-amber-400 font-black uppercase text-xs mb-2 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" /> Royal Lifetime Mentorship
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-100">Ilas With You Companion</h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              24/7 AI Legal & Visa Assistant: Real-time points calculation, embassy interview checklists, and document verification.
            </p>
          </div>
          <button 
            onClick={() => navigateTo('#ilas-companion')} 
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm whitespace-nowrap cursor-pointer transition-all shadow-lg shadow-amber-500/20"
          >
            Access Companion Now →
          </button>
        </section>

      </div>
    </div>
  );
}
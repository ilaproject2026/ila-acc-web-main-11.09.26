import { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Upload, 
  HeartHandshake, 
  ShieldCheck, 
  TrendingUp, 
  Compass, 
  Crown, 
  Gift, 
  Search, 
  ArrowRight, 
  Briefcase, 
  Globe, 
  Home, 
  Landmark, 
  FileText,
  Code
} from 'lucide-react';

import { StudentAbroadJourney } from '../components/abroad/StudentAbroadJourney';

export default function StudyAbroadPage() {
  const [activeNav, setActiveNav] = useState('course-matcher');

  const navigateTo = (url: string) => { 
    window.location.hash = url; 
  };

  const scrollTo = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const benefitItems = [
    { icon: GraduationCap, title: "€0 Tuition Public Uni", highlight: "100% Free Tuition", desc: "in world-class German universities.", link: "#applications?tab=Study Abroad" },
    { icon: Briefcase, title: "Part-Time Work Rights", highlight: "20 Hrs/Week", desc: "legal student work allowance with good pay.", link: "#learn-while-earn" },
    { icon: TrendingUp, title: "18-Month Job Seeking Visa", highlight: "Post-Study Visa", desc: "to transition into European corporate jobs.", link: "#jobs" },
    { icon: Gift, title: "Reward Ecosystem", highlight: "Cashback Perks", desc: "per academic milestone & peer referrals.", link: "#rewards" }
  ];

  const complimentaryServices = [
    { icon: Home, title: "Accommodation & Pickup", desc: "Guaranteed student dorms, WG flatshare assistance, and airport reception upon arrival in Germany.", tag: "Arrival Care" },
    { icon: Landmark, title: "Blocked Account & Insurance", desc: "End-to-end guidance for Sperrkonto (Blocked Account) setup and TK/AOK public health insurance.", tag: "Finance & Health" },
    { icon: Briefcase, title: "Part-Time Job Assistance", desc: "Direct connecting with student job pools (20 hrs/week) to support monthly living expenses easily.", tag: "Student Income" },
    { icon: ShieldCheck, title: "21-Day Visa & APS Clearance", desc: "Fast-track APS document verification, embassy appointment booking, and visa file preparation.", tag: "Visa Processing" },
    { icon: FileText, title: "Uni-Assist & Attestation", desc: "Official German translation, certified document notarization, and error-free Uni-Assist submissions.", tag: "Documentation" },
    { icon: HeartHandshake, title: "Local Registration (Anmeldung)", desc: "In-person guidance for German city hall registration (Anmeldung) and local bank account opening.", tag: "Settlement Support" }
  ];

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      
      {/* 1. Compact Photogenic Hero Section */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-20 px-6 rounded-b-[3rem] shadow-2xl mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="container-max mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md border border-white/15">
            <Compass className="w-4 h-4 text-amber-400" /> European Higher Education Gateway
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            Study in Germany & Europe with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Ilas With You</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            End-to-end support for your international education. From university selection and APS visa clearance to part-time jobs and comfortable local settlement.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => scrollTo('course-matcher')} 
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl text-sm transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              Split-Screen Course Matcher <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollTo('course-matcher')} 
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-emerald-400" /> Upload Transcripts
            </button>
          </div>
        </div>
      </section>

      {/* 2. Sleek Minimal Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 mb-8 transition-all duration-300">
        <div className="container-max mx-auto px-6 flex justify-start md:justify-center gap-8 overflow-x-auto hide-scrollbar">
          {[
            { id: 'course-matcher', label: '⚡ Smart Course Matcher & ATS' },
            { id: 'study-benefits-section', label: '🌟 Benefits of Studying Abroad' },
            { id: 'complimentary-services', label: 'Other Support & Services Available' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={`text-base font-bold pb-2 transition-all cursor-pointer whitespace-nowrap ${
                activeNav === tab.id ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Body Sections */}
      <div className="container-max mx-auto px-6 space-y-24 pb-20">
        
        {/* ================= INTERACTIVE SPLIT-SCREEN STUDENT JOURNEY ================= */}
        <section id="course-matcher" className="scroll-mt-32">
          <StudentAbroadJourney />
        </section>


      </div>
    </div>
  );
}
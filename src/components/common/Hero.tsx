import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Plane, 
  Sparkles, 
  ClipboardCheck, 
  MessageCircle, 
  Star, 
  Users, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Globe, 
  TrendingUp 
} from 'lucide-react';

interface Slide {
  id: string;
  headline: React.ReactNode;
  description: string;
  keyPoints: string[];
  integrationTitle: string;
  integrationDesc: string;
  ctaText: string;
  ctaLink: string;
  icon: React.ReactNode;
  bgImage: string;
  overlayColor: string;
  accentColor: string;
  badgeText?: string;
}

export const ILAWithYouLogo = ({ light = false, size = 'md' }: { light?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
  const containerSize = size === 'sm' ? 'w-32' : size === 'lg' ? 'w-64' : 'w-48';
  const taglineSize = size === 'sm' ? 'text-[6px] md:text-[7px]' : size === 'lg' ? 'text-[10px] md:text-[12px]' : 'text-[8px] md:text-[10px]';

  return (
    <a href="#ilas-with-you" className="flex flex-col items-start group hover:opacity-90 transition-opacity drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      <div className={`relative ${containerSize} transition-transform duration-500 group-hover:scale-105`}>
        {/* Glow Effect Layer */}
        <div className="absolute inset-0 bg-accent-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
        
        {/* Actual Logo Image */}
        <img 
          src="/assets/logo.png" 
          alt="ilas with you" 
          className={`relative z-10 w-full h-auto object-contain ${light ? 'brightness-0 invert drop-shadow-md' : 'drop-shadow-sm'}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = `font-cursive text-2xl font-bold italic ${light ? 'text-white drop-shadow-md' : 'text-brand-900 drop-shadow-sm'}`;
              fallback.innerText = "ilas with you";
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
      <span className={`${taglineSize} uppercase tracking-[0.2em] font-black mt-1 pl-1 ${light ? 'text-white drop-shadow-md' : 'text-slate-800 drop-shadow-sm'}`}>
        Where-ever, When-ever, What-ever
      </span>
    </a>
  );
};

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: Slide[] = [
    {
      id: "education",
      headline: <>Advanced AI-Powered <span className="text-accent-400">Education</span> & Training</>,
      description: "Master industry-ready skills with live classes, 24/7 intelligent tutoring, and cost-effective modules designed for global competence.",
      keyPoints: [
        "Live Expert Classes",
        "24/7 AI Tutoring",
        "Global Certifications"
      ],
      integrationTitle: "Educational Guidance Always On",
      integrationDesc: "While studying, get 24/7 education-related and visa-related guidance, expert course recommendations, and carved professional learning paths with the AI companion always assisting you.",
      ctaText: "Enroll in Education",
      ctaLink: "#applications?tab=Education",
      icon: <GraduationCap className="w-16 h-16 text-accent-400" />,
      bgImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
      overlayColor: "from-brand-900/95 via-brand-900/80 to-transparent",
      accentColor: "border-accent-400"
    },
    {
      id: "lwe",
      headline: <>Learn While <span className="text-emerald-400">Earn</span>: Study & Work</>,
      description: "Start your education while engaging in part-time work to cover expenses. Transition into German projects within 1 year.",
      keyPoints: [
        "₹10,000 - ₹40,000 Stipend",
        "Study First Priority",
        "Direct German Onboarding"
      ],
      integrationTitle: "Financial & Academic Guard",
      integrationDesc: "ILA's With You tracks your academic milestones and stipend payouts simultaneously, ensuring you never miss a study deadline while maintaining your side-income flow.",
      ctaText: "Apply for Work While You Study",
      ctaLink: "#applications?tab=Work While You Study",
      icon: <Briefcase className="w-16 h-16 text-emerald-400" />,
      bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80",
      overlayColor: "from-emerald-950/95 via-emerald-900/80 to-transparent",
      accentColor: "border-emerald-400",
      badgeText: "STUDENT TRACK"
    },
    {
      id: "study-abroad",
      headline: <>Global Excellence via <span className="text-blue-400">Study Abroad</span></>,
      description: "Unlock world-class education at top-tier international universities with our end-to-end guidance and admission support.",
      keyPoints: [
        "Top Global Universities",
        "Seamless Admissions",
        "End-to-End Guidance"
      ],
      integrationTitle: "Global Education Connectivity",
      integrationDesc: "Ilas provides comprehensive assistance to connect your academic goals with the best international institutions.",
      ctaText: "Explore Study Abroad",
      ctaLink: "#applications?tab=Study Abroad",
      icon: <Globe className="w-16 h-16 text-blue-400" />,
      bgImage: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&q=80",
      overlayColor: "from-blue-900/95 via-blue-900/80 to-transparent",
      accentColor: "border-blue-400"
    },
    {
      id: "earn-rewards",
      headline: <>Accelerate with <span className="text-amber-400">Work While You Study</span> & Rewards Plan</>,
      description: "Boost your income while you upskill. Engage in our rewards ecosystem to turn learning progress into direct earnings.",
      keyPoints: [
        "Immediate Earnings",
        "Skill-based Rewards",
        "Financial Independence"
      ],
      integrationTitle: "Double Benefit System",
      integrationDesc: "Experience simultaneous growth in both your professional skillset and financial portfolio as you progress.",
      ctaText: "Register for Work While You Study",
      ctaLink: "#applications?tab=Work While You Study",
      icon: <TrendingUp className="w-16 h-16 text-amber-400" />,
      bgImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80",
      overlayColor: "from-amber-950/95 via-amber-900/80 to-transparent",
      accentColor: "border-amber-400"
    },
    {
      id: "ewl",
      headline: <>Earn While <span className="text-orange-400">Learn</span>: Work & Upskill</>,
      description: "For professionals starting work first: gain practical experience while studying targeted courses to achieve international career roles.",
      keyPoints: [
        "Work First Priority",
        "Targeted Upskilling",
        "Professional Growth Path"
      ],
      integrationTitle: "Career Performance Guard",
      integrationDesc: "ILA's With You manages your professional task lists and upskilling roadmap, helping you achieve work targets while keeping your international certification progress on track.",
      ctaText: "Explore Work While You Study",
      ctaLink: "#applications?tab=Work While You Study",
      icon: <Clock className="w-16 h-16 text-orange-400" />,
      bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80",
      overlayColor: "from-orange-950/95 via-orange-900/80 to-transparent",
      accentColor: "border-orange-400",
      badgeText: "PROFESSIONAL TRACK"
    },
    {
      id: "companion",
      headline: <>Branded Support <span className="text-accent-400 italic">Everywhere</span></>,
      description: "Your ultimate partner and guide from start to finish. We handle the complexities so you can focus on your future.",
      keyPoints: [
        "Visa Paper Checking",
        "German Room Rentals",
        "Local Pickup Services"
      ],
      integrationTitle: "Total Life Companion",
      integrationDesc: "From sourcing required documentation and preliminary eligibility checks to providing local German contact backup and emergency 24/7 call support—wherever, whenever.",
      ctaText: "Learn About Us",
      ctaLink: "#applications?tab=Study Abroad",
      icon: <MessageCircle className="w-16 h-16 text-accent-400" />,
      bgImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
      overlayColor: "from-brand-800/95 via-brand-800/80 to-transparent",
      accentColor: "border-accent-400"
    },
    {
      id: "visa",
      headline: <><span className="text-accent-400">99.99%</span> Accurate Visa Support</>,
      description: "Experience transparent, precise visa processing through trained agents and analytics. Access local support upon arrival in Germany.",
      keyPoints: [
        "Precision Analytics",
        "On-Ground German Support",
        "Part-time Job Guidance"
      ],
      integrationTitle: "Documentation & Arrival Guard",
      integrationDesc: "ILA's With You acts as your document vault and arrival coordinator, ensuring your visa papers are perfect and your German pickup is waiting at the airport.",
      ctaText: "Check Visa Services",
      ctaLink: "#applications?tab=Visa",
      icon: <Plane className="w-16 h-16 text-accent-400" />,
      bgImage: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80",
      overlayColor: "from-slate-900/95 via-slate-900/80 to-transparent",
      accentColor: "border-accent-400"
    },
    {
      id: "jobs",
      headline: <>AI-Driven <span className="text-accent-400">Job</span> Search & Filtration</>,
      description: "Narrow down skill requirements to match targeted international designations. Get direct pathways into our German projects.",
      keyPoints: [
        "Designation Matching",
        "Profit Sharing Programs",
        "Corporate Pathways"
      ],
      integrationTitle: "International Job Companion",
      integrationDesc: "ILA's With You scans global markets for your specific profile, filtering designations that offer the highest syndicate management profit-sharing potential.",
      ctaText: "Search Jobs",
      ctaLink: "#applications?tab=Jobs",
      icon: <Users className="w-16 h-16 text-accent-400" />,
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      overlayColor: "from-brand-900/95 via-brand-900/80 to-transparent",
      accentColor: "border-accent-400"
    },
    {
      id: "rewards",
      headline: <>Rewards <span className="text-emerald-400">Program</span> & Junior Consultant</>,
      description: "Join our loyalty ecosystem. Earn points and cash conversions by referring programs. Secure a permanent salaried posting.",
      keyPoints: [
        "Point-to-Cash Conversion",
        "Permanent Posting Milestone",
        "Loyalty Benefits"
      ],
      integrationTitle: "Loyalty & Growth Guard",
      integrationDesc: "ILA's With You tracks every referral and point earned, notifying you precisely when you hit the milestone for your permanent salaried consultant posting.",
      ctaText: "Join Rewards Program",
      ctaLink: "#applications?tab=Rewards Partner",
      icon: <Star className="w-16 h-16 text-emerald-400" />,
      bgImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80",
      overlayColor: "from-emerald-950/95 via-emerald-900/80 to-transparent",
      accentColor: "border-emerald-400"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(nextSlide, 8000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const openPortal = () => window.dispatchEvent(new CustomEvent('open-portal-login'));
  const openEligibility = () => window.location.hash = '#applications?tab=Study Abroad';

  return (
    <section id="home" className="relative h-screen min-h-[700px] max-h-[1000px] w-full overflow-hidden flex items-center bg-black">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transition: 'opacity 1000ms ease-in-out, transform 8000ms linear' }}
        >
          <img src={slide.bgImage} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor}`} />
        </div>
      ))}

      {/* Top Right Logo Integration */}
      <div className="absolute top-24 right-4 sm:right-6 lg:right-8 z-30 hidden md:flex animate-fade-in items-end flex-col">
        <ILAWithYouLogo light={true} size="sm" />
      </div>

      <div className="container-max px-4 sm:px-6 lg:px-8 relative z-20 w-full flex items-center h-full pt-16">
        <div className="max-w-6xl w-full grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
          
          {/* Left Content Flow */}
          <div className="relative h-[550px] md:h-[600px] flex flex-col justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-start justify-center ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-12 pointer-events-none'
                }`}
              >
                {/* 1. Integration Card */}
                <div className="flex flex-col items-start mb-6 animate-fade-in">
                  <div className={`bg-black/60 backdrop-blur-2xl border-2 ${slide.accentColor} p-4 md:p-5 rounded-2xl max-w-xl shadow-2xl transform transition-all hover:scale-[1.02]`}>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="mt-1">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1 opacity-70">
                          {slide.integrationTitle}
                        </h4>
                        <p className="text-blue-50 font-bold italic text-base leading-snug">
                          {slide.integrationDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Badge & Headline */}
                {slide.badgeText && (
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] text-white mb-4 border-2 ${slide.accentColor} bg-white/5 backdrop-blur-md`}>
                    {slide.badgeText}
                  </div>
                )}
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 max-w-4xl tracking-tight">
                  {slide.headline}
                </h1>

                <p className="text-base md:text-lg text-blue-50/80 max-w-2xl mb-6 leading-relaxed font-medium">
                  {slide.description}
                </p>

                {/* 3. Key Points Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8 w-full max-w-4xl">
                  {slide.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                      <CheckCircle2 className="w-4 h-4 text-accent-400 group-hover:scale-110 transition-transform" />
                      <span className="text-white font-bold text-[10px] uppercase tracking-wider">{point}</span>
                    </div>
                  ))}
                </div>

                {/* 4. Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={slide.ctaLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-900 font-black rounded-xl hover:bg-accent-400 transition-all active:scale-95 text-sm shadow-xl"
                  >
                    {slide.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={openEligibility}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/40 text-white border-2 border-white/20 backdrop-blur-md font-black rounded-xl hover:bg-white/10 transition-all active:scale-95 text-sm"
                  >
                    <ClipboardCheck className="w-4 h-4 text-accent-400" />
                    Free Eligibility Check
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical Right Navigation Controls */}
          <div className="hidden lg:flex flex-col items-center gap-8 relative z-30 py-12 px-6 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
            <button
              onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group"
              aria-label="Previous slide"
            >
              <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </button>

            {/* Pagination Vertical Dots */}
            <div className="flex flex-col gap-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentSlide(index); setIsAutoPlaying(false); }}
                  className="group relative flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`transition-all duration-500 rounded-full ${
                    index === currentSlide 
                      ? 'h-10 w-2 bg-accent-400 shadow-[0_0_15px_rgba(255,214,0,0.5)]' 
                      : 'h-2 w-2 bg-white/20 group-hover:bg-white/40'
                  }`} />
                  {index === currentSlide && (
                    <div className="absolute right-full mr-4 px-3 py-1 bg-accent-400 text-brand-900 text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                      {slides[index].id.replace('-', ' ')}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group"
              aria-label="Next slide"
            >
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Access Portal */}
      <div className="absolute bottom-10 right-10 z-30">
        <button
          onClick={openPortal}
          className="flex items-center gap-3 px-6 py-3 bg-brand-900/80 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl hover:bg-brand-900 transition-all shadow-2xl group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-brand-900 group-hover:rotate-12 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-widest">Access Portal</span>
        </button>
      </div>

      {/* Mobile Pagination */}
      <div className="lg:hidden absolute bottom-24 left-0 w-full px-4 flex justify-center gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentSlide(index); setIsAutoPlaying(false); }}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'w-8 bg-accent-400' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
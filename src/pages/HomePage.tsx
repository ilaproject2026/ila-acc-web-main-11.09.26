import React, { useEffect } from 'react';
import Hero from '../components/common/Hero';
import { ILAWithYouLogo } from '../components/common/Hero';
import { ArrowRight, GraduationCap, Briefcase, Plane, Star, Clock, Globe, Award, Sparkles, TrendingUp, ShieldCheck, Users } from 'lucide-react';

const ServiceSection = ({
  id,
  title,
  subtitle,
  icon: Icon,
  imageSrc,
  color,
  bgColor,
  features,
  ctaText,
  ctaLink
}: any) => {
  const openEligibility = () => window.location.hash = ctaLink;

  return (
    <section id={id} className={`py-20 md:py-28 ${bgColor} relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="container-max px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="order-2 lg:order-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {subtitle}
            </h2>
            
            {/* Features Grid - Icon focused */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className={`p-2 rounded-xl bg-slate-50 ${color} shrink-0`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{feature.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Consistent Branding integrations */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* ILA With You Integration */}
              <div className="flex-1 bg-gradient-to-br from-brand-900 to-brand-800 p-5 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={() => window.location.hash = '#ilas-with-you'}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />
                <ILAWithYouLogo light={true} size="sm" />
                <p className="text-[10px] text-brand-100 mt-3 font-medium leading-relaxed max-w-[200px]">
                  24/7 dedicated companion for {title.toLowerCase()} support and guidance.
                </p>
              </div>

              {/* Reward Points Integration */}
              <div className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-5 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={() => window.location.hash = '#rewards'}>
                <Star className="absolute -right-2 -bottom-2 w-20 h-20 text-amber-200/50 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-400 rounded-lg text-white">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">Earn Rewards</h4>
                </div>
                <p className="text-[10px] text-amber-800 font-bold mb-1">Up to 5,000 Points</p>
                <p className="text-[10px] text-amber-700/80 leading-snug">
                  Earn points when you apply or refer someone for {title}. Convert to cash or discounts.
                </p>
              </div>
            </div>

            <button 
              onClick={openEligibility}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-sm shadow-xl w-full sm:w-auto`}
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
              <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              {/* App-like Floating Widget */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-white/20`}>
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold opacity-80">Verified & Certified</div>
                    <div className="text-sm font-black">Global Standard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero />
      
      {/* Education Section */}
      <ServiceSection 
        id="education"
        title="Premium Education"
        subtitle="Master Industry-Ready Skills with AI-Powered Tutoring"
        icon={GraduationCap}
        color="text-accent-600"
        bgColor="bg-white"
        imageSrc="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80"
        ctaText="Explore Courses"
        ctaLink="#applications?tab=Education"
        features={[
          { icon: <Globe className="w-5 h-5 text-accent-600"/>, title: "Global Certifications", desc: "Recognized worldwide" },
          { icon: <Sparkles className="w-5 h-5 text-accent-600"/>, title: "AI Tutoring", desc: "24/7 intelligent assistance" },
          { icon: <Users className="w-5 h-5 text-accent-600"/>, title: "Live Classes", desc: "Interactive expert sessions" },
          { icon: <TrendingUp className="w-5 h-5 text-accent-600"/>, title: "Career Focused", desc: "Syllabus aligned with jobs" }
        ]}
      />

      {/* Visa & Immigration Section */}
      <ServiceSection 
        id="visa"
        title="Visa & Immigration"
        subtitle="99.99% Accurate Visa Support & Documentation"
        icon={Plane}
        color="text-blue-600"
        bgColor="bg-slate-50"
        imageSrc="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80"
        ctaText="Check Visa Services"
        ctaLink="#applications?tab=Visa"
        features={[
          { icon: <ShieldCheck className="w-5 h-5 text-blue-600"/>, title: "High Success Rate", desc: "Precision analytics & checking" },
          { icon: <Globe className="w-5 h-5 text-blue-600"/>, title: "On-Ground Support", desc: "Assistance upon arrival" },
          { icon: <Briefcase className="w-5 h-5 text-blue-600"/>, title: "Job Guidance", desc: "Part-time job support" },
          { icon: <Clock className="w-5 h-5 text-blue-600"/>, title: "Fast Processing", desc: "Optimized timelines" }
        ]}
      />

      {/* Jobs & Careers Section */}
      <ServiceSection 
        id="jobs"
        title="International Jobs"
        subtitle="AI-Driven Job Search & Corporate Pathways"
        icon={Briefcase}
        color="text-emerald-600"
        bgColor="bg-white"
        imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
        ctaText="Find Global Jobs"
        ctaLink="#applications?tab=Jobs"
        features={[
          { icon: <Sparkles className="w-5 h-5 text-emerald-600"/>, title: "AI Matching", desc: "Find the perfect designation" },
          { icon: <TrendingUp className="w-5 h-5 text-emerald-600"/>, title: "Profit Sharing", desc: "Syndicate management programs" },
          { icon: <Users className="w-5 h-5 text-emerald-600"/>, title: "Corporate Entry", desc: "Direct paths to German projects" },
          { icon: <Star className="w-5 h-5 text-emerald-600"/>, title: "Skill Upgrading", desc: "Earn while you learn" }
        ]}
      />

      {/* Work While You Study */}
      <ServiceSection 
        id="work-study"
        title="Work While You Study"
        subtitle="Earn €1,000+ Stipends While Pursuing Education"
        icon={Clock}
        color="text-amber-600"
        bgColor="bg-slate-50"
        imageSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"
        ctaText="Apply for Work & Study"
        ctaLink="#applications?tab=Work While You Study"
        features={[
          { icon: <Star className="w-5 h-5 text-amber-600"/>, title: "Monthly Stipend", desc: "Financial independence" },
          { icon: <TrendingUp className="w-5 h-5 text-amber-600"/>, title: "Career Growth", desc: "Practical experience" },
          { icon: <Clock className="w-5 h-5 text-amber-600"/>, title: "Flexible Hours", desc: "Balanced lifestyle" },
          { icon: <Award className="w-5 h-5 text-amber-600"/>, title: "Skill Development", desc: "Real-world application" }
        ]}
      />

      {/* Study Abroad Section */}
      <ServiceSection 
        id="study-abroad"
        title="Study Abroad"
        subtitle="End-to-End Admission Guidance for Global Universities"
        icon={Globe}
        color="text-brand-600"
        bgColor="bg-white"
        imageSrc="https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&q=80"
        ctaText="Start Your Journey"
        ctaLink="#applications?tab=Study Abroad"
        features={[
          { icon: <GraduationCap className="w-5 h-5 text-brand-600"/>, title: "Top Universities", desc: "Partnerships worldwide" },
          { icon: <Briefcase className="w-5 h-5 text-brand-600"/>, title: "Profile Building", desc: "Resume & SOP support" },
          { icon: <Plane className="w-5 h-5 text-brand-600"/>, title: "Pre-departure", desc: "Complete travel orientation" },
          { icon: <ShieldCheck className="w-5 h-5 text-brand-600"/>, title: "Visa Assistance", desc: "Student visa processing" }
        ]}
      />

      {/* About & Contact Section */}
      <section id="about" className="py-20 md:py-28 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="container-max px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Your Global Companion</h2>
          <p className="text-brand-100 max-w-2xl mx-auto mb-10 text-lg">
            From the first consultation to arriving at your dream destination, ILA Global is with you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.location.hash = '#about'} className="px-8 py-3.5 bg-accent-500 text-brand-900 font-black rounded-xl hover:bg-accent-400 transition-all shadow-xl">
              About Us
            </button>
            <button onClick={() => window.location.hash = '#ilas-with-you'} className="px-8 py-3.5 bg-white/10 text-white border-2 border-white/20 font-black rounded-xl hover:bg-white/20 transition-all backdrop-blur-md">
              Discover ILA With You
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

import { 
  Globe, 
  Target, 
  Building2, 
  CheckCircle2, 
  HeartHandshake,
  Bot,
  GraduationCap,
  Sparkles,
  Trophy,
  Plane,
  Briefcase,
  Search,
  FileText,
  MapPin,
  Banknote,
  Languages
} from 'lucide-react';
import { ILAWithYouLogo } from '../components/common/Hero';

export default function AboutUsPage() {
  return (
    <div className="pt-20 bg-white">
      {/* Section 1: Who We Are & Our Core Mission */}
      <section className="relative py-24 overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] -ml-64 -mb-64" />
        </div>
        
        <div className="container-max px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
              <Building2 className="w-5 h-5 text-accent-400" />
              <span className="text-sm font-bold tracking-widest uppercase">ILA Educational Academy & Business Consultancy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1]">
              A Dedicated <span className="text-accent-400">Bridge</span> to <br />
              Global Career Success
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed font-medium mb-12">
              We specialize in IT and International Business Architecture & Administration, 
              operating as a premier bridge organization focused on hiring, training, and recruiting 
              ambitious individuals directly into our internal German projects.
            </p>
            <div className="grid md:grid-cols-2 gap-8 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold text-accent-400 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" /> Our Role
                </h3>
                <p className="text-slate-300">
                  Hiring ambitious talent, providing localized training combined with practical employment, 
                  and recruiting them directly into high-impact global professional opportunities.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-accent-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" /> Our Mission
                </h3>
                <p className="text-slate-300">
                  To educate and empower through specialized language preparation (German) and 
                  high-end technical/business skills using an AI-based curriculum reflecting corporate standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Step-by-Step Career & Onboarding Process */}
      <section className="py-24 container-max px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Your Career Journey</h2>
          <p className="text-lg text-slate-600">A structured transition from India to the global corporate stage.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {[
            { 
              title: "Hire & Train", 
              icon: GraduationCap,
              desc: "We hire based on ambition, provide local training, and offer scholarships for specialized skill sets." 
            },
            { 
              title: "Practical Employment", 
              icon: Briefcase,
              desc: "Candidates earn salaries while gaining real-time corporate experience in our AI-driven atmosphere." 
            },
            { 
              title: "Global Onboarding", 
              icon: Globe,
              desc: "Transition into direct German projects within a year, earning multiple times your initial investment." 
            }
          ].map((step, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative group">
              <div className="w-16 h-16 rounded-2xl bg-brand-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              <div className="absolute -bottom-2 -right-2 text-6xl font-black text-slate-200 opacity-20">{i + 1}</div>
            </div>
          ))}
        </div>

        {/* Dual Pathways Branding Card */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">The Dual Pathways</h3>
              <div className="space-y-4">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-emerald-400 font-bold mb-2 uppercase tracking-widest text-sm">Work While You Study</h4>
                  <p className="text-blue-100 text-sm">Students prioritize study while engaging in paid operational work to cover expenses and qualify for German projects.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-orange-400 font-bold mb-2 uppercase tracking-widest text-sm">Work While You Study</h4>
                  <p className="text-blue-100 text-sm">Professionals work first in an international corporate atmosphere, upskilling through AI training to meet global requirements.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20">
              <ILAWithYouLogo light={true} size="md" />
              <p className="mt-8 text-lg font-bold text-accent-400 italic">"Helping you earn multiple times what you spend."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Rewards Program & Permanent Placement */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container-max px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-600/10 rounded-full blur-[100px]" />
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" 
                alt="Collaboration" 
                className="relative z-10 rounded-[4rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-xs font-black tracking-widest uppercase">
                <Trophy className="w-4 h-4" />
                Staff Hiring Method
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Not Just Rewards. <br />
                A Career Pathway.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                The Rewards Program is our **foundational recruitment and staff-hiring method**. 
                Members generate income by promoting educational programs and services to friends and family from India.
              </p>
              <div className="bg-white p-6 rounded-3xl border-2 border-brand-100 shadow-xl">
                <h4 className="font-bold text-slate-900 mb-2">Permanent Salaried Consultant</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Once you reach milestone points, you qualify for **permanent placement**. 
                  Even after moving abroad, continue earning by recommending students, promoting franchises, 
                  and assisting incoming candidates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Visa & Immigration Support Services */}
      <section className="py-24 container-max px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-widest text-sm">
              <Plane className="w-6 h-6" />
              Evaluation & Tracking
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              99% Evaluation <br />
              Accuracy
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our advanced visa evaluation system delivers step-by-step guidance and real-time tracking 
              of your documentation status. Every legal requirement is monitored by our companion service.
            </p>
            <div className="grid gap-4">
              {[
                "Analytical Profile Assessment",
                "Real-time Documentation Tracking",
                "Legal Requirement Monitoring",
                "24/7 Intelligent Companion Support"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-10 bg-slate-900 rounded-[4rem] text-white overflow-hidden shadow-2xl">
            <Bot className="absolute bottom-0 right-0 w-64 h-64 opacity-5 -mb-16 -mr-16" />
            <div className="relative z-10">
              <ILAWithYouLogo light={true} size="sm" />
              <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/20 backdrop-blur-xl">
                <p className="text-lg font-medium italic leading-relaxed">
                  "Every step of your immigration formalities is closely monitored and guided by 
                  your intelligent companion."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Jobs & Career Services */}
      <section className="py-24 bg-slate-50">
        <div className="container-max px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">AI-Driven Career Hub</h2>
            <p className="text-lg text-slate-600">Smart placement architecture matching your professional trajectory.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100 hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-8">
                <Search className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold mb-4">Intelligent Search</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Specialized AI consultants match your profile with highly accurate international job searches.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100 hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-8">
                <FileText className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold mb-4">Resume Optimization</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                The system refines your resume, analyzes skill gaps, and recommends modules to secure roles.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100 hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold mb-4">Proactive Matching</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Automated recommendations for new opportunities tailored to your ambitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: On-Ground Global Services & Earning Abroad */}
      <section className="py-24 container-max px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            {[
              { icon: MapPin, title: "Airport Pickup" },
              { icon: Building2, title: "Room Rentals" },
              { icon: Banknote, title: "Bank Accounts" },
              { icon: Briefcase, title: "Job Search Help" },
              { icon: Languages, title: "Local Documentation" },
              { icon: HeartHandshake, title: "Community Support" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
                <item.icon className="w-8 h-8 text-brand-600 mx-auto mb-4" />
                <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest">{item.title}</h5>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Earn Abroad while <br />
              <span className="text-brand-600">Helping Others</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Members abroad take on official paid roles: helping new arrivals with airport pickups, 
              accommodations, bank accounts, and local documentation.
            </p>
            <div className="p-8 bg-brand-900 text-white rounded-[3rem] relative overflow-hidden">
              <Sparkles className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-8 -mt-8" />
              <p className="text-blue-100 font-medium italic relative z-10">
                All candidates have 24/7 access to ila's with you for visa services, job searches, 
                and professional growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Branding & Footer */}
      <section className="py-16 border-t border-slate-100">
        <div className="container-max px-4 flex flex-col items-center gap-8 text-center">
          <ILAWithYouLogo light={false} size="md" />
          <div>
            <p className="text-slate-400 font-bold text-[10px] tracking-[0.4em] uppercase mb-2">International Learning Alliance GmbH</p>
            <p className="text-slate-600 font-medium">Empowering Careers Globally Since Day One.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

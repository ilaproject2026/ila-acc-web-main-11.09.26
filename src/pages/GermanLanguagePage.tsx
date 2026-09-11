import { Bot, Sparkles, BookOpen, Clock, Target, CheckCircle2, ChevronRight, Globe2, Stethoscope, Briefcase, MessageSquare, ShieldCheck } from 'lucide-react';

export default function GermanLanguagePage() {
  const navigateToApplication = (category = 'Education', courseLevel = '') => {
    if (courseLevel) {
      localStorage.setItem('selected_german_level', courseLevel);
    }
    window.location.hash = `#applications?tab=${encodeURIComponent(category)}`;
  };

  const levels = [
    {
      title: "A1 Beginner",
      levelTag: "A1",
      duration: "8 Weeks",
      focus: "Basic Communication & Vocabulary",
      features: ["Interactive AI Phonics", "Basic Grammar Structuring", "Everyday Conversations"],
      color: "border-brand-200 bg-brand-50"
    },
    {
      title: "A2 Elementary",
      levelTag: "A2",
      duration: "10 Weeks",
      focus: "Expression & Comprehension",
      features: ["Sentence Construction", "Workplace Vocabulary", "Short Text Reading"],
      color: "border-indigo-200 bg-indigo-50"
    },
    {
      title: "B1 Intermediate",
      levelTag: "B1",
      duration: "12 Weeks",
      focus: "Fluency & Independence",
      features: ["Complex Discussions", "Professional Writing", "Goethe/Telc B1 Prep"],
      color: "border-amber-200 bg-amber-50"
    },
    {
      title: "B2 Clinical / Pro",
      levelTag: "B2",
      duration: "14 Weeks",
      focus: "Advanced Technical Proficiency",
      features: ["Medical/Technical Jargon", "Fluent Debate & Argumentation", "Goethe/Telc B2 Prep"],
      color: "border-emerald-200 bg-emerald-50"
    }
  ];

  return (
    <div className="pt-20 bg-slate-50 min-h-screen pb-20">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-brand-900 text-white py-16 md:py-24 rounded-b-[3rem] shadow-2xl mb-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-brand-800/50 to-transparent" />
          <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-brand-600 rounded-full blur-3xl opacity-30" />
        </div>
        
        <div className="container-max px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 text-brand-200 text-sm font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                Fast-Track German A1 to B2
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                Master German with <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-blue-200">Goethe & Telc Prep</span>
              </h1>
              
              <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                Immersive live interactive coaching paired with your dedicated 24/7 AI companion. Achieve clinical or academic fluency faster.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <button 
                  onClick={() => navigateToApplication('Education')}
                  className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Enroll Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 text-sm font-medium text-brand-200">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Target className="w-4 h-4 text-amber-400" /> Dynamic AI-Powered Learning
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Bot className="w-4 h-4 text-emerald-400" /> 24/7 Ilas AI Companion
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Globe2 className="w-4 h-4 text-blue-400" /> Global Education & European Standards
                </div>
              </div>
            </div>

            {/* Right Column: Prominent Promo Banner */}
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-[2px] rounded-[2rem] shadow-2xl transform lg:-rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-slate-900 p-8 md:p-10 rounded-[2rem] h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full" />
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-max border border-amber-500/30">
                    <Briefcase className="w-3 h-3" />
                    Enroll with Corporate-Level Training
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                    Register for <span className="text-amber-400">Work While You Study</span>
                  </h3>
                  
                  <p className="text-slate-300 text-lg font-medium mb-8 leading-relaxed">
                    Make Income While You Study & Gain Corporate Experience with real-world industry placements.
                  </p>
                  
                  <button 
                    onClick={() => navigateToApplication('Work While You Study')}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-black text-lg transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Apply for Dual Pathway
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Clear Level Progression Cards */}
      <section className="container-max px-4 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Structured Progression</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From absolute beginner to professional fluency. Clear milestones designed for maximum retention and exam success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {levels.map((level, idx) => (
            <div key={idx} className={`p-8 rounded-3xl border-2 ${level.color} transition-transform hover:-translate-y-2 flex flex-col h-full bg-white relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <BookOpen className="w-16 h-16" />
              </div>
              <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 mb-2">{level.title}</h3>
                <div className="flex items-center gap-2 text-brand-600 font-bold text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  {level.duration}
                </div>
                <p className="text-slate-600 font-medium text-sm h-10">{level.focus}</p>
              </div>
              
              <div className="space-y-3 mb-8 flex-grow relative z-10">
                {level.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    {feature}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigateToApplication('Education', level.levelTag)}
                className="w-full py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-colors relative z-10 cursor-pointer"
              >
                Choose {level.title.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Dual Pathway Highlights */}
      <section className="container-max px-4 mb-24">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Your Pathway to Germany</h2>
            <p className="text-slate-400 text-lg">Direct integration post-certification.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">University Admissions</h3>
              <p className="text-slate-300 mb-6">
                Achieve the required language proficiency to enroll in fully-funded or premium German universities. Dedicated support for APS and Visa documentation.
              </p>
              <button onClick={() => navigateToApplication('Study Abroad')} className="text-brand-300 font-bold hover:text-brand-200 flex items-center gap-1 cursor-pointer">
                Explore Universities <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Clinical & Job Placements</h3>
              <p className="text-slate-300 mb-6">
                B2 certification fast-tracks nursing professionals and engineers directly into the German workforce. Direct corporate networking and contract negotiations.
              </p>
              <button onClick={() => navigateToApplication('Jobs')} className="text-emerald-300 font-bold hover:text-emerald-200 flex items-center gap-1 cursor-pointer">
                View Placements <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Faculty / Methodology Proof */}
      <section className="container-max px-4 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Interactive Immersion Methodology</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We abandon traditional rote learning in favor of dynamic speaking labs and situational practice. Our faculty ensures you speak German from day one.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Speaking Labs</h4>
                  <p className="text-slate-600 text-sm">Intensive group debates and 1-on-1 speaking practice to kill the hesitation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Certified Faculty</h4>
                  <p className="text-slate-600 text-sm">Learn exclusively from Goethe/Telc certified instructors with native-level proficiency.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Job-Ready Vocabulary</h4>
                  <p className="text-slate-600 text-sm">Industry-specific modules focused on IT, Engineering, and Healthcare terms.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
            <div className="w-20 h-20 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
              <Target className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Ready to Start?</h3>
            <p className="text-slate-600 mb-8">
              Join hundreds of successful candidates who have cleared their Goethe exams through our structured programs.
            </p>
            <button 
              onClick={() => navigateToApplication('Education')}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black text-lg transition-all shadow-lg cursor-pointer"
            >
              Apply For Language Class
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
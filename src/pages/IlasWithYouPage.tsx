import { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  GraduationCap, 
  Plane, 
  Briefcase, 
  Crown, 
  Gift, 
  ArrowRight, 
  Smile, 
  Search, 
  Play, 
  CheckCircle2, 
  MessageSquare,
  Home,
  FileCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  Check
} from 'lucide-react';

const deepStoryChapters = [
  {
    id: 'education-dialogue',
    tag: 'Chapter 01 • Academic & Study Matcher',
    badge: '€0 University & Ausbildung Advisor',
    title: 'Instant Admission Matcher & Conversational Study Planner',
    headline: 'Talk Freely About Your Marks, Backlogs & Dream German Degrees',
    desc: 'No stress, no judgment. Tell Ilas your academic history, and it instantly scans 400+ German state universities with €0 tuition fees, shortlists English-taught Master’s degrees, and verifies direct Dual Ausbildung apprenticeships paying €1,000–€1,400 monthly.',
    dialogues: [
      {
        user: "Ilas, I completed B.Tech with 64% and 2 backlogs. Can I get a €0 German public university?",
        ilas: "Ja, absolutely! 42 German public universities accept your credit profile. I've filtered 8 English-taught Mechanical & Data tracks in TU9 and state institutions with zero tuition fees!"
      },
      {
        user: "What about paid Ausbildung if I don't want to show a €11,900 blocked account?",
        ilas: "You can apply directly to our partnered Healthcare and IT Ausbildung pools. You earn €1,150/month from Day 1 with zero blocked account required!"
      }
    ],
    pills: ['€0 Tuition Scan', 'Backlog Credit Audit', 'Ausbildung Contracts', 'English-Taught Tracks'],
    statNumber: '400+',
    statLabel: 'German Universities Mapped',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'job-dialogue',
    tag: 'Chapter 02 • Career & Placement Coach',
    badge: 'Europass ATS & Interview Coach',
    title: 'ATS Resume Architecture & Live Mock Interview Coach',
    headline: 'Build a German-Standard Dossier & Practice Technical Drills',
    desc: 'Ilas parses your past projects, tunes your skills to match German ATS v12 recruiting filters, and runs interactive voice mock interviews with real-time feedback on your answers.',
    dialogues: [
      {
        user: "Ilas, tune my Indian resume for a German Blue Card Software Engineer role.",
        ilas: "Done! I restructured your CV into the official Europass DIN-5008 standard, highlighted your cloud skills, and increased your ATS match score to 96%."
      },
      {
        user: "Can we practice a 10-minute German corporate HR mock interview?",
        ilas: "Natürlich! Let's begin. 'Erzählen Sie mir über Ihr letztes Projekt.' (Tell me about your latest live project architecture and team deliverables)."
      }
    ],
    pills: ['DIN-5008 Format', 'ATS Keyword Tuning', 'Live HR Simulations', 'Salary Benchmark'],
    statNumber: '96%',
    statLabel: 'Average ATS Score Match',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'visa-dialogue',
    tag: 'Chapter 03 • Embassy & Visa Shield',
    badge: 'Opportunity Card & Visa Shield',
    title: 'Zero-Error Embassy Dossier Audit & Visa Checklist Shield',
    headline: 'Step into the VFS Embassy Counter with Total Confidence',
    desc: 'From German Opportunity Card (Chancenkarte) point score calculations to APS verification and blocked account setups, Ilas double-checks every document against official German consulate rules.',
    dialogues: [
      {
        user: "Ilas, check if I have enough points for the German Opportunity Card.",
        ilas: "You score 7 points: 4 for recognized Bachelor's, 1 for B1 German, and 2 for age under 35. You exceed the 6-point requirement and qualify for the job search visa!"
      },
      {
        user: "Is my blocked account letter and health insurance ready for submission?",
        ilas: "All 12 checklist items are verified compliant with the latest Federal Foreign Office standards. You are ready to book your VFS slot!"
      }
    ],
    pills: ['Chancenkarte Calculator', 'APS Verification Check', 'Blocked Account Audit', 'Consulate Checklist'],
    statNumber: '100%',
    statLabel: 'Checklist Accuracy',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'abroad-dialogue',
    tag: 'Chapter 04 • On-Ground Euro Companion',
    badge: 'Arrival & Community Network',
    title: 'On-Ground German Settlement, WG Flats & Mini-Jobs',
    headline: 'Never Feel Alone in Europe: Rooms, Transit & Local Work',
    desc: 'When you arrive in Frankfurt, Berlin, or Munich, Ilas helps you coordinate verified WG flat rentals, guides your local city registration (Anmeldung), and connects you with legal 20 hrs/week student jobs.',
    dialogues: [
      {
        user: "I just landed in Frankfurt. How do I get to my campus in Darmstadt and find temporary accommodation?",
        ilas: "Welcome to Germany! Take the S3 S-Bahn directly from Terminal 1. Your verified WG student room host has been notified for key handover!"
      },
      {
        user: "Can I list my availability to help new students and earn extra Euro income?",
        ilas: "Ja! Your profile is active on the portal. You will receive €50–€250 for verified room scouting and airport welcome pickups."
      }
    ],
    pills: ['WG Flat Finder', 'Anmeldung Guidance', 'Mini-Job Network', '€250+ Task Rewards'],
    statNumber: '€250+',
    statLabel: 'Per On-Ground Task',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=85&w=1200'
  }
];

const samplePrompts = [
  "Find me English-taught Master's degrees in Germany with €0 tuition fee.",
  "How can I apply for paid Ausbildung with €1,200/mo stipend?",
  "Calculate my points for the German Opportunity Card.",
  "How do I unlock €0 Free Placement via Work While You Study?"
];

export default function IlasWithYouPage() {
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ilas',
      text: "Hallo! I'm Ilas With You, your personal career companion. Tell me what you're aiming for: €0 University in Germany, Paid Ausbildung, or European Job Placement?"
    }
  ]);

  const navigateTo = (url: string) => {
    window.location.hash = url;
  };

  const handleAsk = (promptText: string) => {
    setChatLog([
      ...chatLog,
      { sender: 'user', text: promptText },
      { 
        sender: 'ilas', 
        text: `Analyzing: "${promptText}". High compatibility route confirmed! Connecting with our verified European intake pool...` 
      }
    ]);
  };

  return (
    <div className="pt-20 pb-28 bg-slate-100 min-h-screen relative overflow-hidden">
      
      {/* ================= PAGE-WIDE GIFT RIBBON OVERLAYS ================= */}
      {/* Vertical Golden Ribbon Center Line */}
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 opacity-20 pointer-events-none z-0" />
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-amber-300 opacity-40 pointer-events-none z-0" />

      <div className="container-max px-4 sm:px-6 relative z-10 space-y-20">
        
        {/* ================= 1. ROYAL GIFT BOX HEADER ================= */}
        <section className="relative rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl border-4 border-amber-400/50 p-8 sm:p-14 text-center">
          
          {/* 3D Gift Box Ribbon Cross Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <div className="absolute top-1/2 left-0 w-full h-10 -translate-y-1/2 bg-amber-400 blur-sm" />
            <div className="absolute top-0 left-1/2 h-full w-10 -translate-x-1/2 bg-amber-400 blur-sm" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Golden Gift Seal Bow */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest mb-6 shadow-xl border border-amber-300">
              <Crown className="w-4 h-4 text-slate-950" /> Official Royal Gift Package • Included with Every Application
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Ilas With You</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-lg mb-8 leading-relaxed max-w-3xl">
              Not a cold chatbot. An intelligent, warm, and highly capable personal career companion that talks, plans, reviews documents, and navigates your entire journey to Germany.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button 
                onClick={() => navigateTo('#applications?tab=Education')}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-xl cursor-pointer flex items-center gap-2"
              >
                <Gift className="w-4 h-4" /> Claim 100% Free Ilas AI Access <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigateTo('#learn-while-earn')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-amber-300" /> Work While You Study Pilot
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-200 w-full">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> €0 University Finder
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> ATS Europass CV
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Embassy Visa Shield
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 WhatsApp Mentor
              </div>
            </div>

          </div>
        </section>

        {/* ================= 2. DEEP ALTERNATING CONVERSATIONAL STORY CAPSULES ================= */}
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-black tracking-widest text-brand-700 uppercase bg-brand-50 px-4 py-1.5 rounded-full border border-brand-200">
              Conversational Story Chapters
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 mb-3">
              Real Conversations. Real Results.
            </h2>
            <p className="text-slate-600 text-xs sm:text-base">
              See how candidates talk with Ilas every day to solve their university, career, visa, and settlement hurdles.
            </p>
          </div>

          <div className="space-y-16">
            {deepStoryChapters.map((chapter, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={chapter.id}
                  className="bg-white rounded-[3.5rem] p-6 sm:p-10 lg:p-12 border-2 border-slate-200/80 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-center`}>
                    
                    {/* Visual Card (Swaps Left/Right) */}
                    <div className={`lg:col-span-6 relative min-h-[440px] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-8 bg-slate-950 text-white ${
                      isEven ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                    }`}>
                      {/* Pictorial Lifestyle Background */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                        style={{ backgroundImage: `url(${chapter.img})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30 z-10" />

                      <div className="relative z-20 flex items-center justify-between">
                        <span className="px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                          {chapter.badge}
                        </span>
                        <span className="text-xs font-bold text-amber-300 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                          {chapter.tag}
                        </span>
                      </div>

                      <div className="relative z-20 my-auto py-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">
                          {chapter.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                          {chapter.headline}
                        </p>
                      </div>

                      <div className="relative z-20 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-amber-300">{chapter.statNumber}</span>
                          <span className="block text-[10px] font-bold text-slate-300 uppercase">{chapter.statLabel}</span>
                        </div>
                        <button 
                          onClick={() => navigateTo('#applications?tab=Education')}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          Ask Ilas Now <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Conversational Dialogues (Swaps Left/Right) */}
                    <div className={`lg:col-span-6 space-y-6 ${
                      isEven ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
                    }`}>
                      <div>
                        <span className="text-xs font-black text-brand-600 uppercase tracking-widest block mb-1">
                          {chapter.tag}
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug mb-3">
                          {chapter.headline}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {chapter.desc}
                        </p>
                      </div>

                      {/* Interactive Talking Dialogue Bubbles */}
                      <div className="space-y-3 p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200">
                        {chapter.dialogues.map((dialogue, dIdx) => (
                          <div key={dIdx} className="space-y-2">
                            {/* Candidate Prompt */}
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                                ME
                              </div>
                              <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
                                "{dialogue.user}"
                              </div>
                            </div>

                            {/* Ilas Response */}
                            <div className="flex items-start gap-2.5 pl-6">
                              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-[10px]">
                                <Bot className="w-4 h-4" />
                              </div>
                              <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl rounded-tl-none text-xs leading-relaxed font-medium shadow-sm border border-slate-800">
                                {dialogue.ilas}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Feature Pills */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {chapter.pills.map((pill, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-800">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{pill}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => navigateTo('#applications?tab=Education')}
                        className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        Start Your Intake Plan with Ilas <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 3. INTERACTIVE LIVE SIMULATOR TERMINAL ================= */}
        <section className="bg-slate-950 rounded-[3.5rem] border-4 border-amber-500/40 p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Ilas AI Interactive Live Simulator</h3>
                  <p className="text-xs text-slate-400">Online 24/7 • Ready to evaluate your European profile</p>
                </div>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Live Terminal
              </span>
            </div>

            {/* Chat Feed */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 min-h-[220px] space-y-4 text-xs sm:text-sm">
              {chatLog.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-lg p-4 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-amber-500 text-slate-950 font-bold' 
                        : 'bg-white/10 text-slate-100 border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-2">Click to ask Ilas in real-time:</span>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {samplePrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleAsk(prompt)}
                    className="text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-200 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span className="truncate mr-2">"{prompt}"</span>
                    <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">Ready to start with official coordinator backing?</span>
              <button 
                onClick={() => navigateTo('#applications?tab=Education')}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Apply for Intake Evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* ================= 4. COMPREHENSIVE ECOSYSTEM GIFT BANNERS ================= */}
        <section className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Academy & German Prep</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Goethe-certified exam drills, live AI pronunciation coaching, and up to 50% course fee discounts.
              </p>
            </div>
            <button 
              onClick={() => navigateTo('#education')}
              className="w-full py-3 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              View Academy Programs →
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Work While You Study Pilot</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Earn ₹10,000 to ₹30,000 monthly stipends while building genuine 1-year corporate proof for Germany.
              </p>
            </div>
            <button 
              onClick={() => navigateTo('#learn-while-earn')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer"
            >
              Explore Paid Pilot →
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Gift className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Reward Club & Euro Tasks</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Refer peers to earn continuous passive cashback and claim on-ground student tasks in European cities.
              </p>
            </div>
            <button 
              onClick={() => navigateTo('#rewards')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Join Reward Club →
            </button>
          </div>

        </section>

      </div>
    </div>
  );
}
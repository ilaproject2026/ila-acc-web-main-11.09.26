import { BookOpen, Stethoscope, Languages, Play, ArrowRight, Sparkles, Bot, Zap, Cpu, CheckCircle2, Video, Layers, Users, BrainCircuit } from 'lucide-react'

const programs = [
  {
    icon: Languages,
    title: 'German Language',
    description: 'Comprehensive A1–C2 German language courses with native instructors, interactive sessions, and Goethe/ÖSD exam preparation.',
    features: ['Live & online classes', 'Certified instructors', 'Exam preparation'],
    action: 'language-trainer' as const,
    cta: 'Start AI Sample Class',
  },
  {
    icon: BookOpen,
    title: 'Ausbildung Programs',
    description: 'Dual vocational training pathways in Germany — earn while you learn with structured apprenticeships across in-demand industries.',
    features: ['Paid apprenticeships', 'Industry partnerships', 'Pathway to employment'],
    action: 'eligibility' as const,
    cta: 'Check Eligibility',
  },
  {
    icon: Stethoscope,
    title: 'Medical / DemTest Prep',
    description: 'Specialized preparation for medical licensing exams including DemTest, FSP, and Kenntnisprüfung for healthcare professionals.',
    features: ['Clinical case studies', 'Language medical modules', 'Mock examinations'],
    action: 'eligibility' as const,
    cta: 'Check Eligibility',
  },
]

const teachingMethods = [
  {
    icon: BrainCircuit,
    label: "IntelliCoach AI™",
    tag: "Autonomous 24/7 Coach",
    desc: "Real-time speech & accent tuning",
    badgeBg: "bg-gradient-to-tr from-indigo-600 to-violet-500",
    glowColor: "bg-indigo-500/25",
    hoverText: "group-hover:text-indigo-600",
    accentText: "text-indigo-600"
  },
  {
    icon: Video,
    label: "Video + AI™",
    tag: "Interactive Q&A Stream",
    desc: "Smart instant answering engine",
    badgeBg: "bg-gradient-to-tr from-rose-500 to-pink-500",
    glowColor: "bg-rose-500/25",
    hoverText: "group-hover:text-rose-600",
    accentText: "text-rose-600"
  },
  {
    icon: Layers,
    label: "Slide + AI™",
    tag: "Visual Knowledge Decks",
    desc: "Adaptive multi-modal note cards",
    badgeBg: "bg-gradient-to-tr from-amber-500 to-yellow-400",
    glowColor: "bg-amber-500/25",
    hoverText: "group-hover:text-amber-600",
    accentText: "text-amber-600"
  },
  {
    icon: Users,
    label: "Human Tutors",
    tag: "Certified Native Faculty",
    desc: "Live masterclasses & mentorship",
    badgeBg: "bg-gradient-to-tr from-emerald-500 to-teal-400",
    glowColor: "bg-emerald-500/25",
    hoverText: "group-hover:text-emerald-600",
    accentText: "text-emerald-600"
  }
]

export default function EducationSection() {
  const handleAction = (action: 'language-trainer' | 'eligibility') => {
    if (action === 'language-trainer') {
      window.dispatchEvent(new CustomEvent('open-language-trainer'))
    } else {
      document.getElementById('eligibility')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="education" className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Decorative Methodology Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-50/30 -skew-x-12 translate-x-1/2 -z-10" />
      
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Cpu className="w-3 h-3" />
            AI-Driven Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-3 mb-6 tracking-tight">
            Advanced Learning <span className="text-brand-600">Framework</span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-12">
            Experience our revolutionary 24/7 IntelliCoach AI™ training system combined with expert curriculum frameworks designed to meet international standards.
          </p>

          {/* Borderless Methodology Highlights with Floating Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
            {teachingMethods.map((m, i) => (
              <div 
                key={i} 
                onClick={() => window.dispatchEvent(new CustomEvent('open-language-trainer'))}
                className="group relative flex flex-col items-center text-center p-2 cursor-pointer select-none transition-all duration-300"
              >
                {/* Ambient Hover Glow */}
                <div className={`absolute -inset-2 rounded-2xl ${m.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none`} />

                {/* Floating Brand Badge */}
                <div className="relative mb-3">
                  <div className={`w-14 h-14 rounded-2xl ${m.badgeBg} flex items-center justify-center text-white shadow-md group-hover:scale-115 group-hover:-rotate-3 group-hover:shadow-xl transition-all duration-300 ease-out`}>
                    <m.icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>

                {/* Typography */}
                <div className="relative z-10 space-y-0.5">
                  <div className={`font-black text-slate-900 text-base md:text-lg ${m.hoverText} transition-all duration-300 group-hover:scale-105`}>
                    {m.label}
                  </div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${m.accentText}`}>
                    {m.tag}
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors mt-0.5 max-w-[200px] mx-auto font-medium">
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map(({ icon: Icon, title, description, features, action, cta }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 card-hover flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleAction(action)}
                className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  action === 'language-trainer'
                    ? 'bg-brand-700 text-white hover:bg-brand-800'
                    : 'border-2 border-brand-200 text-brand-700 hover:bg-brand-50'
                }`}
              >
                {action === 'language-trainer' ? <Play className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                {cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

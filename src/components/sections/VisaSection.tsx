import { Briefcase, Camera, GraduationCap, Search, Bot, FileCheck } from 'lucide-react'

const visaTypes = [
  {
    icon: Briefcase,
    title: 'Business Visa',
    description: 'Corporate travel, trade missions, and entrepreneur relocation support with full documentation guidance.',
  },
  {
    icon: Camera,
    title: 'Tourist Visa',
    description: 'Hassle-free tourist visa processing with appointment scheduling and travel itinerary support.',
  },
  {
    icon: GraduationCap,
    title: 'Student Visa',
    description: 'End-to-end student visa assistance including university enrollment, blocked account, and embassy prep.',
  },
  {
    icon: Search,
    title: 'Job Seeker Visa',
    description: 'Employment-based immigration pathways with job offer validation and relocation planning.',
  },
]

export default function VisaSection() {
  return (
    <section id="visa" className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Visa Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Seamless Visa Processing, Powered by AI
          </h2>
          <p className="text-slate-600 leading-relaxed">
            From business trips to permanent relocation, our visa experts and AI document processor
            ensure your application is complete, accurate, and approved.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visaTypes.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-brand-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* AI Document Processor */}
        <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-100">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-4">
                <Bot className="w-3.5 h-3.5" />
                AI-Powered
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Document Processor</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our intelligent document processor scans, validates, and organizes your visa application
                documents automatically — catching errors before submission and reducing processing time by up to 60%.
              </p>
              <div className="space-y-3">
                {[
                  'Automatic document classification & validation',
                  'Missing document detection & alerts',
                  'Real-time application status tracking',
                  'Multi-language document translation support',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => window.location.hash = '#applications?tab=Visa'}
                className="w-full mt-6 py-3.5 px-4 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Bot className="w-4 h-4 text-amber-400" /> Run AI Visa Eligibility Check
              </button>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="space-y-3">
                {['Passport Copy', 'Employment Letter', 'Bank Statement', 'Health Insurance'].map((doc, i) => (
                  <div key={doc} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">{doc}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      i < 3 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {i < 3 ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-brand-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">Document completeness: 75%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

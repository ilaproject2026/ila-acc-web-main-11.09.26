import { HardHat, Upload, Brain, TrendingUp } from 'lucide-react'

export default function JobsSection() {
  return (
    <section id="jobs" className="section-padding">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Jobs & Career Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            From Doctor to Driver — Careers for Everyone
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Whether you're a highly skilled professional or seeking blue-collar opportunities,
            our AI-powered career services connect you with the right employer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Doctor to Driver */}
          <div className="bg-gradient-to-br from-brand-700 to-brand-600 rounded-2xl p-8 lg:p-10 text-white card-hover">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
              <HardHat className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Doctor to Driver</h3>
            <p className="text-blue-100 leading-relaxed mb-6">
              Comprehensive blue-collar job placement across logistics, construction, manufacturing,
              and transportation sectors. We help professionals transition into stable, well-paying roles
              in Germany and across Europe.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Logistics & Driving', 'Construction', 'Manufacturing', 'Warehouse Ops'].map((role) => (
                <div key={role} className="bg-white/10 rounded-lg px-4 py-3 text-sm font-medium">
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* AI Resume Portal */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-100 card-hover">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
              <Brain className="w-6 h-6 text-brand-700" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Resume Upload & Match</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Upload your resume and let our AI engine analyze your skills, experience, and career goals
              to match you with the best-fit opportunities from our global employer network.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center mb-6 hover:border-brand-300 transition-colors cursor-pointer group">
              <Upload className="w-10 h-10 mx-auto text-slate-300 group-hover:text-brand-500 transition-colors mb-3" />
              <p className="text-sm font-medium text-slate-700">Drag & drop your resume here</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 10MB</p>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <TrendingUp className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Average match accuracy: <strong className="text-brand-700">94%</strong> across 500+ employers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

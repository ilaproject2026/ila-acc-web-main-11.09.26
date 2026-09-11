import { Laptop, Ship, DollarSign, Clock } from 'lucide-react'

const pathways = [
  {
    icon: DollarSign,
    title: 'Work While You Study',
    description: 'Structured work-study programs that let you gain international experience while earning a competitive income.',
    highlights: ['Part-time work authorization', 'Flexible schedules', 'Mentorship included'],
  },
  {
    icon: Laptop,
    title: 'IT Careers',
    description: 'Fast-track pathways into software development, cloud engineering, cybersecurity, and data science roles globally.',
    highlights: ['Industry certifications', 'Project-based learning', 'Direct employer connections'],
  },
  {
    icon: Ship,
    title: 'Import-Export Careers',
    description: 'Build a career in international trade — logistics coordination, customs compliance, and supply chain management.',
    highlights: ['Trade compliance training', 'Global network access', 'Entrepreneur support'],
  },
]

export default function WorkWhileYouStudySection() {
  return (
    <section id="earn-learn" className="section-padding">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Work While You Study & Careers</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Learn, Earn & Grow Simultaneously
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Our earn-while-you-learn model and specialized career tracks in IT and import-export
            give you practical skills and real income from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pathways.map(({ icon: Icon, title, description, highlights }) => (
            <div
              key={title}
              className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 card-hover overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full opacity-50" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-brand-700 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{description}</p>
                <ul className="space-y-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

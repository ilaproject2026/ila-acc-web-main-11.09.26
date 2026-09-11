import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useState } from 'react'

export default function AboutContact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for reaching out! Our team will respond within 24 hours.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="about" className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* About */}
          <div>
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">About ILA Global</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-6">
              Bridging Talent & Opportunity Worldwide
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Founded with a mission to democratize global career access, ILA Global (International Learning Alliance)
              has helped thousands of professionals, students, and job seekers navigate education, employment,
              and immigration across 40+ countries.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Our integrated platform combines human expertise with AI-powered tools — from resume matching
              and visa document processing to personalized career coaching — ensuring every client receives
              end-to-end support on their international journey.
            </p>

            <div className="space-y-4">
              {[
                { icon: MapPin, text: '123 Global Business Park, Suite 500, Berlin, Germany' },
                { icon: Phone, text: '+49 (0) 30 1234 5678' },
                { icon: Mail, text: 'contact@ilaglobal.com' },
                { icon: Clock, text: 'Mon – Fri: 9:00 AM – 6:00 PM CET' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-700" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Get in Touch</h3>
            <p className="text-sm text-slate-500 mb-6">Have questions? We'd love to hear from you.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { 
  Megaphone, MessageSquare, Mail, Share2, MapPin, Brain, CalendarDays, 
  Plus, Users, Cpu, FileText, Printer, TrendingUp, DollarSign, Calendar,
  CheckCircle2, UploadCloud
} from 'lucide-react'

interface FunnelPipeline {
  id: string
  name: string
  source: 'WhatsApp' | 'Email' | 'Social' | 'Meta Ads' | 'Google PPC'
  leadsCount: number
  conversionRate: number
  revenueGenerated: number
}

interface FieldVisit {
  id: string
  location: string
  contactPerson: string
  summary: string
  nextAction: string
  date: string
}

interface Campaign {
  id: string
  name: string
  channel: string
  budget: number
  spent: number
  status: 'Active' | 'Completed'
  targetGeography: string
}

interface MarketingLead {
  id: string
  clientName: string
  channel: string
  status: 'New / Pending' | 'In Progress' | 'Converted' | 'Cold / Delayed'
  assignedTo: string
  date: string
}

interface MarketingMeeting {
  id: string
  title: string
  agenda: string
  date: string
  time: string
  status: 'Scheduled' | 'Completed'
}

import DepartmentApprovalsTab from './DepartmentApprovalsTab';
import DepartmentUpdatesTab from './DepartmentUpdatesTab';

export default function MarketingStudioHub() {
  const [subTab, setSubTab] = useState<'campaigns' | 'leads' | 'field' | 'ai' | 'meetings' | 'seasonal' | 'budget' | 'reports' | 'approvals' | 'updates'>('campaigns')

  // Multi-Channel Pipelines State
  const [pipelines] = useState<FunnelPipeline[]>([
    { id: 'p1', name: 'German Nurses Campaign', source: 'WhatsApp', leadsCount: 145, conversionRate: 15, revenueGenerated: 250000 },
    { id: 'p2', name: 'Ausbildung Autumn Intake', source: 'Email', leadsCount: 420, conversionRate: 8, revenueGenerated: 380000 },
    { id: 'p3', name: 'Study Abroad Meta Ads', source: 'Meta Ads', leadsCount: 310, conversionRate: 12, revenueGenerated: 450000 },
  ])

  // Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 'CMP-101', name: 'German B2 Nursing Lead Gen Q3', channel: 'Meta Ads', budget: 50000, spent: 32000, status: 'Active', targetGeography: 'Kerala & South India' },
  ])
  const [cmpName, setCmpName] = useState('')
  const [cmpBudget, setCmpBudget] = useState('')

  // Lead Funnel State
  const [leads] = useState<MarketingLead[]>([
    { id: 'L-1', clientName: 'Rahul Varma', channel: 'Meta Ads', status: 'In Progress', assignedTo: 'Counselor Priya', date: '2026-08-19' },
    { id: 'L-2', clientName: 'Anusree Nair', channel: 'SEO Organic', status: 'New / Pending', assignedTo: 'Unassigned', date: '2026-08-20' },
  ])

  // Field Visits State
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>([
    { id: 'fv1', location: 'Govt Nursing College, Kochi', contactPerson: 'Principal Sharma', summary: 'Introduced B2 fast-track. High interest.', nextAction: 'Send MoU draft', date: '2026-08-16' }
  ])
  const [location, setLocation] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [summary, setSummary] = useState('')
  const [nextAction, setNextAction] = useState('')

  // Meetings State
  const [meetings, setMeetings] = useState<MarketingMeeting[]>([
    { id: 'M-1', title: 'Q3 Meta Ads Optimization Sync', agenda: 'Review CPL and scale high-performing ad sets.', date: '2026-08-22', time: '11:00 AM', status: 'Scheduled' }
  ])
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')

  // AI Analyzer State
  const [meetingNotes, setMeetingNotes] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // AI Ad Generator State
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiOutput, setAiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cmpName || !cmpBudget) return
    const newCmp: Campaign = {
      id: 'CMP-' + Math.floor(100 + Math.random() * 900),
      name: cmpName,
      channel: 'Meta Ads',
      budget: parseFloat(cmpBudget),
      spent: 0,
      status: 'Active',
      targetGeography: 'Pan India'
    }
    setCampaigns([newCmp, ...campaigns])
    setCmpName('')
    setCmpBudget('')
    alert('Campaign added successfully!')
  }

  const handleAddFieldVisit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !contactPerson) return
    const newVisit: FieldVisit = {
      id: 'fv-' + Math.floor(100 + Math.random() * 900),
      location,
      contactPerson,
      summary: summary || 'General institutional visit',
      nextAction: nextAction || 'Follow up via call',
      date: new Date().toISOString().split('T')[0]
    }
    setFieldVisits([newVisit, ...fieldVisits])
    setLocation('')
    setContactPerson('')
    setSummary('')
    setNextAction('')
    alert('Field visit log recorded successfully!')
  }

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingTitle || !meetingDate) return
    const newMeet: MarketingMeeting = {
      id: 'M-' + Math.floor(100 + Math.random() * 900),
      title: meetingTitle,
      agenda: 'Strategy synchronization',
      date: meetingDate,
      time: '10:00 AM',
      status: 'Scheduled'
    }
    setMeetings([newMeet, ...meetings])
    setMeetingTitle('')
    setMeetingDate('')
    alert('Strategy meeting scheduled!')
  }

  const handleAnalyzeMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingNotes) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setAiAnalysis("🔥 AI Insights & Recommendations:\n- Sentiment: Highly Positive\n- Key Objection: Cost of living in Germany\n- Recommended Action: Send 'Ausbildung Stipend Breakdown' PDF.")
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleGenerateAIAd = () => {
    if (!aiPrompt) return
    setIsGenerating(true)
    setTimeout(() => {
      setAiOutput(`🚀 [AI Generated Ad Copy for: "${aiPrompt}"]\n\nHeadline: Unlock Your Dream Career in Europe with ILA Global! 🇩🇪✨\n\nBody: Get end-to-end language training, visa processing, and guaranteed placement support with our fast-track pathway.\n\nCall to Action: Register for our free consultation webinar today! #ILAGlobal`)
      setIsGenerating(false)
    }, 1000)
  }

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)

  return (
    <div className="space-y-6">
      {/* Top sub-tab switcher */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto no-scrollbar py-1">
        <button onClick={() => setSubTab('approvals')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'approvals' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>✅ Approvals</button>
        <button onClick={() => setSubTab('updates')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'updates' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📡 Updates</button>
        <button onClick={() => setSubTab('campaigns')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'campaigns' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🎯 Campaigns</button>
        <button onClick={() => setSubTab('leads')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'leads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>👥 Lead Funnel</button>
        <button onClick={() => setSubTab('field')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'field' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📍 Field Visits</button>
        <button onClick={() => setSubTab('ai')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'ai' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🤖 AI Analyzer</button>
        <button onClick={() => setSubTab('meetings')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'meetings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📅 Meetings & Sync</button>
        <button onClick={() => setSubTab('seasonal')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'seasonal' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📅 Seasonal</button>
        <button onClick={() => setSubTab('budget')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'budget' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>💳 Budget & ROI</button>
        <button onClick={() => setSubTab('reports')} className={`px-4 py-2 text-xs font-black border-b-2 whitespace-nowrap cursor-pointer ${subTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>📈 Reports</button>
      </div>

      {/* 1. CAMPAIGNS */}
      {subTab === 'campaigns' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm"><Megaphone className="w-5 h-5 text-indigo-600" /> Active Campaign Pipelines</h3>
          <form onSubmit={handleAddCampaign} className="grid sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
            <input type="text" required placeholder="Campaign Name" value={cmpName} onChange={(e) => setCmpName(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <input type="number" required placeholder="Budget (INR)" value={cmpBudget} onChange={(e) => setCmpBudget(e.target.value)} className="p-2 border rounded-xl bg-white outline-none font-bold" />
            <button type="submit" className="py-2 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer">Launch Campaign</button>
          </form>
          <div className="space-y-3">
            {pipelines.map((p) => {
              const Icon = p.source === 'WhatsApp' ? MessageSquare : p.source === 'Email' ? Mail : Share2
              return (
                <div key={p.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-indigo-600" /><span className="font-extrabold">{p.name}</span><span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{p.source}</span></div>
                  <div className="font-bold text-slate-600">Leads: {p.leadsCount} | Conv: {p.conversionRate}% | Rev: ₹{p.revenueGenerated.toLocaleString('en-IN')}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 2. LEAD FUNNEL */}
      {subTab === 'leads' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm"><Users className="w-5 h-5 text-indigo-600" /> Marketing Lead Tracking & Follow-up Funnel</h3>
          <div className="space-y-2">
            {leads.map(l => (
              <div key={l.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{l.clientName}</div>
                  <div className="text-[10px] text-slate-400">Channel: {l.channel} • Assigned: {l.assignedTo}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${l.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FIELD VISITS */}
      {subTab === 'field' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm"><MapPin className="w-5 h-5 text-indigo-600" /> Field Visits & Direct Marketing</h3>
          <form onSubmit={handleAddFieldVisit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
            <input type="text" required placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <input type="text" required placeholder="Contact Person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <input type="text" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <input type="text" placeholder="Next Action" value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <div className="col-span-full flex justify-end"><button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer text-xs">Log Field Visit</button></div>
          </form>
          <div className="space-y-3">
            {fieldVisits.map(fv => (
              <div key={fv.id} className="p-3 border rounded-xl bg-slate-50 text-xs">
                <div className="font-bold text-slate-900">{fv.location} ({fv.date})</div>
                <div className="text-slate-600 mt-1">Contact: {fv.contactPerson} | Action: {fv.nextAction}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI ANALYZER */}
      {subTab === 'ai' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm"><Brain className="w-5 h-5 text-purple-600" /> AI Meeting Analyzer & Ad Generator</h3>
          <form onSubmit={handleAnalyzeMeeting} className="space-y-2 bg-slate-50 p-4 rounded-2xl border text-xs">
            <textarea rows={3} placeholder="Paste rough meeting notes..." value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} className="w-full p-3 border rounded-xl outline-none bg-white" />
            <button disabled={isAnalyzing} type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl cursor-pointer">{isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}</button>
          </form>
          {aiAnalysis && <div className="p-3 bg-purple-50 border rounded-xl text-xs font-semibold text-purple-900">{aiAnalysis}</div>}
          
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border text-xs mt-4">
            <div className="font-bold">AI Ad Copy Generator</div>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter topic..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="flex-1 p-2 border rounded-xl bg-white outline-none" />
              <button onClick={handleGenerateAIAd} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer">Generate</button>
            </div>
            {aiOutput && <div className="p-3 bg-white border rounded-xl font-mono text-xs whitespace-pre-line">{aiOutput}</div>}
          </div>
        </div>
      )}

      {/* 5. MEETINGS & SYNC */}
      {subTab === 'meetings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm"><Calendar className="w-5 h-5 text-indigo-600" /> Marketing Strategy Meetings & Sync</h3>
          <form onSubmit={handleScheduleMeeting} className="grid sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
            <input type="text" required placeholder="Meeting Title" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <input type="date" required value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="p-2 border rounded-xl bg-white outline-none" />
            <button type="submit" className="py-2 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer">Schedule Meeting</button>
          </form>
          <div className="space-y-2">
            {meetings.map(m => (
              <div key={m.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center text-xs">
                <div><div className="font-extrabold">{m.title}</div><div className="text-[10px] text-slate-400">Date: {m.date} at {m.time}</div></div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SEASONAL */}
      {subTab === 'seasonal' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-indigo-600 mx-auto" />
          <h3 className="font-black text-slate-900 text-sm">Seasonal Campaign Planner</h3>
          <p className="text-xs text-slate-500">Plan promotional calendars for Winter, Summer, and Spring intakes.</p>
        </div>
      )}

      {/* 7. BUDGET */}
      {subTab === 'budget' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-md"><div className="text-sm font-bold opacity-90 uppercase">Total Budget</div><div className="text-3xl font-black mt-1">₹{totalBudget.toLocaleString('en-IN')}</div></div>
          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl p-6 text-white shadow-md"><div className="text-sm font-bold opacity-90 uppercase">Total Spent</div><div className="text-3xl font-black mt-1">₹{totalSpent.toLocaleString('en-IN')}</div></div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-md"><div className="text-sm font-bold opacity-90 uppercase">Estimated ROI</div><div className="text-3xl font-black mt-1">4.8x</div></div>
        </div>
      )}

      {/* 8. REPORTS */}
      {subTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm"><FileText className="w-5 h-5 text-slate-900" /> Marketing Audit & Reports</h3>
            <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> Print Report</button>
          </div>
          <p className="text-xs text-slate-600">All marketing campaigns, field logs, and lead funnels are fully synchronized with enterprise reporting.</p>
        </div>
      )}

      {/* 9. APPROVALS */}
      {subTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <DepartmentApprovalsTab departmentName="Marketing Studio" />
          
          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Franchise & Departmental Promo Approvals
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 mt-4">
              Multi-level Approval Hierarchy: All uploaded brochures, videos, or promotional text from franchises and internal departments are routed here. 
              Final publishing strictly requires sign-off from the Marketing Head. Once approved, the content is directly pushed to the franchise's registered WhatsApp/Mobile.
            </p>

            <div className="space-y-4">
              {/* Example Pending Item */}
              <div className="p-4 border border-amber-200 bg-amber-50 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded font-bold text-[10px]">Pending Approval</span>
                    <span className="text-xs font-bold text-slate-700">Kerala Branch - Study Abroad Dept</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap">
                    "🚀 Special Update! Join our fast-track admission process for German Universities this August intake..."
                  </p>
                  <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                    <UploadCloud className="w-3 h-3" /> Includes 1 Attached Brochure
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 min-w-[140px]">
                  <button className="flex-1 px-3 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs cursor-pointer text-center">
                    Approve & Route to WhatsApp
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer text-center">
                    Reject / Revise
                  </button>
                </div>
              </div>
              
              {/* Example Approved Item */}
              <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 opacity-70">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded font-bold text-[10px]">Approved & Routed</span>
                    <span className="text-xs font-bold text-slate-700">Delhi Franchise - General Manager</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 whitespace-pre-wrap">
                    "Start your dual-study Ausbildung program today..."
                  </p>
                  <div className="text-[10px] text-emerald-600 mt-2 font-bold">
                    Sent to Franchise WhatsApp (+91 98765 43210) on {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. UPDATES */}
      {subTab === 'updates' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <DepartmentUpdatesTab departmentName="Marketing Studio" />
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react';
import { 
  Building2, Users, Calendar, Award, 
  Send, PlusCircle, CheckCircle2, 
  TrendingUp, Megaphone, Clock, Star,
  ShieldCheck, FileText, ChevronRight
} from 'lucide-react';

interface HubHODViewProps {
  departmentName: string;
  departmentTagline?: string;
  defaultAgendas?: { id: string; title: string; targetDate: string; priority: 'High' | 'Medium' | 'Critical'; status: 'In Progress' | 'Completed' | 'Pending Review' }[];
  defaultTieUps?: { id: string; partnerName: string; location: string; type: string; terms: string; status: 'Active' | 'Under Audit' | 'MOU Signed' }[];
}

export const HubHODView: React.FC<HubHODViewProps> = ({
  departmentName,
  departmentTagline = 'Strategic Department Agendas, Institutional Tie-ups, Program Launches & Cohort Tracking',
  defaultAgendas = [
    { id: 'ag-1', title: `Q3 Institutional Outreach & Partner Scaling for ${departmentName}`, targetDate: '2026-09-30', priority: 'High', status: 'In Progress' },
    { id: 'ag-2', title: `Launch Accelerated Fast-Track Cohort with Industry Certification`, targetDate: '2026-10-15', priority: 'Critical', status: 'In Progress' },
    { id: 'ag-3', title: `Annual Quality Audit, Faculty Evaluations & Compliance Review`, targetDate: '2026-11-01', priority: 'Medium', status: 'Pending Review' }
  ],
  defaultTieUps = [
    { id: 'tu-1', partnerName: 'European Academic Alliance & TU Munich', location: 'Munich, Germany', type: 'Academic & Exchange', terms: 'MOU for Fast-track Admissions & Credit Recognition', status: 'Active' },
    { id: 'tu-2', partnerName: 'Bosch & Siemens Dual Corporate Consortium', location: 'Stuttgart & Berlin', type: 'Corporate Placement', terms: 'Direct Interview Channels & €2,500/mo Sponsorships', status: 'MOU Signed' },
    { id: 'tu-3', partnerName: 'Telc & Goethe Certified Testing Syndicate', location: 'Frankfurt, Germany', type: 'Language & Certification', terms: 'Special Exam Centers & Expedited Results', status: 'Active' }
  ]
}) => {
  const [agendas, setAgendas] = useState(defaultAgendas);
  const [tieUps, setTieUps] = useState(defaultTieUps);

  // Agenda Form
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaDate, setNewAgendaDate] = useState('');
  const [newAgendaPriority, setNewAgendaPriority] = useState<'High' | 'Medium' | 'Critical'>('High');

  // Tie-Up Form
  const [showTieUpModal, setShowTieUpModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLocation, setNewPartnerLocation] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('Academic / Corporate Tie-Up');
  const [newPartnerTerms, setNewPartnerTerms] = useState('');

  // Program Initiation Form
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progDuration, setProgDuration] = useState('6 Months');
  const [progCapacity, setProgCapacity] = useState('30 Seats');
  const [progNotification, setProgNotification] = useState(true);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTitle) return;
    const newAg = {
      id: 'ag-' + Date.now(),
      title: newAgendaTitle,
      targetDate: newAgendaDate || '2026-10-30',
      priority: newAgendaPriority,
      status: 'In Progress' as const
    };
    setAgendas([newAg, ...agendas]);
    setShowAgendaModal(false);
    setNewAgendaTitle('');
    showToast('Department Agenda logged successfully.');
  };

  const handleAddTieUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName) return;
    const newTu = {
      id: 'tu-' + Date.now(),
      partnerName: newPartnerName,
      location: newPartnerLocation || 'Frankfurt, Germany',
      type: newPartnerType,
      terms: newPartnerTerms || 'Direct MoU signed for student induction',
      status: 'MOU Signed' as const
    };
    setTieUps([newTu, ...tieUps]);
    setShowTieUpModal(false);
    setNewPartnerName('');
    showToast('New Institutional / Corporate Tie-up established.');
  };

  const handleInitiateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle) return;
    setShowProgramModal(false);
    showToast(`Program "${progTitle}" initiated! Synced across Portal & Marketing Studio.`);
    setProgTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
              HOD Executive Console
            </span>
            <span className="text-xs text-slate-300 font-bold">Dept: {departmentName}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Head of Department Control Center
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {departmentTagline}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowProgramModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Initiate New Program
          </button>
          <button
            onClick={() => setShowTieUpModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-300" /> + Establish Tie-up
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Cohorts / Streams</span>
          <div className="text-2xl font-black text-slate-900">8 Active Tracks</div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 98.4% Enrollment Capacity
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MoUs & Strategic Tie-Ups</span>
          <div className="text-2xl font-black text-indigo-600">{tieUps.length} Institutional MoUs</div>
          <p className="text-xs text-slate-500">Verified German & EU Network</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Strategic Agendas</span>
          <div className="text-2xl font-black text-amber-600">{agendas.filter(a => a.status === 'In Progress').length} In Progress</div>
          <p className="text-xs text-slate-500">HOD Strategic Goals for 2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Placement / Conversion Rate</span>
          <div className="text-2xl font-black text-emerald-600">92.6%</div>
          <p className="text-xs text-slate-500">Fast-track onboarding verified</p>
        </div>
      </div>

      {/* Main Grid: Agendas & Institutional Tie-ups */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Column: Strategic Agendas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" /> Strategic Agendas & Milestones
              </h3>
              <p className="text-xs text-slate-500">Execution targets and quarterly expansion goals.</p>
            </div>
            <button
              onClick={() => setShowAgendaModal(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Goal
            </button>
          </div>

          <div className="space-y-3">
            {agendas.map((ag) => (
              <div key={ag.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 text-xs">{ag.title}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${
                    ag.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    ag.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ag.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="w-3 h-3 text-slate-400" /> Target: {ag.targetDate}
                  </span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {ag.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Institutional & Corporate Tie-Ups */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" /> Strategic Partnerships & MoUs
              </h3>
              <p className="text-xs text-slate-500">Active university, employer, and certification contracts.</p>
            </div>
            <button
              onClick={() => setShowTieUpModal(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Partner
            </button>
          </div>

          <div className="space-y-3">
            {tieUps.map((tu) => (
              <div key={tu.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{tu.partnerName}</h4>
                    <p className="text-[11px] text-slate-500">{tu.location} • <span className="font-semibold text-brand-700">{tu.type}</span></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 shrink-0">
                    {tu.status}
                  </span>
                </div>
                <div className="text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/60 text-slate-600 font-medium">
                  {tu.terms}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Program Initiation Wizard Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                HOD Course / Program Initiator
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Initiate New Department Program</h3>
              <p className="text-xs text-slate-500">Configure new curriculum, corporate pilot, or cohort for {departmentName}.</p>
            </div>

            <form onSubmit={handleInitiateProgram} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Program / Cohort Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., German C1 Professional or Cloud Engineering FastTrack"
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-brand-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cohort Capacity</label>
                  <input
                    type="text"
                    value={progCapacity}
                    onChange={(e) => setProgCapacity(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 font-medium">
                <input
                  type="checkbox"
                  id="progNotif"
                  checked={progNotification}
                  onChange={(e) => setProgNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 cursor-pointer"
                />
                <label htmlFor="progNotif" className="cursor-pointer">
                  Auto-sync with Marketing Studio & Social Media Promo channels
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Launch Program 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Agenda Modal */}
      {showAgendaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Add Department Milestone / Agenda</h3>
            <form onSubmit={handleAddAgenda} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Goal Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Upgrade German Labs or Launch 2026 Admissions"
                  value={newAgendaTitle}
                  onChange={(e) => setNewAgendaTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newAgendaDate}
                    onChange={(e) => setNewAgendaDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newAgendaPriority}
                    onChange={(e) => setNewAgendaPriority(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  >
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowAgendaModal(false)} className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-xl cursor-pointer">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tie-Up Modal */}
      {showTieUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Establish Partner Tie-Up</h3>
            <form onSubmit={handleAddTieUp} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Partner Institution / Corporation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RWTH Aachen or Delivery Hero"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Munich, Germany"
                  value={newPartnerLocation}
                  onChange={(e) => setNewPartnerLocation(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Terms / MoU Highlights</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Direct credit transfer and fast-track offer letters..."
                  value={newPartnerTerms}
                  onChange={(e) => setNewPartnerTerms(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowTieUpModal(false)} className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-xl cursor-pointer">Establish MoU</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, UserPlus, PhoneCall, 
  Mail, MessageSquare, ArrowUpRight, Search, 
  SlidersHorizontal, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { getInquiries, updateInquiryStatus, assignStaffToInquiry, getStaffRegistry, Inquiry, StaffUser } from '../../../lib/db';
import ClientIntakeModal from './ClientIntakeModal';

interface OnlineEnquiryFunnelProps {
  onNavigateDepartment?: (deptTab: string) => void;
}

export default function OnlineEnquiryFunnel({ onNavigateDepartment }: OnlineEnquiryFunnelProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [showIntakeModal, setShowIntakeModal] = useState(false);

  const loadData = () => {
    const all = getInquiries();
    setInquiries(all.filter(i => i.type === 'Online' || !i.type));
    setStaffList(getStaffRegistry());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-inquiries-changed', loadData);
    return () => window.removeEventListener('ilas-inquiries-changed', loadData);
  }, []);

  const filteredInquiries = inquiries.filter(item => {
    const matchesDept = selectedDeptFilter === 'All' || item.category === selectedDeptFilter || item.department === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'All' || item.paymentStatus === selectedStatusFilter || item.crmStatus === selectedStatusFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter(i => i.crmStatus === 'New Lead' || i.paymentStatus === 'Pending').length;
  const contacted = inquiries.filter(i => i.paymentStatus === 'Contacted' || i.crmStatus === 'In Progress').length;
  const converted = inquiries.filter(i => i.paymentStatus === 'Paid').length;

  const handleAssignStaff = (inquiryId: string, staffId: string) => {
    const found = staffList.find(s => s.id === staffId);
    if (found) {
      assignStaffToInquiry(inquiryId, staffId, found.name);
    }
  };

  const handleStatusChange = (inquiryId: string, status: Inquiry['paymentStatus']) => {
    updateInquiryStatus(inquiryId, status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-brand-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Digital Web Ingestion Engine
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              AI Scoring Active
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Online Enquiry & Inbound Lead Funnel</h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Centralized funnel capturing digital inquiries across website course assessments, visa eligibility calculators, and university scholarship applications.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Manual Online Entry</span>
          </button>
        </div>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Inbound Leads</div>
          <div className="text-2xl font-black text-slate-900">{totalLeads} Leads</div>
          <div className="text-[11px] text-slate-500 font-medium">Digital website submissions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">New (Pending Contact)</div>
          <div className="text-2xl font-black text-amber-600">{newLeads} Untouched</div>
          <div className="text-[11px] text-slate-500 font-medium">Requires initial 24h touchpoint</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">In Active Nurturing</div>
          <div className="text-2xl font-black text-indigo-600">{contacted} In Progress</div>
          <div className="text-[11px] text-slate-500 font-medium">Counselor follow-ups underway</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Enrolled / Paid</div>
          <div className="text-2xl font-black text-emerald-600">{converted} Enrolled</div>
          <div className="text-[11px] text-slate-500 font-medium">Converted to closed admission</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search online leads by name, email, phone, program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Education">🎓 Education & Training</option>
            <option value="Visa">🛂 Visa & Legal</option>
            <option value="Study Abroad">🏛️ Study Abroad</option>
            <option value="Jobs">💼 Job & Career</option>
            <option value="Work While You Study">⚙️ Work While You Study</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Lead Statuses</option>
            <option value="Pending">Pending Contact</option>
            <option value="Contacted">Contacted</option>
            <option value="Paid">Paid / Enrolled</option>
            <option value="Link Sent">Link Sent</option>
          </select>
        </div>
      </div>

      {/* Online Leads Roster */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900">Web Inbound Leads Queue ({filteredInquiries.length})</h3>
            <p className="text-xs text-slate-500">Auto-captured leads with AI score, source attribution, and fast-track allocation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-100 tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Lead / Candidate</th>
                <th className="p-3.5">Department & Interest</th>
                <th className="p-3.5">Source & AI Score</th>
                <th className="p-3.5">Assigned Counselor</th>
                <th className="p-3.5">Pipeline Status</th>
                <th className="p-3.5">3-Day Follow-up</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                    No online inquiries match your current filter.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Candidate Name & Contact */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">{inq.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{inq.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inq.phone}</div>
                    </td>

                    {/* Department & Program */}
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded font-black text-[10px] uppercase mb-1">
                        {inq.category || inq.department || 'General'}
                      </span>
                      <div className="font-bold text-slate-800 truncate max-w-[200px]" title={inq.course}>
                        {inq.course}
                      </div>
                    </td>

                    {/* Source & AI Score */}
                    <td className="p-3.5">
                      <div className="text-slate-600 font-semibold text-[11px]">{inq.source || 'Website Form'}</div>
                      {inq.aiScore ? (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {inq.aiScore}% Match
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Standard Intake</span>
                      )}
                    </td>

                    {/* Assigned Counselor */}
                    <td className="p-3.5">
                      <select
                        value={inq.assignedStaffId || ''}
                        onChange={(e) => handleAssignStaff(inq.id, e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[11px] text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="">+ Assign Counselor</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Pipeline Status */}
                    <td className="p-3.5">
                      <select
                        value={inq.paymentStatus}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry['paymentStatus'])}
                        className={`p-1.5 rounded-lg font-black text-[10px] border outline-none cursor-pointer ${
                          inq.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : inq.paymentStatus === 'Contacted'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Pending">⚠️ Pending Contact</option>
                        <option value="Contacted">📞 Contacted</option>
                        <option value="Paid">✅ Paid / Enrolled</option>
                        <option value="Link Sent">🔗 Link Sent</option>
                      </select>
                    </td>

                    {/* Follow-up */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{inq.followUpDate || 'In 3 days'}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        inq.followUpStatus === 'Due Today'
                          ? 'bg-amber-100 text-amber-900'
                          : inq.followUpStatus === 'Overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {inq.followUpStatus || 'Scheduled'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20ILA%20Global%20Consulting%20regarding%20your%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer transition-colors"
                          title="WhatsApp Candidate"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${inq.email}?subject=Your%20Inquiry%20with%20ILA%20Global`}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer transition-colors"
                          title="Email Candidate"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        {onNavigateDepartment && (
                          <button
                            onClick={() => {
                              const dept = inq.category || inq.department || 'Education';
                              const mapping: Record<string, string> = {
                                'Education': 'education',
                                'Visa': 'visa',
                                'Study Abroad': 'study_abroad',
                                'Jobs': 'jobs',
                                'Work While You Study': 'work_while_you_study'
                              };
                              onNavigateDepartment(mapping[dept] || 'all_inquiries');
                            }}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <span>Route</span>
                            <ArrowUpRight className="w-3 h-3 text-indigo-300" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Online Entry Modal */}
      <ClientIntakeModal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        defaultType="Online"
        onNavigateDepartment={onNavigateDepartment}
      />

    </div>
  );
}

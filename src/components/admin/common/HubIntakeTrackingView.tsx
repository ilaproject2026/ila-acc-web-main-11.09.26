import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Smartphone, 
  Mail, Calendar, CheckCircle2, Clock, 
  MessageSquare, UserCheck, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { 
  DepartmentInquiryItem, 
  getDepartmentInquiries, 
  saveDepartmentInquiry, 
  updateDepartmentInquiryStatus 
} from '../../../lib/db';

interface HubIntakeTrackingViewProps {
  departmentName: 'Education' | 'Work While You Study' | 'Study Abroad' | 'Jobs' | 'Rewards' | 'Visa';
  departmentTitle?: string;
}

export const HubIntakeTrackingView: React.FC<HubIntakeTrackingViewProps> = ({
  departmentName,
  departmentTitle = `${departmentName} Intake Desk & Candidate Pipeline`
}) => {
  const [inquiries, setInquiries] = useState<DepartmentInquiryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // New Inquiry Modal
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newType, setNewType] = useState<DepartmentInquiryItem['type']>('Walk-in');
  const [newNotes, setNewNotes] = useState('');
  const [newCounselor, setNewCounselor] = useState('Front Office Lead');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadData = () => {
    setInquiries(getDepartmentInquiries(departmentName));
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('ilas-dept-inquiries-changed', handleUpdate);
    return () => window.removeEventListener('ilas-dept-inquiries-changed', handleUpdate);
  }, [departmentName]);

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newInq: DepartmentInquiryItem = {
      id: 'inq-' + Date.now(),
      department: departmentName,
      type: newType,
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@candidate.in`,
      phone: newPhone,
      programOfInterest: newProgram || `${departmentName} Cohort Track`,
      notes: newNotes || 'Direct walk-in inquiry at front office desk.',
      status: 'New',
      counselorAssigned: newCounselor,
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveDepartmentInquiry(newInq);
    setShowModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewProgram('');
    setNewNotes('');
    showToast(`Inquiry for ${newName} logged successfully.`);
  };

  const handleStatusChange = (id: string, newStatus: DepartmentInquiryItem['status']) => {
    updateDepartmentInquiryStatus(id, newStatus);
    showToast(`Candidate status updated to "${newStatus}".`);
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inq.phone.includes(searchTerm) ||
                        inq.programOfInterest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || inq.status === statusFilter;
    const matchType = typeFilter === 'All' || inq.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

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
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
              Front Office & Intake Desk
            </span>
            <span className="text-xs text-slate-300 font-bold">Dept: {departmentName}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {departmentTitle}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Centralized intake registry to record walk-in visitors, manage online funnels, assign academic counselors, and advance candidate stages.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> + Log Walk-in Inquiry
          </button>
        </div>
      </div>

      {/* Quick Stage Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Inquiries', count: inquiries.length, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'New Uncontacted', count: inquiries.filter(i => i.status === 'New').length, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'In-Review / Audit', count: inquiries.filter(i => i.status === 'In-Review').length, color: 'text-amber-600', bg: 'bg-white' },
          { label: 'Enrolled / Accepted', count: inquiries.filter(i => i.status === 'Enrolled').length, color: 'text-emerald-600', bg: 'bg-white' },
          { label: 'Walk-ins Logged', count: inquiries.filter(i => i.type === 'Walk-in').length, color: 'text-indigo-600', bg: 'bg-white' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1`}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{stat.label}</span>
            <div className={`text-xl font-black ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search inquiries by student name, phone, email, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs outline-none focus:border-brand-600 bg-slate-50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In-Review">In-Review</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Dropped">Dropped</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none"
            >
              <option value="All">All Channels</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Online Funnel">Online Funnel</option>
              <option value="WhatsApp Direct">WhatsApp Direct</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-3">Candidate / Contact</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Program of Interest</th>
                <th className="p-3">Assigned Counselor</th>
                <th className="p-3">Date</th>
                <th className="p-3">Stage / Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No intake inquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{inq.name}</div>
                      <div className="text-[11px] text-slate-500">{inq.phone} • {inq.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {inq.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-brand-700">
                      {inq.programOfInterest}
                    </td>
                    <td className="p-3 text-slate-600">
                      {inq.counselorAssigned}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {inq.createdAt}
                    </td>
                    <td className="p-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer outline-none ${
                          inq.status === 'Enrolled' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          inq.status === 'New' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          inq.status === 'In-Review' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          inq.status === 'Contacted' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In-Review">In-Review</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        <Smartphone className="w-3 h-3" /> WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Walk-in Inquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Front Office Desk
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Record Walk-in / Direct Inquiry</h3>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="candidate@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Channel Source</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold outline-none"
                  >
                    <option value="Walk-in">Walk-in Reception</option>
                    <option value="Online Funnel">Online Website</option>
                    <option value="WhatsApp Direct">WhatsApp Direct</option>
                    <option value="Referral">Peer / Consultant Referral</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Counselor</label>
                  <input
                    type="text"
                    value={newCounselor}
                    onChange={(e) => setNewCounselor(e.target.value)}
                    className="w-full p-2.5 border rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Program of Interest</label>
                <input
                  type="text"
                  placeholder={`e.g. ${departmentName} FastTrack Track`}
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Counselor Discussion Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes from initial counseling session..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl cursor-pointer"
                >
                  Save Inquiry 📝
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

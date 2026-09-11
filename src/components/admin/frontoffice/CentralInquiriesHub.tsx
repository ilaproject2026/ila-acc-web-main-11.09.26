import { useState, useEffect } from 'react';
import { 
  Building2, Users, UserPlus, FileText, 
  Calendar, CheckCircle2, Search, ArrowUpRight, 
  Phone, Mail, MessageSquare, Ticket, Globe, 
  Trash2, SlidersHorizontal, LayoutGrid, List,
  Clock, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { 
  getInquiries, 
  deleteInquiry, 
  assignStaffToInquiry, 
  updateInquiryStatus, 
  updateInquiryVisaStage,
  getStaffRegistry, 
  getDailyWalkinStats, 
  Inquiry, 
  StaffUser 
} from '../../../lib/db';
import ClientIntakeModal from './ClientIntakeModal';
import DailyFollowupReportsModal from './DailyFollowupReportsModal';

interface CentralInquiriesHubProps {
  onNavigateDepartment?: (deptTab: string) => void;
}

export default function CentralInquiriesHub({ onNavigateDepartment }: CentralInquiriesHubProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [stats, setStats] = useState({
    totalWalkins: 0,
    convertedPaid: 0,
    dueFollowupsCount: 0,
    activeVisaCases: 0
  });

  // UI & Filter States
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [staffFilter, setStaffFilter] = useState<string>('All');
  const [followUpFilter, setFollowUpFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  // Modals
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  const loadData = () => {
    setInquiries(getInquiries());
    setStaffList(getStaffRegistry());
    setStats(getDailyWalkinStats());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-inquiries-changed', loadData);
    window.addEventListener('ilas-staff-changed', loadData);
    return () => {
      window.removeEventListener('ilas-inquiries-changed', loadData);
      window.removeEventListener('ilas-staff-changed', loadData);
    };
  }, []);

  // Multi-dimensional Filter
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tokenNumber && item.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'All' || item.category === deptFilter || item.department === deptFilter;
    const matchesMode = modeFilter === 'All' || item.type === modeFilter;
    
    const matchesStaff = 
      staffFilter === 'All' ||
      (staffFilter === 'Unassigned' && !item.assignedStaffId) ||
      item.assignedStaffId === staffFilter ||
      item.assignedStaffName === staffFilter;

    const matchesFollowUp = 
      followUpFilter === 'All' || 
      item.followUpStatus === followUpFilter;

    const matchesPayment = 
      paymentFilter === 'All' || 
      item.paymentStatus === paymentFilter;

    return matchesSearch && matchesDept && matchesMode && matchesStaff && matchesFollowUp && matchesPayment;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete inquiry record for ${name}?`)) {
      deleteInquiry(id);
    }
  };

  const handleAssignStaff = (inquiryId: string, staffId: string) => {
    const staff = staffList.find(s => s.id === staffId);
    if (staff) {
      assignStaffToInquiry(inquiryId, staffId, staff.name);
    }
  };

  const handlePaymentChange = (inquiryId: string, status: Inquiry['paymentStatus']) => {
    updateInquiryStatus(inquiryId, status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Live Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full border border-brand-400/30">
              Central Front-Office Hub
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              {inquiries.length} Active Records
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Master Inquiries & Intake Dashboard</h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Unified global operations command center managing all walk-in visitors, online web funnel leads, counselor allocations, 3-day follow-up SLA alerts, and multi-department case workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowReportsModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <FileText className="w-4 h-4 text-brand-400" />
            <span>Operations & Follow-up Report</span>
          </button>

          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Client / Candidate</span>
          </button>
        </div>
      </div>

      {/* 2. Operations KPI Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Active Inquiries</span>
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{inquiries.length} Clients</div>
          <div className="text-[11px] text-slate-500 font-medium">Education, Visa, Study Abroad & Jobs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Walk-in Campus Footfall</span>
            <Ticket className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.totalWalkins} Walk-ins</div>
          <div className="text-[11px] text-slate-500 font-medium">{stats.convertedPaid} Enrolled on spot</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">3-Day Follow-ups Due</span>
            <Calendar className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{stats.dueFollowupsCount} Due / Overdue</div>
          <div className="text-[11px] text-slate-500 font-medium">Critical counselor callback queue</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Visa Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.activeVisaCases} In Pipeline</div>
          <div className="text-[11px] text-slate-500 font-medium">APS & blocked accounts processing</div>
        </div>
      </div>

      {/* 3. Multi-Dimensional Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Top Search & View Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by token, candidate name, phone, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Table Grid View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                viewMode === 'kanban' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          
          {/* Department Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Education">🎓 Education & Training</option>
              <option value="Visa">🛂 Visa & Legal</option>
              <option value="Study Abroad">🏛️ Study Abroad</option>
              <option value="Jobs">💼 Job & Career</option>
              <option value="Work While You Study">⚙️ Work While You Study</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Channel / Mode</label>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Channels</option>
              <option value="Walk-in">🚶 Walk-in Reception</option>
              <option value="Online">🌐 Online Web Funnel</option>
              <option value="Phone">📞 Inbound Phone</option>
              <option value="Referral">🤝 Partner Referral</option>
            </select>
          </div>

          {/* Staff Allocation Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Assigned Counselor</label>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Staff Members</option>
              <option value="Unassigned">⚠️ Unassigned</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3-Day Follow-up Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">3-Day Follow-up</label>
            <select
              value={followUpFilter}
              onChange={(e) => setFollowUpFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Follow-up States</option>
              <option value="Due Today">🔥 Due Today</option>
              <option value="Overdue">🚨 Overdue</option>
              <option value="Scheduled">📅 Scheduled</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Payments</option>
              <option value="Paid">✅ Paid in Full</option>
              <option value="Partially Paid">⏳ Partially Paid</option>
              <option value="Pending">⚠️ Pending Payment</option>
              <option value="Contacted">📞 Contacted (No Fee)</option>
              <option value="Link Sent">🔗 Link Sent</option>
            </select>
          </div>

        </div>
      </div>

      {/* 4. Main Data View (Table or Kanban) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-slate-900">All Registered Inquiries & Intake Files ({filteredInquiries.length})</h3>
              <p className="text-xs text-slate-500">Live operational database with counseling notes and direct department routing</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-100 tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Token / Mode</th>
                  <th className="p-3.5">Candidate Details</th>
                  <th className="p-3.5">Department & Program</th>
                  <th className="p-3.5">Assigned Counselor</th>
                  <th className="p-3.5">Intake Notes</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">3-Day SLA</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                      No client inquiry records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Token & Mode */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          inq.type === 'Walk-in' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                        }`}>
                          {inq.type || 'Online'}
                        </span>
                        <div className="font-mono font-bold text-[10px] text-slate-500 mt-1">
                          {inq.tokenNumber || `ILA-GEN-${inq.id.slice(0, 3)}`}
                        </div>
                      </td>

                      {/* Candidate */}
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{inq.name}</div>
                        <div className="text-[11px] text-slate-500">{inq.phone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{inq.email}</div>
                      </td>

                      {/* Department & Program */}
                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 bg-brand-50 text-brand-800 rounded font-black text-[10px] uppercase mb-1">
                          {inq.category || inq.department || 'Education'}
                        </span>
                        <div className="font-bold text-slate-800 truncate max-w-[180px]" title={inq.course}>
                          {inq.course}
                        </div>
                      </td>

                      {/* Counselor Assignment */}
                      <td className="p-3.5">
                        <select
                          value={inq.assignedStaffId || ''}
                          onChange={(e) => handleAssignStaff(inq.id, e.target.value)}
                          className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[11px] text-slate-800 outline-none cursor-pointer max-w-[140px]"
                        >
                          <option value="">+ Assign Staff</option>
                          {staffList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Notes */}
                      <td className="p-3.5 max-w-[160px]">
                        <p className="text-slate-600 truncate text-[11px]" title={inq.intakeNotes}>
                          {inq.intakeNotes || 'Standard intake consultation'}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="p-3.5">
                        <select
                          value={inq.paymentStatus}
                          onChange={(e) => handlePaymentChange(inq.id, e.target.value as Inquiry['paymentStatus'])}
                          className={`p-1.5 rounded-lg font-black text-[10px] border outline-none cursor-pointer ${
                            inq.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : inq.paymentStatus === 'Partially Paid'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="Paid">✅ Paid</option>
                          <option value="Partially Paid">⏳ Partial</option>
                          <option value="Pending">⚠️ Pending</option>
                          <option value="Contacted">📞 Contacted</option>
                          <option value="Link Sent">🔗 Link Sent</option>
                        </select>
                        <div className="text-[10px] text-slate-400 mt-0.5">{inq.price}</div>
                      </td>

                      {/* 3-Day Follow-up */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          inq.followUpStatus === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : inq.followUpStatus === 'Due Today'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {inq.followUpStatus || 'Scheduled'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {inq.followUpDate || 'In 3 days'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20ILA%20Global%20Consulting%20regarding%20your%20file.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer transition-colors"
                            title="WhatsApp Client"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
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
                              title="Route to Department View"
                            >
                              <span>Route</span>
                              <ArrowUpRight className="w-3 h-3 text-brand-400" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(inq.id, inq.name)}
                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid md:grid-cols-4 gap-4">
          {['Pending', 'Contacted', 'Partially Paid', 'Paid'].map((stg) => {
            const list = filteredInquiries.filter(i => (i.paymentStatus || 'Pending') === stg);
            return (
              <div key={stg} className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center font-black text-xs text-slate-800 pb-2 border-b">
                  <span>{stg}</span>
                  <span className="px-2 py-0.5 bg-white border rounded-full text-[10px] text-slate-500 font-bold">{list.length}</span>
                </div>
                <div className="space-y-2.5">
                  {list.map((inq) => (
                    <div key={inq.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div className="font-extrabold text-slate-900">{inq.name}</div>
                        <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                          {inq.tokenNumber || 'ILA-GEN'}
                        </span>
                      </div>
                      <div className="text-[11px] text-brand-700 font-bold">{inq.course}</div>
                      <div className="text-[10px] text-slate-500">Counselor: {inq.assignedStaffName || 'Unassigned'}</div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                        <span className="font-bold text-slate-700">{inq.price}</span>
                        <span className="text-slate-400">{inq.followUpStatus || 'Scheduled'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Intake Modal */}
      <ClientIntakeModal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        onNavigateDepartment={onNavigateDepartment}
      />

      {/* Reports Modal */}
      <DailyFollowupReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

    </div>
  );
}

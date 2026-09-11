import { useState, useEffect } from 'react';
import { 
  UserPlus, Users, Clock, CheckCircle2, 
  Search, Eye, Plus, ArrowUpRight,
  Ticket, Building2
} from 'lucide-react';
import { getInquiries, updateInquiryStatus, Inquiry } from '../../../lib/db';
import ClientIntakeModal from './ClientIntakeModal';

interface WalkinIntakeDeskProps {
  onNavigateDepartment?: (deptTab: string) => void;
}

export default function WalkinIntakeDesk({ onNavigateDepartment }: WalkinIntakeDeskProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<Inquiry | null>(null);

  const loadWalkins = () => {
    const all = getInquiries();
    setInquiries(all.filter(i => i.type === 'Walk-in'));
  };

  useEffect(() => {
    loadWalkins();
    window.addEventListener('ilas-inquiries-changed', loadWalkins);
    return () => window.removeEventListener('ilas-inquiries-changed', loadWalkins);
  }, []);

  const filteredWalkins = inquiries.filter(item => {
    const matchesDept = selectedDeptFilter === 'All' || item.category === selectedDeptFilter || item.department === selectedDeptFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tokenNumber && item.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalWalkins = inquiries.length;
  const paidWalkins = inquiries.filter(i => i.paymentStatus === 'Paid').length;
  const inConsultation = inquiries.filter(i => i.crmStatus === 'In Progress' || i.paymentStatus === 'Contacted').length;
  const conversionRate = totalWalkins > 0 ? Math.round((paidWalkins / totalWalkins) * 100) : 0;

  const handleUpdatePayment = (id: string, status: Inquiry['paymentStatus']) => {
    updateInquiryStatus(id, status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Live Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full border border-brand-400/30 backdrop-blur-xs flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5" /> Front-Office Reception Terminal
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Desk Active
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">On-Premise Walk-in Intake & Reception</h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Register visiting candidates, generate entrance tokens, record voice counseling summaries, and route applicant files across Education, Visa, Study Abroad, and Careers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Walk-in Intake</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Front-Desk Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Campus Footfall</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalWalkins} Visitors</div>
          <div className="text-[11px] text-slate-500 font-medium">Logged today & active in pipeline</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">In Counseling Session</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{inConsultation} Active</div>
          <div className="text-[11px] text-slate-500 font-medium">Currently with faculty / counselors</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Spot Conversions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{paidWalkins} Enrolled</div>
          <div className="text-[11px] text-slate-500 font-medium">Full / partial tuition collected</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Reception Conversion</span>
            <Ticket className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{conversionRate}%</div>
          <div className="text-[11px] text-slate-500 font-medium">Walk-in intake to admission ratio</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by token (e.g. ILA-WALK-101), name, phone, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        {/* Department Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'Education', 'Visa', 'Study Abroad', 'Jobs', 'Work While You Study'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDeptFilter === dept
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Walk-in Queue / Candidate Data Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-slate-900">Today's Walk-in Reception Queue ({filteredWalkins.length})</h3>
            <p className="text-xs text-slate-500">Live check-in records, token numbers, and consultant allocation</p>
          </div>
          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Quick Add
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-100 tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Token #</th>
                <th className="p-3.5">Candidate Name</th>
                <th className="p-3.5">Department & Service</th>
                <th className="p-3.5">Assigned Counselor</th>
                <th className="p-3.5">Visitor Notes</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5">3-Day Follow-up</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWalkins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                    No walk-in intake records matching your current filter.
                  </td>
                </tr>
              ) : (
                filteredWalkins.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Token */}
                    <td className="p-3.5">
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
                        {inq.tokenNumber || `ILA-WALK-${inq.id.slice(0, 3)}`}
                      </span>
                    </td>

                    {/* Candidate */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">{inq.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{inq.phone}</span>
                        {inq.visitorDetails?.accompaniedBy ? (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                            +{inq.visitorDetails.accompaniedBy} Guests
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Department & Program */}
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 bg-brand-50 text-brand-800 rounded font-black text-[10px] uppercase mb-1">
                        {inq.category || inq.department || 'Education'}
                      </span>
                      <div className="font-bold text-slate-800 truncate max-w-[200px]" title={inq.course}>
                        {inq.course}
                      </div>
                    </td>

                    {/* Assigned Counselor */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{inq.assignedStaffName || 'Unassigned Queue'}</div>
                      <div className="text-[10px] text-slate-400">Front-desk Allocated</div>
                    </td>

                    {/* Notes */}
                    <td className="p-3.5 max-w-[180px]">
                      <p className="text-slate-600 truncate text-[11px]" title={inq.intakeNotes}>
                        {inq.intakeNotes || 'Standard walk-in counseling recorded.'}
                      </p>
                    </td>

                    {/* Payment Status */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                          inq.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : inq.paymentStatus === 'Partially Paid'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {inq.paymentStatus || 'Pending'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                        {inq.amountPaid ? `${inq.amountPaid} of ${inq.totalAmount || inq.price}` : inq.price}
                      </div>
                    </td>

                    {/* 3-Day Follow-up */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                        <button
                          onClick={() => setSelectedInquiryDetail(inq)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                          title="View Full File & Follow-up History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
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
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Route to Department View"
                          >
                            <span>Open</span>
                            <ArrowUpRight className="w-3 h-3 text-brand-400" />
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

      {/* Detail Slideout / Modal */}
      {selectedInquiryDetail && (
        <div className="fixed inset-0 z-[130] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Token: {selectedInquiryDetail.tokenNumber || 'ILA-WALK'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedInquiryDetail.name}</h3>
                <div className="text-xs text-slate-500">{selectedInquiryDetail.email} • {selectedInquiryDetail.phone}</div>
              </div>
              <button onClick={() => setSelectedInquiryDetail(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Department & Service</div>
                <div className="font-extrabold text-slate-900">{selectedInquiryDetail.category} — {selectedInquiryDetail.course}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Consultation Intake Notes</div>
                <p className="text-slate-700 leading-relaxed">{selectedInquiryDetail.intakeNotes || 'None recorded'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <div className="font-bold text-slate-400 uppercase text-[10px]">Assigned Front-Desk Counselor</div>
                <div className="font-bold text-slate-900">{selectedInquiryDetail.assignedStaffName || 'Unassigned'}</div>
              </div>

              {selectedInquiryDetail.followUpHistory && selectedInquiryDetail.followUpHistory.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Touchpoint History</div>
                  {selectedInquiryDetail.followUpHistory.map((fl) => (
                    <div key={fl.id} className="p-2.5 bg-slate-100 rounded-xl text-[11px]">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{fl.channel} with {fl.staffName}</span>
                        <span className="text-brand-600">{fl.outcome}</span>
                      </div>
                      <div className="text-slate-600 mt-1">{fl.notes}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => {
                    handleUpdatePayment(selectedInquiryDetail.id, 'Paid');
                    setSelectedInquiryDetail({ ...selectedInquiryDetail, paymentStatus: 'Paid' });
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => setSelectedInquiryDetail(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Client Intake Modal */}
      <ClientIntakeModal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        defaultType="Walk-in"
        onNavigateDepartment={onNavigateDepartment}
      />

    </div>
  );
}

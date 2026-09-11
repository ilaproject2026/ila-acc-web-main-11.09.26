import { useState, useEffect } from 'react';
import { 
  X, Calendar, CheckCircle2, 
  MessageSquare, FileText, Printer,
  Ticket, Briefcase, GraduationCap, Plane
} from 'lucide-react';
import { getInquiries, addFollowUpRecord, Inquiry, FollowUpRecord } from '../../../lib/db';

interface DailyFollowupReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyFollowupReportsModal({ isOpen, onClose }: DailyFollowupReportsModalProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'walkin' | 'followups' | 'payments' | 'visa'>('walkin');

  // Follow-up logger state
  const [selectedInquiryForLog, setSelectedInquiryForLog] = useState<Inquiry | null>(null);
  const [logChannel, setLogChannel] = useState<FollowUpRecord['channel']>('Phone Call');
  const [logNotes, setLogNotes] = useState('');
  const [logOutcome, setLogOutcome] = useState<FollowUpRecord['outcome']>('Interested - Callback');
  const [nextDate, setNextDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);

  const loadData = () => {
    setInquiries(getInquiries());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const walkins = inquiries.filter(i => i.type === 'Walk-in');
  const online = inquiries.filter(i => i.type === 'Online');
  const dueFollowups = inquiries.filter(i => i.followUpStatus === 'Due Today' || i.followUpStatus === 'Overdue');
  const overdueFollowups = inquiries.filter(i => i.followUpStatus === 'Overdue');
  const paidCount = inquiries.filter(i => i.paymentStatus === 'Paid').length;
  const partialCount = inquiries.filter(i => i.paymentStatus === 'Partially Paid').length;
  const pendingCount = inquiries.filter(i => i.paymentStatus === 'Pending').length;

  const visaCases = inquiries.filter(i => i.category === 'Visa');

  const handleSaveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryForLog || !logNotes) return;

    addFollowUpRecord(selectedInquiryForLog.id, {
      staffName: selectedInquiryForLog.assignedStaffName || 'Front Desk Staff',
      channel: logChannel,
      notes: logNotes,
      outcome: logOutcome,
      nextFollowUpDate: nextDate
    });

    setLogNotes('');
    setSelectedInquiryForLog(null);
    loadData();
    alert('Follow-up touchpoint recorded successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[140] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-md">
              <FileText className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Front-Office Operations Intelligence
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Daily Operations & Follow-up Tracking Report</h2>
              <p className="text-xs text-slate-500">Walk-in footfall analysis, 3-day follow-up touchpoint tracker, and fee reconciliations.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
              title="Print Summary Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <button
            onClick={() => setActiveTab('walkin')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'walkin' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Daily Walk-in Report ({walkins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('followups')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'followups' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3-Day Follow-ups Due ({dueFollowups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Payment Reconciliation ({paidCount} Paid)</span>
          </button>

          <button
            onClick={() => setActiveTab('visa')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'visa' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Visa Milestones ({visaCases.length})</span>
          </button>
        </div>

        {/* Tab 1: Daily Walk-in Report */}
        {activeTab === 'walkin' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-50 border rounded-2xl">
                <div className="text-[10px] font-black uppercase text-slate-400">Total Campus Footfall</div>
                <div className="text-xl font-black text-slate-900 mt-1">{walkins.length} Visitors</div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="text-[10px] font-black uppercase text-emerald-700">Enrolled On-Spot</div>
                <div className="text-xl font-black text-emerald-800 mt-1">{walkins.filter(w => w.paymentStatus === 'Paid').length} Enrolled</div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="text-[10px] font-black uppercase text-amber-700">Partially Paid / Deposit</div>
                <div className="text-xl font-black text-amber-800 mt-1">{walkins.filter(w => w.paymentStatus === 'Partially Paid').length} Deposits</div>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="text-[10px] font-black uppercase text-indigo-700">Conversion Rate</div>
                <div className="text-xl font-black text-indigo-900 mt-1">
                  {walkins.length > 0 ? Math.round((walkins.filter(w => w.paymentStatus === 'Paid').length / walkins.length) * 100) : 0}%
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b font-bold text-slate-700">Walk-in Reception Visitor Log</div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-black border-b text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Token</th>
                    <th className="p-3">Visitor Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Check-in Time</th>
                    <th className="p-3">Counselor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {walkins.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold">{w.tokenNumber || 'ILA-WALK'}</td>
                      <td className="p-3 font-bold text-slate-900">{w.name}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-bold">{w.category}</span></td>
                      <td className="p-3 text-slate-500">{w.visitorDetails?.checkInTime || '09:30 AM'}</td>
                      <td className="p-3 text-slate-700">{w.assignedStaffName || 'Unassigned'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                          {w.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: 3-Day Follow-ups Due */}
        {activeTab === 'followups' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            {overdueFollowups.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <span className="text-red-700 font-black text-sm">⚠️ {overdueFollowups.length} Overdue Touchpoints!</span>
                <span className="text-red-600">Candidates awaiting callback over 3 days since initial consultation.</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-black border-b text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Phone / Contact</th>
                    <th className="p-3">Target Program</th>
                    <th className="p-3">Assigned Counselor</th>
                    <th className="p-3">Touchpoint Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{inq.name}</td>
                      <td className="p-3 text-slate-500">{inq.phone}</td>
                      <td className="p-3 font-medium text-slate-800">{inq.course}</td>
                      <td className="p-3 font-bold text-slate-700">{inq.assignedStaffName || 'Unassigned'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          inq.followUpStatus === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : inq.followUpStatus === 'Due Today'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inq.followUpStatus || 'Scheduled'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedInquiryForLog(inq)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          + Log Call
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Follow-up Touchpoint Form */}
            {selectedInquiryForLog && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-indigo-950">Record Follow-up Call: {selectedInquiryForLog.name}</h4>
                  <button onClick={() => setSelectedInquiryForLog(null)} className="text-indigo-600 font-bold">Cancel</button>
                </div>
                <form onSubmit={handleSaveFollowup} className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Contact Channel</label>
                    <select
                      value={logChannel}
                      onChange={(e) => setLogChannel(e.target.value as FollowUpRecord['channel'])}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg"
                    >
                      <option value="Phone Call">📞 Phone Call</option>
                      <option value="WhatsApp">💬 WhatsApp Message</option>
                      <option value="In-Person">🚶 In-Person Visit</option>
                      <option value="Email">✉️ Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Touchpoint Outcome</label>
                    <select
                      value={logOutcome}
                      onChange={(e) => setLogOutcome(e.target.value as FollowUpRecord['outcome'])}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg"
                    >
                      <option value="Interested - Callback">Interested (Call again)</option>
                      <option value="Docs Pending">Awaiting Documents</option>
                      <option value="Fee Paid">Fee Paid / Enrolled</option>
                      <option value="Appointment Booked">Office Appointment</option>
                      <option value="Not Interested">Closed / Not Interested</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Next Follow-up Date</label>
                    <input
                      type="date"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      required
                      placeholder="Enter call discussion summary and student remarks..."
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg cursor-pointer">
                      Save Log
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="text-[10px] font-black uppercase text-emerald-700">Fully Paid Admissions</div>
                <div className="text-2xl font-black text-emerald-900 mt-1">{paidCount} Candidates</div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="text-[10px] font-black uppercase text-amber-700">Partial Deposits Collected</div>
                <div className="text-2xl font-black text-amber-900 mt-1">{partialCount} Candidates</div>
              </div>
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
                <div className="text-[10px] font-black uppercase text-slate-500">Pending Balances</div>
                <div className="text-2xl font-black text-slate-800 mt-1">{pendingCount} Accounts</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Visa Processing Milestones */}
        {activeTab === 'visa' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="grid sm:grid-cols-3 gap-3">
              {['Profile Assessment', 'APS Certificate', 'Blocked Account', 'Embassy Appointment', 'Visa Approved'].map((stg) => {
                const count = visaCases.filter(v => v.visaProcessingStage === stg).length;
                return (
                  <div key={stg} className="p-4 bg-slate-50 border rounded-2xl space-y-1">
                    <div className="text-[10px] font-black uppercase text-slate-400">{stg}</div>
                    <div className="text-xl font-black text-slate-900">{count} Cases</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}

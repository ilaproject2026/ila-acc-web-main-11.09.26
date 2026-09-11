import { useState, useEffect } from 'react';
import { 
  UserPlus, CheckCircle2, 
  MessageSquare, FileText, ArrowRight,
  ShieldCheck, AlertCircle, Sparkles
} from 'lucide-react';
import { getInquiries, updateInquiryStatus, updateInquiryVisaStage, assignStaffToInquiry, getStaffRegistry, Inquiry, StaffUser } from '../../../lib/db';
import ClientIntakeModal from './ClientIntakeModal';

interface DepartmentInquiryViewProps {
  departmentName: 'Education' | 'Visa' | 'Study Abroad' | 'Jobs' | 'Work While You Study';
  title?: string;
  subtitle?: string;
}

const DEPARTMENT_STAGES: Record<string, string[]> = {
  'Visa': [
    'Profile Assessment',
    'APS Certificate',
    'Blocked Account',
    'Embassy Appointment',
    'Visa Approved'
  ],
  'Study Abroad': [
    'Profile Assessment',
    'University Selection',
    'Application Dispatched',
    'Offer Letter Received',
    'Enrolled'
  ],
  'Education': [
    'Intake Assessment',
    'Batch Allocation',
    'Class Pass Issued',
    'Active in Class',
    'Certified'
  ],
  'Jobs': [
    'Europass CV Prepared',
    'Technical Screening',
    'Employer Interview',
    'Contract Offered',
    'Relocated & Active'
  ],
  'Work While You Study': [
    'Dual Candidate Intake',
    'Employer Matchmaking',
    'Ausbildung Contract',
    'Visa & Stipend Sync',
    'Onboarded'
  ]
};

export default function DepartmentInquiryView({ 
  departmentName, 
  title, 
  subtitle 
}: DepartmentInquiryViewProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    const all = getInquiries();
    setInquiries(all.filter(i => i.category === departmentName || i.department === departmentName));
    setStaffList(getStaffRegistry());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-inquiries-changed', loadData);
    return () => window.removeEventListener('ilas-inquiries-changed', loadData);
  }, [departmentName]);

  const stages = DEPARTMENT_STAGES[departmentName] || ['Intake', 'Assessment', 'Processing', 'Completed'];

  const filteredInquiries = inquiries.filter(item => {
    const matchesStage = 
      activeStageFilter === 'All' || 
      item.visaProcessingStage === activeStageFilter ||
      item.pipelineStage === activeStageFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleStageUpdate = (id: string, stage: string) => {
    if (departmentName === 'Visa') {
      updateInquiryVisaStage(id, stage as Inquiry['visaProcessingStage']);
    } else {
      updateInquiryStatus(id, stage === 'Completed' || stage === 'Enrolled' || stage === 'Certified' ? 'Paid' : 'Contacted');
    }
  };

  const handleStaffAssign = (inquiryId: string, staffId: string) => {
    const staff = staffList.find(s => s.id === staffId);
    if (staff) {
      assignStaffToInquiry(inquiryId, staffId, staff.name);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200">
              Department Candidate Desk
            </span>
            <span className="text-xs text-slate-500 font-bold">
              {inquiries.length} Active Applicants
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            {title || `${departmentName} Applicant & Inquiry Management`}
          </h3>
          <p className="text-xs text-slate-500">
            {subtitle || `Track walk-in visitors, online applicants, stage milestones, and staff allocations for ${departmentName}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIntakeModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add {departmentName} Client</span>
          </button>
        </div>
      </div>

      {/* Department Stages Pipeline Selector */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">Pipeline Filter:</span>
        <button
          onClick={() => setActiveStageFilter('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStageFilter === 'All'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Stages ({inquiries.length})
        </button>
        {stages.map((stg) => {
          const count = inquiries.filter(i => i.visaProcessingStage === stg || i.pipelineStage === stg).length;
          return (
            <button
              key={stg}
              onClick={() => setActiveStageFilter(stg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStageFilter === stg
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{stg}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeStageFilter === stg ? 'bg-brand-800 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Candidate Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-100 tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Candidate Details</th>
                <th className="p-3.5">Program / Pathway</th>
                <th className="p-3.5">Mode & Token</th>
                <th className="p-3.5">Assigned Counselor</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Stage Progression</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                    No active {departmentName} applicants in this stage.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Candidate */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">{inq.name}</div>
                      <div className="text-[11px] text-slate-500">{inq.phone}</div>
                      <div className="text-[10px] text-slate-400">{inq.email}</div>
                    </td>

                    {/* Program */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 max-w-[200px] truncate" title={inq.course}>
                        {inq.course}
                      </div>
                      <div className="text-[10px] text-slate-500">{inq.path || departmentName}</div>
                    </td>

                    {/* Mode & Token */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        inq.type === 'Walk-in' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                      }`}>
                        {inq.type || 'Online'}
                      </span>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {inq.tokenNumber || 'NO-TOKEN'}
                      </div>
                    </td>

                    {/* Assigned Counselor */}
                    <td className="p-3.5">
                      <select
                        value={inq.assignedStaffId || ''}
                        onChange={(e) => handleStaffAssign(inq.id, e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[11px] text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="">+ Assign Staff</option>
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Current Stage */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-brand-50 text-brand-800 border border-brand-200 rounded-lg text-[10px] font-black block w-fit">
                        {inq.visaProcessingStage && inq.visaProcessingStage !== 'Not Applicable' 
                          ? inq.visaProcessingStage 
                          : inq.pipelineStage || 'In Review'}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        inq.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inq.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {inq.paymentStatus || 'Pending'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{inq.price}</div>
                    </td>

                    {/* Stage Progression Buttons */}
                    <td className="p-3.5 text-right">
                      <select
                        value={inq.visaProcessingStage || stages[0]}
                        onChange={(e) => handleStageUpdate(inq.id, e.target.value)}
                        className="p-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] outline-none cursor-pointer"
                      >
                        {stages.map((stg) => (
                          <option key={stg} value={stg}>
                            → {stg}
                          </option>
                        ))}
                      </select>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <ClientIntakeModal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        defaultDepartment={departmentName}
      />

    </div>
  );
}

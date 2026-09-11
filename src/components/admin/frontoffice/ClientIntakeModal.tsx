import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, UserPlus, Sparkles, 
  User, FileText, ArrowRight
} from 'lucide-react';
import { saveInquiry, getStaffRegistry, StaffUser, Inquiry } from '../../../lib/db';

interface ClientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDepartment?: string;
  defaultType?: 'Walk-in' | 'Online';
  onNavigateDepartment?: (deptTab: string) => void;
}

const DEPARTMENT_SERVICES: Record<string, string[]> = {
  'Education': [
    'German Language A1–C2 (Intelli-Coach)',
    'Medical German & FSP Preparation',
    'IELTS / TOEFL / PTE Fast-Track',
    'Full-Stack Software Engineering (React/Node)',
    'SAP S/4HANA Enterprise Architecture',
    'Python & AI Engineering'
  ],
  'Visa': [
    'German Opportunity Card (Chancenkarte)',
    'German Student Visa & Blocked Account (€11,900)',
    'Job Seeker / Blue Card Visa Support',
    'APS Certificate Direct Audit',
    'Family Reunion & Dependent Visa',
    'Schengen Multi-Entry Business Visa'
  ],
  'Study Abroad': [
    'TU Munich / Public University Zero-Tuition Master',
    'German Bachelor Degree Track (Studienkolleg)',
    'Medical & Healthcare University Direct Placement',
    'European Business & Management Masters',
    'End-to-End APS + University Dossier Filing'
  ],
  'Jobs': [
    'Healthcare Nursing Placement (German Hospitals)',
    'Cloud & DevOps European Corporate Match',
    'Automotive & Mechanical Engineer Direct Hire',
    'Europass CV Localization & HR Interview Simulation',
    'Fast-Track Blue Card Sponsorship Match'
  ],
  'Work While You Study': [
    'Dual Ausbildung (Mechatronics / IT - €1,200/mo)',
    'Dual Ausbildung (Nursing & Healthcare)',
    'Corporate Work-Study Syndicate (Part-time + Stipend)',
    'Hotel & Hospitality Dual Apprenticeship'
  ]
};

const DEPARTMENT_TAB_MAPPING: Record<string, string> = {
  'Education': 'education',
  'Visa': 'visa',
  'Study Abroad': 'study_abroad',
  'Jobs': 'jobs',
  'Work While You Study': 'work_while_you_study'
};

export default function ClientIntakeModal({
  isOpen,
  onClose,
  defaultDepartment = 'Education',
  defaultType = 'Walk-in',
  onNavigateDepartment
}: ClientIntakeModalProps) {
  const [intakeType, setIntakeType] = useState<'Walk-in' | 'Online'>(defaultType);
  const [department, setDepartment] = useState<string>(defaultDepartment);
  const [service, setService] = useState<string>('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Walk-in Visitor Info
  const [visitorPurpose, setVisitorPurpose] = useState('Course Enrollment & Consultation');
  const [accompaniedBy, setAccompaniedBy] = useState(0);
  const [idProofVerified, setIdProofVerified] = useState(true);
  const [receptionistName] = useState('Meera Kapoor (Front Desk)');

  // Staff Assignment
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [assignedStaffName, setAssignedStaffName] = useState('');

  // Voice & Text Intake Notes
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Financials & Follow-up
  const [totalAmount, setTotalAmount] = useState('$199.00');
  const [amountPaid] = useState('$199.00');
  const [paymentStatus, setPaymentStatus] = useState<Inquiry['paymentStatus']>('Paid');
  const [routeImmediately, setRouteImmediately] = useState(true);
  
  // Follow-up Date (Defaults to 3 days from now)
  const defaultFollowUp = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const [followUpDate, setFollowUpDate] = useState(defaultFollowUp);

  const [tokenNumber, setTokenNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      const staff = getStaffRegistry();
      setStaffList(staff);
      
      const randomNum = Math.floor(100 + Math.random() * 900);
      const prefix = intakeType === 'Walk-in' ? 'ILA-WALK' : 'ILA-WEB';
      setTokenNumber(`${prefix}-${randomNum}`);
      
      setDepartment(defaultDepartment);
      setIntakeType(defaultType);
      
      const defaultServices = DEPARTMENT_SERVICES[defaultDepartment] || DEPARTMENT_SERVICES['Education'];
      setService(defaultServices[0]);

      // Assign default staff counselor
      if (staff.length > 0) {
        const matchingStaff = staff.find(s => s.department === defaultDepartment) || staff[0];
        setAssignedStaffId(matchingStaff.id);
        setAssignedStaffName(matchingStaff.name);
      }
    }
  }, [isOpen, defaultDepartment, defaultType, intakeType]);

  // Update services when department changes
  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    const services = DEPARTMENT_SERVICES[dept] || [];
    setService(services[0] || '');
    
    // Auto-select staff from that dept if available
    const matched = staffList.find(s => s.department.toLowerCase().includes(dept.toLowerCase().slice(0, 4)));
    if (matched) {
      setAssignedStaffId(matched.id);
      setAssignedStaffName(matched.name);
    }
  };

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setNotes(prev => {
          const cleanPrev = prev.trim();
          return cleanPrev ? `${cleanPrev} ${transcript}` : transcript;
        });
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setVoiceSupported(false);
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!voiceSupported) {
      alert('Speech Recognition is not supported in this browser. Please type the notes manually.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleStaffSelect = (staffId: string) => {
    setAssignedStaffId(staffId);
    const found = staffList.find(s => s.id === staffId);
    setAssignedStaffName(found ? found.name : '');
  };

  const insertQuickNote = (template: string) => {
    setNotes(prev => prev ? `${prev} | ${template}` : template);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please provide at least the client name and phone number.');
      return;
    }

    const calculatedCategory = department as Inquiry['category'];
    const visaStage = department === 'Visa' ? 'Profile Assessment' : 'Not Applicable';

    const newInquiry: Omit<Inquiry, 'id' | 'timestamp'> = {
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@candidate.ilas`,
      phone,
      type: intakeType,
      tokenNumber,
      course: service,
      path: `${department} - Front Office Registry`,
      price: totalAmount,
      amountPaid: paymentStatus === 'Paid' ? totalAmount : amountPaid,
      totalAmount,
      paymentStatus,
      category: calculatedCategory,
      department,
      source: intakeType === 'Walk-in' ? 'On-Premise Walk-in Reception' : 'Online Lead Funnel',
      crmStatus: paymentStatus === 'Paid' ? 'Closed Won' : 'In Progress',
      pipelineStage: 'Intake',
      assignedStaffId,
      assignedStaffName,
      intakeNotes: notes || `Registered via ${intakeType} intake console.`,
      visitorDetails: intakeType === 'Walk-in' ? {
        purpose: visitorPurpose,
        accompaniedBy,
        idProofVerified,
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        receptionistName
      } : undefined,
      followUpDate,
      followUpStatus: 'Scheduled',
      followUpHistory: [
        {
          id: `fl-init-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          staffName: assignedStaffName || 'Reception Officer',
          channel: intakeType === 'Walk-in' ? 'In-Person' : 'Email',
          notes: notes || `Initial ${intakeType} registration captured. Assigned to ${assignedStaffName || 'General Queue'}.`,
          outcome: paymentStatus === 'Paid' ? 'Fee Paid' : 'Docs Pending'
        }
      ],
      visaProcessingStage: visaStage
    };

    saveInquiry(newInquiry);

    // Reset & Close
    onClose();

    // Route to department page if requested
    if (routeImmediately && onNavigateDepartment) {
      const targetTab = DEPARTMENT_TAB_MAPPING[department] || 'all_inquiries';
      onNavigateDepartment(targetTab);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-md">
              <UserPlus className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Global Front-Office Desk
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Token: {tokenNumber}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Add New Client / Candidate</h2>
              <p className="text-xs text-slate-500">Cross-department intake, staff allocation, voice notes & instant routing.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* 1. Intake Type & Target Department */}
          <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                Intake Channel / Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIntakeType('Walk-in')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    intakeType === 'Walk-in'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🚶 On-Premise Walk-in
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeType('Online')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    intakeType === 'Online'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🌐 Online / Inbound
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                Target Department
              </label>
              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Education">🎓 Education & Training</option>
                <option value="Visa">🛂 Visa & Legal Services</option>
                <option value="Study Abroad">🏛️ Study Abroad & Admissions</option>
                <option value="Jobs">💼 Job & Career Placement</option>
                <option value="Work While You Study">⚙️ Work While You Study (Ausbildung)</option>
              </select>
            </div>
          </div>

          {/* 2. Candidate Personal Information */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-600" /> Candidate Profile Information
            </h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. anand@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Service Allocation & Staff Assignment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Requested Program / Service *</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
              >
                {(DEPARTMENT_SERVICES[department] || []).map((srv) => (
                  <option key={srv} value={srv}>{srv}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Allocate Staff / Counselor *</label>
              <select
                value={assignedStaffId}
                onChange={(e) => handleStaffSelect(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Walk-in Visitor Specific Metadata */}
          {intakeType === 'Walk-in' && (
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-amber-900 font-bold mb-1">Purpose of Campus Visit</label>
                <input
                  type="text"
                  value={visitorPurpose}
                  onChange={(e) => setVisitorPurpose(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-200 rounded-lg font-medium outline-none"
                />
              </div>
              <div>
                <label className="block text-amber-900 font-bold mb-1">Accompanying Persons</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={accompaniedBy}
                  onChange={(e) => setAccompaniedBy(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white border border-amber-200 rounded-lg font-medium outline-none"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                  <input
                    type="checkbox"
                    checked={idProofVerified}
                    onChange={(e) => setIdProofVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>ID Proof Verified (Aadhaar/Passport)</span>
                </label>
              </div>
            </div>
          )}

          {/* 5. Consultation Notes with Voice Dictation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" /> Walk-in Consultation Notes (Voice or Text)
              </label>
              
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                  isRecording 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-600" />}
                <span>{isRecording ? 'Listening... Stop' : 'Dictate with Voice'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Record counseling summary, candidate qualifications, academic scores, and next steps..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
            />

            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold self-center">Quick Snippets:</span>
              <button type="button" onClick={() => insertQuickNote('Enrolled on spot with full fees')} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-600 cursor-pointer">+ Enrolled on spot</button>
              <button type="button" onClick={() => insertQuickNote('Requires 3-day follow-up with father')} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-600 cursor-pointer">+ 3-Day callback</button>
              <button type="button" onClick={() => insertQuickNote('B1 certificate verified')} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-600 cursor-pointer">+ B1 Verified</button>
              <button type="button" onClick={() => insertQuickNote('Blocked account guidance provided')} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-600 cursor-pointer">+ Blocked Account</button>
            </div>
          </div>

          {/* 6. Payment, Follow-up & Routing Options */}
          <div className="grid sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Fee / Pricing</label>
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as Inquiry['paymentStatus'])}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
              >
                <option value="Paid">✅ Paid in Full</option>
                <option value="Partially Paid">⏳ Partially Paid (Deposit)</option>
                <option value="Pending">⚠️ Pending Payment</option>
                <option value="Contacted">📞 Contacted (No Fee)</option>
                <option value="Link Sent">🔗 Payment Link Sent</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">3-Day Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Routing Option Checkbox */}
          <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="font-bold text-indigo-950">Automated Pipeline Routing</div>
                <div className="text-[10px] text-indigo-700">Immediately switch workspace to <span className="font-black underline">{department}</span> page upon submission.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={routeImmediately}
              onChange={(e) => setRouteImmediately(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Save & Register Candidate</span>
              <ArrowRight className="w-4 h-4 text-brand-400" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

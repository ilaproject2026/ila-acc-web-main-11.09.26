import { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, Users, Video, Link2, Copy, Check, ExternalLink, ArrowRight, BrainCircuit } from 'lucide-react';
import { saveInquiry, setActiveStudent, getGlobalBatches, GlobalBatch } from '../../lib/db';
import { APP_BASE_URL } from '../../lib/config';

const COURSES = [
  'German Language A1–C2',
  'IELTS / TOEFL Proficiency',
  'PTE (Pearson Test of English)',
  'Software Engineering & Full Stack',
  'Digital Marketing & E-commerce',
  'Project Management (PMP / Agile)',
  'Client Relationship Management',
  'SAP S/4HANA (FI/CO, MM, SD)',
  'Cloud Architecture & DevOps',
  'Data Science & AI Engineering',
  'Financial Accounting (Tally, QuickBooks)',
  'UI/UX Design & Graphic Fundamentals',
  'Microsoft Excel Advanced',
  'Bookkeeping & Tally',
  'Python Basics',
  'Data Analytics Fundamentals',
  'Medical Terminology (FSP Prep)'
];

const PATHS = [
  { 
    id: 'Intelli-Coach AI Trainer™', 
    label: 'Intelli-Coach AI Trainer™', 
    isAi: true, 
    duration: '6 Months', 
    desc: 'Self-paced 24/7 AI doubt solving, dynamic syllabus pacing & simulated oral exams. No scheduled batches required.' 
  },
  { 
    id: 'Video + AI Training', 
    label: 'Video + AI Training', 
    isAi: true, 
    duration: '3 Months', 
    desc: 'Pre-recorded modules, high-definition lecture streams & AI assessment drills. Self-paced on-demand.' 
  },
  { 
    id: 'Human Training Live', 
    label: 'Human Training Live', 
    isAi: false, 
    duration: '4 Months', 
    desc: 'Interactive live cohorts and certified faculty mentorship. Requires batch slot allotment.' 
  }
];

const DEFAULT_BATCHES = [
  'Morning Cohort (09:00 AM – 11:00 AM IST)',
  'Afternoon Fast-Track (02:00 PM – 04:00 PM IST)',
  'Evening Professional (06:30 PM – 08:30 PM IST)',
  'Weekend Intensive (10:00 AM – 02:00 PM IST)'
];

interface RegistrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
}

export default function RegistrationFlow({ isOpen, onClose, selectedPackage }: RegistrationFlowProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Registration Form, 2 = Success with direct portal access (Payment Skipped)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: COURSES[0],
    path: PATHS[0].id,
    batch: 'Self-Paced AI (No Batch)'
  });

  const [availableBatches, setAvailableBatches] = useState<string[]>(DEFAULT_BATCHES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedClassLink, setGeneratedClassLink] = useState('');
  const [generatedVideoLink, setGeneratedVideoLink] = useState('');
  const [copiedLinkType, setCopiedLinkType] = useState<'vclass' | 'video' | null>(null);

  // Load available batches from global DB if present
  useEffect(() => {
    try {
      const dbBatches: GlobalBatch[] = getGlobalBatches();
      if (dbBatches && dbBatches.length > 0) {
        const batchNames = dbBatches.map(b => `${b.name} (${b.timings?.join(', ') || 'Scheduled'})`);
        setAvailableBatches([...batchNames, ...DEFAULT_BATCHES.filter(d => !batchNames.some(b => b.includes(d.split(' ')[0])))]);
      }
    } catch {
      // fallback to default
    }
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      const parts = selectedPackage.split(' - ');
      const matchedCourse = COURSES.find(c => c.toLowerCase().includes(parts[0].toLowerCase())) || COURSES[0];
      const matchedPath = PATHS.find(p => parts[1] && p.id.toLowerCase().includes(parts[1].toLowerCase()))?.id || PATHS[0].id;

      setFormData(prev => ({
        ...prev,
        course: matchedCourse,
        path: matchedPath,
        batch: matchedPath.includes('AI') ? 'Self-Paced AI (No Batch)' : DEFAULT_BATCHES[0]
      }));
    }
  }, [selectedPackage]);

  if (!isOpen) return null;

  const currentPathDetails = PATHS.find(p => p.id === formData.path) || PATHS[0];
  const isAiMethod = currentPathDetails.isAi;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'path') {
      const selectedP = PATHS.find(p => p.id === value);
      const isSelectedAi = selectedP?.isAi ?? false;
      setFormData(prev => ({
        ...prev,
        path: value,
        batch: isSelectedAi ? 'Self-Paced AI (No Batch)' : (availableBatches[0] || DEFAULT_BATCHES[0])
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDirectEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in your full name, email, and phone number.');
      return;
    }

    setIsProcessing(true);

    const category = formData.course.includes('German') || formData.course.includes('IELTS') ? 'Education' : 'Jobs';
    const courseSlug = formData.course.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const token = `ILAS-${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate VClass (Virtual Classroom link)
    const vclassUrl = isAiMethod
      ? `${APP_BASE_URL}/#student-portal`
      : `https://meet.google.com/ila-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

    // Generate Path Video link
    const videoUrl = `${APP_BASE_URL}/#student-portal?tab=materials&course=${courseSlug}`;

    setGeneratedClassLink(vclassUrl);
    setGeneratedVideoLink(videoUrl);

    try {
      saveInquiry({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        course: formData.course,
        path: formData.path,
        batch: isAiMethod ? 'Self-Paced AI (No Batch)' : formData.batch,
        price: 'Enrolled (Direct)',
        paymentStatus: 'Paid', // PAYMENT SECTION SKIPPED AS DIRECT LIVE ENROLLMENT
        category: category as any,
        tokenNumber: token,
        classLink: vclassUrl,
        videoLink: videoUrl,
        isAiMethod: isAiMethod,
        crmStatus: 'Closed Won',
        pipelineStage: 'Completed',
        source: 'Live Student Enrollment Desk'
      });

      // Set active student session for instant portal login
      setActiveStudent(formData.email.trim().toLowerCase());
      localStorage.setItem('ilas_auth_role', 'student');
      localStorage.setItem('ilas_user_name', formData.name.trim());
    } catch (err) {
      console.error('Error saving enrollment:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 600);
  };

  const copyToClipboard = (text: string, type: 'vclass' | 'video') => {
    navigator.clipboard.writeText(text);
    setCopiedLinkType(type);
    setTimeout(() => setCopiedLinkType(null), 2000);
  };

  const handleGoToStudentPortal = () => {
    onClose();
    window.location.hash = '#student-dashboard';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-6 border border-slate-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10 cursor-pointer" 
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Top Banner Notice */}
          <div className="mb-5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 border border-emerald-200/80 px-4 py-3 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs font-bold leading-tight">
              <span className="text-emerald-950 font-black">Direct Enrollment Active:</span> Payment section skipped. Instant access credentials &amp; classroom links will be assigned immediately.
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleDirectEnrollSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Enrollment Desk</h2>
                <p className="text-slate-500 text-xs mt-0.5">Register for your accredited program and receive instant portal &amp; classroom links.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-semibold" 
                    placeholder="e.g. Priya Sharma" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Phone / WhatsApp</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-semibold" 
                    placeholder="+91 98765 43210" 
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-semibold" 
                  placeholder="student@example.com" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Target Course Selection</label>
                <select 
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-bold bg-white text-slate-800 cursor-pointer"
                >
                  {COURSES.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Learning Path Selection with AI vs Cohort Logic */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Choose Learning Path &amp; Modality</label>
                <div className="grid gap-2.5">
                  {PATHS.map((pathOption) => {
                    const isSelected = formData.path === pathOption.id;
                    return (
                      <label 
                        key={pathOption.id}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                          isSelected 
                            ? 'border-brand-600 bg-brand-50/50 shadow-sm' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="path" 
                          value={pathOption.id} 
                          checked={isSelected}
                          onChange={handleInputChange}
                          className="mt-1 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                              {pathOption.isAi ? <BrainCircuit className="w-4 h-4 text-indigo-600" /> : <Users className="w-4 h-4 text-emerald-600" />}
                              {pathOption.label}
                            </span>
                            {pathOption.isAi ? (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                                24/7 AI (No Batches)
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                Live Cohort
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-1">{pathOption.desc}</p>
                          <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            Duration: {pathOption.duration}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Batch Selection: AI method has NO batches */}
              {isAiMethod ? (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center gap-3 text-indigo-900">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div className="text-xs font-semibold leading-relaxed">
                    <span className="font-bold block">AI Method Selected: No Batch Required</span>
                    Students on the Intelli-Coach AI &amp; Video path study on-demand 24/7 with instant interactive guidance. No batch scheduling is needed.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <label className="text-xs font-black uppercase tracking-wider text-emerald-900">
                      Allot Student to Batch (Human Live Training)
                    </label>
                  </div>
                  <select 
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {availableBatches.map((batchName, idx) => (
                      <option key={idx} value={batchName}>{batchName}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-emerald-700 font-medium">Live Google Meet / VClass links will be bound to this selected batch cohort.</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${
                  isProcessing 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/25'
                }`}
              >
                {isProcessing ? (
                  <span>Registering &amp; Provisioning Access...</span>
                ) : (
                  <>
                    <span>Complete Enrollment &amp; Unlock Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-2 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">Enrollment Active &amp; Verified!</h2>
                <p className="text-slate-600 text-xs max-w-md mx-auto mt-1">
                  Welcome aboard, <span className="font-bold text-slate-900">{formData.name}</span>! Your student portal credentials and live links are ready below.
                </p>
              </div>

              {/* Enrollment Details Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Course:</span>
                  <span className="font-extrabold text-slate-900">{formData.course}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Path:</span>
                  <span className="font-extrabold text-indigo-700">{formData.path}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Batch Allotment:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {formData.batch}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Access Status:</span>
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Direct Access Unlocked (Payment Skipped)
                  </span>
                </div>
              </div>

              {/* Generated Links Section */}
              <div className="space-y-2.5 text-left">
                {/* VClass Link */}
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                      <Link2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Live Virtual Classroom (VClass) Link:</span>
                    </div>
                    <div className="text-[11px] font-mono text-indigo-700 truncate mt-0.5">
                      {generatedClassLink}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedClassLink, 'vclass')}
                    className="px-2.5 py-1.5 bg-white text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 hover:bg-indigo-100/50 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLinkType === 'vclass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLinkType === 'vclass' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Path Video Link */}
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                      <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Path Video Lecture Stream:</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 truncate mt-0.5">
                      {generatedVideoLink}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedVideoLink, 'video')}
                    className="px-2.5 py-1.5 bg-white text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 hover:bg-emerald-100/50 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLinkType === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLinkType === 'video' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleGoToStudentPortal}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 text-sm cursor-pointer"
                >
                  <span>Launch Student Portal Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      onClose();
                      window.location.hash = '#admin-portal';
                    }} 
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    View in Admin Roster
                  </button>
                  <button 
                    onClick={onClose} 
                    className="py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
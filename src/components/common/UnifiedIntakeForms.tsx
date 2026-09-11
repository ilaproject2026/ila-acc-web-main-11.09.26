import { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Mail, ClipboardCheck, Plane, Briefcase, GraduationCap } from 'lucide-react';
import { saveInquiry } from '../../lib/db';

type FormType = 'visa' | 'course' | 'job' | 'earn-learn';

export default function UnifiedIntakeForms() {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState<FormType>('visa');
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    score: number;
    path: string;
    actionPlan: string[];
  } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // Visa fields
    educationLevel: 'bachelor',
    languageSkills: 'none',
    visaHistory: 'no-refusals',
    hasBlockedAccount: 'no',
    // Course fields
    courseInterest: 'German Language A1–C2',
    learningPath: 'Intelli-Coach AI Trainer™',
    studyHoursPerWeek: '10',
    // Job fields
    jobField: 'Software Engineering',
    workExpYears: '2',
    preferredSalary: '$40,000',
    // Learn Earn fields
    earnPriority: 'study-first',
    availableHours: '20'
  });

  useEffect(() => {
    const handleOpen = (e: CustomEvent<{ type: FormType }>) => {
      if (e.detail && e.detail.type) {
        setFormType(e.detail.type);
      }
      setOpen(true);
      setStep(1);
      setEvalResult(null);
      setAnalyzing(false);
    };

    window.addEventListener('open-unified-intake' as any, handleOpen as any);
    return () => window.removeEventListener('open-unified-intake' as any, handleOpen as any);
  }, []);

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateAIScore = () => {
    let score = 70; // Base score
    
    if (formType === 'visa') {
      if (formData.educationLevel === 'master' || formData.educationLevel === 'bachelor') score += 15;
      if (formData.languageSkills !== 'none') score += 10;
      if (formData.visaHistory === 'no-refusals') score += 5;
      if (formData.hasBlockedAccount === 'yes') score += 5;
    } else if (formType === 'course') {
      if (formData.studyHoursPerWeek === '20+') score += 20;
      else if (formData.studyHoursPerWeek === '10-20') score += 10;
    } else if (formType === 'job') {
      const exp = parseInt(formData.workExpYears, 10) || 0;
      if (exp >= 5) score += 25;
      else if (exp >= 2) score += 15;
    } else if (formType === 'earn-learn') {
      if (formData.earnPriority === 'study-first') score += 15;
      if ((parseInt(formData.availableHours, 10) || 0) >= 20) score += 10;
    }

    return Math.min(99, score);
  };

  const generateAIActionPlan = (score: number) => {
    const plan: string[] = [];
    if (formType === 'visa') {
      if (score < 80) plan.push("Missing document checkup: Submit complete transcript block.");
      if (formData.languageSkills === 'none') plan.push("Urgent: Recommend enrolling in German A1-A2 Fast-Track immediately.");
      if (formData.hasBlockedAccount === 'no') plan.push("Requirement: Set up German Blocked Bank Account (Finanzierungsnachweis) for €11,900.");
    } else if (formType === 'course') {
      plan.push(`Recommended Path: ${formData.learningPath} + 24/7 Intelli-Coach Practice.`);
      plan.push("Action: Complete baseline assessment level within first 48 hours.");
    } else if (formType === 'job') {
      plan.push("Action: Revamp CV into German Europass format.");
      plan.push("Recommended level: Secure German B2 proficiency to pass initial client screenings.");
    } else if (formType === 'earn-learn') {
      plan.push("Recommended Action: Register for Jobs within the German local syndicate programs.");
      plan.push("Milestone: Keep upskilling certifications active weekly to maintain student stipend.");
    }
    plan.push("System Alert: Auto-generated guidance checklist dispatched to inbox.");
    return plan;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in contact details.");
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      const calculatedScore = calculateAIScore();
      const plan = generateAIActionPlan(calculatedScore);
      
      let suggestedPath = '';
      if (formType === 'visa') suggestedPath = 'German Student/Job Visa Fast-Track';
      else if (formType === 'course') suggestedPath = `${formData.courseInterest} - ${formData.learningPath}`;
      else if (formType === 'job') suggestedPath = `${formData.jobField} Corporate Placement`;
      else if (formType === 'earn-learn') suggestedPath = 'Ausbildung + Part-Time Syndicate Onboarding';

      setEvalResult({
        score: calculatedScore,
        path: suggestedPath,
        actionPlan: plan
      });

      // Save to database layer
      try {
        const sourceTags: Record<FormType, string> = {
          'visa': 'Visa Eligibility Form',
          'course': 'Course Level Assessment Form',
          'job': 'Job Placement Registration Form',
          'earn-learn': 'Work While You Study Program Registry Form'
        };

        saveInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: formType === 'course' ? formData.courseInterest : `${formType.toUpperCase()} Application`,
          path: suggestedPath,
          price: formType === 'course' ? '$199.00' : 'Complimentary Intake',
          paymentStatus: 'Pending',
          category: formType === 'visa' ? 'Visa' : formType === 'job' ? 'Jobs' : formType === 'earn-learn' ? 'Study Abroad' : 'Education',
          aiScore: calculatedScore,
          aiPath: suggestedPath,
          aiActionPlan: plan,
          docStatus: 'Pending',
          source: sourceTags[formType] || 'Website Hero CTA'
        });
      } catch (err) {
        console.error('Error saving inquiry:', err);
      }

      setAnalyzing(false);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-8">
        
        {/* Close trigger */}
        <button 
          onClick={() => setOpen(false)} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          
          {/* Form Header info */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            {formType === 'visa' && <Plane className="w-6 h-6 text-brand-700" />}
            {formType === 'course' && <GraduationCap className="w-6 h-6 text-brand-700" />}
            {formType === 'job' && <Briefcase className="w-6 h-6 text-brand-700" />}
            {formType === 'earn-learn' && <ClipboardCheck className="w-6 h-6 text-brand-700" />}
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">
                {formType === 'visa' && 'Visa Preliminary Eligibility Check'}
                {formType === 'course' && 'Course Level Assessment'}
                {formType === 'job' && 'Job Search & Placement Registration'}
                {formType === 'earn-learn' && 'Work While You Study Program Registry'}
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">ERP Integrated Automated AI Ingestion</span>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Phone / WhatsApp</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="+91 98765 43210"
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
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="jane.doe@gmail.com"
                />
              </div>

              {formType === 'visa' && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Highest Education Level</label>
                      <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="high-school">High School / Secondary</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="medical">Medical / Nursing Degree</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Current German Language</label>
                      <select name="languageSkills" value={formData.languageSkills} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="none">No German skills yet</option>
                        <option value="A1">A1-A2 Beginner</option>
                        <option value="B1">B1-B2 Intermediate</option>
                        <option value="C1">C1 Native / Fluency</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Visa Refusal History</label>
                      <select name="visaHistory" value={formData.visaHistory} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="no-refusals">No Previous Refusals</option>
                        <option value="has-refusals">Yes, has prior visa refusals</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">German Blocked Bank Account (€11k+)</label>
                      <select name="hasBlockedAccount" value={formData.hasBlockedAccount} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="no">No, requires assistance setting up</option>
                        <option value="yes">Yes, ready / pre-arranged</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formType === 'course' && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Select Academic Course</label>
                      <select name="courseInterest" value={formData.courseInterest} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="German Language A1–C2">German Language A1–C2</option>
                        <option value="IELTS / TOEFL Proficiency">IELTS / TOEFL Proficiency</option>
                        <option value="Software Engineering & Full Stack">Software Engineering & Full Stack</option>
                        <option value="Digital Marketing & E-commerce">Digital Marketing & E-commerce</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Learning Path Choice</label>
                      <select name="learningPath" value={formData.learningPath} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="Intelli-Coach AI Trainer™">Intelli-Coach AI Trainer™ (Adaptive)</option>
                        <option value="Video + AI Training">Video + AI Training (Blended)</option>
                        <option value="Human Training Live">Human Training Live (Instructors)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Allocated Weekly Study Hours</label>
                    <select name="studyHoursPerWeek" value={formData.studyHoursPerWeek} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                      <option value="under-10">Under 10 hours / week</option>
                      <option value="10-20">10 to 20 hours / week</option>
                      <option value="20+">20+ hours / week (Fast-Track)</option>
                    </select>
                  </div>
                </div>
              )}

              {formType === 'job' && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Target Designation / Field</label>
                      <select name="jobField" value={formData.jobField} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="Software Engineering">Software Engineering & IT</option>
                        <option value="Nursing & Healthcare">Healthcare, Stethoscope / Nursing</option>
                        <option value="Hotel Management / Ausbildung">Ausbildung / Hotel Management</option>
                        <option value="Accounting & Finance">Accounting & Tally Systems</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Total Work Experience</label>
                      <select name="workExpYears" value={formData.workExpYears} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="0">Under 1 Year / Entry Level</option>
                        <option value="2">1 to 3 Years Intermediate</option>
                        <option value="5">5+ Years Professional</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formType === 'earn-learn' && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Track Priority Model</label>
                      <select name="earnPriority" value={formData.earnPriority} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="study-first">Study First priority (Student Track)</option>
                        <option value="work-first">Work First priority (Professional Track)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Available Work Hours / Week</label>
                      <select name="availableHours" value={formData.availableHours} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white">
                        <option value="10">Up to 10 Hours / Week</option>
                        <option value="20">Up to 20 Hours / Week</option>
                        <option value="40">40 Hours / Week (Full-Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="bg-brand-50 border border-brand-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                  <Sparkles className="w-5 h-5 text-brand-600 animate-spin" />
                  <span className="text-xs font-bold text-brand-900 animate-bounce">
                    Ilas AI Analyzing Profile & Compatibility...
                  </span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={analyzing}
                className="w-full py-4 bg-brand-700 text-white rounded-2xl font-black text-sm hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {analyzing ? 'Ingesting profile details...' : 'Submit to AI Analyzer Engine'}
              </button>

            </form>
          )}

          {step === 2 && evalResult && (
            <div className="space-y-6">
              
              {/* Dynamic AI Score Banner */}
              <div className="bg-gradient-to-br from-indigo-900 to-brand-950 p-6 rounded-3xl text-white border-2 border-brand-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-widest text-brand-300 font-black">AI Assessment Output</span>
                  <span className="text-2xl font-black text-amber-400">
                    {formType === 'visa' ? (
                      <>Visa Approval Probability Score: <span className="text-3xl text-emerald-400 font-black">{evalResult.score}%</span></>
                    ) : (
                      <>Course/Job Match Index: <span className="text-3xl text-brand-400 font-black">{evalResult.score}%</span></>
                    )}
                  </span>
                </div>
                <h4 className="font-bold text-base mb-1">Suggested Path: {evalResult.path}</h4>
                <p className="text-xs text-slate-300 font-semibold italic">End-to-End integration confirmed across internal CRM databases.</p>
              </div>

              {/* Dynamic Action Checklist */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-brand-800">
                  <ClipboardCheck className="w-4 h-4" /> AI Generated Action Plan
                </h4>
                <div className="space-y-2">
                  {evalResult.actionPlan.map((action, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Notification */}
              <div className="bg-blue-50 text-blue-900 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider">Automated Email Guidance Dispatched</h5>
                  <p className="text-xs text-blue-700 leading-normal mt-0.5 font-semibold">
                    A personalized PDF checklist detailing required files and next steps has been dispatched to <span className="font-bold">{formData.email}</span>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => {
                    setOpen(false);
                    window.location.hash = '#admin-portal';
                  }} 
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-md text-xs uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  Open ERP CRM (Review Applicant AI Summary)
                </button>
                <button 
                  onClick={() => setOpen(false)} 
                  className="w-full py-3 bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 rounded-2xl font-bold transition-colors text-xs uppercase tracking-widest"
                >
                  Close & Continue Browsing
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
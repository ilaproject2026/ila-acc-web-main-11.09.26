import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, GraduationCap, Globe, Briefcase, Plane, 
  MessageCircle, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Mail, Star
} from 'lucide-react';
import { saveInquiry } from '../lib/db';

const SERVICES = [
  { id: 'education', label: 'Education & Training' },
  { id: 'study-abroad', label: 'Study Abroad' },
  { id: 'visa', label: 'Visa Services' },
  { id: 'work-while-you-study', label: 'Work While You Study' },
  { id: 'jobs', label: 'Job & Career Placements' },
  { id: 'rewards', label: 'Rewards Plan & Partnership' }
];

const PROMO_BANNERS = [
  {
    id: 'promo-education',
    title: 'World-Class Education',
    subtitle: 'AI-Powered Language & Tech Mastery',
    desc: 'Master German, IELTS, or Software Engineering with our 24/7 Intelli-Coach AI system.',
    bgImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
    icon: GraduationCap,
    color: 'from-brand-900/95 via-brand-900/80',
    features: [
      'Certified Language & Technical Instructors',
      '24/7 Intelli-Coach AI Doubt Resolution',
      'Direct Gateway to German Opportunities'
    ]
  },
  {
    id: 'promo-study-abroad',
    title: 'Global Connectivity',
    subtitle: 'Direct Pathways to Top Universities',
    desc: 'Unlock seamless admissions and fully-funded public university opportunities in Germany and Europe.',
    bgImage: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?auto=format&fit=crop&q=80',
    icon: Globe,
    color: 'from-blue-900/95 via-blue-900/80',
    features: [
      'Zero Tuition Fee Public University Tracks',
      'End-to-End Application & APS Assistance',
      'Local WG/Accommodation Finding Support'
    ]
  },
  {
    id: 'promo-work-while-you-study',
    title: 'Work While You Study',
    subtitle: 'Zero Career Gaps',
    desc: 'Engage in part-time corporate tasks, earn stipends, and transition directly into permanent roles.',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
    icon: Briefcase,
    color: 'from-emerald-950/95 via-emerald-900/80',
    features: [
      'Guaranteed Monthly Corporate Stipend',
      '1-Year Verified Corporate Experience Letter',
      'Transition Support for German Visas'
    ]
  },
  {
    id: 'promo-visa',
    title: 'Guaranteed Visa Success',
    subtitle: '99.9% Embassy Compliance',
    desc: 'End-to-end documentation audit, blocked account setup, and direct embassy liaison support.',
    bgImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80',
    icon: Plane,
    color: 'from-slate-900/95 via-slate-900/80',
    features: [
      'Pre-Embassy Mock Interview Training',
      'Blocked Account & Insurance Processing',
      'Opportunity Card & Job Seeker Pathways'
    ]
  },
  {
    id: 'promo-jobs',
    title: 'Corporate Placement',
    subtitle: 'European Job Match Engine',
    desc: 'Bypass standard job portals. Connect directly with hiring managers seeking certified Indian talent.',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    icon: Briefcase,
    color: 'from-brand-900/95 via-brand-900/80',
    features: [
      'Resume Localization & German Europass',
      'Direct HR Introductions & Fast-Tracking',
      'Blue Card Sponsorship Verification'
    ]
  },
  {
    id: 'promo-rewards',
    title: 'Rewards & Partnerships',
    subtitle: 'Turn Referrals into Revenue',
    desc: 'Join as a consultant to track your leads and convert successful milestones into direct payouts.',
    bgImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80',
    icon: Star,
    color: 'from-amber-950/95 via-amber-900/80',
    features: [
      'Tiered Commission Payout Structure',
      'Dedicated Consultant CRM Dashboard',
      'Lifetime Candidate Tracking'
    ]
  }
];

export default function ApplicationPoolPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICES[0].id,
    
    // Dynamic fields for Education
    educationCourse: 'German Language A1-C2',
    educationMethod: 'Intelli-Coach AI Path',
    educationBatch: '',
    educationSlot: '',
    
    // Dynamic fields for Study Abroad
    targetCountry: 'Germany',
    institutionType: 'Public',
    targetCourseTrack: 'STEM & Engineering',
    
    // Dynamic fields for Visa
    currentVisaStatus: 'No active visa',
    currentResidence: 'India',
    visaDestination: 'Germany',
    visaTypeRequired: 'Student Visa',
    
    // Dynamic fields for Work While You Study
    lweTrack: 'Student Sub-Track',
    stipendDomain: 'IT & Automation',
    internshipDuration: '6 Months',

    // Dynamic fields for Jobs
    jobDomain: 'Software Engineering',
    roleLevel: 'Fresher / Entry Level',
    currentLocation: 'India',
    targetLocation: 'Europe',
    resumeUrl: '',

    // Dynamic fields for Rewards
    rewardTier: 'Silver Consultant',
    referralCode: '',
    partnershipOption: 'Independent Consultant'
  });

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<{status: string, message: string, aiScore?: number, aiPath?: string, confirmationTitle?: string} | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-rotate promo banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // URL Hash Parsing
  useEffect(() => {
    const hash = window.location.hash;
    let initialService = 'education';
    if (hash.includes('?tab=')) {
      const tabParam = decodeURIComponent(hash.split('?tab=')[1]);
      if (tabParam.includes('Education')) initialService = 'education';
      else if (tabParam.includes('Study Abroad')) initialService = 'study-abroad';
      else if (tabParam.includes('Visa')) initialService = 'visa';
      else if (tabParam.includes('Work While You Study') || tabParam.includes('Learn') || tabParam.includes('Work While You Study')) initialService = 'work-while-you-study';
      else if (tabParam.includes('Jobs') || tabParam.includes('Job Search')) initialService = 'jobs';
      else if (tabParam.includes('Rewards')) initialService = 'rewards';
    }
    
    // Parse query params for course pre-filling
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      setFormData(prev => ({ 
        ...prev, 
        service: initialService,
        ...(params.has('course') && { educationCourse: params.get('course') || '' }),
        ...(params.has('info') && { educationMethod: params.get('info') || '' }),
        ...(params.has('batch') && { educationBatch: params.get('batch') || '' }),
        ...(params.has('slot') && { educationSlot: params.get('slot') || '' })
      }));
    } else {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
    
    const matchedPromoIndex = PROMO_BANNERS.findIndex(p => p.id.includes(initialService.split('-')[0]) || p.id.includes(initialService.replace('-', '')));
    if (matchedPromoIndex !== -1) {
      setActivePromoIndex(matchedPromoIndex);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextPromo = () => setActivePromoIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
  const handlePrevPromo = () => setActivePromoIndex((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Simulate API & AI Intake Analysis Delay
    setTimeout(() => {
      try {
        const selectedServiceLabel = SERVICES.find(s => s.id === formData.service)?.label || 'General Inquiry';
        
        let department = 'Education Hub';
        let category: any = 'Education';
        let customPath = '';
        let confirmationTitle = 'Intake Analysis Ready';
        let confirmationMsg = 'Your profile has been logged and the original AI evaluation report will be sent to your email.';
        
        if (formData.service === 'education') {
          department = 'Education Hub';
          category = 'Education';
          customPath = `${formData.educationCourse} via ${formData.educationMethod}`;
          confirmationTitle = 'Enrollment Process Initiated';
          confirmationMsg = 'Enrollment confirmed! Your class link and portal credentials will be sent to your email shortly.';
        } else if (formData.service === 'study-abroad') {
          department = 'Study Abroad';
          category = 'Study Abroad';
          customPath = `Target: ${formData.targetCountry} - ${formData.institutionType} Inst. (${formData.targetCourseTrack})`;
          confirmationTitle = 'Profile Evaluated';
          confirmationMsg = `Profile analyzed for ${formData.targetCountry}. Estimated eligibility score and next steps are displayed below.`;
        } else if (formData.service === 'visa') {
          department = 'Visa Processing';
          category = 'Visa';
          customPath = `${formData.visaTypeRequired} to ${formData.visaDestination} (From: ${formData.currentResidence})`;
          confirmationTitle = 'Visa Profile Evaluated';
          confirmationMsg = `Visa requirements analyzed for ${formData.visaDestination}. Estimated eligibility score and next steps displayed below.`;
        } else if (formData.service === 'work-while-you-study') {
          department = 'Job & Career / Work While You Study';
          category = 'Jobs';
          customPath = `${formData.lweTrack} - ${formData.stipendDomain} (${formData.internshipDuration})`;
          confirmationTitle = 'Pilot Track Assigned';
          confirmationMsg = 'Profile matched. Your corporate tracking and stipend pilot details have been logged in our Lead CRM.';
        } else if (formData.service === 'jobs') {
          department = 'Job & Career / Work While You Study';
          category = 'Jobs';
          customPath = `${formData.jobDomain} (${formData.roleLevel}) - To: ${formData.targetLocation}`;
          confirmationTitle = 'Application Submitted';
          confirmationMsg = 'You will be under a 6-month probation and training period in your department with a reasonable probation salary, which will increase based on department performance. We will contact you soon.';
        } else if (formData.service === 'rewards') {
          department = 'Partnerships & Rewards';
          category = 'Jobs';
          customPath = `${formData.partnershipOption} - ${formData.rewardTier}`;
          confirmationTitle = 'Partnership Approved';
          confirmationMsg = 'Welcome to the consultant network. Your tracking dashboard credentials are on their way.';
        }

        // Save to DB layer with extended metadata for CRM integration
        saveInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: selectedServiceLabel,
          path: customPath,
          batch: formData.service === 'education' ? formData.educationBatch : undefined,
          slot: formData.service === 'education' ? formData.educationSlot : undefined,
          price: 'Pending Consultation',
          paymentStatus: 'Pending',
          category: category,
          source: 'Application Pool Unified Intake',
          docStatus: 'Pending',
          department: department,
          crmStatus: 'New Lead',
          pipelineStage: 'Intake'
        });

        const mockScore = Math.floor(75 + Math.random() * 24);

        setSubmissionResult({
          status: 'success',
          confirmationTitle,
          message: confirmationMsg,
          aiScore: mockScore,
          aiPath: customPath
        });

      } catch (err) {
        console.error(err);
        setSubmissionResult({
          status: 'error',
          message: 'There was an issue submitting your application. Please try again or contact support.'
        });
      } finally {
        setIsSubmitting(false);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }, 2000);
  };

  const ActivePromoIcon = PROMO_BANNERS[activePromoIndex].icon;
  const currentFeatures = PROMO_BANNERS.find(p => p.id.includes(formData.service.split('-')[0]))?.features || PROMO_BANNERS[0].features;

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container-max px-4 mx-auto space-y-12">
        
        {/* TOP SECTION: TWO COLUMNS (Form + Promo Banner) */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Application Form */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-black uppercase tracking-wider mb-6 border border-brand-100">
                <Sparkles className="w-4 h-4" /> Global Intake Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 leading-tight">Unified Application Form</h1>
              <p className="text-slate-500 text-sm mb-8">Register your profile. Our AI will match your background to the best academic or professional pathway.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-semibold transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Target Service</label>
                  <select 
                    name="service" 
                    value={formData.service} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-bold bg-white text-slate-800 transition-all appearance-none cursor-pointer"
                  >
                    {SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* DYNAMIC FIELDS based on Selected Service */}
                <div className="pt-2 border-t border-slate-100">
                  {formData.service === 'education' && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Select Course</label>
                        <select name="educationCourse" value={formData.educationCourse} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                          <option value={formData.educationCourse}>{formData.educationCourse}</option>
                          <option value="German Language A1-C2">German Language A1-C2</option>
                          <option value="IELTS Proficiency">IELTS / English Proficiency</option>
                          <option value="Software Engineering">Software Engineering</option>
                          <option value="Financial Accounting">Financial Accounting / Tally</option>
                        </select>
                      </div>
                      
                      <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100/50 space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-700">Selected Configuration</label>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-brand-200 text-xs font-bold text-slate-700 shadow-sm">
                            <span className="text-brand-500">Path:</span> 
                            {formData.educationMethod || 'Standard'}
                          </div>
                          {formData.educationBatch && (
                            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-slate-700 shadow-sm">
                              <span className="text-emerald-500">Batch:</span> 
                              {formData.educationBatch}
                            </div>
                          )}
                          {formData.educationSlot && (
                            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-amber-200 text-xs font-bold text-slate-700 shadow-sm">
                              <span className="text-amber-500">Slot:</span> 
                              ⏰ {formData.educationSlot}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.service === 'study-abroad' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Target Country</label>
                          <select name="targetCountry" value={formData.targetCountry} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Germany">Germany</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Institution Type</label>
                          <select name="institutionType" value={formData.institutionType} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Public">Public (Free/Low Tuition)</option>
                            <option value="Private">Private</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Target Course Track</label>
                        <select name="targetCourseTrack" value={formData.targetCourseTrack} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                          <option value="STEM & Engineering">STEM & Engineering</option>
                          <option value="Business & Management">Business & Management</option>
                          <option value="Healthcare & Medicine">Healthcare & Medicine</option>
                          <option value="Arts & Humanities">Arts & Humanities</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {formData.service === 'visa' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Current Visa Status</label>
                          <select name="currentVisaStatus" value={formData.currentVisaStatus} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold bg-white text-slate-800">
                            <option value="No active visa">No active visa</option>
                            <option value="Have existing visa">Have existing visa</option>
                            <option value="Previous Refusal">Previous Refusal</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Current Residence</label>
                          <input type="text" name="currentResidence" value={formData.currentResidence} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold" placeholder="Country" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Destination</label>
                          <select name="visaDestination" value={formData.visaDestination} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Germany">Germany</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="EU/Schengen">Other EU/Schengen</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Visa Type Required</label>
                          <select name="visaTypeRequired" value={formData.visaTypeRequired} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Student Visa">Student Visa</option>
                            <option value="Opportunity Card">Opportunity Card</option>
                            <option value="Work Permit">Work Permit / Blue Card</option>
                            <option value="Tourist Visa">Tourist / Visitor Visa</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.service === 'work-while-you-study' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Track Choice</label>
                          <select name="lweTrack" value={formData.lweTrack} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Student Sub-Track">Student Sub-Track</option>
                            <option value="Job-Seeker Sub-Track">Job-Seeker Sub-Track</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Stipend Domain</label>
                          <select name="stipendDomain" value={formData.stipendDomain} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="IT & Automation">IT & Automation</option>
                            <option value="Solar & Tech Pilot">Solar & Tech Pilot</option>
                            <option value="Logistics & Trade">Logistics & Trade</option>
                            <option value="Accounts & Admin">Accounts & Admin</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Internship Duration</label>
                        <select name="internshipDuration" value={formData.internshipDuration} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                          <option value="6 Months">6 Months</option>
                          <option value="1 Year">1 Year</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {formData.service === 'jobs' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Job Domain</label>
                          <select name="jobDomain" value={formData.jobDomain} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold appearance-none bg-white">
                            <option value="Office Admin & Accounts">Office Admin & Accounts</option>
                            <option value="Software">Software</option>
                            <option value="SEO & Social AI">SEO & Social AI</option>
                            <option value="Import-Export Trade">Import-Export Trade</option>
                            <option value="Engineering & Technical">Engineering & Technical</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-slate-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Role Level</label>
                          <select name="roleLevel" value={formData.roleLevel} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800 appearance-none">
                            <option value="Fresher / Entry Level">Fresher / Entry Level</option>
                            <option value="Experienced (1-3 Yrs)">Experienced (1-3 Yrs)</option>
                            <option value="Senior (3+ Yrs)">Senior (3+ Yrs)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-slate-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-800 font-semibold mb-4">
                        {formData.jobDomain === 'Office Admin & Accounts' && 'AI-Assisted Accounting, Billing & Auditing / Office Administration for 6 months'}
                        {formData.jobDomain === 'Software' && 'AI-Powered Web Development & Full-Stack Projects for 6 months'}
                        {formData.jobDomain === 'SEO & Social AI' && 'High-Level SEO, Digital Client Campaigns & Social Media Growth for 6 months'}
                        {formData.jobDomain === 'Import-Export Trade' && 'European Sourcing, Export Documentation & Cross-Border Logistics for 6 months'}
                        {formData.jobDomain === 'Engineering & Technical' && 'Solar Installation, EV Diagnostics & Mechanical Toolkits for 6 months'}
                        {!['Office Admin & Accounts', 'Software', 'SEO & Social AI', 'Import-Export Trade', 'Engineering & Technical'].includes(formData.jobDomain) && 'Select a Job Domain to see description'}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Current Location</label>
                          <select name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold appearance-none bg-white">
                            <option value="India">India</option>
                            <option value="UAE">UAE</option>
                            <option value="Global Country">Global Country</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-slate-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Target Location</label>
                          <select name="targetLocation" value={formData.targetLocation} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold appearance-none bg-white">
                            <option value="Europe">Europe (Project Onboarding)</option>
                            <option value="Germany">Germany</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Remote">Remote</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-slate-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Resume Link (Optional)</label>
                        <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold" placeholder="https://linkedin.com/..." />
                      </div>
                    </div>
                  )}

                  {formData.service === 'rewards' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Reward Tier</label>
                          <select name="rewardTier" value={formData.rewardTier} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Silver Consultant">Silver Consultant</option>
                            <option value="Gold Consultant">Gold Consultant</option>
                            <option value="Platinum Partner">Platinum Partner</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Partnership Option</label>
                          <select name="partnershipOption" value={formData.partnershipOption} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold bg-white text-slate-800">
                            <option value="Independent Consultant">Independent Consultant</option>
                            <option value="Business Franchise">Business Franchise</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Referral Code (If any)</label>
                        <input type="text" name="referralCode" value={formData.referralCode} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold" placeholder="e.g. REF-12345" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-black text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 shadow-brand-600/20 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Sparkles className="w-4 h-4 animate-spin" /> Processing Application...</>
                    ) : (
                      <>Submit Application <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Dynamic Rotating Promo Banner */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl min-h-[500px] lg:min-h-[600px] group border border-slate-800">
            {PROMO_BANNERS.map((promo, index) => (
              <div 
                key={promo.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col ${index === activePromoIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {/* Background Image Container */}
                <div className="relative flex-1">
                  <div 
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] linear ${index === activePromoIndex ? 'scale-105' : 'scale-100'}`} 
                    style={{ backgroundImage: `url(${promo.bgImage})` }}
                  />
                  
                  {/* Gradients */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${promo.color} to-slate-900 opacity-90`} />
                  <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} to-transparent opacity-80`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end z-20 pb-4">
                    <div className="mb-6 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                      {index === activePromoIndex && <ActivePromoIcon className="w-8 h-8 text-white" />}
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20 mb-4 w-fit shadow-md">
                      Core Service Showcase
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-md">
                      {promo.title}
                    </h2>
                    <h3 className="text-xl sm:text-2xl font-bold text-white/90 mb-4">{promo.subtitle}</h3>
                    <p className="text-base sm:text-lg text-white/70 max-w-xl font-medium leading-relaxed">
                      {promo.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Controls */}
            <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
              <button onClick={handlePrevPromo} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextPromo} className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-[30%] right-6 z-30 flex gap-2">
              {PROMO_BANNERS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActivePromoIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activePromoIndex ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
            
            {/* Dynamic Features Section Below Banner */}
            <div className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6 sm:p-8 z-30">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Key Features & Guarantee
              </h4>
              <div className="grid sm:grid-cols-3 gap-4">
                {currentFeatures?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm font-semibold text-slate-200 leading-snug">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: AI RESULT PORT */}
        {submissionResult && (
          <div ref={resultRef} className="animate-fade-in scroll-mt-24">
            <div className={`p-8 sm:p-10 rounded-3xl border-2 shadow-2xl relative overflow-hidden ${submissionResult.status === 'success' ? 'bg-slate-900 border-brand-500' : 'bg-red-50 border-red-200'}`}>
              
              {submissionResult.status === 'success' ? (
                <>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-48 h-48 text-brand-400" />
                  </div>
                  
                  <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-black uppercase tracking-wider mb-6 border border-brand-400/30">
                        <CheckCircle2 className="w-4 h-4" /> {submissionResult.confirmationTitle || 'AI Evaluation Completed'}
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">{submissionResult.confirmationTitle}</h2>
                      <p className="text-slate-300 text-base leading-relaxed mb-6">
                        {submissionResult.message}
                      </p>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                        <Mail className="w-6 h-6 text-brand-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Dispatched To</p>
                          <p className="text-sm font-semibold text-white">{formData.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-inner border border-slate-100">
                      <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Assigned Pathway</span>
                          <span className="text-lg font-bold text-slate-900">{submissionResult.aiPath}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Match Index</span>
                          <span className="text-3xl font-black text-emerald-500">{submissionResult.aiScore}%</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-brand-600" /> Action Items
                        </h4>
                        <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-sm text-brand-800 font-medium">
                          1. Check your email for the detailed PDF report.
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium">
                          2. A senior consultant will contact you at {formData.phone} shortly. For further inquiries, call +49 123 456 7890.
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium">
                          3. Prepare your preliminary documents for the onboarding portal.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 relative z-10">
                  <h3 className="text-2xl font-black text-red-600 mb-2">Submission Failed</h3>
                  <p className="text-red-500 font-medium">{submissionResult.message}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
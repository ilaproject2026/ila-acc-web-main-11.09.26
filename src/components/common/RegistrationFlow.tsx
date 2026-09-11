import { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Mail, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { saveInquiry } from '../../lib/db';

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
  { id: 'Intelli-Coach AI Trainer™', label: 'Intelli-Coach AI Trainer™', price: '$199.00', duration: '6 Months', desc: 'Interactive AI doubt solving, syllabus tracking & mock tests' },
  { id: 'Video + AI Training', label: 'Video + AI Training', price: '$149.00', duration: '3 Months', desc: 'Pre-recorded modules & AI assessment checkups' },
  { id: 'Human Training Live', label: 'Human Training Live', price: '$399.00', duration: '4 Months', desc: 'Live cohorts and real-world instructor mentorship' }
];

interface RegistrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: string;
}

export default function RegistrationFlow({ isOpen, onClose, selectedPackage }: RegistrationFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: COURSES[0],
    path: PATHS[0].id
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [mockEmailSent, setMockEmailSent] = useState(false);

  useEffect(() => {
    if (selectedPackage) {
      const parts = selectedPackage.split(' - ');
      const matchedCourse = COURSES.find(c => c.toLowerCase().includes(parts[0].toLowerCase())) || COURSES[0];
      const matchedPath = PATHS.find(p => parts[1] && p.id.toLowerCase().includes(parts[1].toLowerCase()))?.id || PATHS[0].id;

      setFormData(prev => ({
        ...prev,
        course: matchedCourse,
        path: matchedPath
      }));
    }
  }, [selectedPackage]);

  if (!isOpen) return null;

  const currentPathDetails = PATHS.find(p => p.id === formData.path) || PATHS[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all details.');
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handlePaymentSubmit = () => {
    setIsProcessing(true);

    const category = formData.course.includes('German') || formData.course.includes('IELTS') ? 'Education' : 'Jobs';
    
    try {
      saveInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        path: formData.path,
        price: currentPathDetails.price,
        paymentStatus: 'Pending',
        category: category as any
      });
    } catch (err) {
      console.error('Error saving inquiry:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setMockEmailSent(true);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10" aria-label="Close modal">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold leading-normal">
              Ilas With You Companion Support is 100% Free & Complimentary with this enrollment
            </span>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Begin Your Enrollment</h2>
              <p className="text-slate-500 text-sm mb-6">Fill in your information to register and secure your learning path.</p>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-semibold" 
                      placeholder="John Doe" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-semibold" 
                      placeholder="+91 98765 43210" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-semibold" 
                    placeholder="john@example.com" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Course Selection</label>
                  <select 
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-bold bg-white text-slate-800"
                  >
                    {COURSES.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Choose Learning Path</label>
                  <div className="grid gap-3">
                    {PATHS.map((pathOption) => (
                      <label 
                        key={pathOption.id}
                        className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                          formData.path === pathOption.id 
                            ? 'border-brand-600 bg-brand-50/40' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="path" 
                          value={pathOption.id} 
                          checked={formData.path === pathOption.id}
                          onChange={handleInputChange}
                          className="mt-1 text-brand-600 focus:ring-brand-500"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-slate-900 text-sm">{pathOption.label}</span>
                            <span className="font-extrabold text-brand-600 text-sm">{pathOption.price}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal mb-1">{pathOption.desc}</p>
                          <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            Duration: {pathOption.duration}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-sm font-bold">
                  <div className="text-slate-600">Selected Path Total:</div>
                  <div className="text-brand-700 text-lg font-black">{currentPathDetails.price} <span className="text-xs text-slate-400 font-medium">/ {currentPathDetails.duration}</span></div>
                </div>

                <button onClick={handleNext} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Gateway</h2>
              <p className="text-slate-500 text-sm mb-6">Choose your preferred transaction method to process your invoice.</p>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Course</span>
                    <span className="text-slate-900 font-bold text-sm">{formData.course}</span>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Learning Method</span>
                    <span className="text-slate-900 font-bold text-sm">{currentPathDetails.label}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-extrabold">Grand Total Amount</span>
                  <span className="text-brand-600 font-black text-2xl">{currentPathDetails.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleNext} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" /> Pay securely with Card
                </button>
                <button onClick={handleNext} className="w-full py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-black hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Pay via QR / Direct Bank Transfer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Complete Verification</h2>
              <p className="text-slate-500 text-sm mb-6">Verify the transaction using our secure sandbox processing panel.</p>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-8 text-center mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 text-amber-500 animate-pulse">
                  <Mail className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Sandbox Simulation Mode</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-normal">
                  In production, our integrated UPI, razorpay and global card stripe processors render dynamically here.
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-500 max-w-xs mx-auto">
                  Invoice ID: ILAS-INV-{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>

              <button 
                onClick={handlePaymentSubmit} 
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
                  isProcessing 
                    ? 'bg-slate-400 text-white cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
                }`}
              >
                {isProcessing ? 'Verifying Sandbox Payment...' : 'Verify & Submit Enrollment'}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Registration Saved Successfully!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for enrolling! Once payment is verified by our finance department, your active classroom access link will be dispatched automatically to your email (<span className="font-semibold text-brand-600">{formData.email}</span>).
              </p>

              {mockEmailSent && (
                <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 mb-6 flex items-start gap-4 text-left">
                  <Mail className="w-6 h-6 text-brand-600 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h4 className="font-bold text-brand-900 text-xs uppercase tracking-wider mb-0.5">Mock Email Dispatched</h4>
                    <p className="text-xs text-brand-700 leading-normal font-semibold">
                      Composing onboarding layout to: {formData.email}. The Admin Panel now shows this lead under 'Pending' / 'Paid'.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => {
                    onClose();
                    window.location.hash = '#admin-portal';
                  }} 
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Admin Panel (View Saved Lead)
                </button>
                <button onClick={onClose} className="w-full py-3 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">
                  Close & Return to Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
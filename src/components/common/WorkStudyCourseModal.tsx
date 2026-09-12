import React, { useState, useEffect } from 'react';
import { 
  X, Briefcase, GraduationCap, Globe, CheckCircle2, ArrowRight, 
  Sparkles, Laptop, BookOpen, UserCheck, ShieldCheck
} from 'lucide-react';

export interface WorkStudySelectionData {
  course: string;
  category: string;
  track: string;
  domain: string;
  notes?: string;
}

interface WorkStudyCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: WorkStudySelectionData) => void;
  initialTrack?: string;
  initialDomain?: string;
  initialCourse?: string;
}

export const WORK_STUDY_COURSE_CATEGORIES = [
  {
    id: 'job-related',
    label: 'Job-Related / Technical Courses',
    icon: Laptop,
    badge: 'High Stipend',
    courses: [
      {
        id: 'soft-eng',
        name: 'Software Engineering & Cloud Architecture',
        desc: 'React, Node, Python AI integrations, and cloud deployments with active corporate client deliverables.',
        domain: 'IT & Automation',
        stipendRange: '₹18,000 – ₹30,000 / mo'
      },
      {
        id: 'office-admin',
        name: 'AI-Assisted Office Administration & Accounts',
        desc: 'Tally Prime, GST billing, financial ledger audits, and enterprise office operational workflows.',
        domain: 'Accounts & Admin',
        stipendRange: '₹15,000 – ₹25,000 / mo'
      },
      {
        id: 'seo-ai',
        name: 'SEO, Digital Marketing & Social AI Growth',
        desc: 'High-impact search optimization, client branding campaigns, and AI growth marketing tools.',
        domain: 'IT & Automation',
        stipendRange: '₹16,000 – ₹26,000 / mo'
      },
      {
        id: 'trade-logistics',
        name: 'Import-Export Trade, Sourcing & Logistics',
        desc: 'European sourcing protocols, cross-border freight forwarding, and international customs clearance.',
        domain: 'Logistics & Trade',
        stipendRange: '₹17,000 – ₹28,000 / mo'
      },
      {
        id: 'solar-energy',
        name: 'Renewable Energy, Solar & Technical Engineering',
        desc: 'Solar panel installation, smart grid energy audits, EV charging diagnostics, and electrical toolkits.',
        domain: 'Solar & Tech Pilot',
        stipendRange: '₹16,000 – ₹27,000 / mo'
      }
    ]
  },
  {
    id: 'language-related',
    label: 'Language-Related Courses',
    icon: Globe,
    badge: 'European Focus',
    courses: [
      {
        id: 'german-full',
        name: 'German Language Mastery (A1–C2 Fast-Track)',
        desc: 'Comprehensive Goethe/Telc exam preparation with 24/7 Intelli-Coach AI speaking companion.',
        domain: 'IT & Automation',
        stipendRange: '₹15,000 – ₹25,000 / mo'
      },
      {
        id: 'german-business',
        name: 'Business German & Technical Vocabulary (B1/B2)',
        desc: 'Specialized corporate terminology for IT, healthcare, and engineering project environments.',
        domain: 'Accounts & Admin',
        stipendRange: '₹16,000 – ₹28,000 / mo'
      },
      {
        id: 'ielts-pte',
        name: 'IELTS / TOEFL / PTE Academic English',
        desc: 'Global university and workplace English fluency certification with verified mock assessments.',
        domain: 'Logistics & Trade',
        stipendRange: '₹15,000 – ₹24,000 / mo'
      }
    ]
  },
  {
    id: 'already-studying',
    label: 'Already Studying / Work-Only Options',
    icon: UserCheck,
    badge: 'Immediate Placement',
    courses: [
      {
        id: 'enrolled-student',
        name: 'Currently Enrolled University Student (Work / Internship Only)',
        desc: 'For students already enrolled in another university seeking part-time corporate tasks & experience.',
        domain: 'IT & Automation',
        stipendRange: '₹15,000 – ₹25,000 / mo'
      },
      {
        id: 'working-pro',
        name: 'Working Professional Seeking Career Transition',
        desc: 'Flexible evening corporate projects and weekend deliverables designed for career pivoting.',
        domain: 'Accounts & Admin',
        stipendRange: '₹20,000 – ₹35,000 / mo'
      },
      {
        id: 'direct-pilot',
        name: 'Direct Corporate Pilot Placement (Experience & Stipend Only)',
        desc: 'Direct dispatch to verified corporate pilot projects with monthly stipend and official client audit.',
        domain: 'Logistics & Trade',
        stipendRange: '₹18,000 – ₹32,000 / mo'
      }
    ]
  }
];

export const WORK_STUDY_TRACKS = [
  {
    id: 'Student Sub-Track',
    label: 'Student Sub-Track',
    stipend: '₹15,000 – ₹25,000/mo',
    desc: 'Structured 20 hrs/week corporate pilot concurrent with your studies + 1-Year Experience Certificate.'
  },
  {
    id: 'Job-Seeker Sub-Track',
    label: 'Job-Seeker Sub-Track',
    stipend: '₹25,000 – ₹35,000/mo',
    desc: 'Full-time work immersion with direct transition into German Opportunity Card or permanent employment.'
  },
  {
    id: 'Abroad Placement Track',
    label: 'Abroad Placement Track',
    stipend: '€900 – €1,400/mo (EU)',
    desc: 'Bilateral German corporate placement with student visa sponsorship and accommodation assistance.'
  }
];

export default function WorkStudyCourseModal({
  isOpen,
  onClose,
  onConfirm,
  initialTrack,
  initialDomain,
  initialCourse
}: WorkStudyCourseModalProps) {
  const [activeCategoryTab, setActiveCategoryTab] = useState('job-related');
  const [selectedCourse, setSelectedCourse] = useState('Software Engineering & Cloud Architecture');
  const [selectedTrack, setSelectedTrack] = useState('Student Sub-Track');
  const [selectedDomain, setSelectedDomain] = useState('IT & Automation');

  useEffect(() => {
    if (initialTrack) setSelectedTrack(initialTrack);
    if (initialDomain) setSelectedDomain(initialDomain);
    if (initialCourse) {
      setSelectedCourse(initialCourse);
      // Auto-select category tab if match found
      for (const cat of WORK_STUDY_COURSE_CATEGORIES) {
        if (cat.courses.some(c => c.name.toLowerCase() === initialCourse.toLowerCase())) {
          setActiveCategoryTab(cat.id);
          break;
        }
      }
    }
  }, [initialTrack, initialDomain, initialCourse, isOpen]);

  if (!isOpen) return null;

  const currentCategory = WORK_STUDY_COURSE_CATEGORIES.find(c => c.id === activeCategoryTab) || WORK_STUDY_COURSE_CATEGORIES[0];

  const handleSelectCourseItem = (courseName: string, domain: string) => {
    setSelectedCourse(courseName);
    setSelectedDomain(domain);
  };

  const handleContinue = () => {
    const activeCategoryLabel = currentCategory.label;
    const payload: WorkStudySelectionData = {
      course: selectedCourse,
      category: activeCategoryLabel,
      track: selectedTrack,
      domain: selectedDomain
    };

    if (onConfirm) {
      onConfirm(payload);
    } else {
      // Default navigation to Application Form
      window.location.hash = `#applications?tab=Work While You Study&course=${encodeURIComponent(selectedCourse)}&category=${encodeURIComponent(activeCategoryLabel)}&track=${encodeURIComponent(selectedTrack)}&domain=${encodeURIComponent(selectedDomain)}`;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[86vh] bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Fixed shrink-0 */}
        <div className="shrink-0 p-4 sm:p-5 pb-3 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-brand-600" />
                  Work & Study Pathway Orientation
                </span>
                <span className="text-[10px] font-bold text-slate-500 hidden sm:inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Step 1 of 2
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Course & Practical Work Alignment
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-medium">
                Please select your course which you are leading to study and do your work & gain experience during your education.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categorized Tab Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {WORK_STUDY_COURSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategoryTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive 
                      ? 'bg-brand-600 text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body - Scrollable Course Selection with min-h-0 constraint */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {/* Active Category Course List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Available Courses in {currentCategory.label}
              </span>
              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                {currentCategory.courses.length} options
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {currentCategory.courses.map((course) => {
                const isSelected = selectedCourse === course.name;
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSelectCourseItem(course.name, course.domain)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-50/60 border-brand-400 ring-2 ring-brand-400/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'border-2 border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                            {course.name}
                          </h4>
                          <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {course.domain}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                          {course.desc}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black text-emerald-700 block whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {course.stipendRange}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Sub-Track Configuration */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Work & Study Sub-Track
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {WORK_STUDY_TRACKS.map((t) => {
                const isSelected = selectedTrack === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrack(t.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {t.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
                      </div>
                      <p className={`text-[10px] leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {t.desc}
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-200/30 text-[10px] font-black">
                      <span className={isSelected ? 'text-amber-300' : 'text-emerald-600'}>
                        {t.stipend}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer - Always visible fixed shrink-0 */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-10">
          <div className="text-[11px] sm:text-xs text-slate-600 text-center sm:text-left truncate max-w-full">
            <span className="font-bold text-slate-900">Selected:</span> {selectedCourse}
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-brand-600 font-bold">{selectedTrack}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200/60 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 shrink-0"
            >
              <span>Proceed to Application &amp; Resume Upload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}

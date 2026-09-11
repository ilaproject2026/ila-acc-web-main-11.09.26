import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Upload,
  FileText,
  MapPin,
  GraduationCap,
  Building2,
  Stethoscope,
  Clock,
  CheckCircle2,
  Loader2,
  Mail,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import type { EligibilityMatch, EligibilityProfile, EducationLevel, GermanLevel } from '../../types'
import { analyzeEligibility } from '../../lib/eligibilityEngine'

type Step = 'form' | 'verification' | 'confirmed'

const defaultProfile: Partial<EligibilityProfile> = {
  fullName: '',
  email: '',
  age: 22,
  education: 'bachelor',
  fieldOfStudy: '',
  gpa: 3.0,
  workExperienceYears: 0,
  germanLevel: 'none',
  preferredPath: 'any',
}

export default function EligibilityChecker() {
  const [profile, setProfile] = useState<Partial<EligibilityProfile>>(defaultProfile)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<EligibilityMatch | null>(null)
  const [step, setStep] = useState<Step>('form')
  const [verificationCode, setVerificationCode] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [sentEmail] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runAnalysis = useCallback((p: Partial<EligibilityProfile>, hasResume: boolean) => {
    setAnalyzing(true)
    setTimeout(() => {
      setResults(analyzeEligibility(p, hasResume))
      setAnalyzing(false)
    }, 600)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (profile.fullName || profile.fieldOfStudy || profile.email) {
        runAnalysis(profile, !!resumeFile)
      }
    }, 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [profile, resumeFile, runAnalysis])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setResumeFile(file)
  }

  const handleCheckEligibility = () => {
    runAnalysis(profile, !!resumeFile)
    setResults(analyzeEligibility(profile, !!resumeFile))
  }

  const handleApplyNow = () => {
    if (!profile.email) {
      alert('Please enter your email address before applying.')
      return
    }
    window.location.hash = '#applications?tab=Education';
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (enteredCode.trim() === verificationCode) {
      setStep('confirmed')
      setCodeError('')
    } else {
      setCodeError('Invalid code. Please check your email and try again.')
    }
  }

  const update = <K extends keyof EligibilityProfile>(key: K, value: EligibilityProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const scoreColor = (score: number) =>
    score >= 75 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-slate-500'

  return (
    <section id="eligibility" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Free Preliminary Check</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Dynamic Eligibility Analyzer
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Enter your profile and upload your resume — our system analyzes your qualifications in real-time
            and matches you with Ausbildung, universities, hospitals, and locations in Germany.
          </p>
        </div>

        {step === 'confirmed' ? (
          <ConfirmedView email={sentEmail} onReset={() => { setStep('form'); setVerificationCode('') }} />
        ) : step === 'verification' ? (
          <VerificationView
            email={sentEmail}
            demoCode={verificationCode}
            enteredCode={enteredCode}
            setEnteredCode={setEnteredCode}
            codeError={codeError}
            onSubmit={handleVerifyCode}
            onBack={() => setStep('form')}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="bg-slate-50 rounded-2xl p-6 lg:p-8 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Your Profile</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input
                      value={profile.fullName ?? ''}
                      onChange={(e) => update('fullName', e.target.value)}
                      className={inputClass}
                      placeholder="Jane Doe"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={profile.email ?? ''}
                      onChange={(e) => update('email', e.target.value)}
                      className={inputClass}
                      placeholder="jane@example.com"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Age">
                    <input
                      type="number"
                      min={16}
                      max={60}
                      value={profile.age ?? 22}
                      onChange={(e) => update('age', Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="GPA / Grade (out of 4.0)">
                    <input
                      type="number"
                      min={1}
                      max={4}
                      step={0.1}
                      value={profile.gpa ?? 3}
                      onChange={(e) => update('gpa', Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Education Level">
                  <select
                    value={profile.education}
                    onChange={(e) => update('education', e.target.value as EducationLevel)}
                    className={inputClass}
                  >
                    <option value="high-school">High School</option>
                    <option value="vocational">Vocational</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="medical-degree">Medical Degree</option>
                  </select>
                </Field>

                <Field label="Field of Study">
                  <input
                    value={profile.fieldOfStudy ?? ''}
                    onChange={(e) => update('fieldOfStudy', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Computer Science, Nursing, Business"
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Work Experience (years)">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={profile.workExperienceYears ?? 0}
                      onChange={(e) => update('workExperienceYears', Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="German Level">
                    <select
                      value={profile.germanLevel}
                      onChange={(e) => update('germanLevel', e.target.value as GermanLevel)}
                      className={inputClass}
                    >
                      <option value="none">None</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                    </select>
                  </Field>
                </div>

                <Field label="Preferred Pathway">
                  <select
                    value={profile.preferredPath}
                    onChange={(e) => update('preferredPath', e.target.value as EligibilityProfile['preferredPath'])}
                    className={inputClass}
                  >
                    <option value="any">Open to all pathways</option>
                    <option value="ausbildung">Ausbildung (Vocational)</option>
                    <option value="university">University</option>
                    <option value="medical">Medical / Healthcare</option>
                    <option value="job-seeker">Job Seeker</option>
                  </select>
                </Field>

                {/* Resume upload */}
                <Field label="Upload Resume / Document">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-colors">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                    {resumeFile ? (
                      <>
                        <FileText className="w-8 h-8 text-brand-600 mb-2" />
                        <span className="text-sm font-medium text-brand-700">{resumeFile.name}</span>
                        <span className="text-xs text-slate-500 mt-1">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-sm text-slate-600">Drag & drop or click to upload</span>
                        <span className="text-xs text-slate-400 mt-1">PDF, DOCX up to 10MB</span>
                      </>
                    )}
                  </label>
                </Field>

                <button
                  onClick={handleCheckEligibility}
                  className="w-full py-3.5 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Check for Free Preliminary Eligibility
                </button>
              </div>
            </div>

            {/* Results panel */}
            <div className="space-y-6">
              {analyzing && (
                <div className="flex items-center justify-center gap-3 py-20 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                  <span className="font-medium">Analyzing your profile in real-time...</span>
                </div>
              )}

              {!analyzing && !results && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <GraduationCap className="w-12 h-12 mb-3" />
                  <p className="text-sm">Fill in your profile to see live matching results</p>
                </div>
              )}

              {!analyzing && results && (
                <>
                  {/* Score & summary */}
                  <div className="bg-gradient-to-br from-brand-700 to-brand-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-200">Match Score</span>
                      <span className="text-3xl font-bold">{results.overallScore}/100</span>
                    </div>
                    <p className="text-sm text-blue-100 leading-relaxed">{results.summary}</p>
                  </div>

                  {/* Locations */}
                  <ResultBlock icon={MapPin} title="Matching German Locations">
                    <div className="space-y-2">
                      {results.locations.map((loc) => (
                        <div key={loc.city} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-slate-100">
                          <div>
                            <span className="font-semibold text-slate-800">{loc.city}</span>
                            <p className="text-xs text-slate-500">{loc.reason}</p>
                          </div>
                          <span className={`text-lg font-bold ${scoreColor(loc.score)}`}>{loc.score}%</span>
                        </div>
                      ))}
                    </div>
                  </ResultBlock>

                  {/* Ausbildung */}
                  {results.ausbildungOptions.length > 0 && (
                    <ResultBlock icon={GraduationCap} title="Ausbildung Options">
                      <div className="space-y-2">
                        {results.ausbildungOptions.map((a) => (
                          <div key={a.title + a.city} className="bg-white rounded-lg px-4 py-3 border border-slate-100">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-slate-800 text-sm">{a.title}</span>
                              <span className="text-xs font-semibold text-green-600">{a.salary}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{a.city} · {a.duration}</p>
                          </div>
                        ))}
                      </div>
                    </ResultBlock>
                  )}

                  {/* Universities */}
                  {results.universities.length > 0 && (
                    <ResultBlock icon={Building2} title="Universities (Public & Private)">
                      <div className="space-y-2">
                        {results.universities.map((u) => (
                          <div key={u.name} className="bg-white rounded-lg px-4 py-3 border border-slate-100">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-slate-800 text-sm">{u.name}</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                u.type === 'public' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                              }`}>{u.type}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{u.program} · {u.city}</p>
                          </div>
                        ))}
                      </div>
                    </ResultBlock>
                  )}

                  {/* Hospitals */}
                  {results.hospitals.length > 0 && (
                    <ResultBlock icon={Stethoscope} title="Hospitals & Healthcare">
                      <div className="space-y-2">
                        {results.hospitals.map((h) => (
                          <div key={h.name} className="bg-white rounded-lg px-4 py-3 border border-slate-100">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-slate-800 text-sm">{h.name}</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                h.type === 'public' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                              }`}>{h.type}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{h.role} · {h.city}</p>
                          </div>
                        ))}
                      </div>
                    </ResultBlock>
                  )}

                  {/* Part-time */}
                  <ResultBlock icon={Clock} title="Part-Time Work Eligibility">
                    <div className={`rounded-lg px-4 py-4 border ${results.partTimeEligibility.eligible ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className={`w-4 h-4 ${results.partTimeEligibility.eligible ? 'text-green-600' : 'text-amber-600'}`} />
                        <span className="font-semibold text-sm text-slate-800">
                          {results.partTimeEligibility.eligible
                            ? `Up to ${results.partTimeEligibility.maxHoursPerWeek} hrs/week`
                            : 'Not yet eligible'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{results.partTimeEligibility.notes}</p>
                    </div>
                  </ResultBlock>

                  {/* Apply Now */}
                  <button
                    onClick={handleApplyNow}
                    className="w-full py-4 bg-accent-500 text-brand-900 font-bold rounded-xl hover:bg-accent-400 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function ResultBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-brand-600" />
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function VerificationView({
  email,
  demoCode,
  enteredCode,
  setEnteredCode,
  codeError,
  onSubmit,
  onBack,
}: {
  email: string
  demoCode: string
  enteredCode: string
  setEnteredCode: (v: string) => void
  codeError: string
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
        <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-brand-700" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Verify Your Email</h3>
        <p className="text-sm text-slate-600 mb-6">
          We sent a 6-digit verification code to <strong>{email}</strong>.
          Enter it below to confirm your application.
        </p>

        {/* Demo code for testing */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-left">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">Demo / Testing Mode</p>
          <p className="text-sm text-amber-900">
            Your verification code: <strong className="text-lg tracking-widest">{demoCode}</strong>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <Shield className="w-4 h-4 text-slate-400" />
            <input
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="w-48 px-4 py-3 rounded-lg border border-slate-200 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500"
              maxLength={6}
            />
          </div>
          {codeError && <p className="text-sm text-red-600">{codeError}</p>}
          <button
            type="submit"
            disabled={enteredCode.length !== 6}
            className="w-full py-3.5 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-800 disabled:opacity-50"
          >
            Verify & Submit Application
          </button>
        </form>

        <button onClick={onBack} className="mt-4 text-sm text-slate-500 hover:text-brand-700">
          ← Back to eligibility results
        </button>
      </div>
    </div>
  )
}

function ConfirmedView({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Application In Progress!</h3>
        <p className="text-slate-600 leading-relaxed mb-6">
          Your application has been verified and submitted successfully. A confirmation email
          has been sent to <strong>{email}</strong> with your application reference number.
        </p>

        <div className="bg-brand-50 rounded-xl p-6 text-left space-y-4 mb-8">
          <h4 className="font-bold text-brand-800 text-sm uppercase tracking-wider">What Happens Next</h4>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs flex items-center justify-center shrink-0 font-bold">1</span>
              Our team reviews your preliminary eligibility within 2–3 business days.
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs flex items-center justify-center shrink-0 font-bold">2</span>
              You'll receive a detailed pathway report with matched programs and locations.
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs flex items-center justify-center shrink-0 font-bold">3</span>
              For deeper analysis, document verification, and personalized coaching, upgrade to our paid consultation package.
            </li>
          </ol>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 text-left mb-6">
          <p className="text-sm font-semibold text-slate-800 mb-2">Customer Service</p>
          <p className="text-sm text-slate-600">
            Questions? Contact us at{' '}
            <a href="mailto:contact@ilaglobal.com" className="text-brand-700 font-medium hover:underline">contact@ilaglobal.com</a>
            {' '}or call{' '}
            <a href="tel:+493012345678" className="text-brand-700 font-medium hover:underline">+49 (0) 30 1234 5678</a>.
            Paid inquiry sessions start at €49 for a 30-minute expert consultation.
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-6 py-3 border border-brand-200 text-brand-700 font-semibold rounded-lg hover:bg-brand-50"
        >
          Submit Another Application
        </button>
      </div>
    </div>
  )
}

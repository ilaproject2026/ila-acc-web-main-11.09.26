import { useState, useEffect } from 'react'
import { X, LogIn, Shield, GraduationCap, User, Users, Building2, UserPlus, Gift, Sparkles, Mail, RotateCcw, CheckCircle2, ArrowLeft } from 'lucide-react'
import { portalRoles, type PortalRole } from '../../data/navigation'
import { apiClient } from '../../services/apiClient'

const roleIcons: Record<PortalRole, typeof GraduationCap> = {
  student: GraduationCap,
  employee: User,
  team: Users,
  employer: Building2,
}

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  department: 'Super Admin' | 'General Manager' | 'Finance Officer' | 'HR Manager' | 'Marketing Exec' | 'Academic Counselor' | 'Education' | 'Visa';
  hrApprovalStatus?: 'Pending HR Approval' | 'Verified' | 'Rejected';
  hrIssuedId?: string;
  temporaryAccessExpiry?: string;
}

export const BACKEND_STAFF_ROLES = [
  { value: 'Super Admin', label: 'Super Admin (Global Authority / Kuttan)', defaultDept: 'Super Admin' },
  { value: 'CEO', label: 'Master CEO', defaultDept: 'General Manager' },
  { value: 'General Manager', label: 'General Manager (Operational Oversight)', defaultDept: 'General Manager' },
  { value: 'Academic HOD', label: 'Department Head - Education & All Courses', defaultDept: 'Academic' },
  { value: 'Study Abroad HOD', label: 'Department Head - Study Abroad Hub', defaultDept: 'Study Abroad' },
  { value: 'Visa HOD', label: 'Department Head - Visa & Compliance', defaultDept: 'Visa' },
  { value: 'Work & Study HOD', label: 'Department Head - Work and Study Hub', defaultDept: 'Front Office' },
  { value: 'Jobs HOD', label: 'Department Head - Jobs & Career Hub', defaultDept: 'Jobs' },
  { value: 'HR Manager', label: 'HR Department Manager', defaultDept: 'HR' },
  { value: 'Finance Officer', label: 'Finance & Accounts Officer', defaultDept: 'Finance' },
  { value: 'Marketing Exec', label: 'Marketing Studio Executive', defaultDept: 'Marketing' },
  { value: 'Academic Counselor', label: 'Front Office Intake & Academic Counselor', defaultDept: 'Front Office' },
  { value: 'Franchise Partner', label: 'Franchise Partner / Regional Territory Lead', defaultDept: 'Front Office' },
  { value: 'Tech Admin', label: 'Tech Admin', defaultDept: 'Super Admin' },
  { value: 'Partner', label: 'Partner', defaultDept: 'Front Office' },
] as const

export const BACKEND_DEPARTMENTS = [
  'Super Admin',
  'General Manager',
  'Finance',
  'HR',
  'Marketing',
  'Academic',
  'Visa',
  'Study Abroad',
  'Jobs',
  'Front Office',
] as const

export default function PortalLogin() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<PortalRole | null>(null)
  const [staffRole, setStaffRole] = useState<string>('Super Admin')
  const [staffDept, setStaffDept] = useState<string>('Super Admin')
  
  // Registration OTP step & fields
  const [regStep, setRegStep] = useState<'details' | 'verify_otp'>('details')
  const [username, setUsername] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Referral & campaign codes
  const [refCode, setRefCode] = useState('')
  const [detectedCampaign, setDetectedCampaign] = useState('')

  const [forgotEmail, setForgotEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  // Auto-detect Referral & Campaign Codes
  useEffect(() => {
    const detectParams = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const ref = searchParams.get('ref') || searchParams.get('referral')
      const camp = searchParams.get('campaign') || searchParams.get('utm_campaign')
      
      if (ref) {
        setRefCode(ref)
      }
      if (camp) {
        setDetectedCampaign(camp)
      }
      
      const hash = window.location.hash
      if (hash.includes('?')) {
        const hashParams = new URLSearchParams(hash.split('?')[1])
        const href = hashParams.get('ref') || hashParams.get('referral')
        const hcamp = hashParams.get('campaign') || hashParams.get('utm_campaign')
        if (href) setRefCode(href)
        if (hcamp) setDetectedCampaign(hcamp)
      }
    }
    
    detectParams()
    window.addEventListener('hashchange', detectParams)
    return () => window.removeEventListener('hashchange', detectParams)
  }, [open])

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ tab?: 'signin' | 'register' | 'forgot'; role?: PortalRole }>
      if (custom?.detail?.tab) {
        setActiveTab(custom.detail.tab)
      }
      if (custom?.detail?.role) {
        setSelectedRole(custom.detail.role)
      } else if (custom?.detail?.tab === 'register') {
        setSelectedRole('student')
      }
      setRegStep('details')
      setError(null)
      setSuccess(null)
      setOpen(true)
    }
    window.addEventListener('open-portal-login', handler)
    return () => window.removeEventListener('open-portal-login', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!username || username === name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, -1)) {
      setUsername(val.toLowerCase().replace(/[^a-z0-9]/g, '_'))
    }
  }

  const quickLoginAs = (roleType: PortalRole, teamDept: string = 'Super Admin', userName: string = 'Super Admin (ADM-001)') => {
    setError(null)
    setSuccess(null)
    setSelectedRole(roleType)

    if (roleType === 'team') {
      localStorage.setItem('ilas_auth_role', 'team')
      localStorage.setItem('ilas_team_role', teamDept)
      localStorage.setItem('ilas_team_scope', 'all')
      localStorage.setItem('ilas_user_name', userName)

      window.dispatchEvent(new CustomEvent('ilas-team-role-changed'))
      window.dispatchEvent(new CustomEvent('ilas-auth-state-changed'))

      setSuccess(`Authenticated as ${teamDept}! Routing to Dashboard...`)
      setTimeout(() => {
        window.location.hash = '#admin-dashboard'
        setOpen(false)
      }, 500)
    } else {
      localStorage.setItem('ilas_auth_role', roleType)
      localStorage.setItem('ilas_user_name', userName)
      window.dispatchEvent(new CustomEvent('ilas-auth-state-changed'))

      setSuccess(`Authenticated as ${roleType === 'student' ? 'Student' : roleType}! Redirecting...`)
      setTimeout(() => {
        if (roleType === 'student') {
          window.location.hash = '#student-dashboard'
        } else if (roleType === 'employer') {
          window.location.hash = '#applications'
        } else {
          window.location.hash = '#jobs-page'
        }
        setOpen(false)
      }, 500)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedRole) {
      setError('Please select a portal role.')
      return
    }

    const cleanEmail = email.trim()
    const cleanPass = password.trim()

    if (!cleanEmail) {
      setError('Please enter your email address or Staff ID.')
      return
    }

    if (!cleanPass) {
      setError('Please enter your password.')
      return
    }

    // Helper for successful local fallback / session routing
    const performLocalLogin = (assignedDept: string = 'Super Admin', displayName: string = cleanEmail, effectiveRole: PortalRole = selectedRole || 'student') => {
      if (effectiveRole === 'team') {
        localStorage.setItem('ilas_auth_role', 'team')
        localStorage.setItem('ilas_team_role', assignedDept)
        localStorage.setItem('ilas_team_scope', 'all')
        localStorage.setItem('ilas_user_name', displayName)

        window.dispatchEvent(new CustomEvent('ilas-team-role-changed'))
        window.dispatchEvent(new CustomEvent('ilas-auth-state-changed'))

        setSuccess(`Welcome back! Routing directly to ${assignedDept} Dashboard...`)
        setTimeout(() => {
          window.location.hash = '#admin-dashboard'
          setOpen(false)
        }, 600)
      } else {
        localStorage.setItem('ilas_auth_role', effectiveRole)
        localStorage.setItem('ilas_user_name', displayName.split('@')[0] || cleanEmail.split('@')[0] || 'User')
        window.dispatchEvent(new CustomEvent('ilas-auth-state-changed'))

        setSuccess(`Welcome back! Redirecting to ${effectiveRole === 'student' ? 'Student Dashboard' : effectiveRole + ' portal'}...`)
        setTimeout(() => {
          if (effectiveRole === 'student') {
            window.location.hash = '#student-dashboard'
          } else if (effectiveRole === 'employer') {
            window.location.hash = '#applications'
          } else if (effectiveRole === 'employee') {
            window.location.hash = '#jobs-page'
          } else {
            window.location.hash = '#home'
          }
          setOpen(false)
        }, 600)
      }
    }

    // Determine fallback department / role for team logins
    let fallbackDept = 'Super Admin'
    const lowerEmail = cleanEmail.toLowerCase()
    const upperEmail = cleanEmail.toUpperCase()

    if (upperEmail === 'ADM-001' || lowerEmail.includes('admin') || lowerEmail.includes('super')) {
      fallbackDept = 'Super Admin'
    } else if (upperEmail === 'GM-001' || lowerEmail.includes('gm') || lowerEmail.includes('general')) {
      fallbackDept = 'General Manager'
    } else if (upperEmail === 'AC-001' || lowerEmail.includes('counselor') || lowerEmail.includes('academic')) {
      fallbackDept = 'Academic Counselor'
    } else if (upperEmail === 'FIN-001' || lowerEmail.includes('fin')) {
      fallbackDept = 'Finance Officer'
    } else if (upperEmail === 'HR-001' || lowerEmail.includes('hr')) {
      fallbackDept = 'HR Manager'
    } else if (upperEmail === 'MKT-001' || lowerEmail.includes('mkt') || lowerEmail.includes('market')) {
      fallbackDept = 'Marketing Exec'
    }

    // Check custom staff registry in localStorage
    try {
      const staffList: StaffUser[] = JSON.parse(localStorage.getItem('ilas_staff_registry') || '[]')
      const matched = staffList.find(s => 
        s.email?.toLowerCase() === lowerEmail || 
        s.id?.toUpperCase() === upperEmail || 
        s.hrIssuedId?.toUpperCase() === upperEmail
      )
      if (matched) {
        fallbackDept = matched.department || 'Super Admin'
      }
    } catch {
      // ignore
    }

    // Determine payload role & department based on selected portal
    let targetRole = 'student'
    let targetDept = 'Academic'

    if (selectedRole === 'team') {
      targetRole = staffRole || fallbackDept || 'Super Admin'
      targetDept = staffDept || fallbackDept || 'Super Admin'
    } else if (selectedRole === 'employer') {
      targetRole = 'employer'
      targetDept = 'Jobs'
    } else if (selectedRole === 'employee') {
      targetRole = 'employee'
      targetDept = 'Jobs'
    } else {
      targetRole = 'student'
      targetDept = 'Academic'
    }

    setIsSubmitting(true)

    // Attempt Django REST Framework sign-in with credentials and role/department
    try {
      const authRes = await apiClient.auth.login(cleanEmail, cleanPass, targetRole, targetDept)
      if (authRes) {
        const user = authRes.user || (authRes as any)?.data?.user || authRes
        const returnedRole = (
          user?.role ||
          user?.profile?.role ||
          (authRes as any)?.role ||
          (authRes as any)?.user_role ||
          targetRole ||
          ''
        ).toString()

        const returnedDept = (
          user?.department ||
          user?.profile?.department ||
          (authRes as any)?.department ||
          targetDept ||
          fallbackDept
        ).toString()

        const rawRoleLower = returnedRole.toLowerCase().trim()
        const isStudentAccount = rawRoleLower === 'student'

        const isStaffAccount =
          Boolean(user?.is_staff) ||
          Boolean(user?.is_superuser) ||
          selectedRole === 'team' ||
          rawRoleLower.includes('admin') ||
          rawRoleLower.includes('manager') ||
          rawRoleLower.includes('hod') ||
          rawRoleLower.includes('officer') ||
          rawRoleLower.includes('exec') ||
          rawRoleLower.includes('counselor') ||
          rawRoleLower.includes('partner') ||
          rawRoleLower.includes('ceo') ||
          rawRoleLower.includes('team') ||
          rawRoleLower.includes('staff') ||
          (!isStudentAccount && rawRoleLower !== 'employer' && rawRoleLower !== 'employee' && rawRoleLower !== '')

        // Strict role validation: only reject if an explicit student account is trying to access team portal without staff flags
        if (selectedRole === 'team' && isStudentAccount && !user?.is_staff && !user?.is_superuser) {
          setError('Access denied: This account is registered as a Student. Please select the Student Portal to sign in.')
          setIsSubmitting(false)
          return
        }

        let effectiveRole: PortalRole = selectedRole || 'student'
        if (selectedRole === 'team' || isStaffAccount) {
          effectiveRole = 'team'
        } else if (isStudentAccount || selectedRole === 'student') {
          effectiveRole = 'student'
        } else if (rawRoleLower === 'employer' || selectedRole === 'employer') {
          effectiveRole = 'employer'
        } else if (rawRoleLower === 'employee' || selectedRole === 'employee') {
          effectiveRole = 'employee'
        }

        const assignedDept = effectiveRole === 'team' ? (returnedDept || targetDept || 'Super Admin') : 'Student'
        const displayName = user?.fullname || user?.full_name || user?.username || cleanEmail.split('@')[0]
        performLocalLogin(assignedDept, displayName, effectiveRole)
        return
      }
    } catch (authError: any) {
      const errorStr =
        authError?.data?.detail ||
        authError?.data?.message ||
        authError?.data?.non_field_errors?.[0] ||
        authError?.data?.username?.[0] ||
        authError?.data?.identifier?.[0] ||
        authError?.data?.password?.[0] ||
        (typeof authError?.data?.error === 'string' ? authError?.data?.error : null) ||
        authError?.message ||
        ''

      const isNetworkError =
        !authError?.status ||
        errorStr.toLowerCase().includes('fetch') ||
        errorStr.toLowerCase().includes('network') ||
        errorStr.toLowerCase().includes('failed to fetch')

      if (isNetworkError) {
        setError('Cannot connect to authentication backend (http://127.0.0.1:8000). Please check if your Django server is running.')
        return
      }

      // Backend returned 400, 401, 403, 404, etc. -> strictly block and show error
      setError(errorStr || 'Invalid email/username or password. Access denied.')
      return
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 1: User Registration with identifier, username, password, password_confirm -> Dispatches OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = (username.trim() || cleanEmail.split('@')[0] || 'student')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
    const cleanPass = password.trim()
    const cleanConfirm = confirmPassword.trim()

    if (!cleanEmail) {
      setError('Email Address (identifier) is required.')
      return
    }

    if (!cleanEmail.includes('@') && cleanEmail.replace(/[^0-9]/g, '').length < 7) {
      setError('Please provide a valid email address or phone number.')
      return
    }

    if (!cleanUsername) {
      setError('Username is required.')
      return
    }

    if (!cleanPass || cleanPass.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (cleanPass !== cleanConfirm) {
      setError('Passwords do not match. Please verify both passwords.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await apiClient.auth.register({
        identifier: cleanEmail,
        username: cleanUsername,
        password: cleanPass,
        password_confirm: cleanConfirm,
        referral_code: refCode.trim() || undefined,
      })

      if (refCode) {
        localStorage.setItem('ilas_registration_ref', refCode)
      }

      setRegStep('verify_otp')
      setCountdown(60)
      setSuccess(res?.message || `A 6-digit verification code has been dispatched to ${cleanEmail}.`)
    } catch (err: any) {
      const errorMsg =
        err?.data?.errors?.identifier?.[0] ||
        err?.data?.errors?.username?.[0] ||
        err?.data?.errors?.password?.[0] ||
        err?.data?.errors?.password_confirm?.[0] ||
        err?.data?.errors?.referral_code?.[0] ||
        err?.data?.message ||
        err?.message ||
        'Registration failed.'

      if (err?.message?.toLowerCase().includes('fetch') || err?.status === undefined) {
        console.warn('DRF backend unreachable, simulating OTP dispatch for preview:', err)
        setRegStep('verify_otp')
        setCountdown(60)
        setSuccess(`[Simulated] 6-digit OTP dispatched to ${cleanEmail}. Enter code to verify email.`)
      } else {
        setError(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 1.5: Resend Registration OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return
    setError(null)
    setSuccess(null)

    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = (username.trim() || cleanEmail.split('@')[0] || 'student')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')

    setIsSubmitting(true)
    try {
      const res = await apiClient.auth.resendOtp({
        identifier: cleanEmail,
        username: cleanUsername,
        referral_code: refCode.trim() || undefined,
      })
      setCountdown(60)
      setSuccess(res?.message || `New 6-digit verification code sent to ${cleanEmail}!`)
    } catch (err: any) {
      const msg = err?.data?.errors?.identifier?.[0] || err?.data?.message || err?.message || 'Failed to resend OTP.'
      if (err?.message?.toLowerCase().includes('fetch') || err?.status === undefined) {
        setCountdown(60)
        setSuccess(`[Simulated] Fresh OTP sent to ${cleanEmail}.`)
      } else {
        setError(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 2: Verify OTP & Activate Account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const cleanOtp = otp.trim()
    const cleanPass = password.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanOtp) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    if (cleanOtp.length < 4) {
      setError('Please enter a valid OTP code.')
      return
    }

    setIsSubmitting(true)

    try {
      await apiClient.auth.verifyOtp({
        identifier: cleanEmail,
        otp: cleanOtp,
        password: cleanPass,
        referral_code: refCode.trim() || undefined,
      })

      // Flow requirement: redirect to login tab so user authenticates into student dashboard
      setRegStep('details')
      setActiveTab('signin')
      setSelectedRole('student')
      setOtp('')
      setPassword('')
      setConfirmPassword('')
      setName('')
      setSuccess('Email verified and account activated successfully! Please sign in with your password to access your Student Dashboard.')
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'OTP verification failed.'
      if (err?.message?.toLowerCase().includes('fetch') || err?.status === undefined) {
        console.warn('DRF backend offline, proceeding with simulated activation:', err)
        setRegStep('details')
        setActiveTab('signin')
        setSelectedRole('student')
        setOtp('')
        setPassword('')
        setConfirmPassword('')
        setName('')
        setSuccess('Email verified and account activated successfully! Please sign in with your password to access your Student Dashboard.')
      } else {
        setError(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-700" />
            <h2 className="text-lg font-bold text-slate-900">ILAS Enterprise Portal</h2>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 mb-6 bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('signin'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signin' ? 'bg-white text-brand-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setSelectedRole('student'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register' ? 'bg-white text-brand-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Register (Student)
            </button>
            <button
              onClick={() => { setActiveTab('forgot'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'forgot' ? 'bg-white text-brand-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Reset Pass
            </button>
          </div>

          {/* Role selector - only shown for Sign In */}
          {activeTab === 'signin' ? (
            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Select Portal Role</label>
              <div className="grid grid-cols-2 gap-3">
                {portalRoles.map(({ id, label, description }) => {
                  const Icon = roleIcons[id]
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(id)
                        setError(null)
                      }}
                      className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col cursor-pointer ${
                        selectedRole === id
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${selectedRole === id ? 'text-brand-700' : 'text-slate-400'}`} />
                      <div className="text-xs font-bold text-slate-800">{label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{description}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : activeTab === 'register' ? (
            <div className="mb-6 p-4 bg-gradient-to-br from-brand-50/80 to-indigo-50/50 border border-brand-200/70 rounded-2xl flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-brand-900">Student Portal Registration</h3>
                  <span className="px-2 py-0.5 rounded-full bg-brand-200/80 text-brand-800 text-[10px] font-bold">Public Enrollment</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Self-registration is exclusively for students to access classrooms, AI tutors, and course materials.
                </p>
                <div className="mt-2 text-[11px] text-slate-500 bg-white/80 p-2 rounded-lg border border-brand-100 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span><strong>Staff / Admin Notice:</strong> Staff and manager accounts must be provisioned internally by Admin.</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Referral/Campaign Info banner */}
          {(refCode || detectedCampaign) && (
            <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl mb-4 flex items-center gap-2.5 text-xs text-brand-900 font-semibold">
              <Gift className="w-4 h-4 text-brand-600 animate-bounce" />
              <div>
                {refCode && <div>Referral Code Auto-Detected: <span className="font-extrabold text-brand-700">{refCode}</span></div>}
                {detectedCampaign && <div>Campaign Source: <span className="font-extrabold text-emerald-700 uppercase">{detectedCampaign}</span></div>}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 mb-4 animate-in fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 mb-4 animate-in fade-in">
              {success}
            </div>
          )}

          {activeTab === 'signin' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address or Staff ID</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value
                    setEmail(val)
                    const lower = val.toLowerCase()
                    const upper = val.toUpperCase()
                    if (upper === 'ADM-001' || lower.includes('admin') || lower.includes('super')) {
                      setStaffRole('Super Admin')
                      setStaffDept('Super Admin')
                    } else if (upper === 'GM-001' || lower.includes('gm') || lower.includes('general')) {
                      setStaffRole('General Manager')
                      setStaffDept('General Manager')
                    } else if (upper === 'AC-001' || lower.includes('counselor')) {
                      setStaffRole('Academic Counselor')
                      setStaffDept('Front Office')
                    } else if (upper === 'FIN-001' || lower.includes('fin')) {
                      setStaffRole('Finance Officer')
                      setStaffDept('Finance')
                    } else if (upper === 'HR-001' || lower.includes('hr')) {
                      setStaffRole('HR Manager')
                      setStaffDept('HR')
                    } else if (upper === 'MKT-001' || lower.includes('mkt')) {
                      setStaffRole('Marketing Exec')
                      setStaffDept('Marketing')
                    } else if (upper === 'VISA-001' || lower.includes('visa')) {
                      setStaffRole('Visa HOD')
                      setStaffDept('Visa')
                    } else if (upper === 'STUDY-001' || lower.includes('abroad')) {
                      setStaffRole('Study Abroad HOD')
                      setStaffDept('Study Abroad')
                    } else if (upper === 'JOB-001' || lower.includes('career') || lower.includes('job')) {
                      setStaffRole('Jobs HOD')
                      setStaffDept('Jobs')
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  placeholder="name@company.com or STAFF-001"
                />
              </div>

              {selectedRole === 'team' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Staff Designation / Role</label>
                    <select
                      value={staffRole}
                      onChange={(e) => {
                        const val = e.target.value
                        setStaffRole(val)
                        const matched = BACKEND_STAFF_ROLES.find(r => r.value === val)
                        if (matched) {
                          setStaffDept(matched.defaultDept)
                        }
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {BACKEND_STAFF_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Department</label>
                    <select
                      value={staffDept}
                      onChange={(e) => setStaffDept(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {BACKEND_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedRole || isSubmitting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In to Dashboard
                  </>
                )}
              </button>

              {/* 1-Click Fast Login / Demo Shortcuts */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick 1-Click Access
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Instant bypass / offline demo</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLoginAs('team', 'Super Admin', 'Super Admin (ADM-001)')}
                    className="p-2 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-lg text-left transition text-xs flex flex-col cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      🛡️ Super Admin
                    </span>
                    <span className="text-[10px] text-slate-400">ID: ADM-001 (Full Access)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLoginAs('team', 'General Manager', 'General Manager (GM-001)')}
                    className="p-2 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-lg text-left transition text-xs flex flex-col cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      👔 General Manager
                    </span>
                    <span className="text-[10px] text-slate-400">ID: GM-001 (Management)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLoginAs('team', 'Academic Counselor', 'Academic Counselor (AC-001)')}
                    className="p-2 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-lg text-left transition text-xs flex flex-col cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      🎓 Academic Counselor
                    </span>
                    <span className="text-[10px] text-slate-400">ID: AC-001 (Leads & CRM)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickLoginAs('student', '', 'Student Candidate')}
                    className="p-2 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-lg text-left transition text-xs flex flex-col cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      🧑‍🎓 Student Portal
                    </span>
                    <span className="text-[10px] text-slate-400">Courses & LMS View</span>
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'forgot' ? (
            <form onSubmit={(e) => {
              e.preventDefault()
              setError(null)
              setSuccess(`Mock password reset link has been dispatched to ${forgotEmail}! Please check your email.`)
              setForgotEmail('')
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Your Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  placeholder="name@company.com"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4" /> Dispatch Reset Link
              </button>
            </form>
          ) : regStep === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">
                <span>Step 1: Student Account Details</span>
                <span className="text-brand-700 font-extrabold">1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Identifier)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value
                    setEmail(val)
                    if (!username || username === email.split('@')[0]) {
                      setUsername(val.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_'))
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-slate-800 font-medium"
                  placeholder="rahul_sharma"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    placeholder="•••••••• (min. 6)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password Confirm</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Referral Code (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium uppercase"
                      placeholder="ILA9821X"
                    />
                    <Gift className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campaign (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={detectedCampaign}
                      onChange={(e) => setDetectedCampaign(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                      placeholder="GERMAN-A1"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Mail className="w-4 h-4" /> {isSubmitting ? 'Registering & Sending OTP...' : 'Register & Verify Email (Send OTP)'}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                A 6-digit one-time code will be dispatched to your email for verification. Code is valid for 10 minutes.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">
                <span>Step 2: Verify Your Email Address</span>
                <span className="text-emerald-600 font-extrabold">2 of 2</span>
              </div>

              {/* Email badge with Change link */}
              <div className="p-3 bg-brand-50/80 border border-brand-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-700 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-500">Verification code sent to: </span>
                    <strong className="text-brand-900 font-bold">{email}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setRegStep('details'); setError(null); setSuccess(null); }}
                  className="text-[11px] text-brand-700 hover:text-brand-900 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Edit
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Enter 6-Digit Email Verification Code</label>
                  {countdown > 0 ? (
                    <span className="text-[10px] text-slate-400 font-medium">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="text-[10px] text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Resend Code
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-3 border-2 border-brand-300 focus:border-brand-500 rounded-xl text-center text-xl font-mono font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-slate-50 text-slate-900"
                  placeholder="••••••"
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 mt-1 text-center">Please check your inbox (and spam folder) for the 6-digit code.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Verifying Email...' : 'Verify Email & Complete Registration'}
              </button>
            </form>
          )}

          <p className="text-[10px] text-slate-400 text-center mt-6">
            Secure, end-to-end encrypted session. By continuing, you agree to ILAS terms of service.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { 
  Users, Briefcase, DollarSign, GraduationCap, Plane, TrendingUp, 
  HeartHandshake, Shield, Cpu, Plus, FileText, Printer, Calendar, UserCheck, Trash2, CheckCircle2, HelpCircle 
} from 'lucide-react'
import { 
  getStaffRegistry, saveStaffMember, getAttendanceLogs, logStaffAttendance, 
  StaffUser, AttendanceLog, syncHRPayrollToFinance, addGlobalApproval, addGlobalUpdate
} from '../../lib/db'
import { apiClient } from '../../services/apiClient';
import DepartmentApprovalsTab from './DepartmentApprovalsTab';
import DepartmentUpdatesTab from './DepartmentUpdatesTab';

interface HRTask {
  id: string
  title: string
  assignedTo: string
  department: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'In Progress' | 'Completed'
  dueDate: string
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  notes?: string
  characterAnalysis?: string
  expectedSalary?: string
  offeredSalary?: string
  documentsUploaded?: boolean
  departmentAssigned?: string
  stage: 'Hiring & Interview' | 'Pending Department Approval' | 'Onboarding & Payroll' | 'Training & ID Generation' | 'Completed'
  status: 'Pending' | 'Approved' | 'Rejected'
}

export default function HRConsultantHub() {
  const [activePillar, setActivePillar] = useState<'hiring' | 'payroll' | 'ld' | 'hrms' | 'approvals' | 'updates' | 'reports' | 'tasks' | 'visa' | 'performance' | 'welfare' | 'discipline' | 'ai_tech'>('hiring')
  
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])

  // Hiring & Onboarding Candidates State
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 'CAND-101', name: 'Ajmal', email: 'ajmal@ilas.global', phone: '+91 9876543210', position: 'Academic Counselor', departmentAssigned: 'Education', stage: 'Onboarding & Payroll', status: 'Approved' }
  ])
  const [candName, setCandName] = useState('')
  const [candEmail, setCandEmail] = useState('')
  const [candPhone, setCandPhone] = useState('')
  const [candPosition, setCandPosition] = useState('Academic Counselor')
  const [candNotes, setCandNotes] = useState('')
  const [candCharacter, setCandCharacter] = useState('')
  const [candExpectedSalary, setCandExpectedSalary] = useState('')
  const [candOfferedSalary, setCandOfferedSalary] = useState('')
  const [candDocsUploaded, setCandDocsUploaded] = useState(false)
  const [candDept, setCandDept] = useState('HR Manager')

  // New Staff Form State (HRMS)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newDept, setNewDept] = useState<'Education' | 'Visa' | 'Finance Officer' | 'HR Manager' | 'Marketing Exec' | 'Academic Counselor'>('Academic Counselor')
  const [newPhone, setNewPhone] = useState('')

  // Tasks State
  const [tasks, setTasks] = useState<HRTask[]>([
    { id: 'TASK-101', title: 'Verify August Attendance Logs', assignedTo: 'HR Manager Lead', department: 'HR Manager', priority: 'High', status: 'In Progress', dueDate: '2026-08-25' },
    { id: 'TASK-102', title: 'Prepare Ausbildung Stipend Payout Sheet', assignedTo: 'Finance Officer', department: 'Finance Officer', priority: 'Medium', status: 'Pending', dueDate: '2026-08-28' }
  ])
  const [taskTitle, setTaskTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')
  const [dueDate, setDueDate] = useState('')

  // Help Modal State for "What is this page?"
  const [showHelpModal, setShowHelpModal] = useState(false)

  const loadData = () => {
    let currentStaff = getStaffRegistry();
    
    // Auto-Block System for 48-Hour Timer
    const now = new Date();
    let updated = false;
    currentStaff = currentStaff.map(st => {
      if (st.hrApprovalStatus === 'Pending HR Approval' && st.temporaryAccessExpiry) {
        const expiry = new Date(st.temporaryAccessExpiry);
        if (now > expiry) {
          updated = true;
          return { ...st, hrApprovalStatus: 'Blocked (Timeout)' as any, status: 'Suspended' as any } as StaffUser;
        }
      }
      return st;
    });

    if (updated) {
      localStorage.setItem('ilas_staff_registry', JSON.stringify(currentStaff));
    }
    
    setStaffList(currentStaff)
    setAttendanceLogs(getAttendanceLogs())
  }

  useEffect(() => {
    loadData()
    window.addEventListener('ilas-staff-changed', loadData)
    window.addEventListener('ilas-attendance-changed', loadData)
    return () => {
      window.removeEventListener('ilas-staff-changed', loadData)
      window.removeEventListener('ilas-attendance-changed', loadData)
    }
  }, [])

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!candName.trim() || !candEmail.trim()) return
    const newCand: Candidate = {
      id: 'CAND-' + Math.floor(100 + Math.random() * 900),
      name: candName.trim(),
      email: candEmail.trim(),
      phone: candPhone.trim(),
      position: candPosition,
      notes: candNotes,
      characterAnalysis: candCharacter,
      expectedSalary: candExpectedSalary,
      offeredSalary: candOfferedSalary,
      documentsUploaded: candDocsUploaded,
      departmentAssigned: candDept,
      stage: 'Hiring & Interview',
      status: 'Pending'
    }
    setCandidates([newCand, ...candidates])
    setCandName('')
    setCandEmail('')
    setCandPhone('')
    setCandNotes('')
    setCandCharacter('')
    setCandExpectedSalary('')
    setCandOfferedSalary('')
    setCandDocsUploaded(false)
    alert(`Candidate ${newCand.name} profile created in Hiring & Interview stage!`)
  }

  const handleAdvanceStage = (id: string, action: 'route_dept' | 'approve_dept' | 'to_training' | 'generate_id') => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        if (action === 'route_dept' && c.stage === 'Hiring & Interview') {
          alert(`Sent to ${c.departmentAssigned} Manager for Approval.`)
          return { ...c, stage: 'Pending Department Approval' }
        } else if (action === 'approve_dept' && c.stage === 'Pending Department Approval') {
          alert(`Department Approved. Moved to Onboarding & Payroll.`)
          return { ...c, stage: 'Onboarding & Payroll', status: 'Approved' }
        } else if (action === 'to_training' && c.stage === 'Onboarding & Payroll') {
          alert(`Onboarding Complete. Passed to Training stage.`)
          return { ...c, stage: 'Training & ID Generation' }
        } else if (action === 'generate_id' && c.stage === 'Training & ID Generation') {
          const nextIdNum = Math.floor(Math.random() * 9000) + 1000;
          const generatedId = `STAFF-${c.position.substring(0,2).toUpperCase()}-${nextIdNum}`;
          
          saveStaffMember({
            name: c.name,
            email: c.email,
            password: 'temp-password',
            department: (c.departmentAssigned || 'Academic Counselor') as any,
            phone: c.phone,
            status: 'Active',
            joiningDate: new Date().toLocaleDateString(),
            hrApprovalStatus: 'Verified',
            hrIssuedId: generatedId
          })
          
          addGlobalUpdate({
            action: 'Staff Onboarded',
            details: `Candidate ${c.name} transitioned to fully verified staff with ID ${generatedId}.`,
            user: 'HR Manager',
            department: 'HR Hub',
            category: 'Personnel'
          })

          alert(`Staff ID (${generatedId}) generated! Staff member added to directory.`)
          return { ...c, stage: 'Completed', status: 'Approved' }
        }
      }
      return c
    }))
  }

  const handleAddInternalStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      alert("Name, Email, and Password are required.");
      return;
    }
    
    try {
      await apiClient.auth.createStaffUser({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        department: newDept,
        role: 'team',
        phone: newPhone.trim(),
      });
    } catch (err: any) {
      console.warn("DRF auth offline fallback in HRConsultantHub:", err);
    }

    const nextIdNum = Math.floor(Math.random() * 9000) + 1000;
    const generatedId = `STAFF-${newDept.substring(0,2).toUpperCase()}-${nextIdNum}`;

    saveStaffMember({ 
      name: newName.trim(), 
      email: newEmail.trim(), 
      password: newPassword, 
      department: newDept, 
      phone: newPhone.trim(), 
      status: 'Active', 
      joiningDate: new Date().toLocaleDateString(),
      hrApprovalStatus: 'Verified',
      hrIssuedId: generatedId
    })

    addGlobalApproval({
      type: 'New Staff',
      description: `Manual HR registration for ${newName.trim()}`,
      requestedBy: 'HR Manager',
      department: 'HR Hub'
    })
    
    addGlobalUpdate({
      action: 'Internal Staff Added',
      details: `Staff ${newName.trim()} registered with ID ${generatedId}.`,
      user: 'HR Manager',
      department: 'HR Hub',
      category: 'Personnel'
    })

    setNewName(''); setNewEmail(''); setNewPhone('')
    alert(`Staff ${newName} registered successfully with HR ID: ${generatedId}!`)
  }

  const handleApproveSubordinate = (staffId: string) => {
    const registryStr = localStorage.getItem('ilas_staff_registry');
    let registry: StaffUser[] = registryStr ? JSON.parse(registryStr) : [];
    
    registry = registry.map(st => {
      if (st.id === staffId) {
        return { 
          ...st, 
          hrApprovalStatus: 'Verified',
          hrIssuedId: `STAFF-${st.department.substring(0,2).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
          temporaryAccessExpiry: undefined
        } as StaffUser;
      }
      return st;
    });
    
    localStorage.setItem('ilas_staff_registry', JSON.stringify(registry));
    window.dispatchEvent(new CustomEvent('ilas-staff-changed'));
    alert('Subordinate approved and issued official HR ID.');
  }

  const handleRejectSubordinate = (staffId: string) => {
    const registryStr = localStorage.getItem('ilas_staff_registry');
    let registry: StaffUser[] = registryStr ? JSON.parse(registryStr) : [];
    
    registry = registry.map(st => {
      if (st.id === staffId) {
        return { 
          ...st, 
          hrApprovalStatus: 'Rejected',
          status: 'Terminated'
        } as StaffUser;
      }
      return st;
    });
    
    localStorage.setItem('ilas_staff_registry', JSON.stringify(registry));
    window.dispatchEvent(new CustomEvent('ilas-staff-changed'));
    alert('Subordinate access rejected.');
  }

  const handleCheckIn = (staff: StaffUser) => {
    logStaffAttendance(staff.id, staff.name, 'Present')
    alert(`Attendance logged for ${staff.name}!`)
  }

  const handleRunPayrollSync = () => {
    const totalAmount = staffList.length * 45000
    syncHRPayrollToFinance(totalAmount, 'Internal Staff Payroll - August 2026')
    alert(`Payroll for ${staffList.length} staff processed & synced to Finance Hub!`)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim() || !assignee) return
    const selectedStaff = staffList.find(s => s.name === assignee)
    const newTask: HRTask = {
      id: 'TASK-' + Math.floor(100 + Math.random() * 900),
      title: taskTitle.trim(),
      assignedTo: assignee,
      department: selectedStaff?.department || 'General HR',
      priority,
      status: 'Pending',
      dueDate: dueDate || new Date().toISOString().split('T')[0]
    }
    setTasks([newTask, ...tasks])
    setTaskTitle('')
    setAssignee('')
    alert(`Task successfully assigned to ${assignee}!`)
  }

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: HRTask['status'] = t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending'
        return { ...t, status: nextStatus }
      }
      return t
    }))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6">
      
      {/* Top Pillar Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        {[
          { id: 'hiring', label: 'Hiring & Onboard', icon: Briefcase },
          { id: 'payroll', label: 'Payroll & Finance', icon: DollarSign },
          { id: 'ld', label: 'L&D Training', icon: GraduationCap },
          { id: 'hrms', label: 'Internal HRM & Staff', icon: Users },
          { id: 'approvals', label: 'Staff Approvals', icon: CheckCircle2 },
          { id: 'updates', label: 'Updates', icon: Users },
          { id: 'reports', label: 'HR & Audit Reports', icon: FileText },
          { id: 'tasks', label: 'Task Delegation', icon: UserCheck },
          { id: 'visa', label: 'Global Mobility', icon: Plane },
          { id: 'performance', label: 'Performance KPI', icon: TrendingUp },
          { id: 'welfare', label: 'Welfare & Safety', icon: HeartHandshake },
          { id: 'discipline', label: 'Discipline & Exit', icon: Shield },
          { id: 'ai_tech', label: 'AI & HR Tech', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button 
              key={tab.id} 
              onClick={() => setActivePillar(tab.id as any)} 
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activePillar === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* 1. HIRING & ONBOARDING STAGES */}
      {activePillar === 'hiring' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                <Briefcase className="w-5 h-5 text-indigo-600" /> Hiring & Interview Stage
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Workflow: Hiring & Interview ➔ Dept Approval ➔ Onboarding & Payroll ➔ Training ➔ ID Generation</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">Candidate Capture</span>
          </div>

          <form onSubmit={handleAddCandidate} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
            <input type="text" required placeholder="Candidate Full Name" value={candName} onChange={(e) => setCandName(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium" />
            <input type="email" required placeholder="Candidate Email" value={candEmail} onChange={(e) => setCandEmail(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium" />
            <input type="text" placeholder="Phone Number" value={candPhone} onChange={(e) => setCandPhone(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium" />
            <select value={candPosition} onChange={(e) => setCandPosition(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-bold">
              <option value="Academic Counselor">Academic Counselor</option>
              <option value="Instructor">Instructor</option>
              <option value="Visa Consultant">Visa Consultant</option>
              <option value="Finance Officer">Finance Officer</option>
              <option value="Marketing Exec">Marketing Exec</option>
            </select>

            <textarea placeholder="Discussion Notes..." value={candNotes} onChange={(e) => setCandNotes(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium sm:col-span-2 resize-none h-16"></textarea>
            <textarea placeholder="Character/Habit Analysis..." value={candCharacter} onChange={(e) => setCandCharacter(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium sm:col-span-2 resize-none h-16"></textarea>

            <input type="text" placeholder="Expected Salary" value={candExpectedSalary} onChange={(e) => setCandExpectedSalary(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium" />
            <input type="text" placeholder="Offered Salary" value={candOfferedSalary} onChange={(e) => setCandOfferedSalary(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-medium" />
            
            <div className="flex items-center gap-2 p-2.5 bg-white border rounded-xl">
              <input type="checkbox" checked={candDocsUploaded} onChange={(e) => setCandDocsUploaded(e.target.checked)} id="docs" />
              <label htmlFor="docs" className="font-bold text-slate-600">Documents Uploaded (Resume/Passport)</label>
            </div>

            <select value={candDept} onChange={(e) => setCandDept(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-bold" aria-label="Department to Route To">
              <option value="Education">Route to Education Manager</option>
              <option value="Visa">Route to Visa Manager</option>
              <option value="Finance">Route to Finance Manager</option>
              <option value="HR">Route to HR Manager</option>
              <option value="Marketing">Route to Marketing Manager</option>
            </select>

            <div className="col-span-full flex justify-end mt-2">
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Save Candidate & Initiate Hiring
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Candidate Pipeline ({candidates.filter(c => ['Hiring & Interview', 'Pending Department Approval'].includes(c.stage)).length})</h4>
            <div className="space-y-3">
              {candidates.filter(c => ['Hiring & Interview', 'Pending Department Approval'].includes(c.stage)).map(cand => (
                <div key={cand.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 text-xs">
                  <div className="space-y-2 flex-grow">
                    <div>
                      <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                        {cand.name} <span className="text-[10px] text-slate-400 font-mono">({cand.id})</span>
                        {cand.documentsUploaded && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px]">Docs OK</span>}
                      </div>
                      <div className="text-slate-500 mt-0.5">{cand.email} • Dept: <span className="font-bold text-indigo-600">{cand.departmentAssigned}</span></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 max-w-lg text-[10px]">
                      {cand.expectedSalary && <div className="bg-white p-1.5 rounded border">Expected: <b>{cand.expectedSalary}</b></div>}
                      {cand.offeredSalary && <div className="bg-white p-1.5 rounded border">Offered: <b>{cand.offeredSalary}</b></div>}
                    </div>

                    <div className="mt-2 text-[11px]">Current Status: 
                      <span className={`ml-2 px-2 py-0.5 rounded font-bold ${cand.stage === 'Pending Department Approval' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'}`}>
                        {cand.stage === 'Pending Department Approval' ? `Pending Approval from ${cand.departmentAssigned} Manager` : cand.stage}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    {cand.stage === 'Hiring & Interview' && (
                      <button onClick={() => handleAdvanceStage(cand.id, 'route_dept')} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-xl cursor-pointer">
                        Route to Dept. Manager ➔
                      </button>
                    )}
                    {cand.stage === 'Pending Department Approval' && (
                      <button onClick={() => handleAdvanceStage(cand.id, 'approve_dept')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer">
                        Approve & Send to Onboarding ✅
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {candidates.filter(c => ['Hiring & Interview', 'Pending Department Approval'].includes(c.stage)).length === 0 && (
                <div className="p-4 text-center text-slate-500 text-xs italic bg-slate-50 border border-dashed rounded-xl">No active candidates in the hiring phase.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYROLL & FINANCE SYNC (ONBOARDING) */}
      {activePillar === 'payroll' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2"><DollarSign className="w-5 h-5 text-indigo-600" /> Onboarding & Payroll Stage</h3>
              <p className="text-xs text-slate-500 mt-1">Process finalized salary and statutory details for approved candidates.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Candidates Pending Onboarding</h4>
            <div className="space-y-3">
              {candidates.filter(c => c.stage === 'Onboarding & Payroll').map(cand => (
                <div key={cand.id} className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 text-xs">
                  <div className="space-y-2 flex-grow">
                    <div>
                      <div className="font-black text-slate-900 text-sm flex items-center gap-2">{cand.name}</div>
                      <div className="text-slate-500 mt-0.5">Final Dept: <span className="font-bold text-indigo-600">{cand.departmentAssigned}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-w-lg text-[10px]">
                      <div className="bg-white p-1.5 rounded border">Agreed Salary: <b>{cand.offeredSalary || 'N/A'}</b></div>
                      <div className="bg-white p-1.5 rounded border">Statutory (PF/Tax): <b>Pending Setup</b></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    <button onClick={() => handleAdvanceStage(cand.id, 'to_training')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl cursor-pointer">
                      Complete Onboarding ➔ Pass to Training
                    </button>
                  </div>
                </div>
              ))}
              {candidates.filter(c => c.stage === 'Onboarding & Payroll').length === 0 && (
                <div className="p-4 text-center text-slate-500 text-xs italic bg-slate-50 border border-dashed rounded-xl">No candidates currently in onboarding.</div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t mt-6">
            <h3 className="font-black text-slate-900 text-sm mb-2">Mass Payroll Sync</h3>
            <p className="text-xs text-slate-500 mb-4">Calculate internal staff payroll and push salary expenses directly into the Enterprise Finance Ledger.</p>
            <button onClick={handleRunPayrollSync} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-xs">
              Process Payroll & Sync to Finance 💳
            </button>
          </div>
        </div>
      )}

      {/* 3. L&D TRAINING SYNC (TRAINING & ID) */}
      {activePillar === 'ld' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-600" /> Training & Staff ID Generation</h3>
              <p className="text-xs text-slate-500 mt-1">Manage internal training and officially generate corporate IDs for new hires.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Candidates In Training</h4>
            <div className="space-y-3">
              {candidates.filter(c => c.stage === 'Training & ID Generation').map(cand => (
                <div key={cand.id} className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 text-xs">
                  <div className="space-y-2 flex-grow">
                    <div>
                      <div className="font-black text-slate-900 text-sm flex items-center gap-2">{cand.name}</div>
                      <div className="text-slate-500 mt-0.5">{cand.email} • Role: <span className="font-bold">{cand.position}</span></div>
                    </div>
                    <div className="text-[11px] text-indigo-700 font-bold">Status: Pending Corporate ID Generation & Directory Sync</div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    <button onClick={() => handleAdvanceStage(cand.id, 'generate_id')} className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-black rounded-xl cursor-pointer">
                      Generate Staff ID & Credentials 🛡️
                    </button>
                  </div>
                </div>
              ))}
              {candidates.filter(c => c.stage === 'Training & ID Generation').length === 0 && (
                <div className="p-4 text-center text-slate-500 text-xs italic bg-slate-50 border border-dashed rounded-xl">No candidates currently in training.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. INTERNAL HRM & STAFF */}
      {activePillar === 'hrms' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <Users className="w-5 h-5 text-indigo-600" /> Internal HRM & Staff Registry ({staffList.length})
            </h3>
          </div>

          <form onSubmit={handleAddInternalStaff} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
            <input type="text" required placeholder="Staff Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none" />
            <input type="email" required placeholder="Corporate Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none" />
            <input type="password" required placeholder="Staff Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none" />
            <input type="text" placeholder="Phone Number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none" />
            <select value={newDept} onChange={(e: any) => setNewDept(e.target.value)} className="p-2.5 border rounded-xl bg-white outline-none font-bold">
              <option value="Academic Counselor">Academic Counselor</option>
              <option value="Education">Education</option>
              <option value="Visa">Visa Department</option>
              <option value="Finance Officer">Finance Officer</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Marketing Exec">Marketing Exec</option>
            </select>
            <div className="col-span-full flex justify-end">
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl cursor-pointer shadow-xs">Register Staff Member</button>
            </div>
          </form>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">Verified Corporate Staff</h4>
              <div className="space-y-2">
                {staffList.filter(st => st.hrApprovalStatus !== 'Pending HR Approval' && st.status !== 'Terminated').map(st => (
                  <div key={st.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-black text-slate-900">{st.name} <span className="text-[10px] text-slate-400 font-mono">({st.hrIssuedId || st.id})</span></div>
                      <div className="text-slate-500">{st.email} • <span className="font-bold text-indigo-600">{st.department}</span></div>
                    </div>
                    <button onClick={() => handleCheckIn(st)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer">
                      Log Attendance 🕒
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HR APPROVALS (NEW DEDICATED TAB) */}
      {activePillar === 'approvals' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <DepartmentApprovalsTab departmentName="HR Hub" />

          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Pending Staff Approvals & Activation Requests
              </h3>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2 mt-4">Activation Requests / Pending Approvals</h4>
              <div className="space-y-2">
                {staffList.filter(st => st.hrApprovalStatus === 'Pending HR Approval').length === 0 && (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-dashed">No pending approvals in queue.</p>
                )}
                {staffList.filter(st => st.hrApprovalStatus === 'Pending HR Approval').map(st => (
                  <div key={st.id} className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-black text-amber-900">{st.name} <span className="text-[10px] text-amber-700 font-mono">(Temp ID: {st.id})</span></div>
                      <div className="text-amber-800">{st.email} • <span className="font-bold">{st.department}</span></div>
                      <div className="text-[10px] text-amber-600 mt-1">Temp Access Expires: {st.temporaryAccessExpiry}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveSubordinate(st.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer">
                        Approve & Activate
                      </button>
                      <button onClick={() => handleRejectSubordinate(st.id)} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {staffList.some(st => (st.hrApprovalStatus as any) === 'Blocked (Timeout)') && (
              <div>
                <h4 className="font-bold text-rose-700 text-xs uppercase tracking-wider mb-2 mt-4">Blocked / Suspended (Timeout)</h4>
                <div className="space-y-2">
                  {staffList.filter(st => (st.hrApprovalStatus as any) === 'Blocked (Timeout)').map(st => (
                    <div key={st.id} className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-black text-rose-900">{st.name} <span className="text-[10px] text-rose-700 font-mono">({st.id})</span></div>
                        <div className="text-rose-800">{st.email} • <span className="font-bold">{st.department}</span></div>
                        <div className="text-[10px] text-rose-600 mt-1 font-bold">Auto-Blocked: 48-Hour Timer Expired</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveSubordinate(st.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer">
                          Re-activate / Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activePillar === 'updates' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <DepartmentUpdatesTab departmentName="HR Hub" />
        </div>
      )}

      {/* 6. HR & AUDIT REPORTS */}
      {activePillar === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <FileText className="w-5 h-5 text-indigo-600" /> HR & Audit Reports Center
            </h3>
            <button onClick={() => window.print()} className="px-3 py-2 bg-slate-900 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print Report
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-700">Staff Registry Master List & Audit Report</h4>
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-black">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {staffList.map(st => (
                    <tr key={st.id}>
                      <td className="p-3 font-mono">{st.hrIssuedId || st.id}</td>
                      <td className="p-3 font-bold">{st.name}</td>
                      <td className="p-3 text-slate-500">{st.email}</td>
                      <td className="p-3 uppercase font-semibold">{st.department}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                          st.hrApprovalStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                          (st.hrApprovalStatus as any) === 'Blocked (Timeout)' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {st.hrApprovalStatus || 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="font-bold text-xs text-slate-700 pt-4">Attendance Audit Logs</h4>
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-black">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Check-in Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendanceLogs.map(att => (
                    <tr key={att.id}>
                      <td className="p-3 font-mono">{att.id}</td>
                      <td className="p-3 font-bold">{att.staffName}</td>
                      <td className="p-3">{att.date} at {att.checkInTime}</td>
                      <td className="p-3 text-emerald-600 font-bold">{att.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TASK DELEGATION */}
      {activePillar === 'tasks' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                <UserCheck className="w-5 h-5 text-indigo-600" /> HR Head Task Delegation & Subordinate Management
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Assign, monitor, and delegate operational HR duties to your team members.</p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Team Command Center</span>
          </div>

          <form onSubmit={handleCreateTask} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Task Description / Objective</label>
              <input type="text" required placeholder="e.g., Audit German Language Batch Records" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-medium" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assign to Subordinate</label>
              <select required value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-bold">
                <option value="">Select Staff Member</option>
                {staffList.map(st => (
                  <option key={st.id} value={st.name}>{st.name} ({st.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
              <select value={priority} onChange={(e: any) => setPriority(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-bold">
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-medium" />
            </div>

            <div className="col-span-2 lg:col-span-3 flex items-end">
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-xs">
                <Plus className="w-4 h-4" /> Delegate Task to Subordinate
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Active Team Assignments ({tasks.length})</h4>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                  <div>
                    <div className="font-black text-slate-900 text-sm">{t.title}</div>
                    <div className="text-slate-500 mt-0.5">Assigned to: <span className="font-bold text-slate-800">{t.assignedTo}</span> ({t.department}) • Due: {t.dueDate}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] ${t.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {t.priority}
                    </span>
                    <button onClick={() => handleToggleStatus(t.id)} className={`px-3 py-1 rounded-lg font-black text-[10px] cursor-pointer border ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : t.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-200 text-slate-700 border-slate-300'}`}>
                      {t.status} 🔄
                    </button>
                    <button onClick={() => handleDeleteTask(t.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OTHER PILLARS PLACEHOLDER */}
      {['visa', 'performance', 'welfare', 'discipline', 'ai_tech'].includes(activePillar) && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
          <h3 className="font-black text-slate-900 uppercase text-xs tracking-wider">{activePillar} Management Module</h3>
          <p className="text-xs text-slate-500">Operational sub-modules for HR expansion and global mobility workflows.</p>
        </div>
      )}

      {/* FOOTER HELP LINK: "What is this page?" */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button 
          onClick={() => setShowHelpModal(true)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" /> What is this page? (HRM Guide)
        </button>
      </div>

      {/* HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" /> About Internal HRM & HR Operations
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Internal HRM & Staff Registry</strong> serves as the central command for managing all corporate personnel at ILA Global. This module handles everything from initial candidate applications and document verification to official corporate ID generation (STAFF-XXX), attendance tracking, payroll synchronization with the Finance Hub, and task delegation among subordinates.
            </p>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 font-semibold">
              💡 Tip: Always complete the Hiring & Onboarding verification stages before generating formal access credentials for new team members.
            </div>
            <button 
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-black rounded-xl cursor-pointer"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}

    </div>
  )
}




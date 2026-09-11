import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Plus, ShieldCheck, UserCheck, Trash2 } from 'lucide-react'
import { getStaffRegistry, StaffUser } from '../../lib/db'

interface HRTask {
  id: string
  title: string
  assignedTo: string
  department: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'In Progress' | 'Completed'
  dueDate: string
}

export default function HRTaskHub() {
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [tasks, setTasks] = useState<HRTask[]>([
    { id: 'TASK-101', title: 'Verify August Attendance Logs', assignedTo: 'HR Manager Lead', department: 'HR Manager', priority: 'High', status: 'In Progress', dueDate: '2026-08-25' },
    { id: 'TASK-102', title: 'Prepare Ausbildung Stipend Payout Sheet', assignedTo: 'Finance Officer', department: 'Finance Officer', priority: 'Medium', status: 'Pending', dueDate: '2026-08-28' }
  ])

  const [taskTitle, setTaskTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    setStaffList(getStaffRegistry())
  }, [])

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

        {/* Assign Task Form */}
        <form onSubmit={handleCreateTask} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs">
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Task Description / Objective</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Audit German Language Batch Records" 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)} 
              className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-medium" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign to Subordinate</label>
            <select 
              required
              value={assignee} 
              onChange={(e) => setAssignee(e.target.value)} 
              className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-bold"
            >
              <option value="">Select Staff Member</option>
              {staffList.map(st => (
                <option key={st.id} value={st.name}>{st.name} ({st.department})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
            <select 
              value={priority} 
              onChange={(e: any) => setPriority(e.target.value)} 
              className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-bold"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-medium" 
            />
          </div>

          <div className="col-span-2 lg:col-span-3 flex items-end">
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-xs">
              <Plus className="w-4 h-4" /> Delegate Task to Subordinate
            </button>
          </div>
        </form>

        {/* Task List */}
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
                  <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] ${
                    t.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.priority}
                  </span>
                  <button 
                    onClick={() => handleToggleStatus(t.id)}
                    className={`px-3 py-1 rounded-lg font-black text-[10px] cursor-pointer border ${
                      t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      t.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {t.status} 🔄
                  </button>
                  <button onClick={() => handleDeleteTask(t.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
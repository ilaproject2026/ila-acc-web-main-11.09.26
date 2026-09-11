import React, { useState } from 'react';
import { Plus, CheckSquare, Calendar, Send, Inbox, RefreshCw, Trash2, LayoutDashboard } from 'lucide-react';

import DepartmentApprovalsTab from './DepartmentApprovalsTab';
import DepartmentUpdatesTab from './DepartmentUpdatesTab';

export default function ExecutiveOverviewHub() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Simple Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Q3 student enrollment numbers', department: 'Marketing', status: 'Pending', date: '2026-08-25' },
    { id: 2, title: 'Approve new hospital contracts in Berlin', department: 'Legal & Visa', status: 'In Progress', date: '2026-08-28' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDept, setNewTaskDept] = useState('Marketing');
  const [newTaskDate, setNewTaskDate] = useState('');

  // Simple Meetings state
  const [meetings, setMeetings] = useState([
    { id: 1, person: 'Dr. Evelyn Brand', topic: 'German Training Quality', time: 'Tomorrow, 10:00 AM' }
  ]);
  const [meetPerson, setMeetPerson] = useState('');
  const [meetTopic, setMeetTopic] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), title: newTaskTitle, department: newTaskDept, status: 'Sent', date: newTaskDate || 'Upcoming' }
    ]);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetPerson.trim() || !meetTopic.trim()) return;
    setMeetings(prev => [
      ...prev,
      { id: Date.now(), person: meetPerson, topic: meetTopic, time: 'Scheduled' }
    ]);
    setMeetPerson('');
    setMeetTopic('');
  };

  return (
    <div className="flex h-[750px] w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
      
      {/* 1. LEFT SIDE: SIMPLE MENU */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-3 shrink-0">
        <h3 className="text-xs font-black uppercase text-slate-400">CEO Control Desk</h3>
        <button 
          onClick={() => setActiveMenu('dashboard')}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
            activeMenu === 'dashboard' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200/50 text-slate-700'
          }`}
        >
          🏠 Master Dashboard
        </button>

        <div className="space-y-1 pt-2">
          {['Approvals', 'Updates', 'Global Strategy', 'Exhibitions & Expos', 'Marketing & Funnels', 'Board Governance', 'PR & Media', 'Internal Audit', 'Documents & Licenses'].map((menu, idx) => {
            const key = `menu-${idx}`;
            return (
              <button 
                key={key}
                onClick={() => setActiveMenu(menu)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  activeMenu === menu ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200/50 text-slate-600'
                }`}
              >
                {menu}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <button 
            onClick={() => alert('Request sent to all department managers for updates!')}
            className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Request Dept Updates
          </button>
        </div>
      </div>

      {/* 2. CENTER: MAIN WORKSPACE */}
      <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-white">
        
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-black capitalize">{activeMenu === 'dashboard' ? 'CEO Overview & Tasks' : activeMenu}</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Manage your tasks, assign them to departments, and schedule your follow-ups.</p>
        </div>

        {activeMenu === 'Approvals' && <DepartmentApprovalsTab departmentName="Executive Hub" />}
        {activeMenu === 'Updates' && <DepartmentUpdatesTab departmentName="Executive Hub" />}

        {/* Task Creator Form */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-brand-600" /> Create & Assign New Task
          </h3>
          <form onSubmit={handleAddTask} className="grid sm:grid-cols-3 gap-3">
            <input 
              type="text" 
              required
              placeholder="What needs to be done?" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
            />
            <select 
              value={newTaskDept}
              onChange={(e) => setNewTaskDept(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
            >
              <option value="Marketing">Marketing Dept</option>
              <option value="HR">HR Dept</option>
              <option value="Finance">Finance Dept</option>
              <option value="Legal & Visa">Legal & Visa Dept</option>
              <option value="Operations">Operations Dept</option>
            </select>
            <input 
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
            />
            <button type="submit" className="sm:col-span-3 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
              Send Task to Department 🚀
            </button>
          </form>
        </div>

        {/* Task List Table */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-600" /> Active Tasks Assigned
          </h3>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{t.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Assigned to: <strong className="text-slate-700">{t.department}</strong> | Due: {t.date}</div>
                </div>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-[10px] font-black">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meetings & Appointments Scheduler */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" /> Schedule Meeting or Follow-up
          </h3>
          <form onSubmit={handleAddMeeting} className="grid sm:grid-cols-2 gap-3">
            <input 
              type="text" 
              required
              placeholder="Person name (e.g. Frankfurt Partner)" 
              value={meetPerson}
              onChange={(e) => setMeetPerson(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
            />
            <input 
              type="text" 
              required
              placeholder="Meeting topic / agenda" 
              value={meetTopic}
              onChange={(e) => setMeetTopic(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
            />
            <button type="submit" className="sm:col-span-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer">
              + Save Meeting Schedule
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {meetings.map(m => (
              <div key={m.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between items-center shadow-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{m.topic}</div>
                  <div className="text-[10px] text-slate-500">With: {m.person}</div>
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  📅 {m.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. RIGHT SIDE: REAL-TIME TASK MONITOR & UPDATES */}
      <div className="w-80 bg-slate-900 text-white p-6 overflow-y-auto flex flex-col gap-6 shrink-0">
        <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider">Live Department Feed</h4>
        
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Incoming Updates</p>
          
          <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Finance Dept</span>
              <span className="text-[10px] text-emerald-400 font-normal">10m ago</span>
            </div>
            <p className="text-[11px] text-slate-300">Quarterly reconciliation successfully audited and verified.</p>
          </div>

          <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Marketing Dept</span>
              <span className="text-[10px] text-emerald-400 font-normal">1h ago</span>
            </div>
            <p className="text-[11px] text-slate-300">New batch leads increased by 18% in Baden-Württemberg.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
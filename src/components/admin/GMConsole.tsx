import React, { useState, useEffect } from 'react';
import { 
  Activity, CheckSquare, Users, Briefcase, 
  Plus, RefreshCw, Send, Inbox, TrendingUp, ShieldCheck 
} from 'lucide-react';
import { getInquiries, Inquiry } from '../../lib/db';

import DepartmentApprovalsTab from './DepartmentApprovalsTab';
import DepartmentUpdatesTab from './DepartmentUpdatesTab';

export default function GMConsole() {
  const [activeTab, setActiveTab] = useState<'overview' | 'delegation' | 'departments' | 'approvals' | 'updates'>('overview');
  
  // Real DB Inquiries sync
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    setInquiries(getInquiries());
  }, []);

  // GM Operational Tasks State
  const [gmTasks, setGmTasks] = useState([
    { id: 1, title: 'Verify Schengen visa clearance queues for Q3', dept: 'Legal & Visa', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Audit weekly marketing cost per lead (CPL)', dept: 'Marketing', status: 'Completed', priority: 'Medium' },
    { id: 3, title: 'Review trainer attendance and B2 batch progress', dept: 'HR & Academics', status: 'Pending', priority: 'High' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Marketing');
  const [newPriority, setNewPriority] = useState('Medium');

  const handleAddGmTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setGmTasks(prev => [
      ...prev,
      { id: Date.now(), title: newTitle.trim(), dept: newDept, status: 'Pending', priority: newPriority }
    ]);
    setNewTitle('');
  };

  // Department Performance Metrics
  const deptStats = {
    marketing: inquiries.filter(i => i.category === 'Education' || i.category === 'Study Abroad').length,
    visa: inquiries.filter(i => i.category === 'Visa').length,
    jobs: inquiries.filter(i => i.category === 'Jobs').length,
    totalRevenue: inquiries.filter(i => i.paymentStatus === 'Paid').length * 45000
  };

  return (
    <div className="flex h-[750px] w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
      
      {/* 1. LEFT SIDE: GM NAVIGATION */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-3 shrink-0">
        <h3 className="text-xs font-black uppercase text-slate-400">GM Operations Tower</h3>
        
        <button 
          onClick={() => setActiveTab('overview')}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'hover:bg-slate-200/50 text-slate-700'
          }`}
        >
          📊 Ops Overview
        </button>

        <button 
          onClick={() => setActiveTab('delegation')}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
            activeTab === 'delegation' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200/50 text-slate-700'
          }`}
        >
          📝 Task Delegation
        </button>

        <button 
          onClick={() => setActiveTab('departments')}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
            activeTab === 'departments' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200/50 text-slate-700'
          }`}
        >
          🏢 Department Health
        </button>

        <button 
          onClick={() => setActiveTab('approvals')}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
            activeTab === 'approvals' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200/50 text-slate-700'
          }`}
        >
          ✅ Approvals
        </button>

        <button 
          onClick={() => setActiveTab('updates')}
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${
            activeTab === 'updates' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200/50 text-slate-700'
          }`}
        >
          📡 Updates
        </button>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <button 
            onClick={() => alert('GM Sync report dispatched to CEO Desk!')}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Send Report to CEO
          </button>
        </div>
      </div>

      {/* 2. CENTER: WORKSPACE */}
      <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-white">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded font-black uppercase">General Manager Desk</span>
            <h1 className="text-2xl font-black capitalize mt-1">
              {activeTab === 'overview' ? 'Operations & Daily Workflow' : activeTab === 'delegation' ? 'Task Delegation & Tracking' : 'Department Performance Health'}
            </h1>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-xl text-slate-600 font-bold">
            Live DB Sync Active
          </span>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Metrics */}
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-black uppercase">Total Active Leads</span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">{inquiries.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Real-time DB synced</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-black uppercase">Study Abroad & Edu</span>
                <span className="text-3xl font-black text-brand-600 mt-1 block">{deptStats.marketing}</span>
                <span className="text-[10px] text-slate-500 font-bold">Enquiries registered</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-black uppercase">Visa Dossiers</span>
                <span className="text-3xl font-black text-indigo-600 mt-1 block">{deptStats.visa}</span>
                <span className="text-[10px] text-slate-500 font-bold">In immigration pipeline</span>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-black uppercase">Paid Conversions</span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">₹{deptStats.totalRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 font-bold">Verified revenue</span>
              </div>
            </div>

            {/* Recent Operational Activities */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" /> Recent System Actions & Student Inquiries
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">{inq.name} ({inq.course})</div>
                      <div className="text-[10px] text-slate-400">Category: {inq.category} | Phone: {inq.phone}</div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-[10px] font-black">
                      {inq.paymentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASK DELEGATION */}
        {activeTab === 'delegation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Add Task */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-brand-600" /> Assign Task to Department
              </h3>
              <form onSubmit={handleAddGmTask} className="grid sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  required
                  placeholder="Task description..." 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
                />
                <select 
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
                >
                  <option value="Marketing">Marketing Dept</option>
                  <option value="HR & Academics">HR & Academics</option>
                  <option value="Finance">Finance Dept</option>
                  <option value="Legal & Visa">Legal & Visa</option>
                  <option value="Operations">Operations</option>
                </select>
                <select 
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl text-xs bg-white outline-none font-semibold"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button type="submit" className="sm:col-span-3 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
                  Delegate Task 🚀
                </button>
              </form>
            </div>

            {/* Task List */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" /> Active Delegated Tasks
              </h3>
              <div className="space-y-2">
                {gmTasks.map(t => (
                  <div key={t.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">{t.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Assigned to: <strong className="text-slate-700">{t.dept}</strong></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {t.priority}
                      </span>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-[10px] font-black">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DepartmentApprovalsTab departmentName="GM Console" />
          </div>
        )}

        {/* TAB 5: UPDATES */}
        {activeTab === 'updates' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DepartmentUpdatesTab departmentName="GM Console" />
          </div>
        )}

        {/* TAB 3: DEPARTMENTS HEALTH */}
        {activeTab === 'departments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-black text-slate-900">Marketing & Acquisition Dept</div>
                <p className="text-xs text-slate-500 font-semibold">Handling organic student leads and online admissions.</p>
                <div className="text-xs text-emerald-600 font-black pt-2">Status: Optimal & Stable</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-black text-slate-900">Legal & Schengen Visa Dept</div>
                <p className="text-xs text-slate-500 font-semibold">Processing embassy paperwork and appointment slots.</p>
                <div className="text-xs text-amber-600 font-black pt-2">Status: High Volume In Queue</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-black text-slate-900">HR & Language Training Dept</div>
                <p className="text-xs text-slate-500 font-semibold">B1-B2 German coaching and internal trainer allocation.</p>
                <div className="text-xs text-emerald-600 font-black pt-2">Status: All Batches Running</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-black text-slate-900">Finance & Funds Dept</div>
                <p className="text-xs text-slate-500 font-semibold">Fee reconciliations, commissions, and blocked accounts.</p>
                <div className="text-xs text-emerald-600 font-black pt-2">Status: Fully Audited</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. RIGHT SIDE: LIVE FEED */}
      <div className="w-80 bg-slate-900 text-white p-6 overflow-y-auto flex flex-col gap-6 shrink-0">
        <h4 className="font-black text-xs uppercase text-slate-400 tracking-wider">GM Live Monitor</h4>
        
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Department Alerts</p>
          
          <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Visa Queue Alert</span>
              <span className="text-[10px] text-amber-400 font-normal">Active</span>
            </div>
            <p className="text-[11px] text-slate-300">Cochin consulate slot filling 4 days faster than usual. Expedite dossiers.</p>
          </div>

          <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-200">
              <span>System Health</span>
              <span className="text-[10px] text-emerald-400 font-normal">Secure</span>
            </div>
            <p className="text-[11px] text-slate-300">All local DB student inquiries and POS receipts synced.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
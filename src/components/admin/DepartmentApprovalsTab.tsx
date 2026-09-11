import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { getGlobalApprovals, updateGlobalApproval, ApprovalRequest, addGlobalUpdate } from '../../lib/db';

interface DepartmentApprovalsTabProps {
  departmentName: string;
}

export default function DepartmentApprovalsTab({ departmentName }: DepartmentApprovalsTabProps) {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);

  const loadData = () => {
    // Show only approvals targeted to this department OR if this is the Master/Executive that sees all
    const all = getGlobalApprovals();
    const filtered = departmentName.toLowerCase().includes('admin') || departmentName.toLowerCase().includes('executive') 
      ? all 
      : all.filter(r => r.department === departmentName || r.department === 'All');
    setRequests(filtered);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-approvals-changed', loadData);
    return () => window.removeEventListener('ilas-approvals-changed', loadData);
  }, [departmentName]);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    if (confirm(`Are you sure you want to mark this request as ${action}?`)) {
      updateGlobalApproval(id, action);
      
      const req = requests.find(r => r.id === id);
      if (req) {
        addGlobalUpdate({
          action: `Approval ${action}`,
          details: `Request ${req.id} (${req.type}) was ${action.toLowerCase()} by ${departmentName} Head.`,
          user: `${departmentName} Head`,
          department: req.department,
          category: req.type === 'New Staff' ? 'Personnel' : req.type === 'New Course' ? 'Content' : 'Data'
        });
      }
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const pastRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          {departmentName} Approvals Queue
        </h3>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
          {pendingRequests.length} Pending Actions
        </span>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase">Pending Authorization</h4>
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-bold">
            No pending approvals at the moment.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-4 bg-white border border-amber-200 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                      {req.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{req.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mb-1">{req.description}</p>
                  <p className="text-[10px] text-slate-500">Requested by: {req.requestedBy}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => handleAction(req.id, 'Approved')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => handleAction(req.id, 'Rejected')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastRequests.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Recent Actions</h4>
            <div className="grid gap-3 opacity-70">
              {pastRequests.map(req => (
                <div key={req.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{req.description}</p>
                    <p className="text-[10px] text-slate-500">{req.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

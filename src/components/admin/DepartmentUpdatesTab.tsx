import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import { getGlobalUpdates, UpdateLog } from '../../lib/db';

interface DepartmentUpdatesTabProps {
  departmentName: string;
}

export default function DepartmentUpdatesTab({ departmentName }: DepartmentUpdatesTabProps) {
  const [updates, setUpdates] = useState<UpdateLog[]>([]);

  const loadData = () => {
    // Show only updates for this department OR if this is the Master/Executive that sees all
    const all = getGlobalUpdates();
    const filtered = departmentName.toLowerCase().includes('admin') || departmentName.toLowerCase().includes('executive') 
      ? all 
      : all.filter(u => u.department === departmentName || u.department === 'All');
    setUpdates(filtered);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('ilas-updates-changed', loadData);
    return () => window.removeEventListener('ilas-updates-changed', loadData);
  }, [departmentName]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          {departmentName} Real-Time Updates
        </h3>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> Live Sync
        </span>
      </div>

      <div className="space-y-3">
        {updates.length === 0 && (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-bold">
            No recent updates found for {departmentName}.
          </div>
        )}
        {updates.map(update => (
          <div key={update.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 hover:border-indigo-300 transition-colors">
            <div className="mt-1">
              <div className={`w-2 h-2 rounded-full ${
                update.category === 'System' ? 'bg-slate-500' :
                update.category === 'Content' ? 'bg-indigo-500' :
                update.category === 'Personnel' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-black text-slate-900">{update.action}</span>
                <span className="text-[10px] font-bold text-slate-400">{update.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-1">{update.details}</p>
              <div className="text-[10px] font-bold text-indigo-600">User: {update.user}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

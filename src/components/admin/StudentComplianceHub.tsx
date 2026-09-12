import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Clock, CheckCircle2, Search, Filter, 
  MapPin, Wifi, Activity, Trophy, Calendar, Download, RefreshCw,
  QrCode, UserPlus, FileText, AlertCircle
} from 'lucide-react';
import { 
  StudentComplianceLog, getStudentComplianceLogs, logStudentComplianceEvent 
} from '../../lib/db';

export const StudentComplianceHub: React.FC = () => {
  const [logs, setLogs] = useState<StudentComplianceLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Check-in / Milestone logging state
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseName, setCourseName] = useState('German Language Test 1');
  const [deliveryPath, setDeliveryPath] = useState('IntelliCoach AI');
  const [eventType, setEventType] = useState<StudentComplianceLog['eventType']>('Session Attendance');
  const [sessionMode, setSessionMode] = useState<'Online' | 'Offline'>('Online');
  const [details, setDetails] = useState('');

  const loadLogs = () => {
    setLogs(getStudentComplianceLogs());
  };

  useEffect(() => {
    loadLogs();
    window.addEventListener('ilas-compliance-logs-changed', loadLogs);
    return () => window.removeEventListener('ilas-compliance-logs-changed', loadLogs);
  }, []);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !courseName.trim()) return;

    logStudentComplianceEvent({
      studentId: `s-${Math.random().toString(36).substring(2, 6)}`,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || `${studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      courseId: 'c1',
      courseName: courseName.trim(),
      deliveryPath,
      eventType,
      details: details.trim() || `${eventType} verified under standard compliance protocol.`,
      complianceStatus: 'Verified',
      sessionMode
    });

    setShowManualModal(false);
    setStudentName('');
    setStudentEmail('');
    setDetails('');
  };

  const filteredLogs = logs.filter(l => {
    if (selectedEventType !== 'All' && l.eventType !== selectedEventType) return false;
    if (selectedMode !== 'All' && l.sessionMode !== selectedMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = l.studentName.toLowerCase().includes(q) ||
                    l.studentEmail.toLowerCase().includes(q) ||
                    l.courseName.toLowerCase().includes(q) ||
                    l.deliveryPath.toLowerCase().includes(q) ||
                    l.details.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalLogins = logs.filter(l => l.eventType === 'Login Session').length;
  const totalMilestones = logs.filter(l => l.eventType === 'Module Milestone Completed').length;
  const totalCampsOffline = logs.filter(l => l.sessionMode === 'Offline').length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-5 animate-in fade-in text-xs font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" /> Active Compliance & Attendance Logs
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1.5">Student Attendance & Milestone Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logs student login sessions, module completion milestones, and attendance records (Online & Offline Camps/Sports).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Log Session / Check-in
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Login Authentication Sessions</span>
          <div className="text-2xl font-black text-indigo-600">{totalLogins} Logins</div>
          <p className="text-slate-500 text-[11px]">Direct single-sign routing via dynamic course links.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Module Milestones Completed</span>
          <div className="text-2xl font-black text-emerald-600">{totalMilestones} Milestones</div>
          <p className="text-slate-500 text-[11px]">CEFR & Technical curriculum completions verified.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Camps & Sports Attendance</span>
          <div className="text-2xl font-black text-rose-600">{totalCampsOffline} Offline Venue Records</div>
          <p className="text-slate-500 text-[11px]">RFID & Biometric stadium gate check-ins.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, course, or pathway..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none"
          >
            <option value="All">All Event Types</option>
            <option value="Login Session">Login Sessions</option>
            <option value="Module Milestone Completed">Module Milestones</option>
            <option value="Session Attendance">Session Attendance</option>
            <option value="Biometric Check-in">Biometric Check-ins</option>
          </select>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none"
          >
            <option value="All">All Modes (Online & Offline)</option>
            <option value="Online">Online Sessions</option>
            <option value="Offline">Offline Camps / Stadium</option>
          </select>
        </div>
      </div>

      {/* Compliance Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Course & Delivery Path</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Compliance Details</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    <div>{log.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{log.studentEmail}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-indigo-900 truncate max-w-[200px]">{log.courseName}</div>
                    <div className="text-[10px] text-slate-500">{log.deliveryPath}</div>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800">{log.eventType}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.sessionMode === 'Offline' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {log.sessionMode || 'Online'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs">
                    {log.details}
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                      {log.complianceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check-in Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900">Log Student Compliance Record</h3>
            
            <form onSubmit={handleCreateLog} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700">Student Full Name *</label>
                <input 
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g., Ananya Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Student Email</label>
                <input 
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g., ananya@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 mt-1 bg-white"
                  >
                    <option value="Session Attendance">Session Attendance</option>
                    <option value="Login Session">Login Session</option>
                    <option value="Module Milestone Completed">Milestone Completed</option>
                    <option value="Biometric Check-in">Biometric Check-in</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Mode</label>
                  <select
                    value={sessionMode}
                    onChange={(e) => setSessionMode(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 mt-1 bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline Venue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Delivery Format / Path</label>
                <select
                  value={deliveryPath}
                  onChange={(e) => setDeliveryPath(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 mt-1 bg-white"
                >
                  <option value="Slide + AI">Slide + AI</option>
                  <option value="Video + AI">Video + AI</option>
                  <option value="IntelliCoach AI">IntelliCoach AI</option>
                  <option value="1-to-1 Coaching">1-to-1 Coaching</option>
                  <option value="Camps & Sports Classes (Offline)">Camps & Sports Classes (Offline)</option>
                  <option value="Camps & Sports Classes (Online)">Camps & Sports Classes (Online)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Compliance Notes / Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g., Successfully completed Module 2 oral defense exam."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Compliance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default StudentComplianceHub;

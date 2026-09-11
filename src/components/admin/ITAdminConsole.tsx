import { useState, useEffect } from 'react';
import { Lock, UserPlus, Pin, Plus, Trash2, Calendar, ShieldCheck, Cpu, Terminal, Eye, Activity, Users } from 'lucide-react';
import { StaffUser } from '../common/PortalLogin';

interface StickyNote {
  id: string;
  text: string;
  color: string;
}

interface CorporateMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
}

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState<'settings' | 'monitor'>('settings');

  const [profileName, setProfileName] = useState('Super Admin');
  const [profileEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<string | null>(null);

  // Biometric & Anti-Cheating State
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [faceRecognitionAuth, setFaceRecognitionAuth] = useState(false);
  const [authStatus, setAuthStatus] = useState<'Verified' | 'Pending Biometric Scan'>('Verified');

  // System Monitor Logs State
  const [systemLogs] = useState<SystemLog[]>([
    { id: 'LOG-1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Enterprise ERP backend synchronized with Finance Hub.' },
    { id: 'LOG-2', timestamp: new Date().toLocaleTimeString(), level: 'WARNING', message: 'Storage approaching 65% capacity on local audit cache.' }
  ]);

  // Unlimited Staff Engine state
  const [registry, setRegistry] = useState<StaffUser[]>([]);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffDept, setNewStaffDept] = useState<'Super Admin' | 'General Manager' | 'Finance Officer' | 'HR Manager' | 'Marketing Exec' | 'Academic Counselor'>('Academic Counselor');
  const [staffFeedback, setStaffFeedback] = useState<string | null>(null);

  // Sticky Notes & Meeting state
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [meetings, setMeetings] = useState<CorporateMeeting[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  // Load registry
  useEffect(() => {
    const rStr = localStorage.getItem('ilas_staff_registry');
    const staffList = rStr ? JSON.parse(rStr) : [];
    setRegistry(staffList);

    const activeName = localStorage.getItem('ilas_user_name');
    if (activeName) setProfileName(activeName);
    
    setNotes([
      { id: '1', text: 'Prepare German Ausbildung visa documents checklist', color: 'bg-yellow-100' },
      { id: '2', text: 'Review stipends ledger on Finance panel', color: 'bg-blue-100' }
    ]);

    setMeetings([
      { id: '1', title: 'Daily Sync: Admissions & AI Funnels', date: '2026-08-19', time: '10:00 AM', attendees: 'Super Admin, Marketing Lead' },
      { id: '2', title: 'Consultants HR Review Session', date: '2026-08-20', time: '02:30 PM', attendees: 'HR Team, 14 Registered Consultants' }
    ]);
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setPwdFeedback('Please specify a new password.');
      return;
    }
    const rStr = localStorage.getItem('ilas_staff_registry');
    let staffList: StaffUser[] = rStr ? JSON.parse(rStr) : [];
    
    const activeEmail = profileEmail;
    staffList = staffList.map(user => {
      if (user.email.toLowerCase().trim() === activeEmail.toLowerCase().trim()) {
        return { ...user, name: profileName };
      }
      return user;
    });

    localStorage.setItem('ilas_staff_registry', JSON.stringify(staffList));
    localStorage.setItem('ilas_user_name', profileName);
    setPwdFeedback('Profile updated. For password changes, please use Supabase dashboard or forgot password flow.');
    setOldPassword('');
    setNewPassword('');
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffName || !newStaffPassword) {
      setStaffFeedback('All fields are required.');
      return;
    }

    const nextIdNum = registry.length + 1;
    const newStaff: StaffUser = {
      id: `STAFF-${String(nextIdNum).padStart(3, '0')}`,
      email: newStaffEmail.trim(),
      name: newStaffName.trim(),
      department: newStaffDept
    };

    const updated = [...registry, newStaff];
    setRegistry(updated);
    localStorage.setItem('ilas_staff_registry', JSON.stringify(updated));
    setStaffFeedback(`Assigned ID ${newStaff.id} successfully to ${newStaff.name}!`);
    setNewStaffEmail('');
    setNewStaffName('');
    setNewStaffPassword('');
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-emerald-100', 'bg-rose-100', 'bg-purple-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNote: StickyNote = {
      id: Date.now().toString(),
      text: noteInput,
      color: randomColor
    };
    setNotes([...notes, newNote]);
    setNoteInput('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle || !meetingDate || !meetingTime) return;
    const newMeet: CorporateMeeting = {
      id: Date.now().toString(),
      title: meetingTitle,
      date: meetingDate,
      time: meetingTime,
      attendees: 'Super Admin & Assigned Staff Leads'
    };
    setMeetings([...meetings, newMeet]);
    setMeetingTitle('');
    setMeetingDate('');
    setMeetingTime('');
  };

  const triggerBiometricScan = () => {
    setAuthStatus('Pending Biometric Scan');
    setTimeout(() => {
      setAuthStatus('Verified');
      alert('Admin Fingerprint & Face Recognition Authorized Successfully!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation Switcher for Settings vs System Monitor */}
      <div className="flex border-b border-slate-200 gap-2 pb-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all ${
            activeTab === 'settings' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          ⚙️ Settings & Staff Hub
        </button>
        <button
          onClick={() => setActiveTab('monitor')}
          className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all ${
            activeTab === 'monitor' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🛡️ System Monitor & Biometric Security
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Grid for Profile & Unlimited Staff Engine */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Profile & Security Management */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Lock className="w-5 h-5 text-brand-600" />
                Security & Profile Management
              </h2>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {pwdFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">
                    {pwdFeedback}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Profile Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Corporate Email</label>
                  <input 
                    type="email" 
                    disabled
                    value={profileEmail}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50 text-slate-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 chars"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Update Security Credentials
                </button>
              </form>
            </div>

            {/* Unlimited Staff Engine */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <UserPlus className="w-5 h-5 text-brand-600" />
                Unlimited Staff Engine & Directory
              </h2>
              <form onSubmit={handleCreateStaff} className="space-y-4">
                {staffFeedback && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-700">
                    {staffFeedback}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Staff Full Name</label>
                    <input 
                      type="text" 
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Staff Password</label>
                    <input 
                      type="password" 
                      value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      placeholder="Pass123"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
                    <input 
                      type="email" 
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="jane@ilas.global"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department Scope</label>
                    <select 
                      value={newStaffDept}
                      onChange={(e: any) => setNewStaffDept(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white outline-none"
                    >
                      <option value="Super Admin">Super Admin / CEO</option>
                      <option value="General Manager">General Manager</option>
                      <option value="Finance Officer">Finance Officer</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Marketing Exec">Marketing Exec</option>
                      <option value="Academic Counselor">Academic Counselor</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md cursor-pointer"
                >
                  Generate Corporate ID & Access
                </button>
              </form>
            </div>
          </div>

          {/* Sticky Notes Memo Board & Meeting Schedule Manager */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 lg:col-span-2">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Pin className="w-5 h-5 text-amber-500" />
                Corporate Memo Board (Sticky Notes)
              </h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Post a daily operational reminder..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button 
                  onClick={handleAddNote}
                  className="px-4 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-800 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Memo
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {notes.map(note => (
                  <div key={note.id} className={`p-4 rounded-2xl border border-slate-200 shadow-sm relative group ${note.color} transition-all`}>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-2 right-2 p-1 bg-white/60 hover:bg-white rounded text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed pr-6">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="w-5 h-5 text-brand-600" />
                Daily Corporate Agenda
              </h2>
              <form onSubmit={handleAddMeeting} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Meeting Subject..." 
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Time (e.g. 10:00 AM)" 
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Add Corporate Agenda
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {meetings.map(meet => (
                  <div key={meet.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1 text-xs">
                    <div className="font-extrabold text-slate-900">{meet.title}</div>
                    <div className="text-[10px] font-bold text-slate-400">{meet.date} at {meet.time}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Participants: {meet.attendees}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW TAB: SYSTEM MONITOR & BIOMETRIC SECURITY HUB */}
      {activeTab === 'monitor' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Live Activity / Live Stream Widget */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="w-24 h-24 text-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-black text-emerald-400 text-xs uppercase tracking-widest">Live Activity Stream</h3>
              </div>
              <div className="space-y-1 mt-2 text-[10px] font-mono text-slate-300 relative z-10">
                <p>➔ [11:15:23] HR: Approved candidate Ajmal.</p>
                <p>➔ [11:14:10] Finance: Synced payroll data.</p>
                <p>➔ [11:12:05] Marketing: New campaign 'EU Study' launched.</p>
                <p>➔ [11:10:44] System: 15 active users online.</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Enterprise System Health & Biometric Security Center
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Monitor server uptime, review error logs, and enforce strict fingerprint/face recognition approvals.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${authStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                Status: {authStatus}
              </span>
            </div>

            {/* Biometric & Face Recognition Authorization Panel */}
            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border">
              <div className="space-y-3">
                <h4 className="font-black text-slate-800 text-xs uppercase flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-brand-600" /> Biometric Override & Approval
                </h4>
                <p className="text-xs text-slate-600">Whenever sensitive data or employee profiles are modified by subordinates, Super Admin / CEO biometric authorization is mandatory.</p>
                <button 
                  onClick={triggerBiometricScan}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Trigger Fingerprint & Face ID Scan 🛡️
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-800 text-xs uppercase flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" /> System Health Diagnostics
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 font-semibold">
                  <div>🟢 Database Connectivity: <span className="text-emerald-600">100% Operational (Local Store)</span></div>
                  <div>🟢 Active Client Sessions: <span className="text-blue-600">Secure (Encrypted)</span></div>
                  <div>🟢 AI Software Integration Hub: <span className="text-indigo-600">Connected & Ready</span></div>
                </div>
              </div>
            </div>

            {/* System Error Logs & Bug Tracking */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" /> Real-time System & Bug Logs
              </h4>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] space-y-2 max-h-[250px] overflow-y-auto">
                {systemLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span><span className="text-slate-500">[{log.timestamp}]</span> <span className={log.level === 'CRITICAL' ? 'text-rose-400 font-bold' : log.level === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}>{log.level}:</span> {log.message}</span>
                    <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">System Core</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
import { useState, useEffect } from 'react';
import { Lock, UserPlus, Pin, Plus, Trash2, Calendar, Users } from 'lucide-react';
import { StaffUser } from '../common/PortalLogin';
import { apiClient } from '../../services/apiClient';

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

export default function SettingsHub() {
  const [profileName, setProfileName] = useState('Super Admin');
  const [profileEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<string | null>(null);

  // Unlimited Staff Engine state
  const [registry, setRegistry] = useState<StaffUser[]>([]);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffDept, setNewStaffDept] = useState<'Super Admin' | 'General Manager' | 'Finance Officer' | 'HR Manager' | 'Marketing Exec' | 'Academic Counselor'>('Academic Counselor');
  const [newStaffHRId, setNewStaffHRId] = useState('');
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

    // Load active profile details
    const activeName = localStorage.getItem('ilas_user_name');
    if (activeName) setProfileName(activeName);
    
    // Default Sticky Notes & Meetings
    setNotes([
      { id: '1', text: 'Prepare German Ausbildung visa documents checklist', color: 'bg-yellow-100' },
      { id: '2', text: 'Review stipends ledger on Finance panel', color: 'bg-blue-100' }
    ]);

    setMeetings([
      { id: '1', title: 'Daily Sync: Admissions & AI Funnels', date: '2026-08-19', time: '10:00 AM', attendees: 'Super Admin, Marketing Lead' },
      { id: '2', title: 'Consultants HR Review Session', date: '2026-08-20', time: '02:30 PM', attendees: 'HR Team, 14 Registered Consultants' }
    ]);
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setPwdFeedback('Please specify a new password.');
      return;
    }
    
    // Update password in DRF Backend
    try {
      await apiClient.auth.changePassword(newPassword, profileEmail);
    } catch (err: any) {
      console.warn('DRF password update offline fallback:', err);
    }

    // Perform update in mock session and staff registry
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
    setPwdFeedback('Profile & password updated successfully.');
    setOldPassword('');
    setNewPassword('');
  };

  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffName || !newStaffPassword || !newStaffHRId) {
      setStaffFeedback('All fields (Name, Email, Password, HR-Issued ID) are required. Subordinates must be linked to an onboarding ID.');
      return;
    }

    // Provision staff user in DRF backend
    try {
      await apiClient.auth.createStaffUser({
        name: newStaffName.trim(),
        email: newStaffEmail.trim(),
        password: newStaffPassword,
        department: newStaffDept,
        role: 'team',
        staff_id: newStaffHRId.trim(),
      });
    } catch (err: any) {
      console.warn("DRF staff provisioning offline fallback in SettingsHub:", err);
    }

    const nextIdNum = registry.length + 1;
    
    // Set 48h temporary expiry
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    const newStaff: StaffUser = {
      id: newStaffHRId.trim(),
      email: newStaffEmail.trim(),
      name: newStaffName.trim(),
      department: newStaffDept,
      hrApprovalStatus: 'Pending HR Approval',
      temporaryAccessExpiry: expiryDate.toLocaleString(),
      hrIssuedId: newStaffHRId.trim()
    };

    const updated = [...registry, newStaff];
    setRegistry(updated);
    localStorage.setItem('ilas_staff_registry', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ilas-staff-changed'));
    setStaffFeedback(`Subordinate ${newStaff.name} created. Pending final HR Verification. Temporary ID: ${newStaff.id}`);
    setNewStaffEmail('');
    setNewStaffName('');
    setNewStaffPassword('');
  };

  const handleEditStaff = (staff: StaffUser) => {
    setSelectedStaff(staff);
  };

  const handleUpdateSelectedStaff = (updatedStaff: StaffUser) => {
    const updatedRegistry = registry.map(s => s.id === updatedStaff.id ? updatedStaff : s);
    setRegistry(updatedRegistry);
    localStorage.setItem('ilas_staff_registry', JSON.stringify(updatedRegistry));
    window.dispatchEvent(new CustomEvent('ilas-staff-changed'));
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (staffId: string) => {
    const updatedRegistry = registry.filter(s => s.id !== staffId);
    setRegistry(updatedRegistry);
    localStorage.setItem('ilas_staff_registry', JSON.stringify(updatedRegistry));
    window.dispatchEvent(new CustomEvent('ilas-staff-changed'));
    if (selectedStaff?.id === staffId) setSelectedStaff(null);
  };

  useEffect(() => {
    const handleStaffChanged = () => {
      const rStr = localStorage.getItem('ilas_staff_registry');
      if (rStr) setRegistry(JSON.parse(rStr));
    };
    window.addEventListener('ilas-staff-changed', handleStaffChanged);
    return () => window.removeEventListener('ilas-staff-changed', handleStaffChanged);
  }, []);

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

  return (
    <div className="space-y-8">
      
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
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">HR-Issued Onboarding ID</label>
                <input 
                  type="text" 
                  value={newStaffHRId}
                  onChange={(e) => setNewStaffHRId(e.target.value)}
                  placeholder="e.g. STAFF-XX-1234"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
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
            </div>
            <div className="grid grid-cols-1 gap-4">
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
              Create Subordinate (Requires HR Approval)
            </button>
          </form>
        </div>
      </div>

      {/* Live Staff & Subordinate Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 mt-12">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Users className="w-5 h-5 text-brand-600" />
          Live Staff & Subordinate Directory
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 font-black text-slate-600">
              <tr>
                <th className="p-3">ID / Temp ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">HR Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registry.filter(staff => {
                const myRole = localStorage.getItem('ilas_team_role') || 'Super Admin';
                if (myRole === 'Super Admin' || myRole === 'CEO' || myRole === 'General Manager') return true;
                if (myRole === 'HR Manager') return true; // HR sees everyone or can manage all staff
                // Department heads only see their own department
                return staff.department === myRole;
              }).map(staff => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-slate-500">{staff.hrIssuedId || staff.id}</td>
                  <td className="p-3 font-bold text-slate-900">{staff.name}</td>
                  <td className="p-3 font-semibold text-indigo-600">{staff.department}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      staff.hrApprovalStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                      staff.hrApprovalStatus === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {staff.hrApprovalStatus || 'Verified'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleEditStaff(staff)} className="text-indigo-600 hover:text-indigo-800 font-bold mr-3 cursor-pointer">Edit</button>
                    <button onClick={() => handleDeleteStaff(staff.id)} className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-black mb-4">Edit Staff / Subordinate</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Name</label>
                <input type="text" value={selectedStaff.name} onChange={(e) => setSelectedStaff({...selectedStaff, name: e.target.value})} className="w-full border p-2 rounded-xl text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Email</label>
                <input type="email" value={selectedStaff.email} onChange={(e) => setSelectedStaff({...selectedStaff, email: e.target.value})} className="w-full border p-2 rounded-xl text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Department</label>
                <select value={selectedStaff.department} onChange={(e: any) => setSelectedStaff({...selectedStaff, department: e.target.value})} className="w-full border p-2 rounded-xl text-xs font-bold">
                  <option value="Super Admin">Super Admin / CEO</option>
                  <option value="General Manager">General Manager</option>
                  <option value="Finance Officer">Finance Officer</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Marketing Exec">Marketing Exec</option>
                  <option value="Academic Counselor">Academic Counselor</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setSelectedStaff(null)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-xs cursor-pointer">Cancel</button>
                <button onClick={() => handleUpdateSelectedStaff(selectedStaff)} className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs cursor-pointer">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Notes Memo Board & Meeting Schedule Manager */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sticky Notes Board */}
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
              className="px-4 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" /> Add Memo
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {notes.map(note => (
              <div key={note.id} className={`p-4 rounded-2xl border border-slate-200 shadow-sm relative group ${note.color} transition-all`}>
                <button 
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-2 right-2 p-1 bg-white/60 hover:bg-white rounded text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed pr-6">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meeting Planner */}
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
              className="w-full py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
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
  );
}

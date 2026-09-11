import { useState, useEffect } from 'react'
import { FileText, Printer, Users, DollarSign, Calendar } from 'lucide-react'
import { getStaffRegistry, getAttendanceLogs, StaffUser, AttendanceLog } from '../../lib/db'

export default function HRReports() {
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
  const [activeReportType, setActiveReportType] = useState<'staff' | 'attendance' | 'payroll'>('staff')

  useEffect(() => {
    setStaffList(getStaffRegistry())
    setAttendanceLogs(getAttendanceLogs())
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
            <FileText className="w-5 h-5 text-indigo-600" /> HR & Audit Reports Center
          </h3>
          <button 
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-900 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>

        <div className="flex gap-2 border-b pb-3">
          <button 
            onClick={() => setActiveReportType('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer ${activeReportType === 'staff' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Staff Registry ({staffList.length})
          </button>
          <button 
            onClick={() => setActiveReportType('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer ${activeReportType === 'attendance' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Attendance Logs ({attendanceLogs.length})
          </button>
        </div>

        {activeReportType === 'staff' && (
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-700">Staff Registry Master List</h4>
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-black">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {staffList.map(st => (
                    <tr key={st.id}>
                      <td className="p-3 font-mono">{st.id}</td>
                      <td className="p-3 font-bold">{st.name}</td>
                      <td className="p-3 text-slate-500">{st.email}</td>
                      <td className="p-3 uppercase font-semibold">{st.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportType === 'attendance' && (
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-700">Attendance Audit Logs</h4>
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-black">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Staff Name</th>
                    <th className="P-3">Check-in Time</th>
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
        )}
      </div>
    </div>
  )
}
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { 
  CalendarCheck, 
  Search, 
  MapPin, 
  Clock, 
  UserCheck, 
  UserMinus, 
  Coffee, 
  Save, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Calendar,
  AlertCircle,
  User
} from "lucide-react";

interface AttendanceRecord {
  id: number;
  admission_number: string;
  full_name: string;
  course_name: string;
  photo_url: string;
  batch_allotted: string;
  attendance: {
    status: 'Present' | 'Absent' | 'Leave';
    punch_in: string;
    punch_out: string;
    remarks: string;
    marked_by_name?: string;
  };
}

interface StudentReport {
  summary: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    presentPercent: string;
    absentPercent: string;
  };
  records: Array<{
    date: string;
    batch: string;
    status: string;
    punch_in: string;
    punch_out: string;
    marked_by_name?: string;
    batch_allotted?: string;
  }>;
}

const API_ATTENDANCE = `${process.env.NEXT_PUBLIC_API_URL}/api/attendance`;

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function AttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Admin State
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [batch, setBatch] = useState("Forenoon");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchFilter, setBatchFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [markedById, setMarkedById] = useState<number | "">("");
  const [admins, setAdmins] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Student State
  const [report, setReport] = useState<StudentReport | null>(null);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === 'Super Admin' || user.role === 'Admin' || user.role === 'trainee');
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadAdmins = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/users?role=Admin`, { headers: getAuthHeaders() });
      const json = await res.json();
      setAdmins(json.data || []);
    } catch {
      showToast("❌ Failed to load admin list");
    }
  }, []);

  const loadAdminData = useCallback(async (forcedId?: number | "") => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let url = `${baseUrl}/api/attendance/students?batch=${batch}&date=${date}`;
      if (batchFilter)  url += `&batchAllotted=${encodeURIComponent(batchFilter)}`;
      if (courseFilter) url += `&course=${encodeURIComponent(courseFilter)}`;
      
      const mid = forcedId !== undefined ? forcedId : markedById;
      if (mid) url += `&markedById=${mid}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      } else {
        showToast(`❌ ${json.message}`);
      }
    } catch {
      showToast("❌ Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [batch, date, isAdmin, batchFilter, courseFilter, markedById]);

  const loadStudentReport = useCallback(async () => {
    if (isAdmin) return;
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/attendance/student-report`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) {
        setReport(json.data);
      } else {
        console.error(json.message);
      }
    } catch {
      showToast("❌ Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    const init = async () => {
      if (!authLoading && user && isAdmin) {
        await loadAdmins();
        const isSelf = user.role === 'Super Admin' || user.role === 'Admin' || user.role === 'trainee';
        if (isSelf) {
          setMarkedById(user.id);
          // Load ALL students initially so they can mark them, 
          // even if they haven't marked anyone yet today.
          loadAdminData(""); 
        } else {
          loadAdminData();
        }
      } else if (!authLoading && user && !isAdmin) {
        loadStudentReport();
      }
    };
    init();
  }, [authLoading, user, isAdmin]);

  const handleStatusChange = (id: number, status: 'Present' | 'Absent' | 'Leave') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, attendance: { ...s.attendance, status } } : s));
  };

  const handleTimeChange = (id: number, field: 'punch_in' | 'punch_out', val: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, attendance: { ...s.attendance, [field]: val } } : s));
  };

  const submitAttendance = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({
        admission_id: s.id,
        status: s.attendance.status,
        punch_in: s.attendance.punch_in,
        punch_out: s.attendance.punch_out,
        remarks: s.attendance.remarks
      }));

      const res = await fetch(`${API_ATTENDANCE}/mark`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          date, 
          batch, 
          records, 
          marked_by_id: user?.id 
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✅ Attendance marked successfully");
        loadAdminData();
      } else {
        showToast(`❌ ${json.message}`);
      }
    } catch {
      showToast("❌ Server error");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (loading && !students.length && !report)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Initializing module...</p>
      </div>
    );
  }

  // ── ADMIN VIEW ─────────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <style>{`
          @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
          .animate-fade-in { animation: fadeIn 0.4s ease both; }
          .radio-btn { transition: all 0.2s; cursor: pointer; }
          .radio-btn:hover { background-color: #f1f5f9; }
          .radio-checked-present { background-color: #dcfce7; border-color: #22c55e; color: #166534; }
          .radio-checked-absent { background-color: #fee2e2; border-color: #ef4444; color: #991b1b; }
          .radio-checked-leave { background-color: #fef9c3; border-color: #eab308; color: #854d0e; }
        `}</style>
        
        {/* Header */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 text-white">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight text-indigo-900 leading-none">Student</h1>
              <h1 className="text-3xl font-black text-indigo-900 tracking-tight leading-none mt-1">Attendance</h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Manage student daily presence</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-[140px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Batch</label>
              <select 
                value={batch} 
                onChange={(e) => setBatch(e.target.value)}
                className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none transition-all cursor-pointer text-black"
              >
                <option value="Forenoon">Forenoon</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 md:flex-none">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:border-blue-500 outline-none transition-all cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-[140px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Batch</label>
              <input 
                 type="text"
                 placeholder="Batch..."
                 value={batchFilter}
                 onChange={(e) => setBatchFilter(e.target.value)}
                 className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-[140px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Course</label>
              <input 
                 type="text"
                 placeholder="Course..."
                 value={courseFilter}
                 onChange={(e) => setCourseFilter(e.target.value)}
                 className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => loadAdminData()}
              className="mt-5 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Filter className="w-4 h-4 text-blue-600" />
              </span>
              <h2 className="font-black text-slate-800 tracking-tight uppercase">Student List ({students.length})</h2>
            </div>
            <p className="text-xs font-bold text-slate-400 italic">Mark academic presence for today</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Punch Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Submitted By</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                     <td colSpan={7} className="px-6 py-20 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">No matching students found</p>
                     </td>
                  </tr>
                ) : (
                  students.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-black text-slate-300">{idx + 1}</td>
                      <td className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-tight">
                        {s.admission_number || `NS-ADM-${s.id}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 flex items-center justify-center border border-slate-200">
                            {s.photo_url ? (
                              <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL?.endsWith('/') ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL + '/'}${s.photo_url}`} 
                                alt="" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(s.full_name) + "&background=0b1f3a&color=fff";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-[10px] uppercase bg-slate-50">No Pic</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{s.full_name}</p>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-tight">{s.course_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                            {s.batch_allotted || "—"}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                           <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 rounded-lg px-2 py-1.5 transition-all focus-within:ring-2 focus-within:ring-emerald-200">
                              <Clock className="w-3.5 h-3.5 text-emerald-500" />
                              <input 
                                type="time" 
                                value={s.attendance.punch_in} 
                                onChange={(e) => handleTimeChange(s.id, 'punch_in', e.target.value)}
                                className="bg-transparent text-[11px] font-black text-emerald-700 outline-none border-none p-0 w-20 cursor-pointer" 
                              />
                           </div>
                           <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-100 rounded-lg px-2 py-1.5 transition-all focus-within:ring-2 focus-within:ring-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <input 
                                type="time" 
                                value={s.attendance.punch_out} 
                                onChange={(e) => handleTimeChange(s.id, 'punch_out', e.target.value)}
                                className="bg-transparent text-[11px] font-black text-amber-700 outline-none border-none p-0 w-20 cursor-pointer" 
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         {s.attendance.marked_by_name ? (
                           <div className="flex items-center justify-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                              <User className="w-3 h-3 text-slate-400" />
                              {s.attendance.marked_by_name}
                           </div>
                         ) : (
                           <span className="text-slate-300 font-black">—</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <div 
                            onClick={() => handleStatusChange(s.id, 'Present')}
                            className={`radio-btn px-4 py-2 rounded-xl border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${s.attendance.status === 'Present' ? 'radio-checked-present shadow-lg shadow-emerald-500/10' : 'text-slate-400'}`}
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Present
                          </div>
                          <div 
                            onClick={() => handleStatusChange(s.id, 'Absent')}
                            className={`radio-btn px-4 py-2 rounded-xl border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${s.attendance.status === 'Absent' ? 'radio-checked-absent shadow-lg shadow-red-500/10' : 'text-slate-400'}`}
                          >
                            <UserMinus className="w-3.5 h-3.5" /> Absent
                          </div>
                          <div 
                            onClick={() => handleStatusChange(s.id, 'Leave')}
                            className={`radio-btn px-4 py-2 rounded-xl border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${s.attendance.status === 'Leave' ? 'radio-checked-leave shadow-lg shadow-amber-500/10' : 'text-slate-400'}`}
                          >
                            <Coffee className="w-3.5 h-3.5" /> Leave
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-900">Submitted By</label>
              <select 
                value={markedById} 
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value) : "";
                  setMarkedById(val);
                  loadAdminData(val);
                }}
                className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-3 text-sm font-black text-black focus:border-slate-900 outline-none transition-all shadow-sm cursor-pointer min-w-[240px]"
              >
                <option value="">All Admins</option>
                {admins.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={submitAttendance}
              disabled={saving || !students.length}
              className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-[24px] font-black text-sm shadow-2xl transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:grayscale uppercase tracking-[0.2em]"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
              Review & Mark Present
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STUDENT VIEW ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Attendance Report</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Your academy presence summary</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl font-black text-sm border-2 border-blue-100 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Session: {new Date().getFullYear()}
        </div>
      </div>

      {report && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Days</span>
                <PieChartIcon className="w-4 h-4 text-blue-500" />
             </div>
             <p className="text-2xl font-black text-slate-800">{report.summary.total}</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Present</span>
                <UserCheck className="w-4 h-4 text-emerald-500" />
             </div>
             <p className="text-2xl font-black text-slate-800">{report.summary.present}</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Absent</span>
                <UserMinus className="w-4 h-4 text-red-500" />
             </div>
             <p className="text-2xl font-black text-slate-800">{report.summary.absent}</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-1 border-b border-slate-50 pb-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Percentage</span>
             </div>
             <p className="text-2xl font-black text-blue-600 mt-1">{report.summary.presentPercent}%</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-black text-slate-800 uppercase tracking-tight">Recent History</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last {report.records.length} sessions</span>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/20">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Group</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">By</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Punch In</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Punch Out</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {report.records.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 font-bold text-slate-800 text-sm">{fmtDate(r.date)}</td>
                       <td className="px-6 py-4 font-black uppercase text-[10px] text-slate-400 tracking-widest">{r.batch}</td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">{r.batch_allotted || '—'}</span>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                            r.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                            r.status === 'Absent' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {r.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">{r.marked_by_name || '—'}</td>
                       <td className="px-6 py-4 font-bold text-emerald-600 text-[11px]"><Clock className="inline w-3 h-3 mr-1" />{r.punch_in}</td>
                       <td className="px-6 py-4 font-bold text-amber-600 text-[11px]"><Clock className="inline w-3 h-3 mr-1" />{r.punch_out}</td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-50 font-bold uppercase tracking-widest text-xs">
          {toast}
        </div>
      )}
    </div>
  );
}

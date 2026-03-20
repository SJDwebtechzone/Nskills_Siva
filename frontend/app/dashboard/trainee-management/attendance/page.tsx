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

const API_ATTENDANCE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance`;

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export default function TraineeAttendancePage() {
  const { user, loading: authLoading } = useAuth();
  
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [batch, setBatch] = useState("Forenoon");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchFilter, setBatchFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [markedById, setMarkedById] = useState<number | "">("");
  const [trainees, setTrainees] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadTrainees = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/users?role=trainee`, { headers: getAuthHeaders() });
      const json = await res.json();
      setTrainees(json.data || []);
    } catch {
      showToast("❌ Failed to load trainees list");
    }
  }, []);

  const loadStudents = useCallback(async (forcedId?: number | "") => {
    setLoading(true);
    try {
      let url = `${API_ATTENDANCE}/students?batch=${batch}&date=${date}`;
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
  }, [batch, date, batchFilter, courseFilter, markedById]);

  useEffect(() => {
    const init = async () => {
      if (!authLoading && user) {
        await loadTrainees();
        
        // Default to self if trainee
        if (user.role === 'trainee') {
          setMarkedById(user.id);
          // Don't filter the student list yet if they need to MARK them?
          // Actually, if we filter by self and we haven't marked anyone, it's empty.
          // I'll load with NO filter initially so they can mark everyone, 
          // but leave the dropdown set to them.
          loadStudents(""); 
        } else {
          loadStudents();
        }
      }
    };
    init();
  }, [authLoading, user]); // Removed loadTrainees from deps to avoid loop if it changes

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
        loadStudents();
      } else {
        showToast(`❌ ${json.message}`);
      }
    } catch {
      showToast("❌ Server error");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (loading && !students.length)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading student data...</p>
      </div>
    );
  }

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
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight text-indigo-900 leading-none"></h1>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight text-indigo-900 leading-none mt-1">Attendance</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Student Presence Control</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-[140px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Batch</label>
            <select 
              value={batch} 
              onChange={(e) => setBatch(e.target.value)}
              className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all cursor-pointer text-black"
            >
              <option value="Forenoon">Forenoon</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 md:flex-none">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:border-indigo-500 outline-none transition-all cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-[140px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Batch</label>
            <input 
               type="text"
               placeholder="Batch..."
               value={batchFilter}
               onChange={(e) => setBatchFilter(e.target.value)}
               className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 md:flex-none min-w-[140px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter Course</label>
            <input 
               type="text"
               placeholder="Course..."
               value={courseFilter}
               onChange={(e) => setCourseFilter(e.target.value)}
               className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => loadStudents()}
            className="mt-5 bg-indigo-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Filter className="w-4 h-4 text-indigo-600" />
            </span>
            <h2 className="font-black text-slate-800 tracking-tight uppercase">Assigned Students ({students.length})</h2>
          </div>
          <p className="text-xs font-bold text-slate-400 italic">Mark attendance for today's session</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
                      <p className="text-slate-400 font-bold uppercase tracking-widest">No students found matching filters</p>
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
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                          {s.photo_url ? (
                            <img src={`${process.env.NEXT_PUBLIC_API_URL}${s.photo_url}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase">IMG</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{s.full_name}</p>
                          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-tight">{s.course_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
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

        <div className={`p-10 bg-slate-50 border-t border-slate-100 flex items-center ${user?.role !== 'trainee' ? 'justify-between' : 'justify-end'} gap-6`}>
          {user?.role !== 'trainee' && (
            <div className="flex flex-col gap-1 w-full max-w-sm">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-900 mb-1 leading-none">MARK ATTENDANCE AS (TRAINEE NAME)</label>
              <select 
                value={markedById} 
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value) : "";
                  setMarkedById(val);
                }}
                className="bg-white border-2 border-indigo-200 rounded-3xl px-8 py-4 text-base font-black text-black focus:border-indigo-600 outline-none transition-all shadow-sm cursor-pointer w-full"
              >
                {trainees.length === 0 && <option value="">Loading Trainees...</option>}
                {trainees.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}
          <button 
            onClick={submitAttendance}
            disabled={saving || !students.length}
            className="bg-indigo-600 hover:bg-black text-white px-12 py-5 rounded-[22px] font-black text-sm shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:grayscale uppercase tracking-[0.2em] whitespace-nowrap h-fit"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
            Review & Mark Present
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-bottom duration-300 font-bold border-2 border-white/10 uppercase tracking-widest text-xs">
          {toast}
        </div>
      )}
    </div>
  );
}

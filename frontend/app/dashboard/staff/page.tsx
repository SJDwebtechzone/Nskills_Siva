"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Briefcase, Search, Mail, Calendar, Hash, Shield, Users } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role_name: string;
  phone_number: string;
  dob: string;
  created_at: string;
}

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function initials(name: string) {
  return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function StaffPage() {
  const { can } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    dob: "",
    email: "",
    password: "",
    role_id: 1, // Default to Trainee
  });
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?role=trainee`, { headers: getAuthHeaders() });
      const json = await res.json();
      setStaff(json.data || []);
    } catch {
      showToast("❌ Failed to load Staff / Trainees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: 'Active' }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast("✅ Staff credential created successfully");
        setIsModalOpen(false);
        setFormData({ name: "", phone_number: "", dob: "", email: "", password: "", role_id: 1 });
        load();
      } else {
        showToast(`❌ ${json.message}`);
      }
    } catch {
      showToast("❌ Server error");
    } finally {
      setSaving(false);
    }
  };

  if (!can("Staff / Trainee", "view")) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="text-5xl">⛔</div>
        <h2 className="text-xl font-black text-slate-800">Access Denied</h2>
        <p className="text-slate-400 font-bold text-sm">You don't have permission to view Staff / Trainees.</p>
      </div>
    );
  }

  const filtered = staff.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .staff-card { background: #fff; border-radius: 20px; padding: 24px; border: 1.5px solid #f1f5f9; transition: all 0.3s; animation: fadeUp 0.4s ease both; }
        .staff-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalUp { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:none} }
        .animate-up { animation: modalUp 0.3s ease both; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            Staff / Trainee
          </h1>
          <p className="text-slate-500 font-medium mt-1">View and manage all staff members and trainees.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
          >
            + Create New Staff
          </button>
          <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-bold text-sm border border-purple-100">
            {staff.length} Total Staff
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all placeholder:text-slate-300"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-purple-500 font-bold animate-pulse">Loading staff...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filtered.map((member, i) => (
            <div
              key={member.id}
              className="staff-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-purple-500/20">
                  {initials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{member.email}</span>
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-2 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded-lg uppercase tracking-widest">
                  <Shield className="w-3 h-3" />
                  {member.role_name || "TRAINEE"}
                </span>
                {member.phone_number && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    {member.phone_number}
                  </span>
                )}
              </div>
              <div className="border-t border-slate-50 pt-4 mt-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {fmtDate(member.created_at)}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {member.id}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">
                {search ? "No staff match your search." : "No staff / trainees found."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Staff Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-lg shadow-2xl relative animate-up">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users size={18} className="text-purple-600" />
              </div>
              Create Staff Credentials
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-purple-500 transition-all text-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.phone_number} 
                    onChange={e => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="9123456780"
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-purple-500 transition-all text-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DOB</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.dob} 
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-purple-500 transition-all text-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                  <select 
                    value={formData.role_id} 
                    onChange={e => setFormData({...formData, role_id: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-purple-500 transition-all text-black"
                  >
                    <option value={1}>Trainee</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email / Username</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="name@nskill.in"
                  className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-purple-500 transition-all text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
                <input 
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-purple-500 transition-all text-black"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-right duration-300 z-[200]">
          {toast}
        </div>
      )}
    </div>
  );
}

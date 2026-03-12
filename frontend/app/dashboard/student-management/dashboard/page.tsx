"use client";

import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Search, Filter, Plus } from "lucide-react";

export default function StudentManagementDashboard() {
  const pathname = usePathname();
  const section = pathname.split("/").slice(-2)[0].replace(/-/g, " ").toUpperCase();
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ").toUpperCase() || "DASHBOARD";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header section with glassmorphism feel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl shadow-blue-500/5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {section}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {pageTitle}
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">
            Welcome to the centralized hub for {section.toLowerCase()} management.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25">
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "1,284", trend: "+12%", color: "blue" },
          { label: "Active Courses", value: "42", trend: "0%", color: "emerald" },
          { label: "Pending Fees", value: "₹2.4L", trend: "-5%", color: "amber" },
          { label: "Certificates Issued", value: "856", trend: "+18%", color: "purple" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 
                stat.trend.startsWith('-') ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
              }`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Placeholder */}
      <div className="bg-white p-16 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50/50 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700 delay-100" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Modules Integrated Successfully</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
            The {pageTitle.toLowerCase()} interface for {section.toLowerCase()} is now live. 
            Detailed analytics and management controls are being populated in real-time.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 font-bold text-sm">
              Real-time Sync Active
            </div>
            <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 font-bold text-sm">
              Role-based Access Control
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

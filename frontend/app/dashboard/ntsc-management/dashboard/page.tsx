"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Search, Filter, Plus } from "lucide-react";

export default function NTSCManagementDashboard() {
  const pathname = usePathname();
  const section = "NTSC MANAGEMENT";
  const pageTitle = "DASHBOARD";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl shadow-emerald-500/5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {section}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {pageTitle}
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">
            High-level administrative terminal for NTSC operations and compliance.
          </p>
        </div>
      </div>

      <div className="bg-white p-16 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">NTSC Admin Control Ready</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">
            The NTSC Management system has been successfully deployed.
            Administrative workflows and security protocols are active.
          </p>
        </div>
      </div>
    </div>
  );
}

// app/dashboard/layout.tsx

"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCheck,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  UserCircle,
  Home,
  ImagePlay,
  Layers,
  LogOut,
  Award,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(
    pathname.includes("/ntsc-admin") ||
    pathname.includes("/associate") ||
    pathname.includes("/students") ||
    pathname.includes("/staff")
  );

  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(
    pathname.includes("/dashboard/settings")
  );

  const userManagementItems = [
    { name: "NTSC Admin", path: "/dashboard/ntsc-admin", icon: ShieldCheck },
    { name: "Associate", path: "/dashboard/associate", icon: UserCheck },
    { name: "Students", path: "/dashboard/students", icon: GraduationCap },
    { name: "Staff / Trainee", path: "/dashboard/staff", icon: Briefcase },
  ];

  const websiteSettingsItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Homepage Banner", path: "/dashboard/settings?tab=banner", icon: ImagePlay },
    { name: "Featured Popup", path: "/dashboard/settings?tab=popup", icon: Layers },
    { name: "Latest News", path: "/dashboard/settings?tab=news", icon: Settings },
    { name: "Accreditations", path: "/dashboard/settings?tab=accreditations", icon: Award },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* Sidebar */}
      <aside className="w-72 bg-[#0b1f3a] text-white flex flex-col hidden md:flex shadow-2xl border-r border-white/5">
        {/* Logo */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl font-bold">NS</span>
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase">NSkill India</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 pb-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">
            Admin Panel
          </p>

          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${pathname === "/dashboard"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${pathname === "/dashboard" ? "text-white" : "group-hover:text-blue-400"}`} />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>

            {/* Payment */}
            <li>
              <Link
                href="/dashboard/payments"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${pathname === "/dashboard/payments"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <CreditCard className={`w-5 h-5 ${pathname === "/dashboard/payments" ? "text-white" : "group-hover:text-blue-400"}`} />
                <span className="font-medium">Payment</span>
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="h-px bg-white/10 my-5 mx-2" />

          {/* User Management Dropdown */}
          <div className="space-y-1 mb-1">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${isUserMenuOpen ? "text-white bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${isUserMenuOpen ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                <span className="font-medium">User Management</span>
              </div>
              {isUserMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isUserMenuOpen && (
              <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                {userManagementItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${pathname === item.path
                        ? "text-blue-400 font-bold bg-blue-400/10"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Website Settings Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${isSettingsMenuOpen ? "text-white bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-5 h-5 ${isSettingsMenuOpen ? "text-blue-400" : "group-hover:rotate-45 group-hover:text-blue-400 transition-transform duration-500"}`} />
                <span className="font-medium">Website Settings</span>
              </div>
              {isSettingsMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isSettingsMenuOpen && (
              <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                {websiteSettingsItems.map((item) => {
                  // Determine active state based on item key
                  let isActive = false;
                  if (item.name === "Home") {
                    isActive = pathname === "/";
                  } else if (item.name === "Homepage Banner") {
                    isActive = pathname.includes("/dashboard/settings") && tabParam !== "popup" && tabParam !== "news" && tabParam !== "accreditations";
                  } else if (item.name === "Featured Popup") {
                    isActive = pathname.includes("/dashboard/settings") && tabParam === "popup";
                  } else if (item.name === "Latest News") {
                    isActive = pathname.includes("/dashboard/settings") && tabParam === "news";
                  } else if (item.name === "Accreditations") {
                    isActive = pathname.includes("/dashboard/settings") && tabParam === "accreditations";
                  }
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${isActive
                          ? "text-blue-400 font-bold bg-blue-400/10"
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>

        {/* Logout at Bottom */}
        <div className="p-6">
          <div className="h-px bg-white/10 mb-4" />
          <Link
            href="/login/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {pathname === "/dashboard" ? "Overview" : pathname.split("/").pop()?.replace(/-/g, " ").toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">Super Admin</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 tracking-wide">admin@nskill.in</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shadow-inner group cursor-pointer hover:bg-slate-200 transition-colors">
                <UserCircle className="w-6 h-6 group-hover:text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
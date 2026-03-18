// app/dashboard/layout.tsx
// ✅ Document 8 — Full design PRESERVED (Tailwind + Lucide icons + Website Settings)
// ✅ Document 7 — Role-based access FULLY ADDED
// ✅ Website Settings — permission filtered (was missing from Document 7)

"use client";

import { ReactNode, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  Phone,
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
  UserCog,
  KeyRound,
  ClipboardList,
  FileText,
  BookOpen,
  FileDigit,
  Receipt,
  CalendarCheck,
  MonitorPlay,
  PenTool,
  Video,
  CheckSquare,
  FileDown,
  Send,
  Upload,
  MessageSquare,
  Share2,
  DollarSign,
  Clock,
  LayoutDashboard as DashboardIcon,
  Play,
  CheckCircle,
  StopCircle,
  Printer,
  RefreshCw,
  Wallet,
  Eye,
  Image,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// ── Menu items with module keys for permission filtering ────────────
const userManagementItems = [
  { name: "NTSC Admin",      path: "/dashboard/ntsc-admin",   module: "NTSC Admin",      icon: ShieldCheck   },
  { name: "Associate",       path: "/dashboard/associate",    module: "Associate",       icon: UserCheck     },
  { name: "Students",        path: "/dashboard/students",     module: "Students",        icon: GraduationCap },
  { name: "Staff / Trainee", path: "/dashboard/staff",        module: "Staff / Trainee", icon: Briefcase     },
  { name: "Manage Users",    path: "/dashboard/manage-users", module: "Manage Users",    icon: UserCog       },
  { name: "Manage Roles",    path: "/dashboard/manage-roles", module: "Manage Roles",    icon: KeyRound      },
];

const websiteSettingsItems = [
  { name: "Home",            path: "/",                                     module: "Home",            icon: Home,      tab: null              },
  { name: "Homepage Banner", path: "/dashboard/settings?tab=banner",        module: "Homepage Banner", icon: ImagePlay, tab: "banner"          },
  { name: "Feature Popup",  path: "/dashboard/settings?tab=popup",         module: "Feature Popup",  icon: Layers,    tab: "popup"           },
  { name: "Latest News",     path: "/dashboard/settings?tab=news",          module: "Latest News",     icon: Settings,  tab: "news"            },
  { name: "Accreditions",  path: "/dashboard/settings?tab=accreditations",module: "Accreditions",  icon: Award,     tab: "accreditations"  },
  { name: "Contact Info",    path: "/dashboard/settings/contact-info",      module: "Home",            icon: Phone,     tab: null              },
];

const associateManagementItems = [
  { name: "Dashboard",             path: "/dashboard/associate-management/dashboard", module: "Associate Management", icon: DashboardIcon },
  { name: "Enquiry Form",          path: "/dashboard/associate-management/enquiry",   module: "Associate Management", icon: ClipboardList },
  { name: "Admission Form",        path: "/dashboard/associate-management/admission",  module: "Associate Management", icon: UserCheck      },
  { name: "Referral Fee Tracking", path: "/dashboard/associate-management/referral-tracking", module: "Associate Management", icon: DollarSign },
  { name: "Referral Fee History",  path: "/dashboard/ntsc-management/referral-payment", module: "Associate Management", icon: Wallet },
];

const studentManagementItems = [
  { name: "Dashboard",                path: "/dashboard/student-management/dashboard",    icon: DashboardIcon },
  { name: "ID Generation",            path: "/dashboard/student-management/id-generation", icon: FileDigit },
  { name: "Course and Fees Details",  path: "/dashboard/student-management/course-details", icon: BookOpen },
  { name: "Fees Receipt",             path: "/dashboard/student-management/fees-receipt",   icon: Receipt },
  { name: "Pre-Test",                 path: "/dashboard/student-management/pre-test",       icon: ClipboardList },
  { name: "Daily Attendance",         path: "/dashboard/student-management/attendance",     icon: CalendarCheck },
  { name: "Online Test",              path: "/dashboard/student-management/online-test",    icon: MonitorPlay },
  { name: "Assessment and Assignment",path: "/dashboard/student-management/assessments",     icon: PenTool },
  { name: "Practical Video",          path: "/dashboard/student-management/practical-video", icon: Video },
  { name: "Final Exam",               path: "/dashboard/student-management/final-exam",      icon: GraduationCap },
  { name: "Mark and Result",          path: "/dashboard/student-management/results",         icon: CheckSquare },
  {
    name: "Certification",
    icon: Award,
    isDropdown: true,
    children: [
      { name: "Download Certificate", path: "/dashboard/student-management/certificates/download", icon: FileDown },
      { name: "Request Certificate",  path: "/dashboard/student-management/certificates/request",  icon: Send },
    ]
  },
  { name: "Placement Details Uploads", path: "/dashboard/student-management/placements",         icon: Upload },
  { name: "Feedback & Testimonial",    path: "/dashboard/student-management/feedback",           icon: MessageSquare },
  { name: "Google Review & Videos",    path: "/dashboard/student-management/reviews",            icon: Share2 },
  {
    name: "Fee Details",
    icon: DollarSign,
    isDropdown: true,
    children: [
      { name: "Pending Fee", path: "/dashboard/student-management/fees/pending", icon: Clock },
      { name: "Paid Fee",    path: "/dashboard/student-management/fees/paid",     icon: CheckSquare },
    ]
  }
];
const traineeManagementItems = [
  { name: "Dashboard", path: "/dashboard/trainee-management/dashboard", icon: DashboardIcon },
  {
    name: "Class Status",
    icon: ClipboardList,
    isDropdown: true,
    children: [
      { name: "Ongoing",    path: "/dashboard/trainee-management/class-status/ongoing",    icon: Play },
      { name: "Completed",  path: "/dashboard/trainee-management/class-status/completed",  icon: CheckCircle },
      { name: "Discontinue",path: "/dashboard/trainee-management/class-status/discontinue",icon: StopCircle },
    ]
  },
  { name: "Attendance Status",        path: "/dashboard/trainee-management/attendance",     icon: CalendarCheck },
  { name: "Pre-Test",                 path: "/dashboard/trainee-management/pre-test",       icon: FileText },
  { name: "Online Test",              path: "/dashboard/trainee-management/online-test",    icon: MonitorPlay },
  { name: "Assessment and Assignment",path: "/dashboard/trainee-management/assessments",     icon: PenTool },
  { name: "Practical Video",          path: "/dashboard/trainee-management/practical-video", icon: Video },
  { name: "Final Exam",               path: "/dashboard/trainee-management/final-exam",      icon: GraduationCap },
  { name: "Mark and Result",          path: "/dashboard/trainee-management/results",         icon: CheckSquare },
];

const ntscManagementItems = [
  { name: "Dashboard", path: "/dashboard/ntsc-management/dashboard", icon: DashboardIcon },
  { name: "Download A4 Sheet", path: "/dashboard/ntsc-management/download-a4", icon: Printer },
  { name: "Enquiry / Admission and Document", path: "/dashboard/ntsc-management/enquiry-admission", icon: FileText },
  { name: "Update Class Status", path: "/dashboard/ntsc-management/class-status", icon: RefreshCw },
  { name: "Monitor Student Changes and Approval", path: "/dashboard/ntsc-management/monitor-approvals", icon: Eye },
];

const backgroundImagesItems = [
  { name: "Background Images", path: "/dashboard/background-images", icon: Image },
];

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");

  // ✅ Auth state from AuthContext
  const { user, permissions, logout, loading } = useAuth();

  // ✅ Dropdown state — Document 8 original
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(
    pathname.includes("/ntsc-admin")    ||
    pathname.includes("/associate")     ||
    pathname.includes("/students")      ||
    pathname.includes("/staff")         ||
    pathname.includes("/manage-users")  ||
    pathname.includes("/manage-roles")
  );

  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(
    pathname.includes("/dashboard/settings")
  );

  const [isAssociateMenuOpen, setIsAssociateMenuOpen] = useState(
    pathname.includes("/associate-management")
  );

  const [isStudentManagementOpen, setIsStudentManagementOpen] = useState(
    pathname.includes("/student-management")
  );

  const [isTraineeManagementOpen, setIsTraineeManagementOpen] = useState(
    pathname.includes("/trainee-management")
  );

  const [isNTSCManagementOpen, setIsNTSCManagementOpen] = useState(
    pathname.includes("/ntsc-management")
  );

  const [isCertificationOpen, setIsCertificationOpen] = useState(
    pathname.includes("/certificates")
  );

  const [isFeeDetailsOpen, setIsFeeDetailsOpen] = useState(
    pathname.includes("/fees/")
  );

  const [isClassStatusOpen, setIsClassStatusOpen] = useState(
    pathname.includes("/class-status")
  );

  const [isBackgroundImagesOpen, setIsBackgroundImagesOpen] = useState(
    pathname.includes("/background-images")
  );

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // ✅ Filter menus by permission
  const showDashboard           = permissions?.["Dashboard"]?.view;
  const showPayments            = permissions?.["Payments"]?.view;
  const visibleUserItems        = userManagementItems.filter((i) => permissions?.[i.module]?.view);
  const visibleSettingsItems    = websiteSettingsItems.filter(
    (i) => permissions?.[i.module]?.view || showDashboard
  );
  // Student Management: show if specific permission exists OR if user has Dashboard access (admin)
  const visibleAssociateItems   = associateManagementItems.filter(
    (i) => {
      // Referral Fee History is ONLY for Admins/Super Admins
      if (i.name === "Referral Fee History") {
        return user?.role === "Admin" || user?.role === "Super Admin";
      }

      return permissions?.[i.module!]?.view || showDashboard;
    }
  );

  // ✅ Initials generator
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // ✅ Tab-aware active state — Document 8 exact logic
  const isSettingActive = (name: string): boolean => {
    if (name === "Home")            return pathname === "/";
    if (name === "Homepage Banner") return pathname.includes("/dashboard/settings") && tabParam !== "popup" && tabParam !== "news" && tabParam !== "accreditations";
    if (name === "Feature Popup")  return pathname.includes("/dashboard/settings") && tabParam === "popup";
    if (name === "Latest News")     return pathname.includes("/dashboard/settings") && tabParam === "news";
    if (name === "Accreditions")  return pathname.includes("/dashboard/settings") && tabParam === "accreditations";
    if (name === "Contact Info")    return pathname.includes("/dashboard/settings/contact-info");
    return false;
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <p className="text-blue-600 font-semibold text-sm">Loading...</p>
      </div>
    );
  }

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

        <nav className="flex-1 px-6 pb-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">
            Admin Panel
          </p>

          <ul className="space-y-1">

            {/* ✅ Dashboard */}
            {showDashboard && (
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    pathname === "/dashboard"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className={`w-5 h-5 ${pathname === "/dashboard" ? "text-white" : "group-hover:text-blue-400"}`} />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>
            )}

            {/* ✅ Payment */}
            {showPayments && (
              <li>
                <Link
                  href="/dashboard/payments"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    pathname === "/dashboard/payments"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${pathname === "/dashboard/payments" ? "text-white" : "group-hover:text-blue-400"}`} />
                  <span className="font-medium">Payment</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="h-px bg-white/10 my-5 mx-2" />

          {/* ✅ User Management — only if at least 1 item permitted */}
          {visibleUserItems.length > 0 && (
            <div className="space-y-1 mb-1">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isUserMenuOpen
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
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
                  {visibleUserItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          pathname === item.path
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
          )}

          {/* ✅ Website Settings — only if at least 1 item permitted */}
          {visibleSettingsItems.length > 0 && (
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isSettingsMenuOpen
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 ${
                    isSettingsMenuOpen
                      ? "text-blue-400"
                      : "group-hover:rotate-45 group-hover:text-blue-400 transition-transform duration-500"
                  }`} />
                  <span className="font-medium">Website Settings</span>
                </div>
                {isSettingsMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isSettingsMenuOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                  {visibleSettingsItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          isSettingActive(item.name)
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
          )}

          {/* ✅ Associate Management */}
          {visibleAssociateItems.length > 0 && (
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setIsAssociateMenuOpen(!isAssociateMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isAssociateMenuOpen
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className={`w-5 h-5 ${isAssociateMenuOpen ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                  <span className="font-medium">Associate Management</span>
                </div>
                {isAssociateMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isAssociateMenuOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                  {visibleAssociateItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          pathname === item.path
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
          )}

          {/* ✅ Student Management */}
          <div className="space-y-1 mt-1">
            <button
              onClick={() => setIsStudentManagementOpen(!isStudentManagementOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isStudentManagementOpen
                  ? "text-white bg-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className={`w-5 h-5 ${isStudentManagementOpen ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                <span className="font-medium">Student Management</span>
              </div>
              {isStudentManagementOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isStudentManagementOpen && (
              <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                {studentManagementItems.map((item) => {
                  if (item.isDropdown) {
                    const isOpen = item.name === "Certification" ? isCertificationOpen : isFeeDetailsOpen;
                    const setIsOpen = item.name === "Certification" ? setIsCertificationOpen : setIsFeeDetailsOpen;
                    
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                            isOpen ? "text-white bg-white/5" : "text-gray-500 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                        {isOpen && (
                          <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                            {item.children.map((subItem) => (
                              <li key={subItem.path}>
                                <Link
                                  href={subItem.path!}
                                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all duration-300 ${
                                    pathname === subItem.path
                                      ? "text-blue-400 font-bold bg-blue-400/10"
                                      : "text-gray-500 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  <subItem.icon className="w-3.5 h-3.5" />
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path!}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          pathname === item.path
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

          {/* ✅ Trainee Management (No sub-items yet) */}
          <div className="space-y-1 mt-1">
            <button
              onClick={() => setIsTraineeManagementOpen(!isTraineeManagementOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isTraineeManagementOpen
                  ? "text-white bg-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-5 h-5 ${isTraineeManagementOpen ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                <span className="font-medium">Trainee Management</span>
              </div>
              {isTraineeManagementOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {isTraineeManagementOpen && (
              <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                {traineeManagementItems.map((item) => {
                  if (item.isDropdown) {
                    const isOpen = isClassStatusOpen;
                    const setIsOpen = setIsClassStatusOpen;
                    
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                            isOpen ? "text-white bg-white/5" : "text-gray-500 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                        {isOpen && (
                          <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                            {item.children.map((subItem) => (
                              <li key={subItem.path}>
                                <Link
                                  href={subItem.path!}
                                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all duration-300 ${
                                    pathname === subItem.path
                                      ? "text-blue-400 font-bold bg-blue-400/10"
                                      : "text-gray-500 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  <subItem.icon className="w-3.5 h-3.5" />
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path!}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          pathname === item.path
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

            {/* ✅ NTSC Management */}
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setIsNTSCManagementOpen(!isNTSCManagementOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isNTSCManagementOpen
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${isNTSCManagementOpen ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                  <span className="font-medium">NTSC Management</span>
                </div>
                {isNTSCManagementOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isNTSCManagementOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                  {ntscManagementItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path!}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          pathname === item.path
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

            {/* ✅ Background Images */}
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setIsBackgroundImagesOpen(!isBackgroundImagesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isBackgroundImagesOpen
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image className={`w-5 h-5 ${isBackgroundImagesOpen ? "text-blue-400" : "group-hover:text-blue-400"}`} />
                  <span className="font-medium text-left">Background Images</span>
                </div>
                {isBackgroundImagesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {isBackgroundImagesOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4 py-1">
                  {backgroundImagesItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path!}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                          pathname === item.path
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
        </nav>

        {/* ✅ Logout — calls AuthContext logout() */}
        <div className="p-6">
          <div className="h-px bg-white/10 mb-4" />
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {pathname === "/dashboard"
                ? "Overview"
                : pathname.split("/").pop()?.replace(/-/g, " ").toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                {/* ✅ Real user name + email/role from AuthContext */}
                <p className="text-sm font-black text-slate-800 leading-none">
                  {user?.name ?? "Admin"}
                </p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 tracking-wide">
                  {user?.email ?? user?.role ?? ""}
                </p>
              </div>
              {/* ✅ Real initials avatar */}
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-inner cursor-pointer hover:bg-blue-700 transition-colors">
                {user?.name
                  ? getInitials(user.name)
                  : <UserCircle className="w-6 h-6" />}
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
          <p className="text-blue-600 font-semibold text-sm">Loading...</p>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

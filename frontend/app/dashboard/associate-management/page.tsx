import Link from "next/link";
import { ClipboardList, FileText, BookOpen, ArrowRight } from "lucide-react";

const sections = [
  {
    title: "Enquiry Form",
    description: "Record new associate enquiries, capture personal details, career goals, and course interests.",
    href: "/dashboard/student-management/enquiry",
    icon: ClipboardList,
    color: "blue",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    badge: "New",
  },
  {
    title: "Admission Form",
    description: "Process associate admission applications with all required documentation and course details.",
    href: "/dashboard/student-management/admission",
    icon: FileText,
    color: "emerald",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    badge: null,
  },
];

export default function StudentManagementPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          Associate Management
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Manage associate enquiries, admissions, and records from one place.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`group relative bg-white border-2 ${section.border} rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 ${section.bg} rounded-full opacity-60 group-hover:scale-125 transition-transform duration-500`} />

              {section.badge && (
                <span className="absolute top-5 right-5 text-[10px] font-black bg-blue-600 text-white px-2.5 py-1 rounded-full tracking-wider uppercase z-10">
                  {section.badge}
                </span>
              )}

              <div className={`w-14 h-14 ${section.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                <Icon className={`w-7 h-7 ${section.iconColor}`} />
              </div>

              <h2 className="text-xl font-black text-slate-800 mb-2 relative z-10">
                {section.title}
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">
                {section.description}
              </p>

              <div className={`mt-6 flex items-center gap-2 text-sm font-bold ${section.iconColor} relative z-10 group-hover:gap-3 transition-all`}>
                Open {section.title}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="bg-[#0b1f3a] rounded-3xl p-8 text-white flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-blue-300" />
        </div>
        <div className="flex-1 relative z-10">
          <h3 className="font-black text-lg">Associate Lifecycle</h3>
          <p className="text-blue-200 text-sm font-medium mt-1">
            Start with the <strong>Enquiry Form</strong> to capture initial interest, then move to the <strong>Admission Form</strong> once the associate is ready to enroll.
          </p>
        </div>
        <Link
          href="/dashboard/student-management/enquiry"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 relative z-10"
        >
          Start Enquiry
        </Link>
      </div>
    </div>
  );
}

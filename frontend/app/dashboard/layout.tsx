// app/dashboard/layout.tsx

"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "User Management", path: "/dashboard/users" },
    { name: "NTSC Admin", path: "/dashboard/ntsc-admin" },
    { name: "Associate", path: "/dashboard/associate" },
    { name: "Students", path: "/dashboard/students" },
    { name: "Staff / Trainee", path: "/dashboard/staff" },
    { name: "Payments", path: "/dashboard/payments" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white p-6 hidden md:block shadow-xl">
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Admin Panel
        </h2>

        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-4 py-2 rounded-lg transition ${
                  pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">
              Super Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
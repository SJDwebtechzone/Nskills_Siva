"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Lock,
  User,
  Users,
  GraduationCap,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide Navbar on login and dashboard pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Skill Training", href: "#skill-training" },
    { name: "Corporate Training", href: "#corporate-training" },
    { name: "Consulting Services", href: "#consulting" },
    { name: "Course Calendar", href: "/calendar" },
    { name: "Placements", href: "/placements" },
    { name: "Infrastructure", href: "/infrastructure" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="w-full relative shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#0b1f3a] text-white py-2 px-4 md:px-12 flex flex-row justify-between items-center text-[10px] sm:text-xs md:text-sm font-medium">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-blue-400" />
            Business Hours : 9.30 am to 7.00 pm
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div
            className="relative group py-1"
            onMouseEnter={() => setIsLoginMenuOpen(true)}
            onMouseLeave={() => setIsLoginMenuOpen(false)}
          >
            <button className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors uppercase tracking-wider text-[10px] md:text-xs">
              <Lock size={14} />
              Login Access
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl z-50 border border-gray-100 overflow-hidden transition-all duration-300 ${isLoginMenuOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible"
                }`}
            >
              <div className="p-2">
                <Link
                  href="/login/admin"
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-md text-gray-700 hover:text-blue-700 transition"
                  onClick={() => setIsLoginMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={16} />
                  </div>
                  <span className="font-semibold text-sm">Admin</span>
                </Link>

                <Link
                  href="/login/associate"
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-md text-gray-700 hover:text-blue-700 transition"
                  onClick={() => setIsLoginMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Users size={16} />
                  </div>
                  <span className="font-semibold text-sm">Associate</span>
                </Link>

                <Link
                  href="/login/student"
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-md text-gray-700 hover:text-blue-700 transition"
                  onClick={() => setIsLoginMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <GraduationCap size={16} />
                  </div>
                  <span className="font-semibold text-sm">Student</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white px-4 md:px-6 py-3 sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="NSKILL Logo"
              width={180}
              height={50}
              className="object-contain h-8 md:h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center justify-end flex-1 md:space-x-0.5 xl:space-x-1">
            {menuItems.map((item) => (
              <li key={item.name} className="shrink-0">
                <Link
                  href={item.href}
                  className="px-1 xl:px-4 py-2 font-bold text-[#0b1f3a] hover:text-blue-600 transition lg:text-[11px] xl:text-[13px] uppercase tracking-tighter xl:tracking-tight whitespace-nowrap"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#0b1f3a] hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 p-6 flex flex-col lg:hidden transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-10">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="NSKILL Logo"
              width={200}
              height={60}
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-lg font-bold text-[#0b1f3a] hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6 border-t">
          <p className="text-xs text-center text-gray-500 font-medium uppercase tracking-widest">
            Business Hours : 9.30 to 7.00
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

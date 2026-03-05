"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on login and dashboard pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const footerLinks = [
    {
      title: "Skill Training",
      links: [
        { name: "Basic Course", href: "#skill-training" },
        { name: "Advance Course", href: "#skill-training" },
        { name: "International Course", href: "#skill-training" },
      ],
    },
    {
      title: "Corporate Training",
      links: [
        { name: "Management Training", href: "#corporate-training" },
        { name: "Commerce", href: "#corporate-training" },
        { name: "Soft Skills", href: "#corporate-training" },
        { name: "Lean Six Sigma", href: "#corporate-training" },
        { name: "Customised Training", href: "#corporate-training" },
        { name: "& more training", href: "#corporate-training" },
      ],
    },
    {
      title: "Consulting Services",
      links: [
        { name: "Strategic Management", href: "#consulting" },
        { name: "Industrial Design & Layout", href: "#consulting" },
        { name: "Audits", href: "#consulting" },
        { name: "Logistics & Warehousing", href: "#consulting" },
        { name: "Manufacturing Excellence", href: "#consulting" },
        { name: "& more services", href: "#consulting" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0b1f3a] text-[#8a99af] font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 mb-16">

          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/footer-logo.png"
                alt="Niile Logo"
                width={200}
                height={60}
                className="object-contain h-12 md:h-14 w-auto"
              />
            </Link>

            <div className="space-y-4 text-[13px] leading-relaxed">
              <p>
                361/3, Pillayar Kovil Street, Raghavendra Nagar, Irandamkattalai, Kovur, Chennai - 600 122. India
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#fe2b54]" />
                  <span>+91 - 98842 09774</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#fe2b54]" />
                  <span>+91 - 80560 63023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#fe2b54]" />
                  <span>nskilltraining@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-[17px] mb-8">
                {section.title}
              </h3>
              <ul className="space-y-0">
                {section.links.map((link) => (
                  <li key={link.name} className="border-b border-dotted border-gray-600/50">
                    <Link
                      href={link.href}
                      className="block py-3 text-[14px] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle section with Subscribe and Social */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 border-t border-gray-600/50">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-[15px]">Connect With Us</h3>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="w-10 h-10 border border-gray-600/50 flex items-center justify-center text-gray-400 hover:bg-[#fe2b54] hover:text-white hover:border-[#fe2b54] transition-all"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-[15px]">Subscribe Us</h3>
            <div className="flex h-12 shadow-inner">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 bg-white px-6 text-gray-800 text-sm focus:outline-none"
              />
              <button className="bg-[#fe2b54] hover:bg-[#e0244a] text-white px-8 font-bold text-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#081728] py-8 text-center border-t border-gray-600/20">
        <div className="max-w-7xl mx-auto px-6 text-[14px] text-gray-500 font-medium">
          Copyright © {currentYear} All rights reserved | by <span className="text-gray-400 transition-colors">DevSpectra</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

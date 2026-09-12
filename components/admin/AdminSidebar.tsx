"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Layers,
  Cpu,
  History,
  User,
  Video,
  PhoneCall,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects & Categories", href: "/admin/projects", icon: FolderKanban },
    { name: "Skills & Software", href: "/admin/software", icon: Cpu },
    { name: "Experience", href: "/admin/experience", icon: History },
    { name: "Home Video & Hero", href: "/admin/homepage", icon: Video },
    { name: "About & Specialties", href: "/admin/about", icon: User },
    { name: "Contact & Footer", href: "/admin/settings", icon: PhoneCall },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B1F] shadow-sm"></span>
          <div>
            <span className="font-display font-bold tracking-wider text-gray-900 text-base block leading-none">
              MAHROOF
            </span>
            <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase block mt-1">
              ADMIN CMS
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
        <p className="px-3 text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold mb-2.5">
          MENU
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-150 group ${
                isActive
                  ? "bg-[#FF3B1F] text-white font-bold shadow-md shadow-[#FF3B1F]/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-700"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-gray-200 space-y-1 bg-gray-50/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono tracking-wider text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono tracking-wider text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>

        {user?.email && (
          <div className="pt-2 px-3">
            <p className="text-[10px] font-mono text-gray-400 truncate" title={user.email}>
              {user.email}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

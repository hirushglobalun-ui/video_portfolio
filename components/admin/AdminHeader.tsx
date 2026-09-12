"use client";

import React from "react";
import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from "./AdminAuthContext";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobile: () => void;
  action?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  onOpenMobile,
  action,
}: AdminHeaderProps) {
  const { user } = useAdminAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight font-display">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 font-mono hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {action}

       

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#FF3B1F]/10 border border-[#FF3B1F]/20 flex items-center justify-center text-[#FF3B1F] font-mono text-xs font-bold uppercase">
              {user.email ? user.email.charAt(0) : "A"}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

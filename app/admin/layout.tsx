import React from "react";
import { AdminAuthProvider } from "@/components/admin/AdminAuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAHROOF CMS — Admin Dashboard",
  description: "Content Management System for Mohammed Mahroof TM Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminAuthProvider>
  );
}

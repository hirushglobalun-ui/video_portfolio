"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Create New Project"
        subtitle="Add a case study or commercial video to your portfolio"
        onOpenMobile={() => {}}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <ProjectForm isEditing={false} />
      </main>
    </div>
  );
}

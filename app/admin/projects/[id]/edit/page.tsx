"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getProjectBySlug } from "@/lib/data";
import { Project } from "@/types/cms";

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      setLoading(true);
      try {
        if (db) {
          const docRef = doc(db, "projects", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProject({ id: docSnap.id, ...docSnap.data() } as Project);
            setLoading(false);
            return;
          }
        }
        // Fallback by slug
        const fallback = await getProjectBySlug(id);
        setProject(fallback);
      } catch (err) {
        console.error("Failed to load project for edit:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Edit Project"
        subtitle={project ? project.title : "Loading project..."}
        onOpenMobile={() => {}}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#FF3B1F] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-neutral-500 mt-3">Loading project data...</span>
          </div>
        ) : project ? (
          <ProjectForm initialData={project} projectId={id} isEditing={true} />
        ) : (
          <div className="p-8 text-center text-neutral-400 font-mono">
            Project not found.
          </div>
        )}
      </main>
    </div>
  );
}

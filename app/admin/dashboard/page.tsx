"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  FileEdit,
  Tags,
  Sparkles,
  Plus,
  ExternalLink,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getProjects, getCategories } from "@/lib/data";
import { Project, Category } from "@/types/cms";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const pSnap = await getDocs(
          query(collection(db, "projects"), orderBy("displayOrder", "asc"))
        );
        if (!pSnap.empty) {
          setProjects(pSnap.docs.map((d) => ({ ...d.data(), id: d.id, status: "published", featured: true } as Project)));
        } else {
          setProjects(await getProjects());
        }

        const cSnap = await getDocs(collection(db, "categories"));
        if (!cSnap.empty) {
          setCategories(
            cSnap.docs
              .map((d) => ({ ...d.data(), id: d.id } as Category))
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          );
        } else {
          setCategories(await getCategories());
        }
      } else {
        setProjects(await getProjects());
        setCategories(await getCategories());
      }
    } catch (err) {
      console.warn("Failed to load dashboard data:", err);
      setProjects(await getProjects());
      setCategories(await getCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const targetSlug = deleteTarget.slug;
    const targetId = deleteTarget.id;

    try {
      if (db) {
        if (targetId) {
          try {
            await deleteDoc(doc(db, "projects", targetId));
          } catch (e) {
            console.warn("Delete by target id notice:", e);
          }
        }
        if (targetSlug && targetSlug !== targetId) {
          try {
            await deleteDoc(doc(db, "projects", targetSlug));
          } catch (e) {
            console.warn("Delete by target slug doc notice:", e);
          }
        }
        if (targetSlug) {
          try {
            const q = query(collection(db, "projects"), where("slug", "==", targetSlug));
            const snap = await getDocs(q);
            await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
          } catch (e) {
            console.warn("Delete by query slug notice:", e);
          }
        }
      }
    } catch (err) {
      console.error("Delete project failed:", err);
    } finally {
      setProjects((prev) =>
        prev.filter((p) => p.slug !== targetSlug && (!targetId || p.id !== targetId))
      );
      setDeleteTarget(null);
      setIsDeleting(false);
    }
  };

  const totalProjects = projects.length;
  const totalCategories = categories.length;
  const uniqueClients = new Set(projects.map((p) => p.client).filter(Boolean)).size;

  const statCards = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-[#FF3B1F]",
      bg: "bg-[#FF3B1F]/10",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: Tags,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Clients / Brands",
      value: uniqueClients,
      icon: Sparkles,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Dashboard"
        subtitle="Portfolio overview & content metrics"
        onOpenMobile={() => {}}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {statCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 transition-all shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-medium">
                    {c.label}
                  </span>
                  <div className={`p-1.5 rounded-lg ${c.bg} ${c.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-gray-900">
                  {loading ? "-" : c.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 font-display uppercase tracking-wider">
                Recent Projects
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                Manage, edit, and preview your portfolio projects
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-mono uppercase tracking-wider text-[#FF3B1F] hover:text-[#E0341A] font-semibold transition-colors"
            >
              View All ({projects.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Year</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {projects.slice(0, 8).map((project) => (
                  <tr
                    key={project.slug}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {project.thumbnail ? (
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            -
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 group-hover:text-[#FF3B1F] transition-colors">
                        {project.title}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        /{project.slug}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-700">
                        {project.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{project.client || "—"}</td>
                    <td className="p-4 font-mono text-gray-500">{project.year}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/work?play=${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          title="Preview live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id || project.slug}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF3B1F] hover:bg-[#FF3B1F]/10 transition-colors"
                          title="Edit project"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 font-mono">
                      No projects found. Click &quot;New Project&quot; to create your first portfolio entry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        isLoading={isDeleting}
        onConfirm={handleDeleteProject}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

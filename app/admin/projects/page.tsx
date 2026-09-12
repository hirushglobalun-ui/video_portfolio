"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  FileEdit,
  Trash2,
  Copy,
  Eye,
  RefreshCw,
  Tags,
  FolderKanban,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import ProjectForm from "@/components/admin/ProjectForm";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getProjects, getCategories, getSmartThumbnail } from "@/lib/data";
import { Project, Category } from "@/types/cms";

export default function AdminProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") === "categories" ? "categories" : "projects";

  const [activeTab, setActiveTab] = useState<"projects" | "categories">(initialTab);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters for Projects
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Project Modal (Create / Edit in Modal instead of page)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const openCreateProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  // Project Deletion
  const [deleteProjectTarget, setDeleteProjectTarget] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  // Category Modal (Create / Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catTagline, setCatTagline] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catThumbnail, setCatThumbnail] = useState("");
  const [catDisplayOrder, setCatDisplayOrder] = useState(1);
  const [catActive, setCatActive] = useState(true);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

  // Category Deletion
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<Category | null>(null);
  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const pSnap = await getDocs(
          query(collection(db, "projects"), orderBy("displayOrder", "asc"))
        );
        if (!pSnap.empty) {
          setProjects(
            pSnap.docs.map(
              (d) =>
                ({
                  ...d.data(),
                  id: d.id,
                  status: "published",
                  featured: true,
                } as Project)
            )
          );
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
      console.warn("Failed to load data:", err);
      setProjects(await getProjects());
      setCategories(await getCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSwitchTab = (tab: "projects" | "categories") => {
    setActiveTab(tab);
    router.replace(`/admin/projects?tab=${tab}`);
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchClient = (p.client || "").toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        if (!matchTitle && !matchClient && !matchSlug) return false;
      }

      if (selectedCategory !== "all") {
        if (p.categorySlug !== selectedCategory && p.category !== selectedCategory) {
          return false;
        }
      }

      if (selectedYear !== "all") {
        if (p.year !== selectedYear) return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedCategory, selectedYear]);

  // Project Actions
  const handleDuplicateProject = async (project: Project) => {
    try {
      const copySlug = `${project.slug}-copy-${Date.now().toString().slice(-4)}`;
      const duplicatedProject: Project = {
        ...project,
        title: `${project.title} (Copy)`,
        slug: copySlug,
        status: "published",
        featured: true,
        displayOrder: (project.displayOrder || 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (db) {
        const docRef = await addDoc(collection(db, "projects"), duplicatedProject);
        duplicatedProject.id = docRef.id;
      }

      setProjects((prev) => [duplicatedProject, ...prev]);
    } catch (err) {
      console.error("Duplicate failed:", err);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectTarget) return;
    setIsDeletingProject(true);
    const targetSlug = deleteProjectTarget.slug;
    const targetId = deleteProjectTarget.id;

    try {
      if (db) {
        // 1. Delete by document ID if present
        if (targetId) {
          try {
            await deleteDoc(doc(db, "projects", targetId));
          } catch (e) {
            console.warn("Delete by target id notice:", e);
          }
        }
        // 2. Delete by slug as doc ID if different
        if (targetSlug && targetSlug !== targetId) {
          try {
            await deleteDoc(doc(db, "projects", targetSlug));
          } catch (e) {
            console.warn("Delete by target slug doc notice:", e);
          }
        }
        // 3. Query any docs matching the slug to be 100% clean
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
      console.error("Delete failed:", err);
    } finally {
      // Always remove from local state and close the confirmation modal immediately
      setProjects((prev) =>
        prev.filter((p) => p.slug !== targetSlug && (!targetId || p.id !== targetId))
      );
      setDeleteProjectTarget(null);
      setIsDeletingProject(false);
    }
  };

  // Category Actions
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatTagline("");
    setCatDescription("");
    setCatThumbnail("");
    setCatDisplayOrder(categories.length + 1);
    setCatActive(true);
    setCategoryFormError(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatTagline(cat.tagline || "");
    setCatDescription(cat.description || "");
    setCatThumbnail(cat.thumbnail || "");
    setCatDisplayOrder(cat.displayOrder || 1);
    setCatActive(cat.active !== false);
    setCategoryFormError(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catSlug.trim()) {
      setCategoryFormError("Category Name and slug are required.");
      return;
    }

    try {
      const catData: Category = {
        name: catName.trim(),
        slug: catSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        tagline: catTagline.trim(),
        description: catDescription.trim(),
        thumbnail: catThumbnail.trim() || getSmartThumbnail(catSlug || catName, catName),
        displayOrder: Number(catDisplayOrder) || 1,
        active: catActive,
      };

      const docId = editingCategory?.id || catData.slug;

      if (db) {
        await setDoc(doc(db, "categories", docId), catData, { merge: true });
      }

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.slug === editingCategory.slug ? { id: docId, ...catData } : c))
        );
      } else {
        setCategories((prev) => [...prev, { id: docId, ...catData }]);
      }

      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setCategoryFormError(err.message || "Failed to save category.");
    }
  };

  const handleDeleteCategoryPrompt = (cat: Category) => {
    const usedBy = projects.filter(
      (p) => p.categorySlug === cat.slug || p.category === cat.name
    );

    if (usedBy.length > 0) {
      setCategoryDeleteError(
        `Cannot delete "${cat.name}". It is assigned to ${usedBy.length} project(s): ${usedBy
          .map((p) => `"${p.title}"`)
          .join(", ")}. Please reassign those projects first.`
      );
      setDeleteCategoryTarget(cat);
      return;
    }

    setCategoryDeleteError(null);
    setDeleteCategoryTarget(cat);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryTarget || categoryDeleteError) return;
    setIsDeletingCategory(true);
    try {
      if (db && deleteCategoryTarget.id) {
        await deleteDoc(doc(db, "categories", deleteCategoryTarget.id));
      }
      setCategories((prev) => prev.filter((c) => c.slug !== deleteCategoryTarget.slug));
      setDeleteCategoryTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingCategory(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Projects & Categories"
        subtitle="Manage portfolio work case studies and category classifications in one place"
        onOpenMobile={() => {}}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={openCreateCategoryModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF3B1F]" />
              <span>Add Category</span>
            </button>

            <button
              onClick={openCreateProjectModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => handleSwitchTab("projects")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer font-bold ${
              activeTab === "projects"
                ? "bg-[#FF3B1F] text-white shadow-sm shadow-[#FF3B1F]/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => handleSwitchTab("categories")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer font-bold ${
              activeTab === "categories"
                ? "bg-[#FF3B1F] text-white shadow-sm shadow-[#FF3B1F]/20"
                : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, client, or slug..."
                    className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-700 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-700 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  >
                    <option value="all">All Years</option>
                    {Array.from(new Set(projects.map((p) => p.year).filter(Boolean))).map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 font-mono uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 w-12 text-center">#</th>
                      <th className="p-4">Thumbnail</th>
                      <th className="p-4">Project Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Year</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {filteredProjects.map((project, idx) => (
                      <tr
                        key={project.slug}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="p-4 text-center font-mono text-gray-400">
                          {project.displayOrder || idx + 1}
                        </td>
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
                              title="Preview Video"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDuplicateProject(project)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditProjectModal(project)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF3B1F] hover:bg-[#FF3B1F]/10 transition-colors cursor-pointer"
                              title="Edit Project"
                            >
                              <FileEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteProjectTarget(project)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProjects.length === 0 && !loading && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-400 font-mono">
                          <p className="text-sm text-gray-600 mb-3">No matching projects found.</p>
                          <button
                            onClick={openCreateProjectModal}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add New Project</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 font-mono uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 w-12 text-center">#</th>
                      <th className="p-4">Thumbnail</th>
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Tagline / Description</th>
                      <th className="p-4">Assigned Projects</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {categories.map((cat, idx) => {
                      const assignedCount = projects.filter(
                        (p) => p.categorySlug === cat.slug || p.category === cat.name
                      ).length;

                      return (
                        <tr
                          key={cat.slug}
                          className="hover:bg-gray-50/80 transition-colors group"
                        >
                          <td className="p-4 text-center font-mono text-gray-400">
                            {cat.displayOrder || idx + 1}
                          </td>
                          <td className="p-4">
                            <div className="relative w-14 h-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                              {cat.thumbnail ? (
                                <Image
                                  src={cat.thumbnail}
                                  alt={cat.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-[10px]">
                                  -
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-gray-900 group-hover:text-[#FF3B1F] transition-colors">
                              {cat.name}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-gray-500">/{cat.slug}</td>
                          <td className="p-4 max-w-xs truncate text-gray-500">
                            {cat.tagline || cat.description || "—"}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 border border-gray-200 text-gray-700">
                              {assignedCount} {assignedCount === 1 ? "project" : "projects"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                cat.active !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-gray-100 text-gray-500 border border-gray-200"
                              }`}
                            >
                              {cat.active !== false ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditCategoryModal(cat)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF3B1F] hover:bg-[#FF3B1F]/10 transition-colors cursor-pointer"
                                title="Edit Category"
                              >
                                <FileEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategoryPrompt(cat)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {categories.length === 0 && !loading && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-400 font-mono">
                          No categories configured yet. Click &quot;Add Category&quot; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Project Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteProjectTarget)}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteProjectTarget?.title}"?`}
        confirmText="Delete Project"
        isLoading={isDeletingProject}
        onConfirm={handleDeleteProject}
        onClose={() => setDeleteProjectTarget(null)}
      />

      {/* Delete Category Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCategoryTarget)}
        title={categoryDeleteError ? "Cannot Delete Category" : "Delete Category"}
        message={
          categoryDeleteError ||
          `Are you sure you want to delete "${deleteCategoryTarget?.name}"?`
        }
        confirmText={categoryDeleteError ? undefined : "Delete Category"}
        isDangerous={!categoryDeleteError}
        isLoading={isDeletingCategory}
        onConfirm={handleConfirmDeleteCategory}
        onClose={() => {
          setDeleteCategoryTarget(null);
          setCategoryDeleteError(null);
        }}
      />

      {/* Create / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-gray-900 text-base">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </h3>
                <p className="text-xs font-mono text-gray-500">
                  {editingCategory ? `Updating /${editingCategory.slug}` : "Categorize portfolio projects"}
                </p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categoryFormError && (
              <div className="m-5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{categoryFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g., Automotive, Commercial, Reels, Color Grading"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
                <p className="text-[11px] font-mono text-gray-400">
                  Slug: /{catSlug || "auto-generated"}
                </p>
              </div>

              {/* Cover / Thumbnail Image (Optional) - Placed directly upfront */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
                    Cover / Thumbnail Image <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  {catThumbnail && (
                    <button
                      type="button"
                      onClick={() => setCatThumbnail("")}
                      className="text-[11px] font-mono text-red-500 hover:text-red-700 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <MediaUploader
                  folder="portfolio/categories"
                  category="projects"
                  value={catThumbnail}
                  onChange={(url) => setCatThumbnail(url)}
                  aspectRatio="video"
                  helperText="Upload an image file, or enter an image URL below (optional)."
                />

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase shrink-0">Or URL:</span>
                  <input
                    type="url"
                    value={catThumbnail}
                    onChange={(e) => setCatThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/... (optional)"
                    className="flex-1 h-9 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  />
                </div>
              </div>

              {/* Optional details collapsible */}
              <details className="pt-2 border-t border-gray-100 group">
                <summary className="text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-900 font-medium py-1 select-none">
                  + Additional Details (Tagline, Description)
                </summary>
                <div className="space-y-4 pt-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                      Tagline (Optional)
                    </label>
                    <input
                      type="text"
                      value={catTagline}
                      onChange={(e) => setCatTagline(e.target.value)}
                      placeholder="e.g., High-velocity cuts & precision showcases"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      placeholder="Short description of this genre..."
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                    />
                  </div>
                </div>
              </details>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-mono text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF3B1F]/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <ProjectForm
                key={editingProject?.id || editingProject?.slug || "new"}
                initialData={editingProject}
                projectId={editingProject?.id}
                isEditing={Boolean(editingProject)}
                isModal={true}
                onSuccess={() => {
                  setIsProjectModalOpen(false);
                  setEditingProject(null);
                  loadData();
                }}
                onCancel={() => {
                  setIsProjectModalOpen(false);
                  setEditingProject(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

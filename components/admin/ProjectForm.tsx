"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Check,
  Eye,
  Plus,
  AlertCircle,
  Video,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Film,
  Upload,
  X,
} from "lucide-react";
import MediaUploader from "./MediaUploader";
import VideoPreview from "./VideoPreview";
import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getCategories, getSmartThumbnail } from "@/lib/data";
import { Project, Category, VideoProvider } from "@/types/cms";

interface ProjectFormProps {
  initialData?: Project | null;
  projectId?: string;
  isEditing?: boolean;
  isModal?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({
  initialData,
  projectId,
  isEditing = false,
  isModal = false,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Core 5 Fields requested by User
  const [title, setTitle] = useState(initialData?.title || "");
  const [categorySlug, setCategorySlug] = useState(initialData?.categorySlug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");

  // Inline Quick Category Creation (strictly user-created categories only, no dummy ones)
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Optional/Advanced Collapsible Fields
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [client, setClient] = useState(initialData?.client || "");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear().toString());
  const [role, setRole] = useState(initialData?.role || "Senior Video Editor");
  const [videoProvider, setVideoProvider] = useState<VideoProvider>(
    initialData?.videoProvider || "external"
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "published"
  );
  const [featured, setFeatured] = useState<boolean>(
    initialData?.featured !== undefined ? initialData.featured : true
  );

  // Load ONLY user-created categories from Firestore
  useEffect(() => {
    async function loadUserCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          if (!categorySlug || !cats.some((c) => c.slug === categorySlug)) {
            setCategorySlug(cats[0].slug);
          }
        } else {
          setCategorySlug("");
        }
      } catch (err) {
        console.warn("Could not load categories:", err);
      }
    }
    loadUserCategories();
  }, []);

  // Title change with auto-slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Video URL change with automatic provider detection
  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setVideoProvider("youtube");
    } else if (url.includes("vimeo.com")) {
      setVideoProvider("vimeo");
    } else {
      setVideoProvider("external");
    }
  };

  // Quick Add Category right from project form
  const handleQuickAddCategory = async () => {
    if (!newCatName.trim()) return;
    setIsCreatingCategory(true);
    setError(null);
    try {
      const cleanName = newCatName.trim();
      const cleanSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const autoThumb = getSmartThumbnail(cleanSlug, cleanName);

      const newCat: Category = {
        name: cleanName,
        slug: cleanSlug,
        tagline: cleanName.toUpperCase(),
        description: `${cleanName} video productions by Mohammed Mahroof TM.`,
        thumbnail: autoThumb,
        displayOrder: categories.length + 1,
        active: true,
      };

      if (db) {
        await setDoc(doc(db, "categories", cleanSlug), newCat, { merge: true });
      }

      setCategories((prev) => [...prev, { id: cleanSlug, ...newCat }]);
      setCategorySlug(cleanSlug);
      setNewCatName("");
      setShowAddCategory(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to create category: " + (err.message || ""));
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (targetStatus?: "draft" | "published") => {
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError("Please enter the Project Name.");
      return;
    }

    if (!categorySlug.trim()) {
      setError("Please select or create a Category for this project.");
      return;
    }

    setIsSaving(true);

    try {
      const finalStatus = targetStatus || status;
      const selectedCategoryObj = categories.find((c) => c.slug === categorySlug);
      const categoryName = selectedCategoryObj?.name || categorySlug;

      // Smart Thumbnail Assignment: If thumbnail is empty, auto-generate matching genre image or YouTube still
      let finalThumb = thumbnail.trim();
      if (!finalThumb) {
        finalThumb = getSmartThumbnail(categorySlug || categoryName, title, videoUrl);
      }

      const cleanSlug =
        slug.trim() ||
        title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") ||
        `project-${Date.now()}`;

      const projectData: Project = {
        title: title.trim(),
        slug: cleanSlug,
        description: description.trim(),
        shortDescription: description.trim().slice(0, 160),
        client: client.trim() || "Client Project",
        year: year.trim() || new Date().getFullYear().toString(),
        role: role.trim() || "Senior Video Editor",
        runtime: "01:30",
        category: categoryName,
        categoryId: categorySlug,
        categorySlug: categorySlug,
        thumbnail: finalThumb,
        heroImage: finalThumb,
        videoUrl: videoUrl.trim(),
        videoProvider,
        status: finalStatus,
        featured,
        displayOrder: initialData?.displayOrder || Date.now(),
        sections: initialData?.sections || {
          footageSelection: "",
          editingAndPacing: "",
          colorGrading: "",
          soundDesign: "",
          motionGraphics: "",
          finalDelivery: "",
        },
        gallery: initialData?.gallery || [],
        services: initialData?.services || [],
        seoTitle: `${title.trim()} — Mohammed Mahroof TM Video Editor`,
        seoDescription: description.trim().slice(0, 160),
        ogImage: finalThumb,
        updatedAt: new Date().toISOString(),
      };

      if (!isEditing) {
        projectData.createdAt = new Date().toISOString();
      }

      if (db) {
        const docId = projectId || cleanSlug;
        await setDoc(doc(db, "projects", docId), projectData, { merge: true });
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 400);
      } else {
        setTimeout(() => {
          router.push("/admin/projects");
        }, 600);
      }
    } catch (err: any) {
      console.error("Save project error:", err);
      setError(err.message || "Failed to save project. Please verify connection.");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview thumbnail helper
  const resolvedThumbnail =
    thumbnail.trim() ||
    (categorySlug || title || videoUrl
      ? getSmartThumbnail(categorySlug, title, videoUrl)
      : "");

  return (
    <div className={isModal ? "p-5 sm:p-7 space-y-6" : "max-w-4xl mx-auto space-y-6 pb-24"}>
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          {isModal ? (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/admin/projects"
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h2 className="text-xl font-bold font-display text-gray-950 uppercase tracking-tight">
              {isEditing ? `Edit: ${initialData?.title || "Project"}` : "Add New Project"}
            </h2>
            <p className="text-xs font-mono text-gray-500">
              Fill in project details, video link, thumbnail, and category
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {slug && (
            <Link
              href={`/work?play=${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-mono text-gray-700 transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#FF3B1F]/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving..." : isEditing ? "Save Changes" : "Save Project"}</span>
          </button>
        </div>
      </div>

      {/* Error / Success Notifications */}
      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-mono flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Project saved successfully! Redirecting...</span>
        </div>
      )}

      {/* Main Clean Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* 1. Project Name / Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-gray-800 font-bold flex items-center gap-1.5">
            <span>Project Name (Title)</span>
            <span className="text-[#FF3B1F]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. BMW M4 Commercial Film or Royal Wedding Highlights"
            className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all font-medium"
          />
        </div>

        {/* 2. Category (Only user-created categories from Firestore, NO dummy categories) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-800 font-bold flex items-center gap-1.5">
              <span>Category</span>
              <span className="text-[#FF3B1F]">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-xs font-mono text-[#FF3B1F] hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3 h-3" />
              <span>{showAddCategory ? "Cancel" : "+ Add New Category"}</span>
            </button>
          </div>

          {categories.length > 0 ? (
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-950 font-medium focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all"
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-xs font-mono text-amber-900 font-semibold">
                No categories added yet! Create your first category below:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Commercial Films, Wedding, Reels..."
                  className="flex-1 h-10 px-3 bg-white border border-amber-300 rounded-lg text-sm text-gray-950 focus:outline-none focus:border-[#FF3B1F]"
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  disabled={isCreatingCategory || !newCatName.trim()}
                  className="px-4 h-10 bg-[#FF3B1F] text-white text-xs font-bold font-mono rounded-lg hover:bg-[#E0341A] transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {isCreatingCategory ? "Adding..." : "+ Create Category"}
                </button>
              </div>
            </div>
          )}

          {/* Inline category creation toggle */}
          {showAddCategory && categories.length > 0 && (
            <div className="flex gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl mt-2 animate-in fade-in duration-200">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category Name (e.g. Drone Films, Short Edits)..."
                className="flex-1 h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#FF3B1F]"
              />
              <button
                type="button"
                onClick={handleQuickAddCategory}
                disabled={isCreatingCategory || !newCatName.trim()}
                className="px-4 h-10 bg-[#FF3B1F] text-white text-xs font-bold font-mono rounded-lg hover:bg-[#E0341A] transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isCreatingCategory ? "Saving..." : "Save Category"}
              </button>
            </div>
          )}
        </div>

        {/* 3. Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-gray-800 font-bold">
            Project Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Tell the story or background of this video project, client goals, and editing highlights..."
            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all leading-relaxed"
          />
        </div>

        {/* 4. Video Link / Video Upload */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-800 font-bold flex items-center gap-2">
              <Video className="w-4 h-4 text-[#FF3B1F]" />
              <span>Video Link / Upload</span>
            </label>
            <span className="text-[11px] font-mono text-gray-500">
              YouTube, Vimeo, Cloudinary, or MP4
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="Paste video URL: https://youtu.be/... or https://vimeo.com/... or MP4"
              className="flex-1 h-12 px-4 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <MediaUploader
              label="Or upload video file directly"
              type="video"
              value={videoUrl}
              onUploadSuccess={(url: string) => handleVideoUrlChange(url)}
            />
          </div>

          {/* Live Video Preview */}
          {videoUrl && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                Live Video Preview:
              </span>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-300 bg-black">
                <VideoPreview url={videoUrl} />
              </div>
            </div>
          )}
        </div>

        {/* 5. Thumbnail (Upload / Link / Auto-generated) */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-800 font-bold flex items-center gap-1.5">
              <span>Thumbnail Image</span>
              <span className="text-[11px] font-mono font-normal text-gray-400">(Optional)</span>
            </label>
            <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Smart auto-thumbnail enabled</span>
            </div>
          </div>

          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Paste image URL (or upload below, or leave empty to auto-generate)"
            className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all"
          />

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <MediaUploader
              label="Upload Thumbnail Image"
              type="image"
              value={thumbnail}
              onUploadSuccess={(url: string) => setThumbnail(url)}
            />
          </div>

          {/* Preview of active or auto-assigned thumbnail */}
          {resolvedThumbnail && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span className="font-bold uppercase tracking-wider">
                  {thumbnail ? "Selected Thumbnail:" : "Auto-Generated Genre Thumbnail:"}
                </span>
                {!thumbnail && (
                  <span className="text-[#FF3B1F] font-semibold">
                    (Auto-selected for this category)
                  </span>
                )}
              </div>
              <div className="relative aspect-[16/9] max-w-sm rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
                <Image
                  src={resolvedThumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Optional Collapsible: Advanced Details */}
        <div className="pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-gray-900 font-semibold py-1 cursor-pointer"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{showAdvanced ? "Hide Optional Settings" : "Show Optional Settings (Client, Year, Slug)"}</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Client Name
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. BMW Motorsport, Nike, Independent"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Production Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                    Custom URL Slug
                  </label>
                  <label className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSlug}
                      onChange={(e) => setAutoSlug(e.target.checked)}
                      className="accent-[#FF3B1F]"
                    />
                    <span>Auto from title</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <span className="h-11 px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-xs font-mono text-gray-500 flex items-center">
                    /work/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setSlug(e.target.value);
                    }}
                    placeholder="custom-project-slug"
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-r-xl text-sm font-mono text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Big Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {isModal ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <Link
              href="/admin/projects"
              className="px-5 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </Link>
          )}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#FF3B1F]/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving..." : isEditing ? "Save Changes" : "Save Project"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

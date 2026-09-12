"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  FolderOpen,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { MediaAsset } from "@/types/cms";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<
    "projects" | "profile" | "brands" | "homepage" | "other"
  >("projects");

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setMediaList(
            snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaAsset))
          );
        } else {
          setMediaList([]);
        }
      }
    } catch (err) {
      console.error("Load media error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && !m.url.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedCategory !== "all" && m.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [mediaList, searchQuery, selectedCategory]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (db && deleteTarget.id) {
        await deleteDoc(doc(db, "media", deleteTarget.id));
      }
      setMediaList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#080808]">
      <AdminHeader
        title="Media Library"
        subtitle="Manage and inspect cloud-hosted image assets in Firebase Storage"
        onOpenMobile={() => {}}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={loadMedia}
              disabled={loading}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#FF4E27] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Search & Filter Bar */}
        <div className="bg-[#101010] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name or URL..."
              className="w-full h-10 pl-9 pr-4 bg-[#141414] border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B1F]"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-neutral-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 bg-[#141414] border border-white/10 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-[#FF3B1F]"
            >
              <option value="all">All Media</option>
              <option value="projects">Project Images</option>
              <option value="profile">Profile Images</option>
              <option value="brands">Brand Logos</option>
              <option value="homepage">Homepage Images</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id || item.url}
                className="group bg-[#101010] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden flex flex-col transition-all shadow-md"
              >
                {/* Thumbnail container */}
                <div className="relative aspect-video w-full bg-[#161616] overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id || item.url)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-[#FF3B1F] text-white hover:text-black transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === (item.id || item.url) ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1">
                  <p className="text-xs font-semibold text-white truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span className="uppercase text-[#FF3B1F]">
                      {item.category}
                    </span>
                    {item.size && (
                      <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-[#0c0c0c]">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neutral-500">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">No images found</p>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Images uploaded through project forms or this library will appear here.
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF3B1F] hover:bg-[#FF4E27] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
            >
              Upload First Image
            </button>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold font-display text-white uppercase">
              Upload Image to Firebase Storage
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-neutral-400">
                Destination Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF3B1F]"
              >
                <option value="projects">Projects</option>
                <option value="profile">Profile</option>
                <option value="brands">Brands</option>
                <option value="homepage">Homepage</option>
                <option value="other">Other</option>
              </select>
            </div>

            <MediaUploader
              folder={`portfolio/${uploadCategory}`}
              category={uploadCategory}
              onChange={() => {
                loadMedia();
                setIsUploadOpen(false);
              }}
              label="Choose or Drag Image"
              aspectRatio="video"
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-neutral-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Asset"
        message={`Delete metadata record for "${deleteTarget?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, FileEdit, X, RefreshCw, Sparkles } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getBrands } from "@/lib/data";
import { Brand } from "@/types/cms";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDocs(collection(db, "brands"));
        if (!snap.empty) {
          setBrands(
            snap.docs
              .map((d) => ({ id: d.id, ...d.data() } as Brand))
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          );
        } else {
          setBrands(await getBrands());
        }
      } else {
        setBrands(await getBrands());
      }
    } catch (err) {
      console.error(err);
      setBrands(await getBrands());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setName("");
    setLogo("");
    setWebsite("");
    setDescription("");
    setDisplayOrder(brands.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setLogo(b.logo || "");
    setWebsite(b.website || "");
    setDescription(b.description || "");
    setDisplayOrder(b.displayOrder || 1);
    setActive(b.active !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const brandData: Brand = {
        name: name.trim().toUpperCase(),
        logo: logo.trim(),
        website: website.trim(),
        description: description.trim(),
        displayOrder: Number(displayOrder) || 1,
        active,
      };

      const docId = editingBrand?.id || `brand-${Date.now()}`;

      if (db) {
        await setDoc(doc(db, "brands", docId), brandData, { merge: true });
      }

      if (editingBrand) {
        setBrands((prev) =>
          prev.map((b) => (b.id === editingBrand.id ? { id: docId, ...brandData } : b))
        );
      } else {
        setBrands((prev) => [...prev, { id: docId, ...brandData }]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save brand failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (db && deleteTarget.id) {
        await deleteDoc(doc(db, "brands", deleteTarget.id));
      }
      setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
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
        title="Brands & Showrooms"
        subtitle="Manage client logos and continuous brand ticker entries"
        onOpenMobile={() => {}}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#FF4E27] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Brand</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="bg-[#101010] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#0c0c0c] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Logo</th>
                  <th className="p-4">Brand / Client Name</th>
                  <th className="p-4">Website</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {brands.map((brand, idx) => (
                  <tr
                    key={brand.id || idx}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 text-center font-mono text-neutral-500">
                      {brand.displayOrder || idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-[#161616] shrink-0 flex items-center justify-center">
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Sparkles className="w-4 h-4 text-neutral-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white tracking-wide">
                      {brand.name}
                    </td>
                    <td className="p-4 font-mono text-neutral-400">
                      {brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FF3B1F] underline underline-offset-4"
                        >
                          {brand.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                          brand.active !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-neutral-800 text-neutral-500"
                        }`}
                      >
                        {brand.active !== false ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-[#FF3B1F] hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(brand)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Brand Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold font-display text-white uppercase">
                {editingBrand ? "Edit Brand" : "Add Brand"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral-400">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BMW MOTORSPORT"
                  required
                  className="w-full h-10 px-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral-400">
                  Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-10 px-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-neutral-400">
                  Brand Logo (Optional for Ticker)
                </label>
                <MediaUploader
                  folder="portfolio/brands"
                  category="brands"
                  value={logo}
                  onChange={setLogo}
                  aspectRatio="square"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-neutral-400">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="brandActiveToggle"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#FF3B1F] w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="brandActiveToggle"
                    className="text-xs font-mono uppercase text-neutral-300 cursor-pointer"
                  >
                    Active in ticker
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF3B1F] hover:bg-[#FF4E27] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Brand"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your brands?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

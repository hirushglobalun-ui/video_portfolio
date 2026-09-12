"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, FileEdit, X, RefreshCw, Layers } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getServices } from "@/lib/data";
import { ServiceItem } from "@/types/cms";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [number, setNumber] = useState("01");
  const [title, setTitle] = useState("");
  const [badge, setBadge] = useState("");
  const [icon, setIcon] = useState("Film");
  const [description, setDescription] = useState("");
  const [pointsText, setPointsText] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDocs(collection(db, "services"));
        if (!snap.empty) {
          setServices(
            snap.docs
              .map((d) => ({ id: d.id, ...d.data() } as ServiceItem))
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          );
        } else {
          setServices(await getServices());
        }
      } else {
        setServices(await getServices());
      }
    } catch (err) {
      console.error(err);
      setServices(await getServices());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    const nextNum = (services.length + 1).toString().padStart(2, "0");
    setNumber(nextNum);
    setTitle("");
    setBadge("");
    setIcon("Film");
    setDescription("");
    setPointsText("");
    setDisplayOrder(services.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setNumber(s.number || "01");
    setTitle(s.title);
    setBadge(s.badge || "");
    setIcon(s.icon || "Film");
    setDescription(s.description || "");
    setPointsText((s.points || []).join("\n"));
    setDisplayOrder(s.displayOrder || 1);
    setActive(s.active !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const points = pointsText
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const serviceData: ServiceItem = {
        number: number.trim(),
        title: title.trim(),
        badge: badge.trim(),
        icon: icon.trim(),
        description: description.trim(),
        points,
        displayOrder: Number(displayOrder) || 1,
        active,
      };

      const docId = editingService?.id || `service-${Date.now()}`;

      if (db) {
        await setDoc(doc(db, "services", docId), serviceData, { merge: true });
      }

      if (editingService) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? { id: docId, ...serviceData } : s))
        );
      } else {
        setServices((prev) => [...prev, { id: docId, ...serviceData }]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (db && deleteTarget.id) {
        await deleteDoc(doc(db, "services", deleteTarget.id));
      }
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Services & Capabilities"
        subtitle="Manage professional editing capabilities displayed on homepage"
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
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 w-12 text-center">Index</th>
                  <th className="p-4">Number</th>
                  <th className="p-4">Service Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {services.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="p-4 text-center font-mono text-gray-400">
                      {item.displayOrder || idx + 1}
                    </td>
                    <td className="p-4 font-mono text-[#FF3B1F] font-bold">
                      {item.number}
                    </td>
                    <td className="p-4 font-bold text-gray-900 tracking-wide group-hover:text-[#FF3B1F] transition-colors">
                      {item.title}
                    </td>
                    <td className="p-4 text-gray-600 max-w-md">
                      {item.description || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                          item.active !== false
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {item.active !== false ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF3B1F] hover:bg-[#FF3B1F]/10 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold font-display text-gray-900 uppercase">
                {editingService ? "Edit Service" : "Add Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Number #
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    required
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-[#FF3B1F] font-bold focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Video Editing & Pacing"
                    required
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Category Badge (Pill)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g., NLE & STORYTELLING"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Icon
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  >
                    <option value="Film">Film (Video / Timeline)</option>
                    <option value="Tv">Tv (Commercial / Screen)</option>
                    <option value="Flame">Flame (Automotive / Drift)</option>
                    <option value="Palette">Palette (Color Grading)</option>
                    <option value="Volume2">Volume (Sound Design)</option>
                    <option value="Layers">Layers (VFX & Graphics)</option>
                    <option value="Sparkles">Sparkles (Finishing / Look)</option>
                    <option value="Scissors">Scissors (Pacing / Cut)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of this capability..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                  Key Deliverables / Bullet Points (One per line)
                </label>
                <textarea
                  rows={3}
                  value={pointsText}
                  onChange={(e) => setPointsText(e.target.value)}
                  placeholder="Narrative Pacing & Rhythm Optimization&#10;Multicam & High-Velocity Action Sync&#10;Seamless Scene Continuity"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-mono focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="serviceActiveToggle"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#FF3B1F] w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="serviceActiveToggle"
                    className="text-xs font-mono uppercase text-gray-700 font-semibold cursor-pointer"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20 cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

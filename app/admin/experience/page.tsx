"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, FileEdit, X, RefreshCw, History, Check } from "lucide-react";
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
import { getExperience } from "@/lib/data";
import { ExperienceRole } from "@/types/cms";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<ExperienceRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ExperienceRole | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [badge, setBadge] = useState("");
  const [current, setCurrent] = useState(false);
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<ExperienceRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDocs(collection(db, "experience"));
        if (!snap.empty) {
          setExperience(
            snap.docs
              .map((d) => ({ id: d.id, ...d.data() } as ExperienceRole))
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          );
        } else {
          setExperience(await getExperience());
        }
      } else {
        setExperience(await getExperience());
      }
    } catch (err) {
      console.error(err);
      setExperience(await getExperience());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setTitle("");
    setCompany("");
    setPeriod("2024 — PRESENT");
    setBadge("CURRENT ROLE");
    setCurrent(true);
    setResponsibilitiesText("");
    setDisplayOrder(1);
    setIsModalOpen(true);
  };

  const openEditModal = (r: ExperienceRole) => {
    setEditingRole(r);
    setTitle(r.title);
    setCompany(r.company);
    setPeriod(r.period);
    setBadge(r.badge || "");
    setCurrent(Boolean(r.current));
    setResponsibilitiesText((r.responsibilities || []).join("\n"));
    setDisplayOrder(r.displayOrder || 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    try {
      const responsibilitiesArray = responsibilitiesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const roleData: ExperienceRole = {
        title: title.trim().toUpperCase(),
        company: company.trim(),
        period: period.trim().toUpperCase(),
        badge: badge.trim().toUpperCase(),
        current,
        responsibilities: responsibilitiesArray,
        displayOrder: Number(displayOrder) || 1,
      };

      const docId = editingRole?.id || `exp-${Date.now()}`;

      if (db) {
        await setDoc(doc(db, "experience", docId), roleData, { merge: true });
      }

      if (editingRole) {
        setExperience((prev) =>
          prev
            .map((r) => (r.id === editingRole.id ? { id: docId, ...roleData } : r))
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        );
      } else {
        setExperience((prev) =>
          [{ id: docId, ...roleData }, ...prev].sort(
            (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
          )
        );
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
        await deleteDoc(doc(db, "experience", deleteTarget.id));
      }
      setExperience((prev) => prev.filter((r) => r.id !== deleteTarget.id));
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
        title="Experience & Career Timeline"
        subtitle="Manage professional production roles and agency milestones"
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
              <span>Add Role</span>
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
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Role Title</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4">Key Responsibilities</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {experience.map((roleItem, idx) => (
                  <tr
                    key={roleItem.id || idx}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="p-4 text-center font-mono text-gray-400">
                      {roleItem.displayOrder || idx + 1}
                    </td>
                    <td className="p-4 font-mono text-xs text-[#FF3B1F] font-semibold whitespace-nowrap">
                      {roleItem.period}
                    </td>
                    <td className="p-4 font-bold text-gray-900 tracking-wide group-hover:text-[#FF3B1F] transition-colors">
                      {roleItem.title}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {roleItem.company}
                    </td>
                    <td className="p-4">
                      {roleItem.badge ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-700">
                          {roleItem.badge}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-gray-500 max-w-md">
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {(roleItem.responsibilities || []).slice(0, 2).map((res, rIdx) => (
                          <li key={rIdx} className="truncate">
                            {res}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(roleItem)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF3B1F] hover:bg-[#FF3B1F]/10 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(roleItem)}
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
          <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold font-display text-gray-900 uppercase">
                {editingRole ? "Edit Role" : "Add Experience Role"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="SENIOR EDITOR"
                    required
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Illuminate Ads & Promotions"
                    required
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Period
                  </label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="2024 — PRESENT"
                    required
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="CURRENT ROLE"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-gray-700 font-semibold">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows={4}
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  placeholder="Strategically leading the media team...&#10;Managing content creation workflows..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
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
                    id="currentRoleToggle"
                    checked={current}
                    onChange={(e) => setCurrent(e.target.checked)}
                    className="accent-[#FF3B1F] w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="currentRoleToggle"
                    className="text-xs font-mono uppercase text-gray-700 font-semibold cursor-pointer"
                  >
                    Current Role
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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Role"
        message={`Are you sure you want to remove "${deleteTarget?.title} @ ${deleteTarget?.company}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

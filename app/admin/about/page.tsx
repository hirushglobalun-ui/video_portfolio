"use client";

import React, { useState, useEffect } from "react";
import { Save, Check, RefreshCw, User, AlertCircle, Plus, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getAbout, defaultAbout } from "@/lib/data";
import { AboutContent, StatItem } from "@/types/cms";

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutContent>(defaultAbout);
  const [newRoleInput, setNewRoleInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDoc(doc(db, "site", "about"));
        if (snap.exists()) {
          const loaded = snap.data();
          setData({
            ...defaultAbout,
            ...loaded,
            roles: loaded.roles || defaultAbout.roles || [],
          } as AboutContent);
        } else {
          setData(await getAbout());
        }
      } else {
        setData(await getAbout());
      }
    } catch (err) {
      console.error(err);
      setData(await getAbout());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatChange = (idx: number, field: "number" | "label", val: string) => {
    const updatedStats = [...(data.stats || [])];
    if (!updatedStats[idx]) {
      updatedStats[idx] = { number: "", label: "" };
    }
    updatedStats[idx][field] = val;
    setData({ ...data, stats: updatedStats });
  };

  const handleAddRole = () => {
    const trimmed = newRoleInput.trim().toUpperCase();
    if (!trimmed) return;
    const currentRoles = data.roles || defaultAbout.roles || [];
    if (!currentRoles.includes(trimmed)) {
      setData({ ...data, roles: [...currentRoles, trimmed] });
    }
    setNewRoleInput("");
  };

  const handleRemoveRole = (idx: number) => {
    const currentRoles = data.roles || defaultAbout.roles || [];
    const updated = currentRoles.filter((_, i) => i !== idx);
    setData({ ...data, roles: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (db) {
        await setDoc(doc(db, "site", "about"), data, { merge: true });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save about content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="About Section"
        subtitle="Manage professional bio, portrait photography, and rolling stats"
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
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20 cursor-pointer"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{success ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl w-full mx-auto pb-20">
        {error && (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Text Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
                  Editorial Headline & Bio
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                    Label Tag
                  </label>
                  <input
                    type="text"
                    value={data.label}
                    onChange={(e) => setData({ ...data, label: e.target.value })}
                    placeholder="ABOUT"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                    Headline Part 1 (Bold Highlight)
                  </label>
                  <input
                    type="text"
                    value={data.headline}
                    onChange={(e) => setData({ ...data, headline: e.target.value })}
                    placeholder="I DON'T JUST EDIT VIDEOS."
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-bold focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                    Headline Part 2 (Muted / Story Line)
                  </label>
                  <input
                    type="text"
                    value={data.subheadline}
                    onChange={(e) => setData({ ...data, subheadline: e.target.value })}
                    placeholder="I BUILD VISUAL STORIES THAT PEOPLE REMEMBER."
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                    Biography / Professional Summary
                  </label>
                  <textarea
                    rows={6}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="Provide a detailed summary of your 4+ years of experience..."
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 leading-relaxed focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                  />
                </div>
              </div>

              {/* Rolling Stat Counters */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
                  Rolling Animated Stat Cards
                </h3>
                <p className="text-xs text-gray-500">
                  Displayed below your biography with smooth count-up motion on scroll.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => {
                    const item = data.stats?.[idx] || { number: "", label: "" };
                    return (
                      <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                        <span className="text-[10px] font-mono text-[#FF3B1F] block uppercase font-bold">
                          Stat Card #{idx + 1}
                        </span>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-gray-500 font-semibold">
                            Number Value
                          </label>
                          <input
                            type="text"
                            value={item.number}
                            onChange={(e) => handleStatChange(idx, "number", e.target.value)}
                            placeholder="04+ or 2018"
                            className="w-full h-9 px-2.5 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-900 focus:outline-none focus:border-[#FF3B1F]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-gray-500 font-semibold">
                            Label
                          </label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                            placeholder="YEARS EXPERIENCE"
                            className="w-full h-9 px-2.5 bg-white border border-gray-300 rounded-lg text-[11px] font-mono text-gray-700 focus:outline-none focus:border-[#FF3B1F]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specialties & Ticker Strip (Who I Am / What I Do) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
                      Specialties & Rolling Strip (Who I Am / What I Do)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Manage the marquee strip displayed on the home page beneath the hero header.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                    {(data.roles || defaultAbout.roles || []).length} Roles
                  </span>
                </div>

                {/* Add new role input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddRole();
                      }
                    }}
                    placeholder="e.g. COMMERCIAL & BRAND FILMS"
                    className="flex-1 h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-4 h-10 rounded-xl bg-gray-950 hover:bg-[#FF3B1F] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Role tags list */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(data.roles || defaultAbout.roles || []).map((role, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono uppercase text-gray-800 hover:border-[#FF3B1F]/50 transition-colors shadow-2xs"
                    >
                      <span className="text-[#FF3B1F]">✦</span>
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(idx)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer ml-1"
                        title="Remove role"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Visual Live Preview Bar */}
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-semibold">
                    Live Preview of Scrolling Ticker:
                  </span>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                      {(data.roles || defaultAbout.roles || []).map((r, i) => (
                        <span key={i} className="text-xs font-mono font-semibold text-gray-700 uppercase flex items-center gap-2 shrink-0">
                          <span className="text-[#FF3B1F]">✦</span>
                          <span>{r}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]/40 inline-block ml-2"></span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Portrait Photo Upload */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
                    Portrait Photography
                  </h3>
                  {data.profileImage && (
                    <button
                      type="button"
                      onClick={() => setData({ ...data, profileImage: "" })}
                      className="text-[11px] font-mono text-red-500 hover:text-red-700 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  High-res portrait with multi-plane depth translation.
                </p>

                <MediaUploader
                  folder="portfolio/profile"
                  category="profile"
                  value={data.profileImage}
                  onChange={(url) => setData({ ...data, profileImage: url })}
                  aspectRatio="portrait"
                  helperText="Upload an image file or paste an image URL below."
                />

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase shrink-0">Or URL:</span>
                  <input
                    type="url"
                    value={data.profileImage || ""}
                    onChange={(e) => setData({ ...data, profileImage: e.target.value })}
                    placeholder="https://... (or paste direct image URL)"
                    className="flex-1 h-9 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

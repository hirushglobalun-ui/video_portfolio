"use client";

import React, { useState, useEffect } from "react";
import { Save, Check, RefreshCw, Home, AlertCircle } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import VideoPreview from "@/components/admin/VideoPreview";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getHomepage, defaultHomepage } from "@/lib/data";
import { HomepageContent } from "@/types/cms";

export default function AdminHomepagePage() {
  const [data, setData] = useState<HomepageContent>(defaultHomepage);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDoc(doc(db, "site", "homepage"));
        if (snap.exists()) {
          setData({ ...defaultHomepage, ...snap.data() } as HomepageContent);
        } else {
          setData(await getHomepage());
        }
      } else {
        setData(await getHomepage());
      }
    } catch (err) {
      console.error(err);
      setData(await getHomepage());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (db) {
        await setDoc(doc(db, "site", "homepage"), data, { merge: true });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save homepage settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Homepage Hero CMS"
        subtitle="Manage hero kinetic headline, CTA buttons, background video and imagery"
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
          {/* Hero Typography */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Hero Editorial Typography
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={data.eyebrow}
                  onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                  placeholder="MOHAMMED MAHROOF TM"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Giant Kinetic Wordmark
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="MAHROOF"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Subtitle / Role Header
                </label>
                <input
                  type="text"
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="SENIOR VIDEO EDITOR & MEDIA PRODUCTION SPECIALIST"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Hero Intro Description
                </label>
                <textarea
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="4+ years crafting commercial films, automotive showcases..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>
            </div>
          </div>

          {/* Hero Call-to-Action Buttons */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Call to Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={data.primaryCtaText}
                  onChange={(e) => setData({ ...data, primaryCtaText: e.target.value })}
                  placeholder="EXPLORE SELECTED WORK"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Primary Button Link (Anchor or URL)
                </label>
                <input
                  type="text"
                  value={data.primaryCtaLink}
                  onChange={(e) => setData({ ...data, primaryCtaLink: e.target.value })}
                  placeholder="#work or /work"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={data.secondaryCtaText}
                  onChange={(e) => setData({ ...data, secondaryCtaText: e.target.value })}
                  placeholder="GET IN TOUCH"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={data.secondaryCtaLink}
                  onChange={(e) => setData({ ...data, secondaryCtaLink: e.target.value })}
                  placeholder="#contact"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
              </div>
            </div>
          </div>

          {/* Hero Media (Image & External Video) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Hero Media & Reel Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hero Background Image */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold block">
                  Hero Background Poster Image
                </label>
                <MediaUploader
                  folder="portfolio/homepage"
                  category="homepage"
                  value={data.heroImage}
                  onChange={(url) => setData({ ...data, heroImage: url })}
                  aspectRatio="video"
                />
              </div>

              {/* Hero External Video URL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold block">
                    Hero Background Video URL
                  </label>
                  <span className="text-[10px] font-mono text-[#FF3B1F] bg-red-50 border border-red-100 px-2 py-0.5 rounded font-bold">
                    YouTube • Vimeo • MP4 Supported
                  </span>
                </div>
                <input
                  type="text"
                  value={data.heroVideoUrl || ""}
                  onChange={(e) => setData({ ...data, heroVideoUrl: e.target.value })}
                  placeholder="Paste YouTube link (https://www.youtube.com/watch?v=...), Vimeo or MP4 URL"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F]"
                />
                <p className="text-[11px] font-mono text-gray-500">
                  You can paste any public YouTube link. It will automatically play as a silent, seamless looping background showreel on your homepage.
                </p>
                <VideoPreview url={data.heroVideoUrl || ""} />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

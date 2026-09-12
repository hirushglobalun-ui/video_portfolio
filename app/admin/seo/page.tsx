"use client";

import React, { useState, useEffect } from "react";
import { Save, Check, RefreshCw, Search, AlertCircle } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import MediaUploader from "@/components/admin/MediaUploader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getGlobalSeo, defaultSeo } from "@/lib/data";
import { GlobalSeo } from "@/types/cms";

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<GlobalSeo>(defaultSeo);
  const [keywordsInput, setKeywordsInput] = useState(defaultSeo.keywords.join(", "));
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSeo = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDoc(doc(db, "site", "seo"));
        if (snap.exists()) {
          const data = snap.data() as GlobalSeo;
          setSeo(data);
          setKeywordsInput((data.keywords || []).join(", "));
        } else {
          const fallback = await getGlobalSeo();
          setSeo(fallback);
          setKeywordsInput(fallback.keywords.join(", "));
        }
      } else {
        const fallback = await getGlobalSeo();
        setSeo(fallback);
        setKeywordsInput(fallback.keywords.join(", "));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const keywordsArray = keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const updatedSeo: GlobalSeo = {
        siteTitle: seo.siteTitle.trim(),
        metaDescription: seo.metaDescription.trim(),
        keywords: keywordsArray,
        ogImage: seo.ogImage || "",
      };

      if (db) {
        await setDoc(doc(db, "site", "seo"), updatedSeo, { merge: true });
      }

      setSeo(updatedSeo);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save SEO configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#080808]">
      <AdminHeader
        title="SEO & Metadata"
        subtitle="Manage global search engine presence and social sharing cards"
        onOpenMobile={() => {}}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={loadSeo}
              disabled={loading}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#FF3B1F] hover:bg-[#FF4E27] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3B1F]/20"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{success ? "Saved!" : "Save SEO"}</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto pb-20">
        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Default Site Metadata
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Global Meta Title
                </label>
                <input
                  type="text"
                  value={seo.siteTitle}
                  onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                  placeholder="Mohammed Mahroof TM — Senior Video Editor"
                  required
                  className="w-full h-10 px-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Global Meta Description
                </label>
                <textarea
                  rows={4}
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  placeholder="Search engine synopsis..."
                  className="w-full p-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="Mohammed Mahroof, Video Editor, DaVinci Resolve, Automotive Media"
                  className="w-full h-10 px-3 bg-[#161616] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF3B1F]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Social Sharing Card (OpenGraph Image)
            </h3>
            <p className="text-xs text-neutral-400">
              Displayed when the portfolio link is shared on WhatsApp, iMessage, Twitter, and LinkedIn.
            </p>

            <MediaUploader
              folder="portfolio/seo"
              category="homepage"
              value={seo.ogImage}
              onChange={(url) => setSeo({ ...seo, ogImage: url })}
              aspectRatio="video"
              helperText="Recommended dimension: 1200 x 630px"
            />
          </div>
        </form>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Check,
  RefreshCw,
  Settings,
  Database,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { getSiteSettings, defaultSiteSettings } from "@/lib/data";
import { seedInitialFirestoreData } from "@/lib/firebase/seed";
import { SiteSettings } from "@/types/cms";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Migration status
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured() && db) {
        const snap = await getDoc(doc(db, "site", "settings"));
        if (snap.exists()) {
          setSettings({ ...defaultSiteSettings, ...snap.data() } as SiteSettings);
        } else {
          setSettings(await getSiteSettings());
        }
      } else {
        setSettings(await getSiteSettings());
      }
    } catch (err) {
      console.error(err);
      setSettings(await getSiteSettings());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (db) {
        await setDoc(doc(db, "site", "settings"), settings, { merge: true });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunMigration = async () => {
    if (
      !confirm(
        "Are you sure you want to seed/migrate all initial projects, categories, experience, and site content from data/projects.ts into Firestore? Existing items with matching slugs will be refreshed."
      )
    ) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const res = await seedInitialFirestoreData();
      setMigrationResult(res);
    } catch (err: any) {
      setMigrationResult({
        success: false,
        message: err.message || "Migration failed. Verify Firestore initialization.",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F9FAFB]">
      <AdminHeader
        title="Site Settings & Migration"
        subtitle="Configure direct booking contact links, social networks, and database migration"
        onOpenMobile={() => {}}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={loadSettings}
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
              <span>{success ? "Saved!" : "Save Settings"}</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl w-full mx-auto pb-20">
        {error && (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Database Migration Card */}
        <div className="bg-white border border-[#FF3B1F]/30 rounded-2xl p-6 space-y-4 shadow-md shadow-[#FF3B1F]/5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#FF3B1F]" />
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
                  One-Click Firestore Data Migration
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Migrate all 12 initial projects, case studies, 6 categories, brands, software proficiency, and experience roles from static files directly into Cloud Firestore.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunMigration}
              disabled={isMigrating}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-[#FF3B1F] text-gray-800 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              {isMigrating ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isMigrating ? "Migrating Data..." : "Run Migration"}</span>
            </button>
          </div>

          {migrationResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                migrationResult.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {migrationResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{migrationResult.message}</span>
            </div>
          )}
        </div>

        {/* Contact & Social Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Direct Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="mahroofft@gmail.com"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Phone / Call Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+91 85890 36403"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  WhatsApp Direct Link
                </label>
                <input
                  type="text"
                  value={settings.whatsapp || ""}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="https://wa.me/918589036403"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Physical Base Location
                </label>
                <input
                  type="text"
                  value={settings.location || ""}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  placeholder="Kerala, India"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#FF3B1F] font-bold">
              Social Media & Professional Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Behance Profile URL
                </label>
                <input
                  type="url"
                  value={settings.behance || ""}
                  onChange={(e) => setSettings({ ...settings, behance: e.target.value })}
                  placeholder="https://www.behance.net/mohammedmahroof"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={settings.instagram || ""}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={settings.linkedin || ""}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={settings.youtube || ""}
                  onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  placeholder="https://youtube.com/@..."
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F]"
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

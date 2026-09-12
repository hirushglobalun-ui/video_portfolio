"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthContext";
import { isFirebaseConfigured } from "@/lib/firebase/client";

function LoginForm() {
  const router = useRouter();
  const { user, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to /admin/dashboard
  useEffect(() => {
    if (user) {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a few minutes and try again.");
      } else {
        setError(err.message || "Failed to sign in. Please verify your credentials.");
      }
      setLoading(false);
    }
  };

  const configured = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 selection:bg-[#FF3B1F] selection:text-white">
      {/* Background ambient subtle gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF3B1F]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF3B1F]/10 border border-[#FF3B1F]/20 text-[#FF3B1F] mb-2 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 uppercase">
            MAHROOF CMS
          </h1>
          <p className="text-xs font-mono text-gray-500 tracking-wider uppercase">
            Admin Authentication Portal
          </p>
        </div>

        {/* Warning if Firebase environment variables are not set */}
        {!configured && (
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-mono flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">Setup Required</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Add your Firebase credentials to <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> to enable admin login.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-11 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#FF3B1F] focus:ring-1 focus:ring-[#FF3B1F] transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#FF3B1F]/20 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <a
            href="/"
            className="text-xs font-mono text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-wider"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AdminAuthProvider>
      <LoginForm />
    </AdminAuthProvider>
  );
}

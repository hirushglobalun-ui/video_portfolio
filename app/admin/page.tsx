"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
        <span className="w-4 h-4 border-2 border-[#FF3B1F] border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to Dashboard...</span>
      </div>
    </div>
  );
}

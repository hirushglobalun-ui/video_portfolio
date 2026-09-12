"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCategoriesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/projects?tab=categories");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F9FAFB]">
      <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
        <span className="w-4 h-4 border-2 border-[#FF3B1F] border-t-transparent rounded-full animate-spin" />
        <span>Loading Categories...</span>
      </div>
    </div>
  );
}

"use client";

import React, { useMemo } from "react";
import { Video, ExternalLink, AlertCircle } from "lucide-react";

interface VideoPreviewProps {
  url: string;
}

export default function VideoPreview({ url }: VideoPreviewProps) {
  const parsed = useMemo(() => {
    if (!url || !url.trim()) return null;

    const trimmed = url.trim();

    // YouTube
    const ytMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      return {
        provider: "YouTube",
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      };
    }

    // Vimeo
    const vimeoMatch = trimmed.match(
      /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+))/i
    );
    if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
      const id = vimeoMatch[3] || vimeoMatch[1];
      return {
        provider: "Vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }

    // Adobe CCV / Behance player embed
    if (trimmed.includes("adobe.io/v1/player") || (trimmed.includes("behance.net") && trimmed.includes("/embed"))) {
      return {
        provider: "Behance / Adobe Video",
        embedUrl: trimmed,
      };
    }

    // Direct / External video (e.g. mp4, webm)
    if (trimmed.match(/\.(mp4|webm|mov)(\?.*)?$/i) || trimmed.startsWith("http")) {
      return {
        provider: "Direct / External Video",
        directUrl: trimmed,
      };
    }

    return null;
  }, [url]);

  if (!url) {
    return (
      <div className="w-full aspect-video rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-4 text-center text-gray-400 shadow-2xs">
        <Video className="w-8 h-8 mb-2 opacity-50 text-gray-400" />
        <p className="text-xs font-mono text-gray-500">Paste a YouTube, Vimeo, or direct video URL above to preview</p>
      </div>
    );
  }

  if (!parsed) {
    return (
      <div className="w-full p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-mono flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
        <span>Unrecognized video link format. Ensure it starts with http:// or https://.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono text-gray-500">
        <span className="text-[#FF3B1F] uppercase font-semibold">
          Detected: {parsed.provider}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>Open External</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-black shadow-md">
        {parsed.embedUrl ? (
          <iframe
            src={parsed.embedUrl}
            title="Video Preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={parsed.directUrl}
            controls
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

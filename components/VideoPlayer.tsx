"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  autoPlay?: boolean;
}

function extractEmbedUrl(url: string, autoPlay: boolean): { type: "youtube" | "vimeo" | "direct"; embedUrl?: string } {
  if (!url) return { type: "direct" };

  // YouTube match
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`,
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+))/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const id = vimeoMatch[3] || vimeoMatch[1];
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=${autoPlay ? 1 : 0}&title=0&byline=0&portrait=0`,
    };
  }

  return { type: "direct" };
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaInfo = useMemo(() => extractEmbedUrl(src, autoPlay), [src, autoPlay]);

  // If YouTube or Vimeo, render secure embedded iframe
  if (mediaInfo.type === "youtube" || mediaInfo.type === "vimeo") {
    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <iframe
          src={mediaInfo.embedUrl}
          title="Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setHasError(true));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden group shadow-2xl">
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        autoPlay={autoPlay}
        onError={() => setHasError(true)}
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Poster Fallback Image if Video Failed or Before Play */}
      {(!isPlaying || hasError) && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group/overlay"
        >
          <Image
            src={poster}
            alt="Video Poster"
            fill
            className="object-cover contrast-110 filter brightness-75 group-hover/overlay:brightness-90 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Big Cinematic Play Button */}
          <div className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FF3B1F] flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,59,31,0.6)] group-hover/overlay:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Video Control Bar */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="p-2.5 rounded-full bg-white/10 hover:bg-[#FF3B1F] text-white hover:text-black transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </button>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-[#FF3B1F]" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          onClick={toggleFullscreen}
          aria-label="Fullscreen"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

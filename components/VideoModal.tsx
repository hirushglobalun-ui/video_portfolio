"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/cms";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Clock,
  Film,
} from "lucide-react";

interface VideoModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ project, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = project?.videoUrl || project?.video || "";

  const parsedEmbed = useMemo(() => {
    if (!videoSrc) return null;
    const trimmed = String(videoSrc).trim();

    // YouTube
    const ytMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }

    // Vimeo
    const vimeoMatch = trimmed.match(
      /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+))/i
    );
    if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
      const id = vimeoMatch[3] || vimeoMatch[1];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    // Adobe CCV or generic embed
    if (trimmed.includes("adobe.io/v1/player") || trimmed.includes("/embed")) {
      return trimmed;
    }

    return null;
  }, [videoSrc]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset video playback state when project changes
  useEffect(() => {
    if (parsedEmbed) return;
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay with sound might be blocked by browser policy, try muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true));
          }
        });
    }
  }, [project, isOpen, parsedEmbed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((curr / dur) * 100);
      setCurrentTime(formatTime(curr));
      setTotalDuration(formatTime(dur));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative z-10 w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-black/60 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#FF3B1F] uppercase font-bold bg-[#FF3B1F]/10 border border-[#FF3B1F]/30 px-2.5 py-1 rounded-full shrink-0">
                  {project.category}
                </span>
                <h3 className="font-display text-lg sm:text-2xl text-[#F5F5F5] uppercase tracking-wide truncate">
                  {project.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Video Modal"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF3B1F] hover:border-[#FF3B1F] hover:text-black text-[#F5F5F5] flex items-center justify-center transition-all duration-300 shrink-0 ml-4 group"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Video Stage Container (16:9) */}
            <div
              onClick={!parsedEmbed ? togglePlay : undefined}
              className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group"
            >
              {parsedEmbed ? (
                <iframe
                  src={parsedEmbed}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={project.thumbnail}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    playsInline
                    className="w-full h-full object-contain cursor-pointer"
                  />

                  {/* Center Play Indicator when paused */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF3B1F] text-black flex items-center justify-center shadow-2xl shadow-[#FF3B1F]/50 pl-1">
                          <Play className="w-8 h-8 fill-black" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom Video Controls Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showControls ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2.5 z-20 cursor-default"
                  >
                    {/* Progress Bar / Scrub Track */}
                    <div
                      onClick={handleSeek}
                      className="w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer relative transition-all overflow-hidden"
                    >
                      <div
                        style={{ width: `${progress}%` }}
                        className="h-full bg-[#FF3B1F] relative"
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F5]">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-[#FF3B1F]"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-[#FF3B1F]"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>

                        <span className="text-[11px] sm:text-xs text-[#888888]">
                          {currentTime} / {totalDuration || project.duration || "1:00"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-[#FF3B1F]"
                        >
                          {isFullscreen ? (
                            <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Bottom Meta & Details Section */}
            <div className="p-4 sm:p-6 bg-[#0e0e0e] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#888888]">
                  {project.client && (
                    <span className="text-[#F5F5F5]">Client: {project.client}</span>
                  )}
                  <span>•</span>
                  <span>Year: {project.year}</span>
                  <span>•</span>
                  <span className="text-[#FF3B1F]">{project.role}</span>
                </div>
                <p className="text-xs text-[#888888] line-clamp-2 max-w-2xl leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle, AlertCircle, Video as VideoIcon } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase/client";

export interface MediaUploaderProps {
  folder?: string;
  category?: "projects" | "profile" | "brands" | "homepage" | "other";
  value?: string;
  onChange?: (url: string) => void;
  onUploadSuccess?: (url: string) => void;
  type?: "image" | "video";
  label?: string;
  helperText?: string;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
}

export default function MediaUploader({
  folder = "portfolio/general",
  category = "other",
  value,
  onChange,
  onUploadSuccess,
  type = "image",
  label,
  helperText,
  aspectRatio = "video",
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notifyUrl = (url: string) => {
    if (onChange) onChange(url);
    if (onUploadSuccess) onUploadSuccess(url);
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    if (type === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file (MP4, MOV, WEBM).");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size must be less than 100MB.");
        return;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (PNG, JPG, WEBP, AVIF).");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError("Image file size must be less than 15MB.");
        return;
      }
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    const fallbackCompressAndUpload = (f: File) => {
      if (type.includes("video")) {
        setError("Video upload could not be processed. Please provide a YouTube, Vimeo, or direct video URL.");
        setIsUploading(false);
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              let { width, height } = img;
              const maxDim = 1200;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
              notifyUrl(dataUrl);
              setIsUploading(false);
              setError(null);
            } catch {
              const rawUrl = event.target?.result as string;
              notifyUrl(rawUrl);
              setIsUploading(false);
              setError(null);
            }
          };
          img.onerror = () => {
            const rawUrl = event.target?.result as string;
            notifyUrl(rawUrl);
            setIsUploading(false);
            setError(null);
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = () => {
          setError("Failed to read image file.");
          setIsUploading(false);
        };
        reader.readAsDataURL(f);
      } catch {
        setError("Could not process image.");
        setIsUploading(false);
      }
    };

    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // 1. If Cloudinary credentials are provided, upload directly to Cloudinary
    if (cloudinaryCloudName && cloudinaryPreset) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryPreset);

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/${type === "video" ? "video" : "image"}/upload`
        );

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            try {
              const res = JSON.parse(xhr.responseText);
              const downloadUrl = res.secure_url;
              notifyUrl(downloadUrl);
              setIsUploading(false);

              if (db) {
                try {
                  await addDoc(collection(db, "media"), {
                    url: downloadUrl,
                    name: file.name,
                    category,
                    size: file.size,
                    contentType: file.type,
                    provider: "cloudinary",
                    publicId: res.public_id,
                    createdAt: new Date().toISOString(),
                  });
                } catch (mediaErr) {
                  console.warn("Could not save media record to Firestore:", mediaErr);
                }
              }
            } catch (jsonErr) {
              fallbackCompressAndUpload(file);
            }
          } else {
            console.warn("Cloudinary upload failed, falling back to local compression:", xhr.responseText);
            fallbackCompressAndUpload(file);
          }
        };

        xhr.onerror = () => {
          console.warn("Cloudinary network error, falling back to local compression");
          fallbackCompressAndUpload(file);
        };

        xhr.send(formData);
        return;
      } catch (cloudErr: any) {
        console.warn("Cloudinary setup error, falling back to local compression:", cloudErr);
        fallbackCompressAndUpload(file);
        return;
      }
    }

    // 2. Fallback to Firebase Storage if Cloudinary is not configured
    if (!storage) {
      setError("Neither Cloudinary nor Firebase Storage is configured. Please check your .env variables.");
      setIsUploading(false);
      return;
    }

    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const timestamp = Date.now();
      const storagePath = `${folder}/${timestamp}_${cleanName}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          console.error("Storage upload error:", err);
          setError(err.message || "Failed to upload file.");
          setIsUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          notifyUrl(downloadUrl);
          setIsUploading(false);

          if (db) {
            try {
              await addDoc(collection(db, "media"), {
                url: downloadUrl,
                name: file.name,
                category,
                size: file.size,
                contentType: file.type,
                storagePath,
                provider: "firebase",
                createdAt: new Date().toISOString(),
              });
            } catch (mediaErr) {
              console.warn("Could not save media record to Firestore:", mediaErr);
            }
          }
        }
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload process failed.");
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : aspectRatio === "video"
      ? "aspect-video"
      : "min-h-[160px]";

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
          {label}
        </label>
      )}

      {value ? (
        <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group shadow-2xs`}>
          {type === "video" ? (
            <div className="w-full h-full flex items-center justify-center bg-black text-white p-4">
              <video src={value} controls className="max-h-full max-w-full rounded" />
            </div>
          ) : (
            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-900 text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => notifyUrl("")}
              className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm cursor-pointer"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full ${aspectClass} rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 cursor-pointer text-center ${
            isDragging
              ? "border-[#FF3B1F] bg-[#FF3B1F]/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-white"
          }`}
        >
          {isUploading ? (
            <div className="space-y-3 w-3/4 max-w-xs text-center">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#FF3B1F] h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-mono text-gray-500">Uploading... {progress}%</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-gray-900">
                {type === "video" ? <VideoIcon className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <p className="text-xs font-medium text-gray-700">
                Click to upload or drag & drop {type === "video" ? "video file" : "image"}
              </p>
              <p className="text-[11px] font-mono text-gray-400">
                {type === "video" ? "MP4, MOV, WEBM up to 100MB" : "PNG, JPG, WEBP, AVIF up to 15MB"}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={type === "video" ? "video/*" : "image/*"}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p className="text-[11px] font-mono text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

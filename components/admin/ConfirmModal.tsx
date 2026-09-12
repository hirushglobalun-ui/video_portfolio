"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDangerous ? "bg-red-50 text-red-600 border border-red-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
                : "bg-[#FF3B1F] hover:bg-[#E0341A] text-white shadow-md shadow-[#FF3B1F]/20"
            }`}
          >
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

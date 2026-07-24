"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  className,
  accept = "image/*",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be under ${maxSizeMB}MB`);
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      // Replace local preview with server URL
      URL.revokeObjectURL(localPreview);
      setPreview(data.data.url);
      onChange(data.data.url);
    } catch (err: any) {
      URL.revokeObjectURL(localPreview);
      setError(err.message || "Upload failed");
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  }, [maxSizeMB, onChange, value]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
          <img
            src={preview}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
            dragOver
              ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-50)]/50"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center mb-3">
            <Camera className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
            Tap to upload photo
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            or drag & drop &middot; JPG, PNG up to {maxSizeMB}MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

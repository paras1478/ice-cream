"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append("images", file);
          formData.append("folder", "products");

          const res = await fetch("/api/upload/images", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Upload failed (${res.status})`);
          }

          const json = await res.json();
          const urls: string[] = json?.data?.urls ?? [];
          uploadedUrls.push(...urls);
        } catch (error) {
          toast.error(`Failed to upload ${file.name}: ${(error as Error).message}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded!`);
      }

      setUploading(false);
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: maxImages - images.length,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-dark-border hover:border-primary hover:bg-primary/5"
          } ${uploading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                {isDragActive ? (
                  <ImageIcon className="h-7 w-7 text-primary" />
                ) : (
                  <Upload className="h-7 w-7 text-primary" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  {isDragActive ? "Drop images here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 10MB each
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {images.length}/{maxImages} images used
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <AnimatePresence>
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-dark-border"
              >
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

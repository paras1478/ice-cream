"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const fallbackImages = images.length > 0 ? images : ["/placeholder-ice-cream.jpg"];

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % fallbackImages.length);
  };

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + fallbackImages.length) % fallbackImages.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-cyan-50 dark:from-dark-border dark:to-dark-bg group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {fallbackImages[selectedIndex] && !imageError[selectedIndex] ? (
              <Image
                src={fallbackImages[selectedIndex]}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                fill
                className="object-cover"
                onError={() =>
                  setImageError((prev) => ({ ...prev, [selectedIndex]: true }))
                }
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-9xl">
                🍦
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-lg bg-white/80 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Navigation */}
        {fallbackImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 text-gray-700 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 text-gray-700 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Index */}
        {fallbackImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {selectedIndex + 1} / {fallbackImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {fallbackImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fallbackImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-primary shadow-ice"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              {img && !imageError[index] ? (
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() =>
                    setImageError((prev) => ({ ...prev, [index]: true }))
                  }
                  sizes="80px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-50 text-2xl">
                  🍦
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Modal isOpen={isZoomed} onClose={() => setIsZoomed(false)} size="xl">
        <div className="relative h-[70vh]">
          {fallbackImages[selectedIndex] && !imageError[selectedIndex] ? (
            <Image
              src={fallbackImages[selectedIndex]}
              alt={`${productName} - zoomed`}
              fill
              className="object-contain"
              sizes="800px"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-9xl">🍦</div>
          )}
        </div>
      </Modal>
    </div>
  );
}

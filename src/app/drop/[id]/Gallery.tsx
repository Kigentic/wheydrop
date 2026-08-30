"use client";

import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setZoomIndex(i)}
            className="aspect-square overflow-hidden rounded-lg border-2 border-black transition hover:border-yellow-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} – Bild ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {zoomIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setZoomIndex(null)}
        >
          <button
            onClick={() => setZoomIndex(null)}
            className="absolute right-6 top-6 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-black"
          >
            Schließen ✕
          </button>

          {zoomIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(zoomIndex - 1);
              }}
              className="absolute left-4 rounded-full bg-yellow-400 px-3 py-2 text-lg font-bold text-black sm:left-8"
            >
              ‹
            </button>
          )}
          {zoomIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(zoomIndex + 1);
              }}
              className="absolute right-4 rounded-full bg-yellow-400 px-3 py-2 text-lg font-bold text-black sm:right-8"
            >
              ›
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[zoomIndex]}
            alt={`${alt} – Bild ${zoomIndex + 1}`}
            className="max-h-[80vh] w-auto max-w-full rounded-lg bg-white object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

"use client";

import { useRef, useState } from "react";

const SLOTS = 4;

export default function ImageUploader({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [errors, setErrors] = useState<(string | null)[]>(Array(SLOTS).fill(null));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleFile(index: number, file: File | undefined) {
    if (!file) return;

    setErrors((prev) => prev.map((e, i) => (i === index ? null : e)));

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setErrors((prev) => prev.map((e, i) => (i === index ? "Nur PNG, JPEG oder JPG erlaubt" : e)));
      return;
    }

    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setErrors((prev) => prev.map((e, i) => (i === index ? json.error ?? "Upload fehlgeschlagen" : e)));
        return;
      }

      const next = [...urls];
      next[index] = json.url;
      onChange(next.filter(Boolean));
    } finally {
      setUploading(null);
    }
  }

  function removeImage(index: number) {
    const next = [...urls];
    next[index] = "";
    onChange(next.filter(Boolean));
  }

  return (
    <div>
      <div className="mb-1 text-sm">Produktbilder (bis zu 4, PNG/JPEG/JPG)</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: SLOTS }).map((_, i) => {
          const url = urls[i];
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="relative aspect-square overflow-hidden rounded border border-zinc-400 bg-zinc-50">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={`Bild ${i + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    {uploading === i ? "Lädt hoch…" : "Kein Bild"}
                  </div>
                )}
              </div>

              <input
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => handleFile(i, e.target.files?.[0])}
                className="hidden"
              />

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => inputRefs.current[i]?.click()}
                  disabled={uploading === i}
                  className="flex-1 rounded border border-zinc-400 bg-white px-2 py-1 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50"
                >
                  Durchsuchen
                </button>
                {url && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="rounded border border-zinc-400 px-2 py-1 text-xs text-zinc-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {errors[i] && <p className="text-[11px] text-red-600">{errors[i]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

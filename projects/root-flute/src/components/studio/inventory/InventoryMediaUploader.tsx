"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { UploadCloud, X, Loader2, Play } from "lucide-react";
import type { InventoryImage } from "@/lib/inventory";

interface InFlightUpload {
  id: string;
  name: string;
  progress: number;
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

async function uploadFile(
  file: File,
  onProgress: (percentage: number) => void
): Promise<{ url: string }> {
  const blob = await upload(`inventory/${Date.now()}-${sanitizeFilename(file.name)}`, file, {
    access: "public",
    handleUploadUrl: "/api/studio/inventory/upload",
    onUploadProgress: ({ percentage }) => onProgress(percentage),
  });
  return { url: blob.url };
}

function useUploadQueue() {
  const [inFlight, setInFlight] = useState<InFlightUpload[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function run(files: File[], onDone: (url: string, file: File) => void) {
    setError(null);
    for (const file of files) {
      const id = crypto.randomUUID();
      setInFlight((q) => [...q, { id, name: file.name, progress: 0 }]);
      try {
        const { url } = await uploadFile(file, (progress) => {
          setInFlight((q) => q.map((u) => (u.id === id ? { ...u, progress } : u)));
        });
        onDone(url, file);
      } catch {
        setError(`"${file.name}" failed to upload. Please try again.`);
      } finally {
        setInFlight((q) => q.filter((u) => u.id !== id));
      }
    }
  }

  return { inFlight, error, run };
}

function Dropzone({
  accept,
  multiple,
  disabled,
  onFiles,
  children,
}: {
  accept: string;
  multiple: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  children: React.ReactNode;
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : [files[0]]);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg py-8 px-4 text-center cursor-pointer transition-colors duration-150 ${
        dragActive ? "border-brand-gold bg-brand-gold/5" : "border-brand-border hover:border-brand-gold/40"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(multiple ? files : [files[0]]);
          e.target.value = "";
        }}
      />
      {children}
    </div>
  );
}

function ProgressList({ items }: { items: InFlightUpload[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 mt-3">
      {items.map((u) => (
        <div key={u.id} className="flex items-center gap-3 text-xs">
          <Loader2 className="w-3.5 h-3.5 text-brand-gold animate-spin flex-shrink-0" strokeWidth={2} />
          <span className="text-brand-muted truncate flex-1">{u.name}</span>
          <div className="w-20 h-1 rounded-full bg-brand-surface-2 overflow-hidden flex-shrink-0">
            <div
              className="h-full bg-brand-gold transition-all duration-150"
              style={{ width: `${Math.round(u.progress)}%` }}
            />
          </div>
          <span className="text-brand-muted/60 w-8 text-right flex-shrink-0">{Math.round(u.progress)}%</span>
        </div>
      ))}
    </div>
  );
}

// Featured image — single required image.
export function FeaturedImageUploader({
  value,
  onChange,
}: {
  value: InventoryImage | null;
  onChange: (image: InventoryImage | null) => void;
}) {
  const { inFlight, error, run } = useUploadQueue();

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-brand-border group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.url} alt={value.alt} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove featured image"
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-brand-dark/80 text-brand-text hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <Dropzone
          accept="image/*"
          multiple={false}
          onFiles={(files) =>
            run(files, (url, file) => onChange({ url, alt: file.name.replace(/\.[^/.]+$/, "") }))
          }
        >
          <UploadCloud className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
          <p className="text-sm text-brand-muted">Drag an image here, or click to browse</p>
        </Dropzone>
      )}
      <ProgressList items={inFlight} />
      {error && <p className="text-xs text-red-400/90">{error}</p>}
    </div>
  );
}

// Additional images — multiple optional images.
export function AdditionalImagesUploader({
  value,
  onChange,
}: {
  value: InventoryImage[];
  onChange: (images: InventoryImage[]) => void;
}) {
  const { inFlight, error, run } = useUploadQueue();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((image, i) => (
          <div key={image.url + i} className="relative aspect-square rounded-md overflow-hidden border border-brand-border group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              aria-label={`Remove image ${i + 1}`}
              className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-brand-dark/80 text-brand-text hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
      <Dropzone
        accept="image/*"
        multiple
        onFiles={(files) =>
          run(files, (url, file) =>
            onChange([...value, { url, alt: file.name.replace(/\.[^/.]+$/, "") }])
          )
        }
      >
        <UploadCloud className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
        <p className="text-sm text-brand-muted">Drag images here, or click to browse</p>
      </Dropzone>
      <ProgressList items={inFlight} />
      {error && <p className="text-xs text-red-400/90">{error}</p>}
    </div>
  );
}

// Optional single video.
export function VideoUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const { inFlight, error, run } = useUploadQueue();

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-brand-border bg-brand-dark group">
          <video src={value} className="w-full h-full object-cover" muted loop playsInline controls />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove video"
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-brand-dark/80 text-brand-text hover:text-red-400 transition-colors duration-150"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <Dropzone accept="video/*" multiple={false} onFiles={(files) => run(files, (url) => onChange(url))}>
          <Play className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
          <p className="text-sm text-brand-muted">Drag a video here, or click to browse</p>
        </Dropzone>
      )}
      <ProgressList items={inFlight} />
      {error && <p className="text-xs text-red-400/90">{error}</p>}
    </div>
  );
}

// Generic multi-file uploader used by the Media Library — accepts any image
// or video and simply reports each completed upload; the Media Library is
// just a live view over Blob storage, so there's no local value to track
// here the way the other uploaders above do.
export function GenericMediaUploader({ onUploaded }: { onUploaded: (url: string, file: File) => void }) {
  const { inFlight, error, run } = useUploadQueue();

  return (
    <div className="flex flex-col gap-3">
      <Dropzone accept="image/*,video/*" multiple onFiles={(files) => run(files, onUploaded)}>
        <UploadCloud className="w-5 h-5 text-brand-muted" strokeWidth={1.5} />
        <p className="text-sm text-brand-muted">Drag images or videos here, or click to browse</p>
      </Dropzone>
      <ProgressList items={inFlight} />
      {error && <p className="text-xs text-red-400/90">{error}</p>}
    </div>
  );
}

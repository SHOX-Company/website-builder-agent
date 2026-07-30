import { Eye, Link as LinkIcon, Trash2, Video as VideoIcon } from "lucide-react";
import type { MediaAsset } from "@/lib/media";
import Badge from "@/components/studio/ui/Badge";

export default function MediaAssetCard({
  asset,
  onPreview,
  onCopy,
  onDelete,
  copied,
}: {
  asset: MediaAsset;
  onPreview: () => void;
  onCopy: () => void;
  onDelete: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col bg-brand-surface border border-brand-border rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-brand-dark flex items-center justify-center">
        {asset.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
        ) : (
          <VideoIcon className="w-8 h-8 text-brand-muted" strokeWidth={1.5} />
        )}
        <div className="absolute top-2.5 left-2.5">
          <Badge tone={asset.type === "video" ? "gold" : "muted"}>{asset.type}</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <p className="text-brand-text text-sm font-medium font-sans truncate" title={asset.filename}>
          {asset.filename}
        </p>
      </div>

      <div className="grid grid-cols-3 border-t border-brand-border mt-auto">
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans text-brand-muted hover:text-brand-gold hover:bg-brand-surface-2 transition-colors duration-150 border-r border-brand-border"
        >
          <Eye className="w-3.5 h-3.5" strokeWidth={1.75} /> Preview
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans text-brand-muted hover:text-brand-gold hover:bg-brand-surface-2 transition-colors duration-150 border-r border-brand-border"
        >
          <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.75} /> {copied ? "Copied!" : "Copy URL"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans text-brand-muted hover:text-red-400 hover:bg-brand-surface-2 transition-colors duration-150"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} /> Delete
        </button>
      </div>
    </div>
  );
}

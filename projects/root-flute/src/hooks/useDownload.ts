"use client";

import { useState } from "react";

export function useDownload() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (
    href: string,
    filename?: string,
    onStart?: () => void,
    onSuccess?: () => void
  ) => {
    try {
      onStart?.();
      setDownloadingId(filename || href);

      const link = document.createElement("a");
      link.href = href;
      if (filename) {
        link.download = filename;
      } else {
        link.setAttribute("download", "");
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onSuccess?.();
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      // Reset after a short delay to allow visual feedback
      setTimeout(() => setDownloadingId(null), 500);
    }
  };

  return { downloadingId, handleDownload };
}

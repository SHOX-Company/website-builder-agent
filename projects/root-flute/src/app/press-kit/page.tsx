"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import { Toast, useToast } from "@/components/ui/Toast";
import { useDownload } from "@/hooks/useDownload";
import { useState } from "react";
import PromotionalPhotoGallery from "@/components/sections/PromotionalPhotoGallery";

const pressKitAssets = {
  bios: [
    { name: "Performance Bio", path: "/press-kit/bios/Perfromance Bio.docx" },
    { name: "Instrument Making Bio", path: "/press-kit/bios/Instrument Making Bio.docx" },
  ],
  descriptions: [
    { name: "Dance Description", path: "/press-kit/descriptions/Dance Description.docx" },
    { name: "Lucid Meditation Description", path: "/press-kit/descriptions/Lucid Meditation Description.docx" },
  ],
  logos: [
    { id: 1, path: "/brand-assets/logos/1.PNG" },
    { id: 2, path: "/brand-assets/logos/2.PNG" },
    { id: 3, path: "/brand-assets/logos/3.PNG" },
    { id: 4, path: "/brand-assets/logos/4.PNG" },
    { id: 5, path: "/brand-assets/logos/5.PNG" },
    { id: 6, path: "/brand-assets/logos/6.PNG" },
    { id: 7, path: "/brand-assets/logos/7.PNG" },
  ],
  techRider: [
    { name: "Tech Rider", path: "/press-kit/Tech Rider.docx" },
  ],
};

function DownloadButton({
  children,
  isLoading,
  onDownload,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  onDownload: () => void;
}) {
  return (
    <button
      onClick={onDownload}
      disabled={isLoading}
      className={`p-4 border border-brand-gold/30 hover:border-brand-gold/60 rounded-sm transition-all flex items-center justify-between group w-full ${
        isLoading ? "bg-brand-gold/10 border-brand-gold/60" : ""
      } disabled:opacity-75`}
    >
      <span className="text-brand-text group-hover:text-brand-gold transition-colors text-left">
        {children}
      </span>
      <span className={`text-sm transition-all ${isLoading ? "text-brand-gold" : "text-brand-gold/50"}`}>
        {isLoading ? "⟳ Downloading..." : "↓ Download"}
      </span>
    </button>
  );
}

export default function PressKitPage() {
  const { toast, showToast, closeToast } = useToast();
  const { downloadingId, handleDownload } = useDownload();
  const [showGallery, setShowGallery] = useState(false);

  const handleFileDownload = (href: string, filename: string) => {
    handleDownload(
      href,
      filename,
      () => {
        // Show loading state
      },
      () => {
        showToast("Your download has started.");
      }
    );
  };

  return (
    <main>
      <SectionWrapper className="bg-brand-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
              Press Kit
            </p>
            <h1 className="font-display font-light text-brand-text text-4xl sm:text-5xl leading-[1.2] mb-6">
              Media & Promotional Assets
            </h1>
            <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
              Download professional assets for festivals, venues, promoters, and media partners.
            </p>
          </div>

          {/* Biographies */}
          <section className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-text mb-6 font-light">
              Biographies
            </h2>
            <div className="grid gap-4">
              {pressKitAssets.bios.map((bio) => (
                <DownloadButton
                  key={bio.name}
                  isLoading={downloadingId === bio.name}
                  onDownload={() => handleFileDownload(bio.path, bio.name)}
                >
                  {bio.name}
                </DownloadButton>
              ))}
            </div>
          </section>

          {/* Descriptions */}
          <section className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-text mb-6 font-light">
              Performance Descriptions
            </h2>
            <div className="grid gap-4">
              {pressKitAssets.descriptions.map((desc) => (
                <DownloadButton
                  key={desc.name}
                  isLoading={downloadingId === desc.name}
                  onDownload={() => handleFileDownload(desc.path, desc.name)}
                >
                  {desc.name}
                </DownloadButton>
              ))}
            </div>
          </section>

          {/* Logos */}
          <section className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-text mb-6 font-light">
              Logos
            </h2>
            <p className="text-brand-muted text-sm mb-6">
              7 professional logo variations in PNG format
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-brand-surface-2 rounded-sm">
              {pressKitAssets.logos.map((logo) => (
                <a
                  key={logo.id}
                  href={logo.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square bg-brand-surface rounded overflow-hidden flex items-center justify-center hover:bg-brand-surface-2 transition-all group relative cursor-pointer"
                  title={`Open Logo ${logo.id}`}
                >
                  <div className="w-full h-full relative flex items-center justify-center p-2">
                    <img
                      src={logo.path}
                      alt={`Logo ${logo.id}`}
                      className="object-contain max-w-full max-h-full"
                      draggable={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Photos */}
          <section className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-text mb-6 font-light">
              Promotional Photos
            </h2>
            <p className="text-brand-muted text-sm mb-6">
              High-quality promotional photographs for use in press materials
            </p>
            {!showGallery ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowGallery(true);
                }}
                className="inline-block px-6 py-3 border border-brand-gold/50 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 rounded-sm transition-colors cursor-pointer"
              >
                View Photo Gallery
              </button>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowGallery(false);
                  }}
                  className="mb-4 inline-block px-4 py-2 text-sm border border-brand-gold/50 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 rounded-sm transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <PromotionalPhotoGallery />
              </div>
            )}
          </section>

          {/* Tech Rider */}
          <section className="mb-16">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-text mb-6 font-light">
              Technical Specifications
            </h2>
            <DownloadButton
              isLoading={downloadingId === "Tech Rider.docx"}
              onDownload={() =>
                handleFileDownload(pressKitAssets.techRider[0].path, "Tech Rider.docx")
              }
            >
              Tech Rider
            </DownloadButton>
          </section>

          {/* Additional Info */}
          <section className="pt-16 border-t border-brand-gold/20">
            <p className="text-brand-muted text-sm text-center">
              For additional assets or inquiries, please{" "}
              <a href="/contact" className="text-brand-gold hover:text-brand-gold/80 transition-colors">
                contact us
              </a>
            </p>
          </section>
        </div>
      </SectionWrapper>

      <Footer />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          duration={toast.duration}
          onClose={closeToast}
        />
      )}
    </main>
  );
}

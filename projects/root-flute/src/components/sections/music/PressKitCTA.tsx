// Links straight to RootFlute's existing Google Drive press-kit folder
// (Bio, Dance Description, Logo, Lucid Meditation Description, Pics, Tech
// Rider) — the source-of-truth press materials, matching the original site.
const PRESS_KIT_URL =
  "https://drive.google.com/drive/folders/1AewmebwCeQI7zaAhlRoniTXt7Tm7C0xL?usp=sharing";

export default function PressKitCTA() {
  return (
    <div className="text-center mb-12">
      <a
        href={PRESS_KIT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-3 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-surface-2 transition-colors font-sans text-sm uppercase tracking-wider"
      >
        Press Kit Assets
      </a>
    </div>
  );
}

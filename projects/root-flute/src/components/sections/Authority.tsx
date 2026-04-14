import SectionWrapper from "@/components/ui/SectionWrapper";
import Image from "next/image";

const stats = [
  { value: "500K+", label: "Followers" },
  { value: "15+", label: "Years of Craft" },
  { value: "200+", label: "Flutes Built" },
];

export default function Authority() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left: Dan's portrait — premium still image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-dark">
          {/*
            Drop file: /public/images/dan-portrait.jpg
            Ideal: Dan holding or playing a flute, natural light, dark/earthy background.
            Portrait orientation (3:4). No direct flash. Cinematic color grade preferred.
          */}
          <Image
            src="/images/dan-portrait.svg"
            alt="Dan — flute craftsman and sound healer"
            fill
            unoptimized
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          {/* Subtle gold bloom overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(196,151,58,0.08),transparent)] pointer-events-none"
          />
        </div>

        {/* Right: story */}
        <div className="flex flex-col gap-6">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            The Craftsman
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-light text-brand-text leading-snug">
            Dan has been building sacred flutes for over 15 years.
          </h2>

          <p className="text-brand-muted text-base leading-relaxed">
            He learned the craft through deep study of indigenous and ceremonial traditions.
            His instruments have been used in ceremony, healing work, and meditation practice
            around the world. With over half a million followers, the community is the natural
            extension of a practice built on trust, not marketing.
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-4 border-t border-brand-border">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-3xl font-light text-brand-gold">
                  {stat.value}
                </span>
                <span className="text-brand-muted text-xs uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}

import SectionWrapper from "@/components/ui/SectionWrapper";

export default function FeaturedVideosFirst() {
  const videos = [
    {
      id: "a7typ5Kp1so",
      title: "Live Sound Meditation Album 5-11-24 by RootFlute",
    },
    {
      id: "fi1OjLrRmUc",
      title: "Rootflute Lucid meditation. Full session in previos vid",
    },
    {
      id: "pCqVA2i8rww",
      title: "RootFlute Lucid meditation  #194  5-8-24 (at 10:00 words stop )",
    },
  ];

  return (
    <SectionWrapper className="bg-brand-surface-2 py-12">
      <div className="text-center mb-10">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
          Videos
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text">
          Featured Videos
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 max-w-6xl mx-auto">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block focus-visible:outline-none"
            aria-label={`Watch "${video.title}" — opens in a new tab`}
          >
            <div className="relative aspect-video overflow-hidden bg-brand-surface-2 border border-brand-border transition-colors duration-300 group-hover:border-brand-gold/60 rounded-sm mb-4">
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                <svg
                  className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <h3 className="font-light text-sm sm:text-base text-brand-text group-hover:text-brand-gold transition-colors">
              {video.title}
            </h3>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}

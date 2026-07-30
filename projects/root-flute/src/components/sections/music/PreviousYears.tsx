import SectionWrapper from "@/components/ui/SectionWrapper";

export default function PreviousYears() {
  const videos = [
    {
      id: "kDi-QEQIrXw",
      title: "RootFlute Live Looping Fusion | Handmade Instruments | Trancendance Festival, Playa del Carmen",
      caption: "Organic Downtempo Fusion",
    },
    {
      id: "5DqLf8K0xbY",
      title: "Landjuweel Festival 2024 with RootFlute",
    },
    {
      id: "KrebMPoLeYE",
      title: "Rootflute Live at Samsara Music Festival BC | Epic Live Looping Fusion Set in Stunning Nature",
    },
  ];

  return (
    <SectionWrapper className="bg-brand-surface py-12">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-brand-text">
          Previous years
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
            <div className="text-center">
              {video.caption && (
                <p className="text-brand-gold text-xs uppercase tracking-[0.2em] font-sans mb-2">
                  {video.caption}
                </p>
              )}
              <h3 className="font-light text-sm sm:text-base text-brand-text group-hover:text-brand-gold transition-colors">
                {video.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}

import SectionWrapper from "@/components/ui/SectionWrapper";

type FeaturedVideo = { id: string; title: string };

export default function FeaturedVideosFirst({ videos }: { videos: FeaturedVideo[] }) {
  if (videos.length === 0) return null;

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
          <div key={video.id} className="group block">
            <div className="relative aspect-video overflow-hidden bg-brand-surface-2 border border-brand-border transition-colors duration-300 group-hover:border-brand-gold/60 rounded-sm mb-4">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0`}
                title={video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
              />
            </div>
            <h3 className="font-light text-sm sm:text-base text-brand-text group-hover:text-brand-gold transition-colors">
              {video.title}
            </h3>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

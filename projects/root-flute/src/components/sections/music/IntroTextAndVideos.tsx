import SectionWrapper from "@/components/ui/SectionWrapper";

type FeaturedVideo = { id: string; title: string };

export default function IntroTextAndVideos({ videos }: { videos: FeaturedVideo[] }) {
  return (
    <SectionWrapper className="bg-brand-surface py-12 !pt-4 !pb-4">
      {/* Intro Text Block */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <p className="text-brand-text text-lg sm:text-xl mb-6 font-light italic">
          Rise into rhythm with RootFlute's "Organic Downtempo Live Looping Fusion"  Dance Experience.
        </p>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Drawing from his extensive collection of self made instruments including multi chamber wild shed elk antler flutes, triton shell agave esraj-lyre multi instrument, carbon fiber double slide didgeridoo, shakuhachi,  antler clarinet, wild coffee wood elk antler kora, 6 octave agave bass/cello and much more.  Rooted in the Om tone of 136.1 Hz and tuned to C# Sharp 432 Hz, RootFlute creates vast celestial soundscapes that transport audiences to new realms.
        </p>
      </div>

      {/* Videos 2 & 3 */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col">
              <div className="aspect-video relative overflow-hidden rounded-sm bg-black mb-4">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0`}
                  title={video.title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  loading="lazy"
                />
              </div>
              <h3 className="text-brand-text font-light text-sm sm:text-base">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

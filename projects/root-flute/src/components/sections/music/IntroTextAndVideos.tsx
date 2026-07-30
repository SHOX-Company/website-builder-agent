import SectionWrapper from "@/components/ui/SectionWrapper";

export default function IntroTextAndVideos() {
  return (
    <SectionWrapper className="bg-brand-surface py-12">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Video 2 */}
        <div className="flex flex-col">
          <div className="aspect-video relative overflow-hidden rounded-sm bg-black mb-4">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/XOoVrNN7TB8?autoplay=0&rel=0"
              title="Organic Downtempo Live Looping Fusion  in C# 432 Hz OM (RootFlute) studio sessions"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
          <h3 className="text-brand-text font-light text-sm sm:text-base">
            Organic Downtempo Live Looping Fusion  in C# 432 Hz OM (RootFlute) studio sessions
          </h3>
        </div>

        {/* Video 3 */}
        <div className="flex flex-col">
          <div className="aspect-video relative overflow-hidden rounded-sm bg-black mb-4">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/RuznuuEfp2s?autoplay=0&rel=0"
              title="Organic Downtempo Live Looping Fusion by RootFlute"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
          <h3 className="text-brand-text font-light text-sm sm:text-base">
            Organic Downtempo Live Looping Fusion by RootFlute
          </h3>
        </div>
      </div>
    </SectionWrapper>
  );
}

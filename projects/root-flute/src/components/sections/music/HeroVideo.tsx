type FeaturedVideo = { id: string; title: string };

export default function HeroVideo({ video }: { video?: FeaturedVideo }) {
  if (!video) return null;

  return (
    <div className="aspect-video relative overflow-hidden rounded-sm bg-black">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0`}
        title={video.title}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
}

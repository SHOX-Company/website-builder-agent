export default function HeroVideo() {
  return (
    <div className="aspect-video relative overflow-hidden rounded-sm bg-black">
      <iframe
        className="absolute inset-0 w-full h-full"
        src="https://www.youtube.com/embed/2e6BSwQUHlw?autoplay=0&rel=0"
        title="RootFlute instrument demonstration"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
}

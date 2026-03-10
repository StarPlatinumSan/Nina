type Photo = { id: string; src: string; alt: string };

export default function PhotoCarousel({ photos, height = 360, secondsPerLoop = 30 }: { photos: Photo[]; height?: number; secondsPerLoop?: number }) {
  const loopPhotos = [...photos, ...photos];
  const cappedDuration = Math.max(secondsPerLoop, photos.length * 2.5);

  return (
    <div
      className="marquee"
      style={
        {
          height: `${height}px`,
          ["--marquee-duration" as any]: `${cappedDuration}s`,
        } as React.CSSProperties
      }
    >
      <div className="marquee__track">
        {loopPhotos.map((p, i) => (
          <div className="marquee__item" key={`${p.id}-${i}`}>
            <img className="marquee__img" src={p.src} alt={p.alt} loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

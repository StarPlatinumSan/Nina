import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import FloatingCats from "../components/FloatingCats.tsx";

type Photo = { id: string; src: string; alt: string };

type GroupKey = "Us" | "Her" | "Chaos" | "Random" | "Him";

const GROUPS: { key: GroupKey; label: string; desc: string }[] = [
  { key: "Us", label: "Nous deux", desc: "Nos moments ensemble 💗" },
  { key: "Her", label: "Elle", desc: "Parce que t’es trop belle 🐥" },
  { key: "Him", label: "Lui", desc: "Parce que je suis égocentrique 💙" },
  { key: "Chaos", label: "Le Chaos", desc: "Les photos spéciales ... mais c'est correct ✨" },
  { key: "Random", label: "Babillard", desc: "Des photos aléatoires 💘" },
];

function toPhotos(files: Record<string, string>): Photo[] {
  return Object.entries(files)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url], i) => ({
      id: `${i + 1}-${path}`,
      src: url as string,
      alt:
        path
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "") ?? `Photo ${i + 1}`,
    }));
}

export default function GalleryPage() {
  const usFiles = import.meta.glob("/public/ninette/Us/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const herFiles = import.meta.glob("/public/ninette/Her/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const chaosFiles = import.meta.glob("/public/ninette/Chaos/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const randomFiles = import.meta.glob("/public/ninette/Random/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const himFiles = import.meta.glob("/public/ninette/Him/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });

  const photosByGroup = useMemo(() => {
    return {
      Us: toPhotos(usFiles as Record<string, string>),
      Her: toPhotos(herFiles as Record<string, string>),
      Him: toPhotos(himFiles as Record<string, string>),
      Chaos: toPhotos(chaosFiles as Record<string, string>),
      Random: toPhotos(randomFiles as Record<string, string>),
    } as Record<GroupKey, Photo[]>;
  }, []);

  const [active, setActive] = useState<GroupKey>("Us");

  const activeMeta = GROUPS.find((g) => g.key === active)!;
  const activePhotos = photosByGroup[active] ?? [];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + activePhotos.length) % activePhotos.length);
  };

  const next = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % activePhotos.length);
  };

  useMemo(() => {
    if (lightboxIndex !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return undefined;
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, activePhotos.length]);

  return (
    <main className="galleryPage">
      <FloatingCats />
      <header className="galleryTop">
        <Link to="/" className="retourBtnGallery">
          ← Retour
        </Link>

        <div className="galleryTitleRow">
          <h1 className="galleryTitle">Le Catalogue</h1>
        </div>

        <nav className="galleryTabs" aria-label="Catégories">
          {GROUPS.map((g) => (
            <button key={g.key} type="button" className={`tab ${active === g.key ? "isActive" : ""}`} onClick={() => setActive(g.key)}>
              {g.label}
            </button>
          ))}
        </nav>

        <div className="gallerySectionInfo">
          <h2 className="gallerySectionTitle">{activeMeta.label}</h2>
          <p className="gallerySectionDesc">{activeMeta.desc}</p>
        </div>
      </header>

      <section className="galleryGrid" aria-label={`Photos: ${activeMeta.label}`}>
        {activePhotos.length === 0 ? (
          <p className="galleryEmpty">Tu vas décider en mes les envoyant HAHAHA</p>
        ) : (
          activePhotos.map((p, i) => (
            <figure className="gCard" key={p.id} onClick={() => openLightbox(i)} style={{ cursor: "zoom-in" }}>
              <img className="gImg" src={p.src} alt={p.alt} loading="lazy" />
            </figure>
          ))
        )}
      </section>

      {lightboxIndex !== null && activePhotos[lightboxIndex] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={closeLightbox}>
          <button className="lbClose" onClick={closeLightbox} aria-label="Close" type="button">
            ✕
          </button>

          <button
            className="lbNav lbPrev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            type="button"
          >
            ‹
          </button>

          <div className="lbInner" onClick={(e) => e.stopPropagation()}>
            <img className="lbImg" src={activePhotos[lightboxIndex].src} alt={activePhotos[lightboxIndex].alt} />
            <div className="lbMeta">
              <span>
                {lightboxIndex + 1} / {activePhotos.length}
              </span>
              <span>{activeMeta.label}</span>
            </div>
          </div>

          <button
            className="lbNav lbNext"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            type="button"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

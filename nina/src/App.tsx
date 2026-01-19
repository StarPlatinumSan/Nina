import { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

import MusicWidget from "./components/MusicWidget";
import PhotoCarousel from "./components/PhotoCarousel";
import GalleryPage from "./pages/GalleryPage";
import { MusicPlayerProvider } from "./player/MusicPlayerContext";
import { useMusicPlayer } from "./player/MusicPlayerContext";
import SongSidebar from "./components/SongSidebar";

type Photo = { id: string; src: string; alt: string };
type Track = { id: string; src: string; title: string; subtitle?: string };
type Poem = {
  title: string;
  date: string;
  body: string[];
};

function niceTitleFromPath(p: string) {
  const file = p.split("/").pop() ?? p;
  return file
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function AutoPlayOnGift({ active }: { active: boolean }) {
  const { play } = useMusicPlayer();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      startedRef.current = false;
      return;
    }

    if (!startedRef.current) {
      startedRef.current = true;
      play();
    }
  }, [active, play]);

  return null;
}

function App() {
  const [giftOpen, setGiftOpen] = useState(false);
  const [burst, setBurst] = useState(false);

  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const playerAnchorRef = useRef<HTMLDivElement | null>(null);

  const images = import.meta.glob("/public/ninette/Us/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const imagesToi = import.meta.glob("/public/ninette/Her/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const imagesChaos = import.meta.glob("/public/ninette/Chaos/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });
  const imagesRandom = import.meta.glob("/public/ninette/Random/*.{jpg,jpeg,png,webp}", { eager: true, as: "url" });

  const [isSliding, setIsSliding] = useState<"left" | "right" | null>(null);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const shouldShowMini = giftOpen && (!isHome || showMiniPlayer);

  const allowReveal = giftOpen;

  const reveal = {
    hidden: { opacity: 0, y: 22, scale: 0.985 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const revealSoft = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.35, 1, 0.5, 1],
      },
    },
  };

  const poemReveal = {
    hidden: { opacity: 0, scale: 0.985 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const stagger = {
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const galleryBtnReveal = {
    hidden: {
      opacity: 0,
      y: 32,
      scale: 0.95,
      filter: "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        delay: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const heroControls = useAnimation();

  useEffect(() => {
    if (isHome && giftOpen) {
      heroControls.set("hidden");
      heroControls.start("show");
    }

    if (isHome && !giftOpen) {
      heroControls.set("hidden");
    }
  }, [isHome, giftOpen, heroControls]);

  const poems: Poem[] = useMemo(
    () => [
      {
        title: "Comme une évidence",
        date: "Prologue",
        body: [
          "Te rappelles-tu de nos débuts ?",
          "Riant à n'en plus finir,",
          "Se manquant même en étant ensemble ?",
          "Nous, découvrant nos musiques préférées,",
          "Installés dans ma voiture,",
          "Un lien invisible se créait entre nous.",
          "Ta main dans la mienne et mon coeur s'attendrit.",
          "Dès nos premiers instants, j'ai su.",
          "Cette alchimie que l'on ne ressent qu'une fois,",
          "C'était ça, nous.",
          "Ensemble, nous voyons le monde comme personne ne l'a jamais vu.",
          "Notre langage, que seuls nous pouvons comprendre,",
          "Résonne en moi comme une douce mélodie.",
          "Et si le silence remplace parfois nos rires, ",
          "Je retrouve toujours dans tes yeux la note de nos premiers moments.",
          "Hier comme demain, rien ne changera.",
        ],
      },
      {
        title: "Destin tragique",
        date: "Crépuscule du soir",
        body: [
          "Te sens-tu réellement seul même accompagné ?",
          "Car jamais, je ne me suis sentie aussi accompagnée qu’à tes côtés.",
          "Je vois malgré tout, tes yeux chercher un ailleurs,",
          "Une preuve qu’aucun poème ne peut te donner.",
          "",
          "Prends les mots pour ce qu’ils sont :",
          "Même si certains sont cruels,",
          "Les nôtres sont toujours doux.",
          "Les doutes ne sont que des voleurs de jour.",
          "",
          "Notre présence l’un envers l’autre est notre force.",
          "Mais la réassurance est une drogue,",
          "Et nous tuerait un million de fois.",
          "Comme d’éternels insatisfaits,",
          "Nous finirions noyés, à défaut de confiance,",
          "Dans un océan rempli de noirceur.",
        ],
      },
      {
        title: "Même dans le noir",
        date: "Crépuscule du soir",
        body: [
          "Il ne voit que son obscurité,",
          "Je vois sa lumière.",
          "Terrifié à l’idée de me faire souffrir,",
          "Au point d’oublier sa propre valeur.",
          "",
          "Il aime et ne compte pas,",
          "Il prend soin des autres, et s’oublie.",
          "",
          "Il ne ressent plus que sa douleur,",
          "Et efface de sa mémoire sa bonté débordante,",
          "Sa joie de vivre,",
          "Sa douceur.",
          "",
          "Alors même dans l’obscurité,",
          "Je sais qu’il perçoit son étincelle.",
          "Elle est là, et je la vois,",
          "Puisque notre amour brille, même dans le noir.",
        ],
      },
      {
        title: "Emprisonné par l’esprit",
        date: "Crépuscule du soir",
        body: [
          "Un bijou d’une rareté infinie,",
          "Dont j’ai la chance d’avoir la présence à mes côtés.",
          "Me couvre d’amour encore et encore,",
          "Sans pour autant croire en l’amour.",
          "",
          "Avançant, yeux bandés, dans son labyrinthe imaginaire,",
          "Il appelle encore « raison », ce qui le dévore de l’intérieur.",
          "Il bâtit autour de lui, les murs d’une prison de doutes,",
          "Et bientôt, ils ne feront plus qu’un.",
          "",
          "Complaisance dans sa douleur,",
          "Confort dans sa souffrance,",
          "Son armure finira par lui peser et le faire s’écrouler.",
          "Et pourtant, son esprit n’attend que sa liberté.",
          "",
          "Son éclat, brûlant d’impatience dans ses mains,",
          "Est assez puissant pour admettre que la lumière est réelle :",
          "L’amour, est réel.",
        ],
      },
      {
        title: "New year's day",
        date: "",
        body: [
          "La même question, en boucle, qui t’obsède :",
          "« Que va-t-il se passer à présent ? »",
          "L’impression que tout a changé,",
          "Et qu’un « nous » ne sera bientôt plus.",
          "",
          "Au lieu de profiter de la fête,",
          "Tu restes là, avec tes incertitudes,",
          "À attendre le coup de grâce qui t’achèvera.",
        ],
      },
      {
        title: "New year's day",
        date: "",
        body: [
          "Mais quand minuit arrive,",
          "Tu es la seule personne que j’ai envie d’embrasser.",
          "Je cours dans tes bras,",
          "Et te chuchote à l’oreille :",
          "« Tu n’as plus besoin d’avoir peur,",
          "Car je t’ai choisi toi. »",
          "",
          "En cette nouvelle année,",
          "Dans ce nouveau souffle,",
          "Nous décidons de nous choisir nous.",
          "",
          "Je t’embrasse, mais tu es déjà apaisé.",
          "Le dernier coup a sonné, mais tu ne l’écoutais déjà plus.",
        ],
      },
      {
        title: "Éternel automne",
        date: "Crépuscule du matin",
        body: [
          "J’ai toujours aimé l’automne.",
          "J’apprécie voir mon monde se parer de tons orangés,",
          "Malgré la fraîcheur qui se glisse sous ma peau.",
          "",
          "Mais depuis que tu es là,",
          "Cette fraîcheur n’est plus que douceur.",
          "Comme une caresse sur mon visage,",
          "Comme un murmure qui m’est dédié,",
          "Ma saison préférée s’est attendrie.",
          "",
          "Cette douce lumière ambrée, cachée dans tes yeux,",
          "Ne veut plus s’effacer de mon esprit.",
          "Et alors, en me plongeant dans ton regard,",
          "Je retourne en octobre,",
          "Tout le temps,",
          "Là où tout a commencé.",
        ],
      },
      {
        title: "Lavender haze",
        date: "Crépuscule du matin",
        body: [
          "Tu ne m’as lancé qu’un seul regard,",
          "Et pourtant je me laisse déjà aller.",
          "En cet instant, plus aucune menace,",
          "Car chaque fois que tu poses ta main sur mon corps,",
          "Je me sens renaître.",
          "",
          "Toutes mes nuits, je les veux avec toi.",
          "Une douce lumière qui danse à travers les volets,",
          "Viendrait nous tirer momentanément de notre brume de lavande.",
          "",
          "Dans ce lit, mon esprit s’arrête.",
          "Le temps n’est plus un poids,",
          "Il ne devient qu’une plume.",
          "Perdue dans notre souffle,",
          "Mon être se donne tout entier,",
          "Uniquement pour toi.",
        ],
      },
      {
        title: "Si ce n’était plus toi",
        date: "Crépuscule du matin",
        body: [
          "Si ce n’est plus toi,",
          "À quoi bon chercher ?",
          "Si mes pas ne devaient plus suivre les tiens,",
          "Je resterai immobile.",
          "Chaque chemin pris me conduit à nous.",
          "",
          "Avec toi, il n’y a plus que la certitude de ta main dans la mienne.",
          "Mon cœur t’appartient,",
          "Et mon amour te sera toujours dédié.",
          "Si mon cœur ne battait plus pour toi,",
          "Il ne repartirait jamais pour quelqu’un d’autre.",
          "",
          "Si ce n’est pas pour toi,",
          "Que le temps s’arrête là,",
          "Plus jamais je n’attendrai l’automne.",
        ],
      },
    ],
    [],
  );

  const [poemIndex, setPoemIndex] = useState(0);

  const hasPoems = poems.length > 0;
  const currentPoem = hasPoems ? poems[poemIndex] : null;

  const prevPoem = () => {
    if (!hasPoems) return;
    setIsSliding("left");
    setTimeout(() => {
      setPoemIndex((i) => (i - 1 + poems.length) % poems.length);
      setIsSliding(null);
    }, 220);
  };

  const nextPoem = () => {
    if (!hasPoems) return;
    setIsSliding("right");
    setTimeout(() => {
      setPoemIndex((i) => (i + 1) % poems.length);
      setIsSliding(null);
    }, 220);
  };

  const goToPoem = (i: number) => {
    if (!hasPoems) return;
    setPoemIndex(Math.max(0, Math.min(poems.length - 1, i)));
  };

  const photos: Photo[] = useMemo(
    () =>
      Object.values(images).map((src, index) => ({
        id: String(index + 1),
        src: src as string,
        alt: `Photo ${index + 1}`,
      })),
    [images],
  );

  const photosToi: Photo[] = useMemo(
    () =>
      Object.values(imagesToi).map((src, index) => ({
        id: String(index + 1),
        src: src as string,
        alt: `Photo ${index + 1}`,
      })),
    [imagesToi],
  );

  const photosChaos: Photo[] = useMemo(
    () =>
      Object.values(imagesChaos).map((src, index) => ({
        id: String(index + 1),
        src: src as string,
        alt: `Photo ${index + 1}`,
      })),
    [imagesChaos],
  );

  const photosRandom: Photo[] = useMemo(
    () =>
      Object.values(imagesRandom).map((src, index) => ({
        id: String(index + 1),
        src: src as string,
        alt: `Photo ${index + 1}`,
      })),
    [imagesRandom],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") setGiftOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const el = playerAnchorRef.current;
    if (!el) {
      setShowMiniPlayer(false);
      return;
    }
    setShowMiniPlayer(false);

    const obs = new IntersectionObserver(
      ([entry]) => {
        setShowMiniPlayer(!entry.isIntersecting);
      },
      {
        threshold: 0.15,
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [isHome]);

  const audioFiles = import.meta.glob("/public/music/*.{mp3,m4a,ogg,wav}", { eager: true, as: "url" });

  const tracks: Track[] = useMemo(() => {
    return Object.entries(audioFiles)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, url], i) => ({
        id: String(i + 1),
        src: url as string,
        title: niceTitleFromPath(path),
        subtitle: "En train de jouer ...",
      }));
  }, [audioFiles]);

  return (
    <MusicPlayerProvider tracks={tracks} initialPaused={true} initialVolume={0.7}>
      <AutoPlayOnGift active={giftOpen} />
      <SongSidebar />
      <Routes>
        <Route
          path="/"
          element={
            <main className="page">
              {shouldShowMini && (
                <div className="miniPlayer" role="region" aria-label="Music player">
                  <MusicWidget compact />
                </div>
              )}

              {!giftOpen && (
                <div
                  className="giftOverlay"
                  role="button"
                  tabIndex={0}
                  aria-label="Open the gift"
                  onClick={() => setGiftOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setGiftOpen(true);
                  }}
                >
                  <div className="giftCard">
                    <div className="giftIcon" aria-hidden="true">
                      🎁
                    </div>
                    <h2 className="giftTitle">Pour toi</h2>
                    <p className="giftHint">Clique pour ouvrir</p>
                  </div>
                </div>
              )}

              <motion.header className="heroWide" variants={reveal} initial="hidden" animate={heroControls}>
                <div className="heroBg" />

                <div className="heroInner">
                  <div className="heroContent">
                    <p className="kicker">💗 Pour mon poussin d'amour</p>
                    <h1 className="title">Notre Amour</h1>
                    <p className="subtitle">Nina /ˈniːna/ nom</p>
                    <p className="subtitle">Synonymes: poussin, chouchou, swiftie, choupi, Ninette, ma femme, mon amour, ma vie.</p>

                    <div className="heroActions">
                      <img className="smallImage" id="walkImage" src="/ninette/Main/15dec4fa-959b-47e9-b30d-a18ac3d63a2c.png" alt="poussin" />

                      <div ref={playerAnchorRef} className="musicWidgetPosition" style={{ height: 1 }} />
                      <MusicWidget />
                    </div>
                  </div>

                  <div
                    className={`heroImage ${burst ? "burst" : ""}`}
                    onClick={() => {
                      setBurst(true);
                      setTimeout(() => setBurst(false), 900);
                    }}
                  >
                    <img className="image" src="/ninette/Main/collage_1764760698331.jpg" alt="Je t'aime" />
                  </div>
                </div>
              </motion.header>

              <motion.div className="btnSpecial" variants={galleryBtnReveal} initial="hidden" animate={giftOpen ? "show" : "hidden"}>
                <Link to="/gallery" className="galleryButton galleryButtonTop">
                  <span className="galleryBtnText">Voir toute la galerie</span>
                  <motion.span className="galleryBtnArrow" initial={{ x: 0 }} whileHover={{ x: 6 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    →
                  </motion.span>
                </Link>
              </motion.div>

              <section className="content">
                <motion.section className="carouselSection" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
                  {/* carousel */}
                  <div className="carouselHeader">
                    <h2>Nos souvenirs 💗</h2>
                    <p>Des photos ensemble, en date ou en voyage 🐥</p>
                  </div>

                  <div className="carouselFull">
                    <PhotoCarousel photos={photos} />
                  </div>

                  <div className="carouselAction"></div>
                </motion.section>

                <motion.section className="carouselSection" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
                  {/* carousel */}
                  <div className="carouselHeader">
                    <h2>Toi 💗</h2>
                    <p>Parce que t'es trop belle poussin (tu le sais)</p>
                  </div>

                  <div className="carouselFull">
                    <PhotoCarousel photos={photosToi} />
                  </div>

                  <div className="carouselAction"></div>
                </motion.section>

                <motion.section className="carouselSection" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
                  {/* carousel */}
                  <div className="carouselHeader">
                    <h2>Le Chaos 💗</h2>
                    <p>Les meilleures photos de toi sont ici 💕</p>
                  </div>

                  <div className="carouselFull">
                    <PhotoCarousel photos={photosChaos} />
                  </div>

                  <div className="carouselAction"></div>
                </motion.section>

                <motion.section className="carouselSection" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
                  {/* carousel */}
                  <div className="carouselHeader">
                    <h2>Babillard 💗</h2>
                    <p>POUSSIN 🐥🐥🐥</p>
                  </div>

                  <div className="carouselFull">
                    <PhotoCarousel photos={photosRandom} />
                  </div>

                  <div className="carouselAction">
                    <motion.div className="btnSpecial" variants={galleryBtnReveal} initial="hidden" animate={giftOpen ? "show" : "hidden"}>
                      <Link to="/gallery" className="galleryButton galleryButtonTop">
                        <span className="galleryBtnText">Voir toute la galerie</span>
                        <motion.span className="galleryBtnArrow" initial={{ x: 0 }} whileHover={{ x: 6 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.section>

                <motion.section className="section" id="poems" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                  <div className="sectionHead">
                    <h2>Tes Poèmes 💘</h2>
                    <p>Par la meilleure femme au monde, depuis son recueil comme mon cadeau de Noël, le meilleur qu'on m'ait jamais fait 💕💗</p>
                  </div>

                  <div className="carousel">
                    <button className="carouselBtn" aria-label="Previous poem" onClick={prevPoem} disabled={!hasPoems || poems.length === 1}>
                      ‹
                    </button>

                    <div className="carouselViewport">
                      {!currentPoem ? (
                        <article className={`poemCard ${isSliding === "left" ? "slideLeft" : ""} ${isSliding === "right" ? "slideRight" : ""}`}>
                          <h3 className="poemTitle">Aucun poème pour le moment</h3>
                          <p className="poemMeta">—</p>
                          <div className="poemBody">
                            <p>Ajoute tes poèmes dans le tableau “poems” dans App.tsx 💗</p>
                          </div>
                        </article>
                      ) : (
                        <article className={`poemCard ${isSliding === "left" ? "slideLeft" : ""} ${isSliding === "right" ? "slideRight" : ""}`} key={`${currentPoem.title}-${poemIndex}`}>
                          <h3 className="poemTitle">{currentPoem.title}</h3>
                          <p className="poemMeta">{currentPoem.date}</p>
                          <div className="poemBody">
                            {currentPoem.body.map((line, idx) => (
                              <p key={idx}>{line}</p>
                            ))}
                          </div>
                        </article>
                      )}
                    </div>

                    <button className="carouselBtn" aria-label="Next poem" onClick={nextPoem} disabled={!hasPoems || poems.length === 1}>
                      ›
                    </button>

                    <div className="dots" aria-label="Poem navigation">
                      {poems.map((_, i) => (
                        <button key={i} className={`dot ${i === poemIndex ? "isActive" : ""}`} aria-label={`Poem ${i + 1}`} onClick={() => goToPoem(i)} />
                      ))}
                    </div>
                  </div>
                </motion.section>
              </section>

              <footer className="footer">
                <p>Je t'aime 💗💗💗</p>
              </footer>
            </main>
          }
        />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </MusicPlayerProvider>
  );
}

export default App;

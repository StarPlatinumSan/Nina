import { useMemo, useState } from "react";
import { useMusicPlayer } from "../player/MusicPlayerContext";
import "./SongSidebar.scss";

export default function SongSidebar() {
  const { tracks, index, setIndex, play, isPlaying } = useMusicPlayer();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tracks;
    return tracks.filter((t) => (t.title ?? "").toLowerCase().includes(s));
  }, [tracks, q]);

  const onPick = (i: number) => {
    setIndex(i);
    play();
    setOpen(false);
  };

  return (
    <>
      <button className="songMenuBtn" type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen((p) => !p)}>
        ☰
      </button>

      {open && <div className="songMenuBackdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside className={`songMenu ${open ? "isOpen" : ""}`} aria-label="Songs">
        <div className="songMenuHead">
          <div>
            <h3 className="songMenuTitle">Songs</h3>
            <p className="songMenuSub">{isPlaying ? "Catalogue des musiques" : "Paused"}</p>
          </div>

          <button className="songMenuClose" type="button" onClick={() => setOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="songMenuSearch">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher une musique…" aria-label="Search songs" />
        </div>

        <div className="songMenuList" role="list">
          {filtered.map((t) => {
            const i = tracks.indexOf(t);
            const active = i === index;
            return (
              <button key={t.id} type="button" className={`songItem ${active ? "isActive" : ""}`} onClick={() => onPick(i)} role="listitem">
                <span className="songDot" aria-hidden="true">
                  {active ? "▶" : "♪"}
                </span>
                <span className="songText">
                  <span className="songName">{t.title}</span>
                  <span className="songMeta">Clique pour jouer</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

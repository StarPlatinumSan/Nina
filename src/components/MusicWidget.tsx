import { useMemo } from "react";
import { useMusicPlayer } from "../player/MusicPlayerContext";
import "./MusicWidget.scss";

type Props = {
  compact?: boolean;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MusicWidget({ compact }: Props) {
  const { track, isPlaying, toggle, volume, setVolume01, current, duration, seekPct, next, prev } = useMusicPlayer();

  const progressPct = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, (current / duration) * 100);
  }, [current, duration]);

  const title = track?.title ?? "No track";
  const subtitle = track?.subtitle ?? "";

  return (
    <div className={`musicWidget ${compact ? "isCompact" : ""}`} aria-label="Music player">
      <button className="musicBtn" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
        <span className="musicBtnIcon" aria-hidden="true">
          {isPlaying ? "⏸" : "▶"}
        </span>
      </button>

      <div className="musicInfo">
        <div className="musicTop">
          <div className="musicText">
            <p className="musicTitle">{title}</p>
            {!compact && subtitle ? <p className="musicSubtitle">{subtitle}</p> : null}
          </div>

          {!compact && (
            <p className="musicTime" aria-label="Time">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          )}
        </div>

        {!compact && (
          <div className="musicBottom">
            <div className="seekWrap" aria-label="Seek">
              <div className="seekTrack" aria-hidden="true">
                <div className="seekFill" style={{ width: `${progressPct}%` }} />
              </div>
              <input
                className="seek"
                type="range"
                min={0}
                max={1000}
                value={duration ? Math.round((current / duration) * 1000) : 0}
                onChange={(e) => seekPct(clamp01(Number(e.target.value) / 1000))}
                aria-label="Seek slider"
              />
            </div>

            <div className="volWrap" aria-label="Volume">
              <span className="volIcon" aria-hidden="true">
                {volume === 0 ? "🔇" : volume < 0.5 ? "🔈" : "🔊"}
              </span>
              <input className="vol" type="range" min={0} max={100} value={Math.round(volume * 100)} onChange={(e) => setVolume01(Number(e.target.value) / 100)} aria-label="Volume slider" />
            </div>

            <div className="musicNav" aria-label="Track navigation">
              <button className="navBtn" onClick={prev} aria-label="Previous track">
                ‹
              </button>
              <button className="navBtn" onClick={next} aria-label="Next track">
                ›
              </button>
            </div>
          </div>
        )}

        {compact && (
          <div className="musicCompactRow">
            <button className="navBtn" onClick={prev} aria-label="Previous track">
              ‹
            </button>
            <button className="navBtn" onClick={next} aria-label="Next track">
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

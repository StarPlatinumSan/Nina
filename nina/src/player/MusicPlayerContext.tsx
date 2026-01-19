import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type Track = {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
};

type Ctx = {
  tracks: Track[];
  index: number;
  track: Track | null;

  isPlaying: boolean;
  volume: number; // 0..1
  current: number; // seconds
  duration: number; // seconds

  toggle: () => void;
  play: () => void;
  pause: () => void;

  seekPct: (pct01: number) => void;
  setVolume01: (v01: number) => void;

  next: () => void;
  prev: () => void;
  setIndex: (i: number) => void;
};

const MusicPlayerContext = createContext<Ctx | null>(null);

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function MusicPlayerProvider({
  tracks,
  initialIndex = 0,
  initialPaused = true,
  initialVolume = 0.7,
  children,
}: {
  tracks: Track[];
  initialIndex?: number;
  initialPaused?: boolean;
  initialVolume?: number;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [index, setIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(!initialPaused);
  const [volume, setVolume] = useState(clamp01(initialVolume));
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks.length ? tracks[Math.min(index, tracks.length - 1)] : null;

  // Create audio once
  if (!audioRef.current) audioRef.current = new Audio();

  // Apply track changes
  useEffect(() => {
    const a = audioRef.current!;
    if (!track) return;

    const wasPlaying = isPlaying;

    a.src = track.src;
    a.load();
    a.volume = volume;

    // If we were playing, keep playing on track switch
    if (wasPlaying) {
      a.play().catch(() => setIsPlaying(false));
    } else {
      a.pause();
    }

    setCurrent(0);
    // duration will be updated by metadata event
  }, [track?.src]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume
  useEffect(() => {
    const a = audioRef.current!;
    a.volume = volume;
  }, [volume]);

  // Play / pause
  useEffect(() => {
    const a = audioRef.current!;
    if (!track) return;

    if (isPlaying) {
      a.play().catch(() => setIsPlaying(false));
    } else {
      a.pause();
    }
  }, [isPlaying, track]);

  // Time + metadata + ended
  useEffect(() => {
    const a = audioRef.current!;
    const onTime = () => setCurrent(a.currentTime || 0);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => {
      // auto next
      setIsPlaying(true);
      setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0));
    };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [tracks.length]);

  const api = useMemo<Ctx>(
    () => ({
      tracks,
      index,
      track,

      isPlaying,
      volume,
      current,
      duration,

      toggle: () => setIsPlaying((p) => !p),
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),

      seekPct: (pct01: number) => {
        const a = audioRef.current!;
        if (!duration || !Number.isFinite(duration)) return;
        const t = clamp01(pct01) * duration;
        a.currentTime = t;
        setCurrent(t);
      },

      setVolume01: (v01: number) => {
        const vv = clamp01(v01);
        setVolume(vv);
        audioRef.current!.volume = vv;
      },

      next: () => setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0)),
      prev: () => setIndex((i) => (tracks.length ? (i - 1 + tracks.length) % tracks.length : 0)),
      setIndex: (i: number) => setIndex(Math.max(0, Math.min(i, tracks.length - 1))),
    }),
    [tracks, index, track, isPlaying, volume, current, duration],
  );

  return <MusicPlayerContext.Provider value={api}>{children}</MusicPlayerContext.Provider>;
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
}

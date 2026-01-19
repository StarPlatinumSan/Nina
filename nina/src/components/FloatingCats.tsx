import "./FloatingCats.scss";

type Cat = {
  id: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  rot: number;
  emoji: string;
};

const CATS: Cat[] = [
  { id: "c1", x: "6%", y: "10%", size: 26, delay: 0.2, duration: 7.5, rot: -8, emoji: "🐱" },
  { id: "c2", x: "88%", y: "14%", size: 28, delay: 1.1, duration: 8.4, rot: 10, emoji: "😺" },
  { id: "c3", x: "12%", y: "62%", size: 24, delay: 0.7, duration: 9.2, rot: 6, emoji: "😽" },
  { id: "c4", x: "92%", y: "70%", size: 24, delay: 0.4, duration: 7.9, rot: -12, emoji: "😸" },
  { id: "c5", x: "45%", y: "6%", size: 22, delay: 1.6, duration: 10.5, rot: 4, emoji: "🐾" },
  { id: "c6", x: "52%", y: "86%", size: 22, delay: 0.9, duration: 9.8, rot: -6, emoji: "🐾" },
];

export default function FloatingCats() {
  return (
    <div className="floatingCats" aria-hidden="true">
      {CATS.map((c) => (
        <span
          key={c.id}
          className="cat"
          style={
            {
              left: c.x,
              top: c.y,
              fontSize: `${c.size}px`,
              ["--delay" as any]: `${c.delay}s`,
              ["--dur" as any]: `${c.duration}s`,
              ["--rot" as any]: `${c.rot}deg`,
            } as React.CSSProperties
          }
        >
          {c.emoji}
        </span>
      ))}
    </div>
  );
}

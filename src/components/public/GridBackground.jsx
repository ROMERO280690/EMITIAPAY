export default function GridBackground({ tone = "light", className = "" }) {
  const color = tone === "dark" ? "rgba(255,255,255,0.06)" : "rgba(12,45,107,0.05)";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: "46px 46px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, #000 40%, transparent 100%)",
      }}
    />
  );
}
import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";

/**
 * MeshBackground — rejilla 3D sutil + blobs de gradiente animados.
 * Pensado como fondo absoluto detrás de secciones.
 */
export function MeshBackground({ className = "", blobColor1 = "rgba(59,130,246,0.22)", blobColor2 = "rgba(16,185,129,0.16)", gridColor = "rgba(12,45,107,0.5)" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />
      <motion.div
        className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${blobColor1}, transparent 70%)` }}
        animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${blobColor2}, transparent 70%)` }}
        animate={{ x: [0, -60, 0], y: [0, 45, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/**
 * TiltCard — tarjeta con inclinación 3D al mover el mouse + sombra larga.
 */
export function TiltCard({ children, className = "", intensity = 9, glare = true }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 160, damping: 18 });
  const glareBg = useTransform(
    [mx, my],
    ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.18), transparent 45%)`
  );

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

/**
 * Float3D — envoltorio que flota suavemente (para mockups en perspectiva).
 */
export function Float3D({ children, className = "", rotate = "-8deg", distance = 14 }) {
  return (
    <motion.div
      className={className}
      style={{ transform: `perspective(1200px) rotateY(${rotate}) rotateX(6deg)` }}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedCounter — cuenta ascendente al entrar en viewport.
 */
export function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1500;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const formatted = display.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} className={className}>{prefix}{formatted}{suffix}</span>;
}

/**
 * Marquee — tira horizontal infinita (para provincias / logos).
 */
export function Marquee({ items, className = "", speed = 32 }) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-2 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((it, i) => (
          <span key={i} className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
            {it}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
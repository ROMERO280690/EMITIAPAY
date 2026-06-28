import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

/**
 * HeroSlider — slider de banners reutilizable para páginas públicas.
 *
 * Props:
 *   slides: Array<{
 *     badge?:       string          — texto del chip superior
 *     title:        string | ReactNode
 *     subtitle?:    string
 *     description?: string
 *     cta?:         { label: string; href: string }
 *     ctaSecondary?: { label: string; href: string }
 *     bg?:          string          — clase Tailwind o CSS inline para el fondo
 *     bgStyle?:     object          — style={{ }} para el fondo
 *     textColor?:   string          — clase para el texto principal (default: text-white)
 *     image?:       ReactNode       — contenido derecho opcional (card, svg, img...)
 *   }>
 *   autoplay?:      number          — ms entre slides (0 = off). Default 5000
 *   minHeight?:     string          — Tailwind min-h-* (default "min-h-[420px]")
 */
export default function HeroSlider({ slides = [], autoplay = 5000, minHeight = "min-h-[420px]" }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % len), [len]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + len) % len), [len]);

  useEffect(() => {
    if (!autoplay || paused || len <= 1) return;
    const t = setInterval(next, autoplay);
    return () => clearInterval(t);
  }, [autoplay, paused, next, len]);

  if (!len) return null;

  const slide = slides[current];

  return (
    <div
      className={`relative overflow-hidden ${minHeight} flex flex-col`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${slide.bg || ""}`}
        style={slide.bgStyle || {}}
      />

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45 }}
          className="relative flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 py-16 flex items-center"
        >
          <div className={`grid grid-cols-1 ${slide.image ? "lg:grid-cols-2" : ""} gap-10 items-center w-full`}>
            {/* Text */}
            <div>
              {slide.badge && (
                <span className="inline-block bg-white/15 border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                  {slide.badge}
                </span>
              )}
              <h1 className={`text-4xl sm:text-5xl font-extrabold leading-tight mb-4 ${slide.textColor || "text-white"}`}>
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg font-semibold text-white/80 mb-3">{slide.subtitle}</p>
              )}
              {slide.description && (
                <p className="text-base text-white/70 leading-relaxed mb-8 max-w-xl">{slide.description}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {slide.cta && (
                  <Link
                    to={slide.cta.href}
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-7 py-3.5 rounded-2xl hover:bg-sky-50 transition-all shadow-lg group"
                  >
                    {slide.cta.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {slide.ctaSecondary && (
                  <Link
                    to={slide.ctaSecondary.href}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/35 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-2xl transition-all"
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>

            {/* Right image/card */}
            {slide.image && (
              <div className="hidden lg:flex justify-center items-center">
                {slide.image}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls — only show when multiple slides */}
      {len > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>

          {/* Progress bar */}
          {autoplay > 0 && !paused && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full z-10">
              <motion.div
                key={current}
                className="h-full bg-white/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: autoplay / 1000, ease: "linear" }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
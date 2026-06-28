import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function SolDeMayo({ size = 28, dark = false }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {rays.map((_, i) => {
        const angle = (i * 360) / 16;
        const isStraight = i % 2 === 0;
        const r1 = isStraight ? 13 : 12;
        const r2 = isStraight ? 19 : 17;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + r1 * Math.cos(rad);
        const y1 = 20 + r1 * Math.sin(rad);
        const x2 = 20 + r2 * Math.cos(rad);
        const y2 = 20 + r2 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={dark ? "#F59E0B" : "#FCD34D"} strokeWidth={isStraight ? 1.8 : 1} strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="8" fill={dark ? "#FCD34D" : "#FDE68A"} stroke="#F59E0B" strokeWidth="1" />
      <circle cx="20" cy="20" r="5" fill="#FBBF24" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Inicio", href: "/inicio" },
  { label: "Servicios", href: "/servicios" },
  { label: "Cuentas", href: "/servicio/cuentas" },
  { label: "Inversiones", href: "/servicio/inversiones" },
  { label: "Financiamiento", href: "/servicio/financiamiento" },
  { label: "Precios", href: "/precios" },
];

export default function PublicNav({ transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const solid = !transparent || scrolled || menuOpen;

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid
      ? "bg-white/97 backdrop-blur-md shadow-sm border-b border-sky-100"
      : "bg-transparent"}`}>

      {/* Franjita de la bandera al tope — solo en solid */}
      {solid && (
        <div className="flex h-0.5">
          <div className="flex-1 bg-sky-400" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-sky-400" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between py-3">
        <Link to="/inicio" className="flex items-center gap-2">
          <SolDeMayo size={30} dark={solid} />
          <span className={`text-lg font-extrabold tracking-tight transition-colors ${solid ? "text-blue-900" : "text-white"}`}>
            EMITIA PAY
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link key={l.href} to={l.href}
                className={`text-sm font-medium transition-colors px-1 py-0.5 border-b-2 ${active
                  ? (solid ? "text-sky-600 border-sky-500" : "text-amber-300 border-amber-300")
                  : (solid ? "text-gray-600 hover:text-sky-700 border-transparent" : "text-white/80 hover:text-white border-transparent")}`}>
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${solid ? "text-blue-900 hover:bg-sky-50" : "text-white/90 hover:text-white"}`}>
            Ingresar
          </Link>
          <Link to="/register"
            className={`text-sm font-bold px-5 py-2 rounded-xl transition-all ${solid
              ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
              : "bg-amber-400 hover:bg-amber-300 text-blue-900"}`}>
            Empezar gratis
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${solid ? "text-blue-900 hover:bg-sky-50" : "text-white hover:bg-white/15"}`}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-sky-100 px-4 py-4 space-y-1 shadow-xl">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === l.href ? "bg-sky-50 text-sky-700" : "text-gray-700 hover:bg-gray-50"}`}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-sky-100 mt-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 text-sm font-semibold border-2 border-sky-200 text-sky-700 rounded-xl hover:bg-sky-50">Ingresar</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="w-full text-center py-3 text-sm font-bold bg-blue-700 text-white rounded-xl hover:bg-blue-800">Empezar gratis</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
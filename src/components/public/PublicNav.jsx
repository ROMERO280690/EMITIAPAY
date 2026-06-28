import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Menu, X } from "lucide-react";

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const solid = !transparent || scrolled || menuOpen;

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/inicio" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className={`text-lg font-bold ${solid ? "text-gray-900" : "text-white"}`}>EMITIA PAY</span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link key={l.href} to={l.href}
                className={`text-sm font-medium transition-colors ${active ? "text-indigo-600" : solid ? "text-gray-600 hover:text-indigo-600" : "text-white/80 hover:text-white"}`}>
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className={`text-sm font-medium px-3 py-2 transition-colors ${solid ? "text-gray-700 hover:text-indigo-600" : "text-white/80 hover:text-white"}`}>
            Ingresar
          </Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Empezar gratis
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 rounded-lg ${solid ? "hover:bg-gray-100 text-gray-700" : "text-white hover:bg-white/10"}`}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-sm font-medium ${location.pathname === l.href ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"}`}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
            <Link to="/login" className="w-full text-center py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Ingresar</Link>
            <Link to="/register" className="w-full text-center py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Empezar gratis</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
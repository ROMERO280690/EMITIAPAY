import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Wallet, Send, Download, FileCheck, TrendingUp, Building2, LayoutGrid, BadgePercent, Zap, Globe2, ShieldCheck, PhoneCall } from "lucide-react";

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

const SERVICIOS = [
  { label: "Cuentas PyME", desc: "ARS y USD sin costos ocultos", href: "/servicio/cuentas", icon: Wallet, color: "bg-blue-50 text-blue-600" },
  { label: "Pagos", desc: "Pagá proveedores y sueldos", href: "/servicio/pagos", icon: Send, color: "bg-indigo-50 text-indigo-600" },
  { label: "Cobros", desc: "Cobrá a tus clientes online", href: "/servicio/cobros", icon: Download, color: "bg-violet-50 text-violet-600" },
  { label: "eCheqs", desc: "Emití y depositá electrónicamente", href: "/servicio/echeqs", icon: FileCheck, color: "bg-cyan-50 text-cyan-600" },
  { label: "Inversiones", desc: "Plazo fijo desde 38.64% TNA", href: "/servicio/inversiones", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
  { label: "Financiamiento", desc: "Créditos y leasing para PyMEs", href: "/servicio/financiamiento", icon: Building2, color: "bg-rose-50 text-rose-600" },
];

const EMPRESA = [
  { label: "Plataforma completa", desc: "Todo lo que incluye EMITIA PAY", href: "/servicios", icon: LayoutGrid, color: "bg-slate-50 text-slate-600" },
  { label: "Precios", desc: "Planes para cada empresa", href: "/precios", icon: BadgePercent, color: "bg-amber-50 text-amber-600" },
  { label: "Por qué elegirnos", desc: "Rápido, seguro y argentino", href: "/servicios", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" },
  { label: "Contacto enterprise", desc: "Soluciones a medida", href: "/register", icon: PhoneCall, color: "bg-blue-50 text-blue-600" },
];

function DropdownMenu({ items, visible }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] transition-all duration-200 origin-top
      ${visible ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100 shadow-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden p-3">
        <div className="grid grid-cols-2 gap-1.5">
          {items.map((item) => (
            <Link key={item.href} to={item.href}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, href, children, solid }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = href ? location.pathname === href : false;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!children) {
    return (
      <Link to={href}
        className={`text-sm font-medium transition-colors px-1 py-0.5 border-b-2 ${isActive
          ? (solid ? "text-sky-600 border-sky-500" : "text-amber-300 border-amber-300")
          : (solid ? "text-gray-600 hover:text-sky-700 border-transparent" : "text-white/80 hover:text-white border-transparent")}`}>
        {label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm font-medium transition-colors px-1 py-0.5 border-b-2 ${open
          ? (solid ? "text-sky-600 border-sky-500" : "text-amber-300 border-amber-300")
          : (solid ? "text-gray-600 hover:text-sky-700 border-transparent" : "text-white/80 hover:text-white border-transparent")}`}>
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <DropdownMenu items={children} visible={open} />
    </div>
  );
}

export default function PublicNav({ transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  // Close on route change
  useEffect(() => { setMenuOpen(false); setMobileExpanded(null); }, [location.pathname]);

  const solid = !transparent || scrolled || menuOpen;

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid
      ? "bg-white/97 backdrop-blur-md shadow-sm border-b border-sky-100"
      : "bg-transparent"}`}>

      {solid && (
        <div className="flex h-0.5">
          <div className="flex-1 bg-sky-400" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-sky-400" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/inicio" className="flex items-center gap-2 flex-shrink-0">
          <SolDeMayo size={30} dark={solid} />
          <span className={`text-lg font-extrabold tracking-tight transition-colors ${solid ? "text-blue-900" : "text-white"}`}>
            EMITIA <span className={solid ? "text-sky-500" : "text-amber-300"}>PAY</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavItem label="Inicio" href="/inicio" solid={solid} />
          <NavItem label="Servicios" solid={solid}>{SERVICIOS}</NavItem>
          <NavItem label="Empresa" solid={solid}>{EMPRESA}</NavItem>
          <NavItem label="Precios" href="/precios" solid={solid} />
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${solid ? "text-blue-900 hover:bg-sky-50" : "text-white/90 hover:text-white"}`}>
            Ingresar
          </Link>
          <Link to="/register"
            className={`flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-xl transition-all ${solid
              ? "bg-blue-700 hover:bg-blue-800 text-white shadow-sm"
              : "bg-amber-400 hover:bg-amber-300 text-blue-900"}`}>
            <Zap className="w-3.5 h-3.5" />
            Empezar gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${solid ? "text-blue-900 hover:bg-sky-50" : "text-white hover:bg-white/15"}`}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-sky-100 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">

            {/* Inicio */}
            <Link to="/inicio" onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/inicio" ? "bg-sky-50 text-sky-700" : "text-gray-700 hover:bg-gray-50"}`}>
              <Globe2 className="w-4 h-4 text-gray-400" /> Inicio
            </Link>

            {/* Servicios accordion */}
            <div>
              <button onClick={() => setMobileExpanded(mobileExpanded === "servicios" ? null : "servicios")}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3"><LayoutGrid className="w-4 h-4 text-gray-400" /> Servicios</div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpanded === "servicios" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "servicios" && (
                <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-sky-100 pl-3">
                  {SERVICIOS.map(item => (
                    <Link key={item.href} to={item.href} onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-sky-700 transition-colors">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Empresa accordion */}
            <div>
              <button onClick={() => setMobileExpanded(mobileExpanded === "empresa" ? null : "empresa")}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3"><Building2 className="w-4 h-4 text-gray-400" /> Empresa</div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpanded === "empresa" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "empresa" && (
                <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-sky-100 pl-3">
                  {EMPRESA.map(item => (
                    <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-sky-700 transition-colors">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Precios */}
            <Link to="/precios" onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/precios" ? "bg-sky-50 text-sky-700" : "text-gray-700 hover:bg-gray-50"}`}>
              <BadgePercent className="w-4 h-4 text-gray-400" /> Precios
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="px-4 pb-5 pt-2 flex flex-col gap-2 border-t border-sky-100 mt-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-semibold border-2 border-sky-200 text-sky-700 rounded-xl hover:bg-sky-50">
              Ingresar
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-bold bg-blue-700 text-white rounded-xl hover:bg-blue-800 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
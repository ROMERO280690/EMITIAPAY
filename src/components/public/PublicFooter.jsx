import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

function SolDeMayo({ size = 32 }) {
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
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FCD34D" strokeWidth={isStraight ? 2 : 1.2} strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="8" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="20" cy="20" r="5" fill="#FBBF24" />
    </svg>
  );
}

export default function PublicFooter() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #0C2D6B 0%, #0A2157 100%)" }} className="text-sky-300">
      {/* Franja bandera */}
      <div className="flex flex-col">
        <div className="h-1.5 bg-sky-400 w-full" />
        <div className="h-1.5 bg-white w-full" />
        <div className="h-1.5 bg-sky-400 w-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <SolDeMayo size={32} />
              <span className="font-extrabold text-white text-lg tracking-tight">EMITIA PAY</span>
            </div>
            <p className="text-sky-300 text-sm leading-relaxed mb-4">
              La plataforma financiera construida para PyMEs argentinas. Sin burocracia, sin horarios bancarios.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-sky-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Buenos Aires, Argentina 🇦🇷</span>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Servicios</p>
            <div className="space-y-2.5 text-sm">
              <Link to="/servicio/cuentas" className="block hover:text-white transition-colors">Cuentas multi-moneda</Link>
              <Link to="/servicio/pagos" className="block hover:text-white transition-colors">Pagos inteligentes</Link>
              <Link to="/servicio/cobros" className="block hover:text-white transition-colors">Cobros automáticos</Link>
              <Link to="/servicio/echeqs" className="block hover:text-white transition-colors">eCheqs digitales</Link>
              <Link to="/servicio/inversiones" className="block hover:text-white transition-colors">Inversiones</Link>
              <Link to="/servicio/financiamiento" className="block hover:text-white transition-colors">Financiamiento PyME</Link>
            </div>
          </div>

          {/* Empresa */}
          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Empresa</p>
            <div className="space-y-2.5 text-sm">
              <Link to="/inicio" className="block hover:text-white transition-colors">Inicio</Link>
              <Link to="/servicios" className="block hover:text-white transition-colors">Todos los servicios</Link>
              <Link to="/precios" className="block hover:text-white transition-colors">Precios</Link>
            </div>
          </div>

          {/* Acceso */}
          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Acceso</p>
            <div className="space-y-2.5 text-sm">
              <Link to="/login" className="block hover:text-white transition-colors">Iniciar sesión</Link>
              <Link to="/register" className="block hover:text-white transition-colors">Crear cuenta gratis</Link>
            </div>
            <div className="mt-6 bg-white/10 border border-white/15 rounded-2xl p-4 text-xs text-sky-200 leading-relaxed">
              <span className="text-amber-300 font-bold">30 días gratis</span> del plan PyME.<br />
              Sin tarjeta de crédito.
            </div>
          </div>
        </div>

        {/* Cordillera mini decorativa */}
        <div className="opacity-20 mb-6">
          <svg viewBox="0 0 400 30" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 30 L40 10 L80 20 L120 5 L160 15 L200 2 L240 12 L280 8 L320 14 L360 6 L400 10 L400 30 Z"
              fill="white" />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-400/70 border-t border-white/10 pt-6">
          <p>© {new Date().getFullYear()} EMITIA PAY. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Construido con orgullo en Argentina 🇦🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
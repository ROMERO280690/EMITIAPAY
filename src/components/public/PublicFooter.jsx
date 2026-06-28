import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">EMITIA PAY</span>
            </div>
            <p className="text-sm leading-relaxed">La plataforma financiera diseñada para PyMEs argentinas.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-sm">Servicios</p>
            <div className="space-y-2 text-sm">
              <Link to="/servicio/cuentas" className="block hover:text-white transition-colors">Cuentas multi-moneda</Link>
              <Link to="/servicio/pagos" className="block hover:text-white transition-colors">Pagos inteligentes</Link>
              <Link to="/servicio/cobros" className="block hover:text-white transition-colors">Cobros automáticos</Link>
              <Link to="/servicio/echeqs" className="block hover:text-white transition-colors">eCheqs digitales</Link>
              <Link to="/servicio/inversiones" className="block hover:text-white transition-colors">Inversiones</Link>
              <Link to="/servicio/financiamiento" className="block hover:text-white transition-colors">Financiamiento PyME</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-sm">Empresa</p>
            <div className="space-y-2 text-sm">
              <Link to="/inicio" className="block hover:text-white transition-colors">Inicio</Link>
              <Link to="/servicios" className="block hover:text-white transition-colors">Todos los servicios</Link>
              <Link to="/precios" className="block hover:text-white transition-colors">Precios</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-3 text-sm">Acceso</p>
            <div className="space-y-2 text-sm">
              <Link to="/login" className="block hover:text-white transition-colors">Iniciar sesión</Link>
              <Link to="/register" className="block hover:text-white transition-colors">Crear cuenta gratis</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs text-center">
          © {new Date().getFullYear()} EMITIA PAY. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
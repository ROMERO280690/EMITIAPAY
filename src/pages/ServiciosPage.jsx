import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Globe2, Zap, Users, Receipt, Landmark, PiggyBank, ArrowRight, CheckCircle2, BarChart3, Calendar, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  {
    id: "cuentas",
    icon: Globe2,
    color: "indigo",
    title: "Cuentas Multi-moneda",
    subtitle: "Operá en ARS y USD sin fricciones",
    desc: "Abrí cuentas en pesos y dólares sin costo de apertura. Gestioná tu liquidez en ambas monedas, realizá transferencias instantáneas y recibí pagos de clientes locales e internacionales.",
    features: ["Cuenta en pesos (ARS) sin costo", "Cuenta en dólares (USD)", "CBU y alias personalizados", "Transferencias 24/7", "Saldo remunerado automático"],
    path: "/servicio/cuentas",
  },
  {
    id: "pagos",
    icon: Zap,
    color: "violet",
    title: "Pagos Inteligentes",
    subtitle: "Automatizá todos tus pagos a proveedores",
    desc: "Programá pagos únicos o recurrentes a proveedores, empleados y servicios. Configurá fechas, montos y frecuencias. EMITIA PAY ejecuta los pagos de forma automática.",
    features: ["Pagos programados y recurrentes", "Aprobaciones en un clic", "Pagos masivos (nómina)", "Historial y comprobantes", "Alertas de saldo insuficiente"],
    path: "/servicio/pagos",
  },
  {
    id: "cobros",
    icon: Users,
    color: "emerald",
    title: "Cobros Automáticos",
    subtitle: "Cobrá a tus clientes sin perseguirlos",
    desc: "Generá facturas digitales y enlace de pago en segundos. Mandá recordatorios automáticos y recibí notificaciones cuando el cliente pague.",
    features: ["Facturas digitales con link de pago", "Recordatorios automáticos", "Seguimiento en tiempo real", "Marca el cobro como pagado", "Historial de cobros"],
    path: "/servicio/cobros",
  },
  {
    id: "echeqs",
    icon: Receipt,
    color: "amber",
    title: "eCheqs Digitales",
    subtitle: "El cheque electrónico simple y seguro",
    desc: "Emitís, recibís y gestionás cheques electrónicos 100% digitales. Sin papel, sin riesgos de pérdida y con validación inmediata.",
    features: ["Emisión de eCheqs en minutos", "Recepción y depósito digital", "Seguimiento de estado", "Integración con tus cuentas", "Seguridad bancaria garantizada"],
    path: "/servicio/echeqs",
  },
  {
    id: "inversiones",
    icon: Landmark,
    color: "blue",
    title: "Inversiones",
    subtitle: "Hacé crecer la liquidez de tu empresa",
    desc: "Invertí el capital de trabajo excedente en plazo fijo, fondos comunes de inversión (FCI), acciones y bonos. Todo desde la plataforma, sin intermediarios.",
    features: ["Plazo fijo desde 1 día", "Fondos comunes de inversión", "Acceso a acciones y bonos", "Rendimientos visibles en tiempo real", "Sin montos mínimos"],
    path: "/servicio/inversiones",
  },
  {
    id: "financiamiento",
    icon: PiggyBank,
    color: "rose",
    title: "Financiamiento PyME",
    subtitle: "Capital cuando lo necesitás",
    desc: "Solicitá préstamos para capital de trabajo, leasing de equipos o descuento de cheques. Aprobación rápida sin burocracia.",
    features: ["Préstamos para capital de trabajo", "Leasing de equipos", "Descuento de cheques", "Aprobación en 24hs", "Sin garantías reales para montos menores"],
    path: "/servicio/financiamiento",
  },
];

const colorMap = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700", border: "border-indigo-200", btn: "bg-indigo-600 hover:bg-indigo-700" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700", border: "border-violet-200", btn: "bg-violet-600 hover:bg-violet-700" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-200", btn: "bg-emerald-600 hover:bg-emerald-700" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700", border: "border-amber-200", btn: "bg-amber-600 hover:bg-amber-700" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700", border: "border-blue-200", btn: "bg-blue-600 hover:bg-blue-700" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", badge: "bg-rose-100 text-rose-700", border: "border-rose-200", btn: "bg-rose-600 hover:bg-rose-700" },
};

function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/inicio" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">EMITIA PAY</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/inicio" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Inicio</Link>
          <Link to="/servicios" className="text-sm font-medium text-indigo-600">Servicios</Link>
          <Link to="/precios" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Precios</Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-2">Ingresar</Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Empezar gratis</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          <Link to="/inicio" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">Inicio</Link>
          <Link to="/servicios" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-indigo-600">Servicios</Link>
          <Link to="/precios" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">Precios</Link>
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100">
            <Link to="/login" className="w-full text-center py-2.5 text-sm font-medium border border-gray-200 rounded-lg">Ingresar</Link>
            <Link to="/register" className="w-full text-center py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg">Empezar gratis</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">Todos los servicios</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Una plataforma, todo lo que necesitás</h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Cada herramienta diseñada para simplificar las finanzas de tu PyME. Sin fricción, sin burocracia.</p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {SERVICES.map((s, i) => {
            const c = colorMap[s.color];
            const isEven = i % 2 === 0;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${isEven ? "" : "lg:grid-flow-col-dense"}`}>
                <div className={isEven ? "" : "lg:col-start-2"}>
                  <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <s.icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${c.badge}`}>{s.subtitle}</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{s.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${c.icon}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className={`inline-flex items-center gap-2 ${c.btn} text-white font-semibold px-6 py-3 rounded-xl transition-colors`}>
                    Empezar ahora <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className={`${c.bg} border ${c.border} rounded-2xl p-8 ${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 ${c.bg} border-2 ${c.border} rounded-xl flex items-center justify-center`}>
                      <s.icon className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                      <p className={`text-xs ${c.icon}`}>EMITIA PAY</p>
                    </div>
                  </div>
                  {s.features.map((f, j) => (
                    <div key={f} className={`flex items-center gap-3 py-3 ${j < s.features.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <CheckCircle2 className={`w-4 h-4 ${c.icon}`} />
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Empezá hoy mismo</h2>
          <p className="text-indigo-200 mb-8">Sin papeles, sin sucursales. Tu cuenta lista en minutos.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-500 py-8 text-center text-sm">
        © {new Date().getFullYear()} EMITIA PAY. Todos los derechos reservados.
      </footer>
    </div>
  );
}
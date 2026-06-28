import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, ArrowRight, Zap, Menu, X } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    desc: "Para emprendedores y microempresas que arrancan.",
    color: "gray",
    features: [
      "1 cuenta en pesos (ARS)",
      "Transferencias hasta $500.000/mes",
      "5 pagos programados",
      "5 cobros digitales",
      "Soporte por email",
    ],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    name: "PyME",
    price: "$8.990",
    period: "/mes + IVA",
    desc: "Para PyMEs en crecimiento que necesitan más potencia.",
    color: "indigo",
    features: [
      "Cuentas en ARS y USD",
      "Transferencias ilimitadas",
      "Pagos y cobros ilimitados",
      "eCheqs digitales",
      "Inversiones y plazo fijo",
      "Calendario financiero",
      "Soporte prioritario",
    ],
    cta: "Elegir PyME",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "A consultar",
    period: "",
    desc: "Para empresas medianas y grandes con necesidades específicas.",
    color: "violet",
    features: [
      "Todo lo de PyME",
      "Cuentas ilimitadas",
      "Financiamiento dedicado",
      "API de integración",
      "Reportes personalizados",
      "Account manager dedicado",
      "SLA garantizado",
    ],
    cta: "Contactar ventas",
    highlight: false,
  },
];

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
          <Link to="/inicio" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Inicio</Link>
          <Link to="/servicios" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Servicios</Link>
          <Link to="/precios" className="text-sm font-medium text-indigo-600">Precios</Link>
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
          <Link to="/servicios" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-700">Servicios</Link>
          <div className="pt-3 flex flex-col gap-2 border-t border-gray-100">
            <Link to="/login" className="w-full text-center py-2.5 text-sm font-medium border border-gray-200 rounded-lg">Ingresar</Link>
            <Link to="/register" className="w-full text-center py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg">Empezar gratis</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      <section className="pt-28 pb-16 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">Planes y precios</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Precios claros, sin sorpresas</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Elegí el plan que se adapta al tamaño de tu empresa. Cambiá cuando quieras.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 flex flex-col ${plan.highlight ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 ring-2 ring-indigo-500" : "bg-white border border-gray-200 shadow-sm"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                    Más popular
                  </div>
                )}
                <div className="mb-6">
                  <p className={`font-semibold mb-1 ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-gray-400"}`}>{plan.period}</span>}
                  </div>
                  <p className={`text-sm mt-2 ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}>{plan.desc}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-indigo-100" : "text-gray-700"}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-300" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.name === "Enterprise" ? "/inicio" : "/register"}
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? "bg-white text-indigo-700 hover:bg-indigo-50" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-gray-500 mb-6">¿Tenés dudas sobre qué plan elegir?</p>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-4">
              <Zap className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-gray-700">Todos los planes incluyen <span className="font-semibold text-indigo-700">30 días de prueba gratis</span> del plan PyME.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {[
              { q: "¿Hay costo de apertura de cuenta?", a: "No. Abrir tu cuenta en EMITIA PAY es completamente gratuito, sin depósito mínimo inicial." },
              { q: "¿Puedo cambiar de plan en cualquier momento?", a: "Sí, podés hacer upgrade o downgrade de tu plan desde la configuración de tu cuenta en cualquier momento." },
              { q: "¿Cómo se cobran las comisiones?", a: "El plan Starter es gratuito. El plan PyME se cobra mensualmente. No hay costos ocultos ni comisiones por transacción." },
              { q: "¿Mis fondos están seguros?", a: "Sí. Utilizamos encriptación de nivel bancario y nuestros fondos están respaldados por entidades reguladas." },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <p className="font-semibold text-gray-900 mb-2 text-sm">{item.q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-600 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Empezá gratis hoy</h2>
        <p className="text-indigo-200 mb-6 text-sm">Sin tarjeta de crédito. Sin compromisos.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-7 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
          Crear mi cuenta <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-500 py-8 text-center text-sm">
        © {new Date().getFullYear()} EMITIA PAY. Todos los derechos reservados.
      </footer>
    </div>
  );
}
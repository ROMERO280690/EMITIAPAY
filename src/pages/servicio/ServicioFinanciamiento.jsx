import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiggyBank, ArrowRight, Clock, CheckCircle2, Star, Shield, Zap, BarChart3 } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const PRODUCTS = [
  {
    icon: "💰",
    name: "Préstamo PyME",
    badge: "Capital de trabajo",
    desc: "Financiamiento rápido para cubrir necesidades de capital de trabajo, compra de insumos o expansión del negocio.",
    features: ["Aprobación en 24hs hábiles", "Sin garantías reales para montos menores", "Plazos de 3 a 36 meses", "Desembolso inmediato una vez aprobado"],
    color: "rose",
  },
  {
    icon: "🏗️",
    name: "Leasing",
    badge: "Equipamiento",
    desc: "Financiá la adquisición de maquinaria, vehículos y equipos tecnológicos con cuotas fijas mensuales.",
    features: ["Financiamiento hasta el 100% del bien", "Cuotas en pesos o dólares", "Opción de compra al final del contrato", "Beneficios impositivos para la empresa"],
    color: "violet",
  },
  {
    icon: "📄",
    name: "Descuento de cheques",
    badge: "Liquidez inmediata",
    desc: "Obtené liquidez inmediata descontando tus cheques diferidos o eCheqs recibidos antes de su fecha de cobro.",
    features: ["Acreditación en menos de 24hs", "Tasas competitivas del mercado", "Sin límite de operaciones", "Compatible con eCheqs EMITIA PAY"],
    color: "amber",
  },
];

const colorMap = {
  rose: { bg: "bg-rose-50", border: "border-rose-100", badge: "bg-rose-100 text-rose-700", btn: "bg-rose-600 hover:bg-rose-700", icon: "text-rose-600" },
  violet: { bg: "bg-violet-50", border: "border-violet-100", badge: "bg-violet-100 text-violet-700", btn: "bg-violet-600 hover:bg-violet-700", icon: "text-violet-600" },
  amber: { bg: "bg-amber-50", border: "border-amber-100", badge: "bg-amber-100 text-amber-700", btn: "bg-amber-600 hover:bg-amber-700", icon: "text-amber-600" },
};

const STEPS = [
  { n: "01", title: "Completá la solicitud", desc: "Llenás el formulario en línea con los datos de tu empresa y el monto requerido." },
  { n: "02", title: "Análisis crediticio", desc: "Nuestro equipo evalúa tu solicitud en base a tus movimientos en la plataforma." },
  { n: "03", title: "Aprobación en 24hs", desc: "Recibís la resolución en hasta 24 horas hábiles, con las condiciones del financiamiento." },
  { n: "04", title: "Desembolso inmediato", desc: "El dinero se acredita en tu cuenta EMITIA PAY al instante de la aprobación." },
];

export default function ServicioFinanciamiento() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-rose-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <PiggyBank className="w-3.5 h-3.5" /> Financiamiento PyME
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                El capital que necesitás,<br />
                <span className="text-rose-300">cuando lo necesitás.</span>
              </h1>
              <p className="text-rose-200 text-lg mb-8 leading-relaxed">
                Préstamos PyME, leasing y descuento de cheques. Aprobación en 24 horas, sin burocracia y con desembolso inmediato en tu cuenta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex items-center justify-center gap-2 bg-white text-rose-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-rose-50 transition-colors">
                  Solicitar financiamiento <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/precios" className="flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-colors">
                  Ver planes
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-3">
                <p className="text-white font-semibold text-sm mb-3">Solicitudes de financiamiento</p>
                {[
                  { type: "Préstamo PyME", amount: "$ 2.500.000", term: "12 meses", status: "Aprobado", statusColor: "text-emerald-400" },
                  { type: "Descuento de eCheq", amount: "$ 850.000", term: "60 días", status: "En análisis", statusColor: "text-amber-400" },
                  { type: "Leasing equipos", amount: "$ 1.200.000", term: "24 meses", status: "Desembolsado", statusColor: "text-blue-400" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                    <div>
                      <p className="text-white text-xs font-medium">{s.type}</p>
                      <p className="text-rose-300 text-[10px]">Plazo: {s.term}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xs font-bold">{s.amount}</p>
                      <span className={`text-[10px] font-semibold ${s.statusColor}`}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-rose-50 border-y border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "24hs", label: "Aprobación" },
              { value: "Sin garantías", label: "Para montos menores" },
              { value: "100%", label: "Online" },
              { value: "Desembolso", label: "Inmediato" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-rose-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos de financiamiento</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tres soluciones para diferentes necesidades de capital de tu empresa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => {
              const c = colorMap[p.color];
              return (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border ${c.border} ${c.bg} p-6 flex flex-col`}>
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${c.badge}`}>{p.badge}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{p.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${c.icon}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className={`w-full text-center py-3 rounded-xl font-semibold text-sm text-white transition-colors ${c.btn}`}>
                    Solicitar ahora
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo funciona el proceso?</h2>
            <p className="text-gray-500">Simple, rápido y 100% online.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-px border-t-2 border-dashed border-rose-200" />
                )}
                <div className="w-12 h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-sm">{s.n}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">¿Qué necesitás para aplicar?</h2>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 space-y-3">
            {[
              "Cuenta activa en EMITIA PAY",
              "Al menos 3 meses de actividad en la plataforma",
              "CUIT / CUIL activo en AFIP",
              "Facturación mensual promedio documentable",
              "Sin inhabilitaciones vigentes",
            ].map((req) => (
              <div key={req} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-600 to-pink-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">¿Tu empresa necesita capital?</h2>
          <p className="text-rose-200 mb-8">Completá la solicitud en minutos. Respuesta en 24 horas hábiles.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-rose-50 transition-colors">
            Solicitar financiamiento <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
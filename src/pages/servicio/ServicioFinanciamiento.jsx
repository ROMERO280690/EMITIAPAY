import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiggyBank, ArrowRight, Clock, CheckCircle2, Star, Shield, Zap, BarChart3 } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import HeroSlider from "@/components/public/HeroSlider";
import { MeshBackground, TiltCard } from "@/components/public/MeshKit";

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

      {/* Hero Slider */}
      <HeroSlider
        autoplay={5000}
        slides={[
          {
            badge: "💰 Financiamiento PyME",
            title: <>El capital que necesitás,<br /><span style={{ color: "#FCA5A5" }}>cuando lo necesitás.</span></>,
            description: "Préstamos PyME, leasing y descuento de cheques. Aprobación en 24hs, sin burocracia, desembolso inmediato.",
            cta: { label: "Solicitar financiamiento", href: "/register" },
            ctaSecondary: { label: "Ver planes", href: "/precios" },
            bgStyle: { background: "linear-gradient(135deg,#4C0519 0%,#881337 50%,#BE123C 100%)" },
          },
          {
            badge: "⚡ Aprobación en 24hs",
            title: <>Sin carpetas,<br /><span style={{ color: "#FDE68A" }}>sin semanas de espera.</span></>,
            description: "Nuestro análisis se basa en tu historial de operaciones en la plataforma. Rápido, justo y sin papeleo.",
            cta: { label: "Solicitar ahora", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#3B0764 0%,#7E1D1D 60%,#BE123C 100%)" },
          },
          {
            badge: "📄 Descuento de cheques",
            title: <>Liquidez inmediata<br /><span style={{ color: "#86EFAC" }}>sobre tus eCheqs.</span></>,
            description: "Descontá tus cheques diferidos antes de su fecha de cobro. Acreditación en menos de 24hs, sin límite de operaciones.",
            cta: { label: "Descontar cheques", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#1C0A00 0%,#78350F 50%,#BE123C 100%)" },
          },
        ]}
      />

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
      <section className="relative py-20 overflow-hidden">
        <MeshBackground className="opacity-50" blobColor1="rgba(244,63,94,0.12)" blobColor2="rgba(139,92,246,0.10)" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos de financiamiento</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tres soluciones para diferentes necesidades de capital de tu empresa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
            {PRODUCTS.map((p, i) => {
              const c = colorMap[p.color];
              return (
                <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <TiltCard intensity={7} className="h-full">
                <div className={`rounded-2xl border ${c.border} ${c.bg} p-6 flex flex-col h-full`}>
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
                </div>
                </TiltCard>
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
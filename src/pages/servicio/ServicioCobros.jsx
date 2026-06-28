import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowRight, Mail, Eye, CheckCircle2, Clock, Star, Bell, BarChart3, FileText } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import HeroSlider from "@/components/public/HeroSlider";

const FEATURES = [
  { icon: FileText, title: "Facturas digitales", desc: "Generá facturas con link de pago en segundos. Enviá por email o WhatsApp con un click." },
  { icon: Bell, title: "Recordatorios automáticos", desc: "El sistema envía recordatorios automáticos antes del vencimiento. Sin que tengas que perseguir a nadie." },
  { icon: Eye, title: "Seguimiento en tiempo real", desc: "Sabé exactamente cuándo tu cliente vio la factura, cuándo pagó y cuánto te debe en total." },
  { icon: CheckCircle2, title: "Confirmación inmediata", desc: "Recibís una notificación al instante cuando el pago ingresa a tu cuenta." },
  { icon: BarChart3, title: "Panel de cobranzas", desc: "Visualizá todos tus cobros pendientes, vencidos y cobrados en un tablero simple y claro." },
  { icon: Mail, title: "Comunicación integrada", desc: "Todas las notificaciones al cliente salen desde la plataforma. Profesional y consistente." },
];

export default function ServicioCobros() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero Slider */}
      <HeroSlider
        autoplay={5000}
        slides={[
          {
            badge: "💰 Cobros Automáticos",
            title: <>Cobrá sin perseguir.<br /><span style={{ color: "#6EE7B7" }}>El sistema trabaja por vos.</span></>,
            description: "Emití facturas digitales con link de pago, mandá recordatorios automáticos y recibí notificaciones cuando el cliente pague.",
            cta: { label: "Empezar gratis", href: "/register" },
            ctaSecondary: { label: "Ver planes", href: "/precios" },
            bgStyle: { background: "linear-gradient(135deg,#064E3B 0%,#065F46 50%,#047857 100%)" },
          },
          {
            badge: "📧 Recordatorios automáticos",
            title: <>El cliente se olvida.<br /><span style={{ color: "#FDE68A" }}>EMITIA PAY, no.</span></>,
            description: "El sistema envía recordatorios antes del vencimiento automáticamente. Tu morosidad baja un 40% sin hacer nada.",
            cta: { label: "Probarlo gratis", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#1A3A2A 0%,#14532D 50%,#166534 100%)" },
          },
          {
            badge: "👁️ Seguimiento en tiempo real",
            title: <>Sabé exactamente<br /><span style={{ color: "#A5F3FC" }}>cuándo te pagan.</span></>,
            description: "Ves cuándo tu cliente abrió la factura, cuándo pagó y cuánto te debe en total — desde tu panel.",
            cta: { label: "Ver panel de cobros", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#0C2D6B 0%,#065F46 100%)" },
          },
        ]}
      />

      {/* Stats */}
      <section className="py-10 bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "-40%", label: "Morosidad promedio" },
              { value: "3x", label: "Más rápido cobrar" },
              { value: "100%", label: "Comprobantes digitales" },
              { value: "0 llamadas", label: "Para cobrar" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-emerald-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que incluyen los Cobros Inteligentes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">El flujo de cobro de punta a punta</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { icon: FileText, label: "Creás la factura", desc: "En segundos" },
              { label: "→", isArrow: true },
              { icon: Mail, label: "El cliente recibe el link", desc: "Por email o WhatsApp" },
              { label: "→", isArrow: true },
              { icon: CheckCircle2, label: "El dinero entra a tu cuenta", desc: "Confirmación instantánea" },
            ].map((step, i) => step.isArrow ? (
              <div key={i} className="text-center text-2xl text-gray-300 font-bold hidden md:block">{step.label}</div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <step.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{step.label}</p>
                <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Empezá a cobrar más rápido</h2>
          <p className="text-emerald-200 mb-8">Crea tu cuenta gratis y emitile tu primera factura a un cliente hoy.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
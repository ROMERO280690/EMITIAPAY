import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, ArrowRight, Calendar, RotateCw, Shield, Clock, Star, AlertCircle, Users } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import HeroSlider from "@/components/public/HeroSlider";
import { MeshBackground, TiltCard } from "@/components/public/MeshKit";

const FEATURES = [
  { icon: Calendar, title: "Pagos programados", desc: "Configurá la fecha exacta en que querés que se ejecute cada pago. Sin que tengas que recordarlo." },
  { icon: RotateCw, title: "Pagos recurrentes", desc: "Configurá pagos que se repiten semanal, quincenal o mensualmente. Automatizá sueldos y servicios." },
  { icon: Users, title: "Pagos masivos", desc: "Pagá a múltiples proveedores o empleados en una sola operación. Ahorrá horas de trabajo." },
  { icon: AlertCircle, title: "Alertas de saldo", desc: "Recibís una notificación si tu cuenta no tiene saldo suficiente antes de que el pago se ejecute." },
  { icon: Shield, title: "Aprobaciones seguras", desc: "Configurá flujos de aprobación para pagos de alto valor. Control total con auditoría completa." },
  { icon: Clock, title: "Historial completo", desc: "Cada pago queda registrado con comprobante descargable. Ideal para conciliar con tu contabilidad." },
];

const PAYMENT_TYPES = [
  { title: "Proveedores", desc: "Pagá facturas automáticamente en la fecha de vencimiento.", icon: "🏭" },
  { title: "Sueldos y honorarios", desc: "Liquidá nóminas completas en un solo click.", icon: "👥" },
  { title: "Impuestos y cargas", desc: "Programá los vencimientos de AFIP, IIBB y cargas sociales.", icon: "🧾" },
  { title: "Alquileres y servicios", desc: "Automatizá pagos fijos mensuales sin olvidarte.", icon: "🏢" },
];

export default function ServicioPagos() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero Slider */}
      <HeroSlider
        autoplay={5000}
        slides={[
          {
            badge: "⚡ Pagos Inteligentes",
            title: <>Pagá a tiempo,<br /><span style={{ color: "#C4B5FD" }}>siempre. Automático.</span></>,
            description: "Programá y automatizá todos tus pagos a proveedores, sueldos e impuestos. Sin recordatorios, sin atrasos.",
            cta: { label: "Empezar gratis", href: "/register" },
            ctaSecondary: { label: "Ver planes", href: "/precios" },
            bgStyle: { background: "linear-gradient(135deg,#2E1065 0%,#4C1D95 50%,#5B21B6 100%)" },
          },
          {
            badge: "🔁 Pagos recurrentes",
            title: <>Sueldos, proveedores,<br /><span style={{ color: "#A5F3FC" }}>una sola configuración.</span></>,
            description: "Configurás una vez y EMITIA PAY los ejecuta puntualmente cada semana, quincena o mes.",
            cta: { label: "Automatizar pagos", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#1E1B4B 0%,#3730A3 60%,#4338CA 100%)" },
          },
          {
            badge: "👥 Pagos masivos",
            title: <>Toda la nómina<br /><span style={{ color: "#86EFAC" }}>en un solo click.</span></>,
            description: "Pagá a múltiples proveedores o empleados en una sola operación. Ahorrá horas de trabajo administrativo.",
            cta: { label: "Ver demo", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#0C2D6B 0%,#1D4ED8 60%,#7C3AED 100%)" },
          },
        ]}
      />

      {/* Stats */}
      <section className="py-10 bg-violet-50 border-y border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: "Pagos a tiempo" },
              { value: "0", label: "Penalidades por mora" },
              { value: "Ilimitados", label: "Pagos programados" },
              { value: "24/7", label: "Ejecución automática" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-violet-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué podés automatizar?</h2>
            <p className="text-gray-500">Todo tipo de pago empresarial, gestionado desde un solo lugar.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PAYMENT_TYPES.map((pt, i) => (
              <motion.div key={pt.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-violet-50 border border-violet-100 text-center">
                <div className="text-4xl mb-3">{pt.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{pt.title}</h3>
                <p className="text-gray-500 text-sm">{pt.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <MeshBackground className="opacity-50" blobColor1="rgba(139,92,246,0.14)" blobColor2="rgba(99,102,241,0.12)" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que incluyen los Pagos Inteligentes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <TiltCard intensity={8} className="h-full">
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow h-full">
                    <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Automatizá tus pagos desde hoy</h2>
          <p className="text-violet-200 mb-8">Empezá gratis. Sin configuración compleja, en minutos.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
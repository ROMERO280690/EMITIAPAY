import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe2, CheckCircle2, ArrowRight, Copy, ArrowLeftRight, Shield, Zap, Clock, TrendingUp, Star } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import HeroSlider from "@/components/public/HeroSlider";

const FEATURES = [
  { icon: Globe2, title: "Multi-moneda nativo", desc: "Abrí cuentas en pesos (ARS) y dólares (USD) sin restricciones. Gestioná ambas desde un mismo panel." },
  { icon: ArrowLeftRight, title: "Transferencias 24/7", desc: "Enviá y recibí dinero en cualquier momento del día, incluso fines de semana y feriados." },
  { icon: TrendingUp, title: "Saldo remunerado", desc: "Tus pesos generan rendimiento automático del 38.64% TNA sin que tengas que hacer nada." },
  { icon: Copy, title: "CBU y alias propios", desc: "Cada cuenta tiene su propio CBU y alias personalizable para recibir pagos fácilmente." },
  { icon: Shield, title: "Seguridad bancaria", desc: "Encriptación de nivel bancario, autenticación en dos pasos y monitoreo antifraude 24/7." },
  { icon: Clock, title: "Apertura en minutos", desc: "Sin papeles, sin turnos, sin sucursales. Abrí tu cuenta 100% online en menos de 5 minutos." },
];

const STEPS = [
  { n: "01", title: "Registrate", desc: "Creá tu cuenta con tu email empresarial. Sin documentación física requerida." },
  { n: "02", title: "Elegí tu moneda", desc: "Abrí una cuenta en pesos, en dólares, o ambas. Sin costo de apertura ni mantenimiento." },
  { n: "03", title: "Recibí tu CBU", desc: "Obtenés tu CBU y alias al instante. Ya podés recibir transferencias." },
  { n: "04", title: "Operá desde el primer día", desc: "Transferí, pagá proveedores, cobrá clientes e invertí tu saldo directamente desde la plataforma." },
];

export default function ServicioCuentas() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero Slider */}
      <HeroSlider
        autoplay={5000}
        slides={[
          {
            badge: "🏦 Cuentas Multi-moneda",
            title: <>Tu empresa opera en pesos y dólares.<br /><span style={{ color: "#93C5FD" }}>Nosotros también.</span></>,
            description: "Abrí cuentas en ARS y USD sin costo de apertura. Transferencias 24/7, CBU propio y saldo remunerado automático.",
            cta: { label: "Abrir cuenta gratis", href: "/register" },
            ctaSecondary: { label: "Ver planes", href: "/precios" },
            bgStyle: { background: "linear-gradient(135deg,#1E1B4B 0%,#1E3A8A 50%,#1D4ED8 100%)" },
            image: (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 w-full max-w-xs space-y-3">
                <p className="text-white font-semibold text-sm mb-1">Tus cuentas</p>
                {[
                  { flag: "🇦🇷", label: "Cuenta Pesos", currency: "ARS", balance: "$ 2.458.320", tna: "38.64% TNA" },
                  { flag: "🇺🇸", label: "Cuenta Dólares", currency: "USD", balance: "US$ 15.200", tna: null },
                ].map((acc) => (
                  <div key={acc.currency} className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <p className="text-blue-200 text-xs mb-1">{acc.flag} {acc.label}</p>
                    <p className="text-white text-xl font-bold">{acc.balance}</p>
                    {acc.tna && <span className="text-emerald-400 text-xs font-semibold">{acc.tna}</span>}
                  </div>
                ))}
              </div>
            ),
          },
          {
            badge: "⚡ Transferencias 24/7",
            title: <>Sin horarios bancarios.<br /><span style={{ color: "#6EE7B7" }}>Transferí cuando quieras.</span></>,
            description: "Enviá y recibí dinero en cualquier momento del día, incluso fines de semana y feriados nacionales.",
            cta: { label: "Abrir cuenta", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#0C2D6B 0%,#0369A1 60%,#0284C7 100%)" },
          },
          {
            badge: "📈 Saldo remunerado",
            title: <>Tu plata trabajando<br /><span style={{ color: "#FDE68A" }}>38.64% TNA automático.</span></>,
            description: "El saldo en tu cuenta en pesos genera rendimiento automático sin que hagas nada. Sin plazos, sin trámites.",
            cta: { label: "Empezar a ganar", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#1A2744 0%,#15803D 60%,#16A34A 100%)" },
          },
        ]}
      />

      {/* Stats bar */}
      <section className="py-10 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "$ 0", label: "Costo de apertura" },
              { value: "24/7", label: "Transferencias" },
              { value: "38.64%", label: "TNA en pesos" },
              { value: "< 5 min", label: "Para operar" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-indigo-600">{s.value}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Todo lo que incluye tu cuenta</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Sin letra chica, sin costos ocultos. Lo que ves es lo que obtenés.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-500">En 4 pasos simples, tu empresa ya está operando.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-px border-t-2 border-dashed border-indigo-200" />
                )}
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-sm">{s.n}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">EMITIA PAY vs. banco tradicional</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Característica</th>
                  <th className="text-center px-6 py-4 font-bold text-indigo-600">EMITIA PAY</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-500">Banco tradicional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Apertura de cuenta", "Gratis, online", "Requiere turno y documentación"],
                  ["Transferencias 24/7", "✅ Siempre disponible", "❌ Solo horario bancario"],
                  ["Cuenta en dólares", "✅ Sin restricciones", "⚠️ Con limitaciones"],
                  ["Saldo remunerado", "✅ Automático 38.64% TNA", "❌ No aplica en cuentas corrientes"],
                  ["Costo de mantenimiento", "$ 0", "Variable (puede superar $10.000/mes)"],
                  ["Tiempo para operar", "< 5 minutos", "Varios días hábiles"],
                ].map(([feat, emitia, banco]) => (
                  <tr key={feat} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">{feat}</td>
                    <td className="px-6 py-4 text-center text-emerald-600 font-medium">{emitia}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{banco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Santiago Vera", company: "Vera & Asociados", text: "Abrir la cuenta fue cuestión de minutos. El CBU propio nos permite recibir pagos sin complicaciones." },
              { name: "Florencia Ríos", company: "Exporta Sur S.R.L.", text: "La cuenta en dólares sin restricciones fue un game changer para nuestras operaciones de comercio exterior." },
              { name: "Martín López", company: "Constructora ML", text: "El rendimiento automático sobre el saldo en pesos es una ventaja enorme. El dinero trabaja solo." },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
                <div className="flex gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Abrí tu cuenta hoy, gratis</h2>
          <p className="text-indigo-200 mb-8">Sin papeles, sin sucursales. En minutos ya estás operando.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
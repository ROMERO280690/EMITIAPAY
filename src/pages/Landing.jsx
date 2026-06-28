import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, ArrowRight, CheckCircle2, Zap, Shield, Globe2,
  Users, Receipt, Landmark, PiggyBank, BarChart3, Calendar, Star
} from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const STATS = [
  { value: "+5.000", label: "PyMEs activas" },
  { value: "$ 2B+", label: "Procesados al mes" },
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "0 costo", label: "De apertura" },
];

const FEATURES = [
  { icon: Globe2, title: "Multi-moneda", desc: "Operá en pesos y dólares desde una sola plataforma, sin restricciones.", color: "text-blue-500", bg: "bg-blue-50", href: "/servicio/cuentas" },
  { icon: Zap, title: "Pagos inteligentes", desc: "Automatizá pagos a proveedores, programá fechas y configurá recurrencias.", color: "text-violet-500", bg: "bg-violet-50", href: "/servicio/pagos" },
  { icon: Users, title: "Cobros automáticos", desc: "Emití facturas digitales y cobrá a tus clientes sin esfuerzo.", color: "text-emerald-500", bg: "bg-emerald-50", href: "/servicio/cobros" },
  { icon: Receipt, title: "eCheqs digitales", desc: "Emití y gestioná cheques electrónicos de forma 100% digital.", color: "text-amber-500", bg: "bg-amber-50", href: "/servicio/echeqs" },
  { icon: Landmark, title: "Inversiones", desc: "Hacé rendir tu liquidez con plazos fijos, FCI y más instrumentos.", color: "text-indigo-500", bg: "bg-indigo-50", href: "/servicio/inversiones" },
  { icon: PiggyBank, title: "Financiamiento PyME", desc: "Accedé a préstamos, leasing y descuento de cheques en minutos.", color: "text-rose-500", bg: "bg-rose-50", href: "/servicio/financiamiento" },
];

const TESTIMONIALS = [
  { name: "María González", company: "TechSur S.A.", text: "EMITIA PAY cambió cómo gestionamos las finanzas. Los pagos automáticos nos ahorran horas cada semana.", stars: 5 },
  { name: "Carlos Rodríguez", company: "Distribuidora Norte", text: "Finalmente una plataforma pensada para PyMEs argentinas. Multi-moneda y sin complicaciones.", stars: 5 },
  { name: "Laura Mendez", company: "Studio LM", text: "Los cobros inteligentes me permiten cobrarle a mis clientes sin perseguirlos. Increíble.", stars: 5 },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-body">
      <PublicNav transparent />

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" /> La fintech diseñada para PyMEs argentinas
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              El banco digital que<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">tu empresa necesita</span>
            </h1>
            <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-10">
              Cuentas multi-moneda, pagos inteligentes, cobros automáticos, eCheqs e inversiones. Todo en una plataforma hecha para crecer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="flex items-center gap-2 bg-white text-indigo-700 font-semibold text-base px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30">
                Abrí tu cuenta gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/servicios" className="flex items-center gap-2 text-white border border-white/30 hover:bg-white/10 font-medium text-base px-7 py-3.5 rounded-xl transition-colors">
                Ver todos los servicios
              </Link>
            </div>
          </motion.div>

          {/* App mockup */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 mx-auto max-w-4xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="bg-indigo-950/80 rounded-xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Saldo ARS", value: "$ 2.458.320", trend: "+12%" },
                { label: "Saldo USD", value: "US$ 15.200", trend: "+5%" },
                { label: "Cobros pendientes", value: "$ 840.000", trend: "3 activos" },
                { label: "Inversiones", value: "$ 500.000", trend: "38.6% TNA" },
              ].map((item) => (
                <div key={item.label} className="text-left p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-indigo-300 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-bold text-sm">{item.value}</p>
                  <span className="text-emerald-400 text-xs font-medium">{item.trend}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Todo lo que tu PyME necesita</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Una plataforma completa para manejar todas las finanzas de tu empresa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <Link to={f.href} className={`inline-flex items-center gap-1 text-sm font-medium mt-4 ${f.color} hover:underline`}>
                  Saber más <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why EMITIA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">¿Por qué elegir EMITIA PAY?</h2>
              <p className="text-gray-500 mb-8">Diseñada desde cero para las necesidades reales de las empresas argentinas. Sin burocracia, sin costos ocultos, sin demoras.</p>
              <div className="space-y-4">
                {[
                  "Cuenta en pesos y dólares sin costo de apertura",
                  "Transferencias instantáneas 24/7",
                  "Pagos programados y recurrentes automatizados",
                  "eCheqs 100% digitales y seguros",
                  "Rendimiento automático sobre tu saldo en pesos",
                  "Soporte dedicado para PyMEs",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Empezar ahora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Seguridad bancaria", desc: "Encriptación de nivel bancario y autenticación en dos pasos.", color: "indigo" },
                { icon: BarChart3, title: "Reportes en tiempo real", desc: "Resúmenes y análisis de tu flujo de caja al instante.", color: "violet" },
                { icon: Calendar, title: "Calendario financiero", desc: "Visualizá todos tus vencimientos y pagos en un solo lugar.", color: "emerald" },
                { icon: Globe2, title: "Multi-moneda nativo", desc: "Operá en ARS y USD sin fricciones ni conversiones manuales.", color: "amber" },
              ].map((card) => (
                <div key={card.title} className={`p-5 rounded-2xl border border-${card.color}-100 bg-${card.color}-50`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-600 mb-3`} />
                  <p className="font-semibold text-gray-900 text-sm mb-1">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-500">Más de 5.000 PyMEs ya confían en EMITIA PAY</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Listo para transformar las finanzas de tu empresa?</h2>
          <p className="text-indigo-200 mb-8">Abrí tu cuenta en minutos. Sin papeles, sin sucursales, sin costo.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">
              Crear cuenta gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/precios" className="flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-xl transition-colors">
              Ver planes y precios
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
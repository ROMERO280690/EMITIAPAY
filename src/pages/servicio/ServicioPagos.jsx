import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, ArrowRight, Calendar, RotateCw, Shield, Clock, Star, AlertCircle, Users } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

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

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-violet-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <Zap className="w-3.5 h-3.5" /> Pagos Inteligentes
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                Pagá a tiempo,<br />
                <span className="text-violet-300">siempre. Automático.</span>
              </h1>
              <p className="text-violet-200 text-lg mb-8 leading-relaxed">
                Programá y automatizá todos tus pagos a proveedores, sueldos e impuestos. Sin recordatorios, sin atrasos, sin stress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-violet-50 transition-colors">
                  Empezar gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/precios" className="flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-colors">
                  Ver planes
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-3">
                <p className="text-white font-semibold text-sm mb-3">Pagos programados</p>
                {[
                  { name: "Servicios IT - Proveedor X", amount: "$ 85.000", date: "15/07", status: "Programado", color: "bg-blue-400" },
                  { name: "Sueldos julio - Nómina", amount: "$ 1.240.000", date: "30/07", status: "Programado", color: "bg-violet-400" },
                  { name: "AFIP - Monotributo", amount: "$ 42.800", date: "20/07", status: "Pendiente", color: "bg-amber-400" },
                  { name: "Alquiler oficina", amount: "$ 320.000", date: "01/08", status: "Completado", color: "bg-emerald-400" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${p.color}`} />
                      <div>
                        <p className="text-white text-xs font-medium">{p.name}</p>
                        <p className="text-violet-300 text-[10px]">Vence: {p.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xs font-bold">{p.amount}</p>
                      <span className={`text-[10px] font-semibold ${p.status === "Completado" ? "text-emerald-400" : "text-violet-300"}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que incluyen los Pagos Inteligentes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
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
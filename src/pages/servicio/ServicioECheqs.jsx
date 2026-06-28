import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt, ArrowRight, Shield, Clock, CheckCircle2, Star, Zap, FileText, AlertCircle } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const FEATURES = [
  { icon: Zap, title: "Emisión en minutos", desc: "Emití un eCheq completando un formulario simple. Sin papeles, sin filas en el banco." },
  { icon: CheckCircle2, title: "Depósito digital inmediato", desc: "El beneficiario recibe y deposita el eCheq de forma 100% digital, sin ir al banco." },
  { icon: Shield, title: "Validación automática", desc: "El sistema valida la autenticidad del eCheq en tiempo real. Sin riesgo de fraude." },
  { icon: FileText, title: "Historial completo", desc: "Todos tus eCheqs emitidos, recibidos y depositados en un solo lugar, con trazabilidad total." },
  { icon: Clock, title: "Seguimiento de estado", desc: "Sabé en todo momento si tu eCheq fue depositado, rechazado o está pendiente." },
  { icon: AlertCircle, title: "Alertas de vencimiento", desc: "Recibís un aviso antes de que venza cualquier eCheq para evitar problemas de liquidez." },
];

export default function ServicioECheqs() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-amber-950 via-amber-900 to-orange-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-amber-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <Receipt className="w-3.5 h-3.5" /> eCheqs Digitales
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                El cheque del siglo XXI.<br />
                <span className="text-amber-300">100% digital y seguro.</span>
              </h1>
              <p className="text-amber-200 text-lg mb-8 leading-relaxed">
                Emití, recibí y gestioná cheques electrónicos sin papel, sin riesgo de pérdida y con validación inmediata. El futuro de los instrumentos de pago empresariales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex items-center justify-center gap-2 bg-white text-amber-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-amber-50 transition-colors">
                  Empezar gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/precios" className="flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-colors">
                  Ver planes
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-3">
                <p className="text-white font-semibold text-sm mb-3">eCheqs recientes</p>
                {[
                  { recipient: "Materiales del Sur S.A.", amount: "$ 450.000", date: "2026-08-15", status: "Emitido" },
                  { recipient: "Constructora LM", amount: "$ 280.000", date: "2026-09-01", status: "Depositado" },
                  { recipient: "Tech Suministros", amount: "$ 125.000", date: "2026-07-30", status: "Pendiente" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                    <div>
                      <p className="text-white text-xs font-medium">{c.recipient}</p>
                      <p className="text-amber-300 text-[10px]">Cobro: {c.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xs font-bold">{c.amount}</p>
                      <span className={`text-[10px] font-semibold ${c.status === "Depositado" ? "text-emerald-400" : c.status === "Pendiente" ? "text-amber-300" : "text-blue-400"}`}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "0", label: "Riesgo de pérdida" },
              { value: "< 2 min", label: "Para emitir un eCheq" },
              { value: "100%", label: "Digital, sin papel" },
              { value: "Validación", label: "Automática e inmediata" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-amber-600">{s.value}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que incluyen los eCheqs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vs paper check */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">eCheq digital vs. cheque en papel</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Aspecto</th>
                  <th className="text-center px-6 py-4 font-bold text-amber-600">eCheq EMITIA PAY</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-500">Cheque en papel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Riesgo de pérdida", "✅ Ninguno", "❌ Alto"],
                  ["Tiempo de emisión", "✅ < 2 minutos", "❌ Requiere ir al banco"],
                  ["Depósito", "✅ Desde cualquier lugar", "❌ Solo en sucursal"],
                  ["Validación de fondos", "✅ Automática e inmediata", "❌ Puede tardar días"],
                  ["Costo por operación", "✅ Sin costo adicional", "⚠️ Comisiones bancarias"],
                  ["Trazabilidad", "✅ 100% auditable", "❌ Limitada"],
                ].map(([feat, echeq, papel]) => (
                  <tr key={feat} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-700">{feat}</td>
                    <td className="px-6 py-4 text-center text-emerald-600 font-medium">{echeq}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{papel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Empezá a usar eCheqs hoy</h2>
          <p className="text-amber-100 mb-8">Sin complicaciones, sin papeles. Todo digital desde el primer día.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-amber-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
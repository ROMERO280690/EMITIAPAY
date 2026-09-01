import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Receipt, ArrowRight, Shield, Clock, CheckCircle2, Star, Zap, FileText, AlertCircle } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import HeroSlider from "@/components/public/HeroSlider";
import { MeshBackground, TiltCard } from "@/components/public/MeshKit";

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

      {/* Hero Slider */}
      <HeroSlider
        autoplay={5000}
        slides={[
          {
            badge: "📄 eCheqs Digitales",
            title: <>El cheque del siglo XXI.<br /><span style={{ color: "#FDE68A" }}>100% digital y seguro.</span></>,
            description: "Emití, recibí y gestioná cheques electrónicos sin papel, sin riesgo de pérdida y con validación inmediata.",
            cta: { label: "Empezar gratis", href: "/register" },
            ctaSecondary: { label: "Ver planes", href: "/precios" },
            bgStyle: { background: "linear-gradient(135deg,#78350F 0%,#92400E 50%,#B45309 100%)" },
          },
          {
            badge: "✅ Validación automática",
            title: <>Sin ir al banco.<br /><span style={{ color: "#86EFAC" }}>Sin riesgo de fraude.</span></>,
            description: "El sistema valida la autenticidad de cada eCheq en tiempo real. Seguridad sin burocracia.",
            cta: { label: "Probar eCheqs", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#451A03 0%,#78350F 50%,#92400E 100%)" },
          },
          {
            badge: "📱 Desde cualquier lugar",
            title: <>Depositá un eCheq<br /><span style={{ color: "#A5F3FC" }}>desde el celular.</span></>,
            description: "Sin ir a una sucursal, sin horarios bancarios. El beneficiario deposita 100% digital desde donde esté.",
            cta: { label: "Conocer más", href: "/register" },
            bgStyle: { background: "linear-gradient(135deg,#1C1917 0%,#78350F 60%,#D97706 100%)" },
          },
        ]}
      />

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
      <section className="relative py-20 overflow-hidden">
        <MeshBackground className="opacity-50" blobColor1="rgba(245,158,11,0.14)" blobColor2="rgba(217,119,6,0.10)" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que incluyen los eCheqs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <TiltCard intensity={8} className="h-full">
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow h-full">
                    <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-amber-600" />
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
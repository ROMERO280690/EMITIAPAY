import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark, ArrowRight, TrendingUp, Shield, Clock, Star, BarChart3, Zap } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

const PRODUCTS = [
  { icon: "🏦", name: "Plazo Fijo", tna: "38.64% TNA", min: "Desde 1 día", desc: "Invertí tu excedente de caja a tasa fija. Rendimiento asegurado al vencimiento.", color: "indigo" },
  { icon: "📊", name: "Fondos Comunes (FCI)", tna: "Variable", min: "Sin mínimo", desc: "Diversificá en fondos gestionados por expertos. Alta liquidez, buena rentabilidad.", color: "blue" },
  { icon: "📈", name: "Acciones", tna: "Variable", min: "Desde $ 10.000", desc: "Invertí en empresas del Merval y mercados internacionales.", color: "violet" },
  { icon: "💳", name: "Bonos", tna: "Variable", min: "Desde $ 50.000", desc: "Bonos soberanos y corporativos. Riesgo moderado con rentabilidad predecible.", color: "emerald" },
];

const FEATURES = [
  { icon: Zap, title: "Sin intermediarios", desc: "Operás directamente desde la plataforma, sin brokers ni comisiones ocultas." },
  { icon: BarChart3, title: "Rendimientos en tiempo real", desc: "Visualizá cómo evolucionan tus inversiones en todo momento desde tu panel." },
  { icon: Shield, title: "Gestión de riesgo", desc: "Cada producto tiene su perfil de riesgo claramente informado antes de invertir." },
  { icon: Clock, title: "Liquidez según producto", desc: "Desde plazo fijo a 1 día hasta inversiones de más largo plazo, elegís el horizonte." },
  { icon: TrendingUp, title: "Historial de operaciones", desc: "Comprobantes y resumen de cada inversión realizada, integrado con tus movimientos." },
  { icon: Landmark, title: "Reinversión automática", desc: "Configurá la reinversión automática al vencimiento para maximizar el rendimiento compuesto." },
];

export default function ServicioInversiones() {
  const colorMap = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    violet: "bg-violet-50 border-violet-100 text-violet-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
  };

  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                <Landmark className="w-3.5 h-3.5" /> Inversiones
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
                Tu capital de trabajo<br />
                <span className="text-blue-300">trabajando para vos.</span>
              </h1>
              <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                Plazo fijo, fondos comunes, acciones y bonos. Todo desde EMITIA PAY, sin intermediarios y con rendimientos visibles en tiempo real.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                  Empezar a invertir <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/precios" className="flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-colors">
                  Ver planes
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white font-semibold text-sm">Portfolio de inversiones</p>
                  <span className="text-emerald-400 text-sm font-bold">+$ 48.320</span>
                </div>
                {[
                  { type: "Plazo Fijo 30 días", amount: "$ 500.000", yield: "+$ 16.100", tna: "38.64% TNA", color: "bg-indigo-400" },
                  { type: "FCI Renta Variable", amount: "$ 250.000", yield: "+$ 22.800", tna: "Variable", color: "bg-blue-400" },
                  { type: "Bonos Corporativos", amount: "$ 180.000", yield: "+$ 9.420", tna: "6.2% anual", color: "bg-violet-400" },
                ].map((inv) => (
                  <div key={inv.type} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 border border-white/10 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${inv.color}`} />
                      <div>
                        <p className="text-white text-xs font-medium">{inv.type}</p>
                        <p className="text-blue-300 text-[10px]">{inv.tna}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xs font-bold">{inv.amount}</p>
                      <span className="text-emerald-400 text-[10px] font-semibold">{inv.yield}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-500/20 rounded-xl px-4 py-3 border border-blue-500/30 flex justify-between mt-2">
                  <p className="text-blue-300 text-xs">Total invertido</p>
                  <p className="text-white font-bold text-sm">$ 930.000</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Instrumentos disponibles</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Elegí el producto que mejor se adapta al perfil de inversión de tu empresa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${colorMap[p.color]} bg-opacity-30 border-opacity-50`}>
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-bold ${colorMap[p.color].split(" ")[2]}`}>{p.tna}</span>
                  <span className="text-xs text-gray-400">· {p.min}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                <Link to="/register" className={`inline-flex items-center gap-1 text-sm font-semibold mt-4 ${colorMap[p.color].split(" ")[2]} hover:underline`}>
                  Invertir ahora <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por qué invertir desde EMITIA PAY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Empezá a hacer rendir tu capital</h2>
          <p className="text-blue-200 mb-8">Sin montos mínimos, sin intermediarios. Todo desde tu cuenta EMITIA PAY.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
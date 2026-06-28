import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Zap, Shield, Globe2,
  Users, Receipt, Landmark, PiggyBank, BarChart3, Mountain, MapPin
} from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

/* ─────────── Datos ─────────── */
const TESTIMONIALS = [
  {
    name: "Claudia Herrera",
    company: "Carnicería Don Roberto — Neuquén",
    region: "Patagonia",
    text: "Tengo una carnicería familiar hace 22 años. Nunca pensé que iba a poder manejar todo desde el teléfono. Los pagos a proveedores salen solos, y yo me quedo con lo mío.",
    avatar: "CH",
    color: "bg-sky-700",
  },
  {
    name: "Facundo Ríos",
    company: "Transporte Ríos Hnos. — Tucumán",
    region: "NOA",
    text: "Somos tres hermanos y el negocio siempre fue un lío con la plata. EMITIA PAY nos ordenó. Los eCheqs de los clientes ya no nos hacen perder días en el banco.",
    avatar: "FR",
    color: "bg-amber-700",
  },
  {
    name: "Valeria Ocampo",
    company: "Diseño & Co. — Buenos Aires",
    region: "AMBA",
    text: "Cobro en pesos y en dólares según el cliente. Antes era un caos. Ahora tengo todo en un lugar y los cobros automáticos me liberaron un montón de tiempo.",
    avatar: "VO",
    color: "bg-indigo-700",
  },
];

const FEATURES = [
  { icon: Globe2, title: "Cuentas multi-moneda", desc: "ARS y USD desde una sola pantalla. Sin turnos, sin papeles, sin vueltas.", href: "/servicio/cuentas", accent: "#4F8EF7" },
  { icon: Zap, title: "Pagos programados", desc: "Proveedores, sueldos, servicios — configurás una vez y EMITIA PAY lo ejecuta.", href: "/servicio/pagos", accent: "#7C3AED" },
  { icon: Users, title: "Cobros automáticos", desc: "Factura digital con link de pago. El cliente paga, vos recibís la notificación.", href: "/servicio/cobros", accent: "#059669" },
  { icon: Receipt, title: "eCheqs digitales", desc: "El cheque físico quedó en el pasado. Emití, depositá y gestioná 100% digital.", href: "/servicio/echeqs", accent: "#D97706" },
  { icon: Landmark, title: "Inversiones", desc: "El saldo parado pierde valor. Activalo en plazo fijo o FCI con un toque.", href: "/servicio/inversiones", accent: "#2563EB" },
  { icon: PiggyBank, title: "Financiamiento PyME", desc: "Crédito para capital de trabajo sin burocracia. Respuesta en 24 horas.", href: "/servicio/financiamiento", accent: "#DC2626" },
];

const PROVINCES = [
  "Buenos Aires", "Córdoba", "Rosario", "Mendoza",
  "Tucumán", "Salta", "Neuquén", "Bariloche",
  "Mar del Plata", "Posadas", "La Quiaca", "Ushuaia",
];

/* ─────────── Montaña SVG decorativa ─────────── */
function MountainSilhouette() {
  return (
    <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full" preserveAspectRatio="none">
      {/* Cordillera fondo */}
      <path d="M0 220 L180 90 L320 140 L480 40 L640 110 L800 20 L960 80 L1120 50 L1280 100 L1440 60 L1440 220 Z"
        fill="url(#mtn1)" opacity="0.35" />
      {/* Cordillera media */}
      <path d="M0 220 L100 140 L220 160 L380 70 L520 120 L680 30 L820 95 L980 55 L1140 90 L1300 45 L1440 80 L1440 220 Z"
        fill="url(#mtn2)" opacity="0.55" />
      {/* Cordillera frente */}
      <path d="M0 220 L80 170 L200 185 L340 110 L460 150 L600 80 L740 130 L900 95 L1060 135 L1200 100 L1360 140 L1440 115 L1440 220 Z"
        fill="url(#mtn3)" opacity="0.85" />
      <defs>
        <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────── Franja de la bandera ─────────── */
function ArgFlag({ className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="h-1.5 bg-sky-400 w-full rounded-sm" />
      <div className="h-1.5 bg-white w-full" />
      <div className="h-1.5 bg-sky-400 w-full rounded-sm" />
    </div>
  );
}

/* ─────────── Sol de Mayo mini ─────────── */
function SolDeMayo({ size = 40 }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {rays.map((_, i) => {
        const angle = (i * 360) / 16;
        const isStraight = i % 2 === 0;
        const r1 = isStraight ? 13 : 12;
        const r2 = isStraight ? 19 : 17;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + r1 * Math.cos(rad);
        const y1 = 20 + r1 * Math.sin(rad);
        const x2 = 20 + r2 * Math.cos(rad);
        const y2 = 20 + r2 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth={isStraight ? 2 : 1.2} strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="8" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="20" cy="20" r="5" fill="#FBBF24" />
      <ellipse cx="18" cy="19" rx="1.5" ry="2" fill="#F59E0B" opacity="0.6" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-body overflow-x-hidden">
      <PublicNav transparent />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0C2D6B 0%, #1A4FB5 40%, #2563EB 70%, #3B82F6 100%)" }}>

        {/* Estrellas / partículas */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 70 + "%",
              left: Math.random() * 100 + "%",
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }} />
        ))}

        {/* Franja bandera lateral izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col">
          <div className="flex-1 bg-sky-300/60" />
          <div className="flex-1 bg-white/40" />
          <div className="flex-1 bg-sky-300/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto hero */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {/* Sol de Mayo + badge */}
            <div className="flex items-center gap-3 mb-6">
              <SolDeMayo size={44} />
              <span className="bg-white/15 border border-white/25 text-sky-100 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">
                Hecho en Argentina, para Argentina
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Las finanzas de tu<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #FCD34D, #FBBF24)" }}>
                PyME, en orden.
              </span>
            </h1>

            <p className="text-sky-100 text-lg leading-relaxed mb-3 max-w-xl">
              De La Quiaca a Ushuaia, miles de empresas argentinas usan EMITIA PAY para pagar, cobrar, invertir y crecer — sin pisar un banco.
            </p>

            <ArgFlag className="w-24 mb-8 opacity-80" />

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-800 font-bold text-base px-8 py-4 rounded-2xl hover:bg-sky-50 transition-all shadow-xl shadow-blue-900/30 group">
                Abrí tu cuenta gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/servicios"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 font-semibold text-base px-8 py-4 rounded-2xl transition-all">
                Ver servicios
              </Link>
            </div>
          </motion.div>

          {/* Dashboard card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-1 shadow-2xl shadow-blue-900/40">
              {/* Header tarjeta */}
              <div className="bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-2xl p-5 mb-1">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <SolDeMayo size={22} />
                    <span className="text-white font-bold text-sm">EMITIA PAY</span>
                  </div>
                  <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/15 px-3 py-1 rounded-full">● En línea</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Saldo ARS", value: "$ 2.458.320", sub: "+12% este mes", green: true },
                    { label: "Saldo USD", value: "US$ 15.200", sub: "+5% este mes", green: true },
                    { label: "Cobros pendientes", value: "$ 840.000", sub: "3 facturas activas", green: false },
                    { label: "Inversiones", value: "$ 500.000", sub: "38.6% TNA", green: true },
                  ].map((item) => (
                    <div key={item.label} className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <p className="text-sky-300 text-xs mb-1">{item.label}</p>
                      <p className="text-white font-bold text-sm">{item.value}</p>
                      <p className={`text-xs mt-0.5 ${item.green ? "text-emerald-400" : "text-amber-400"}`}>{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Últimos movimientos */}
              <div className="px-4 pb-4 pt-2 space-y-2">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Últimos movimientos</p>
                {[
                  { desc: "Pago a proveedor — Distribuidora Sur", amount: "- $ 45.000", color: "text-red-400" },
                  { desc: "Cobro factura #1092 — Cliente Ríos", amount: "+ $ 120.000", color: "text-emerald-400" },
                  { desc: "Rendimiento plazo fijo", amount: "+ $ 3.200", color: "text-emerald-400" },
                ].map((m) => (
                  <div key={m.desc} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/70 text-xs truncate max-w-[65%]">{m.desc}</span>
                    <span className={`text-xs font-semibold ${m.color}`}>{m.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cordillera al pie del hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <MountainSilhouette />
        </div>
      </section>

      {/* ════════ PRESENCIA EN TODO EL PAÍS ════════ */}
      <section className="py-10 bg-sky-50 border-y border-sky-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-sky-600 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Presentes en toda la Argentina
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 justify-center flex-wrap">
            {PROVINCES.map((p) => (
              <span key={p} className="whitespace-nowrap text-xs font-medium text-sky-700 bg-white border border-sky-200 px-3 py-1.5 rounded-full shadow-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ NÚMEROS CON ALMA ════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <ArgFlag className="w-20 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Números que importan
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Detrás de cada cifra hay una PyME argentina que encontró una forma más simple de hacer las cosas.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "+5.000", label: "PyMEs activas", sub: "de la Quiaca a Tierra del Fuego", icon: Mountain },
              { value: "$ 2B+", label: "Procesados al mes", sub: "en pagos, cobros e inversiones", icon: BarChart3 },
              { value: "99.9%", label: "Disponibilidad", sub: "no paramos ni los feriados", icon: Zap },
              { value: "$ 0", label: "Costo de apertura", sub: "sin letra chica, sin sorpresas", icon: CheckCircle2 },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50 to-white shadow-sm">
                <s.icon className="w-6 h-6 text-sky-500 mx-auto mb-3" />
                <p className="text-4xl font-extrabold text-sky-700 mb-1">{s.value}</p>
                <p className="font-semibold text-gray-800 text-sm mb-1">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SERVICIOS ════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">Todo en una plataforma</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Herramientas reales para negocios reales
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              No inventamos la rueda — simplificamos lo que ya hacés todos los días.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={f.href}
                  className="group block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: f.accent + "18" }}>
                    <f.icon className="w-6 h-6" style={{ color: f.accent }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                    style={{ color: f.accent }}>
                    Saber más <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ POR QUÉ EMITIA — con cordillera de fondo ════════ */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0C2D6B 0%, #1E40AF 60%, #2563EB 100%)" }}>
        {/* Cordillera fondo decorativa */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1440 400" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0 400 L200 150 L400 220 L600 80 L800 170 L1000 50 L1200 130 L1440 90 L1440 400 Z" fill="white" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <ArgFlag className="w-16 mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Construida desde adentro.<br />
                <span className="text-amber-300">Por argentinos, para argentinos.</span>
              </h2>
              <p className="text-sky-200 mb-8 leading-relaxed text-lg">
                Sabemos lo que es el dólar que sube, el proveedor que no espera y el banco que cierra a las 15hs. Por eso hicimos una plataforma que no duerme y no pone excusas.
              </p>
              <div className="space-y-4">
                {[
                  "Cuenta en pesos y dólares sin costo de apertura",
                  "Transferencias las 24hs, los 365 días del año",
                  "Pagos programados — nunca más olvidar a un proveedor",
                  "eCheqs digitales con validación inmediata",
                  "Rendimiento automático sobre tu saldo en pesos",
                  "Soporte en castellano, rápido, de personas reales",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sky-100 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register"
                className="inline-flex items-center gap-2 mt-10 bg-amber-400 hover:bg-amber-300 text-blue-900 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg group">
                Empezar ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Seguridad bancaria", desc: "Encriptación de nivel financiero y 2FA en cada acceso." },
                { icon: BarChart3, title: "Reportes en tiempo real", desc: "Tu flujo de caja visible en segundos, sin esperar al contador." },
                { icon: Globe2, title: "Multi-moneda nativo", desc: "ARS y USD en la misma pantalla, sin conversiones manuales." },
                { icon: Mountain, title: "Siempre disponible", desc: "Operá desde el Altiplano o la Patagonia. El sistema no para." },
              ].map((card, i) => (
                <div key={card.title}
                  className="p-5 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                  <card.icon className="w-6 h-6 text-amber-300 mb-3" />
                  <p className="font-bold text-white text-sm mb-1">{card.title}</p>
                  <p className="text-xs text-sky-200 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIOS ════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-3xl mb-3 block">🤝</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Ellos ya lo usan. Sus palabras, no las nuestras.
            </h2>
            <p className="text-gray-500">PyMEs de todo el país que eligieron una forma distinta de manejar la plata.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-2xl ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.company}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-sky-600 font-medium mt-0.5">
                      <MapPin className="w-3 h-3" /> {t.region}
                    </span>
                  </div>
                </div>
                {/* Comilla decorativa */}
                <div className="text-sky-200 text-5xl font-serif leading-none mb-2 select-none">"</div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">{t.text}</p>
                <ArgFlag className="w-12 mt-5" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL — con pampa y cielo ════════ */}
      <section className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 30%, #FCD34D 60%, #F59E0B 100%)" }}>
        {/* Cordillera en el fondo */}
        <div className="absolute bottom-0 left-0 right-0 opacity-20">
          <svg viewBox="0 0 1440 160" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 160 L160 60 L320 100 L480 20 L640 80 L800 10 L960 60 L1120 40 L1280 70 L1440 30 L1440 160 Z"
              fill="#0C2D6B" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <SolDeMayo size={64} />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4 mt-6 leading-tight">
            Argentina no para.<br />Tu empresa tampoco.
          </h2>
          <p className="text-blue-800/70 text-lg mb-2">Abrí tu cuenta en minutos. Sin papeles, sin sucursales.</p>
          <p className="text-blue-700 font-semibold mb-10">Gratis para siempre en el plan Starter.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold px-9 py-4 rounded-2xl transition-all shadow-xl group">
              Crear mi cuenta gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/precios"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-900/30 text-blue-900 hover:bg-blue-900/10 font-semibold px-9 py-4 rounded-2xl transition-all">
              Ver planes y precios
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
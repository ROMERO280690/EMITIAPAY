import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Zap, Shield, Globe2,
  Users, BarChart3, MapPin,
  Send, Download, FileCheck, TrendingUp, Building2,
  ArrowUpRight, ArrowDownLeft, Clock, ChevronRight,
  Sparkles, Star
} from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import GridBackground from "@/components/public/GridBackground";
import AnimatedCounter from "@/components/public/AnimatedCounter";

const NAVY = "#0A2540";
const EMERALD = "#00D1B2";

/* ─── helpers ─── */
function ArgFlag({ className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="h-1 bg-sky-400 w-full rounded-sm" />
      <div className="h-1 bg-white w-full" />
      <div className="h-1 bg-sky-400 w-full rounded-sm" />
    </div>
  );
}

function SolDeMayo({ size = 40 }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {rays.map((_, i) => {
        const angle = (i * 360) / 16;
        const isStraight = i % 2 === 0;
        const r1 = isStraight ? 13 : 12; const r2 = isStraight ? 19 : 17;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + r1 * Math.cos(rad); const y1 = 20 + r1 * Math.sin(rad);
        const x2 = 20 + r2 * Math.cos(rad); const y2 = 20 + r2 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth={isStraight ? 2 : 1.2} strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="8" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="20" cy="20" r="5" fill="#FBBF24" />
    </svg>
  );
}

function WavyFlag() {
  return (
    <svg viewBox="0 0 600 360" className="w-full h-auto drop-shadow-xl" aria-hidden>
      <defs>
        <linearGradient id="flagShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path d="M0,20 C150,70 450,-30 600,20 L600,140 C450,90 150,190 0,140 Z" fill="#7DD3FC" />
      <path d="M0,140 C150,190 450,90 600,140 L600,260 C450,210 150,310 0,260 Z" fill="#FFFFFF" />
      <path d="M0,260 C150,310 450,210 600,260 L600,340 C450,290 150,390 0,340 Z" fill="#7DD3FC" />
      <path d="M0,20 C150,70 450,-30 600,20 L600,340 C450,290 150,390 0,340 Z" fill="url(#flagShade)" />
      <circle cx="300" cy="180" r="26" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 360) / 12;
        const rad = (a * Math.PI) / 180;
        return <line key={i} x1={300 + 28 * Math.cos(rad)} y1={180 + 28 * Math.sin(rad)} x2={300 + 40 * Math.cos(rad)} y2={180 + 40 * Math.sin(rad)} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}

/* ─── Dashboard mock visual (perspectiva 3D) ─── */
function DashboardMock() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden text-xs">
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: NAVY }}>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"/></div>
        <div className="flex-1 text-center"><span className="text-white/40 text-[10px]">app.emitia.com/dashboard</span></div>
      </div>
      <div className="flex h-64">
        <div className="w-28 px-2 py-3 space-y-0.5 flex-shrink-0" style={{ background: NAVY }}>
          {[
            { label: "Inicio", active: true },
            { label: "Movimientos", active: false },
            { label: "Pagos", active: false },
            { label: "Cobros", active: false },
            { label: "Inversiones", active: false },
          ].map(item => (
            <div key={item.label} className="px-2 py-1.5 rounded-lg text-[9px] font-medium"
              style={item.active ? { background: EMERALD, color: NAVY } : { color: "rgba(255,255,255,0.55)" }}>{item.label}</div>
          ))}
        </div>
        <div className="flex-1 bg-slate-50 p-3 space-y-2 overflow-hidden">
          <p className="text-[10px] font-bold text-gray-700">Buenos días, María 👋</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
              <p className="text-[9px] text-gray-400 mb-0.5">Cuenta ARS</p>
              <p className="font-extrabold text-gray-900 text-sm">$ 2.458.320</p>
              <p className="text-[9px] font-medium" style={{ color: EMERALD }}>↑ 38.64% TNA</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
              <p className="text-[9px] text-gray-400 mb-0.5">Cuenta USD</p>
              <p className="font-extrabold text-gray-900 text-sm">US$ 15.200</p>
              <p className="text-[9px] text-blue-600 font-medium">Saldo disponible</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-gray-50 flex justify-between items-center">
              <p className="text-[9px] font-semibold text-gray-600">Últimos movimientos</p>
              <span className="text-[8px] font-medium" style={{ color: EMERALD }}>Ver todos</span>
            </div>
            {[
              { label: "Pago proveedor", sub: "Proveedores · hoy", amount: "- $45.000", color: "text-red-500", icon: ArrowUpRight },
              { label: "Cobro FC-1092", sub: "Cobros · ayer", amount: "+ $120.000", color: "text-emerald-600", icon: ArrowDownLeft },
              { label: "Rendimiento FCI", sub: "Inversiones · ayer", amount: "+ $3.840", color: "text-emerald-600", icon: TrendingUp },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 border-b border-gray-50 last:border-0">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${m.color === "text-red-500" ? "bg-red-50" : "bg-emerald-50"}`}>
                  <m.icon className={`w-3 h-3 ${m.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-medium text-gray-800 truncate">{m.label}</p>
                  <p className="text-[8px] text-gray-400">{m.sub}</p>
                </div>
                <span className={`text-[9px] font-bold ${m.color}`}>{m.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Datos ─── */
const PRODUCTS = [
  { key: "cuentas", icon: Globe2, color: "bg-blue-500", label: "Cuenta CBU", desc: "Abrí tu cuenta corriente empresarial 100% digital. Operativa en menos de 24hs con CBU propio.", href: "/servicio/cuentas", accent: "#3B82F6" },
  { key: "pagos", icon: Send, color: "bg-indigo-500", label: "Pagos inteligentes", desc: "Programá pagos únicos o recurrentes a proveedores, sueldos e impuestos desde un solo lugar.", href: "/servicio/pagos", accent: "#6366F1" },
  { key: "cobros", icon: Download, color: "bg-violet-500", label: "Cobros inteligentes", desc: "Generá facturas con link de pago. El cliente paga y vos recibís el dinero automáticamente.", href: "/servicio/cobros", accent: "#8B5CF6" },
  { key: "echeqs", icon: FileCheck, color: "bg-cyan-500", label: "eCheqs", desc: "Emití, recibí y depositá cheques electrónicos sin pisar una sucursal. Validación inmediata.", href: "/servicio/echeqs", accent: "#06B6D4" },
  { key: "inversiones", icon: TrendingUp, color: "bg-emerald-500", label: "Inversiones", desc: "Plazo fijo desde 1 día, FCI, acciones y bonos. Tu plata trabaja mientras vos operás.", href: "/servicio/inversiones", accent: "#10B981" },
  { key: "financiamiento", icon: Building2, color: "bg-rose-500", label: "Financiamiento", desc: "Préstamos PyME, leasing y descuento de cheques. Aprobación en 24hs, sin burocracia.", href: "/servicio/financiamiento", accent: "#F43F5E" },
];

const BENEFITS = [
  { icon: Zap, title: "7 veces menos clics", desc: "Lo que antes requería visitar el banco, ahora son segundos desde tu teléfono." },
  { icon: Clock, title: "24/7 sin excepciones", desc: "Feriados, fines de semana, madrugadas. La plataforma no cierra." },
  { icon: Shield, title: "Seguridad bancaria", desc: "Encriptación financiera, 2FA y monitoreo antifraude en tiempo real." },
  { icon: Sparkles, title: "IA incorporada", desc: "Conciliación automática, alertas inteligentes y predicciones de flujo de caja." },
  { icon: Users, title: "Soporte en español", desc: "Personas reales, respuesta rápida. Sin bots, sin formularios kilométricos." },
];

const TESTIMONIALS = [
  { name: "Claudia Herrera", company: "Carnicería Don Roberto", region: "Neuquén, Patagonia", text: "Tengo una carnicería familiar hace 22 años. Nunca pensé que iba a poder manejar todo desde el teléfono. Los pagos a proveedores salen solos.", avatar: "CH", color: "bg-sky-700" },
  { name: "Facundo Ríos", company: "Transporte Ríos Hnos.", region: "Tucumán, NOA", text: "Somos tres hermanos y el negocio siempre fue un lío con la plata. EMITIA PAY nos ordenó. Los eCheqs ya no nos hacen perder días en el banco.", avatar: "FR", color: "bg-amber-700" },
  { name: "Valeria Ocampo", company: "Diseño & Co.", region: "Buenos Aires, AMBA", text: "Cobro en pesos y en dólares según el cliente. Antes era un caos. Ahora tengo todo en un lugar y los cobros automáticos me liberaron un montón de tiempo.", avatar: "VO", color: "bg-indigo-700" },
];

const PROVINCES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Tucumán", "Salta", "Neuquén", "Bariloche", "Mar del Plata", "Posadas", "La Quiaca", "Ushuaia"];

const STATS = [
  { prefix: "+", value: 5000, suffix: "", decimals: 0, label: "PyMEs activas", sub: "de La Quiaca a Ushuaia" },
  { prefix: "$ ", value: 2, suffix: "B+", decimals: 0, label: "Procesados al mes", sub: "en pagos, cobros e inversiones" },
  { prefix: "", value: 99.9, suffix: "%", decimals: 1, label: "Disponibilidad", sub: "no paramos ni los feriados" },
  { prefix: "$ ", value: 0, suffix: "", decimals: 0, label: "Costo de apertura", sub: "sin letra chica ni sorpresas" },
];

export default function Landing() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body overflow-x-hidden">
      <PublicNav transparent />

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden text-white" style={{ background: NAVY }}>
        <GridBackground tone="dark" />
        <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl" style={{ background: "rgba(0,209,178,0.18)" }} />
        <div className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl" style={{ background: "rgba(59,130,246,0.22)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
              🇦🇷 Hecho en Argentina, para Argentina
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5">
              Una sola cuenta para<br />
              <span style={{ color: EMERALD }}>cobrar, pagar y crecer.</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-lg">
              Administrá las finanzas de tu empresa en un solo lugar. 100% digital, siempre disponible, sin burocracia bancaria.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:scale-[1.03]"
                style={{ background: EMERALD, color: NAVY }}>
                Empezar gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/servicios" className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 transition-colors">
                Ver servicios
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="relative" style={{ perspective: "1200px" }}>
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.02, rotateY: -10, rotateX: 6 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative">
              <div className="absolute -inset-6 rounded-3xl blur-2xl" style={{ background: "rgba(0,209,178,0.12)" }} />
              <div className="relative" style={{ transform: "rotateY(-8deg) rotateX(5deg)" }}>
                <DashboardMock />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════ PRESENCIA (marquee) ════════ */}
      <section className="py-7 border-y border-gray-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> +5.000 PyMEs en toda la Argentina
          </p>
        </div>
        <div className="relative">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            className="flex gap-2 whitespace-nowrap w-max">
            {[...PROVINCES, ...PROVINCES].map((p, i) => (
              <span key={i} className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════ SUITE DE PRODUCTOS (grilla 3×2) ════════ */}
      <section className="relative py-24 bg-white">
        <GridBackground tone="light" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide" style={{ background: "rgba(0,209,178,0.1)", color: EMERALD }}>Suite de productos</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
              Todo en un solo lugar
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Cobros, pagos, inversiones y operaciones bancarias. Una sola plataforma. 7 veces menos clics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-4 shadow-md`}>
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1.5" style={{ color: NAVY }}>{p.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{p.desc}</p>
                <Link to={p.href} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: p.accent }}>
                  Conocé más <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ NÚMEROS (banda azul) ════════ */}
      <section className="relative py-20" style={{ background: "linear-gradient(180deg,#dbeafe 0%,#bfdbfe 100%)" }}>
        <GridBackground tone="light" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <p className="text-4xl sm:text-5xl font-extrabold mb-1" style={{ color: NAVY }}>
                  <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="font-semibold text-gray-800 text-sm mb-1">{s.label}</p>
                <p className="text-xs text-gray-500">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ BENEFICIOS ════════ */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide" style={{ background: "rgba(0,209,178,0.1)", color: EMERALD }}>Beneficios</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>
              La agilidad que querés,<br className="hidden sm:block" /> la seguridad que necesitás.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">La innovación de una fintech con el respaldo de una entidad regulada por el BCRA.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,209,178,0.1)" }}>
                  <b.icon className="w-5 h-5" style={{ color: EMERALD }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ IDENTIDAD ARGENTINA ════════ */}
      <section className="relative py-24 bg-gray-50">
        <GridBackground tone="light" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <ArgFlag className="w-16 mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 leading-tight" style={{ color: NAVY }}>
                Identidad argentina.<br />
                <span style={{ color: EMERALD }}>Por argentinos, para argentinos.</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                Sabemos lo que es el dólar que sube, el proveedor que no espera y el banco que cierra a las 15hs. Por eso hicimos una plataforma que no duerme y no pone excusas.
              </p>
              <div className="space-y-3">
                {[
                  "Cuenta en pesos y dólares sin costo de apertura",
                  "Transferencias las 24hs, los 365 días del año",
                  "Pagos programados — nunca más olvidar a un proveedor",
                  "eCheqs digitales con validación inmediata",
                  "Rendimiento automático sobre tu saldo en pesos",
                  "Soporte en castellano, rápido, de personas reales",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: EMERALD }} />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 mt-10 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg group text-white hover:scale-[1.03]"
                style={{ background: NAVY }}>
                Empezar ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <motion.div animate={{ rotate: [0, 1.5, 0, -1.5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
                <WavyFlag />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIOS ════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-gray-50 border border-gray-100 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">Testimonios</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: NAVY }}>
              Sus palabras, no las nuestras.
            </h2>
            <p className="text-gray-400">PyMEs de todo el país que eligieron una forma distinta de manejar la plata.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current" style={{ color: EMERALD }} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{t.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.company}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-sky-600 font-medium mt-0.5">
                      <MapPin className="w-3 h-3" /> {t.region}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className="relative py-24 overflow-hidden text-white" style={{ background: NAVY }}>
        <GridBackground tone="dark" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full blur-3xl" style={{ background: "rgba(0,209,178,0.15)" }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <SolDeMayo size={56} />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 mt-6 leading-tight">
            Argentina no para.<br />Tu empresa tampoco.
          </h2>
          <p className="text-white/70 text-lg mb-2">Abrí tu cuenta en minutos. Sin papeles, sin sucursales.</p>
          <p className="font-semibold mb-10" style={{ color: "#34D399" }}>Gratis para siempre en el plan Starter.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="flex-1 px-4 py-3.5 rounded-xl border border-white/15 bg-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-sm"
            />
            <Link to={`/register${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg whitespace-nowrap hover:scale-[1.03]"
              style={{ background: EMERALD, color: NAVY }}>
              Empezar gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link to="/precios" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-emerald-300 transition-colors">
            Ver planes y precios <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
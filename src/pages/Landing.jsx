import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Zap, Shield, Globe2,
  Users, Receipt, Landmark, PiggyBank, BarChart3, MapPin,
  Send, Download, FileCheck, TrendingUp, Building2,
  ArrowUpRight, ArrowDownLeft, Clock, ChevronRight,
  Sparkles, Lock, BadgeCheck
} from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

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

/* ─── Dashboard mock visual ─── */
function DashboardMock() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-xs">
      {/* Top bar */}
      <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/><div className="w-2.5 h-2.5 rounded-full bg-green-400"/></div>
        <div className="flex-1 text-center"><span className="text-slate-400 text-[10px]">app.emitia.com/dashboard</span></div>
      </div>
      {/* App shell */}
      <div className="flex h-64">
        {/* Sidebar */}
        <div className="w-28 bg-slate-900 px-2 py-3 space-y-0.5 flex-shrink-0">
          {[
            { label: "Inicio", active: true },
            { label: "Movimientos", active: false },
            { label: "Pagos", active: false },
            { label: "Cobros", active: false },
            { label: "Inversiones", active: false },
          ].map(item => (
            <div key={item.label} className={`px-2 py-1.5 rounded-lg text-[9px] font-medium ${item.active ? "bg-indigo-600 text-white" : "text-slate-400"}`}>{item.label}</div>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 bg-slate-50 p-3 space-y-2 overflow-hidden">
          <p className="text-[10px] font-bold text-gray-700">Buenos días, María 👋</p>
          {/* Balances */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-2.5 border border-gray-100">
              <p className="text-[9px] text-gray-400 mb-0.5">Cuenta ARS</p>
              <p className="font-extrabold text-gray-900 text-sm">$ 2.458.320</p>
              <p className="text-[9px] text-emerald-600 font-medium">↑ 38.64% TNA</p>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-gray-100">
              <p className="text-[9px] text-gray-400 mb-0.5">Cuenta USD</p>
              <p className="font-extrabold text-gray-900 text-sm">US$ 15.200</p>
              <p className="text-[9px] text-blue-600 font-medium">Saldo disponible</p>
            </div>
          </div>
          {/* Movimientos */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-gray-50 flex justify-between items-center">
              <p className="text-[9px] font-semibold text-gray-600">Últimos movimientos</p>
              <span className="text-[8px] text-indigo-500 font-medium">Ver todos</span>
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
  {
    key: "cuentas",
    icon: Globe2,
    color: "bg-blue-500",
    label: "Cuenta CBU",
    headline: "Cuentas en Pesos y Dólares sin costo de apertura",
    desc: "Abrí tu cuenta corriente empresarial 100% digital. Sin turnos, sin papeles, sin vueltas. Operativa en menos de 24 horas con CBU propio.",
    bullets: ["ARS y USD en la misma plataforma", "CBU habilitado para cobrar y pagar", "Cuenta remunerada automática al 38.64% TNA", "Transferencias las 24hs, los 365 días"],
    href: "/servicio/cuentas",
    accent: "#3B82F6",
  },
  {
    key: "pagos",
    icon: Send,
    color: "bg-indigo-500",
    label: "Pagos inteligentes",
    headline: "Pagá a todos tus proveedores en segundos",
    desc: "Programá pagos únicos o recurrentes. Gestión masiva de proveedores, sueldos e impuestos desde un solo lugar. EMITIA PAY los ejecuta puntualmente.",
    bullets: ["Pagos programados y recurrentes", "Carga masiva de proveedores", "Categorización automática", "Historial y comprobantes instantáneos"],
    href: "/servicio/pagos",
    accent: "#6366F1",
  },
  {
    key: "cobros",
    icon: Download,
    color: "bg-violet-500",
    label: "Cobros inteligentes",
    headline: "Cobrá a tus clientes de forma automática",
    desc: "Generá facturas digitales con link de pago. El cliente paga, vos recibís la notificación y el dinero en tu cuenta. Sin intermediarios.",
    bullets: ["Link de pago por WhatsApp o email", "Notificaciones automáticas", "Conciliación automática", "Portal de clientes incluido"],
    href: "/servicio/cobros",
    accent: "#8B5CF6",
  },
  {
    key: "echeqs",
    icon: FileCheck,
    color: "bg-cyan-500",
    label: "eCheqs",
    headline: "El cheque físico quedó en el pasado",
    desc: "Emití, recibí y depositá cheques electrónicos sin pisar una sucursal. Validación inmediata y trazabilidad completa de cada operación.",
    bullets: ["Emisión y depósito 100% digital", "Validación en tiempo real", "Endoso electrónico", "Integración con cuentas propias"],
    href: "/servicio/echeqs",
    accent: "#06B6D4",
  },
  {
    key: "inversiones",
    icon: TrendingUp,
    color: "bg-emerald-500",
    label: "Inversiones",
    headline: "Hacé rendir el saldo de tu empresa",
    desc: "Plazo fijo desde 1 día, FCI de money market, acciones y bonos. Tu plata trabaja mientras vos te ocupás del negocio.",
    bullets: ["Plazo fijo desde 1 día al 38.64% TNA", "FCI con liquidez inmediata", "Diversificación en acciones y bonos", "Sin montos mínimos"],
    href: "/servicio/inversiones",
    accent: "#10B981",
  },
  {
    key: "financiamiento",
    icon: Building2,
    color: "bg-rose-500",
    label: "Financiamiento",
    headline: "Capital cuando lo necesitás",
    desc: "Préstamos para capital de trabajo, leasing y descuento de cheques. Aprobación en 24hs, sin burocracia, sin filas.",
    bullets: ["Préstamos PyME desde 30 días", "Leasing de equipos", "Descuento de cheques", "Respuesta en menos de 24hs"],
    href: "/servicio/financiamiento",
    accent: "#F43F5E",
  },
];

const BENEFITS = [
  { icon: Zap, title: "7 veces menos clics", desc: "Lo que antes requería visitar el banco, ahora son segundos desde tu teléfono." },
  { icon: Clock, title: "24/7 sin excepciones", desc: "Feriados, fines de semana, madrugadas. La plataforma no cierra." },
  { icon: Shield, title: "Seguridad bancaria", desc: "Encriptación financiera, 2FA y monitoreo antifraude en tiempo real." },
  { icon: BadgeCheck, title: "Respaldo institucional", desc: "Operamos a través de entidades reguladas por el BCRA." },
  { icon: Sparkles, title: "IA incorporada", desc: "Conciliación automática, alertas inteligentes y predicciones de flujo de caja." },
  { icon: Users, title: "Soporte en español", desc: "Personas reales, respuesta rápida. Sin bots, sin formularios kilométricos." },
];

const TESTIMONIALS = [
  { name: "Claudia Herrera", company: "Carnicería Don Roberto", region: "Neuquén, Patagonia", text: "Tengo una carnicería familiar hace 22 años. Nunca pensé que iba a poder manejar todo desde el teléfono. Los pagos a proveedores salen solos.", avatar: "CH", color: "bg-sky-700" },
  { name: "Facundo Ríos", company: "Transporte Ríos Hnos.", region: "Tucumán, NOA", text: "Somos tres hermanos y el negocio siempre fue un lío con la plata. EMITIA PAY nos ordenó. Los eCheqs ya no nos hacen perder días en el banco.", avatar: "FR", color: "bg-amber-700" },
  { name: "Valeria Ocampo", company: "Diseño & Co.", region: "Buenos Aires, AMBA", text: "Cobro en pesos y en dólares según el cliente. Antes era un caos. Ahora tengo todo en un lugar y los cobros automáticos me liberaron un montón de tiempo.", avatar: "VO", color: "bg-indigo-700" },
];

const PROVINCES = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Tucumán", "Salta", "Neuquén", "Bariloche", "Mar del Plata", "Posadas", "La Quiaca", "Ushuaia"];

export default function Landing() {
  const [email, setEmail] = useState("");
  const [activeProduct, setActiveProduct] = useState(0);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body overflow-x-hidden">
      <PublicNav transparent />

      {/* ════════ HERO ════════ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #F8FAFF 0%, #EEF4FF 50%, #F0F9FF 100%)" }}>
        {/* Decoración fondo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span>🇦🇷</span> Hecho en Argentina, para Argentina
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Una sola cuenta para<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #2563EB, #7C3AED)" }}>
                  cobrar, pagar y crecer.
                </span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                Administrá las finanzas de tu empresa en un solo lugar. 100% digital, siempre disponible, sin burocracia bancaria.
              </p>

              {/* Email CTA */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mb-5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ingresá tu mail de trabajo"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm"
                />
                <Link to={`/register${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                  className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md whitespace-nowrap">
                  Empezar gratis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <Link to="/servicios" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Probá una demo <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Trust badges */}
              <div className="flex items-center gap-4 mt-8 flex-wrap">
                {[
                  { icon: Shield, text: "Cuenta bancaria regulada BCRA" },
                  { icon: Lock, text: "Encriptación SSL 256-bit" },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <b.icon className="w-3.5 h-3.5 text-emerald-500" /> {b.text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Dashboard mockup */}
            <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:block">
              <DashboardMock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ LOGOS / PRESENCIA ════════ */}
      <section className="py-8 border-y border-gray-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5 flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> +5.000 PyMEs en toda la Argentina
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {PROVINCES.map((p) => (
              <span key={p} className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SUITE DE PRODUCTOS (tabs interactivos) ════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">Suite de productos</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Todo en un solo lugar
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Cobros, pagos, inversiones y operaciones bancarias. Una sola plataforma. 7 veces menos clics.
            </p>
          </div>

          {/* Tab pills */}
          <div className="flex gap-2 flex-wrap justify-center mb-12">
            {PRODUCTS.map((p, i) => (
              <button key={p.key} onClick={() => setActiveProduct(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeProduct === i
                  ? "text-white border-transparent shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
                style={activeProduct === i ? { backgroundColor: p.accent, borderColor: p.accent } : {}}>
                <p.icon className="w-3.5 h-3.5" /> {p.label}
              </button>
            ))}
          </div>

          {/* Active panel */}
          {PRODUCTS.map((p, i) => i === activeProduct && (
            <motion.div key={p.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center mb-5`}>
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{p.headline}</h3>
                <p className="text-gray-500 text-base mb-7 leading-relaxed">{p.desc}</p>
                <div className="space-y-3 mb-8">
                  {p.bullets.map(b => (
                    <div key={b} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: p.accent }} />
                      <span className="text-gray-700 text-sm">{b}</span>
                    </div>
                  ))}
                </div>
                <Link to={p.href}
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all text-white shadow-md hover:opacity-90"
                  style={{ backgroundColor: p.accent }}>
                  Conocé más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Right visual */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-100 flex items-center justify-center min-h-[280px]">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-3xl ${p.color} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                    <p.icon className="w-10 h-10 text-white" />
                  </div>
                  <p className="font-extrabold text-2xl text-gray-900 mb-1">{p.label}</p>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">{p.desc.split(".")[0]}.</p>
                  <Link to={p.href} className="inline-flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: p.accent }}>
                    Ver detalles <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ NÚMEROS ════════ */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "+5.000", label: "PyMEs activas", sub: "de La Quiaca a Ushuaia" },
              { value: "$ 2B+", label: "Procesados al mes", sub: "en pagos, cobros e inversiones" },
              { value: "99.9%", label: "Disponibilidad", sub: "no paramos ni los feriados" },
              { value: "$ 0", label: "Costo de apertura", sub: "sin letra chica ni sorpresas" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <p className="text-4xl font-extrabold text-blue-700 mb-1">{s.value}</p>
                <p className="font-semibold text-gray-800 text-sm mb-1">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ BENEFICIOS ════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">Por qué EMITIA PAY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              La agilidad que querés,<br className="hidden sm:block" /> la seguridad que necesitás.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">La innovación de una fintech con el respaldo de una entidad regulada por el BCRA.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ IDENTIDAD ARGENTINA ════════ */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0C2D6B 0%, #1A4FB5 50%, #2563EB 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1440 400" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0 400 L200 150 L400 220 L600 80 L800 170 L1000 50 L1200 130 L1440 90 L1440 400 Z" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <ArgFlag className="w-16 mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
                Construida desde adentro.<br />
                <span className="text-amber-300">Por argentinos, para argentinos.</span>
              </h2>
              <p className="text-sky-200 mb-8 leading-relaxed text-lg">
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sky-100 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 mt-10 bg-amber-400 hover:bg-amber-300 text-blue-900 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg group">
                Empezar ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Regulado BCRA", desc: "Operamos con entidades financieras autorizadas y reguladas." },
                { icon: BarChart3, title: "Reportes en tiempo real", desc: "Tu flujo de caja visible en segundos, sin esperar al contador." },
                { icon: Globe2, title: "Multi-moneda nativo", desc: "ARS y USD en la misma pantalla, sin conversiones manuales." },
                { icon: Zap, title: "Siempre disponible", desc: "Desde el Altiplano o la Patagonia. El sistema no para." },
              ].map((card) => (
                <div key={card.title} className="p-5 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-white border border-gray-100 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">Casos reales</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Sus palabras, no las nuestras.
            </h2>
            <p className="text-gray-400">PyMEs de todo el país que eligieron una forma distinta de manejar la plata.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="text-blue-100 text-5xl font-serif leading-none mb-3 select-none">"</div>
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
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SolDeMayo size={56} />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 mt-6 leading-tight">
            Argentina no para.<br />Tu empresa tampoco.
          </h2>
          <p className="text-gray-400 text-lg mb-2">Abrí tu cuenta en minutos. Sin papeles, sin sucursales.</p>
          <p className="text-blue-700 font-semibold mb-10">Gratis para siempre en el plan Starter.</p>
          {/* Email CTA final */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="tu@empresa.com"
              className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm"
            />
            <Link to="/register"
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg whitespace-nowrap">
              Empezar gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link to="/precios" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition-colors">
            Ver planes y precios <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
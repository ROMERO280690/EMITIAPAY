import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe2, Zap, Users, Receipt, Landmark, PiggyBank, ArrowRight, CheckCircle2 } from "lucide-react";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";
import HeroSlider from "@/components/public/HeroSlider";
import { MeshBackground, TiltCard } from "@/components/public/MeshKit";

const SERVICES = [
  {
    id: "cuentas",
    icon: Globe2,
    color: "indigo",
    title: "Cuentas Multi-moneda",
    subtitle: "Operá en ARS y USD sin fricciones",
    desc: "Abrí cuentas en pesos y dólares sin costo de apertura. Gestioná tu liquidez en ambas monedas, realizá transferencias instantáneas y recibí pagos de clientes locales e internacionales.",
    features: ["Cuenta en pesos (ARS) sin costo", "Cuenta en dólares (USD)", "CBU y alias personalizados", "Transferencias 24/7", "Saldo remunerado automático"],
    path: "/servicio/cuentas",
  },
  {
    id: "pagos",
    icon: Zap,
    color: "violet",
    title: "Pagos Inteligentes",
    subtitle: "Automatizá todos tus pagos a proveedores",
    desc: "Programá pagos únicos o recurrentes a proveedores, empleados y servicios. Configurá fechas, montos y frecuencias. EMITIA PAY ejecuta los pagos de forma automática.",
    features: ["Pagos programados y recurrentes", "Aprobaciones en un clic", "Pagos masivos (nómina)", "Historial y comprobantes", "Alertas de saldo insuficiente"],
    path: "/servicio/pagos",
  },
  {
    id: "cobros",
    icon: Users,
    color: "emerald",
    title: "Cobros Automáticos",
    subtitle: "Cobrá a tus clientes sin perseguirlos",
    desc: "Generá facturas digitales y enlace de pago en segundos. Mandá recordatorios automáticos y recibí notificaciones cuando el cliente pague.",
    features: ["Facturas digitales con link de pago", "Recordatorios automáticos", "Seguimiento en tiempo real", "Marca el cobro como pagado", "Historial de cobros"],
    path: "/servicio/cobros",
  },
  {
    id: "echeqs",
    icon: Receipt,
    color: "amber",
    title: "eCheqs Digitales",
    subtitle: "El cheque electrónico simple y seguro",
    desc: "Emitís, recibís y gestionás cheques electrónicos 100% digitales. Sin papel, sin riesgos de pérdida y con validación inmediata.",
    features: ["Emisión de eCheqs en minutos", "Recepción y depósito digital", "Seguimiento de estado", "Integración con tus cuentas", "Seguridad bancaria garantizada"],
    path: "/servicio/echeqs",
  },
  {
    id: "inversiones",
    icon: Landmark,
    color: "blue",
    title: "Inversiones",
    subtitle: "Hacé crecer la liquidez de tu empresa",
    desc: "Invertí el capital de trabajo excedente en plazo fijo, fondos comunes de inversión (FCI), acciones y bonos. Todo desde la plataforma, sin intermediarios.",
    features: ["Plazo fijo desde 1 día", "Fondos comunes de inversión", "Acceso a acciones y bonos", "Rendimientos visibles en tiempo real", "Sin montos mínimos"],
    path: "/servicio/inversiones",
  },
  {
    id: "financiamiento",
    icon: PiggyBank,
    color: "rose",
    title: "Financiamiento PyME",
    subtitle: "Capital cuando lo necesitás",
    desc: "Solicitá préstamos para capital de trabajo, leasing de equipos o descuento de cheques. Aprobación rápida sin burocracia.",
    features: ["Préstamos para capital de trabajo", "Leasing de equipos", "Descuento de cheques", "Aprobación en 24hs", "Sin garantías reales para montos menores"],
    path: "/servicio/financiamiento",
  },
];

const colorMap = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700", border: "border-indigo-200", btn: "bg-indigo-600 hover:bg-indigo-700" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700", border: "border-violet-200", btn: "bg-violet-600 hover:bg-violet-700" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-200", btn: "bg-emerald-600 hover:bg-emerald-700" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700", border: "border-amber-200", btn: "bg-amber-600 hover:bg-amber-700" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700", border: "border-blue-200", btn: "bg-blue-600 hover:bg-blue-700" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", badge: "bg-rose-100 text-rose-700", border: "border-rose-200", btn: "bg-rose-600 hover:bg-rose-700" },
};

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white font-body">
      <PublicNav />

      {/* Hero Slider */}
      <HeroSlider
        autoplay={5500}
        slides={[
          {
            badge: "Todos los servicios",
            title: <>Una plataforma,<br />todo lo que necesitás.</>,
            description: "Cada herramienta diseñada para simplificar las finanzas de tu PyME. Sin fricción, sin burocracia.",
            cta: { label: "Empezar gratis", href: "/register" },
            ctaSecondary: { label: "Ver precios", href: "/precios" },
            bgStyle: { background: "linear-gradient(135deg,#1E1B4B 0%,#3730A3 60%,#4F46E5 100%)" },
          },
          {
            badge: "🏦 Cuentas multi-moneda",
            title: <>ARS y USD.<br /><span style={{ color: "#A5F3FC" }}>Una sola pantalla.</span></>,
            description: "Operá en pesos y dólares sin fricciones. CBU propio, transferencias 24/7 y saldo remunerado automático.",
            cta: { label: "Ver cuentas", href: "/servicio/cuentas" },
            bgStyle: { background: "linear-gradient(135deg,#0C2D6B 0%,#1D4ED8 100%)" },
          },
          {
            badge: "📄 eCheqs digitales",
            title: <>El cheque de papel<br /><span style={{ color: "#FDE68A" }}>quedó en el pasado.</span></>,
            description: "Emitís, recibís y depositás cheques electrónicos 100% digitales. Sin papel, sin pérdidas, con validación inmediata.",
            cta: { label: "Ver eCheqs", href: "/servicio/echeqs" },
            bgStyle: { background: "linear-gradient(135deg,#78350F 0%,#B45309 60%,#D97706 100%)" },
          },
        ]}
      />

      {/* Services */}
      <section className="relative py-16 overflow-hidden">
        <MeshBackground className="opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {SERVICES.map((s, i) => {
            const c = colorMap[s.color];
            const isEven = i % 2 === 0;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${isEven ? "" : "lg:grid-flow-col-dense"}`}>
                <div className={isEven ? "" : "lg:col-start-2"}>
                  <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <s.icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${c.badge}`}>{s.subtitle}</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{s.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${c.icon}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className={`inline-flex items-center gap-2 ${c.btn} text-white font-semibold px-6 py-3 rounded-xl transition-colors`}>
                    Empezar ahora <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className={isEven ? "" : "lg:col-start-1 lg:row-start-1"} style={{ perspective: "1100px" }}>
                <TiltCard intensity={9} className="h-full">
                <div className={`rounded-2xl overflow-hidden border ${c.border} shadow-md h-full`} style={{ boxShadow: `0 24px 50px -22px ${s.id === "cuentas" ? "#3B82F6" : "#6366F1"}33` }}>
                  {/* Mock app header */}
                  <div className={`${c.bg} px-5 py-4 flex items-center gap-3 border-b ${c.border}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${c.border} bg-white`}>
                      <s.icon className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                      <p className={`text-xs font-medium ${c.icon}`}>EMITIA PAY</p>
                    </div>
                    <span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">● Activo</span>
                  </div>
                  <div className="bg-white p-5 space-y-2">
                    {s.features.map((f, j) => (
                      <div key={f} className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100`}>
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${c.icon}`} />
                        <span className="text-sm text-gray-700 font-medium">{f}</span>
                      </div>
                    ))}
                    <Link to={s.path} className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold mt-3 hover:opacity-90 transition-opacity ${c.btn}`}>
                      Ver {s.title} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                </TiltCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Empezá hoy mismo</h2>
          <p className="text-indigo-200 mb-8">Sin papeles, sin sucursales. Tu cuenta lista en minutos.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
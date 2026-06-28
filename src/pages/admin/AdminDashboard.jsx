import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, Wallet, Receipt, PiggyBank,
  ArrowRight, AlertTriangle, CheckCircle2, Clock, ArrowUpRight,
  ArrowDownLeft, BarChart3, Building2, Landmark
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const VOLUME_DATA = [
  { mes: "Ene", ingreso: 18500000, egreso: 12300000 },
  { mes: "Feb", ingreso: 22100000, egreso: 15800000 },
  { mes: "Mar", ingreso: 19800000, egreso: 14200000 },
  { mes: "Abr", ingreso: 28400000, egreso: 18900000 },
  { mes: "May", ingreso: 31200000, egreso: 22100000 },
  { mes: "Jun", ingreso: 35800000, egreso: 24600000 },
];

const PORTFOLIO_DATA = [
  { name: "Plazo Fijo", value: 45, color: "#6366f1" },
  { name: "FCI", value: 28, color: "#3b82f6" },
  { name: "Bonos", value: 17, color: "#8b5cf6" },
  { name: "Acciones", value: 10, color: "#06b6d4" },
];

const RECENT_OPS = [
  { type: "transfer_in", company: "Tech Solutions S.A.", amount: 850000, cur: "ARS", time: "hace 5 min", status: "completed" },
  { type: "payment", company: "Distribuidora Norte", amount: 320000, cur: "ARS", time: "hace 12 min", status: "completed" },
  { type: "echeq", company: "Constructora LM", amount: 1200000, cur: "ARS", time: "hace 28 min", status: "pending" },
  { type: "financing", company: "Studio LM", amount: 2500000, cur: "ARS", time: "hace 45 min", status: "approved" },
  { type: "transfer_out", company: "Vera & Asociados", amount: 180000, cur: "ARS", time: "hace 1h", status: "completed" },
  { type: "investment", company: "Exporta Sur S.R.L.", amount: 500000, cur: "ARS", time: "hace 2h", status: "active" },
];

const ALERTS = [
  { type: "warning", msg: "eCheq #ECH-0091 sin fondos suficientes — Constructora LM", time: "hace 8 min" },
  { type: "error", msg: "Solicitud de financiamiento rechazada en revisión KYC — Studio RS", time: "hace 22 min" },
  { type: "info", msg: "3 nuevas solicitudes KYC pendientes de aprobación", time: "hace 1h" },
];

const STATUS_MAP = {
  completed: { label: "Completado", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobado", color: "bg-blue-100 text-blue-700" },
  active: { label: "Activo", color: "bg-indigo-100 text-indigo-700" },
};

const TYPE_MAP = {
  transfer_in: { icon: ArrowDownLeft, color: "text-emerald-600 bg-emerald-50", label: "Transferencia entrante" },
  transfer_out: { icon: ArrowUpRight, color: "text-red-500 bg-red-50", label: "Transferencia saliente" },
  payment: { icon: Receipt, color: "text-violet-600 bg-violet-50", label: "Pago" },
  echeq: { icon: Receipt, color: "text-amber-600 bg-amber-50", label: "eCheq" },
  financing: { icon: PiggyBank, color: "text-rose-600 bg-rose-50", label: "Financiamiento" },
  investment: { icon: Landmark, color: "text-blue-600 bg-blue-50", label: "Inversión" },
};

export default function AdminDashboard() {
  const { data: accounts = [] } = useQuery({ queryKey: ["admin_accounts"], queryFn: () => base44.entities.Account.list() });
  const { data: transactions = [] } = useQuery({ queryKey: ["admin_transactions"], queryFn: () => base44.entities.Transaction.list("-created_date", 50) });
  const { data: investments = [] } = useQuery({ queryKey: ["admin_investments"], queryFn: () => base44.entities.Investment.list() });
  const { data: financings = [] } = useQuery({ queryKey: ["admin_financings"], queryFn: () => base44.entities.FinancingRequest.list() });
  const { data: echeqs = [] } = useQuery({ queryKey: ["admin_echeqs"], queryFn: () => base44.entities.ECheq.list() });
  const { data: collections = [] } = useQuery({ queryKey: ["admin_collections"], queryFn: () => base44.entities.CollectionRequest.list() });

  const totalARS = accounts.filter(a => a.currency === "ARS").reduce((s, a) => s + (a.balance || 0), 0);
  const totalUSD = accounts.filter(a => a.currency === "USD").reduce((s, a) => s + (a.balance || 0), 0);
  const totalInvested = investments.filter(i => i.status === "active").reduce((s, i) => s + (i.amount || 0), 0);
  const pendingFinancing = financings.filter(f => f.status === "pending").reduce((s, f) => s + (f.requested_amount || 0), 0);
  const pendingEcheqs = echeqs.filter(e => e.status === "pendiente" || e.status === "emitido").length;
  const overdueCollections = collections.filter(c => c.status === "overdue").length;

  const KPIS = [
    { label: "Saldo total ARS", value: fmt(totalARS || 35800000), sub: "+8.4% este mes", trend: "up", icon: Wallet, color: "indigo" },
    { label: "Saldo total USD", value: fmt(totalUSD || 92400, "USD"), sub: "+2.1% este mes", trend: "up", icon: TrendingUp, color: "blue" },
    { label: "Inversiones activas", value: fmt(totalInvested || 18200000), sub: `${investments.filter(i => i.status === "active").length || 24} posiciones`, trend: "up", icon: Landmark, color: "violet" },
    { label: "Financiamientos pendientes", value: fmt(pendingFinancing || 7500000), sub: `${financings.filter(f => f.status === "pending").length || 8} solicitudes`, trend: "neutral", icon: PiggyBank, color: "rose" },
    { label: "Empresas activas", value: accounts.length > 0 ? `${new Set(accounts.map(a => a.created_by_id)).size}` : "47", sub: "+3 este mes", trend: "up", icon: Building2, color: "emerald" },
    { label: "eCheqs en circulación", value: pendingEcheqs > 0 ? pendingEcheqs : "31", sub: `${overdueCollections || 2} vencidos próx.`, trend: "neutral", icon: Receipt, color: "amber" },
  ];

  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-sm text-gray-500 mt-0.5">{format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Sistema operativo
          </span>
        </div>
      </div>

      {/* Alertas activas */}
      {ALERTS.length > 0 && (
        <div className="space-y-2">
          {ALERTS.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                a.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
                a.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" :
                "bg-blue-50 border-blue-200 text-blue-700"
              }`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{a.msg}</span>
              <span className="text-xs opacity-70 flex-shrink-0">{a.time}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPIS.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colorMap[k.color]}`}>
                  <k.icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{k.value}</p>
                <p className={`text-xs mt-1 font-medium ${k.trend === "up" ? "text-emerald-600" : "text-gray-400"}`}>{k.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Volume chart */}
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900">Volumen de operaciones</h3>
                <p className="text-xs text-gray-500">Ingresos vs egresos — últimos 6 meses</p>
              </div>
              <Link to="/admin/reportes" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                Ver completo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={VOLUME_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="egGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tickFormatter={(v) => `$${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip formatter={(v) => fmt(v)} labelStyle={{ fontWeight: 600 }} />
                <Area type="monotone" dataKey="ingreso" name="Ingresos" stroke="#6366f1" strokeWidth={2} fill="url(#ingGrad)" />
                <Area type="monotone" dataKey="egreso" name="Egresos" stroke="#ef4444" strokeWidth={2} fill="url(#egGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portfolio pie */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Portafolio de inversiones</h3>
            <p className="text-xs text-gray-500 mb-4">Distribución por instrumento</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={PORTFOLIO_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {PORTFOLIO_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {PORTFOLIO_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent operations */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Últimas operaciones</h3>
              <Link to="/admin/transacciones" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {RECENT_OPS.map((op, i) => {
                const t = TYPE_MAP[op.type];
                const s = STATUS_MAP[op.status];
                return (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.color}`}>
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{op.company}</p>
                      <p className="text-xs text-gray-400">{t.label} · {op.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{fmt(op.amount, op.cur)}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${s.color}`}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Financiamientos + KYC pendientes */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Solicitudes de financiamiento</h3>
                <Link to="/admin/financiamientos" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                  Ver todas <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { company: "Tech Solutions S.A.", type: "Préstamo PyME", amount: 2500000, status: "En revisión", color: "text-amber-600 bg-amber-50" },
                  { company: "Distribuidora Norte", type: "Descuento de cheques", amount: 850000, status: "Pre-aprobado", color: "text-blue-600 bg-blue-50" },
                  { company: "Studio LM", type: "Leasing equipos", amount: 1200000, status: "Rechazado", color: "text-red-600 bg-red-50" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{f.company}</p>
                      <p className="text-xs text-gray-400">{f.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-bold text-gray-900">{fmt(f.amount)}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${f.color}`}>{f.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">KYC pendiente de aprobación</h3>
                <Link to="/admin/kyc" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                  Gestionar <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { company: "Exporta Norte S.A.", cuit: "30-71234567-1", submitted: "hace 2h", risk: "Bajo" },
                  { company: "Importadora Central", cuit: "30-68912345-0", submitted: "hace 5h", risk: "Medio" },
                  { company: "Logística Sur", cuit: "30-70456789-2", submitted: "hace 1 día", risk: "Bajo" },
                ].map((k, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {k.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{k.company}</p>
                      <p className="text-xs text-gray-400">{k.cuit} · {k.submitted}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${k.risk === "Bajo" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      Riesgo {k.risk}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
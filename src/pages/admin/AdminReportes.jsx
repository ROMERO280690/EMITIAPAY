import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownLeft, Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v) => `$ ${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const RANGES = ["Último mes", "Último trimestre", "Último semestre", "Año completo"];
const RANGE_MONTHS = { "Último mes": 1, "Último trimestre": 3, "Último semestre": 6, "Año completo": 12 };

export default function AdminReportes() {
  const [range, setRange] = useState("Último semestre");

  const { data: transactions = [] } = useQuery({
    queryKey: ["admin_tx_report"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 500),
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["admin_inv_report"],
    queryFn: () => base44.entities.Investment.list("-created_date", 200),
  });

  const { data: financings = [] } = useQuery({
    queryKey: ["admin_fin_report"],
    queryFn: () => base44.entities.FinancingRequest.list("-created_date", 100),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["admin_acc_report"],
    queryFn: () => base44.entities.Account.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin_users_report"],
    queryFn: () => base44.entities.User.list("-created_date", 100),
  });

  const numMonths = RANGE_MONTHS[range];

  // Build monthly buckets for the selected range
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = numMonths - 1; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const label = format(monthDate, "MMM", { locale: es });

      const monthTx = transactions.filter(t => {
        if (!t.created_date) return false;
        return isWithinInterval(new Date(t.created_date), { start, end });
      });

      const ingresos = monthTx
        .filter(t => ["transfer_in", "collection", "yield", "deposit"].includes(t.type))
        .reduce((s, t) => s + (t.amount || 0), 0);

      const egresos = monthTx
        .filter(t => ["transfer_out", "payment"].includes(t.type))
        .reduce((s, t) => s + (t.amount || 0), 0);

      const monthUsers = users.filter(u => {
        if (!u.created_date) return false;
        return new Date(u.created_date) <= end;
      });

      months.push({ mes: label, ingresos, egresos, neto: ingresos - egresos, clientes: monthUsers.length });
    }
    return months;
  }, [transactions, users, numMonths]);

  // Product usage from real data
  const productData = useMemo(() => [
    { producto: "Cuentas", uso: accounts.length },
    { producto: "Inversiones", uso: investments.length },
    { producto: "Financiamientos", uso: financings.length },
    { producto: "Transacciones", uso: transactions.length },
  ], [accounts, investments, financings, transactions]);

  const totalIngresos = monthlyData.reduce((s, m) => s + m.ingresos, 0);
  const totalEgresos = monthlyData.reduce((s, m) => s + m.egresos, 0);
  const totalNeto = totalIngresos - totalEgresos;

  // Export to CSV
  const exportCSV = () => {
    const rows = [
      ["Mes", "Ingresos", "Egresos", "Neto"],
      ...monthlyData.map(m => [m.mes, m.ingresos, m.egresos, m.neto]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-emitia-${range.replace(/ /g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de la plataforma</h1>
          <p className="text-sm text-gray-500">Análisis financiero y operativo global — datos en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${range === r ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total ingresos", value: fmt(totalIngresos), trend: null, up: true, icon: ArrowDownLeft, color: "bg-emerald-50 text-emerald-600" },
          { label: "Total egresos", value: fmt(totalEgresos), trend: null, up: false, icon: ArrowUpRight, color: "bg-red-50 text-red-600" },
          { label: "Resultado neto", value: fmt(totalNeto), trend: null, up: totalNeto >= 0, icon: TrendingUp, color: "bg-indigo-50 text-indigo-600" },
          { label: "Usuarios registrados", value: users.length, trend: null, up: true, icon: BarChart3, color: "bg-violet-50 text-violet-600" },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${k.color}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{k.label}</p>
                <p className="text-xl font-bold text-gray-900">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Evolución de volumen operado</h3>
              <p className="text-xs text-gray-500">Ingresos, egresos y resultado neto mensual (datos reales)</p>
            </div>
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline">
              <Download className="w-3.5 h-3.5" /> Exportar CSV
            </button>
          </div>
          {monthlyData.every(m => m.ingresos === 0 && m.egresos === 0) ? (
            <div className="py-12 text-center">
              <BarChart3 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Sin transacciones en el período seleccionado</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="ingG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="egG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip formatter={v => fmt(v)} />
                <Legend />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#6366f1" fill="url(#ingG)" strokeWidth={2} />
                <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#ef4444" fill="url(#egG)" strokeWidth={2} />
                <Area type="monotone" dataKey="neto" name="Neto" stroke="#10b981" fill="url(#netG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Crecimiento de usuarios</h3>
            {monthlyData.every(m => m.clientes === 0) ? (
              <div className="py-8 text-center text-gray-400 text-sm">Sin datos de usuarios</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="clientes" name="Usuarios activos" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Adopción de productos (registros reales)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                <YAxis type="category" dataKey="producto" tick={{ fontSize: 11, fill: "#6b7280" }} width={100} />
                <Tooltip />
                <Bar dataKey="uso" name="Registros" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumen financiamientos e inversiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Financiamientos por estado</h3>
            {financings.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">Sin solicitudes de financiamiento</p>
            ) : (
              <div className="space-y-2">
                {[
                  { label: "Pendientes", count: financings.filter(f => f.status === "pending").length, color: "bg-amber-100 text-amber-700" },
                  { label: "Aprobados", count: financings.filter(f => f.status === "approved").length, color: "bg-blue-100 text-blue-700" },
                  { label: "Desembolsados", count: financings.filter(f => f.status === "disbursed").length, color: "bg-emerald-100 text-emerald-700" },
                  { label: "Rechazados", count: financings.filter(f => f.status === "rejected").length, color: "bg-red-100 text-red-700" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between p-2 rounded-lg">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    <span className="font-bold text-gray-900">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Inversiones por tipo</h3>
            {investments.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">Sin inversiones registradas</p>
            ) : (
              <div className="space-y-2">
                {[
                  { label: "Plazo fijo", count: investments.filter(i => i.type === "plazo_fijo").length },
                  { label: "FCI", count: investments.filter(i => i.type === "fci").length },
                  { label: "Bonos", count: investments.filter(i => i.type === "bonos").length },
                  { label: "Acciones", count: investments.filter(i => i.type === "acciones").length },
                ].filter(s => s.count > 0).map(s => (
                  <div key={s.label} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-700">{s.label}</span>
                    <span className="font-bold text-gray-900">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
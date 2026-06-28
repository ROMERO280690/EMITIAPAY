import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, CheckCircle2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const MINIMUM_BALANCE = 500000; // mínimo recomendado por cuenta ARS

export default function AdminLiquidez() {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["admin_accounts_liq"],
    queryFn: () => base44.entities.Account.list(),
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["admin_investments_liq"],
    queryFn: () => base44.entities.Investment.list(),
  });

  const { data: financings = [] } = useQuery({
    queryKey: ["admin_financings_liq"],
    queryFn: () => base44.entities.FinancingRequest.list(),
  });

  const arsAccounts = accounts.filter(a => a.currency === "ARS" && a.status === "active");
  const usdAccounts = accounts.filter(a => a.currency === "USD" && a.status === "active");
  const totalARS = arsAccounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalUSD = usdAccounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalInvested = investments.filter(i => i.status === "active").reduce((s, i) => s + (i.amount || 0), 0);
  const pendingDisbursements = financings.filter(f => f.status === "approved").reduce((s, f) => s + (f.requested_amount || 0), 0);

  const lowBalanceAccounts = arsAccounts.filter(a => (a.balance || 0) < MINIMUM_BALANCE);
  const healthyAccounts = arsAccounts.filter(a => (a.balance || 0) >= MINIMUM_BALANCE);

  const chartData = arsAccounts.slice(0, 8).map(a => ({
    name: a.name?.slice(0, 12) || "Cuenta",
    saldo: a.balance || 0,
    minimo: MINIMUM_BALANCE,
  }));

  const liquidityRatio = totalARS > 0 ? ((totalARS - totalInvested) / totalARS * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Liquidez & Reservas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitoreo de saldos, liquidez disponible y reservas del sistema</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total ARS disponible", value: fmt(totalARS), icon: Wallet, color: "bg-indigo-50 text-indigo-600", sub: `${arsAccounts.length} cuentas` },
          { label: "Total USD disponible", value: fmt(totalUSD, "USD"), icon: DollarSign, color: "bg-emerald-50 text-emerald-600", sub: `${usdAccounts.length} cuentas` },
          { label: "ARS en inversiones", value: fmt(totalInvested), icon: TrendingUp, color: "bg-blue-50 text-blue-600", sub: "Inmovilizado" },
          { label: "Ratio de liquidez", value: `${liquidityRatio}%`, icon: liquidityRatio > 40 ? CheckCircle2 : AlertTriangle, color: liquidityRatio > 40 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600", sub: liquidityRatio > 40 ? "Saludable" : "Bajo mínimo" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alertas de liquidez */}
      {lowBalanceAccounts.length > 0 && (
        <Card className="border-0 shadow-sm border-l-4 border-l-amber-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Cuentas por debajo del mínimo recomendado ({fmt(MINIMUM_BALANCE)})</h3>
            </div>
            <div className="space-y-2">
              {lowBalanceAccounts.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
                  <p className="text-sm text-amber-800">{a.name}</p>
                  <span className="text-sm font-bold text-amber-700">{fmt(a.balance || 0)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desembolsos pendientes */}
      {pendingDisbursements > 0 && (
        <Card className="border-0 shadow-sm border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-gray-900">Desembolsos aprobados pendientes</p>
              </div>
              <p className="text-sm font-bold text-blue-700">{fmt(pendingDisbursements)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de saldos */}
      {chartData.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Saldo por cuenta ARS vs mínimo recomendado</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="saldo" name="Saldo" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.saldo >= MINIMUM_BALANCE ? "#6366f1" : "#f59e0b"} />
                  ))}
                </Bar>
                <Bar dataKey="minimo" name="Mínimo" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Estado de cuentas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Cuentas saludables ({healthyAccounts.length})</h3>
            </div>
            {healthyAccounts.slice(0, 5).map(a => (
              <div key={a.id} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{a.name}</span>
                <span className="text-sm font-semibold text-emerald-600">{fmt(a.balance || 0)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Inversiones activas por monto</h3>
            </div>
            {investments.filter(i => i.status === "active").slice(0, 5).map(inv => (
              <div key={inv.id} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{inv.type === "plazo_fijo" ? "Plazo fijo" : inv.type === "fci" ? "FCI" : inv.type}</span>
                <span className="text-sm font-semibold text-blue-600">{fmt(inv.amount || 0, inv.currency)}</span>
              </div>
            ))}
            {investments.filter(i => i.status === "active").length === 0 && (
              <p className="text-sm text-gray-400">Sin inversiones activas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
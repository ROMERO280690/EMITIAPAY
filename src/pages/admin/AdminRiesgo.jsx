import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingDown, TrendingUp, XCircle, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

export default function AdminRiesgo() {
  const { data: echeqs = [] } = useQuery({ queryKey: ["risk_echeqs"], queryFn: () => base44.entities.ECheq.list() });
  const { data: financings = [] } = useQuery({ queryKey: ["risk_fin"], queryFn: () => base44.entities.FinancingRequest.list() });
  const { data: collections = [] } = useQuery({ queryKey: ["risk_col"], queryFn: () => base44.entities.CollectionRequest.list() });
  const { data: investments = [] } = useQuery({ queryKey: ["risk_inv"], queryFn: () => base44.entities.Investment.list() });
  const { data: accounts = [] } = useQuery({ queryKey: ["risk_acc"], queryFn: () => base44.entities.Account.list() });

  // Métricas de riesgo
  const rejectedEcheqs = echeqs.filter(e => e.status === "rechazado");
  const overdueCollections = collections.filter(c => c.status === "overdue");
  const rejectedFinancings = financings.filter(f => f.status === "rejected");
  const pendingFinancings = financings.filter(f => f.status === "pending");
  const expiringInvestments = investments.filter(i => {
    if (!i.maturity_date || i.status !== "active") return false;
    const diff = (new Date(i.maturity_date) - new Date()) / 86400000;
    return diff >= 0 && diff <= 7;
  });
  const zeroBalanceAccounts = accounts.filter(a => (a.balance || 0) === 0 && a.status === "active");

  // Score de riesgo (0-100, menor = mejor)
  const riskScore = Math.min(100, (
    rejectedEcheqs.length * 15 +
    overdueCollections.length * 10 +
    rejectedFinancings.length * 5 +
    zeroBalanceAccounts.length * 8 +
    expiringInvestments.length * 3
  ));
  const riskLevel = riskScore === 0 ? "Bajo" : riskScore < 30 ? "Moderado" : riskScore < 60 ? "Alto" : "Crítico";
  const riskColor = riskScore === 0 ? "text-emerald-600" : riskScore < 30 ? "text-amber-600" : "text-red-600";
  const riskBg = riskScore === 0 ? "bg-emerald-50" : riskScore < 30 ? "bg-amber-50" : "bg-red-50";

  const chartData = [
    { categoria: "eCheqs rechazados", cantidad: rejectedEcheqs.length, color: "#ef4444" },
    { categoria: "Cobros vencidos", cantidad: overdueCollections.length, color: "#f59e0b" },
    { categoria: "Financ. rechazados", cantidad: rejectedFinancings.length, color: "#8b5cf6" },
    { categoria: "Inversiones x vencer", cantidad: expiringInvestments.length, color: "#3b82f6" },
    { categoria: "Cuentas sin saldo", cantidad: zeroBalanceAccounts.length, color: "#6b7280" },
  ];

  const RISKS = [
    {
      title: "eCheqs rechazados",
      count: rejectedEcheqs.length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      severity: rejectedEcheqs.length > 3 ? "Alto" : rejectedEcheqs.length > 0 ? "Moderado" : "Ninguno",
      items: rejectedEcheqs.slice(0, 3).map(e => `${e.concept || "eCheq"} — ${e.recipient_name || "—"} — ${fmt(e.amount, e.currency)}`),
    },
    {
      title: "Cobros vencidos sin gestionar",
      count: overdueCollections.length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      severity: overdueCollections.length > 5 ? "Alto" : overdueCollections.length > 0 ? "Moderado" : "Ninguno",
      items: overdueCollections.slice(0, 3).map(c => `${c.client_name} — ${fmt(c.amount, c.currency)}`),
    },
    {
      title: "Financiamientos pendientes de decisión",
      count: pendingFinancings.length,
      icon: AlertTriangle,
      color: "bg-violet-50 text-violet-600",
      severity: pendingFinancings.length > 5 ? "Alto" : pendingFinancings.length > 0 ? "Moderado" : "Ninguno",
      items: pendingFinancings.slice(0, 3).map(f => `${f.product_type} — ${fmt(f.requested_amount, f.currency)}`),
    },
    {
      title: "Inversiones próximas a vencer (7 días)",
      count: expiringInvestments.length,
      icon: TrendingDown,
      color: "bg-blue-50 text-blue-600",
      severity: expiringInvestments.length > 3 ? "Moderado" : expiringInvestments.length > 0 ? "Bajo" : "Ninguno",
      items: expiringInvestments.slice(0, 3).map(i => `${i.type} — ${fmt(i.amount, i.currency)} — vence ${i.maturity_date}`),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riesgo & Alertas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Análisis de riesgo operativo y financiero de la plataforma</p>
      </div>

      {/* Score general */}
      <Card className={`border-0 shadow-sm ${riskBg} border-l-4 ${riskScore === 0 ? "border-l-emerald-500" : riskScore < 30 ? "border-l-amber-400" : "border-l-red-500"}`}>
        <CardContent className="p-5 flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold ${riskBg} ${riskColor} border-2 ${riskScore === 0 ? "border-emerald-200" : riskScore < 30 ? "border-amber-300" : "border-red-300"}`}>
            {riskScore === 0 ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <p className="text-sm text-gray-500">Score de riesgo operativo</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-4xl font-extrabold ${riskColor}`}>{riskScore}</p>
              <p className="text-lg text-gray-500">/100</p>
            </div>
            <Badge className={`${riskBg} ${riskColor} border-current/20 text-sm font-semibold mt-1`}>
              Riesgo {riskLevel}
            </Badge>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-xs text-gray-400">Calculado en base a:</p>
            <p className="text-xs text-gray-600">eCheqs, cobros, financiamientos,</p>
            <p className="text-xs text-gray-600">inversiones y saldos</p>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Distribución de factores de riesgo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="categoria" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" name="Cantidad" radius={[4, 4, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detalle por categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RISKS.map((risk, i) => {
          const Icon = risk.icon;
          const severityColor = risk.severity === "Alto" ? "bg-red-100 text-red-700" : risk.severity === "Moderado" ? "bg-amber-100 text-amber-700" : risk.severity === "Bajo" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700";
          return (
            <motion.div key={risk.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-0 shadow-sm h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${risk.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{risk.title}</p>
                        <p className="text-xs text-gray-400">{risk.count} registros</p>
                      </div>
                    </div>
                    <Badge className={severityColor}>{risk.severity}</Badge>
                  </div>
                  {risk.items.length > 0 ? (
                    <div className="space-y-1">
                      {risk.items.map((item, j) => (
                        <p key={j} className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 truncate">{item}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sin incidencias</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
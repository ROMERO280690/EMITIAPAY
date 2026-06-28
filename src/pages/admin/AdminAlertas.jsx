import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, CheckCircle2, XCircle, Info, Clock, RefreshCw, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { toast } from "sonner";

const STATIC_ALERTS = [
  { id: "a1", type: "error", category: "eCheq", msg: "eCheq #ECH-0091 sin fondos suficientes — Constructora LM", time: new Date(Date.now() - 8 * 60000), resolved: false },
  { id: "a2", type: "error", category: "KYC", msg: "Solicitud de financiamiento rechazada en revisión KYC — Studio RS", time: new Date(Date.now() - 22 * 60000), resolved: false },
  { id: "a3", type: "warning", category: "KYC", msg: "3 nuevas solicitudes KYC pendientes de aprobación", time: new Date(Date.now() - 60 * 60000), resolved: false },
  { id: "a4", type: "warning", category: "Cobros", msg: "5 cobros vencidos sin gestionar — monto total $ 1.240.000", time: new Date(Date.now() - 2 * 3600000), resolved: false },
  { id: "a5", type: "info", category: "Inversiones", msg: "2 plazos fijos vencen en las próximas 24hs", time: new Date(Date.now() - 3 * 3600000), resolved: false },
  { id: "a6", type: "warning", category: "Liquidez", msg: "Cuenta operativa de Distribuidora Norte por debajo del mínimo recomendado", time: new Date(Date.now() - 5 * 3600000), resolved: true },
  { id: "a7", type: "info", category: "Sistema", msg: "Mantenimiento programado: domingo 29/06 02:00–04:00hs", time: new Date(Date.now() - 24 * 3600000), resolved: false },
  { id: "a8", type: "error", category: "Pagos", msg: "Pago programado fallido — Vera & Asociados ($ 320.000)", time: new Date(Date.now() - 26 * 3600000), resolved: true },
];

const typeConfig = {
  error: { icon: XCircle, bg: "bg-red-50 border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700", label: "Error" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50 border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", label: "Advertencia" },
  info: { icon: Info, bg: "bg-blue-50 border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700", label: "Información" },
};

export default function AdminAlertas() {
  const [filter, setFilter] = useState("all"); // all | active | resolved
  const [alerts, setAlerts] = useState(STATIC_ALERTS);

  const { data: echeqs = [] } = useQuery({ queryKey: ["admin_echeqs"], queryFn: () => base44.entities.ECheq.list() });
  const { data: collections = [] } = useQuery({ queryKey: ["admin_collections"], queryFn: () => base44.entities.CollectionRequest.list() });
  const { data: investments = [] } = useQuery({ queryKey: ["admin_investments"], queryFn: () => base44.entities.Investment.list() });
  const { data: financings = [] } = useQuery({ queryKey: ["admin_financings"], queryFn: () => base44.entities.FinancingRequest.list() });

  // Generar alertas dinámicas desde datos reales
  const dynamicAlerts = [];
  const overdueCollections = collections.filter(c => c.status === "overdue");
  if (overdueCollections.length > 0) {
    dynamicAlerts.push({
      id: "dyn-1", type: "warning", category: "Cobros",
      msg: `${overdueCollections.length} cobro(s) vencidos sin gestionar`,
      time: new Date(), resolved: false,
    });
  }
  const pendingKYC = financings.filter(f => f.status === "pending");
  if (pendingKYC.length > 0) {
    dynamicAlerts.push({
      id: "dyn-2", type: "info", category: "Financiamientos",
      msg: `${pendingKYC.length} solicitud(es) de financiamiento pendientes de revisión`,
      time: new Date(), resolved: false,
    });
  }
  const expiringInvestments = investments.filter(i => {
    if (!i.maturity_date || i.status !== "active") return false;
    const diff = (new Date(i.maturity_date) - new Date()) / 86400000;
    return diff >= 0 && diff <= 2;
  });
  if (expiringInvestments.length > 0) {
    dynamicAlerts.push({
      id: "dyn-3", type: "warning", category: "Inversiones",
      msg: `${expiringInvestments.length} inversión(es) vencen en las próximas 48hs`,
      time: new Date(), resolved: false,
    });
  }

  const allAlerts = [...dynamicAlerts, ...alerts];
  const filtered = allAlerts.filter(a => {
    if (filter === "active") return !a.resolved;
    if (filter === "resolved") return a.resolved;
    return true;
  });

  const activeCount = allAlerts.filter(a => !a.resolved).length;
  const errorCount = allAlerts.filter(a => a.type === "error" && !a.resolved).length;
  const warningCount = allAlerts.filter(a => a.type === "warning" && !a.resolved).length;

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    toast.success("Alerta marcada como resuelta");
  };

  const resolveAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, resolved: true })));
    toast.success("Todas las alertas marcadas como resueltas");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Alertas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Alertas del sistema y notificaciones operativas</p>
        </div>
        <Button variant="outline" size="sm" onClick={resolveAll} className="gap-2">
          <CheckCircle2 className="w-4 h-4" /> Resolver todas
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Alertas activas", value: activeCount, icon: Bell, color: "bg-indigo-50 text-indigo-600" },
          { label: "Errores críticos", value: errorCount, icon: XCircle, color: "bg-red-50 text-red-600" },
          { label: "Advertencias", value: warningCount, icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {[["all", "Todas"], ["active", "Activas"], ["resolved", "Resueltas"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === val ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center py-16">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mb-3" />
              <p className="text-gray-500 font-medium">No hay alertas {filter === "active" ? "activas" : filter === "resolved" ? "resueltas" : ""}</p>
            </CardContent>
          </Card>
        ) : filtered.map((alert, i) => {
          const cfg = typeConfig[alert.type];
          const Icon = cfg.icon;
          return (
            <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${alert.resolved ? "opacity-50 bg-gray-50 border-gray-200" : cfg.bg}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.resolved ? "text-gray-400" : cfg.text}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.resolved ? "bg-gray-100 text-gray-500" : cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{alert.category}</span>
                    {alert.resolved && <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Resuelta</span>}
                  </div>
                  <p className={`text-sm ${alert.resolved ? "text-gray-400 line-through" : cfg.text}`}>{alert.msg}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(alert.time, "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
                {!alert.resolved && (
                  <Button size="sm" variant="ghost" onClick={() => resolveAlert(alert.id)}
                    className="flex-shrink-0 text-gray-500 hover:text-emerald-600 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
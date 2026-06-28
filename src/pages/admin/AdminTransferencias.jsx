import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const typeConfig = {
  transfer_in: { label: "Entrada", icon: ArrowDownLeft, color: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  transfer_out: { label: "Salida", icon: ArrowUpRight, color: "bg-red-50 text-red-500", badge: "bg-red-100 text-red-700" },
  payment: { label: "Pago", icon: CreditCard, color: "bg-violet-50 text-violet-600", badge: "bg-violet-100 text-violet-700" },
  collection: { label: "Cobro", icon: TrendingUp, color: "bg-blue-50 text-blue-600", badge: "bg-blue-100 text-blue-700" },
  yield: { label: "Rendimiento", icon: TrendingUp, color: "bg-indigo-50 text-indigo-600", badge: "bg-indigo-100 text-indigo-700" },
  deposit: { label: "Depósito", icon: ArrowDownLeft, color: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
};

const statusBadge = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function AdminTransferencias() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin_transactions_full"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 200),
  });

  const filtered = transactions.filter(t => {
    const matchSearch = !search ||
      t.counterpart_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalIn = transactions.filter(t => t.type === "transfer_in" || t.type === "collection" || t.type === "deposit" || t.type === "yield").reduce((s, t) => s + (t.amount || 0), 0);
  const totalOut = transactions.filter(t => t.type === "transfer_out" || t.type === "payment").reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transferencias</h1>
        <p className="text-sm text-gray-500 mt-0.5">Historial completo de movimientos y transferencias</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total movimientos", value: transactions.length, color: "bg-indigo-50 text-indigo-600" },
          { label: "Total entradas", value: fmt(totalIn), color: "bg-emerald-50 text-emerald-600" },
          { label: "Total salidas", value: fmt(totalOut), color: "bg-red-50 text-red-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9" placeholder="Buscar por contraparte o descripción..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[["all", "Todos"], ["transfer_in", "Entradas"], ["transfer_out", "Salidas"], ["payment", "Pagos"]].map(([val, label]) => (
            <button key={val} onClick={() => setTypeFilter(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === val ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <ArrowLeftRight className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500">No hay movimientos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx, i) => {
            const cfg = typeConfig[tx.type] || typeConfig.deposit;
            const Icon = cfg.icon;
            return (
              <motion.div key={tx.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{tx.description || cfg.label}</p>
                      <p className="text-xs text-gray-400">{tx.counterpart_name || "—"}</p>
                      {tx.created_date && <p className="text-xs text-gray-400">{format(new Date(tx.created_date), "dd/MM/yyyy HH:mm")}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{fmt(tx.amount, tx.currency)}</p>
                      <Badge className={statusBadge[tx.status] || "bg-gray-100 text-gray-600"}>
                        {tx.status === "completed" ? "Completado" : tx.status === "pending" ? "Pendiente" : tx.status === "failed" ? "Fallido" : tx.status || "—"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
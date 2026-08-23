import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
  Search, ArrowDownLeft, ArrowUpRight, Receipt, Landmark, PiggyBank,
  TrendingUp, Download, Eye, X, Calendar
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
const fmtFull = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const TYPE_MAP = {
  transfer_in: { label: "Transferencia entrante", icon: ArrowDownLeft, color: "bg-emerald-50 text-emerald-600" },
  transfer_out: { label: "Transferencia saliente", icon: ArrowUpRight, color: "bg-red-50 text-red-500" },
  payment: { label: "Pago", icon: Receipt, color: "bg-violet-50 text-violet-600" },
  collection: { label: "Cobro", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
  yield: { label: "Rendimiento", icon: Landmark, color: "bg-indigo-50 text-indigo-600" },
  deposit: { label: "Depósito", icon: ArrowDownLeft, color: "bg-emerald-50 text-emerald-600" },
};

const STATUS_MAP = {
  completed: { label: "Completado", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  failed: { label: "Fallido", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelado", color: "bg-gray-100 text-gray-600" },
};

export default function AdminTransacciones() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin_transactions_full"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 200),
  });

  const filtered = useMemo(() => transactions.filter(t => {
    const matchSearch = !search ||
      (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.counterpart_name || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const tDate = t.created_date ? new Date(t.created_date) : null;
    const matchFrom = !dateFrom || (tDate && tDate >= new Date(dateFrom));
    const matchTo = !dateTo || (tDate && tDate <= new Date(dateTo + "T23:59:59"));
    return matchSearch && matchType && matchStatus && matchFrom && matchTo;
  }), [transactions, search, typeFilter, statusFilter, dateFrom, dateTo]);

  const totalIn = filtered.filter(t => ["transfer_in", "collection", "deposit"].includes(t.type)).reduce((s, t) => s + (t.amount || 0), 0);
  const totalOut = filtered.filter(t => ["transfer_out", "payment"].includes(t.type)).reduce((s, t) => s + (t.amount || 0), 0);
  const completedCount = filtered.filter(t => t.status === "completed").length;
  const pendingCount = filtered.filter(t => t.status === "pending").length;
  const failedCount = filtered.filter(t => t.status === "failed").length;

  const exportCSV = () => {
    const headers = ["Fecha", "Tipo", "Descripción", "Contraparte", "CUIT", "Monto", "Moneda", "Categoría", "Estado", "Referencia"];
    const rows = filtered.map(t => [
      t.created_date ? format(new Date(t.created_date), "dd/MM/yyyy HH:mm") : "",
      TYPE_MAP[t.type]?.label || t.type,
      t.description || "",
      t.counterpart_name || "",
      t.counterpart_cuit || "",
      t.amount || 0,
      t.currency || "ARS",
      t.category || "",
      STATUS_MAP[t.status]?.label || t.status,
      t.reference || "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transacciones_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = search || typeFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch(""); setTypeFilter("all"); setStatusFilter("all"); setDateFrom(""); setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estado de Transacciones</h1>
          <p className="text-sm text-gray-500">{filtered.length} de {transactions.length} transacciones</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={filtered.length === 0} className="gap-2">
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Ingresos", value: fmt(totalIn), color: "text-emerald-600" },
          { label: "Egresos", value: fmt(totalOut), color: "text-red-500" },
          { label: "Neto", value: fmt(totalIn - totalOut), color: totalIn >= totalOut ? "text-emerald-600" : "text-red-500" },
          { label: "Completadas", value: completedCount, color: "text-emerald-600" },
          { label: "Pendientes", value: pendingCount, color: "text-amber-600" },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {failedCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          <X className="w-4 h-4" />
          <span>{failedCount} transacción(es) fallida(s) requieren atención</span>
        </div>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-gray-400 font-medium">Tipo:</span>
              {["all", "transfer_in", "transfer_out", "payment", "collection"].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${typeFilter === t ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {t === "all" ? "Todas" : TYPE_MAP[t]?.label || t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-gray-400 font-medium">Estado:</span>
              {["all", "completed", "pending", "failed", "cancelled"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {s === "all" ? "Todos" : STATUS_MAP[s]?.label || s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">Desde:</span>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto h-8 text-xs" />
              <span className="text-xs text-gray-400 font-medium">Hasta:</span>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto h-8 text-xs" />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-gray-500 gap-1">
                <X className="w-3 h-3" /> Limpiar filtros
              </Button>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-8 text-center text-gray-400">Cargando transacciones...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">No hay transacciones para mostrar con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Tipo", "Descripción", "Contraparte", "Monto", "Estado", "Fecha", ""].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((t, i) => {
                    const tp = TYPE_MAP[t.type] || { label: t.type, icon: Receipt, color: "bg-gray-50 text-gray-600" };
                    const st = STATUS_MAP[t.status] || { label: t.status, color: "bg-gray-100 text-gray-600" };
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(t)}>
                        <td className="px-3 py-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tp.color}`}>
                            <tp.icon className="w-3.5 h-3.5" />
                          </div>
                        </td>
                        <td className="px-3 py-3 max-w-[180px]">
                          <p className="font-medium text-gray-900 truncate">{t.description || "—"}</p>
                          <p className="text-xs text-gray-400">{tp.label}</p>
                        </td>
                        <td className="px-3 py-3 text-gray-600 truncate max-w-[140px]">{t.counterpart_name || "—"}</td>
                        <td className="px-3 py-3 font-bold text-gray-900">{fmt(t.amount, t.currency)}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {t.created_date ? format(new Date(t.created_date), "dd/MM/yy HH:mm", { locale: es }) : "—"}
                        </td>
                        <td className="px-3 py-3">
                          <Eye className="w-4 h-4 text-gray-300 hover:text-indigo-600" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de transacción</DialogTitle>
            <DialogDescription>Información completa de la operación</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                {(() => {
                  const tp = TYPE_MAP[selected.type] || { icon: Receipt, color: "bg-gray-100 text-gray-600" };
                  return (
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tp.color}`}>
                      <tp.icon className="w-5 h-5" />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{fmtFull(selected.amount, selected.currency)}</p>
                  <p className="text-xs text-gray-500">{TYPE_MAP[selected.type]?.label || selected.type}</p>
                </div>
                <Badge className={STATUS_MAP[selected.status]?.color}>{STATUS_MAP[selected.status]?.label || selected.status}</Badge>
              </div>
              {[
                { label: "Descripción", value: selected.description || "—" },
                { label: "Contraparte", value: selected.counterpart_name || "—" },
                { label: "CUIT contraparte", value: selected.counterpart_cuit || "—" },
                { label: "Categoría", value: selected.category || "—" },
                { label: "Referencia", value: selected.reference || "—" },
                { label: "Moneda", value: selected.currency || "ARS" },
                { label: "Fecha", value: selected.created_date ? format(new Date(selected.created_date), "dd/MM/yyyy HH:mm", { locale: es }) : "—" },
              ].map(f => (
                <div key={f.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{f.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{f.value}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
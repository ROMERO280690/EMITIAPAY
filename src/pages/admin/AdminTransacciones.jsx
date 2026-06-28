import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDownLeft, ArrowUpRight, Receipt, Landmark, PiggyBank, TrendingUp, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

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

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin_transactions_full"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 100),
  });

  const filtered = transactions.filter(t => {
    const matchSearch = !search || (t.description || "").toLowerCase().includes(search.toLowerCase()) || (t.counterpart_name || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalIn = transactions.filter(t => t.type === "transfer_in" || t.type === "collection" || t.type === "deposit").reduce((s, t) => s + (t.amount || 0), 0);
  const totalOut = transactions.filter(t => t.type === "transfer_out" || t.type === "payment").reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
        <p className="text-sm text-gray-500">{transactions.length} transacciones registradas</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total ingresos", value: fmt(totalIn), color: "text-emerald-600" },
          { label: "Total egresos", value: fmt(totalOut), color: "text-red-500" },
          { label: "Neto", value: fmt(totalIn - totalOut), color: totalIn >= totalOut ? "text-emerald-600" : "text-red-500" },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar transacción..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "transfer_in", "transfer_out", "payment", "collection"].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${typeFilter === t ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {t === "all" ? "Todas" : TYPE_MAP[t]?.label || t}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-gray-400">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">No hay transacciones para mostrar.</p>
              <p className="text-gray-300 text-xs mt-1">Usá el seedData para cargar datos de ejemplo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Tipo", "Descripción", "Contraparte", "Monto", "Categoría", "Estado", "Fecha"].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((t, i) => {
                    const tp = TYPE_MAP[t.type] || { label: t.type, icon: Receipt, color: "bg-gray-50 text-gray-600" };
                    const st = STATUS_MAP[t.status] || { label: t.status, color: "bg-gray-100 text-gray-600" };
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tp.color}`}>
                            <tp.icon className="w-3.5 h-3.5" />
                          </div>
                        </td>
                        <td className="px-3 py-3 max-w-[180px]">
                          <p className="font-medium text-gray-900 truncate">{t.description || "—"}</p>
                        </td>
                        <td className="px-3 py-3 text-gray-600 truncate max-w-[140px]">{t.counterpart_name || "—"}</td>
                        <td className="px-3 py-3 font-bold text-gray-900">{fmt(t.amount, t.currency)}</td>
                        <td className="px-3 py-3 text-gray-500 capitalize">{t.category || "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {t.created_date ? format(new Date(t.created_date), "dd/MM/yy HH:mm", { locale: es }) : "—"}
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
    </div>
  );
}
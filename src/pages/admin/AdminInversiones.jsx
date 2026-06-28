import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Landmark, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const TYPE_LABELS = { plazo_fijo: "Plazo Fijo", fci: "FCI", acciones: "Acciones", bonos: "Bonos" };
const TYPE_COLORS = {
  plazo_fijo: { badge: "bg-indigo-50 text-indigo-600", chart: "#6366f1" },
  fci: { badge: "bg-blue-50 text-blue-600", chart: "#3b82f6" },
  acciones: { badge: "bg-violet-50 text-violet-600", chart: "#8b5cf6" },
  bonos: { badge: "bg-emerald-50 text-emerald-600", chart: "#10b981" },
};
const STATUS_MAP = {
  active: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
  matured: { label: "Vencido", color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-600" },
};

export default function AdminInversiones() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const qc = useQueryClient();

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["admin_investments_full"],
    queryFn: () => base44.entities.Investment.list("-created_date", 100),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Investment.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_investments_full"] });
      toast.success("Inversión actualizada");
    },
  });

  const filtered = investments.filter(inv => {
    const ms = !search || (inv.type || "").toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || inv.status === statusFilter;
    return ms && mf;
  });

  const totalActive = investments.filter(i => i.status === "active").reduce((s, i) => s + (i.amount || 0), 0);
  const totalYield = investments.reduce((s, i) => s + (i.expected_yield || 0), 0);
  const activeCount = investments.filter(i => i.status === "active").length;

  // Chart data from real investments
  const chartData = useMemo(() => {
    const grouped = {};
    investments.filter(i => i.status === "active").forEach(i => {
      const label = TYPE_LABELS[i.type] || i.type;
      grouped[label] = (grouped[label] || 0) + (i.amount || 0);
    });
    return Object.entries(grouped).map(([tipo, monto]) => ({ tipo, monto }));
  }, [investments]);

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inversiones</h1>
        <p className="text-sm text-gray-500">{investments.length} posiciones en el portafolio</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Capital invertido (activo)", value: fmt(totalActive) },
          { label: "Rendimiento esperado total", value: fmt(totalYield) },
          { label: "Posiciones activas", value: activeCount },
          { label: "TNA promedio referencial", value: "38.64%" },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className="text-xl font-bold text-gray-900">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Distribución por instrumento (inversiones activas)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={v => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis type="category" dataKey="tipo" tick={{ fontSize: 11, fill: "#6b7280" }} width={80} />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="monto" name="Monto" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => {
                    const typeKey = Object.entries(TYPE_LABELS).find(([, v]) => v === entry.tipo)?.[0];
                    return <Cell key={i} fill={TYPE_COLORS[typeKey]?.chart || "#6366f1"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar por tipo..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {[["all", "Todas"], ["active", "Activas"], ["matured", "Vencidas"], ["cancelled", "Canceladas"]].map(([val, label]) => (
                <button key={val} onClick={() => setStatusFilter(val)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${statusFilter === val ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-gray-400">Cargando...</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Landmark className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No hay inversiones registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Tipo", "Monto", "Moneda", "TNA", "Plazo", "Inicio", "Vencimiento", "Rendimiento esperado", "Estado", "Acciones"].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((inv, i) => {
                    const tc = TYPE_COLORS[inv.type]?.badge || "bg-gray-50 text-gray-600";
                    const st = STATUS_MAP[inv.status] || { label: inv.status, color: "bg-gray-100 text-gray-600" };
                    const isExpiring = inv.maturity_date && inv.status === "active" &&
                      (new Date(inv.maturity_date) - new Date()) / 86400000 <= 7 &&
                      (new Date(inv.maturity_date) - new Date()) / 86400000 >= 0;
                    return (
                      <tr key={inv.id} className={`hover:bg-gray-50 transition-colors ${isExpiring ? "bg-amber-50/30" : ""}`}>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tc}`}>{TYPE_LABELS[inv.type] || inv.type}</span>
                        </td>
                        <td className="px-3 py-3 font-bold text-gray-900">{fmt(inv.amount, inv.currency)}</td>
                        <td className="px-3 py-3 text-gray-600">{inv.currency}</td>
                        <td className="px-3 py-3 font-semibold text-indigo-600">{inv.rate ? `${inv.rate}%` : "—"}</td>
                        <td className="px-3 py-3 text-gray-600">{inv.duration_days ? `${inv.duration_days}d` : "—"}</td>
                        <td className="px-3 py-3 text-gray-400 text-xs">{inv.start_date ? format(new Date(inv.start_date), "dd/MM/yy") : "—"}</td>
                        <td className="px-3 py-3 text-xs">
                          <span className={isExpiring ? "text-amber-600 font-semibold" : "text-gray-400"}>
                            {inv.maturity_date ? format(new Date(inv.maturity_date), "dd/MM/yy") : "—"}
                          </span>
                          {isExpiring && <span className="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded">⚠ Próximo</span>}
                        </td>
                        <td className="px-3 py-3 font-semibold text-emerald-600">{inv.expected_yield ? fmt(inv.expected_yield, inv.currency) : "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="px-3 py-3">
                          {inv.status === "active" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="text-emerald-600 h-7 text-xs" title="Marcar vencida"
                                onClick={() => updateStatus.mutate({ id: inv.id, status: "matured" })}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 h-7 text-xs" title="Cancelar"
                                onClick={() => updateStatus.mutate({ id: inv.id, status: "cancelled" })}>
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
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
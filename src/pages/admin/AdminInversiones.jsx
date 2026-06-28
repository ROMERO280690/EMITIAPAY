import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Landmark, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const TYPE_LABELS = { plazo_fijo: "Plazo Fijo", fci: "FCI", acciones: "Acciones", bonos: "Bonos" };
const TYPE_COLORS = { plazo_fijo: "bg-indigo-50 text-indigo-600", fci: "bg-blue-50 text-blue-600", acciones: "bg-violet-50 text-violet-600", bonos: "bg-emerald-50 text-emerald-600" };
const STATUS_MAP = { active: { label: "Activo", color: "bg-emerald-100 text-emerald-700" }, matured: { label: "Vencido", color: "bg-gray-100 text-gray-600" }, cancelled: { label: "Cancelado", color: "bg-red-100 text-red-600" } };

const CHART_DATA = [
  { tipo: "Plazo Fijo", monto: 8200000 },
  { tipo: "FCI", monto: 5100000 },
  { tipo: "Bonos", monto: 3100000 },
  { tipo: "Acciones", monto: 1800000 },
];

export default function AdminInversiones() {
  const [search, setSearch] = useState("");

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["admin_investments_full"],
    queryFn: () => base44.entities.Investment.list("-created_date", 100),
  });

  const filtered = investments.filter(inv =>
    !search || (inv.type || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = investments.filter(i => i.status === "active").reduce((s, i) => s + (i.amount || 0), 0);
  const totalYield = investments.reduce((s, i) => s + (i.expected_yield || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inversiones</h1>
        <p className="text-sm text-gray-500">{investments.length} posiciones en el portafolio</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Capital invertido", value: fmt(totalActive || 18200000) },
          { label: "Rendimiento esperado", value: fmt(totalYield || 2840000) },
          { label: "Posiciones activas", value: investments.filter(i => i.status === "active").length || 24 },
          { label: "TNA promedio", value: "38.64%" },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className="text-xl font-bold text-gray-900">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Distribución por instrumento</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={v => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis type="category" dataKey="tipo" tick={{ fontSize: 11, fill: "#6b7280" }} width={80} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="monto" name="Monto" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar inversión..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
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
                    {["Tipo", "Monto", "Moneda", "TNA", "Plazo", "Inicio", "Vencimiento", "Rendimiento esperado", "Estado"].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((inv, i) => {
                    const tc = TYPE_COLORS[inv.type] || "bg-gray-50 text-gray-600";
                    const st = STATUS_MAP[inv.status] || { label: inv.status, color: "bg-gray-100 text-gray-600" };
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tc}`}>{TYPE_LABELS[inv.type] || inv.type}</span>
                        </td>
                        <td className="px-3 py-3 font-bold text-gray-900">{fmt(inv.amount, inv.currency)}</td>
                        <td className="px-3 py-3 text-gray-600">{inv.currency}</td>
                        <td className="px-3 py-3 font-semibold text-indigo-600">{inv.rate ? `${inv.rate}%` : "—"}</td>
                        <td className="px-3 py-3 text-gray-600">{inv.duration_days ? `${inv.duration_days} días` : "—"}</td>
                        <td className="px-3 py-3 text-gray-400 text-xs">{inv.start_date ? format(new Date(inv.start_date), "dd/MM/yy") : "—"}</td>
                        <td className="px-3 py-3 text-gray-400 text-xs">{inv.maturity_date ? format(new Date(inv.maturity_date), "dd/MM/yy") : "—"}</td>
                        <td className="px-3 py-3 font-semibold text-emerald-600">{inv.expected_yield ? fmt(inv.expected_yield, inv.currency) : "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
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
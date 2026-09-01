import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, Wallet, Activity, ArrowRight, Network } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const fmtMoney = (v) => `$${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const AREAS = {
  banca_core: { label: "Banca Core", color: "#6366f1", icon: Building2 },
  tesoreria_mercados: { label: "Tesorería y Mercados", color: "#3b82f6", icon: Activity },
  riesgo_cumplimiento: { label: "Riesgo y Cumplimiento", color: "#f59e0b", icon: Wallet },
  operaciones_tecnologia: { label: "Operaciones y Tecnología", color: "#10b981", icon: Network },
  soporte_corporativo: { label: "Soporte Corporativo", color: "#8b5cf6", icon: Users },
};

const STATUS_STYLE = {
  active: "bg-emerald-100 text-emerald-700",
  restructure: "bg-amber-100 text-amber-700",
  planned: "bg-blue-100 text-blue-700",
};
const STATUS_LABEL = { active: "Activa", restructure: "Reestructura", planned: "Planificada" };

const PRIORITY_STYLE = {
  alta: "bg-rose-100 text-rose-700",
  media: "bg-amber-100 text-amber-700",
  baja: "bg-gray-100 text-gray-600",
};

export default function BusinessUnitsOverview() {
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["admin_business_units_overview"],
    queryFn: () => base44.entities.BusinessUnit.list(),
  });

  const [activeArea, setActiveArea] = useState("all");

  const byArea = useMemo(() => {
    const map = {};
    Object.keys(AREAS).forEach((k) => (map[k] = []));
    units.forEach((u) => {
      if (map[u.area]) map[u.area].push(u);
    });
    return map;
  }, [units]);

  const totals = useMemo(() => {
    const budget = units.reduce((s, u) => s + (u.budget_annual || 0), 0);
    const team = units.reduce((s, u) => s + (u.team_size || 0), 0);
    const active = units.filter((u) => u.status === "active").length;
    return { count: units.length, budget, team, active };
  }, [units]);

  const chartData = useMemo(
    () =>
      Object.entries(AREAS).map(([key, a]) => ({
        name: a.label.split(" ")[0],
        fullName: a.label,
        budget: byArea[key]?.reduce((s, u) => s + (u.budget_annual || 0), 0) || 0,
        color: a.color,
      })),
    [byArea]
  );

  const filtered = activeArea === "all" ? units : byArea[activeArea] || [];

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-600" />
              Unidades de Negocio · Visión Consolidada
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Rendimiento agregado de las {totals.count} unidades en 5 áreas estratégicas
            </p>
          </div>
          <Link to="/admin/unidades" className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
            Gestionar unidades <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Totales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Unidades totales", value: totals.count, icon: Building2, color: "bg-indigo-50 text-indigo-600" },
            { label: "Unidades activas", value: totals.active, icon: Activity, color: "bg-emerald-50 text-emerald-600" },
            { label: "Presupuesto anual", value: fmtMoney(totals.budget), icon: Wallet, color: "bg-blue-50 text-blue-600" },
            { label: "Personas totales", value: totals.team.toLocaleString("es-AR"), icon: Users, color: "bg-violet-50 text-violet-600" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${k.color}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-gray-500">{k.label}</p>
              <p className="text-base font-bold text-gray-900 leading-tight truncate">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Gráfico de presupuesto por área */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-600 mb-2">Presupuesto anual por área estratégica</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip formatter={(v) => fmtMoney(v)} labelFormatter={(l) => chartData.find((d) => d.name === l)?.fullName || l} />
              <Bar dataKey="budget" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filtros por área */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveArea("all")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeArea === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Todas ({totals.count})
          </button>
          {Object.entries(AREAS).map(([key, a]) => (
            <button
              key={key}
              onClick={() => setActiveArea(key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeArea === key ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
              style={activeArea === key ? { backgroundColor: a.color, borderColor: a.color } : {}}
            >
              {a.label} ({byArea[key]?.length || 0})
            </button>
          ))}
        </div>

        {/* Tabla de unidades */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-2 py-2 font-medium">Unidad</th>
                <th className="px-2 py-2 font-medium">Área</th>
                <th className="px-2 py-2 font-medium">Estado</th>
                <th className="px-2 py-2 font-medium">Prioridad</th>
                <th className="px-2 py-2 font-medium text-right">Presupuesto</th>
                <th className="px-2 py-2 font-medium text-right">Equipo</th>
                <th className="px-2 py-2 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-2 py-6 text-center text-gray-400 text-xs">Cargando unidades…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-2 py-6 text-center text-gray-400 text-xs">Sin unidades para mostrar</td>
                </tr>
              ) : (
                filtered.map((u, i) => {
                  const area = AREAS[u.area] || AREAS.banca_core;
                  return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: area.color }}>
                          {u.code?.slice(0, 3) || "—"}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{u.name}</p>
                          <p className="text-[10px] text-gray-400">{u.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="text-xs text-gray-600">{area.label}</span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[u.status] || STATUS_STYLE.active}`}>
                        {STATUS_LABEL[u.status] || u.status}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[u.priority] || PRIORITY_STYLE.media}`}>
                        {u.priority}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium text-gray-900">{fmtMoney(u.budget_annual)}</td>
                    <td className="px-2 py-2.5 text-right text-gray-600">{(u.team_size || 0).toLocaleString("es-AR")}</td>
                    <td className="px-2 py-2.5 text-gray-600 truncate max-w-[140px]">{u.head_name || "—"}</td>
                  </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
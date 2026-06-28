import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const fmt = (v) => `$ ${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const MONTHLY = [
  { mes: "Ene", ingresos: 18500000, egresos: 12300000, neto: 6200000, clientes: 38 },
  { mes: "Feb", ingresos: 22100000, egresos: 15800000, neto: 6300000, clientes: 40 },
  { mes: "Mar", ingresos: 19800000, egresos: 14200000, neto: 5600000, clientes: 42 },
  { mes: "Abr", ingresos: 28400000, egresos: 18900000, neto: 9500000, clientes: 44 },
  { mes: "May", ingresos: 31200000, egresos: 22100000, neto: 9100000, clientes: 46 },
  { mes: "Jun", ingresos: 35800000, egresos: 24600000, neto: 11200000, clientes: 47 },
];

const PRODUCTS = [
  { producto: "Cuentas", uso: 47 },
  { producto: "Pagos", uso: 38 },
  { producto: "Cobros", uso: 32 },
  { producto: "eCheqs", uso: 21 },
  { producto: "Inversiones", uso: 24 },
  { producto: "Financiamiento", uso: 12 },
];

const RANGES = ["Último mes", "Último trimestre", "Último semestre", "Año completo"];

export default function AdminReportes() {
  const [range, setRange] = useState("Último semestre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de la plataforma</h1>
          <p className="text-sm text-gray-500">Análisis financiero y operativo global</p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${range === r ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total ingresos", value: fmt(MONTHLY.reduce((s, m) => s + m.ingresos, 0)), trend: "+18.4%", up: true },
          { label: "Total egresos", value: fmt(MONTHLY.reduce((s, m) => s + m.egresos, 0)), trend: "+12.1%", up: false },
          { label: "Resultado neto", value: fmt(MONTHLY.reduce((s, m) => s + m.neto, 0)), trend: "+24.2%", up: true },
          { label: "Nuevos clientes", value: "47", trend: "+9 vs período anterior", up: true },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className="text-xl font-bold text-gray-900">{k.value}</p>
              <p className={`text-xs mt-1 font-medium ${k.up ? "text-emerald-600" : "text-red-500"}`}>{k.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volume area chart */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Evolución de volumen operado</h3>
              <p className="text-xs text-gray-500">Ingresos, egresos y resultado neto mensual</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline">
              <Download className="w-3.5 h-3.5" /> Exportar CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              <YAxis tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend />
              <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#6366f1" fill="url(#ingG)" strokeWidth={2} />
              <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#ef4444" fill="url(#egG)" strokeWidth={2} />
              <Area type="monotone" dataKey="neto" name="Neto" stroke="#10b981" fill="url(#netG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clientes chart */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Crecimiento de clientes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip />
                <Line type="monotone" dataKey="clientes" name="Empresas activas" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product usage */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Adopción de productos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PRODUCTS} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis type="category" dataKey="producto" tick={{ fontSize: 11, fill: "#6b7280" }} width={90} />
                <Tooltip />
                <Bar dataKey="uso" name="Empresas" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
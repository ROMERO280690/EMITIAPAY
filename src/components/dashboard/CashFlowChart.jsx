import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formatCurrency = (val, currency = "ARS") => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(val || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
};

const MONTHS_BACK = 6;

function buildMonthlyData(transactions) {
  const now = new Date();
  const months = [];
  for (let i = MONTHS_BACK - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: format(d, "MMM", { locale: es }).replace(".", ""),
      fullLabel: format(d, "MMMM yyyy", { locale: es }),
      income: 0,
      expense: 0,
    });
  }
  const monthMap = new Map(months.map((m) => [m.key, m]));

  transactions.forEach((t) => {
    if (!t.created_date) return;
    const d = new Date(t.created_date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const m = monthMap.get(key);
    if (!m) return;
    const amt = t.amount || 0;
    const isIncome = ["transfer_in", "collection", "deposit", "yield"].includes(t.type);
    const isExpense = ["transfer_out", "payment"].includes(t.type);
    if (isIncome && t.status === "completed") m.income += amt;
    if (isExpense && (t.status === "completed" || t.status === "pending")) m.expense += amt;
  });

  return months.map((m) => ({
    ...m,
    net: m.income - m.expense,
    label: m.label.charAt(0).toUpperCase() + m.label.slice(1),
  }));
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl p-3 text-xs space-y-1.5 min-w-[160px]">
      <p className="font-semibold text-gray-900 capitalize">{data?.fullLabel || label}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ingresos
        </span>
        <span className="font-semibold tabular-nums">{formatCurrency(data?.income)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Egresos
        </span>
        <span className="font-semibold tabular-nums">{formatCurrency(data?.expense)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 pt-1.5 border-t border-gray-100">
        <span className="text-gray-600">Balance neto</span>
        <span className={`font-bold tabular-nums ${(data?.net || 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {formatCurrency(data?.net)}
        </span>
      </div>
    </div>
  );
}

export default function CashFlowChart({ transactions, isLoading }) {
  const [view, setView] = useState("area"); // "area" | "bar"

  const data = useMemo(() => buildMonthlyData(transactions || []), [transactions]);

  const totalIncome = data.reduce((s, m) => s + m.income, 0);
  const totalExpense = data.reduce((s, m) => s + m.expense, 0);
  const net = totalIncome - totalExpense;
  const lastMonth = data[data.length - 1];
  const prevMonth = data[data.length - 2];
  const incomeDelta = prevMonth ? ((lastMonth.income - prevMonth.income) / (prevMonth.income || 1)) * 100 : 0;
  const expenseDelta = prevMonth ? ((lastMonth.expense - prevMonth.expense) / (prevMonth.expense || 1)) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[280px] rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Evolución de ingresos y egresos</h3>
            </div>
            <p className="text-xs text-muted-foreground">Últimos {MONTHS_BACK} meses</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
            <button
              onClick={() => setView("area")}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${view === "area" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LineChartIcon className="w-3.5 h-3.5" /> Área
            </button>
            <button
              onClick={() => setView("bar")}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${view === "bar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Barras
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-emerald-50">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <p className="text-xs text-emerald-700 font-medium">Ingresos</p>
            </div>
            <p className="text-base font-bold text-emerald-700 tabular-nums">{formatCurrency(totalIncome)}</p>
            {prevMonth && prevMonth.income > 0 && (
              <p className={`text-[10px] mt-0.5 ${incomeDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {incomeDelta >= 0 ? "↑" : "↓"} {Math.abs(incomeDelta).toFixed(1)}% vs mes anterior
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-red-50">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              <p className="text-xs text-red-600 font-medium">Egresos</p>
            </div>
            <p className="text-base font-bold text-red-600 tabular-nums">{formatCurrency(totalExpense)}</p>
            {prevMonth && prevMonth.expense > 0 && (
              <p className={`text-[10px] mt-0.5 ${expenseDelta <= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {expenseDelta <= 0 ? "↓" : "↑"} {Math.abs(expenseDelta).toFixed(1)}% vs mes anterior
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-gray-600" />
              <p className="text-xs text-gray-600 font-medium">Balance neto</p>
            </div>
            <p className={`text-base font-bold tabular-nums ${net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {formatCurrency(net)}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Acumulado del período</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {view === "area" ? (
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v).replace(/\s/g, "")} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Ingresos" stroke="#10b981" strokeWidth={2} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" name="Egresos" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpense)" />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v).replace(/\s/g, "")} width={70} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Egresos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
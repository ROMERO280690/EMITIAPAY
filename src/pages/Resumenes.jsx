import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, TrendingDown, TrendingUp, ArrowDownToLine, ArrowUpFromLine, CircleDollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

export default function Resumenes() {
  const [period, setPeriod] = useState("mensual");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 100),
  });

  const formatCurrency = (val, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  const arsTxns = transactions.filter((t) => t.currency === "ARS");
  const usdTxns = transactions.filter((t) => t.currency === "USD");

  const calcTotals = (txns) => {
    const inflow = txns.filter((t) => ["transfer_in", "collection", "yield", "deposit"].includes(t.type));
    const outflow = txns.filter((t) => ["transfer_out", "payment"].includes(t.type));
    return {
      totalIn: inflow.reduce((s, t) => s + (t.amount || 0), 0),
      totalOut: outflow.reduce((s, t) => s + (t.amount || 0), 0),
      count: txns.length,
    };
  };

  const arsStats = calcTotals(arsTxns);
  const usdStats = calcTotals(usdTxns);

  const categories = {};
  transactions.forEach((t) => {
    const cat = t.category || "otros";
    if (!categories[cat]) categories[cat] = { count: 0, total: 0 };
    categories[cat].count++;
    categories[cat].total += t.amount || 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resúmenes</h1>
          <p className="text-sm text-muted-foreground mt-1">Reportes financieros y análisis de movimientos</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mensual">Mensual</SelectItem>
            <SelectItem value="trimestral">Trimestral</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[100px] rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total ingresos ARS", value: formatCurrency(arsStats.totalIn, "ARS"), icon: ArrowDownToLine, color: "bg-emerald-50 text-emerald-600" },
              { label: "Total egresos ARS", value: formatCurrency(arsStats.totalOut, "ARS"), icon: ArrowUpFromLine, color: "bg-red-50 text-red-600" },
              { label: "Total ingresos USD", value: formatCurrency(usdStats.totalIn, "USD"), icon: ArrowDownToLine, color: "bg-emerald-50 text-emerald-600" },
              { label: "Total egresos USD", value: formatCurrency(usdStats.totalOut, "USD"), icon: ArrowUpFromLine, color: "bg-red-50 text-red-600" },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Balance neto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Pesos (ARS)</p>
                    <p className={`text-xl font-bold ${arsStats.totalIn - arsStats.totalOut >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {formatCurrency(arsStats.totalIn - arsStats.totalOut, "ARS")}
                    </p>
                  </div>
                  {arsStats.totalIn - arsStats.totalOut >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50 mt-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Dólares (USD)</p>
                    <p className={`text-xl font-bold ${usdStats.totalIn - usdStats.totalOut >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {formatCurrency(usdStats.totalIn - usdStats.totalOut, "USD")}
                    </p>
                  </div>
                  {usdStats.totalIn - usdStats.totalOut >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Movimientos por categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categories).map(([cat, stats]) => (
                    <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CircleDollarSign className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{cat}</p>
                          <p className="text-xs text-muted-foreground">{stats.count} movimientos</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(stats.total, "ARS")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
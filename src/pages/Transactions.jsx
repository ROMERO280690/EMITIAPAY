import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard, Building2, Search, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const typeConfig = {
  transfer_in: { label: "Transferencia recibida", icon: ArrowDownLeft, color: "text-emerald-600", bg: "bg-emerald-50" },
  transfer_out: { label: "Transferencia enviada", icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-50" },
  payment: { label: "Pago", icon: CreditCard, color: "text-red-500", bg: "bg-red-50" },
  collection: { label: "Cobro", icon: ArrowDownLeft, color: "text-emerald-600", bg: "bg-emerald-50" },
  yield: { label: "Rendimiento", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  deposit: { label: "Depósito", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
};

const statusMap = {
  completed: { label: "Completado", variant: "default" },
  pending: { label: "Pendiente", variant: "secondary" },
  failed: { label: "Fallido", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "outline" },
};

const categoryLabels = {
  servicios: "Servicios",
  sueldos: "Sueldos",
  proveedores: "Proveedores",
  impuestos: "Impuestos",
  rendimientos: "Rendimientos",
  ventas: "Ventas",
  otros: "Otros",
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 100),
  });

  const filtered = transactions.filter((tx) => {
    const matchSearch = !search || 
      tx.counterpart_name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || tx.type === typeFilter;
    const matchCategory = categoryFilter === "all" || tx.category === categoryFilter;
    return matchSearch && matchType && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Movimientos</h1>
        <p className="text-sm text-muted-foreground mt-1">Historial de todas tus operaciones</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o concepto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="transfer_in">Transferencias recibidas</SelectItem>
            <SelectItem value="transfer_out">Transferencias enviadas</SelectItem>
            <SelectItem value="payment">Pagos</SelectItem>
            <SelectItem value="collection">Cobros</SelectItem>
            <SelectItem value="yield">Rendimientos</SelectItem>
            <SelectItem value="deposit">Depósitos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(categoryLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse border-b border-border last:border-0">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-32" />
                    <div className="h-2.5 bg-muted rounded w-20" />
                  </div>
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ArrowLeftRight className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Sin movimientos</p>
              <p className="text-sm text-muted-foreground mt-1">No se encontraron transacciones</p>
            </div>
          ) : (
            <div>
              {filtered.map((tx) => {
                const config = typeConfig[tx.type] || typeConfig.transfer_out;
                const Icon = config.icon;
                const isIncome = ["transfer_in", "collection", "yield", "deposit"].includes(tx.type);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                        <Icon className={`w-[18px] h-[18px] ${config.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tx.counterpart_name || tx.description || config.label}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-muted-foreground">
                            {tx.created_date && format(new Date(tx.created_date), "dd MMM yyyy, HH:mm", { locale: es })}
                          </p>
                          {tx.category && (
                            <Badge variant="outline" className="text-[10px] py-0">
                              {categoryLabels[tx.category] || tx.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className={`text-sm font-semibold ${isIncome ? "text-emerald-600" : "text-foreground"}`}>
                        {isIncome ? "+" : "-"} ${Math.abs(tx.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant={statusMap[tx.status]?.variant || "secondary"} className="text-[10px] mt-0.5">
                        {statusMap[tx.status]?.label || tx.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
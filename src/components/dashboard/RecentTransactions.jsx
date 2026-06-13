import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard, Building2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

const typeConfig = {
  transfer_in: { label: "Transferencia recibida", icon: ArrowDownLeft, color: "text-emerald-600" },
  transfer_out: { label: "Transferencia enviada", icon: ArrowUpRight, color: "text-red-500" },
  payment: { label: "Pago", icon: CreditCard, color: "text-red-500" },
  collection: { label: "Cobro", icon: ArrowDownLeft, color: "text-emerald-600" },
  yield: { label: "Rendimiento", icon: TrendingUp, color: "text-primary" },
  deposit: { label: "Depósito", icon: Building2, color: "text-emerald-600" },
};

const statusMap = {
  completed: { label: "Completado", variant: "default" },
  pending: { label: "Pendiente", variant: "secondary" },
  failed: { label: "Fallido", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "outline" },
};

function formatAmount(amount, type) {
  const isIncome = ["transfer_in", "collection", "yield", "deposit"].includes(type);
  const prefix = isIncome ? "+" : "-";
  return `${prefix} $${Math.abs(amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
}

export default function RecentTransactions({ transactions }) {
  const recent = transactions.slice(0, 8);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Últimos movimientos</CardTitle>
        <Link to="/movimientos" className="text-xs font-medium text-primary hover:underline">
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay movimientos aún
          </p>
        ) : (
          <div className="space-y-1">
            {recent.map((tx) => {
              const config = typeConfig[tx.type] || typeConfig.transfer_out;
              const Icon = config.icon;
              const isIncome = ["transfer_in", "collection", "yield", "deposit"].includes(tx.type);
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isIncome ? "bg-emerald-50" : "bg-red-50"}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {tx.counterpart_name || tx.description || config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.created_date && format(new Date(tx.created_date), "dd MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className={`text-sm font-semibold ${isIncome ? "text-emerald-600" : "text-foreground"}`}>
                      {formatAmount(tx.amount, tx.type)}
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
  );
}
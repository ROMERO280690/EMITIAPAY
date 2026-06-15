import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Solicitudes() {
  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-created_date", 30),
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-created_date", 30),
  });

  const allRequests = [
    ...payments.map((p) => ({ ...p, requestType: "payment" })),
    ...collections.map((c) => ({ ...c, requestType: "collection", contact_name: c.client_name })),
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const pending = allRequests.filter((r) =>
    r.status === "pending" || r.status === "sent" || r.status === "draft" || r.status === "scheduled"
  );

  const formatCurrency = (val, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  const statusConfig = {
    pending: { label: "Pendiente", className: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock },
    sent: { label: "Enviada", className: "bg-blue-50 text-blue-600 border-blue-200", icon: Mail },
    draft: { label: "Borrador", className: "bg-slate-50 text-slate-600 border-slate-200", icon: Clock },
    scheduled: { label: "Programada", className: "bg-blue-50 text-blue-600 border-blue-200", icon: Clock },
    completed: { label: "Completada", className: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: CheckCircle2 },
    paid: { label: "Cobrada", className: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: CheckCircle2 },
    overdue: { label: "Vencida", className: "bg-red-50 text-red-600 border-red-200", icon: AlertCircle },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitudes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Todas tus solicitudes de pago y cobro
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
          {pending.length} pendientes
        </Badge>
      </div>

      {allRequests.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No tenés solicitudes todavía</p>
            <p className="text-xs text-muted-foreground mt-1">Creá pagos y cobros para ver tus solicitudes aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allRequests.map((req) => {
            const config = statusConfig[req.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <Card key={req.id} className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      req.requestType === "payment" ? "bg-violet-50" : "bg-emerald-50"
                    }`}>
                      {req.requestType === "payment" ? (
                        <Mail className={`w-5 h-5 text-violet-600`} />
                      ) : (
                        <Mail className={`w-5 h-5 text-emerald-600`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {req.requestType === "payment" ? "Pago a" : "Cobro de"} {req.contact_name}
                        </p>
                        <Badge className={`text-[10px] ${req.requestType === "payment" ? "bg-violet-100 text-violet-600" : "bg-emerald-100 text-emerald-600"}`}>
                          {req.requestType === "payment" ? "Pago" : "Cobro"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{req.concept || "Sin concepto"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(req.amount, req.currency || "ARS")}</p>
                      <Badge className={config.className}>
                        <StatusIcon className="w-3 h-3 mr-1 inline" />
                        {config.label}
                      </Badge>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
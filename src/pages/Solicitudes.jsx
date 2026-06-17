import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowRight, Clock, CheckCircle2, AlertCircle, Receipt, PiggyBank } from "lucide-react";

const formatCurrency = (val, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

const statusConfig = {
  pending: { label: "Pendiente", className: "bg-amber-50 text-amber-600", icon: Clock },
  sent: { label: "Enviada", className: "bg-blue-50 text-blue-600", icon: Mail },
  draft: { label: "Borrador", className: "bg-slate-50 text-slate-600", icon: Clock },
  scheduled: { label: "Programada", className: "bg-blue-50 text-blue-600", icon: Clock },
  processing: { label: "En proceso", className: "bg-amber-50 text-amber-600", icon: Clock },
  completed: { label: "Completada", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  paid: { label: "Cobrada", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  overdue: { label: "Vencida", className: "bg-red-50 text-red-600", icon: AlertCircle },
  viewed: { label: "Vista", className: "bg-violet-50 text-violet-600", icon: Mail },
  failed: { label: "Fallida", className: "bg-red-50 text-red-600", icon: AlertCircle },
  cancelled: { label: "Cancelada", className: "bg-slate-50 text-slate-600", icon: AlertCircle },
  rejected: { label: "Rechazada", className: "bg-red-50 text-red-600", icon: AlertCircle },
  approved: { label: "Aprobada", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  disbursed: { label: "Desembolsada", className: "bg-blue-50 text-blue-600", icon: CheckCircle2 },
  emitido: { label: "Emitido", className: "bg-blue-50 text-blue-600", icon: Receipt },
  depositado: { label: "Depositado", className: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  pendiente_echeq: { label: "Pendiente", className: "bg-amber-50 text-amber-600", icon: Clock },
  rechazado: { label: "Rechazado", className: "bg-red-50 text-red-600", icon: AlertCircle },
};

const requestTypeConfig = {
  payment: { label: "Pago", color: "bg-violet-50 text-violet-600 border-violet-100", icon: Mail },
  collection: { label: "Cobro", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: Mail },
  echeq: { label: "eCheq", color: "bg-blue-50 text-blue-600 border-blue-100", icon: Receipt },
  financing: { label: "Financiamiento", color: "bg-amber-50 text-amber-600 border-amber-100", icon: PiggyBank },
};

export default function Solicitudes() {
  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-created_date", 30),
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-created_date", 30),
  });

  const { data: echeqs = [] } = useQuery({
    queryKey: ["echeqs"],
    queryFn: () => base44.entities.ECheq.list("-created_date", 30),
  });

  const { data: financings = [] } = useQuery({
    queryKey: ["financingRequests"],
    queryFn: () => base44.entities.FinancingRequest.list("-created_date", 30),
  });

  const allRequests = [
    ...payments.map((p) => ({ ...p, requestType: "payment" })),
    ...collections.map((c) => ({ ...c, requestType: "collection", contact_name: c.client_name })),
    ...echeqs.map((e) => ({ ...e, requestType: "echeq", contact_name: e.recipient_name })),
    ...financings.map((f) => ({ ...f, requestType: "financing", contact_name: f.product_type, concept: f.reason })),
  ].sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());

  const pending = allRequests.filter((r) =>
    ["pending", "sent", "draft", "scheduled", "processing", "pendiente"].includes(r.status)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitudes</h1>
          <p className="text-sm text-muted-foreground mt-1">Todas tus solicitudes de pago, cobro, eCheqs y financiamiento</p>
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
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allRequests.map((req) => {
            const config = statusConfig[req.status] || statusConfig.pending;
            const typeConfig = requestTypeConfig[req.requestType] || requestTypeConfig.payment;
            const StatusIcon = config.icon;

            return (
              <Card key={req.id} className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${typeConfig.color} flex items-center justify-center`}>
                      <typeConfig.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{req.concept || `${typeConfig.label} de ${req.contact_name || "—"}`}</p>
                        <Badge className={`text-[10px] px-1.5 ${typeConfig.color}`}>{typeConfig.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {req.requestType === "financing" ? (req.product_type === "prestamo_pyme" ? "Préstamo PyME" : req.product_type === "leasing" ? "Leasing" : "Descuento de cheques") : req.contact_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatCurrency(req.amount || req.requested_amount || 0, req.currency || "ARS")}
                      </p>
                      <Badge className={config.className}><StatusIcon className="w-3 h-3 mr-1 inline" />{config.label}</Badge>
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
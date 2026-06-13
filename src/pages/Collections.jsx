import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Clock, CheckCircle2, Eye, AlertTriangle, Mail, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "bg-muted text-muted-foreground" },
  sent: { label: "Enviado", icon: Mail, color: "bg-blue-50 text-blue-600" },
  viewed: { label: "Visto", icon: Eye, color: "bg-purple-50 text-purple-600" },
  paid: { label: "Cobrado", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
  overdue: { label: "Vencido", icon: AlertTriangle, color: "bg-orange-50 text-orange-600" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "bg-red-50 text-red-600" },
};

export default function Collections() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    client_name: "", client_email: "", amount: "", currency: "ARS",
    concept: "", invoice_number: "", due_date: ""
  });
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CollectionRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setOpen(false);
      setForm({ client_name: "", client_email: "", amount: "", currency: "ARS", concept: "", invoice_number: "", due_date: "" });
      toast.success("Cobro creado exitosamente");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CollectionRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Cobro actualizado");
    },
  });

  const totalPending = collections
    .filter((c) => ["pending", "sent", "viewed", "overdue"].includes(c.status))
    .reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cobros inteligentes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pendiente de cobro: <span className="font-semibold text-foreground">$ {totalPending.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo cobro</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear solicitud de cobro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Nombre del cliente" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} placeholder="email@cliente.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monto</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">ARS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nro. Factura</Label>
                  <Input value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} placeholder="FC-0001" />
                </div>
                <div className="space-y-2">
                  <Label>Vencimiento</Label>
                  <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Textarea value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Descripción del cobro" rows={2} />
              </div>
              <Button
                className="w-full"
                onClick={() => createMutation.mutate({ ...form, amount: parseFloat(form.amount), status: "pending" })}
                disabled={!form.client_name || !form.amount || createMutation.isPending}
              >
                {createMutation.isPending ? "Creando..." : "Crear cobro"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl" />)}</div>
      ) : collections.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Download className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Sin cobros registrados</p>
            <p className="text-sm text-muted-foreground mt-1">Creá tu primera solicitud de cobro</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {collections.map((col, i) => {
            const status = statusConfig[col.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <motion.div key={col.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{col.client_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {col.invoice_number && `${col.invoice_number} · `}
                          {col.concept || "Sin concepto"}
                        </p>
                        {col.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Vence: {format(new Date(col.due_date), "dd MMM yyyy", { locale: es })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3 flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold">
                          {col.currency === "USD" ? "US$ " : "$ "}
                          {col.amount?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </p>
                        <Badge className={`${status.color} text-[10px] border-0`}>{status.label}</Badge>
                      </div>
                      {col.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => updateMutation.mutate({ id: col.id, data: { status: "sent" } })}
                        >
                          Enviar
                        </Button>
                      )}
                      {(col.status === "sent" || col.status === "viewed" || col.status === "overdue") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => updateMutation.mutate({ id: col.id, data: { status: "paid" } })}
                        >
                          Marcar cobrado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
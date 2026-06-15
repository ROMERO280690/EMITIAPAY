import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Zap, Calendar, Clock, CheckCircle2, RotateCw, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig = {
  draft: { label: "Borrador", className: "bg-slate-50 text-slate-600 border-slate-200" },
  scheduled: { label: "Programado", className: "bg-blue-50 text-blue-600 border-blue-200" },
  processing: { label: "En proceso", className: "bg-amber-50 text-amber-600 border-amber-200" },
  completed: { label: "Completado", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
};

export default function PagosInteligentes() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    contactId: "", amount: "", currency: "ARS", concept: "", scheduledDate: "", recurring: "none"
  });
  const queryClient = useQueryClient();

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-created_date"),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const createPayment = useMutation({
    mutationFn: (data) => base44.entities.PaymentRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setOpen(false);
      toast.success("Pago inteligente creado");
    },
  });

  const formatCurrency = (val, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  const handleCreate = () => {
    if (!form.contactId || !form.amount) return;
    const contact = contacts.find((c) => c.id === form.contactId);
    createPayment.mutate({
      contact_name: contact?.name,
      contact_cuit: contact?.cuit,
      contact_cbu: contact?.cbu,
      amount: parseFloat(form.amount),
      currency: form.currency,
      concept: form.concept,
      category: "proveedores",
      scheduled_date: form.scheduledDate || undefined,
      status: form.scheduledDate ? "scheduled" : "draft",
    });
  };

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pagos inteligentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Automatizá y programá tus pagos a proveedores</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
              <Zap className="w-4 h-4" />
              Nuevo pago inteligente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear pago inteligente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Select value={form.contactId} onValueChange={(v) => setForm({ ...form, contactId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar contacto" /></SelectTrigger>
                  <SelectContent>
                    {contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5"><AvatarFallback className="text-[8px]">{getInitials(c.name)}</AvatarFallback></Avatar>
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Ej: Factura de servicios" />
              </div>
              <div className="space-y-2">
                <Label>Fecha programada</Label>
                <Input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Recurrencia</Label>
                <Select value={form.recurring} onValueChange={(v) => setForm({ ...form, recurring: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin recurrencia</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="biweekly">Quincenal</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createPayment.isPending}>
                {createPayment.isPending ? <RotateCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                Crear pago inteligente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {payments.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Zap className="w-12 h-12 text-violet-200 mb-4" />
            <p className="text-muted-foreground">No tenés pagos inteligentes configurados</p>
            <p className="text-xs text-muted-foreground mt-1">Creá pagos automáticos para simplificar tus operaciones</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm hover:shadow transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center`}>
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.concept || "Pago inteligente"}</p>
                    <p className="text-xs text-muted-foreground">{p.contact_name}</p>
                    {p.scheduled_date && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(p.scheduled_date), "dd/MM/yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatCurrency(p.amount, p.currency || "ARS")}</p>
                    <Badge className={statusConfig[p.status]?.className || "bg-slate-50"}>{statusConfig[p.status]?.label || p.status}</Badge>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
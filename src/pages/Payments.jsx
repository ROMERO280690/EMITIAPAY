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
import { Plus, Send, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

const statusConfig = {
  draft: { label: "Borrador", icon: Clock, color: "bg-muted text-muted-foreground" },
  scheduled: { label: "Programado", icon: Clock, color: "bg-blue-50 text-blue-600" },
  processing: { label: "Procesando", icon: Loader2, color: "bg-yellow-50 text-yellow-600" },
  completed: { label: "Completado", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
  failed: { label: "Fallido", icon: XCircle, color: "bg-red-50 text-red-600" },
};

export default function Payments() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    contact_name: "", contact_cuit: "", contact_cbu: "",
    amount: "", currency: "ARS", concept: "", category: "proveedores", scheduled_date: ""
  });
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-created_date"),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setOpen(false);
      setForm({ contact_name: "", contact_cuit: "", contact_cbu: "", amount: "", currency: "ARS", concept: "", category: "proveedores", scheduled_date: "" });
      toast.success("Pago creado exitosamente");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PaymentRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pago actualizado");
    },
  });

  const handleContactSelect = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setForm({ ...form, contact_name: contact.name, contact_cuit: contact.cuit || "", contact_cbu: contact.cbu || "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pagos inteligentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestioná pagos a proveedores y servicios</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo pago</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear nuevo pago</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {contacts.length > 0 && (
                <div className="space-y-2">
                  <Label>Seleccionar contacto</Label>
                  <Select onValueChange={handleContactSelect}>
                    <SelectTrigger><SelectValue placeholder="Elegir contacto existente" /></SelectTrigger>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Destinatario</Label>
                <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} placeholder="Nombre o razón social" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CUIT</Label>
                  <Input value={form.contact_cuit} onChange={(e) => setForm({ ...form, contact_cuit: e.target.value })} placeholder="XX-XXXXXXXX-X" />
                </div>
                <div className="space-y-2">
                  <Label>CBU</Label>
                  <Input value={form.contact_cbu} onChange={(e) => setForm({ ...form, contact_cbu: e.target.value })} placeholder="CBU destino" />
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
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proveedores">Proveedores</SelectItem>
                    <SelectItem value="servicios">Servicios</SelectItem>
                    <SelectItem value="sueldos">Sueldos</SelectItem>
                    <SelectItem value="impuestos">Impuestos</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Textarea value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Descripción del pago" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Fecha programada (opcional)</Label>
                <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
              </div>
              <Button
                className="w-full"
                onClick={() => createMutation.mutate({ ...form, amount: parseFloat(form.amount), status: form.scheduled_date ? "scheduled" : "draft" })}
                disabled={!form.contact_name || !form.amount || createMutation.isPending}
              >
                {createMutation.isPending ? "Creando..." : "Crear pago"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl" />)}</div>
      ) : payments.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Send className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Sin pagos registrados</p>
            <p className="text-sm text-muted-foreground mt-1">Creá tu primer pago para empezar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment, i) => {
            const status = statusConfig[payment.status] || statusConfig.draft;
            const StatusIcon = status.icon;
            return (
              <motion.div key={payment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{payment.contact_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{payment.concept || payment.category}</p>
                        {payment.scheduled_date && (
                          <p className="text-xs text-muted-foreground">
                            Programado: {format(new Date(payment.scheduled_date), "dd MMM yyyy", { locale: es })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3 flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold">
                          {payment.currency === "USD" ? "US$ " : "$ "}
                          {payment.amount?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </p>
                        <Badge className={`${status.color} text-[10px] border-0`}>{status.label}</Badge>
                      </div>
                      {payment.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => updateMutation.mutate({ id: payment.id, data: { status: "processing" } })}
                        >
                          Enviar
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
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileCheck, Receipt, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig = {
  pendiente: { label: "Pendiente", icon: Clock, className: "bg-amber-50 text-amber-600 border-amber-200" },
  emitido: { label: "Emitido", icon: FileCheck, className: "bg-blue-50 text-blue-600 border-blue-200" },
  depositado: { label: "Depositado", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  rechazado: { label: "Rechazado", icon: XCircle, className: "bg-red-50 text-red-600 border-red-200" },
};

const formatCurrency = (val, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

export default function ECheqs() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", currency: "ARS", recipient_name: "", recipient_cuit: "", concept: "", emission_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: cheques = [], isLoading } = useQuery({
    queryKey: ["echeqs"],
    queryFn: () => base44.entities.ECheq.list("-created_date"),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const createCheque = useMutation({
    mutationFn: (data) => base44.entities.ECheq.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["echeqs"] });
      setOpen(false);
      setForm({ amount: "", currency: "ARS", recipient_name: "", recipient_cuit: "", concept: "", emission_date: "" });
      toast.success("eCheq creado exitosamente");
    },
    onError: () => toast.error("Error al crear el eCheq"),
  });

  const updateCheque = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ECheq.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["echeqs"] });
      toast.success("eCheq actualizado");
    },
  });

  const handleCreate = () => {
    if (!form.amount || !form.recipient_name) {
      toast.error("Completá el monto y beneficiario");
      return;
    }
    createCheque.mutate({
      amount: parseFloat(form.amount),
      currency: form.currency,
      recipient_name: form.recipient_name,
      recipient_cuit: form.recipient_cuit,
      concept: form.concept,
      emission_date: form.emission_date || new Date().toISOString().split("T")[0],
      status: "pendiente",
    });
  };

  const handleSelectContact = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setForm({
        ...form,
        recipient_name: contact.name || "",
        recipient_cuit: contact.cuit || "",
      });
    }
  };

  const totalEmitidos = cheques.filter((c) => c.status === "emitido" || c.status === "pendiente").reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">eCheqs</h1>
          <p className="text-sm text-muted-foreground mt-1">Emití y gestioná cheques electrónicos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuevo eCheq
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Emitir eCheq</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
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

              {contacts.length > 0 && (
                <div className="space-y-2">
                  <Label>Beneficiario (de contactos)</Label>
                  <Select onValueChange={handleSelectContact}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar contacto" /></SelectTrigger>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Nombre del beneficiario</Label>
                <Input value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} placeholder="Nombre o razón social" />
              </div>
              <div className="space-y-2">
                <Label>CUIT del beneficiario</Label>
                <Input value={form.recipient_cuit} onChange={(e) => setForm({ ...form, recipient_cuit: e.target.value })} placeholder="XX-XXXXXXXX-X" />
              </div>
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Detalle del eCheq" />
              </div>
              <div className="space-y-2">
                <Label>Fecha de emisión</Label>
                <Input type="date" value={form.emission_date} onChange={(e) => setForm({ ...form, emission_date: e.target.value })} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createCheque.isPending}>
                {createCheque.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileCheck className="w-4 h-4 mr-2" />}
                Emitir eCheq
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Emitidos pendientes", value: formatCurrency(totalEmitidos, "ARS"), className: "bg-amber-50 text-amber-600" },
          { label: "Depositados", value: formatCurrency(cheques.filter((c) => c.status === "depositado").reduce((s, c) => s + (c.amount || 0), 0), "ARS"), className: "bg-emerald-50 text-emerald-600" },
          { label: "Total eCheqs", value: cheques.length.toString(), className: "bg-blue-50 text-blue-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.className} flex items-center justify-center mb-2`}>
                <Receipt className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl" />)}</div>
      ) : cheques.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No tenés eCheqs emitidos</p>
            <p className="text-xs text-muted-foreground mt-1">Emití tu primer eCheq para empezar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cheques.map((ch) => {
            const config = statusConfig[ch.status] || statusConfig.pendiente;
            const StatusIcon = config.icon;
            return (
              <Card key={ch.id} className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${config.className} flex items-center justify-center`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{ch.concept || `eCheq #${ch.id?.slice(-6)}`}</p>
                      <p className="text-xs text-muted-foreground">{ch.recipient_name || "Sin beneficiario"}</p>
                      {ch.emission_date && (
                        <p className="text-xs text-muted-foreground">Emitido: {format(new Date(ch.emission_date), "dd/MM/yyyy")}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(ch.amount, ch.currency || "ARS")}</p>
                      <Badge className={config.className}>{config.label}</Badge>
                    </div>
                    {ch.status === "pendiente" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => updateCheque.mutate({ id: ch.id, data: { status: "emitido" } })}>
                          <FileCheck className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
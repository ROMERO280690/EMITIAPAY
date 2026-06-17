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
import { Plus, Users, Calendar, Mail, Eye, CheckCircle2, AlertCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, className: "bg-amber-50 text-amber-600 border-amber-200" },
  sent: { label: "Enviado", icon: Mail, className: "bg-blue-50 text-blue-600 border-blue-200" },
  viewed: { label: "Visto", icon: Eye, className: "bg-violet-50 text-violet-600 border-violet-200" },
  paid: { label: "Cobrado", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  overdue: { label: "Vencido", icon: AlertCircle, className: "bg-red-50 text-red-600 border-red-200" },
  cancelled: { label: "Cancelado", icon: AlertCircle, className: "bg-slate-50 text-slate-600 border-slate-200" },
};

const formatCurrency = (val, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};
const getInitials = (name) => name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

export default function CobrosInteligentes() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ clientId: "", accountId: "", amount: "", currency: "ARS", concept: "", invoiceNumber: "", dueDate: "", recurring: "none" });
  const queryClient = useQueryClient();

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-created_date"),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const createCollection = useMutation({
    mutationFn: (data) => base44.entities.CollectionRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collectionRequests"] });
      setOpen(false);
      setForm({ clientId: "", accountId: "", amount: "", currency: "ARS", concept: "", invoiceNumber: "", dueDate: "", recurring: "none" });
      toast.success("Cobro inteligente creado");
    },
    onError: () => toast.error("Error al crear el cobro"),
  });

  const updateCollection = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CollectionRequest.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });

  const handleCreate = () => {
    if (!form.clientId || !form.amount) {
      toast.error("Completá cliente y monto");
      return;
    }
    const contact = contacts.find((c) => c.id === form.clientId);
    createCollection.mutate({
      client_name: contact?.name,
      client_email: contact?.email,
      amount: parseFloat(form.amount),
      currency: form.currency,
      concept: form.concept,
      invoice_number: form.invoiceNumber,
      due_date: form.dueDate || undefined,
      status: "pending",
    });
  };

  const pendingTotal = collections.filter((c) => c.status === "pending" || c.status === "sent").reduce((s, c) => s + (c.amount || 0), 0);
  const paidTotal = collections.filter((c) => c.status === "paid").reduce((s, c) => s + (c.amount || 0), 0);
  const overdueTotal = collections.filter((c) => c.status === "overdue").reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cobros inteligentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Automatizá y gestioná tus cobros a clientes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4" /> Nuevo cobro inteligente</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Crear cobro inteligente</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Cuenta de destino</Label>
                <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar cuenta" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active").map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name} ({a.currency})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
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
                    <SelectContent><SelectItem value="ARS">ARS</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Ej: Servicios profesionales" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>N° Factura</Label>
                  <Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} placeholder="FAC-001" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha vencimiento</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createCollection.isPending}>
                {createCollection.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                Crear cobro inteligente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pendientes de cobro", value: formatCurrency(pendingTotal, "ARS"), className: "bg-amber-50 text-amber-600" },
          { label: "Cobrados", value: formatCurrency(paidTotal, "ARS"), className: "bg-emerald-50 text-emerald-600" },
          { label: "Vencidos", value: formatCurrency(overdueTotal, "ARS"), className: "bg-red-50 text-red-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.className} flex items-center justify-center mb-2`}>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-12 h-12 text-emerald-200 mb-4" />
            <p className="text-muted-foreground">No tenés cobros inteligentes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {collections.map((c) => {
            const config = statusConfig[c.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isActive = c.status === "pending" || c.status === "sent";
            return (
              <Card key={c.id} className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${isActive ? "bg-emerald-50" : "bg-slate-50"} flex items-center justify-center`}>
                      <StatusIcon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.concept || `Cobro a ${c.client_name}`}</p>
                      <p className="text-xs text-muted-foreground">{c.client_name}</p>
                      {c.due_date && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> Vence: {format(new Date(c.due_date), "dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(c.amount, c.currency || "ARS")}</p>
                      <Badge className={config.className}><StatusIcon className="w-3 h-3 mr-1 inline" />{config.label}</Badge>
                    </div>
                    {isActive && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => updateCollection.mutate({ id: c.id, data: { status: "sent" } })} title="Marcar como enviado"><Mail className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => updateCollection.mutate({ id: c.id, data: { status: "paid" } })} title="Marcar como cobrado"><CheckCircle2 className="w-4 h-4" /></Button>
                      </div>
                    )}
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
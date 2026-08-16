import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Zap, Flame, Droplets, Wifi, Phone, Landmark, Home, Receipt, CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const SERVICE_CONFIG = {
  luz: { label: "Electricidad", icon: Zap, color: "bg-amber-100 text-amber-700" },
  gas: { label: "Gas", icon: Flame, color: "bg-orange-100 text-orange-700" },
  agua: { label: "Agua", icon: Droplets, color: "bg-blue-100 text-blue-700" },
  internet: { label: "Internet", icon: Wifi, color: "bg-violet-100 text-violet-700" },
  telefono: { label: "Teléfono", icon: Phone, color: "bg-indigo-100 text-indigo-700" },
  impuesto: { label: "Impuestos", icon: Landmark, color: "bg-rose-100 text-rose-700" },
  alquiler: { label: "Alquiler", icon: Home, color: "bg-emerald-100 text-emerald-700" },
  otros: { label: "Otros", icon: Receipt, color: "bg-gray-100 text-gray-700" },
};

const STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  paid: { label: "Pagada", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  overdue: { label: "Vencida", color: "bg-red-100 text-red-700", icon: AlertCircle },
  scheduled: { label: "Programada", color: "bg-blue-100 text-blue-700", icon: Clock },
};

export default function PagoServicios() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    provider_name: "",
    service_type: "luz",
    reference: "",
    amount: "",
    currency: "ARS",
    due_date: "",
  });

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["bills"],
    queryFn: () => base44.entities.Bill.list("-created_date", 100),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts_bills"],
    queryFn: () => base44.entities.Account.list("-created_date", 20),
  });

  const createBill = useMutation({
    mutationFn: (data) => base44.entities.Bill.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bills"] });
      toast.success("Factura agregada");
      setDialogOpen(false);
      setForm({ provider_name: "", service_type: "luz", reference: "", amount: "", currency: "ARS", due_date: "" });
    },
  });

  const payBill = useMutation({
    mutationFn: async ({ bill, accountId }) => {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) throw new Error("Seleccioná una cuenta");
      if ((account.balance || 0) < (bill.amount || 0)) throw new Error("Saldo insuficiente");
      await base44.entities.Account.update(account.id, { balance: (account.balance || 0) - bill.amount });
      await base44.entities.Bill.update(bill.id, { status: "paid", paid_date: new Date().toISOString().slice(0, 10), account_id: accountId });
      await base44.entities.Transaction.create({
        type: "payment",
        amount: bill.amount,
        currency: bill.currency,
        description: `Pago de servicio — ${SERVICE_CONFIG[bill.service_type]?.label || bill.provider_name}`,
        counterpart_name: bill.provider_name,
        category: "impuestos",
        status: "completed",
        account_id: accountId,
        reference: bill.reference || `BILL-${bill.id.slice(-6)}`,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bills"] });
      qc.invalidateQueries({ queryKey: ["accounts_bills"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["admin_transactions_full"] });
      toast.success("Factura pagada con éxito");
    },
    onError: (e) => toast.error(e.message || "No se pudo pagar"),
  });

  const deleteBill = useMutation({
    mutationFn: (id) => base44.entities.Bill.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bills"] });
      toast.success("Factura eliminada");
    },
  });

  const filtered = bills.filter((b) => {
    const ms = !search || (b.provider_name || "").toLowerCase().includes(search.toLowerCase()) || (b.reference || "").includes(search);
    const mst = statusFilter === "all" || b.status === statusFilter;
    return ms && mst;
  });

  const pending = bills.filter((b) => b.status === "pending").length;
  const overdue = bills.filter((b) => b.status === "overdue").length;
  const totalPending = bills.filter((b) => b.status === "pending" || b.status === "overdue").reduce((s, b) => s + (b.amount || 0), 0);

  const handleSubmit = () => {
    if (!form.provider_name.trim()) return toast.error("Ingresá el nombre del proveedor");
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error("Ingresá un monto válido");
    const today = new Date();
    const due = form.due_date ? new Date(form.due_date) : null;
    let status = "pending";
    if (due && differenceInDays(due, today) < 0) status = "overdue";
    createBill.mutate({
      ...form,
      amount: parseFloat(form.amount),
      status,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pago de servicios e impuestos</h1>
          <p className="text-sm text-muted-foreground">Gestioná y pagá facturas, impuestos y servicios</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Agregar factura</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar factura o impuesto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Proveedor / Ente</Label>
                <Input value={form.provider_name} onChange={(e) => setForm({ ...form, provider_name: e.target.value })} placeholder="Ej: Edenor, Aguas Andinas, AFIP..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo de servicio</Label>
                  <Select value={form.service_type} onValueChange={(v) => setForm({ ...form, service_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(SERVICE_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Moneda</Label>
                  <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Monto</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                </div>
                <div>
                  <Label>Vencimiento</Label>
                  <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Número de referencia (opcional)</Label>
                <Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="N° de factura o identificador" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createBill.isPending}>Agregar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pendientes", value: pending, color: "text-amber-600 bg-amber-50" },
          { label: "Vencidas", value: overdue, color: "text-red-600 bg-red-50" },
          { label: "Total a pagar", value: fmt(totalPending), color: "text-indigo-600 bg-indigo-50" },
          { label: "Pagadas", value: bills.filter((b) => b.status === "paid").length, color: "text-emerald-600 bg-emerald-50" },
        ].map((k) => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${k.color}`}>
                <Receipt className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por proveedor o referencia..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[["all", "Todas"], ["pending", "Pendientes"], ["overdue", "Vencidas"], ["paid", "Pagadas"]].map(([v, l]) => (
            <button key={v} onClick={() => setStatusFilter(v)} className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${statusFilter === v ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Bills list */}
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No hay facturas para mostrar</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Agregá tu primera factura o impuesto para empezar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((bill, i) => {
            const svc = SERVICE_CONFIG[bill.service_type] || SERVICE_CONFIG.otros;
            const st = STATUS_CONFIG[bill.status] || STATUS_CONFIG.pending;
            const Icon = svc.icon;
            const StIcon = st.icon;
            return (
              <motion.div key={bill.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${svc.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground truncate">{bill.provider_name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color} flex items-center gap-1`}>
                          <StIcon className="w-3 h-3" /> {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {svc.label}{bill.reference ? ` · Ref: ${bill.reference}` : ""}{bill.due_date ? ` · Vence: ${format(new Date(bill.due_date), "dd/MM/yyyy", { locale: es })}` : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-foreground">{fmt(bill.amount, bill.currency)}</p>
                      {bill.status === "pending" || bill.status === "overdue" ? (
                        <div className="flex gap-2 mt-2 justify-end">
                          <Select onValueChange={(accountId) => payBill.mutate({ bill, accountId })}>
                            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Pagar con..." /></SelectTrigger>
                            <SelectContent>
                              {accounts.filter((a) => a.currency === bill.currency).map((a) => (
                                <SelectItem key={a.id} value={a.id}>{a.name} ({fmt(a.balance, a.currency)})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/5 px-2 h-8" onClick={() => { if (confirm("¿Eliminar esta factura?")) deleteBill.mutate(bill.id); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : bill.status === "paid" ? (
                        <p className="text-xs text-emerald-600 mt-1">{bill.paid_date ? `Pagada ${format(new Date(bill.paid_date), "dd/MM/yy")}` : ""}</p>
                      ) : null}
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
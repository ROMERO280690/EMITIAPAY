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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Landmark, TrendingUp, Calendar, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

const formatCurrency = (val, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

const typeLabels = { plazo_fijo: "Plazo fijo", fci: "FCI", acciones: "Acciones", bonos: "Bonos" };
const typeColors = {
  plazo_fijo: "bg-blue-50 text-blue-600",
  fci: "bg-violet-50 text-violet-600",
  acciones: "bg-emerald-50 text-emerald-600",
  bonos: "bg-amber-50 text-amber-600",
};

const TNA_BY_TYPE = { plazo_fijo: 0.3864, fci: 0.42, acciones: 0, bonos: 0.25 };
const MIN_DAYS = { plazo_fijo: 30, fci: 1, acciones: 1, bonos: 30 };

export default function Inversiones() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "plazo_fijo", amount: "", currency: "ARS", duration: "30", accountId: "" });
  const queryClient = useQueryClient();

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: () => base44.entities.Investment.list("-created_date"),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const originAccount = accounts.find((a) => a.id === form.accountId);
  const amountNum = parseFloat(form.amount) || 0;
  const exceedsBalance = originAccount && amountNum > originAccount.balance;

  const estimatedYield = () => {
    if (!amountNum) return 0;
    const tna = TNA_BY_TYPE[form.type] || 0;
    const days = parseInt(form.duration) || 30;
    return (amountNum * tna * days) / 365;
  };

  const createInvestment = useMutation({
    mutationFn: async (data) => {
      if (!originAccount) throw new Error("Seleccioná una cuenta");
      if (amountNum > originAccount.balance) throw new Error("Fondos insuficientes");

      // Debit account
      await base44.entities.Account.update(originAccount.id, { balance: originAccount.balance - amountNum });

      // Create transaction record
      await base44.entities.Transaction.create({
        type: "deposit",
        amount: amountNum,
        currency: data.currency,
        description: `Inversión: ${typeLabels[data.type] || data.type}`,
        category: "rendimientos",
        status: "completed",
        account_id: originAccount.id,
      });

      // Create investment
      return base44.entities.Investment.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setOpen(false);
      setForm({ type: "plazo_fijo", amount: "", currency: "ARS", duration: "30", accountId: "" });
      toast.success("Inversión creada exitosamente");
    },
    onError: (err) => toast.error(err.message || "Error al crear la inversión"),
  });

  const handleCreate = () => {
    if (!form.accountId || !form.amount || amountNum <= 0) {
      toast.error("Completá todos los campos");
      return;
    }
    if (exceedsBalance) {
      toast.error("Fondos insuficientes en la cuenta seleccionada");
      return;
    }

    const startDate = new Date().toISOString().split("T")[0];
    const durationDays = parseInt(form.duration);
    const maturity = new Date();
    maturity.setDate(maturity.getDate() + durationDays);

    createInvestment.mutate({
      type: form.type,
      amount: amountNum,
      currency: form.currency,
      duration_days: durationDays,
      rate: TNA_BY_TYPE[form.type] || 0,
      expected_yield: estimatedYield(),
      start_date: startDate,
      maturity_date: maturity.toISOString().split("T")[0],
      status: "active",
      account_id: form.accountId,
    });
  };

  const activeTotal = investments.filter((i) => i.status === "active").reduce((s, i) => s + (i.amount || 0), 0);
  const totalYield = investments.filter((i) => i.status === "active").reduce((s, i) => s + (i.expected_yield || 0), 0);
  const nextMaturity = investments.filter((i) => i.status === "active").sort((a, b) => new Date(a.maturity_date) - new Date(b.maturity_date))[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inversiones</h1>
          <p className="text-sm text-muted-foreground mt-1">Plazos fijos, FCI, acciones y bonos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nueva inversión</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Nueva inversión</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Cuenta de origen</Label>
                <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar cuenta" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active").map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {formatCurrency(a.balance || 0, a.currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {exceedsBalance && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Fondos insuficientes
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tipo de inversión</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v, duration: String(MIN_DAYS[v]) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plazo_fijo">Plazo fijo (38.64% TNA)</SelectItem>
                    <SelectItem value="fci">Fondo común de inversión (42% TNA)</SelectItem>
                    <SelectItem value="acciones">Acciones</SelectItem>
                    <SelectItem value="bonos">Bonos (25% TNA)</SelectItem>
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
              {form.type !== "acciones" && (
                <div className="space-y-2">
                  <Label>Plazo (días)</Label>
                  <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[30, 60, 90, 180, 365].map((d) => (
                        <SelectItem key={d} value={String(d)}>{d} días</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {amountNum > 0 && TNA_BY_TYPE[form.type] > 0 && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
                  <p>Rendimiento estimado: <strong>{formatCurrency(estimatedYield(), form.currency)}</strong></p>
                  <p className="text-xs mt-0.5">{form.duration} días al {(TNA_BY_TYPE[form.type] * 100).toFixed(2)}% TNA</p>
                </div>
              )}
              <Button className="w-full" onClick={handleCreate} disabled={createInvestment.isPending || exceedsBalance || !amountNum}>
                {createInvestment.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Landmark className="w-4 h-4 mr-2" />}
                Confirmar inversión
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Invertido total", value: formatCurrency(activeTotal, "ARS"), icon: Landmark, color: "bg-blue-50 text-blue-600" },
          { label: "Rendimiento esperado", value: formatCurrency(totalYield, "ARS"), icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
          { label: "Inversiones activas", value: investments.filter((i) => i.status === "active").length.toString(), icon: Landmark, color: "bg-violet-50 text-violet-600" },
          { label: "Próximo vencimiento", value: nextMaturity ? format(new Date(nextMaturity.maturity_date), "dd/MM", { locale: es }) : "—", icon: Calendar, color: "bg-amber-50 text-amber-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Inversiones activas</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : investments.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <Landmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No tenés inversiones activas</p>
              <p className="text-xs text-muted-foreground mt-1">Creá tu primera inversión para hacer crecer tu capital</p>
            </div>
          ) : (
            <div className="space-y-3">
              {investments.map((inv, idx) => (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${typeColors[inv.type] || "bg-blue-50"} flex items-center justify-center`}>
                        <Landmark className={`w-5 h-5 ${inv.type === "plazo_fijo" ? "text-blue-600" : "text-violet-600"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{typeLabels[inv.type] || inv.type}</p>
                        <p className="text-xs text-muted-foreground">
                          Inicio: {inv.start_date ? format(new Date(inv.start_date), "dd/MM/yyyy") : ""}
                          {" · "}Vence: {inv.maturity_date ? format(new Date(inv.maturity_date), "dd/MM/yyyy") : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(inv.amount, inv.currency || "ARS")}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge className={inv.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-600"}>
                          {inv.status === "active" ? "Activo" : inv.status === "matured" ? "Vencido" : "Cancelado"}
                        </Badge>
                        {inv.expected_yield > 0 && (
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">
                            +{formatCurrency(inv.expected_yield, inv.currency)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
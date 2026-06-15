import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Landmark, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Inversiones() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "plazo_fijo", amount: "", currency: "ARS", duration: "30" });
  const queryClient = useQueryClient();

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: () => base44.entities.Transaction.filter({ type: "deposit" }, "-created_date", 20),
  });

  const formatCurrency = (val, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  const typeLabels = {
    plazo_fijo: "Plazo fijo",
    fci: "Fondo común de inversión",
    acciones: "Acciones",
    bonos: "Bonos",
  };

  const estimatedYield = () => {
    const amount = parseFloat(form.amount) || 0;
    const duration = parseInt(form.duration) || 30;
    if (form.type === "plazo_fijo") {
      const tna = 0.3864;
      return (amount * tna * duration) / 365;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inversiones</h1>
          <p className="text-sm text-muted-foreground mt-1">Plazos fijos y fondos comunes de inversión</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva inversión
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva inversión</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Tipo de inversión</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plazo_fijo">Plazo fijo</SelectItem>
                    <SelectItem value="fci">Fondo común de inversión</SelectItem>
                    <SelectItem value="acciones">Acciones</SelectItem>
                    <SelectItem value="bonos">Bonos</SelectItem>
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
              {form.type === "plazo_fijo" && (
                <>
                  <div className="space-y-2">
                    <Label>Plazo (días)</Label>
                    <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="60">60 días</SelectItem>
                        <SelectItem value="90">90 días</SelectItem>
                        <SelectItem value="180">180 días</SelectItem>
                        <SelectItem value="365">365 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
                    <p>Rendimiento estimado: <strong>{formatCurrency(estimatedYield(), form.currency)}</strong> ({form.duration} días al 38.64% TNA)</p>
                  </div>
                </>
              )}
              <Button className="w-full" onClick={() => { toast.success("Inversión creada"); setOpen(false); }}>
                <Landmark className="w-4 h-4 mr-2" /> Confirmar inversión
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Invertido ARS", value: "$ 391.970,00", icon: Landmark, color: "bg-blue-50 text-blue-600" },
          { label: "Rendimiento mensual", value: "$ 12.520,00", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
          { label: "TNA promedio", value: "38.64%", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
          { label: "Próximo vencimiento", value: "30 días", icon: Calendar, color: "bg-amber-50 text-amber-600" },
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
        <CardHeader>
          <CardTitle className="text-base">Inversiones activas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : investments.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <Landmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No tenés inversiones activas</p>
              <p className="text-xs text-muted-foreground mt-1">Creá tu primera inversión para hacer crecer tu capital</p>
            </div>
          ) : (
            <div className="space-y-3">
              {investments.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Landmark className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{inv.description || "Plazo fijo"}</p>
                      <p className="text-xs text-muted-foreground">
                        {inv.created_date ? format(new Date(inv.created_date), "dd/MM/yyyy") : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(inv.amount, inv.currency || "ARS")}</p>
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 mt-1">Activo</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
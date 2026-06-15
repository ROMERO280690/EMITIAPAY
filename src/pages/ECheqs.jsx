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
import { Copy, FileCheck, Plus, Receipt, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  pendiente: { label: "Pendiente", icon: Clock, className: "bg-amber-50 text-amber-600 border-amber-200" },
  emitido: { label: "Emitido", icon: FileCheck, className: "bg-blue-50 text-blue-600 border-blue-200" },
  depositado: { label: "Depositado", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  rechazado: { label: "Rechazado", icon: XCircle, className: "bg-red-50 text-red-600 border-red-200" },
};

export default function ECheqs() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", currency: "ARS", recipient: "", concept: "" });
  const queryClient = useQueryClient();

  const { data: cheques = [] } = useQuery({
    queryKey: ["cheques"],
    queryFn: () => base44.entities.PaymentRequest.list("-created_date"),
  });

  const formatCurrency = (val, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">eCheqs</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión de cheques electrónicos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo eCheq
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear eCheq</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
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
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Input
                  value={form.concept}
                  onChange={(e) => setForm({ ...form, concept: e.target.value })}
                  placeholder="Detalle del eCheq"
                />
              </div>
              <Button className="w-full" onClick={() => { toast.success("eCheq creado"); setOpen(false); }}>
                <FileCheck className="w-4 h-4 mr-2" /> Emitir eCheq
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {cheques.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No tenés eCheqs todavía</p>
            <p className="text-xs text-muted-foreground mt-1">Creá tu primer eCheq para empezar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cheques.slice(0, 10).map((ch, idx) => (
            <Card key={idx} className="border-0 shadow-sm hover:shadow transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{ch.concept || `eCheq #${ch.id?.slice(-6)}`}</p>
                    <p className="text-xs text-muted-foreground">{ch.contact_name || "Sin destinatario"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold tabular-nums">{formatCurrency(ch.amount, ch.currency || "ARS")}</span>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">Pendiente</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
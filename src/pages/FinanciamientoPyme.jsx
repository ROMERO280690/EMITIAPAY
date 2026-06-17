import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank, Building2, TrendingUp, ArrowRight, FileText, ShieldCheck, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, className: "bg-amber-50 text-amber-600" },
  approved: { label: "Aprobado", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "Rechazado", icon: XCircle, className: "bg-red-50 text-red-600" },
  disbursed: { label: "Desembolsado", icon: PiggyBank, className: "bg-blue-50 text-blue-600" },
};

const products = [
  { type: "prestamo_pyme", title: "Préstamo PyME", description: "Capital de trabajo con tasa preferencial", amount: "Hasta $5.000.000", rate: "TNA 42%", term: "36 meses", color: "bg-blue-50 text-blue-600" },
  { type: "leasing", title: "Leasing de equipamiento", description: "Adquirí maquinaria con opción de compra", amount: "Hasta $2.500.000", rate: "TNA 38%", term: "48 meses", color: "bg-violet-50 text-violet-600" },
  { type: "descuento_cheques", title: "Descuento de cheques", description: "Adelantá el cobro de cheques diferidos", amount: "Hasta $1.200.000", rate: "TNA 35%", term: "180 días", color: "bg-emerald-50 text-emerald-600" },
];

export default function FinanciamientoPyme() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ amount: "", term: "", reason: "" });
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["financingRequests"],
    queryFn: () => base44.entities.FinancingRequest.list("-created_date"),
  });

  const createRequest = useMutation({
    mutationFn: (data) => base44.entities.FinancingRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financingRequests"] });
      setOpen(false);
      setForm({ amount: "", term: "", reason: "" });
      setSelectedProduct(null);
      toast.success("Solicitud enviada. Te contactaremos pronto.");
    },
    onError: () => toast.error("Error al enviar la solicitud"),
  });

  const openProductDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.amount || !selectedProduct) {
      toast.error("Completá el monto solicitado");
      return;
    }
    createRequest.mutate({
      product_type: selectedProduct.type,
      requested_amount: parseFloat(form.amount),
      currency: "ARS",
      term_months: parseInt(form.term) || 36,
      reason: form.reason,
      status: "pending",
    });
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financiamiento PyME</h1>
        <p className="text-sm text-muted-foreground mt-1">Opciones de financiamiento para hacer crecer tu empresa</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Línea disponible", value: "$ 8.700.000", icon: Building2, color: "bg-blue-50 text-blue-600" },
          { label: "Tasa promedio", value: "38.3% TNA", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
          { label: "Solicitudes activas", value: pendingCount.toString(), icon: FileText, color: "bg-emerald-50 text-emerald-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {products.map((prod, idx) => (
          <Card key={idx} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${prod.color} flex items-center justify-center flex-shrink-0`}>
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{prod.title}</h3>
                      <Badge className={`${prod.color} border-current/20`}><ShieldCheck className="w-3 h-3 mr-1 inline" />Disponible</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{prod.description}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">Monto: <strong>{prod.amount}</strong></span>
                      <span className="text-xs text-muted-foreground">Tasa: <strong>{prod.rate}</strong></span>
                      <span className="text-xs text-muted-foreground">Plazo: <strong>{prod.term}</strong></span>
                    </div>
                  </div>
                </div>
                <Button className="gap-2 flex-shrink-0" onClick={() => openProductDialog(prod)}>Solicitar <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-base mb-4">Mis solicitudes</h3>
            {isLoading ? (
              <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => {
                  const product = products.find((p) => p.type === req.product_type);
                  const config = statusConfig[req.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${product?.color || "bg-blue-50"} flex items-center justify-center`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{product?.title || "Solicitud"}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.reason || "Sin motivo especificado"}
                            {" · "}{req.created_date ? format(new Date(req.created_date), "dd/MM/yyyy") : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {req.currency === "USD" ? "US$ " : "$ "}{(req.requested_amount || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </p>
                        <Badge className={config.className}>{config.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm bg-blue-50/50">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold">¿Necesitás asesoramiento?</h3>
              <p className="text-sm text-muted-foreground mt-1">Nuestro equipo de asesores financieros puede ayudarte a elegir la mejor opción para tu empresa.</p>
              <Button variant="outline" className="gap-2 mt-3" onClick={() => openProductDialog({ type: "asesoramiento", title: "Asesoramiento personalizado" })}>
                Solicitar asesoramiento <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{selectedProduct?.title || "Solicitar financiamiento"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            {selectedProduct && selectedProduct.type !== "asesoramiento" && (
              <div className="p-3 rounded-lg bg-accent/50 text-sm">
                <p className="font-medium">{selectedProduct.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedProduct.description}</p>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>Monto: <strong>{selectedProduct.amount}</strong></span>
                  <span>Tasa: <strong>{selectedProduct.rate}</strong></span>
                  <span>Plazo: <strong>{selectedProduct.term}</strong></span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Monto solicitado</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Plazo (meses)</Label>
              <Select value={form.term} onValueChange={(v) => setForm({ ...form, term: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar plazo" /></SelectTrigger>
                <SelectContent>
                  {[12, 24, 36, 48, 60].map((m) => <SelectItem key={m} value={String(m)}>{m} meses</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Motivo / Destino de los fondos</Label>
              <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Ej: Compra de maquinaria, capital de trabajo..." rows={3} />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={createRequest.isPending}>
              {createRequest.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PiggyBank className="w-4 h-4 mr-2" />}
              Enviar solicitud
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
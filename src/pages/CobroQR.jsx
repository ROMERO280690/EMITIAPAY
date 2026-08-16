import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "react-qr-code";
import { QrCode, Download, Share2, Copy, Check, TrendingUp, Clock, CheckCircle2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  sent: { label: "Enviado", color: "bg-blue-100 text-blue-700", icon: Receipt },
  viewed: { label: "Visto", color: "bg-violet-100 text-violet-700", icon: Receipt },
  paid: { label: "Pagado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  overdue: { label: "Vencido", color: "bg-red-100 text-red-700", icon: Clock },
  cancelled: { label: "Cancelado", color: "bg-gray-100 text-gray-500", icon: Receipt },
};

export default function CobroQR() {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(null);

  const { data: collections = [] } = useQuery({
    queryKey: ["qr_collections"],
    queryFn: () => base44.entities.CollectionRequest.filter({ status: "pending" }, "-created_date", 20),
  });

  const { data: paidCollections = [] } = useQuery({
    queryKey: ["paid_collections"],
    queryFn: () => base44.entities.CollectionRequest.filter({ status: "paid" }, "-created_date", 20),
  });

  const generateQR = useMutation({
    mutationFn: async (data) => {
      const link = `https://emitia.pay/cobrar/${Date.now()}`;
      return base44.entities.CollectionRequest.create({
        client_name: "Cobro por QR",
        amount: data.amount,
        currency: data.currency,
        concept: data.concept || "Cobro por código QR",
        status: "pending",
        payment_link: link,
      });
    },
    onSuccess: (record) => {
      qc.invalidateQueries({ queryKey: ["qr_collections"] });
      setGenerated(record);
      toast.success("Código QR generado");
    },
  });

  const handleGenerate = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Ingresá un monto válido");
    generateQR.mutate({ amount: amt, currency, concept });
  };

  const qrPayload = generated
    ? JSON.stringify({ type: "payment", id: generated.id, amount: generated.amount, currency: generated.currency, concept: generated.concept, link: generated.payment_link })
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(generated.payment_link || "");
    setCopied(true);
    toast.success("Link copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Cobro EMITIA PAY", text: `Pago de ${fmt(generated.amount, generated.currency)} — ${generated.concept}`, url: generated.payment_link });
      } catch { /* cancelado */ }
    } else {
      copyLink();
    }
  };

  const downloadQR = () => {
    const svg = document.querySelector("#qr-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 300; canvas.height = 300;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const a = document.createElement("a");
      a.download = `qr-emitia-${generated.id.slice(-6)}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  const totalPending = collections.reduce((s, c) => s + (c.amount || 0), 0);
  const totalPaid = paidCollections.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cobro con QR</h1>
        <p className="text-sm text-muted-foreground">Generá códigos QR para cobrar al instante, como Mercado Pago</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Generator */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Generar código de cobro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>Monto a cobrar</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="text-lg font-semibold" />
              </div>
              <div>
                <Label>Moneda</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">ARS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Concepto (opcional)</Label>
              <Input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Ej: Venta de productos, Servicio..." />
            </div>
            <Button className="w-full" size="lg" onClick={handleGenerate} disabled={generateQR.isPending || !amount}>
              <QrCode className="w-4 h-4 mr-2" />
              {generateQR.isPending ? "Generando..." : "Generar código QR"}
            </Button>

            {generated && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-border pt-4">
                <div className="flex flex-col items-center p-5 bg-white rounded-xl border border-border">
                  <QRCode id="qr-svg" value={qrPayload} size={180} level="M" />
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{fmt(generated.amount, generated.currency)}</p>
                    <p className="text-sm text-muted-foreground">{generated.concept || "Cobro por QR"}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={copyLink}>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copiado" : "Copiar link"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={shareLink}>
                    <Share2 className="w-3.5 h-3.5" /> Compartir
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={downloadQR}>
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Stats + Recent */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-lg font-bold">{fmt(totalPending)}</p>
                <p className="text-xs text-muted-foreground">Pendiente de cobro</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-lg font-bold">{fmt(totalPaid)}</p>
                <p className="text-xs text-muted-foreground">Total cobrado</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cobros pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              {collections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No hay cobros pendientes</p>
              ) : (
                <div className="space-y-2">
                  {collections.slice(0, 6).map((c) => {
                    const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={c.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{c.concept || c.client_name}</p>
                          <p className="text-xs text-muted-foreground">{c.created_date ? format(new Date(c.created_date), "dd/MM/yy HH:mm", { locale: es }) : "—"}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold">{fmt(c.amount, c.currency)}</p>
                          <Badge className={`text-[10px] ${st.color}`}>{st.label}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
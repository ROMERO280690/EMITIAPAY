import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, QrCode, Share2, Wallet, Clipboard } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export default function RecibirDinero() {
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const [selectedAccount, setSelectedAccount] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const account = accounts.find((a) => a.id === selectedAccount);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recibir dinero</h1>
        <p className="text-sm text-muted-foreground mt-1">Compartí tus datos para recibir transferencias</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Seleccioná la cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Cuenta de destino</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Elegí dónde recibir el dinero" />
              </SelectTrigger>
              <SelectContent>
                {accounts.filter((a) => a.status === "active").map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} — {a.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {account && (
            <div className="space-y-4 animate-in fade-in">
              {/* CBU */}
              <div className="p-4 rounded-xl bg-accent/50">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground uppercase">CBU</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1"
                    onClick={() => copyToClipboard(account.cbu || "0000000000000000000000", "cbu")}
                  >
                    {copiedField === "cbu" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-lg font-mono font-semibold tracking-wide">
                  {account.cbu || "0000000000000000000000"}
                </p>
              </div>

              {/* Alias */}
              {account.alias && (
                <div className="p-4 rounded-xl bg-accent/50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground uppercase">Alias</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1"
                      onClick={() => copyToClipboard(account.alias, "alias")}
                    >
                      {copiedField === "alias" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                  <p className="text-lg font-semibold">{account.alias}</p>
                </div>
              )}

              {/* QR Code */}
              <div className="flex flex-col items-center p-6 rounded-xl bg-white border border-border">
                <QRCode
                  value={`CBU:${account.cbu || ""}|ALIAS:${account.alias || ""}|NAME:${account.name}|CUR:${account.currency}`}
                  size={160}
                  level="M"
                  className="mb-3"
                />
                <p className="text-sm font-medium">Código QR de la cuenta</p>
                <p className="text-xs text-muted-foreground">Compartilo para recibir pagos rápido</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => {
                  const data = `CBU: ${account.cbu || "0000000000000000000000"}\nAlias: ${account.alias || ""}\nCuenta: ${account.name}`;
                  navigator.clipboard.writeText(data);
                  toast.success("Datos copiados");
                }}>
                  <Clipboard className="w-4 h-4" />
                  Copiar todo
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={async () => {
                  const shareData = {
                    title: "Datos para transferencia — EMITIA PAY",
                    text: `Cuenta: ${account.name}\nCBU: ${account.cbu || ""}\nAlias: ${account.alias || ""}`,
                  };
                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch {
                      /* usuario canceló */
                    }
                  } else {
                    navigator.clipboard.writeText(shareData.text);
                    toast.success("Datos copiados al portapapeles");
                  }
                }}>
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">¿Cómo recibir dinero?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Compartí tus datos", desc: "Enviale tu CBU o alias a quien te va a transferir" },
            { step: "2", title: "Te transfieren", desc: "La otra persona hace la transferencia desde su banco o billetera" },
            { step: "3", title: "Recibís el dinero", desc: "El monto se acredita en tu cuenta automáticamente" },
          ].map((s) => (
            <div key={s.step} className="text-center p-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                {s.step}
              </div>
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
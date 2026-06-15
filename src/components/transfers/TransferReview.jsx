import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowRight, Building2, ShieldCheck, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const EXCHANGE_RATE = 1250;
const getInitials = (name) => name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";
const formatCurrency = (amount, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(amount || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

export default function TransferReview({
  tab,
  form,
  accounts,
  contacts,
  originAccount,
  destinationAccount,
  selectedContact,
  onConfirm,
  onCancel,
  submitting,
}) {
  const amountNum = parseFloat(form.amount) || 0;
  const destName = tab === "own" ? destinationAccount?.name : selectedContact?.name;
  const destInitials = tab === "own" ? getInitials(destinationAccount?.name) : getInitials(selectedContact?.name);
  const destDetail = tab === "own"
    ? `${destinationAccount?.account_type === "remunerada" ? "Cuenta remunerada" : "Cuenta corriente"} · ${destinationAccount?.currency}`
    : selectedContact?.cuit || selectedContact?.email || "Contacto";

  const showCrossCurrency =
    tab === "own" && originAccount && destinationAccount && originAccount.currency !== destinationAccount.currency;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revisar transferencia</h1>
        <p className="text-sm text-muted-foreground mt-1">Verificá los datos antes de confirmar</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Flow */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold">{originAccount?.name}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(originAccount?.balance || 0, originAccount?.currency)}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-semibold mt-1 text-primary">{formatCurrency(amountNum, originAccount?.currency)}</p>
            </div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent flex items-center justify-center mb-2">
                <Avatar className="w-8 h-8"><AvatarFallback className="text-[10px] bg-accent">{destInitials}</AvatarFallback></Avatar>
              </div>
              <p className="text-sm font-semibold">{destName}</p>
              <p className="text-xs text-muted-foreground">{destDetail}</p>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3">
            <DetailRow label="Cuenta de origen" value={`${originAccount?.name} (${originAccount?.currency})`} />
            <DetailRow label="Destino" value={destName} />
            <DetailRow label="Monto" value={formatCurrency(amountNum, originAccount?.currency)} highlight />
            {form.concept && <DetailRow label="Concepto" value={form.concept} />}
            <Separator />
            <DetailRow label="Saldo después de la transferencia" value={formatCurrency((originAccount?.balance || 0) - amountNum, originAccount?.currency)} highlight />
          </div>

          {/* Cross currency */}
          {showCrossCurrency && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Conversión de moneda</p>
                <p>Tipo de cambio: {originAccount?.currency === "USD" ? `1 USD = $${EXCHANGE_RATE.toLocaleString("es-AR")} ARS` : `$${EXCHANGE_RATE.toLocaleString("es-AR")} ARS = 1 USD`}</p>
                <p className="mt-0.5">Recibís: <strong>{formatCurrency(amountNum * (originAccount?.currency === "USD" ? EXCHANGE_RATE : 1 / EXCHANGE_RATE), destinationAccount?.currency)}</strong></p>
              </div>
            </div>
          )}

          {/* Validation badge */}
          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-0.5">Transferencia verificada</p>
              <p>Los fondos están disponibles y la operación se procesará de inmediato. Una vez confirmada, no se puede deshacer.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onCancel} disabled={submitting}>
              <XCircle className="w-4 h-4 mr-2" /> Cancelar
            </Button>
            <Button className="flex-1" onClick={onConfirm} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
              ) : (
                <><ShieldCheck className="w-4 h-4 mr-2" /> Confirmar transferencia</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-base" : "font-medium"}>{value}</span>
    </div>
  );
}
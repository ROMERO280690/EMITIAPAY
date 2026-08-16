import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, TrendingUp, TrendingDown, DollarSign, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

// Tasas de referencia (mock realista para Argentina)
const RATES = {
  mep: { buy: 1285, sell: 1310, label: "Dólar MEP" },
  blue: { buy: 1340, sell: 1380, label: "Dólar Blue" },
  cripto: { buy: 1295, sell: 1320, label: "Dólar Cripto" },
};

export default function CambioDivisas() {
  const qc = useQueryClient();
  const [operation, setOperation] = useState("buy"); // buy = ARS->USD, sell = USD->ARS
  const [rateType, setRateType] = useState("mep");
  const [amount, setAmount] = useState("");
  const [executing, setExecuting] = useState(false);

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts_fx"],
    queryFn: () => base44.entities.Account.list("-created_date", 20),
  });

  const { data: fxTransactions = [] } = useQuery({
    queryKey: ["fx_transactions"],
    queryFn: () => base44.entities.Transaction.filter({ type: "transfer_out" }, "-created_date", 10),
  });

  const rate = RATES[rateType];
  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = operation === "buy"
    ? numericAmount / rate.sell
    : numericAmount * rate.buy;
  const effectiveRate = operation === "buy" ? rate.sell : rate.buy;

  const arsAccount = accounts.find((a) => a.currency === "ARS");
  const usdAccount = accounts.find((a) => a.currency === "USD");

  const executeFx = useMutation({
    mutationFn: async () => {
      setExecuting(true);
      const fromAccount = operation === "buy" ? arsAccount : usdAccount;
      const toAccount = operation === "buy" ? usdAccount : arsAccount;
      if (!fromAccount || !toAccount) throw new Error("Falta cuenta ARS o USD");

      if (numericAmount > (fromAccount.balance || 0)) {
        throw new Error("Saldo insuficiente en la cuenta de origen");
      }

      // Debitar de origen
      await base44.entities.Account.update(fromAccount.id, { balance: (fromAccount.balance || 0) - numericAmount });
      // Acreditar en destino
      const creditAmount = operation === "buy" ? convertedAmount : convertedAmount;
      await base44.entities.Account.update(toAccount.id, { balance: (toAccount.balance || 0) + creditAmount });
      // Registrar transacción
      await base44.entities.Transaction.create({
        type: "transfer_out",
        amount: numericAmount,
        currency: operation === "buy" ? "ARS" : "USD",
        description: `Cambio de divisas — Dólar ${rate.label}`,
        counterpart_name: "Cambio de moneda",
        category: "otros",
        status: "completed",
        account_id: fromAccount.id,
        reference: `FX-${rateType.toUpperCase()}-${Date.now()}`,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts_fx"] });
      qc.invalidateQueries({ queryKey: ["fx_transactions"] });
      qc.invalidateQueries({ queryKey: ["admin_transactions_full"] });
      toast.success(`Operación completada — ${operation === "buy" ? "Compraste" : "Vendiste"} ${fmt(operation === "buy" ? convertedAmount : numericAmount, operation === "buy" ? "USD" : "ARS")}`);
      setAmount("");
    },
    onError: (e) => toast.error(e.message || "No se pudo completar la operación"),
    onSettled: () => setExecuting(false),
  });

  const handleExecute = () => {
    if (numericAmount <= 0) return toast.error("Ingresá un monto válido");
    if (!arsAccount || !usdAccount) return toast.error("Necesitás una cuenta en ARS y otra en USD");
    executeFx.mutate();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cambio de divisas</h1>
        <p className="text-sm text-muted-foreground">Comprá y vendí dólares al instante, sin comisiones ocultas</p>
      </div>

      {/* Rates ticker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(RATES).map(([key, r]) => (
          <Card key={key} className={`border-0 shadow-sm cursor-pointer transition-all ${rateType === key ? "ring-2 ring-primary" : "hover:shadow-md"}`} >
            <CardContent className="p-4" onClick={() => setRateType(key)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-sm">{r.label}</span>
                </div>
                {rateType === key && <Badge className="text-xs">Seleccionado</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Compra</p>
                  <p className="font-bold text-emerald-600">${r.buy.toLocaleString("es-AR")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Venta</p>
                  <p className="font-bold text-red-500">${r.sell.toLocaleString("es-AR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operation panel */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              Operar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Buy/Sell toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setOperation("buy")}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${operation === "buy" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1.5" />
                Comprar USD
              </button>
              <button
                onClick={() => setOperation("sell")}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${operation === "sell" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
              >
                <TrendingDown className="w-4 h-4 inline mr-1.5" />
                Vender USD
              </button>
            </div>

            {/* Amount input */}
            <div>
              <Label className="mb-1.5">
                {operation === "buy" ? "Pesos a invertir (ARS)" : "Dólares a vender (USD)"}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                  {operation === "buy" ? "$" : "US$"}
                </span>
                <Input type="number" className="pl-8 text-lg font-semibold" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              {arsAccount && usdAccount && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Saldo {operation === "buy" ? "ARS" : "USD"}: <span className="font-semibold">{fmt(operation === "buy" ? arsAccount.balance : usdAccount.balance, operation === "buy" ? "ARS" : "USD")}</span>
                </p>
              )}
            </div>

            {/* Conversion preview */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasa aplicada</span>
                <span className="font-semibold">${effectiveRate.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tipo de cambio</span>
                <span className="font-semibold">{rate.label}</span>
              </div>
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Recibís</span>
                <span className="text-xl font-bold text-primary">
                  {fmt(convertedAmount, operation === "buy" ? "USD" : "ARS")}
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg" disabled={executing || !amount} onClick={handleExecute}>
              {executing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</> : `Confirmar ${operation === "buy" ? "compra" : "venta"}`}
            </Button>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              La operación se ejecuta al instante al precio mostrado. Las tasas se actualizan cada 60 segundos.
            </p>
          </CardContent>
        </Card>

        {/* Account balances + recent ops */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tus cuentas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accounts.filter((a) => a.currency === "ARS" || a.currency === "USD").map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.currency === "USD" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.currency === "USD" ? "Cuenta en dólares" : "Cuenta en pesos"}</p>
                    </div>
                  </div>
                  <p className="font-bold">{fmt(a.balance, a.currency)}</p>
                </div>
              ))}
              {(!arsAccount || !usdAccount) && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3">
                  Necesitás una cuenta en ARS y otra en USD para operar cambio de divisas.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Operaciones recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {fxTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sin operaciones de cambio todavía</p>
              ) : (
                <div className="space-y-2">
                  {fxTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{tx.description || "Cambio de divisas"}</p>
                        <p className="text-xs text-muted-foreground">{tx.created_date ? format(new Date(tx.created_date), "dd/MM/yyyy HH:mm", { locale: es }) : "—"}</p>
                      </div>
                      <p className="font-semibold">{fmt(tx.amount, tx.currency)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
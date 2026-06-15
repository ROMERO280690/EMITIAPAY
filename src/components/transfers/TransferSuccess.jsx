import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

const formatCurrency = (amount, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(amount || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

export default function TransferSuccess({ tab, amount, currency, originName, destName, onNewTransfer }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transferencias</h1>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-lg font-semibold">Transferencia realizada con éxito</p>
          <p className="text-sm text-muted-foreground mt-1 mb-2">Los saldos y movimientos se actualizaron automáticamente</p>
          <div className="bg-accent/50 rounded-lg px-4 py-2 text-sm">
            <span className="text-muted-foreground">Monto: </span>
            <span className="font-semibold">{formatCurrency(amount, currency)}</span>
            <span className="text-muted-foreground"> · {originName} → {destName}</span>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={onNewTransfer} className="gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Nueva transferencia
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/movimientos"} className="gap-2">
              Ver movimientos
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
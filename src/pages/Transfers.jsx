import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRightLeft, Building2, Send, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Transfers() {
  const [tab, setTab] = useState("own");
  const [form, setForm] = useState({
    originAccountId: "",
    destinationAccountId: "",
    contactId: "",
    amount: "",
    concept: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const originAccount = accounts.find((a) => a.id === form.originAccountId);
  const originBalance = originAccount?.balance || 0;
  const amountNum = parseFloat(form.amount) || 0;
  const exceedsBalance = amountNum > originBalance;

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  const formatCurrency = (amount, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  const resetForm = () => {
    setForm({ originAccountId: "", destinationAccountId: "", contactId: "", amount: "", concept: "" });
    setTab("own");
    setSuccess(false);
  };

  const handleTransfer = async () => {
    if (!form.originAccountId || !form.amount || amountNum <= 0 || exceedsBalance) return;

    setSubmitting(true);

    const origin = accounts.find((a) => a.id === form.originAccountId);

    if (tab === "own") {
      const destination = accounts.find((a) => a.id === form.destinationAccountId);
      if (!destination || origin.id === destination.id) {
        toast.error("Seleccioná una cuenta destino diferente");
        setSubmitting(false);
        return;
      }

      // Update origin balance
      await base44.entities.Account.update(origin.id, { balance: origin.balance - amountNum });

      // Update destination balance
      await base44.entities.Account.update(destination.id, { balance: destination.balance + amountNum });

      // Create transfer_in transaction
      await base44.entities.Transaction.create({
        type: "transfer_in",
        amount: amountNum,
        currency: destination.currency,
        description: form.concept || `Transferencia desde ${origin.name}`,
        counterpart_name: origin.name,
        category: "otros",
        status: "completed",
        account_id: destination.id,
      });

      // Create transfer_out transaction
      await base44.entities.Transaction.create({
        type: "transfer_out",
        amount: amountNum,
        currency: origin.currency,
        description: form.concept || `Transferencia hacia ${destination.name}`,
        counterpart_name: destination.name,
        category: "otros",
        status: "completed",
        account_id: origin.id,
      });

      toast.success(`Transferencia de ${formatCurrency(amountNum, origin.currency)} realizada`);
    } else {
      const contact = contacts.find((c) => c.id === form.contactId);

      // Update origin balance
      await base44.entities.Account.update(origin.id, { balance: origin.balance - amountNum });

      // Create transfer_out transaction
      await base44.entities.Transaction.create({
        type: "transfer_out",
        amount: amountNum,
        currency: origin.currency,
        description: form.concept || `Transferencia a ${contact?.name || "tercero"}`,
        counterpart_name: contact?.name || "",
        counterpart_cuit: contact?.cuit || "",
        category: "proveedores",
        status: "completed",
        account_id: origin.id,
      });

      toast.success(`Transferencia de ${formatCurrency(amountNum, origin.currency)} enviada a ${contact?.name || "tercero"}`);
    }

    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    setSubmitting(false);
    setSuccess(true);
  };

  // Reset to form view
  const handleNewTransfer = () => {
    resetForm();
  };

  if (success) {
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
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Los saldos y movimientos se actualizaron automáticamente
            </p>
            <Button onClick={handleNewTransfer} className="gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              Nueva transferencia
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transferencias</h1>
        <p className="text-sm text-muted-foreground mt-1">Enviá dinero entre tus cuentas o a terceros</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="own" className="gap-2">
            <Building2 className="w-4 h-4" />
            Entre mis cuentas
          </TabsTrigger>
          <TabsTrigger value="third" className="gap-2">
            <Send className="w-4 h-4" />
            A un tercero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="own">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Transferir entre mis cuentas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Origin account */}
              <div className="space-y-2">
                <Label>Cuenta de origen</Label>
                <Select value={form.originAccountId} onValueChange={(v) => setForm({ ...form, originAccountId: v, destinationAccountId: "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná la cuenta de origen" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active").map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {formatCurrency(a.balance || 0, a.currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination account */}
              <div className="space-y-2">
                <Label>Cuenta de destino</Label>
                <Select
                  value={form.destinationAccountId}
                  onValueChange={(v) => setForm({ ...form, destinationAccountId: v })}
                  disabled={!form.originAccountId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná la cuenta de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter((a) => a.status === "active" && a.id !== form.originAccountId)
                      .map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name} — {formatCurrency(a.balance || 0, a.currency)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {form.originAccountId && form.destinationAccountId && form.originAccountId === form.destinationAccountId && (
                  <p className="text-xs text-destructive">No podés transferir a la misma cuenta</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="text-lg"
                />
                {form.originAccountId && (
                  <p className="text-xs text-muted-foreground">
                    Saldo disponible: {formatCurrency(originBalance, originAccount?.currency || "ARS")}
                  </p>
                )}
                {exceedsBalance && (
                  <div className="flex items-center gap-2 text-xs text-destructive mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    El monto supera el saldo disponible
                  </div>
                )}
              </div>

              {/* Concept */}
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Textarea
                  value={form.concept}
                  onChange={(e) => setForm({ ...form, concept: e.target.value })}
                  placeholder="Ej: Traspaso a cuenta remunerada"
                  rows={2}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleTransfer}
                disabled={!form.originAccountId || !form.destinationAccountId || !form.amount || amountNum <= 0 || exceedsBalance || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Transferir
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="third">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Transferir a un tercero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Origin account */}
              <div className="space-y-2">
                <Label>Cuenta de origen</Label>
                <Select value={form.originAccountId} onValueChange={(v) => setForm({ ...form, originAccountId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná la cuenta de origen" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active").map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {formatCurrency(a.balance || 0, a.currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label>Destinatario</Label>
                <Select value={form.contactId} onValueChange={(v) => setForm({ ...form, contactId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un contacto" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-[8px]">{getInitials(c.name)}</AvatarFallback>
                          </Avatar>
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="text-lg"
                />
                {form.originAccountId && (
                  <p className="text-xs text-muted-foreground">
                    Saldo disponible: {formatCurrency(originBalance, originAccount?.currency || "ARS")}
                  </p>
                )}
                {exceedsBalance && (
                  <div className="flex items-center gap-2 text-xs text-destructive mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    El monto supera el saldo disponible
                  </div>
                )}
              </div>

              {/* Concept */}
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Textarea
                  value={form.concept}
                  onChange={(e) => setForm({ ...form, concept: e.target.value })}
                  placeholder="Ej: Pago de servicios"
                  rows={2}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleTransfer}
                disabled={!form.originAccountId || !form.contactId || !form.amount || amountNum <= 0 || exceedsBalance || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar transferencia
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
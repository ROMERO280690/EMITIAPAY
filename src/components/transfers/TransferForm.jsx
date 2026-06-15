import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Building2, Send, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const formatCurrency = (amount, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(amount || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

export default function TransferForm({
  tab,
  setTab,
  form,
  setForm,
  accounts,
  contacts,
  validation,
  originAccount,
  onReview,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transferencias</h1>
        <p className="text-sm text-muted-foreground mt-1">Enviá dinero entre tus cuentas o a terceros</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v); setForm((f) => ({ ...f, destinationAccountId: "", contactId: "" })); }}>
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
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-base">Transferir entre mis cuentas</h3>

              <div className="space-y-2">
                <Label>Cuenta de origen</Label>
                <Select value={form.originAccountId} onValueChange={(v) => setForm({ ...form, originAccountId: v, destinationAccountId: "" })}>
                  <SelectTrigger><SelectValue placeholder="Seleccioná la cuenta de origen" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active").map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance || 0, a.currency)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cuenta de destino</Label>
                <Select value={form.destinationAccountId} onValueChange={(v) => setForm({ ...form, destinationAccountId: v })} disabled={!form.originAccountId}>
                  <SelectTrigger><SelectValue placeholder="Seleccioná la cuenta de destino" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active" && a.id !== form.originAccountId).map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance || 0, a.currency)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AmountInput form={form} setForm={setForm} originAccount={originAccount} />

              <div className="space-y-2">
                <Label>Concepto</Label>
                <Textarea value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Ej: Traspaso a cuenta remunerada" rows={2} />
              </div>

              <ValidationMessages validation={validation} originAccount={originAccount} />

              <Button className="w-full" size="lg" onClick={onReview} disabled={!validation.valid}>
                <ArrowRight className="w-4 h-4 mr-2" /> Revisar transferencia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="third">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-base">Transferir a un tercero</h3>

              <div className="space-y-2">
                <Label>Cuenta de origen</Label>
                <Select value={form.originAccountId} onValueChange={(v) => setForm({ ...form, originAccountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccioná la cuenta de origen" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter((a) => a.status === "active").map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance || 0, a.currency)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Destinatario</Label>
                {contacts.length === 0 ? (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">No tenés contactos registrados</p>
                    <Link to="/contactos" className="text-sm text-primary hover:underline mt-1 inline-block">Agregar contacto</Link>
                  </div>
                ) : (
                  <Select value={form.contactId} onValueChange={(v) => setForm({ ...form, contactId: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccioná un contacto" /></SelectTrigger>
                    <SelectContent>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-5 h-5"><AvatarFallback className="text-[8px]">{getInitials(c.name)}</AvatarFallback></Avatar>
                            <span>{c.name}</span>
                            {c.type && <Badge variant="outline" className="text-[10px] h-4 ml-auto">{c.type}</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <AmountInput form={form} setForm={setForm} originAccount={originAccount} />

              <div className="space-y-2">
                <Label>Concepto</Label>
                <Textarea value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} placeholder="Ej: Pago de servicios" rows={2} />
              </div>

              <ValidationMessages validation={validation} originAccount={originAccount} />

              <Button className="w-full" size="lg" onClick={onReview} disabled={!validation.valid}>
                <ArrowRight className="w-4 h-4 mr-2" /> Revisar transferencia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AmountInput({ form, setForm, originAccount }) {
  const amountNum = parseFloat(form.amount) || 0;

  return (
    <div className="space-y-2">
      <Label>Monto</Label>
      <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="text-lg" />
      {form.originAccountId && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Saldo disponible: <span className="font-medium text-foreground">{formatCurrency(originAccount?.balance || 0, originAccount?.currency || "ARS")}</span>
          </p>
          <button type="button" className="text-xs text-primary hover:underline" onClick={() => setForm({ ...form, amount: String(originAccount?.balance || 0) })}>
            Usar todo el saldo
          </button>
        </div>
      )}
      {originAccount && amountNum > originAccount.balance && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/5 rounded-lg p-2 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Fondos insuficientes. Te faltan {formatCurrency(amountNum - originAccount.balance, originAccount.currency)}.</span>
        </div>
      )}
    </div>
  );
}

function ValidationMessages({ validation, originAccount }) {
  return (
    <>
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-destructive">
              <XCircle className="w-3 h-3 flex-shrink-0" />{err}
            </div>
          ))}
        </div>
      )}
      {validation.warnings.length > 0 && (
        <div className="space-y-1">
          {validation.warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />{w}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
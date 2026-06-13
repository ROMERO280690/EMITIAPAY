import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Wallet, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function formatCurrency(amount, currency) {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
}

export default function Accounts() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", currency: "ARS", account_type: "corriente", cbu: "", alias: "" });
  const [copiedId, setCopiedId] = useState(null);
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Account.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setOpen(false);
      setForm({ name: "", currency: "ARS", account_type: "corriente", cbu: "", alias: "" });
      toast.success("Cuenta creada exitosamente");
    },
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cuentas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestioná tus cuentas bancarias</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nueva cuenta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva cuenta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Cuenta operativa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.account_type} onValueChange={(v) => setForm({ ...form, account_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corriente">Corriente</SelectItem>
                      <SelectItem value="remunerada">Remunerada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>CBU</Label>
                <Input value={form.cbu} onChange={(e) => setForm({ ...form, cbu: e.target.value })} placeholder="22 dígitos" />
              </div>
              <div className="space-y-2">
                <Label>Alias</Label>
                <Input value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} placeholder="mi.alias.cresium" />
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate({ ...form, balance: 0, status: "active" })} disabled={!form.name || createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear cuenta"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-40 bg-card animate-pulse rounded-xl" />)}
        </div>
      ) : accounts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">No tenés cuentas aún</p>
            <p className="text-sm text-muted-foreground mt-1">Creá tu primera cuenta para empezar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account, i) => (
            <motion.div key={account.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`h-1.5 ${account.currency === "USD" ? "bg-emerald-500" : "bg-primary"}`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{account.name}</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(account.balance || 0, account.currency)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">{account.currency}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{account.account_type}</Badge>
                    </div>
                  </div>
                  {account.cbu && (
                    <div className="flex items-center justify-between bg-accent/50 rounded-lg px-3 py-2 mt-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">CBU</p>
                        <p className="text-xs font-mono">{account.cbu}</p>
                      </div>
                      <button onClick={() => handleCopy(account.cbu, `cbu-${account.id}`)} className="text-muted-foreground hover:text-foreground transition-colors">
                        {copiedId === `cbu-${account.id}` ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                  {account.alias && (
                    <div className="flex items-center justify-between bg-accent/50 rounded-lg px-3 py-2 mt-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Alias</p>
                        <p className="text-xs font-medium">{account.alias}</p>
                      </div>
                      <button onClick={() => handleCopy(account.alias, `alias-${account.id}`)} className="text-muted-foreground hover:text-foreground transition-colors">
                        {copiedId === `alias-${account.id}` ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
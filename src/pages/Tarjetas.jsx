import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, Snowflake, Lock, Unlock, Eye, EyeOff, Trash2, Wallet, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const STATUS_CONFIG = {
  active: { label: "Activa", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  frozen: { label: "Congelada", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  cancelled: { label: "Cancelada", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

const CARD_GRADIENTS = [
  "from-indigo-600 via-indigo-700 to-violet-800",
  "from-emerald-600 via-emerald-700 to-teal-800",
  "from-rose-600 via-rose-700 to-pink-800",
  "from-amber-500 via-orange-600 to-red-700",
  "from-slate-700 via-slate-800 to-gray-900",
];

export default function Tarjetas() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [revealedCards, setRevealedCards] = useState({});
  const [form, setForm] = useState({
    holder_name: "",
    card_type: "virtual",
    card_variant: "debit",
    currency: "ARS",
    monthly_limit: "",
    assigned_to: "",
  });

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: () => base44.entities.Card.list("-created_date", 50),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts_for_cards"],
    queryFn: () => base44.entities.Account.list("-created_date", 20),
  });

  const createCard = useMutation({
    mutationFn: (data) => base44.entities.Card.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Tarjeta creada con éxito");
      setDialogOpen(false);
      setForm({ holder_name: "", card_type: "virtual", card_variant: "debit", currency: "ARS", monthly_limit: "", assigned_to: "" });
    },
    onError: () => toast.error("No se pudo crear la tarjeta"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Card.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Estado actualizado");
    },
  });

  const deleteCard = useMutation({
    mutationFn: (id) => base44.entities.Card.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Tarjeta eliminada");
    },
  });

  const handleSubmit = () => {
    if (!form.holder_name.trim()) return toast.error("Ingresá el nombre del titular");
    const limit = parseFloat(form.monthly_limit) || 0;
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    const expMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const expYear = String(26 + Math.floor(Math.random() * 5));
    const cvv = String(Math.floor(100 + Math.random() * 900));
    createCard.mutate({
      ...form,
      monthly_limit: limit,
      available_limit: limit,
      number_last4: last4,
      expiration: `${expMonth}/${expYear}`,
      cvv,
      status: "active",
    });
  };

  const toggleReveal = (id) => setRevealedCards((p) => ({ ...p, [id]: !p[id] }));

  const activeCards = cards.filter((c) => c.status === "active");
  const frozenCards = cards.filter((c) => c.status === "frozen");
  const totalLimit = activeCards.reduce((s, c) => s + (c.monthly_limit || 0), 0);
  const totalAvailable = activeCards.reduce((s, c) => s + (c.available_limit || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tarjetas</h1>
          <p className="text-sm text-muted-foreground">Gestioná tarjetas virtuales y físicas de tu empresa</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nueva tarjeta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva tarjeta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Nombre del titular</Label>
                <Input value={form.holder_name} onChange={(e) => setForm({ ...form, holder_name: e.target.value })} placeholder="Ej: Juan Pérez" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.card_type} onValueChange={(v) => setForm({ ...form, card_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="physical">Física</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Variante</Label>
                  <Select value={form.card_variant} onValueChange={(v) => setForm({ ...form, card_variant: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">Débito</SelectItem>
                      <SelectItem value="credit">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Moneda</Label>
                  <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Límite mensual</Label>
                  <Input type="number" value={form.monthly_limit} onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div>
                <Label>Asignada a (opcional)</Label>
                <Input value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} placeholder="Empleado o área" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createCard.isPending}>Crear tarjeta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tarjetas activas", value: activeCards.length, icon: CreditCard, color: "text-emerald-600 bg-emerald-50" },
          { label: "Congeladas", value: frozenCards.length, icon: Snowflake, color: "text-amber-600 bg-amber-50" },
          { label: "Límite total", value: fmt(totalLimit), icon: TrendingUp, color: "text-indigo-600 bg-indigo-50" },
          { label: "Disponible", value: fmt(totalAvailable), icon: Wallet, color: "text-violet-600 bg-violet-50" },
        ].map((k) => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${k.color}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-card animate-pulse rounded-2xl" />)}
        </div>
      ) : cards.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <CreditCard className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No tenés tarjetas creadas</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Creá tu primera tarjeta virtual para empezar a operar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const st = STATUS_CONFIG[card.status] || STATUS_CONFIG.active;
            const revealed = revealedCards[card.id];
            const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
            return (
              <motion.div key={card.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}>
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className={`bg-gradient-to-br ${gradient} p-5 text-white relative`}>
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-xs opacity-80">{card.card_type === "virtual" ? "Tarjeta Virtual" : "Tarjeta Física"}</p>
                        <p className="text-sm font-semibold mt-0.5">{card.card_variant === "debit" ? "Débito" : "Crédito"}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                        <span className="text-xs font-medium opacity-90">{st.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-6 bg-yellow-400/30 rounded border border-yellow-300/40" />
                      <p className="font-mono text-lg tracking-wider">
                        {revealed ? `4517 •••• •••• ${card.number_last4}` : `•••• •••• •••• ${card.number_last4}`}
                      </p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] opacity-70 uppercase tracking-wider">Titular</p>
                        <p className="text-sm font-medium">{card.holder_name}</p>
                        {card.assigned_to && <p className="text-[10px] opacity-80 mt-0.5">Asignada: {card.assigned_to}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] opacity-70 uppercase tracking-wider">Vence</p>
                        <p className="text-sm font-mono">{card.expiration}</p>
                        {revealed && <p className="text-[10px] opacity-80 mt-0.5">CVV: {card.cvv}</p>}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Límite mensual</span>
                      <span className="font-semibold">{fmt(card.monthly_limit, card.currency)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${Math.min(100, ((card.monthly_limit - card.available_limit) / (card.monthly_limit || 1)) * 100)}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Disponible: <span className="font-semibold text-foreground">{fmt(card.available_limit, card.currency)}</span></span>
                      <Badge variant="outline" className="text-xs">{card.currency}</Badge>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="ghost" className="flex-1 gap-1.5 text-xs" onClick={() => toggleReveal(card.id)}>
                        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {revealed ? "Ocultar" : "Ver datos"}
                      </Button>
                      {card.status === "active" ? (
                        <Button size="sm" variant="ghost" className="flex-1 gap-1.5 text-xs text-amber-600 hover:bg-amber-50" onClick={() => updateStatus.mutate({ id: card.id, status: "frozen" })}>
                          <Snowflake className="w-3.5 h-3.5" /> Congelar
                        </Button>
                      ) : card.status === "frozen" ? (
                        <Button size="sm" variant="ghost" className="flex-1 gap-1.5 text-xs text-emerald-600 hover:bg-emerald-50" onClick={() => updateStatus.mutate({ id: card.id, status: "active" })}>
                          <Unlock className="w-3.5 h-3.5" /> Activar
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" className="text-xs text-destructive hover:bg-destructive/5 px-2" onClick={() => { if (confirm("¿Eliminar esta tarjeta?")) deleteCard.mutate(card.id); }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
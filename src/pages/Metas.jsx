import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, TrendingUp, CheckCircle2, Trash2, PiggyBank, Award, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

const GOAL_ICONS = ["Target", "PiggyBank", "Award", "TrendingUp", "Home", "Car", "GraduationCap", "Plane"];
const GOAL_COLORS = ["indigo", "emerald", "violet", "rose", "amber", "blue", "teal", "orange"];
const COLOR_MAP = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  violet: "from-violet-500 to-violet-600",
  rose: "from-rose-500 to-rose-600",
  amber: "from-amber-500 to-amber-600",
  blue: "from-blue-500 to-blue-600",
  teal: "from-teal-500 to-teal-600",
  orange: "from-orange-500 to-orange-600",
};

export default function Metas() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [form, setForm] = useState({ name: "", target_amount: "", currency: "ARS", deadline: "", icon: "Target", color: "indigo" });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["savings_goals"],
    queryFn: () => base44.entities.SavingsGoal.list("-created_date", 50),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts_goals"],
    queryFn: () => base44.entities.Account.list("-created_date", 20),
  });

  const createGoal = useMutation({
    mutationFn: (data) => base44.entities.SavingsGoal.create({ ...data, current_amount: 0, status: "active" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["savings_goals"] });
      toast.success("Meta creada");
      setDialogOpen(false);
      setForm({ name: "", target_amount: "", currency: "ARS", deadline: "", icon: "Target", color: "indigo" });
    },
  });

  const contribute = useMutation({
    mutationFn: async ({ goal, amount, accountId }) => {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) throw new Error("Seleccioná una cuenta");
      if ((account.balance || 0) < amount) throw new Error("Saldo insuficiente");
      await base44.entities.Account.update(account.id, { balance: (account.balance || 0) - amount });
      const newCurrent = (goal.current_amount || 0) + amount;
      const completed = newCurrent >= (goal.target_amount || 0);
      await base44.entities.SavingsGoal.update(goal.id, { current_amount: newCurrent, status: completed ? "completed" : "active" });
      if (completed) {
        await base44.entities.Notification.create({
          title: "¡Meta completada! 🎉",
          message: `Lograste tu meta "${goal.name}" de ${fmt(goal.target_amount, goal.currency)}`,
          type: "alert",
          read: false,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["savings_goals"] });
      qc.invalidateQueries({ queryKey: ["accounts_goals"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Aporte realizado");
      setContributeGoal(null);
      setContributeAmount("");
    },
    onError: (e) => toast.error(e.message || "No se pudo aportar"),
  });

  const deleteGoal = useMutation({
    mutationFn: (id) => base44.entities.SavingsGoal.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["savings_goals"] });
      toast.success("Meta eliminada");
    },
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error("Ingresá el nombre de la meta");
    if (!form.target_amount || parseFloat(form.target_amount) <= 0) return toast.error("Ingresá un monto objetivo válido");
    createGoal.mutate({ ...form, target_amount: parseFloat(form.target_amount) });
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const totalSaved = goals.reduce((s, g) => s + (g.current_amount || 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (g.target_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas de ahorro</h1>
          <p className="text-sm text-muted-foreground">Definí objetivos y ahorrá de forma automática</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nueva meta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear meta de ahorro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Nombre de la meta</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Reserva de emergencia, Viaje..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Monto objetivo</Label>
                  <Input type="number" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} placeholder="0.00" />
                </div>
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
              </div>
              <div>
                <Label>Fecha límite (opcional)</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {GOAL_COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${COLOR_MAP[c]} ${form.color === c ? "ring-2 ring-offset-2 ring-primary" : ""}`} />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createGoal.isPending}>Crear meta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Metas activas", value: activeGoals.length, icon: Target, color: "text-indigo-600 bg-indigo-50" },
          { label: "Completadas", value: completedGoals.length, icon: Award, color: "text-emerald-600 bg-emerald-50" },
          { label: "Total ahorrado", value: fmt(totalSaved), icon: PiggyBank, color: "text-violet-600 bg-violet-50" },
          { label: "Objetivo total", value: fmt(totalTarget), icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
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

      {/* Goals grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1, 2, 3].map((i) => <div key={i} className="h-44 bg-card animate-pulse rounded-2xl" />)}</div>
      ) : goals.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Target className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No tenés metas de ahorro creadas</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Creá tu primera meta y empezá a ahorrar hoy</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal, i) => {
            const progress = Math.min(100, ((goal.current_amount || 0) / (goal.target_amount || 1)) * 100);
            const gradient = COLOR_MAP[goal.color] || COLOR_MAP.indigo;
            const isComplete = goal.status === "completed";
            const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null;
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}>
                <Card className={`border-0 shadow-sm overflow-hidden ${isComplete ? "ring-2 ring-emerald-400" : ""}`}>
                  <div className={`bg-gradient-to-br ${gradient} p-4 text-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{goal.name}</p>
                          <Badge className="bg-white/20 text-white text-[10px] mt-0.5">{goal.currency}</Badge>
                        </div>
                      </div>
                      {isComplete && <CheckCircle2 className="w-5 h-5" />}
                      <button onClick={() => { if (confirm("¿Eliminar esta meta?")) deleteGoal.mutate(goal.id); }} className="text-white/60 hover:text-white transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xl font-bold text-foreground">{fmt(goal.current_amount, goal.currency)}</span>
                        <span className="text-sm text-muted-foreground">/ {fmt(goal.target_amount, goal.currency)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className={`bg-gradient-to-r ${gradient} rounded-full h-2.5 transition-all`} style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% completado</p>
                    </div>
                    {goal.deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {daysLeft !== null && daysLeft > 0 ? `${daysLeft} días restantes` : daysLeft !== null && daysLeft <= 0 ? "Vencida" : format(new Date(goal.deadline), "dd/MM/yyyy", { locale: es })}
                      </div>
                    )}
                    {!isComplete && (
                      <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={() => setContributeGoal(goal)}>
                        <PiggyBank className="w-3.5 h-3.5" /> Aportar
                      </Button>
                    )}
                    {isComplete && (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-sm font-medium py-1">
                        <Award className="w-4 h-4" /> ¡Meta alcanzada!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Contribute dialog */}
      <Dialog open={!!contributeGoal} onOpenChange={(o) => !o && setContributeGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aportar a "{contributeGoal?.name}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Monto a aportar</Label>
              <Input type="number" value={contributeAmount} onChange={(e) => setContributeAmount(e.target.value)} placeholder="0.00" className="text-lg font-semibold" />
            </div>
            <div>
              <Label>Desde cuenta</Label>
              <Select onValueChange={(v) => setContributeGoal({ ...contributeGoal, _accountId: v })}>
                <SelectTrigger><SelectValue placeholder="Elegí una cuenta" /></SelectTrigger>
                <SelectContent>
                  {accounts.filter((a) => a.currency === contributeGoal?.currency).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name} — {fmt(a.balance, a.currency)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContributeGoal(null)}>Cancelar</Button>
            <Button onClick={() => contribute.mutate({ goal: contributeGoal, amount: parseFloat(contributeAmount), accountId: contributeGoal._accountId })} disabled={!contributeAmount || !contributeGoal?._accountId}>
              Confirmar aporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
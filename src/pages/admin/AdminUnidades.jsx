import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import {
  Building2, Search, Plus, Globe, Users, Wallet, Target,
  Network, ShieldCheck, Cpu, Briefcase, Crown, MapPin, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AREA_CONFIG = {
  banca_core: {
    label: "Banca Core",
    icon: Building2,
    color: "indigo",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
  },
  tesoreria_mercados: {
    label: "Tesorería & Mercados",
    icon: TrendingUp,
    color: "emerald",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  riesgo_cumplimiento: {
    label: "Riesgo & Cumplimiento",
    icon: ShieldCheck,
    color: "rose",
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-700",
  },
  operaciones_tecnologia: {
    label: "Operaciones & Tecnología",
    icon: Cpu,
    color: "violet",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
  soporte_corporativo: {
    label: "Soporte Corporativo",
    icon: Briefcase,
    color: "amber",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
};

const STATUS_CONFIG = {
  active: { label: "Activa", badge: "bg-emerald-100 text-emerald-700" },
  restructure: { label: "En reestructuración", badge: "bg-amber-100 text-amber-700" },
  planned: { label: "Planificada", badge: "bg-slate-100 text-slate-600" },
};

const PRIORITY_CONFIG = {
  alta: { label: "Alta", badge: "bg-red-100 text-red-700" },
  media: { label: "Media", badge: "bg-blue-100 text-blue-700" },
  baja: { label: "Baja", badge: "bg-slate-100 text-slate-600" },
};

const REGION_LABELS = {
  argentina: "🇦🇷 Argentina",
  latam: "🌎 LATAM",
  global: "🌍 Global",
};

const formatBudget = (val) =>
  val >= 1_000_000_000
    ? `$${(val / 1_000_000_000).toFixed(1)}B`
    : val >= 1_000_000
    ? `$${(val / 1_000_000).toFixed(1)}M`
    : `$${val.toLocaleString("es-AR")}`;

export default function AdminUnidades() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", code: "", description: "", area: "banca_core",
    head_name: "", status: "active", region: "argentina",
    priority: "media", budget_annual: 0, team_size: 0, objectives: "",
  });
  const queryClient = useQueryClient();

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["business_units"],
    queryFn: () => base44.entities.BusinessUnit.list("area"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BusinessUnit.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business_units"] });
      toast.success("Unidad de negocio creada");
      setCreateOpen(false);
      setForm({
        name: "", code: "", description: "", area: "banca_core",
        head_name: "", status: "active", region: "argentina",
        priority: "media", budget_annual: 0, team_size: 0, objectives: "",
      });
    },
    onError: () => toast.error("No se pudo crear la unidad"),
  });

  const filtered = units.filter((u) => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.code?.toLowerCase().includes(search.toLowerCase());
    const matchArea = areaFilter === "all" || u.area === areaFilter;
    return matchSearch && matchArea;
  });

  const totalBudget = units.reduce((s, u) => s + (u.budget_annual || 0), 0);
  const totalTeam = units.reduce((s, u) => s + (u.team_size || 0), 0);
  const activeCount = units.filter((u) => u.status === "active").length;
  const areasCount = Object.keys(AREA_CONFIG).length;

  const groupedByArea = Object.keys(AREA_CONFIG).map((area) => ({
    area,
    config: AREA_CONFIG[area],
    units: filtered.filter((u) => u.area === area),
  })).filter((g) => g.units.length > 0);

  const handleCreate = () => {
    if (!form.name || !form.code) {
      toast.error("Nombre y código son obligatorios");
      return;
    }
    createMutation.mutate({
      ...form,
      budget_annual: Number(form.budget_annual) || 0,
      team_size: Number(form.team_size) || 0,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Unidades de Negocio</h1>
              <p className="text-sm text-gray-500">Estructura corporativa de EMITIA PAY · Entidad bancaria multinacional</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Nueva unidad
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Unidades activas", value: activeCount, icon: Building2, color: "bg-indigo-50 text-indigo-600" },
          { label: "Áreas estratégicas", value: areasCount, icon: Network, color: "bg-violet-50 text-violet-600" },
          { label: "Presupuesto total", value: formatBudget(totalBudget), icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
          { label: "Colaboradores", value: totalTeam.toLocaleString("es-AR"), icon: Users, color: "bg-amber-50 text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9" placeholder="Buscar unidad o código..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setAreaFilter("all")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${areaFilter === "all" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Todas
          </button>
          {Object.entries(AREA_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setAreaFilter(key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${areaFilter === key ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Units grouped by area */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-48 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((j) => <Skeleton key={j} className="h-32 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      ) : groupedByArea.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Building2 className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500">{search ? "Sin resultados" : "No hay unidades de negocio creadas"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {groupedByArea.map(({ area, config, units: areaUnits }) => {
            const AreaIcon = config.icon;
            return (
              <div key={area}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                    <AreaIcon className={`w-4 h-4 ${config.text}`} />
                  </div>
                  <h2 className="font-semibold text-gray-900">{config.label}</h2>
                  <Badge variant="outline" className="text-xs">{areaUnits.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {areaUnits.map((unit, i) => (
                    <motion.div
                      key={unit.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Card className={`border ${config.border} border-l-4 shadow-sm hover:shadow-md transition-shadow`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${config.badge}`}>
                                {unit.code}
                              </span>
                              <h3 className="font-semibold text-gray-900 truncate">{unit.name}</h3>
                            </div>
                            <Badge className={`text-[10px] ${STATUS_CONFIG[unit.status]?.badge}`}>{STATUS_CONFIG[unit.status]?.label}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{unit.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                            {unit.head_name && (
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3" /> {unit.head_name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {REGION_LABELS[unit.region]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {unit.team_size || 0}
                            </span>
                            {unit.budget_annual > 0 && (
                              <span className="flex items-center gap-1">
                                <Wallet className="w-3 h-3" /> {formatBudget(unit.budget_annual)}
                              </span>
                            )}
                          </div>
                          {unit.objectives && (
                            <div className="flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                              <Target className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                              <span className="line-clamp-2">{unit.objectives}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <Badge className={`text-[10px] ${PRIORITY_CONFIG[unit.priority]?.badge}`}>
                              Prioridad {PRIORITY_CONFIG[unit.priority]?.label}
                            </Badge>
                            <Globe className="w-3.5 h-3.5 text-gray-300" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva unidad de negocio</DialogTitle>
            <DialogDescription>Definí una nueva unidad dentro de la estructura corporativa de EMITIA PAY.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="space-y-1.5 col-span-2">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Banca Corporativa" />
            </div>
            <div className="space-y-1.5">
              <Label>Código *</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CORP" maxLength={6} />
            </div>
            <div className="space-y-1.5">
              <Label>Área estratégica</Label>
              <Select value={form.area} onValueChange={(v) => setForm({ ...form, area: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(AREA_CONFIG).map(([k, c]) => (
                    <SelectItem key={k} value={k}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Descripción</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Alcance y responsabilidad" />
            </div>
            <div className="space-y-1.5">
              <Label>Responsable</Label>
              <Input value={form.head_name} onChange={(e) => setForm({ ...form, head_name: e.target.value })} placeholder="Nombre del líder" />
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="restructure">En reestructuración</SelectItem>
                  <SelectItem value="planned">Planificada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Región</Label>
              <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="argentina">🇦🇷 Argentina</SelectItem>
                  <SelectItem value="latam">🌎 LATAM</SelectItem>
                  <SelectItem value="global">🌍 Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prioridad</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Presupuesto anual (ARS)</Label>
              <Input type="number" value={form.budget_annual} onChange={(e) => setForm({ ...form, budget_annual: e.target.value })} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label>Colaboradores</Label>
              <Input type="number" value={form.team_size} onChange={(e) => setForm({ ...form, team_size: e.target.value })} placeholder="0" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Objetivos estratégicos</Label>
              <Input value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} placeholder="Metas principales de la unidad" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
              {createMutation.isPending ? "Creando..." : "Crear unidad"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
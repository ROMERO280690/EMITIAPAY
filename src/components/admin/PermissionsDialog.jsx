import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, Wallet, Eye, ArrowLeftRight, Receipt, Landmark,
  CreditCard, Download, UserPlus, Lock, Crown, RotateCcw
} from "lucide-react";
import { toast } from "sonner";

const PERMISSIONS = [
  {
    key: "can_approve_payments",
    label: "Aprobar pagos y transferencias",
    description: "Autoriza pagos programados y transferencias salientes antes de su ejecución.",
    icon: Wallet,
    color: "text-indigo-600 bg-indigo-50",
    sensitive: true,
  },
  {
    key: "can_view_sensitive_data",
    label: "Ver datos sensibles",
    description: "Acceso a saldos, CBU/CVU, alias bancarios y detalles completos de cuentas.",
    icon: Eye,
    color: "text-rose-600 bg-rose-50",
    sensitive: true,
  },
  {
    key: "can_manage_transfers",
    label: "Gestionar transferencias",
    description: "Crear y editar transferencias entre cuentas y a terceros.",
    icon: ArrowLeftRight,
    color: "text-blue-600 bg-blue-50",
  },
  {
    key: "can_manage_collections",
    label: "Gestionar cobros y facturación",
    description: "Crear cobros, generar links de pago y administrar facturas a clientes.",
    icon: Receipt,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "can_manage_investments",
    label: "Operar inversiones",
    description: "Constituir plazo fijo, fondos comunes y rescatar inversiones.",
    icon: Landmark,
    color: "text-amber-600 bg-amber-50",
  },
  {
    key: "can_manage_cards",
    label: "Administrar tarjetas",
    description: "Crear, congelar y ajustar límites de tarjetas físicas y virtuales.",
    icon: CreditCard,
    color: "text-violet-600 bg-violet-50",
  },
  {
    key: "can_export_data",
    label: "Exportar datos",
    description: "Descargar reportes financieros y exportar movimientos en CSV.",
    icon: Download,
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    key: "can_invite_users",
    label: "Invitar usuarios",
    description: "Enviar invitaciones a nuevos miembros de la organización.",
    icon: UserPlus,
    color: "text-slate-600 bg-slate-50",
  },
];

const DEFAULT_PERMS = PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {});

export default function PermissionsDialog({ user, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [perms, setPerms] = useState(DEFAULT_PERMS);

  useEffect(() => {
    if (user) {
      setPerms({ ...DEFAULT_PERMS, ...(user.permissions || {}) });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: ({ id, permissions }) =>
      base44.entities.User.update(id, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("Permisos actualizados correctamente");
      onOpenChange(false);
    },
    onError: () => toast.error("No se pudieron actualizar los permisos"),
  });

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const enabledCount = Object.values(perms).filter(Boolean).length;
  const sensitiveCount = PERMISSIONS.filter(p => p.sensitive && perms[p.key]).length;

  const toggle = (key) => setPerms((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    updateMutation.mutate({ id: user.id, permissions: perms });
  };

  const handleReset = () => setPerms(DEFAULT_PERMS);

  const handleGrantAll = () => {
    const all = PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: true }), {});
    setPerms(all);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              {(user.full_name || user.email || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                Permisos de {user.full_name || "Usuario"}
                {isAdmin && (
                  <Badge className="bg-indigo-100 text-indigo-700 gap-1">
                    <Crown className="w-3 h-3" /> Admin
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Summary banner */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 mt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">
              {enabledCount} de {PERMISSIONS.length} permisos activos
            </span>
          </div>
          {sensitiveCount > 0 && (
            <Badge className="bg-rose-50 text-rose-600 gap-1 border-rose-200">
              <Lock className="w-3 h-3" /> {sensitiveCount} sensible(s)
            </Badge>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-7 gap-1">
              <RotateCcw className="w-3 h-3" /> Ninguno
            </Button>
            <Button variant="outline" size="sm" onClick={handleGrantAll} className="text-xs h-7">
              Todos
            </Button>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-700">
            <Crown className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Este usuario es <strong>administrador</strong> y ya tiene acceso total por su rol.
              Los permisos granulares se aplican principalmente a usuarios con rol PyME.
            </p>
          </div>
        )}

        {/* Permission list */}
        <div className="space-y-2">
          {PERMISSIONS.map((p) => {
            const Icon = p.icon;
            const enabled = !!perms[p.key];
            return (
              <div
                key={p.key}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  enabled ? "border-indigo-200 bg-indigo-50/40" : "border-gray-100 bg-white"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                    {p.sensitive && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-rose-500 border-rose-200 bg-rose-50">
                        <Lock className="w-2.5 h-2.5 mr-0.5" /> Sensible
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.description}</p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggle(p.key)}
                  className="flex-shrink-0 mt-1"
                />
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {updateMutation.isPending ? "Guardando..." : "Guardar permisos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
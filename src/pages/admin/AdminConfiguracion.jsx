import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Bell, Database, Users, CheckCircle2, Save, Globe2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminConfiguracion() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    platformName: "EMITIA PAY",
    supportEmail: "soporte@emitia.com",
    minBalance: "500000",
    maxTransfer: "5000000",
    kycRequired: true,
    alertsEnabled: true,
    maintenanceMode: false,
  });

  const { data: user } = useQuery({
    queryKey: ["admin_me"],
    queryFn: () => base44.auth.me(),
  });

  const handleSave = () => {
    setSaved(true);
    toast.success("Configuración guardada");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración del sistema</h1>
        <p className="text-sm text-gray-500 mt-0.5">Parámetros generales y preferencias de la plataforma</p>
      </div>

      {/* Perfil administrador */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Perfil del administrador</h3>
          </div>
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user?.full_name?.slice(0, 2).toUpperCase() || "AD"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.full_name || "Administrador"}</p>
              <p className="text-sm text-gray-500">{user?.email || "admin@emitia.com"}</p>
              <Badge className="bg-indigo-100 text-indigo-700 mt-1">Admin</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración general */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Globe2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Configuración general</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre de la plataforma</Label>
                <Input value={config.platformName} onChange={e => setConfig({ ...config, platformName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email de soporte</Label>
                <Input value={config.supportEmail} onChange={e => setConfig({ ...config, supportEmail: e.target.value })} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Límites operativos */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Límites operativos</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Saldo mínimo recomendado (ARS)</Label>
                <Input type="number" value={config.minBalance} onChange={e => setConfig({ ...config, minBalance: e.target.value })} />
                <p className="text-xs text-gray-400">Umbral para alertas de liquidez</p>
              </div>
              <div className="space-y-2">
                <Label>Límite máximo de transferencia (ARS)</Label>
                <Input type="number" value={config.maxTransfer} onChange={e => setConfig({ ...config, maxTransfer: e.target.value })} />
                <p className="text-xs text-gray-400">Por operación</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas y seguridad */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Alertas & Seguridad</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: "kycRequired", label: "KYC obligatorio para nuevos usuarios", desc: "Los usuarios deben completar verificación de identidad antes de operar" },
              { key: "alertsEnabled", label: "Sistema de alertas activo", desc: "Genera notificaciones automáticas de riesgo y anomalías operativas" },
              { key: "maintenanceMode", label: "Modo mantenimiento", desc: "Bloquea el acceso a usuarios regulares durante mantenimiento del sistema" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, [item.key]: !config[item.key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${config[item.key] ? "bg-indigo-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${config[item.key] ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado del sistema */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Estado del sistema</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "API de pagos", status: "Operativo" },
              { label: "Motor de inversiones", status: "Operativo" },
              { label: "Procesador de eCheqs", status: "Operativo" },
              { label: "Sistema de alertas", status: config.alertsEnabled ? "Operativo" : "Desactivado" },
              { label: "Modo mantenimiento", status: config.maintenanceMode ? "Activo" : "Inactivo" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{s.label}</span>
                <Badge className={s.status === "Operativo" ? "bg-emerald-100 text-emerald-700" : s.status === "Activo" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}>
                  {s.status === "Operativo" && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse" />}
                  {s.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Guardado" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
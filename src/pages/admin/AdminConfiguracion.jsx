import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Bell, Database, Users, CheckCircle2, Save, Globe2, Plug, ExternalLink, KeyRound, Zap } from "lucide-react";
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

      {/* Integraciones de pago */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Plug className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Integraciones de pago</h3>
          </div>
          <div className="space-y-3">
            {/* Pomelo */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    Pomelo
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Requiere Backend</span>
                  </p>
                  <p className="text-xs text-gray-400">Emisión de tarjetas, cuentas virtuales y procesamiento de pagos en LatAm</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://api-reference-mcp.pomelo.la/mcp" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> API Reference
                </a>
              </div>
            </div>

            {/* AstroPay */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    AstroPay Platform
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Requiere Backend</span>
                  </p>
                  <p className="text-xs text-gray-400">Wallet global, cuentas multi-moneda (CVU/PIX/IBAN), tarjetas y pagos transfronterizos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://developers.astropay.com/docs/platform/introduction" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Documentación
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <KeyRound className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                La conexión activa con Pomelo y AstroPay requiere <strong>funciones de backend</strong> para manejar
                las credenciales de API de forma segura y procesar webhooks. Actualmente tu plan no incluye
                backend functions — actualizá tu suscripción para activar la integración completa.
              </p>
            </div>
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
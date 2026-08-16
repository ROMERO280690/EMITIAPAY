import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const [companyName, setCompanyName] = useState("");
  const [companyCuit, setCompanyCuit] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (user && !initialized) {
    setCompanyName(user.company_name || "");
    setCompanyCuit(user.company_cuit || "");
    setInitialized(true);
  }

  const handleSave = async () => {
    await base44.auth.updateMe({ company_name: companyName, company_cuit: companyCuit });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    toast.success("Configuración guardada");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestioná tu cuenta y preferencias</p>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(user?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.full_name || "Usuario"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Razón social</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nombre de tu empresa" />
          </div>
          <div className="space-y-2">
            <Label>CUIT</Label>
            <Input value={companyCuit} onChange={(e) => setCompanyCuit(e.target.value)} placeholder="XX-XXXXXXXX-X" />
          </div>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Autenticación en dos pasos</p>
              <p className="text-xs text-muted-foreground">Protegé tu cuenta con un paso adicional</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("La autenticación en dos pasos estará disponible próximamente.")}>Configurar</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Sesiones activas</p>
              <p className="text-xs text-muted-foreground">Gestioná tus dispositivos conectados</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("Esta sesión es la única activa actualmente.")}>Ver sesiones</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import {
  Users, Search, Mail, Calendar, Shield, UserCheck, UserPlus,
  Crown, MoreVertical, Trash2, ShieldCheck, UserCog, Wallet, Eye, Lock
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PermissionsDialog from "@/components/admin/PermissionsDialog";

export default function AdminUsuarios() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "user" });
  const [permUser, setPermUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: () => base44.entities.User.list("-created_date", 100),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["admin_accounts"],
    queryFn: () => base44.entities.Account.list(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => base44.entities.User.update(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("Rol actualizado correctamente");
      setActionMenu(null);
    },
    onError: (err) => toast.error("No se pudo actualizar el rol"),
  });

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }) => base44.users.inviteUser(email, role),
    onSuccess: () => {
      toast.success(`Invitación enviada a ${inviteForm.email}`);
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      setInviteOpen(false);
      setInviteForm({ email: "", role: "user" });
    },
    onError: (err) => toast.error("No se pudo enviar la invitación"),
  });

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount = users.filter(u => u.role !== "admin").length;

  const accountsByUser = accounts.reduce((acc, a) => {
    acc[a.created_by_id] = (acc[a.created_by_id] || 0) + 1;
    return acc;
  }, {});

  const handleRoleChange = (user, newRole) => {
    if (user.role === newRole) return;
    updateRoleMutation.mutate({ id: user.id, role: newRole });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios & Permisos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestioná usuarios, roles y accesos de la plataforma</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="w-4 h-4" /> Invitar usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total usuarios", value: users.length, icon: Users, color: "bg-indigo-50 text-indigo-600" },
          { label: "Administradores", value: adminCount, icon: Shield, color: "bg-violet-50 text-violet-600" },
          { label: "Usuarios PyME", value: userCount, icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
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
          <Input className="pl-9" placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[
            { val: "all", label: "Todos" },
            { val: "admin", label: "Admins" },
            { val: "user", label: "Usuarios" },
          ].map(f => (
            <button key={f.val} onClick={() => setRoleFilter(f.val)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${roleFilter === f.val ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Users className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500">{search ? "Sin resultados" : "No hay usuarios registrados"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(user.full_name || user.email || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name || "Sin nombre"}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user.email}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      {user.created_date ? format(new Date(user.created_date), "dd/MM/yyyy") : "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{accountsByUser[user.id] || 0} cuenta(s)</p>
                    {/* Permission indicators */}
                    {user.role !== "admin" && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {user.permissions?.can_approve_payments && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-indigo-100 text-indigo-600" title="Puede aprobar pagos">
                            <Wallet className="w-3 h-3" />
                          </span>
                        )}
                        {user.permissions?.can_view_sensitive_data && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-rose-100 text-rose-600" title="Puede ver datos sensibles">
                            <Eye className="w-3 h-3" />
                          </span>
                        )}
                        {!user.permissions?.can_approve_payments && !user.permissions?.can_view_sensitive_data && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Sin permisos especiales
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Role selector */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {user.role === "admin" ? (
                      <Badge className="bg-indigo-100 text-indigo-700 gap-1">
                        <Crown className="w-3 h-3" /> Admin
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                        <UserCheck className="w-3 h-3" /> Usuario
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 h-8"
                      onClick={() => setPermUser(user)}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Permisos
                    </Button>
                    <Select
                      value={user.role}
                      onValueChange={(v) => handleRoleChange(user, v)}
                    >
                      <SelectTrigger className="w-8 h-8 p-0 border-0 shadow-none">
                        <UserCog className="w-4 h-4 text-gray-400" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Administrador
                          </div>
                        </SelectItem>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-3.5 h-3.5" /> Usuario PyME
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar nuevo usuario</DialogTitle>
            <DialogDescription>
              El invitado recibirá un email para registrarse en la plataforma con el rol asignado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Email del invitado</Label>
              <Input
                type="email"
                placeholder="empresa@email.com"
                value={inviteForm.email}
                onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" /> Usuario PyME
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Administrador
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                {inviteForm.role === "admin"
                  ? "Acceso total: puede ver y gestionar todos los datos del panel."
                  : "Acceso limitado: solo ve y gestiona sus propios datos financieros."}
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => inviteMutation.mutate(inviteForm)}
              disabled={!inviteForm.email || inviteMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {inviteMutation.isPending ? "Enviando..." : "Enviar invitación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions dialog */}
      <PermissionsDialog
        user={permUser}
        open={!!permUser}
        onOpenChange={(v) => !v && setPermUser(null)}
      />
    </div>
  );
}
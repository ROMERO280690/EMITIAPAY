import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Search, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const typeLabels = {
  provider: "Proveedor",
  client: "Cliente",
  employee: "Empleado",
  other: "Otro",
};

const typeColors = {
  provider: "bg-primary/10 text-primary",
  client: "bg-emerald-50 text-emerald-600",
  employee: "bg-blue-50 text-blue-600",
  other: "bg-muted text-muted-foreground",
};

export default function Contacts() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState({ name: "", cuit: "", email: "", phone: "", cbu: "", alias: "", type: "provider", category: "" });
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      resetForm();
      toast.success("Contacto creado");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      resetForm();
      toast.success("Contacto actualizado");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contacto eliminado");
    },
  });

  const resetForm = () => {
    setForm({ name: "", cuit: "", email: "", phone: "", cbu: "", alias: "", type: "provider", category: "" });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (contact) => {
    setForm({
      name: contact.name || "", cuit: contact.cuit || "", email: contact.email || "",
      phone: contact.phone || "", cbu: contact.cbu || "", alias: contact.alias || "",
      type: contact.type || "provider", category: contact.category || ""
    });
    setEditingId(contact.id);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const filtered = contacts.filter((c) => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.cuit?.includes(search);
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "??";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contactos</h1>
          <p className="text-sm text-muted-foreground mt-1">{contacts.length} contactos registrados</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo contacto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar contacto" : "Nuevo contacto"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre / Razón social</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CUIT</Label>
                  <Input value={form.cuit} onChange={(e) => setForm({ ...form, cuit: e.target.value })} placeholder="XX-XXXXXXXX-X" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+54 11 XXXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ej: Tecnología" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CBU</Label>
                  <Input value={form.cbu} onChange={(e) => setForm({ ...form, cbu: e.target.value })} placeholder="22 dígitos" />
                </div>
                <div className="space-y-2">
                  <Label>Alias</Label>
                  <Input value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} placeholder="alias.bancario" />
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={!form.name || createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? "Guardando..." : editingId ? "Actualizar" : "Crear contacto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o CUIT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-card animate-pulse rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Sin contactos</p>
            <p className="text-sm text-muted-foreground mt-1">Agregá proveedores, clientes o empleados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((contact, i) => (
            <motion.div key={contact.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{contact.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {contact.cuit && <p className="text-xs text-muted-foreground">{contact.cuit}</p>}
                        <Badge className={`${typeColors[contact.type]} text-[10px] border-0`}>
                          {typeLabels[contact.type] || contact.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => handleEdit(contact)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(contact.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
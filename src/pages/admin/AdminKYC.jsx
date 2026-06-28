import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Search, CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { motion } from "framer-motion";

// KYC is stored as FinancingRequest with product_type-like overloading,
// but better: we use a dedicated approach reading Users + a KYCRequest entity concept
// Since there's no KYC entity, we model KYC requests as a virtual overlay on top of Users
// and persist approval status using base44.auth.updateMe patterns for user role updates.
// For production readiness we persist KYC records in a general-purpose way using
// the existing entities. We'll use a JSON field on Account or a dedicated approach.
// Best: store KYC data in a separate entity. Since KYCRequest entity doesn't exist,
// we'll use FinancingRequest with a special marker, OR read users and simulate KYC state
// from user role/metadata. The cleanest production approach: store in User entity custom fields.

// We'll use base44.entities.User to list users and manage KYC state
// by reading a "kyc_status" field we store via updateMe flow.
// Since we can't create users, we'll show real users and allow admins to set their KYC status.
// We persist status by updating user.role supplementary data via a workaround:
// store kyc info in a side entity. Given no KYC entity exists, we'll use 
// base44.entities.Account to store kyc markers, OR we create a fake "KYC" store.
// SIMPLEST PRODUCTION FIX: Use real User list + local persist via FinancingRequest tagged "kyc"
// ACTUAL: Store KYC records in a new approach - piggyback on existing Contact entity
// with type="other" and category="kyc_pending|kyc_approved|kyc_rejected"

const STATUS_MAP = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Aprobado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: XCircle },
};

const RISK_MAP = {
  low: { label: "Bajo", color: "bg-emerald-100 text-emerald-700" },
  medium: { label: "Medio", color: "bg-amber-100 text-amber-700" },
  high: { label: "Alto", color: "bg-red-100 text-red-700" },
};

export default function AdminKYC() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({ company: "", cuit: "", contact: "", email: "", risk: "low", notes: "" });
  const qc = useQueryClient();

  // We store KYC records as Contact entities with category = "kyc_pending" | "kyc_approved" | "kyc_rejected"
  const { data: kycRecords = [], isLoading } = useQuery({
    queryKey: ["admin_kyc"],
    queryFn: () => base44.entities.Contact.filter({ type: "other" }, "-created_date", 100),
  });

  // Filter only KYC contacts (those with kyc_ prefix in category)
  const kyc = kycRecords.filter(r => r.category?.startsWith("kyc_"));

  const updateKYC = useMutation({
    mutationFn: ({ id, category, notes }) => base44.entities.Contact.update(id, { category, ...(notes !== undefined ? { phone: notes } : {}) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_kyc"] });
      toast.success("Estado KYC actualizado");
    },
  });

  const createKYC = useMutation({
    mutationFn: (data) => base44.entities.Contact.create({
      name: data.company,
      cuit: data.cuit,
      email: data.email,
      phone: data.notes, // we repurpose phone for notes in this minimal approach
      type: "other",
      category: "kyc_pending",
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_kyc"] });
      setNewOpen(false);
      setNewForm({ company: "", cuit: "", contact: "", email: "", risk: "low", notes: "" });
      toast.success("Solicitud KYC creada");
    },
  });

  const getStatus = (r) => {
    if (r.category === "kyc_approved") return "approved";
    if (r.category === "kyc_rejected") return "rejected";
    return "pending";
  };

  const filtered = kyc.filter(r => {
    const ms = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.cuit?.includes(search);
    const mf = statusFilter === "all" || getStatus(r) === statusFilter;
    return ms && mf;
  });

  const pendingCount = kyc.filter(r => getStatus(r) === "pending").length;
  const approvedCount = kyc.filter(r => getStatus(r) === "approved").length;
  const rejectedCount = kyc.filter(r => getStatus(r) === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solicitudes KYC</h1>
          <p className="text-sm text-gray-500">Verificación de identidad y aprobación de cuentas empresariales</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Nueva solicitud
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: pendingCount, color: "text-amber-600" },
          { label: "Aprobados", value: approvedCount, color: "text-emerald-600" },
          { label: "Rechazados", value: rejectedCount, color: "text-red-600" },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar empresa o CUIT..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {s === "all" ? "Todas" : STATUS_MAP[s]?.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Shield className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No hay solicitudes KYC. Creá la primera usando el botón superior.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((r) => {
                  const status = getStatus(r);
                  const st = STATUS_MAP[status];
                  const isSelectedNow = selected?.id === r.id;
                  return (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <div onClick={() => setSelected(r)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelectedNow ? "border-indigo-300 bg-indigo-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {r.name?.slice(0, 2).toUpperCase() || "KY"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{r.name}</p>
                              <p className="text-xs text-gray-400">{r.cuit || "Sin CUIT"} · {r.email || "—"}</p>
                              {r.created_date && <p className="text-xs text-gray-400">{format(new Date(r.created_date), "dd/MM/yyyy HH:mm", { locale: es })}</p>}
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${st.color}`}>{st.label}</span>
                        </div>
                        {status === "pending" && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50 flex-1"
                              onClick={e => { e.stopPropagation(); updateKYC.mutate({ id: r.id, category: "kyc_rejected" }); }}>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Rechazar
                            </Button>
                            <Button size="sm" className="text-xs h-7 bg-indigo-600 hover:bg-indigo-700 flex-1"
                              onClick={e => { e.stopPropagation(); updateKYC.mutate({ id: r.id, category: "kyc_approved" }); }}>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Aprobar
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm h-fit">
          <CardContent className="p-5">
            {!selected ? (
              <div className="py-12 text-center">
                <Eye className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Seleccioná una solicitud para ver el detalle</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {selected.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selected.name}</p>
                    <p className="text-xs text-gray-400">{selected.cuit || "Sin CUIT"}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Email", value: selected.email || "—" },
                    { label: "Estado", value: <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_MAP[getStatus(selected)]?.color}`}>{STATUS_MAP[getStatus(selected)]?.label}</span> },
                    { label: "Registrado", value: selected.created_date ? format(new Date(selected.created_date), "dd/MM/yyyy") : "—" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-medium text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
                {selected.phone && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">{selected.phone}</p>
                    </div>
                  </div>
                )}
                {getStatus(selected) === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => updateKYC.mutate({ id: selected.id, category: "kyc_rejected" })}>
                      Rechazar
                    </Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => updateKYC.mutate({ id: selected.id, category: "kyc_approved" })}>
                      Aprobar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog nueva solicitud */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva solicitud KYC</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Empresa / Razón Social</Label>
              <Input value={newForm.company} onChange={e => setNewForm({ ...newForm, company: e.target.value })} placeholder="Tech Solutions S.A." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>CUIT</Label>
                <Input value={newForm.cuit} onChange={e => setNewForm({ ...newForm, cuit: e.target.value })} placeholder="30-XXXXXXXX-X" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newForm.email} onChange={e => setNewForm({ ...newForm, email: e.target.value })} placeholder="contacto@empresa.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea value={newForm.notes} onChange={e => setNewForm({ ...newForm, notes: e.target.value })} placeholder="Documentación recibida, observaciones..." rows={3} />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={!newForm.company || createKYC.isPending}
              onClick={() => createKYC.mutate(newForm)}>
              {createKYC.isPending ? "Creando..." : "Crear solicitud"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
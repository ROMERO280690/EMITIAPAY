import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PiggyBank, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const STATUS_MAP = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Aprobado", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-700", icon: XCircle },
  disbursed: { label: "Desembolsado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

const TYPE_LABELS = {
  prestamo_pyme: "Préstamo PyME",
  leasing: "Leasing",
  descuento_cheques: "Descuento de cheques",
};

export default function AdminFinanciamientos() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const qc = useQueryClient();

  const { data: financings = [], isLoading } = useQuery({
    queryKey: ["admin_financings_full"],
    queryFn: () => base44.entities.FinancingRequest.list("-created_date", 100),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.FinancingRequest.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_financings_full"] }),
  });

  const filtered = financings.filter(f => {
    const matchSearch = !search || (f.reason || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pending = financings.filter(f => f.status === "pending");
  const totalRequested = financings.reduce((s, f) => s + (f.requested_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Financiamiento</h1>
        <p className="text-sm text-gray-500">{financings.length} solicitudes registradas · {pending.length} pendientes de revisión</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total solicitudes", value: financings.length },
          { label: "Pendientes", value: pending.length },
          { label: "Aprobados", value: financings.filter(f => f.status === "approved" || f.status === "disbursed").length },
          { label: "Monto total solicitado", value: fmt(totalRequested) },
        ].map(k => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className="text-xl font-bold text-gray-900">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar solicitud..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "approved", "rejected", "disbursed"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {s === "all" ? "Todas" : STATUS_MAP[s]?.label || s}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-gray-400">Cargando...</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <PiggyBank className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No hay solicitudes para mostrar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((f, i) => {
                const st = STATUS_MAP[f.status] || { label: f.status, color: "bg-gray-100 text-gray-600", icon: AlertCircle };
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PiggyBank className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{TYPE_LABELS[f.product_type] || f.product_type}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{f.reason || "Sin descripción"} · {f.term_months ? `${f.term_months} meses` : "Plazo no especificado"}</p>
                      <p className="text-xs text-gray-400">{f.created_date ? format(new Date(f.created_date), "dd/MM/yyyy HH:mm", { locale: es }) : "—"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">{fmt(f.requested_amount, f.currency)}</p>
                      {f.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => updateStatus.mutate({ id: f.id, status: "rejected" })}>
                            Rechazar
                          </Button>
                          <Button size="sm" className="text-xs h-7 bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => updateStatus.mutate({ id: f.id, status: "approved" })}>
                            Aprobar
                          </Button>
                        </div>
                      )}
                      {f.status === "approved" && (
                        <Button size="sm" className="text-xs h-7 mt-2 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => updateStatus.mutate({ id: f.id, status: "disbursed" })}>
                          Desembolsar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
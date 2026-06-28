import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Receipt, Search, CheckCircle2, XCircle, Clock, FileCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { toast } from "sonner";

const statusConfig = {
  pendiente: { label: "Pendiente", icon: Clock, className: "bg-amber-100 text-amber-700" },
  emitido: { label: "Emitido", icon: FileCheck, className: "bg-blue-100 text-blue-700" },
  depositado: { label: "Depositado", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
  rechazado: { label: "Rechazado", icon: XCircle, className: "bg-red-100 text-red-700" },
};

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

export default function AdminECheqs() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: echeqs = [], isLoading } = useQuery({
    queryKey: ["admin_echeqs_full"],
    queryFn: () => base44.entities.ECheq.list("-created_date", 100),
  });

  const updateEcheq = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ECheq.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_echeqs_full"] });
      toast.success("eCheq actualizado");
    },
  });

  const filtered = echeqs.filter(e =>
    !search ||
    e.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.concept?.toLowerCase().includes(search.toLowerCase())
  );

  const totalEmitido = echeqs.filter(e => e.status === "emitido" || e.status === "pendiente").reduce((s, e) => s + (e.amount || 0), 0);
  const totalDepositado = echeqs.filter(e => e.status === "depositado").reduce((s, e) => s + (e.amount || 0), 0);
  const totalRechazado = echeqs.filter(e => e.status === "rechazado").reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">eCheqs</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestión global de cheques electrónicos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total eCheqs", value: echeqs.length, color: "bg-indigo-50 text-indigo-600" },
          { label: "En circulación", value: fmt(totalEmitido), color: "bg-amber-50 text-amber-600" },
          { label: "Depositados", value: fmt(totalDepositado), color: "bg-emerald-50 text-emerald-600" },
          { label: "Rechazados", value: fmt(totalRechazado), color: "bg-red-50 text-red-600" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                <Receipt className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input className="pl-9" placeholder="Buscar por beneficiario o concepto..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white animate-pulse rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Receipt className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500">No hay eCheqs registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((ch, i) => {
            const cfg = statusConfig[ch.status] || statusConfig.pendiente;
            const Icon = cfg.icon;
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.className}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{ch.concept || `eCheq #${ch.id?.slice(-6)}`}</p>
                      <p className="text-xs text-gray-400">{ch.recipient_name || "Sin beneficiario"}</p>
                      {ch.emission_date && (
                        <p className="text-xs text-gray-400">Emitido: {format(new Date(ch.emission_date), "dd/MM/yyyy")}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{fmt(ch.amount, ch.currency)}</p>
                      <Badge className={cfg.className}>{cfg.label}</Badge>
                    </div>
                    {ch.status === "emitido" && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="text-emerald-600" title="Marcar depositado"
                          onClick={() => updateEcheq.mutate({ id: ch.id, data: { status: "depositado" } })}>
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" title="Rechazar"
                          onClick={() => updateEcheq.mutate({ id: ch.id, data: { status: "rechazado" } })}>
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
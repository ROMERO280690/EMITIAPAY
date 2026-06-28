import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, CheckCircle2, XCircle, Clock, FileText, AlertTriangle, Eye } from "lucide-react";

const MOCK_KYC = [
  { id: 1, company: "Exporta Norte S.A.", cuit: "30-71234567-1", contact: "Jorge Alvarez", email: "jalvarez@exportanorte.com", submitted: "2026-06-28T10:30:00", status: "pending", risk: "low", docs: ["DNI", "Estatuto", "Constancia AFIP"], notes: "" },
  { id: 2, company: "Importadora Central S.R.L.", cuit: "30-68912345-0", contact: "María González", email: "mgonzalez@impcentral.com", submitted: "2026-06-28T05:15:00", status: "pending", risk: "medium", docs: ["DNI", "Constancia AFIP"], notes: "Falta estatuto societario" },
  { id: 3, company: "Logística Sur", cuit: "30-70456789-2", contact: "Carlos Pérez", email: "cperez@logisur.com", submitted: "2026-06-27T14:00:00", status: "pending", risk: "low", docs: ["DNI", "Estatuto", "Constancia AFIP", "Balances"], notes: "" },
  { id: 4, company: "Tech Soluciones", cuit: "30-66123456-0", contact: "Ana López", email: "alopez@techsol.com", submitted: "2026-06-26T09:00:00", status: "approved", risk: "low", docs: ["DNI", "Estatuto", "Constancia AFIP"], notes: "Aprobado sin observaciones" },
  { id: 5, company: "Distribuidora Norte", cuit: "30-72345678-1", contact: "Pablo Rodríguez", email: "prodriguez@distnorte.com", submitted: "2026-06-25T16:30:00", status: "rejected", risk: "high", docs: ["DNI"], notes: "Documentación incompleta. Antecedentes en Veraz." },
];

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
  const [statuses, setStatuses] = useState(() => Object.fromEntries(MOCK_KYC.map(k => [k.id, k.status])));

  const filtered = MOCK_KYC.filter(k => {
    const ms = !search || k.company.toLowerCase().includes(search.toLowerCase()) || k.cuit.includes(search);
    const mf = statusFilter === "all" || statuses[k.id] === statusFilter;
    return ms && mf;
  });

  const approve = (id) => setStatuses(p => ({ ...p, [id]: "approved" }));
  const reject = (id) => setStatuses(p => ({ ...p, [id]: "rejected" }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes KYC</h1>
        <p className="text-sm text-gray-500">Verificación de identidad y aprobación de cuentas empresariales</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: Object.values(statuses).filter(s => s === "pending").length, color: "text-amber-600" },
          { label: "Aprobados", value: Object.values(statuses).filter(s => s === "approved").length, color: "text-emerald-600" },
          { label: "Rechazados", value: Object.values(statuses).filter(s => s === "rejected").length, color: "text-red-600" },
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
        {/* List */}
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

            <div className="space-y-3">
              {filtered.map((k) => {
                const st = STATUS_MAP[statuses[k.id]] || STATUS_MAP.pending;
                const risk = RISK_MAP[k.risk];
                const isSelected = selected?.id === k.id;
                return (
                  <div key={k.id} onClick={() => setSelected(k)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-indigo-300 bg-indigo-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {k.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{k.company}</p>
                          <p className="text-xs text-gray-400">{k.cuit} · {k.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${risk.color}`}>Riesgo {risk.label}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                      </div>
                    </div>
                    {statuses[k.id] === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50 flex-1"
                          onClick={e => { e.stopPropagation(); reject(k.id); }}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Rechazar
                        </Button>
                        <Button size="sm" className="text-xs h-7 bg-indigo-600 hover:bg-indigo-700 flex-1"
                          onClick={e => { e.stopPropagation(); approve(k.id); }}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Aprobar
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detail panel */}
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
                    {selected.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selected.company}</p>
                    <p className="text-xs text-gray-400">{selected.cuit}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Contacto</span>
                    <span className="font-medium text-gray-900">{selected.contact}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900 text-xs">{selected.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Estado</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_MAP[statuses[selected.id]]?.color}`}>
                      {STATUS_MAP[statuses[selected.id]]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Riesgo</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RISK_MAP[selected.risk]?.color}`}>
                      {RISK_MAP[selected.risk]?.label}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Documentación</p>
                  <div className="space-y-1">
                    {selected.docs.map(doc => (
                      <div key={doc} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>

                {selected.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">{selected.notes}</p>
                    </div>
                  </div>
                )}

                {statuses[selected.id] === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={() => reject(selected.id)}>
                      Rechazar
                    </Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => approve(selected.id)}>
                      Aprobar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
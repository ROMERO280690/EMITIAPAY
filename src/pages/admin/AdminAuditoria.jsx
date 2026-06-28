import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Search, ArrowUpRight, ArrowDownLeft, CreditCard, Landmark, PiggyBank, Receipt } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const EVENT_ICONS = {
  transaction: { icon: ArrowUpRight, color: "bg-blue-50 text-blue-600", label: "Transacción" },
  investment: { icon: Landmark, color: "bg-indigo-50 text-indigo-600", label: "Inversión" },
  financing: { icon: PiggyBank, color: "bg-rose-50 text-rose-600", label: "Financiamiento" },
  echeq: { icon: Receipt, color: "bg-amber-50 text-amber-600", label: "eCheq" },
  collection: { icon: CreditCard, color: "bg-emerald-50 text-emerald-600", label: "Cobro" },
  payment: { icon: ArrowDownLeft, color: "bg-violet-50 text-violet-600", label: "Pago" },
};

export default function AdminAuditoria() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: transactions = [] } = useQuery({ queryKey: ["audit_tx"], queryFn: () => base44.entities.Transaction.list("-created_date", 100) });
  const { data: investments = [] } = useQuery({ queryKey: ["audit_inv"], queryFn: () => base44.entities.Investment.list("-created_date", 50) });
  const { data: financings = [] } = useQuery({ queryKey: ["audit_fin"], queryFn: () => base44.entities.FinancingRequest.list("-created_date", 50) });
  const { data: echeqs = [] } = useQuery({ queryKey: ["audit_ech"], queryFn: () => base44.entities.ECheq.list("-created_date", 50) });
  const { data: collections = [] } = useQuery({ queryKey: ["audit_col"], queryFn: () => base44.entities.CollectionRequest.list("-created_date", 50) });
  const { data: payments = [] } = useQuery({ queryKey: ["audit_pay"], queryFn: () => base44.entities.PaymentRequest.list("-created_date", 50) });

  // Unificar en un log cronológico
  const allEvents = [
    ...transactions.map(t => ({ type: "transaction", entity: t, label: t.description || t.type, detail: t.counterpart_name, amount: t.amount, currency: t.currency, date: t.created_date, status: t.status })),
    ...investments.map(i => ({ type: "investment", entity: i, label: `Inversión: ${i.type === "plazo_fijo" ? "Plazo fijo" : i.type}`, detail: null, amount: i.amount, currency: i.currency, date: i.created_date, status: i.status })),
    ...financings.map(f => ({ type: "financing", entity: f, label: `Financiamiento: ${f.product_type}`, detail: f.reason, amount: f.requested_amount, currency: f.currency, date: f.created_date, status: f.status })),
    ...echeqs.map(e => ({ type: "echeq", entity: e, label: `eCheq: ${e.concept || e.id?.slice(-6)}`, detail: e.recipient_name, amount: e.amount, currency: e.currency, date: e.created_date, status: e.status })),
    ...collections.map(c => ({ type: "collection", entity: c, label: `Cobro: ${c.concept || c.client_name}`, detail: c.client_name, amount: c.amount, currency: c.currency, date: c.created_date, status: c.status })),
    ...payments.map(p => ({ type: "payment", entity: p, label: `Pago: ${p.concept || p.contact_name}`, detail: p.contact_name, amount: p.amount, currency: p.currency, date: p.scheduled_date || p.created_date, status: p.status })),
  ]
    .filter(e => e.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = allEvents.filter(e => {
    const matchType = typeFilter === "all" || e.type === typeFilter;
    const matchSearch = !search || e.label?.toLowerCase().includes(search.toLowerCase()) || e.detail?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Auditoría</h1>
        <p className="text-sm text-gray-500 mt-0.5">Registro cronológico de todos los eventos del sistema</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Transacciones", value: transactions.length, type: "transaction" },
          { label: "Inversiones", value: investments.length, type: "investment" },
          { label: "Financiamientos", value: financings.length, type: "financing" },
          { label: "eCheqs", value: echeqs.length, type: "echeq" },
          { label: "Cobros", value: collections.length, type: "collection" },
          { label: "Pagos", value: payments.length, type: "payment" },
        ].map((s) => {
          const cfg = EVENT_ICONS[s.type];
          return (
            <Card key={s.label} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter(typeFilter === s.type ? "all" : s.type)}>
              <CardContent className="p-3 text-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5 ${typeFilter === s.type ? "bg-indigo-600 text-white" : cfg.color}`}>
                  <cfg.icon className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input className="pl-9" placeholder="Buscar en el log..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <p className="text-sm text-gray-500">{filtered.length} evento(s) encontrados</p>

      <div className="space-y-2">
        {filtered.slice(0, 100).map((event, i) => {
          const cfg = EVENT_ICONS[event.type];
          const Icon = cfg.icon;
          return (
            <motion.div key={`${event.type}-${event.entity.id}-${i}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}>
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <p className="text-sm font-medium text-gray-900 truncate">{event.label}</p>
                  </div>
                  {event.detail && <p className="text-xs text-gray-400 truncate">{event.detail}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  {event.amount > 0 && <p className="text-sm font-bold text-gray-900">{fmt(event.amount, event.currency)}</p>}
                  <p className="text-xs text-gray-400">{format(new Date(event.date), "dd/MM HH:mm", { locale: es })}</p>
                  {event.status && <Badge className="text-[10px] bg-gray-100 text-gray-600 mt-0.5">{event.status}</Badge>}
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center py-16">
              <FileText className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-500">No hay eventos registrados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
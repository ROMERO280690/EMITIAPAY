import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Wallet, TrendingUp } from "lucide-react";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

export default function AdminCuentas() {
  const [search, setSearch] = useState("");
  const [curFilter, setCurFilter] = useState("all");

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["admin_cuentas_full"],
    queryFn: () => base44.entities.Account.list("-created_date", 200),
  });

  const filtered = accounts.filter(a => {
    const ms = !search || (a.name || "").toLowerCase().includes(search.toLowerCase()) || (a.cbu || "").includes(search) || (a.alias || "").toLowerCase().includes(search.toLowerCase());
    const mc = curFilter === "all" || a.currency === curFilter;
    return ms && mc;
  });

  const totalARS = accounts.filter(a => a.currency === "ARS").reduce((s, a) => s + (a.balance || 0), 0);
  const totalUSD = accounts.filter(a => a.currency === "USD").reduce((s, a) => s + (a.balance || 0), 0);
  const active = accounts.filter(a => a.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cuentas bancarias</h1>
        <p className="text-sm text-gray-500">{accounts.length} cuentas en la plataforma</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total cuentas", value: accounts.length },
          { label: "Cuentas activas", value: active },
          { label: "Saldo total ARS", value: fmt(totalARS) },
          { label: "Saldo total USD", value: fmt(totalUSD, "USD") },
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
              <Input placeholder="Buscar por nombre, CBU o alias..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {[["all", "Todas"], ["ARS", "Pesos"], ["USD", "Dólares"]].map(([v, l]) => (
                <button key={v} onClick={() => setCurFilter(v)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${curFilter === v ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-gray-400">Cargando...</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Wallet className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No hay cuentas para mostrar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Cuenta", "Tipo", "Moneda", "CBU / Alias", "Saldo", "Estado"].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${a.currency === "USD" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                            {a.currency === "USD" ? "US" : "AR"}
                          </div>
                          <p className="font-medium text-gray-900">{a.name}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500 capitalize">{a.account_type === "corriente" ? "Corriente" : "Remunerada"}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${a.currency === "USD" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>{a.currency}</span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-mono text-xs text-gray-600">{a.cbu || "—"}</p>
                        <p className="text-xs text-gray-400">{a.alias || "—"}</p>
                      </td>
                      <td className="px-3 py-3 font-bold text-gray-900">{fmt(a.balance, a.currency)}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {a.status === "active" ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
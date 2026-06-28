import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Search, TrendingUp, Wallet, ArrowUpRight, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";

const fmt = (v) => `$ ${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

// Simulate company grouping from accounts
const MOCK_COMPANIES = [
  { name: "Tech Solutions S.A.", cuit: "30-71234567-1", plan: "Pro", accounts: 2, balanceARS: 2458320, balanceUSD: 15200, status: "active", since: "Ene 2025", transactions: 142 },
  { name: "Distribuidora Norte S.R.L.", cuit: "30-68912345-0", plan: "Básico", accounts: 1, balanceARS: 890000, balanceUSD: 0, status: "active", since: "Mar 2025", transactions: 67 },
  { name: "Studio LM", cuit: "20-35678901-2", plan: "Pro", accounts: 2, balanceARS: 1250000, balanceUSD: 8500, status: "active", since: "Feb 2025", transactions: 98 },
  { name: "Exporta Sur S.R.L.", cuit: "30-70456789-2", plan: "Enterprise", accounts: 3, balanceARS: 5800000, balanceUSD: 42000, status: "active", since: "Nov 2024", transactions: 315 },
  { name: "Vera & Asociados", cuit: "30-66123456-0", plan: "Básico", accounts: 1, balanceARS: 420000, balanceUSD: 0, status: "inactive", since: "Abr 2025", transactions: 23 },
  { name: "Constructora LM", cuit: "30-72345678-1", plan: "Pro", accounts: 2, balanceARS: 3200000, balanceUSD: 12000, status: "active", since: "Dic 2024", transactions: 187 },
];

const PLAN_COLORS = {
  "Básico": "bg-gray-100 text-gray-600",
  "Pro": "bg-indigo-100 text-indigo-700",
  "Enterprise": "bg-violet-100 text-violet-700",
};

export default function AdminEmpresas() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.cuit.includes(search)
  );

  const totalBalance = MOCK_COMPANIES.reduce((s, c) => s + c.balanceARS, 0);
  const activeCount = MOCK_COMPANIES.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas PyME</h1>
          <p className="text-sm text-gray-500">{MOCK_COMPANIES.length} empresas registradas en la plataforma</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total empresas", value: MOCK_COMPANIES.length, icon: Building2, color: "indigo" },
          { label: "Activas", value: activeCount, icon: CheckCircle2, color: "emerald" },
          { label: "Saldo total ARS", value: fmt(totalBalance), icon: Wallet, color: "blue" },
          { label: "Transacciones este mes", value: MOCK_COMPANIES.reduce((s, c) => s + c.transactions, 0), icon: TrendingUp, color: "violet" },
        ].map((k) => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{k.label}</p>
              <p className="text-xl font-bold text-gray-900">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar por nombre o CUIT..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Empresa", "CUIT", "Plan", "Cuentas", "Saldo ARS", "Saldo USD", "Transacciones", "Estado", ""].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400">Desde {c.since}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 font-mono text-xs text-gray-600">{c.cuit}</td>
                    <td className="px-3 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PLAN_COLORS[c.plan]}`}>{c.plan}</span>
                    </td>
                    <td className="px-3 py-4 text-center font-medium">{c.accounts}</td>
                    <td className="px-3 py-4 font-semibold text-gray-900">{fmt(c.balanceARS)}</td>
                    <td className="px-3 py-4 font-semibold text-gray-900">{c.balanceUSD > 0 ? `US$ ${c.balanceUSD.toLocaleString("es-AR")}` : "—"}</td>
                    <td className="px-3 py-4 text-center">{c.transactions}</td>
                    <td className="px-3 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.status === "active" ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
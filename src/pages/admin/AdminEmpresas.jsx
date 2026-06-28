import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Search, TrendingUp, Wallet, CheckCircle2, Users, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

export default function AdminEmpresas() {
  const [search, setSearch] = useState("");

  const { data: accounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: ["admin_accounts_empresas"],
    queryFn: () => base44.entities.Account.list("-created_date", 200),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["admin_tx_empresas"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 500),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin_users_empresas"],
    queryFn: () => base44.entities.User.list("-created_date", 100),
  });

  // Group accounts by user (each user = one empresa)
  const empresas = users.map(user => {
    const userAccounts = accounts.filter(a => a.created_by_id === user.id);
    const userTx = transactions.filter(t => t.created_by_id === user.id);
    const balanceARS = userAccounts.filter(a => a.currency === "ARS").reduce((s, a) => s + (a.balance || 0), 0);
    const balanceUSD = userAccounts.filter(a => a.currency === "USD").reduce((s, a) => s + (a.balance || 0), 0);
    const hasActive = userAccounts.some(a => a.status === "active");
    return {
      id: user.id,
      name: user.full_name || user.email || "Usuario",
      email: user.email,
      cuit: "—",
      accounts: userAccounts.length,
      balanceARS,
      balanceUSD,
      status: hasActive ? "active" : userAccounts.length > 0 ? "inactive" : "no_accounts",
      since: user.created_date ? format(new Date(user.created_date), "MMM yyyy", { locale: es }) : "—",
      transactions: userTx.length,
      role: user.role,
    };
  }).filter(e => e.accounts > 0 || e.role === "user"); // show users with accounts or regular users

  const filtered = empresas.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.cuit.includes(search)
  );

  const totalBalance = empresas.reduce((s, c) => s + c.balanceARS, 0);
  const activeCount = empresas.filter(c => c.status === "active").length;
  const totalTx = transactions.length;

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas PyME</h1>
          <p className="text-sm text-gray-500">{empresas.length} empresas registradas en la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total empresas", value: empresas.length, icon: Building2, color: "bg-indigo-50 text-indigo-600" },
          { label: "Activas (con cuentas)", value: activeCount, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
          { label: "Saldo total ARS", value: fmt(totalBalance), icon: Wallet, color: "bg-blue-50 text-blue-600" },
          { label: "Total transacciones", value: totalTx, icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
        ].map((k) => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${k.color}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{k.label}</p>
                <p className="text-xl font-bold text-gray-900">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar por nombre o email..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loadingAccounts ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">{search ? "Sin resultados" : "No hay usuarios registrados con cuentas aún"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Empresa / Usuario", "Email", "Cuentas", "Saldo ARS", "Saldo USD", "Transacciones", "Registrado", "Estado"].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((c, i) => (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 transition-colors">
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
                      <td className="px-3 py-4 text-xs text-gray-500">{c.email || "—"}</td>
                      <td className="px-3 py-4 text-center font-medium">{c.accounts}</td>
                      <td className="px-3 py-4 font-semibold text-gray-900">{fmt(c.balanceARS)}</td>
                      <td className="px-3 py-4 font-semibold text-gray-900">{c.balanceUSD > 0 ? fmt(c.balanceUSD, "USD") : "—"}</td>
                      <td className="px-3 py-4 text-center">{c.transactions}</td>
                      <td className="px-3 py-4 text-xs text-gray-400">{c.since}</td>
                      <td className="px-3 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          c.status === "active" ? "bg-emerald-100 text-emerald-700" :
                          c.status === "no_accounts" ? "bg-gray-100 text-gray-400" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {c.status === "active" ? "Activa" : c.status === "no_accounts" ? "Sin cuentas" : "Inactiva"}
                        </span>
                      </td>
                    </motion.tr>
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
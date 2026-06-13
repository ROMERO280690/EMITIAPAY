import React from "react";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";

function formatCurrency(amount, currency = "ARS") {
  if (currency === "USD") {
    return `US$ ${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  }
  return `$ ${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
}

const cards = [
  {
    label: "Saldo total ARS",
    icon: Wallet,
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary bg-primary/10",
  },
  {
    label: "Saldo total USD",
    icon: TrendingUp,
    color: "from-emerald-50 to-emerald-50/50",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Ingresos del mes",
    icon: ArrowDownLeft,
    color: "from-blue-50 to-blue-50/50",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    label: "Egresos del mes",
    icon: ArrowUpRight,
    color: "from-orange-50 to-orange-50/50",
    iconColor: "text-orange-600 bg-orange-50",
  },
];

export default function BalanceCards({ accounts, transactions }) {
  const arsBalance = accounts
    .filter((a) => a.currency === "ARS")
    .reduce((sum, a) => sum + (a.balance || 0), 0);
  const usdBalance = accounts
    .filter((a) => a.currency === "USD")
    .reduce((sum, a) => sum + (a.balance || 0), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTransactions = transactions.filter(
    (t) => new Date(t.created_date) >= monthStart
  );

  const income = monthTransactions
    .filter((t) => ["transfer_in", "collection", "yield", "deposit"].includes(t.type))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const expenses = monthTransactions
    .filter((t) => ["transfer_out", "payment"].includes(t.type))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const values = [
    formatCurrency(arsBalance, "ARS"),
    formatCurrency(usdBalance, "USD"),
    formatCurrency(income, "ARS"),
    formatCurrency(expenses, "ARS"),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className={`p-5 bg-gradient-to-br ${card.color} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-2 tracking-tight">{values[i]}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
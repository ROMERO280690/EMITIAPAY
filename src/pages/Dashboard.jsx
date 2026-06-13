import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Skeleton } from "@/components/ui/skeleton";
import BalanceCards from "../components/dashboard/BalanceCards";
import CashFlowChart from "../components/dashboard/CashFlowChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import PendingActions from "../components/dashboard/PendingActions";

export default function Dashboard() {
  const { data: accounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const { data: transactions = [], isLoading: loadingTxns } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 50),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-created_date"),
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-created_date"),
  });

  const isLoading = loadingAccounts || loadingTxns;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen de tus finanzas empresariales
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
      ) : (
        <BalanceCards accounts={accounts} transactions={transactions} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart transactions={transactions} />
        </div>
        <div>
          <PendingActions payments={payments} collections={collections} />
        </div>
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}
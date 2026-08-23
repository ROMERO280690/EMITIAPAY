import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, ArrowRight, TrendingUp, Landmark, Clock, Zap, Users, FileText, Bell, Target, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import CashFlowChart from "@/components/dashboard/CashFlowChart";

const formatCurrency = (val, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: accounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-scheduled_date", 20),
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-due_date", 20),
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["investments"],
    queryFn: () => base44.entities.Investment.filter({ status: "active" }),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ["savings-goals"],
    queryFn: () => base44.entities.SavingsGoal.filter({ status: "active" }),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => base44.entities.Notification.filter({ read: false }),
  });

  const { data: cards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: () => base44.entities.Card.filter({ status: "active" }),
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ["dashboard_transactions"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 200),
  });

  const userName = user?.full_name || "Usuario";
  const companyName = user?.company_name || "Mi Empresa";
  const userInitials = userName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const arsAccounts = accounts.filter((a) => a.currency === "ARS" && a.status === "active");
  const usdAccounts = accounts.filter((a) => a.currency === "USD" && a.status === "active");
  const arsTotal = arsAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const usdTotal = usdAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  const scheduledPayments = payments.filter((p) => p.status === "scheduled" || p.status === "draft");
  const scheduledTotal = scheduledPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const overdueCollections = collections.filter((c) => c.status === "overdue");

  const arsInvestments = investments.filter((i) => i.currency === "ARS").reduce((sum, i) => sum + (i.amount || 0), 0);
  const usdInvestments = investments.filter((i) => i.currency === "USD").reduce((sum, i) => sum + (i.amount || 0), 0);
  const activeGoals = goals.length;
  const unreadNotifications = notifications.length;
  const activeCards = cards.length;

  const upcomingEvents = [
    ...scheduledPayments.map((p) => ({
      type: "payment",
      date: p.scheduled_date ? new Date(p.scheduled_date) : null,
      label: `Pago a ${p.contact_name}`,
      amount: p.amount,
      currency: p.currency || "ARS",
    })),
    ...collections.filter((c) => c.status === "pending" || c.status === "sent").map((c) => ({
      type: "collection",
      date: c.due_date ? new Date(c.due_date) : null,
      label: `Cobro de ${c.client_name}`,
      amount: c.amount,
      currency: c.currency || "ARS",
    })),
  ]
    .filter((e) => e.date)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const BalanceCard = ({ flag, title, total, currency, accounts: accts, showTna }) => (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{flag}</span>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold">
              {formatCurrency(total, currency)}
            </span>
            {showTna && (
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200">
                38.64% TNA
              </Badge>
            )}
          </div>
        </div>

        {/* Cuentas */}
        <div className="px-5 py-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cuentas</p>
          {accts.map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.bank || "Cresium"} · {a.cbu || "····" + (a.id || "").slice(-4)}</p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(a.balance || 0, a.currency)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Actividad */}
        <div className="px-5 py-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actividad</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-sm">Rendimientos</p>
                <p className="text-xs text-muted-foreground">Tus rendimientos de este mes</p>
              </div>
            </div>
            <span className="text-sm font-semibold tabular-nums">{formatCurrency(0, currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm">Inversiones activas</p>
                <p className="text-xs text-muted-foreground">{investments.filter((i) => i.currency === currency).length} plazos/fondos</p>
              </div>
            </div>
            <Link to="/inversiones" className="text-sm font-semibold text-primary hover:underline tabular-nums">
              {formatCurrency(currency === "ARS" ? arsInvestments : usdInvestments, currency)}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-sm">Transferencias programadas</p>
                <p className="text-xs text-muted-foreground">{scheduledPayments.length} pendientes</p>
              </div>
            </div>
            <Link to="/pagos" className="text-sm font-semibold text-primary hover:underline tabular-nums">
              {formatCurrency(scheduledTotal, "ARS")}
            </Link>
          </div>
        </div>

        <Separator />

        {/* Inversiones y metas */}
        <div className="px-5 py-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Inversiones y metas</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm">Invertido en {currency === "USD" ? "dólares" : "pesos"}</p>
                <p className="text-xs text-muted-foreground">Plazo fijo y fondos comunes</p>
              </div>
            </div>
            <Link to="/inversiones" className="text-sm font-semibold text-primary hover:underline">
              <ArrowRight className="w-4 h-4 inline" />
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-500" />
              <div>
                <p className="text-sm">Metas de ahorro activas</p>
                <p className="text-xs text-muted-foreground">{activeGoals} {activeGoals === 1 ? "meta" : "metas"} en curso</p>
              </div>
            </div>
            <Link to="/metas" className="text-sm font-semibold text-primary hover:underline">
              <ArrowRight className="w-4 h-4 inline" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          {userInitials}
        </div>
        <div>
          <p className="font-semibold">Hola, {userName.split(" ")[0]}</p>
          <p className="text-xs text-muted-foreground">{companyName}</p>
        </div>
      </div>

      {loadingAccounts ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[420px] rounded-xl" />
          <Skeleton className="h-[420px] rounded-xl" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <BalanceCard flag="🇦🇷" title="Saldo en pesos" total={arsTotal} currency="ARS" accounts={arsAccounts} showTna />
          <BalanceCard flag="🇺🇸" title="Saldo en dólares" total={usdTotal} currency="USD" accounts={usdAccounts} />
        </motion.div>
      )}

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/notificaciones" className="group">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{unreadNotifications}</p>
                <p className="text-xs text-muted-foreground">Notificaciones</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/tarjetas" className="group">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{activeCards}</p>
                <p className="text-xs text-muted-foreground">Tarjetas activas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/metas" className="group">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{activeGoals}</p>
                <p className="text-xs text-muted-foreground">Metas activas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/inversiones" className="group">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{investments.length}</p>
                <p className="text-xs text-muted-foreground">Inversiones</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Gráfico de evolución ingresos/egresos */}
      <CashFlowChart transactions={transactions} isLoading={loadingTransactions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos eventos */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Próximos eventos del calendario</h3>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No hay eventos próximos en el calendario</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Al programar movimientos, adherir servicios con vencimiento o crear pagos y automatizaciones, verás los eventos aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {event.type === "payment" ? (
                        <Zap className="w-4 h-4 text-primary" />
                      ) : (
                        <Users className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.date ? format(event.date, "dd 'de' MMMM", { locale: es }) : ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(event.amount, event.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acceso rápido */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold">Acceso rápido</h3>
            </div>
            <div className="space-y-3">
              <Link to="/inversiones" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Landmark className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invertí tus fondos en un fondo común de inversión</p>
                    <p className="text-xs text-muted-foreground">Operá en fondos comunes de inversión</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/pagos-inteligentes" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pagá facturas a proveedores</p>
                    <p className="text-xs text-muted-foreground">Automatizá los pagos de facturas a tus proveedores</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/cobros-inteligentes" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cobrá facturas a tus clientes</p>
                    <p className="text-xs text-muted-foreground">Automatizá los cobros de tus facturas a clientes</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
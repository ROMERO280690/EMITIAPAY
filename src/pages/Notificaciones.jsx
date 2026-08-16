import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Trash2, ArrowLeftRight, CreditCard, TrendingUp, Shield, AlertTriangle, Landmark, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

const TYPE_CONFIG = {
  transfer: { label: "Transferencia", icon: ArrowLeftRight, color: "bg-indigo-100 text-indigo-700" },
  payment: { label: "Pago", icon: CreditCard, color: "bg-violet-100 text-violet-700" },
  collection: { label: "Cobro", icon: TrendingUp, color: "bg-emerald-100 text-emerald-700" },
  system: { label: "Sistema", icon: Bell, color: "bg-blue-100 text-blue-700" },
  security: { label: "Seguridad", icon: Shield, color: "bg-rose-100 text-rose-700" },
  alert: { label: "Alerta", icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
  investment: { label: "Inversión", icon: Landmark, color: "bg-teal-100 text-teal-700" },
};

const fmt = (v, cur = "ARS") => `${cur === "USD" ? "US$ " : "$ "}${(v || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

export default function Notificaciones() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => base44.entities.Notification.list("-created_date", 100),
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter((n) => !n.read);
      if (unread.length === 0) return;
      return base44.entities.Notification.bulkUpdate(unread.map((n) => ({ id: n.id, read: true })));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Todas marcadas como leídas");
    },
  });

  const deleteNotif = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notificación eliminada");
    },
  });

  const filtered = filter === "all" ? notifications : filter === "unread" ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Notificaciones
            {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground">{unreadCount} sin leer</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground">Mantenete al día con la actividad de tu cuenta</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
            <CheckCheck className="w-4 h-4" /> Marcar todas leídas
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[["all", "Todas"], ["unread", "Sin leer"], ["transfer", "Transferencias"], ["payment", "Pagos"], ["collection", "Cobros"], ["security", "Seguridad"], ["alert", "Alertas"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${filter === v ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>{l}</button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-card animate-pulse rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No hay notificaciones</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Las novedades de tu cuenta aparecerán acá</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
            const Icon = cfg.icon;
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                <Card className={`border-0 shadow-sm transition-all ${!notif.read ? "ring-1 ring-primary/20 bg-primary/5" : ""}`}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-semibold text-sm ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</p>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                        <Badge variant="outline" className="text-[10px]">{cfg.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                      {notif.amount != null && <p className="text-sm font-bold text-foreground mt-1">{fmt(notif.amount, notif.currency)}</p>}
                      <p className="text-xs text-muted-foreground/70 mt-1">{notif.created_date ? format(new Date(notif.created_date), "dd/MM/yyyy HH:mm", { locale: es }) : "—"}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {notif.link && (
                        <Link to={notif.link}>
                          <Button size="sm" variant="ghost" className="text-xs">Ver</Button>
                        </Link>
                      )}
                      {!notif.read && (
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => markRead.mutate(notif.id)}>
                          <MailOpen className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-xs text-destructive hover:bg-destructive/5" onClick={() => deleteNotif.mutate(notif.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
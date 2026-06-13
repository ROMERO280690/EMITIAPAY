import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Send, Download, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PendingActions({ payments, collections }) {
  const pendingPayments = payments.filter((p) => p.status === "draft" || p.status === "scheduled");
  const pendingCollections = collections.filter((c) => c.status === "pending" || c.status === "sent" || c.status === "overdue");
  const overdueCollections = collections.filter((c) => c.status === "overdue");

  const items = [
    {
      label: "Pagos pendientes",
      count: pendingPayments.length,
      icon: Send,
      color: "text-primary bg-primary/10",
      link: "/pagos",
    },
    {
      label: "Cobros por recibir",
      count: pendingCollections.length,
      icon: Download,
      color: "text-blue-600 bg-blue-50",
      link: "/cobros",
    },
    {
      label: "Cobros vencidos",
      count: overdueCollections.length,
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-50",
      link: "/cobros",
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Acciones pendientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                {item.count}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Zap, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export default function Calendario() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => base44.entities.PaymentRequest.list("-scheduled_date", 50),
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => base44.entities.CollectionRequest.list("-due_date", 50),
  });

  const allEvents = [
    ...payments.filter((p) => p.scheduled_date).map((p) => ({
      date: new Date(p.scheduled_date),
      type: "payment",
      label: `Pago a ${p.contact_name}`,
      amount: p.amount,
      currency: p.currency || "ARS",
    })),
    ...collections.filter((c) => c.due_date).map((c) => ({
      date: new Date(c.due_date),
      type: "collection",
      label: `Cobro de ${c.client_name}`,
      amount: c.amount,
      currency: c.currency || "ARS",
    })),
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const monthEvents = allEvents.filter(
    (e) => e.date >= monthStart && e.date <= monthEnd
  );

  const selectedDayEvents = [];

  const formatCurrency = (val, currency) => {
    const prefix = currency === "USD" ? "US$ " : "$ ";
    return `${prefix}${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  };

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendario</h1>
        <p className="text-sm text-muted-foreground mt-1">Eventos financieros programados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="font-semibold capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale: es })}
                </h2>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center border-b border-border">
                {dayNames.map((d) => (
                  <div key={d} className="py-2 text-xs font-medium text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                  const dayEvents = allEvents.filter((e) => isSameDay(e.date, day));
                  return (
                    <div
                      key={day.toISOString()}
                      className={`aspect-square p-1 border-b border-r border-border/50 hover:bg-accent/30 cursor-pointer transition-colors ${
                        isToday(day) ? "bg-primary/5" : ""
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                          isToday(day) ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 2).map((ev, i) => (
                          <div
                            key={i}
                            className={`px-1 py-0.5 rounded text-[9px] truncate font-medium ${
                              ev.type === "payment" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {ev.label}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Eventos del mes</h3>
              </div>
              {monthEvents.length === 0 ? (
                <div className="flex flex-col items-center py-8">
                  <CalendarIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground text-center">Sin eventos este mes</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {monthEvents.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        ev.type === "payment" ? "bg-amber-50" : "bg-emerald-50"
                      }`}>
                        {ev.type === "payment" ? (
                          <Zap className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Users className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{ev.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(ev.date, "dd 'de' MMMM", { locale: es })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(ev.amount, ev.currency)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
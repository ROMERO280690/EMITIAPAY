import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const COLUMNS = [
  { id: "pending", label: "Pendiente", icon: Clock, accent: "border-t-slate-400", dot: "bg-slate-400" },
  { id: "sent", label: "Enviado", icon: Mail, accent: "border-t-blue-500", dot: "bg-blue-500" },
  { id: "viewed", label: "Visto", icon: Eye, accent: "border-t-purple-500", dot: "bg-purple-500" },
  { id: "overdue", label: "Vencido", icon: AlertTriangle, accent: "border-t-orange-500", dot: "bg-orange-500" },
  { id: "paid", label: "Cobrado", icon: CheckCircle2, accent: "border-t-emerald-500", dot: "bg-emerald-500" },
];

const fmt = (n, currency) =>
  `${currency === "USD" ? "US$ " : "$ "}${(n || 0).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function CollectionsKanban({ collections, onMove }) {
  const byStatus = (status) => collections.filter((c) => c.status === status);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    onMove(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
        {COLUMNS.map((col) => {
          const items = byStatus(col.id);
          const total = items.reduce((s, c) => s + (c.amount || 0), 0);
          return (
            <div key={col.id} className="flex-shrink-0 w-72 flex flex-col">
              <div className={`rounded-xl bg-card border border-t-4 ${col.accent} shadow-sm mb-3`}>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <col.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold">{col.label}</span>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">{items.length}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{fmt(total, "ARS")}</span>
                </div>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[120px] rounded-xl p-2 space-y-2 transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5" : "bg-muted/30"
                    }`}
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(p, s) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            className={`rounded-lg bg-card border shadow-sm p-3 cursor-grab active:cursor-grabbing transition-shadow ${
                              s.isDragging ? "shadow-md ring-2 ring-primary/30" : "hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="text-sm font-semibold truncate">{item.client_name}</p>
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${col.dot}`} />
                            </div>
                            <p className="text-base font-bold text-foreground">{fmt(item.amount, item.currency)}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[11px] text-muted-foreground truncate">
                                {item.invoice_number || item.concept || "Sin concepto"}
                              </span>
                              {item.due_date && (
                                <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">
                                  {format(new Date(item.due_date), "dd MMM", { locale: es })}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {items.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-6 border-2 border-dashed border-muted rounded-lg">
                        Arrastrá aquí
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
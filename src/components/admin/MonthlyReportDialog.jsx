import React, { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDownLeft, ArrowUpRight, TrendingUp, FileDown, ImageDown, FileSpreadsheet, Building2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

const fmt = (v) => `$ ${(v || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

const INCOME_TYPES = ["transfer_in", "collection", "yield", "deposit"];
const EXPENSE_TYPES = ["transfer_out", "payment"];

export default function MonthlyReportDialog({ open, onOpenChange }) {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin_tx_monthly_report"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 1000),
    enabled: open,
  });

  const monthDate = subMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const monthLabel = format(monthDate, "MMMM yyyy", { locale: es });

  const report = useMemo(() => {
    const monthTx = transactions.filter(t => {
      if (!t.created_date) return false;
      return isWithinInterval(new Date(t.created_date), { start: monthStart, end: monthEnd });
    });

    const ingresosTx = monthTx.filter(t => INCOME_TYPES.includes(t.type));
    const egresosTx = monthTx.filter(t => EXPENSE_TYPES.includes(t.type));

    const totalIngresos = ingresosTx.reduce((s, t) => s + (t.amount || 0), 0);
    const totalEgresos = egresosTx.reduce((s, t) => s + (t.amount || 0), 0);
    const neto = totalIngresos - totalEgresos;

    // Breakdown by category
    const byCategory = {};
    monthTx.forEach(t => {
      const cat = t.category || "otros";
      const isIncome = INCOME_TYPES.includes(t.type);
      if (!byCategory[cat]) byCategory[cat] = { ingresos: 0, egresos: 0 };
      if (isIncome) byCategory[cat].ingresos += t.amount || 0;
      else byCategory[cat].egresos += t.amount || 0;
    });

    const categoryData = Object.entries(byCategory).map(([cat, v]) => ({
      categoria: cat,
      Ingresos: v.ingresos,
      Egresos: v.egresos,
    }));

    return {
      totalIngresos, totalEgresos, neto,
      txCount: monthTx.length,
      ingresosCount: ingresosTx.length,
      egresosCount: egresosTx.length,
      categoryData,
      topIngresos: [...ingresosTx].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5),
      topEgresos: [...egresosTx].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5),
    };
  }, [transactions, monthOffset]);

  const exportCSV = () => {
    const rows = [
      ["Reporte mensual EMITIA PAY"],
      ["Período", monthLabel],
      [],
      ["Resumen"],
      ["Total ingresos", report.totalIngresos],
      ["Total egresos", report.totalEgresos],
      ["Resultado neto", report.neto],
      ["Transacciones", report.txCount],
      [],
      ["Detalle por categoría"],
      ["Categoría", "Ingresos", "Egresos"],
      ...report.categoryData.map(c => [c.categoria, c.Ingresos, c.Egresos]),
      [],
      ["Top ingresos"],
      ["Descripción", "Monto", "Moneda"],
      ...report.topIngresos.map(t => [t.description || t.type, t.amount, t.currency]),
      [],
      ["Top egresos"],
      ["Descripción", "Monto", "Moneda"],
      ...report.topEgresos.map(t => [t.description || t.type, t.amount, t.currency]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-mensual-emitia-${format(monthDate, "yyyy-MM")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`reporte-mensual-emitia-${format(monthDate, "yyyy-MM")}.pdf`);
      toast.success("PDF descargado");
    } catch (e) {
      toast.error("No se pudo generar el PDF");
    } finally {
      setExporting(false);
    }
  };

  const exportPNG = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
      });
      const link = document.createElement("a");
      link.download = `reporte-mensual-emitia-${format(monthDate, "yyyy-MM")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Imagen descargada");
    } catch (e) {
      toast.error("No se pudo generar la imagen");
    } finally {
      setExporting(false);
    }
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(subMonths(new Date(), i), "MMMM yyyy", { locale: es }),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-indigo-600" />
            Reporte visual mensual
          </DialogTitle>
          <DialogDescription>Generá un reporte visual de ingresos y egresos del período, listo para descargar o exportar.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 py-2">
          <Label className="text-sm whitespace-nowrap">Período:</Label>
          <Select value={String(monthOffset)} onValueChange={(v) => setMonthOffset(Number(v))}>
            <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {monthOptions.map(o => (
                <SelectItem key={o.value} value={String(o.value)}>
                  {o.label.charAt(0).toUpperCase() + o.label.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <Skeleton className="h-96 rounded-xl" />
        ) : (
          <div
            ref={reportRef}
            className="rounded-xl border bg-white p-6 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">EMITIA PAY</p>
                  <p className="text-xs text-gray-500">Reporte mensual de gestión</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Período</p>
                <p className="font-semibold text-gray-900 capitalize">{monthLabel}</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase">Ingresos</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">{fmt(report.totalIngresos)}</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">{report.ingresosCount} movimientos</p>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                <div className="flex items-center gap-1.5 text-red-600 mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase">Egresos</span>
                </div>
                <p className="text-lg font-bold text-red-700">{fmt(report.totalEgresos)}</p>
                <p className="text-[10px] text-red-500 mt-0.5">{report.egresosCount} movimientos</p>
              </div>
              <div className={`rounded-lg p-3 border ${report.neto >= 0 ? "bg-indigo-50 border-indigo-100" : "bg-amber-50 border-amber-100"}`}>
                <div className={`flex items-center gap-1.5 mb-1 ${report.neto >= 0 ? "text-indigo-600" : "text-amber-600"}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium uppercase">Resultado neto</span>
                </div>
                <p className={`text-lg font-bold ${report.neto >= 0 ? "text-indigo-700" : "text-amber-700"}`}>{fmt(report.neto)}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{report.txCount} transacciones</p>
              </div>
            </div>

            {/* Chart */}
            {report.categoryData.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Distribución por categoría</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={report.categoryData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="categoria" tick={{ fontSize: 9, fill: "#6b7280" }} />
                    <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Ingresos" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Egresos" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top movements */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-emerald-700 mb-2">Top ingresos</p>
                <div className="space-y-1.5">
                  {report.topIngresos.length === 0 ? (
                    <p className="text-xs text-gray-400">Sin movimientos</p>
                  ) : report.topIngresos.map((t, i) => (
                    <div key={t.id || i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate pr-2">{t.description || t.type}</span>
                      <span className="font-semibold text-emerald-600 whitespace-nowrap">{fmt(t.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-700 mb-2">Top egresos</p>
                <div className="space-y-1.5">
                  {report.topEgresos.length === 0 ? (
                    <p className="text-xs text-gray-400">Sin movimientos</p>
                  ) : report.topEgresos.map((t, i) => (
                    <div key={t.id || i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate pr-2">{t.description || t.type}</span>
                      <span className="font-semibold text-red-600 whitespace-nowrap">{fmt(t.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-3 text-[10px] text-gray-400">
              <span>Generado el {format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</span>
              <span>EMITIA PAY · Reporte confidencial</span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-1.5" disabled={exporting || isLoading}>
            <FileSpreadsheet className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" onClick={exportPNG} className="gap-1.5" disabled={exporting || isLoading}>
            <ImageDown className="w-4 h-4" /> Imagen
          </Button>
          <Button onClick={exportPDF} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700" disabled={exporting || isLoading}>
            <FileDown className="w-4 h-4" /> {exporting ? "Generando..." : "Descargar PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
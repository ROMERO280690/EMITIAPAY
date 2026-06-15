import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Building2, TrendingUp, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinanciamientoPyme() {
  const financings = [
    {
      title: "Préstamo PyME",
      description: "Financiamiento para capital de trabajo con tasa preferencial",
      amount: "$ 5.000.000",
      rate: "TNA 42%",
      term: "36 meses",
      status: "Disponible",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Leasing de equipamiento",
      description: "Adquirí maquinaria y equipos con opción de compra",
      amount: "$ 2.500.000",
      rate: "TNA 38%",
      term: "48 meses",
      status: "Disponible",
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Descuento de cheques",
      description: "Adelantá el cobro de tus cheques de pago diferido",
      amount: "$ 1.200.000",
      rate: "TNA 35%",
      term: "Hasta 180 días",
      status: "Disponible",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const formatCurrency = (val) => `$ ${(val || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financiamiento PyME</h1>
        <p className="text-sm text-muted-foreground mt-1">Opciones de financiamiento para hacer crecer tu empresa</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Línea de crédito disponible", value: "$ 8.700.000", icon: Building2, color: "bg-blue-50 text-blue-600" },
          { label: "Tasa promedio", value: "38.3% TNA", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
          { label: "Cuotas estimadas", value: "desde $45.000", icon: FileText, color: "bg-emerald-50 text-emerald-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {financings.map((f, idx) => (
          <Card key={idx} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center flex-shrink-0`}>
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{f.title}</h3>
                      <Badge className={`${f.color} border-current/20`}>
                        <ShieldCheck className="w-3 h-3 mr-1 inline" />
                        {f.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">Monto: <strong>{f.amount}</strong></span>
                      <span className="text-xs text-muted-foreground">Tasa: <strong>{f.rate}</strong></span>
                      <span className="text-xs text-muted-foreground">Plazo: <strong>{f.term}</strong></span>
                    </div>
                  </div>
                </div>
                <Button className="gap-2 flex-shrink-0">
                  Solicitar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            ¿Necesitás asesoramiento?
          </CardTitle>
          <CardDescription>
            Nuestro equipo de asesores financieros puede ayudarte a elegir la mejor opción de financiamiento para tu empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2">
            Solicitar asesoramiento
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
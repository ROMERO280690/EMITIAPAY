import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, Mail, Phone, MessageSquare, Send, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const FAQ = [
  { q: "¿Cómo abro mi cuenta en EMITIA PAY?", a: "Registrate gratis desde la página de inicio. Solo necesitás tu CUIT y datos de tu empresa. La cuenta se activa en minutos tras verificar tu identidad." },
  { q: "¿Cuánto tarda una transferencia?", a: "Las transferencias entre cuentas EMITIA PAY son inmediatas. A otros bancos, se acreditan en el mismo día hábil si se hacen antes de las 15 hs, o al día siguiente hábil." },
  { q: "¿Mis fondos están seguros?", a: "Sí. Utilizamos encriptación de nivel bancario, autenticación de dos factores y nuestros fondos están respaldados por entidades reguladas del BCRA." },
  { q: "¿Cómo funcionan las tarjetas virtuales?", a: "Podés crear tarjetas virtuales al instante desde la sección Tarjetas. Cada tarjeta tiene su propio límite y podés congelarla o cancelarla cuando quieras." },
  { q: "¿Puedo cambiar de divisas?", a: "Sí. Desde Cambio de divisas podés comprar y vender dólares al instante a precio MEP, Blue o Cripto, sin comisiones ocultas." },
  { q: "¿Cómo pago impuestos y servicios?", a: "Desde Pago de servicios podés cargar tus facturas de luz, gas, agua, internet, impuestos AFIP y más, y pagarlas con un clic desde tu cuenta." },
  { q: "¿Qué hago si olvidé mi contraseña?", a: "Usá la opción '¿Olvidaste tu contraseña?' en la pantalla de login. Te enviaremos un enlace para restablecerla a tu email registrado." },
  { q: "¿Cómo contacto a soporte humano?", a: "Podés escribirnos desde el formulario de esta página, por email a soporte@emitia.pay o por teléfono de lunes a viernes de 9 a 18 hs." },
];

const CATEGORIES = [
  { value: "cuentas", label: "Cuentas y transferencias" },
  { value: "tarjetas", label: "Tarjetas" },
  { value: "pagos", label: "Pagos y cobros" },
  { value: "cambio", label: "Cambio de divisas" },
  { value: "seguridad", label: "Seguridad" },
  { value: "facturacion", label: "Facturación y planes" },
  { value: "otros", label: "Otros" },
];

export default function Soporte() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ subject: "", category: "", message: "" });

  const submitTicket = useMutation({
    mutationFn: async (data) => {
      // Crear notificación interna del ticket
      await base44.entities.Notification.create({
        title: "Ticket de soporte enviado",
        message: `Tu consulta sobre "${data.category}" fue recibida. Te responderemos a la brevedad.`,
        type: "system",
        read: false,
      });
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Tu consulta fue enviada. Te responderemos a la brevedad.");
      setForm({ subject: "", category: "", message: "" });
    },
    onError: () => toast.error("No se pudo enviar la consulta. Intentá de nuevo."),
  });

  const handleSubmit = () => {
    if (!form.subject.trim()) return toast.error("Ingresá un asunto");
    if (!form.category) return toast.error("Seleccioná una categoría");
    if (!form.message.trim()) return toast.error("Escribí tu consulta");
    submitTicket.mutate(form);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-primary" />
          Centro de ayuda y soporte
        </h1>
        <p className="text-sm text-muted-foreground">Estamos para ayudarte. Resolvé tus dudas o contactanos.</p>
      </div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Mail, title: "Email", desc: "soporte@emitia.pay", detail: "Respondemos en menos de 4 hs", color: "bg-indigo-50 text-indigo-600" },
          { icon: Phone, title: "Teléfono", desc: "0800-555-3648", detail: "Lun a Vie de 9 a 18 hs", color: "bg-emerald-50 text-emerald-600" },
          { icon: MessageSquare, title: "Chat en vivo", desc: "Próximamente", detail: "Atención inmediata por WhatsApp", color: "bg-violet-50 text-violet-600" },
        ].map((ch) => (
          <Card key={ch.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ch.color}`}>
                <ch.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-foreground">{ch.title}</p>
              <p className="text-sm text-primary font-medium mt-0.5">{ch.desc}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {ch.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Enviar consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Asunto</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Resumí tu consulta" />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Elegí una categoría" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Mensaje</Label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Contanos en qué podemos ayudarte..." rows={5} />
          </div>
          <Button onClick={handleSubmit} disabled={submitTicket.isPending} className="gap-2">
            {submitTicket.isPending ? <><Clock className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar consulta</>}
          </Button>
          {submitTicket.isPending && <p className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tu consulta quedará registrada en tu centro de notificaciones.</p>}
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Preguntas frecuentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
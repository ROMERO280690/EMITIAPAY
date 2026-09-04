import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, ArrowDownLeft, CheckCircle2, Copy,
  TrendingUp, Clock, Send, Download, FileCheck, Globe2, Building2,
  Calendar, AlertCircle, Plus, QrCode, Mail, Bell
} from "lucide-react";

/* Mocks visuales realistas por producto, siguiendo el lenguaje Malla 3D.
   Cada uno recibe `accent` (hex) y `href` para mantener consistencia. */

function Chrome({ accent, label, icon: Icon, children }) {
  return (
    <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-2xl bg-white"
      style={{ boxShadow: `0 30px 60px -20px ${accent}44` }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">● Activo</span>
      </div>
      {children}
    </div>
  );
}

function CuentasMock({ accent }) {
  return (
    <Chrome accent={accent} label="Cuenta CBU" icon={Globe2}>
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 border border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 mb-0.5">Cuenta ARS</p>
            <p className="font-extrabold text-gray-900 text-base">$ 2.458.320</p>
            <p className="text-[10px] font-semibold" style={{ color: accent }}>↑ 38.64% TNA</p>
          </div>
          <div className="rounded-xl p-3 border border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 mb-0.5">Cuenta USD</p>
            <p className="font-extrabold text-gray-900 text-base">US$ 15.200</p>
            <p className="text-[10px] text-blue-600 font-semibold">Disponible</p>
          </div>
        </div>
        <div className="rounded-xl p-3 border border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] text-gray-400">CBU</p>
            <button className="text-[10px] font-medium flex items-center gap-1" style={{ color: accent }}>
              <Copy className="w-3 h-3" /> Copiar
            </button>
          </div>
          <p className="font-mono text-[11px] text-gray-700 tracking-tight">0290 0142 3100 0045 8721 3</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Alias: <span className="text-gray-600">emitia.maria.perez</span></p>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: accent }}>
            Transferir
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-gray-700 text-xs font-bold border border-gray-200 bg-white">
            Ver movimientos
          </button>
        </div>
      </div>
    </Chrome>
  );
}

function PagosMock({ accent }) {
  const items = [
    { name: "Proveedor Norte S.A.", date: "Hoy 14:00", amount: "$ 45.000", status: "Programado", color: "bg-amber-50 text-amber-600" },
    { name: "Sueldos (12 personas)", date: "Vto. 30/09", amount: "$ 1.240.000", status: "Recurrente", color: "bg-blue-50 text-blue-600" },
    { name: "AFIP — IVA", date: "Vto. 15/09", amount: "$ 320.500", status: "Pendiente", color: "bg-gray-100 text-gray-500" },
  ];
  return (
    <Chrome accent={accent} label="Pagos inteligentes" icon={Send}>
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold text-gray-700">Próximos pagos</p>
          <span className="text-[10px] text-gray-400">3 programados</span>
        </div>
        {items.map((it) => (
          <div key={it.name} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}15` }}>
              <ArrowUpRight className="w-4 h-4" style={{ color: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-gray-800 truncate">{it.name}</p>
              <p className="text-[10px] text-gray-400">{it.date}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] font-bold text-gray-900">{it.amount}</p>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${it.color}`}>{it.status}</span>
            </div>
          </div>
        ))}
        <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-xs font-bold mt-1" style={{ backgroundColor: accent }}>
          <Plus className="w-3.5 h-3.5" /> Programar pago
        </button>
      </div>
    </Chrome>
  );
}

function CobrosMock({ accent }) {
  return (
    <Chrome accent={accent} label="Cobros inteligentes" icon={Download}>
      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[11px] font-bold text-gray-900">Factura #FC-1092</p>
              <p className="text-[10px] text-gray-400">Cliente · Diseño & Co.</p>
            </div>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Visto</span>
          </div>
          <div className="flex items-end justify-between mb-3">
            <span className="text-[10px] text-gray-400">Total</span>
            <span className="text-lg font-extrabold text-gray-900">$ 120.000</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg p-2 border border-dashed" style={{ borderColor: `${accent}55`, backgroundColor: `${accent}0a` }}>
            <QrCode className="w-4 h-4" style={{ color: accent }} />
            <span className="text-[10px] font-mono text-gray-600 truncate flex-1">emitia.pay/cobro/FC-1092</span>
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { icon: Mail, text: "Recordatorio enviado · hace 2h", color: "text-gray-400" },
            { icon: Bell, text: "Cliente abrió la factura · hace 40min", color: "text-amber-500" },
            { icon: CheckCircle2, text: "Pago recibido · $ 120.000", color: "text-emerald-500" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <span className="text-[10px] text-gray-500">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function EcheqsMock({ accent }) {
  return (
    <Chrome accent={accent} label="eCheqs" icon={FileCheck}>
      <div className="p-5 space-y-3">
        <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
          <div className="absolute right-3 top-3 opacity-20"><FileCheck className="w-10 h-10" /></div>
          <p className="text-[10px] opacity-80 mb-1">eCheq · N° 00012458</p>
          <p className="text-xl font-extrabold mb-3">$ 1.200.000</p>
          <div className="text-[10px] space-y-0.5 opacity-90">
            <p>Beneficiario: Constructora LM S.A.</p>
            <p>Vencimiento: 15/10/2026</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div>
            <p className="text-[10px] text-gray-400">Estado</p>
            <p className="text-[11px] font-bold text-amber-600">Pendiente de depósito</p>
          </div>
          <AlertCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: accent }}>
            Depositar
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-gray-700 text-xs font-bold border border-gray-200 bg-white">
            Endosar
          </button>
        </div>
      </div>
    </Chrome>
  );
}

function InversionesMock({ accent }) {
  const bars = [40, 65, 50, 78, 60, 88, 72];
  return (
    <Chrome accent={accent} label="Inversiones" icon={TrendingUp}>
      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-gray-400">Rendimiento total</p>
            <span className="text-[10px] font-semibold text-emerald-600">+ $ 184.320</span>
          </div>
          <p className="text-lg font-extrabold text-gray-900">$ 1.820.000</p>
          <div className="flex items-end gap-1 h-10 mt-2">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: accent, opacity: 0.4 + (i / bars.length) * 0.6 }} />
            ))}
          </div>
        </div>
        {[
          { name: "Plazo fijo 30 días", rate: "38.64% TNA", amount: "$ 1.000.000" },
          { name: "FCI Money Market", rate: "Variable", amount: "$ 820.000" },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-white">
            <div>
              <p className="text-[11px] font-medium text-gray-800">{p.name}</p>
              <p className="text-[10px] font-semibold" style={{ color: accent }}>{p.rate}</p>
            </div>
            <span className="text-[11px] font-bold text-gray-900">{p.amount}</span>
          </div>
        ))}
        <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: accent }}>
          <Plus className="w-3.5 h-3.5" /> Nueva inversión
        </button>
      </div>
    </Chrome>
  );
}

function FinanciamientoMock({ accent }) {
  return (
    <Chrome accent={accent} label="Financiamiento PyME" icon={Building2}>
      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-gray-900">Préstamo PyME</p>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Pre-aprobado</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[9px] text-gray-400">Monto</p>
              <p className="text-[11px] font-bold text-gray-900">$ 2.5M</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400">Plazo</p>
              <p className="text-[11px] font-bold text-gray-900">24 meses</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400">Cuota</p>
              <p className="text-[11px] font-bold text-gray-900">$ 142.500</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { icon: CheckCircle2, text: "Solicitud enviada", time: "hace 1h", done: true },
            { icon: CheckCircle2, text: "Análisis crediticio", time: "hace 30min", done: true },
            { icon: Clock, text: "Firma digital pendiente", time: "En proceso", done: false },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-emerald-50" : "bg-gray-100"}`}>
                <s.icon className={`w-3.5 h-3.5 ${s.done ? "text-emerald-600" : "text-gray-400"}`} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-gray-700">{s.text}</p>
                <p className="text-[9px] text-gray-400">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: accent }}>
          Firmar y desembolsar <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Chrome>
  );
}

const MOCKS = {
  cuentas: CuentasMock,
  pagos: PagosMock,
  cobros: CobrosMock,
  echeqs: EcheqsMock,
  inversiones: InversionesMock,
  financiamiento: FinanciamientoMock,
};

export default function ProductMock({ product }) {
  const Mock = MOCKS[product.key] || CuentasMock;
  return (
    <div style={{ perspective: "1200px" }}>
      <div className="lg:hidden mb-4">
        <Mock accent={product.accent} />
      </div>
      <div className="hidden lg:block">
        <div className="rounded-3xl" style={{ transform: "rotateY(-6deg) rotateX(4deg)" }}>
          <Mock accent={product.accent} />
        </div>
      </div>
    </div>
  );
}
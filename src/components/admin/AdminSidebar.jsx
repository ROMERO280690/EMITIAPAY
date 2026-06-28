import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, TrendingUp, Building2, Receipt,
  Shield, Settings, LogOut, ChevronLeft, ChevronRight,
  Menu, X, Landmark, AlertTriangle, BarChart3, FileText,
  CreditCard, ArrowLeftRight, PiggyBank, Wallet, Bell
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { section: null, items: [
    { label: "Panel principal", icon: LayoutDashboard, path: "/admin" },
    { label: "Alertas", icon: Bell, path: "/admin/alertas", badge: 3 },
  ]},
  { section: "CLIENTES", items: [
    { label: "Empresas PyME", icon: Building2, path: "/admin/empresas" },
    { label: "Usuarios", icon: Users, path: "/admin/usuarios" },
    { label: "Solicitudes KYC", icon: Shield, path: "/admin/kyc" },
  ]},
  { section: "OPERACIONES", items: [
    { label: "Cuentas bancarias", icon: Wallet, path: "/admin/cuentas" },
    { label: "Transacciones", icon: ArrowLeftRight, path: "/admin/transacciones" },
    { label: "eCheqs", icon: Receipt, path: "/admin/echeqs" },
    { label: "Transferencias", icon: CreditCard, path: "/admin/transferencias" },
  ]},
  { section: "FINANZAS", items: [
    { label: "Inversiones", icon: Landmark, path: "/admin/inversiones" },
    { label: "Financiamientos", icon: PiggyBank, path: "/admin/financiamientos" },
    { label: "Liquidez & Reservas", icon: TrendingUp, path: "/admin/liquidez" },
  ]},
  { section: "REPORTES", items: [
    { label: "Resúmenes", icon: BarChart3, path: "/admin/reportes" },
    { label: "Auditoría", icon: FileText, path: "/admin/auditoria" },
    { label: "Riesgo & Alertas", icon: AlertTriangle, path: "/admin/riesgo" },
  ]},
];

export default function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => base44.auth.logout("/inicio");

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link to={item.path} onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}>
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {!collapsed && (
          <span className="flex items-center gap-2 flex-1 min-w-0">
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <Badge className="ml-auto bg-red-500 text-white text-[10px] h-4 px-1.5 flex-shrink-0">{item.badge}</Badge>
            )}
          </span>
        )}
      </Link>
    );
  };

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-white">EMITIA PAY</p>
              <p className="text-[10px] text-indigo-300 font-medium">ADMIN PANEL</p>
            </div>
          )}
        </div>
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-white/10 text-slate-400">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ section, items }, gi) => (
          <div key={gi}>
            {section && !collapsed && (
              <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{section}</p>
            )}
            {section && collapsed && <div className="pt-3" />}
            {items.map((item) => <NavLink key={item.path} item={item} />)}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-1">
        <Link to="/admin/configuracion"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            location.pathname === "/admin/configuracion" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}>
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Configuración</span>}
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Salir</span>}
        </button>
        {!collapsed && (
          <div className="px-3 py-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AD</div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">Administrador</p>
                <p className="text-[10px] text-slate-400 truncate">admin@emitia.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-900 rounded-lg shadow-md flex items-center justify-center border border-white/10">
        <Menu className="w-5 h-5 text-white" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10">
          <X className="w-4 h-4 text-white" />
        </button>
        <NavContent />
      </aside>

      <aside className={`hidden lg:block fixed inset-y-0 left-0 z-30 bg-slate-900 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
        <NavContent />
      </aside>

      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`} />
    </>
  );
}
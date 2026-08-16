import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ArrowRightLeft,
  Send,
  Download,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Menu,
  X,
  FileText,
  Zap,
  Mail,
  Calendar,
  Landmark,
  Building2,
  PiggyBank,
  Receipt,
  ListChecks,
  CreditCard,
  DollarSign,
  QrCode,
  Target,
  Bell,
  LifeBuoy
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const mainItems = [
  { label: "Inicio", icon: LayoutDashboard, path: "/dashboard" },
];

const operacionesItems = [
  { label: "Cuentas", icon: Wallet, path: "/cuentas" },
  { label: "Movimientos", icon: ArrowLeftRight, path: "/movimientos" },
  { label: "Recibir dinero", icon: Building2, path: "/recibir-dinero" },
  { label: "Transferencias", icon: ArrowRightLeft, path: "/transferencias" },
  { label: "Tarjetas", icon: CreditCard, path: "/tarjetas" },
  { label: "eCheqs", icon: Receipt, path: "/echeqs" },
];

const inteligenciaItems = [
  { label: "Pagos inteligentes", icon: Zap, path: "/pagos-inteligentes" },
  { label: "Cobros inteligentes", icon: Users, path: "/cobros-inteligentes" },
  { label: "Cobro con QR", icon: QrCode, path: "/cobro-qr" },
  { label: "Pago de servicios", icon: Receipt, path: "/pago-servicios" },
  { label: "Calendario", icon: Calendar, path: "/calendario" },
];

const finanzasItems = [
  { label: "Cambio de divisas", icon: DollarSign, path: "/cambio-divisas" },
  { label: "Inversiones", icon: Landmark, path: "/inversiones" },
  { label: "Metas de ahorro", icon: Target, path: "/metas" },
  { label: "Financiamiento PyME", icon: PiggyBank, path: "/financiamiento" },
];

const secondaryItems = [
  { label: "Solicitudes", icon: Mail, path: "/solicitudes" },
  { label: "Contactos", icon: Users, path: "/contactos" },
  { label: "Resúmenes", icon: FileText, path: "/resumenes" },
  { label: "Notificaciones", icon: Bell, path: "/notificaciones" },
];

const bottomItems = [
  { label: "Soporte", icon: LifeBuoy, path: "/soporte" },
  { label: "Configuración", icon: Settings, path: "/configuracion" },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["allRequests"],
    queryFn: async () => {
      const [payments, collections, echeqs, financings] = await Promise.all([
        base44.entities.PaymentRequest.list("-created_date", 30),
        base44.entities.CollectionRequest.list("-created_date", 30),
        base44.entities.ECheq.list("-created_date", 30),
        base44.entities.FinancingRequest.list("-created_date", 30),
      ]);
      return [...payments, ...collections, ...echeqs, ...financings];
    },
  });

  const pendingCount = requests.filter((r) =>
    r.status === "pending" || r.status === "sent" || r.status === "draft" || r.status === "scheduled"
  ).length;

  const userName = user?.full_name || "Usuario";
  const userEmail = user?.email || "";
  const companyName = user?.company_name || "Mi Empresa";
  const userInitials = userName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = () => {
    base44.auth.logout();
  };

  const SectionHeader = ({ label }) => (
    !collapsed ? (
      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    ) : <div className="pt-2" />
  );

  const NavLink = ({ item, badge }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
        {!collapsed && (
          <span className="flex items-center gap-2 flex-1">
            {item.label}
            {badge && (
              <Badge className="bg-primary/20 text-primary-foreground ml-auto text-[10px] h-4 px-1.5">
                {badge}
              </Badge>
            )}
          </span>
        )}
      </Link>
    );
  };

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-[18px] h-[18px] text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground">
              EMITIA PAY
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-accent transition-colors text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-2 space-y-0.5">
        {mainItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}

        <NavLink
          key="solicitudes"
          item={{ label: "Solicitudes", icon: Mail, path: "/solicitudes" }}
          badge={pendingCount > 0 ? pendingCount : null}
        />

        <SectionHeader label="Operaciones" />
        {operacionesItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}

        <SectionHeader label="Inteligencia" />
        {inteligenciaItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}

        <SectionHeader label="Finanzas" />
        {finanzasItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}

        <div className="border-t border-border mt-3 pt-1" />
        {secondaryItems.filter((s) => s.path !== "/solicitudes").map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </nav>

      {/* Bottom: User info + settings */}
      <div className="px-2 pb-4 space-y-1 border-t border-border mt-2 pt-3">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        {!collapsed && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                {userInitials || "?"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{companyName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 w-full"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card rounded-lg shadow-md flex items-center justify-center border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent"
        >
          <X className="w-4 h-4" />
        </button>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 bg-card border-r border-border transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        <NavContent />
      </aside>

      {/* Spacer */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`} />
    </>
  );
}
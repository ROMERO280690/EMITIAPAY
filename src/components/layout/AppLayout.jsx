import React from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Send, Plus, Zap, Users } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Header bar */}
      <div className="hidden lg:flex fixed top-0 right-0 left-[240px] z-20 h-14 bg-background border-b border-border items-center justify-end px-6 gap-2">
        <Link to="/transferencias">
          <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
            <Send className="w-3.5 h-3.5" />
            Enviar
          </Button>
        </Link>
        <Link to="/recibir-dinero">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Recibir
          </Button>
        </Link>
        <Link to="/pagos-inteligentes">
          <Button size="sm" variant="outline" className="gap-1.5 text-violet-600 border-violet-200 hover:bg-violet-50">
            <Zap className="w-3.5 h-3.5" />
            Pagos inteligentes
          </Button>
        </Link>
        <Link to="/cobros-inteligentes">
          <Button size="sm" variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
            <Users className="w-3.5 h-3.5" />
            Cobros inteligentes
          </Button>
        </Link>
      </div>

      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-20 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
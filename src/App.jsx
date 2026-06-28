import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Public pages
import Landing from '@/pages/Landing';
import ServiciosPage from '@/pages/ServiciosPage';
import PreciosPage from '@/pages/PreciosPage';
import ServicioCuentas from '@/pages/servicio/ServicioCuentas';
import ServicioPagos from '@/pages/servicio/ServicioPagos';
import ServicioCobros from '@/pages/servicio/ServicioCobros';
import ServicioECheqs from '@/pages/servicio/ServicioECheqs';
import ServicioInversiones from '@/pages/servicio/ServicioInversiones';
import ServicioFinanciamiento from '@/pages/servicio/ServicioFinanciamiento';

// Admin pages
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminEmpresas from '@/pages/admin/AdminEmpresas';
import AdminTransacciones from '@/pages/admin/AdminTransacciones';
import AdminFinanciamientos from '@/pages/admin/AdminFinanciamientos';
import AdminInversiones from '@/pages/admin/AdminInversiones';
import AdminKYC from '@/pages/admin/AdminKYC';
import AdminReportes from '@/pages/admin/AdminReportes';
import AdminCuentas from '@/pages/admin/AdminCuentas';

// App pages
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Accounts from '@/pages/Accounts';
import Transfers from '@/pages/Transfers';
import Transactions from '@/pages/Transactions';
import Payments from '@/pages/Payments';
import Collections from '@/pages/Collections';
import Contacts from '@/pages/Contacts';
import Settings from '@/pages/Settings';
import RecibirDinero from '@/pages/RecibirDinero';
import ECheqs from '@/pages/ECheqs';
import Calendario from '@/pages/Calendario';
import Inversiones from '@/pages/Inversiones';
import Resumenes from '@/pages/Resumenes';
import PagosInteligentes from '@/pages/PagosInteligentes';
import CobrosInteligentes from '@/pages/CobrosInteligentes';
import Solicitudes from '@/pages/Solicitudes';
import FinanciamientoPyme from '@/pages/FinanciamientoPyme';


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public marketing pages */}
      <Route path="/inicio" element={<Landing />} />
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/servicios" element={<ServiciosPage />} />
      <Route path="/precios" element={<PreciosPage />} />
      <Route path="/servicio/cuentas" element={<ServicioCuentas />} />
      <Route path="/servicio/pagos" element={<ServicioPagos />} />
      <Route path="/servicio/cobros" element={<ServicioCobros />} />
      <Route path="/servicio/echeqs" element={<ServicioECheqs />} />
      <Route path="/servicio/inversiones" element={<ServicioInversiones />} />
      <Route path="/servicio/financiamiento" element={<ServicioFinanciamiento />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/inicio" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/empresas" element={<AdminEmpresas />} />
          <Route path="/admin/cuentas" element={<AdminCuentas />} />
          <Route path="/admin/transacciones" element={<AdminTransacciones />} />
          <Route path="/admin/financiamientos" element={<AdminFinanciamientos />} />
          <Route path="/admin/inversiones" element={<AdminInversiones />} />
          <Route path="/admin/kyc" element={<AdminKYC />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/inicio" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cuentas" element={<Accounts />} />
          <Route path="/transferencias" element={<Transfers />} />
          <Route path="/movimientos" element={<Transactions />} />
          <Route path="/pagos" element={<Payments />} />
          <Route path="/cobros" element={<Collections />} />
          <Route path="/contactos" element={<Contacts />} />
          <Route path="/configuracion" element={<Settings />} />
          <Route path="/recibir-dinero" element={<RecibirDinero />} />
          <Route path="/echeqs" element={<ECheqs />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/inversiones" element={<Inversiones />} />
          <Route path="/resumenes" element={<Resumenes />} />
          <Route path="/pagos-inteligentes" element={<PagosInteligentes />} />
          <Route path="/cobros-inteligentes" element={<CobrosInteligentes />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/financiamiento" element={<FinanciamientoPyme />} />
        </Route>
      </Route>
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
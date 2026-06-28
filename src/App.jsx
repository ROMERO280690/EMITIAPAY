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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
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
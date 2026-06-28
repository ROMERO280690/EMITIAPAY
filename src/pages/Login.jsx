import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Email o contraseña incorrectos. Verificá tus datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/dashboard");
  };

  return (
    <div className="min-h-screen flex font-body">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">EMITIA PAY</span>
        </div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Bienvenido de vuelta a tu plataforma financiera
            </h2>
            <p className="text-indigo-200 text-lg mb-10">Gestioná las finanzas de tu PyME desde un solo lugar.</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "PyMEs activas", value: "+5.000" },
                { label: "Uptime", value: "99.9%" },
                { label: "Procesado/mes", value: "$ 2B+" },
                { label: "Costo apertura", value: "$ 0" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-indigo-300 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <p className="text-indigo-300 text-sm">¿No tenés cuenta aún?{" "}
            <Link to="/register" className="text-white font-semibold hover:underline">Creá una gratis</Link>
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gray-50 px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">EMITIA PAY</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciá sesión</h1>
          <p className="text-gray-500 text-sm mb-8">Ingresá a tu cuenta de EMITIA PAY</p>

          <Button variant="outline" className="w-full h-12 text-sm font-medium mb-5 border-gray-200 hover:bg-gray-100" onClick={handleGoogle}>
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continuar con Google
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-3 text-gray-400">o</span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-indigo-400 focus:ring-indigo-400/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-indigo-400"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Ingresando...</>
              ) : (
                <><span>Ingresar</span><ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Creá una gratis</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
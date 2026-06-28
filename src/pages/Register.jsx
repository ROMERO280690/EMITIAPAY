import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { TrendingUp, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2, Building2 } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { motion } from "framer-motion";
import { toast } from "sonner";

const PERKS = [
  "Cuenta en pesos y dólares sin costo",
  "Pagos y cobros automáticos",
  "eCheqs 100% digitales",
  "Inversiones y rendimientos",
  "Financiamiento para tu PyME",
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Error al registrarse. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Código incorrecto. Verificá e intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast.success("Código reenviado. Revisá tu email.");
    } catch (err) {
      setError(err.message || "Error al reenviar el código.");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/dashboard");
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex font-body">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex-col justify-center items-center p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative text-center">
            <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Verificá tu email</h2>
            <p className="text-indigo-200">Enviamos un código de 6 dígitos a <br /><span className="text-white font-medium">{email}</span></p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gray-50 px-6 py-12">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">EMITIA PAY</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verificá tu email</h1>
            <p className="text-gray-500 text-sm mb-8">Ingresá el código de 6 dígitos que te enviamos a <span className="font-medium text-gray-700">{email}</span></p>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-12 text-lg border-gray-200" />
                  <InputOTPSlot index={1} className="h-14 w-12 text-lg border-gray-200" />
                  <InputOTPSlot index={2} className="h-14 w-12 text-lg border-gray-200" />
                  <InputOTPSlot index={3} className="h-14 w-12 text-lg border-gray-200" />
                  <InputOTPSlot index={4} className="h-14 w-12 text-lg border-gray-200" />
                  <InputOTPSlot index={5} className="h-14 w-12 text-lg border-gray-200" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button className="w-full h-12 font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-xl" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verificando...</> : <><span>Verificar y entrar</span><ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-5">
              ¿No recibiste el código?{" "}
              <button onClick={handleResend} className="text-indigo-600 font-semibold hover:underline">Reenviar</button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-body">
      {/* Left panel */}
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
            <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Todo lo que tu empresa necesita, en un solo lugar
            </h2>
            <div className="space-y-3 mt-6">
              {PERKS.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-indigo-200 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <p className="text-indigo-300 text-sm">¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-white font-semibold hover:underline">Iniciá sesión</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gray-50 px-6 py-12">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">EMITIA PAY</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Creá tu cuenta gratis</h1>
          <p className="text-gray-500 text-sm mb-8">Empezá a gestionar las finanzas de tu empresa hoy</p>

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
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email empresarial</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email" type="email" autoComplete="email" autoFocus
                  placeholder="tu@empresa.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-indigo-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password" type={showPass ? "text" : "password"} autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-indigo-400"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirm" type="password" autoComplete="new-password"
                  placeholder="Repetí tu contraseña" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-indigo-400"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando cuenta...</>
              ) : (
                <><span>Crear cuenta gratis</span><ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Al registrarte aceptás los{" "}
              <span className="text-indigo-600 hover:underline cursor-pointer">Términos de servicio</span>{" "}
              y la{" "}
              <span className="text-indigo-600 hover:underline cursor-pointer">Política de privacidad</span>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Iniciá sesión</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
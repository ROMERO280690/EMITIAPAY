import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Banknote, Building2, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function BankConnections() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [error, setError] = useState(null);

  const fetchBanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('prometeoConnect', {});
      if (response.data.success) {
        setBanks(response.data.banks);
        toast.success('Bancos cargados exitosamente');
      }
    } catch (err) {
      setError('Error al cargar bancos: ' + err.message);
      toast.error('Error al conectar con Prometeo');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = (bankId) => {
    toast.info(`Conectando con ${bankId}... (Flujo OAuth de Prometeo)`);
    // Aquí iría el flujo OAuth de Prometeo para conectar la cuenta
    // Por ahora mostramos un mensaje informativo
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Conexión Bancaria</h1>
          <p className="text-muted-foreground">
            Conectá tus cuentas bancarias para ver saldos y transacciones en tiempo real
          </p>
        </div>
        <Button onClick={fetchBanks} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Cargando...' : 'Cargar Bancos'}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {banks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin bancos cargados</h3>
              <p className="text-muted-foreground mb-4">
                Hacé clic en "Cargar Bancos" para ver los bancos disponibles
              </p>
            </CardContent>
          </Card>
        ) : (
          banks.map((bank) => (
            <Card key={bank.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {bank.logo_url ? (
                      <img src={bank.logo_url} alt={bank.name} className="h-10 w-10 object-contain" />
                    ) : (
                      <Building2 className="h-10 w-10 text-primary" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{bank.name}</CardTitle>
                      <CardDescription>{bank.country}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={bank.available ? "default" : "secondary"}>
                    {bank.available ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleConnectBank(bank.id)}
                  disabled={!bank.available}
                >
                  <Banknote className="mr-2 h-4 w-4" />
                  Conectar Cuenta
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {connectedAccounts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cuentas Conectadas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedAccounts.map((account) => (
              <Card key={account.id} className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{account.bank_name}</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <CardDescription>{account.account_number}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo</p>
                      <p className="text-2xl font-bold">${account.balance}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
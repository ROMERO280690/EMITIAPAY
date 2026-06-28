import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Building2, CheckCircle2, Loader2, AlertCircle, X, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function BankConnections() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [accountData, setAccountData] = useState({ cbu: '', alias: '' });
  const queryClient = useQueryClient();

  const { data: connectedAccounts = [], isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['connectedBanks'],
    queryFn: async () => {
      const accounts = await base44.entities.ConnectedBank.list('-last_sync');
      return accounts;
    },
  });

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
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const connectMutation = useMutation({
    mutationFn: async (data) => {
      const account = await base44.entities.ConnectedBank.create({
        bank_id: selectedBank.id,
        bank_name: selectedBank.name,
        cbu: data.cbu,
        alias: data.alias,
        account_number: data.cbu.slice(-4).padStart(data.cbu.length, '•'),
        currency: 'ARS',
        balance: 0,
        status: 'connected',
        last_sync: new Date().toISOString(),
      });
      return account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['connectedBanks']);
      setConnectDialogOpen(false);
      setAccountData({ cbu: '', alias: '' });
      toast.success('Cuenta conectada exitosamente');
    },
    onError: (err) => {
      toast.error('Error al conectar cuenta: ' + err.message);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (accountId) => {
      await base44.entities.ConnectedBank.update(accountId, { status: 'disconnected' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['connectedBanks']);
      toast.success('Cuenta desconectada');
    },
    onError: (err) => {
      toast.error('Error al desconectar: ' + err.message);
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (account) => {
      // Simular sincronización - en producción llamaría a la API de Prometeo
      await new Promise(resolve => setTimeout(resolve, 1500));
      const randomBalance = Math.floor(Math.random() * 1000000) / 100;
      await base44.entities.ConnectedBank.update(account.id, {
        balance: randomBalance,
        last_sync: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['connectedBanks']);
      toast.success('Saldo actualizado');
    },
    onError: (err) => {
      toast.error('Error al sincronizar: ' + err.message);
    },
  });

  const handleConnectBank = (bank) => {
    setSelectedBank(bank);
    setConnectDialogOpen(true);
  };

  const handleConnectSubmit = () => {
    if (!accountData.cbu || !accountData.alias) {
      toast.error('Completá CBU y Alias');
      return;
    }
    connectMutation.mutate(accountData);
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
        <Button onClick={fetchBanks} disabled={loading || banks.length > 0}>
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

      {/* Bancos Disponibles */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Bancos Disponibles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank) => (
            <Card key={bank.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{bank.name}</CardTitle>
                      <CardDescription>Argentina</CardDescription>
                    </div>
                  </div>
                  <Badge variant="default">Disponible</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleConnectBank(bank)}
                >
                  <Banknote className="mr-2 h-4 w-4" />
                  Conectar Cuenta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cuentas Conectadas */}
      {connectedAccounts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cuentas Conectadas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedAccounts.filter(acc => acc.status === 'connected').map((account) => (
              <Card key={account.id} className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-green-600" />
                      <div>
                        <CardTitle className="text-base">{account.bank_name}</CardTitle>
                        <CardDescription className="text-xs">{account.account_number}</CardDescription>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      ${account.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => syncMutation.mutate(account)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Actualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectMutation.mutate(account.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Última sync: {account.last_sync ? new Date(account.last_sync).toLocaleString('es-AR') : 'Nunca'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de Conexión */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Conectar Cuenta de {selectedBank?.name}</DialogTitle>
            <DialogDescription>
              Ingresá los datos de tu cuenta para sincronizarla con EMITIA PAY
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cbu">CBU</Label>
              <Input
                id="cbu"
                placeholder="22 caracteres"
                value={accountData.cbu}
                onChange={(e) => setAccountData({ ...accountData, cbu: e.target.value })}
                maxLength={22}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alias">Alias</Label>
              <Input
                id="alias"
                placeholder="Alias de la cuenta"
                value={accountData.alias}
                onChange={(e) => setAccountData({ ...accountData, alias: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConnectSubmit} disabled={connectMutation.isPending}>
              {connectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Conectar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
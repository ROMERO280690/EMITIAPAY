import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Lista de bancos argentinos soportados por EMITIA PAY
    const bancosArgentina = [
      { id: 'brubank', name: 'Brubank', country: 'AR', available: true, logo_url: null },
      { id: 'galicia', name: 'Banco Galicia', country: 'AR', available: true, logo_url: null },
      { id: 'santander', name: 'Santander Río', country: 'AR', available: true, logo_url: null },
      { id: 'bbva', name: 'BBVA Argentina', country: 'AR', available: true, logo_url: null },
      { id: 'macro', name: 'Banco Macro', country: 'AR', available: true, logo_url: null },
      { id: 'supervielle', name: 'Banco Supervielle', country: 'AR', available: true, logo_url: null },
      { id: 'piano', name: 'Banco Piano', country: 'AR', available: true, logo_url: null },
      { id: 'icbc', name: 'ICBC Argentina', country: 'AR', available: true, logo_url: null },
      { id: 'hsbc', name: 'HSBC Argentina', country: 'AR', available: true, logo_url: null },
      { id: 'nacion', name: 'Banco Nación', country: 'AR', available: true, logo_url: null },
    ];

    return Response.json({ 
      success: true,
      banks: bancosArgentina,
      message: 'Bancos disponibles para conexión'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
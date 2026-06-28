import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { account_id } = await req.json();

    if (!account_id) {
      return Response.json({ error: 'account_id required' }, { status: 400 });
    }

    const API_KEY = Deno.env.get("PROMETEO_API_KEY");
    const API_SECRET = Deno.env.get("PROMETEO_API_SECRET");

    if (!API_KEY || !API_SECRET) {
      return Response.json({ error: 'Prometeo credentials not configured' }, { status: 500 });
    }

    // Get account balance from Prometeo
    const balanceResponse = await fetch(`https://api.prometeoapi.com/v1/accounts/${account_id}/balance`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!balanceResponse.ok) {
      throw new Error(`Prometeo API error: ${balanceResponse.status}`);
    }

    const balance = await balanceResponse.json();

    return Response.json({ 
      success: true,
      balance: balance.data,
      message: 'Saldo obtenido exitosamente'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
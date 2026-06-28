import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const API_KEY = Deno.env.get("PROMETEO_API_KEY");
    const API_SECRET = Deno.env.get("PROMETEO_API_SECRET");

    if (!API_KEY || !API_SECRET) {
      return Response.json({ error: 'Prometeo credentials not configured' }, { status: 500 });
    }

    // Get list of banks available in Argentina
    const banksResponse = await fetch('https://api.prometeoapi.com/v1/banks?country=AR', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!banksResponse.ok) {
      throw new Error(`Prometeo API error: ${banksResponse.status}`);
    }

    const banks = await banksResponse.json();

    return Response.json({ 
      success: true,
      banks: banks.data || [],
      message: 'Bancos disponibles en Argentina'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
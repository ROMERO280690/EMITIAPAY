import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { account_id, from_date, to_date } = await req.json();

    if (!account_id) {
      return Response.json({ error: 'account_id required' }, { status: 400 });
    }

    const API_KEY = Deno.env.get("PROMETEO_API_KEY");
    const API_SECRET = Deno.env.get("PROMETEO_API_SECRET");

    if (!API_KEY || !API_SECRET) {
      return Response.json({ error: 'Prometeo credentials not configured' }, { status: 500 });
    }

    // Build query params
    const params = new URLSearchParams();
    if (from_date) params.append('from_date', from_date);
    if (to_date) params.append('to_date', to_date);

    // Get transactions from Prometeo
    const transactionsResponse = await fetch(`https://api.prometeoapi.com/v1/accounts/${account_id}/transactions?${params}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!transactionsResponse.ok) {
      throw new Error(`Prometeo API error: ${transactionsResponse.status}`);
    }

    const transactions = await transactionsResponse.json();

    return Response.json({ 
      success: true,
      transactions: transactions.data || [],
      message: 'Transacciones obtenidas exitosamente'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
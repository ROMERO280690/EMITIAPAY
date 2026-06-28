import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if data already exists
    const existingAccounts = await base44.entities.Account.list();
    if (existingAccounts.length > 0) {
      return Response.json({ message: 'Data already seeded', skipped: true });
    }

    // Seed Accounts
    const accounts = await base44.entities.Account.bulkCreate([
      { name: 'Cuenta Sueldos', currency: 'ARS', balance: 2500000, cbu: '0123456789012345678901', alias: 'MI.ALIAS.SUELDOS', account_type: 'corriente', status: 'active' },
      { name: 'Cuenta Inversiones', currency: 'ARS', balance: 5000000, cbu: '0123456789012345678902', alias: 'MI.ALIAS.INVERSION', account_type: 'remunerada', status: 'active' },
      { name: 'Cuenta Dólares', currency: 'USD', balance: 15000, cbu: '0123456789012345678903', alias: 'MI.ALIAS.DOLARES', account_type: 'corriente', status: 'active' },
    ]);

    // Seed Contacts
    const contacts = await base44.entities.Contact.bulkCreate([
      { name: 'Tech Solutions SRL', cuit: '30-71234567-8', email: 'contact@techsolutions.com', phone: '+54 11 4567-8901', cbu: '0123456789012345678904', alias: 'TECH.SOLUTIONS', type: 'provider', category: 'Tecnología' },
      { name: 'Estudio Contable Gómez', cuit: '30-65432109-1', email: 'info@estudiogomez.com', phone: '+54 11 3456-7890', cbu: '0123456789012345678905', alias: 'ESTUDIO.GOMEZ', type: 'provider', category: 'Servicios profesionales' },
      { name: 'Distribuidora Norte', cuit: '30-98765432-2', email: 'ventas@distnorte.com', phone: '+54 11 2345-6789', cbu: '0123456789012345678906', alias: 'DIST.NORTE', type: 'provider', category: 'Logística' },
      { name: 'Cliente ABC SA', cuit: '30-11223344-3', email: 'compras@clienteabc.com', phone: '+54 11 1234-5678', cbu: '0123456789012345678907', alias: 'CLIENTE.ABC', type: 'client', category: 'Mayorista' },
      { name: 'Cliente XYZ SRL', cuit: '30-55667788-4', email: 'admin@clientexyz.com', phone: '+54 11 9876-5432', cbu: '0123456789012345678908', alias: 'CLIENTE.XYZ', type: 'client', category: 'Minorista' },
      { name: 'Juan Pérez', cuit: '20-33445566-5', email: 'juan.perez@email.com', phone: '+54 11 8765-4321', type: 'employee', category: 'Empleado' },
    ]);

    // Seed Transactions
    const transactions = await base44.entities.Transaction.bulkCreate([
      { type: 'transfer_in', amount: 1000000, currency: 'ARS', description: 'Transferencia recibida', counterpart_name: 'Cliente ABC SA', counterpart_cuit: '30-11223344-3', category: 'ventas', status: 'completed', account_id: accounts[0].id, reference: 'REF001' },
      { type: 'transfer_out', amount: 250000, currency: 'ARS', description: 'Pago a proveedor', counterpart_name: 'Tech Solutions SRL', counterpart_cuit: '30-71234567-8', category: 'proveedores', status: 'completed', account_id: accounts[0].id, reference: 'REF002' },
      { type: 'payment', amount: 150000, currency: 'ARS', description: 'Pago de servicios', counterpart_name: 'EDENOR', counterpart_cuit: '30-55667788-9', category: 'servicios', status: 'completed', account_id: accounts[0].id, reference: 'REF003' },
      { type: 'collection', amount: 500000, currency: 'ARS', description: 'Cobro de factura', counterpart_name: 'Cliente XYZ SRL', counterpart_cuit: '30-55667788-4', category: 'ventas', status: 'completed', account_id: accounts[0].id, reference: 'REF004' },
      { type: 'yield', amount: 25000, currency: 'ARS', description: 'Rendimiento plazo fijo', counterpart_name: 'Banco Nacional', category: 'rendimientos', status: 'completed', account_id: accounts[1].id, reference: 'REF005' },
      { type: 'deposit', amount: 750000, currency: 'ARS', description: 'Depósito en efectivo', category: 'otros', status: 'completed', account_id: accounts[0].id, reference: 'REF006' },
      { type: 'transfer_in', amount: 500, currency: 'USD', description: 'Transferencia USD', counterpart_name: 'Exportadora Sur', counterpart_cuit: '30-99887766-1', category: 'ventas', status: 'completed', account_id: accounts[2].id, reference: 'REF007' },
      { type: 'transfer_out', amount: 200, currency: 'USD', description: 'Pago proveedor internacional', counterpart_name: 'Import Corp', category: 'proveedores', status: 'completed', account_id: accounts[2].id, reference: 'REF008' },
    ]);

    // Seed Payment Requests
    const payments = await base44.entities.PaymentRequest.bulkCreate([
      { contact_name: 'Tech Solutions SRL', contact_cuit: '30-71234567-8', contact_cbu: '0123456789012345678904', amount: 150000, currency: 'ARS', concept: 'Pago servicios IT', category: 'proveedores', status: 'draft' },
      { contact_name: 'Estudio Contable Gómez', contact_cuit: '30-65432109-1', contact_cbu: '0123456789012345678905', amount: 85000, currency: 'ARS', concept: 'Honorarios mensuales', category: 'servicios', status: 'scheduled' },
      { contact_name: 'Distribuidora Norte', contact_cuit: '30-98765432-2', contact_cbu: '0123456789012345678906', amount: 320000, currency: 'ARS', concept: 'Compra mercadería', category: 'proveedores', scheduled_date: '2026-07-05', status: 'scheduled' },
    ]);

    // Seed Collection Requests
    const collections = await base44.entities.CollectionRequest.bulkCreate([
      { client_name: 'Cliente ABC SA', client_email: 'compras@clienteabc.com', amount: 450000, currency: 'ARS', concept: 'Factura A-0001-1234', invoice_number: 'FC-0001-1234', due_date: '2026-07-10', status: 'pending' },
      { client_name: 'Cliente XYZ SRL', client_email: 'admin@clientexyz.com', amount: 275000, currency: 'ARS', concept: 'Factura A-0001-1235', invoice_number: 'FC-0001-1235', due_date: '2026-07-15', status: 'sent' },
      { client_name: 'Mayorista del Sur', client_email: 'ventas@mayoristasur.com', amount: 680000, currency: 'ARS', concept: 'Factura A-0001-1236', invoice_number: 'FC-0001-1236', due_date: '2026-06-30', status: 'overdue' },
    ]);

    return Response.json({
      message: 'Data seeded successfully',
      accounts: accounts.length,
      contacts: contacts.length,
      transactions: transactions.length,
      payments: payments.length,
      collections: collections.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
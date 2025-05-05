import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  connect_timeout: 10, // 10 second timeout
  idle_timeout: 20, // 20 second idle timeout
});

async function listInvoices() {
  try {
    console.log('Starting query execution...');
    const data = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    console.log('Query completed successfully');
    return data;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const data = await listInvoices();
    return Response.json(data);
  } catch (error: any) {
    console.error('Request failed:', error);
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}

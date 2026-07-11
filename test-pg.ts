import 'dotenv/config';
import { Client } from 'pg';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

async function main() {
  const client = new Client({
    host: "18.215.6.120",
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  console.log('Connecting...');
  await client.connect();
  console.log('Connected!');

  const result = await client.query('SELECT NOW()');
  console.log(result.rows);

  await client.end();
}

main().catch(console.error);

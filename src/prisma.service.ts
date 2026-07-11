import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaPg } from '@prisma/adapter-pg';
// import {Pool} from 'pg';
import {neonConfig} from '@neondatabase/serverless';
import ws from 'ws';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // neonConfig.webSocketConstructor = ws;
    neonConfig.fetchConnectionCache = true;

    const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Missing DATABASE_URL');
   const adapter = new PrismaNeon({connectionString});

    super({
      adapter,
      log: ['error', 'warn', 'query'],
    });
    // console.log(process.env.DATABASE_URL);
  }
}

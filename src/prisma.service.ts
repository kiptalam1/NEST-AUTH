import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from '@neondatabase/serverless';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    });
    super({
      adapter,
      log: ['error', 'warn', 'query'],
    });
    // console.log(process.env.DATABASE_URL);
  }
}

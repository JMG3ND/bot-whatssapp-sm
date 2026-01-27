import { PrismaClient } from './montain/client'
import { PrismaMssql } from '@prisma/adapter-mssql'
import 'dotenv/config';

const sqlConfig = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  server: process.env.DB_HOST || '',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

const adapter = new PrismaMssql(sqlConfig)
export const montainConnection = new PrismaClient({ adapter });

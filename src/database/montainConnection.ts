import { PrismaClient } from './montain/client'
import { PrismaMssql } from '@prisma/adapter-mssql'
import { ENV } from '@env'

const sqlConfig = {
  user: ENV.DB_USER || '',
  password: ENV.DB_PASSWORD || '',
  database: ENV.DB_NAME || '',
  server: ENV.DB_HOST || '',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

const adapter = new PrismaMssql(sqlConfig)
export const montainConnection = new PrismaClient({ adapter })

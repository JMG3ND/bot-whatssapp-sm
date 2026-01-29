import { PrismaClient } from './brain/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { ENV } from '@env'

const databaseUrl = ENV.BRAIN_DATABASE_URL

const adapter = new PrismaBetterSqlite3({ url: databaseUrl })

export const brainConnection = new PrismaClient({ adapter })

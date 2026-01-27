import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: '../prisma/simba/schema.prisma',
  migrations: {
    path: '../prisma/simba/migrations',
  },
  datasource: {
    url: process.env['SIMBA_DATABASE_URL'],
  },
})

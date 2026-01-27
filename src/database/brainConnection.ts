import { PrismaClient } from "./prisma-client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import "dotenv/config";

const databaseUrl = process.env.BRAIN_DATABASE_URL || "";

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const globalForPrisma = global as unknown as { db: PrismaClient };

const adapter = new PrismaPg({ connectionString });
const db = globalForPrisma.db || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export { db };
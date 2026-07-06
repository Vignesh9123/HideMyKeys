import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { PrismaClient } from "./generated/prisma/client";
import { config } from "dotenv";

config()


const prisma = new PrismaClient({
    adapter: new PrismaPostgresAdapter({
        connectionString: process.env.DATABASE_URL!
    })
});

export {prisma}

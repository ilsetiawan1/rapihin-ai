import 'dotenv/config'; // Ensure environment variables are loaded
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma', // Path to your schema file
  datasource: {
    url: process.env.DATABASE_URL!, // Reads DATABASE_URL from your .env file
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node ./prisma/seed.ts',
  },
});

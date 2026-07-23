import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: [
    "https://anns-expense-tracker.vercel.app",
    "https://**-annieennie.vercel.app",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
  },
})

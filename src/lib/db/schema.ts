import { pgTable, text, numeric, boolean, date, serial, integer, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  targetDate: date("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const savingsContributions = pgTable("savings_contributions", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").notNull().references(() => savingsGoals.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  date: date("date").notNull(),
  isAutomaticTransfer: boolean("is_automatic_transfer").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const recurringItems = pgTable("recurring_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  frequency: text("frequency").notNull().default("monthly"),
  nextDueDate: date("next_due_date").notNull(),
  status: text("status").notNull().default("upcoming"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const pendingItems = pgTable("pending_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  counterpart: text("counterpart").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const dailySpendEntries = pgTable("daily_spend_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  note: text("note"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const incomeEntries = pgTable("income_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  source: text("source").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const historyEntries = pgTable("history_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  sourceType: text("source_type").notNull(),
  sourceId: integer("source_id").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  dateSettled: date("date_settled").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

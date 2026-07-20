import { db } from "./db"
import {
  savingsGoals,
  savingsContributions,
  recurringItems,
  pendingItems,
  dailySpendEntries,
  incomeEntries,
  historyEntries,
} from "./db/schema"

async function seed() {
  const userId = "1"

  // Clear existing data
  await db.delete(historyEntries)
  await db.delete(incomeEntries)
  await db.delete(dailySpendEntries)
  await db.delete(pendingItems)
  await db.delete(recurringItems)
  await db.delete(savingsContributions)
  await db.delete(savingsGoals)

  // Savings goals
  const [emergencyFund] = await db.insert(savingsGoals).values({
    userId,
    name: "Emergency Fund",
    targetAmount: "500000",
    currency: "NGN",
    targetDate: "2026-12-01",
  }).returning()

  const [newLaptop] = await db.insert(savingsGoals).values({
    userId,
    name: "New Laptop",
    targetAmount: "850000",
    currency: "NGN",
    targetDate: "2027-03-01",
  }).returning()

  const [travelFund] = await db.insert(savingsGoals).values({
    userId,
    name: "Travel Fund",
    targetAmount: "400",
    currency: "USD",
  }).returning()

  // Savings contributions
  await db.insert(savingsContributions).values([
    { goalId: emergencyFund.id, userId, amount: "25000", currency: "NGN", date: "2026-07-01", isAutomaticTransfer: true },
    { goalId: emergencyFund.id, userId, amount: "10000", currency: "NGN", date: "2026-07-15", isAutomaticTransfer: false },
    { goalId: newLaptop.id, userId, amount: "50000", currency: "NGN", date: "2026-07-05", isAutomaticTransfer: false },
    { goalId: travelFund.id, userId, amount: "50", currency: "USD", date: "2026-07-10", isAutomaticTransfer: false },
  ])

  // Recurring items
  await db.insert(recurringItems).values([
    { userId, name: "Rent", amount: "150000", currency: "NGN", frequency: "monthly", nextDueDate: "2026-08-01", status: "upcoming" },
    { userId, name: "Netflix", amount: "4400", currency: "NGN", frequency: "monthly", nextDueDate: "2026-07-22", status: "due soon" },
    { userId, name: "Phone Data Plan", amount: "15000", currency: "NGN", frequency: "monthly", nextDueDate: "2026-07-20", status: "overdue" },
    { userId, name: "Gym Membership", amount: "20000", currency: "NGN", frequency: "monthly", nextDueDate: "2026-08-03", status: "upcoming" },
  ])

  // Pending items
  await db.insert(pendingItems).values([
    { userId, description: "Freelance design payment", amount: "60000", currency: "NGN", counterpart: "Shola", status: "pending" },
    { userId, description: "Borrowed for data", amount: "5000", currency: "NGN", counterpart: "Ope", status: "overdue" },
    { userId, description: "Split dinner bill", amount: "8500", currency: "NGN", counterpart: "Amaka", status: "paid" },
  ])

  // Daily spend
  await db.insert(dailySpendEntries).values([
    { userId, amount: "2500", currency: "NGN", note: "transport", date: "2026-07-17" },
    { userId, amount: "6000", currency: "NGN", note: "groceries", date: "2026-07-16" },
    { userId, amount: "1200", currency: "NGN", note: "lunch", date: "2026-07-16" },
    { userId, amount: "3000", currency: "NGN", note: "data top-up", date: "2026-07-15" },
    { userId, amount: "15000", currency: "NGN", note: "new shoes", date: "2026-07-12" },
  ])

  // Income
  await db.insert(incomeEntries).values([
    { userId, amount: "350000", currency: "NGN", source: "Salary", date: "2026-07-01" },
    { userId, amount: "60000", currency: "NGN", source: "Freelance project", date: "2026-07-10" },
    { userId, amount: "50", currency: "USD", source: "Side gig", date: "2026-07-14" },
  ])

  // History
  await db.insert(historyEntries).values([
    { userId, sourceType: "recurring", sourceId: 0, description: "Rent", amount: "150000", currency: "NGN", dateSettled: "2026-07-01" },
    { userId, sourceType: "recurring", sourceId: 0, description: "Netflix", amount: "4400", currency: "NGN", dateSettled: "2026-06-22" },
    { userId, sourceType: "pending", sourceId: 0, description: "Split dinner bill (Amaka)", amount: "8500", currency: "NGN", dateSettled: "2026-07-05" },
  ])

  console.log("Seed data inserted successfully!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})

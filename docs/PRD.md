# PRD: Ann's Expense Tracker

**Problem:** Right now, savings progress, recurring bills, and money expected to be paid or received are scattered across notes, memory, or a spreadsheet not built for any of them specifically. This app puts all three in one place, alongside a basic view of income.

**User:** Single account, Ann only, accessed from phone or desktop.

## Core features for this version

1. **Savings space.** Multiple separate savings goals (name, target amount, optional target date), each tracked independently, e.g. "Emergency Fund," "New Laptop." Log contributions toward each goal over time, including automatic monthly transfers, which are logged here directly rather than in Recurring. See progress at a glance per goal, current amount versus target.

2. **Recurring space.** List recurring expenses (rent, subscriptions, data) with amount, frequency (weekly, monthly, custom), and next due date. Mark as paid when it clears, which rolls the due date forward automatically and logs the payment to history. Automatic savings transfers are excluded from this space since they live in Savings.

3. **Pending space.** Track one-off expenses that are expected but not yet settled, someone owes you money, or you're waiting to pay someone. Each entry has an amount, who it's with, and a status (pending, paid, overdue).

4. **Daily spend.** A quick-entry log for everyday spending, amount and an optional free-text note (e.g. "transport," "lunch"), no categories. Designed to be fast enough to log in the moment. The dashboard shows a running total for the current month, so you always know your monthly spend without doing the math yourself.

5. **Income tracking.** Log income entries (amount, source, date) so the dashboard can reflect money coming in alongside what's going out or being saved.

6. **History log.** Paid recurring items and cleared pending items move into a permanent, uneditable history log once settled, functioning like a real ledger rather than an editable list.

7. **Dashboard/overview.** A home screen summarizing total progress across all savings goals, income logged, this month's daily spend total, upcoming recurring items due soon, and open pending items. Items due soon or overdue get a visual flag (e.g. a color or badge) so they stand out without needing to open each section.

## Currency

Multi-currency support. Each entry (savings contribution, recurring item, pending item, income) carries its own currency, and the dashboard should show totals grouped by currency rather than forcing a single conversion.

## Out of scope for version one

- Bank account syncing
- Spending category analytics
- Budgeting limits
- Editing past history entries

These are possible phase two additions if the app proves useful.

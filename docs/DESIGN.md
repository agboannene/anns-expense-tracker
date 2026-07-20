# Design: Ann's Expense Tracker

## Palette

- **Background:** soft off-white (light mode) / deep charcoal (dark mode). Equal priority given to both, so both should look intentional rather than one being an afterthought.
- **Primary text:** near-black or near-white depending on mode.
- **Accent:** warm amber, used for primary actions, positive progress, and "due soon" flags.
- **Overdue/negative flag:** a muted rust, distinct from amber but not harsh or alarming.

## Typography

One clean sans-serif throughout. Regular weight for labels and notes, bold weight for all amounts, since the number is always the thing the eye should land on first.

## Navigation

Five destinations, equally accessible on mobile (bottom nav) and desktop (left sidebar):

- Dashboard
- Savings
- Recurring
- Pending
- Daily Spend

Income lives inside the dashboard rather than its own tab. History is accessed from within each relevant section, not as a sixth nav item.

## Key screens

1. **Dashboard** – summary cards for total savings progress, income this period, this month's daily spend total, upcoming recurring due, and open pending items. Amber or rust flags on anything due soon or overdue.
2. **Savings** – goal cards showing progress toward each target. Tap into a goal for its contribution history.
3. **Recurring** – list view with next due date and a one-tap "mark as paid" action.
4. **Pending** – list grouped by status (pending, overdue, paid), each entry showing who it's with and the amount.
5. **Daily Spend** – a fast entry screen, amount field front and center, note field optional and collapsed by default, with a running monthly total visible at the top.
6. **History (per section)** – a clean, permanent log, no edit actions, just a record.

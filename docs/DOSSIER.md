# Dossier: Ann's Expense Tracker

A single reference snapshot pulling together the problem, the design direction, and the data structure, before moving into content.

## Overview

**Problem:** Savings progress, recurring bills, daily spending, and money expected to be paid or received are currently scattered across notes, memory, or an unfit spreadsheet. This app puts all of it in one place.

**User:** Single account, Ann only, accessed from phone or desktop, equal priority on both.

## Spaces in the app

1. Savings
2. Recurring
3. Pending
4. Daily Spend
5. Income (inside the dashboard)
6. History (accessed per section)
7. Dashboard/overview

## Design snapshot

- **Palette:** charcoal and warm amber. Off-white background in light mode, deep charcoal in dark mode, amber as the single accent for actions, progress, and "due soon" flags, muted rust for overdue.
- **Typography:** one sans-serif, regular for labels and notes, bold for all amounts.
- **Navigation:** five destinations (Dashboard, Savings, Recurring, Pending, Daily Spend), equally weighted for mobile and desktop.

## Data schema outline

**Savings goal**
- id
- name
- target_amount
- currency
- target_date (optional)
- created_at

**Savings contribution**
- id
- goal_id (linked to Savings goal)
- amount
- currency
- date
- is_automatic_transfer (true/false)

**Recurring item**
- id
- name
- amount
- currency
- frequency (weekly, monthly, custom)
- next_due_date
- status (upcoming, due soon, overdue, paid)

**Pending item**
- id
- description
- amount
- currency
- counterpart (who it's with)
- status (pending, overdue, paid)

**Daily spend entry**
- id
- amount
- currency
- note (optional, free text)
- date

**Income entry**
- id
- amount
- currency
- source
- date

**History entry**
- id
- source_type (recurring, pending)
- source_id (the original item's id)
- amount
- currency
- date_settled
- permanent, no edit or delete allowed

## What content needs to cover next

Sample entries for each of the above (a few savings goals, a few recurring bills, a few pending items, a few daily spend logs, a few income entries) written with real-feeling names and amounts, not placeholder lorem ipsum, so the build looks and feels like an actual working app from the first screen.

---
name: database
description: Database architecture, schema design, Prisma, Drizzle ORM, indexing strategies, migrations, and N+1 query resolution.
---

# Database

## Overview

Relational database design, query optimization, migration safety, and ORM usage across PostgreSQL, Prisma, and Drizzle.

## When to Use

Activate for tasks involving database schema design, migrations, indexing, relational models, ORM queries, transactions, or query performance tuning.

## Rules & Patterns

### Negative Constraints (What NOT to Do)

1. **NEVER do `SELECT *` in production**: Always select explicit columns required by the caller to minimize memory bandwidth and lock footprint.
2. **NEVER run destructive migrations without backward compatibility**: Always follow expand-and-contract (Phase 1: add new column as nullable; Phase 2: backfill; Phase 3: make non-nullable & remove old column).
3. **NEVER execute queries in loops (The N+1 Anti-Pattern)**: Always use batch loading (`inArray`, `DataLoader`, or relational `include` / `JOIN`).
4. **NEVER leave foreign keys without indexes**: In PostgreSQL/MySQL, child foreign key columns must always have an index to prevent table-level locking on cascade deletes.
5. **NEVER perform multi-entity writes without a database transaction**: Any operation touching multiple records must use `prisma.$transaction` or `db.transaction`.

### Indexing & Performance Rules

- **B-Tree Indexes**: For high-cardinality filters (`status`, `user_id`, `created_at`).
- **Composite Indexes**: When querying multiple columns together (`WHERE organization_id = ? AND status = ?`), order columns in index by equality first, range second.
- **Partial Indexes**: For sparse boolean flags (`WHERE is_processed = false`).

## Code Examples

See `EXAMPLES.md` for complete anti-patterns and production code examples.

## Validation Checklist

- [ ] All database queries select explicit required columns
- [ ] Foreign keys have matching indexes
- [ ] Multi-table writes wrapped in ACID transactions
- [ ] No N+1 queries in loops

## Common Mistakes

- Missing pagination limits (`take / limit`) on list endpoints. See `TROUBLESHOOTING.md`.

## Integration Notes

Interacts with `system-design`, `ddd`, and `security` (multi-tenant scoping).

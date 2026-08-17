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


# Database Examples — Anti-patterns vs ContextOS Standard

## Example 1: Solving the N+1 Query Problem

### Anti-pattern: Anti-pattern (N+1 database queries in a loop)

```typescript
// BAD: 1 query for users + N queries for posts!
const users = await prisma.user.findMany();
const usersWithPosts = [];
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } }); // N queries!
  usersWithPosts.push({ ...user, posts });
}
```

### Best practice: ContextOS Standard (Batch query or relational include)

```typescript
// GOOD: 1 single optimized batch query
const usersWithPosts = await prisma.user.findMany({
  where: { isActive: true },
  select: {
    id: true,
    name: true,
    email: true,
    posts: {
      where: { published: true },
      select: { id: true, title: true, createdAt: true },
      take: 5
    }
  }
});
```

---

## Example 2: Safe Atomic Transactions with Locking

### Anti-pattern: Anti-pattern (Unprotected read-modify-write race condition)

```typescript
// BAD: race condition between reading balance and updating
const account = await prisma.account.findUnique({ where: { id } });
if (account.balance >= amount) {
  await prisma.account.update({
    where: { id },
    data: { balance: account.balance - amount }
  });
}
```

### Best practice: ContextOS Standard (Atomic conditional update in transaction)

```typescript
// GOOD: atomic database transaction with invariant check
export async function deductBalance(accountId: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    const updated = await tx.account.updateMany({
      where: {
        id: accountId,
        balance: { gte: amount }
      },
      data: {
        balance: { decrement: amount }
      }
    });

    if (updated.count === 0) {
      throw new InsufficientFundsError(accountId);
    }
  });
}
```

# Database Troubleshooting Guide

## Common Issues & Fixes

### 1. Connection Pool Exhaustion in Serverless / Edge

- **Cause**: Creating a new PrismaClient / DB connection instance on every serverless function invocation.
- **Fix**: Declare PrismaClient as a global singleton across warm lambdas, and enable PgBouncer or Prisma Accelerate.

### 2. Slow Queries on Large Tables

- **Cause**: Missing composite index on filtered and ordered columns.
- **Fix**: Run `EXPLAIN ANALYZE <query>` and add targeted indexes matching the WHERE and ORDER BY columns.

### 3. Database Deadlocks during Concurrent Transactions

- **Cause**: Different transactions updating resources in different orders.
- **Fix**: Always acquire locks and update entities in a deterministic alphabetical or ID-ordered sequence.
---
name: system-design
description: >
  Scalable architecture skill based on the System Design Primer.
  Before designing any backend, reason about load balancers, caching,
  DB partitioning, CAP theorem, and microservices trade-offs.
---

# System Design — Scalable Architecture Thinking

Based on [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — the most starred system design resource on GitHub.

## Core Principle

> **Everything is a trade-off.** Before writing a single line of backend code, reason through the system at scale. A flat monolith that works now fails at 10× load.

---

## Mandatory Pre-Design Checklist

Before architecting any backend system, answer these questions:

1. **Scale**: What is the expected QPS (queries per second)? Peak vs average?
2. **Data volume**: How much data? Growth rate? 1GB? 1TB? 1PB?
3. **Consistency vs Availability**: Can we tolerate eventual consistency? (CAP theorem)
4. **Read/Write ratio**: Is it read-heavy (cache it!) or write-heavy (shard it!)?
5. **Latency requirements**: Real-time (<100ms)? Near-real-time (<1s)? Batch?
6. **Global distribution**: Single region or multi-region?

---

## Core Architecture Patterns

### Load Balancing
```
Clients → Load Balancer → [App Server 1, App Server 2, App Server N]
```
- Use **Round Robin** for stateless services
- Use **Least Connections** for varying request times
- Use **IP Hash** for session affinity (or move sessions to Redis)
- Always add **health checks** — remove unhealthy nodes automatically

**Rule**: Any service expecting > 1000 RPS needs a load balancer. No exceptions.

### Caching Strategy
```
App → [Cache Layer: Redis/Memcached] → Database
```
Cache decision ladder (check in order):
1. Is it read > write? → Cache it
2. Is it expensive to compute? → Cache it  
3. Is it user-specific? → Cache with user key
4. Is it global? → Shared cache, shorter TTL

**Cache patterns**:
- **Cache-aside** (lazy loading): check cache → miss → load DB → write cache
- **Write-through**: write to DB AND cache simultaneously (consistency > performance)
- **Write-behind**: write to cache → async flush to DB (performance > consistency)

**Invalidation**: Use TTL + event-driven invalidation. Never stale-forever.

### Database Architecture

#### When to use SQL vs NoSQL
| Scenario | Use SQL | Use NoSQL |
|----------|---------|-----------|
| Complex joins, ACID transactions | ✅ | ❌ |
| Flexible/evolving schema | ❌ | ✅ |
| Horizontal scaling needed | Careful | ✅ |
| Simple key-value lookup | Overkill | ✅ |
| Full-text search | Use Elasticsearch | Use Elasticsearch |
| Time-series data | TimescaleDB | InfluxDB |

#### Scaling Databases
**Vertical scaling**: Bigger machine. Easy but has ceiling.  
**Read replicas**: Route SELECT to replicas, writes to primary.  
**Sharding (horizontal partitioning)**:
- Hash sharding: `user_id % N` — even distribution, hard to rebalance
- Range sharding: user_id 1-1M on shard 1 — easy range queries, hotspots risk
- Directory-based: lookup table maps key → shard — flexible, but lookup is overhead

**Denormalization**: For read-heavy systems, duplicate data to avoid joins.  
**Rule**: Don't shard until you've maxed out read replicas.

### Message Queues & Async Processing
```
Producer → [Queue: Redis/RabbitMQ/Kafka] → Consumer Workers
```
Use queues when:
- Operation takes > 200ms (email, PDF generation, ML inference)
- You need retry logic on failure
- You need to decouple services
- Traffic spikes need to be absorbed

**Kafka** = durability + replay + high throughput (events/analytics)  
**Redis Queue** = simplicity + low latency (jobs/tasks)  
**RabbitMQ** = complex routing + acknowledgements

### Microservices vs Monolith

**Start with a monolith** unless you have > 10 engineers or proven scale need.

When to split into microservices:
- Independent deployment cycles needed
- Different scaling requirements per service
- Team autonomy (Conway's Law)
- Clear service boundaries (DDD bounded contexts)

**Rule**: A microservice should be able to be rewritten in 2 weeks by 2 engineers.

Service communication:
- **Sync (REST/gRPC)**: when caller needs immediate response
- **Async (events/queue)**: when caller can tolerate delay, or decoupling is needed

---

## Scalability Design Patterns

### CDN (Content Delivery Network)
- Serve static assets (JS, CSS, images) from CDN edge nodes
- Cache API responses that don't change per-user
- Reduce origin server load by 80%+

### Rate Limiting
Always implement for public APIs:
```
- Token bucket: smooth bursts, allows brief spikes
- Leaky bucket: strict rate, no bursts
- Fixed window: simple, vulnerable to boundary spikes
- Sliding window: most accurate, slightly more complex
```
Store rate limit state in Redis (not in-process — it doesn't survive restarts).

### Circuit Breaker
Prevent cascade failures:
```
CLOSED (normal) → [failures > threshold] → OPEN (fail fast)
  ↑                                               ↓
  └────── [timeout] ← HALF-OPEN (test request) ──┘
```

### Database Connection Pooling
Never create new DB connections per request. Use a pool:
- PostgreSQL: PgBouncer
- MySQL: ProxySQL
- Node.js: pg-pool, knex

---

## CAP Theorem in Practice

**You can only guarantee 2 of 3**: Consistency, Availability, Partition Tolerance

| System | Chooses | Example |
|--------|---------|---------|
| Traditional SQL | CP | PostgreSQL |
| Distributed NoSQL | AP | DynamoDB, Cassandra |
| Cache | AP (tunable) | Redis with replication |

**For most apps**: Choose AP. Accept eventual consistency. Use optimistic locking for critical writes.

---

## Architecture Decision Template

When proposing any backend architecture, include:

```markdown
## System Design Decision

**Scale Target**: [X RPS, Y GB data, Z users]
**CAP Choice**: [CP/AP/CA] because [reason]
**Read/Write Ratio**: [X:Y]

### Components
- **API Layer**: [Technology] behind [Load Balancer]
- **Cache**: [Redis/Memcached] for [what] with [TTL strategy]
- **Database**: [SQL/NoSQL] - [single/sharded/replicated] because [reason]
- **Async**: [Queue tech] for [what operations]

### Trade-offs Accepted
- [Trade-off 1]: [Why acceptable]
- [Trade-off 2]: [Why acceptable]

### Scaling Path
1. Now (MVP): [simple setup]
2. At 10× load: [first scaling step]
3. At 100× load: [next scaling step]
```

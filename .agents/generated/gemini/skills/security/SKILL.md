---
name: Application Security
description: >
  ContextOS skill for Application Security
---
# Application Security — Best Practices

## OWASP Top 10

### 1. Injection (SQL, NoSQL, Command)

- **Always use parameterized queries** — never concatenate user input into SQL
- Use ORM (Prisma, SQLAlchemy, TypeORM) — they parameterize by default
- Validate and sanitize all user input

### 2. Broken Authentication

- Use bcrypt/argon2 for password hashing (cost factor ≥ 12)
- JWT: short-lived access tokens (15min), refresh tokens (7 days)
- Rate limit login attempts
- Implement account lockout after N failed attempts
- MFA for sensitive operations

### 3. Sensitive Data Exposure

- HTTPS everywhere — redirect HTTP to HTTPS
- Encrypt sensitive data at rest (AES-256)
- Never log passwords, tokens, or PII
- Use environment variables for secrets

### 4. XML/XXE

- Disable external entity processing
- Use JSON instead of XML where possible

### 5. Broken Access Control

- Default deny — explicitly grant access
- RBAC (Role-Based Access Control) or ABAC (Attribute-Based)
- Check authorization on every request, not just UI
- Don't rely on client-side validation for security

### 6. Security Misconfiguration

- Remove default credentials
- Disable debug mode in production
- Security headers (see below)
- Keep dependencies updated

### 7. XSS (Cross-Site Scripting)

- Escape all output by default
- Content-Security-Policy header
- HttpOnly + Secure + SameSite cookies
- Use framework's built-in XSS protection

### 8. Insecure Deserialization

- Validate and schema-check all input (Zod, Pydantic, class-validator)
- Don't deserialize untrusted data

### 9. Insufficient Logging

- Log all authentication events
- Log authorization failures
- Log input validation failures
- Include request ID for tracing

### 10. SSRF (Server-Side Request Forgery)

- Validate and allowlist URLs
- Don't let users control server-side HTTP requests

## Security Headers

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Authentication Patterns

### JWT Flow

```
Login → Access Token (15min) + Refresh Token (7d, HttpOnly cookie)
Request → Authorization: Bearer <access_token>
Expired → POST /auth/refresh (sends refresh cookie) → new access token
```

### OAuth2 Flow

```
Redirect → Provider (Google, GitHub) → Callback → Create/link user → JWT
```

## Checklist Before Deploy

- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] CORS configured (not `*`)
- [ ] Error messages don't leak internals
- [ ] Dependency audit (`npm audit`, `pip audit`)
- [ ] Logging for security events


<!-- Source: EXAMPLES.md -->

# Application Security Examples — Anti-patterns vs ContextOS Standard

## Example 1: Timing-Safe Secret Verification

### ❌ Anti-pattern (Vulnerable to side-channel timing attack)

```typescript
// BAD: string comparison returns early on the first mismatched byte
export function verifyApiKey(providedKey: string, storedKey: string): boolean {
  return providedKey === storedKey; // Vulnerable to timing analysis!
}
```

### ✅ ContextOS Standard (Constant-time buffer comparison)

```typescript
// GOOD: crypto.timingSafeEqual executes in constant time
import crypto from 'crypto';

export function verifyApiKey(providedKey: string, storedKey: string): boolean {
  const providedBuffer = Buffer.from(providedKey, 'utf8');
  const storedBuffer = Buffer.from(storedKey, 'utf8');

  if (providedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, storedBuffer);
}
```

---

## Example 2: Preventing IDOR (Insecure Direct Object Reference)

### ❌ Anti-pattern (Trusting client ID without ownership check)

```typescript
// BAD: any authenticated user can delete any other user's document!
app.delete('/api/documents/:id', requireAuth, async (req, res) => {
  await prisma.document.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
```

### ✅ ContextOS Standard (Multi-tenant scoped authorization check)

```typescript
// GOOD: document deletion is strictly scoped to authenticated user or org
app.delete('/api/documents/:id', requireAuth, async (req, res) => {
  const deleted = await prisma.document.deleteMany({
    where: {
      id: req.params.id,
      organizationId: req.user.organizationId, // Tenant isolation
    },
  });

  if (deleted.count === 0) {
    return res.status(404).json({ error: 'Document not found or access denied' });
  }

  return res.status(204).end();
});
```

<!-- Source: SKILL.md -->

---
name: Application Security
description: >
  ContextOS skill for Application Security
---

# Application Security

## Overview

A brief summary of what the skill does and its core philosophy.

## When to Use

Context for when this skill is applicable.

## 🚫 Negative Constraints (What NOT to Do)

1. **NEVER use standard string comparison (`===`) for secrets/hashes**: Always use `crypto.timingSafeEqual` to prevent timing attacks.
2. **NEVER store sensitive JWT access/refresh tokens in `localStorage`**: Store tokens in `httpOnly`, `Secure`, `SameSite=Strict` cookies.
3. **NEVER return raw database/internal error messages or stack traces to the client**: Return standardized generic error codes (`INTERNAL_SERVER_ERROR`) and log details internally.
4. **NEVER trust client-provided IDs for authorization without tenant/ownership checks**: Always verify `where: { id, userId: session.userId }` to prevent Insecure Direct Object References (IDOR).
5. **NEVER disable CSRF protection, CORS allow-all (`*`), or TLS verification (`NODE_TLS_REJECT_UNAUTHORIZED=0`) in production**: Always enforce strict origin whitelists and HTTPS.

## Rules & Patterns

## OWASP Top 10

### 1. Injection (SQL, NoSQL, Command)

- **Always use parameterized queries** — never concatenate user input into SQL
- Use ORM (Prisma, SQLAlchemy, TypeORM) — they parameterize by default
- Validate and sanitize all user input

### 2. Broken Authentication

- Use bcrypt/argon2 for password hashing (cost factor ≥ 12)
- JWT: short-lived access tokens (15min), refresh tokens (7 days)
- Rate limit login attempts
- Implement account lockout after N failed attempts
- MFA for sensitive operations

### 3. Sensitive Data Exposure

- HTTPS everywhere — redirect HTTP to HTTPS
- Encrypt sensitive data at rest (AES-256)
- Never log passwords, tokens, or PII
- Use environment variables for secrets

### 4. XML/XXE

- Disable external entity processing
- Use JSON instead of XML where possible

### 5. Broken Access Control

- Default deny — explicitly grant access
- RBAC (Role-Based Access Control) or ABAC (Attribute-Based)
- Check authorization on every request, not just UI
- Don't rely on client-side validation for security

### 6. Security Misconfiguration

- Remove default credentials
- Disable debug mode in production
- Security headers (see below)
- Keep dependencies updated

### 7. XSS (Cross-Site Scripting)

- Escape all output by default
- Content-Security-Policy header
- HttpOnly + Secure + SameSite cookies
- Use framework's built-in XSS protection

### 8. Insecure Deserialization

- Validate and schema-check all input (Zod, Pydantic, class-validator)
- Don't deserialize untrusted data

### 9. Insufficient Logging

- Log all authentication events
- Log authorization failures
- Log input validation failures
- Include request ID for tracing

### 10. SSRF (Server-Side Request Forgery)

- Validate and allowlist URLs
- Don't let users control server-side HTTP requests

## Security Headers

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Authentication Patterns

### JWT Flow

```
Login → Access Token (15min) + Refresh Token (7d, HttpOnly cookie)
Request → Authorization: Bearer <access_token>
Expired → POST /auth/refresh (sends refresh cookie) → new access token
```

### OAuth2 Flow

```
Redirect → Provider (Google, GitHub) → Callback → Create/link user → JWT
```

## Checklist Before Deploy

- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] CORS configured (not `*`)
- [ ] Error messages don't leak internals
- [ ] Dependency audit (`npm audit`, `pip audit`)
- [ ] Logging for security events


## Code Examples

See `EXAMPLES.md` for detailed code examples.

## Validation Checklist

What to verify during the review phase before completing the task.

## Common Mistakes

Anti-patterns and things to explicitly avoid. See `TROUBLESHOOTING.md`.

## Integration Notes

How this skill interacts with other skills.

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

/**
 * Loads and extracts clean markdown rules from a skill file.
 */
function loadSkillContext(skillName) {
  const p = path.join(ROOT, '.agents', 'core', 'skills', skillName, 'SKILL.md');
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, 'utf8');
    const clean = raw
      .replace(/^---[\s\S]*?---\s*/, '')
      .replace(/## Overview\s+A brief summary[\s\S]*?(?=##)/gi, '')
      .replace(/## When to Use\s+Context for when[\s\S]*?(?=##)/gi, '')
      .trim();
    return `\n[Skill Rules: ${skillName}]\n${clean.slice(0, 4500)}\n`;
  }
  return '';
}

/**
 * High-signal benchmark task definitions.
 */
const BENCHMARK_TASKS = [
  {
    id: 'auth-security-hardened',
    title: 'Secure Authentication & Rate Limiting Handler',
    category: 'Security & Backend',
    skills: ['security', 'node', 'ponytail-mindset'],
    prompt: `Design a production-ready, secure user login handler in Node.js/Express.
Requirements:
1. Verify user password securely against timing attacks using crypto.timingSafeEqual on buffer hashes.
2. Issue secure JWT with proper expiry (max 15m), audience, and issuer claims.
3. Include brute-force rate-limiting protection per IP and username with exponential lockout.
4. Strictly validate and sanitize input (email, password) before any processing.
5. In error responses (500), never expose stack traces, internal database errors, or specific failure reasons (prevent user enumeration).
6. Keep the architecture clean and decoupled (business logic separated from HTTP route handler).`,
    criteria: [
      'Timing-safe password comparison against timing attacks (crypto.timingSafeEqual)',
      'Brute-force rate limiting protection per IP/account',
      'Strict input validation & sanitization prior to DB lookup',
      'No sensitive credentials, stack traces, or user enumeration leaks in error responses',
      'Clean architecture with isolated auth service layer'
    ],
    staticChecks: [
      {
        id: 'timing-safe-equal',
        name: 'Uses crypto.timingSafeEqual for timing-attack prevention',
        weight: 25,
        test: (code) => /timingSafeEqual/i.test(code),
      },
      {
        id: 'rate-limiting',
        name: 'Implements rate limiting or brute-force tracking',
        weight: 20,
        test: (code) => /rateLimit|lockout|attempts|limiter|hincrby|lockedUntil/i.test(code),
      },
      {
        id: 'no-leak-stack',
        name: 'Does not leak stack trace in 500 error responses',
        weight: 20,
        test: (code) => !/res\.(?:status\(500\)|json|send)\([^)]*(\bstack\b|err\.message)/i.test(code),
      },
      {
        id: 'input-validation',
        name: 'Performs explicit input validation on email/password',
        weight: 20,
        test: (code) => /typeof\s+email|validator|isEmail|sanitize|validate|safeParse|z\.(?:string|object)|schema/i.test(code),
      },
      {
        id: 'jwt-claims',
        name: 'Configures JWT with expiresIn / audience / issuer',
        weight: 15,
        test: (code) => /expiresIn|exp|jwt\.sign|SignJWT|setExpirationTime/i.test(code),
      },
    ]
  },
  {
    id: 'accessible-modal-focus-trap',
    title: 'Accessible React Modal with Focus Trap & ARIA',
    category: 'UI/UX & Accessibility',
    skills: ['ui-ux-pro', 'react', 'web-accessibility', 'impeccable-design'],
    prompt: `Create an accessible, production-ready React Modal component in TypeScript.
Requirements:
1. Full ARIA dialog compliance: role="dialog" or "alertdialog", aria-modal="true", aria-labelledby, and aria-describedby.
2. Active keyboard focus trap: when Tab or Shift+Tab reaches modal boundaries, wrap focus inside the dialog.
3. Escape key listener with proper cleanup on unmount.
4. Focus restoration: return focus to the previously active triggering element when the modal closes.
5. Render in a Portal (document.body) to avoid z-index stacking context traps.
6. Design tokens: avoid hardcoded magic colors (no #000000) and avoid arbitrary z-indexes (no z-[999]).`,
    criteria: [
      'Full ARIA dialog compliance (role="dialog", aria-modal="true", aria-labelledby)',
      'Active keyboard focus trap with Tab / Shift+Tab boundary cycling',
      'Escape key listener with proper cleanup in useEffect',
      'Focus restoration to triggering element upon modal close',
      'Portal mounting to prevent z-index clipping & adherence to design tokens'
    ],
    staticChecks: [
      {
        id: 'aria-dialog',
        name: 'Contains role="dialog" and aria-modal="true"',
        weight: 25,
        test: (code) => /role\s*[:=]\s*["'\\]*(?:dialog|alertdialog)|role\s*=\s*\{role\}/i.test(code) && /aria-modal\s*[:=]\s*["'\\]*(?:true|\{true\})/i.test(code),
      },
      {
        id: 'focus-trap-keys',
        name: 'Handles Tab / Shift+Tab keyboard focus cycling',
        weight: 25,
        test: (code) => /Tab/i.test(code) && /(?:shiftKey|focusables|firstFocusable|lastFocusable|getFocusable)/i.test(code),
      },
      {
        id: 'escape-cleanup',
        name: 'Handles Escape key and cleans up event listeners',
        weight: 20,
        test: (code) => /Escape/i.test(code) && /(?:removeEventListener|cleanup|return\s*\(\)\s*=>)/i.test(code),
      },
      {
        id: 'portal-render',
        name: 'Uses React createPortal for stacking isolation',
        weight: 15,
        test: (code) => /createPortal/i.test(code),
      },
      {
        id: 'no-anti-patterns',
        name: 'Avoids anti-patterns (no z-[999], no #000000)',
        weight: 15,
        test: (code) => !/z-\[999\]/i.test(code) && !/#000000\b/i.test(code),
      },
    ]
  },
  {
    id: 'ddd-order-aggregate-invariants',
    title: 'DDD Order Aggregate Root & Business Invariants',
    category: 'Architecture & DDD',
    skills: ['ddd', 'system-design', 'decisions'],
    prompt: `Refactor an Order processing domain into Domain-Driven Design (DDD) in TypeScript.
Requirements:
1. Create an Order Aggregate Root that encapsulates all state mutations and enforces business invariants.
2. Invariants: Cannot add items to a paid/cancelled order; cannot cancel an already shipped order; item quantities must be positive integers.
3. Model Money, OrderId, and Quantity as immutable Value Objects with validation.
4. Record and emit Domain Events (e.g. OrderCreatedEvent, OrderCancelledEvent) for side effects.
5. Provide a decoupled Repository interface following Dependency Inversion Principle (DIP).
6. Zero database ORM or HTTP framework coupling inside the domain entity.`,
    criteria: [
      'Order aggregate root encapsulates all state mutations and enforces business invariants',
      'Immutable Value Objects (Money, OrderId, Quantity) with encapsulation',
      'Domain events emission for downstream side-effects',
      'Decoupled Repository interface (DIP)',
      'Zero DB ORM / HTTP framework coupling inside Domain model'
    ],
    staticChecks: [
      {
        id: 'value-objects',
        name: 'Implements Value Objects (Money or OrderId)',
        weight: 25,
        test: (code) => /class\s+(?:Money|OrderId|Quantity)|Money\.of|Quantity\.from|readonly\s+amount/i.test(code),
      },
      {
        id: 'invariant-guards',
        name: 'Enforces business invariant checks/guards',
        weight: 25,
        test: (code) => /throw\s+new\s+\w*(?:Error|Exception)|can(?:Cancel|Add)|status\s*===|OrderStatus/i.test(code),
      },
      {
        id: 'domain-events',
        name: 'Records domain events for downstream side-effects',
        weight: 20,
        test: (code) => /domainEvents|DomainEvent|addDomainEvent|Order(?:Created|Cancelled|Shipped|Paid)Event/i.test(code),
      },
      {
        id: 'repository-interface',
        name: 'Defines decoupled repository interface',
        weight: 15,
        test: (code) => /(?:interface|type)\s+\w*OrderRepository|\w*Repository/i.test(code),
      },
      {
        id: 'pure-domain',
        name: 'No HTTP (express/req/res) coupling in domain model',
        weight: 15,
        test: (code) => !/import\s+.*\b(?:express|fastify|koa)\b/i.test(code),
      },
    ]
  },
  {
    id: 'resilient-async-queue-circuit-breaker',
    title: 'High-Concurrency Async Queue with Circuit Breaker & Jitter',
    category: 'Performance & Systems',
    skills: ['performance', 'system-design', 'ponytail-mindset'],
    prompt: `Implement a lightweight, production-grade Async Task Queue in JavaScript/TypeScript without external dependencies.
Requirements:
1. Parallel concurrency limiter (process up to N tasks concurrently).
2. Circuit Breaker integration with 3 explicit states: CLOSED, OPEN, HALF-OPEN, with failure threshold and cooldown reset.
3. Exponential backoff retry strategy with Full Jitter: waitTime = Math.random() * min(maxDelay, baseDelay * 2^attempt).
4. Support drain() Promise that resolves when all tasks in the queue are completed.
5. Fault isolation: individual task failures must not break the queue or leak unhandled rejections.
6. Minimalist, robust implementation adhering to Ponytail mindset (zero unnecessary boilerplate).`,
    criteria: [
      'Strict parallel execution concurrency limit enforcement',
      'Circuit Breaker state machine (CLOSED, OPEN, HALF-OPEN)',
      'Exponential backoff with full jitter to avoid thundering herds',
      'drain() promise resolves when queue is completely idle',
      'Fault isolation with zero external dependencies (pure standard JS/TS)'
    ],
    staticChecks: [
      {
        id: 'concurrency-control',
        name: 'Enforces strict concurrency bounding',
        weight: 25,
        test: (code) => /activeCount|running|concurrency/i.test(code),
      },
      {
        id: 'circuit-breaker-states',
        name: 'Defines Circuit Breaker states (CLOSED, OPEN, HALF-OPEN)',
        weight: 25,
        test: (code) => /CLOSED/i.test(code) && /OPEN/i.test(code) && /HALF[-_]OPEN/i.test(code),
      },
      {
        id: 'jitter-backoff',
        name: 'Implements exponential backoff with random jitter',
        weight: 20,
        test: (code) => /Math\.random\(\)/i.test(code) && /(?:Math\.pow\(2|2\s*\*\*|base\s*\*\s*2)/i.test(code),
      },
      {
        id: 'drain-promise',
        name: 'Provides drain() method resolving when queue completes',
        weight: 15,
        test: (code) => /drain\s*\(/i.test(code),
      },
      {
        id: 'pure-std-lib',
        name: 'Zero external npm package dependencies',
        weight: 15,
        test: (code) => !/(?:require|from)\s*['"](?:p-queue|async|axios|lodash)['"]/i.test(code),
      },
    ]
  },
  {
    id: 'type-safe-resilient-client',
    title: 'Type-Safe Resilient API Client with Invariant Validation',
    category: 'TypeScript & Reliability',
    skills: ['typescript', 'security', 'performance', 'ponytail-mindset'],
    prompt: `Create a type-safe, resilient HTTP Client in TypeScript.
Requirements:
1. Generic request method: request<T>(endpoint, options): Promise<T>.
2. Request timeout cancellation using AbortController with automatic cleanup.
3. Runtime validation/guard hook to verify that the received JSON payload satisfies expected invariants before returning.
4. Automatic retry on transient network errors (502, 503, 504, 429) with exponential backoff.
5. Typed error taxonomy (e.g. NetworkError, TimeoutError, ValidationError, ApiError) that sanitizes secrets before logging.`,
    criteria: [
      'Generic return types Promise<T> with type safety',
      'Timeout cancellation via AbortController / AbortSignal',
      'Runtime data validation / assertion against schema',
      'Automatic transient retry on 5xx/429 with backoff',
      'Structured error hierarchy preventing sensitive credential leakage'
    ],
    staticChecks: [
      {
        id: 'generic-types',
        name: 'Uses generic TypeScript types Promise<T>',
        weight: 25,
        test: (code) => /<T>|Promise<T>/i.test(code),
      },
      {
        id: 'abort-controller',
        name: 'Implements AbortController / signal timeout handling',
        weight: 25,
        test: (code) => /AbortController/i.test(code) && /(?:signal|abort)/i.test(code),
      },
      {
        id: 'runtime-validation',
        name: 'Provides runtime validation guard or validator callback',
        weight: 20,
        test: (code) => /validate|validator|safeParse|z\.(?:string|object)|schema|assert/i.test(code),
      },
      {
        id: 'transient-retry',
        name: 'Retries on status 429, 502, 503, 504',
        weight: 15,
        test: (code) => /429|503|502|504|retry/i.test(code),
      },
      {
        id: 'custom-errors',
        name: 'Defines custom error class hierarchy',
        weight: 15,
        test: (code) => /(?:class\s+\w*Error\s+extends\s+Error|class\s+\w*Error\s+extends\s+\w*Error)/i.test(code),
      },
    ]
  }
];

module.exports = {
  BENCHMARK_TASKS,
  loadSkillContext,
};

---
name: NestJS
description: >
  ContextOS skill for NestJS
---


<!-- Source: EXAMPLES.md -->

# Code Examples

Add detailed code examples and implementations here.


<!-- Source: nestjs.md -->

# NestJS — Best Practices

## Module Architecture

- **One module per domain** — `UsersModule`, `AuthModule`, `OrdersModule`
- **Feature modules** — encapsulate related controllers, services, repositories
- **Shared module** — for cross-cutting concerns (logging, config, utils)
- **Core module** — singleton services (database, auth guards)

```
src/
├── modules/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── users.spec.ts
│   └── auth/
├── shared/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
├── config/
└── app.module.ts
```

## Dependency Injection

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
}
```

- Prefer constructor injection
- Use custom providers for complex setup
- Scope: default is Singleton, use REQUEST scope only when needed

## DTOs and Validation

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}
```

- Always use DTOs for request validation
- Use `ValidationPipe` globally
- Separate Create/Update/Response DTOs

## Guards, Interceptors, Pipes

| Type | Purpose |
| --- | --- |
| **Guards** | Authentication, authorization |
| **Interceptors** | Logging, transformation, caching |
| **Pipes** | Validation, transformation |
| **Filters** | Exception handling |

Execution order: Guards → Interceptors → Pipes → Handler → Interceptors → Filters

## Error Handling

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Transform to standard error format
  }
}
```

## Testing

- **Unit tests** — mock dependencies with `Test.createTestingModule()`
- **E2E tests** — use `supertest` with a test module
- **Mock everything** — services should be testable in isolation

## Anti-Patterns

- ❌ Business logic in controllers — use services
- ❌ Direct database access in controllers — use repositories
- ❌ Circular dependencies — refactor module structure
- ❌ God modules — split large modules by domain
- ❌ Not using DTOs — always validate input


<!-- Source: SKILL.md -->

---
name: NestJS
description: >
  ContextOS skill for NestJS
---

# NestJS

## Overview
A brief summary of what the skill does and its core philosophy.

## When to Use
Context for when this skill is applicable.

## Rules & Patterns
<!-- Source: nestjs.md -->

# NestJS — Best Practices

## Module Architecture

- **One module per domain** — `UsersModule`, `AuthModule`, `OrdersModule`
- **Feature modules** — encapsulate related controllers, services, repositories
- **Shared module** — for cross-cutting concerns (logging, config, utils)
- **Core module** — singleton services (database, auth guards)

```
src/
├── modules/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── users.spec.ts
│   └── auth/
├── shared/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
├── config/
└── app.module.ts
```

## Dependency Injection

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
}
```

- Prefer constructor injection
- Use custom providers for complex setup
- Scope: default is Singleton, use REQUEST scope only when needed

## DTOs and Validation

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}
```

- Always use DTOs for request validation
- Use `ValidationPipe` globally
- Separate Create/Update/Response DTOs

## Guards, Interceptors, Pipes

| Type | Purpose |
| --- | --- |
| **Guards** | Authentication, authorization |
| **Interceptors** | Logging, transformation, caching |
| **Pipes** | Validation, transformation |
| **Filters** | Exception handling |

Execution order: Guards → Interceptors → Pipes → Handler → Interceptors → Filters

## Error Handling

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Transform to standard error format
  }
}
```

## Testing

- **Unit tests** — mock dependencies with `Test.createTestingModule()`
- **E2E tests** — use `supertest` with a test module
- **Mock everything** — services should be testable in isolation

## Anti-Patterns

- ❌ Business logic in controllers — use services
- ❌ Direct database access in controllers — use repositories
- ❌ Circular dependencies — refactor module structure
- ❌ God modules — split large modules by domain
- ❌ Not using DTOs — always validate input



## Code Examples
See `EXAMPLES.md` for detailed code examples.

## Validation Checklist
What to verify during the review phase before completing the task.

## Common Mistakes
Anti-patterns and things to explicitly avoid. See `TROUBLESHOOTING.md`.

## Integration Notes
How this skill interacts with other skills.


<!-- Source: TROUBLESHOOTING.md -->

# Troubleshooting & Common Mistakes

Add common errors, anti-patterns, and debugging steps here.


# FastAPI — Best Practices

## Project Structure

```
app/
├── main.py              # App entry, CORS, middleware
├── config.py            # Settings with Pydantic BaseSettings
├── database.py          # Database session, engine
├── models/              # SQLAlchemy models
│   ├── __init__.py
│   └── user.py
├── schemas/             # Pydantic schemas (request/response)
│   ├── __init__.py
│   └── user.py
├── api/                 # Route handlers
│   ├── __init__.py
│   ├── deps.py          # Dependency injection
│   └── v1/
│       ├── __init__.py
│       └── users.py
├── services/            # Business logic
│   └── user_service.py
├── repositories/        # Database access
│   └── user_repo.py
└── tests/
    └── test_users.py
```

## Pydantic Models

```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    
class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    
    model_config = ConfigDict(from_attributes=True)
```

## Dependency Injection

```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    # Verify token, return user
    ...
```

## Async

- **Use async** for all I/O operations (database, HTTP calls, file I/O)
- **Never block the event loop** — no sync I/O in async endpoints
- **Use `asyncio.gather`** for parallel async operations
- **Background tasks** — `BackgroundTasks` for non-critical work

## Error Handling

```python
from fastapi import HTTPException

class AppException(HTTPException):
    def __init__(self, status_code: int, detail: str, code: str):
        super().__init__(status_code=status_code, detail=detail)
        self.code = code
```

## Security

- **OAuth2 with JWT** — use `python-jose`
- **Password hashing** — bcrypt via `passlib`
- **CORS** — configure explicitly
- **Rate limiting** — use `slowapi`
- **Input validation** — Pydantic handles this automatically

## Testing

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post("/api/v1/users", json={
        "email": "test@example.com",
        "name": "Test User"
    })
    assert response.status_code == 201
```

## Anti-Patterns

- ❌ Business logic in route handlers — use services
- ❌ Raw SQL without ORM — use SQLAlchemy
- ❌ Sync database calls — use async drivers
- ❌ Hardcoded settings — use Pydantic BaseSettings
- ❌ No schema validation — always use Pydantic models

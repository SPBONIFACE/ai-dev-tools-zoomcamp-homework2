# AGENTS.md

## Commands

### Backend
- `cd backend && uv sync` - install dependencies
- `cd backend && uv run pytest` - run test suite
- `cd backend && uv run pytest tests/test_api.py` - run single test file
- `cd backend && uv run uvicorn app.main:app --reload --port 8000` - start backend server

### Frontend
- `cd frontend && npm install` - install dependencies
- `cd frontend && npm run dev` - start frontend development server
- `cd frontend && npm run build` - verify frontend build and typecheck

## Rules

- Consult `_docs/specs.md` before making any schema, endpoint, or business logic changes.
- Write tests first before implementing backend endpoint logic (TDD).
- Dependencies are added in `pyproject.toml` or `package.json`. Do not add new ones without asking.
- Keep commits atomic and reference the task/issue number (e.g. `feat(backend): ... (closes #1)`).

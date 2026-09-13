# AGENTS.md - Agentic Development Guide for TableHop

This document provides guidelines, architectural standards, and execution commands for AI coding assistants (including **Google Antigravity** and **Claude Code**). Following this guide ensures a consistent, test-driven, and harness-agnostic implementation workflow.

---

## 1. Project Principles & Methodology

1. **Spec as Single Source of Truth:**
   Always consult `_docs/specs.md` before making any schema, endpoint, or business logic changes. Never invent unapproved endpoints or field names.
2. **Contract-First & Decoupled:**
   Frontend and Backend communicate over a well-defined REST API. The frontend uses a centralized API service module (`frontend/src/services/api.ts`) that can operate in **Mock Mode** (prototype phase) and **Live API Mode** (`VITE_USE_MOCK=false`).
3. **Test-Driven Backend:**
   Write Pytest tests for API endpoints before finalizing endpoint logic. Always verify with `uv run pytest`.
4. **Harness Agnostic:**
   Avoid environment-specific hacks or proprietary agent assumptions. Use standard terminal commands (`uv`, `npm`, `git`) and standard project structures.

---

## 2. Directory Structure

```text
ai-dev-tools-zoomcamp-hw2/
├── _docs/
│   └── specs.md               # Product & API specification
├── frontend/                  # React + Vite + Tailwind CSS application
│   ├── src/
│   │   ├── components/        # UI components (QueueTable, TableGrid, AddPartyModal, etc.)
│   │   ├── services/          # api.ts (Centralized API client with mock toggle)
│   │   ├── types/             # Shared TypeScript models
│   │   ├── pages/             # HostDashboard, GuestTracker
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models & Pydantic schemas
│   │   ├── routers/           # API routes (/api/waitlist, /api/tables, etc.)
│   │   ├── services/          # Business logic (queue estimation, seating rules)
│   │   ├── database.py        # SQLite engine & session setup
│   │   └── main.py            # FastAPI app factory with CORS middleware
│   ├── tests/                 # Pytest test suite
│   │   └── test_api.py
│   └── pyproject.toml
├── AGENTS.md                  # This agent reference guide
├── README.md                  # Project overview & quickstart
└── .gitignore
```

---

## 3. Standard CLI Commands

### Frontend (Node.js)
```bash
# Install dependencies
cd frontend && npm install

# Start development server (Default: http://localhost:5173)
cd frontend && npm run dev

# Run production build / typecheck
cd frontend && npm run build
```

### Backend (Python with uv)
```bash
# Setup virtual environment and dependencies
cd backend && uv sync

# Start backend server with auto-reload (Default: http://localhost:8000)
cd backend && uv run uvicorn app.main:app --reload --port 8000

# Run automated test suite
cd backend && uv run pytest
```

---

## 4. Phase-by-Phase Development Sequence

### Phase 1: Frontend Prototype (Homework Question 4)
* Scaffold `frontend/` using Vite with React and TypeScript.
* Install Tailwind CSS and Lucide icons for a sleek, modern UI.
* Implement `frontend/src/services/api.ts` with in-memory mock state and initial seed data:
  * 3 initial waiting parties.
  * 6 predefined tables (T1–T6).
* Build the UI: Host Dashboard with Queue, Table List, Simulated SMS drawer, and the Guest Tracker route (`/waitlist/:id`).
* Verify that full queue operations (add, notify, seat, cancel) work interactively in the browser.

### Phase 2: Backend with Mock Store & Tests (Homework Question 5)
* Initialize `backend/` using `uv init --app backend`.
* Add dependencies: `uv add fastapi uvicorn[standard] pydantic pytest httpx`.
* Write tests in `backend/tests/test_api.py` validating:
  * Adding a party.
  * Auto-calculated vs manual wait time.
  * Notifying a party.
  * Seating a party at an available table.
  * Guest self-cancellation.
* Implement FastAPI routes in `app/routers/` backed initially by an in-memory dictionary.
* Ensure all pytest tests pass: `uv run pytest`.

### Phase 3: Connect Frontend and Backend (Homework Question 6)
* Enable CORS on the FastAPI backend for `http://localhost:5173`.
* Switch `frontend/src/services/api.ts` from mock mode to HTTP calls targeting `http://localhost:8000`.
* Test end-to-end data persistence across browser reloads.

### Phase 4: Database Integration (Homework Question 7)
* Add SQLAlchemy: `cd backend && uv add sqlalchemy`.
* Create SQLite database connection in `app/database.py`.
* Implement SQLAlchemy models for `Party`, `Table`, and `NotificationLog`.
* Swap the in-memory store in routers with SQLAlchemy sessions.
* Verify existing test suite passes and add tests for database persistence: `uv run pytest`.

---

## 5. Agent Best Practices
* **Keep Changes Contiguous:** Prefer small, atomic edits over wholesale file overwrites.
* **Preserve Contracts:** Do not rename fields or modify endpoint return signatures without updating `_docs/specs.md`.
* **Zero Guesswork:** If a requirement or edge case is ambiguous, consult `_docs/specs.md` or ask for clarification.

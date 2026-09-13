# TableHop Backlog

This backlog breaks down the remaining TableHop implementation into independent, test-driven tasks following the course methodology and Homework 2 requirements.

---

## 1. Setup empty backend project with a passing test
Goal: Initialize the backend workspace with uv and establish a green test suite.
Description: Initialize `backend/` using `uv init --app backend` and add `fastapi`, `uvicorn[standard]`, `pytest`, and `httpx`. Create a minimal root health check route (`GET /health`) and verify with a passing Pytest test in `backend/tests/test_api.py`.

## 2. Define Pydantic schemas for Waitlist, Tables, and Notifications
Goal: Establish data validation schemas matching `_docs/specs.md`.
Description: Define Pydantic models for `Party`, `Table`, `NotificationLog`, and `AnalyticsSummary` in `app/models/schemas.py`. Include status enums (`waiting`, `notified`, `seated`, `cancelled`, `no_show`) and validation models for party intake and status updates.

## 3. Test and implement Waitlist endpoints with in-memory store
Goal: Deliver core queue intake, retrieval, and guest cancellation endpoints.
Description: Write Pytest tests first for `GET /api/waitlist`, `POST /api/waitlist` (validating auto-calculated vs manual wait time), `GET /api/waitlist/{id}`, and `POST /api/waitlist/{id}/cancel`. Implement the router in `app/routers/waitlist.py` backed by an in-memory dictionary until all tests pass.

## 4. Test and implement Table management and seating endpoints
Goal: Enable table matching, party seating, and table clearing operations.
Description: Write Pytest tests verifying that `POST /api/tables/{id}/seat` assigns an available table to a party and marks both as occupied/seated, and `POST /api/tables/{id}/clear` frees the table. Implement `app/routers/tables.py` pre-seeded with tables T1–T6 to satisfy the test assertions.

## 5. Test and implement Notification and Analytics endpoints
Goal: Support simulated SMS alert dispatch and dashboard KPI metrics.
Description: Write Pytest tests for `POST /api/waitlist/{id}/notify` (verifying status transition to `notified` and creation of an SMS log) and `GET /api/analytics/summary` (calculating active queue count and average wait). Implement the endpoints and verify that the full test suite remains green.

## 6. Connect Frontend and Backend with CORS (HW2 Question 6)
Goal: Wire the React frontend to communicate with the live FastAPI backend.
Description: Configure CORS middleware in `app/main.py` allowing requests from `http://localhost:5173`. Switch `frontend/src/services/api.ts` from mock mode to live HTTP fetch calls targeting `http://localhost:8000`, verifying live queue additions and status updates.

## 7. Integrate SQLite database with SQLAlchemy ORM (HW2 Question 7)
Goal: Replace in-memory storage with persistent SQLite database models.
Description: Set up SQLite engine and session factory in `app/database.py` and create SQLAlchemy ORM models for `Party`, `Table`, and `NotificationLog`. Refactor route handlers to inject database sessions, pre-seed tables on startup, and verify all tests pass with `uv run pytest`.

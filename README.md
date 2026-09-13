# TableHop 🍽️

> A sleek, responsive restaurant waitlist management tool built with an AI-assisted, spec-first methodology.

TableHop streamlines front-of-house hospitality operations by enabling hosts to manage walk-in queues, match parties to available tables, trigger simulated SMS arrival alerts, and provide guests with real-time mobile queue tracking.

Built as part of **Homework 2** of the **AI Dev Tools Zoomcamp** by DataTalksClub.

---

## 🌟 Key Features (Phase 1 MVP)

* **Host Operations Console:** Real-time queue view with status badges (`Waiting`, `Notified`, `Seated`, `Cancelled`, `No-Show`).
* **Intelligent Wait Times:** Auto-suggests estimated wait time based on queue length (~10 min per party ahead) with host manual override.
* **Table Matching & Management:** Pre-configured tables (T1–T6 for 2, 4, and 6 guests); easily assign tables to waiting parties and clear tables when guests depart.
* **Simulated SMS Notifications:** In-app simulated SMS alerts with a timestamped notification log drawer.
* **Live Mobile Guest View (`/waitlist/:id`):** Mobile-first tracking page for guests showing queue position and estimated wait time, with an instant "Leave Line" cancellation button.
* **Real-time KPI Metrics:** Host dashboard stats including Active Queue, Average Wait Time, and Total Parties Seated Today.

---

## 🏗️ Architecture & Tech Stack

```text
TableHop Architecture
├── Frontend: React (v18+) + TypeScript + Vite + Tailwind CSS (Port 5173)
│   └── Centralized API client (mock-first, toggles to FastAPI)
└── Backend: FastAPI + Python 3.11+ + uv (Port 8000)
    ├── SQLite + SQLAlchemy ORM
    └── Pytest Test Suite
```

---

## 🚀 Quickstart

### Prerequisites
* **Node.js** (v18+) and `npm`
* **Python** (3.11+) and `uv`

### 1. Backend Setup
```bash
# Start backend server with auto-reload (Default: http://localhost:8000)
make run
# Or: cd backend && make run (or uv run uvicorn app.main:app --reload --port 8000)
```
* The backend API and interactive Swagger docs will be accessible at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# Start frontend development server (Default: http://localhost:5173)
make run-frontend
# Or: cd frontend && npm run dev
```
* The frontend will be accessible at: `http://localhost:5173`

### 3. Running Backend Tests
```bash
make test
# Or: cd backend && uv run pytest
```


---

## 📚 Project Documentation

* [Product & API Specification](_docs/specs.md)
* [Engineering Process & Roles](_docs/process.md)
* [Task Backlog & Acceptance Criteria](_docs/tasks.md)
* [Testing Guidelines](_docs/testing-guidelines.md)
* [Design System](_docs/design-system.md)
* [Agent Development Guide (AGENTS.md)](AGENTS.md)
* [Homework Instructions](homework.md)


---

## 🤖 Harness-Agnostic AI Development

This repository is designed to be completely harness-agnostic. Both **Google Antigravity** and **Claude Code** follow the conventions established in [AGENTS.md](AGENTS.md) and [specs.md](_docs/specs.md) to implement and test features iteratively without vendor lock-in.

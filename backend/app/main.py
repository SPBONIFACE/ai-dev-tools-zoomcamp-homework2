from fastapi import FastAPI
from app.routers import waitlist, tables, notifications, analytics

app = FastAPI(
    title="TableHop API",
    description="Restaurant Waitlist & Table Management API",
    version="0.1.0",
)

app.include_router(waitlist.router)
app.include_router(tables.router)
app.include_router(notifications.router)
app.include_router(analytics.router)



@app.get("/health")
def health_check():
    return {"status": "ok", "service": "TableHop API"}


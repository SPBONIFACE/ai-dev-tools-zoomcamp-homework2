from fastapi import FastAPI

app = FastAPI(
    title="TableHop API",
    description="Restaurant Waitlist & Table Management API",
    version="0.1.0",
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "TableHop API"}

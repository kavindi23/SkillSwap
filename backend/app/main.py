from fastapi import FastAPI
from app.routers import (
    active_exchange,
    auth,
    dashboard,
    exchanges,
    matches,
    reviews,
    session,
    skills,
    users,
    notifications,
    admin
)

from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillSwap API",
    description="Smart Peer-to-Peer Skill Exchange Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(skills.router, prefix="/api")
app.include_router(matches.router, prefix="/api")
app.include_router(exchanges.router, prefix="/api")
app.include_router(active_exchange.router, prefix="/api")
app.include_router(session.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Welcome to SkillSwap API 🚀"
    }
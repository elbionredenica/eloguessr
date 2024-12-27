from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import Base, engine, get_db, create_tables
from backend.routers import games
from backend import models
import os

create_tables()

app = FastAPI()

# CORS middleware
origins = [
    "http://localhost:3000",
    "http://138.197.29.99"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(games.router)


@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}


@app.on_event("startup")
async def startup():
    """Connect to the database on startup."""
    print("Starting up...")


@app.on_event("shutdown")
async def shutdown():
    """Disconnect from the database on shutdown."""
    print("Shutting down...")

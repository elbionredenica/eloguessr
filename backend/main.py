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
    "http://localhost:3000",  # Add your frontend origin here
    # Add other allowed origins if necessary
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
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

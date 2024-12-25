from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db
from backend.services.game_service import (
    get_initial_game_data,
    verify_elo_guess,
    get_elo_by_uuid
)
import uuid

router = APIRouter(
    prefix="/games",
    tags=["games"],
)


@router.get("/random", response_model=schemas.InitialGameData)
async def get_random_game_endpoint(db: Session = Depends(get_db)):
    """Retrieves initial data for a random game."""
    initial_data = get_initial_game_data(db)
    if initial_data is None:
        raise HTTPException(status_code=404, detail="No games found")
    return initial_data


@router.post("/{game_uuid}/guess", response_model=schemas.Score)
async def verify_guess_endpoint(
    game_uuid: str, elo_guess: schemas.EloGuess, db: Session = Depends(get_db)
):
    """Verifies the Elo guess and returns the score."""
    try:
        game_id = uuid.UUID(game_uuid)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid game UUID")

    score = verify_elo_guess(db, game_id, elo_guess)
    if score is None:
        raise HTTPException(status_code=404, detail="Game not found")

    return {"score": score}


@router.get("/{game_uuid}/elo", response_model=schemas.EloReveal)
async def get_elo_endpoint(game_uuid: str, db: Session = Depends(get_db)):
    """Retrieves the Elo ratings for a game after the guess is made."""
    try:
        game_id = uuid.UUID(game_uuid)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid game UUID")

    elo_reveal = get_elo_by_uuid(db, game_id)
    if elo_reveal is None:
        raise HTTPException(status_code=404, detail="Game not found")

    return elo_reveal

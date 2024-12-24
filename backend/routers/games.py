from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db
from backend.services.game_service import get_random_game, get_game_details_by_id

router = APIRouter(
    prefix="/games",
    tags=["games"],
)


@router.get("/random", response_model=schemas.Game)
async def get_random_game_endpoint(db: Session = Depends(get_db)):
    """Retrieves a random game from the database."""
    game = get_random_game(db)
    if game is None:
        raise HTTPException(status_code=404, detail="No games found")
    return game


@router.get("/{game_id}", response_model=schemas.GameDetails)
async def get_game_details_endpoint(game_id: int, db: Session = Depends(get_db)):
    """Retrieves details for a specific game."""
    game_details = get_game_details_by_id(db, game_id)
    if game_details is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return game_details

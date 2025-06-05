from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import schemas
from .hashing import verify_password
from ..users import crud as users_crud
from ..database import get_db

from . import crud
from .models import RefreshToken
from datetime import datetime, timedelta, timezone

router = APIRouter()


@router.post("/token", response_model=schemas.TokenResponse, status_code=status.HTTP_200_OK)
def login_for_access_token(user_token: schemas.TokenRequest, db: Session = Depends(get_db)):

    db_user = users_crud.get_user_by_username(db, user_token.username)

    if not db_user or not verify_password(user_token.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    token = crud.create_tokens(db, db_user.id)

    if token is None:
        raise HTTPException(
            status_code=500,
            detail="Database error saving refresh token."
        )
    
    return token


@router.post("/token/refresh", response_model=schemas.TokenResponse)
def refresh_access_token(refresh_request: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):

    token_str = refresh_request.refresh_token

    refresh_token = crud.get_refresh_token(db, token_str)

    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token."
        )

    if refresh_token is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired."
        )
    
    return refresh_token
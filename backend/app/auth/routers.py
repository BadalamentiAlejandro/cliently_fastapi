from fastapi import APIRouter, Depends, HTTPException, Response, status, Cookie
from sqlalchemy.orm import Session

from . import schemas
from .hashing import verify_password
from ..users import crud as users_crud
from ..database import get_db
from .jwt_handler import verify_jwt

from . import crud
from .models import RefreshToken
from datetime import datetime, timedelta, timezone

router = APIRouter()


@router.post("/token", response_model=schemas.TokenResponse, status_code=status.HTTP_200_OK)
def login_for_access_token(user_token: schemas.TokenRequest, db: Session = Depends(get_db), response: Response = None):

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
    
    response.set_cookie(
        key='access_token',
        value=token.access_token,
        httponly=True,
        secure=True,
        samesite='lax',
        max_age= 5 * 60 * 60 # 5 horas.
    )

    response.set_cookie(
        key="refresh_token",
        value=token.refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=5 * 60 * 60   # 5 horas
    )
    
    return {
        'access_token': token.access_token,
        'token_type': 'bearer',
    }


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


@router.post("/token/logout")
def logout(response: Response):
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return {'message': 'Logout successful'}


@router.get("/token/verify")
def verify_access_token(access_token: str = Cookie(None)):
    """
    Endpoint para verificar si el access_token enviado por cookie es válido.
    Devuelve 200 OK si es válido, 401 si no lo es o no existe.
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token missing."
        )

    try:
        # verify_jwt ya está importada desde jwt_handler
        payload = verify_jwt(access_token)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token."
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    return {"message": "Token is valid."}
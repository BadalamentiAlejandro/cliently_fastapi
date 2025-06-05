import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from ..settings import JWT_REFRESH

from . import models
from . import schemas
from . import jwt_handler
import uuid
from datetime import datetime, timezone, timedelta


def create_tokens(db: Session, user_id: int):

    try:
        # Crear access token
        access_token = jwt_handler.create_jwt(user_id)

        # Crear refresh token como UUID string
        refresh_token_str = str(uuid.uuid4())

        # Fecha de expiración
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=JWT_REFRESH)

        # Crear modelo y guardar en DB
        new_refresh = models.RefreshToken(
            token=refresh_token_str,
            expires_at=expires_at,
            revoked_at=expires_at,
            is_active=True,
            user_id=user_id
        )

        db.add(new_refresh)
        db.commit()
        db.refresh(new_refresh)

        return schemas.TokenResponse(
            access_token=access_token,
            token_type="bearer",
            refresh_token=refresh_token_str
        )

    except SQLAlchemyError:
        db.rollback()
        return None
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error generating token: {e}")
        raise


def get_refresh_token(db: Session, token_str: str):

    db_token = db.query(models.RefreshToken).filter_by(token=token_str, is_active=True).first()

    if db_token is None:
        return None

    expires = db_token.expires_at.replace(tzinfo=timezone.utc)
    if expires < datetime.now(timezone.utc):
        db_token.is_active = False
        db.commit()
        return False

    # Crear nuevo access token
    access_token = jwt_handler.create_jwt(db_token.user_id)

    return schemas.TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )
import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .jwt_handler import verify_jwt
from ..users import crud as users_crud
from ..users.models import User
from ..database import get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:

    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credenials"
    )

    try:
        payload = verify_jwt(token)
        user_id = payload.get("sub")

        if user_id is None:
            raise credential_exception
    
    except Exception as e:
        logging.error(f"Error verifying token JWT: {e}")
        raise credential_exception

    user = users_crud.get_user_by_id(db, int(user_id))

    if user is None:
        raise credential_exception
    
    return user


async def require_admin(current_user: User = Depends(get_current_user)):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation requires admin."
        )
    return current_user
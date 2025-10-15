import logging
from typing import List
from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.orm import Session

from .jwt_handler import verify_jwt
from ..users import crud as users_crud
from ..users.models import User
from ..database import get_db


async def get_current_user(access_token: str = Cookie(None), db: Session = Depends(get_db)) -> User:

    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credenials"
    )

    try:
        payload = verify_jwt(access_token)
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


def require_roles(allowed_roles: List[str]):

    def role_checker(user: User = Depends(get_current_user)):

        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions."
            )
        
        return user
    
    return role_checker
    


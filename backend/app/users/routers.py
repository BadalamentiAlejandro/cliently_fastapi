from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import schemas
from . import crud
from ..auth.dependencies import require_roles

from ..database import get_db


router = APIRouter()


@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: schemas.UserCreate, db: Session = Depends(get_db), user: schemas.User = Depends(require_roles(["admin"]))):

    if not user_data.username or user_data.username.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User must have a username and a password with at least 8 characters."
        )
    
    if not user_data.password or user_data.password.strip() == "" or len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User must have a username and a password with at least 8 characters."
        )

    user_data.username = user_data.username.strip()

    new_user = crud.create_user(db, user_data)

    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with name {user_data.username} already exists in database."
        )
    
    return new_user


@router.get("/", response_model=List[schemas.User], status_code=status.HTTP_200_OK)
def get_users_list(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), user: schemas.User = Depends(require_roles(["admin"]))):

    db_users_list = crud.get_users_list(db, skip, limit)

    return db_users_list


@router.get("/{username}", response_model=schemas.User, status_code=status.HTTP_200_OK)
def get_user(username: str, db: Session = Depends(get_db), user: schemas.User = Depends(require_roles(["admin"]))):

    db_user = crud.get_user_by_username(db, username)

    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {username} not found in database."
        )
    
    return db_user


@router.put("/{username}", response_model=schemas.User, status_code=status.HTTP_200_OK)
def update_user(username: str, update_data: schemas.UserUpdate, db: Session = Depends(get_db), user: schemas.User = Depends(require_roles(["admin"]))):

    username = username.strip()

    if update_data.username:
        update_data.username.strip()

    db_user_update = crud.update_user(db, username, update_data)

    if db_user_update is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {username} not found in database."
        )
    
    if db_user_update is False:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with {username} already exists in database."
        )
    return db_user_update

@router.delete("/{username}", response_model=schemas.Message, status_code=status.HTTP_200_OK)
def delete_user(username: str, db: Session = Depends(get_db), user: schemas.User = Depends(require_roles(["admin"]))):

    username = username.strip()

    db_user_delete = crud.delete_user(db, username)

    if db_user_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {username} not found in database."
        )
    
    message = {"message": "User successfully removed from database."}

    return message
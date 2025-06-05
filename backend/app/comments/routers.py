from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import schemas
from . import crud
from ..auth.dependencies import get_current_user
from ..users import schemas as users_schemas

from ..database import get_db


router = APIRouter()


@router.post("/", response_model=schemas.Comment, status_code=status.HTTP_201_CREATED)
def create_comment(client_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db), user: users_schemas.User = Depends(get_current_user)):

    if not comment.text or comment.text.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Comment cannot be empty."
        )

    db_comment = crud.create_comment(db, comment, client_id)

    if db_comment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID: {client_id} not found."
        )

    return db_comment


@router.get("/", response_model=List[schemas.Comment], status_code=status.HTTP_200_OK)
def get_comments(client_id: int, skip: int=0, limit: int=20, db: Session = Depends(get_db), user: users_schemas.User = Depends(get_current_user)):

    db_comments = crud.get_comments(db, client_id, skip, limit)
    return db_comments


@router.put("/{comment_id}", response_model=schemas.Comment, status_code=status.HTTP_200_OK)
def update_comment(comment_id: int, comment_updated: schemas.CommentUpdate, db: Session = Depends(get_db), user: users_schemas.User = Depends(get_current_user)):

    comment_update = crud.update_comment(db, comment_id, comment_updated)

    if comment_update is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found."
        )

    return comment_update


@router.delete("/{comment_id}", response_model=schemas.Message, status_code=status.HTTP_200_OK)
def delete_comment(comment_id: int, db: Session = Depends(get_db), user: users_schemas.User = Depends(get_current_user)):

    comment_delete = crud.delete_comment(db, comment_id)

    if comment_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found."
        )
    
    message = {"message": "Comment successfully deleted."}

    return message
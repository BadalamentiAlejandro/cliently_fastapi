import logging
from sqlalchemy.orm import Session

from . import models
from . import schemas

from ..clients.crud import get_client





def create_comment(db: Session, comment: schemas.CommentCreate, client_id: int):

    try:
        db_client = get_client(db, client_id)
        if db_client is None:
            return None
        
        db_comment = models.Comment(**comment.model_dump(), client_id=client_id)
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment

    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in create_comment: {e}")
        raise


def get_comments(db: Session, client_id: int, skip: int=0, limit: int=20):

    try:
        db_comments = db.query(models.Comment).filter(models.Comment.client_id == client_id).offset(skip).limit(limit).all()
        return db_comments
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error getting comments: {e}")
        raise


def get_comment(db: Session, comment_id: int):

    try:
        db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
        return db_comment
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error getting commment: {e}")


def update_comment(db: Session, comment_id: int, updated_comment: schemas.CommentUpdate):

    try:
        db_comment = get_comment(db, comment_id)
        if db_comment is None:
            return None
        
        for key, value in updated_comment.model_dump(exclude_unset=True).items():
            setattr(db_comment, key, value)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error updating comment: {e}")



def delete_comment(db: Session, comment_id: int):

    try:
        db_comment = get_comment(db, comment_id)
        if db_comment:
            db.delete(db_comment)
            db.commit()
            return db_comment
        return None
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in delete_comment: {e}")
        raise
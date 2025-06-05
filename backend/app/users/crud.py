import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from . import models
from . import schemas
from ..auth.hashing import hash_password


def create_user(db: Session, user: schemas.UserCreate):

    hashed_password = hash_password(user.password)

    user.password = hashed_password

    db_user = models.User(**user.model_dump())

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    # fastAPI checkea mediante esta excepcion si hay un usuario duplicado.
    # También se puede hacer de forma manual llamando al método get_user_by_username, dando así mas control.
    except IntegrityError:
        db.rollback()
        return None
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in create_user: {e}")
        raise


def get_users_list(db: Session, skip: int = 0, limit: int = 20):

    try:
        users = db.query(models.User).offset(skip).limit(limit).all()
        return users
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in get_users_list: {e}")
        raise


def get_user_by_username(db: Session, username: str):

    try:
        db_user = db.query(models.User).filter(func.lower(models.User.username) == username.lower()).first()
        return db_user
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in get_user: {e}")
        raise


def get_user_by_id(db: Session, user_id: int):

    try:
        db_user = db.query(models.User).filter(models.User.id == user_id).first()
        return db_user
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in get_user: {e}")
        raise


def update_user(db: Session, username: str, user_update: schemas.UserUpdate):

    try:
        db_user = get_user_by_username(db, username)

        if db_user is None:
            return None
        
        for key, value in user_update.model_dump(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    except IntegrityError:
        db.rollback()
        return False
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in update_user: {e}")
        raise


def delete_user(db: Session, username: str):

    try:
        db_user = get_user_by_username(db, username)

        if db_user is None:
            return None
        
        db.delete(db_user)
        db.commit()
        return True
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in delete_user: {e}")
        raise
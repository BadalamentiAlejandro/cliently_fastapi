import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from . import models
from . import schemas


def create_client(db: Session, client: schemas.ClientCreate):

    db_client = models.Client(**client.model_dump())

    try:
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
    
    except IntegrityError:
        db.rollback()
        return None
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in create_client: {e}")
        raise


def get_clients_list(db: Session):

    try:
        clients = db.query(models.Client).filter(models.Client.is_active == True)
        return clients
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in get_clients_list: {e}")
        raise


def get_client(db: Session, name: str):
        
    try: # func.lower() ayuda a pasar por alto case-senitive. Los schemas de pydantic no tienen .lower() directo
        client = db.query(models.Client).filter(func.lower(models.Client.name) == name.lower()).first()
        return client

    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in get_client: {e}")
        raise


def update_client(db: Session, name: str, client_update: schemas.ClientUpdate):
    
    try:
        client = get_client(db, name)

        if client is None:
            return None

        for key, value in client_update.model_dump(exclude_unset=True).items():
            setattr(client, key, value)
        db.commit()
        db.refresh(client)
        return client
    
    except IntegrityError:
        db.rollback()
        return False
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in update_client: {e}")
        raise


def delete_client(db: Session, name: str):
     
    try:
        client = get_client(db, name)

        if client is None:
            return None
        
        client.is_active = False
        db.commit()
        db.refresh(client)
        return client
    
    except Exception as e:
        db.rollback()
        logging.error(f"Unexpected error in delete_client: {e}")
        raise

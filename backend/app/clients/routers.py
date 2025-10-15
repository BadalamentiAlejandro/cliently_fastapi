from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import schemas
from . import crud
from ..auth.dependencies import require_roles
from ..users import schemas as users_schemas

from ..database import get_db


router = APIRouter()


@router.post("/", response_model=schemas.Client, status_code=status.HTTP_201_CREATED)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db), user: users_schemas.User = Depends(require_roles(["admin", "responsible", "operator"]))):

    # Validación manual nombre vacío.
    if not client.name or client.name.strip() == "":        
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Client must have a name."
        )
    
    client.name = client.name.strip()
    
    db_client = crud.create_client(db, client)

    if db_client is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Client with name {client.name} already exists in database."
        )
    
    return db_client
    

@router.get("/", response_model=List[schemas.Client], status_code=status.HTTP_200_OK)
def get_clients(db: Session = Depends(get_db), user: users_schemas.User = Depends(require_roles(["admin", "responsible", "operator", "regular"]))):

    clients_list = crud.get_clients_list(db)

    return clients_list
    

@router.get("/{name}", response_model=schemas.Client, status_code=status.HTTP_200_OK)
def get_client(name: str, db: Session = Depends(get_db), user: users_schemas.User = Depends(require_roles(["admin", "responsible", "operator", "regular"]))):

    db_client = crud.get_client(db, name)

    if db_client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Client not found."
        )
    
    return db_client
    

@router.put("/{name}", response_model=schemas.Client, status_code=status.HTTP_200_OK)
def update_client(name: str, client_update: schemas.ClientUpdate, db: Session = Depends(get_db), user: users_schemas.User = Depends(require_roles(["admin", "responsible", "operator"]))):

    name = name.strip()

    db_client = crud.update_client(db, name, client_update)

    if db_client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Client not found"
        )
    
    if db_client is False:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Client with name {client_update.name} already exists in database."
        )

    return db_client
    

@router.delete("/{name}", response_model=schemas.Message, status_code=status.HTTP_200_OK)
def delete_client(name: str, db: Session = Depends(get_db), user: users_schemas.User = Depends(require_roles(["admin", "responsible"]))):

    name = name.strip()
    
    db_client = crud.delete_client(db, name)

    if db_client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Client not found."
        )
    
    message = {"message": "Client removed successfully."}
    
    return message
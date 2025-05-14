from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from . import schemas
from . import models

from ..database import get_db


router = APIRouter()


@router.post("/", response_model=schemas.Client, status_code=status.HTTP_201_CREATED)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    # Validación manual nombre vacío
    if client.name == "":
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="El cliente debe tener un nombre."
        )
    # Validación manual nombre
    if db.query(models.Client).filter(models.Client.name == client.name).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Ya existe un cliente con el nombre {client.name}."
        )
    # Validación manual email
    if client.email and db.query(models.Client).filter(models.Client.email == client.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Ya existe un cliente con el email {client.email}."
        )
    
    client_db = models.Client(**client.model_dump())
    try:
        db.add(client_db)
        db.commit()
        db.refresh(client_db)
        return client_db
    except HTTPException as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error en la base de datos al crear el cliente."
        )
    

@router.get("/", response_model=List[schemas.Client], status_code=status.HTTP_200_OK)
def read_clients(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    try:
        clients_db_list = db.query(models.Client).offset(skip).limit(limit).all()
        return clients_db_list
    except HTTPException as e:
        print(f"Error inesperado al listar clientes: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error inesperado en la lectura de clientes."
        )
    

@router.get("/{client_id}", response_model=schemas.Client, status_code=status.HTTP_200_OK)
def read_client(client_id: int, db: Session = Depends(get_db)):
    client_db = db.query(models.Client).filter(models.Client.id == client_id).first()
    if client_db is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No se ha podido encontrar el cliente.")
    try:
        return client_db
    except HTTPException as e:
        print(f"Error inesperado al buscar al cliente por ID: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error inesperado al buscar al cliente por ID"
        )
    

@router.put("/{client_id}", response_model=schemas.Client, status_code=status.HTTP_200_OK)
def update_client(client_id: int, client_update: schemas.ClientUpdate, db: Session = Depends(get_db)):
    client_db = db.query(models.Client).filter(models.Client.id == client_id).first()
    if client_db is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se ha podido encontrar el cliente")
    
    data = client_update.model_dump(exclude_unset=True)
    
    # Validación manual para no repetir nombre.
    if "name" in data:
        exists = (
            db.query(models.Client.id).filter(models.Client.name == data["name"])
            .filter(models.Client.id != client_id)
            .first()
        )
        if exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe otro cliente con el nombre {data['name']}."
            )

    # Validación manual para no repetir email.
    if "email" in data and data["email"] is not None:
        exists = (db.query(models.Client.id)
                  .filter(models.Client.email == data["email"])
                  .filter(models.Client.id != client_id).first()
        )
        if exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe otro cliente con el email {data['email']}."
            )

    try:
        for key, value in data.items():
            setattr(client_db, key, value)
        db.commit()
        db.refresh(client_db)
        return client_db
    except Exception as e:
        db.rollback()
        print(f"Error inesperado al modifical al cliente: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error inesperado al modifical al cliente"
        )
    

@router.delete("/{client_id}", response_model=schemas.Message, status_code=status.HTTP_200_OK)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client_db = db.query(models.Client).filter(models.Client.id == client_id).first()
    if client_db is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se ha podido encontrar el cliente")
    try:
        db.delete(client_db)
        db.commit()
        return {"message": "Cliente eliminado correctamente"}
    except Exception as e:
        db.rollback()
        print(f"Error inesperado al eliminar el cliente: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error inesperado al eliminar el cliente"
        )
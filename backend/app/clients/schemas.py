from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ClientBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class Message(BaseModel):
    message: str
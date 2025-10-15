from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ClientBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = True


class ClientCreate(ClientBase):
    pass


class ClientUpdate(ClientBase):
    name: Optional[str]
    pass


class Client(ClientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Message(BaseModel):
    message: str
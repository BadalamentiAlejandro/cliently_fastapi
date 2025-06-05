from datetime import datetime
from pydantic import BaseModel


class CommentBase(BaseModel):
    text: str


class CommentCreate(CommentBase):
    pass


class CommentUpdate(CommentBase):
    pass


class Comment(CommentBase):
    id: int
    created_at: datetime
    client_id: int

    class Config:
        from_attributes = True


class Message(BaseModel):
    message: str
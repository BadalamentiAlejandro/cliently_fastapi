from sqlalchemy import Column, Integer, String, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (CheckConstraint("char_length(username) > 0", name="username_not_empty"), CheckConstraint("char_length(password) >= 8", name="password_not_empty"))

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="regular", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    comments = relationship("Comment", back_populates="creator")

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"
    
    
# En este caso es necesario hacer una migración para poder lidiar con el problema de case-sensitive en cuanto a la creación de usuarios y mismo de clientes. La idea es que sea case-insensitive.
# Para esto hacemos una migración vacía y modificamos el "upgrade" con:

#     op.execute(
#         "CREATE UNIQUE INDEX unique_lower_username ON users (LOWER(username));"
#     )
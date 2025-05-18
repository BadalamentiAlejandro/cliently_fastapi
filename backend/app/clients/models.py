from sqlalchemy import Column, Integer, String, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base

class Client(Base):
    __tablename__ = "clients"
    __table_args__ = (CheckConstraint("char_length(name) > 0", name="name_not_empty"),) # Obliga a que el campo no este vacío a nivel modelo.

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, index=True, nullable=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    comments = relationship("Comment", back_populates="client", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Client(id={self.id}, name='{self.name}')>"
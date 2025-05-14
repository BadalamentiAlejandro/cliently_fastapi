from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)

    client = relationship("Client", back_populates="comments")

    def __repr__(self):
        return f"<Comment(id={self.id}, client_id={self.client_id})>"
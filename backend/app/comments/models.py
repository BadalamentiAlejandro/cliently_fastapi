from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timezone
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = (CheckConstraint("char_length(text) > 0", name="text_not_empty"),) # Obliga a que el campo no este vacío a nivel modelo.

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    client = relationship("Client", back_populates="comments")

    creator = relationship("User", back_populates="comments")

    def __repr__(self):
        return f"<Comment(id={self.id}, text='{self.text[:20]}...', client_id={self.client_id}, user_id={self.user_id})>"
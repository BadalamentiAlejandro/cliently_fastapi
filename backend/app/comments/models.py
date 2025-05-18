from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = (CheckConstraint("char_length(text) > 0", name="text_not_empty"),) # Obliga a que el campo no este vacío a nivel modelo.

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)

    client = relationship("Client", back_populates="comments")

    def __repr__(self):
        return f"<Comment(id={self.id}, client_id={self.client_id})>"
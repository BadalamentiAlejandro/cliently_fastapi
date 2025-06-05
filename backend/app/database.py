import os
from .settings import DATABASE_URL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


DATABASE_URL = DATABASE_URL
if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en las variables de entorno.")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from .clients import models as client_models
from .comments import models as comment_models
from .users import models as user_models
from .auth import models as auth_models

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
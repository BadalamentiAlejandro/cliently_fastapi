import os
from dotenv import load_dotenv

load_dotenv()


HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
DATABASE = os.getenv("DATABASE")
DATABASE_URL = os.getenv("DATABASE_URL")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRATION = int(os.getenv("JWT_EXPIRATION"))
JWT_REFRESH = int(os.getenv("JWT_REFRESH"))

BCRYPT_SALT_ROUNDS = int(os.getenv("BCRYPT_SALT_ROUNDS"))

EMAIL_REGEX_PATTERN = os.getenv("EMAIL_REGEX_PATTERN")

if not DATABASE_URL:
    raise EnvironmentError("Error: La variable de entorno DATABASE_URL no está configurada.")
if not JWT_SECRET:
     raise EnvironmentError("Error: La variable de entorno JWT_SECRET no está configurada.")
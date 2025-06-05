import jwt
import datetime
from datetime import timezone

from ..settings import JWT_EXPIRATION, JWT_SECRET


def create_jwt(user_id: int, expiration_minutes: int = JWT_EXPIRATION) -> str:

    expire = datetime.datetime.now(timezone.utc) + datetime.timedelta(minutes=expiration_minutes)

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token


def verify_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    
    except jwt.ExpiredSignatureError:
        raise

    except jwt.InvalidTokenError:
        raise
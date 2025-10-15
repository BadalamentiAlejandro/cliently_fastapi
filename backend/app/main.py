import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Crear la instancia de la aplicacion FastAPI
app = FastAPI(
    title="Cliently API", # Titulo para la documentacion OpenAPI
    description="API para gestionar clientes y comentarios", # Descripcion
    version="0.1.0", # Version de la API
    debug = True,
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    
    # Docker
    "http://localhost:3000",
    "http://frontend:3000",
    "http://backend:8000",
]

app.add_middleware (
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
    # allow_headers=["Accept", "Authorization", "Content-Type"] # En producción
)

from .clients import routers as clients_router
from .comments import routers as comments_router
from .users import routers as users_router
from .auth import routers as auth_router
app.include_router(clients_router.router, prefix="/api/clients", tags=["clients"])
app.include_router(comments_router.router, prefix="/api/clients/{client_id}/comments", tags=["comments"])
app.include_router(users_router.router, prefix="/api/users", tags=["users"])
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cliently FastAPI backend!"}


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

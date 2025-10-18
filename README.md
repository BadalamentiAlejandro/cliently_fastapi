# Cliently_fastAPI

Cliently is a personal project based on learning to use the fastAPI framework.



## Running on local machine
In backend/app/main.py uncomment last lines.

To run app in local, alembic migrations must be excecuted in order to have the database prepared for it. Remember that some environmental variables differ in local and Docker.

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload





# 🧠 Guía rápida de desarrollo con Docker

## 🚀 Primer inicio
Construye y levanta todos los servicios (base de datos, backend y frontend):
```bash
docker-compose up --build
🔁 Levantar contenedores en segundo plano
Para seguir usando la terminal mientras los servicios están activos:

bash
docker-compose up -d
Esto deja todo corriendo en background.


🧩 Detener los contenedores
bash
docker-compose down
Si se quiere borrar los volúmenes (por ejemplo, reiniciar la base de datos):

bash
docker-compose down -v


⚙️ Migraciones Alembic
Ejecutar dentro del contenedor backend:

bash
docker exec -it cliently_fastapi_backend alembic revision --autogenerate -m "mensaje"
docker exec -it cliently_fastapi_backend alembic upgrade head


🪶 Ver logs
Ver logs en tiempo real del backend:

bash
docker-compose logs -f backend
Ver logs en tiempo real del frontend:

bash
docker-compose logs -f frontend
Ver logs de todos los servicios:

bash
docker-compose logs -f


🧹 Reconstruir imágenes si cambian dependencias
Por ejemplo, modificar requirements.txt o package.json:

bash
docker-compose up --build -d
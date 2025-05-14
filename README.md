# Cliently_fastAPI

Cliently is a personal project based on learning to use the fastAPI framework.


## Running on Docker Engine
While in the main directory, run:
```bash
docker-compose up --build
```


## Running on local machine
In backend/app/main.py uncomment:

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

To run app in local, alembic migrations must be excecuted in order to have the database prepared for it. Remember that DB_HOST differs in local and Docker.
# Cliently_fastAPI

Cliently is a personal project based on learning to use the fastAPI framework.


## Running on Docker Engine
While in the main directory, run:
```bash
docker-compose up --build
```


## Running on local machine
In backend/app/main.py uncomment last lines.

To run app in local, alembic migrations must be excecuted in order to have the database prepared for it. Remember that some environmental variables differ in local and Docker.
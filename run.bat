@echo off
echo ===== Iniciando aplicación Cliently =====

REM Ruta a Git Bash
set GITBASH="C:\Program Files\Git\bin\bash.exe"

REM Ruta a tu proyecto (usar / en vez de \)
set PROJECT_PATH=/c/Users/badal/AllThereIs/cliently_fastapi

REM Levantar DB (Postgres ya debería estar corriendo como servicio de Windows)
echo Base de datos PostgreSQL debería estar activa en localhost:5432

REM Backend con Git Bash (activando el .venv en la raíz)
echo Levantando backend (FastAPI)...
start "" %GITBASH% --login -i -c "cd %PROJECT_PATH%/backend && source ../.venv/Scripts/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload; exec bash"

REM Frontend con Git Bash (Vite)
echo Levantando frontend (React/Vite)...
start "" %GITBASH% --login -i -c "cd %PROJECT_PATH%/frontend && npm run dev; exec bash"

echo ===== Todo levantado =====
echo Backend en: http://localhost:8000
echo Frontend en: http://localhost:5173
pause

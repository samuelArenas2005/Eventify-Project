@echo off
echo Iniciando Backend y Frontend...

start "Backend - Django" cmd /k "cd backend && python manage.py runserver"
timeout /t 2 /nobreak > nul
start "Frontend - Vite" cmd /k "cd frontend && npm run dev"

echo Backend y Frontend iniciados en ventanas separadas.

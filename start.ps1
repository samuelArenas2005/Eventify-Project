# Script para ejecutar Backend y Frontend simultáneamente

Write-Host "Iniciando Backend y Frontend..." -ForegroundColor Green

# Inicia el backend en una nueva ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\samue\OneDrive\Desktop\eventify-project\backend'; python manage.py runserver"

# Espera 2 segundos para que el backend inicie primero
Start-Sleep -Seconds 2

# Inicia el frontend en otra ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\samue\OneDrive\Desktop\eventify-project\frontend'; npm run dev"

Write-Host "Backend y Frontend iniciados en ventanas separadas." -ForegroundColor Cyan

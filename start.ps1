# Script para ejecutar Backend y Frontend simultáneamente

Write-Host "Iniciando Backend y Frontend..." -ForegroundColor Green

# Obtiene la ruta actual del proyecto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Inicia el backend en una nueva ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; python manage.py runserver"

# Espera 2 segundos para que el backend inicie primero
Start-Sleep -Seconds 2

# Inicia el frontend en otra ventana de PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; npm run dev"

Write-Host "Backend y Frontend iniciados en ventanas separadas." -ForegroundColor Cyan

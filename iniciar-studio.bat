@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js no esta instalado.
  echo Instalalo desde https://nodejs.org ^(version LTS^) y volve a abrir este archivo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias, puede tardar unos minutos la primera vez...
  call npm install --loglevel=error
  if errorlevel 1 (
    echo Hubo un error instalando dependencias.
    pause
    exit /b 1
  )
)

echo Abriendo Remotion Studio en http://localhost:3000 ...
start "" http://localhost:3000
call npm run dev
pause

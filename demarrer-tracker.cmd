@echo off
setlocal

set "ROOT=%~dp0"
set "NODE="
for %%N in (node.exe) do set "NODE=%%~$PATH:N"
if not defined NODE set "NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "VITE=%ROOT%node_modules\vite\bin\vite.js"

if not exist "%NODE%" (
  echo Runtime Node.js introuvable. Ouvrez ce projet dans Codex ou installez Node.js.
  pause
  exit /b 1
)

if not exist "%VITE%" (
  echo Dependances introuvables. Le projet doit etre initialise avant le lancement.
  pause
  exit /b 1
)

pushd "%ROOT%"
start "Skyrim Skyshards" /D "%ROOT%" "%NODE%" "%VITE%" --host 127.0.0.1 --port 5173 --strictPort
ping 127.0.0.1 -n 3 >nul
start "" "http://127.0.0.1:5173"

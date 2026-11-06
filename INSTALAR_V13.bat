@echo off
chcp 65001 > nul
cd /d "%~dp0"
py -3 aplicar_v13.py
if errorlevel 1 (
  echo.
  echo Se o comando py falhou, execute no terminal: python aplicar_v13.py
)
echo.
pause

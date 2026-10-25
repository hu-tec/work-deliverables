@echo off
setlocal
cd /d "%~dp0"

py -3 -m pip install -r requirements.txt
py -3 -m PyInstaller --noconfirm --clean --onefile --windowed --name file_prompt_generator_v2 app.py

echo.
echo EXE output:
echo %cd%\dist\file_prompt_generator_v2.exe
pause

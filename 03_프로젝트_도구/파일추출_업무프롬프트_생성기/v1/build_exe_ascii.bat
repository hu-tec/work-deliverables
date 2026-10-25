@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
    set PYTHON_CMD=py -3
) else (
    set PYTHON_CMD=python
)

%PYTHON_CMD% -m pip install -r requirements.txt
%PYTHON_CMD% -m PyInstaller --noconfirm --onefile --windowed --name file_prompt_generator app.py

echo.
echo EXE output:
echo %cd%\dist\file_prompt_generator.exe
pause

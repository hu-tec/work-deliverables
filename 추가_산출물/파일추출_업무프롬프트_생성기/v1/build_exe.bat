@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=py -3
)

%PYTHON_CMD% -m pip install -r requirements.txt
%PYTHON_CMD% -m PyInstaller --noconfirm --onefile --windowed --name "파일추출_업무프롬프트_생성기" app.py
echo.
echo EXE output:
echo %cd%\dist\파일추출_업무프롬프트_생성기.exe
pause

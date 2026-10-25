@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=py -3
)

%PYTHON_CMD% app.py
if errorlevel 1 (
    echo.
    echo 실행 중 오류가 발생했습니다.
    echo Python과 tkinter가 설치되어 있는지 확인하세요.
    pause
)

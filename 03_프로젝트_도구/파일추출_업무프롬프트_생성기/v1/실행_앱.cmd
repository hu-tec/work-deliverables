@echo off
setlocal
title 파일 추출 + 업무 프롬프트 생성기 실행
cd /d "%~dp0"

echo 앱을 실행합니다...
echo 현재 폴더: %cd%
echo.

where py >nul 2>nul
if %errorlevel%==0 (
    py -3 app.py
) else (
    python app.py
)

if errorlevel 1 (
    echo.
    echo 실행 실패.
    echo 아래 명령으로 Python tkinter 설치 상태를 확인하세요.
    echo py -3 -m tkinter
    echo.
    pause
)

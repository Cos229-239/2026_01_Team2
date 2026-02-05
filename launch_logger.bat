@echo off
cd /d "%~dp0"

:CheckLogger
cls
echo ==================================================
echo   MyHQ Full Stack Debug Mode (Flask + Logger + React)
echo ==================================================
echo.
echo [DEBUG] Working Directory: %CD%
echo [DEBUG] Looking for: "%CD%\tools\api_logger.exe"
echo.

:: 1. Check if Logger exists
if not exist "tools\api_logger.exe" (
    echo [ERROR] Logger executable not found!
    echo.
    echo Contents of 'tools' folder:
    dir /b tools
    echo.
    echo -----------------------------------------------------------
    echo INSTRUCTIONS:
    echo 1. The file 'api_logger.exe' MUST be inside the 'tools' folder.
    echo 2. If it is in the root, move it to 'tools'.
    echo 3. If it doesn't exist, run 'tools\build_logger.bat'.
    echo -----------------------------------------------------------
    echo.
    echo Press any key to retry the check...
    pause >nul
    goto :CheckLogger
)

echo [SUCCESS] Logger found. Launching environment...

:: 2. Launch Windows Terminal with 3 Panes
:: We use 'start /wait' to ensure the script doesn't close immediately if wt fails
wt -w 0 nt --title "Flask Backend (5000)" -d "%~dp0Backend" cmd /k "call ..\.venv\Scripts\activate && if exist requirements.txt (pip install -r requirements.txt) && python app.py" ; ^
   sp -V --title "API Logger (5001)" -d "%~dp0tools" cmd /k "api_logger.exe" ; ^
   sp -H --title "React Frontend" -d "%~dp0frontend" cmd /k "call npm install && npm run dev"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to launch Windows Terminal (wt).
    echo Ensure Windows Terminal is installed.
    pause
)
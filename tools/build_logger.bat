@echo off
cd /d "%~dp0"

echo ==========================================
echo      MyHQ API Logger Build Tool (C++)
echo ==========================================

:: Check for Visual Studio Compiler (cl)
where cl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Visual Studio compiler found. Building...
    :: /EHsc enables C++ exception handling (standard)
    cl api_logger.cpp /EHsc /Fe:api_logger.exe
    
    if exist api_logger.exe (
        echo.
        echo [SUCCESS] api_logger.exe created!
        del *.obj
    ) else (
        echo [ERROR] Build failed.
    )
    pause
    exit /b
)

:: Check for MinGW Compiler (g++)
where g++ >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] g++ found. Building...
    g++ api_logger.cpp -o api_logger.exe -lws2_32
    
    if exist api_logger.exe (
        echo.
        echo [SUCCESS] api_logger.exe created!
    ) else (
        echo [ERROR] Build failed.
    )
    pause
    exit /b
)

echo [ERROR] No C++ compiler (cl or g++) found in PATH.
echo Please run this from the "Developer Command Prompt for VS" if using Visual Studio.
pause
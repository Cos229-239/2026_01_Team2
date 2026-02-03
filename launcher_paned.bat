@echo off
cd /d "%~dp0"

echo Starting MyHQ in Split Panes...

:: Logic:
:: 1. Opens Flask tab.
:: 2. Splits pane for React.
:: 3. Runs 'npm install' then 'npm run dev' to launch React.

wt -w 0 nt --title "Flask Backend" -d "%~dp0Backend" cmd /k "call ..\.venv\Scripts\activate && if exist requirements.txt (pip install -r requirements.txt) && python app.py" ; sp -V --title "React Frontend" -d "%~dp0frontend" cmd /k "call npm install && npm run dev"

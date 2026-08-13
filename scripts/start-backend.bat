@echo off
REM MechStudio backend baslatici.
REM Varsayilan `python` bu makinede 3.7 oldugu icin acikca 3.13 cagriliyor.
REM %~dp0 = scripts/ klasoru; uvicorn proje kokunden calismali.
cd /d "%~dp0.."
py -3.13 -m uvicorn backend.app.main:app --reload --port 8000

@echo off
REM MechCode backend baslatici.
REM Varsayilan `python` bu makinede 3.7 oldugu icin acikca 3.13 cagriliyor.
cd /d "%~dp0"
py -3.13 -m uvicorn backend.main:app --reload --port 8000

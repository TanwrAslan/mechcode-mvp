#!/usr/bin/env bash
# MechStudio backend baslatici (Linux/macOS).
set -e
cd "$(dirname "$0")/.."
exec python3 -m uvicorn backend.app.main:app --reload --port 8000

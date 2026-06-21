@echo off
cd /d "%~dp0"
del /f /q ".git\index.lock" 2>nul
git add scripts/verify-registry.mjs scripts/expected-pets.mjs src/components/ui/command.tsx
git -c core.pager= commit -m "fix: search word-boundary for short terms + pre-commit hook pets slugs sync"
echo.
echo === DONE ===
del "%~f0"

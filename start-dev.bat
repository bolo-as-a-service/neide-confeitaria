@echo off
chcp 65001 >nul

echo 🔍 Verificando dependências...

where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ JDK 17+ não encontrado.
    echo    Instale em: https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)

if "%JAVA_HOME%"=="" (
    for /f "tokens=*" %%i in ('where java') do (
        set "JAVA_PATH=%%~dpi"
    )
    for /f "tokens=*" %%i in ("%JAVA_PATH%..") do set "JAVA_HOME=%%~fi"
)

echo ✅ Java encontrado
echo.
echo 🚀 Iniciando backend (Spring Boot — porta 8080)...
start "Neide Backend" cmd /c "cd /d %~dp0backend\baas && mvnw.cmd spring-boot:run"

echo ⏳ Aguardando backend...
:wait
timeout /t 2 /nobreak >nul
curl -s http://localhost:8080/products >nul 2>&1
if %ERRORLEVEL% NEQ 0 goto wait

echo ✅ Backend pronto!
echo.
echo 🚀 Iniciando frontend (Next.js — porta 3000)...
cd /d %~dp0frontend
start "Neide Frontend" cmd /c "npm run dev"

echo.
echo ✅ Projeto rodando!
echo    📱 Frontend: http://localhost:3000
echo    ⚙️  Backend:  http://localhost:8080
echo.
echo Pressione ENTER para encerrar...
pause >nul

taskkill /fi "WINDOWTITLE eq Neide Backend" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Neide Frontend" /f >nul 2>&1
echo ✅ Serviços encerrados.

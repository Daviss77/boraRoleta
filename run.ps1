# Script para executar o projeto BoraRoleta com todas as variáveis configuradas

# Define JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Define variáveis do banco de dados
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "root"

# Define Google Maps API Key
$env:GOOGLE_MAPS_API_KEY = "AIzaSyABAYhUfkDh54w90G7QAr1pmNcw3bldvy4"

# Define perfil Spring
$env:SPRING_PROFILES_ACTIVE = "prod"

Write-Host "=== Variáveis de Ambiente Configuradas ===" -ForegroundColor Green
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "DB_USERNAME: $env:DB_USERNAME"
Write-Host "SPRING_PROFILES_ACTIVE: $env:SPRING_PROFILES_ACTIVE"
Write-Host ""

# Verifica se JAVA_HOME existe
if (Test-Path $env:JAVA_HOME) {
    Write-Host "Java encontrado!" -ForegroundColor Green
    & java -version
    Write-Host ""
    Write-Host "Iniciando o projeto..." -ForegroundColor Cyan
    & .\mvnw.cmd spring-boot:run
} else {
    Write-Host "ERRO: JAVA_HOME não encontrado em $env:JAVA_HOME" -ForegroundColor Red
    Write-Host "Verifique o caminho de instalação do Java 17"
}

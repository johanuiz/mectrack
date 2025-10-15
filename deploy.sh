#!/bin/bash

# Script de Despliegue MecTrack para DreamHost
# Ejecutar en el servidor de destino

echo "🚗 Iniciando despliegue de MecTrack..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    exit 1
fi

NODE_VERSION=$(node --version)
log_info "Node.js versión: $NODE_VERSION"

# Verificar npm
if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado"
    exit 1
fi

# Crear directorio de aplicación si no existe
APP_DIR="/home/$USER/mectrack"
if [ ! -d "$APP_DIR" ]; then
    log_info "Creando directorio de aplicación: $APP_DIR"
    mkdir -p "$APP_DIR"
fi

cd "$APP_DIR"

# Instalar dependencias
log_info "Instalando dependencias..."
npm install --production

if [ $? -ne 0 ]; then
    log_error "Error instalando dependencias"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    log_info "Creando archivo .env..."
    cat > .env << EOF
PORT=3000
DB_PATH=./database/mectrack.db
JWT_SECRET=mectrack_production_secret_key_$(date +%s)
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
HOST=0.0.0.0
EOF
    log_warn "IMPORTANTE: Cambiar ADMIN_PASSWORD en producción!"
else
    log_info "Archivo .env ya existe"
fi

# Crear directorio de base de datos si no existe
if [ ! -d "database" ]; then
    log_info "Creando directorio de base de datos..."
    mkdir -p database
fi

# Inicializar base de datos si no existe
if [ ! -f "database/mectrack.db" ]; then
    log_info "Inicializando base de datos..."
    npm run init-db
    if [ $? -ne 0 ]; then
        log_error "Error inicializando base de datos"
        exit 1
    fi
else
    log_info "Base de datos ya existe"
fi

# Verificar si PM2 está instalado
if command -v pm2 &> /dev/null; then
    log_info "PM2 encontrado, configurando..."
    
    # Detener aplicación si está corriendo
    pm2 stop mectrack 2>/dev/null || true
    pm2 delete mectrack 2>/dev/null || true
    
    # Iniciar aplicación con PM2
    pm2 start server.js --name mectrack --env production
    
    # Configurar auto-start
    pm2 startup
    pm2 save
    
    log_info "Aplicación iniciada con PM2"
    log_info "Comandos útiles:"
    log_info "  pm2 status          - Ver estado"
    log_info "  pm2 logs mectrack    - Ver logs"
    log_info "  pm2 restart mectrack - Reiniciar"
    log_info "  pm2 stop mectrack    - Detener"
else
    log_warn "PM2 no está instalado"
    log_info "Para instalar PM2: npm install -g pm2"
    log_info "Iniciando aplicación directamente..."
    node server.js &
fi

# Verificar que la aplicación esté corriendo
sleep 3
if curl -s http://localhost:3000 > /dev/null; then
    log_info "✅ Aplicación desplegada exitosamente!"
    log_info "🌐 URL: http://localhost:3000"
    log_info "📊 Dashboard: http://localhost:3000"
else
    log_error "❌ La aplicación no está respondiendo"
    exit 1
fi

echo ""
log_info "🎉 Despliegue completado!"
log_info "📝 Próximos pasos:"
log_info "   1. Configurar dominio en DreamHost"
log_info "   2. Configurar SSL (Let's Encrypt)"
log_info "   3. Cambiar credenciales de admin"
log_info "   4. Configurar backup de base de datos"

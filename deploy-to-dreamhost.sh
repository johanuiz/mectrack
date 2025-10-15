#!/bin/bash

# MecTrack - Script de Deployment para DreamHost
# Este script prepara y empaqueta la aplicación para despliegue

echo "🚗 MecTrack - Preparando deployment para DreamHost"
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Nombre del archivo de deployment
DEPLOY_FILE="mectrack-deployment-$(date +%Y%m%d_%H%M%S).tar.gz"

echo ""
echo -e "${YELLOW}Paso 1: Limpiando archivos temporales...${NC}"
rm -rf node_modules
rm -f *.log
rm -f mectrack-deployment*.tar.gz
echo -e "${GREEN}✓ Limpieza completada${NC}"

echo ""
echo -e "${YELLOW}Paso 2: Verificando archivos necesarios...${NC}"

# Verificar archivos críticos
FILES_TO_CHECK=(
    "server.js"
    "app.js"
    ".htaccess"
    "public/.htaccess"
    "package.json"
    "database/db.js"
    "production.env"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (FALTANTE)"
    fi
done

echo ""
echo -e "${YELLOW}Paso 3: Creando estructura de directorios...${NC}"
mkdir -p tmp
mkdir -p backup
mkdir -p logs
echo -e "${GREEN}✓ Directorios creados${NC}"

echo ""
echo -e "${YELLOW}Paso 4: Creando archivo .env de ejemplo...${NC}"
if [ ! -f ".env" ]; then
    cp production.env .env.example
    echo -e "${GREEN}✓ .env.example creado${NC}"
else
    echo -e "${YELLOW}⚠ .env ya existe, se omite${NC}"
fi

echo ""
echo -e "${YELLOW}Paso 5: Empaquetando aplicación...${NC}"

# Archivos a incluir en el deployment
tar -czf "$DEPLOY_FILE" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=*.log \
    --exclude=.env \
    --exclude=database/mectrack.db \
    --exclude=mectrack-deployment*.tar.gz \
    --exclude=.DS_Store \
    server.js \
    server-production.js \
    app.js \
    .htaccess \
    package.json \
    package-lock.json \
    production.env \
    public/ \
    routes/ \
    database/db.js \
    scripts/ \
    tmp/ \
    backup/ \
    logs/ \
    README.md \
    DREAMHOST_FIX_404.md \
    DEPLOYMENT_INSTRUCTIONS.md

if [ -f "$DEPLOY_FILE" ]; then
    SIZE=$(ls -lh "$DEPLOY_FILE" | awk '{print $5}')
    echo -e "${GREEN}✓ Archivo creado: $DEPLOY_FILE ($SIZE)${NC}"
else
    echo -e "${RED}✗ Error al crear el archivo${NC}"
    exit 1
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deployment preparado exitosamente${NC}"
echo "=================================================="
echo ""
echo "📦 Archivo de deployment: $DEPLOY_FILE"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. Subir archivo a DreamHost:"
echo -e "   ${YELLOW}scp $DEPLOY_FILE usuario@mectrack.maktubconsulting.com:~/${NC}"
echo ""
echo "2. Conectar por SSH:"
echo -e "   ${YELLOW}ssh usuario@mectrack.maktubconsulting.com${NC}"
echo ""
echo "3. Extraer archivos:"
echo -e "   ${YELLOW}cd ~/mectrack.maktubconsulting.com${NC}"
echo -e "   ${YELLOW}tar -xzf ~/$DEPLOY_FILE${NC}"
echo ""
echo "4. Instalar dependencias:"
echo -e "   ${YELLOW}npm install --production${NC}"
echo ""
echo "5. Configurar .env:"
echo -e "   ${YELLOW}cp production.env .env${NC}"
echo -e "   ${YELLOW}nano .env  # Editar configuración${NC}"
echo ""
echo "6. Inicializar base de datos (si es primera vez):"
echo -e "   ${YELLOW}npm run init-db${NC}"
echo ""
echo "7. Iniciar/Reiniciar servidor:"
echo ""
echo "   ${YELLOW}# Si usas PM2:${NC}"
echo -e "   ${YELLOW}pm2 restart mectrack || pm2 start server.js --name mectrack${NC}"
echo ""
echo "   ${YELLOW}# Si usas Passenger:${NC}"
echo -e "   ${YELLOW}touch tmp/restart.txt${NC}"
echo ""
echo "8. Verificar funcionamiento:"
echo -e "   ${YELLOW}curl http://localhost:3000/health${NC}"
echo -e "   ${YELLOW}curl http://localhost:3000/api/service-types${NC}"
echo ""
echo "📚 Para solucionar problemas 404, consulta:"
echo -e "   ${YELLOW}DREAMHOST_FIX_404.md${NC}"
echo ""
echo "🌐 Una vez desplegado, tu app estará en:"
echo -e "   ${GREEN}https://mectrack.maktubconsulting.com${NC}"
echo ""


# 🚗 Instrucciones de Despliegue MecTrack en DreamHost

## 📋 Resumen del Sistema

**MecTrack** es un sistema de control histórico de reparaciones para taller mecánico desarrollado con:
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite3
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Puerto**: 3000 (configurable)

## 🎯 Opciones de Despliegue

### Opción 1: DreamHost VPS (RECOMENDADO)
- ✅ Soporte completo para Node.js
- ✅ Control total del servidor
- ✅ Mejor rendimiento
- 💰 Costo: Desde $10/mes

### Opción 2: DreamHost Shared Hosting
- ⚠️ Soporte limitado para Node.js
- 🔄 Requiere configuración adicional
- 💰 Costo: Más económico

## 🚀 Guía Paso a Paso (VPS)

### Paso 1: Preparar Archivos
```bash
# Comprimir proyecto (en tu máquina local)
tar -czf mectrack-deployment.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=*.log \
  --exclude=.env \
  .
```

### Paso 2: Crear VPS en DreamHost
1. Acceder a panel de DreamHost
2. Ir a "VPS" → "Add VPS"
3. Seleccionar plan básico
4. Configurar Ubuntu 20.04 LTS
5. Anotar IP del VPS

### Paso 3: Conectar y Configurar Servidor
```bash
# Conectar via SSH
ssh usuario@IP-DEL-VPS

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar PM2
sudo npm install -g pm2

# Instalar herramientas adicionales
sudo apt install git unzip -y
```

### Paso 4: Subir y Configurar Aplicación
```bash
# Crear directorio de aplicación
mkdir -p /home/usuario/mectrack
cd /home/usuario/mectrack

# Subir archivos (via SFTP o Git)
# Si usas SFTP, subir el archivo comprimido y extraer:
# tar -xzf mectrack-deployment.tar.gz

# Instalar dependencias
npm install --production

# Copiar configuración de producción
cp production.env .env

# Editar configuración (IMPORTANTE)
nano .env
# Cambiar:
# - JWT_SECRET por una clave segura
# - ADMIN_PASSWORD por una contraseña segura
# - Otros valores según necesidad
```

### Paso 5: Inicializar Base de Datos
```bash
# Crear directorio de base de datos
mkdir -p database

# Inicializar base de datos
npm run init-db

# Verificar que se creó
ls -la database/
```

### Paso 6: Configurar Nginx (Proxy Reverso)
```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/mectrack
```

**Contenido del archivo:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/mectrack /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Paso 7: Iniciar Aplicación
```bash
# Iniciar con PM2
pm2 start server.js --name mectrack --env production

# Configurar auto-start
pm2 startup
pm2 save

# Verificar estado
pm2 status
pm2 logs mectrack
```

### Paso 8: Configurar SSL
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

## 🔧 Comandos de Mantenimiento

### Gestión de la Aplicación
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs mectrack

# Reiniciar
pm2 restart mectrack

# Detener
pm2 stop mectrack

# Monitoreo en tiempo real
pm2 monit
```

### Backup de Base de Datos
```bash
# Crear backup manual
cp database/mectrack.db backup/mectrack_$(date +%Y%m%d_%H%M%S).db

# Crear script de backup automático
nano backup.sh
```

**Contenido del script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/usuario/mectrack/backup"
mkdir -p $BACKUP_DIR
cp database/mectrack.db $BACKUP_DIR/mectrack_$DATE.db
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
echo "Backup creado: mectrack_$DATE.db"
```

```bash
# Hacer ejecutable
chmod +x backup.sh

# Configurar cron job (backup diario a las 2 AM)
crontab -e
# Añadir: 0 2 * * * /home/usuario/mectrack/backup.sh
```

## 🔍 Verificación Post-Despliegue

### 1. Verificar Aplicación
- ✅ http://tu-dominio.com (debe mostrar login)
- ✅ https://tu-dominio.com (SSL funcionando)
- ✅ Login con credenciales de admin

### 2. Verificar APIs
- ✅ http://tu-dominio.com/api/service-types
- ✅ http://tu-dominio.com/api/parts
- ✅ http://tu-dominio.com/api/mechanics

### 3. Verificar Funcionalidades
- ✅ Crear nueva reparación
- ✅ Agregar servicios y repuestos
- ✅ Generar reportes
- ✅ Gestión de mecánicos

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Puerto 3000 ocupado
```bash
# Verificar qué usa el puerto
sudo netstat -tlnp | grep :3000

# Cambiar puerto en .env
nano .env
# Cambiar PORT=3000 por PORT=3001
```

#### 2. Permisos de base de datos
```bash
# Verificar permisos
ls -la database/mectrack.db

# Corregir permisos
chmod 664 database/mectrack.db
chown usuario:usuario database/mectrack.db
```

#### 3. PM2 no inicia
```bash
# Ver logs detallados
pm2 logs mectrack --lines 50

# Verificar archivo de configuración
pm2 show mectrack
```

#### 4. Dominio no funciona
```bash
# Verificar DNS
nslookup tu-dominio.com

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
```

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. **Verificar logs**: `pm2 logs mectrack`
2. **Verificar estado**: `pm2 status`
3. **Verificar configuración**: `sudo nginx -t`
4. **Contactar soporte DreamHost** si es problema del hosting

## 🎉 ¡Despliegue Completado!

Una vez completado el despliegue, tu sistema MecTrack estará disponible en:
- **URL**: https://tu-dominio.com
- **Admin**: Usar credenciales configuradas en .env
- **Monitoreo**: PM2 dashboard y logs

¡Tu taller mecánico ahora tiene un sistema profesional en la nube! 🚗✨

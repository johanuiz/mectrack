# 🚀 Comandos Rápidos - DreamHost

## 📦 Deployment Local → DreamHost

### 1. Preparar deployment
```bash
cd /Users/jmrd/Documents/taller_mec
./deploy-to-dreamhost.sh
```

### 2. Subir a servidor
```bash
scp mectrack-deployment-*.tar.gz usuario@mectrack.maktubconsulting.com:~/
```

### 3. Conectar y desplegar
```bash
ssh usuario@mectrack.maktubconsulting.com
cd ~/mectrack.maktubconsulting.com
tar -xzf ~/mectrack-deployment-*.tar.gz
npm install --production
pm2 restart mectrack || pm2 start server.js --name mectrack
```

## 🔧 Mantenimiento del Servidor

### Ver estado de la aplicación
```bash
pm2 status
pm2 logs mectrack
pm2 monit
```

### Reiniciar aplicación
```bash
# Con PM2
pm2 restart mectrack

# Con Passenger
touch tmp/restart.txt

# Reinicio completo
pm2 delete mectrack
pm2 start server.js --name mectrack
pm2 save
```

### Ver logs
```bash
# Logs de PM2
pm2 logs mectrack --lines 100

# Logs de aplicación
tail -f logs/app.log

# Logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

## 🔍 Diagnóstico de Problemas

### Verificar que Node.js esté corriendo
```bash
pm2 status
lsof -i :3000
ps aux | grep node
```

### Probar API localmente
```bash
# Health check
curl http://localhost:3000/health

# API de tipos de servicio
curl http://localhost:3000/api/service-types

# Login (debe retornar JSON)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jperez","password":"123456"}'
```

### Verificar archivos de configuración
```bash
# Ver .htaccess
cat .htaccess

# Ver configuración de Nginx (si aplica)
sudo cat /etc/nginx/sites-available/mectrack

# Verificar permisos
ls -la .htaccess
ls -la database/mectrack.db
```

## 💾 Base de Datos

### Backup
```bash
# Backup manual
cp database/mectrack.db backup/mectrack_$(date +%Y%m%d_%H%M%S).db

# Listar backups
ls -lh backup/

# Restaurar backup
cp backup/mectrack_20241015_120000.db database/mectrack.db
pm2 restart mectrack
```

### Inicializar desde cero
```bash
# PRECAUCIÓN: Esto borra todos los datos
rm database/mectrack.db
npm run init-db
pm2 restart mectrack
```

## 📊 Monitoreo

### Uso de recursos
```bash
# CPU y memoria
top
htop  # si está instalado

# Espacio en disco
df -h
du -sh *

# Procesos de Node.js
ps aux | grep node
```

### Estado del sistema
```bash
# Uptime del servidor
uptime

# Procesos en el puerto 3000
lsof -i :3000

# Conexiones activas
netstat -an | grep :3000
```

## 🔒 Seguridad

### Actualizar contraseñas
```bash
# Editar variables de entorno
nano .env

# Reiniciar para aplicar cambios
pm2 restart mectrack
```

### Ver usuarios de la base de datos
```bash
sqlite3 database/mectrack.db "SELECT username, name, specialty FROM mechanics;"
```

### Cambiar contraseña de usuario
```bash
# Ejecutar script de Node.js para cambiar contraseña
node -e "
const bcrypt = require('bcryptjs');
const password = 'nueva_contraseña_segura';
bcrypt.hash(password, 10).then(hash => console.log(hash));
"
# Copiar el hash y actualizar en la base de datos
```

## 🌐 Nginx (si aplica)

### Verificar configuración
```bash
sudo nginx -t
```

### Reiniciar Nginx
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

### Ver configuración del sitio
```bash
sudo cat /etc/nginx/sites-available/mectrack
```

## 🔄 Actualizar Código

### Método 1: Git (recomendado)
```bash
cd ~/mectrack.maktubconsulting.com
git pull
npm install --production
pm2 restart mectrack
```

### Método 2: Archivo comprimido
```bash
# Local: crear deployment
./deploy-to-dreamhost.sh

# Local: subir
scp mectrack-deployment-*.tar.gz usuario@mectrack.maktubconsulting.com:~/

# Servidor: extraer y reiniciar
cd ~/mectrack.maktubconsulting.com
tar -xzf ~/mectrack-deployment-*.tar.gz
npm install --production
pm2 restart mectrack
```

## 🚨 Solución de Problemas Comunes

### Puerto 3000 ocupado
```bash
# Ver qué está usando el puerto
lsof -i :3000

# Matar proceso específico
kill -9 PID_DEL_PROCESO

# O cambiar puerto en .env
echo "PORT=3001" >> .env
pm2 restart mectrack
```

### Permisos incorrectos
```bash
# Arreglar permisos de base de datos
chmod 664 database/mectrack.db
chown $(whoami):$(whoami) database/mectrack.db

# Arreglar permisos de logs
chmod 755 logs
chmod 644 logs/*.log
```

### Error "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install --production

# Verificar package.json
cat package.json

# Reinstalar módulo específico
npm install nombre-del-modulo --save
```

### API retorna 404
```bash
# 1. Verificar que Node.js esté corriendo
pm2 status

# 2. Verificar .htaccess
cat .htaccess

# 3. Probar localmente
curl http://localhost:3000/api/auth/login

# 4. Ver logs
pm2 logs mectrack --lines 50

# 5. Reiniciar todo
pm2 restart mectrack
touch tmp/restart.txt  # si usas Passenger
```

## 📱 Acceso Remoto

### SSH
```bash
# Conexión básica
ssh usuario@mectrack.maktubconsulting.com

# Con puerto específico
ssh -p 2222 usuario@mectrack.maktubconsulting.com

# Con llave privada
ssh -i ~/.ssh/id_rsa usuario@mectrack.maktubconsulting.com
```

### SFTP
```bash
# Conectar
sftp usuario@mectrack.maktubconsulting.com

# Comandos SFTP
put archivo.txt          # Subir archivo
get archivo.txt          # Descargar archivo
ls                       # Listar archivos remotos
lls                      # Listar archivos locales
cd directorio            # Cambiar directorio remoto
lcd directorio           # Cambiar directorio local
```

## 🎯 Comandos de Una Línea

### Reinicio completo
```bash
pm2 delete mectrack; pm2 start server.js --name mectrack; pm2 save
```

### Backup + Reinicio
```bash
cp database/mectrack.db backup/mectrack_$(date +%Y%m%d_%H%M%S).db && pm2 restart mectrack
```

### Ver último error
```bash
pm2 logs mectrack --err --lines 20
```

### Estado completo del sistema
```bash
echo "=== PM2 ===" && pm2 status && echo "=== Puerto 3000 ===" && lsof -i :3000 && echo "=== Espacio ===" && df -h | grep -E "(Filesystem|home)"
```

---

**Tip**: Guarda estos comandos en un archivo de texto en tu máquina local para referencia rápida.


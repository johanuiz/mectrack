# 🔧 Solución Error 404 en API - DreamHost

## 📋 Problema Identificado

Error en navegador móvil/desktop:
```
POST https://mectrack.maktubconsulting.com/api/auth/login 404 (Not Found)
Login error: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Causa**: Las rutas de la API `/api/*` no están llegando al servidor Node.js

## ✅ Soluciones por Tipo de Hosting

### Opción 1: DreamHost VPS (Recomendado)

#### A. Verificar que Node.js esté corriendo

```bash
# Conectar por SSH
ssh usuario@mectrack.maktubconsulting.com

# Verificar si el servidor está corriendo
pm2 status
# O verificar el puerto
lsof -i :3000
```

#### B. Si no está corriendo, iniciarlo

```bash
# Ir al directorio de la aplicación
cd ~/mectrack  # o la ruta donde esté tu aplicación

# Iniciar con PM2
pm2 start server.js --name mectrack
pm2 save
pm2 startup

# O iniciar directamente (solo para pruebas)
NODE_ENV=production node server.js
```

#### C. Verificar configuración de Nginx

```bash
# Editar configuración de Nginx
sudo nano /etc/nginx/sites-available/mectrack

# Debe contener:
server {
    listen 80;
    listen 443 ssl;
    server_name mectrack.maktubconsulting.com;

    # Certificados SSL (si ya están configurados)
    # ssl_certificate /path/to/cert;
    # ssl_certificate_key /path/to/key;

    # Proxy pass a Node.js
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

    # Específicamente para API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Opción 2: DreamHost Shared Hosting con Passenger

#### A. Verificar archivos necesarios

Asegúrate de tener estos archivos en tu dominio:

**1. `.htaccess` en la raíz:**
```apache
PassengerEnabled on
PassengerAppType node
PassengerStartupFile server.js
PassengerNodejs /usr/bin/node

# Reemplaza con tu ruta real
PassengerAppRoot /home/TU_USUARIO/mectrack.maktubconsulting.com
```

**2. `tmp/restart.txt`:**
```bash
# Crear el directorio y archivo
mkdir -p tmp
touch tmp/restart.txt

# Cada vez que actualices código, ejecuta:
touch tmp/restart.txt
```

#### B. Verificar package.json

Asegúrate de tener el script de inicio:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "main": "server.js"
}
```

#### C. Reiniciar Passenger

```bash
# Via SSH
touch tmp/restart.txt

# O reiniciar el servicio
pkill -9 -u $(whoami) Passenger
```

### Opción 3: DreamHost Shared Hosting sin Passenger (Proxy Apache)

Si Passenger no está disponible, usa Apache como proxy:

**`.htaccess` en la raíz del dominio:**
```apache
RewriteEngine On

# Permitir archivos estáticos
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Proxy a Node.js (debe estar corriendo en puerto específico)
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Headers para proxy
RequestHeader set X-Forwarded-Proto "https"
RequestHeader set X-Forwarded-Host "%{HTTP_HOST}e"
```

**Importante**: Necesitas mantener Node.js corriendo constantemente:

```bash
# Usando nohup (si PM2 no está disponible)
nohup node server.js > app.log 2>&1 &

# Verificar que esté corriendo
ps aux | grep node
```

## 🔍 Diagnóstico Paso a Paso

### 1. Verificar que el servidor Node.js responda localmente

```bash
# Conectar por SSH
ssh usuario@mectrack.maktubconsulting.com

# Probar la API localmente
curl http://localhost:3000/health
# Debe retornar JSON con "success": true

curl http://localhost:3000/api/service-types
# Debe retornar lista de tipos de servicio
```

### 2. Verificar que Apache/Nginx esté redirigiendo

```bash
# Ver logs de Apache
tail -f ~/logs/mectrack.maktubconsulting.com/http/error.log

# O logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Ver logs de acceso
tail -f ~/logs/mectrack.maktubconsulting.com/http/access.log
```

### 3. Verificar rutas de la aplicación

```bash
# Probar desde el servidor
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jperez","password":"123456"}'

# Debe retornar JSON con el usuario o error de credenciales
```

### 4. Verificar desde el navegador

Abre las DevTools (F12) y ve a Network:
- Verifica que la petición vaya a `/api/auth/login`
- Verifica el código de respuesta (debe ser 200, 401, etc., NO 404)
- Verifica los headers de la petición
- Verifica la respuesta (debe ser JSON, no HTML)

## 🚀 Solución Rápida (Más Probable)

La solución más común es reiniciar el servidor Node.js:

```bash
# Conectar por SSH
ssh usuario@mectrack.maktubconsulting.com

# Ir al directorio
cd ~/mectrack.maktubconsulting.com
# O cd ~/tu-dominio.com

# Si usas PM2
pm2 restart mectrack
# O
pm2 restart all

# Si usas Passenger
touch tmp/restart.txt

# Si corres node directamente, mata el proceso y reinicia
pkill -9 node
nohup node server.js > app.log 2>&1 &
```

## 📝 Checklist de Verificación

- [ ] Node.js está instalado (`node --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos inicializada (`ls -la database/mectrack.db`)
- [ ] Archivo `.env` existe y está configurado
- [ ] Servidor Node.js corriendo (`pm2 status` o `lsof -i :3000`)
- [ ] `.htaccess` configurado correctamente
- [ ] Nginx/Apache configurado para proxy (si aplica)
- [ ] Logs no muestran errores (`pm2 logs` o `tail -f app.log`)
- [ ] Puerto 3000 (o el configurado) está abierto
- [ ] El dominio apunta a la IP correcta

## 📞 Soporte Adicional

Si el problema persiste:

1. **Revisar logs del servidor:**
   ```bash
   pm2 logs mectrack --lines 100
   ```

2. **Verificar configuración del dominio en DreamHost:**
   - Panel de DreamHost → Domains → tu-dominio.com
   - Verificar que apunte al directorio correcto
   - Verificar que Passenger esté habilitado (si aplica)

3. **Contactar soporte DreamHost:**
   - Pregunta sobre configuración de aplicaciones Node.js
   - Pregunta si Passenger está disponible
   - Pregunta sobre configuración de proxy reverso

## 🔄 Actualización de Archivos

Si acabas de actualizar el código:

```bash
# 1. Subir archivos nuevos (via SFTP o Git)
git pull  # si usas Git

# 2. Instalar dependencias nuevas
npm install --production

# 3. Reiniciar aplicación
pm2 restart mectrack
# O
touch tmp/restart.txt

# 4. Verificar que funcione
curl http://localhost:3000/health
```

---

**Nota**: Los archivos `.htaccess` y `app.js` ya están incluidos en el proyecto para facilitar el despliegue en DreamHost.


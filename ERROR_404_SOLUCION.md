# 🔴 Error 404 en API - Resumen y Solución

## 🐛 Problema Identificado

```
POST https://mectrack.maktubconsulting.com/api/auth/login 404 (Not Found)
Login error: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### ¿Qué significa?
- El navegador intenta acceder a `/api/auth/login`
- El servidor web (Apache/Nginx) devuelve **404 - No encontrado**
- En lugar de JSON, devuelve una página HTML de error
- La aplicación no puede parsear el HTML como JSON → Error

### ¿Por qué sucede?
1. **El servidor Node.js NO está corriendo** en DreamHost
2. **O** la configuración del proxy (Apache/Nginx) no está redirigiendo las peticiones a Node.js
3. **O** los archivos de configuración (`.htaccess`) no están en su lugar

## ✅ Archivos Creados para Solucionar

He creado los siguientes archivos para solucionar este problema:

### 1. `.htaccess` (raíz del proyecto)
- Configura Apache/Passenger para ejecutar la aplicación Node.js
- Establece proxy reverso si Passenger no está disponible

### 2. `public/.htaccess`
- Configuración específica para el directorio público
- Manejo de archivos estáticos y proxy a Node.js

### 3. `app.js` (raíz del proyecto)
- Punto de entrada compatible con Passenger de DreamHost
- Exporta la aplicación Express correctamente

### 4. `DREAMHOST_FIX_404.md`
- Guía detallada de troubleshooting
- Soluciones paso a paso según el tipo de hosting

### 5. `deploy-to-dreamhost.sh`
- Script automatizado para crear el paquete de deployment
- Incluye todos los archivos necesarios

## 🚀 Solución Rápida (3 pasos)

### Paso 1: Preparar archivos localmente
```bash
cd /Users/jmrd/Documents/taller_mec
./deploy-to-dreamhost.sh
```

### Paso 2: Subir a DreamHost
```bash
# Reemplaza 'usuario' con tu usuario de DreamHost
scp mectrack-deployment-*.tar.gz usuario@mectrack.maktubconsulting.com:~/
```

### Paso 3: Desplegar en DreamHost
```bash
# Conectar por SSH
ssh usuario@mectrack.maktubconsulting.com

# Ir al directorio del dominio
cd ~/mectrack.maktubconsulting.com

# Extraer archivos (sobrescribirá los existentes)
tar -xzf ~/mectrack-deployment-*.tar.gz

# Reiniciar la aplicación
# Si usas PM2:
pm2 restart mectrack

# Si usas Passenger:
touch tmp/restart.txt
```

## 🔍 Verificación

Después de desplegar, verifica que funcione:

### 1. Desde el servidor (SSH):
```bash
# Verificar que Node.js esté corriendo
pm2 status
# O
lsof -i :3000

# Probar la API localmente
curl http://localhost:3000/health
curl http://localhost:3000/api/service-types
```

### 2. Desde el navegador:
- Abre: `https://mectrack.maktubconsulting.com`
- Abre DevTools (F12) → Network
- Intenta hacer login
- La petición a `/api/auth/login` debe retornar:
  - **Código 200 o 401** (NO 404)
  - **Respuesta JSON** (NO HTML)

## 📋 Checklist de Deployment

- [ ] Archivos `.htaccess` en raíz y en `public/`
- [ ] Archivo `app.js` en la raíz
- [ ] `npm install` ejecutado en el servidor
- [ ] Base de datos inicializada (`database/mectrack.db` existe)
- [ ] Archivo `.env` configurado
- [ ] Servidor Node.js corriendo (PM2 o Passenger)
- [ ] Nginx/Apache configurado como proxy (si aplica)
- [ ] Permisos correctos en archivos y directorios

## 🛠️ Configuraciones por Tipo de Hosting

### Opción A: DreamHost VPS con PM2
```bash
# Instalar PM2 (si no está instalado)
npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name mectrack

# Auto-inicio al reiniciar servidor
pm2 startup
pm2 save
```

### Opción B: DreamHost con Passenger
Asegúrate de tener `.htaccess` con:
```apache
PassengerEnabled on
PassengerAppType node
PassengerStartupFile server.js
```

Reiniciar:
```bash
touch tmp/restart.txt
```

### Opción C: DreamHost Shared (sin Passenger)
Mantener Node.js corriendo:
```bash
nohup node server.js > logs/app.log 2>&1 &
```

## 📞 Si el Problema Persiste

1. **Revisar logs:**
   ```bash
   pm2 logs mectrack --lines 100
   # O
   tail -f logs/app.log
   ```

2. **Verificar rutas:**
   - Asegúrate de que estés en el directorio correcto del dominio
   - Verifica que `.htaccess` esté en la raíz del dominio público

3. **Contactar soporte DreamHost:**
   - Pregunta si Passenger está habilitado para tu dominio
   - Verifica que Node.js esté disponible
   - Pregunta sobre configuración de aplicaciones Node.js

## 📚 Documentación Adicional

- `DREAMHOST_FIX_404.md` - Guía detallada de troubleshooting
- `DEPLOYMENT_INSTRUCTIONS.md` - Instrucciones completas de deployment
- `dreamhost-config.md` - Configuración específica de DreamHost
- `README.md` - Documentación general del proyecto

## ⚡ Comando de Emergencia

Si nada funciona, este comando debería resolver el problema:

```bash
# Conectar por SSH a DreamHost
ssh usuario@mectrack.maktubconsulting.com

# Ir al directorio
cd ~/mectrack.maktubconsulting.com

# Reinstalar todo
npm install --production

# Reiniciar completamente
pm2 delete mectrack 2>/dev/null
pm2 start server.js --name mectrack
pm2 save

# O con Passenger
pkill -9 -u $(whoami) Passenger
touch tmp/restart.txt

# Verificar
sleep 3
curl http://localhost:3000/health
```

---

**Creado:** $(date)  
**Aplicación:** MecTrack v1.0  
**Dominio:** mectrack.maktubconsulting.com


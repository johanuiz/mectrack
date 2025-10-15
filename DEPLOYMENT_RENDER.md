# 🚀 Deployment en Render.com - MecTrack

## ¿Por qué Render?

- ✅ **Gratis** para comenzar (plan Free)
- ✅ **Node.js nativo** - Soporta todas las versiones modernas
- ✅ **HTTPS automático** - Certificado SSL gratis
- ✅ **Deployment automático** - Desde GitHub/GitLab
- ✅ **Base de datos incluida** - PostgreSQL/SQLite soportado
- ✅ **Sin configuración** - Funciona out-of-the-box

## 📋 Pasos para Desplegar

### Opción 1: Deploy Directo (Más Rápido) ⭐

#### 1. Crear cuenta en Render
- Ir a: https://render.com
- Hacer clic en "Get Started for Free"
- Registrarse con GitHub o email

#### 2. Subir código a GitHub
```bash
# Si no tienes repositorio, créalo:
cd /Users/jmrd/Documents/taller_mec

# Inicializar git (si no está)
git init
git add .
git commit -m "MecTrack - Sistema de control de reparaciones"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/TU_USUARIO/mectrack.git
git branch -M main
git push -u origin main
```

#### 3. Crear Web Service en Render
1. En Render Dashboard, clic en "New +"
2. Seleccionar "Web Service"
3. Conectar tu repositorio de GitHub
4. Seleccionar el repo `mectrack`
5. Configurar:
   ```
   Name: mectrack
   Region: Oregon (US West)
   Branch: main
   Runtime: Node
   Build Command: npm install --production
   Start Command: npm start
   Instance Type: Free
   ```

6. Variables de entorno (Add Environment Variables):
   ```
   NODE_ENV = production
   PORT = 10000
   ```

7. Clic en "Create Web Service"

#### 4. Esperar deployment
- Render automáticamente:
  - ✅ Clona el repositorio
  - ✅ Instala dependencias
  - ✅ Inicia el servidor
  - ✅ Proporciona URL pública

#### 5. ¡Listo!
Tu app estará en: `https://mectrack.onrender.com`

### Opción 2: Deploy Manual (Sin GitHub)

#### 1. Crear cuenta en Render
- Ir a: https://render.com
- Registrarse

#### 2. Preparar archivos localmente
```bash
cd /Users/jmrd/Documents/taller_mec

# Crear archivo render.yaml (ya está creado)
# El archivo ya incluye toda la configuración necesaria
```

#### 3. Deploy usando Render CLI

##### Instalar Render CLI:
```bash
npm install -g @render/cli
```

##### Login:
```bash
render login
```

##### Deploy:
```bash
render deploy
```

### Opción 3: Deploy con Blueprint (Automático)

Si ya tienes `render.yaml`, Render lo detectará automáticamente y configurará todo.

## 🔧 Post-Deployment

### 1. Inicializar Base de Datos

Conectar por SSH a Render:
```bash
# En Render Dashboard > Shell
npm run init-db
```

O usar la consola web de Render.

### 2. Verificar Aplicación

Abrir: `https://tu-app.onrender.com`

### 3. Credenciales de Prueba
```
Usuario: jperez
Password: 123456
```

## 📊 Plan Free de Render

### Incluye:
- ✅ 750 horas/mes (suficiente para 1 servicio 24/7)
- ✅ SSL/HTTPS automático
- ✅ Deploy automático desde Git
- ✅ Custom domains
- ✅ Logs en tiempo real

### Limitaciones:
- ⏱️ El servicio "duerme" después de 15 min de inactividad
- 🔄 Primer request después de dormir tarda ~30 seg
- 💾 512 MB RAM
- 🌐 Región: Oregon (US West)

### Upgrade ($7/mes):
- Sin "sleep"
- Más RAM y CPU
- Múltiples regiones

## 🔄 Actualizar Aplicación

### Con GitHub (Automático):
```bash
git add .
git commit -m "Actualización"
git push
```
Render detecta el push y redeploy automáticamente.

### Manual:
En Render Dashboard:
- Click en "Manual Deploy"
- Seleccionar branch
- Click "Deploy"

## 🐛 Troubleshooting

### App no inicia
1. Ver logs en Render Dashboard
2. Verificar que `npm start` funcione localmente
3. Verificar variables de entorno

### Error 503
- App está "despertando" (plan free)
- Esperar 30 segundos y recargar

### Base de datos no funciona
```bash
# En Render Shell
ls database/mectrack.db
npm run init-db
```

## 📱 Plataformas Alternativas

### Railway.app
- Similar a Render
- $5/mes (sin plan free)
- Muy fácil de usar
- Deploy: `railway login && railway up`

### Fly.io
- Plan free con límites
- Global edge deployment
- Deploy: `flyctl launch`

### Vercel/Netlify
- Mejor para frontend
- Requiere serverless functions para backend

## 🎯 Resumen

**Render.com es la mejor opción para MecTrack porque:**

1. ✅ Soporte nativo de Node.js (cualquier versión)
2. ✅ SQLite funciona sin problemas
3. ✅ Plan gratuito generoso
4. ✅ HTTPS automático
5. ✅ Deploy en minutos
6. ✅ No requiere configuración compleja

**Próximos pasos:**
1. Crear cuenta en Render.com
2. Conectar con GitHub O usar CLI
3. Deploy automático
4. Inicializar base de datos
5. ¡Usar la aplicación!

---

**¿Necesitas ayuda?**
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com


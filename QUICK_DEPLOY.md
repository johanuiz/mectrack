# ⚡ Deployment Rápido en Render.com

## 🚀 3 Pasos para Deploy (5 minutos)

### 📦 Paso 1: Preparar Repositorio

```bash
# 1. Inicializar Git (si no está)
git init

# 2. Añadir archivos
git add .
git commit -m "MecTrack - Sistema de reparaciones"

# 3. Crear repo en GitHub
# Ir a: https://github.com/new
# Nombre: mectrack
# Crear repositorio público

# 4. Subir código
git remote add origin https://github.com/TU_USUARIO/mectrack.git
git branch -M main
git push -u origin main
```

### 🌐 Paso 2: Deploy en Render

1. **Ir a Render.com**
   - https://render.com
   - Clic en "Get Started for Free"
   - Registrarse con GitHub

2. **Crear Web Service**
   - Clic en "New +" → "Web Service"
   - Conectar GitHub
   - Seleccionar repo `mectrack`

3. **Configuración**
   ```
   Name:           mectrack
   Region:         Oregon (US West)
   Branch:         main
   Runtime:        Node
   Build Command:  npm install --production
   Start Command:  npm start
   Plan:           Free
   ```

4. **Variables de entorno** (opcional)
   ```
   NODE_ENV = production
   ```

5. **Crear Web Service** → Esperar ~2 minutos

### ✅ Paso 3: Inicializar Base de Datos

1. **Ir a tu servicio en Render**
2. **Clic en "Shell"** (en el menú lateral)
3. **Ejecutar:**
   ```bash
   npm run init-db
   ```

### 🎉 ¡Listo!

Tu aplicación está en: `https://mectrack.onrender.com`

**Credenciales de prueba:**
- Usuario: `jperez`
- Password: `123456`

---

## 🔄 Actualizar Aplicación

```bash
git add .
git commit -m "Actualización"
git push
```

Render detectará el cambio y redesplegará automáticamente.

---

## 📱 Alternativa: Railway.app

Si prefieres Railway:

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway init
railway up

# 4. Abrir
railway open
```

---

## ⚠️ Notas Importantes

### Plan Free de Render:
- ✅ Gratis permanentemente
- ⏱️ Se "duerme" tras 15 min sin uso
- 🔄 Primer request tarda ~30 seg en "despertar"
- 💾 512 MB RAM (suficiente para MecTrack)

### Upgrade ($7/mes):
- Sin "sleep"
- Siempre activo
- Más recursos

---

## 🆘 Ayuda

**Si tienes problemas:**
1. Ver logs en Render Dashboard
2. Consultar: `DEPLOYMENT_RENDER.md`
3. Render Docs: https://render.com/docs

**Soporte:**
- Render Community: https://community.render.com
- GitHub Issues: (tu repositorio)


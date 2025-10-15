# Guía de Despliegue MecTrack en DreamHost

## Requisitos del Sistema

### Tecnologías Utilizadas:
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite3
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Dependencias**: Ver package.json

### Requisitos del Hosting:
- Node.js (versión 16 o superior)
- SQLite3 support
- Puerto 3000 (o configurable)
- Acceso a archivos estáticos

## Preparación para Despliegue

### 1. Archivos Necesarios
```
mectrack/
├── server.js
├── package.json
├── package-lock.json
├── database/
│   ├── db.js
│   └── mectrack.db
├── routes/
│   ├── auth.js
│   ├── mechanics.js
│   ├── serviceTypes.js
│   ├── parts.js
│   ├── customers.js
│   ├── vehicles.js
│   ├── services.js
│   ├── repairs.js
│   ├── reports.js
│   └── admin.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       └── app.js
└── scripts/
    └── init-database.js
```

### 2. Variables de Entorno para Producción
Crear archivo `.env` en el servidor:
```env
PORT=3000
DB_PATH=./database/mectrack.db
JWT_SECRET=mectrack_production_secret_key_2024_change_this
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
HOST=0.0.0.0
```

## Pasos de Despliegue

### Opción 1: DreamHost VPS (Recomendado)
1. **Crear VPS en DreamHost**
2. **Configurar Node.js**
3. **Subir archivos via SFTP/SSH**
4. **Instalar dependencias**
5. **Configurar variables de entorno**
6. **Iniciar aplicación**

### Opción 2: DreamHost Shared Hosting
1. **Verificar soporte Node.js**
2. **Subir archivos via FTP**
3. **Configurar aplicación**
4. **Configurar dominio**

## Comandos de Despliegue

### En el servidor:
```bash
# Instalar dependencias
npm install --production

# Inicializar base de datos
npm run init-db

# Iniciar aplicación
npm start
```

### Con PM2 (para producción):
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación con PM2
pm2 start server.js --name mectrack

# Configurar auto-start
pm2 startup
pm2 save
```

## Configuración de Dominio

1. **Configurar DNS** para apuntar a DreamHost
2. **Configurar dominio** en panel de control
3. **Configurar proxy reverso** si es necesario
4. **Configurar SSL** (Let's Encrypt)

## Verificación Post-Despliegue

1. **Verificar aplicación**: http://tu-dominio.com
2. **Verificar APIs**: http://tu-dominio.com/api/service-types
3. **Verificar base de datos**: Login y funcionalidades
4. **Verificar SSL**: HTTPS funcionando

## Troubleshooting

### Problemas Comunes:
- **Puerto no disponible**: Cambiar PORT en .env
- **Base de datos**: Verificar permisos de archivos
- **Dependencias**: Verificar Node.js version
- **SSL**: Configurar certificados

### Logs:
```bash
# Ver logs de PM2
pm2 logs mectrack

# Ver logs del sistema
tail -f /var/log/apache2/error.log
```

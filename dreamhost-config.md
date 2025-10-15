# Configuración Específica para DreamHost

## Opciones de Hosting en DreamHost

### 1. DreamHost VPS (Recomendado para Node.js)
- **Ventajas**: Control completo, Node.js nativo, mejor rendimiento
- **Costo**: Desde $10/mes
- **Configuración**: Acceso SSH completo

### 2. DreamHost Shared Hosting
- **Limitaciones**: Soporte limitado para Node.js
- **Alternativa**: Usar PHP como proxy

## Configuración VPS DreamHost

### Paso 1: Crear VPS
1. Acceder a panel de DreamHost
2. Ir a "VPS" → "Add VPS"
3. Seleccionar plan básico ($10/mes)
4. Configurar Ubuntu 20.04 LTS

### Paso 2: Configurar Servidor
```bash
# Conectar via SSH
ssh usuario@tu-vps.dreamhost.com

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Git
sudo apt install git -y
```

### Paso 3: Subir Código
```bash
# Opción 1: Via Git (recomendado)
git clone https://github.com/tu-usuario/mectrack.git
cd mectrack

# Opción 2: Via SFTP
# Subir archivos comprimidos y extraer
```

### Paso 4: Configurar Aplicación
```bash
# Instalar dependencias
npm install --production

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar configuración

# Inicializar base de datos
npm run init-db

# Iniciar con PM2
pm2 start server.js --name mectrack
pm2 startup
pm2 save
```

## Configuración de Dominio

### Paso 1: Configurar DNS
1. En panel de DreamHost:
   - Ir a "Domains" → "DNS"
   - Crear registro A apuntando a IP del VPS
   - Crear registro CNAME para www

### Paso 2: Configurar Nginx (Proxy Reverso)
```bash
# Instalar Nginx
sudo apt install nginx -y

# Configurar sitio
sudo nano /etc/nginx/sites-available/mectrack
```

Contenido del archivo de configuración:
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
sudo nginx -t
sudo systemctl restart nginx
```

### Paso 3: Configurar SSL
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

## Configuración Shared Hosting (Alternativa)

Si usas hosting compartido, puedes crear un proxy PHP:

### archivo: index.php
```php
<?php
// Proxy para MecTrack en hosting compartido
$url = 'http://localhost:3000' . $_SERVER['REQUEST_URI'];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
?>
```

## Monitoreo y Mantenimiento

### Comandos Útiles
```bash
# Ver estado de la aplicación
pm2 status

# Ver logs
pm2 logs mectrack

# Reiniciar aplicación
pm2 restart mectrack

# Ver uso de recursos
pm2 monit

# Backup de base de datos
cp database/mectrack.db backup/mectrack_$(date +%Y%m%d).db
```

### Configurar Backup Automático
```bash
# Crear script de backup
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp database/mectrack.db backup/mectrack_$DATE.db
find backup/ -name "*.db" -mtime +7 -delete
```

```bash
# Configurar cron job
crontab -e
# Añadir: 0 2 * * * /home/usuario/mectrack/backup.sh
```

## Troubleshooting

### Problemas Comunes
1. **Puerto 3000 ocupado**: Cambiar PORT en .env
2. **Permisos de base de datos**: `chmod 664 database/mectrack.db`
3. **PM2 no inicia**: Verificar logs con `pm2 logs`
4. **Dominio no funciona**: Verificar DNS y Nginx

### Logs Importantes
- Aplicación: `pm2 logs mectrack`
- Nginx: `sudo tail -f /var/log/nginx/error.log`
- Sistema: `sudo journalctl -u nginx`

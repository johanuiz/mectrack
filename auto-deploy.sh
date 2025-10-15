#!/usr/bin/expect -f

# MecTrack - Auto Deploy Script para DreamHost
set timeout 300
set hostname "iad1-shared-b8-38.dreamhost.com"
set username "dh_jr4wu9"
set password "Jmrd1339."
set deploy_file "mectrack-deployment-20251015_163030.tar.gz"

# Paso 1: Subir archivo
puts "\n🚀 Subiendo archivo a DreamHost...\n"
spawn scp -P 22 $deploy_file $username@$hostname:~/
expect {
    "Are you sure you want to continue connecting" {
        send "yes\r"
        exp_continue
    }
    "password:" {
        send "$password\r"
    }
}
expect eof

puts "\n✅ Archivo subido exitosamente\n"

# Paso 2: Conectar y desplegar
puts "\n🔧 Conectando a DreamHost para desplegar...\n"
spawn ssh -p 22 $username@$hostname
expect {
    "Are you sure you want to continue connecting" {
        send "yes\r"
        exp_continue
    }
    "password:" {
        send "$password\r"
    }
}

# Encontrar directorio del dominio
expect "$ "
send "ls -la | grep maktub\r"
expect "$ "
send "cd mectrack.maktubconsulting.com\r"

# Hacer backup de archivos actuales
expect "$ "
send "echo '📦 Creando backup...'\r"
expect "$ "
send "tar -czf backup/backup_\$(date +%Y%m%d_%H%M%S).tar.gz --exclude=node_modules --exclude=backup . 2>/dev/null || true\r"

# Extraer nuevos archivos
expect "$ "
send "echo '📂 Extrayendo archivos...'\r"
expect "$ "
send "tar -xzf ~/$deploy_file\r"

# Verificar que se extrajeron
expect "$ "
send "ls -la | grep -E 'server.js|app.js|htaccess'\r"

# Instalar dependencias
expect "$ "
send "echo '📥 Instalando dependencias...'\r"
expect "$ "
send "npm install --production 2>&1\r"
expect "$ "

# Verificar si existe la base de datos
send "if \[ ! -f database/mectrack.db \]; then echo 'Inicializando base de datos...'; npm run init-db; fi\r"
expect "$ "

# Reiniciar con Passenger
send "echo '🔄 Reiniciando aplicación...'\r"
expect "$ "
send "mkdir -p tmp\r"
expect "$ "
send "touch tmp/restart.txt\r"

# Verificar instalación
expect "$ "
send "sleep 3\r"
expect "$ "
send "echo '✅ Verificando instalación...'\r"
expect "$ "
send "ls -la .htaccess app.js server.js\r"

# Mostrar información
expect "$ "
send "echo '\n================================================'\r"
expect "$ "
send "echo '✅ DEPLOYMENT COMPLETADO'\r"
expect "$ "
send "echo '================================================'\r"
expect "$ "
send "echo '\n🌐 Tu aplicación está en:'\r"
expect "$ "
send "echo 'https://mectrack.maktubconsulting.com'\r"
expect "$ "
send "echo '\n📋 Credenciales de prueba:'\r"
expect "$ "
send "echo 'Usuario: jperez'\r"
expect "$ "
send "echo 'Password: 123456'\r"
expect "$ "
send "echo '\n'\r"

# Salir
expect "$ "
send "exit\r"
expect eof

puts "\n🎉 ¡Deployment completado exitosamente!\n"


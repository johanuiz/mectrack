# MecTrack - Sistema de Control Histórico de Reparaciones

Sistema web para el control histórico de reparaciones de un taller mecánico, diseñado para ser utilizado por mecánicos que registran reparaciones con servicios y repuestos predefinidos.

## 🚀 Características Principales

- **Centrado en el Mecánico**: El sistema está diseñado para que los mecánicos puedan registrar reparaciones fácilmente
- **Catálogos Predefinidos**: Servicios y repuestos con precios ya establecidos
- **Búsqueda Inteligente**: Búsqueda de clientes y vehículos por múltiples criterios
- **Historial Completo**: Seguimiento histórico de todas las reparaciones por vehículo
- **Dashboard Interactivo**: Estadísticas y resumen de actividades
- **Interfaz Moderna**: Diseño responsive y fácil de usar

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Base de Datos**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Bootstrap 5
- **Autenticación**: bcryptjs para hash de contraseñas

## 📋 Requisitos del Sistema

- Node.js 14 o superior
- npm o yarn

## 🔧 Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd /Users/jmrd/Documents/taller_mec
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   Editar el archivo `.env` con la configuración deseada.

4. **Inicializar la base de datos**
   ```bash
   npm run init-db
   ```

5. **Iniciar el servidor**
   ```bash
   npm start
   ```

6. **Acceder al sistema**
   - Abrir navegador en: `http://localhost:3000`
   - Elegir entre "Sistema Principal" (mecánicos) o "Panel de Administración"
   - Usar las credenciales creadas durante la inicialización

## 👤 Credenciales de Acceso

Después de ejecutar `npm run init-db`, se crean los siguientes usuarios:

| Usuario | Contraseña | Nombre |
|---------|------------|--------|
| jperez  | 123456     | Juan Pérez |
| mgarcia | 123456     | María García |
| clopez  | 123456     | Carlos López |

## 📊 Estructura de la Base de Datos

### Entidades Principales

- **mechanics**: Información de los mecánicos
- **customers**: Datos de los clientes
- **vehicles**: Información de los vehículos
- **service_types**: Catálogo de tipos de servicios
- **parts**: Catálogo de repuestos
- **repairs**: Registro principal de reparaciones
- **repair_services**: Servicios aplicados en cada reparación
- **repair_parts**: Repuestos utilizados en cada reparación

## 🎯 Flujo de Trabajo

1. **Login del Mecánico**: El mecánico inicia sesión con sus credenciales
2. **Nueva Reparación**: 
   - Busca o crea un cliente
   - Selecciona un vehículo
   - Elige servicios del catálogo predefinido
   - Selecciona repuestos con precios ya establecidos
   - El sistema calcula automáticamente el total
3. **Registro**: Se guarda la reparación con todos los detalles
4. **Historial**: Se puede consultar el historial completo del vehículo

## 🔍 Funcionalidades

### Dashboard
- Estadísticas del mecánico (reparaciones, ingresos, promedio)
- Reparaciones recientes
- Métricas del mes

### Gestión de Reparaciones
- Registro de nuevas reparaciones
- Selección de servicios predefinidos
- Selección de repuestos con precios
- Cálculo automático de costos
- Notas adicionales

### Búsqueda y Consulta
- Búsqueda de clientes por nombre o teléfono
- Búsqueda de vehículos por placa, VIN, marca o modelo
- Historial completo de reparaciones por vehículo
- Filtros y ordenamiento

### Reportes
- Estadísticas mensuales
- Ingresos por período
- Actividad del taller

## 🎨 Interfaz de Usuario

- **Diseño Responsive**: Funciona en desktop, tablet y móvil
- **Navegación Intuitiva**: Menú lateral con secciones claras
- **Formularios Dinámicos**: Campos que se adaptan según la selección
- **Feedback Visual**: Alertas y confirmaciones claras
- **Tema Moderno**: Colores corporativos y tipografía profesional

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Validación de datos en frontend y backend
- Sanitización de entradas
- Rate limiting para prevenir ataques
- Headers de seguridad con Helmet

## 📱 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login del mecánico
- `POST /api/auth/logout` - Logout

### Reparaciones
- `POST /api/repairs` - Crear nueva reparación
- `GET /api/repairs/vehicle/:id` - Historial de vehículo
- `GET /api/repairs/stats/:mechanicId` - Estadísticas del mecánico

### Catálogos
- `GET /api/services` - Obtener tipos de servicios
- `GET /api/parts` - Obtener repuestos disponibles

### Búsqueda
- `GET /api/customers/search/:term` - Buscar clientes
- `GET /api/vehicles/search/:term` - Buscar vehículos

## 🚀 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en modo desarrollo
- `npm run init-db` - Inicializar base de datos con datos de ejemplo

## 📈 Futuras Mejoras

- [ ] Sistema de roles y permisos
- [ ] Notificaciones push
- [ ] Exportación de reportes a PDF
- [ ] Integración con sistemas de inventario
- [ ] API REST completa con documentación
- [ ] Aplicación móvil
- [ ] Sistema de backup automático

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para la nueva funcionalidad
3. Hacer commit de los cambios
4. Push a la rama
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**MecTrack** - Simplificando la gestión de reparaciones automotrices 🚗🔧

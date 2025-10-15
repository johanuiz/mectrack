const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mechanicRoutes = require('./routes/mechanics');
const serviceTypeRoutes = require('./routes/serviceTypes');
const partsRoutes = require('./routes/parts');
const customerRoutes = require('./routes/customers');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const repairRoutes = require('./routes/repairs');
const reportsRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const initializeDatabase = require('./scripts/init-database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "data:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/service-types', serviceTypeRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

// Database initialization endpoint
app.post('/api/init-db', async (req, res) => {
    try {
        console.log('🚀 Iniciando inicialización de base de datos...');
        
        // No usar el script de inicialización que cierra la base de datos
        // En su lugar, crear los datos directamente
        const Database = require('./database/db');
        const bcrypt = require('bcryptjs');
        const db = new Database();
        
        // Crear mecánicos de ejemplo
        const mechanics = [
            { name: 'Juan Pérez', username: 'jperez', password: '123456', email: 'juan@taller.com', phone: '555-0101' },
            { name: 'María García', username: 'mgarcia', password: '123456', email: 'maria@taller.com', phone: '555-0102' },
            { name: 'Carlos López', username: 'clopez', password: '123456', email: 'carlos@taller.com', phone: '555-0103' }
        ];
        
        for (const mechanic of mechanics) {
            const passwordHash = await bcrypt.hash(mechanic.password, 10);
            const existing = await db.getMechanicByUsername(mechanic.username);
            
            if (!existing) {
                await new Promise((resolve, reject) => {
                    db.db.run(
                        `INSERT INTO mechanics (name, username, password_hash, email, phone) 
                         VALUES (?, ?, ?, ?, ?)`,
                        [mechanic.name, mechanic.username, passwordHash, mechanic.email, mechanic.phone],
                        function(err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                        }
                    );
                });
                console.log(`✅ Mecánico creado: ${mechanic.name}`);
            }
        }
        
        db.close();
        
        res.json({
            success: true,
            message: 'Base de datos inicializada exitosamente'
        });
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        res.status(500).json({
            success: false,
            message: 'Error inicializando base de datos',
            error: error.message
        });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin panel (redirect to main page)
app.get('/admin.html', (req, res) => {
    res.redirect('/');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚗 MecTrack Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Obtener todos los tipos de servicios disponibles
router.get('/', async (req, res) => {
    try {
        const db = new Database();
        const services = await db.getAllServiceTypes();
        
        res.json({
            success: true,
            services: services
        });
        
    } catch (error) {
        console.error('Error obteniendo servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Instancia de la base de datos
const db = new Database();

// GET /api/service-types - Obtener todos los tipos de servicios
router.get('/', async (req, res) => {
    try {
        const serviceTypes = await db.getAllServiceTypes();
        res.json({
            success: true,
            serviceTypes: serviceTypes
        });
    } catch (error) {
        console.error('Error obteniendo tipos de servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/service-types/:id - Obtener un tipo de servicio por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const serviceType = await db.getServiceTypeById(id);
        
        if (!serviceType) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de servicio no encontrado'
            });
        }
        
        res.json({
            success: true,
            serviceType: serviceType
        });
    } catch (error) {
        console.error('Error obteniendo tipo de servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/service-types - Crear nuevo tipo de servicio
router.post('/', async (req, res) => {
    try {
        const { name, description, labor_cost, estimated_time } = req.body;
        
        // Validación de campos requeridos
        if (!name || !labor_cost) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y costo de mano de obra son obligatorios'
            });
        }
        
        // Validar que el costo sea un número positivo
        if (isNaN(labor_cost) || labor_cost <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El costo de mano de obra debe ser un número positivo'
            });
        }
        
        const serviceTypeId = await db.createServiceType({
            name: name.trim(),
            description: description ? description.trim() : null,
            labor_cost: parseFloat(labor_cost),
            estimated_time: estimated_time ? parseInt(estimated_time) : null
        });
        
        res.status(201).json({
            success: true,
            message: 'Tipo de servicio creado exitosamente',
            serviceTypeId: serviceTypeId
        });
    } catch (error) {
        console.error('Error creando tipo de servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/service-types/:id - Actualizar tipo de servicio
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, labor_cost, estimated_time } = req.body;
        
        // Validación de campos requeridos
        if (!name || !labor_cost) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y costo de mano de obra son obligatorios'
            });
        }
        
        // Validar que el costo sea un número positivo
        if (isNaN(labor_cost) || labor_cost <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El costo de mano de obra debe ser un número positivo'
            });
        }
        
        const updated = await db.updateServiceType(id, {
            name: name.trim(),
            description: description ? description.trim() : null,
            labor_cost: parseFloat(labor_cost),
            estimated_time: estimated_time ? parseInt(estimated_time) : null
        });
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de servicio no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Tipo de servicio actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando tipo de servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/service-types/:id/status - Cambiar estado activo/inactivo
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'El estado debe ser true o false'
            });
        }
        
        const updated = await db.updateServiceTypeStatus(id, is_active);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de servicio no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: `Tipo de servicio ${is_active ? 'activado' : 'desactivado'} exitosamente`
        });
    } catch (error) {
        console.error('Error cambiando estado del tipo de servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

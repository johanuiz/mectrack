const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Instancia de la base de datos
const db = new Database();

// GET /api/parts - Obtener todos los repuestos
router.get('/', async (req, res) => {
    try {
        const parts = await db.getAllParts();
        res.json({
            success: true,
            parts: parts
        });
    } catch (error) {
        console.error('Error obteniendo repuestos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/parts/:id - Obtener un repuesto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const part = await db.getPartById(id);
        
        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Repuesto no encontrado'
            });
        }
        
        res.json({
            success: true,
            part: part
        });
    } catch (error) {
        console.error('Error obteniendo repuesto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/parts - Crear nuevo repuesto
router.post('/', async (req, res) => {
    try {
        const { name, part_number, description, cost, markup_percentage, final_price, category, brand } = req.body;
        
        // Validación de campos requeridos
        if (!name || !cost || !final_price) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, costo y precio final son obligatorios'
            });
        }
        
        // Validar que los costos sean números positivos
        if (isNaN(cost) || cost <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El costo debe ser un número positivo'
            });
        }
        
        if (isNaN(final_price) || final_price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio final debe ser un número positivo'
            });
        }
        
        // Validar markup_percentage si se proporciona
        if (markup_percentage && (isNaN(markup_percentage) || markup_percentage < 0)) {
            return res.status(400).json({
                success: false,
                message: 'El porcentaje de ganancia debe ser un número no negativo'
            });
        }
        
        const partId = await db.createPart({
            name: name.trim(),
            part_number: part_number ? part_number.trim() : null,
            description: description ? description.trim() : null,
            cost: parseFloat(cost),
            markup_percentage: markup_percentage ? parseFloat(markup_percentage) : 0,
            final_price: parseFloat(final_price),
            category: category ? category.trim() : null,
            brand: brand ? brand.trim() : null
        });
        
        res.status(201).json({
            success: true,
            message: 'Repuesto creado exitosamente',
            partId: partId
        });
    } catch (error) {
        console.error('Error creando repuesto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/parts/:id - Actualizar repuesto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, part_number, description, cost, markup_percentage, final_price, category, brand } = req.body;
        
        // Validación de campos requeridos
        if (!name || !cost || !final_price) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, costo y precio final son obligatorios'
            });
        }
        
        // Validar que los costos sean números positivos
        if (isNaN(cost) || cost <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El costo debe ser un número positivo'
            });
        }
        
        if (isNaN(final_price) || final_price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio final debe ser un número positivo'
            });
        }
        
        // Validar markup_percentage si se proporciona
        if (markup_percentage && (isNaN(markup_percentage) || markup_percentage < 0)) {
            return res.status(400).json({
                success: false,
                message: 'El porcentaje de ganancia debe ser un número no negativo'
            });
        }
        
        const updated = await db.updatePart(id, {
            name: name.trim(),
            part_number: part_number ? part_number.trim() : null,
            description: description ? description.trim() : null,
            cost: parseFloat(cost),
            markup_percentage: markup_percentage ? parseFloat(markup_percentage) : 0,
            final_price: parseFloat(final_price),
            category: category ? category.trim() : null,
            brand: brand ? brand.trim() : null
        });
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Repuesto no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Repuesto actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando repuesto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/parts/:id/status - Cambiar estado activo/inactivo
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
        
        const updated = await db.updatePartStatus(id, is_active);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Repuesto no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: `Repuesto ${is_active ? 'activado' : 'desactivado'} exitosamente`
        });
    } catch (error) {
        console.error('Error cambiando estado del repuesto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
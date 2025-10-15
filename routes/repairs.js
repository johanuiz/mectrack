const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Middleware temporal para desarrollo
const isAuthenticated = (req, res, next) => {
    next(); // Permitir acceso para desarrollo
};

// Crear nueva reparación
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const {
            vehicle_id,
            mechanic_id,
            repair_date,
            description,
            services,
            parts,
            total_cost,
            notes
        } = req.body;

        if (!vehicle_id || !mechanic_id || !repair_date) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: vehículo, mecánico y fecha'
            });
        }

        if (!services || !Array.isArray(services)) {
            services = [];
        }
        if (!parts || !Array.isArray(parts)) {
            parts = [];
        }

        if (services.length === 0 && parts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe agregar al menos un servicio o repuesto'
            });
        }

        const db = new Database();
        
        // Calcular costos totales
        const totalLaborCost = services.reduce((sum, service) => sum + (service.labor_cost * service.quantity), 0);
        const totalPartsCost = parts.reduce((sum, part) => sum + (part.total_cost * part.quantity), 0);
        const calculatedTotal = totalLaborCost + totalPartsCost;

        // Crear la reparación principal
        const repairId = await db.createRepair({
            vehicle_id,
            mechanic_id,
            repair_date,
            description,
            total_labor_cost: totalLaborCost,
            total_parts_cost: totalPartsCost,
            total_cost: calculatedTotal,
            notes
        });

        // Agregar servicios
        for (const service of services) {
            await db.addRepairService(repairId, service.service_type_id, service.quantity, service.labor_cost);
        }

        // Agregar repuestos
        for (const part of parts) {
            await db.addRepairPart(repairId, part.part_id, part.quantity, part.unit_cost, part.total_cost);
        }

        res.json({
            success: true,
            message: 'Reparación creada exitosamente',
            repair_id: repairId
        });

    } catch (error) {
        console.error('Error creating repair:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener reparaciones por mecánico
router.get('/mechanic/:mechanicId', isAuthenticated, async (req, res) => {
    try {
        const { mechanicId } = req.params;
        const db = new Database();
        const repairs = await db.getRepairsByMechanic(mechanicId);

        res.json({
            success: true,
            repairs
        });
    } catch (error) {
        console.error('Error getting repairs:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener detalles de una reparación
router.get('/:repairId', isAuthenticated, async (req, res) => {
    try {
        const { repairId } = req.params;
        const db = new Database();
        const repair = await db.getRepairDetails(repairId);

        if (!repair) {
            return res.status(404).json({
                success: false,
                message: 'Reparación no encontrada'
            });
        }

        res.json({
            success: true,
            repair
        });
    } catch (error) {
        console.error('Error getting repair details:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
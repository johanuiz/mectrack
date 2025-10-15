const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Obtener todos los vehículos
router.get('/', async (req, res) => {
    try {
        const db = new Database();
        const vehicles = await db.getAllVehicles();
        
        res.json({
            success: true,
            vehicles: vehicles
        });
        
    } catch (error) {
        console.error('Error obteniendo vehículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Crear nuevo vehículo
router.post('/', async (req, res) => {
    try {
        const { customer_id, make, model, year, license_plate, vin, color, engine_type, mileage } = req.body;
        
        if (!customer_id || !make || !model || !year) {
            return res.status(400).json({
                success: false,
                message: 'Datos requeridos: customer_id, make, model, year'
            });
        }

        const db = new Database();
        const vehicleId = await db.createVehicle({
            customer_id,
            make,
            model,
            year,
            license_plate,
            vin,
            color,
            engine_type,
            mileage
        });
        
        res.json({
            success: true,
            message: 'Vehículo registrado exitosamente',
            vehicle_id: vehicleId
        });
        
    } catch (error) {
        console.error('Error creando vehículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener vehículos de un cliente
router.get('/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const db = new Database();
        
        const vehicles = await db.getVehiclesByCustomer(customerId);
        
        res.json({
            success: true,
            vehicles: vehicles
        });
        
    } catch (error) {
        console.error('Error obteniendo vehículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Buscar vehículos
router.get('/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const db = new Database();
        
        const vehicles = await db.searchVehicles(searchTerm);
        
        res.json({
            success: true,
            vehicles: vehicles
        });
        
    } catch (error) {
        console.error('Error buscando vehículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Actualizar vehículo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, make, model, year, license_plate, vin, color, engine_type, mileage } = req.body;
        
        if (!customer_id || !make || !model || !year) {
            return res.status(400).json({
                success: false,
                message: 'Datos requeridos: customer_id, make, model, year'
            });
        }

        const db = new Database();
        const result = await db.updateVehicle(id, {
            customer_id,
            make,
            model,
            year,
            license_plate,
            vin,
            color,
            engine_type,
            mileage
        });
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Vehículo actualizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error actualizando vehículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Desactivar vehículo (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = new Database();
        
        // En lugar de eliminar físicamente, marcamos como inactivo
        // Esto preserva el historial de reparaciones
        const result = await db.deactivateVehicle(id);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Vehículo desactivado exitosamente'
        });
        
    } catch (error) {
        console.error('Error desactivando vehículo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

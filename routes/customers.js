const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const db = new Database();
        const customers = await db.getAllCustomers();
        
        res.json({
            success: true,
            customers: customers
        });
        
    } catch (error) {
        console.error('Error obteniendo clientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Crear nuevo cliente
router.post('/', async (req, res) => {
    try {
        const { name, last_name, phone, email, address } = req.body;
        
        if (!name || !last_name) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y apellido son requeridos'
            });
        }

        const db = new Database();
        const customerId = await db.createCustomer({
            name,
            last_name,
            phone,
            email,
            address
        });
        
        res.json({
            success: true,
            message: 'Cliente registrado exitosamente',
            customer_id: customerId
        });
        
    } catch (error) {
        console.error('Error creando cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Buscar clientes
router.get('/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const db = new Database();
        
        const customers = await db.searchCustomers(searchTerm);
        
        res.json({
            success: true,
            customers: customers
        });
        
    } catch (error) {
        console.error('Error buscando clientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, last_name, phone, email, address } = req.body;
        
        if (!name || !last_name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Datos requeridos: name, last_name, phone'
            });
        }

        const db = new Database();
        const result = await db.updateCustomer(id, {
            name,
            last_name,
            phone,
            email,
            address
        });
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Cliente actualizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error actualizando cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Desactivar cliente (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = new Database();
        
        // En lugar de eliminar físicamente, marcamos como inactivo
        // Esto preserva el historial de reparaciones
        const result = await db.deactivateCustomer(id);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Cliente desactivado exitosamente'
        });
        
    } catch (error) {
        console.error('Error desactivando cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const Database = require('../database/db');
const router = express.Router();

// Obtener todos los mecánicos
router.get('/', async (req, res) => {
    try {
        const db = new Database();
        const mechanics = await db.getAllMechanics();
        
        res.json({
            success: true,
            mechanics: mechanics
        });
        
    } catch (error) {
        console.error('Error obteniendo mecánicos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener un mecánico por ID
router.get('/:id', async (req, res) => {
    try {
        const db = new Database();
        const mechanic = await db.getMechanicById(req.params.id);
        
        if (!mechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mecánico no encontrado'
            });
        }
        
        res.json({
            success: true,
            mechanic: mechanic
        });
        
    } catch (error) {
        console.error('Error obteniendo mecánico:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Crear nuevo mecánico
router.post('/', async (req, res) => {
    try {
        const { name, username, password, email, phone, specialty } = req.body;
        
        // Validar campos requeridos
        if (!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, usuario y contraseña son requeridos'
            });
        }
        
        const db = new Database();
        
        // Verificar si el usuario ya existe
        const existingMechanic = await db.getMechanicByUsername(username);
        if (existingMechanic) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear mecánico
        const mechanicId = await db.createMechanic({
            name,
            username,
            password: hashedPassword,
            email: email || null,
            phone: phone || null,
            specialty: specialty || null,
            is_active: true
        });
        
        res.json({
            success: true,
            message: 'Mecánico creado exitosamente',
            mechanicId: mechanicId
        });
        
    } catch (error) {
        console.error('Error creando mecánico:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Actualizar mecánico
router.put('/:id', async (req, res) => {
    try {
        const { name, username, password, email, phone, specialty } = req.body;
        const mechanicId = req.params.id;
        
        // Validar campos requeridos
        if (!name || !username) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y usuario son requeridos'
            });
        }
        
        const db = new Database();
        
        // Verificar si el mecánico existe
        const existingMechanic = await db.getMechanicById(mechanicId);
        if (!existingMechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mecánico no encontrado'
            });
        }
        
        // Verificar si el usuario ya existe en otro mecánico
        const userExists = await db.getMechanicByUsername(username);
        if (userExists && userExists.id !== parseInt(mechanicId)) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe en otro mecánico'
            });
        }
        
        // Preparar datos para actualización
        const updateData = {
            name,
            username,
            email: email || null,
            phone: phone || null,
            specialty: specialty || null
        };
        
        // Solo actualizar contraseña si se proporciona
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        // Actualizar mecánico
        await db.updateMechanic(mechanicId, updateData);
        
        res.json({
            success: true,
            message: 'Mecánico actualizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error actualizando mecánico:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Cambiar estado del mecánico (activar/desactivar)
router.put('/:id/status', async (req, res) => {
    try {
        const { is_active } = req.body;
        const mechanicId = req.params.id;
        
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido'
            });
        }
        
        const db = new Database();
        
        // Verificar si el mecánico existe
        const existingMechanic = await db.getMechanicById(mechanicId);
        if (!existingMechanic) {
            return res.status(404).json({
                success: false,
                message: 'Mecánico no encontrado'
            });
        }
        
        // Actualizar estado
        await db.updateMechanicStatus(mechanicId, is_active);
        
        res.json({
            success: true,
            message: `Mecánico ${is_active ? 'activado' : 'desactivado'} exitosamente`
        });
        
    } catch (error) {
        console.error('Error cambiando estado del mecánico:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const Database = require('../database/db');
const router = express.Router();

// Login del mecánico
router.post('/login', async (req, res) => {
    const db = new Database();
    try {
        console.log('📝 Login attempt:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('❌ Missing credentials');
            db.close();
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        console.log('🔍 Searching for mechanic:', username);
        const mechanic = await db.getMechanicByUsername(username);
        console.log('👤 Mechanic found:', mechanic ? 'Yes' : 'No');

        if (!mechanic) {
            console.log('❌ Mechanic not found');
            db.close();
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        console.log('🔐 Comparing passwords...');
        const isValidPassword = await bcrypt.compare(password, mechanic.password_hash);
        console.log('🔐 Password valid:', isValidPassword);
        
        if (!isValidPassword) {
            console.log('❌ Invalid password');
            db.close();
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        if (!mechanic.is_active) {
            console.log('❌ Account not active');
            db.close();
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada'
            });
        }

        // En un sistema real, aquí generarías un JWT token
        // Por simplicidad, solo retornamos la información del mecánico
        const { password_hash, ...mechanicInfo } = mechanic;

        console.log('✅ Login successful');
        db.close();
        res.json({
            success: true,
            message: 'Login exitoso',
            mechanic: mechanicInfo
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        console.error('Stack:', error.stack);
        db.close();
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Verificar sesión (para el frontend)
router.get('/verify', async (req, res) => {
    // En un sistema real, aquí verificarías el JWT token
    // Por simplicidad, asumimos que si llega aquí, la sesión es válida
    res.json({
        success: true,
        message: 'Sesión válida'
    });
});

// Logout
router.post('/logout', (req, res) => {
    // En un sistema real, aquí invalidarías el JWT token
    res.json({
        success: true,
        message: 'Logout exitoso'
    });
});

module.exports = router;

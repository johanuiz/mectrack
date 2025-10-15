const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Middleware de autenticación simple para admin (en producción usar JWT)
const authenticateAdmin = (req, res, next) => {
    // Por simplicidad, asumimos que las rutas admin están protegidas
    // En producción, verificar JWT token o sesión
    next();
};

router.use(authenticateAdmin);

// Obtener estadísticas generales
router.get('/stats', async (req, res) => {
    try {
        const db = new Database();
        const stats = await db.getRepairStats();
        
        res.json({
            success: true,
            stats: stats
        });
        
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Gestión de servicios
router.post('/services', async (req, res) => {
    try {
        const { name, description, labor_cost, estimated_time } = req.body;
        
        if (!name || !labor_cost) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y costo de mano de obra son requeridos'
            });
        }

        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `INSERT INTO service_types (name, description, labor_cost, estimated_time) 
                 VALUES (?, ?, ?, ?)`,
                [name, description, labor_cost, estimated_time],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Servicio creado exitosamente'
        });
        
    } catch (error) {
        console.error('Error creando servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

router.put('/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, labor_cost, estimated_time, is_active } = req.body;
        
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `UPDATE service_types 
                 SET name = ?, description = ?, labor_cost = ?, estimated_time = ?, is_active = ?
                 WHERE id = ?`,
                [name, description, labor_cost, estimated_time, is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Servicio actualizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error actualizando servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

router.delete('/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                'UPDATE service_types SET is_active = 0 WHERE id = ?',
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Servicio desactivado exitosamente'
        });
        
    } catch (error) {
        console.error('Error desactivando servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Gestión de repuestos
router.post('/parts', async (req, res) => {
    try {
        const { name, part_number, description, cost, markup_percentage, final_price, category, brand } = req.body;
        
        if (!name || !cost || !final_price) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, costo y precio final son requeridos'
            });
        }

        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `INSERT INTO parts (name, part_number, description, cost, markup_percentage, final_price, category, brand) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, part_number, description, cost, markup_percentage, final_price, category, brand],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Repuesto creado exitosamente'
        });
        
    } catch (error) {
        console.error('Error creando repuesto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

router.put('/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, part_number, description, cost, markup_percentage, final_price, category, brand, is_active } = req.body;
        
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `UPDATE parts 
                 SET name = ?, part_number = ?, description = ?, cost = ?, markup_percentage = ?, 
                     final_price = ?, category = ?, brand = ?, is_active = ?
                 WHERE id = ?`,
                [name, part_number, description, cost, markup_percentage, final_price, category, brand, is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
        
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

router.delete('/parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                'UPDATE parts SET is_active = 0 WHERE id = ?',
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Repuesto desactivado exitosamente'
        });
        
    } catch (error) {
        console.error('Error desactivando repuesto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Gestión de mecánicos
router.post('/mechanics', async (req, res) => {
    try {
        const { name, username, password, email, phone } = req.body;
        
        if (!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, usuario y contraseña son requeridos'
            });
        }

        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10);
        
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `INSERT INTO mechanics (name, username, password_hash, email, phone) 
                 VALUES (?, ?, ?, ?, ?)`,
                [name, username, passwordHash, email, phone],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Mecánico creado exitosamente'
        });
        
    } catch (error) {
        console.error('Error creando mecánico:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

router.put('/mechanics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, phone, is_active } = req.body;
        
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `UPDATE mechanics 
                 SET name = ?, username = ?, email = ?, phone = ?, is_active = ?
                 WHERE id = ?`,
                [name, username, email, phone, is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
        
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

router.delete('/mechanics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = new Database();
        
        await new Promise((resolve, reject) => {
            db.db.run(
                'UPDATE mechanics SET is_active = 0 WHERE id = ?',
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'Mecánico desactivado exitosamente'
        });
        
    } catch (error) {
        console.error('Error desactivando mecánico:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Reportes avanzados
router.get('/reports/repairs', async (req, res) => {
    try {
        const { start_date, end_date, mechanic_id } = req.query;
        const db = new Database();
        
        let query = `
            SELECT r.*, v.make, v.model, v.year, v.license_plate, 
                   c.name as customer_name, c.last_name as customer_last_name,
                   m.name as mechanic_name
            FROM repairs r
            JOIN vehicles v ON r.vehicle_id = v.id
            JOIN customers c ON v.customer_id = c.id
            JOIN mechanics m ON r.mechanic_id = m.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (start_date) {
            query += ' AND r.repair_date >= ?';
            params.push(start_date);
        }
        
        if (end_date) {
            query += ' AND r.repair_date <= ?';
            params.push(end_date);
        }
        
        if (mechanic_id) {
            query += ' AND r.mechanic_id = ?';
            params.push(mechanic_id);
        }
        
        query += ' ORDER BY r.repair_date DESC';
        
        const repairs = await new Promise((resolve, reject) => {
            db.db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({
            success: true,
            repairs: repairs
        });
        
    } catch (error) {
        console.error('Error generando reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
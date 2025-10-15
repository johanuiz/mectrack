const express = require('express');
const Database = require('../database/db');
const router = express.Router();

// Instancia de la base de datos
const db = new Database();

// GET /api/reports/mechanics - Reporte de mecánicos
router.get('/mechanics', async (req, res) => {
    try {
        const { status, specialty } = req.query;
        
        let query = 'SELECT * FROM mechanics WHERE 1=1';
        const params = [];
        
        if (status !== undefined) {
            query += ' AND is_active = ?';
            params.push(status === 'active' ? 1 : 0);
        }
        
        if (specialty) {
            query += ' AND specialty = ?';
            params.push(specialty);
        }
        
        query += ' ORDER BY name';
        
        const mechanics = await db.query(query, params);
        
        res.json({
            success: true,
            report: {
                title: 'Reporte de Mecánicos',
                filters: { status, specialty },
                data: mechanics,
                total: mechanics.length,
                active: mechanics.filter(m => m.is_active).length,
                inactive: mechanics.filter(m => !m.is_active).length
            }
        });
    } catch (error) {
        console.error('Error generando reporte de mecánicos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/reports/service-types - Reporte de tipos de servicios
router.get('/service-types', async (req, res) => {
    try {
        const { status, min_cost, max_cost } = req.query;
        
        let query = 'SELECT * FROM service_types WHERE 1=1';
        const params = [];
        
        if (status !== undefined) {
            query += ' AND is_active = ?';
            params.push(status === 'active' ? 1 : 0);
        }
        
        if (min_cost) {
            query += ' AND labor_cost >= ?';
            params.push(parseFloat(min_cost));
        }
        
        if (max_cost) {
            query += ' AND labor_cost <= ?';
            params.push(parseFloat(max_cost));
        }
        
        query += ' ORDER BY name';
        
        const serviceTypes = await db.query(query, params);
        
        const totalLaborCost = serviceTypes.reduce((sum, st) => sum + parseFloat(st.labor_cost || 0), 0);
        
        res.json({
            success: true,
            report: {
                title: 'Reporte de Tipos de Servicios',
                filters: { status, min_cost, max_cost },
                data: serviceTypes,
                total: serviceTypes.length,
                active: serviceTypes.filter(st => st.is_active).length,
                inactive: serviceTypes.filter(st => !st.is_active).length,
                totalLaborCost: totalLaborCost,
                averageLaborCost: serviceTypes.length > 0 ? totalLaborCost / serviceTypes.length : 0
            }
        });
    } catch (error) {
        console.error('Error generando reporte de tipos de servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/reports/parts - Reporte de repuestos
router.get('/parts', async (req, res) => {
    try {
        const { status, category, brand, min_cost, max_cost } = req.query;
        
        let query = 'SELECT * FROM parts WHERE 1=1';
        const params = [];
        
        if (status !== undefined) {
            query += ' AND is_active = ?';
            params.push(status === 'active' ? 1 : 0);
        }
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (brand) {
            query += ' AND brand = ?';
            params.push(brand);
        }
        
        if (min_cost) {
            query += ' AND final_price >= ?';
            params.push(parseFloat(min_cost));
        }
        
        if (max_cost) {
            query += ' AND final_price <= ?';
            params.push(parseFloat(max_cost));
        }
        
        query += ' ORDER BY name';
        
        const parts = await db.query(query, params);
        
        const totalCost = parts.reduce((sum, part) => sum + parseFloat(part.cost || 0), 0);
        const totalFinalPrice = parts.reduce((sum, part) => sum + parseFloat(part.final_price || 0), 0);
        const totalProfit = totalFinalPrice - totalCost;
        
        // Agrupar por categoría
        const categoryStats = parts.reduce((acc, part) => {
            const cat = part.category || 'Sin categoría';
            if (!acc[cat]) {
                acc[cat] = { count: 0, totalCost: 0, totalPrice: 0 };
            }
            acc[cat].count++;
            acc[cat].totalCost += parseFloat(part.cost || 0);
            acc[cat].totalPrice += parseFloat(part.final_price || 0);
            return acc;
        }, {});
        
        res.json({
            success: true,
            report: {
                title: 'Reporte de Repuestos',
                filters: { status, category, brand, min_cost, max_cost },
                data: parts,
                total: parts.length,
                active: parts.filter(p => p.is_active).length,
                inactive: parts.filter(p => !p.is_active).length,
                totalCost: totalCost,
                totalFinalPrice: totalFinalPrice,
                totalProfit: totalProfit,
                profitMargin: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0,
                categoryStats: categoryStats
            }
        });
    } catch (error) {
        console.error('Error generando reporte de repuestos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/reports/customers - Reporte de clientes
router.get('/customers', async (req, res) => {
    try {
        const customers = await db.getAllCustomers();
        const vehicles = await db.getAllVehicles();
        
        // Estadísticas de clientes
        const customersWithVehicles = customers.map(customer => {
            const customerVehicles = vehicles.filter(v => v.customer_id === customer.id);
            return {
                ...customer,
                vehiclesCount: customerVehicles.length,
                vehicles: customerVehicles
            };
        });
        
        res.json({
            success: true,
            report: {
                title: 'Reporte de Clientes',
                data: customersWithVehicles,
                total: customers.length,
                totalVehicles: vehicles.length,
                customersWithVehicles: customersWithVehicles.filter(c => c.vehiclesCount > 0).length,
                averageVehiclesPerCustomer: customers.length > 0 ? vehicles.length / customers.length : 0
            }
        });
    } catch (error) {
        console.error('Error generando reporte de clientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/reports/vehicles - Reporte de vehículos
router.get('/vehicles', async (req, res) => {
    try {
        const { make, year_min, year_max } = req.query;
        
        let query = `
            SELECT v.*, c.name as customer_name, c.last_name as customer_last_name 
            FROM vehicles v 
            LEFT JOIN customers c ON v.customer_id = c.id 
            WHERE 1=1
        `;
        const params = [];
        
        if (make) {
            query += ' AND v.make = ?';
            params.push(make);
        }
        
        if (year_min) {
            query += ' AND v.year >= ?';
            params.push(parseInt(year_min));
        }
        
        if (year_max) {
            query += ' AND v.year <= ?';
            params.push(parseInt(year_max));
        }
        
        query += ' ORDER BY v.make, v.model, v.year';
        
        const vehicles = await db.query(query, params);
        
        // Estadísticas por marca
        const makeStats = vehicles.reduce((acc, vehicle) => {
            const make = vehicle.make || 'Sin marca';
            if (!acc[make]) {
                acc[make] = { count: 0, years: [] };
            }
            acc[make].count++;
            acc[make].years.push(vehicle.year);
            return acc;
        }, {});
        
        // Calcular promedios de años por marca
        Object.keys(makeStats).forEach(make => {
            const years = makeStats[make].years;
            makeStats[make].averageYear = years.length > 0 ? years.reduce((a, b) => a + b, 0) / years.length : 0;
            makeStats[make].oldestYear = Math.min(...years);
            makeStats[make].newestYear = Math.max(...years);
            delete makeStats[make].years; // Limpiar array de años del resultado
        });
        
        res.json({
            success: true,
            report: {
                title: 'Reporte de Vehículos',
                filters: { make, year_min, year_max },
                data: vehicles,
                total: vehicles.length,
                makeStats: makeStats,
                averageYear: vehicles.length > 0 ? vehicles.reduce((sum, v) => sum + (v.year || 0), 0) / vehicles.length : 0
            }
        });
    } catch (error) {
        console.error('Error generando reporte de vehículos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/reports/repairs - Reporte de reparaciones
router.get('/repairs', async (req, res) => {
    try {
        const { date_from, date_to, mechanic_id, status } = req.query;
        
        let query = `
            SELECT r.*, 
                   m.name as mechanic_name,
                   v.make, v.model, v.year, v.license_plate,
                   c.name as customer_name, c.last_name as customer_last_name
            FROM repairs r
            LEFT JOIN mechanics m ON r.mechanic_id = m.id
            LEFT JOIN vehicles v ON r.vehicle_id = v.id
            LEFT JOIN customers c ON v.customer_id = c.id
            WHERE 1=1
        `;
        const params = [];
        
        if (date_from) {
            query += ' AND r.repair_date >= ?';
            params.push(date_from);
        }
        
        if (date_to) {
            query += ' AND r.repair_date <= ?';
            params.push(date_to);
        }
        
        if (mechanic_id) {
            query += ' AND r.mechanic_id = ?';
            params.push(parseInt(mechanic_id));
        }
        
        if (status) {
            query += ' AND r.status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY r.repair_date DESC';
        
        const repairs = await db.query(query, params);
        
        const totalLaborCost = repairs.reduce((sum, r) => sum + parseFloat(r.total_labor_cost || 0), 0);
        const totalPartsCost = repairs.reduce((sum, r) => sum + parseFloat(r.total_parts_cost || 0), 0);
        const totalCost = repairs.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0);
        
        // Estadísticas por mecánico
        const mechanicStats = repairs.reduce((acc, repair) => {
            const mechanicName = repair.mechanic_name || 'Sin mecánico';
            if (!acc[mechanicName]) {
                acc[mechanicName] = { count: 0, totalCost: 0, totalLaborCost: 0 };
            }
            acc[mechanicName].count++;
            acc[mechanicName].totalCost += parseFloat(repair.total_cost || 0);
            acc[mechanicName].totalLaborCost += parseFloat(repair.total_labor_cost || 0);
            return acc;
        }, {});
        
        res.json({
            success: true,
            report: {
                title: 'Reporte de Reparaciones',
                filters: { date_from, date_to, mechanic_id, status },
                data: repairs,
                total: repairs.length,
                totalLaborCost: totalLaborCost,
                totalPartsCost: totalPartsCost,
                totalCost: totalCost,
                averageCost: repairs.length > 0 ? totalCost / repairs.length : 0,
                mechanicStats: mechanicStats
            }
        });
    } catch (error) {
        console.error('Error generando reporte de reparaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/reports/summary - Resumen general del sistema
router.get('/summary', async (req, res) => {
    try {
        const [mechanics, serviceTypes, parts, customers, vehicles, repairs] = await Promise.all([
            db.getAllMechanics(),
            db.getAllServiceTypes(),
            db.getAllParts(),
            db.getAllCustomers(),
            db.getAllVehicles(),
            db.getAllRepairs()
        ]);
        
        const activeMechanics = mechanics.filter(m => m.is_active).length;
        const activeServiceTypes = serviceTypes.filter(st => st.is_active).length;
        const activeParts = parts.filter(p => p.is_active).length;
        
        const totalRepairCost = repairs.reduce((sum, r) => sum + parseFloat(r.total_cost || 0), 0);
        const totalLaborCost = repairs.reduce((sum, r) => sum + parseFloat(r.total_labor_cost || 0), 0);
        const totalPartsCost = repairs.reduce((sum, r) => sum + parseFloat(r.total_parts_cost || 0), 0);
        
        // Reparaciones por mes (últimos 6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentRepairs = repairs.filter(r => {
            const repairDate = new Date(r.repair_date);
            return repairDate >= sixMonthsAgo;
        });
        
        const repairsByMonth = recentRepairs.reduce((acc, repair) => {
            const month = new Date(repair.repair_date).toISOString().substring(0, 7); // YYYY-MM
            if (!acc[month]) {
                acc[month] = { count: 0, totalCost: 0 };
            }
            acc[month].count++;
            acc[month].totalCost += parseFloat(repair.total_cost || 0);
            return acc;
        }, {});
        
        res.json({
            success: true,
            report: {
                title: 'Resumen General del Sistema',
                summary: {
                    mechanics: {
                        total: mechanics.length,
                        active: activeMechanics,
                        inactive: mechanics.length - activeMechanics
                    },
                    serviceTypes: {
                        total: serviceTypes.length,
                        active: activeServiceTypes,
                        inactive: serviceTypes.length - activeServiceTypes
                    },
                    parts: {
                        total: parts.length,
                        active: activeParts,
                        inactive: parts.length - activeParts
                    },
                    customers: {
                        total: customers.length
                    },
                    vehicles: {
                        total: vehicles.length
                    },
                    repairs: {
                        total: repairs.length,
                        totalCost: totalRepairCost,
                        totalLaborCost: totalLaborCost,
                        totalPartsCost: totalPartsCost,
                        averageCost: repairs.length > 0 ? totalRepairCost / repairs.length : 0
                    }
                },
                repairsByMonth: repairsByMonth,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error generando resumen general:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

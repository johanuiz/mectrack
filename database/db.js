const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        const dbPath = process.env.DB_PATH || './database/mectrack.db';
        const dbDir = path.dirname(dbPath);
        
        // Crear directorio si no existe
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        
        this.db = new sqlite3.Database(dbPath);
        this.initDatabase();
    }

    initDatabase() {
        // Leer y ejecutar el esquema SQL
        const sqlPath = path.join(__dirname, '..', 'database.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            this.db.exec(sql, (err) => {
                if (err) {
                    console.error('Error inicializando base de datos:', err);
                } else {
                    console.log('✅ Base de datos inicializada correctamente');
                }
            });
        }
    }

    // Métodos para mecánicos
    async getMechanicByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM mechanics WHERE username = ? AND is_active = 1',
                [username],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    async getAllMechanics() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT id, name, username, email, phone, specialty, is_active, created_at FROM mechanics ORDER BY name',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Métodos para tipos de servicios
    async getAllServiceTypes() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT id, name, description, labor_cost, estimated_time, is_active, created_at FROM service_types WHERE is_active = 1 ORDER BY name',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    async getServiceTypeById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM service_types WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    async createServiceType(serviceTypeData) {
        return new Promise((resolve, reject) => {
            const { name, description, labor_cost, estimated_time } = serviceTypeData;
            this.db.run(
                `INSERT INTO service_types (name, description, labor_cost, estimated_time, is_active, created_at) 
                 VALUES (?, ?, ?, ?, 1, datetime('now'))`,
                [name, description, labor_cost, estimated_time],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async updateServiceType(id, updateData) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];
            
            if (updateData.name) {
                fields.push('name = ?');
                values.push(updateData.name);
            }
            if (updateData.description !== undefined) {
                fields.push('description = ?');
                values.push(updateData.description);
            }
            if (updateData.labor_cost) {
                fields.push('labor_cost = ?');
                values.push(updateData.labor_cost);
            }
            if (updateData.estimated_time !== undefined) {
                fields.push('estimated_time = ?');
                values.push(updateData.estimated_time);
            }
            
            if (fields.length === 0) {
                resolve();
                return;
            }
            
            values.push(id);
            
            this.db.run(
                `UPDATE service_types SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    async updateServiceTypeStatus(id, is_active) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE service_types SET is_active = ? WHERE id = ?',
                [is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    // Métodos para repuestos
    async getAllParts() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT id, name, part_number, description, cost, markup_percentage, final_price, category, brand, is_active, created_at FROM parts WHERE is_active = 1 ORDER BY name',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    async getPartById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM parts WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    async createPart(partData) {
        return new Promise((resolve, reject) => {
            const { name, part_number, description, cost, markup_percentage, final_price, category, brand } = partData;
            this.db.run(
                `INSERT INTO parts (name, part_number, description, cost, markup_percentage, final_price, category, brand, is_active, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
                [name, part_number, description, cost, markup_percentage, final_price, category, brand],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async updatePart(id, updateData) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];
            
            if (updateData.name) {
                fields.push('name = ?');
                values.push(updateData.name);
            }
            if (updateData.part_number !== undefined) {
                fields.push('part_number = ?');
                values.push(updateData.part_number);
            }
            if (updateData.description !== undefined) {
                fields.push('description = ?');
                values.push(updateData.description);
            }
            if (updateData.cost) {
                fields.push('cost = ?');
                values.push(updateData.cost);
            }
            if (updateData.markup_percentage !== undefined) {
                fields.push('markup_percentage = ?');
                values.push(updateData.markup_percentage);
            }
            if (updateData.final_price) {
                fields.push('final_price = ?');
                values.push(updateData.final_price);
            }
            if (updateData.category !== undefined) {
                fields.push('category = ?');
                values.push(updateData.category);
            }
            if (updateData.brand !== undefined) {
                fields.push('brand = ?');
                values.push(updateData.brand);
            }
            
            if (fields.length === 0) {
                resolve();
                return;
            }
            
            values.push(id);
            
            this.db.run(
                `UPDATE parts SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    async updatePartStatus(id, is_active) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE parts SET is_active = ? WHERE id = ?',
                [is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    // Método genérico para consultas personalizadas
    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ================================
    // MÉTODOS PARA REPARACIONES
    // ================================

    // Crear nueva reparación
    async createRepair(repairData) {
        return new Promise((resolve, reject) => {
            const {
                vehicle_id,
                mechanic_id,
                repair_date,
                description,
                total_labor_cost,
                total_parts_cost,
                total_cost,
                notes
            } = repairData;

            this.db.run(
                `INSERT INTO repairs (vehicle_id, mechanic_id, repair_date, description, 
                 total_labor_cost, total_parts_cost, total_cost, notes, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [vehicle_id, mechanic_id, repair_date, description, total_labor_cost, 
                 total_parts_cost, total_cost, notes],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Agregar servicio a reparación
    async addRepairService(repairId, serviceTypeId, quantity, laborCost) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO repair_services (repair_id, service_type_id, quantity, labor_cost) 
                 VALUES (?, ?, ?, ?)`,
                [repairId, serviceTypeId, quantity, laborCost],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Agregar repuesto a reparación
    async addRepairPart(repairId, partId, quantity, unitCost, totalCost) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO repair_parts (repair_id, part_id, quantity, unit_cost, total_cost) 
                 VALUES (?, ?, ?, ?, ?)`,
                [repairId, partId, quantity, unitCost, totalCost],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Obtener reparaciones por mecánico
    async getRepairsByMechanic(mechanicId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT r.*, v.make, v.model, v.year, v.license_plate,
                        c.name as customer_name, c.last_name as customer_last_name
                 FROM repairs r
                 JOIN vehicles v ON r.vehicle_id = v.id
                 JOIN customers c ON v.customer_id = c.id
                 WHERE r.mechanic_id = ?
                 ORDER BY r.repair_date DESC`,
                [mechanicId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Obtener detalles completos de una reparación
    async getRepairDetails(repairId) {
        return new Promise((resolve, reject) => {
            // Obtener información básica de la reparación
            this.db.get(
                `SELECT r.*, v.make, v.model, v.year, v.license_plate,
                        c.name as customer_name, c.last_name as customer_last_name,
                        m.name as mechanic_name
                 FROM repairs r
                 JOIN vehicles v ON r.vehicle_id = v.id
                 JOIN customers c ON v.customer_id = c.id
                 JOIN mechanics m ON r.mechanic_id = m.id
                 WHERE r.id = ?`,
                [repairId],
                async (err, repair) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    if (!repair) {
                        resolve(null);
                        return;
                    }

                    try {
                        // Obtener servicios
                        const services = await this.getRepairServices(repairId);
                        // Obtener repuestos
                        const parts = await this.getRepairParts(repairId);
                        
                        resolve({
                            ...repair,
                            services,
                            parts
                        });
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    // Obtener servicios de una reparación
    async getRepairServices(repairId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT rs.*, st.name as service_name, st.description as service_description
                 FROM repair_services rs
                 JOIN service_types st ON rs.service_type_id = st.id
                 WHERE rs.repair_id = ?`,
                [repairId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Obtener repuestos de una reparación
    async getRepairParts(repairId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT rp.*, p.name as part_name, p.part_number, p.category, p.brand
                 FROM repair_parts rp
                 JOIN parts p ON rp.part_id = p.id
                 WHERE rp.repair_id = ?`,
                [repairId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Métodos para reportes
    async getAllCustomers() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT c.*, COUNT(v.id) as vehicle_count
                 FROM customers c
                 LEFT JOIN vehicles v ON c.id = v.customer_id
                 GROUP BY c.id
                 ORDER BY c.name, c.last_name`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    async updateCustomer(id, customerData) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE customers SET 
                    name = ?, last_name = ?, phone = ?, email = ?, address = ?
                 WHERE id = ?`,
                [
                    customerData.name,
                    customerData.last_name,
                    customerData.phone,
                    customerData.email || null,
                    customerData.address || null,
                    id
                ],
                function(err) {
                    if (err) reject(err);
                    else resolve(this);
                }
            );
        });
    }

    async deactivateCustomer(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE customers SET is_active = 0 WHERE id = ?',
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this);
                }
            );
        });
    }

    async getAllVehicles() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT v.*, c.name as customer_name, c.last_name as customer_last_name
                 FROM vehicles v
                 JOIN customers c ON v.customer_id = c.id
                 ORDER BY v.make, v.model`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    async updateVehicle(id, vehicleData) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE vehicles SET 
                    customer_id = ?, make = ?, model = ?, year = ?, 
                    license_plate = ?, vin = ?, color = ?, engine_type = ?, mileage = ?
                 WHERE id = ?`,
                [
                    vehicleData.customer_id,
                    vehicleData.make,
                    vehicleData.model,
                    vehicleData.year,
                    vehicleData.license_plate || null,
                    vehicleData.vin || null,
                    vehicleData.color || null,
                    vehicleData.engine_type || null,
                    vehicleData.mileage || null,
                    id
                ],
                function(err) {
                    if (err) reject(err);
                    else resolve(this);
                }
            );
        });
    }

    async deactivateVehicle(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE vehicles SET is_active = 0 WHERE id = ?',
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this);
                }
            );
        });
    }

    async getAllRepairs() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM repairs ORDER BY repair_date DESC',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Métodos para clientes
    async createCustomer(customerData) {
        return new Promise((resolve, reject) => {
            const { name, last_name, phone, email, address } = customerData;
            this.db.run(
                `INSERT INTO customers (name, last_name, phone, email, address) 
                 VALUES (?, ?, ?, ?, ?)`,
                [name, last_name, phone, email, address],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async searchCustomers(searchTerm) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM customers 
                 WHERE name LIKE ? OR last_name LIKE ? OR phone LIKE ? 
                 ORDER BY name, last_name`,
                [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Métodos para vehículos
    async createVehicle(vehicleData) {
        return new Promise((resolve, reject) => {
            const { customer_id, make, model, year, license_plate, vin, color, engine_type, mileage } = vehicleData;
            this.db.run(
                `INSERT INTO vehicles (customer_id, make, model, year, license_plate, vin, color, engine_type, mileage) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [customer_id, make, model, year, license_plate, vin, color, engine_type, mileage],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async getVehiclesByCustomer(customerId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM vehicles WHERE customer_id = ? ORDER BY year DESC',
                [customerId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    async searchVehicles(searchTerm) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT v.*, c.name as customer_name, c.last_name as customer_last_name 
                 FROM vehicles v 
                 JOIN customers c ON v.customer_id = c.id 
                 WHERE v.license_plate LIKE ? OR v.vin LIKE ? OR v.make LIKE ? OR v.model LIKE ?
                 ORDER BY v.make, v.model`,
                [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Métodos para reparaciones
    async createRepair(repairData) {
        return new Promise((resolve, reject) => {
            const { vehicle_id, mechanic_id, repair_date, description, total_labor_cost, total_parts_cost, total_cost, status, notes } = repairData;
            this.db.run(
                `INSERT INTO repairs (vehicle_id, mechanic_id, repair_date, description, total_labor_cost, total_parts_cost, total_cost, status, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [vehicle_id, mechanic_id, repair_date, description, total_labor_cost, total_parts_cost, total_cost, status, notes],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async addRepairService(repairId, serviceTypeId, quantity, laborCost) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO repair_services (repair_id, service_type_id, quantity, labor_cost) VALUES (?, ?, ?, ?)',
                [repairId, serviceTypeId, quantity, laborCost],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async addRepairPart(repairId, partId, quantity, unitCost, totalCost) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO repair_parts (repair_id, part_id, quantity, unit_cost, total_cost) VALUES (?, ?, ?, ?, ?)',
                [repairId, partId, quantity, unitCost, totalCost],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async getRepairHistory(vehicleId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT r.*, m.name as mechanic_name, st.name as service_name, p.name as part_name
                 FROM repairs r
                 JOIN mechanics m ON r.mechanic_id = m.id
                 LEFT JOIN repair_services rs ON r.id = rs.repair_id
                 LEFT JOIN service_types st ON rs.service_type_id = st.id
                 LEFT JOIN repair_parts rp ON r.id = rp.repair_id
                 LEFT JOIN parts p ON rp.part_id = p.id
                 WHERE r.vehicle_id = ?
                 ORDER BY r.repair_date DESC`,
                [vehicleId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    async getRepairById(repairId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT r.*, v.make, v.model, v.year, v.license_plate, c.name as customer_name, c.last_name as customer_last_name, m.name as mechanic_name
                 FROM repairs r
                 JOIN vehicles v ON r.vehicle_id = v.id
                 JOIN customers c ON v.customer_id = c.id
                 JOIN mechanics m ON r.mechanic_id = m.id
                 WHERE r.id = ?`,
                [repairId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    // Métodos para estadísticas
    async getRepairStats(mechanicId = null) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT 
                    COUNT(*) as total_repairs,
                    SUM(total_cost) as total_revenue,
                    AVG(total_cost) as avg_cost,
                    COUNT(DISTINCT vehicle_id) as unique_vehicles
                FROM repairs
                WHERE repair_date >= date('now', '-30 days')
            `;
            
            const params = [];
            if (mechanicId) {
                query += ' AND mechanic_id = ?';
                params.push(mechanicId);
            }

            this.db.get(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Funciones adicionales para gestión de mecánicos
    async getMechanicById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM mechanics WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    async createMechanic(mechanicData) {
        return new Promise((resolve, reject) => {
            const { name, username, password, email, phone, specialty, is_active } = mechanicData;
            this.db.run(
                `INSERT INTO mechanics (name, username, password_hash, email, phone, specialty, is_active, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [name, username, password, email, phone, specialty, is_active],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    async updateMechanic(id, updateData) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];
            
            if (updateData.name) {
                fields.push('name = ?');
                values.push(updateData.name);
            }
            if (updateData.username) {
                fields.push('username = ?');
                values.push(updateData.username);
            }
            if (updateData.password) {
                fields.push('password_hash = ?');
                values.push(updateData.password);
            }
            if (updateData.email !== undefined) {
                fields.push('email = ?');
                values.push(updateData.email);
            }
            if (updateData.phone !== undefined) {
                fields.push('phone = ?');
                values.push(updateData.phone);
            }
            if (updateData.specialty !== undefined) {
                fields.push('specialty = ?');
                values.push(updateData.specialty);
            }
            
            if (fields.length === 0) {
                resolve();
                return;
            }
            
            fields.push('updated_at = datetime(\'now\')');
            values.push(id);
            
            this.db.run(
                `UPDATE mechanics SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    async updateMechanicStatus(id, is_active) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE mechanics SET is_active = ?, updated_at = datetime(\'now\') WHERE id = ?',
                [is_active, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;

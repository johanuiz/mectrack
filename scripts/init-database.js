const Database = require('../database/db');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
    console.log('🚀 Inicializando base de datos MecTrack...');
    
    const db = new Database();
    
    try {
        // Crear mecánicos de ejemplo con contraseñas hasheadas
        const mechanics = [
            {
                name: 'Juan Pérez',
                username: 'jperez',
                password: '123456',
                email: 'juan@taller.com',
                phone: '555-0101'
            },
            {
                name: 'María García',
                username: 'mgarcia',
                password: '123456',
                email: 'maria@taller.com',
                phone: '555-0102'
            },
            {
                name: 'Carlos López',
                username: 'clopez',
                password: '123456',
                email: 'carlos@taller.com',
                phone: '555-0103'
            }
        ];

        console.log('👨‍🔧 Creando mecánicos...');
        for (const mechanic of mechanics) {
            const passwordHash = await bcrypt.hash(mechanic.password, 10);
            
            // Verificar si el mecánico ya existe
            const existing = await db.getMechanicByUsername(mechanic.username);
            if (!existing) {
                await new Promise((resolve, reject) => {
                    db.db.run(
                        `INSERT INTO mechanics (name, username, password_hash, email, phone) 
                         VALUES (?, ?, ?, ?, ?)`,
                        [mechanic.name, mechanic.username, passwordHash, mechanic.email, mechanic.phone],
                        function(err) {
                            if (err) reject(err);
                            else resolve(this.lastID);
                        }
                    );
                });
                console.log(`✅ Mecánico creado: ${mechanic.name} (${mechanic.username})`);
            } else {
                console.log(`⚠️  Mecánico ya existe: ${mechanic.name}`);
            }
        }

        // Crear clientes de ejemplo
        console.log('👥 Creando clientes de ejemplo...');
        const customers = [
            {
                name: 'Roberto',
                last_name: 'Martínez',
                phone: '555-1001',
                email: 'roberto@email.com',
                address: 'Calle Principal 123'
            },
            {
                name: 'Ana',
                last_name: 'Rodríguez',
                phone: '555-1002',
                email: 'ana@email.com',
                address: 'Avenida Central 456'
            },
            {
                name: 'Luis',
                last_name: 'Fernández',
                phone: '555-1003',
                email: 'luis@email.com',
                address: 'Calle Secundaria 789'
            }
        ];

        for (const customer of customers) {
            await db.createCustomer(customer);
            console.log(`✅ Cliente creado: ${customer.name} ${customer.last_name}`);
        }

        // Crear vehículos de ejemplo
        console.log('🚗 Creando vehículos de ejemplo...');
        const vehicles = [
            {
                customer_id: 1,
                make: 'Toyota',
                model: 'Corolla',
                year: 2020,
                license_plate: 'ABC-123',
                vin: '1HGBH41JXMN109186',
                color: 'Blanco',
                engine_type: '4 Cilindros',
                mileage: 45000
            },
            {
                customer_id: 1,
                make: 'Honda',
                model: 'Civic',
                year: 2019,
                license_plate: 'DEF-456',
                vin: '1HGBH41JXMN109187',
                color: 'Azul',
                engine_type: '4 Cilindros',
                mileage: 52000
            },
            {
                customer_id: 2,
                make: 'Ford',
                model: 'Focus',
                year: 2021,
                license_plate: 'GHI-789',
                vin: '1HGBH41JXMN109188',
                color: 'Rojo',
                engine_type: '4 Cilindros',
                mileage: 28000
            },
            {
                customer_id: 3,
                make: 'Nissan',
                model: 'Sentra',
                year: 2018,
                license_plate: 'JKL-012',
                vin: '1HGBH41JXMN109189',
                color: 'Gris',
                engine_type: '4 Cilindros',
                mileage: 67000
            }
        ];

        for (const vehicle of vehicles) {
            await db.createVehicle(vehicle);
            console.log(`✅ Vehículo creado: ${vehicle.make} ${vehicle.model} ${vehicle.year}`);
        }

        // Crear algunas reparaciones de ejemplo
        console.log('🔧 Creando reparaciones de ejemplo...');
        const repairs = [
            {
                vehicle_id: 1,
                mechanic_id: 1,
                repair_date: new Date('2024-01-15T10:30:00'),
                description: 'Cambio de aceite y filtro',
                total_labor_cost: 25.00,
                total_parts_cost: 47.75,
                total_cost: 72.75,
                status: 'completed',
                notes: 'Aceite sintético 5W-30'
            },
            {
                vehicle_id: 2,
                mechanic_id: 2,
                repair_date: new Date('2024-01-20T14:15:00'),
                description: 'Revisión de frenos',
                total_labor_cost: 45.00,
                total_parts_cost: 72.00,
                total_cost: 117.00,
                status: 'completed',
                notes: 'Pastillas delanteras reemplazadas'
            },
            {
                vehicle_id: 3,
                mechanic_id: 1,
                repair_date: new Date('2024-01-25T09:00:00'),
                description: 'Alineación y balanceo',
                total_labor_cost: 35.00,
                total_parts_cost: 0.00,
                total_cost: 35.00,
                status: 'completed',
                notes: 'Alineación corregida'
            }
        ];

        for (const repair of repairs) {
            const repairId = await db.createRepair(repair);
            console.log(`✅ Reparación creada: ID ${repairId}`);
        }

        console.log('\n🎉 ¡Base de datos inicializada exitosamente!');
        console.log('\n📋 Credenciales de acceso:');
        console.log('Usuario: jperez | Contraseña: 123456');
        console.log('Usuario: mgarcia | Contraseña: 123456');
        console.log('Usuario: clopez | Contraseña: 123456');
        console.log('\n🚀 Puede iniciar el servidor con: npm start');

    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
    } finally {
        db.close();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;

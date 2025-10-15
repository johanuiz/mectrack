-- MecTrack Database Schema
-- Sistema de Control de Reparaciones de Taller Mecánico

-- Tabla de mecánicos
CREATE TABLE IF NOT EXISTS mechanics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    specialty VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    is_active BOOLEAN DEFAULT 1
);

-- Tabla de tipos de servicios
CREATE TABLE IF NOT EXISTS service_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    labor_cost DECIMAL(10,2) NOT NULL,
    estimated_time INTEGER, -- en minutos
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de repuestos
CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    part_number VARCHAR(50),
    description TEXT,
    cost DECIMAL(10,2) NOT NULL,
    markup_percentage DECIMAL(5,2) DEFAULT 0, -- Porcentaje de ganancia
    final_price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    brand VARCHAR(50),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    license_plate VARCHAR(20) UNIQUE,
    vin VARCHAR(17),
    color VARCHAR(30),
    engine_type VARCHAR(50),
    mileage INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabla de reparaciones
CREATE TABLE IF NOT EXISTS repairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    mechanic_id INTEGER NOT NULL,
    repair_date DATETIME NOT NULL,
    description TEXT,
    total_labor_cost DECIMAL(10,2) DEFAULT 0,
    total_parts_cost DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed', -- completed, in_progress, pending
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);

-- Tabla de servicios de reparación
CREATE TABLE IF NOT EXISTS repair_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repair_id INTEGER NOT NULL,
    service_type_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    labor_cost DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (repair_id) REFERENCES repairs(id),
    FOREIGN KEY (service_type_id) REFERENCES service_types(id)
);

-- Tabla de repuestos utilizados en reparaciones
CREATE TABLE IF NOT EXISTS repair_parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repair_id INTEGER NOT NULL,
    part_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (repair_id) REFERENCES repairs(id),
    FOREIGN KEY (part_id) REFERENCES parts(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_license ON vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_repairs_vehicle ON repairs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_repairs_mechanic ON repairs(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_repairs_date ON repairs(repair_date);
CREATE INDEX IF NOT EXISTS idx_repair_services_repair ON repair_services(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_parts_repair ON repair_parts(repair_id);


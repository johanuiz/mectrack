// MecTrack - Unified System JavaScript
console.log('MecTrack JavaScript loaded');

let currentUser = null;
let userType = null;

// Test function
function testButton() {
    console.log('testButton called');
    alert('¡JavaScript funcionando correctamente!');
}

// Test function for repair button
function testRepairButton() {
    console.log('=== testRepairButton called ===');
    alert('¡Botón de reparación funcionando!');
}

// Test function for save repair
function testSaveRepair() {
    console.log('=== testSaveRepair called ===');
    
    // Create a mock event
    const mockEvent = {
        preventDefault: function() {
            console.log('preventDefault called');
        },
        target: document.getElementById('newRepairForm')
    };
    
    // Call the repair form submit handler directly
    handleRepairFormSubmit(mockEvent);
}

// Test function for reports
function testReportModal() {
    console.log('=== testReportModal called ===');
    
    const testContent = `
        <div class="report-header">
            <h3><i class="bi bi-test-tube"></i> Test Report</h3>
            <p>Este es un reporte de prueba</p>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <p>Si puedes ver este contenido, el modal está funcionando correctamente.</p>
        </div>
    `;
    
    showReportModal('Test Report', testContent);
}

// Show repair history (redirects to reports)
function showRepairHistory() {
    console.log('showRepairHistory called');
    hideAllViews();
    document.getElementById('reportsManagement').classList.remove('hidden');
    
    // Setup report option listeners
    setupReportListeners();
}

// Setup report option listeners
function setupReportListeners() {
    console.log('Setting up report listeners');
    
    const reportOptions = document.querySelectorAll('.report-option');
    console.log('Found report options:', reportOptions.length);
    
    reportOptions.forEach(option => {
        const reportType = option.getAttribute('data-report');
        console.log('Setting up listener for report type:', reportType);
        
        option.addEventListener('click', function() {
            console.log('Report option clicked:', reportType);
            console.log('About to call generateReport with type:', reportType);
            try {
                generateReport(reportType);
                console.log('generateReport called successfully for:', reportType);
            } catch (error) {
                console.error('Error calling generateReport:', error);
            }
        });
        
        // Add hover effect
        option.style.cursor = 'pointer';
        option.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.2s ease';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = '';
        });
    });
}

// Generate report based on type
function generateReport(reportType) {
    console.log('=== generateReport called ===');
    console.log('Generating report for type:', reportType);
    console.log('Report type received:', typeof reportType, reportType);
    
    try {
        switch(reportType) {
            case 'summary':
                console.log('Calling generateSummaryReport...');
                generateSummaryReport();
                console.log('generateSummaryReport completed');
                break;
            case 'mechanics':
                console.log('Calling generateMechanicsReport...');
                generateMechanicsReport();
                console.log('generateMechanicsReport completed');
                break;
            case 'service-types':
                console.log('Calling generateServiceTypesReport...');
                generateServiceTypesReport();
                console.log('generateServiceTypesReport completed');
                break;
            case 'parts':
                console.log('Calling generatePartsReport...');
                generatePartsReport();
                console.log('generatePartsReport completed');
                break;
            case 'customers':
                console.log('Calling generateCustomersReport...');
                generateCustomersReport();
                console.log('generateCustomersReport completed');
                break;
            case 'vehicles':
                console.log('Calling generateVehiclesReport...');
                generateVehiclesReport();
                console.log('generateVehiclesReport completed');
                break;
            case 'repairs':
                console.log('Calling generateRepairsReport...');
                generateRepairsReport();
                console.log('generateRepairsReport completed');
                break;
            default:
                console.error('Unknown report type:', reportType);
                console.error('Available report types: summary, mechanics, service-types, parts, customers, vehicles, repairs');
        }
    } catch (error) {
        console.error('Error in generateReport:', error);
        console.error('Error stack:', error.stack);
    }
    
    console.log('generateReport completed for type:', reportType);
}

// Generate repairs report
async function generateRepairsReport() {
    console.log('Generating repairs report...');
    
    try {
        const response = await fetch('/api/repairs');
        const data = await response.json();
        
        if (data.success) {
            displayRepairsReport(data.repairs);
        } else {
            console.error('Error fetching repairs:', data.message);
            alert('Error al cargar las reparaciones: ' + data.message);
        }
    } catch (error) {
        console.error('Error generating repairs report:', error);
        alert('Error de conexión al generar el reporte');
    }
}

// Display repairs report
function displayRepairsReport(repairs) {
    console.log('Displaying repairs report, count:', repairs.length);
    
    // Create report content
    let reportContent = `
        <div class="report-header">
            <h3><i class="bi bi-wrench"></i> Reporte de Reparaciones</h3>
            <p>Total de reparaciones: ${repairs.length}</p>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Vehículo</th>
                        <th>Mecánico</th>
                        <th>Descripción</th>
                        <th>Costo Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    repairs.forEach(repair => {
        reportContent += `
            <tr>
                <td>${repair.id}</td>
                <td>${new Date(repair.repair_date).toLocaleDateString()}</td>
                <td>${repair.vehicle_info || 'N/A'}</td>
                <td>${repair.mechanic_info || 'N/A'}</td>
                <td>${repair.description || 'Sin descripción'}</td>
                <td>$${repair.total_cost || 0}</td>
            </tr>
        `;
    });
    
    reportContent += `
                </tbody>
            </table>
        </div>
    `;
    
    // Show report in modal or new window
    showReportModal('Reporte de Reparaciones', reportContent);
}

// Show report in modal
function showReportModal(title, content) {
    console.log('=== showReportModal called ===');
    console.log('Title:', title);
    console.log('Content length:', content.length);
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('reportModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reportModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reportModalTitle"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="reportModalBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="printReport()">Imprimir</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Set content
    document.getElementById('reportModalTitle').textContent = title;
    document.getElementById('reportModalBody').innerHTML = content;
    
    // Show modal
    console.log('Creating Bootstrap modal instance...');
    const bootstrapModal = new bootstrap.Modal(modal);
    console.log('Showing modal...');
    bootstrapModal.show();
    console.log('Modal show() called');
}

// Print report
function printReport() {
    const reportContent = document.getElementById('reportModalBody').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Reporte</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            ${reportContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Generate summary report
function generateSummaryReport() {
    console.log('=== generateSummaryReport called ===');
    console.log('Generating summary report...');
    const content = `
        <div class="report-header">
            <h3><i class="bi bi-speedometer2"></i> Resumen General</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Estadísticas Generales</h5>
                            <p class="card-text">Este reporte mostrará estadísticas generales del sistema.</p>
                            <p class="text-muted">Funcionalidad en desarrollo...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    console.log('About to show summary report modal...');
    showReportModal('Resumen General', content);
    console.log('Summary report modal shown');
}

// Generate mechanics report
function generateMechanicsReport() {
    console.log('Generating mechanics report...');
    const content = `
        <div class="report-header">
            <h3><i class="bi bi-people"></i> Reporte de Mecánicos</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <p>Este reporte mostrará información sobre los mecánicos del taller.</p>
            <p class="text-muted">Funcionalidad en desarrollo...</p>
        </div>
    `;
    showReportModal('Reporte de Mecánicos', content);
}

// Generate service types report
function generateServiceTypesReport() {
    console.log('Generating service types report...');
    const content = `
        <div class="report-header">
            <h3><i class="bi bi-tools"></i> Reporte de Servicios</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <p>Este reporte mostrará los tipos de servicios y sus costos.</p>
            <p class="text-muted">Funcionalidad en desarrollo...</p>
        </div>
    `;
    showReportModal('Reporte de Servicios', content);
}

// Generate parts report
function generatePartsReport() {
    console.log('Generating parts report...');
    const content = `
        <div class="report-header">
            <h3><i class="bi bi-gear"></i> Reporte de Repuestos</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <p>Este reporte mostrará el inventario de repuestos.</p>
            <p class="text-muted">Funcionalidad en desarrollo...</p>
        </div>
    `;
    showReportModal('Reporte de Repuestos', content);
}

// Generate customers report
function generateCustomersReport() {
    console.log('Generating customers report...');
    const content = `
        <div class="report-header">
            <h3><i class="bi bi-person-lines-fill"></i> Reporte de Clientes</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <p>Este reporte mostrará la lista de clientes y sus vehículos.</p>
            <p class="text-muted">Funcionalidad en desarrollo...</p>
        </div>
    `;
    showReportModal('Reporte de Clientes', content);
}

// Generate vehicles report
function generateVehiclesReport() {
    console.log('Generating vehicles report...');
    const content = `
        <div class="report-header">
            <h3><i class="bi bi-car-front"></i> Reporte de Vehículos</h3>
            <p>Generado el: ${new Date().toLocaleString()}</p>
        </div>
        <div class="report-content">
            <p>Este reporte mostrará los vehículos registrados por marca y modelo.</p>
            <p class="text-muted">Funcionalidad en desarrollo...</p>
        </div>
    `;
    showReportModal('Reporte de Vehículos', content);
}

// Navigation functions
function showLogin() {
    console.log('showLogin called');
    hideAllViews();
    document.getElementById('loginScreen').classList.remove('hidden');
}

function showLanding() {
    console.log('showLanding called');
    hideAllViews();
    document.getElementById('landingPage').classList.remove('hidden');
    currentUser = null;
    userType = null;
}

function hideAllViews() {
    const views = [
        'landingPage', 
        'loginScreen', 
        'mechanicDashboard', 
        'adminDashboard', 
        'mechanicsManagement',
        'serviceTypesManagement',
        'partsManagement',
        'customersManagement',
        'vehiclesManagement',
        'newRepairManagement',
        'reportsManagement'
    ];
    views.forEach(viewId => {
        const element = document.getElementById(viewId);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

// Login handler
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        // Try login
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.mechanic;
            
            // Determinar tipo de usuario basado en la especialidad
            if (data.mechanic.specialty === 'Administrador' || data.mechanic.username === 'admin') {
                userType = 'admin';
                showAdminDashboard();
            } else {
                userType = 'mechanic';
                showMechanicDashboard();
            }
            return;
        }
    } catch (error) {
        console.error('Login error:', error);
    }

    // Si llegamos aquí, el login falló
    if (errorDiv) {
        errorDiv.textContent = 'Credenciales incorrectas. Verifique usuario y contraseña.';
        errorDiv.classList.remove('hidden');
    }
}

function showMechanicDashboard() {
    console.log('Showing mechanic dashboard for:', currentUser.name);
    hideAllViews();
    document.getElementById('mechanicName').textContent = currentUser.name;
    document.getElementById('mechanicDashboard').classList.remove('hidden');
}

function showAdminDashboard() {
    console.log('Showing admin dashboard');
    hideAllViews();
    document.getElementById('adminDashboard').classList.remove('hidden');
}

function logout() {
    currentUser = null;
    userType = null;
    showLanding();
}

// Mechanic functions - These are now implemented in the sections below

// Admin functions
function showMechanics() {
    console.log('Showing mechanics management');
    hideAllViews();
    document.getElementById('mechanicsManagement').classList.remove('hidden');
    loadMechanics();
}

// Admin functions - These are now implemented in the sections below

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, MecTrack navigation ready');
    
    // Check if Bootstrap is loaded
    console.log('Bootstrap available:', typeof bootstrap !== 'undefined');
    if (typeof bootstrap !== 'undefined') {
        console.log('Bootstrap version:', bootstrap.Modal.VERSION || 'unknown');
    } else {
        console.error('Bootstrap is not loaded!');
    }
    
    // Setup button event listeners
    const testButtonEl = document.querySelector('[data-action="test"]');
    if (testButtonEl) {
        testButtonEl.addEventListener('click', testButton);
    }
    
    const loginButtonEl = document.querySelector('[data-action="login"]');
    if (loginButtonEl) {
        loginButtonEl.addEventListener('click', showLogin);
    }
    
    const backButtonEl = document.querySelector('[data-action="back"]');
    if (backButtonEl) {
        backButtonEl.addEventListener('click', showLanding);
    }
    
    const logoutButtonEl = document.querySelector('[data-action="logout"]');
    if (logoutButtonEl) {
        logoutButtonEl.addEventListener('click', logout);
    }
    
    // Setup form event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Setup mechanic dashboard buttons
    const mechanicButtons = document.querySelectorAll('[data-action^="mechanic-"]');
    mechanicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            switch(action) {
                case 'mechanic-new-repair':
                    showNewRepair();
                    break;
                case 'mechanic-history':
                    showRepairHistory();
                    break;
                case 'mechanic-customers':
                    showCustomers();
                    break;
                case 'mechanic-vehicles':
                    showVehiclesManagement();
                    break;
            }
        });
    });
    
    // Setup admin dashboard buttons
    const adminButtons = document.querySelectorAll('[data-action^="admin-"]');
    adminButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            switch(action) {
                case 'admin-mechanics':
                    showMechanics();
                    break;
                case 'admin-services':
                    showServiceTypes();
                    break;
                case 'admin-parts':
                    showParts();
                    break;
                case 'admin-reports':
                    showReports();
                    break;
                case 'admin-customers':
                    showCustomersManagement();
                    break;
                case 'admin-vehicles':
                    showVehiclesManagement();
                    break;
            }
        });
    });
    
    // Setup mechanics management buttons
    setupMechanicsEventListeners();
    
    // Setup mechanics form
    const mechanicForm = document.getElementById('mechanicForm');
    if (mechanicForm) {
        mechanicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleMechanicFormSubmit();
        });
    }
    
    // Setup service types form
    const serviceTypeForm = document.getElementById('serviceTypeForm');
    if (serviceTypeForm) {
        serviceTypeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleServiceTypeFormSubmit(e);
        });
    }
    
    // Setup parts form
    const partForm = document.getElementById('partForm');
    if (partForm) {
        partForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePartFormSubmit(e);
        });
    }
    
    // Setup reports filters form
    const reportFiltersForm = document.getElementById('reportFilters');
    if (reportFiltersForm) {
        reportFiltersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleReportFiltersSubmit(e);
        });
    }

    // Event listener for new repair form
    const newRepairForm = document.getElementById('newRepairForm');
    console.log('=== Setting up repair form listeners ===');
    console.log('newRepairForm found:', !!newRepairForm);
    
    if (newRepairForm) {
        // Remove any existing listeners to avoid duplicates
        newRepairForm.removeEventListener('submit', handleRepairFormSubmit);
        
        newRepairForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('=== Form submit event triggered ===');
            console.log('Event:', e);
            console.log('Target:', e.target);
            handleRepairFormSubmit(e);
        });
        
        console.log('Repair form submit listener added successfully');
    } else {
        console.error('newRepairForm not found!');
    }

    // Event listener for new vehicle form
    const newVehicleForm = document.getElementById('newVehicleForm');
    if (newVehicleForm) {
        newVehicleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewVehicleSubmit();
        });
    }

    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVehicleFormSubmit(e);
        });
    }

    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCustomerFormSubmit(e);
        });
    }
    
    console.log('Event listeners setup complete');
    console.log('testButton available:', typeof testButton);
    console.log('showLogin available:', typeof showLogin);
});

// Mechanics Management Functions
async function loadMechanics() {
    try {
        const response = await fetch('/api/mechanics');
        const data = await response.json();
        
        if (data.success) {
            displayMechanics(data.mechanics);
        } else {
            showMessage('Error al cargar mecánicos: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading mechanics:', error);
        showMessage('Error de conexión al cargar mecánicos', 'danger');
    }
}

function displayMechanics(mechanics) {
    const mechanicsList = document.getElementById('mechanicsList');
    
    if (mechanics.length === 0) {
        mechanicsList.innerHTML = '<div class="alert alert-info">No hay mecánicos registrados</div>';
        return;
    }
    
    mechanicsList.innerHTML = mechanics.map(mechanic => `
        <div class="mechanic-card ${mechanic.is_active ? '' : 'inactive'}">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <i class="bi bi-person-gear display-6 text-primary"></i>
                        </div>
                        <div>
                            <h6 class="mb-1">${mechanic.name}</h6>
                            <small class="text-muted">Usuario: ${mechanic.username}</small>
                            <br>
                            <small class="text-muted">
                                ${mechanic.email ? `Email: ${mechanic.email}` : ''}
                                ${mechanic.phone ? ` | Tel: ${mechanic.phone}` : ''}
                            </small>
                            <br>
                            <small class="text-muted">
                                ${mechanic.specialty ? `Especialidad: ${mechanic.specialty}` : ''}
                            </small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <span class="badge ${mechanic.is_active ? 'bg-success' : 'bg-secondary'} status-badge">
                        ${mechanic.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                    <div class="action-buttons mt-2">
                        <button class="btn btn-sm btn-outline-primary" data-action="edit-mechanic" data-id="${mechanic.id}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm ${mechanic.is_active ? 'btn-outline-warning' : 'btn-outline-success'}" 
                                data-action="${mechanic.is_active ? 'deactivate-mechanic' : 'activate-mechanic'}" 
                                data-id="${mechanic.id}">
                            <i class="bi bi-${mechanic.is_active ? 'pause' : 'play'}"></i> 
                            ${mechanic.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('mechanicMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type}`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

function resetMechanicForm() {
    document.getElementById('mechanicForm').reset();
    document.getElementById('mechanicId').value = '';
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Mecánico';
}

async function saveMechanic(formData) {
    const mechanicId = document.getElementById('mechanicId').value;
    const url = mechanicId ? `/api/mechanics/${mechanicId}` : '/api/mechanics';
    const method = mechanicId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message, 'success');
            resetMechanicForm();
            loadMechanics();
        } else {
            showMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error saving mechanic:', error);
        showMessage('Error de conexión al guardar mecánico', 'danger');
    }
}

async function toggleMechanicStatus(mechanicId, activate) {
    try {
        const response = await fetch(`/api/mechanics/${mechanicId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: activate })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message, 'success');
            loadMechanics();
        } else {
            showMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error toggling mechanic status:', error);
        showMessage('Error de conexión al cambiar estado del mecánico', 'danger');
    }
}

async function loadMechanicForEdit(mechanicId) {
    try {
        const response = await fetch(`/api/mechanics/${mechanicId}`);
        const data = await response.json();
        
        if (data.success) {
            const mechanic = data.mechanic;
            document.getElementById('mechanicId').value = mechanic.id;
            document.getElementById('mechanicFormName').value = mechanic.name;
            document.getElementById('mechanicUsername').value = mechanic.username;
            document.getElementById('mechanicPassword').value = '';
            document.getElementById('mechanicEmail').value = mechanic.email || '';
            document.getElementById('mechanicPhone').value = mechanic.phone || '';
            document.getElementById('mechanicSpecialty').value = mechanic.specialty || '';
            document.getElementById('formTitle').textContent = 'Editar Mecánico';
        } else {
            showMessage('Error al cargar datos del mecánico: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading mechanic for edit:', error);
        showMessage('Error de conexión al cargar mecánico', 'danger');
    }
}

function setupMechanicsEventListeners() {
    // Use event delegation for dynamically created buttons
    document.addEventListener('click', function(e) {
        const action = e.target.getAttribute('data-action');
        const mechanicId = e.target.getAttribute('data-id');
        const reportType = e.target.getAttribute('data-report');
        
        // Handle report type selection
        if (reportType) {
            selectReportType(reportType);
            return;
        }
        
        if (!action) return;
        
        switch(action) {
            case 'add-mechanic':
                resetMechanicForm();
                break;
                
            case 'cancel-mechanic':
                resetMechanicForm();
                break;
                
            case 'back-to-admin':
                showAdminDashboard();
                break;
                
            case 'add-service-type':
                resetServiceTypeForm();
                break;
                
            case 'cancel-service-type':
                resetServiceTypeForm();
                break;
                
            case 'add-part':
                // Check if we're in the repair form context
                if (document.getElementById('newRepairManagement') && !document.getElementById('newRepairManagement').classList.contains('hidden')) {
                    addPart();
                } else {
                    resetPartForm();
                }
                break;
                
            case 'cancel-part':
                resetPartForm();
                break;
                
            case 'back-to-reports':
                resetReportsView();
                break;
                
            case 'back-to-filters':
                document.getElementById('reportResults').classList.add('hidden');
                break;
                
            case 'export-report':
                exportReport();
                break;
                
            case 'admin-mechanics':
                showMechanics();
                break;
                
            case 'admin-services':
                showServiceTypes();
                break;
                
            case 'admin-parts':
                showParts();
                break;
                
            case 'admin-reports':
                showReports();
                break;
                
            case 'new-repair':
                showNewRepair();
                break;
                
            case 'add-service':
                addService();
                break;
                
            case 'add-part':
                addPart();
                break;
                
            case 'cancel-repair':
                resetRepairForm();
                break;
                
            case 'back-to-mechanic':
                showMechanicDashboard();
                break;
            case 'add-new-vehicle':
                showNewVehicleModal();
                break;
            case 'save-new-vehicle':
                handleNewVehicleSubmit();
                break;
            case 'reset-vehicle-form':
                resetVehicleForm();
                break;
            case 'reset-customer-form':
                resetCustomerForm();
                break;
            case 'back-to-admin':
                showAdminDashboard();
                break;
                
            case 'edit-mechanic':
                if (mechanicId) {
                    loadMechanicForEdit(mechanicId);
                }
                break;
                
            case 'activate-mechanic':
                if (mechanicId) {
                    toggleMechanicStatus(mechanicId, true);
                }
                break;
                
            case 'deactivate-mechanic':
                if (mechanicId) {
                    toggleMechanicStatus(mechanicId, false);
                }
                break;
        }
    });
}

async function handleMechanicFormSubmit() {
    console.log('handleMechanicFormSubmit called');
    
    try {
        // Obtener valores de forma segura
        const nameValue = getElementValue('mechanicFormName');
        const usernameValue = getElementValue('mechanicUsername');
        const passwordValue = getElementValue('mechanicPassword');
        
        console.log('Debug individual values:');
        console.log('nameValue:', `"${nameValue}"`, 'length:', nameValue.length);
        console.log('usernameValue:', `"${usernameValue}"`, 'length:', usernameValue.length);
        console.log('passwordValue:', `"${passwordValue}"`, 'length:', passwordValue.length);
        
        const formData = {
            name: nameValue,
            username: usernameValue,
            password: passwordValue,
            email: getElementValue('mechanicEmail'),
            phone: getElementValue('mechanicPhone'),
            specialty: getElementValue('mechanicSpecialty')
        };
        
        console.log('Form data:', JSON.stringify(formData, null, 2));
        
        // Validate required fields
        if (!formData.name) {
            showMessage('El nombre es obligatorio', 'warning');
            focusElement('mechanicFormName');
            return;
        }
        
        if (!formData.username) {
            showMessage('El usuario es obligatorio', 'warning');
            focusElement('mechanicUsername');
            return;
        }
        
        if (!formData.password) {
            showMessage('La contraseña es obligatoria', 'warning');
            focusElement('mechanicPassword');
            return;
        }
        
        await saveMechanic(formData);
        
    } catch (error) {
        console.error('Error in handleMechanicFormSubmit:', error);
        showMessage('Error al procesar el formulario', 'danger');
    }
}

// Función auxiliar para obtener valor de elemento de forma segura
function getElementValue(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element ${elementId} not found`);
        return '';
    }
    
    const rawValue = element.value || '';
    const trimmedValue = rawValue.trim();
    
    console.log(`getElementValue(${elementId}):`, {
        elementExists: !!element,
        rawValue: `"${rawValue}"`,
        trimmedValue: `"${trimmedValue}"`,
        rawLength: rawValue.length,
        trimmedLength: trimmedValue.length
    });
    
    return trimmedValue;
}

// Función auxiliar para hacer foco en elemento de forma segura
function focusElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    }
}

// ================================
// NEW REPAIR MANAGEMENT
// ================================

let selectedServices = [];
let selectedParts = [];
let availableVehicles = [];
let availableServiceTypes = [];
let availableParts = [];

// Global function to check service types status
window.checkServiceTypesStatus = function() {
    console.log('Global check - availableServiceTypes:', availableServiceTypes);
    console.log('Global check - availableServiceTypes.length:', availableServiceTypes.length);
    return availableServiceTypes;
};

// Show new repair management
function showNewRepair() {
    hideAllViews();
    document.getElementById('newRepairManagement').classList.remove('hidden');
    
    // Set today's date as default
    document.getElementById('repairDate').value = new Date().toISOString().split('T')[0];
    
    // Load initial data
    console.log('showNewRepair called, loading data...');
    loadVehicles();
    loadServiceTypes().then(() => {
        console.log('Service types loaded, availableServiceTypes:', availableServiceTypes.length);
    });
    loadParts();
    
    // Reset form
    resetRepairForm();
    
    // Ensure form submit listener is working when form is shown
    setTimeout(() => {
        console.log('=== Verifying repair form submit listener ===');
        const newRepairForm = document.getElementById('newRepairForm');
        if (newRepairForm) {
            console.log('Repair form found in showNewRepair:', !!newRepairForm);
            
            // Test if submit listener is working
            const testEvent = new Event('submit', { bubbles: true, cancelable: true });
            console.log('Testing form submit event...');
            
            // Add a temporary listener to test
            const testListener = function(e) {
                console.log('=== TEST: Form submit event triggered ===');
                e.preventDefault();
            };
            newRepairForm.addEventListener('submit', testListener);
            
            // Trigger test event
            newRepairForm.dispatchEvent(testEvent);
            
            // Remove test listener
            newRepairForm.removeEventListener('submit', testListener);
        }
    }, 100);
}

// Reset repair form
function resetRepairForm() {
    selectedServices = [];
    selectedParts = [];
    
    document.getElementById('newRepairForm').reset();
    document.getElementById('repairDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('vehicleSelect').value = '';
    document.getElementById('servicesList').innerHTML = '';
    document.getElementById('repairPartsList').innerHTML = '';
    document.getElementById('repairMessage').classList.add('hidden');
    
    updateCostSummary();
}

// Load vehicles for selection
async function loadVehicles() {
    try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        
        if (data.success) {
            availableVehicles = data.vehicles;
            const select = document.getElementById('vehicleSelect');
            select.innerHTML = '<option value="">Seleccionar vehículo...</option>';
            
            data.vehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.license_plate || 'Sin placa'}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
        showRepairMessage('Error cargando vehículos', 'error');
    }
}

// Load service types
async function loadServiceTypes() {
    try {
        console.log('loadServiceTypes called, fetching from /api/service-types');
        const response = await fetch('/api/service-types');
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Service types API response:', data);
        
        if (data.success) {
            availableServiceTypes = data.serviceTypes;
            console.log('availableServiceTypes set to:', availableServiceTypes);
            console.log('availableServiceTypes length:', availableServiceTypes.length);
        } else {
            console.error('API returned success: false', data.message);
        }
    } catch (error) {
        console.error('Error loading service types:', error);
        console.error('Error details:', error.message);
    }
}

// Load parts
async function loadParts() {
    try {
        console.log('=== loadParts() called ===');
        console.log('Loading parts for new repair...');
        const response = await fetch('/api/parts');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            availableParts = data.parts;
            console.log('Parts loaded successfully, availableParts.length:', availableParts.length);
            console.log('First few parts:', availableParts.slice(0, 3));
        } else {
            console.error('Error loading parts:', data.message);
        }
    } catch (error) {
        console.error('Error loading parts:', error);
    }
}

// Add service to repair
function addService() {
    console.log('addService called, availableServiceTypes:', availableServiceTypes);
    console.log('addService called, availableServiceTypes.length:', availableServiceTypes.length);
    
    // Try to reload service types if empty
    if (availableServiceTypes.length === 0) {
        console.log('No service types available, trying to reload...');
        loadServiceTypes().then(() => {
            console.log('Reloaded service types, now available:', availableServiceTypes.length);
            if (availableServiceTypes.length > 0) {
                showServiceSelectionModal();
            } else {
                showRepairMessage('No hay tipos de servicios disponibles', 'warning');
            }
        }).catch(error => {
            console.error('Error reloading service types:', error);
            showRepairMessage('Error cargando tipos de servicios', 'error');
        });
        return;
    }
    
    // Show modal with service selection
    showServiceSelectionModal();
}

// Show service selection modal
function showServiceSelectionModal() {
    console.log('showServiceSelectionModal called');
    
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
        console.log('Bootstrap not available, showing services inline');
        showServicesInline();
        return;
    }
    
    const modalElement = document.getElementById('serviceSelectionModal');
    const container = document.getElementById('serviceSelectionList');
    
    console.log('Modal element:', modalElement);
    console.log('Container element:', container);
    
    if (!modalElement) {
        console.error('Modal element not found');
        showRepairMessage('Error: Modal no encontrado', 'error');
        return;
    }
    
    const modal = new bootstrap.Modal(modalElement);
    
    container.innerHTML = '';
    
    availableServiceTypes.forEach(serviceType => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'card mb-3 service-selection-card';
        serviceCard.style.cursor = 'pointer';
        serviceCard.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="card-title mb-1">${serviceType.name}</h6>
                        <p class="card-text text-muted mb-1">${serviceType.description}</p>
                        <small class="text-muted">Tiempo estimado: ${serviceType.estimated_time} minutos</small>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="price-display">
                            <span class="h5 text-primary">$${serviceType.labor_cost.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-primary btn-sm mt-2" onclick="selectServiceFromModal(${serviceType.id})">
                            <i class="bi bi-plus-circle"></i> Seleccionar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(serviceCard);
    });
    
    console.log('About to show modal, service types count:', availableServiceTypes.length);
    modal.show();
}

// Show services inline when Bootstrap is not available
function showServicesInline() {
    console.log('Showing services inline');
    
    // Create a container for services if it doesn't exist
    let servicesContainer = document.getElementById('inlineServicesContainer');
    if (!servicesContainer) {
        servicesContainer = document.createElement('div');
        servicesContainer.id = 'inlineServicesContainer';
        servicesContainer.className = 'inline-services-container';
        servicesContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 20px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 600px;
        `;
        
        document.body.appendChild(servicesContainer);
    }
    
    // Clear previous content
    servicesContainer.innerHTML = '';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
    `;
    closeButton.onclick = () => servicesContainer.remove();
    
    // Add title
    const title = document.createElement('h5');
    title.textContent = 'Seleccionar Servicio';
    title.style.marginBottom = '20px';
    
    servicesContainer.appendChild(closeButton);
    servicesContainer.appendChild(title);
    
    // Add services
    availableServiceTypes.forEach(serviceType => {
        const serviceCard = document.createElement('div');
        serviceCard.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
            cursor: pointer;
        `;
        
        serviceCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h6 style="margin: 0 0 5px 0; color: #333;">${serviceType.name}</h6>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${serviceType.description}</p>
                    <small style="color: #888;">Tiempo estimado: ${serviceType.estimated_time} minutos</small>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: bold; color: #007bff;">$${serviceType.labor_cost.toFixed(2)}</div>
                    <button onclick="selectServiceFromModal(${serviceType.id}); document.getElementById('inlineServicesContainer').remove();" 
                            style="background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">
                        Seleccionar
                    </button>
                </div>
            </div>
        `;
        
        servicesContainer.appendChild(serviceCard);
    });
}

// Select service from modal
function selectServiceFromModal(serviceTypeId) {
    const serviceType = availableServiceTypes.find(st => st.id === serviceTypeId);
    if (!serviceType) return;
    
    const quantity = prompt('Cantidad:', '1');
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        showRepairMessage('Cantidad inválida', 'error');
        return;
    }
    
    const service = {
        id: Date.now(),
        service_type_id: serviceType.id,
        name: serviceType.name,
        description: serviceType.description,
        labor_cost: serviceType.labor_cost,
        quantity: parseInt(quantity),
        total_cost: serviceType.labor_cost * parseInt(quantity)
    };
    
    selectedServices.push(service);
    renderServices();
    updateCostSummary();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('serviceSelectionModal'));
    
    // Remove focus from any focused element in the modal to prevent aria-hidden accessibility issue
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.closest('#serviceSelectionModal')) {
        focusedElement.blur();
    }
    
    modal.hide();
}

// Add part to repair
function addPart() {
    console.log('=== addPart() called ===');
    console.log('availableParts:', availableParts);
    console.log('availableParts.length:', availableParts.length);
    console.log('typeof bootstrap:', typeof bootstrap);
    
    if (availableParts.length === 0) {
        console.log('No parts available, trying to reload...');
        loadParts().then(() => {
            console.log('Reloaded parts, now available:', availableParts.length);
            if (availableParts.length === 0) {
                console.log('Still no parts available after reload');
                showRepairMessage('No hay repuestos disponibles', 'warning');
                return;
            }
            console.log('Parts loaded successfully, showing modal...');
            showPartSelectionModal();
        }).catch(error => {
            console.error('Error loading parts:', error);
            showRepairMessage('Error al cargar repuestos', 'error');
        });
        return;
    }
    
    // Show modal with part selection
    console.log('Parts available, showing modal...');
    showPartSelectionModal();
}

// Show part selection modal
function showPartSelectionModal() {
    console.log('=== showPartSelectionModal() called ===');
    console.log('availableParts.length:', availableParts.length);
    
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded');
        showRepairMessage('Error: Bootstrap no está cargado. Recarga la página.', 'error');
        return;
    }
    
    const modalElement = document.getElementById('partSelectionModal');
    const container = document.getElementById('partSelectionList');
    
    console.log('modalElement found:', !!modalElement);
    console.log('container found:', !!container);
    console.log('modalElement:', modalElement);
    console.log('container:', container);
    
    if (!modalElement) {
        console.error('Modal element not found');
        showRepairMessage('Error: Modal no encontrado', 'error');
        return;
    }
    
    if (!container) {
        console.error('Container element not found');
        showRepairMessage('Error: Contenedor no encontrado', 'error');
        return;
    }
    
    console.log('Creating Bootstrap modal instance...');
    const modal = new bootstrap.Modal(modalElement);
    
    console.log('Clearing container...');
    container.innerHTML = '';
    
    console.log('Adding parts to modal...');
    availableParts.forEach((part, index) => {
        console.log(`Adding part ${index + 1}:`, part.name);
        const partCard = document.createElement('div');
        partCard.className = 'card mb-3 part-selection-card';
        partCard.style.cursor = 'pointer';
        partCard.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="card-title mb-1">${part.name}</h6>
                        <p class="card-text text-muted mb-1">${part.description}</p>
                        <small class="text-muted">
                            Número: ${part.part_number} | 
                            Categoría: ${part.category} | 
                            Marca: ${part.brand}
                        </small>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="price-display">
                            <span class="h5 text-primary">$${part.final_price.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-primary btn-sm mt-2" onclick="selectPartFromModal(${part.id})">
                            <i class="bi bi-plus-circle"></i> Seleccionar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(partCard);
    });
    
    console.log('Showing modal...');
    modal.show();
    console.log('Modal should be visible now');
}

// Select part from modal
function selectPartFromModal(partId) {
    const part = availableParts.find(p => p.id === partId);
    if (!part) return;
    
    const quantity = prompt('Cantidad:', '1');
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        showRepairMessage('Cantidad inválida', 'error');
        return;
    }
    
    const partItem = {
        id: Date.now(),
        part_id: part.id,
        name: part.name,
        part_number: part.part_number,
        unit_cost: part.final_price,
        quantity: parseInt(quantity),
        total_cost: part.final_price * parseInt(quantity)
    };
    
    selectedParts.push(partItem);
    renderParts();
    updateCostSummary();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('partSelectionModal'));
    
    // Remove focus from any focused element in the modal to prevent aria-hidden accessibility issue
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.closest('#partSelectionModal')) {
        focusedElement.blur();
    }
    
    modal.hide();
}

// Make functions globally available for onclick handlers
window.selectServiceFromModal = selectServiceFromModal;
window.selectPartFromModal = selectPartFromModal;

// ================================
// GESTIÓN DE VEHÍCULOS
// ================================

// Variables globales para vehículos
let availableCustomers = [];
let availableVehiclesForManagement = [];
let editingVehicleId = null;

// Show vehicles management
function showVehiclesManagement() {
    hideAllViews();
    document.getElementById('vehiclesManagement').classList.remove('hidden');
    resetVehicleForm();
    loadCustomers();
    loadVehiclesForManagement();
}

// Reset vehicle form
function resetVehicleForm() {
    document.getElementById('vehicleForm').reset();
    editingVehicleId = null;
    document.querySelector('#vehicleForm button[type="submit"]').innerHTML = '<i class="bi bi-check-circle"></i> Guardar Vehículo';
}

// Load customers for dropdown
async function loadCustomers() {
    try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        
        if (data.success) {
            availableCustomers = data.customers;
            const select = document.getElementById('vehicleCustomer');
            select.innerHTML = '<option value="">Seleccionar cliente...</option>';
            
            data.customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.name} ${customer.last_name}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        showVehicleMessage('Error cargando clientes', 'error');
    }
}

// Load vehicles for management table
async function loadVehiclesForManagement() {
    try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        
        if (data.success) {
            availableVehiclesForManagement = data.vehicles;
            renderVehiclesTable();
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
        showVehicleMessage('Error cargando vehículos', 'error');
    }
}

// Render vehicles table
function renderVehiclesTable() {
    const tbody = document.getElementById('vehiclesList');
    tbody.innerHTML = '';
    
    availableVehiclesForManagement.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.customer_name} ${vehicle.customer_last_name}</td>
            <td>${vehicle.make}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.license_plate || '-'}</td>
            <td>${vehicle.color || '-'}</td>
            <td>${vehicle.engine_type || '-'}</td>
            <td>
                <span class="badge ${vehicle.is_active ? 'bg-success' : 'bg-secondary'}">
                    ${vehicle.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="editVehicle(${vehicle.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ${vehicle.is_active ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="deactivateVehicle(${vehicle.id})">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit vehicle
function editVehicle(vehicleId) {
    const vehicle = availableVehiclesForManagement.find(v => v.id === vehicleId);
    if (!vehicle) return;
    
    editingVehicleId = vehicleId;
    
    // Fill form with vehicle data
    document.getElementById('vehicleCustomer').value = vehicle.customer_id;
    document.getElementById('vehicleMake').value = vehicle.make;
    document.getElementById('vehicleModel').value = vehicle.model;
    document.getElementById('vehicleYear').value = vehicle.year;
    document.getElementById('vehicleLicensePlate').value = vehicle.license_plate || '';
    document.getElementById('vehicleVin').value = vehicle.vin || '';
    document.getElementById('vehicleColor').value = vehicle.color || '';
    document.getElementById('vehicleEngineType').value = vehicle.engine_type || '';
    document.getElementById('vehicleMileage').value = vehicle.mileage || '';
    
    // Change button text
    document.querySelector('#vehicleForm button[type="submit"]').innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Vehículo';
    
    // Scroll to form
    document.getElementById('vehicleForm').scrollIntoView({ behavior: 'smooth' });
}

// Deactivate vehicle
async function deactivateVehicle(vehicleId) {
    if (!confirm('¿Está seguro de que desea desactivar este vehículo?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showVehicleMessage(data.message, 'success');
            loadVehiclesForManagement();
        } else {
            showVehicleMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error deactivating vehicle:', error);
        showVehicleMessage('Error desactivando vehículo', 'error');
    }
}

// Handle vehicle form submission
async function handleVehicleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        customer_id: document.getElementById('vehicleCustomer').value,
        make: document.getElementById('vehicleMake').value,
        model: document.getElementById('vehicleModel').value,
        year: parseInt(document.getElementById('vehicleYear').value),
        license_plate: document.getElementById('vehicleLicensePlate').value,
        vin: document.getElementById('vehicleVin').value,
        color: document.getElementById('vehicleColor').value,
        engine_type: document.getElementById('vehicleEngineType').value,
        mileage: document.getElementById('vehicleMileage').value ? parseInt(document.getElementById('vehicleMileage').value) : null
    };
    
    // Validate required fields
    if (!formData.customer_id || !formData.make || !formData.model || !formData.year) {
        showVehicleMessage('Por favor complete todos los campos obligatorios', 'error');
        return;
    }
    
    try {
        const url = editingVehicleId ? `/api/vehicles/${editingVehicleId}` : '/api/vehicles';
        const method = editingVehicleId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showVehicleMessage(data.message, 'success');
            resetVehicleForm();
            loadVehiclesForManagement();
        } else {
            showVehicleMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error saving vehicle:', error);
        showVehicleMessage('Error guardando vehículo', 'error');
    }
}

// Show vehicle message
function showVehicleMessage(message, type) {
    const messageDiv = document.getElementById('vehicleMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Make functions globally available
window.editVehicle = editVehicle;
window.deactivateVehicle = deactivateVehicle;

// ================================
// GESTIÓN DE CLIENTES
// ================================

// Variables globales para clientes
let availableCustomersForManagement = [];
let editingCustomerId = null;

// Show customers management
function showCustomersManagement() {
    hideAllViews();
    document.getElementById('customersManagement').classList.remove('hidden');
    resetCustomerForm();
    loadCustomersForManagement();
}

// Reset customer form
function resetCustomerForm() {
    document.getElementById('customerForm').reset();
    editingCustomerId = null;
    document.querySelector('#customerForm button[type="submit"]').innerHTML = '<i class="bi bi-check-circle"></i> Guardar Cliente';
}

// Load customers for management table
async function loadCustomersForManagement() {
    try {
        const response = await fetch('/api/customers');
        const data = await response.json();
        
        if (data.success) {
            availableCustomersForManagement = data.customers;
            renderCustomersTable();
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        showCustomerMessage('Error cargando clientes', 'error');
    }
}

// Render customers table
function renderCustomersTable() {
    const tbody = document.getElementById('customersList');
    tbody.innerHTML = '';
    
    availableCustomersForManagement.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.last_name}</td>
            <td>${customer.phone || '-'}</td>
            <td>${customer.email || '-'}</td>
            <td>${customer.address || '-'}</td>
            <td>
                <span class="vehicle-count-badge">${customer.vehicle_count || 0} vehículos</span>
            </td>
            <td>
                <span class="badge ${customer.is_active ? 'bg-success' : 'bg-secondary'}">
                    ${customer.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="customer-action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="editCustomer(${customer.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewCustomerVehicles(${customer.id})">
                        <i class="bi bi-car-front"></i>
                    </button>
                    ${customer.is_active ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="deactivateCustomer(${customer.id})">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit customer
function editCustomer(customerId) {
    const customer = availableCustomersForManagement.find(c => c.id === customerId);
    if (!customer) return;
    
    editingCustomerId = customerId;
    
    // Fill form with customer data
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerLastName').value = customer.last_name;
    document.getElementById('customerPhone').value = customer.phone || '';
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerAddress').value = customer.address || '';
    
    // Change button text
    document.querySelector('#customerForm button[type="submit"]').innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Cliente';
    
    // Scroll to form
    document.getElementById('customerForm').scrollIntoView({ behavior: 'smooth' });
}

// View customer vehicles
function viewCustomerVehicles(customerId) {
    // Navigate to vehicles management and filter by customer
    showVehiclesManagement();
    // TODO: Implement filtering by customer
    showCustomerMessage('Funcionalidad de filtrado por cliente en desarrollo', 'info');
}

// Deactivate customer
async function deactivateCustomer(customerId) {
    if (!confirm('¿Está seguro de que desea desactivar este cliente? Esto también desactivará sus vehículos.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showCustomerMessage(data.message, 'success');
            loadCustomersForManagement();
        } else {
            showCustomerMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error deactivating customer:', error);
        showCustomerMessage('Error desactivando cliente', 'error');
    }
}

// Handle customer form submission
async function handleCustomerFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('customerName').value.trim(),
        last_name: document.getElementById('customerLastName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        address: document.getElementById('customerAddress').value.trim()
    };
    
    // Validate required fields
    if (!formData.name || !formData.last_name || !formData.phone) {
        showCustomerMessage('Por favor complete todos los campos obligatorios (Nombre, Apellido, Teléfono)', 'error');
        return;
    }
    
    try {
        const url = editingCustomerId ? `/api/customers/${editingCustomerId}` : '/api/customers';
        const method = editingCustomerId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showCustomerMessage(data.message, 'success');
            resetCustomerForm();
            loadCustomersForManagement();
        } else {
            showCustomerMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        showCustomerMessage('Error guardando cliente', 'error');
    }
}

// Show customer message
function showCustomerMessage(message, type) {
    const messageDiv = document.getElementById('customerMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'danger'} mt-3`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Make functions globally available
window.editCustomer = editCustomer;
window.viewCustomerVehicles = viewCustomerVehicles;
window.deactivateCustomer = deactivateCustomer;

// Render services list
function renderServices() {
    const container = document.getElementById('servicesList');
    container.innerHTML = '';
    
    selectedServices.forEach(service => {
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-item';
        serviceDiv.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="removeService(${service.id})">
                <i class="bi bi-x"></i>
            </button>
            <h6 class="service-item-title">${service.name}</h6>
            <p class="text-muted mb-1">${service.description}</p>
            <div class="row">
                <div class="col-md-6">
                    <small>Costo unitario: $${service.labor_cost.toFixed(2)}</small>
                </div>
                <div class="col-md-3">
                    <small>Cantidad: ${service.quantity}</small>
                </div>
                <div class="col-md-3">
                    <strong>Total: $${service.total_cost.toFixed(2)}</strong>
                </div>
            </div>
        `;
        container.appendChild(serviceDiv);
    });
}

// Render parts list
function renderParts() {
    const container = document.getElementById('repairPartsList');
    container.innerHTML = '';
    
    selectedParts.forEach(part => {
        const partDiv = document.createElement('div');
        partDiv.className = 'part-item';
        partDiv.innerHTML = `
            <button type="button" class="remove-item-btn" onclick="removePart(${part.id})">
                <i class="bi bi-x"></i>
            </button>
            <h6 class="part-item-title">${part.name}</h6>
            <p class="text-muted mb-1">Número: ${part.part_number || 'N/A'}</p>
            <div class="row">
                <div class="col-md-6">
                    <small>Costo unitario: $${part.unit_cost.toFixed(2)}</small>
                </div>
                <div class="col-md-3">
                    <small>Cantidad: ${part.quantity}</small>
                </div>
                <div class="col-md-3">
                    <strong>Total: $${part.total_cost.toFixed(2)}</strong>
                </div>
            </div>
        `;
        container.appendChild(partDiv);
    });
}

// Remove service
function removeService(serviceId) {
    selectedServices = selectedServices.filter(s => s.id !== serviceId);
    renderServices();
    updateCostSummary();
}

// Remove part
function removePart(partId) {
    selectedParts = selectedParts.filter(p => p.id !== partId);
    renderParts();
    updateCostSummary();
}

// Update cost summary
function updateCostSummary() {
    const totalLabor = selectedServices.reduce((sum, service) => sum + service.total_cost, 0);
    const totalParts = selectedParts.reduce((sum, part) => sum + part.total_cost, 0);
    const total = totalLabor + totalParts;
    
    document.getElementById('totalLaborCost').textContent = `$${totalLabor.toFixed(2)}`;
    document.getElementById('totalPartsCost').textContent = `$${totalParts.toFixed(2)}`;
    document.getElementById('totalCost').textContent = `$${total.toFixed(2)}`;
}

// Handle repair form submission
async function handleRepairFormSubmit(e) {
    e.preventDefault();
    console.log('=== handleRepairFormSubmit called ===');
    console.log('Event:', e);
    console.log('Target:', e.target);
    
    const vehicleSelect = document.getElementById('vehicleSelect');
    const vehicleId = vehicleSelect ? vehicleSelect.value : null;
    const repairDate = document.getElementById('repairDate').value;
    const description = document.getElementById('repairDescription').value;
    const notes = document.getElementById('repairNotes').value;
    
    console.log('=== Form validation debug ===');
    console.log('vehicleSelect element:', vehicleSelect);
    console.log('vehicleId value:', vehicleId);
    console.log('vehicleId type:', typeof vehicleId);
    console.log('vehicleId empty?', !vehicleId);
    
    console.log('Form data:', {
        vehicleId,
        repairDate,
        description,
        notes,
        selectedServices: selectedServices,
        selectedParts: selectedParts,
        currentUser: currentUser
    });
    
    if (!vehicleId || vehicleId === '') {
        console.log('Vehicle validation failed - no vehicle selected');
        showRepairMessage('Por favor seleccione un vehículo', 'error');
        return;
    }
    
    if (selectedServices.length === 0 && selectedParts.length === 0) {
        showRepairMessage('Debe agregar al menos un servicio o repuesto', 'error');
        return;
    }
    
    const totalLabor = selectedServices.reduce((sum, service) => sum + service.total_cost, 0);
    const totalParts = selectedParts.reduce((sum, part) => sum + part.total_cost, 0);
    
    const repairData = {
        vehicle_id: parseInt(vehicleId),
        mechanic_id: currentUser.id,
        repair_date: repairDate,
        description: description,
        notes: notes,
        services: selectedServices.map(s => ({
            service_type_id: s.service_type_id,
            quantity: s.quantity,
            labor_cost: s.labor_cost
        })),
        parts: selectedParts.map(p => ({
            part_id: p.part_id,
            quantity: p.quantity,
            unit_cost: p.unit_cost,
            total_cost: p.total_cost
        })),
        total_cost: totalLabor + totalParts
    };
    
    try {
        console.log('Sending repair data:', repairData);
        const response = await fetch('/api/repairs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(repairData)
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            showRepairMessage('Reparación guardada exitosamente', 'success');
            setTimeout(() => {
                resetRepairForm();
                showMechanicDashboard();
            }, 2000);
        } else {
            showRepairMessage(data.message || 'Error guardando la reparación', 'error');
        }
    } catch (error) {
        console.error('Error saving repair:', error);
        showRepairMessage('Error interno del servidor', 'error');
    }
}

// Show repair message
function showRepairMessage(message, type) {
    const messageDiv = document.getElementById('repairMessage');
    messageDiv.textContent = message;
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'warning'} mt-3`;
    messageDiv.classList.remove('hidden');
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
    }
}

// Show new vehicle modal
function showNewVehicleModal() {
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded');
        showRepairMessage('Error: Bootstrap no está cargado. Recarga la página.', 'error');
        return;
    }
    
    const modalElement = document.getElementById('newVehicleModal');
    if (!modalElement) {
        console.error('Modal element not found');
        showRepairMessage('Error: Modal no encontrado', 'error');
        return;
    }
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Handle new vehicle form submission
async function handleNewVehicleSubmit() {
    try {
        // Get form data
        const customerName = document.getElementById('newCustomerName').value.trim();
        const customerLastName = document.getElementById('newCustomerLastName').value.trim();
        const customerPhone = document.getElementById('newCustomerPhone').value.trim();
        const customerEmail = document.getElementById('newCustomerEmail').value.trim();
        const customerAddress = document.getElementById('newCustomerAddress').value.trim();
        
        const vehicleMake = document.getElementById('newVehicleMake').value.trim();
        const vehicleModel = document.getElementById('newVehicleModel').value.trim();
        const vehicleYear = document.getElementById('newVehicleYear').value.trim();
        const vehicleLicense = document.getElementById('newVehicleLicensePlate').value.trim();
        const vehicleVin = document.getElementById('vehicleVin').value.trim();
        const vehicleColor = document.getElementById('newVehicleColor').value.trim();
        const vehicleEngine = document.getElementById('newVehicleEngineType').value.trim();
        const vehicleMileage = document.getElementById('newVehicleMileage').value.trim();
        
        // Validate required fields
        if (!customerName || !customerLastName || !customerPhone || 
            !vehicleMake || !vehicleModel || !vehicleYear || !vehicleLicense) {
            showRepairMessage('Por favor complete todos los campos obligatorios', 'error');
            return;
        }
        
        // Create customer
        const customerData = {
            name: customerName,
            last_name: customerLastName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress
        };
        
        const customerResponse = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(customerData)
        });
        
        if (!customerResponse.ok) {
            throw new Error('Error al crear cliente');
        }
        
        const customer = await customerResponse.json();
        
        // Create vehicle
        const vehicleData = {
            customer_id: customer.id,
            make: vehicleMake,
            model: vehicleModel,
            year: parseInt(vehicleYear),
            license_plate: vehicleLicense,
            vin: vehicleVin,
            color: vehicleColor,
            engine_type: vehicleEngine,
            mileage: vehicleMileage ? parseInt(vehicleMileage) : 0
        };
        
        const vehicleResponse = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(vehicleData)
        });
        
        if (!vehicleResponse.ok) {
            throw new Error('Error al crear vehículo');
        }
        
        const vehicle = await vehicleResponse.json();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newVehicleModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('newVehicleForm').reset();
        
        // Reload vehicles list
        await loadVehicles();
        
        // Select the new vehicle
        document.getElementById('vehicleSelect').value = vehicle.id;
        
        showRepairMessage('Cliente y vehículo creados exitosamente', 'success');
        
    } catch (error) {
        console.error('Error creating customer and vehicle:', error);
        showRepairMessage('Error al crear cliente y vehículo: ' + error.message, 'error');
    }
}

// ================================
// GESTIÓN DE TIPOS DE SERVICIOS
// ================================

// Mostrar gestión de tipos de servicios
function showServiceTypes() {
    console.log('showServiceTypes called');
    hideAllViews();
    document.getElementById('serviceTypesManagement').classList.remove('hidden');
    loadServiceTypesForAdmin();
}

// Cargar tipos de servicios desde la API (para administración)
async function loadServiceTypesForAdmin() {
    try {
        console.log('Loading service types for admin...');
        const response = await fetch('/api/service-types');
        const data = await response.json();
        
        if (data.success) {
            displayServiceTypes(data.serviceTypes);
        } else {
            showServiceTypeMessage('Error al cargar tipos de servicios: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading service types:', error);
        showServiceTypeMessage('Error de conexión al cargar tipos de servicios', 'danger');
    }
}

// Mostrar tipos de servicios en la lista
function displayServiceTypes(serviceTypes) {
    const listContainer = document.getElementById('serviceTypesList');
    
    if (!serviceTypes || serviceTypes.length === 0) {
        listContainer.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="bi bi-info-circle"></i>
                No hay tipos de servicios registrados
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = serviceTypes.map(serviceType => `
        <div class="service-type-card ${!serviceType.is_active ? 'inactive' : ''}">
            <div class="service-type-header">
                <div class="service-type-info flex-grow-1">
                    <h6>${serviceType.name}</h6>
                    ${serviceType.description ? `<p><i class="bi bi-card-text"></i> ${serviceType.description}</p>` : ''}
                    <div class="d-flex gap-3">
                        <span class="service-type-price">
                            <i class="bi bi-currency-dollar"></i> ${serviceType.labor_cost}
                        </span>
                        ${serviceType.estimated_time ? `
                            <span class="service-type-time">
                                <i class="bi bi-clock"></i> ${serviceType.estimated_time} min
                            </span>
                        ` : ''}
                        <span class="status-badge ${serviceType.is_active ? 'active' : 'inactive'}">
                            ${serviceType.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
            </div>
            <div class="service-type-actions">
                <button class="btn btn-outline-primary btn-sm" data-action="edit-service-type" data-id="${serviceType.id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-${serviceType.is_active ? 'outline-warning' : 'outline-success'} btn-sm" 
                        data-action="toggle-service-type-status" data-id="${serviceType.id}" data-status="${serviceType.is_active}">
                    <i class="bi bi-${serviceType.is_active ? 'pause' : 'play'}"></i> 
                    ${serviceType.is_active ? 'Desactivar' : 'Activar'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Configurar event listeners para los botones
    setupServiceTypesEventListeners();
}

// Configurar event listeners para tipos de servicios
function setupServiceTypesEventListeners() {
    const listContainer = document.getElementById('serviceTypesList');
    
    listContainer.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.getAttribute('data-action');
        const id = e.target.closest('[data-action]')?.getAttribute('data-id');
        const status = e.target.closest('[data-action]')?.getAttribute('data-status');
        
        switch (action) {
            case 'edit-service-type':
                loadServiceTypeForEdit(id);
                break;
            case 'toggle-service-type-status':
                toggleServiceTypeStatus(id, status === 'true');
                break;
        }
    });
}

// Mostrar mensaje en gestión de tipos de servicios
function showServiceTypeMessage(message, type = 'info') {
    const messageElement = document.getElementById('serviceTypeMessage');
    messageElement.textContent = message;
    messageElement.className = `alert alert-${type} mt-3`;
    messageElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// Resetear formulario de tipo de servicio
function resetServiceTypeForm() {
    document.getElementById('serviceTypeForm').reset();
    document.getElementById('serviceTypeFormTitle').textContent = 'Agregar Nuevo Tipo de Servicio';
    
    // Remove any stored edit ID
    document.getElementById('serviceTypeForm').removeAttribute('data-edit-id');
}

// Guardar tipo de servicio (crear o actualizar)
async function saveServiceType() {
    const form = document.getElementById('serviceTypeForm');
    const editId = form.getAttribute('data-edit-id');
    
    try {
        const formData = {
            name: getElementValue('serviceTypeName'),
            description: getElementValue('serviceTypeDescription'),
            labor_cost: getElementValue('serviceTypeLaborCost'),
            estimated_time: getElementValue('serviceTypeEstimatedTime')
        };
        
        console.log('Service type form data:', formData);
        
        // Validación básica
        if (!formData.name || !formData.labor_cost) {
            showServiceTypeMessage('Por favor complete todos los campos obligatorios', 'warning');
            return;
        }
        
        // Validar costo
        if (isNaN(formData.labor_cost) || formData.labor_cost <= 0) {
            showServiceTypeMessage('El costo de mano de obra debe ser un número positivo', 'warning');
            focusElement('serviceTypeLaborCost');
            return;
        }
        
        // Validar tiempo estimado si se proporciona
        if (formData.estimated_time && (isNaN(formData.estimated_time) || formData.estimated_time <= 0)) {
            showServiceTypeMessage('El tiempo estimado debe ser un número positivo', 'warning');
            focusElement('serviceTypeEstimatedTime');
            return;
        }
        
        const url = editId ? `/api/service-types/${editId}` : '/api/service-types';
        const method = editId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showServiceTypeMessage(
                editId ? 'Tipo de servicio actualizado exitosamente' : 'Tipo de servicio creado exitosamente', 
                'success'
            );
            resetServiceTypeForm();
            loadServiceTypes();
        } else {
            showServiceTypeMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error saving service type:', error);
        showServiceTypeMessage('Error de conexión al guardar tipo de servicio', 'danger');
    }
}

// Cambiar estado activo/inactivo de tipo de servicio
async function toggleServiceTypeStatus(id, currentStatus) {
    try {
        const newStatus = !currentStatus;
        const response = await fetch(`/api/service-types/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showServiceTypeMessage(data.message, 'success');
            loadServiceTypes();
        } else {
            showServiceTypeMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error toggling service type status:', error);
        showServiceTypeMessage('Error de conexión al cambiar estado', 'danger');
    }
}

// Cargar tipo de servicio para edición
async function loadServiceTypeForEdit(id) {
    try {
        const response = await fetch(`/api/service-types/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const serviceType = data.serviceType;
            
            // Llenar formulario
            document.getElementById('serviceTypeName').value = serviceType.name || '';
            document.getElementById('serviceTypeDescription').value = serviceType.description || '';
            document.getElementById('serviceTypeLaborCost').value = serviceType.labor_cost || '';
            document.getElementById('serviceTypeEstimatedTime').value = serviceType.estimated_time || '';
            
            // Actualizar título y marcar como edición
            document.getElementById('serviceTypeFormTitle').textContent = 'Editar Tipo de Servicio';
            document.getElementById('serviceTypeForm').setAttribute('data-edit-id', id);
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            showServiceTypeMessage('Error al cargar tipo de servicio: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading service type for edit:', error);
        showServiceTypeMessage('Error de conexión al cargar tipo de servicio', 'danger');
    }
}

// Manejar envío del formulario de tipo de servicio
function handleServiceTypeFormSubmit(e) {
    e.preventDefault();
    saveServiceType();
}

// ================================
// GESTIÓN DE REPUESTOS
// ================================

// Mostrar gestión de repuestos
function showParts() {
    console.log('showParts called');
    hideAllViews();
    document.getElementById('partsManagement').classList.remove('hidden');
    loadPartsForManagement();
}

// Cargar repuestos desde la API para gestión
async function loadPartsForManagement() {
    try {
        console.log('Loading parts for management...');
        const response = await fetch('/api/parts');
        const data = await response.json();
        
        if (data.success) {
            displayParts(data.parts);
        } else {
            showPartMessage('Error al cargar repuestos: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading parts:', error);
        showPartMessage('Error de conexión al cargar repuestos', 'danger');
    }
}

// Mostrar repuestos en la lista
function displayParts(parts) {
    const listContainer = document.getElementById('partsList');
    
    if (!parts || parts.length === 0) {
        listContainer.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="bi bi-info-circle"></i>
                No hay repuestos registrados
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = parts.map(part => `
        <div class="part-card ${!part.is_active ? 'inactive' : ''}">
            <div class="part-header">
                <div class="part-info flex-grow-1">
                    <h6>${part.name}</h6>
                    ${part.part_number ? `<p><i class="bi bi-hash"></i> ${part.part_number}</p>` : ''}
                    ${part.description ? `<p><i class="bi bi-card-text"></i> ${part.description}</p>` : ''}
                    <div class="part-details">
                        <span class="part-detail-item">
                            <i class="bi bi-currency-dollar text-danger"></i>
                            <span class="part-cost">$${part.cost}</span>
                        </span>
                        <span class="part-detail-item">
                            <i class="bi bi-currency-dollar text-success"></i>
                            <span class="part-final-price">$${part.final_price}</span>
                        </span>
                        ${part.markup_percentage > 0 ? `
                            <span class="part-detail-item">
                                <i class="bi bi-percent text-warning"></i>
                                <span class="part-markup">${part.markup_percentage}%</span>
                            </span>
                        ` : ''}
                        ${part.category ? `<span class="part-category">${part.category}</span>` : ''}
                        ${part.brand ? `<span class="part-brand">${part.brand}</span>` : ''}
                        <span class="status-badge ${part.is_active ? 'active' : 'inactive'}">
                            ${part.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
            </div>
            <div class="part-actions">
                <button class="btn btn-outline-primary btn-sm" data-action="edit-part" data-id="${part.id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-${part.is_active ? 'outline-warning' : 'outline-success'} btn-sm" 
                        data-action="toggle-part-status" data-id="${part.id}" data-status="${part.is_active}">
                    <i class="bi bi-${part.is_active ? 'pause' : 'play'}"></i> 
                    ${part.is_active ? 'Desactivar' : 'Activar'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Configurar event listeners para los botones
    setupPartsEventListeners();
}

// Configurar event listeners para repuestos
function setupPartsEventListeners() {
    const listContainer = document.getElementById('partsList');
    
    listContainer.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.getAttribute('data-action');
        const id = e.target.closest('[data-action]')?.getAttribute('data-id');
        const status = e.target.closest('[data-action]')?.getAttribute('data-status');
        
        switch (action) {
            case 'edit-part':
                loadPartForEdit(id);
                break;
            case 'toggle-part-status':
                togglePartStatus(id, status === 'true');
                break;
        }
    });
}

// Mostrar mensaje en gestión de repuestos
function showPartMessage(message, type = 'info') {
    const messageElement = document.getElementById('partMessage');
    messageElement.textContent = message;
    messageElement.className = `alert alert-${type} mt-3`;
    messageElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// Resetear formulario de repuesto
function resetPartForm() {
    document.getElementById('partForm').reset();
    document.getElementById('partFormTitle').textContent = 'Agregar Nuevo Repuesto';
    
    // Remove any stored edit ID
    document.getElementById('partForm').removeAttribute('data-edit-id');
}

// Guardar repuesto (crear o actualizar)
async function savePart() {
    const form = document.getElementById('partForm');
    const editId = form.getAttribute('data-edit-id');
    
    try {
        const formData = {
            name: getElementValue('partName'),
            part_number: getElementValue('partNumber'),
            description: getElementValue('partDescription'),
            cost: getElementValue('partCost'),
            markup_percentage: getElementValue('partMarkup'),
            final_price: getElementValue('partFinalPrice'),
            category: getElementValue('partCategory'),
            brand: getElementValue('partBrand')
        };
        
        console.log('Part form data:', formData);
        
        // Validación básica
        if (!formData.name || !formData.cost || !formData.final_price) {
            showPartMessage('Por favor complete todos los campos obligatorios', 'warning');
            return;
        }
        
        // Validar costo
        if (isNaN(formData.cost) || formData.cost <= 0) {
            showPartMessage('El costo de compra debe ser un número positivo', 'warning');
            focusElement('partCost');
            return;
        }
        
        // Validar precio final
        if (isNaN(formData.final_price) || formData.final_price <= 0) {
            showPartMessage('El precio final debe ser un número positivo', 'warning');
            focusElement('partFinalPrice');
            return;
        }
        
        // Validar markup si se proporciona
        if (formData.markup_percentage && (isNaN(formData.markup_percentage) || formData.markup_percentage < 0)) {
            showPartMessage('El porcentaje de ganancia debe ser un número no negativo', 'warning');
            focusElement('partMarkup');
            return;
        }
        
        const url = editId ? `/api/parts/${editId}` : '/api/parts';
        const method = editId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showPartMessage(
                editId ? 'Repuesto actualizado exitosamente' : 'Repuesto creado exitosamente', 
                'success'
            );
            resetPartForm();
            loadPartsForManagement();
        } else {
            showPartMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error saving part:', error);
        showPartMessage('Error de conexión al guardar repuesto', 'danger');
    }
}

// Cambiar estado activo/inactivo de repuesto
async function togglePartStatus(id, currentStatus) {
    try {
        const newStatus = !currentStatus;
        const response = await fetch(`/api/parts/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showPartMessage(data.message, 'success');
            loadPartsForManagement();
        } else {
            showPartMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error toggling part status:', error);
        showPartMessage('Error de conexión al cambiar estado', 'danger');
    }
}

// Cargar repuesto para edición
async function loadPartForEdit(id) {
    try {
        const response = await fetch(`/api/parts/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const part = data.part;
            
            // Llenar formulario
            document.getElementById('partName').value = part.name || '';
            document.getElementById('partNumber').value = part.part_number || '';
            document.getElementById('partDescription').value = part.description || '';
            document.getElementById('partCost').value = part.cost || '';
            document.getElementById('partMarkup').value = part.markup_percentage || '';
            document.getElementById('partFinalPrice').value = part.final_price || '';
            document.getElementById('partCategory').value = part.category || '';
            document.getElementById('partBrand').value = part.brand || '';
            
            // Actualizar título y marcar como edición
            document.getElementById('partFormTitle').textContent = 'Editar Repuesto';
            document.getElementById('partForm').setAttribute('data-edit-id', id);
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            showPartMessage('Error al cargar repuesto: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error loading part for edit:', error);
        showPartMessage('Error de conexión al cargar repuesto', 'danger');
    }
}

// Manejar envío del formulario de repuesto
function handlePartFormSubmit(e) {
    e.preventDefault();
    savePart();
}

// ================================
// GESTIÓN DE REPORTES
// ================================

let currentReportType = null;
let currentReportData = null;

// Mostrar gestión de reportes
function showReports() {
    console.log('showReports called');
    hideAllViews();
    document.getElementById('reportsManagement').classList.remove('hidden');
    resetReportsView();
}

// Resetear vista de reportes
function resetReportsView() {
    document.getElementById('filtersSection').classList.add('hidden');
    document.getElementById('reportResults').classList.add('hidden');
    currentReportType = null;
    currentReportData = null;
}

// Seleccionar tipo de reporte
function selectReportType(reportType) {
    currentReportType = reportType;
    showFiltersForReport(reportType);
}

// Mostrar filtros para el tipo de reporte seleccionado
function showFiltersForReport(reportType) {
    const filtersSection = document.getElementById('filtersSection');
    const filtersContent = document.getElementById('filtersContent');
    
    // Mostrar sección de filtros
    filtersSection.classList.remove('hidden');
    
    // Generar filtros según el tipo de reporte
    let filtersHTML = '';
    
    switch (reportType) {
        case 'summary':
            filtersHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    Este reporte no requiere filtros. Muestra un resumen general del sistema.
                </div>
            `;
            break;
            
        case 'mechanics':
            filtersHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="filter-group">
                            <h6>Estado</h6>
                            <select class="form-select" name="status">
                                <option value="">Todos</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="filter-group">
                            <h6>Especialidad</h6>
                            <select class="form-select" name="specialty">
                                <option value="">Todas</option>
                                <option value="Motor">Motor</option>
                                <option value="Frenos">Frenos</option>
                                <option value="Suspensión">Suspensión</option>
                                <option value="Eléctrico">Eléctrico</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'service-types':
            filtersHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <div class="filter-group">
                            <h6>Estado</h6>
                            <select class="form-select" name="status">
                                <option value="">Todos</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="filter-group">
                            <h6>Costo Mínimo</h6>
                            <input type="number" class="form-control" name="min_cost" step="0.01" min="0" placeholder="0.00">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="filter-group">
                            <h6>Costo Máximo</h6>
                            <input type="number" class="form-control" name="max_cost" step="0.01" min="0" placeholder="999.99">
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'parts':
            filtersHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Estado</h6>
                            <select class="form-select" name="status">
                                <option value="">Todos</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Categoría</h6>
                            <select class="form-select" name="category">
                                <option value="">Todas</option>
                                <option value="Filtros">Filtros</option>
                                <option value="Lubricantes">Lubricantes</option>
                                <option value="Frenos">Frenos</option>
                                <option value="Encendido">Encendido</option>
                                <option value="Motor">Motor</option>
                                <option value="Suspensión">Suspensión</option>
                                <option value="Eléctrico">Eléctrico</option>
                                <option value="Carrocería">Carrocería</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Marca</h6>
                            <input type="text" class="form-control" name="brand" placeholder="Ej: Bosch">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Precio Máximo</h6>
                            <input type="number" class="form-control" name="max_cost" step="0.01" min="0" placeholder="999.99">
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'customers':
            filtersHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    Este reporte muestra todos los clientes registrados y sus vehículos.
                </div>
            `;
            break;
            
        case 'vehicles':
            filtersHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <div class="filter-group">
                            <h6>Marca</h6>
                            <input type="text" class="form-control" name="make" placeholder="Ej: Toyota">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="filter-group">
                            <h6>Año Mínimo</h6>
                            <input type="number" class="form-control" name="year_min" min="1900" max="2030" placeholder="2000">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="filter-group">
                            <h6>Año Máximo</h6>
                            <input type="number" class="form-control" name="year_max" min="1900" max="2030" placeholder="2024">
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'repairs':
            filtersHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Fecha Desde</h6>
                            <input type="date" class="form-control" name="date_from">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Fecha Hasta</h6>
                            <input type="date" class="form-control" name="date_to">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Mecánico</h6>
                            <select class="form-select" name="mechanic_id">
                                <option value="">Todos</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="filter-group">
                            <h6>Estado</h6>
                            <select class="form-select" name="status">
                                <option value="">Todos</option>
                                <option value="completed">Completadas</option>
                                <option value="in_progress">En Progreso</option>
                                <option value="pending">Pendientes</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
            
            // Cargar mecánicos para el filtro
            loadMechanicsForReport();
            break;
    }
    
    filtersContent.innerHTML = filtersHTML;
    
    // Scroll to filters
    filtersSection.scrollIntoView({ behavior: 'smooth' });
}

// Cargar mecánicos para el filtro de reportes
async function loadMechanicsForReport() {
    try {
        const response = await fetch('/api/mechanics');
        const data = await response.json();
        
        if (data.success) {
            const mechanicSelect = document.querySelector('select[name="mechanic_id"]');
            if (mechanicSelect) {
                mechanicSelect.innerHTML = '<option value="">Todos</option>' +
                    data.mechanics.map(mechanic => 
                        `<option value="${mechanic.id}">${mechanic.name}</option>`
                    ).join('');
            }
        }
    } catch (error) {
        console.error('Error loading mechanics for report:', error);
    }
}

// Generar reporte
async function generateReport() {
    if (!currentReportType) return;
    
    try {
        showReportMessage('Generando reporte...', 'info');
        
        // Recopilar filtros
        const formData = new FormData(document.getElementById('reportFilters'));
        const filters = Object.fromEntries(formData.entries());
        
        // Construir URL con parámetros
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        
        const url = `/api/reports/${currentReportType}${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            currentReportData = data.report;
            displayReport(currentReportData);
            showReportMessage('Reporte generado exitosamente', 'success');
        } else {
            showReportMessage('Error: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error('Error generating report:', error);
        showReportMessage('Error de conexión al generar reporte', 'danger');
    }
}

// Mostrar reporte
function displayReport(report) {
    const reportResults = document.getElementById('reportResults');
    const reportTitle = document.getElementById('reportTitle');
    const reportContent = document.getElementById('reportContent');
    
    // Mostrar sección de resultados
    reportResults.classList.remove('hidden');
    reportTitle.textContent = report.title;
    
    // Generar contenido del reporte
    let contentHTML = '';
    
    switch (currentReportType) {
        case 'summary':
            contentHTML = generateSummaryReport(report);
            break;
        case 'mechanics':
            contentHTML = generateMechanicsReport(report);
            break;
        case 'service-types':
            contentHTML = generateServiceTypesReport(report);
            break;
        case 'parts':
            contentHTML = generatePartsReport(report);
            break;
        case 'customers':
            contentHTML = generateCustomersReport(report);
            break;
        case 'vehicles':
            contentHTML = generateVehiclesReport(report);
            break;
        case 'repairs':
            contentHTML = generateRepairsReport(report);
            break;
    }
    
    reportContent.innerHTML = contentHTML;
    
    // Scroll to results
    reportResults.scrollIntoView({ behavior: 'smooth' });
}

// Generar reporte de resumen
function generateSummaryReport(report) {
    const { summary } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-speedometer2"></i> Resumen General del Sistema</h6>
            <p class="text-muted">Generado el ${new Date(report.generatedAt).toLocaleString()}</p>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${summary.mechanics.total}</div>
                <div class="stat-label">Mecánicos</div>
                <div class="stat-change positive">${summary.mechanics.active} activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.serviceTypes.total}</div>
                <div class="stat-label">Tipos de Servicios</div>
                <div class="stat-change positive">${summary.serviceTypes.active} activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.parts.total}</div>
                <div class="stat-label">Repuestos</div>
                <div class="stat-change positive">${summary.parts.active} activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.customers.total}</div>
                <div class="stat-label">Clientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.vehicles.total}</div>
                <div class="stat-label">Vehículos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.repairs.total}</div>
                <div class="stat-label">Reparaciones</div>
                <div class="stat-change positive">$${summary.repairs.totalCost.toFixed(2)} total</div>
            </div>
        </div>
        
        ${summary.repairs.total > 0 ? `
            <div class="report-chart">
                <h6>Reparaciones por Mes (Últimos 6 meses)</h6>
                <div class="chart-placeholder">
                    Gráfico de reparaciones por mes - ${Object.keys(report.repairsByMonth).length} meses con datos
                </div>
            </div>
        ` : ''}
    `;
}

// Generar reporte de mecánicos
function generateMechanicsReport(report) {
    const { data, total, active, inactive } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-people"></i> Estadísticas de Mecánicos</h6>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total Mecánicos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${active}</div>
                <div class="stat-label">Activos</div>
                <div class="stat-change positive">${((active/total)*100).toFixed(1)}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${inactive}</div>
                <div class="stat-label">Inactivos</div>
                <div class="stat-change negative">${((inactive/total)*100).toFixed(1)}%</div>
            </div>
        </div>
        
        <div class="report-table-container">
            <h6>Lista de Mecánicos</h6>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                        <th>Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(mechanic => `
                        <tr>
                            <td>${mechanic.name}</td>
                            <td>${mechanic.username}</td>
                            <td>${mechanic.email || 'N/A'}</td>
                            <td>${mechanic.phone || 'N/A'}</td>
                            <td>${mechanic.specialty || 'N/A'}</td>
                            <td><span class="status-badge ${mechanic.is_active ? 'active' : 'inactive'}">${mechanic.is_active ? 'Activo' : 'Inactivo'}</span></td>
                            <td>${new Date(mechanic.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generar reporte de tipos de servicios
function generateServiceTypesReport(report) {
    const { data, total, active, inactive, totalLaborCost, averageLaborCost } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-tools"></i> Estadísticas de Tipos de Servicios</h6>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total Servicios</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalLaborCost.toFixed(2)}</div>
                <div class="stat-label">Costo Total MO</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${averageLaborCost.toFixed(2)}</div>
                <div class="stat-label">Promedio MO</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${active}</div>
                <div class="stat-label">Activos</div>
            </div>
        </div>
        
        <div class="report-table-container">
            <h6>Lista de Tipos de Servicios</h6>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Costo MO</th>
                        <th>Tiempo Est.</th>
                        <th>Estado</th>
                        <th>Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(service => `
                        <tr>
                            <td>${service.name}</td>
                            <td>${service.description || 'N/A'}</td>
                            <td>$${service.labor_cost}</td>
                            <td>${service.estimated_time ? service.estimated_time + ' min' : 'N/A'}</td>
                            <td><span class="status-badge ${service.is_active ? 'active' : 'inactive'}">${service.is_active ? 'Activo' : 'Inactivo'}</span></td>
                            <td>${new Date(service.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generar reporte de repuestos
function generatePartsReport(report) {
    const { data, total, active, inactive, totalCost, totalFinalPrice, totalProfit, profitMargin, categoryStats } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-gear"></i> Estadísticas de Repuestos</h6>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total Repuestos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalCost.toFixed(2)}</div>
                <div class="stat-label">Costo Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalFinalPrice.toFixed(2)}</div>
                <div class="stat-label">Precio Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalProfit.toFixed(2)}</div>
                <div class="stat-label">Ganancia Total</div>
                <div class="stat-change positive">${profitMargin.toFixed(1)}%</div>
            </div>
        </div>
        
        ${Object.keys(categoryStats).length > 0 ? `
            <div class="report-chart">
                <h6>Estadísticas por Categoría</h6>
                <div class="category-stats">
                    ${Object.entries(categoryStats).map(([category, stats]) => `
                        <div class="category-card">
                            <div class="category-name">${category}</div>
                            <div class="category-count">${stats.count}</div>
                            <div class="category-value">Costo: $${stats.totalCost.toFixed(2)}<br>Precio: $${stats.totalPrice.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="report-table-container">
            <h6>Lista de Repuestos</h6>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Número</th>
                        <th>Categoría</th>
                        <th>Marca</th>
                        <th>Costo</th>
                        <th>Precio Final</th>
                        <th>Ganancia</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(part => `
                        <tr>
                            <td>${part.name}</td>
                            <td>${part.part_number || 'N/A'}</td>
                            <td>${part.category || 'N/A'}</td>
                            <td>${part.brand || 'N/A'}</td>
                            <td>$${part.cost}</td>
                            <td>$${part.final_price}</td>
                            <td>$${(part.final_price - part.cost).toFixed(2)}</td>
                            <td><span class="status-badge ${part.is_active ? 'active' : 'inactive'}">${part.is_active ? 'Activo' : 'Inactivo'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generar reporte de clientes
function generateCustomersReport(report) {
    const { data, total, totalVehicles, customersWithVehicles, averageVehiclesPerCustomer } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-person-lines-fill"></i> Estadísticas de Clientes</h6>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total Clientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalVehicles}</div>
                <div class="stat-label">Total Vehículos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${customersWithVehicles}</div>
                <div class="stat-label">Con Vehículos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${averageVehiclesPerCustomer.toFixed(1)}</div>
                <div class="stat-label">Promedio por Cliente</div>
            </div>
        </div>
        
        <div class="report-table-container">
            <h6>Lista de Clientes</h6>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Vehículos</th>
                        <th>Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(customer => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.last_name}</td>
                            <td>${customer.phone || 'N/A'}</td>
                            <td>${customer.email || 'N/A'}</td>
                            <td><span class="badge bg-primary">${customer.vehiclesCount}</span></td>
                            <td>${new Date(customer.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generar reporte de vehículos
function generateVehiclesReport(report) {
    const { data, total, makeStats, averageYear } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-car-front"></i> Estadísticas de Vehículos</h6>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total Vehículos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${averageYear.toFixed(0)}</div>
                <div class="stat-label">Año Promedio</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${Object.keys(makeStats).length}</div>
                <div class="stat-label">Marcas Diferentes</div>
            </div>
        </div>
        
        ${Object.keys(makeStats).length > 0 ? `
            <div class="report-chart">
                <h6>Estadísticas por Marca</h6>
                <div class="category-stats">
                    ${Object.entries(makeStats).map(([make, stats]) => `
                        <div class="category-card">
                            <div class="category-name">${make}</div>
                            <div class="category-count">${stats.count}</div>
                            <div class="category-value">Año promedio: ${stats.averageYear.toFixed(0)}<br>Rango: ${stats.oldestYear} - ${stats.newestYear}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="report-table-container">
            <h6>Lista de Vehículos</h6>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Año</th>
                        <th>Placa</th>
                        <th>Color</th>
                        <th>Motor</th>
                        <th>Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(vehicle => `
                        <tr>
                            <td>${vehicle.customer_name} ${vehicle.customer_last_name}</td>
                            <td>${vehicle.make}</td>
                            <td>${vehicle.model}</td>
                            <td>${vehicle.year}</td>
                            <td>${vehicle.license_plate || 'N/A'}</td>
                            <td>${vehicle.color || 'N/A'}</td>
                            <td>${vehicle.engine_type || 'N/A'}</td>
                            <td>${new Date(vehicle.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generar reporte de reparaciones
function generateRepairsReport(report) {
    const { data, total, totalLaborCost, totalPartsCost, totalCost, averageCost, mechanicStats } = report;
    
    return `
        <div class="report-summary">
            <h6><i class="bi bi-wrench"></i> Estadísticas de Reparaciones</h6>
        </div>
        
        <div class="report-stats">
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total Reparaciones</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalCost.toFixed(2)}</div>
                <div class="stat-label">Costo Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalLaborCost.toFixed(2)}</div>
                <div class="stat-label">Mano de Obra</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalPartsCost.toFixed(2)}</div>
                <div class="stat-label">Repuestos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${averageCost.toFixed(2)}</div>
                <div class="stat-label">Promedio por Reparación</div>
            </div>
        </div>
        
        ${Object.keys(mechanicStats).length > 0 ? `
            <div class="report-chart">
                <h6>Reparaciones por Mecánico</h6>
                <div class="category-stats">
                    ${Object.entries(mechanicStats).map(([mechanic, stats]) => `
                        <div class="category-card">
                            <div class="category-name">${mechanic}</div>
                            <div class="category-count">${stats.count}</div>
                            <div class="category-value">Total: $${stats.totalCost.toFixed(2)}<br>MO: $${stats.totalLaborCost.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div class="report-table-container">
            <h6>Lista de Reparaciones</h6>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Mecánico</th>
                        <th>Vehículo</th>
                        <th>Cliente</th>
                        <th>Descripción</th>
                        <th>Costo Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(repair => `
                        <tr>
                            <td>${new Date(repair.repair_date).toLocaleDateString()}</td>
                            <td>${repair.mechanic_name || 'N/A'}</td>
                            <td>${repair.make} ${repair.model} ${repair.year}</td>
                            <td>${repair.customer_name} ${repair.customer_last_name}</td>
                            <td>${repair.description || 'N/A'}</td>
                            <td>$${repair.total_cost}</td>
                            <td><span class="status-badge ${repair.status === 'completed' ? 'active' : 'inactive'}">${repair.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Mostrar mensaje en gestión de reportes
function showReportMessage(message, type = 'info') {
    const messageElement = document.getElementById('reportMessage');
    messageElement.textContent = message;
    messageElement.className = `alert alert-${type} mt-3`;
    messageElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// Exportar reporte
function exportReport() {
    if (!currentReportData) return;
    
    // Crear contenido del reporte para exportar
    const reportContent = document.getElementById('reportContent').innerHTML;
    const exportWindow = window.open('', '_blank');
    
    exportWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${currentReportData.title} - MecTrack</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .report-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .report-table th, .report-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .report-table th { background-color: #f2f2f2; }
                .stat-card { border: 1px solid #ddd; padding: 15px; margin: 10px; text-align: center; display: inline-block; min-width: 150px; }
                .stat-number { font-size: 24px; font-weight: bold; color: #007bff; }
                .stat-label { color: #666; }
                h6 { color: #007bff; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>${currentReportData.title}</h1>
            <p>Generado el: ${new Date().toLocaleString()}</p>
            ${reportContent}
        </body>
        </html>
    `);
    
    exportWindow.document.close();
    exportWindow.print();
}

// Manejar envío del formulario de filtros
function handleReportFiltersSubmit(e) {
    e.preventDefault();
    generateReport();
}

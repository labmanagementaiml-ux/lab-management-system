// Data Management with API Integration
class LabManagementSystem {
    constructor() {
        this.labs = [];
        this.classes = [];
        this.labAttendance = [];
        this.classAttendance = [];
        this.editType = '';
        this.editId = '';
        this.labAttendanceEditId = '';
        this.classAttendanceEditId = '';
        this.labChart = null;
        this.classChart = null;
        this.labSlotChart = null;
        this.classSlotChart = null;
        this.groupedBarChart = null;
        this.labGroupedBarChart = null;
        this.dashboardDate = new Date().toISOString().split('T')[0];
        this.apiBase = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderAll();
        this.setTodayDate();
    }

    // API Data Management
    async loadData() {
        try {
            const [labsRes, classesRes, labAttRes, classAttRes] = await Promise.all([
                fetch(`${this.apiBase}/labs`),
                fetch(`${this.apiBase}/classes`),
                fetch(`${this.apiBase}/lab-attendance`),
                fetch(`${this.apiBase}/class-attendance`)
            ]);

            this.labs = await labsRes.json();
            this.classes = await classesRes.json();
            this.labAttendance = await labAttRes.json();
            this.classAttendance = await classAttRes.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error loading data from server', 'error');
        }
    }

    // Labs API methods
    async saveLab(labData) {
        try {
            const response = await fetch(`${this.apiBase}/labs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(labData)
            });
            
            if (!response.ok) throw new Error('Failed to save lab');
            
            const result = await response.json();
            await this.loadData(); // Refresh data
            this.showNotification('Lab created successfully', 'success');
            return result;
        } catch (error) {
            console.error('Error saving lab:', error);
            this.showNotification('Error saving lab', 'error');
        }
    }

    async updateLab(id, labData) {
        try {
            const response = await fetch(`${this.apiBase}/labs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(labData)
            });
            
            if (!response.ok) throw new Error('Failed to update lab');
            
            await this.loadData(); // Refresh data
            this.showNotification('Lab updated successfully', 'success');
        } catch (error) {
            console.error('Error updating lab:', error);
            this.showNotification('Error updating lab', 'error');
        }
    }

    async deleteLab(id) {
        try {
            const response = await fetch(`${this.apiBase}/labs/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete lab');
            
            await this.loadData(); // Refresh data
            this.showNotification('Lab deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting lab:', error);
            this.showNotification('Error deleting lab', 'error');
        }
    }

    // Classes API methods
    async saveClass(classData) {
        try {
            const response = await fetch(`${this.apiBase}/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classData)
            });
            
            if (!response.ok) throw new Error('Failed to save class');
            
            const result = await response.json();
            await this.loadData(); // Refresh data
            this.showNotification('Class created successfully', 'success');
            return result;
        } catch (error) {
            console.error('Error saving class:', error);
            this.showNotification('Error saving class', 'error');
        }
    }

    async updateClass(id, classData) {
        try {
            const response = await fetch(`${this.apiBase}/classes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classData)
            });
            
            if (!response.ok) throw new Error('Failed to update class');
            
            await this.loadData(); // Refresh data
            this.showNotification('Class updated successfully', 'success');
        } catch (error) {
            console.error('Error updating class:', error);
            this.showNotification('Error updating class', 'error');
        }
    }

    async deleteClass(id) {
        try {
            const response = await fetch(`${this.apiBase}/classes/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete class');
            
            await this.loadData(); // Refresh data
            this.showNotification('Class deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting class:', error);
            this.showNotification('Error deleting class', 'error');
        }
    }

    // Lab Attendance API methods
    async saveLabAttendance(attendanceData) {
        try {
            const response = await fetch(`${this.apiBase}/lab-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData)
            });
            
            if (!response.ok) throw new Error('Failed to save lab attendance');
            
            const result = await response.json();
            await this.loadData(); // Refresh data
            this.showNotification('Lab attendance recorded successfully', 'success');
            return result;
        } catch (error) {
            console.error('Error saving lab attendance:', error);
            this.showNotification('Error saving lab attendance', 'error');
        }
    }

    // Class Attendance API methods
    async saveClassAttendance(attendanceData) {
        try {
            const response = await fetch(`${this.apiBase}/class-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData)
            });
            
            if (!response.ok) throw new Error('Failed to save class attendance');
            
            const result = await response.json();
            await this.loadData(); // Refresh data
            this.showNotification('Class attendance recorded successfully', 'success');
            return result;
        } catch (error) {
            console.error('Error saving class attendance:', error);
            this.showNotification('Error saving class attendance', 'error');
        }
    }

    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    convertTo12HourFormat(timeSlot) {
        const times = timeSlot.split('-');
        if (times.length !== 2) return timeSlot;
        
        const convertTime = (time) => {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${displayHour}:${minutes} ${ampm}`;
        };
        
        return `${convertTime(times[0])} – ${convertTime(times[1])}`;
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('lab-attendance-date').value = today;
        document.getElementById('class-attendance-date').value = today;
        document.getElementById('dashboard-date-selector').value = today;
        this.dashboardDate = today;
    }

    // Notification system
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-4 rounded-lg shadow-lg mb-4`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-3"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Event Listeners
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Lab management
        document.getElementById('add-lab-btn').addEventListener('click', () => {
            this.openLabModal();
        });

        document.getElementById('lab-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLabData();
        });

        // Class management
        document.getElementById('add-class-btn').addEventListener('click', () => {
            this.openClassModal();
        });

        document.getElementById('class-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClassData();
        });

        // Lab attendance
        document.getElementById('add-lab-attendance-btn').addEventListener('click', () => {
            this.openLabAttendanceModal();
        });

        document.getElementById('lab-attendance-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLabAttendanceData();
        });

        // Class attendance
        document.getElementById('add-class-attendance-btn').addEventListener('click', () => {
            this.openClassAttendanceModal();
        });

        document.getElementById('class-attendance-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClassAttendanceData();
        });

        // Dashboard date selector
        document.getElementById('dashboard-date-selector').addEventListener('change', (e) => {
            this.dashboardDate = e.target.value;
            this.updateDashboard();
        });

        // Export/Import buttons
        document.getElementById('export-xls-btn').addEventListener('click', () => {
            this.exportData('xls');
        });

        document.getElementById('import-xls-input').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
    }

    // Tab switching
    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        // Show selected tab content
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Add active class to selected tab button
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-blue-600', 'text-white');
    }

    // Modal management
    openLabModal(lab = null) {
        const modal = document.getElementById('lab-modal');
        const form = document.getElementById('lab-form');
        
        if (lab) {
            document.getElementById('lab-name').value = lab.name;
            document.getElementById('lab-subject').value = lab.subject;
            document.getElementById('lab-date').value = lab.date;
            document.getElementById('lab-time').value = lab.time;
            document.getElementById('lab-capacity').value = lab.capacity;
            this.editType = 'lab';
            this.editId = lab.id;
            modal.querySelector('.modal-title').textContent = 'Edit Lab';
        } else {
            form.reset();
            this.editType = '';
            this.editId = '';
            modal.querySelector('.modal-title').textContent = 'Add New Lab';
        }
        
        modal.classList.add('active');
    }

    openClassModal(classItem = null) {
        const modal = document.getElementById('class-modal');
        const form = document.getElementById('class-form');
        
        if (classItem) {
            document.getElementById('class-name').value = classItem.name;
            document.getElementById('class-subject').value = classItem.subject;
            document.getElementById('class-date').value = classItem.date;
            document.getElementById('class-time').value = classItem.time;
            document.getElementById('class-capacity').value = classItem.capacity;
            this.editType = 'class';
            this.editId = classItem.id;
            modal.querySelector('.modal-title').textContent = 'Edit Class';
        } else {
            form.reset();
            this.editType = '';
            this.editId = '';
            modal.querySelector('.modal-title').textContent = 'Add New Class';
        }
        
        modal.classList.add('active');
    }

    openLabAttendanceModal() {
        const modal = document.getElementById('lab-attendance-modal');
        const form = document.getElementById('lab-attendance-form');
        form.reset();
        this.labAttendanceEditId = '';
        modal.classList.add('active');
    }

    openClassAttendanceModal() {
        const modal = document.getElementById('class-attendance-modal');
        const form = document.getElementById('class-attendance-form');
        form.reset();
        this.classAttendanceEditId = '';
        modal.classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Save data methods
    async saveLabData() {
        const formData = {
            name: document.getElementById('lab-name').value,
            subject: document.getElementById('lab-subject').value,
            date: document.getElementById('lab-date').value,
            time: document.getElementById('lab-time').value,
            capacity: parseInt(document.getElementById('lab-capacity').value)
        };

        if (this.editType === 'lab' && this.editId) {
            await this.updateLab(this.editId, formData);
        } else {
            await this.saveLab(formData);
        }

        this.closeAllModals();
        this.renderLabs();
    }

    async saveClassData() {
        const formData = {
            name: document.getElementById('class-name').value,
            subject: document.getElementById('class-subject').value,
            date: document.getElementById('class-date').value,
            time: document.getElementById('class-time').value,
            capacity: parseInt(document.getElementById('class-capacity').value)
        };

        if (this.editType === 'class' && this.editId) {
            await this.updateClass(this.editId, formData);
        } else {
            await this.saveClass(formData);
        }

        this.closeAllModals();
        this.renderClasses();
    }

    async saveLabAttendanceData() {
        const formData = {
            lab_id: parseInt(document.getElementById('lab-attendance-lab').value),
            student_name: document.getElementById('lab-attendance-student').value,
            student_id: document.getElementById('lab-attendance-student-id').value,
            status: document.getElementById('lab-attendance-status').value,
            date: document.getElementById('lab-attendance-date').value
        };

        await this.saveLabAttendance(formData);
        this.closeAllModals();
        this.renderLabAttendance();
    }

    async saveClassAttendanceData() {
        const formData = {
            class_id: parseInt(document.getElementById('class-attendance-class').value),
            student_name: document.getElementById('class-attendance-student').value,
            student_id: document.getElementById('class-attendance-student-id').value,
            status: document.getElementById('class-attendance-status').value,
            date: document.getElementById('class-attendance-date').value
        };

        await this.saveClassAttendance(formData);
        this.closeAllModals();
        this.renderClassAttendance();
    }

    // Render methods
    renderAll() {
        this.renderLabs();
        this.renderClasses();
        this.renderLabAttendance();
        this.renderClassAttendance();
        this.updateDashboard();
    }

    renderLabs() {
        const container = document.getElementById('labs-container');
        container.innerHTML = '';

        this.labs.forEach(lab => {
            const labCard = document.createElement('div');
            labCard.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow';
            labCard.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${lab.name}</h3>
                        <p class="text-gray-600">${lab.subject}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="app.openLabModal(${JSON.stringify(lab).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteLab(${lab.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-500">
                    <p><i class="fas fa-calendar mr-2"></i>${lab.date}</p>
                    <p><i class="fas fa-clock mr-2"></i>${this.convertTo12HourFormat(lab.time)}</p>
                    <p><i class="fas fa-users mr-2"></i>Capacity: ${lab.capacity}</p>
                </div>
            `;
            container.appendChild(labCard);
        });
    }

    renderClasses() {
        const container = document.getElementById('classes-container');
        container.innerHTML = '';

        this.classes.forEach(classItem => {
            const classCard = document.createElement('div');
            classCard.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow';
            classCard.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${classItem.name}</h3>
                        <p class="text-gray-600">${classItem.subject}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="app.openClassModal(${JSON.stringify(classItem).replace(/"/g, '&quot;')})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.deleteClass(${classItem.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-500">
                    <p><i class="fas fa-calendar mr-2"></i>${classItem.date}</p>
                    <p><i class="fas fa-clock mr-2"></i>${this.convertTo12HourFormat(classItem.time)}</p>
                    <p><i class="fas fa-users mr-2"></i>Capacity: ${classItem.capacity}</p>
                </div>
            `;
            container.appendChild(classCard);
        });
    }

    renderLabAttendance() {
        const container = document.getElementById('lab-attendance-container');
        container.innerHTML = '';

        this.labAttendance.forEach(attendance => {
            const attendanceCard = document.createElement('div');
            attendanceCard.className = 'bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow';
            attendanceCard.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold text-gray-800">${attendance.student_name}</h4>
                        <p class="text-sm text-gray-600">ID: ${attendance.student_id}</p>
                        <p class="text-sm text-gray-500">${attendance.lab_name} - ${attendance.date}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${
                            attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                            attendance.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }">
                            ${attendance.status}
                        </span>
                    </div>
                </div>
            `;
            container.appendChild(attendanceCard);
        });
    }

    renderClassAttendance() {
        const container = document.getElementById('class-attendance-container');
        container.innerHTML = '';

        this.classAttendance.forEach(attendance => {
            const attendanceCard = document.createElement('div');
            attendanceCard.className = 'bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow';
            attendanceCard.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold text-gray-800">${attendance.student_name}</h4>
                        <p class="text-sm text-gray-600">ID: ${attendance.student_id}</p>
                        <p class="text-sm text-gray-500">${attendance.class_name} - ${attendance.date}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${
                            attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                            attendance.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }">
                            ${attendance.status}
                        </span>
                    </div>
                </div>
            `;
            container.appendChild(attendanceCard);
        });
    }

    updateDashboard() {
        // Update dashboard statistics
        const totalLabs = this.labs.length;
        const totalClasses = this.classes.length;
        const todayLabAttendance = this.labAttendance.filter(a => a.date === this.dashboardDate);
        const todayClassAttendance = this.classAttendance.filter(a => a.date === this.dashboardDate);

        document.getElementById('total-labs').textContent = totalLabs;
        document.getElementById('total-classes').textContent = totalClasses;
        document.getElementById('today-lab-attendance').textContent = todayLabAttendance.length;
        document.getElementById('today-class-attendance').textContent = todayClassAttendance.length;

        // Update charts
        this.updateCharts();
    }

    updateCharts() {
        // Implementation for charts would go here
        // This is a placeholder for chart updates
    }

    // Export/Import functionality
    exportData(format) {
        // Implementation for data export
        this.showNotification('Export functionality coming soon', 'info');
    }

    importData(file) {
        // Implementation for data import
        this.showNotification('Import functionality coming soon', 'info');
    }
}

// Initialize the application
const app = new LabManagementSystem();

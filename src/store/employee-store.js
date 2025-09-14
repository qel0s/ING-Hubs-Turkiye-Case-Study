class EmployeeStore {
  constructor() {
    this.state = {
      employees: this.loadFromStorage(),
      currentEmployee: null,
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      language: this.detectLanguage(),
      viewMode: 'list'
    };
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('employee-management-data');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('employee-management-data', JSON.stringify(this.state.employees));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  detectLanguage() {
    try {
      const storedLanguage = localStorage.getItem('employee-management-language');
      if (storedLanguage && (storedLanguage === 'tr' || storedLanguage === 'en')) {
        return storedLanguage;
      }
    } catch (error) {
      console.error('Error loading language from storage:', error);
    }
    
    const htmlLang = document.documentElement.lang || 'en';
    return htmlLang.startsWith('tr') ? 'tr' : 'en';
  }

  saveLanguageToStorage(language) {
    try {
      localStorage.setItem('employee-management-language', language);
    } catch (error) {
      console.error('Error saving language to storage:', error);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.state.employees.push(newEmployee);
    this.saveToStorage();
    this.notify();
    return newEmployee;
  }

  updateEmployee(id, updates) {
    const index = this.state.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.state.employees[index] = {
        ...this.state.employees[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      this.notify();
      return this.state.employees[index];
    }
    return null;
  }

  deleteEmployee(id) {
    const index = this.state.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const deleted = this.state.employees.splice(index, 1)[0];
      this.saveToStorage();
      this.notify();
      return deleted;
    }
    return null;
  }

  getEmployee(id) {
    return this.state.employees.find(emp => emp.id === id);
  }

  getEmployees() {
    return this.state.employees;
  }

  getFilteredEmployees() {
    let filtered = this.state.employees;
    
    if (this.state.searchTerm) {
      const term = this.state.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }

  getPaginatedEmployees() {
    const filtered = this.getFilteredEmployees();
    const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const end = start + this.state.itemsPerPage;
    return {
      employees: filtered.slice(start, end),
      totalPages: Math.ceil(filtered.length / this.state.itemsPerPage),
      totalItems: filtered.length
    };
  }

  setSearchTerm(term) {
    this.state.searchTerm = term;
    this.state.currentPage = 1;
    this.notify();
  }

  setCurrentPage(page) {
    this.state.currentPage = page;
    this.notify();
  }

  setItemsPerPage(items) {
    this.state.itemsPerPage = items;
    this.state.currentPage = 1;
    this.notify();
  }

  setCurrentEmployee(employee) {
    this.state.currentEmployee = employee;
    this.notify();
  }

  setLanguage(lang) {
    this.state.language = lang;
    this.saveLanguageToStorage(lang);
    this.notify();
  }

  setViewMode(mode) {
    if (mode === 'list' || mode === 'grid') {
      this.state.viewMode = mode;
      this.notify();
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  reset() {
    this.state.employees = [];
    this.state.currentEmployee = null;
    this.state.searchTerm = '';
    this.state.currentPage = 1;
    this.saveToStorage();
    this.notify();
  }
}

export const employeeStore = new EmployeeStore();

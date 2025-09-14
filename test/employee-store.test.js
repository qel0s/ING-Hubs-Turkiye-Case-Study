import { expect, fixture, html } from '@open-wc/testing';
import { employeeStore } from '../src/store/employee-store.js';

describe('Employee Store', () => {
  beforeEach(() => {
    employeeStore.reset();
  });

  describe('Initial State', () => {
    it('should have empty employees array initially', () => {
      expect(employeeStore.getEmployees()).to.deep.equal([]);
    });

    it('should have correct initial state', () => {
      const state = employeeStore.state;
      expect(state.employees).to.deep.equal([]);
      expect(state.currentEmployee).to.be.null;
      expect(state.searchTerm).to.equal('');
      expect(state.currentPage).to.equal(1);
      expect(state.itemsPerPage).to.equal(10);
    });
  });

  describe('Employee Management', () => {
    const sampleEmployee = {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '5551234567',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior'
    };

    it('should add employee successfully', () => {
      const newEmployee = employeeStore.addEmployee(sampleEmployee);
      
      expect(newEmployee).to.have.property('id');
      expect(newEmployee).to.have.property('createdAt');
      expect(newEmployee).to.have.property('updatedAt');
      expect(newEmployee.firstName).to.equal(sampleEmployee.firstName);
      expect(newEmployee.lastName).to.equal(sampleEmployee.lastName);
      
      const employees = employeeStore.getEmployees();
      expect(employees).to.have.length(1);
      expect(employees[0]).to.deep.include(sampleEmployee);
    });

    it('should update employee successfully', () => {
      const newEmployee = employeeStore.addEmployee(sampleEmployee);
      const updates = { firstName: 'Mehmet', position: 'Medior' };
      
      const updatedEmployee = employeeStore.updateEmployee(newEmployee.id, updates);
      
      expect(updatedEmployee).to.not.be.null;
      expect(updatedEmployee.firstName).to.equal('Mehmet');
      expect(updatedEmployee.position).to.equal('Medior');
      expect(updatedEmployee.lastName).to.equal(sampleEmployee.lastName);
      expect(updatedEmployee.updatedAt).to.not.equal(newEmployee.updatedAt);
    });

    it('should delete employee successfully', () => {
      const newEmployee = employeeStore.addEmployee(sampleEmployee);
      const deletedEmployee = employeeStore.deleteEmployee(newEmployee.id);
      
      expect(deletedEmployee).to.not.be.null;
      expect(deletedEmployee.id).to.equal(newEmployee.id);
      
      const employees = employeeStore.getEmployees();
      expect(employees).to.have.length(0);
    });

    it('should return null when updating non-existent employee', () => {
      const result = employeeStore.updateEmployee('non-existent-id', { firstName: 'Test' });
      expect(result).to.be.null;
    });

    it('should return null when deleting non-existent employee', () => {
      const result = employeeStore.deleteEmployee('non-existent-id');
      expect(result).to.be.null;
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(() => {
      employeeStore.addEmployee({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@example.com',
        phone: '5551234567',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Senior'
      });
      
      employeeStore.addEmployee({
        firstName: 'Mehmet',
        lastName: 'Demir',
        email: 'mehmet@example.com',
        phone: '5557654321',
        dateOfBirth: '1985-05-15',
        dateOfEmployment: '2019-03-01',
        department: 'Analytics',
        position: 'Junior'
      });
    });

    it('should filter employees by search term', () => {
      employeeStore.setSearchTerm('Ahmet');
      const filtered = employeeStore.getFilteredEmployees();
      
      expect(filtered).to.have.length(1);
      expect(filtered[0].firstName).to.equal('Ahmet');
    });

    it('should filter employees by department', () => {
      employeeStore.setSearchTerm('Tech');
      const filtered = employeeStore.getFilteredEmployees();
      
      expect(filtered).to.have.length(1);
      expect(filtered[0].department).to.equal('Tech');
    });

    it('should return all employees when search term is empty', () => {
      employeeStore.setSearchTerm('');
      const filtered = employeeStore.getFilteredEmployees();
      
      expect(filtered).to.have.length(2);
    });

    it('should reset to first page when search term changes', () => {
      employeeStore.setCurrentPage(3);
      employeeStore.setSearchTerm('test');
      
      expect(employeeStore.state.currentPage).to.equal(1);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      for (let i = 0; i < 25; i++) {
        employeeStore.addEmployee({
          firstName: `Employee${i}`,
          lastName: 'Test',
          email: `employee${i}@example.com`,
          phone: '5551234567',
          dateOfBirth: '1990-01-01',
          dateOfEmployment: '2020-01-01',
          department: 'Tech',
          position: 'Junior'
        });
      }
    });

    it('should return correct paginated results', () => {
      const paginated = employeeStore.getPaginatedEmployees();
      
      expect(paginated.employees).to.have.length(10);
      expect(paginated.totalPages).to.equal(3);
      expect(paginated.totalItems).to.equal(25);
    });

    it('should change page correctly', () => {
      employeeStore.setCurrentPage(2);
      const paginated = employeeStore.getPaginatedEmployees();
      
      expect(paginated.employees).to.have.length(10);
      expect(employeeStore.state.currentPage).to.equal(2);
    });

    it('should change items per page correctly', () => {
      employeeStore.setItemsPerPage(5);
      const paginated = employeeStore.getPaginatedEmployees();
      
      expect(paginated.employees).to.have.length(5);
      expect(paginated.totalPages).to.equal(5);
      expect(employeeStore.state.currentPage).to.equal(1);
    });
  });

  describe('State Persistence', () => {
    it('should save to localStorage when adding employee', () => {
      const originalSetItem = localStorage.setItem;
      let savedData = null;
      
      localStorage.setItem = (key, value) => {
        if (key === 'employee-management-data') {
          savedData = value;
        }
        originalSetItem.call(localStorage, key, value);
      };

      employeeStore.addEmployee({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '5551234567',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior'
      });

      expect(savedData).to.not.be.null;
      const parsedData = JSON.parse(savedData);
      expect(parsedData).to.have.length(1);
      expect(parsedData[0].firstName).to.equal('Test');

      localStorage.setItem = originalSetItem;
    });
  });

  describe('Language Management', () => {
    it('should detect language from HTML lang attribute', () => {
      document.documentElement.lang = 'tr';
      const store = new (employeeStore.constructor)();
      expect(store.detectLanguage()).to.equal('tr');

      document.documentElement.lang = 'en';
      const storeEn = new (employeeStore.constructor)();
      expect(storeEn.detectLanguage()).to.equal('en');
    });

    it('should change language', () => {
      employeeStore.setLanguage('tr');
      expect(employeeStore.state.language).to.equal('tr');
      
      employeeStore.setLanguage('en');
      expect(employeeStore.state.language).to.equal('en');
    });
  });

  describe('Store Listeners', () => {
    it('should notify listeners when state changes', (done) => {
      let notificationCount = 0;
      
      const unsubscribe = employeeStore.subscribe((state) => {
        notificationCount++;
        if (notificationCount === 1) {
          expect(state.employees).to.have.length(1);
          unsubscribe();
          done();
        }
      });

      employeeStore.addEmployee({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '5551234567',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior'
      });
    });
  });
});
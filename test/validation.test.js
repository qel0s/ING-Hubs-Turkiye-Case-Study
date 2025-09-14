import { expect } from '@open-wc/testing';
import { employeeValidation, ValidationError } from '../src/utils/validation.js';

describe('Employee Validation', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(() => employeeValidation.validateEmail('test@example.com')).to.not.throw();
      expect(() => employeeValidation.validateEmail('user.name@domain.co.uk')).to.not.throw();
      expect(() => employeeValidation.validateEmail('test+tag@example.org')).to.not.throw();
    });

    it('should reject invalid email addresses', () => {
      expect(() => employeeValidation.validateEmail('invalid-email')).to.throw(ValidationError);
      expect(() => employeeValidation.validateEmail('test@')).to.throw(ValidationError);
      expect(() => employeeValidation.validateEmail('@example.com')).to.throw(ValidationError);
      expect(() => employeeValidation.validateEmail('')).to.throw(ValidationError);
      expect(() => employeeValidation.validateEmail(null)).to.throw(ValidationError);
    });
  });

  describe('Phone Validation', () => {
    it('should validate correct Turkish phone numbers', () => {
      expect(() => employeeValidation.validatePhone('5551234567')).to.not.throw();
      expect(() => employeeValidation.validatePhone('05551234567')).to.not.throw();
      expect(() => employeeValidation.validatePhone('+905551234567')).to.not.throw();
      expect(() => employeeValidation.validatePhone('555 123 45 67')).to.not.throw();
    });

    it('should reject invalid phone numbers', () => {
      expect(() => employeeValidation.validatePhone('123456789')).to.throw(ValidationError);
      expect(() => employeeValidation.validatePhone('555123456')).to.throw(ValidationError);
      expect(() => employeeValidation.validatePhone('55512345678')).to.throw(ValidationError);
      expect(() => employeeValidation.validatePhone('')).to.throw(ValidationError);
      expect(() => employeeValidation.validatePhone(null)).to.throw(ValidationError);
    });
  });

  describe('Name Validation', () => {
    it('should validate correct names', () => {
      expect(() => employeeValidation.validateName('Ahmet', 'firstName')).to.not.throw();
      expect(() => employeeValidation.validateName('Mehmet Ali', 'firstName')).to.not.throw();
      expect(() => employeeValidation.validateName('A', 'firstName')).to.not.throw();
    });

    it('should reject invalid names', () => {
      expect(() => employeeValidation.validateName('', 'firstName')).to.throw(ValidationError);
      expect(() => employeeValidation.validateName('A', 'firstName')).to.throw(ValidationError);
      expect(() => employeeValidation.validateName('A'.repeat(51), 'firstName')).to.throw(ValidationError);
      expect(() => employeeValidation.validateName(null, 'firstName')).to.throw(ValidationError);
    });
  });

  describe('Date Validation', () => {
    it('should validate correct dates', () => {
      expect(() => employeeValidation.validateDate('1990-01-01', 'dateOfBirth')).to.not.throw();
      expect(() => employeeValidation.validateDate('2020-12-31', 'dateOfEmployment')).to.not.throw();
    });

    it('should reject invalid dates', () => {
      expect(() => employeeValidation.validateDate('', 'dateOfBirth')).to.throw(ValidationError);
      expect(() => employeeValidation.validateDate('invalid-date', 'dateOfBirth')).to.throw(ValidationError);
      expect(() => employeeValidation.validateDate(null, 'dateOfBirth')).to.throw(ValidationError);
    });

    it('should reject future birth dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      expect(() => employeeValidation.validateDate(futureDateString, 'dateOfBirth')).to.throw(ValidationError);
    });

    it('should reject future employment dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      expect(() => employeeValidation.validateDate(futureDateString, 'dateOfEmployment')).to.throw(ValidationError);
    });

    it('should reject very old birth dates', () => {
      const veryOldDate = '1800-01-01';
      expect(() => employeeValidation.validateDate(veryOldDate, 'dateOfBirth')).to.throw(ValidationError);
    });
  });

  describe('Department Validation', () => {
    it('should validate correct departments', () => {
      expect(() => employeeValidation.validateDepartment('Analytics')).to.not.throw();
      expect(() => employeeValidation.validateDepartment('Tech')).to.not.throw();
    });

    it('should reject invalid departments', () => {
      expect(() => employeeValidation.validateDepartment('Invalid')).to.throw(ValidationError);
      expect(() => employeeValidation.validateDepartment('')).to.throw(ValidationError);
      expect(() => employeeValidation.validateDepartment(null)).to.throw(ValidationError);
    });
  });

  describe('Position Validation', () => {
    it('should validate correct positions', () => {
      expect(() => employeeValidation.validatePosition('Junior')).to.not.throw();
      expect(() => employeeValidation.validatePosition('Medior')).to.not.throw();
      expect(() => employeeValidation.validatePosition('Senior')).to.not.throw();
    });

    it('should reject invalid positions', () => {
      expect(() => employeeValidation.validatePosition('Invalid')).to.throw(ValidationError);
      expect(() => employeeValidation.validatePosition('')).to.throw(ValidationError);
      expect(() => employeeValidation.validatePosition(null)).to.throw(ValidationError);
    });
  });

  describe('Complete Employee Validation', () => {
    const validEmployee = {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '5551234567',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior'
    };

    it('should validate complete valid employee', () => {
      const result = employeeValidation.validateEmployee(validEmployee);
      expect(result.isValid).to.be.true;
      expect(result.errors).to.deep.equal({});
    });

    it('should return errors for invalid employee', () => {
      const invalidEmployee = {
        firstName: '',
        lastName: 'Yılmaz',
        email: 'invalid-email',
        phone: '123',
        dateOfBirth: 'invalid-date',
        dateOfEmployment: '2020-01-01',
        department: 'Invalid',
        position: 'Invalid'
      };

      const result = employeeValidation.validateEmployee(invalidEmployee);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.property('firstName');
      expect(result.errors).to.have.property('email');
      expect(result.errors).to.have.property('phone');
      expect(result.errors).to.have.property('dateOfBirth');
      expect(result.errors).to.have.property('department');
      expect(result.errors).to.have.property('position');
    });

    it('should validate email uniqueness', () => {
      const employees = [
        { id: '1', email: 'existing@example.com' },
        { id: '2', email: 'other@example.com' }
      ];

      expect(() => employeeValidation.validateEmailUniqueness('new@example.com', null, employees)).to.not.throw();

      expect(() => employeeValidation.validateEmailUniqueness('existing@example.com', null, employees)).to.throw(ValidationError);

      expect(() => employeeValidation.validateEmailUniqueness('existing@example.com', '1', employees)).to.not.throw();
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Test message', 'testField');
      expect(error.message).to.equal('Test message');
      expect(error.field).to.equal('testField');
      expect(error.name).to.equal('ValidationError');
    });
  });
});

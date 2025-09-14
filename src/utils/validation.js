export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export const employeeValidation = {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new ValidationError('Geçerli bir email adresi giriniz', 'email');
    }
    return true;
  },

  validatePhone(phone) {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
      throw new ValidationError('Geçerli bir telefon numarası giriniz (5XXXXXXXXX)', 'phone');
    }
    return true;
  },

  validateName(name, fieldName) {
    if (!name || name.trim().length < 2) {
      throw new ValidationError(`${fieldName} en az 2 karakter olmalıdır`, fieldName);
    }
    if (name.trim().length > 50) {
      throw new ValidationError(`${fieldName} en fazla 50 karakter olabilir`, fieldName);
    }
    return true;
  },

  validateDate(date, fieldName) {
    if (!date) {
      throw new ValidationError(`${fieldName} gereklidir`, fieldName);
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError(`Geçerli bir ${fieldName} giriniz`, fieldName);
    }

    if (fieldName === 'dateOfBirth' && dateObj > new Date()) {
      throw new ValidationError('Doğum tarihi gelecekte olamaz', fieldName);
    }

    if (fieldName === 'dateOfEmployment' && dateObj > new Date()) {
      throw new ValidationError('İşe giriş tarihi gelecekte olamaz', fieldName);
    }

    if (fieldName === 'dateOfBirth') {
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
      if (dateObj < hundredYearsAgo) {
        throw new ValidationError('Doğum tarihi çok eski', fieldName);
      }
    }

    return true;
  },

  validateDepartment(department) {
    const validDepartments = ['Analytics', 'Tech'];
    if (!department || !validDepartments.includes(department)) {
      throw new ValidationError('Geçerli bir departman seçiniz (Analytics, Tech)', 'department');
    }
    return true;
  },

  validatePosition(position) {
    const validPositions = ['Junior', 'Medior', 'Senior'];
    if (!position || !validPositions.includes(position)) {
      throw new ValidationError('Geçerli bir pozisyon seçiniz (Junior, Medior, Senior)', 'position');
    }
    return true;
  },

  validateEmployee(employee, isUpdate = false) {
    const errors = {};

    try {
      this.validateName(employee.firstName, 'firstName');
    } catch (error) {
      errors.firstName = error.message;
    }

    try {
      this.validateName(employee.lastName, 'lastName');
    } catch (error) {
      errors.lastName = error.message;
    }

    try {
      this.validateEmail(employee.email);
    } catch (error) {
      errors.email = error.message;
    }

    try {
      this.validatePhone(employee.phone);
    } catch (error) {
      errors.phone = error.message;
    }

    try {
      this.validateDate(employee.dateOfBirth, 'dateOfBirth');
    } catch (error) {
      errors.dateOfBirth = error.message;
    }

    try {
      this.validateDate(employee.dateOfEmployment, 'dateOfEmployment');
    } catch (error) {
      errors.dateOfEmployment = error.message;
    }

    try {
      this.validateDepartment(employee.department);
    } catch (error) {
      errors.department = error.message;
    }

    try {
      this.validatePosition(employee.position);
    } catch (error) {
      errors.position = error.message;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateEmailUniqueness(email, currentId = null, employees = []) {
    const existingEmployee = employees.find(emp => 
      emp.email.toLowerCase() === email.toLowerCase() && emp.id !== currentId
    );
    
    if (existingEmployee) {
      throw new ValidationError('Bu email adresi zaten kullanılıyor', 'email');
    }
    
    return true;
  }
};

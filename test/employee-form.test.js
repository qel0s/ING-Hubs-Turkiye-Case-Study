import { expect, fixture, html } from '@open-wc/testing';
import { employeeStore } from '../src/store/employee-store.js';
import '../src/components/employee-form.js';

describe('Employee Form Component', () => {
  let element;

  beforeEach(async () => {
    employeeStore.reset();
    element = await fixture(html`<employee-form></employee-form>`);
  });

  it('should render form for adding new employee', () => {
    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;
    
    const title = element.shadowRoot.querySelector('.form-title');
    expect(title.textContent).to.include('Ekle');
  });

  it('should render form for editing existing employee', async () => {
    const employee = employeeStore.addEmployee({
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '5551234567',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior'
    });

    employeeStore.setCurrentEmployee(employee);
    element = await fixture(html`<employee-form></employee-form>`);
    
    const title = element.shadowRoot.querySelector('.form-title');
    expect(title.textContent).to.include('Düzenle');
  });

  it('should have all required form fields', () => {
    const form = element.shadowRoot.querySelector('form');
    const inputs = form.querySelectorAll('input, select');
    
    expect(inputs).to.have.length(8);
    
    const firstNameInput = form.querySelector('input[data-field="firstName"]');
    const lastNameInput = form.querySelector('input[data-field="lastName"]');
    const emailInput = form.querySelector('input[data-field="email"]');
    const phoneInput = form.querySelector('input[data-field="phone"]');
    const dateOfBirthInput = form.querySelector('input[data-field="dateOfBirth"]');
    const dateOfEmploymentInput = form.querySelector('input[data-field="dateOfEmployment"]');
    const departmentSelect = form.querySelector('select[data-field="department"]');
    const positionSelect = form.querySelector('select[data-field="position"]');
    
    expect(firstNameInput).to.exist;
    expect(lastNameInput).to.exist;
    expect(emailInput).to.exist;
    expect(phoneInput).to.exist;
    expect(dateOfBirthInput).to.exist;
    expect(dateOfEmploymentInput).to.exist;
    expect(departmentSelect).to.exist;
    expect(positionSelect).to.exist;
  });

  it('should handle input changes', async () => {
    const firstNameInput = element.shadowRoot.querySelector('input[data-field="firstName"]');
    firstNameInput.value = 'Test';
    firstNameInput.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    
    expect(element.formData.firstName).to.equal('Test');
  });

  it('should validate form on submit', async () => {
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    
    await element.updateComplete;
    
    expect(element.errors).to.not.be.empty;
    expect(element.errors.firstName).to.exist;
  });

  it('should show validation errors', async () => {
    const firstNameInput = element.shadowRoot.querySelector('input[data-field="firstName"]');
    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));
    
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    
    await element.updateComplete;
    
    const errorMessage = element.shadowRoot.querySelector('.error-message.show');
    expect(errorMessage).to.exist;
  });

  it('should clear errors when input changes', async () => {
    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    await element.updateComplete;
    
    expect(element.errors.firstName).to.exist;
    
    const firstNameInput = element.shadowRoot.querySelector('input[data-field="firstName"]');
    firstNameInput.value = 'Test';
    firstNameInput.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    
    expect(element.errors.firstName).to.equal('');
  });

  it('should handle successful form submission', async () => {
    element.formData = {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '5551234567',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior'
    };

    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    
    await element.updateComplete;
    
    expect(element.successMessage).to.exist;
    expect(employeeStore.getEmployees()).to.have.length(1);
  });

  it('should handle cancel button click', () => {
    let navigateEvent = null;
    element.addEventListener('navigate', (e) => {
      navigateEvent = e;
    });
    
    const cancelButton = element.shadowRoot.querySelector('.btn-secondary');
    cancelButton.click();
    
    expect(navigateEvent).to.exist;
    expect(navigateEvent.detail.path).to.equal('/employees');
  });

  it('should pre-fill form when editing', async () => {
    const employee = employeeStore.addEmployee({
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '5551234567',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior'
    });

    employeeStore.setCurrentEmployee(employee);
    element = await fixture(html`<employee-form></employee-form>`);
    
    expect(element.formData.firstName).to.equal('Ahmet');
    expect(element.formData.lastName).to.equal('Yılmaz');
    expect(element.formData.email).to.equal('ahmet@example.com');
  });

  it('should handle department options', () => {
    const departmentSelect = element.shadowRoot.querySelector('select[data-field="department"]');
    const options = departmentSelect.querySelectorAll('option');
    
    expect(options).to.have.length(3);
    expect(options[1].value).to.equal('Analytics');
    expect(options[2].value).to.equal('Tech');
  });

  it('should handle position options', () => {
    const positionSelect = element.shadowRoot.querySelector('select[data-field="position"]');
    const options = positionSelect.querySelectorAll('option');
    
    expect(options).to.have.length(4);
    expect(options[1].value).to.equal('Junior');
    expect(options[2].value).to.equal('Medior');
    expect(options[3].value).to.equal('Senior');
  });

  it('should show loading state during submission', async () => {
    element.loading = true;
    await element.updateComplete;
    
    const submitButton = element.shadowRoot.querySelector('.btn-primary');
    expect(submitButton.disabled).to.be.true;
    expect(submitButton.textContent).to.include('Yükleniyor');
  });

  it('should handle email uniqueness validation', async () => {
    employeeStore.addEmployee({
      firstName: 'Existing',
      lastName: 'User',
      email: 'existing@example.com',
      phone: '5551234567',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Junior'
    });

    element.formData = {
      firstName: 'New',
      lastName: 'User',
      email: 'existing@example.com',
      phone: '5557654321',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Junior'
    };

    const form = element.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    
    await element.updateComplete;
    
    expect(element.errors.email).to.exist;
    expect(element.errors.email).to.include('zaten kullanılıyor');
  });

  it('should be accessible', async () => {
    await expect(element).to.be.accessible();
  });

  it('should display form fields in 3-column grid layout', () => {
    const formRows = element.shadowRoot.querySelectorAll('.form-row');
    expect(formRows.length).to.be.greaterThan(0);
    
    const firstRow = formRows[0];
    const computedStyle = window.getComputedStyle(firstRow);
    expect(computedStyle.display).to.equal('grid');
  });

  it('should have proper field arrangement in first row', () => {
    const firstRow = element.shadowRoot.querySelector('.form-row');
    const formGroups = firstRow.querySelectorAll('.form-group');
    
    expect(formGroups.length).to.equal(3);
    
    const firstNameInput = formGroups[0].querySelector('input[data-field="firstName"]');
    const lastNameInput = formGroups[1].querySelector('input[data-field="lastName"]');
    const emailInput = formGroups[2].querySelector('input[data-field="email"]');
    
    expect(firstNameInput).to.exist;
    expect(lastNameInput).to.exist;
    expect(emailInput).to.exist;
  });

  it('should have proper field arrangement in second row', () => {
    const formRows = element.shadowRoot.querySelectorAll('.form-row');
    const secondRow = formRows[1];
    const formGroups = secondRow.querySelectorAll('.form-group');
    
    expect(formGroups.length).to.equal(3);
    
    const phoneInput = formGroups[0].querySelector('input[data-field="phone"]');
    const dobInput = formGroups[1].querySelector('input[data-field="dateOfBirth"]');
    const doeInput = formGroups[2].querySelector('input[data-field="dateOfEmployment"]');
    
    expect(phoneInput).to.exist;
    expect(dobInput).to.exist;
    expect(doeInput).to.exist;
  });

  it('should have proper field arrangement in third row', () => {
    const formRows = element.shadowRoot.querySelectorAll('.form-row');
    const thirdRow = formRows[2];
    const formGroups = thirdRow.querySelectorAll('.form-group');
    
    expect(formGroups.length).to.equal(3);
    
    const departmentSelect = formGroups[0].querySelector('select[data-field="department"]');
    const positionSelect = formGroups[1].querySelector('select[data-field="position"]');
    
    expect(departmentSelect).to.exist;
    expect(positionSelect).to.exist;
    
    const thirdGroup = formGroups[2];
    expect(thirdGroup.children.length).to.equal(0);
  });

  it('should maintain responsive behavior', () => {
    const formRows = element.shadowRoot.querySelectorAll('.form-row');
    expect(formRows.length).to.be.greaterThan(0);
    
    formRows.forEach(row => {
      const formGroups = row.querySelectorAll('.form-group');
      expect(formGroups.length).to.be.greaterThan(0);
    });
  });

  it('should properly group related fields', () => {
    const formRows = element.shadowRoot.querySelectorAll('.form-row');
    
    const firstRowInputs = formRows[0].querySelectorAll('input');
    expect(firstRowInputs.length).to.equal(3);
    
    const secondRowInputs = formRows[1].querySelectorAll('input');
    expect(secondRowInputs.length).to.equal(3);
    
    const thirdRowSelects = formRows[2].querySelectorAll('select');
    expect(thirdRowSelects.length).to.equal(2);
  });
});

import { LitElement, html, css } from 'lit';
import { localizationService } from '../utils/localization.js';
import { employeeStore } from '../store/employee-store.js';
import { employeeValidation } from '../utils/validation.js';

export class EmployeeForm extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .form-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 2rem;
      }

      .form-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .form-title {
        font-size: 2rem;
        font-weight: bold;
        color: #fc8c46;
        margin: 0 0 0.5rem 0;
      }

      .form-subtitle {
        color: #7f8c8d;
        margin: 0;
      }

      .form {
        display: grid;
        gap: 1.5rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-label {
        font-weight: 600;
        color: #fc8c46;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      .required {
        color: #e74c3c;
      }

      .form-input {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }

      .form-input.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
      }

      .form-select {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background: white;
        cursor: pointer;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .form-select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }

      .form-select.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
      }

      .error-message {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: none;
      }

      .error-message.show {
        display: block;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #eee;
      }

      .btn {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        min-width: 120px;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-primary:hover {
        background: #2980b9;
      }

      .btn-primary:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }

      .btn-secondary {
        background: #95a5a6;
        color: white;
      }

      .btn-secondary:hover {
        background: #7f8c8d;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: #7f8c8d;
      }

      .success-message {
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        border: 1px solid #c3e6cb;
      }

      .error-message-global {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        border: 1px solid #f5c6cb;
      }

      @media (max-width: 1024px) {
        .form-row {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `;
  }

  static get properties() {
    return {
      employee: { type: Object },
      isEdit: { type: Boolean },
      formData: { type: Object },
      errors: { type: Object },
      loading: { type: Boolean },
      successMessage: { type: String },
      errorMessage: { type: String },
      language: { type: String }
    };
  }

  constructor() {
    super();
    this.employee = null;
    this.isEdit = false;
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      dateOfEmployment: '',
      department: '',
      position: ''
    };
    this.errors = {};
    this.loading = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.language = 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.language = employeeStore.state.language;
    
    this.unsubscribe = employeeStore.subscribe((state) => {
      this.language = state.language;
    });

    this.employee = employeeStore.state.currentEmployee;
    this.isEdit = !!this.employee;
    
    if (this.isEdit) {
      this.formData = { ...this.employee };
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return html`
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">
            ${this.isEdit ? this.t('employeeForm.editTitle') : this.t('employeeForm.addTitle')}
          </h1>
          <p class="form-subtitle">
            ${this.isEdit ? this.t('employeeForm.editSubtitle') : this.t('employeeForm.addSubtitle')}
          </p>
        </div>

        ${this.successMessage ? html`
          <div class="success-message">
            ${this.successMessage}
          </div>
        ` : ''}

        ${this.errorMessage ? html`
          <div class="error-message-global">
            ${this.errorMessage}
          </div>
        ` : ''}

        <form class="form" @submit=${this.handleSubmit}>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.firstName')} <span class="required">*</span>
              </label>
              <input
                type="text"
                class="form-input ${this.errors.firstName ? 'error' : ''}"
                .value=${this.formData.firstName}
                @input=${this.handleInputChange}
                data-field="firstName"
                required
              />
              <div class="error-message ${this.errors.firstName ? 'show' : ''}">
                ${this.errors.firstName || ''}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.lastName')} <span class="required">*</span>
              </label>
              <input
                type="text"
                class="form-input ${this.errors.lastName ? 'error' : ''}"
                .value=${this.formData.lastName}
                @input=${this.handleInputChange}
                data-field="lastName"
                required
              />
              <div class="error-message ${this.errors.lastName ? 'show' : ''}">
                ${this.errors.lastName || ''}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.email')} <span class="required">*</span>
              </label>
              <input
                type="email"
                class="form-input ${this.errors.email ? 'error' : ''}"
                .value=${this.formData.email}
                @input=${this.handleInputChange}
                data-field="email"
                required
              />
              <div class="error-message ${this.errors.email ? 'show' : ''}">
                ${this.errors.email || ''}
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.phone')} <span class="required">*</span>
              </label>
              <input
                type="tel"
                class="form-input ${this.errors.phone ? 'error' : ''}"
                .value=${this.formData.phone}
                @input=${this.handleInputChange}
                data-field="phone"
                placeholder="${this.t('employeeForm.phonePlaceholder')}"
                required
              />
              <div class="error-message ${this.errors.phone ? 'show' : ''}">
                ${this.errors.phone || ''}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.dateOfBirth')} <span class="required">*</span>
              </label>
              <input
                type="date"
                class="form-input ${this.errors.dateOfBirth ? 'error' : ''}"
                .value=${this.formData.dateOfBirth}
                @input=${this.handleInputChange}
                data-field="dateOfBirth"
                required
              />
              <div class="error-message ${this.errors.dateOfBirth ? 'show' : ''}">
                ${this.errors.dateOfBirth || ''}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.dateOfEmployment')} <span class="required">*</span>
              </label>
              <input
                type="date"
                class="form-input ${this.errors.dateOfEmployment ? 'error' : ''}"
                .value=${this.formData.dateOfEmployment}
                @input=${this.handleInputChange}
                data-field="dateOfEmployment"
                required
              />
              <div class="error-message ${this.errors.dateOfEmployment ? 'show' : ''}">
                ${this.errors.dateOfEmployment || ''}
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.department')} <span class="required">*</span>
              </label>
              <select
                class="form-select ${this.errors.department ? 'error' : ''}"
                .value=${this.formData.department}
                @change=${this.handleInputChange}
                data-field="department"
                required
              >
                <option value="">${this.t('employeeForm.selectDepartment')}</option>
                <option value="Analytics">${this.t('departments.Analytics')}</option>
                <option value="Tech">${this.t('departments.Tech')}</option>
              </select>
              <div class="error-message ${this.errors.department ? 'show' : ''}">
                ${this.errors.department || ''}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                ${this.t('employeeForm.position')} <span class="required">*</span>
              </label>
              <select
                class="form-select ${this.errors.position ? 'error' : ''}"
                .value=${this.formData.position}
                @change=${this.handleInputChange}
                data-field="position"
                required
              >
                <option value="">${this.t('employeeForm.selectPosition')}</option>
                <option value="Junior">${this.t('positions.Junior')}</option>
                <option value="Medior">${this.t('positions.Medior')}</option>
                <option value="Senior">${this.t('positions.Senior')}</option>
              </select>
              <div class="error-message ${this.errors.position ? 'show' : ''}">
                ${this.errors.position || ''}
              </div>
            </div>

            <div class="form-group">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click=${this.handleCancel}>
              ${this.t('employeeForm.cancel')}
            </button>
            <button type="submit" class="btn btn-primary" ?disabled=${this.loading}>
              ${this.loading ? this.t('common.loading') : (this.isEdit ? this.t('employeeForm.update') : this.t('employeeForm.save'))}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  handleInputChange(event) {
    const field = event.target.dataset.field;
    const value = event.target.value;
    
    this.formData = {
      ...this.formData,
      [field]: value
    };

    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: ''
      };
    }

    this.successMessage = '';
    this.errorMessage = '';
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    this.loading = true;
    this.errors = {};
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const validation = employeeValidation.validateEmployee(this.formData);
      
      if (!validation.isValid) {
        this.errors = validation.errors;
        this.loading = false;
        return;
      }

      const employees = employeeStore.getEmployees();
      try {
        employeeValidation.validateEmailUniqueness(
          this.formData.email, 
          this.isEdit ? this.employee.id : null, 
          employees
        );
      } catch (error) {
        this.errors = { ...this.errors, email: error.message };
        this.loading = false;
        return;
      }

      if (this.isEdit) {
        const updatedEmployee = employeeStore.updateEmployee(this.employee.id, this.formData);
        if (updatedEmployee) {
          this.successMessage = this.t('employeeForm.successUpdate');
          setTimeout(() => {
            this.navigateToEmployees();
          }, 1500);
        } else {
          this.errorMessage = this.t('employeeForm.errorUpdate');
        }
      } else {
        const newEmployee = employeeStore.addEmployee(this.formData);
        if (newEmployee) {
          this.successMessage = this.t('employeeForm.successAdd');
          setTimeout(() => {
            this.navigateToEmployees();
          }, 1500);
        } else {
          this.errorMessage = this.t('employeeForm.errorAdd');
        }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      this.errorMessage = this.isEdit ? this.t('employeeForm.errorUpdate') : this.t('employeeForm.errorAdd');
    } finally {
      this.loading = false;
    }
  }

  handleCancel() {
    this.navigateToEmployees();
  }

  navigateToEmployees() {
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: '/' },
      bubbles: true,
      composed: true
    }));
  }

  t(key, params = {}) {
    return localizationService.t(key, params);
  }
}

customElements.define('employee-form', EmployeeForm);

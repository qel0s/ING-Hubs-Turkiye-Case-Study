import { LitElement, html, css } from 'lit';
import { localizationService } from '../utils/localization.js';
import { employeeStore } from '../store/employee-store.js';

export class EmployeeList extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .title {
        font-size: 2rem;
        font-weight: bold;
        color: #fc8c46;
        margin: 0;
      }

      .add-button {
        background: #27ae60;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        text-decoration: none;
        display: inline-block;
        transition: background 0.3s ease;
      }

      .add-button:hover {
        background: #229954;
      }

      .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .search-container {
        flex: 1;
        min-width: 250px;
        max-width: 400px;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }

      .search-input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }

      .top-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
        padding: 1rem 0;
      }

      .items-per-page {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .items-per-page select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .pagination {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .pagination button {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .pagination button:hover:not(:disabled) {
        background: #f8f9fa;
        border-color: #3498db;
      }

      .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .pagination button.active {
        background: #3498db;
        color: white;
        border-color: #3498db;
      }

      .view-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: 1rem;
      }

      .view-toggle button {
        padding: 0.5rem;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
      }

      .view-toggle button:hover {
        background: #f8f9fa;
        border-color: #3498db;
      }

      .view-toggle button.active {
        background: #3498db;
        color: white;
        border-color: #3498db;
      }

      .view-toggle svg {
        width: 16px;
        height: 16px;
      }

      .table-container {
        overflow-x: auto;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background: white;
      }

      .employee-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 800px;
      }

      .employee-table th,
      .employee-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      .employee-table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #fc8c46;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .employee-table tbody tr:hover {
        background: #f8f9fa;
      }

      .employee-table tbody tr:last-child td {
        border-bottom: none;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-edit {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s ease;
      }

      .btn-edit:hover {
        background: #2980b9;
      }

      .btn-delete {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s ease;
      }

      .btn-delete:hover {
        background: #c0392b;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
      }

      .empty-state h3 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        color: #fc8c46;
      }

      .empty-state p {
        margin: 0 0 2rem 0;
        font-size: 1.1rem;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: #7f8c8d;
      }

      .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        text-align: center;
      }

      .modal h3 {
        margin: 0 0 1rem 0;
        color: #fc8c46;
      }

      .modal p {
        margin: 0 0 2rem 0;
        color: #7f8c8d;
      }

      .modal-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
      }

      .btn-cancel {
        background: white;
        color: #2c3e50;
        border: 1px solid #ddd;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.3s ease;
        width: 100%;
      }

      .btn-cancel:hover {
        background: #f8f9fa;
      }

      .btn-confirm {
        background: #fc8c46;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.3s ease;
        width: 100%;
      }

      .btn-confirm:hover {
        background: #e67e22;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 1.5rem;
      }

      .employee-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1.5rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .employee-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }

      .card-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3498db, #2980b9);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
      }

      .card-name {
        flex: 1;
      }

      .card-name h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        color: #2c3e50;
      }

      .card-name p {
        margin: 0;
        color: #7f8c8d;
        font-size: 0.9rem;
      }

      .card-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .card-field {
        display: flex;
        flex-direction: column;
      }

      .card-field-label {
        font-size: 0.8rem;
        color: #7f8c8d;
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .card-field-value {
        font-size: 0.9rem;
        color: #2c3e50;
        font-weight: 500;
      }

      .card-footer {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .card-footer .btn-edit,
      .card-footer .btn-delete {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }

      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          align-items: stretch;
        }

        .title {
          text-align: center;
        }

        .controls {
          flex-direction: column;
          align-items: stretch;
        }

        .search-container {
          max-width: none;
        }

        .top-controls {
          justify-content: center;
          flex-direction: column;
        }

        .employee-table {
          font-size: 0.9rem;
        }

        .employee-table th,
        .employee-table td {
          padding: 0.75rem 0.5rem;
        }

        .actions {
          flex-direction: column;
        }

        .btn-edit,
        .btn-delete {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }

        .view-toggle {
          margin-left: 0;
          margin-top: 0.5rem;
        }

        .grid-container {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .card-body {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .card-footer {
          flex-direction: column;
        }
      }
    `;
  }

  static get properties() {
    return {
      employees: { type: Array },
      filteredEmployees: { type: Array },
      searchTerm: { type: String },
      currentPage: { type: Number },
      totalPages: { type: Number },
      totalItems: { type: Number },
      itemsPerPage: { type: Number },
      language: { type: String },
      showDeleteModal: { type: Boolean },
      employeeToDelete: { type: Object },
      viewMode: { type: String }
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.searchTerm = '';
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalItems = 0;
    this.itemsPerPage = 10;
    this.language = 'en';
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.viewMode = 'list';
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.updateFromStore();
    
    this.unsubscribe = employeeStore.subscribe((state) => {
      this.language = state.language;
      this.updateFromStore();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateFromStore() {
    const state = employeeStore.state;
    this.searchTerm = state.searchTerm;
    this.currentPage = state.currentPage;
    this.itemsPerPage = state.itemsPerPage;
    this.viewMode = state.viewMode;
    
    const paginated = employeeStore.getPaginatedEmployees();
    this.employees = paginated.employees;
    this.totalPages = paginated.totalPages;
    this.totalItems = paginated.totalItems;
  }

  render() {
    return html`
      <div class="header">
        <h1 class="title">${this.t('employeeList.homeTitle')}</h1>
        <a href="/employees/add" class="add-button" @click=${this.handleAddClick}>
          ${this.t('nav.addEmployee')}
        </a>
      </div>

      <div class="controls">
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="${this.t('employeeList.searchPlaceholder')}"
            .value=${this.searchTerm}
            @input=${this.handleSearch}
          />
        </div>

        <div class="top-controls">
          <div class="items-per-page">
            <select @change=${this.handleItemsPerPageChange} .value=${this.itemsPerPage}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div class="view-toggle">
            <button 
              class="${this.viewMode === 'list' ? 'active' : ''}"
              @click=${() => this.handleViewModeChange('list')}
              title="Liste Görünümü"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
              </svg>
            </button>
            <button 
              class="${this.viewMode === 'grid' ? 'active' : ''}"
              @click=${() => this.handleViewModeChange('grid')}
              title="Kart Görünümü"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      ${this.renderContent()}

      ${this.showDeleteModal ? this.renderDeleteModal() : ''}
    `;
  }

  renderContent() {
    if (this.employees.length === 0) {
      return html`
        <div class="empty-state">
          <h3>${this.t('employeeList.noEmployees')}</h3>
          <p>${this.t('employeeList.addFirstEmployee')}</p>
        </div>
      `;
    }

    const contentHtml = this.viewMode === 'grid' ? html`
      <div class="grid-container">
        ${this.employees.map(employee => this.renderEmployeeCard(employee))}
      </div>
    ` : html`
      <div class="table-container">
        <table class="employee-table">
          <thead>
            <tr>
              <th>${this.t('employeeForm.firstName')}</th>
              <th>${this.t('employeeForm.lastName')}</th>
              <th>${this.t('employeeForm.email')}</th>
              <th>${this.t('employeeForm.phone')}</th>
              <th>${this.t('employeeForm.department')}</th>
              <th>${this.t('employeeForm.position')}</th>
              <th>${this.t('employeeForm.dateOfBirth')}</th>
              <th>${this.t('employeeForm.dateOfEmployment')}</th>
              <th>${this.t('employeeList.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(employee => this.renderEmployeeRow(employee))}
          </tbody>
        </table>
      </div>
    `;

    return html`
      ${contentHtml}
      
      <div class="pagination-container">
        <div class="pagination">
          <button 
            @click=${this.goToFirstPage} 
            ?disabled=${this.currentPage === 1}
          >
            ««
          </button>
          <button 
            @click=${this.goToPreviousPage} 
            ?disabled=${this.currentPage === 1}
          >
            «
          </button>
          
          ${this.renderPageNumbers()}
          
          <button 
            @click=${this.goToNextPage} 
            ?disabled=${this.currentPage === this.totalPages}
          >
            »
          </button>
          <button 
            @click=${this.goToLastPage} 
            ?disabled=${this.currentPage === this.totalPages}
          >
            »»
          </button>
        </div>
      </div>
    `;
  }

  renderEmployeeRow(employee) {
    return html`
      <tr>
        <td>${employee.firstName}</td>
        <td>${employee.lastName}</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>${this.t(`departments.${employee.department}`)}</td>
        <td>${this.t(`positions.${employee.position}`)}</td>
        <td>${this.formatDate(employee.dateOfBirth)}</td>
        <td>${this.formatDate(employee.dateOfEmployment)}</td>
        <td>
          <div class="actions">
            <button class="btn-edit" @click=${() => this.handleEdit(employee)}>
              ${this.t('employeeList.edit')}
            </button>
            <button class="btn-delete" @click=${() => this.handleDelete(employee)}>
              ${this.t('employeeList.delete')}
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  renderEmployeeCard(employee) {
    const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
    
    return html`
      <div class="employee-card">
        <div class="card-header">
          <div class="card-avatar">${initials}</div>
          <div class="card-name">
            <h3>${employee.firstName} ${employee.lastName}</h3>
            <p>${this.t(`departments.${employee.department}`)} - ${this.t(`positions.${employee.position}`)}</p>
          </div>
        </div>
        
        <div class="card-body">
          <div class="card-field">
            <div class="card-field-label">${this.t('employeeForm.email')}</div>
            <div class="card-field-value">${employee.email}</div>
          </div>
          
          <div class="card-field">
            <div class="card-field-label">${this.t('employeeForm.phone')}</div>
            <div class="card-field-value">${employee.phone}</div>
          </div>
          
          <div class="card-field">
            <div class="card-field-label">${this.t('employeeForm.dateOfEmployment')}</div>
            <div class="card-field-value">${this.formatDate(employee.dateOfEmployment)}</div>
          </div>
          
          <div class="card-field">
            <div class="card-field-label">${this.t('employeeForm.dateOfBirth')}</div>
            <div class="card-field-value">${this.formatDate(employee.dateOfBirth)}</div>
          </div>
        </div>
        
        <div class="card-footer">
          <button class="btn-edit" @click=${() => this.handleEdit(employee)}>
            ${this.t('employeeList.edit')}
          </button>
          <button class="btn-delete" @click=${() => this.handleDelete(employee)}>
            ${this.t('employeeList.delete')}
          </button>
        </div>
      </div>
    `;
  }

  renderPageNumbers() {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(html`
        <button 
          class="${i === this.currentPage ? 'active' : ''}"
          @click=${() => this.goToPage(i)}
        >
          ${i}
        </button>
      `);
    }

    return pages;
  }

  renderDeleteModal() {
    return html`
      <div class="modal">
        <div class="modal-content">
          <h3>${this.t('common.warning')}</h3>
          <p>${this.t('employeeList.confirmDelete')}</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click=${this.cancelDelete}>
              ${this.t('employeeList.cancel')}
            </button>
            <button class="btn-confirm" @click=${this.confirmDelete}>
              ${this.t('employeeList.confirm')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  handleAddClick(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: '/employees/add' },
      bubbles: true,
      composed: true
    }));
  }

  handleSearch(event) {
    const term = event.target.value;
    employeeStore.setSearchTerm(term);
  }

  handleItemsPerPageChange(event) {
    const items = parseInt(event.target.value);
    employeeStore.setItemsPerPage(items);
  }

  handleViewModeChange(mode) {
    employeeStore.setViewMode(mode);
  }

  handleEdit(employee) {
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: `/employees/edit/${employee.id}` },
      bubbles: true,
      composed: true
    }));
  }

  handleDelete(employee) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      employeeStore.deleteEmployee(this.employeeToDelete.id);
      this.showDeleteModal = false;
      this.employeeToDelete = null;
    }
  }

  goToPage(page) {
    employeeStore.setCurrentPage(page);
  }

  goToFirstPage() {
    employeeStore.setCurrentPage(1);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      employeeStore.setCurrentPage(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      employeeStore.setCurrentPage(this.currentPage + 1);
    }
  }

  goToLastPage() {
    employeeStore.setCurrentPage(this.totalPages);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(this.language === 'tr' ? 'tr-TR' : 'en-US');
  }

  t(key, params = {}) {
    return localizationService.t(key, params);
  }
}

customElements.define('employee-list', EmployeeList);

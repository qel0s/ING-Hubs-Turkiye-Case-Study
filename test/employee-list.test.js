import { expect, fixture, html } from '@open-wc/testing';
import { employeeStore } from '../src/store/employee-store.js';
import '../src/components/employee-list.js';

describe('Employee List Component', () => {
  let element;

  beforeEach(async () => {
    employeeStore.reset();
    
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

    element = await fixture(html`<employee-list></employee-list>`);
  });

  it('should render employee list', () => {
    const table = element.shadowRoot.querySelector('.employee-table');
    expect(table).to.exist;
    
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows).to.have.length(2);
  });

  it('should display employee data correctly', () => {
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');
    
    expect(cells[0].textContent.trim()).to.equal('Ahmet');
    expect(cells[1].textContent.trim()).to.equal('Yılmaz');
    expect(cells[2].textContent.trim()).to.equal('ahmet@example.com');
    expect(cells[3].textContent.trim()).to.equal('5551234567');
  });

  it('should show empty state when no employees', async () => {
    employeeStore.reset();
    element = await fixture(html`<employee-list></employee-list>`);
    
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    expect(emptyState).to.exist;
    
    const title = emptyState.querySelector('h3');
    expect(title.textContent).to.include('Çalışan');
  });

  it('should handle search functionality', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'Ahmet';
    searchInput.dispatchEvent(new Event('input'));
    
    await element.updateComplete;
    
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows).to.have.length(1);
  });

  it('should handle pagination', async () => {
    for (let i = 0; i < 13; i++) {
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

    element = await fixture(html`<employee-list></employee-list>`);
    
    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
    
    const pageButtons = pagination.querySelectorAll('button');
    expect(pageButtons.length).to.be.greaterThan(1);
  });

  it('should handle edit button click', async () => {
    const editButton = element.shadowRoot.querySelector('.btn-edit');
    let navigateEvent = null;
    
    element.addEventListener('navigate', (e) => {
      navigateEvent = e;
    });
    
    editButton.click();
    
    expect(navigateEvent).to.exist;
    expect(navigateEvent.detail.path).to.include('/employees/edit/');
  });

  it('should handle delete button click', async () => {
    const deleteButton = element.shadowRoot.querySelector('.btn-delete');
    deleteButton.click();
    
    await element.updateComplete;
    
    const modal = element.shadowRoot.querySelector('.modal');
    expect(modal).to.exist;
  });

  it('should handle delete confirmation', async () => {
    const deleteButton = element.shadowRoot.querySelector('.btn-delete');
    deleteButton.click();
    
    await element.updateComplete;
    
    const confirmButton = element.shadowRoot.querySelector('.btn-confirm');
    const initialCount = employeeStore.getEmployees().length;
    
    confirmButton.click();
    
    await element.updateComplete;
    
    const finalCount = employeeStore.getEmployees().length;
    expect(finalCount).to.equal(initialCount - 1);
  });

  it('should handle delete cancellation', async () => {
    const deleteButton = element.shadowRoot.querySelector('.btn-delete');
    deleteButton.click();
    
    await element.updateComplete;
    
    const cancelButton = element.shadowRoot.querySelector('.btn-cancel');
    const initialCount = employeeStore.getEmployees().length;
    
    cancelButton.click();
    
    await element.updateComplete;
    
    const finalCount = employeeStore.getEmployees().length;
    expect(finalCount).to.equal(initialCount);
    
    const modal = element.shadowRoot.querySelector('.modal');
    expect(modal).to.not.exist;
  });

  it('should handle add button click', async () => {
    const addButton = element.shadowRoot.querySelector('.add-button');
    let navigateEvent = null;
    
    element.addEventListener('navigate', (e) => {
      navigateEvent = e;
    });
    
    addButton.click();
    
    expect(navigateEvent).to.exist;
    expect(navigateEvent.detail.path).to.equal('/employees/add');
  });

  it('should handle items per page change', async () => {
    const select = element.shadowRoot.querySelector('select');
    select.value = '5';
    select.dispatchEvent(new Event('change'));
    
    await element.updateComplete;
    
    expect(employeeStore.state.itemsPerPage).to.equal(5);
  });

  it('should format dates correctly', () => {
    const formattedDate = element.formatDate('2020-01-01');
    expect(formattedDate).to.be.a('string');
    expect(formattedDate).to.include('2020');
  });

  it('should handle language changes', async () => {
    employeeStore.setLanguage('en');
    await element.updateComplete;
    
    const title = element.shadowRoot.querySelector('.title');
    expect(title.textContent).to.include('Employee');
  });

  it('should be accessible', async () => {
    await expect(element).to.be.accessible();
  });

  it('should display view toggle buttons', () => {
    const viewToggle = element.shadowRoot.querySelector('.view-toggle');
    const listButton = element.shadowRoot.querySelector('.view-toggle button[title*="Liste"]');
    const gridButton = element.shadowRoot.querySelector('.view-toggle button[title*="Kart"]');
    
    expect(viewToggle).to.exist;
    expect(listButton).to.exist;
    expect(gridButton).to.exist;
  });

  it('should handle view mode toggle', async () => {
    const gridButton = element.shadowRoot.querySelector('.view-toggle button[title*="Kart"]');
    
    expect(element.viewMode).to.equal('list');
    
    gridButton.click();
    await element.updateComplete;
    
    expect(element.viewMode).to.equal('grid');
    
    const gridContainer = element.shadowRoot.querySelector('.grid-container');
    expect(gridContainer).to.exist;
  });

  it('should display employee cards in grid view', async () => {
    element.viewMode = 'grid';
    await element.updateComplete;
    
    const employeeCards = element.shadowRoot.querySelectorAll('.employee-card');
    expect(employeeCards.length).to.equal(2);
    
    const firstCard = employeeCards[0];
    const cardHeader = firstCard.querySelector('.card-header');
    const cardAvatar = firstCard.querySelector('.card-avatar');
    const cardBody = firstCard.querySelector('.card-body');
    const cardFooter = firstCard.querySelector('.card-footer');
    
    expect(cardHeader).to.exist;
    expect(cardAvatar).to.exist;
    expect(cardBody).to.exist;
    expect(cardFooter).to.exist;
  });

  it('should display date of birth column in table view', () => {
    const headers = element.shadowRoot.querySelectorAll('.employee-table th');
    const headerTexts = Array.from(headers).map(h => h.textContent.trim());
    
    expect(headerTexts).to.include('Doğum Tarihi');
  });

  it('should display date of birth data in table rows', () => {
    const firstRow = element.shadowRoot.querySelector('.employee-table tbody tr');
    const cells = firstRow.querySelectorAll('td');
    
    const dateOfBirthCell = cells[6];
    expect(dateOfBirthCell).to.exist;
    expect(dateOfBirthCell.textContent.trim().length).to.be.greaterThan(0);
  });

  it('should show active view toggle button', async () => {
    const listButton = element.shadowRoot.querySelector('.view-toggle button[title*="Liste"]');
    expect(listButton.classList.contains('active')).to.be.true;
    
    const gridButton = element.shadowRoot.querySelector('.view-toggle button[title*="Kart"]');
    gridButton.click();
    await element.updateComplete;
    
    expect(gridButton.classList.contains('active')).to.be.true;
    expect(listButton.classList.contains('active')).to.be.false;
  });

  it('should maintain pagination in both views', async () => {
    for (let i = 0; i < 15; i++) {
      employeeStore.addEmployee({
        firstName: `Test${i}`,
        lastName: `User${i}`,
        email: `test${i}@example.com`,
        phone: `555123456${i}`,
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior'
      });
    }
    
    await element.updateComplete;
    
    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
    
    element.viewMode = 'grid';
    await element.updateComplete;
    
    const paginationInGrid = element.shadowRoot.querySelector('.pagination');
    expect(paginationInGrid).to.exist;
  });

  it('should display employee initials in grid view cards', async () => {
    element.viewMode = 'grid';
    await element.updateComplete;
    
    const cardAvatars = element.shadowRoot.querySelectorAll('.card-avatar');
    expect(cardAvatars.length).to.equal(2);
    
    expect(cardAvatars[0].textContent.trim()).to.equal('AY');
    
    expect(cardAvatars[1].textContent.trim()).to.equal('MD');
  });
});

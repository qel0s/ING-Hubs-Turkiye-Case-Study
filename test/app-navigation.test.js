import { expect, fixture, html } from '@open-wc/testing';
import { employeeStore } from '../src/store/employee-store.js';
import '../src/components/app-navigation.js';

describe('App Navigation Component', () => {
  let element;

  beforeEach(async () => {
    employeeStore.reset();
    element = await fixture(html`<app-navigation></app-navigation>`);
    await element.updateComplete;
  });

  it('should render navigation bar', () => {
    const nav = element.shadowRoot.querySelector('nav');
    expect(nav).to.exist;
  });

  it('should display ING logo and brand text', () => {
    const logo = element.shadowRoot.querySelector('.nav-logo');
    const brandText = element.shadowRoot.querySelector('.nav-brand-text');
    
    expect(logo).to.exist;
    expect(brandText).to.exist;
    expect(brandText.textContent.trim()).to.equal('ING');
  });

  it('should display navigation menu items', () => {
    const navItems = element.shadowRoot.querySelectorAll('.nav-item');
    expect(navItems.length).to.be.greaterThan(0);
    
    const links = element.shadowRoot.querySelectorAll('.nav-link');
    const linkTexts = Array.from(links).map(link => link.textContent.trim());
    
    expect(linkTexts).to.include.members(['Çalışanlar', 'Çalışan Ekle']);
  });

  it('should display language selector', () => {
    const languageSelect = element.shadowRoot.querySelector('.language-select');
    const languageFlag = element.shadowRoot.querySelector('.language-flag');
    
    expect(languageSelect).to.exist;
    expect(languageFlag).to.exist;
  });

  it('should toggle mobile menu when hamburger is clicked', async () => {
    const mobileMenuToggle = element.shadowRoot.querySelector('.mobile-menu-toggle');
    const mobileMenu = element.shadowRoot.querySelector('.mobile-menu');
    
    expect(mobileMenuToggle).to.exist;
    expect(mobileMenu).to.exist;
    
    expect(element.mobileMenuOpen).to.be.false;
    expect(mobileMenu.classList.contains('open')).to.be.false;
    
    mobileMenuToggle.click();
    await element.updateComplete;
    
    expect(element.mobileMenuOpen).to.be.true;
    expect(mobileMenu.classList.contains('open')).to.be.true;
    
    mobileMenuToggle.click();
    await element.updateComplete;
    
    expect(element.mobileMenuOpen).to.be.false;
    expect(mobileMenu.classList.contains('open')).to.be.false;
  });

  it('should handle navigation clicks', async () => {
    let navigateEvent = null;
    
    element.addEventListener('navigate', (e) => {
      navigateEvent = e;
    });
    
    const employeesLink = element.shadowRoot.querySelector('a[href="/"]');
    employeesLink.click();
    
    expect(navigateEvent).to.exist;
    expect(navigateEvent.detail.path).to.equal('/');
  });

  it('should handle language change', async () => {
    const languageSelect = element.shadowRoot.querySelector('.language-select');
    
    languageSelect.value = 'en';
    languageSelect.dispatchEvent(new Event('change'));
    
    await element.updateComplete;
    
    expect(employeeStore.state.language).to.equal('en');
  });

  it('should close mobile menu when navigation link is clicked', async () => {
    const mobileMenuToggle = element.shadowRoot.querySelector('.mobile-menu-toggle');
    
    mobileMenuToggle.click();
    await element.updateComplete;
    expect(element.mobileMenuOpen).to.be.true;
    
    const mobileNavLink = element.shadowRoot.querySelector('.mobile-menu .nav-link');
    mobileNavLink.click();
    await element.updateComplete;
    
    expect(element.mobileMenuOpen).to.be.false;
  });

  it('should mark active navigation item', () => {
    element.currentPath = '/';
    element.requestUpdate();
    
    const homeLink = element.shadowRoot.querySelector('a[href="/"]');
    expect(homeLink.classList.contains('active')).to.be.true;
  });

  it('should update language display when language changes', async () => {
    employeeStore.setLanguage('en');
    await element.updateComplete;
    
    const languageFlag = element.shadowRoot.querySelector('.language-flag');
    expect(languageFlag.src).to.include('en.svg');
    
    employeeStore.setLanguage('tr');
    await element.updateComplete;
    
    expect(languageFlag.src).to.include('tr.svg');
  });
});

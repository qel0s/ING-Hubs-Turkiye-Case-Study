import { LitElement, html, css } from 'lit';
import { localizationService } from '../utils/localization.js';
import { employeeStore } from '../store/employee-store.js';

export class AppNavigation extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        background: white;
        color: #2c3e50;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-bottom: 1px solid #e9ecef;
        position: relative;
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .nav-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
      }

      .nav-left {
        display: flex;
        align-items: center;
      }

      .nav-right {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .nav-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: #000;
      }

      .nav-logo {
        height: 32px;
        width: auto;
        object-fit: contain;
      }

      .nav-brand-text {
        font-size: 1rem;
        font-weight: bold;
        margin: 0;
      }

      .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 2rem;
      }

      .nav-item {
        margin: 0;
      }

      .nav-link {
        color: #fc8c46;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        display: block;
        font-weight: 500;
        background: transparent;
      }

      .nav-link:hover {
        background: transparent;
        color: #fc8c46;
      }

      .nav-link.active {
        background: transparent;
        color: #fc8c46;
      }

      .nav-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .language-container {
        position: relative;
        display: inline-block;
      }

      .language-flag {
        width: 24px;
        height: auto;
        border-radius: 2px;
        pointer-events: none;
        position: relative;
        z-index: 1;
      }

      .language-select {
        position: absolute;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
      }

      .language-select:hover + .language-flag {
        opacity: 0.8;
      }

      .language-select:focus + .language-flag {
        opacity: 0.8;
        outline: 2px solid #fc8c46;
        outline-offset: 2px;
      }

      .mobile-menu-toggle {
        display: none;
        background: transparent;
        border: none;
        color: #2c3e50;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .mobile-menu-toggle:hover {
        background: #f8f9fa;
        color: #3498db;
      }

      .mobile-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
        border-top: none;
        z-index: 1000;
      }

      .mobile-menu.open {
        display: block;
      }

      .mobile-menu .nav-menu {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 0;
      }

      .mobile-menu .nav-link {
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
        color: #fc8c46;
        background: transparent;
      }

      .mobile-menu .nav-link:hover {
        background: transparent;
        color: #fc8c46;
      }

      .mobile-menu .nav-link:last-child {
        border-bottom: none;
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        .nav-content {
          height: auto;
          min-height: 60px;
        }

        .nav-right {
          gap: 1rem;
        }

        .nav-menu {
          display: none;
        }

        .mobile-menu-toggle {
          display: block;
        }

        .nav-controls {
          gap: 0.5rem;
        }

        .language-toggle {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }

        .nav-logo {
          height: 28px;
        }

        .nav-brand-text {
          font-size: 1.25rem;
        }
      }

      @media (min-width: 769px) {
        .mobile-menu {
          display: none !important;
        }
      }
    `;
  }

  static get properties() {
    return {
      currentPath: { type: String },
      language: { type: String },
      mobileMenuOpen: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.currentPath = '/';
    this.language = 'en';
    this.mobileMenuOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();

    this.language = employeeStore.state.language;

    this.unsubscribe = employeeStore.subscribe((state) => {
      this.language = state.language;
    });

    this.updateCurrentPath();

    window.addEventListener('popstate', () => {
      this.updateCurrentPath();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    window.removeEventListener('popstate', this.updateCurrentPath);
  }

  updateCurrentPath() {
    this.currentPath = window.location.pathname;
  }

  render() {
    return html`
      <nav class="nav-container">
        <div class="nav-content">
          <div class="nav-left">
            <a href="/" class="nav-brand" @click=${this.handleNavClick}>
              <img src="/src/assets/logo.png" alt="ING Logo" class="nav-logo">
              <span class="nav-brand-text">ING</span>
            </a>
          </div>
          
          <div class="nav-right">
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="/" class="nav-link ${this.isActive('/') ? 'active' : ''}" 
                   @click=${this.handleNavClick}>
                  ${this.t('nav.employees')}
                </a>
              </li>
              <li class="nav-item">
                <a href="/employees/add" class="nav-link ${this.isActive('/employees/add') ? 'active' : ''}" 
                   @click=${this.handleNavClick}>
                  ${this.t('nav.addEmployee')}
                </a>
              </li>
            </ul>

            <div class="nav-controls">
              <div class="language-container">
                <select class="language-select" @change=${this.handleLanguageChange} .value=${this.language}>
                  <option value="tr">TR</option>
                  <option value="en">EN</option>
                </select>
                <img src="/src/assets/${this.language}.svg" alt="${this.language} flag" class="language-flag">
              </div>
              
              <button class="mobile-menu-toggle" @click=${this.toggleMobileMenu}>
                ☰
              </button>
            </div>
          </div>
        </div>

        <div class="mobile-menu ${this.mobileMenuOpen ? 'open' : ''}">
          <ul class="nav-menu">
            <li class="nav-item">
              <a href="/" class="nav-link ${this.isActive('/') ? 'active' : ''}" 
                 @click=${this.handleNavClick}>
                ${this.t('nav.employees')}
              </a>
            </li>
            <li class="nav-item">
              <a href="/employees/add" class="nav-link ${this.isActive('/employees/add') ? 'active' : ''}" 
                 @click=${this.handleNavClick}>
                ${this.t('nav.addEmployee')}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    `;
  }

  handleNavClick(event) {
    event.preventDefault();

    let target = event.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }

    const href = target ? target.getAttribute('href') : '/';

    this.mobileMenuOpen = false;

    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: href },
      bubbles: true,
      composed: true
    }));
  }

  handleLanguageChange(event) {
    const newLanguage = event.target.value;
    employeeStore.setLanguage(newLanguage);
  }

  toggleLanguage() {
    const newLanguage = this.language === 'tr' ? 'en' : 'tr';
    employeeStore.setLanguage(newLanguage);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  isActive(path) {
    if (path === '/') {
      return this.currentPath === '/' || this.currentPath === '/employees';
    }
    return this.currentPath === path ||
      (path !== '/' && this.currentPath.startsWith(path));
  }

  t(key, params = {}) {
    return localizationService.t(key, params);
  }
}

customElements.define('app-navigation', AppNavigation);

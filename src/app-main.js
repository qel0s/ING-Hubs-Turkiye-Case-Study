import { LitElement, html, css } from 'lit';
import { appRouter } from './router/app-router.js';
import { employeeStore } from './store/employee-store.js';
import { localizationService } from './utils/localization.js';

export class AppMain extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 100vh;
        background: #f8f9fa;
      }

      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .app-header {
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .app-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .router-outlet {
        flex: 1;
      }

      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .error-boundary {
        padding: 2rem;
        text-align: center;
        color: #e74c3c;
      }

      .error-boundary h2 {
        margin-bottom: 1rem;
        color: #fc8c46;
      }

      .error-boundary p {
        margin-bottom: 2rem;
      }

      .error-boundary button {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }

      .error-boundary button:hover {
        background: #2980b9;
      }
    `;
  }

  static get properties() {
    return {
      loading: { type: Boolean },
      error: { type: String },
      language: { type: String }
    };
  }

  constructor() {
    super();
    this.loading = true;
    this.error = null;
    this.language = 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.language = localizationService.getCurrentLanguage();
    
    this.unsubscribe = employeeStore.subscribe((state) => {
      this.language = state.language;
    });
    
    this.addEventListener('navigate', this.handleNavigation);
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  async firstUpdated() {
    await this.initializeRouter();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    this.removeEventListener('navigate', this.handleNavigation);
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  async initializeRouter() {
    try {
      this.loading = true;
      this.requestUpdate();
      
      const outlet = this.shadowRoot.querySelector('.router-outlet');
      
      if (!outlet) {
        throw new Error('Router outlet not found');
      }

      await appRouter.init(outlet);
      
      if (employeeStore.getEmployees().length === 0) {
        await this.loadDemoData();
      }
      
      this.loading = false;
      this.requestUpdate();
      
    } catch (error) {
      console.error('Router initialization error:', error);
      this.error = this.t('appMain.initError');
      this.loading = false;
      this.requestUpdate();
    }
  }

  async loadDemoData() {
    try {
      const { loadDemoData } = await import('./utils/demo-data.js');
      await loadDemoData();
    } catch (error) {
      console.warn('Demo data could not be loaded:', error);
    }
  }

  handleNavigation(event) {
    const { path } = event.detail;
    appRouter.navigate(path);
  }

  handleGlobalError(event) {
    console.error('Global error:', event.error);
    this.error = this.t('appMain.unexpectedError');
  }

  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    this.error = this.t('appMain.unexpectedError');
  }

  handleRetry() {
    this.error = null;
    this.loading = true;
    this.initializeRouter();
  }

  t(key, params = {}) {
    return localizationService.t(key, params);
  }

  render() {
    if (this.error) {
      return html`
        <div class="error-boundary">
          <h2>${this.t('appMain.errorTitle')}</h2>
          <p>${this.error}</p>
          <button @click=${this.handleRetry}>${this.t('appMain.retryButton')}</button>
        </div>
      `;
    }

    return html`
      <div class="app-container">
        <header class="app-header">
          <app-navigation></app-navigation>
        </header>
        
        <main class="app-content">
          <div class="router-outlet"></div>
        </main>
        
        ${this.loading ? html`
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('app-main', AppMain);

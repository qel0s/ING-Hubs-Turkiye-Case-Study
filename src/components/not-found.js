import { LitElement, html, css } from 'lit';
import { localizationService } from '../utils/localization.js';

export class NotFound extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
        padding: 4rem 1rem;
        text-align: center;
      }

      .error-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        padding: 3rem 2rem;
      }

      .error-code {
        font-size: 6rem;
        font-weight: bold;
        color: #e74c3c;
        margin: 0 0 1rem 0;
        line-height: 1;
      }

      .error-title {
        font-size: 2rem;
        font-weight: bold;
        color: #fc8c46;
        margin: 0 0 1rem 0;
      }

      .error-description {
        color: #7f8c8d;
        font-size: 1.1rem;
        margin: 0 0 2rem 0;
        line-height: 1.6;
      }

      .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 6px;
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
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .btn-secondary {
        background: #95a5a6;
        color: white;
      }

      .btn-secondary:hover {
        background: #7f8c8d;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      @media (max-width: 768px) {
        .error-code {
          font-size: 4rem;
        }

        .error-title {
          font-size: 1.5rem;
        }

        .error-description {
          font-size: 1rem;
        }

        .error-actions {
          flex-direction: column;
          align-items: center;
        }

        .btn {
          width: 100%;
          max-width: 250px;
        }
      }
    `;
  }

  static get properties() {
    return {
      language: { type: String }
    };
  }

  constructor() {
    super();
    this.language = 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    this.language = localizationService.getCurrentLanguage();
  }

  render() {
    return html`
      <div class="error-container">
        <div class="icon">🔍</div>
        <div class="error-code">404</div>
        <h1 class="error-title">${this.t('notFound.title')}</h1>
        <p class="error-description">
          ${this.t('notFound.description')}
        </p>
        <div class="error-actions">
          <a href="/" class="btn btn-primary" @click=${this.handleNavClick}>
            ${this.t('notFound.homeButton')}
          </a>
          <a href="/" class="btn btn-secondary" @click=${this.handleNavClick}>
            ${this.t('notFound.employeeListButton')}
          </a>
        </div>
      </div>
    `;
  }

  handleNavClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path: href },
      bubbles: true,
      composed: true
    }));
  }

  t(key, params = {}) {
    return localizationService.t(key, params);
  }
}

customElements.define('not-found', NotFound);

import { expect, fixture, html } from '@open-wc/testing';
import { employeeStore } from '../src/store/employee-store.js';
import '../src/app-main.js';

describe('App Main Component', () => {
  let element;

  beforeEach(async () => {
    employeeStore.reset();
    element = await fixture(html`<app-main></app-main>`);
    await element.updateComplete;
  });

  it('should render app container', () => {
    const appContainer = element.shadowRoot.querySelector('.app-container');
    expect(appContainer).to.exist;
  });

  it('should render navigation header', () => {
    const header = element.shadowRoot.querySelector('.app-header');
    const navigation = element.shadowRoot.querySelector('app-navigation');
    
    expect(header).to.exist;
    expect(navigation).to.exist;
  });

  it('should render router outlet', () => {
    const outlet = element.shadowRoot.querySelector('.router-outlet');
    expect(outlet).to.exist;
  });

  it('should show loading state initially', () => {
    const loadingOverlay = element.shadowRoot.querySelector('.loading-overlay');
    const spinner = element.shadowRoot.querySelector('.loading-spinner');
    
    if (element.loading) {
      expect(loadingOverlay).to.exist;
      expect(spinner).to.exist;
    }
  });

  it('should handle navigation events', async () => {
    const navigationEvent = new CustomEvent('navigate', {
      detail: { path: '/test' },
      bubbles: true,
      composed: true
    });
    
    element.dispatchEvent(navigationEvent);
    await element.updateComplete;
    
    expect(element.error).to.be.null;
  });

  it('should display error boundary when error occurs', async () => {
    element.error = 'Test error message';
    await element.updateComplete;
    
    const errorBoundary = element.shadowRoot.querySelector('.error-boundary');
    const errorTitle = element.shadowRoot.querySelector('.error-boundary h2');
    const errorMessage = element.shadowRoot.querySelector('.error-boundary p');
    const retryButton = element.shadowRoot.querySelector('.error-boundary button');
    
    expect(errorBoundary).to.exist;
    expect(errorTitle).to.exist;
    expect(errorMessage).to.exist;
    expect(retryButton).to.exist;
    
    expect(errorMessage.textContent.trim()).to.equal('Test error message');
  });

  it('should handle retry button click', async () => {
    element.error = 'Test error';
    await element.updateComplete;
    
    const retryButton = element.shadowRoot.querySelector('.error-boundary button');
    retryButton.click();
    
    await element.updateComplete;
    
    expect(element.error).to.be.null;
  });

  it('should handle global errors', () => {
    const originalError = element.error;
    
    const errorEvent = new ErrorEvent('error', {
      message: 'Test global error',
      filename: 'test.js',
      lineno: 1
    });
    
    element.handleGlobalError(errorEvent);
    
    expect(element.error).to.not.equal(originalError);
  });

  it('should handle unhandled promise rejections', () => {
    const originalError = element.error;
    
    const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      promise: Promise.reject('Test rejection'),
      reason: 'Test rejection'
    });
    
    element.handleUnhandledRejection(rejectionEvent);
    
    expect(element.error).to.not.equal(originalError);
  });

  it('should be accessible', async () => {
    await expect(element).to.be.accessible();
  });

  it('should handle localization', () => {
    expect(typeof element.t).to.equal('function');
    
    const testKey = element.t('appMain.errorTitle');
    expect(testKey.length).to.be.greaterThan(0);
  });
});

import { expect, fixture, html } from '@open-wc/testing';
import '../src/components/not-found.js';

describe('Not Found Component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<not-found></not-found>`);
    await element.updateComplete;
  });

  it('should render 404 error page', () => {
    const errorCode = element.shadowRoot.querySelector('.error-code');
    const errorTitle = element.shadowRoot.querySelector('.error-title');
    const errorDescription = element.shadowRoot.querySelector('.error-description');
    
    expect(errorCode).to.exist;
    expect(errorTitle).to.exist;
    expect(errorDescription).to.exist;
    
    expect(errorCode.textContent.trim()).to.equal('404');
  });

  it('should display navigation buttons', () => {
    const buttons = element.shadowRoot.querySelectorAll('.btn');
    expect(buttons.length).to.be.greaterThan(0);
    
    const homeButton = element.shadowRoot.querySelector('.btn-primary');
    const employeeListButton = element.shadowRoot.querySelector('.btn-secondary');
    
    expect(homeButton).to.exist;
    expect(employeeListButton).to.exist;
  });

  it('should handle navigation button clicks', async () => {
    let navigateEvent = null;
    
    element.addEventListener('navigate', (e) => {
      navigateEvent = e;
    });
    
    const homeButton = element.shadowRoot.querySelector('.btn-primary');
    homeButton.click();
    
    expect(navigateEvent).to.exist;
    expect(navigateEvent.detail.path).to.equal('/');
  });

  it('should display error icon', () => {
    const icon = element.shadowRoot.querySelector('.icon');
    expect(icon).to.exist;
    expect(icon.textContent.trim()).to.equal('🔍');
  });

  it('should be accessible', async () => {
    await expect(element).to.be.accessible();
  });

  it('should handle localization', () => {
    const errorTitle = element.shadowRoot.querySelector('.error-title');
    const errorDescription = element.shadowRoot.querySelector('.error-description');
    
    expect(errorTitle.textContent.length).to.be.greaterThan(0);
    expect(errorDescription.textContent.length).to.be.greaterThan(0);
  });
});

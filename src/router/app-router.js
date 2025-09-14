import { employeeStore } from '../store/employee-store.js';
import { localizationService } from '../utils/localization.js';

export class AppRouter {
  constructor() {
    this.outlet = null;
    this.currentPath = '/';
    this.routes = {
      '/': 'employee-list',
      '/employees/add': 'employee-form',
      '/employees/edit': 'employee-form'
    };
  }

  init(outlet) {
    this.outlet = outlet;
    
    this.handleRoute();
    
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    employeeStore.subscribe((state) => {
      this.updateLanguage(state.language);
    });
  }

  async handleRoute() {
    const path = window.location.pathname;
    this.currentPath = path;
    
    let componentName = this.routes[path];
    
    if (path.startsWith('/employees/edit/')) {
      const employeeId = path.split('/')[3];
      const employee = employeeStore.getEmployee(employeeId);
      
      if (employee) {
        employeeStore.setCurrentEmployee(employee);
        componentName = 'employee-form';
      } else {
        componentName = 'not-found';
      }
    }
    
    if (!componentName) {
      componentName = 'not-found';
    }
    
    await this.loadComponent(componentName);
  }

  async loadComponent(componentName) {
    try {
      if (this.outlet) {
        this.outlet.innerHTML = '';
      }
      
      switch (componentName) {
        case 'employee-list':
          await import('../components/employee-list.js');
          if (this.outlet) {
            const element = document.createElement('employee-list');
            this.outlet.appendChild(element);
          }
          break;
        case 'employee-form':
          await import('../components/employee-form.js');
          if (this.outlet) {
            const element = document.createElement('employee-form');
            this.outlet.appendChild(element);
          }
          break;
        case 'not-found':
          await import('../components/not-found.js');
          if (this.outlet) {
            const element = document.createElement('not-found');
            this.outlet.appendChild(element);
          }
          break;
        default:
          console.warn(`Unknown component: ${componentName}`);
      }
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
    }
  }

  navigate(path) {
    if (path !== this.currentPath) {
      window.history.pushState({}, '', path);
      this.handleRoute();
    }
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate('/');
    }
  }

  updateLanguage(language) {
    localizationService.setLanguage(language);
  }

  getCurrentRoute() {
    return this.currentPath;
  }

  getRouteParams() {
    const path = this.currentPath;
    if (path.startsWith('/employees/edit/')) {
      const employeeId = path.split('/')[3];
      return { id: employeeId };
    }
    return {};
  }

  getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  }
}

export const appRouter = new AppRouter();

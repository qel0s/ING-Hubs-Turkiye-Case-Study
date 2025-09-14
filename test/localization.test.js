import { expect } from '@open-wc/testing';
import { localizationService, translations } from '../src/utils/localization.js';

describe('Localization Service', () => {
  beforeEach(() => {
    localizationService.setLanguage('en');
  });

  describe('Language Detection', () => {
    it('should detect Turkish language from HTML lang attribute', () => {
      document.documentElement.lang = 'tr';
      const service = new (localizationService.constructor)();
      expect(service.detectLanguage()).to.equal('tr');
    });

    it('should detect English language from HTML lang attribute', () => {
      document.documentElement.lang = 'en';
      const service = new (localizationService.constructor)();
      expect(service.detectLanguage()).to.equal('en');
    });

    it('should default to English for unknown languages', () => {
      document.documentElement.lang = 'unknown';
      const service = new (localizationService.constructor)();
      expect(service.detectLanguage()).to.equal('en');
    });
  });

  describe('Language Switching', () => {
    it('should switch to Turkish language', () => {
      localizationService.setLanguage('tr');
      expect(localizationService.getCurrentLanguage()).to.equal('tr');
      expect(document.documentElement.lang).to.equal('tr');
    });

    it('should switch to English language', () => {
      localizationService.setLanguage('en');
      expect(localizationService.getCurrentLanguage()).to.equal('en');
      expect(document.documentElement.lang).to.equal('en');
    });

    it('should not switch to unsupported language', () => {
      const originalLang = localizationService.getCurrentLanguage();
      localizationService.setLanguage('unsupported');
      expect(localizationService.getCurrentLanguage()).to.equal(originalLang);
    });
  });

  describe('Translation', () => {
    it('should translate simple keys', () => {
      localizationService.setLanguage('tr');
      expect(localizationService.t('nav.home')).to.equal('Ana Sayfa');
      
      localizationService.setLanguage('en');
      expect(localizationService.t('nav.home')).to.equal('Home');
    });

    it('should translate nested keys', () => {
      localizationService.setLanguage('tr');
      expect(localizationService.t('employeeForm.firstName')).to.equal('Ad');
      
      localizationService.setLanguage('en');
      expect(localizationService.t('employeeForm.firstName')).to.equal('First Name');
    });

    it('should handle missing keys gracefully', () => {
      const result = localizationService.t('nonexistent.key');
      expect(result).to.equal('nonexistent.key');
    });

    it('should handle parameter replacement', () => {
      expect(() => localizationService.t('test.key', { param: 'value' })).to.not.throw();
    });

    it('should return all translations for current language', () => {
      localizationService.setLanguage('tr');
      const allTranslations = localizationService.getAll();
      
      expect(allTranslations).to.have.property('nav');
      expect(allTranslations).to.have.property('employeeList');
      expect(allTranslations).to.have.property('employeeForm');
      expect(allTranslations.nav).to.have.property('home');
    });
  });

  describe('Translation Content', () => {
    it('should have all required Turkish translations', () => {
      const tr = translations.tr;
      
      expect(tr.nav).to.have.property('home');
      expect(tr.nav).to.have.property('addEmployee');
      expect(tr.nav).to.have.property('employeeList');
      
      expect(tr.employeeList).to.have.property('title');
      expect(tr.employeeList).to.have.property('searchPlaceholder');
      expect(tr.employeeList).to.have.property('noEmployees');
      expect(tr.employeeList).to.have.property('edit');
      expect(tr.employeeList).to.have.property('delete');
      
      expect(tr.employeeForm).to.have.property('addTitle');
      expect(tr.employeeForm).to.have.property('editTitle');
      expect(tr.employeeForm).to.have.property('firstName');
      expect(tr.employeeForm).to.have.property('lastName');
      expect(tr.employeeForm).to.have.property('email');
      expect(tr.employeeForm).to.have.property('phone');
      expect(tr.employeeForm).to.have.property('dateOfBirth');
      expect(tr.employeeForm).to.have.property('dateOfEmployment');
      expect(tr.employeeForm).to.have.property('department');
      expect(tr.employeeForm).to.have.property('position');
      
      expect(tr.departments).to.have.property('Analytics');
      expect(tr.departments).to.have.property('Tech');
      
      expect(tr.positions).to.have.property('Junior');
      expect(tr.positions).to.have.property('Medior');
      expect(tr.positions).to.have.property('Senior');
    });

    it('should have all required English translations', () => {
      const en = translations.en;
      
      expect(en.nav).to.have.property('home');
      expect(en.nav).to.have.property('addEmployee');
      expect(en.nav).to.have.property('employeeList');
      
      expect(en.employeeList).to.have.property('title');
      expect(en.employeeList).to.have.property('searchPlaceholder');
      expect(en.employeeList).to.have.property('noEmployees');
      expect(en.employeeList).to.have.property('edit');
      expect(en.employeeList).to.have.property('delete');
      
      expect(en.employeeForm).to.have.property('addTitle');
      expect(en.employeeForm).to.have.property('editTitle');
      expect(en.employeeForm).to.have.property('firstName');
      expect(en.employeeForm).to.have.property('lastName');
      expect(en.employeeForm).to.have.property('email');
      expect(en.employeeForm).to.have.property('phone');
      expect(en.employeeForm).to.have.property('dateOfBirth');
      expect(en.employeeForm).to.have.property('dateOfEmployment');
      expect(en.employeeForm).to.have.property('department');
      expect(en.employeeForm).to.have.property('position');
      
      expect(en.departments).to.have.property('Analytics');
      expect(en.departments).to.have.property('Tech');
      
      expect(en.positions).to.have.property('Junior');
      expect(en.positions).to.have.property('Medior');
      expect(en.positions).to.have.property('Senior');
    });

    it('should have consistent structure between languages', () => {
      const tr = translations.tr;
      const en = translations.en;
      
      expect(Object.keys(tr)).to.deep.equal(Object.keys(en));
      
      expect(Object.keys(tr.nav)).to.deep.equal(Object.keys(en.nav));
      
      expect(Object.keys(tr.employeeList)).to.deep.equal(Object.keys(en.employeeList));
      
      expect(Object.keys(tr.employeeForm)).to.deep.equal(Object.keys(en.employeeForm));
      
      expect(Object.keys(tr.departments)).to.deep.equal(Object.keys(en.departments));
      
      expect(Object.keys(tr.positions)).to.deep.equal(Object.keys(en.positions));
    });
  });

  describe('Singleton Behavior', () => {
    it('should maintain state across multiple instances', () => {
      const service1 = localizationService;
      const service2 = localizationService;
      
      expect(service1).to.equal(service2);
      
      service1.setLanguage('tr');
      expect(service2.getCurrentLanguage()).to.equal('tr');
    });
  });
});

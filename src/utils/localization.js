export const translations = {
  tr: {
    nav: {
      home: 'Ana Sayfa',
      addEmployee: 'Çalışan Ekle',
      employeeList: 'Çalışan Listesi',
      employees: 'Çalışanlar'
    },
    
    employeeList: {
      title: 'Çalışan Listesi',
      homeTitle: 'Ana Sayfa - Çalışan Listesi',
      searchPlaceholder: 'Çalışan ara...',
      noEmployees: 'Henüz çalışan bulunmuyor',
      addFirstEmployee: 'İlk çalışanı eklemek için tıklayın',
      itemsPerPage: 'Sayfa başına:',
      page: 'Sayfa',
      of: 'toplam',
      edit: 'Düzenle',
      delete: 'Sil',
      confirmDelete: 'Bu çalışanı silmek istediğinizden emin misiniz?',
      cancel: 'İptal',
      confirm: 'Evet',
      actions: 'İşlemler'
    },
    
    employeeForm: {
      addTitle: 'Yeni Çalışan Ekle',
      editTitle: 'Çalışan Düzenle',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'Email',
      phone: 'Telefon',
      dateOfBirth: 'Doğum Tarihi',
      dateOfEmployment: 'İşe Giriş Tarihi',
      department: 'Departman',
      position: 'Pozisyon',
      save: 'Kaydet',
      cancel: 'İptal',
      update: 'Güncelle',
      selectDepartment: 'Departman seçin',
      selectPosition: 'Pozisyon seçin',
      required: 'Bu alan zorunludur',
      invalidEmail: 'Geçerli bir email adresi giriniz',
      invalidPhone: 'Geçerli bir telefon numarası giriniz (5XXXXXXXXX)',
      invalidDate: 'Geçerli bir tarih giriniz',
      emailExists: 'Bu email adresi zaten kullanılıyor',
      successAdd: 'Çalışan başarıyla eklendi',
      successUpdate: 'Çalışan başarıyla güncellendi',
      errorAdd: 'Çalışan eklenirken hata oluştu',
      errorUpdate: 'Çalışan güncellenirken hata oluştu',
      addSubtitle: 'Yeni çalışan bilgilerini girin',
      editSubtitle: 'Mevcut çalışan bilgilerini güncelleyin',
      phonePlaceholder: '5XXXXXXXXX'
    },
    
    departments: {
      Analytics: 'Analytics',
      Tech: 'Teknoloji'
    },
    
    positions: {
      Junior: 'Junior',
      Medior: 'Medior',
      Senior: 'Senior'
    },
    
    notFound: {
      title: 'Sayfa Bulunamadı',
      description: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen URL\'yi kontrol edin veya ana sayfaya dönün.',
      homeButton: 'Ana Sayfa',
      employeeListButton: 'Çalışan Listesi'
    },
    
    appMain: {
      initError: 'Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.',
      unexpectedError: 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.',
      errorTitle: 'Hata Oluştu',
      retryButton: 'Tekrar Dene'
    },
    
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      warning: 'Uyarı',
      info: 'Bilgi'
    }
  },
  
  en: {
    nav: {
      home: 'Home',
      addEmployee: 'Add Employee',
      employeeList: 'Employee List',
      employees: 'Employees'
    },
    
    employeeList: {
      title: 'Employee List',
      homeTitle: 'Home - Employee List',
      searchPlaceholder: 'Search employees...',
      noEmployees: 'No employees found',
      addFirstEmployee: 'Click to add first employee',
      itemsPerPage: 'Items per page:',
      page: 'Page',
      of: 'of',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this employee?',
      cancel: 'Cancel',
      confirm: 'Yes, Delete',
      actions: 'Actions'
    },
    
    employeeForm: {
      addTitle: 'Add New Employee',
      editTitle: 'Edit Employee',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      dateOfEmployment: 'Date of Employment',
      department: 'Department',
      position: 'Position',
      save: 'Save',
      cancel: 'Cancel',
      update: 'Update',
      selectDepartment: 'Select Department',
      selectPosition: 'Select Position',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number (5XXXXXXXXX)',
      invalidDate: 'Please enter a valid date',
      emailExists: 'This email address is already in use',
      successAdd: 'Employee added successfully',
      successUpdate: 'Employee updated successfully',
      errorAdd: 'Error adding employee',
      errorUpdate: 'Error updating employee',
      addSubtitle: 'Enter new employee information',
      editSubtitle: 'Update existing employee information',
      phonePlaceholder: '5XXXXXXXXX'
    },
    
    departments: {
      Analytics: 'Analytics',
      Tech: 'Tech'
    },
    
    positions: {
      Junior: 'Junior',
      Medior: 'Medior',
      Senior: 'Senior'
    },
    
    notFound: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or may have been moved. Please check the URL or return to the home page.',
      homeButton: 'Home',
      employeeListButton: 'Employee List'
    },
    
    appMain: {
      initError: 'An error occurred while starting the application. Please refresh the page.',
      unexpectedError: 'An unexpected error occurred. Please refresh the page.',
      errorTitle: 'Error Occurred',
      retryButton: 'Try Again'
    },
    
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info'
    }
  }
};

export class LocalizationService {
  constructor() {
    this.currentLanguage = this.detectLanguage();
  }

  detectLanguage() {
    try {
        const storedLanguage = localStorage.getItem('employee-management-language');
      if (storedLanguage && (storedLanguage === 'tr' || storedLanguage === 'en')) {
        return storedLanguage;
      }
    } catch (error) {
      console.error('Error loading language from storage:', error);
    }
    
    const htmlLang = document.documentElement.lang || 'en';
    return htmlLang.startsWith('tr') ? 'tr' : 'en';
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      document.documentElement.lang = lang === 'tr' ? 'tr' : 'en';
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let translation = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    if (typeof translation === 'string' && params) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return translation;
  }

  getAll() {
    return translations[this.currentLanguage];
  }
}

export const localizationService = new LocalizationService();

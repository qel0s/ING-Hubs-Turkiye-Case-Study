export const demoEmployees = [
  {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@company.com',
    phone: '5551234567',
    dateOfBirth: '1985-03-15',
    dateOfEmployment: '2020-01-15',
    department: 'Tech',
    position: 'Senior'
  },
  {
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@company.com',
    phone: '5552345678',
    dateOfBirth: '1990-07-22',
    dateOfEmployment: '2019-06-01',
    department: 'Analytics',
    position: 'Medior'
  },
  {
    firstName: 'Ayşe',
    lastName: 'Kaya',
    email: 'ayse.kaya@company.com',
    phone: '5553456789',
    dateOfBirth: '1992-11-08',
    dateOfEmployment: '2021-03-10',
    department: 'Tech',
    position: 'Junior'
  },
  {
    firstName: 'Fatma',
    lastName: 'Özkan',
    email: 'fatma.ozkan@company.com',
    phone: '5554567890',
    dateOfBirth: '1988-05-12',
    dateOfEmployment: '2018-09-01',
    department: 'Analytics',
    position: 'Senior'
  },
  {
    firstName: 'Ali',
    lastName: 'Çelik',
    email: 'ali.celik@company.com',
    phone: '5555678901',
    dateOfBirth: '1995-12-03',
    dateOfEmployment: '2022-01-20',
    department: 'Tech',
    position: 'Junior'
  },
  {
    firstName: 'Zeynep',
    lastName: 'Arslan',
    email: 'zeynep.arslan@company.com',
    phone: '5556789012',
    dateOfBirth: '1987-08-18',
    dateOfEmployment: '2017-11-15',
    department: 'Analytics',
    position: 'Medior'
  },
  {
    firstName: 'Mustafa',
    lastName: 'Koç',
    email: 'mustafa.koc@company.com',
    phone: '5557890123',
    dateOfBirth: '1983-01-25',
    dateOfEmployment: '2016-04-01',
    department: 'Tech',
    position: 'Senior'
  },
  {
    firstName: 'Elif',
    lastName: 'Şahin',
    email: 'elif.sahin@company.com',
    phone: '5558901234',
    dateOfBirth: '1991-09-14',
    dateOfEmployment: '2020-08-01',
    department: 'Analytics',
    position: 'Medior'
  },
  {
    firstName: 'Emre',
    lastName: 'Yıldız',
    email: 'emre.yildiz@company.com',
    phone: '5559012345',
    dateOfBirth: '1993-04-30',
    dateOfEmployment: '2021-10-01',
    department: 'Tech',
    position: 'Junior'
  },
  {
    firstName: 'Selin',
    lastName: 'Aydın',
    email: 'selin.aydin@company.com',
    phone: '5550123456',
    dateOfBirth: '1989-06-07',
    dateOfEmployment: '2019-02-01',
    department: 'Analytics',
    position: 'Senior'
  }
];

export async function loadDemoData() {
  try {
    const { employeeStore } = await import('./store/employee-store.js');
    
    employeeStore.reset();
    
    demoEmployees.forEach(employee => {
      employeeStore.addEmployee(employee);
    });
    
  } catch (error) {
    console.error('Error loading demo data:', error);
  }
}

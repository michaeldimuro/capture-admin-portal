import { create } from 'zustand';

export interface Company {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  patientsCount: number;
  activeOrders: number;
  status: 'active' | 'inactive';
}

interface CompanyStore {
  companies: Company[];
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'HealthCare Plus',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=100&h=100',
    email: 'contact@healthcareplus.com',
    phone: '(555) 123-4567',
    website: 'www.healthcareplus.com',
    address: '123 Medical Center Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    patientsCount: 1234,
    activeOrders: 56,
    status: 'active',
  },
  {
    id: '2',
    name: 'MediCorp',
    logo: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=100&h=100',
    email: 'info@medicorp.com',
    phone: '(555) 234-5678',
    website: 'www.medicorp.com',
    address: '456 Health Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    patientsCount: 890,
    activeOrders: 34,
    status: 'active',
  },
];

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: mockCompanies,
  addCompany: (company) =>
    set((state) => ({ companies: [...state.companies, company] })),
  updateCompany: (id, updates) =>
    set((state) => ({
      companies: state.companies.map((company) =>
        company.id === id ? { ...company, ...updates } : company
      ),
    })),
  deleteCompany: (id) =>
    set((state) => ({
      companies: state.companies.filter((company) => company.id !== id),
    })),
}));
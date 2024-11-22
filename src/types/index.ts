export type Role = 'SUPERADMIN' | 'COMPANY_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  stripeApiKey?: string;
  supportedMedications: SupportedMedication[];
}

export interface Medication {
  id: string;
  name: string;
  image: string;
  description: string;
  dosages: Dosage[];
  questionnaireId: string;
}

export interface Dosage {
  id: string;
  medicationId: string;
  strength: string;
  unit: string;
}

export interface SupportedMedication {
  id: string;
  companyId: string;
  medicationId: string;
  dosageId: string;
  price: number;
  magicLink: string;
}

export interface Patient {
  id: string;
  companyId: string;
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface Order {
  id: string;
  companyId: string;
  patientId: string;
  medicationId: string;
  dosageId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  companyId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}
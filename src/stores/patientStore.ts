import { create } from "zustand";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lastVisit: string;
  companyId: number;
}

interface PatientStore {
  patients: Patient[];
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    lastVisit: "2024-03-10",
    companyId: 1
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1990-03-22",
    address: "456 Oak Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    lastVisit: "2024-03-12",
    companyId: 1
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1978-11-30",
    address: "789 Pine St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    lastVisit: "2024-03-15",
    companyId: 2
  }
];

export const usePatientStore = create<PatientStore>(() => ({
  patients: mockPatients
}));
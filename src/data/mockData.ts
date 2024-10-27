// Mock data for orders
export const mockOrders = [
  {
    id: 'ORD-001',
    patientName: 'John Doe',
    patientId: 'PAT-001',
    medication: 'Lisinopril',
    dosage: '10mg',
    quantity: 30,
    status: 'processing',
    orderDate: '2024-03-15',
    total: 49.99,
    shippingAddress: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    trackingNumber: 'TRK123456789',
    timeline: [
      { date: '2024-03-15T10:00:00', status: 'Order Placed', description: 'Order received and confirmed' },
      { date: '2024-03-15T14:30:00', status: 'Processing', description: 'Order is being processed' }
    ]
  },
  {
    id: 'ORD-002',
    patientName: 'Jane Smith',
    patientId: 'PAT-002',
    medication: 'Metformin',
    dosage: '500mg',
    quantity: 60,
    status: 'shipped',
    orderDate: '2024-03-14',
    total: 79.99,
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501'
    },
    trackingNumber: 'TRK987654321',
    timeline: [
      { date: '2024-03-14T09:15:00', status: 'Order Placed', description: 'Order received and confirmed' },
      { date: '2024-03-14T11:30:00', status: 'Processing', description: 'Order is being processed' },
      { date: '2024-03-15T08:45:00', status: 'Shipped', description: 'Order has been shipped' }
    ]
  }
];

// Mock data for patients
export const mockPatients = [
  {
    id: 'PAT-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    medications: ['Lisinopril 10mg'],
    allergies: ['Penicillin'],
    conditions: ['Hypertension']
  },
  {
    id: 'PAT-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    dateOfBirth: '1990-03-22',
    address: {
      street: '456 Oak Ave',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501'
    },
    medications: ['Metformin 500mg'],
    allergies: ['None'],
    conditions: ['Type 2 Diabetes']
  }
];
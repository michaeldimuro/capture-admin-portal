import { useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AddMedicationModal } from '../components/medications/AddMedicationModal';
import type { Medication } from '../types';

// Mock data for medications catalog
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Ibuprofen',
    description: 'Pain relief medication',
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
    dosages: [
      { id: 'd1', medicationId: '1', strength: '200', unit: 'mg' },
      { id: 'd2', medicationId: '1', strength: '400', unit: 'mg' },
      { id: 'd3', medicationId: '1', strength: '600', unit: 'mg' },
    ],
  },
  {
    id: '2',
    name: 'Amoxicillin',
    description: 'Antibiotic medication',
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
    dosages: [
      { id: 'd4', medicationId: '2', strength: '250', unit: 'mg' },
      { id: 'd5', medicationId: '2', strength: '500', unit: 'mg' },
    ],
  },
];

export function Medications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState(mockMedications);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const handleAddMedication = (data: any) => {
    const newMedication: Medication = {
      id: `med-${Date.now()}`,
      name: data.name,
      description: data.description,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
      dosages: data.dosages.map((d: any, index: number) => ({
        id: `dos-${Date.now()}-${index}`,
        medicationId: `med-${Date.now()}`,
        strength: d.strength,
        unit: d.unit,
      })),
    };

    setMedications([...medications, newMedication]);
    setIsAddModalOpen(false);
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setIsAddModalOpen(true);
  };

  const handleDeleteMedication = (medicationId: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      setMedications(medications.filter(m => m.id !== medicationId));
    }
  };

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medication.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medications</h2>
          <p className="mt-2 text-gray-600">Manage platform medication catalog</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Available Dosages</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedications.map((medication) => (
                  <tr key={medication.id} className="group hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium">{medication.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{medication.description}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {medication.dosages.map((dosage) => (
                          <span
                            key={dosage.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {dosage.strength}{dosage.unit}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMedication(medication)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMedication(medication.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
    <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMedication(null);
        }}
        onSubmit={handleAddMedication}
        medication={editingMedication}
      />
    </>
  );
}
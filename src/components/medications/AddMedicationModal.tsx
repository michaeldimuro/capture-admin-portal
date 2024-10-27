import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Medication } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    dosages: { strength: string; unit: string }[];
  }) => void;
  medication?: Medication | null;
}

export function AddMedicationModal({ isOpen, onClose, onSubmit, medication }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dosages, setDosages] = useState([{ strength: '', unit: 'mg' }]);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDescription(medication.description);
      setDosages(
        medication.dosages.map(d => ({
          strength: d.strength,
          unit: d.unit,
        }))
      );
    } else {
      setName('');
      setDescription('');
      setDosages([{ strength: '', unit: 'mg' }]);
    }
  }, [medication]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, dosages });
    onClose();
  };

  const addDosage = () => {
    setDosages([...dosages, { strength: '', unit: 'mg' }]);
  };

  const removeDosage = (index: number) => {
    setDosages(dosages.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {medication ? 'Edit Medication' : 'Add New Medication'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Dosages</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDosage}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Dosage
              </Button>
            </div>
            <div className="space-y-2">
              {dosages.map((dosage, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={dosage.strength}
                    onChange={(e) => {
                      const newDosages = [...dosages];
                      newDosages[index].strength = e.target.value;
                      setDosages(newDosages);
                    }}
                    placeholder="Strength"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                  <select
                    value={dosage.unit}
                    onChange={(e) => {
                      const newDosages = [...dosages];
                      newDosages[index].unit = e.target.value;
                      setDosages(newDosages);
                    }}
                    className="w-24 rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                  </select>
                  {dosages.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDosage(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {medication ? 'Save Changes' : 'Add Medication'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
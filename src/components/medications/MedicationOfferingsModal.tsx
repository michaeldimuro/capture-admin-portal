import { useState } from 'react';
import { X, DollarSign, Image } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Medication, Dosage } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication;
  onSubmit: (data: {
    medicationId: string;
    offerings: { dosageId: string; price: number }[];
  }) => void;
}

export function MedicationOfferingsModal({ isOpen, onClose, medication, onSubmit }: Props) {
  const [offerings, setOfferings] = useState<{ dosageId: string; price: number }[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      medicationId: medication.id,
      offerings: enabled ? offerings : [],
    });
    onClose();
  };

  const toggleDosage = (dosage: Dosage) => {
    const existing = offerings.find(o => o.dosageId === dosage.id);
    if (existing) {
      setOfferings(offerings.filter(o => o.dosageId !== dosage.id));
    } else {
      setOfferings([...offerings, { dosageId: dosage.id, price: 0 }]);
    }
  };

  const updatePrice = (dosageId: string, price: number) => {
    setOfferings(
      offerings.map(o =>
        o.dosageId === dosageId ? { ...o, price } : o
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage {medication.name} Offerings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Enable Medication</h3>
              <p className="text-sm text-gray-500">Make this medication available to patients</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {enabled && (
            <>
              <div className="space-y-4">
                <h3 className="font-medium">Dosage Pricing</h3>
                {medication.dosages.map((dosage) => (
                  <div key={dosage.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      checked={offerings.some(o => o.dosageId === dosage.id)}
                      onChange={() => toggleDosage(dosage)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1 font-medium">
                      {dosage.strength} {dosage.unit}
                    </span>
                    {offerings.some(o => o.dosageId === dosage.id) && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={offerings.find(o => o.dosageId === dosage.id)?.price || 0}
                          onChange={(e) => updatePrice(dosage.id, Number(e.target.value))}
                          className="w-24 rounded-md border border-gray-300 px-3 py-1"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Medication Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Medication"
                        className="max-h-48 mx-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Button type="button" variant="outline" size="sm">
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Search, DollarSign, Image, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MedicationOfferingsModal } from '../components/medications/MedicationOfferingsModal';
import { cn } from '../lib/utils';
import type { Medication } from '../types';

// Mock data for available medications (from super admin)
const availableMedications: Medication[] = [
  {
    id: '1',
    name: 'Ibuprofen',
    description: 'Pain relief medication',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
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
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200',
    dosages: [
      { id: 'd4', medicationId: '2', strength: '250', unit: 'mg' },
      { id: 'd5', medicationId: '2', strength: '500', unit: 'mg' },
    ],
  },
];

// Mock data for company offerings
const mockCompanyOfferings = new Map([
  ['1', {
    enabled: true,
    customImage: null,
    dosages: {
      'd1': { enabled: true, price: 9.99 },
      'd2': { enabled: true, price: 14.99 },
      'd3': { enabled: false, price: 0 },
    }
  }],
]);

export function MedicationOfferings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [offerings, setOfferings] = useState(mockCompanyOfferings);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const handleOfferingUpdate = (data: {
    medicationId: string;
    offerings: { dosageId: string; price: number }[];
  }) => {
    const newOfferings = new Map(offerings);
    if (data.offerings.length > 0) {
      newOfferings.set(data.medicationId, {
        enabled: true,
        customImage: null,
        dosages: Object.fromEntries(
          data.offerings.map(o => [o.dosageId, { enabled: true, price: o.price }])
        ),
      });
    } else {
      newOfferings.delete(data.medicationId);
    }
    setOfferings(newOfferings);
    setSelectedMedication(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medication Offerings</h2>
          <p className="mt-2 text-gray-600">Manage your available medications and pricing</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search available medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {availableMedications.map((medication) => {
              const offering = offerings.get(medication.id);
              const isSupported = !!offering;

              return (
                <div
                  key={medication.id}
                  className={cn(
                    "bg-white rounded-lg border-2 overflow-hidden transition-colors",
                    isSupported ? "border-blue-500" : "border-gray-200"
                  )}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{medication.name}</h3>
                        <p className="text-sm text-gray-600">{medication.description}</p>
                      </div>
                      <Button
                        variant={isSupported ? "outline" : "primary"}
                        size="sm"
                        onClick={() => setSelectedMedication(medication)}
                      >
                        {isSupported ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Manage Offering
                          </>
                        ) : (
                          'Add Offering'
                        )}
                      </Button>
                    </div>

                    {isSupported && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Enabled Dosages</h4>
                          <div className="space-y-2">
                            {Object.entries(offering.dosages)
                              .filter(([_, d]) => d.enabled)
                              .map(([dosageId, dosage]) => {
                                const dosageInfo = medication.dosages.find(d => d.id === dosageId);
                                return (
                                  <div
                                    key={dosageId}
                                    className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                                  >
                                    <span className="font-medium">
                                      {dosageInfo?.strength} {dosageInfo?.unit}
                                    </span>
                                    <span className="text-blue-600 font-medium">
                                      ${dosage.price.toFixed(2)}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Magic Link</h4>
                              <p className="text-sm text-gray-500">
                                Use this link on your website for patient intake
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `https://example.com/intake/${medication.id}`
                                );
                              }}
                            >
                              Copy Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {selectedMedication && (
        <MedicationOfferingsModal
          isOpen={true}
          onClose={() => setSelectedMedication(null)}
          medication={selectedMedication}
          onSubmit={handleOfferingUpdate}
        />
      )}
    </div>
  );
}
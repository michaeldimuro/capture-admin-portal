import { useState } from "react";
import { Edit2, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useCompanies } from "../../hooks/useCompanies";

interface IntegrationSettings {
  curexa: {
    clientKey?: string;
    clientSecret?: string;
  };
  mdi: {
    clientId: string;
    clientSecret: string;
  };
  stripe?: {
    publishableKey: string;
    secretKey: string;
  };
}

interface SettingsTabProps {
  companyId: string;
  apiKeys: IntegrationSettings;
}

export function CompanySettingsTab({ companyId, apiKeys }: SettingsTabProps) {
  const { setCompanyIntegrationConfigurations } = useCompanies();

  console.log("DEBUG >> apiKeys: ", apiKeys)

  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<IntegrationSettings>({
    curexa: {
      clientKey: apiKeys?.curexa?.clientKey || "",
      clientSecret: apiKeys?.curexa?.clientSecret || "",
    },
    mdi: {
      clientId: apiKeys?.mdi?.clientId || "",
      clientSecret: apiKeys?.mdi?.clientSecret || "",
    },
    stripe: {
      publishableKey: apiKeys?.stripe?.publishableKey || "",
      secretKey: apiKeys?.stripe?.secretKey || "",
    },
  });

  const handleSave = async () => {
    await setCompanyIntegrationConfigurations({id: companyId, payload: settings});

    setIsEditing(false);
  };

  const renderField = (
    label: string,
    value: string,
    field: string,
    section: keyof IntegrationSettings,
    subfield: string
  ) => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) =>
            setSettings({
              ...settings,
              [section]: {
                ...settings[section],
                [subfield]: e.target.value,
              },
            })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      );
    }

    return (
      <div className="mt-1 flex items-center">
        <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 w-full font-mono">
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Integration Settings
        </h3>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <div className="p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              Curexa Integration
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                {renderField(
                  "Client ID",
                  settings?.curexa?.clientKey ?? "",
                  "clientKey",
                  "curexa",
                  "clientKey"
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Secret
                </label>
                {renderField(
                  "Client Secret",
                  settings?.curexa?.clientSecret ?? "",
                  "clientSecret",
                  "curexa",
                  "clientSecret"
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              MD Integrations
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                {renderField(
                  "Client ID",
                  settings?.mdi?.clientId ?? "",
                  "clientId",
                  "mdi",
                  "clientId"
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Secret
                </label>
                {renderField(
                  "Client Secret",
                  settings?.mdi?.clientSecret ?? "",
                  "clientSecret",
                  "mdi",
                  "clientSecret"
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              Stripe Integration
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Publishable Key
                </label>
                {renderField(
                  "Publishable Key",
                  settings?.stripe?.publishableKey ?? "",
                  "publishableKey",
                  "stripe",
                  "publishableKey"
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secret Key
                </label>
                {renderField(
                  "Secret Key",
                  settings?.stripe?.secretKey ?? "",
                  "secretKey",
                  "stripe",
                  "secretKey"
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

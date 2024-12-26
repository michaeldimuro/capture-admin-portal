import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabTrigger, TabsContent } from "../components/ui/Tabs";
import { useCompany } from "../hooks/useCompany";
import { Card } from "../components/ui/Card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/Button";
import { OrdersTab } from '../components/tabs/OrdersTab';
import { OverviewTab } from '../components/tabs/OverviewTab';
import { CompanySettingsTab } from '../components/tabs/CompanySettingsTab';

export function CompanyDetails() {
  const { id } = useParams();
  const { data: company, isLoading, error } = useCompany(id!);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 text-center space-y-2">
          <div>
            <p>Failed to load company details</p>
            {error ? (
              <p className="text-sm">Error: {error.message}</p>
            ) : null}
          </div>
          <div>
            <Button className="bg-slate-900" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6 justify-between">
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-gray-500">Company ID: {company.id}</p>
        </div>
        <img
          src={company?.logo || "https://placehold.co/200x200/png"}
          alt={`${company.name} logo`}
          className="h-16"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">
              Total Patients
            </h3>
            <p className="text-3xl font-semibold mt-2">
              {company?.patientCount}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
            <p className="text-3xl font-semibold mt-2">
              {company?.activeOrdersCount}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Monthly Revenue
              </h3>
              <span
                className={cn(
                  "inline-flex items-center text-sm font-medium",
                  company?.revenue?.trend >= 0
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {company?.revenue?.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(company?.revenue?.trend) || "--"}%
              </span>
            </div>
            <p className="text-3xl font-semibold mt-2">
              ${company?.orderRevenue?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Previous: ${company?.revenue?.previous?.toLocaleString() || "--"}
            </p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="orders">Orders</TabTrigger>
          <TabTrigger value="patients">Patients</TabTrigger>
          <TabTrigger value="medications">Medications</TabTrigger>
          <TabTrigger value="settings">Settings</TabTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab company={company} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab companyId={company.id} />
        </TabsContent>

        <TabsContent value="patients">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-4">Patients</h3>
            <p className="text-gray-500">Patient management coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-4">Medications</h3>
            <p className="text-gray-500">Medication management coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <CompanySettingsTab companyId={company?.id} apiKeys={company?.configurations?.apiKeys} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
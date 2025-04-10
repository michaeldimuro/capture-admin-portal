import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabTrigger, TabsContent } from "../components/ui/Tabs";
import { useCompany } from "../hooks/useCompany";
import { Card } from "../components/ui/Card";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  ArrowLeft, 
  Building2, 
  Settings, 
  Pill,
  ClipboardList
} from "lucide-react";
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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 animate-pulse">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-xl shadow-sm">
          <div className="flex justify-center">
            <div className="bg-red-50 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load company details</h2>
            {error ? (
              <p className="text-gray-500 text-sm">Error: {error.message}</p>
            ) : null}
          </div>
          <div>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-2" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-gray-700 -ml-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
              <img
                src={company?.logo || "https://placehold.co/200x200/png"}
                alt={`${company.name} logo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 text-sm flex items-center">
                  <Building2 className="h-3.5 w-3.5 mr-1 opacity-70" />
                  ID: {company.id}
                </p>
              </div>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Manage Company
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow duration-200">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-md">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-800">
                  Total Patients
                </h3>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold text-gray-900">
              {company?.patientCount?.toLocaleString() || 0}
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow duration-200">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-2 rounded-md">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-medium text-emerald-800">
                  Active Orders
                </h3>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold text-gray-900">
              {company?.activeOrdersCount?.toLocaleString() || 0}
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow duration-200">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-md">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-medium text-amber-800">
                  Monthly Revenue
                </h3>
              </div>
              <span
                className={cn(
                  "inline-flex items-center text-sm font-medium px-2 py-1 rounded-full",
                  company?.revenue?.trend >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {company?.revenue?.trend >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                )}
                {Math.abs(company?.revenue?.trend) || 0}%
              </span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold text-gray-900">
              ${company?.orderRevenue?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Previous: ${company?.revenue?.previous?.toLocaleString() || 0}
            </p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white shadow-sm rounded-lg p-1 border border-gray-100">
          <TabTrigger value="overview" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Overview
          </TabTrigger>
          <TabTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabTrigger>
          <TabTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabTrigger>
          <TabTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medications
          </TabTrigger>
          <TabTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab company={company} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab companyId={company.id} />
        </TabsContent>

        <TabsContent value="patients">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Patients
            </h3>
            <p className="text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">Patient management coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-500" />
              Medications
            </h3>
            <p className="text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">Medication management coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <CompanySettingsTab companyId={company?.id} apiKeys={company?.configurations?.apiKeys} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
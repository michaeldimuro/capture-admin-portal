import React from "react";
import { useParams } from "react-router-dom";
import { useCompanyStore } from "../stores/companyStore";
import { Tabs, TabsList, TabTrigger, TabsContent } from "../components/ui/Tabs";

export function CompanyDetails() {
  const { id } = useParams();
  const { companies } = useCompanyStore();
  const company = companies.find(c => c.id === id);

  if (!company) {
    return <div className="p-6">Company not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={company.logo} 
          alt={`${company.name} logo`} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-gray-500">Company ID: {company.id}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="orders">Orders</TabTrigger>
          <TabTrigger value="patients">Patients</TabTrigger>
          <TabTrigger value="medications">Medications</TabTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Company Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Email:</span> {company.email}</p>
                <p><span className="text-gray-500">Phone:</span> {company.phone}</p>
                <p><span className="text-gray-500">Website:</span> {company.website}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Address</h3>
              <div className="space-y-2">
                <p>{company.address}</p>
                <p>{company.city}, {company.state} {company.zipCode}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Order History</h3>
            <p className="text-gray-500">No orders found.</p>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Patients</h3>
            <p className="text-gray-500">No patients found.</p>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Supported Medications</h3>
            <p className="text-gray-500">No medications found.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CompanyDetails;
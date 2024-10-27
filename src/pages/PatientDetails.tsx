import React from "react";
import { useParams } from "react-router-dom";
import { usePatientStore } from "../stores/patientStore";
import { Tabs, TabsList, TabTrigger, TabsContent } from "../components/ui/Tabs";

export function PatientDetails() {
  const { id } = useParams();
  const { patients } = usePatientStore();
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return <div className="p-6">Patient not found</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p className="text-gray-500">Patient ID: {patient.id}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="orders">Orders</TabTrigger>
          <TabTrigger value="prescriptions">Prescriptions</TabTrigger>
          <TabTrigger value="notes">Notes</TabTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-500">Date of Birth:</span> {patient.dateOfBirth}</p>
                <p><span className="text-gray-500">Email:</span> {patient.email}</p>
                <p><span className="text-gray-500">Phone:</span> {patient.phone}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-2">Address</h3>
              <div className="space-y-2">
                <p>{patient.address}</p>
                <p>{patient.city}, {patient.state} {patient.zipCode}</p>
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

        <TabsContent value="prescriptions" className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Prescriptions</h3>
            <p className="text-gray-500">No prescriptions found.</p>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Clinical Notes</h3>
            <p className="text-gray-500">No notes found.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PatientDetails;
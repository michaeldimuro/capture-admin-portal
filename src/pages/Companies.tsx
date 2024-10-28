import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreVertical } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { AddCompanyModal } from "../components/companies/AddCompanyModal";
import { useCompanies } from "../hooks/useCompanies";

export function Companies() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { companies, isLoading, error, createCompany, isCreating } =
    useCompanies();

  const filteredCompanies = companies?.filter((company: any) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompany = async (data: any) => {
    try {
      await createCompany(data);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to create company:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600">Failed to load companies</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Company
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Patients
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Active Orders
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies?.map((company: any) => (
                    <tr
                      key={company.id}
                      className="border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <span className="ml-4 font-medium">
                            {company.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{company.patientsCount}</td>
                      <td className="py-4 px-4">{company.activeOrders}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {company.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add dropdown menu for more actions
                          }}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCompany}
        isLoading={isCreating}
      />
    </>
  );
}

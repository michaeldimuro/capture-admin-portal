import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreVertical, User, ShoppingCart } from "lucide-react";
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Failed to load companies</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Companies</h2>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        <Card>
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block overflow-x-auto">
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
                            src={company?.logo || "https://placehold.co/200x200/png"}
                            alt={company.name}
                            className="h-10 w-10 rounded-full object-contain"
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
                            company?.isLive  && !company.isSuspended
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {company?.isLive && !company.isSuspended ? "Active" : "Inactive"}
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

            {/* Mobile view - Card list */}
            <div className="md:hidden space-y-4">
              {filteredCompanies?.map((company: any) => (
                <div
                  key={company.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/companies/${company.id}`)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={company?.logo || "https://placehold.co/200x200/png"}
                          alt={company.name}
                          className="h-10 w-10 rounded-full object-contain bg-gray-100"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{company.name}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
                              company?.isLive && !company.isSuspended
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {company?.isLive && !company.isSuspended ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add dropdown menu for more actions
                        }}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span className="text-sm text-gray-600">{company.patientsCount} Patients</span>
                      </div>
                      <div className="flex items-center">
                        <ShoppingCart className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span className="text-sm text-gray-600">{company.activeOrders} Orders</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export function OverviewTab({ company }: any) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-2">Company Information</h3>
        <div className="space-y-2">
          <p><span className="text-gray-500">Email:</span> {company?.email}</p>
          <p><span className="text-gray-500">Phone:</span> {company?.phoneNumber}</p>
          <p><span className="text-gray-500">Website:</span> {company?.website}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-2">Address</h3>
        <div className="space-y-2">
          {company?.streetAddress1 && company?.city && company?.state && company?.zipCode ? (
            <>
              <p>{company?.streetAddress1}</p>
              <p>{company?.city}, {company?.state} {company?.zipCode}</p>
            </>
          ) : (
            <p>No address</p>
          )}
          
        </div>
      </div>
    </div>
  );
} 
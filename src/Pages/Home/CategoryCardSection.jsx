import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import UseAxios from "../../hook/UseAxios";
import { useState } from "react";

const CategoryCardSection = () => {
  const axiosInstance = UseAxios();
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axiosInstance.get("/medicines");
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center my-10">Loading...</div>;

  return (
    <div className="my-10">
      {/* Dynamic Title */}
      <Helmet>
        <title>Featured Medicines | PharmaHub</title>
        <meta
          name="description"
          content="Explore our featured medicines collection"
        />
      </Helmet>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Featured Medicines
      </h2>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-6 lg:mx-12">
        {medicines.map((med) => (
          <div
            key={med._id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
          >
            <img
              src={med.MedicineImage || "/default-medicine.png"}
              alt={med.itemName}
              className="h-40 w-full object-contain mb-3"
            />
            <h3 className="font-semibold text-lg">{med.itemName}</h3>
            <p className="text-sm text-gray-600">{med.genericName}</p>
            <p className="text-gray-500">Category: {med.category}</p>
            <p className="text-gray-500">Company: {med.company}</p>
            <p className="mt-2 font-bold">{med.finalPrice} TK</p>

            {/* View Details Button */}
            <button
              onClick={() => setSelectedMedicine(med)}
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedMedicine && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>

            <img
              src={selectedMedicine.MedicineImage || "/default-medicine.png"}
              alt={selectedMedicine.itemName}
              className="h-48 w-full object-contain mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {selectedMedicine.itemName}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>Generic Name:</strong> {selectedMedicine.genericName}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Category:</strong> {selectedMedicine.category}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Company:</strong> {selectedMedicine.company}
            </p>
          
            <p className="text-gray-600 mb-1">
              <strong>Discount:</strong> {selectedMedicine.discount}%
            </p>
            <p className="text-gray-800 mt-3 text-lg font-semibold">
              Price: {selectedMedicine.finalPrice} TK
            </p>
             <p className="text-gray-600 mb-1">
              <strong>Description:</strong> {selectedMedicine.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCardSection;

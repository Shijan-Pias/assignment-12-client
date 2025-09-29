import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet"; // <-- react-helmet
import UseAxios from "../../hook/UseAxios";

const MedicineCardSection = () => {
  const axiosInstance = UseAxios();

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
        <title>Featured Medicines | YourAppName</title>
        <meta name="description" content="Explore our featured medicines collection" />
      </Helmet>

      <h2 className="text-2xl font-bold mb-6 text-center">Featured Medicines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-12">
        {medicines.map((med) => (
          <div key={med._id} className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
            <img
              src={med.MedicineImage || "/default-medicine.png"}
              alt={med.itemName}
              className="h-32 w-full object-contain mb-3"
            />
            <h3 className="font-semibold text-lg">{med.itemName}</h3>
            <p className="text-sm text-gray-600">{med.genericName}</p>
            <p className="text-gray-500">Category: {med.category}</p>
            <p className="text-gray-500">Company: {med.company}</p>
            <p className="mt-2 font-bold">{med.finalPrice} TK</p>
            <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineCardSection;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UseAuth from "../../../hook/UseAuth";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const ManageMedicines = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const queryClient = useQueryClient();

  const sellerEmail = user?.email;

  // Fetch seller medicines
  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["sellerMedicines", sellerEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/medicines?sellerEmail=${sellerEmail}`);
      return res.data;
    },
    enabled: !!sellerEmail,
  });

  // Delete medicine mutation
  const deleteMutation = useMutation({
    mutationFn: (medicineId) => axiosSecure.delete(`/medicines/${medicineId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["sellerMedicines", sellerEmail]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Medicine deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to delete",
      });
    },
  });

  const handleDelete = (medicineId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(medicineId);
      }
    });
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Medicines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No medicines found
          </div>
        )}

        {medicines.map((med) => (
          <div
            key={med._id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="font-semibold text-lg mb-1">{med.itemName}</h3>
              <p className="text-gray-600 mb-1">Generic: {med.genericName}</p>
              <p className="text-gray-600 mb-1">Category: {med.category}</p>
              <p className="text-gray-600 mb-1">Company: {med.company}</p>
              <p className="text-gray-600 mb-1">Unit: {med.massUnit}</p>
              <p className="text-gray-600 mb-1">
                Price: <span className="font-medium">{med.price} TK</span>
              </p>
              <p className="text-gray-600 mb-1">
                Final Price: <span className="font-medium">{med.finalPrice} TK</span>
              </p>
              <p className="text-gray-600">
                Discount: <span className="font-medium">{med.discount || 0}%</span>
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleDelete(med._id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMedicines;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useState } from "react";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";

const ManageMedicines = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [saving, setSaving] = useState(false);

  const axiosInstance = UseAxiosSecure();

  // Fetch all medicines
  const { data: medicines = [], isLoading, isError } = useQuery({
    queryKey: ["allMedicines"],
    queryFn: async () => {
      const res = await axiosInstance.get("/medicines");
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/medicines/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allMedicines"]);
      Swal.fire("Deleted!", "Medicine deleted successfully.", "success");
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Failed to delete", "error");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      setSaving(true);
      const res = await axiosInstance.patch(`/medicines/${id}`, data);
      setSaving(false);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allMedicines"]);
      Swal.fire("Updated!", "Medicine updated successfully.", "success");
      setModalOpen(false);
      setCurrentMedicine(null);
    },
    onError: (err) => {
      setSaving(false);
      Swal.fire("Error", err.response?.data?.message || "Failed to update", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleEdit = (med) => {
    setCurrentMedicine(med);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentMedicine) return;

    const form = e.target;
    const updatedData = {
      itemName: form.itemName.value,
      genericName: form.genericName.value,
      category: form.category.value,
      company: form.company.value,
      massUnit: form.massUnit.value,
      price: Number(form.price.value) || 0,
      finalPrice: Number(form.finalPrice.value) || 0,
      discount: Number(form.discount.value) || 0,
    };

    updateMutation.mutate({ id: currentMedicine._id, data: updatedData });
  };

  if (isLoading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (isError) return <div className="text-center mt-10 text-red-400">Failed to load medicines</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Manage Medicines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.length === 0 && (
          <div className="col-span-full text-center text-gray-400">No medicines found</div>
        )}

        {medicines.map((med) => (
          <div
            key={med._id}
            className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="font-semibold text-lg mb-1 text-white">{med.itemName}</h3>
              <p className="text-gray-300 mb-1">Generic: {med.genericName}</p>
              <p className="text-gray-300 mb-1">Category: {med.category}</p>
              <p className="text-gray-300 mb-1">Company: {med.company}</p>
              <p className="text-gray-300 mb-1">Unit: {med.massUnit}</p>
              <p className="text-gray-300 mb-1">
                Price: <span className="font-medium text-white">{med.price} TK</span>
              </p>
              <p className="text-gray-300 mb-1">
                Final Price: <span className="font-medium text-white">{med.finalPrice} TK</span>
              </p>
              <p className="text-gray-300">
                Discount: <span className="font-medium text-white">{med.discount || 0}%</span>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(med)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(med._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && currentMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <form
            onSubmit={handleSave}
            className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg space-y-3 text-gray-200"
          >
            <h3 className="text-xl font-bold mb-2 text-white">Edit Medicine</h3>
             <h3 className="font-semibold text-lg mb-1 text-white">itemName : </h3>
            <input
              name="itemName"
              defaultValue={currentMedicine.itemName}
              placeholder="Name"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <p className="text-gray-300 mb-1">Generic: </p>
            <input
              name="genericName"
              defaultValue={currentMedicine.genericName}
              placeholder="Generic"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <p className="text-gray-300 mb-1">Category :</p>
            <input
              name="category"
              defaultValue={currentMedicine.category}
              placeholder="Category"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <input
              name="company"
              defaultValue={currentMedicine.company}
              placeholder="Company"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <input
              name="massUnit"
              defaultValue={currentMedicine.massUnit}
              placeholder="Unit (Mg/Ml)"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <input
              name="price"
              defaultValue={currentMedicine.price}
              type="number"
              placeholder="Price"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <input
              name="finalPrice"
              defaultValue={currentMedicine.finalPrice}
              type="number"
              placeholder="Final Price"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />
            <input
              name="discount"
              defaultValue={currentMedicine.discount || 0}
              type="number"
              placeholder="Discount (%)"
              className="w-full border border-gray-600 bg-gray-700 px-2 py-1 rounded text-gray-200"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                onClick={() => {
                  setModalOpen(false);
                  setCurrentMedicine(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageMedicines;

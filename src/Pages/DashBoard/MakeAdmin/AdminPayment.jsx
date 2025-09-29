import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";


import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import { useState } from "react";

const AdminPayments = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data.data;
    },
  });

  // Accept payment mutation
  const acceptMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/payments/${id}/accept`);
      return res.data;
    },
    onMutate: (id) => setLoadingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setLoadingId(null);
    },
    onError: () => setLoadingId(null),
  });

  const handleAccept = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Accept this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptMutation.mutate(id);
        Swal.fire("Accepted!", "Payment status updated.", "success");
      }
    });
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Payment Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">User Email</th>
              <th className="border px-4 py-2">Seller Email</th>
              <th className="border px-4 py-2">Medicine ID</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="border px-4 py-2">{p.finalEmail}</td>
                <td className="border px-4 py-2">{p.sellerEmail}</td>
                <td className="border px-4 py-2">{p.medicineId}</td>
                <td className="border px-4 py-2">{p.priceTk}</td>
                <td
                  className={`border px-4 py-2 font-semibold ${
                    p.status === "pending" ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {p.status}
                </td>
                <td className="border px-4 py-2">
                  {p.status === "pending" && (
                    <button
                      disabled={loadingId === p._id}
                      onClick={() => handleAccept(p._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {loadingId === p._id ? "Processing..." : "Accept"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;

// import { useQuery } from "@tanstack/react-query";
// import UseAxiosSecure from "../hook/UseAxiosSecure";
// import UseAuth from "../hook/UseAuth";

import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../../hook/UseAuth";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";

const SellerPaymentHistory = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ["sellerPayments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/seller/${user.email}`);
      return res.data.data; // কারণ backend-এ { success, count, data } return করছি
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p>Loading payment history...</p>;
  if (error) return <p className="text-red-500">Failed to load payments</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Payment History</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr className="text-black">
              <th className="px-4 py-2">Buyer</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-4 py-2">{p.finalEmail}</td>
                <td className="px-4 py-2">{p.priceTk} Tk</td>
                <td className="px-4 py-2">{p.transactionId}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerPaymentHistory;

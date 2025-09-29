
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../hook/UseAuth";
import UseAxiosSecure from "../../hook/UseAxiosSecure";

const PaymentHistory = () => {
    const {user} =UseAuth();

    const axiosSecure = UseAxiosSecure();
    const {isLoading , data : payments = []} = useQuery({
        queryKey : ['payments',user.email],
        queryFn: async () =>{
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data.data;
        }
    })

    if(isLoading){
        return '...loading'
    }
    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 ">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2"> ID</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
            
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay, index) => (
              <tr key={pay._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{pay._id}</td>
                <td className="border border-gray-300 px-4 py-2">${pay.priceTk}</td>
                <td className="border border-gray-300 px-4 py-2">{pay.transactionId}</td>
                
                
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(pay.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
};

export default PaymentHistory;